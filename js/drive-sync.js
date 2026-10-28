/* Google Drive automatic sync (browser only, no server).
   - Stores one JSON file + attachment files in the hidden "appDataFolder" of the user's own Drive
     (scope drive.appdata: this app cannot see any other Drive file, and the files do not show in My Drive).
   - Merges data from every device (newest save of each quality wins; deletions are remembered).
   Relies on globals from app.js: S, Q, save, render, normS, idbGet, idbPut. */
(function () {
  'use strict';
  const SCOPE = 'https://www.googleapis.com/auth/drive.appdata';
  const MAIN = 'dharm-weave-sync.json';
  const API = 'https://www.googleapis.com/drive/v3', UP = 'https://www.googleapis.com/upload/drive/v3';
  const LS = k => { try { return localStorage.getItem(k) } catch (e) { return null } };
  const LSset = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v) } catch (e) {} };
  const cid = () => LS('dharm_gcid') || window.DHARM_GOOGLE_CLIENT_ID || '';
  const connected = () => LS('dharm_gconn') === '1';
  const auto = () => LS('dharm_gauto') !== '0';
  const getCurU = () => +LS('dharm_cur_u') || 0;
  const getDel = () => { try { return JSON.parse(LS('dharm_del') || '{}') || {} } catch (e) { return {} } };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let st = { state: 'off', msg: '' };       // off | pending | busy | ok | err | reauth
  let tok = null, exp = 0, client = null, clientFor = '', gisP = null, tokWait = null;
  let busy = false, again = false, applying = false, timer = null, armed = false;
  let lastS = '', lastQ = '';
  try { const t = JSON.parse(LS('dharm_gtok') || 'null'); if (t && t.e > Date.now() + 60000) { tok = t.t; exp = t.e } } catch (e) {}

  /* ---------- status chip + menu label ---------- */
  const chip = document.createElement('button');
  chip.id = 'syncchip'; chip.className = 'syncchip'; chip.hidden = true; chip.type = 'button';
  chip.addEventListener('click', () => openDlg(true));
  document.body.appendChild(chip);
  const hhmm = t => t ? new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  function setState(s, msg) {
    st = { state: s, msg: msg || '' };
    const last = +LS('dharm_glast') || 0;
    const map = {
      off: ['', 'Not connected'], pending: ['☁ …', 'Changes waiting to sync'], busy: ['☁ Syncing…', 'Syncing…'],
      ok: ['☁ ✓ ' + hhmm(last), 'Synced ' + hhmm(last)], err: ['☁ ⚠ Sync error', 'Error: ' + (msg || '')],
      reauth: ['☁ ⚠ Tap to reconnect', 'Tap anywhere to reconnect']
    };
    const m = map[s] || map.off;
    chip.hidden = !connected(); chip.textContent = m[0]; chip.dataset.s = s; chip.title = m[1];
    const sub = document.getElementById('gdsub'); if (sub) sub.textContent = connected() ? m[1] : 'Back up & sync across devices';
    if (document.getElementById('gdlg')) drawDlg();
  }

  /* ---------- Google sign-in (token flow) ---------- */
  function loadGIS() {
    if (window.google && google.accounts && google.accounts.oauth2) return Promise.resolve();
    if (gisP) return gisP;
    gisP = new Promise((res, rej) => {
      const s = document.createElement('script'); s.src = 'https://accounts.google.com/gsi/client'; s.async = true;
      s.onload = () => res(); s.onerror = () => { gisP = null; rej(new Error('Could not reach Google (offline?)')) };
      document.head.appendChild(s);
    });
    return gisP;
  }
  async function getToken(interactive) {
    if (tok && Date.now() < exp - 60000) return tok;
    if (!interactive) { const e = new Error('reauth'); e.reauth = true; throw e }
    if (!cid()) throw new Error('Enter your Google Client ID first');
    await loadGIS();
    if (!client || clientFor !== cid()) {
      clientFor = cid();
      client = google.accounts.oauth2.initTokenClient({
        client_id: clientFor, scope: SCOPE,
        callback: r => { const w = tokWait; tokWait = null; if (!w) return; r.error ? w.rej(new Error(r.error_description || r.error)) : w.res(r) },
        error_callback: e => { const w = tokWait; tokWait = null; w && w.rej(new Error(e && e.type === 'popup_closed' ? 'Sign-in window was closed' : 'Sign-in popup was blocked or failed')) }
      });
    }
    const r = await new Promise((res, rej) => { tokWait = { res, rej }; client.requestAccessToken({ prompt: '' }) });
    tok = r.access_token; exp = Date.now() + (+r.expires_in || 3600) * 1000;
    LSset('dharm_gtok', JSON.stringify({ t: tok, e: exp }));
    return tok;
  }
  function armReauth() {
    if (armed) return; armed = true;
    const go = () => { armed = false; ['pointerdown', 'keydown'].forEach(ev => document.removeEventListener(ev, go, true)); sync('gesture', true) };
    ['pointerdown', 'keydown'].forEach(ev => document.addEventListener(ev, go, true));
  }

  /* ---------- Drive REST helpers ---------- */
  async function api(url, opt, interactive) {
    const t = await getToken(interactive);
    let r;
    try { r = await fetch(url, Object.assign({}, opt, { headers: Object.assign({ Authorization: 'Bearer ' + t }, (opt && opt.headers) || {}) })) }
    catch (e) { throw new Error('Network problem - will retry') }
    if (r.status === 401) { tok = null; exp = 0; LSset('dharm_gtok', null); const e = new Error('reauth'); e.reauth = true; throw e }
    if (!r.ok) { let m = ''; try { m = (await r.json()).error.message } catch (e) {} throw new Error('Drive error ' + r.status + (m ? ': ' + m : '')) }
    return r;
  }
  async function listAll(inter) {
    let out = [], pt = '';
    do {
      const r = await api(API + '/files?spaces=appDataFolder&pageSize=1000&fields=nextPageToken,files(id,name)' + (pt ? '&pageToken=' + encodeURIComponent(pt) : ''), {}, inter);
      const j = await r.json(); out = out.concat(j.files || []); pt = j.nextPageToken || '';
    } while (pt);
    return out;
  }
  const dl = async (id, inter) => (await api(API + '/files/' + id + '?alt=media', {}, inter)).text();
  async function put(name, text, id, inter) {
    if (text.length > 4e6) {   // resumable for big attachments
      const init = await api(UP + '/files' + (id ? '/' + id : '') + '?uploadType=resumable&fields=id', {
        method: id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(id ? { name } : { name, parents: ['appDataFolder'] })
      }, inter);
      const loc = init.headers.get('Location'); if (!loc) throw new Error('Drive upload could not start');
      const r = await fetch(loc, { method: 'PUT', headers: { 'Content-Type': 'text/plain' }, body: text });
      if (!r.ok) throw new Error('Drive upload failed ' + r.status);
      return (await r.json()).id;
    }
    const b = 'dharm' + Math.random().toString(36).slice(2);
    const meta = JSON.stringify(id ? { name } : { name, parents: ['appDataFolder'] });
    const body = '--' + b + '\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' + meta + '\r\n--' + b + '\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n' + text + '\r\n--' + b + '--';
    const r = await api(UP + '/files' + (id ? '/' + id : '') + '?uploadType=multipart&fields=id', {
      method: id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'multipart/related; boundary=' + b }, body
    }, inter);
    return (await r.json()).id;
  }

  /* ---------- merge ---------- */
  const qU = q => +q.u || (typeof q.id === 'number' ? q.id : 0) || 0;
  const pick = r => ({ v: 1, app: 'Dharm Textiles', curU: +r.curU || 0, current: r.current || null, qualities: r.qualities || [], deleted: r.deleted || {} });
  const docIds = x => (x && x.docs || []).map(d => d.id).filter(Boolean);

  async function sync(reason, inter) {
    if (!connected() || !cid()) return;
    if (busy) { again = true; return }
    busy = true; clearTimeout(timer); setState('busy');
    try {
      const files = await listAll(inter), by = new Map(files.map(f => [f.name, f.id]));
      let remote = null;
      if (by.has(MAIN)) {
        const txt = await dl(by.get(MAIN), inter);
        try { remote = JSON.parse(txt) } catch (e) { throw new Error('The cloud file is unreadable - nothing was overwritten') }
      }
      const r = remote ? pick(remote) : { v: 1, curU: 0, current: null, qualities: [], deleted: {} };

      /* qualities: newest save wins, deletions remembered */
      const del = Object.assign({}, getDel()); for (const k in r.deleted) del[k] = Math.max(del[k] || 0, +r.deleted[k] || 0);
      const map = new Map();
      const add = q => { if (!q || !q.name || !q.s) return; const o = map.get(q.name); if (!o || qU(q) > qU(o)) map.set(q.name, q) };
      Q.forEach(add); (r.qualities || []).forEach(add);
      const merged = [];
      map.forEach((q, name) => { if (del[name] && del[name] >= qU(q)) return; merged.push({ id: q.id, name: q.name, party: q.party || '', u: qU(q), s: q.s }) });
      merged.sort((a, b) => a.id - b.id);

      /* current (open) quality: newest edit wins */
      const typing = /^(INPUT|SELECT|TEXTAREA)$/.test((document.activeElement || {}).tagName || '');
      const lcu = getCurU(); let adopt = !!(r.current && r.curU > lcu && !typing);
      let payCur = adopt ? r.current : S, payU = adopt ? r.curU : Math.max(lcu, 0);
      if (typing && r.current && r.curU > lcu) { payCur = r.current; payU = r.curU }   // don't clobber remote while user is typing

      const payload = pick({ curU: payU, current: payCur, qualities: merged, deleted: del });
      const same = remote && JSON.stringify(payload) === JSON.stringify(pick(remote));

      /* attachments */
      const ids = new Set([...docIds(payCur), ...merged.flatMap(q => docIds(q.s))]);
      let got = 0;
      for (const id of ids) {
        const nm = 'f-' + id; let have; try { have = await idbGet(id) } catch (e) { continue }
        if (have && !by.has(nm)) { by.set(nm, await put(nm, have, null, inter)) }
        else if (!have && by.has(nm)) { try { await idbPut(id, await dl(by.get(nm), inter)); got++ } catch (e) {} }
      }

      /* upload if the merged result differs from what is in the cloud */
      if (!same) await put(MAIN, JSON.stringify(Object.assign({ updated: new Date().toISOString() }, payload)), by.get(MAIN) || null, inter);

      /* apply to this device */
      const localJ = JSON.stringify(Q.map(q => ({ n: q.name, u: qU(q), s: q.s })));
      const newJ = JSON.stringify(merged.map(q => ({ n: q.name, u: q.u, s: q.s })));
      const qChanged = localJ !== newJ || got > 0;
      if (qChanged || adopt || JSON.stringify(del) !== LS('dharm_del')) {
        applying = true;
        try {
          if (adopt && S && S.name && S.name.trim()) {          // keep a copy of what was open, never lose it
            const ex = Q.find(q => q.name === S.name.trim());
            if (!ex || JSON.stringify(ex.s) !== JSON.stringify(S)) {
              let nm = S.name.trim() + ' (this device ' + new Date().toISOString().slice(0, 10) + ')';
              const n = Date.now(); if (!map.has(nm) && !merged.some(q => q.name === nm)) merged.push({ id: n, name: nm, party: S.party || '', u: n, s: JSON.parse(JSON.stringify(S)) });
            }
          }
          Q.length = 0; merged.forEach(q => Q.push({ id: q.id, name: q.name, party: q.party, u: q.u, s: normS(q.s) }));
          if (adopt) { S = normS(r.current); LSset('dharm_cur_u', String(r.curU)) }
          LSset('dharm_del', JSON.stringify(del));
          save(); lastS = JSON.stringify(S); lastQ = JSON.stringify(Q);
        } finally { applying = false }
        if (adopt || qChanged) { try { render() } catch (e) {} }
      }
      LSset('dharm_glast', String(Date.now()));
      setState('ok');
    } catch (e) {
      if (e && e.reauth) { setState('reauth'); armReauth() } else setState('err', e && e.message || 'failed');
    } finally {
      busy = false;
      if (again) { again = false; timer = setTimeout(() => sync('again'), 800) }
    }
  }

  /* ---------- hooks called by the app ---------- */
  function changed() {
    if (applying) return;
    let js, jq; try { js = JSON.stringify(S); jq = JSON.stringify(Q) } catch (e) { return }
    if (!lastS) { lastS = js; lastQ = jq; return }               // baseline, no bump
    if (js === lastS && jq === lastQ) return;
    if (js !== lastS) LSset('dharm_cur_u', String(Date.now()));
    lastS = js; lastQ = jq;
    if (!connected() || !auto()) return;
    setState('pending'); clearTimeout(timer); timer = setTimeout(() => sync('edit'), 4000);
  }
  function tomb(name) { const d = getDel(); d[name] = Date.now(); LSset('dharm_del', JSON.stringify(d)) }

  /* ---------- connect / disconnect ---------- */
  async function connect() {
    try {
      await getToken(true); LSset('dharm_gconn', '1'); setState('busy');
      try { const r = await api(API + '/about?fields=user(emailAddress)', {}, false); LSset('dharm_gemail', (await r.json()).user.emailAddress) } catch (e) {}
      await sync('connect', true); startPoll();
    } catch (e) { setState(connected() ? 'err' : 'off', e.message); alert('Could not connect: ' + e.message) }
  }
  function disconnect() {
    if (!confirm('Disconnect Google Drive on this device?\n\nYour data stays on this device and in your Drive backup. Auto-sync will stop here.')) return;
    try { tok && window.google && google.accounts.oauth2.revoke(tok, () => {}) } catch (e) {}
    ['dharm_gconn', 'dharm_gtok', 'dharm_gemail', 'dharm_glast'].forEach(k => LSset(k, null));
    tok = null; exp = 0; clearTimeout(timer); setState('off'); drawDlg();
  }
  let pollT = null;
  function startPoll() {
    if (pollT) return;
    pollT = setInterval(() => { if (document.visibilityState === 'visible' && connected() && auto() && st.state !== 'reauth') sync('poll') }, 90000);
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && connected() && auto()) sync('visible') });
  addEventListener('online', () => { if (connected() && auto()) sync('online') });

  /* ---------- dialog ---------- */
  const SETUP = `<ol style="padding-left:18px;margin:6px 0;font-size:12.5px;line-height:1.55">
   <li>Open <b>console.cloud.google.com</b> → create a project (any name).</li>
   <li><b>APIs &amp; Services → Library</b> → enable <b>Google Drive API</b>.</li>
   <li><b>OAuth consent screen</b> (Google Auth Platform) → External → fill app name &amp; your email → add scope <code>.../auth/drive.appdata</code> → add your Google account(s) as <b>Test users</b> (or publish the app).</li>
   <li><b>Credentials → Create credentials → OAuth client ID → Web application</b>. Under <b>Authorized JavaScript origins</b> add your site address, e.g. <code>https://yourname.github.io</code> (no path, no trailing slash). Add <code>http://localhost:8000</code> if you test locally.</li>
   <li>Copy the <b>Client ID</b> and paste it above (or put it in <code>js/config.js</code> so all devices get it).</li>
   <li>Use the <b>same Google account</b> on every device.</li></ol>`;
  function drawDlg() {
    const o = document.getElementById('gdlg'); if (!o) return;
    const last = +LS('dharm_glast') || 0, email = LS('dharm_gemail');
    const badge = { off: '#64748b', pending: '#b45309', busy: '#0e7490', ok: '#15803d', err: '#b91c1c', reauth: '#b45309' }[st.state] || '#64748b';
    const stTxt = connected() ? ({ pending: 'Changes waiting to sync…', busy: 'Syncing…', ok: 'Synced' + (last ? ' at ' + new Date(last).toLocaleString() : ''), err: 'Error: ' + esc(st.msg), reauth: 'Session expired - click anywhere / Sync now to reconnect' }[st.state] || 'Connected') : 'Not connected';
    let h = `<div style="background:#fff;border-radius:12px;max-width:600px;width:100%;max-height:90vh;overflow:auto;padding:16px">
     <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><b style="flex:1;font-size:17px">☁ Google Drive sync</b><button class="btn" data-g="close">Close</button></div>
     <div style="padding:9px 12px;border-radius:8px;background:#f1f5f9;margin-bottom:10px;font-size:13px"><b style="color:${badge}">● ${stTxt}</b>${connected() && email ? '<br><small>Account: ' + esc(email) + '</small>' : ''}</div>`;
    if (!connected()) {
      h += `<label style="font-size:12px;color:#475569">Google OAuth Client ID<input id="gcid" placeholder="123456789-abc....apps.googleusercontent.com" value="${esc(cid())}"></label>
       <div class="bar" style="margin-top:10px"><button class="btn p" data-g="connect">Connect Google Drive</button></div>`;
    } else {
      h += `<div class="bar"><button class="btn p" data-g="sync">Sync now</button><button class="btn d" data-g="disc">Disconnect</button></div>
       <label style="display:flex;gap:8px;align-items:center;margin:10px 0;font-size:13px;color:#0f172a"><input type="checkbox" id="gauto" style="width:auto;margin:0" ${auto() ? 'checked' : ''}> Auto-sync (upload ~4 s after each change, check for other devices' changes every 90 s)</label>`;
    }
    h += `<details style="margin-top:10px"${cid() ? '' : ' open'}><summary style="cursor:pointer;font-weight:700;font-size:13px">One-time setup &amp; how it works</summary>${SETUP}
     <p style="font-size:12px;color:#475569;margin:6px 0 0">Data goes only to a hidden app folder in <b>your own</b> Google Drive (it does not appear in My Drive and the app cannot see your other files). Sign-in lasts about an hour; after that the next click or keystroke silently renews it. Qualities are merged by name - the most recent save wins - and deleted qualities stay deleted on every device.</p></details></div>`;
    o.innerHTML = h;
  }
  function openDlg() {
    let o = document.getElementById('gdlg'); if (o) o.remove();
    o = document.createElement('div'); o.id = 'gdlg';
    o.style.cssText = 'position:fixed;inset:0;z-index:99990;background:rgba(15,23,42,.6);display:flex;align-items:center;justify-content:center;padding:14px';
    o.addEventListener('click', e => {
      if (e.target === o) return o.remove();
      const b = e.target.closest('[data-g]'); if (!b) return; const a = b.dataset.g;
      if (a === 'close') o.remove();
      else if (a === 'connect') { const v = (document.getElementById('gcid').value || '').trim(); if (!/\.apps\.googleusercontent\.com$/.test(v)) return alert('Paste the full Client ID (ends with .apps.googleusercontent.com).'); LSset('dharm_gcid', v); connect() }
      else if (a === 'sync') sync('user', true);
      else if (a === 'disc') disconnect();
    });
    o.addEventListener('change', e => { if (e.target.id === 'gauto') { LSset('dharm_gauto', e.target.checked ? '1' : '0'); if (e.target.checked) sync('auto-on', true) } });
    document.body.appendChild(o); drawDlg();
  }
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-gd]'); if (b) openDlg() });

  /* ---------- start ---------- */
  function init() {
    try { lastS = JSON.stringify(S); lastQ = JSON.stringify(Q) } catch (e) {}
    setState(connected() ? (tok ? 'ok' : 'reauth') : 'off');
    if (connected()) { startPoll(); if (tok) sync('start'); else armReauth() }
  }
  window.DriveSync = { changed, tomb, open: openDlg, sync: () => sync('api', true) };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
