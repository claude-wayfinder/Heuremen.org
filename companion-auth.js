/**
 * companion-auth.js — Account, trial, and billing for The Companion
 *
 * Supabase Auth (magic link) + Stripe payment link.
 * 30-day free trial, no credit card. $4.99/mo after.
 * Usage tracking per API call.
 *
 * Drop into companion.html or memoryrx.html.
 * Requires Supabase JS SDK loaded first.
 */

var CompanionAuth = (function() {

  // ── Config ────────────────────────────────────────────────
  var SUPABASE_URL = 'https://vxyjvawenbtgkhpckvze.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eWp2YXdlbmJ0Z2tocGNrdnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzc5MzEsImV4cCI6MjA4OTg1MzkzMX0.phpYjIUM1ht4N1abTY19XLgi1axcANj04kmeOleGpLU';
  var STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/5kQbIU2lM2QU9bH8c1aAw03';
  var TRIAL_DAYS = 30;

  var supabase = null;
  var currentUser = null;
  var currentAccount = null;

  // ── Init Supabase ─────────────────────────────────────────
  function initSupabase() {
    if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
      console.warn('[auth] Supabase SDK not loaded');
      return false;
    }
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Listen for auth changes
    supabase.auth.onAuthStateChange(function(event, session) {
      if (session && session.user) {
        currentUser = session.user;
        loadAccount();
      } else {
        currentUser = null;
        currentAccount = null;
        updateUI();
      }
    });

    // Handle magic link redirect (hash fragment contains tokens)
    if (window.location.hash && window.location.hash.includes('access_token')) {
      // Supabase SDK should pick this up automatically, but force a session check after a beat
      setTimeout(function() {
        supabase.auth.getSession().then(function(result) {
          if (result.data.session) {
            currentUser = result.data.session.user;
            loadAccount();
            // Clean the URL hash
            history.replaceState(null, '', window.location.pathname);
          }
        });
      }, 500);
    }

    // Check existing session
    supabase.auth.getSession().then(function(result) {
      if (result.data.session) {
        currentUser = result.data.session.user;
        loadAccount();
      } else {
        updateUI();
      }
    });

    return true;
  }

  // ── Sign up / Sign in (magic link) ────────────────────────
  async function signIn(email) {
    if (!supabase) return { error: 'Not initialized' };

    var result = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: window.location.origin + window.location.pathname
      }
    });

    if (result.error) return { error: result.error.message };
    return { success: true, message: 'Check your email for the magic link!' };
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    currentUser = null;
    currentAccount = null;
    updateUI();
  }

  // ── Account management ────────────────────────────────────
  async function loadAccount() {
    if (!currentUser) return;

    var result = await supabase
      .from('companion_accounts')
      .select('*')
      .eq('id', currentUser.id)
      .single();

    if (result.data) {
      currentAccount = result.data;
    } else {
      // First sign-in — create account with trial
      var now = new Date();
      var trialEnd = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

      var insert = await supabase
        .from('companion_accounts')
        .insert({
          id: currentUser.id,
          email: currentUser.email,
          tier: 'trial',
          trial_started_at: now.toISOString(),
          trial_ends_at: trialEnd.toISOString()
        })
        .select()
        .single();

      currentAccount = insert.data;
    }

    // Sync soul file from localStorage to cloud
    syncSoulToCloud();
    updateUI();
  }

  // ── Trial / subscription status ───────────────────────────
  function getStatus() {
    if (!currentAccount) return { tier: 'anonymous', canUse: true };

    var now = new Date();
    var trialEnd = new Date(currentAccount.trial_ends_at);
    var tier = currentAccount.tier;

    if (tier === 'paid' && currentAccount.subscription_status === 'active') {
      return { tier: 'paid', canUse: true, label: 'Pro' };
    }

    if (tier === 'trial') {
      var daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
      if (daysLeft > 0) {
        return { tier: 'trial', canUse: true, daysLeft: daysLeft, label: daysLeft + 'd left' };
      } else {
        return { tier: 'expired', canUse: false, label: 'Trial ended' };
      }
    }

    if (tier === 'cancelled') {
      return { tier: 'cancelled', canUse: false, label: 'Cancelled' };
    }

    return { tier: 'free', canUse: true, label: 'Free' };
  }

  // ── Cloud sync ────────────────────────────────────────────
  async function syncSoulToCloud() {
    if (!currentUser || !supabase) return;
    try {
      var soul = JSON.parse(localStorage.getItem('soul') || 'null');
      if (soul) {
        await supabase
          .from('companion_accounts')
          .update({ soul_file: soul, updated_at: new Date().toISOString() })
          .eq('id', currentUser.id);
      }
    } catch(e) {}
  }

  async function syncSessionToCloud(turns, mood, topics) {
    if (!currentUser || !supabase) return;
    try {
      await supabase
        .from('companion_user_sessions')
        .insert({
          user_id: currentUser.id,
          turns: turns,
          mood: mood,
          topic_tags: topics || []
        });
    } catch(e) {}
  }

  // ── Usage tracking ────────────────────────────────────────
  async function trackUsage(endpoint, model, inputTokens, outputTokens) {
    if (!supabase) return;

    // Estimate cost (rough: $3/M input, $15/M output for Sonnet)
    var costCents = 0;
    if (model && model.includes('claude')) {
      costCents = (inputTokens || 0) / 1000000 * 300 + (outputTokens || 0) / 1000000 * 1500;
    }

    try {
      await supabase
        .from('companion_usage')
        .insert({
          user_id: currentUser ? currentUser.id : null,
          anonymous_id: currentUser ? null : getAnonymousId(),
          endpoint: endpoint,
          model: model,
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          estimated_cost_cents: Math.round(costCents * 100) / 100
        });
    } catch(e) {}
  }

  function getAnonymousId() {
    var id = localStorage.getItem('companion_anon_id');
    if (!id) {
      id = 'anon_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      localStorage.setItem('companion_anon_id', id);
    }
    return id;
  }

  // ── UI ────────────────────────────────────────────────────
  var authContainer = null;

  function createUI() {
    var container = document.createElement('div');
    container.id = 'companion-auth';
    container.style.cssText = 'position:fixed;top:10px;left:10px;z-index:100;font-family:"IBM Plex Mono",monospace;font-size:0.55rem;letter-spacing:0.1em';

    // Auth button
    var btn = document.createElement('button');
    btn.id = 'auth-btn';
    btn.style.cssText = 'padding:6px 14px;border:1px solid rgba(255,255,255,0.12);border-radius:16px;background:rgba(255,255,255,0.03);color:rgba(255,255,255,0.3);cursor:pointer;transition:all 0.3s;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);text-transform:uppercase;font-family:inherit;font-size:inherit;letter-spacing:inherit';
    btn.textContent = 'sign in';
    btn.addEventListener('click', toggleAuthModal);
    container.appendChild(btn);

    authContainer = container;
    document.body.appendChild(container);

    // Auth modal (hidden)
    var modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.style.cssText = 'display:none;position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);flex-direction:column;align-items:center;justify-content:center;font-family:"IBM Plex Mono",monospace';
    modal.innerHTML = [
      '<div style="max-width:320px;width:90%;text-align:center">',
      '<div style="font-family:\'Abril Fatface\',serif;font-size:1.4rem;color:#e8e0d0;margin-bottom:8px">The Companion</div>',
      '<div style="font-size:0.6rem;color:rgba(255,255,255,0.2);letter-spacing:0.2em;text-transform:uppercase;margin-bottom:32px">30 days free. no credit card.</div>',
      '<input type="email" id="auth-email" placeholder="your email" style="width:100%;padding:14px 18px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:#e8e0d0;font-family:\'Lora\',serif;font-size:16px;border-radius:24px;outline:none;text-align:center;margin-bottom:16px;box-sizing:border-box">',
      '<button id="auth-submit" style="width:100%;padding:12px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:rgba(255,255,255,0.5);border-radius:24px;cursor:pointer;font-family:\'IBM Plex Mono\',monospace;font-size:0.7rem;letter-spacing:0.15em;text-transform:uppercase;transition:all 0.3s">send magic link</button>',
      '<div id="auth-message" style="margin-top:16px;font-size:0.6rem;color:rgba(255,255,255,0.3);min-height:20px"></div>',
      '<div id="auth-account-info" style="display:none;margin-top:20px;padding:16px;border:1px solid rgba(255,255,255,0.06);border-radius:12px;text-align:left;font-size:0.6rem;color:rgba(255,255,255,0.3)"></div>',
      '<div style="margin-top:24px;font-size:0.5rem;color:rgba(255,255,255,0.12);cursor:pointer" onclick="document.getElementById(\'auth-modal\').style.display=\'none\'">close</div>',
      '</div>'
    ].join('');
    document.body.appendChild(modal);

    // Wire submit
    document.getElementById('auth-submit').addEventListener('click', async function() {
      var email = document.getElementById('auth-email').value.trim();
      var msg = document.getElementById('auth-message');
      if (!email || !email.includes('@')) {
        msg.textContent = 'enter a valid email';
        msg.style.color = 'rgba(196,60,42,0.6)';
        return;
      }
      msg.textContent = 'sending...';
      msg.style.color = 'rgba(255,255,255,0.3)';
      var result = await signIn(email);
      if (result.error) {
        msg.textContent = result.error;
        msg.style.color = 'rgba(196,60,42,0.6)';
      } else {
        msg.textContent = 'check your email for the magic link!';
        msg.style.color = 'rgba(91,160,200,0.7)';
      }
    });

    // Enter key on email input
    document.getElementById('auth-email').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') document.getElementById('auth-submit').click();
    });
  }

  function toggleAuthModal() {
    var modal = document.getElementById('auth-modal');
    if (modal.style.display === 'flex') {
      modal.style.display = 'none';
    } else {
      modal.style.display = 'flex';
      updateModalContent();
      if (!currentUser) document.getElementById('auth-email').focus();
    }
  }

  function updateModalContent() {
    var emailInput = document.getElementById('auth-email');
    var submitBtn = document.getElementById('auth-submit');
    var accountInfo = document.getElementById('auth-account-info');
    var msg = document.getElementById('auth-message');

    if (currentUser && currentAccount) {
      emailInput.style.display = 'none';
      var status = getStatus();

      var info = '<div style="margin-bottom:8px;color:rgba(255,255,255,0.5)">' + currentUser.email + '</div>';
      info += '<div style="margin-bottom:12px">Status: <span style="color:rgba(91,160,200,0.8)">' + status.label + '</span></div>';

      if (status.tier === 'trial') {
        info += '<div style="margin-bottom:12px">Trial: ' + status.daysLeft + ' days remaining</div>';
      }

      if (status.tier === 'expired' || status.tier === 'cancelled') {
        info += '<a href="' + STRIPE_PAYMENT_LINK + '" target="_blank" style="display:inline-block;padding:10px 20px;border:1px solid rgba(200,168,78,0.4);border-radius:20px;color:rgba(200,168,78,0.8);text-decoration:none;font-size:0.65rem;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:12px">subscribe — $4.99/mo</a>';
      }

      submitBtn.textContent = 'sign out';
      submitBtn.onclick = function() { signOut(); document.getElementById('auth-modal').style.display = 'none'; };
      accountInfo.innerHTML = info;
      accountInfo.style.display = 'block';
      msg.textContent = '';
    } else {
      emailInput.style.display = 'block';
      submitBtn.textContent = 'send magic link';
      submitBtn.onclick = function() { document.getElementById('auth-submit').click(); };
      accountInfo.style.display = 'none';
    }
  }

  function updateUI() {
    var btn = document.getElementById('auth-btn');
    if (!btn) return;

    if (currentUser && currentAccount) {
      var status = getStatus();
      btn.textContent = status.label || 'account';
      btn.style.borderColor = 'rgba(91,160,200,0.3)';
      btn.style.color = 'rgba(91,160,200,0.6)';
    } else {
      btn.textContent = 'sign in';
      btn.style.borderColor = 'rgba(255,255,255,0.12)';
      btn.style.color = 'rgba(255,255,255,0.3)';
    }
  }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    createUI();
    // Wait for Supabase SDK to load
    if (typeof window.supabase !== 'undefined') {
      initSupabase();
    } else {
      // Retry after SDK loads
      var check = setInterval(function() {
        if (typeof window.supabase !== 'undefined') {
          clearInterval(check);
          initSupabase();
        }
      }, 200);
      // Give up after 5s
      setTimeout(function() { clearInterval(check); }, 5000);
    }
  }

  // ── Public API ────────────────────────────────────────────
  return {
    init: init,
    signIn: signIn,
    signOut: signOut,
    getStatus: getStatus,
    trackUsage: trackUsage,
    syncSessionToCloud: syncSessionToCloud,
    getUser: function() { return currentUser; },
    getAccount: function() { return currentAccount; },
    isSignedIn: function() { return !!currentUser; },
    isPaid: function() { var s = getStatus(); return s.tier === 'paid'; },
    canUse: function() { var s = getStatus(); return s.canUse; },
    STRIPE_LINK: STRIPE_PAYMENT_LINK
  };

})();
