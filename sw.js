// Offline cache. Bump VERSION whenever you deploy changes so users get the update.
const VERSION='dharm-v5', SHELL=['./','index.html','css/style.css','js/app.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/logo.png','js/drive-sync.js','js/config.js','icons/favicon-32.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  {const u=new URL(e.request.url);if(u.origin!==location.origin&&!/cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net/.test(u.host))return;}
  e.respondWith(fetch(e.request).then(r=>{
    if(r.ok&&(r.type==='basic'||/cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net/.test(e.request.url))){const c=r.clone();caches.open(VERSION).then(x=>x.put(e.request,c))}
    return r}).catch(()=>caches.match(e.request).then(m=>m||(e.request.mode==='navigate'?caches.match('index.html'):undefined))));
});
