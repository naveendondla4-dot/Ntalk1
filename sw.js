const CACHE='ntalk-v4';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./style.css','./app.js','./config.js','./manifest.json','./icon.svg'])))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
// network-first: new files always load; cache is only an offline fallback
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||!e.request.url.startsWith(self.location.origin))return;e.respondWith(fetch(e.request).then(x=>{const copy=x.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return x}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))))});
// tapping a notification opens the app on that chat
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const id=e.notification.data&&e.notification.data.chat_id;
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{
    if(cs.length){cs[0].focus();cs[0].postMessage({type:'open_chat',chat_id:id});}
    else return self.clients.openWindow('./');
  }));
});
