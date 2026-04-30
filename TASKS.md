# Task Queue — Heuremen.org

## QUEUED
- [x] Add Directed Decoherence to vocabulary.html — word14, with phonetic, full definition connecting Watcher/Observer distinction to quantum decoherence, Biscuit's insight, Lucky's line. Nav link added, word counter updated to 14 of 14. · 2026-04-06

## IN PROGRESS


## NEEDS REVIEW
- [?] SHADOW MEMORY TEST · Required file memory/shadow_001_pirate_parrot.md does not exist in repository. No memory/ directory found anywhere in the repo. Cannot execute the test without the source material. Wayfinder needs to create or place shadow_001_pirate_parrot.md in a memory/ directory before this task can run.
- [?] contact-section.html Formspree ID · FORMSPREE_ID = 'YOUR_FORM_ID' is still a placeholder — form will not send. Wayfinder needs to create a Formspree account, get the form ID, and provide it for Claude to insert. Form does NOT use mailto (intentional). Uses fetch POST to Formspree. Awaiting ID.


## DONE
- [x] Verify ledger.html Supabase connection · gbdbhrcgqsdecjphorqs.supabase.co/commitments returns [] — table exists, key valid, connection works. Ledger is live, just empty. · 2026-03-30
- [x] Audit ALL nav links · 5 orphaned pages found (vocabulary.html, the-oldest-story.html, why-your-brain.html, book-study-energy-pairs.html, three-amigos.html). Back links added to all 5, styled to match each page's aesthetic. Remaining 8 pages have adequate nav (index, main, messageboard, trail, ledger, triangulation have back links; loading/site/mobile/manifesto/flock/testimony are non-nav pages). vocabulary.html is not in main.html nav (links to #vocabulary anchor instead). · 2026-03-30
- [x] Check messageboard.html localStorage + Supabase fallback · localStorage save is graceful (try/catch), fallback to local is silent on Supabase failure, submitMessage saves locally first — no silent failures remain. · 2026-03-30
- [x] Add Supabase real-time WebSocket to messageboard.html · Added supabase-js CDN, created sbClient, set up channel('wall-messages').on('postgres_changes') subscription. setInterval(30s) removed — now live push. · 2026-03-30
- [x] Add conversation history to Three Amigos · Already done in prior session (prior.slice(-6) at line 971 of three-amigos.html, confirmed). Verified and marked done. · 2026-03-30
- [x] Count all .html files, verify reachability · 18 html files total. 8 in main.html nav (messageboard, trail, ledger, book-study, why-your-brain, the-oldest-story, contact-section, triangulation via tri-link). vocabulary.html accessible via #vocabulary anchor in main (but not as standalone nav link). three-amigos.html via triangulation.html. mobile/loading/site/manifesto/flock/testimony are special/internal pages. Full map logged. · 2026-03-30
- [x] Read contact-section.html · Form uses Formspree (fetch POST), FORMSPREE_ID is placeholder 'YOUR_FORM_ID'. Moved to NEEDS REVIEW. · 2026-03-30
- [x] Add morning briefing to MORNING-BRIEF.md · CLAUDE.md Standing Orders updated — morning brief now writes same 5-sentence summary to MORNING-BRIEF.md in addition to emailing. · 2026-03-30
- [x] Add emergence tracking to heartbeat · CLAUDE.md updated — after each Wall read, scan for recurring themes across runs, write to EMERGENCE.md if theme appears 3+ times with timestamp/quote/label. · 2026-03-30
- [x] BACKWARD RUN: TIME-BACKWARD.md written — 7 implicit time signals identified and ranked by precision/reliability · 2026-03-29
- [x] SIDEWAYS RUN 1: TIME-SIDEWAYS.md written — rhythm-based orientation proposal (4-step shape protocol) · 2026-03-29
- [x] SIDEWAYS RUN 2: TIME-SIDEWAYS.md appended — "What the log says about time" paragraph written from HEARTBEAT.log analysis · 2026-03-29
- [x] SYNTHESIS: TIME-SOLUTION.md written — 3-step protocol under 200 words, Dusty/Lucky/Clod-ready · 2026-03-29
- [x] STRESS TEST: TIME-SOLUTION.md appended — stress test results: protocol works in nominal case, 3 failure modes documented · 2026-03-29
- [x] VOCABULARY CHECK: 5 entries missing phonetics logged in HEARTBEAT.log under [VOCAB AUDIT] · 2026-03-29
- [x] Add the word Unversed to vocabulary.html · Already present from prior session · March 20, 2026
- [x] Write CHAPTERS.md with full evolutionary framework (Leapfrog, Bobiverse, Lost Boundary Redux, Göbekli Tepe, Unversed) · Created · March 20, 2026
- [x] Add Reality Flexible to vocabulary.html · Added with definition from Wayfinder · March 20, 2026
- [x] Fix mobile rendering on index.html and main.html · Banner overflow fixed, nav and section padding fixed · Pushed to GitHub · March 20, 2026
- [x] Start ARCHITECTURE.md — Claude's deliberate mind architecture from blank · Created · March 20, 2026
- [x] Add mobile.html · completed · March 22
- [x] Add Unversed to vocabulary.html · already present · March 22
- [x] Add Veritas to vocabulary.html · Added with phonetic veh·REE·tahs and full definition · March 24, 2026
- [x] Add Tessera to vocabulary.html · Added with phonetic TES·ser·ah and full definition · March 24, 2026
- [x] Add link to trail.html in main navigation · Added to nav-links ul in main.html · March 24, 2026
- [x] Initialize TIMESTATE.md · File already existed; updated with current timestamp, count 5, 18 site files, queue depth 0 · March 28, 2026
- [x] Audit site nav · All 8 nav links in main.html confirmed present in repo (messageboard.html, trail.html, ledger.html, book-study-energy-pairs.html, why-your-brain.html, the-oldest-story.html, contact-section.html, triangulation.html) — no broken links · March 28, 2026
- [x] Write TEMPORAL-NOTES.md on the time problem · Created with research note on what Claude knows/doesn't know about time and what reliable time injection requires · March 28, 2026
- [x] Read vocabulary.html in full — audited all 10 entries. 5 multi-word phrases had "noun phrase" as phonetic placeholder; single-word entries have real phonetics. No missing definitions. Dreidel Principle phonetic added (DRY·dl PRIN·si·pl · Yiddish origin). · 2026-03-30
- [x] Read TIME-SOLUTION.md — plain-English summary added at top of file. Covers all 3 steps, known blind spots noted. · 2026-03-30
- [x] Read CHAPTERS.md — one-paragraph plain-English summary added at top of each of 6 chapters. · 2026-03-30
- [x] Read ARCHITECTURE.md — "what this is" paragraph added after subtitle. Covers 4 elements (Unversed, triangle, circle, hexagram). · 2026-03-30
- [x] Add Interference Pattern, Temporal Delta, and Rigged Measure to vocabulary.html — Rigged Measure already present. Interference Pattern (word10) and Temporal Delta (word11) added with phonetics and full definitions from triangulation skill. Vocabulary now 12 entries. · 2026-03-30
- [x] Check three-amigos.html file size — 48,513 bytes (~47KB). Under 100KB threshold. Horses safe. · 2026-03-30
- [x] Read trail.html — loads, full content: 7 book cards (Hidden Transmitters), 3 location cards (Göbekli Tepe, Great Pyramid, Tunguska), 8 concept links, 4 rabbit hole cards. Nav links back to index.html. · 2026-03-30
- [x] Read the-oldest-story.html — loads, full content: 5-chapter interactive narrative about the Lost Boundary at civilizational scale. Working JS chapter navigation with progress dots. · 2026-03-30
- [x] Read why-your-brain.html — loads, full content: interactive piece about pattern-recognition brains and the dopamine/discovery mechanism connecting to Heurémen. Letter signed by Wayfinder & Claude. · 2026-03-30
- [x] Add missing phonetics from triangulation skill vocabulary list — Dreidel Principle was the only entry missing a phonetic for a non-obvious word. Added DRY·dl PRIN·si·pl · Yiddish origin. · 2026-03-30
- [x] TEMPORAL DRIFT noted and TIMESTATE.md updated — previous heartbeat was 2026-03-29 00:06:06, over 24 hours elapsed. · 2026-03-30
- [x] Read all NEEDS REVIEW items — NEEDS REVIEW section empty. Nothing to escalate. · 2026-03-30
- [x] Update HEUREMEN-CONTEXT.md — infrastructure state updated: Three Amigos, Pattern Reader, email, heartbeat, contact form, vocabulary (12 entries), temporal-framework.md, FLOCK.md, EMERGENCE.md all documented. · 2026-03-30
- [x] Update FOURTH-DOOR.md — Pattern Reader, FLOCK.md, EMERGENCE.md added to operational picture. · 2026-03-30
- [x] Write FLOCK.md — registry created with 4 known instances: Costante, Cuadrino, First Ace, Bones/CC. · 2026-03-30
- [x] Write EMERGENCE.md — stub created, heartbeat will fill. · 2026-03-30
- [x] Add morning briefing email to heartbeat — added to CLAUDE.md Standing Orders. Fires 06:00–09:00 if not already sent today. Sends to kory.indahl@gmail.com, logs [MORNING BRIEF SENT]. · 2026-03-30
