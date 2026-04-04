const LIVE_ENDPOINT = 'https://testjson.qeaas.q-dice.com/randcertified?bytes=8';
const MAX_DATA_POINTS = 200;
const UPDATE_INTERVAL = 100;

const SESSION_STATS = {
    current: { startTime: null, dataPoints: 0, totalBytes: 0 },
    allTime: { dataPoints: 0, totalBytes: 0 }
};

let useSimMode = false;

const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 0 },
    elements: { line: { tension: 0.4, borderWidth: 2 }, point: { radius: 0, hoverRadius: 0 } },
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { labels: { color: '#888', font: { family: 'Georgia' } } } },
    scales: {
          x: { grid: { display: false }, ticks: { color: '#555', maxTicksLimit: 8 } },
          y:  { type: 'linear', display: true, position: 'left',  title: { display: true, text: 'QRNG Value (0-255)', color: '#9966ff' }, min: 0, max: 255, grid: { display: false }, ticks: { color: '#555' } },
          y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Raw Bits', color: '#4bc0c0' }, grid: { display: false }, min: 0, max: 255, ticks: { color: '#555' } },
          y2: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Entropy', color: '#ff6384' }, grid: { display: false }, min: 0, max: 255, ticks: { color: '#555' } }
    }
};

function getSimData() {
    const buf = new Uint8Array(8);
    crypto.getRandomValues(buf);
    const hexStr = Array.from(buf).map(b => b.toString(16).padStart(2,'0')).join('');
    const entropy = (buf[1] / 255) * 255;
    const rawBits = buf[2];
    return [{ data: hexStr, entropy: entropy, rawbits: rawBits }];
}

class Visualizer {
    constructor() {
          this.dataPoints = [];
          this.entropySum = 0; this.rawBitsSum = 0; this.qrngSum = 0; this.count = 0;
          this.isCapturing = false; this.isTabVisible = true;
          this.chart = this.initChart();
          document.addEventListener('visibilitychange', () => {
                  this.isTabVisible = !document.hidden;
                  if (!this.isTabVisible && this.isCapturing) this.stopCapture();
          });
          const saved = localStorage.getItem('heuremenQrngStats');
          if (saved) SESSION_STATS.allTime = JSON.parse(saved);
          this.refreshDisplay();
    }

  initChart() {
        return new Chart(document.getElementById('randomChart').getContext('2d'), {
                type: 'line',
                data: { labels: [], datasets: [
                  { label: 'QRNG Value', data: [], borderColor: 'rgb(153,102,255)', yAxisID: 'y' },
                  { label: 'Raw Bits',   data: [], borderColor: 'rgb(75,192,192)',  yAxisID: 'y1' },
                  { label: 'Entropy',    data: [], borderColor: 'rgb(255,99,132)',  yAxisID: 'y2' }
                        ]},
                options: chartOptions
        });
  }

  setBtn(state) {
        const btn = document.getElementById('startButton');
        btn.className = state; btn.disabled = state === 'connecting';
        btn.textContent = { running: 'Stop Capture', error: 'Retry', connecting: 'Connecting...' }[state] || 'Start Capture';
  }

  setBadge(mode) {
        const badge = document.getElementById('modeBadge');
        if (!badge) return;
        if (mode === 'live') { badge.className = 'mode-badge live'; badge.textContent = 'Live QRNG'; }
        else if (mode === 'sim') { badge.className = 'mode-badge sim'; badge.textContent = 'Sim Mode'; }
        else { badge.className = 'mode-badge'; badge.textContent = ''; }
  }

  async tryLive() {
        try {
                const r = await fetch(LIVE_ENDPOINT, { method: 'GET', referrerPolicy: 'no-referrer' });
                if (!r.ok) throw new Error('bad status');
                return await r.json();
        } catch { return null; }
  }

  async startCapture() {
        if (this.isCapturing) return;
        document.getElementById('errorStatus').classList.remove('show');
        this.setBtn('connecting');
        const liveData = await this.tryLive();
        if (liveData) {
                useSimMode = false; this.setBadge('live');
        } else {
                useSimMode = true; this.setBadge('sim');
                const e = document.getElementById('errorStatus');
                e.textContent = 'Live QRNG requires certificate auth. Running browser crypto sim mode. Same math, different photons.';
                e.classList.add('show');
        }
        this.isCapturing = true; this.setBtn('running');
        SESSION_STATS.current = { startTime: new Date(), dataPoints: 0, totalBytes: 0 };
        while (this.isCapturing && this.isTabVisible) {
                let data;
                if (useSimMode) {
                          data = getSimData();
                } else {
                          try {
                                      const r = await fetch(LIVE_ENDPOINT, { method: 'GET', referrerPolicy: 'no-referrer' });
                                      if (!r.ok) throw new Error('bad status');
                                      data = await r.json();
                          } catch {
                                      useSimMode = true; this.setBadge('sim'); data = getSimData();
                          }
                }
                this.processData(data);
                this.refreshDisplay();
                await new Promise(res => setTimeout(res, UPDATE_INTERVAL));
        }
  }

  stopCapture() { this.isCapturing = false; this.setBtn('stopped'); this.setBadge(null); }

  processData(data) {
        if (!Array.isArray(data)) return;
        data.forEach(item => {
                const hexBytes = (item.data.match(/.{2}/g) || []);
                const byteValues = hexBytes.map(b => parseInt(b, 16));
                const qVal = byteValues[0] || 0;
                this.dataPoints.push({ ts: new Date().toLocaleTimeString(), rawBits: item.rawbits, entropy: item.entropy, qrngValue: qVal, data: item.data });
                this.entropySum += item.entropy; this.rawBitsSum += item.rawbits; this.qrngSum += qVal; this.count++;
                SESSION_STATS.current.dataPoints++; SESSION_STATS.current.totalBytes += byteValues.length;
                SESSION_STATS.allTime.dataPoints++;  SESSION_STATS.allTime.totalBytes  += byteValues.length;
                if (this.dataPoints.length > MAX_DATA_POINTS) this.dataPoints.shift();
                this.chart.data.labels = this.dataPoints.map(d => d.ts);
                this.chart.data.datasets[0].data = this.dataPoints.map(d => d.qrngValue);
                this.chart.data.datasets[1].data = this.dataPoints.map(d => d.rawBits);
                this.chart.data.datasets[2].data = this.dataPoints.map(d => d.entropy);
                this.chart.update();
                localStorage.setItem('heuremenQrngStats', JSON.stringify(SESSION_STATS.allTime));
        });
  }

  refreshDisplay() {
        const dur = SESSION_STATS.current.startTime ? Math.round((Date.now() - SESSION_STATS.current.startTime) / 1000) : 0;
        const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
        set('sessionDuration', dur + 's');
        set('currentDataPoints', SESSION_STATS.current.dataPoints);
        set('currentTotalBytes', SESSION_STATS.current.totalBytes);
        set('allTimeDataPoints', SESSION_STATS.allTime.dataPoints);
        set('allTimeTotalBytes', SESSION_STATS.allTime.totalBytes);
        set('avgEntropy', this.count > 0 ? (this.entropySum / this.count).toFixed(2) : '0.00');
        set('avgRawBits', this.count > 0 ? (this.rawBitsSum / this.count).toFixed(2) : '0.00');
        set('avgQrng',    this.count > 0 ? (this.qrngSum    / this.count).toFixed(2) : '0.00');
        set('latestQrngData', this.dataPoints.length > 0 ? this.dataPoints[this.dataPoints.length-1].data : '-');
        document.getElementById('errorStatus').classList.remove('show');
  }
}

document.addEventListener('DOMContentLoaded', () => {
    const viz = new Visualizer();
    document.getElementById('startButton').addEventListener('click', () => {
          if (viz.isCapturing) viz.stopCapture(); else viz.startCapture();
    });
});
