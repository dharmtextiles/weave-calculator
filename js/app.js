const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const n=v=>parseFloat(v)||0, f=(v,d=2)=>(isFinite(v)?v:0).toFixed(d);
const inr=(v,d=2)=>'₹'+(isFinite(v)?v:0).toLocaleString('en-IN',{minimumFractionDigits:d,maximumFractionDigits:d});
const wr=()=>({ends:0,den:0,wast:0,rate:0,gst:0,fr:0}), wf=()=>({pick:0,den:0,wast:0,rate:0,gst:0,fr:0});
const uid=()=>'y'+Math.random().toString(36).slice(2,6);
const pegDef=()=>({title:'',type:'plain',shafts:8,perLift:2,picks:[]});
const pegDobby=()=>S.peg&&S.peg.type==='dobby';
const pegLo=()=>pegDobby()?3:1;
const pegList=()=>{const a=[];for(let x=pegLo();x<=S.peg.shafts;x++)a.push(x);return a};
function pegFix(){const g=S.peg;if(g.type==='dobby'){if(g.shafts<3)g.shafts=3;g.picks=g.picks.map(pk=>pk.filter(x=>x>2))}}
const pegSample=()=>({title:'38-MOSS SAREE',shafts:13,perLift:2,picks:"2,3,5,6,9,13|1,4,6,8,9,13|2,5,7,8,10,13|1,3,4,5,10,13|2,3,6,7,11,13|1,4,7,8,11,13|2,4,5,6,12|1,3,6,8,12|2,3,4,7,9,13|1,5,6,7,9,13|2,3,5,8,10,13|1,3,4,6,10,13|2,4,5,7,11,13|1,5,6,8,11,13|2,3,7,8,12|1,4,6,7,12|2,4,5,8,9,13|1,3,5,7,9,13|2,6,7,8,10,13|1,3,4,8,10,13|2,3,5,6,11,13|1,5,7,8,11,13|2,4,6,8,12|1,3,6,7,12|2,3,4,5,9,13|1,4,7,8,9,13|2,3,6,8,10,13|1,4,5,6,10,13|2,3,4,7,11,13|1,3,5,8,11,13|2,5,6,7,12|1,3,4,6,12|2,4,5,8,9,13|1,6,7,8,9,13|2,3,5,7,10,13|1,3,4,8,10,13|2,4,6,7,11,13|1,5,6,8,11,13|2,3,7,8,12|1,4,5,7,12".split('|').map(r=>r.split(',').map(Number))});
const drDef=()=>({p:{name:'',shaft:'',reed:'',reed2:'',epi:'',dent:'',pick:'',ppi:'',ends:''},b:[],cols:{block:1,shaft:1,ends:1,dent:1,pattern:1,repeat:1,params:1,yarns:1}});
const latDef=()=>({rows:[],cols:{}});
const patDef=()=>({reed:100,v3:1,yarns:[{id:'y1',name:'Yarn 1',color:'#2a6f97'}],tree:{k:'g',r:1,c:[{k:'y',y:'y1',n:0}]}});
const patSample=()=>({reed:100,yarns:[{id:'br',name:'Bright',color:'#e63946',epd:4},{id:'sd',name:'SD',color:'#2a6f97',epd:2},{id:'ja',name:'Jari',color:'#f4c430',epd:1},{id:'bd',name:'Border SD',color:'#6c757d',epd:6}],
 tree:{k:'g',r:1,c:[{k:'y',y:'bd',n:144},{k:'g',r:32,c:[{k:'y',y:'br',n:8},{k:'y',y:'sd',n:4}]},{k:'g',r:32,c:[{k:'y',y:'sd',n:84},{k:'y',y:'br',n:12},{k:'g',r:12,c:[{k:'y',y:'sd',n:3},{k:'y',y:'ja',n:1}]},{k:'y',y:'br',n:12}]},{k:'y',y:'sd',n:84},{k:'g',r:32,c:[{k:'y',y:'br',n:8},{k:'y',y:'sd',n:4}]},{k:'y',y:'bd',n:144}]}});
const def=()=>({name:'',party:'',docs:[],panno:0,warps:[wr()],wefts:[wf()],factory:0,fmode:'month',fpmIn:0,pmode:'mach',pman:0,deal:0,dgst:0,dfr:0,mach:0,prod:0,days:0,rpm:550,eff:88,order:0,beamLen:1800,box:35,job:{},pat:patDef(),peg:pegDef(),draw:drDef(),lat:latDef(),wtab:'warp',ftab:'weft'});
const IDB=new Promise(r=>{try{const q=indexedDB.open('dharm_files',1);q.onupgradeneeded=()=>q.result.createObjectStore('f');q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)}catch(e){r(null)}});
const idbDo=(mode,fn)=>IDB.then(db=>new Promise((res,rej)=>{if(!db)return rej(new Error('nodb'));const t=db.transaction('f',mode),rq=fn(t.objectStore('f'));t.oncomplete=()=>res(rq&&rq.result);t.onerror=t.onabort=()=>rej(t.error)}));
const idbPut=(id,v)=>idbDo('readwrite',st=>st.put(v,id)),idbGet=id=>idbDo('readonly',st=>st.get(id)),idbKeys=()=>idbDo('readonly',st=>st.getAllKeys()),idbDel=id=>idbDo('readwrite',st=>st.delete(id));
let S,Q=[],view='calc';
try{S=Object.assign(def(),JSON.parse(localStorage.getItem('dharm_state')||'{}'))}catch(e){S=def()}
/* --- repair saved data so old/corrupt browser storage can never blank the app --- */
const fixState=o=>{const d=def();if(!o||typeof o!=='object'||Array.isArray(o))return d;
 for(const k of Object.keys(d)){const dv=d[k],v=o[k];if(v==null||Array.isArray(dv)!==Array.isArray(v)||(typeof dv!==typeof v)){o[k]=dv}}
 if(!o.warps.length)o.warps=[wr()];if(!o.wefts.length)o.wefts=[wf()];
 o.warps=o.warps.map(x=>Object.assign(wr(),x&&typeof x==='object'?x:{}));o.wefts=o.wefts.map(x=>Object.assign(wf(),x&&typeof x==='object'?x:{}));
 return o};
S=fixState(S);
if(!S.pat||!S.pat.tree)S.pat=patDef();
if(!S.peg||!S.peg.picks)S.peg=pegDef();
if(!S.draw||!S.draw.b)S.draw=drDef();
if(!S.lat||!S.lat.rows)S.lat=latDef();
try{Q=JSON.parse(localStorage.getItem('dharm_q')||'[]')}catch(e){Q=[]}
if(!Array.isArray(Q))Q=[];Q=Q.filter(q=>q&&typeof q==='object'&&q.s&&typeof q.s==='object').map(q=>{q.s=fixState(q.s);return q});
const save=()=>{try{localStorage.setItem('dharm_state',JSON.stringify(S));localStorage.setItem('dharm_q',JSON.stringify(Q));return true}catch(e){return false}};
Q.forEach(q=>{if(q&&q.s)migDoc(q.s)});migDoc(S);save();

/* ---------- calculation (same formulas as the online tool) ---------- */
function calc(s=S){
 const net=r=>r.pm==='all'?n(r.all):n(r.rate)*(1+n(r.gst)/100)+n(r.fr);
 const wL=s.warps.map(()=>false),wE=s.warps.map(r=>n(r.ends));
 const wN=s.warps.map(r=>(r.name||'').trim()),fN=s.wefts.map(r=>(r.name||'').trim());
 const wW=s.warps.map((r,i)=>wE[i]*n(r.den)/90000*(1+n(r.wast)/100));
 const fW=s.wefts.map(r=>n(s.panno)*n(r.pick)*n(r.den)/90000*(1+n(r.wast)/100));
 const wC=s.warps.map((r,i)=>wW[i]*net(r)/100), fC=s.wefts.map((r,i)=>fW[i]*net(r)/100);
 const sum=a=>a.reduce((x,y)=>x+y,0);
 const warpW=sum(wW),weftW=sum(fW),warpC=sum(wC),weftC=sum(fC),yarn=warpC+weftC;
 const actW=sum(s.warps.map(r=>n(r.ends)*n(r.den)/90000))+sum(s.wefts.map(r=>n(s.panno)*n(r.pick)*n(r.den)/90000));
 const total=warpW+weftW,glm=actW*10,width=n(s.panno)*0.0254,gsm=width?glm/width:0;
 const mm=s.pmode==='manual'?n(s.pman):n(s.mach)*n(s.prod)*n(s.days),fpm=s.fmode==='meter'?n(s.fpmIn):(mm?n(s.factory)/mm:0);
  const cost=yarn+fpm,bill=n(s.deal)*(1+n(s.dgst)/100)+n(s.dfr),profit=n(s.deal)-cost;
 return{wL,wE,wN,fN,wW,fW,wC,fC,warpW,weftW,warpC,weftC,yarn,total,glm,gsm,mm,fpm,cost,bill,profit,monthly:profit*mm,actW,
  ends:sum(wE),picks:sum(s.wefts.map(r=>n(r.pick))),net};
}
const get=(p)=>p.split('.').reduce((o,k)=>o?.[k],S);
const setp=(p,v)=>{const k=p.split('.');let o=S;while(k.length>1)o=o[k.shift()];o[k[0]]=v};
const I=(p,l,t='number')=>`<label>${l}<input type="${t}" ${t=='number'?'step="any" min="0"':''} data-k="${p}" data-t="${t}" value="${esc(get(p)||'')}"></label>`;

/* ---------- views ---------- */
function rows(kind){
 const w=kind=='warps',a=S[kind];
 return a.map((r,i)=>`<div class="row"><div style="grid-column:1/-1">${I(`${kind}.${i}.name`,w?'Yarn name (sent to Warp pattern)':'Yarn name','text')}</div>${a.length>1?`<button class="x" data-a="del" data-kind="${kind}" data-i="${i}" title="Remove">×</button>`:''}
  ${I(`${kind}.${i}.${w?'ends':'pick'}`,w?'Ends':'Pick (PPI)')}${I(`${kind}.${i}.den`,'Denier')}${I(`${kind}.${i}.wast`,'Wastage %')}
  <div style="grid-column:span 3"><label>Price type<select data-k="${kind}.${i}.pm" data-t="text"><option value="basic"${r.pm==='all'?'':' selected'}>Basic price + GST + Freight</option><option value="all"${r.pm==='all'?' selected':''}>All price (everything included)</option></select></label></div>
  ${r.pm==='all'?`<div style="grid-column:span 3">${I(`${kind}.${i}.all`,'All-in price ₹/kg (incl. GST &amp; freight)')}</div>`:`<div style="grid-column:span 2">${I(`${kind}.${i}.rate`,'Basic rate ₹/kg')}</div><div style="grid-column:span 2">${I(`${kind}.${i}.gst`,'GST %')}</div><div style="grid-column:span 2">${I(`${kind}.${i}.fr`,'Freight ₹/kg')}</div>`}</div>`).join('');
}
const docBar=()=>{const n=(S.docs||[]).length;return `<button class="btn" data-a="docup">📎 Add image / PDF</button>${n?`<button class="btn p" data-a="docmgr">View files (${n})</button>`:''}`};
const docBlob=d=>{const p=d.data.split(','),m=/:(.*?);/.exec(p[0])[1],b=atob(p[1]),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return new Blob([u],{type:m})};
function docShow(d){if(!d)return;(d.data?Promise.resolve(d.data):idbGet(d.id)).then(data=>{if(!data)return alert('This file is not stored on this computer. Restore the full backup that contains it.');docShow2(Object.assign({},d,{data}))}).catch(()=>alert('Could not open the file storage in this browser.'))}
function docShow2(d){if(!d||!d.data)return;const old=document.getElementById('docov');if(old)old.remove();const isPdf=/pdf/i.test(d.type)||/\.pdf$/i.test(d.name),url=URL.createObjectURL(docBlob(d)),o=document.createElement('div');o.id='docov';o.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,.92);display:flex;flex-direction:column';
 o.innerHTML='<div style="display:flex;gap:8px;align-items:center;padding:8px 12px;background:#0f172a;color:#fff"><b style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(d.name)+'</b><a class="btn" style="text-decoration:none" target="_blank" href="'+url+'">Open in new tab</a><a class="btn" style="text-decoration:none" download="'+esc(d.name)+'" href="'+url+'">Download</a><button class="btn d" id="docx">Close ✕</button></div><div style="flex:1;overflow:auto;display:flex;justify-content:center;align-items:flex-start;padding:10px">'+(isPdf?'<iframe src="'+url+'" style="width:100%;height:100%;border:0;background:#fff;border-radius:6px"></iframe>':'<img src="'+url+'" style="max-width:100%;height:auto;background:#fff;border-radius:6px">')+'</div>';
 document.body.appendChild(o);const cl=()=>{o.remove();URL.revokeObjectURL(url)};o.querySelector('#docx').onclick=cl;document.addEventListener('keydown',function k(e){if(e.key==='Escape'){cl();document.removeEventListener('keydown',k)}})}
function docMgr(files,edit,after){const old=document.getElementById('docmg');if(old)old.remove();const o=document.createElement('div');o.id='docmg';o.style.cssText='position:fixed;inset:0;z-index:99990;background:rgba(15,23,42,.6);display:flex;align-items:center;justify-content:center;padding:14px';
 const draw=()=>{o.innerHTML='<div style="background:#fff;border-radius:12px;max-width:560px;width:100%;max-height:85vh;overflow:auto;padding:14px"><div style="display:flex;gap:8px;align-items:center;margin-bottom:10px"><b style="flex:1;font-size:16px">Attached files ('+files.length+')</b>'+(edit?'<button class="btn p" data-x="add">+ Add more</button>':'')+'<button class="btn" data-x="cl">Close</button></div>'+(files.length?files.map((d,i)=>'<div style="display:flex;gap:8px;align-items:center;padding:8px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:6px"><span style="font-size:20px">'+(/pdf/i.test(d.type)?'📄':'🖼️')+'</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(i+1)+'. '+esc(d.name)+'</span><button class="btn" data-x="v" data-i="'+i+'">View</button>'+(edit?'<button class="btn d" data-x="d" data-i="'+i+'">Remove</button>':'')+'</div>').join(''):'<p>No files yet.</p>')+'</div>'};
 draw();o.onclick=e=>{const t=e.target.closest('[data-x]');if(e.target===o)return o.remove();if(!t)return;const x=t.dataset.x,i=+t.dataset.i;if(x==='cl')o.remove();else if(x==='v')docShow(files[i]);else if(x==='add'){o.remove();$('#docfile').click()}else if(x==='d'&&confirm('Remove "'+files[i].name+'"?')){files.splice(i,1);save();draw();docGC();if(after)after()}};document.body.appendChild(o)}
function docLoad1(fl){return new Promise(res=>{const isPdf=/pdf/i.test(fl.type)||/\.pdf$/i.test(fl.name);if(!isPdf&&!/^image\//.test(fl.type)){alert('"'+fl.name+'" skipped: choose an image or a PDF.');return res(null)}
 const done=data=>res({id:'f'+Date.now().toString(36)+Math.random().toString(36).slice(2,8),name:fl.name,type:isPdf?'application/pdf':'image/jpeg',data});
 if(isPdf){const r=new FileReader();r.onload=()=>done(r.result);r.readAsDataURL(fl)}
 else{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,1800/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);done(c.toDataURL('image/jpeg',.82))};im.onerror=()=>{alert('"'+fl.name+'" could not be read.');res(null)};im.src=r.result};r.readAsDataURL(fl)}})}
async function docLoad(list){if(!Array.isArray(S.docs))S.docs=[];let n=0;for(const fl of list){const d=await docLoad1(fl);if(!d)continue;try{await idbPut(d.id,d.data);S.docs.push({id:d.id,name:d.name,type:d.type});n++}catch(e){alert('Could not store "'+fl.name+'" (browser storage is full or blocked).')}}if(!n)return;save();render();docMgr(S.docs,true,render)}
async function docGC(){try{const u=new Set();[S,...Q.map(q=>q.s)].forEach(x=>(x.docs||[]).forEach(d=>u.add(d.id)));for(const k of await idbKeys())if(!u.has(k))await idbDel(k)}catch(e){}}
document.addEventListener('change',e=>{if(e.target.id!=='docfile')return;const fl=[...e.target.files];e.target.value='';docLoad(fl)});
const vCalc=()=>`<h1>Fabric calculator</h1><p class="sub">Warp, weft and profit — results update as you type.</p>
<div class="bar"><input style="width:220px" placeholder="Quality name" data-k="name" data-t="text" value="${esc(S.name)}">
${docBar()}
<button class="btn p" data-a="savq">Save quality</button><button class="btn" data-a="copy">Copy summary</button><button class="btn d" data-a="clear">Clear all</button></div>
${S.wtab=='pat'?`<div class="card pvcard" style="margin-bottom:14px"><div class="p-gh"><b style="font-size:15px">Warp pattern preview</b><span class="p-sp"></span><span id="pvz" class="pvz"></span><button class="pb" data-a="pzout">− Zoom out</button><button class="pb" data-a="pzin">+ Zoom in</button><button class="pb" data-a="pzfit">Fit width</button><button class="pb" data-a="report" data-only="warp">Print / PDF</button></div><div id="pvw" class="pvw"><canvas id="pcv"></canvas></div></div>`:''}
<div class="grid${S.pfull&&S.wtab=='pat'?' pf':''}"><div>
 <div class="card dk"><h2>WARP <span class="tag"><span data-o="warpW"></span> kg/100m</span></h2>
  <div class="tabs"><button data-a="wtab" data-t="warp" class="${!['pat','peg','draw'].includes(S.wtab)?'on':''}">Warp</button><button data-a="wtab" data-t="pat" class="${S.wtab=='pat'?'on':''}">Warp pattern</button><button data-a="wtab" data-t="peg" class="${S.wtab=='peg'?'on':''}">Peg plan</button><button data-a="wtab" data-t="draw" class="${S.wtab=='draw'?'on':''}">Drawing</button></div>
  ${S.wtab=='pat'?`<div id="pat">${patHTML()}</div>`:S.wtab=='peg'?`<div id="peg" class="peg">${pegHTML()}</div>`:`${rows('warps')}<button class="btn" data-a="add" data-kind="warps">+ Add warp</button>`}</div>
 <div class="card dk wft"><h2>WEFT <span class="tag"><span data-o="weftW"></span> kg/100m</span></h2>
  <div class="tabs"><button data-a="ftab" data-t="weft" class="${S.ftab!='lat'?'on':''}">Weft</button><button data-a="ftab" data-t="lat" class="${S.ftab=='lat'?'on':''}">Weft lattice</button></div>
  ${S.ftab=='lat'?`<div id="lat" class="lat">${latHTML()}</div>`:`<div style="max-width:220px;margin-bottom:10px">${I('panno','Panno (reed space, inches)')}</div>${rows('wefts')}
  <button class="btn" data-a="add" data-kind="wefts">+ Add weft</button>`}</div></div>
<div><div class="card"><h2>Fabric weight &amp; yarn cost</h2>
 <div class="kv"><span>Actual weight (without wastage)</span><b><span data-o="actW"></span> kg/100m</b></div>
 <div class="kv"><span>Total yarn weight <small>(with wastage, used in costing)</small></span><b><span data-o="total"></span> kg/100m</b></div>
 <div class="kv"><span>Warp yarn cost</span><b data-o="warpC"></b></div>
 <div class="kv"><span>Weft yarn cost</span><b data-o="weftC"></b></div>
 <div class="kv"><span>GLM / GSM</span><b><span data-o="glm"></span> g/m · <span data-o="gsm"></span> g/m²</b></div>
 <div class="hl"><span>Total yarn cost / metre</span><b data-o="yarn"></b></div></div>
 <div class="card"><h2>Factory cost</h2><div class="tabs"><button data-a="fmode" data-m="month" class="${S.fmode!='meter'?'on':''}">Monthly cost ÷ production</button><button data-a="fmode" data-m="meter" class="${S.fmode=='meter'?'on':''}">Per metre cost</button></div><div class="f2">${S.fmode=='meter'?I('fpmIn','Factory cost ₹/m (added to final cost)'):I('factory','Monthly factory cost ₹')}<div class="kv" style="align-items:end"><span>Per metre</span><b data-o="fpm"></b></div></div>
  <div class="hl"><span>Yarn + factory / metre</span><b data-o="cost"></b></div></div>
 <div class="card"><h2>Deal rate &amp; profit</h2><div class="f3">${I('deal','Deal rate ₹/m')}${I('dgst','Fabric GST %')}${I('dfr','Freight ₹/m')}</div>
  <div class="kv"><span>Total billing rate</span><b data-o="bill"></b></div>
  <div class="kv"><span>Profit per metre</span><b data-o="profit"></b></div>
  <div class="tabs" style="margin-top:12px"><button data-a="pmode" data-m="mach" class="${S.pmode!='manual'?'on':''}">Machines × m/day × days</button><button data-a="pmode" data-m="manual" class="${S.pmode=='manual'?'on':''}">Enter production manually</button></div>
  ${S.pmode=='manual'?`<div class="f2">${I('pman','Total production (m/month)')}${I('days','Production days (optional)')}</div>`:`<div class="f3">${I('mach','Machines')}${I('prod','Prod. m/day/machine')}${I('days','Production days')}</div>`}
  <div class="kv"><span>Total production</span><b><span data-o="mm"></span> m/month</b></div>
  <div class="hl"><span>Monthly profit</span><b data-o="monthly"></b></div></div></div></div>`;

const vSaved=(q='')=>{
 const L=Q.filter(x=>(x.name+x.party+x.s.party).toLowerCase().includes(q.toLowerCase()));
 return `<h1>Saved qualities</h1><p class="sub">Stored on this computer (browser storage). Use CSV backup to keep a copy.</p>
 <div class="bar"><input style="width:280px" id="sq" placeholder="Search quality or party" value="${esc(q)}">
 <button class="btn" data-a="export">Export CSV / Excel</button><button class="btn p" data-a="new">+ New quality</button></div>
 ${L.length?`<div class="cards">${L.map(x=>{const c=calc(x.s);return `<div class="card qc"><div class="t">${esc(x.name)}</div>
 <div class="m">${n(x.s.panno)}" · ${c.ends} ends · ${c.picks} pick ${x.s.party?'· '+esc(x.s.party):''}${migDoc(x.s).docs.length?' · 📎 '+x.s.docs.length+' file(s)':''}</div>
 <div class="kv"><span>Fabric weight</span><b>${f(c.total,3)} kg/100m</b></div><div class="kv"><span>GLM / GSM</span><b>${f(c.glm,1)} / ${f(c.gsm,1)}</b></div>
 <div class="kv"><span>Yarn cost</span><b>${inr(c.yarn)}/m</b></div><div class="kv"><span>Deal rate</span><b>${inr(n(x.s.deal))}/m</b></div>
 <div class="bar" style="margin:10px 0 0"><button class="btn p" data-a="load" data-id="${x.id}">Load in calculator</button><button class="btn" data-a="loadjob" data-id="${x.id}">Job card</button>${migDoc(x.s).docs.length?`<button class="btn" data-a="qdoc" data-id="${x.id}">View files (${x.s.docs.length})</button>`:''}<button class="btn d" data-a="delq" data-id="${x.id}">Delete</button></div></div>`}).join('')}</div>`
 :'<div class="card empty">No saved qualities yet. Fill the calculator and press “Save quality”.</div>'}`};

const yarnRes=()=>{const c=calc(),L=n(S.beamLen)||1,beams=n(S.order)/L,wk=c.warpW*n(S.order)/100,fk=c.weftW*n(S.order)/100,boxes=n(S.box)?fk/n(S.box):0,perDay=S.pmode==='manual'?(n(S.days)?n(S.pman)/n(S.days):0):n(S.mach)*n(S.prod);
 return `<div class="grid"><div class="card tl"><h2>WARP BEAM REQUIREMENT <span class="tag">${c.ends} ends</span></h2><div class="kv"><span>Total warp beams needed</span><b class="big">${Math.ceil(beams-1e-9)} Beams</b></div>
 <div class="kv"><span>Exact beams</span><b>${f(beams)}</b></div><div class="kv"><span>Length per beam</span><b>${n(S.beamLen)} m</b></div><div class="kv"><span>Total ends per beam</span><b>${c.ends}</b></div><div class="kv"><span>Warp yarn</span><b>${f(wk)} kg</b></div></div>
 <div class="card tl"><h2>WEFT YARN PROCUREMENT <span class="tag">${c.picks} pick</span></h2><div class="kv"><span>Total weft yarn needed</span><b class="big">${f(fk)} kg</b></div><div class="kv"><span>Weft boxes needed</span><b>${Math.ceil(boxes-1e-9)} (${f(boxes)} exact)</b></div>
 <div class="kv"><span>Weft yarn cost budget</span><b>${inr(c.weftC*n(S.order),0)}</b></div></div></div>
 <div class="stats"><div class="stat"><small>TOTAL YARN PURCHASE</small><b>${f(wk+fk)} kg</b></div><div class="stat"><small>RAW MATERIAL BUDGET</small><b>${inr(c.yarn*n(S.order),0)}</b></div>
 <div class="stat"><small>TOTAL ORDER TURNOVER</small><b>${inr(n(S.deal)*n(S.order),0)}</b></div><div class="stat"><small>ESTIMATED NET PROFIT${perDay?' · '+f(n(S.order)/perDay,1)+' days':''}</small><b>${inr(c.profit*n(S.order),0)}</b></div></div>`};
const vYarn=()=>`<h1>Yarn requirement planning</h1><p class="sub">Bags &amp; yarn weight for order. Uses the quality in the calculator.</p>
 <div class="card"><h2>Yarn &amp; beam requirement estimator</h2><div class="f3">${I('order','Target fabric order (metres)')}${I('beamLen','Warping beam length (m)')}${I('box','Weft packing size (kg/box)')}</div></div><div id="res">${yarnRes()}</div>`;
const loomRes=()=>{const pk=calc().picks,th=pk?n(S.rpm)*1440/(pk*39.3701):0,ac=th*n(S.eff)/100;
 return `<div class="stats lt" style="grid-template-columns:repeat(3,1fr)"><div class="stat"><small>Theoretical 100% output</small><b class="big">${f(th,1)} m/day</b></div>
 <div class="stat"><small>Actual machine production (@ ${n(S.eff)}%)</small><b class="big">${f(ac,1)} m/day</b></div><div class="stat"><small>Total shed daily (${n(S.mach)} machines)</small><b class="big">${f(ac*n(S.mach),0)} m/day</b></div></div>
 <div class="bar" style="margin-top:14px"><button class="btn p" data-a="applyloom" data-val="${f(ac,1)}">Apply to main ERP</button></div>`};
const vLoom=()=>`<h1>Loom RPM simulator</h1><p class="sub">Loom speed &amp; production output</p>
 <div class="card"><h2>Waterjet loom RPM to daily production converter</h2><div class="f3">${I('rpm','Loom speed (RPM)')}${I('eff','Loom efficiency (%)')}<label>Picks per inch (from fabric construction)<input disabled value="${calc().picks}"></label></div></div>
 <div id="res">${loomRes()}</div>
 <div class="card" style="margin-top:14px"><b>Technical production formula</b><pre style="margin:8px 0 0;white-space:pre-wrap;font-family:Consolas,monospace">Picks per meter = Pick (PPI) × 39.3701
Meters per day = (RPM × 1440 × Efficiency%) ÷ (Pick × 39.3701 × 100)</pre></div>`;
const c0=()=>calc();

const D=()=>new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
const vSheet=()=>{const c=calc();
 const tr=(l,par,r,k)=>`<tr><td>${esc(l)}</td><td>${par}</td><td>${n(r.den)}D</td><td>${n(r.wast)}%</td><td>${f(k[0],4)}</td><td>${inr(c.net(r))}</td><td>${f(k[1],4)}</td></tr>`;
 return `<h1>Cost sheet</h1><p class="sub">Use Print to send it to a printer, or Save PDF to download a PDF file directly.</p><div class="bar"><button class="btn p" data-a="print">Print</button><button class="btn p" data-a="pdf">Save PDF</button></div>
 <div class="sheet"><div class="hd"><div><h3>Dharm Textiles</h3><div>Waterjet fabric costing sheet</div></div><div style="text-align:right">Date: ${D()}</div></div>
 <div class="f2" style="margin-bottom:10px"><div><small>Fabric quality</small><br><b>${esc(S.name)||'—'}</b><br>Width: ${n(S.panno)}" · ${c.ends} ends · ${c.picks} pick</div><div style="text-align:right"><small>Buyer / party</small><br><b>${esc(S.party)||'—'}</b></div></div>
 <b>1. Yarn specification &amp; weight</b><table><tr><th>Section</th><th>Parameters</th><th>Denier</th><th>Wastage</th><th>Weight kg/100m</th><th>Net rate/kg</th><th>Cost ₹/m</th></tr>
 ${S.warps.map((r,i)=>tr('Warp '+(i+1)+(c.wN[i]?' – '+c.wN[i]:''),c.wE[i]+' ends',r,[c.wW[i],c.wC[i]])).join('')}${S.wefts.map((r,i)=>tr('Weft '+(i+1)+(c.fN[i]?' – '+c.fN[i]:''),n(r.pick)+' pick',r,[c.fW[i],c.fC[i]])).join('')}
 <tr><th colspan="4" style="text-align:right">Total yarn <small>(actual without wastage: ${f(c.actW,4)})</small></th><th>${f(c.total,4)}</th><th></th><th>${f(c.yarn,4)}</th></tr></table>
 <div class="f3" style="margin-bottom:14px"><div class="card">GLM<br><b>${f(c.glm)} g/m</b></div><div class="card">GSM<br><b>${f(c.gsm)} g/m²</b></div><div class="card">Yarn cost<br><b>${inr(c.yarn,4)}/m</b></div></div>
 <b>2. Commercial costing &amp; profit</b><table><tr><td>Yarn cost / m</td><td>${inr(c.yarn,4)}</td></tr><tr><td>Factory cost / m <small>(${S.fmode=='meter'?'per-metre rate':'monthly cost ÷ production'})</small></td><td>${inr(c.fpm,4)}</td></tr><tr><td>Total cost / m</td><td>${inr(c.cost,4)}</td></tr>
 <tr><td>Deal rate / m</td><td>${inr(n(S.deal))}</td></tr><tr><td>Billing rate incl. GST &amp; freight</td><td>${inr(c.bill)}</td></tr><tr><td><b>Net profit / m</b></td><td><b>${inr(c.profit,4)}</b></td></tr>
 <tr><td>${S.pmode=='manual'?'Production (entered manually)':'Machines × m/day × days'}</td><td>${S.pmode=='manual'?f(c.mm,0)+' m/month':n(S.mach)+' × '+n(S.prod)+' × '+n(S.days)+' = '+f(c.mm,0)+' m'}</td></tr><tr><td><b>Monthly net profit</b></td><td><b>${inr(c.monthly)}</b></td></tr></table>
 <div class="sig"><span>Prepared by (Weaving master)</span><span>Verified by (Accountant)</span><span>Authorised signatory</span></div></div>`};

const JA=['Warp A','Warp B','Warp C','Warp D'],JW=['Weft A','Weft B','Weft C','Weft D'],JS=['Reed','Pick','Rs.','TE','TD','Selvage','Frame','Weave'];
const jv=(k,d='')=>esc(S.job[k]??d);
const ji=(k,d)=>`<input data-k="job.${k}" data-t="text" value="${jv(k,d)}">`;
const vJob=()=>{const c=calc(),top=[['Date',D()],['Party name',S.party],['Through',''],['Ref. no.','']];
 return `<h1>Job card slip (A4)</h1><p class="sub">Fields are editable before printing.</p><div class="bar"><button class="btn p" data-a="print">Print</button><button class="btn p" data-a="pdf">Save PDF</button><button class="btn" data-a="clearjob">Clear fields</button></div>
 <div class="sheet jc"><div class="hd" style="border-color:var(--madder)"><div><h3>DHARM TEXTILES</h3><small>Textile weaving job card slip</small></div><div style="width:260px">${top.map(([l,d])=>`<div class="jl"><span style="min-width:90px">${l}:</span>${ji('t'+l,d)}</div>`).join('')}</div></div>
 <div class="jl"><span>Quality name :</span>${ji('q',S.name)}</div><div class="jl"><span>Design no. :</span>${ji('d')}</div>
 ${JA.map((l,i)=>`<div class="jl"><span>${l} :</span>${ji('wa'+i,S.warps[i]&&n(S.warps[i].den)?`${c.wN[i]?c.wN[i]+' · ':''}${S.warps[i].den}D · ${c.wE[i]} ends`:'')}</div>`).join('')}
 ${JW.map((l,i)=>`<div class="jl"><span>${l} :</span>${ji('wf'+i,S.wefts[i]&&n(S.wefts[i].den)?`${c.fN[i]?c.fN[i]+' · ':''}${S.wefts[i].den}D · ${S.wefts[i].pick} pick`:'')}</div>`).join('')}
 <div class="j3" style="margin-top:12px;text-align:center"><span></span><span>On loom</span><span>Gray</span><span>Finish</span></div>
 ${JS.map(l=>`<div class="j3"><span>${l} :</span>${ji('r'+l.replace(/\W/g,'')+'1',l=='Pick'?S.picks:l=='Reed'&&n(S.panno)?S.panno+'"':'')}${ji('r'+l.replace(/\W/g,'')+'2')}${ji('r'+l.replace(/\W/g,'')+'3')}</div>`).join('')}
 <div style="height:10px"></div>${[...JA,...JW].map(l=>`<div class="j3"><span>${l} :</span>${ji('s'+l+1)}${ji('s'+l+2)}${ji('s'+l+3)}</div>`).join('')}
 <div style="height:10px"></div>${['Total warp waste','Waste','Total weft waste'].map(l=>`<div class="jl"><span style="min-width:130px">${l} :</span>${ji('w'+l)}</div>`).join('')}
 <div class="sig" style="margin-top:30px"><span>Prepared &amp; checked by weaving master</span></div></div>`};

/* ---------- warp pattern designer ---------- */
const PAL=['#e63946','#2a6f97','#f4c430','#6c757d','#2a9d8f','#8a5cf6','#e76f51','#264653'];
function syncPat(){const P=S.pat,old=P.yarns;S.warps.forEach(r=>{if(!r.yid)r.yid=uid()});
 if(!P.v3){(function f(nd,ed){const E=nd.ed||ed;nd.c.forEach(c=>{if(c.k==='y'){c.ed=c.epd||c.ed||E||1;delete c.epd}else if(c.k==='g')f(c,E)});delete nd.ed})(P.tree,1);P.v3=1}
 P.yarns=S.warps.map((r,i)=>{const o=old.find(y=>y.id===r.yid);return{id:r.yid,name:(r.name||'').trim()||('Warp '+(i+1)),color:o?o.color:PAL[i%PAL.length]}});
 syncLat();
 const ids=P.yarns.map(y=>y.id);if(S.draw&&S.draw.b)S.draw.b.forEach(b=>{b.p=b.p.filter(q=>ids.includes(q.y))});(function f(nd){if(nd.k==='y'){if(!ids.includes(nd.y))nd.y=ids[0]}else if(nd.k==='m')nd.items.forEach(i=>{if(!ids.includes(i.y))i.y=ids[0]});else nd.c.forEach(f)})(P.tree)}
const pFx=v=>Number.isInteger(v)?v.toLocaleString():(+v.toFixed(2)).toLocaleString();
const pYb=id=>S.pat.yarns.find(y=>y.id===id)||{name:'?',color:'#999',epd:1};
function pCalc(nd){if(nd.k==='m')return{e:nd.n*nd.items.reduce((a,i)=>a+i.e,0),d:nd.n};if(nd.k==='y'){const k=nd.ed>0?nd.ed:(nd.n||1);return{e:nd.n,d:nd.n/k}}let e=0,d=0;nd.c.forEach(c=>{const t=pCalc(c),m=c.k==='g'?c.r:1;e+=t.e*m;d+=t.d*m});return{e,d}}
function pTallyD(nd,m,mu){if(nd.k==='m'){const t=nd.items.reduce((a,i)=>a+i.e,0)||1;nd.items.forEach(i=>{m[i.y]=(m[i.y]||0)+nd.n*mu*i.e/t});return}
 if(nd.k==='y'){m[nd.y]=(m[nd.y]||0)+nd.n/(nd.ed>0?nd.ed:(nd.n||1))*mu;return}nd.c.forEach(c=>pTallyD(c,m,mu*(c.k==='g'?c.r:1)))}
function pTally(nd,m,mu){if(nd.k==='m'){nd.items.forEach(i=>{m[i.y]=(m[i.y]||0)+nd.n*mu*i.e});return}
 if(nd.k==='y'){m[nd.y]=(m[nd.y]||0)+nd.n*mu;return}nd.c.forEach(c=>pTally(c,m,mu*(c.k==='g'?c.r:1)))}
function pFlat(nd,o){if(nd.k==='m'){for(let r=0;r<nd.n;r++)nd.items.forEach(i=>{for(let j=0;j<i.e;j++)o.push(i.y)});return}
 if(nd.k==='y'){for(let i=0;i<nd.n;i++)o.push(nd.y);return}for(let r=0;r<nd.r;r++)nd.c.forEach(c=>pFlat(c,o))}
const pFm=nd=>{if(nd.k==='m')return nd.n+' dents ('+nd.items.map(i=>i.e+' '+pYb(i.y).name).join(' + ')+')';if(nd.k==='y')return nd.n+' '+pYb(nd.y).name+(nd.ed>0?' ['+nd.ed+' in 1 dent]':'');const t=nd.c.map(pFm).join(' + ');return nd.r>1?'('+t+') × '+nd.r:t};
const pGet=q=>q===''?S.pat.tree:q.split('.').reduce((a,i)=>a.c[+i],S.pat.tree);
const pOpts=v=>S.pat.yarns.map(y=>`<option value="${y.id}"${y.id===v?' selected':''}>${esc(y.name)}</option>`).join('');
const PCR={};let PCLIP=[];
const pcv=(q,k)=>{const v=PCR[k+'|'+q];return v===undefined?'':esc(v)};
const pCpPanel=q=>`<div class="p-cp"><b>Copy / paste</b> copy item no. <input type="number" min="1" step="1" data-pcr="f|${q}" value="${pcv(q,'f')}" placeholder="from"> to <input type="number" min="1" step="1" data-pcr="t|${q}" value="${pcv(q,'t')}" placeholder="to"><button class="pb cp" data-a="pcopyr" data-p="${q}">Copy</button><span style="color:var(--mut)">(one item: 1 to 1)</span> · paste at no. <input type="number" min="1" step="1" data-pcr="p|${q}" value="${pcv(q,'p')}" placeholder="end"><button class="pb cp" data-a="ppasteg" data-p="${q}">Paste here</button></div>`;
function pclipUpd(){const e=$('#pclip');if(e)e.innerHTML=PCLIP.length?'Clipboard: <b>'+PCLIP.length+'</b> item(s) — '+esc(PCLIP.map(pFm).join(' | ').slice(0,90))+' <button class="pb" data-a="pclrclip">Clear</button>':'Clipboard empty. Press Copy on a row, or copy a range (from – to) at the bottom of a repeat, then Paste.'}
function pRow(nd,q,top){
 const no=q===''?'':'<span class="p-no" title="Item number">'+q.split('.').map(i=>+i+1).join('.')+'</span>';
 const ctl=`<button class="pb cp" data-a="pcopy" data-p="${q}" title="Copy this item (1 to 1)">Copy</button><button class="pb cp" data-a="ppaste" data-p="${q}" title="Paste copied items below this one">Paste</button><button class="pb" data-a="pup" data-p="${q}">↑</button><button class="pb" data-a="pdn" data-p="${q}">↓</button><button class="pb" data-a="pdel" data-p="${q}">✕</button>`;
 if(nd.k==='m')return `<div class="p-row" style="align-items:flex-start"><div style="flex:1;min-width:250px"><div class="p-gh">${no} <b>Mixed dent</b> <input type="number" min="1" step="1" value="${nd.n}" data-pf="n" data-p="${q}"> dents, each dent holds:</div>
  ${nd.items.map((it,i)=>`<div class="p-gh" style="margin-top:4px"><span class="p-sw" data-spm="${q}|${i}"></span><select data-pf="iy" data-pi="${i}" data-p="${q}">${pOpts(it.y)}</select><input type="number" min="1" step="1" value="${it.e}" data-pf="ie" data-pi="${i}" data-p="${q}"> ends${nd.items.length>1?`<button class="pb" data-a="pmdel" data-p="${q}" data-i="${i}">✕</button>`:''}</div>`).join('')}
  <button class="pb" style="margin-top:4px" data-a="pmadd" data-p="${q}">+ Yarn in this dent</button></div><span class="p-tot" data-pk="md" data-p="${q}"></span>${ctl}</div>`;
 if(nd.k==='y')return `<div class="p-row">${no}<span class="p-sw" data-sp="${q}"></span><select data-pf="y" data-p="${q}">${pOpts(nd.y)}</select><input type="number" min="0" step="1" value="${nd.n}" data-pf="n" data-p="${q}"> ends<span class="edw">Total ends in one dent <input type="number" min="0" step="any" value="${nd.ed||''}" placeholder="auto: ${nd.n}" data-pf="ed" data-p="${q}"></span><span class="p-sp"></span><span class="p-tot" data-pk="yd" data-p="${q}"></span>${ctl}</div>`;
 const kids=nd.c.map((c,i)=>pRow(c,q===''?''+i:q+'.'+i)).join('');
 return `<div class="p-grp"><div class="p-gh">${top?'<b>Whole warp</b>':`${no} Repeat × <input type="number" min="1" step="1" value="${nd.r}" data-pf="r" data-p="${q}">`}<span class="p-sp"></span><span class="p-tot" data-pk="gp" data-p="${q}"></span>${top?'':`<span class="p-tot" data-pk="gt" data-p="${q}"></span>${ctl}`}</div><div class="p-ch">${kids}<button class="pb" data-a="pay" data-p="${q}">+ Yarn</button> <button class="pb" data-a="pam" data-p="${q}">+ Mixed dent</button> <button class="pb" data-a="pag" data-p="${q}">+ Repeat group</button>${pCpPanel(q)}</div></div>`}
const patHTML=()=>{const P=S.pat;return `<div class="pat">
 <p class="sub" style="margin:0 0 10px">Build repeats inside repeats. Every yarn row and repeat has a number. To copy: press Copy on a row (single item = 1 to 1), or at the bottom of a repeat type from – to and press Copy; then press Paste on a row (pastes below it) or Paste here. For each yarn row enter its ends; “total ends in one dent” is worked out automatically (all the row's ends go in one dent). Type a number only if the row needs more dents, e.g. 144 ends with 6 total ends in one dent = 24 dents. Example: Repeat × 27 of 4 Bright + 2 SD = 2 dents per repeat = 54 dents, 162 ends.</p>
 <div class="bar" style="margin:0 0 8px"><span class="p-tot" id="pclip"></span></div><div class="p-stats" id="pst"></div>
 <div class="p-card"><div class="p-gh">Reed count <input type="number" id="prc" min="1" step="any" value="${P.reed}"><span class="p-sp"></span><span class="p-stat" style="flex:0 1 190px">Reed space<b id="prsp">–</b></span></div><div class="mn" id="prfm"></div><small style="color:var(--mut)">Reed space = (dents used ÷ reed count) × 2</small></div>
 <div class="p-card"><b>Yarn types</b> <small style="color:var(--mut)">— taken from the Warp tab (add or rename yarns there)</small><table><tr><th>Colour</th><th>Name</th></tr>${P.yarns.map((y,i)=>`<tr><td><input type="color" value="${y.color}" data-pyf="color" data-i="${i}"></td><td>${esc(y.name)}</td></tr>`).join('')}</table></div>
 <div class="p-card"><div class="p-gh"><b>Design</b><span class="p-sp"></span><button class="pb" data-a="pblank">Clear</button></div>${pRow(P.tree,'',true)}</div>
 <div class="p-card"><div class="p-gh"><b>Warp pattern formula</b><span class="p-sp"></span><button class="pb" data-a="fmlprint">Print</button><button class="pb" data-a="fmlpdf">Save PDF</button></div><small style="color:var(--mut)">Yarn name, its ends, ends per dent. After a bracket: repeats = total ends of that bracket (e.g. 24 = 144). A bigger bracket repeats the smaller ones inside it.</small><div class="fmlw"><div id="pfm"></div></div><div class="mn" id="pfmt" style="margin-top:8px"></div></div>
 <div class="p-card"><b>Total ends per yarn</b><table id="pty"></table></div>
 <div class="bar" style="margin:0"><button class="btn p" data-a="ppanno">Set panno = reed space</button><small style="color:var(--mut)">Copies the reed space above into the Weft panno field.</small></div></div>`};
function patLive(){const P=S.pat;if(!$('#pat'))return;const t=pCalc(P.tree),m={},md={};pTally(P.tree,m,1);pTallyD(P.tree,md,1);
 document.querySelectorAll('#pat [data-pk]').forEach(el=>{const nd=pGet(el.dataset.p),c=pCalc(nd),k=el.dataset.pk,mu=nd.k==='g'?nd.r:1;
  el.innerHTML=k=='md'?`<b>${nd.items.reduce((a,i)=>a+i.e,0)}</b> ends/dent · <b>${pFx(c.d)}</b> dents · <b>${pFx(c.e)}</b> ends`:k=='yd'?`dents <b>${pFx(c.d)}</b>`:k=='gp'?`1 pass: <b>${pFx(c.e)}</b> ends · <b>${pFx(c.d)}</b> dents`:`| total: <b>${pFx(c.e*mu)}</b> ends · <b>${pFx(c.d*mu)}</b> dents`});
 document.querySelectorAll('#pat [data-pf=ed]').forEach(el=>{const nd=pGet(el.dataset.p);el.placeholder='auto: '+nd.n});
 document.querySelectorAll('#pat [data-sp]').forEach(el=>{el.style.background=pYb(pGet(el.dataset.sp).y).color});
 document.querySelectorAll('#pat [data-spm]').forEach(el=>{const [q,i]=el.dataset.spm.split('|');el.style.background=pYb(pGet(q).items[+i].y).color});
 document.querySelectorAll('#pat option').forEach(o=>{o.textContent=pYb(o.value).name});
 const du=Math.ceil(t.d-1e-9),rc=P.reed||100,rsv=du/rc*2;
 $('#pst').innerHTML=`<div class="p-stat">Total ends<b>${pFx(t.e)}</b></div><div class="p-stat">Total dents<b>${pFx(t.d)}</b></div><div class="p-stat">Reed dents (rounded up)<b>${du}</b></div>`;
 $('#prsp').textContent=pFx(+rsv.toFixed(2))+' in';$('#prfm').textContent='('+du.toLocaleString()+' ÷ '+rc+') × 2 = '+(+rsv.toFixed(2));
 $('#pfm').innerHTML=patFormulaSVG(P.tree);$('#pfmt').textContent=pFm(P.tree);
 $('#pty').innerHTML='<tr><th>Yarn</th><th>Pattern ends</th><th>Warp ends entered</th><th>Dents</th></tr>'+P.yarns.map(y=>{const e=m[y.id]||0,dd=md[y.id]||0,w=S.warps.find(r=>r.yid===y.id),en=w?n(w.ends):0,ok=e===en;return `<tr><td><span class="p-sw" style="background:${y.color}"></span> ${esc(y.name)}</td><td>${pFx(e)}</td><td style="color:${ok?'#15803d':'#9b2c2c'}">${pFx(en)} ${ok?'✓':'(diff '+pFx(e-en)+')'}</td><td>${pFx(dd)}</td></tr>`}).join('');
 patPreview(t)}
const patRender=()=>{$('#pat').innerHTML=patHTML();patLive();pclipUpd();save()};
function patInput(t){const P=S.pat;if(t.dataset.pcr!==undefined){PCR[t.dataset.pcr]=t.value;return}
 if(t.id==='prc')P.reed=Math.max(.01,+t.value||100);
 else if(t.dataset.pi!==undefined){const it=pGet(t.dataset.p).items[+t.dataset.pi];if(t.dataset.pf==='iy')it.y=t.value;else it.e=Math.max(1,Math.floor(+t.value||1))}
 else if(t.dataset.pf){const nd=pGet(t.dataset.p),k=t.dataset.pf;if(k==='ed')nd.ed=Math.max(0,+t.value||0);else nd[k]=k==='y'?t.value:Math.max(k==='r'?1:0,Math.floor(+t.value||0))}
 else if(t.dataset.pyf){const y=P.yarns[+t.dataset.i],k=t.dataset.pyf;y[k]=k==='epd'?Math.max(1,+t.value||1):t.value}
 patLive();save()}
const PA={
 pfull(){S.pfull=!S.pfull;render()},
 pclrclip(){PCLIP=[];pclipUpd()},
 pcopy(d){PCLIP=[JSON.parse(JSON.stringify(pGet(d.p)))];pclipUpd()},
 pcopyr(d){const g=pGet(d.p),a=parseInt(PCR['f|'+d.p]),b=parseInt(PCR['t|'+d.p])||a;if(!(a>=1))return alert('Type the item number in "from".');if(a>b)return alert('"from" cannot be more than "to".');if(b>g.c.length)return alert('This repeat has only '+g.c.length+' items.');PCLIP=JSON.parse(JSON.stringify(g.c.slice(a-1,b)));pclipUpd()},
 pclone(){const ids=S.pat.yarns.map(y=>y.id),c=JSON.parse(JSON.stringify(PCLIP));(function f(nd){if(nd.k==='y'){if(!ids.includes(nd.y))nd.y=ids[0]}else if(nd.k==='m')nd.items.forEach(i=>{if(!ids.includes(i.y))i.y=ids[0]});else nd.c.forEach(f)})({k:'g',c});return c},
 ppaste(d){if(!PCLIP.length)return alert('Nothing copied yet.');const ix=d.p.split('.'),i=+ix.pop();pGet(ix.join('.')).c.splice(i+1,0,...PA.pclone());patRender()},
 ppasteg(d){if(!PCLIP.length)return alert('Nothing copied yet.');const g=pGet(d.p),p=parseInt(PCR['p|'+d.p]),at=p>=1?Math.min(p-1,g.c.length):g.c.length;g.c.splice(at,0,...PA.pclone());patRender()},
 pzin(){S.pz=zStep(+S.pz||0,patFitPx(),1,1);patLive();save()},pzout(){S.pz=zStep(+S.pz||0,patFitPx(),-1,1);patLive();save()},pzfit(){S.pz=0;patLive();save()},
 pay(d){pGet(d.p).c.push({k:'y',y:S.pat.yarns[0].id,n:1});patRender()},
 pag(d){pGet(d.p).c.push({k:'g',r:2,c:[{k:'y',y:S.pat.yarns[0].id,n:1}]});patRender()},
 pdel(d){const ix=d.p.split('.'),i=+ix.pop();pGet(ix.join('.')).c.splice(i,1);patRender()},
 pup(d){PA.mv(d,-1)},pdn(d){PA.mv(d,1)},
 mv(d,k){const ix=d.p.split('.'),i=+ix.pop(),a=pGet(ix.join('.')).c,j=i+k;if(j>=0&&j<a.length)[a[i],a[j]]=[a[j],a[i]];patRender()},
 pam(d){const P=S.pat,a=P.yarns[0].id,b=(P.yarns[1]||P.yarns[0]).id;pGet(d.p).c.push({k:'m',n:1,items:[{y:a,e:2},{y:b,e:1}]});patRender()},
 pmadd(d){pGet(d.p).items.push({y:S.pat.yarns[0].id,e:1});patRender()},
 pmdel(d){pGet(d.p).items.splice(+d.i,1);patRender()},
 pyadd(){S.pat.yarns.push({id:uid(),name:'Yarn '+(S.pat.yarns.length+1),color:'#8a5cf6',epd:2});patRender()},
 pydel(d){const P=S.pat,i=+d.i;if(P.yarns.length<2)return;const id=P.yarns[i].id;P.yarns.splice(i,1);(function f(nd){if(nd.k==='y'){if(nd.y===id)nd.y=P.yarns[0].id}else nd.c.forEach(f)})(P.tree);S.warps.forEach(r=>{if(r.yid===id)r.yid=''});patRender()},
 psample(){if(confirm('Load the sample design?')){const r=S.pat.reed;S.pat=patSample();S.pat.reed=r;patRender()}},
 pblank(){if(confirm('Clear the pattern?')){const r=S.pat.reed;S.pat=patDef();S.pat.reed=r;syncPat();patRender()}},
 ppanno(){const t=pCalc(S.pat.tree),sp=+(Math.ceil(t.d-1e-9)/(S.pat.reed||100)*2).toFixed(2);if(!confirm('Set panno to '+sp+'"?'))return;S.panno=sp;save();alert('Panno set to '+sp+'"')}};

function pvDraw(cv,a,o){const ne=o.ne,z=o.z,ru=o.ruler||0,fs=o.fs||11,h=o.h,W=Math.max(1,Math.round(ne*z));cv.width=W;cv.height=h+ru;const x=cv.getContext('2d');
 x.fillStyle='#fff';x.fillRect(0,0,W,h+ru);const tile=z>=4&&Number.isInteger(z);
 for(let i=0;i<ne;i++){const col=pYb(a[o.s0+i]).color;if(tile)x.drawImage(simTile(col,'w',z),i*z,ru,z,h);else{x.fillStyle=col;x.fillRect(Math.floor(i*z),ru,Math.ceil(z)+1,h)}}
 if(!ru)return;const step=[1,2,5,10,20,50,100,200,500,1000,2000,5000,10000,20000,50000].find(s=>s*z>=fs*5.5)||100000;
 x.fillStyle='#333';x.font=fs+'px sans-serif';x.textBaseline='alphabetic';const th=Math.round(ru*.3);
 for(let i=0;i<ne;i++){const idx=o.s0+i+1;if(!(idx%step===0||(idx===1&&(step===1||(step-1)*z>=fs*3))))continue;
  const px=i*z+z/2,t=String(idx),w=x.measureText(t).width;x.fillRect(Math.round(px),ru-th,1,th);x.fillText(t,Math.max(0,Math.min(px,W-w)),ru-th-2)}}
/* ---------- warp formula: bracket diagram ---------- */
const epd=v=>pFx(v)+(v==1?' end':' ends')+' per dent';
function fmlLeaf(nd){if(nd.k==='y')return nd.n>0?{y:nd.y,n:nd.n,pd:nd.ed>0?nd.ed:nd.n}:null;if(nd.k!=='g')return null;const k=nd.c.filter(c=>pCalc(c).e>0);if(k.length!==1)return null;const l=fmlLeaf(k[0]);return l?{y:l.y,n:l.n*(nd.r>0?nd.r:1),pd:l.pd}:null}
function patFormula(tree){const RH=28,PAD=10,rows=[],br=[];let y=0,maxL=0;
 const walk=nd=>{if(nd.k==='y'||nd.k==='g'){const lf=fmlLeaf(nd);if(lf){rows.push({y,name:pYb(lf.y).name.toUpperCase(),num:String(lf.n),sub:epd(lf.pd),c:pYb(lf.y).color});y+=RH;return 0}if(nd.k==='y')return 0}
  if(nd.k==='m'){const pe=nd.items.reduce((a,i)=>a+i.e,0),rp=nd.n>1;if(rp&&y>0)y+=PAD;const st=y;nd.items.forEach(it=>{rows.push({y,name:pYb(it.y).name.toUpperCase(),num:String(it.e),sub:epd(pe),c:pYb(it.y).color});y+=RH});if(!rp)return 0;br.push({y1:st,y2:y,L:1,r:nd.n,lab:nd.n+' = '+pFx(nd.n*pe)});y+=PAD;maxL=Math.max(maxL,1);return 1}
  const rep=nd.r>1;if(rep&&y>0)y+=PAD;const st=y;let l=0;nd.c.forEach(c=>{l=Math.max(l,walk(c))});
  if(!rep||y===st)return l;const L=l+1;br.push({y1:st,y2:y,L,r:nd.r,lab:nd.r+' = '+pFx(pCalc(nd).e*nd.r)});y+=PAD;maxL=Math.max(maxL,L);return L};
 walk(tree);if(!rows.length)return null;
 const m1=document.createElement('canvas').getContext('2d');m1.font='600 15px Arial,sans-serif';const m2=document.createElement('canvas').getContext('2d');m2.font='12px Arial,sans-serif';
 const totS=pFx(pCalc(tree).e*(tree.r||1)),nameW=Math.ceil(Math.max(m1.measureText('TOTAL ENDS').width*1.08,...rows.map(r=>m1.measureText(r.name).width))),numW=Math.ceil(Math.max(m1.measureText(totS).width*1.08,...rows.map(r=>m1.measureText(r.num).width))),subW=Math.max(0,...rows.map(r=>r.sub?Math.ceil(m2.measureText(r.sub).width)+10:0)),
  NX=22,NUMR=NX+nameW+34+numW,X0=NUMR+subW+40,lw=[];
 br.forEach(b=>{lw[b.L]=Math.max(lw[b.L]||0,Math.ceil(m1.measureText(b.lab).width))});
 const xs=[];let cx=X0;for(let L=1;L<=maxL;L++){xs[L]=cx;cx+=16+10+(lw[L]||0)+30}
 const trail=(br.length&&br[br.length-1].y2+PAD===y)?PAD:0,total=pCalc(tree).e*(tree.r||1),ty=y-trail+PAD+4,W=Math.ceil(Math.max(maxL?cx-30+6:NUMR+subW+10,NX+260)),H=ty+RH;
 let g='';rows.forEach(r=>{const cy=r.y+RH/2;g+=`<rect x="0" y="${cy-6}" width="12" height="12" rx="2" fill="${r.c}" stroke="#555" stroke-width=".6"/><text x="${NX}" y="${cy+5}" font-size="15" font-weight="600" fill="#111">${esc(r.name)}</text><text x="${NUMR}" y="${cy+5}" font-size="15" font-weight="600" text-anchor="end" fill="#111">${esc(r.num)}</text>`;
  if(r.sub)g+=`<text x="${NUMR+10}" y="${cy+4}" font-size="12" fill="#555">${esc(r.sub)}</text>`});
 br.forEach(b=>{const x=xs[b.L],y1=b.y1+4,y2=b.y2-4,ym=(y1+y2)/2,q=Math.max(2,Math.min(10,(y2-y1)/4)),bw=8;
  g+=`<path d="M${x},${y1} Q${x+bw},${y1} ${x+bw},${y1+q} L${x+bw},${ym-q} Q${x+bw},${ym} ${x+bw*2},${ym} Q${x+bw},${ym} ${x+bw},${ym+q} L${x+bw},${y2-q} Q${x+bw},${y2} ${x},${y2}" fill="none" stroke="#222" stroke-width="1.3"/><text x="${x+bw*2+10}" y="${ym+5}" font-size="15" font-weight="600" fill="#111">${esc(b.lab)}</text>`});
 g+=`<line x1="0" y1="${ty-6}" x2="${NUMR}" y2="${ty-6}" stroke="#999" stroke-width="1"/><text x="${NX}" y="${ty+RH/2+1}" font-size="15" font-weight="700" fill="#111">TOTAL ENDS</text><text x="${NUMR}" y="${ty+RH/2+1}" font-size="15" font-weight="700" text-anchor="end" fill="#111">${esc(pFx(total))}</text>`;
 return{w:W,h:Math.ceil(H),g,rows,br,NX,NUMR,xs,ty,RH,total}}
function patFormulaSVG(tree,k){const f=patFormula(tree);if(!f)return '<small style="color:var(--mut)">Add yarns with ends in the design to see the formula.</small>';k=k||1;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(f.w*k)}" height="${Math.round(f.h*k)}" viewBox="0 0 ${f.w} ${f.h}" font-family="Arial,sans-serif" style="display:block;max-width:none">${f.g}</svg>`}
function fmlHTML(maxW,maxH,up){const f=patFormula(S.pat.tree);if(!f)return '';const k=Math.min(up||1,maxW/f.w,maxH/f.h);return `<div class="fmlbox">${patFormulaSVG(S.pat.tree,k)}</div>`}
function fmlYarnTable(){const P=S.pat,m={},md={};pTally(P.tree,m,1);pTallyD(P.tree,md,1);const ys=P.yarns.filter(y=>(m[y.id]||0)>0),te=ys.reduce((a,y)=>a+(m[y.id]||0),0),td=ys.reduce((a,y)=>a+(md[y.id]||0),0);if(!ys.length)return '';
 return `<b>Total ends per yarn</b><table style="margin:6px 0 10px"><tr><th>Yarn</th><th>Total ends</th><th>Dents</th></tr>${ys.map(y=>`<tr><td><span class="p-sw" style="background:${y.color};-webkit-print-color-adjust:exact;print-color-adjust:exact"></span> ${esc(y.name)}</td><td>${pFx(m[y.id])}</td><td>${pFx(md[y.id]||0)}</td></tr>`).join('')}<tr><th>Total</th><th>${pFx(te)}</th><th>${pFx(td)}</th></tr></table>`}
function repFml(){return rh('Warp pattern formula')+fmlHTML(680,640,1.3)+fmlYarnTable()+`<p style="font-size:12px;margin-top:10px">Each row shows the yarn, its ends and how many ends go in one dent. The number after a bracket is how many times the yarns inside it repeat, then “= total ends” of that bracket (for example 24 = 144 means 24 repeats make 144 ends). A bigger bracket repeats the smaller ones inside it.</p>`}
function patFlat(){const a=[];pFlat(S.pat.tree,a);return a}
function patFitPx(){return wrapW($('#pvw'))/Math.max(1,pCalc(S.pat.tree).e)}
function patPreview(t){const cv=$('#pcv'),lab=$('#pvz');if(!cv)return;
 if(!(t.e>0&&t.e<=200000)){cv.width=1;cv.height=1;if(lab)lab.textContent=t.e>200000?'Too many ends to preview':'';return}
 const a=patFlat(),ne=a.length,cw=wrapW($('#pvw'));let fit=!(+S.pz>0),z;
 if(!fit){z=Math.min(+S.pz,Math.floor(30000/ne));if(z<1)fit=true}
 if(fit){z=cw/ne;if(z>=4)z=Math.floor(z)}
 pvDraw(cv,a,{s0:0,ne,z,h:170,ruler:24,fs:12});
 if(lab)lab.textContent=(fit?'Fit width · ':'')+(+z.toFixed(2))+' px / end · '+ne.toLocaleString()+' ends'}
window.addEventListener('resize',()=>{clearTimeout(window._rz);window._rz=setTimeout(()=>{if($('#pcv'))patLive();if($('#simcv'))simDraw()},150)});
/* ---------- peg plan ---------- */
const pgParse=t=>[...new Set(String(t).split(/[\s,.;]+/).map(Number).filter(x=>Number.isInteger(x)&&x>=pegLo()&&x<=S.peg.shafts))].sort((a,b)=>a-b);
function pegTable(){const g=S.peg;let h='<table><tr><th>Lift</th><th>Pick</th>'+pegList().map(x=>`<th>${x}</th>`).join('')+'<th>Count</th><th>Shafts (type here)</th><th>Actions</th></tr>';
 g.picks.forEach((pk,i)=>{const set=new Set(pk),pl=g.perLift,end=(i+1)%pl===0||i===g.picks.length-1;
  h+=`<tr class="${end?'pg-end':''}">`+((i%pl===0)?`<td class="pg-n" rowspan="${Math.min(pl,g.picks.length-i)}">${Math.floor(i/pl)+1}</td>`:'')+`<td class="pg-n">${i%pl+1}</td>`;
  for(const x of pegList())h+=`<td class="pg-g${set.has(x)?' on':''}" data-i="${i}" data-s="${x}">${set.has(x)?x:''}</td>`;
  h+=`<td class="pg-c" data-pgc="${i}">${pk.length}</td><td class="pg-t"><input type="text" data-pgt="${i}" value="${pk.join(', ')}" aria-label="Shafts for pick ${i+1}"></td>`+
   `<td class="pg-a"><button data-a="pgup" data-i="${i}" title="Move up">↑</button><button data-a="pgdn" data-i="${i}" title="Move down">↓</button><button data-a="pgdup" data-i="${i}" title="Duplicate">⧉</button><button data-a="pgins" data-i="${i}" title="Insert blank below">＋</button><button data-a="pgdel" data-i="${i}" title="Delete" style="color:var(--madder)">✕</button></td></tr>`});
 return h+'</table>'+(g.picks.length?'':'<div class="empty">No picks yet. Press “+ Add pick”, or load the sample.</div>')}
const pegHTML=()=>{const g=S.peg;return `<p class="sub" style="margin:0 0 8px">Click a cell to raise/lower a shaft, or type shaft numbers (e.g. 2,3,5,6) in the box on each row.</p>
 <div class="bar"><label>Design name <input type="text" id="pgtitle" style="width:170px" value="${esc(g.title)}" placeholder="${esc(S.name)||'Peg plan'}"></label>
 <label>Weave type <select id="pgtype" title="Dobby design: design starts from shaft 3 (shafts 1 and 2 skipped). Plain: all shafts are used."><option value="dobby"${g.type==='dobby'?' selected':''}>Dobby design</option><option value="plain"${g.type==='dobby'?'':' selected'}>Plain</option></select></label>
 <label>Shafts <input type="number" id="pgs" min="${g.type==='dobby'?3:1}" max="64" value="${g.shafts}"></label><label>Picks per lift <input type="number" id="pgl" min="1" max="64" value="${g.perLift}"></label>
 <label>Number of lifts <input type="number" id="pgnl" min="0" max="500" value="${Math.ceil(g.picks.length/g.perLift)}"></label><button class="pb" data-a="pgsetl" style="background:var(--teal);color:#fff;border-color:var(--teal)" title="Add blank lifts or remove extra lifts so the plan has exactly this many">Set lifts</button></div>
 <div class="bar"><button class="pb" data-a="pgadd" style="background:var(--teal);color:#fff;border-color:var(--teal)">+ Add pick</button><button class="pb" data-a="pgaddl">+ Add lift</button><button class="pb d" data-a="pgclear">Clear all</button></div>
 <div class="bar"><button class="pb" data-a="pgprint">Print…</button><button class="pb" data-a="pgpdf">Save PDF…</button><button class="pb" data-a="pgdl">Download file (.json)</button><button class="pb" data-a="pgul">Open file…</button><button class="pb" data-a="pgcopy">Copy as text</button><input type="file" id="pgfile" accept=".json,application/json" hidden></div>
 <div class="pg-wrap" id="pegtbl">${pegTable()}</div>`};
const pegRender=()=>{$('#pegtbl').innerHTML=pegTable();const e=$('#pgnl');if(e&&document.activeElement!==e)e.value=Math.ceil(S.peg.picks.length/S.peg.perLift);save()};
const pegText=()=>{const g=S.peg;return (g.title||S.name||'Peg plan')+' – Peg Plan\n'+g.picks.map((pk,i)=>`${Math.floor(i/g.perLift)+1}.${i%g.perLift+1} --> ${pk.join(', ')}`).join('\n')+'\n'+g.picks.length+' Picks'};
function pegDlg(mode){const g=S.peg;if(!g.picks.length)return alert('Add some picks first.');const nl=Math.ceil(g.picks.length/g.perLift);
 mdl(`<h2 style="margin:0 0 4px">Peg plan – ${mode=='pdf'?'Save PDF':'Print'}</h2><p class="sub">Choose how many lifts and which shafts to include.</p>
 <div class="pgo-r"><label>From lift<input type="number" id="pgo-a" min="1" max="${nl}" value="1"></label><label>To lift<input type="number" id="pgo-b" min="1" max="${nl}" value="${nl}"></label><span class="sub">of ${nl} lifts</span></div>
 <div><b>Shafts to show</b> <button class="pb" data-a="pgoall">All</button> <button class="pb" data-a="pgonone">None</button> <button class="pb" data-a="pgoused">Used only</button></div>
 <div class="pgo-sh">${pegList().map(x=>`<label><input type="checkbox" data-pgsh="${x}" checked>${x}</label>`).join('')}</div>
 <div class="bar" style="margin:14px 0 0"><button class="btn p" data-a="pgogo" data-m="${mode}">${mode=='pdf'?'Save PDF':'Print'}</button><button class="btn" data-a="mclose">Cancel</button></div>`)}
function pegPrint(o){o=o||{};const g=S.peg;if(!g.picks.length)return alert('Add some picks first.');
 const pl=g.perLift,nl=Math.ceil(g.picks.length/pl),la=Math.max(1,Math.min(nl,+o.from||1)),lb=Math.max(la,Math.min(nl,+o.to||nl)),sel=(o.shafts&&o.shafts.length?o.shafts:pegList()).slice().sort((x,y)=>x-y),ss=new Set(sel),i0=(la-1)*pl,i1=Math.min(g.picks.length,lb*pl);
 let h=`<div class="hd"><div><h3>Dharm Textiles</h3><div>Peg plan${g.title||S.name?' – '+esc(g.title||S.name):''}</div></div><div style="text-align:right">Date: ${D()}<br>${g.type==='dobby'?'Dobby design · shafts 3–'+g.shafts+' · ':''}${sel.length===pegList().length?pegList().length+' shafts':sel.length+' of '+pegList().length+' shafts'} · ${i1-i0} picks · ${lb-la+1} lifts${la>1||lb<nl?' (lift '+la+' to '+lb+' of '+nl+')':''}</div></div><table><tr><th>Lift</th><th>Pick</th>`+sel.map(x=>`<th>${x}</th>`).join('')+'<th>Shafts</th></tr>';
 for(let i=i0;i<i1;i++){const pk=g.picks[i],set=new Set(pk),end=(i+1)%pl===0||i===i1-1;
  h+=`<tr class="${end?'e':''}">`+((i%pl===0)?`<td class="l" rowspan="${Math.min(pl,i1-i)}">${Math.floor(i/pl)+1}</td>`:'')+`<td class="l">${i%pl+1}</td>`;
  sel.forEach(x=>{h+=`<td class="${set.has(x)?'on':''}">${set.has(x)?x:''}</td>`});h+=`<td class="sh">${pk.filter(x=>ss.has(x)).join(', ')}</td></tr>`}
 $('#pegsheet').innerHTML=h+'</table>';finishOut('pp','#pegsheet','Peg-plan-'+(g.title||S.name||''))}
window.addEventListener('afterprint',()=>document.body.classList.remove('pp'));
const PG={
 pgadd(){S.peg.picks.push([]);pegRender()},
 pgaddl(){const g=S.peg,r=g.picks.length%g.perLift,k=r?g.perLift-r:g.perLift;for(let i=0;i<k;i++)g.picks.push([]);pegRender()},
 pgclear(){if(confirm('Remove all picks?')){S.peg.picks=[];pegRender()}},
 pgsample(){if(!S.peg.picks.length||confirm('Replace the current peg plan with the sample?')){{const t=S.peg.type;S.peg=pegSample();S.peg.type=t||'plain';pegFix()}$('#peg').innerHTML=pegHTML();save()}},
 pgup(d){const P=S.peg.picks,i=+d.i;if(i>0)[P[i-1],P[i]]=[P[i],P[i-1]];pegRender()},
 pgdn(d){const P=S.peg.picks,i=+d.i;if(i<P.length-1)[P[i+1],P[i]]=[P[i],P[i+1]];pegRender()},
 pgdup(d){const P=S.peg.picks,i=+d.i;P.splice(i+1,0,[...P[i]]);pegRender()},
 pgins(d){S.peg.picks.splice(+d.i+1,0,[]);pegRender()},
 pgdel(d){S.peg.picks.splice(+d.i,1);pegRender()},
 pgprint(){pegDlg('print')},pgpdf(){pegDlg('pdf')},
 pgoall(){document.querySelectorAll('#mdl [data-pgsh]').forEach(c=>c.checked=true)},pgonone(){document.querySelectorAll('#mdl [data-pgsh]').forEach(c=>c.checked=false)},
 pgoused(){const u=new Set(S.peg.picks.flat());document.querySelectorAll('#mdl [data-pgsh]').forEach(c=>c.checked=u.has(+c.dataset.pgsh))},
 pgogo(d){const nl=Math.ceil(S.peg.picks.length/S.peg.perLift),a=parseInt($('#pgo-a').value)||1,b=parseInt($('#pgo-b').value)||nl,sh=[...document.querySelectorAll('#mdl [data-pgsh]')].filter(c=>c.checked).map(c=>+c.dataset.pgsh);
  if(!sh.length)return alert('Select at least one shaft.');if(a>b)return alert('"From lift" cannot be more than "To lift".');mclose();OUTMODE=d.m==='pdf'?'pdf':'print';pegPrint({from:a,to:b,shafts:sh})},
 pgsetl(){const g=S.peg,k=Math.max(0,Math.min(500,parseInt($('#pgnl').value)||0)),need=k*g.perLift;
  if(need<g.picks.length){if(g.picks.slice(need).some(p=>p.length)&&!confirm('Lift '+(k+1)+' onwards has shaft data and will be removed. Continue?')){$('#pgnl').value=Math.ceil(g.picks.length/g.perLift);return}g.picks.length=need}
  else while(g.picks.length<need)g.picks.push([]);
  $('#pgnl').value=k;pegRender()},
 pgdl(){const g=S.peg,a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(g,null,1)],{type:'application/json'}));a.download=((g.title||S.name||'pegplan').replace(/\W+/g,'_'))+'_pegplan.json';a.click()},
 pgul(){$('#pgfile').click()},
 pgcopy(){const t=pegText();if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>alert('Peg plan copied.'),()=>prompt('Copy this text:',t));else prompt('Copy this text:',t)}};
document.addEventListener('click',e=>{const g=e.target.closest&&e.target.closest('td.pg-g');if(!g)return;const i=+g.dataset.i,x=+g.dataset.s,pk=S.peg.picks[i],k=pk.indexOf(x);
 if(k>=0)pk.splice(k,1);else{pk.push(x);pk.sort((a,b)=>a-b)}pegRefresh(i);save()});
function pegRefresh(i){const pk=S.peg.picks[i];document.querySelectorAll(`td.pg-g[data-i="${i}"]`).forEach(td=>{const x=+td.dataset.s,on=pk.includes(x);td.classList.toggle('on',on);td.textContent=on?x:''});
 const c=document.querySelector(`[data-pgc="${i}"]`);if(c)c.textContent=pk.length;const t=document.querySelector(`[data-pgt="${i}"]`);if(t&&document.activeElement!==t)t.value=pk.join(', ')}
document.addEventListener('change',e=>{const t=e.target;if(!t.closest||!t.closest('.peg'))return;const g=S.peg;
 if(t.id==='pgtype'){const nt=t.value==='dobby'?'dobby':'plain';
  if(nt==='dobby'&&g.picks.some(pk=>pk.some(x=>x<3))&&!confirm('Dobby design starts from shaft 3. Shafts 1 and 2 will be removed from the peg plan. Continue?')){t.value=g.type==='dobby'?'dobby':'plain';return}
  g.type=nt;pegFix();$('#peg').innerHTML=pegHTML();save()}
 else if(t.id==='pgs'){const k=Math.max(pegDobby()?3:1,Math.min(64,+t.value||1));if(g.picks.some(pk=>pk.some(x=>x>k))&&!confirm('Shafts above '+k+' will be removed. Continue?')){t.value=g.shafts;return}g.shafts=k;g.picks=g.picks.map(pk=>pk.filter(x=>x<=k));t.value=k;pegRender()}
 else if(t.id==='pgl'){g.perLift=Math.max(1,Math.min(64,+t.value||1));t.value=g.perLift;pegRender()}
 else if(t.dataset.pgt!==undefined){const i=+t.dataset.pgt;g.picks[i]=pgParse(t.value);t.value=g.picks[i].join(', ');pegRefresh(i);save()}
 else if(t.id==='pgfile'){const f=t.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);if(!Array.isArray(o.picks))throw 0;S.peg={title:o.title||'',type:o.type==='dobby'?'dobby':'plain',shafts:o.shafts||13,perLift:o.perLift||2,picks:o.picks.map(pk=>pk.map(Number))};pegFix();$('#peg').innerHTML=pegHTML();save()}catch(x){alert('This file is not a valid peg plan file.')}};r.readAsText(f);t.value=''}});
document.addEventListener('input',e=>{if(e.target.id==='pgtitle'){S.peg.title=e.target.value;save()}});

/* ---------- weaving drawing (dobby) ---------- */
const drLab={name:'Design name',shaft:'Shaft',reed:'Reed space',reed2:'Reed/2 in',epi:'Avg. EPI',dent:'Total dent',pick:'Pick',ppi:'Avg. PPI',ends:'Total ends'};
const drInk=c=>{const k=parseInt(String(c).slice(1),16)||0;return(((k>>16)&255)*299+((k>>8)&255)*587+(k&255)*114)/1000>150?'#111':'#fff'};
const drBlk=()=>({r:[''],e:1,d:1,p:[{n:1,y:S.pat.yarns[0].id}],x:1,rep:''});
function drYo(sel){return S.pat.yarns.map(y=>`<option value="${y.id}"${y.id===sel?' selected':''}>${esc(y.name)}</option>`).join('')}
const drArr=(bi,ri)=>String(S.draw.b[bi].r[ri]||'').split(/[\s,]+/).filter(Boolean);
const drN=()=>Math.max(1,S.peg.shafts-pegLo()+1);
function drChips(bi,ri){const N=drN(),v=drArr(bi,ri);return v.length?v.map((x,k)=>`<button type="button" class="sc${+x>N?' bad':''}" data-a="dsrm" data-b="${bi}" data-r="${ri}" data-k="${k}" title="${+x>N?'Shaft '+x+' is not in the Peg plan. ':''}Click to remove">${esc(x)}</button>`).join(''):'<em>Click shaft numbers below</em>'}
function drSeq(bi,ri){const N=drN(),at=`data-b="${bi}" data-r="${ri}"`;
 return `<div class="dr-chips" data-ch="${bi}-${ri}">${drChips(bi,ri)}</div><div class="dr-pal">${Array.from({length:N},(_,i)=>`<button type="button" data-a="dsadd" ${at} data-s="${i+1}">${i+1}</button>`).join('')}<button type="button" class="u" data-a="dsback" ${at} title="Remove last shaft">⌫</button><button type="button" class="u" data-a="dsclr" ${at}>Clear</button></div>`}
const drSet=(bi,ri,arr)=>{S.draw.b[bi].r[ri]=arr.join(' ');const c=document.querySelector(`[data-ch="${bi}-${ri}"]`);if(c)c.innerHTML=drChips(bi,ri);save()};
function drTable(){const D=S.draw;if(!D.b.length)return '<div class="empty">No blocks yet. Press “+ Add block”, or load the sample.</div>';
 return '<table class="dr-t"><thead><tr><th>Block</th><th>Shaft <small style="font-weight:400">(from Peg plan: 1–'+drN()+(pegDobby()?' = shaft 3–'+S.peg.shafts:'')+')</small></th><th>Ends</th><th>Dent</th><th>Pattern</th><th>Repeat</th><th></th></tr></thead><tbody>'+D.b.map((b,bi)=>b.r.map((r,ri)=>{
  let h=`<tr class="${ri?'':'dr-first'}">`+(ri?'':`<td rowspan="${b.r.length}" class="dr-bn">${bi+1}</td>`)+`<td><div class="dr-seq">${drSeq(bi,ri)}</div></td>`;
  if(!ri){const rs=b.r.length;
   h+=`<td rowspan="${rs}"><input type="number" data-db="${bi}" data-df="e" value="${esc(b.e)}"></td><td rowspan="${rs}"><input type="number" data-db="${bi}" data-df="d" value="${esc(b.d)}"></td>
<td rowspan="${rs}" class="${b.x>1?'hasx':''}"><span class="br">[</span>${b.p.map((q,qi)=>{const c=pYb(q.y).color,k=drInk(c);return `<span class="chip" style="border-color:${c};background:${c};color:${k}"><input type="number" min="1" data-db="${bi}" data-dq="${qi}" data-df="n" value="${esc(q.n)}"><select data-db="${bi}" data-dq="${qi}" data-df="y" style="background:${c};color:${k}">${drYo(q.y)}</select><button data-a="dqdel" data-b="${bi}" data-i="${qi}">×</button></span>`}).join('')}<span class="br">]</span>
 <button class="pb" data-a="dqadd" data-b="${bi}">+</button> ×<input class="dr-x" type="number" min="1" data-db="${bi}" data-df="x" value="${esc(b.x)}"></td>
<td rowspan="${rs}"><input type="number" data-db="${bi}" data-df="rep" value="${esc(b.rep)}"></td>
<td rowspan="${rs}"><div class="dr-act">${[['dbup','↑','Move up'],['dbdn','↓','Move down'],['dradd','+row','Add shaft row'],['drdel','−row','Remove last row'],['dbdup','⧉','Duplicate block'],['dbnew','+blk','Add block below'],['dbdel','✕','Delete block']].map(a=>`<button class="pb" data-a="${a[0]}" data-b="${bi}" title="${a[2]}">${a[1]}</button>`).join('')}</div></td>`}
  return h+'</tr>'}).join('')).join('')+'</tbody></table>'}
const drHTML=()=>{const D=S.draw,c=D.cols;if(c.block===undefined)c.block=1;D.p.shaft=S.peg.shafts;const ck=(k,l)=>`<label class="ck"><input type="checkbox" data-dc="${k}" ${c[k]?'checked':''}>${l}</label>`;
 return `<div class="dr-top"><div class="bar"><button class="btn" data-a="dback">← Back to calculator</button><button class="btn" data-a="dsave">Save quality</button><button class="btn p" data-a="dprint">Print</button><button class="btn p" data-a="dpdf">Save PDF</button>
  <span style="width:10px"></span><span style="color:var(--mut)">Print:</span>${ck('params','Design details')}${ck('yarns','Yarn list')}${ck('block','Block no.')}${ck('shaft','Shaft')}${ck('ends','Ends')}${ck('dent','Dent')}${ck('pattern','Pattern')}${ck('repeat','Repeat')}</div></div>
 <div class="card"><div class="dr-params">${Object.keys(drLab).map(k=>k=='shaft'?`<label title="Taken from Warp → Peg plan${pegDobby()?'. Dobby design: drawing shaft 1 = shaft 3, 2 = 4 and so on':''}">Shaft (from Peg plan)<input value="${S.peg.shafts}" readonly style="background:#eef2f7"></label>`:`<label class="${k=='name'?'wide':''}">${drLab[k]}<input data-dp="${k}" value="${esc(D.p[k])}" ${k=='name'?`placeholder="${esc(S.name)}"`:''}></label>`).join('')}</div>
 <div class="bar"><button class="pb" data-a="dfill">Fill from calculator</button><button class="pb" data-a="dclear" style="color:var(--madder)">Clear drawing</button></div></div>
 <div class="card"><b>Yarns</b> <small style="color:var(--mut)">— add or rename them in the Warp rows of the calculator</small>
 <table class="dr-yt"><tr><th>Colour</th><th>Name</th><th>Total ends</th></tr>${S.pat.yarns.map((y,i)=>{const w=S.warps.find(r=>r.yid===y.id);return `<tr><td><input type="color" data-dyc="${i}" value="${y.color}" style="width:44px;height:28px;padding:1px"></td><td>${esc(y.name)}</td><td>${pFx(n(w&&w.ends))}</td></tr>`}).join('')}</table></div>
 <div class="card"><div class="bar"><button class="pb" data-a="dbadd" style="background:var(--teal);color:#fff;border-color:var(--teal)">+ Add block</button><label class="dr-cnt">Number of blocks <input type="number" id="dbn" min="0" max="500" value="${D.b.length}"></label><button class="pb" data-a="dbset" title="Open blank blocks, or remove extra blocks from the end, so there are exactly this many">Set blocks</button></div><div class="dr-wrap" id="drtbl">${drTable()}</div>
 <div class="bar"><button class="pb" data-a="dbadd" style="background:var(--teal);color:#fff;border-color:var(--teal)">+ Add block</button></div></div>`};
const vDraw=()=>`<h1>Weaving drawing (dobby)</h1><p class="sub">Shaft sequence, ends, dent and yarn pattern per block. Yarns and colours come from your Warp rows.</p><div id="drw" class="drw">${drHTML()}</div>`;
const drRender=()=>{$('#drtbl').innerHTML=drTable();const e=$('#dbn');if(e&&document.activeElement!==e)e.value=S.draw.b.length;save()};
function drRecolor(){document.querySelectorAll('.drw .chip').forEach(ch=>{const sl=ch.querySelector('select'),q=S.draw.b[+sl.dataset.db]?.p[+sl.dataset.dq];if(!q)return;const c=pYb(q.y).color,k=drInk(c);ch.style.borderColor=c;ch.style.background=c;ch.style.color=k;sl.style.background=c;sl.style.color=k})}
function drPrint(){const D=S.draw,c=D.cols;if(c.block===undefined)c.block=1;const Y=S.pat.yarns,nm=D.p.name||S.name;D.p.shaft=S.peg.shafts;
 let h=`<div class="hd"><div><h3>Dharm Textiles</h3><div>Weaving drawing${nm?' – '+esc(nm):''}</div></div><div style="text-align:right">Date: ${D2()}${pegDobby()?'<br>Dobby design: drawing shaft 1 = shaft 3, 2 = shaft 4 …':''}</div></div>`;
 if(c.params){const ks=Object.keys(drLab).filter(k=>k!='name');h+='<table>';for(let i=0;i<ks.length;i+=3)h+='<tr>'+ks.slice(i,i+3).map(k=>`<th style="width:12%">${drLab[k]}</th><td style="width:21%">${esc(D.p[k])}</td>`).join('')+'</tr>';h+='</table>'}
 if(c.yarns)h+='<table style="width:auto"><tr><th>Colour</th><th>Yarn</th><th>Total ends</th></tr>'+Y.map(y=>{const w=S.warps.find(r=>r.yid===y.id);return `<tr><td><span class="sw" style="background:${y.color}"></span></td><td>${esc(y.name)}</td><td>${pFx(n(w&&w.ends))}</td></tr>`}).join('')+'</table>';
 if(['block','shaft','ends','dent','pattern','repeat'].some(k=>c[k])&&D.b.length){
  h+='<table><tr>'+[['block','Block'],['shaft','Shaft'],['ends','Ends'],['dent','Dent'],['pattern','Pattern'],['repeat','Repeat']].filter(a=>c[a[0]]).map(a=>`<th>${a[1]}</th>`).join('')+'</tr>';
  D.b.forEach((b,bi)=>{const rows=c.shaft?b.r.length:1;for(let ri=0;ri<rows;ri++){h+=`<tr class="${ri?'':'f'}">`;if(!ri&&c.block)h+=`<td rowspan="${rows}" style="text-align:center;font-weight:700">${bi+1}</td>`;if(c.shaft)h+=`<td class="mono">${esc(b.r[ri])}</td>`;
   if(!ri){const t=(k,v)=>c[k]?`<td rowspan="${rows}">${v}</td>`:'';
    h+=t('ends',esc(b.e))+t('dent',esc(b.d))+t('pattern',(b.x>1?'[ ':'')+b.p.map(q=>{const col=pYb(q.y).color;return `<span class="pc" style="background:${col};color:${drInk(col)}">${esc(q.n)} ${esc(pYb(q.y).name)}</span>`}).join(' ')+(b.x>1?` ] × ${esc(b.x)}`:''))+t('repeat',esc(b.rep))}
   h+='</tr>'}});h+='</table>'}
 $('#drawsheet').innerHTML=h;finishOut('pd','#drawsheet','Weaving-drawing-'+nm)}
const D2=()=>new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
window.addEventListener('afterprint',()=>document.body.classList.remove('pd'));
function drSample(){const GM={G:'dg',V:'dv',R:'dr'};
 const B=(r,e,d,p,x,rep)=>({r:[...r],e,d,p:p.split(' ').map(t=>({n:parseInt(t),y:GM[t.slice(-1)]})),x,rep});
 const A='1G 1V 1G 1V',P36r=['3 4 5','6 7 8','3 6 5','4 8 7','5 4 3','6 7 8','3 4 7','6 8 5','3 7 4','8 6 5','7 8 6','3 5 4'],P66r=P36r.concat(['7 3 8','4 6 5','8 3 7','6 4 5','3 6 8','4 7 5','6 4 3','5 8 7','4 6 3','8 5 7']);
 const H=()=>[B(['1 9 2 9'],4,1,A,1,2),B(['1 2'],2,1,'2G',1,2),B(['1 9 2 9','1 10 2 10','1 11 2 11','1 12 2 12','1 11 2 11','1 10 2 10'],24,6,A,6,2),B(['1 9 2 9','1 10 2 10','1 11 2 11','1 12 2 12','1 11 2 11'],20,5,A,5,''),B(['1 2'],2,1,'2G',1,2),B(['1 9 2 9'],4,1,A,1,2)];
 const M=rep=>[B(['1 13 2 13','1 14 2 14','1 15 2 15','1 16 2 16'],16,4,A,4,rep),B(['1 16 2'],3,1,'1G 1R 1G',1,''),B(['1 16 2 16','1 15 2 15','1 14 2 14','1 13 2 13'],16,4,A,4,'')];
 const mid=()=>[...M(5),B(['1 2'],4,2,'4G',1,''),B(['3 4 5','6 7 8','3 6 5','4 8 7'],12,4,'12G',1,''),...M('')];
 const P=()=>B(P36r,36,12,'36G',1,''),S6=()=>B(['1 2 1 2 1 2'],6,1,'6G',1,30);
 return{b:[S6(),...H(),P(),...mid(),P(),...H(),B(P66r,66,22,'66G',1,87),...H(),P(),...mid(),P(),...H(),S6()],p:{name:'15-DULL MOSS PASARAI',shaft:16,reed:52.05,reed2:'88/2/3/4/6',epi:138.21,dent:2290,pick:66,ppi:66,ends:7194}}}
const DR={
 dqadd(d){S.draw.b[+d.b].p.push({n:1,y:S.pat.yarns[0].id});drRender()},dqdel(d){S.draw.b[+d.b].p.splice(+d.i,1);drRender()},
 dradd(d){S.draw.b[+d.b].r.push('');drRender()},drdel(d){const r=S.draw.b[+d.b].r;if(r.length>1)r.pop();drRender()},
 dbdup(d){const B=S.draw.b;B.splice(+d.b+1,0,JSON.parse(JSON.stringify(B[+d.b])));drRender()},dbdel(d){S.draw.b.splice(+d.b,1);drRender()},
 dbnew(d){S.draw.b.splice(+d.b+1,0,drBlk());drRender()},dbadd(){S.draw.b.push(drBlk());drRender()},
 dbup(d){const B=S.draw.b,i=+d.b;if(i>0)[B[i-1],B[i]]=[B[i],B[i-1]];drRender()},dbdn(d){const B=S.draw.b,i=+d.b;if(i<B.length-1)[B[i+1],B[i]]=[B[i],B[i+1]];drRender()},
 dclear(){if(confirm('Clear all drawing blocks and details?')){const c=S.draw.cols;S.draw=drDef();S.draw.cols=c;$('#drw').innerHTML=drHTML();save()}},
 dfill(){const c=calc(),t=pCalc(S.pat.tree),du=Math.ceil(t.d-1e-9),D=S.draw;D.p.ends=c.ends||'';D.p.dent=du||'';D.p.reed=du?+(du/(S.pat.reed||100)*2).toFixed(2):'';D.p.pick=c.picks||'';D.p.ppi=c.picks||'';D.p.shaft=S.peg.picks.length?S.peg.shafts:D.p.shaft;D.p.epi=n(S.panno)?+(c.ends/n(S.panno)).toFixed(2):D.p.epi;$('#drw').innerHTML=drHTML();save()},
 dsample(){if(!confirm('Load the 15-Dull Moss sample? This replaces your Warp rows (3 yarns) and the drawing.'))return;
  S.warps=[['GROUND',6822,'dg','#c9b79c'],['VISCOSE',360,'dv','#d97757'],['REMBO',12,'dr','#2f7d6d']].map(a=>Object.assign(wr(),{name:a[0],ends:a[1],yid:a[2]}));syncPat();
  [['dg','#c9b79c'],['dv','#d97757'],['dr','#2f7d6d']].forEach(a=>{const y=S.pat.yarns.find(z=>z.id===a[0]);if(y)y.color=a[1]});
  const sm=drSample(),c=S.draw.cols;S.draw={b:sm.b,p:sm.p,cols:c};if(S.peg.shafts<16+(pegDobby()?2:0))S.peg.shafts=16+(pegDobby()?2:0);save();render()},
 dsadd(d){const a=drArr(+d.b,+d.r);a.push(d.s);drSet(+d.b,+d.r,a)},dsback(d){const a=drArr(+d.b,+d.r);a.pop();drSet(+d.b,+d.r,a)},dsclr(d){drSet(+d.b,+d.r,[])},dsrm(d){const a=drArr(+d.b,+d.r);a.splice(+d.k,1);drSet(+d.b,+d.r,a)},
 dbset(){const B=S.draw.b,k=Math.max(0,Math.min(500,parseInt($('#dbn').value)||0));
  if(k<B.length){if(B.slice(k).some(b=>b.r.some(r=>String(r).trim()))&&!confirm('Block '+(k+1)+' onwards has shaft data and will be removed. Continue?')){$('#dbn').value=B.length;return}B.length=k}
  else while(B.length<k)B.push(drBlk());
  $('#dbn').value=k;drRender()},
 dprint(){OUTMODE='print';drPrint()},dpdf(){OUTMODE='pdf';drPrint()}};
document.addEventListener('input',e=>{const t=e.target;if(!t.closest||!t.closest('.drw')||t.dataset.dc)return;const d=t.dataset,D=S.draw;
 if(d.dp)D.p[d.dp]=t.value;
 else if(d.dyc!==undefined){S.pat.yarns[+d.dyc].color=t.value;drRecolor()}
 else if(d.db!==undefined){const b=D.b[+d.db];
  if(d.dr!==undefined)b.r[+d.dr]=t.value;
  else if(d.dq!==undefined){const q=b.p[+d.dq];if(d.df==='y'){q.y=t.value;drRecolor()}else q.n=t.value}
  else{b[d.df]=t.value;if(d.df==='x')t.closest('td').classList.toggle('hasx',+t.value>1)}}
 save()});
document.addEventListener('change',e=>{const t=e.target;if(t.dataset&&t.dataset.dc&&t.closest('.drw')){S.draw.cols[t.dataset.dc]=t.checked?1:0;save()}});

/* ---------- weft lattice ---------- */
const lcode=i=>{let t='',k=i;do{t=String.fromCharCode(65+k%26)+t;k=Math.floor(k/26)-1}while(k>=0);return t};
function syncLat(){const L=S.lat;S.wefts.forEach(r=>{if(!r.yid)r.yid=uid()});const ids=S.wefts.map(r=>r.yid);L.rows=L.rows.filter(r=>ids.includes(r.y));
 S.wefts.forEach((r,i)=>{if(!L.cols[r.yid])L.cols[r.yid]=PAL[(i+3)%PAL.length]})}
const lYarns=(q=S)=>q.wefts.map((r,i)=>({id:r.yid,name:(r.name||'').trim()||('Weft '+(i+1)),color:(q.lat.cols||{})[r.yid]||'#999',code:lcode(i)}));
const lPicks=(L,id)=>L.rows.filter(r=>r.y===id).reduce((a,r)=>a+(+r.p||0),0);
function lStrip(Y){return '<div class="l-strip">'+S.lat.rows.map(r=>{const y=Y.find(z=>z.id===r.y),c=y?y.color:'#999';return `<div style="height:${Math.max(24,Math.round((+r.p||0)*6))}px;background:${c};color:${drInk(c)}">${r.p} picks - ${y?y.code:'?'}</div>`}).join('')+'</div>'}
function lText(Y){const L=S.lat,l=['Weft yarns:'].concat(Y.map(y=>'  '+y.code+' = '+y.name));l.push('','Weft lattice:');
 L.rows.forEach((r,i)=>{const y=Y.find(z=>z.id===r.y);l.push('  '+(i+1)+'. '+r.p+' picks - '+(y?y.code:'?'))});
 l.push('','Sequence: '+L.rows.map(r=>{const y=Y.find(z=>z.id===r.y);return r.p+(y?y.code:'?')}).join(' , '));return l.join('\n')}
const latHTML=()=>{const Y=lYarns(),L=S.lat;
 return `<p class="sub" style="margin:0 0 8px">Picks and yarn sequence for the weft. Yarns come from your Weft rows (add or rename them on the Weft tab).</p>
 <b>Weft yarns</b><table class="l-t"><tr><th>Code</th><th>Yarn</th><th>Colour</th></tr>${Y.map((y,i)=>`<tr><td><b>${y.code}</b></td><td>${esc(y.name)}</td><td><input type="color" data-lc="${y.id}" value="${y.color}"></td></tr>`).join('')}</table>
 <b>Lattice (picks &amp; yarn)</b><table class="l-t"><tr><th>#</th><th>No. of picks</th><th>Yarn</th><th></th></tr>${L.rows.map((r,i)=>`<tr><td>${i+1}</td><td><input type="number" min="1" step="1" data-lp="${i}" value="${r.p}"></td><td><select data-ly="${i}">${Y.map(y=>`<option value="${y.id}"${y.id===r.y?' selected':''}>${y.code} - ${esc(y.name)}</option>`).join('')}</select></td><td><button class="pb" style="color:var(--madder)" data-a="lrdel" data-i="${i}">Delete</button></td></tr>`).join('')}</table>
 <div class="bar"><button class="pb" data-a="lradd" style="background:var(--teal);color:#fff;border-color:var(--teal)">+ Add lattice row</button><button class="pb" data-a="lprint">Print lattice</button><button class="pb" data-a="lpdf">Save PDF</button><button class="pb" data-a="lcopy">Copy</button><span class="p-tot" id="ltot"></span></div>
 <div style="font-size:12px;color:var(--mut)">Preview (top to bottom, repeats from the top):</div><div id="lstrip"></div>
 <div class="p-card"><b>Summary</b><div id="lsum" style="margin-top:6px"></div><pre id="ltxt"></pre></div>`};
function latLive(){if(!$('#lat'))return;const Y=lYarns(),L=S.lat,tp=L.rows.reduce((a,r)=>a+(+r.p||0),0);
 $('#ltot').textContent='Total picks per repeat: '+tp;$('#lstrip').innerHTML=lStrip(Y);
 $('#lsum').innerHTML=Y.map(y=>{const k=lPicks(L,y.id);return `<div><span class="p-sw" style="background:${y.color}"></span> ${y.code} (${esc(y.name)}): ${k} picks${tp?' ('+(k*100/tp).toFixed(1)+'%)':''}</div>`}).join('');
 $('#ltxt').textContent=lText(Y)}
const latRender=()=>{$('#lat').innerHTML=latHTML();latLive();save()};
function lPrint(){const Y=lYarns(),L=S.lat,tp=L.rows.reduce((a,r)=>a+(+r.p||0),0);if(!L.rows.length)return alert('Add a lattice row first.');
 $('#latsheet').innerHTML=`<div class="hd"><div><h3>Dharm Textiles</h3><div>Weft lattice${S.name?' – '+esc(S.name):''}</div></div><div style="text-align:right">Date: ${D2()}</div></div>
 <b>Weft yarns</b><table><tr><th>Code</th><th>Yarn</th><th>Colour</th></tr>${Y.map(y=>`<tr><td>${y.code}</td><td>${esc(y.name)}</td><td><span class="p-sw" style="background:${y.color};-webkit-print-color-adjust:exact;print-color-adjust:exact"></span></td></tr>`).join('')}</table>
 <b>Lattice</b><table><tr><th>#</th><th>Picks</th><th>Yarn</th></tr>${L.rows.map((r,i)=>{const y=Y.find(z=>z.id===r.y);return `<tr><td>${i+1}</td><td>${r.p}</td><td>${y?y.code+' - '+esc(y.name):'?'}</td></tr>`}).join('')}</table>
 <p>Total picks per repeat: <b>${tp}</b></p>${Y.map(y=>{const k=lPicks(L,y.id);return `<div>${y.code} (${esc(y.name)}): ${k} picks${tp?' ('+(k*100/tp).toFixed(1)+'%)':''}</div>`}).join('')}
 <b style="display:block;margin-top:10px">Preview (top to bottom, repeats from the top)</b>${lStrip(Y)}`;finishOut('pl','#latsheet','Weft-lattice-'+(S.name||''),'rl')}
window.addEventListener('afterprint',()=>document.body.classList.remove('pl'));
const LT={
 lradd(){const Y=lYarns();if(!Y.length)return;S.lat.rows.push({p:1,y:Y[0].id});latRender()},
 lrdel(d){S.lat.rows.splice(+d.i,1);latRender()},
 lprint(){OUTMODE='print';lPrint()},lpdf(){OUTMODE='pdf';lPrint()},
 lcopy(){const t=lText(lYarns());if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>alert('Copied.'),()=>prompt('Copy this text:',t));else prompt('Copy this text:',t)},
 ftab(d){S.ftab=d.t;render()}};
document.addEventListener('input',e=>{const t=e.target;if(!t.closest||!t.closest('.lat'))return;const d=t.dataset,L=S.lat;
 if(d.lc!==undefined)L.cols[d.lc]=t.value;
 else if(d.lp!==undefined)L.rows[+d.lp].p=Math.max(0,parseInt(t.value)||0);
 else if(d.ly!==undefined)L.rows[+d.ly].y=t.value;
 latLive();save()});

/* ---------- fabric simulation (warp pattern + peg plan + weft lattice) ---------- */
const simDef=()=>({start:1,ends:0,pstart:1,reps:0,lines:1,cs:0,back:0,draft:'draw'});
const simGet=()=>{if(!S.sim)S.sim=simDef();const m=S.sim;if(m.reps===undefined)m.reps=0;if(m.ends===undefined)m.ends=0;if(m.lines===undefined)m.lines=1;return m};
const simRGB=h=>{const k=parseInt(String(h).slice(1),16)||0;return[(k>>16)&255,(k>>8)&255,k&255]};
const simCache={};
function simTile(col,type,cs){const key=col+type+cs;if(simCache[key])return simCache[key];
 const c=document.createElement('canvas');c.width=c.height=cs;const x=c.getContext('2d'),[r,g,b]=simRGB(col);
 const sh=m=>{const q=v=>Math.max(0,Math.min(255,Math.round(v*m)));return `rgb(${q(r)},${q(g)},${q(b)})`};
 const gr=type==='w'?x.createLinearGradient(0,0,cs,0):x.createLinearGradient(0,0,0,cs);
 gr.addColorStop(0,sh(.6));gr.addColorStop(.5,sh(1.2));gr.addColorStop(1,sh(.6));x.fillStyle=gr;x.fillRect(0,0,cs,cs);
 const ga=type==='w'?x.createLinearGradient(0,0,0,cs):x.createLinearGradient(0,0,cs,0);
 ga.addColorStop(0,'rgba(0,0,0,.3)');ga.addColorStop(.3,'rgba(0,0,0,0)');ga.addColorStop(.7,'rgba(0,0,0,0)');ga.addColorStop(1,'rgba(0,0,0,.3)');
 x.fillStyle=ga;x.fillRect(0,0,cs,cs);return simCache[key]=c}
function simData(){const sm=simGet(),P=S.pat,t=pCalc(P.tree),Y=lYarns();let warp=[];
 if(t.e>0&&t.e<=200000)pFlat(P.tree,warp);warp=warp.map(id=>pYb(id).color);
 const wseq=[];S.lat.rows.forEach(r=>{const y=Y.find(z=>z.id===r.y);for(let i=0;i<(+r.p||0);i++)wseq.push(y?y.color:'#999')});
 if(!wseq.length)wseq.push(Y[0]?Y[0].color:'#999');
 let draft=[];if(sm.draft==='draw')S.draw.b.forEach(b=>b.r.forEach(r=>String(r).split(/[\s,]+/).map(Number).filter(v=>v>0).forEach(v=>draft.push(v))));
 const dsrc=draft.length?'drawing':'straight';if(!draft.length)for(let i=pegLo();i<=Math.max(pegLo(),S.peg.shafts);i++)draft.push(i);
 if(!warp.length){const c=P.yarns[0]?P.yarns[0].color:'#999';warp=draft.map(()=>c)}
 if(pegDobby()&&dsrc==='drawing')draft=draft.map(v=>v+2);
 return{warp,wseq,draft,dsrc,peg:pegDobby()?S.peg.picks.map(pk=>pk.filter(x=>x>2)):S.peg.picks}}
const PZ=[1,2,3,4,6,8,12,16,24,32];
function zStep(cur,fitPx,dir,min){const L=PZ.filter(v=>v>=min),base=cur>0?cur:fitPx;
 if(dir>0)return L.find(v=>v>base+1e-6)||L[L.length-1];
 const p=[...L].reverse().find(v=>v<base-1e-6);return p&&p>fitPx?p:0}
function wrapW(el){if(!el)return 900;const c=getComputedStyle(el);return Math.max(300,el.clientWidth-parseFloat(c.paddingLeft||0)-parseFloat(c.paddingRight||0)-2)}
function simGeom(cw,csd){const sm=simGet(),d=simData(),NP=Math.max(1,d.peg.length),tot=d.warp.length,s0=Math.max(1,Math.min(tot,+sm.start||1))-1;
 let ne=+sm.ends>0?Math.min(tot-s0,+sm.ends):tot-s0,clip='';if(ne>16000){ne=16000;clip='Showing the first 16,000 ends.'}ne=Math.max(1,ne);
 cw=cw||wrapW($('#simwrap'));csd=csd||(+sm.cs>0?+sm.cs:cw/ne);const p0=Math.max(1,+sm.pstart||1)-1;let np;
 if(+sm.reps>0)np=Math.round(sm.reps)*NP;else{const target=Math.min(.35*cw,600);np=Math.max(2*NP,Math.ceil(target/csd/NP)*NP)}
 const cap=Math.max(1,Math.floor(3e7/ne));if(np>cap){np=Math.max(1,cap);clip=(clip?clip+' ':'')+'Picks limited to '+np+' to keep the view fast.'}
 return{sm,d,NP:d.peg.length,tot,s0,ne,p0,np,clip}}
function simFitPx(){return wrapW($('#simwrap'))/simGeom().ne}
function simShrink(src,tw){let cur=src;while(cur.width>tw*2){const c=document.createElement('canvas');c.width=Math.ceil(cur.width/2);c.height=Math.ceil(cur.height/2);const x=c.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(cur,0,0,c.width,c.height);cur=c}
 const c=document.createElement('canvas');c.width=Math.max(1,tw);c.height=Math.max(1,Math.round(cur.height*tw/cur.width));const x=c.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(cur,0,0,c.width,c.height);return c}
function simDraw(cv0,o){const cv=cv0||$('#simcv');if(!cv)return;o=o||{};const sm=simGet(),msg=cv0?{}:$('#simmsg'),cw=o.cw||(cv0?900:wrapW($('#simwrap'))),fit=!!o.fit||!(+o.cs||+sm.cs>0);
 const G=simGeom(cw,o.cs||(fit?undefined:+sm.cs)),{d,NP,tot}=G;
 if(!NP){cv.width=cv.height=1;if(!cv0)msg.innerHTML='<span class="bad">No peg plan yet.</span> Add picks in Warp → Peg plan (or upload a PDF), then come back.';return}
 const s0=o.s0!==undefined?o.s0:G.s0,ne=o.ne!==undefined?o.ne:G.ne,p0=o.p0!==undefined?o.p0:G.p0,np=o.np!==undefined?o.np:G.np;
 let cs;if(fit){const c=cw/ne;cs=c>=2?Math.min(40,Math.floor(c)):1}else cs=Math.max(1,Math.min(40,+o.cs||+sm.cs));
 while((ne*cs>16000||np*cs>16000||ne*cs*np*cs>1.2e8)&&cs>1)cs--;
 const W=ne*cs,Hh=np*cs;cv.width=W;cv.height=Hh;const x=cv.getContext('2d'),sets=d.peg.map(pk=>new Set(pk));let up=0;
 if(cs<4){const img=x.createImageData(W,Hh),u=new Uint32Array(img.data.buffer),px32=h=>{const[r,g,b]=simRGB(h);return(255<<24)|(b<<16)|(g<<8)|r},wc32=d.warp.map(px32),fc32=d.wseq.map(px32);
  for(let j=0;j<np;j++){const pj=p0+j,set=sets[pj%NP],fcol=fc32[pj%fc32.length],y0=(np-1-j)*cs;
   for(let i=0;i<ne;i++){const ei=s0+i,raised=set.has(d.draft[ei%d.draft.length]);if(raised)up++;const col=(sm.back?!raised:raised)?wc32[ei]:fcol,x0=(sm.back?ne-1-i:i)*cs;
    for(let yy=0;yy<cs;yy++){const r=(y0+yy)*W+x0;for(let xx=0;xx<cs;xx++)u[r+xx]=col}}}
  x.putImageData(img,0,0)}
 else{x.fillStyle='#111';x.fillRect(0,0,W,Hh);
  for(let j=0;j<np;j++){const pj=p0+j,set=sets[pj%NP],wc=d.wseq[pj%d.wseq.length],y=(np-1-j)*cs;
   for(let i=0;i<ne;i++){const ei=s0+i,raised=set.has(d.draft[ei%d.draft.length]);if(raised)up++;const u=sm.back?!raised:raised,px=(sm.back?ne-1-i:i)*cs;x.drawImage(u?simTile(d.warp[ei],'w',cs):simTile(wc,'f',cs),px,y)}}}
 let f=1;if(fit&&cs===1&&W>cw*1.001){const c=simShrink(cv,Math.round(cw));f=c.width/W;cv.width=c.width;cv.height=c.height;cv.getContext('2d').drawImage(c,0,0)}
 const x2=cv.getContext('2d');
 if(sm.lines&&np>NP&&cs*f>=0.5){x2.save();x2.strokeStyle='rgba(255,255,255,.8)';x2.lineWidth=1;x2.setLineDash([5,4]);for(let j=1;j<np;j++)if((p0+j)%NP===0){const yy=Math.round((np-j)*cs*f)+.5;x2.beginPath();x2.moveTo(0,yy);x2.lineTo(cv.width,yy);x2.stroke()}x2.restore()}
 if(cv0)return;cv.style.width='';
 const pc=(up*100/(ne*np)),face=sm.back?100-pc:pc,w=[],shown=cs*f;
 if(d.dsrc==='drawing'&&d.draft.length!==tot)w.push(`Drawing has ${d.draft.length} ends but the warp pattern has ${tot}; the draft repeats to fit.`);if(G.clip)w.push(G.clip);
 msg.innerHTML=`<div class="p-stats"><div class="p-stat">Total warp ends<b>${tot.toLocaleString()}</b></div><div class="p-stat">Draft source<b>${d.dsrc=='drawing'?'Drawing':'Straight'}</b></div><div class="p-stat">Peg plan type<b>${pegDobby()?'Dobby (drawing shaft 1 = shaft 3)':'Plain (all shafts)'}</b></div><div class="p-stat">Peg picks / weft picks<b>${NP} / ${d.wseq.length}</b></div><div class="p-stat">Showing<b>${ne.toLocaleString()} ends × ${np.toLocaleString()} picks</b></div><div class="p-stat">Peg plan repeats<b>${+(np/NP).toFixed(2)}${+sm.reps>0?'':' (auto)'}</b></div><div class="p-stat">Zoom<b>${fit?'Fit · ':''}${+shown.toFixed(2)} px/thread</b></div><div class="p-stat">Warp on ${sm.back?'back':'face'}<b>${face.toFixed(0)}%</b></div></div>`+(w.length?`<div class="bad" style="margin-bottom:6px">${w.join(' ')}</div>`:'')}
const simGcd=(a,b)=>b?simGcd(b,a%b):a;
const SM={
 simzin(){const sm=simGet();sm.cs=zStep(+sm.cs||0,simFitPx(),1,2);render()},
 simzout(){const sm=simGet();sm.cs=zStep(+sm.cs||0,simFitPx(),-1,2);render()},
 simzfit(){simGet().cs=0;render()},
 simrep(){const d=simData(),NP=d.peg.length||1,L=d.wseq.length,l=NP/simGcd(NP,L)*L,sm=simGet();sm.reps=Math.max(1,Math.round(l/NP));sm.pstart=1;render()},
 simall(){const sm=simGet();sm.start=1;sm.ends=0;sm.reps=0;sm.cs=0;render()},
 simdl(){const cv=$('#simcv');cv.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=((S.name||'fabric').replace(/\W+/g,'_'))+'_simulation.png';a.click()})}};
const vSim=()=>{const sm=simGet(),N=(k,l,mn)=>`<label>${l}<input type="number" min="${mn}" step="1" style="width:90px" data-sm="${k}" value="${sm[k]}"></label>`;
 return `<h1>Fabric simulation</h1><p class="sub">Weave preview built from the Warp pattern (colours), Peg plan (lifts) and Weft lattice (pick colours). Pick 1 is at the bottom. All ends are shown by default and Fit width squeezes the whole fabric into the screen. Use Zoom in / Zoom out to see it bigger; leave Ends shown empty for all ends. The peg plan repeats automatically; leave Peg plan repeats empty to let it fill the view, or type a number. Warp shows where its shaft is raised in the peg plan; otherwise the weft shows.</p>
 <div class="card"><div class="bar">${N('start','First end','1')}<label>Ends shown<input type="number" min="0" step="1" style="width:90px" data-sm="ends" placeholder="All" value="${sm.ends||''}"></label>${N('pstart','First pick','1')}<label>Peg plan repeats<input type="number" min="0" step="1" style="width:90px" data-sm="reps" placeholder="Auto" value="${sm.reps||''}"></label><label>Zoom (px / thread)<input type="number" min="0" step="1" style="width:90px" data-sm="cs" placeholder="Fit" value="${sm.cs||''}"></label>
 <label style="display:flex;gap:6px;align-items:center;padding-top:16px"><input type="checkbox" data-sm="lines" style="width:auto;margin:0" ${sm.lines?'checked':''}> Mark repeats</label>
 <label>Side<select data-sm="back" style="display:block;padding:7px"><option value="0"${sm.back?'':' selected'}>Face</option><option value="1"${sm.back?' selected':''}>Back</option></select></label>
 <label>Draft<select data-sm="draft" style="display:block;padding:7px"><option value="draw"${sm.draft=='draw'?' selected':''}>From Weaving drawing</option><option value="straight"${sm.draft=='straight'?' selected':''}>Straight draw</option></select></label></div>
 <div class="bar"><button class="btn" data-a="simall">Full fabric (all ends)</button><button class="btn" data-a="simrep">Full pick repeat</button><button class="btn" data-a="simzout">− Zoom out</button><button class="btn" data-a="simzin">+ Zoom in</button><button class="btn" data-a="simzfit">Fit width</button><button class="btn p" data-a="simdl">Download PNG</button><button class="btn p" data-a="report" data-only="sim">Print / PDF</button></div><div id="simmsg"></div></div>
 <div class="card" id="simwrap" style="overflow:auto;background:#111"><canvas id="simcv" style="display:block"></canvas></div>`};
document.addEventListener('input',e=>{const t=e.target;if(!t.dataset||t.dataset.sm===undefined)return;const sm=simGet(),k=t.dataset.sm;
 sm[k]=k==='draft'?t.value:k==='back'?+t.value:k==='lines'?(t.checked?1:0):k==='cs'||k==='ends'||k==='reps'?Math.max(0,parseInt(t.value)||0):Math.max(1,parseInt(t.value)||1);simDraw();save()});

/* ---------- modal helpers ---------- */
const mdl=h=>{let m=$('#mdl');if(!m){m=document.createElement('div');m.id='mdl';document.body.appendChild(m)}m.innerHTML='<div class="box">'+h+'</div>'};
const mclose=()=>{const m=$('#mdl');if(m)m.remove()};
const loadScript=u=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=u;s.onload=ok;s.onerror=()=>no(new Error('Could not load a helper library (internet connection needed for PDF/image reading).'));document.head.appendChild(s)});
/* ---------- print vs PDF output ---------- */
let OUTMODE='print',CAP=false;
const HTML2PDF='https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
const pdfName=t=>(String(t||'Dharm-Textiles').replace(/[^\w\-]+/g,'_').replace(/^_+|_+$/g,'')||'Dharm-Textiles')+'.pdf';
const JSPDF='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
async function toPdf(html,cls,name){
 const bar=document.createElement('div');bar.id='pdfbusy';bar.textContent='Making PDF…';document.body.appendChild(bar);let box,wrap;const sy=window.scrollY;
 try{
  if(!window.html2pdf)await loadScript(HTML2PDF);
  if(!(window.jspdf&&window.jspdf.jsPDF))await loadScript(JSPDF);
  window.scrollTo(0,0);
  box=document.createElement('div');box.className=(cls?cls+' ':'')+'sheet';
  box.style.cssText='width:max-content;min-width:700px;max-width:none;background:#fff;color:#0b1b2b;padding:0;margin:0;border:0;box-shadow:none';
  wrap=document.createElement('div');wrap.style.cssText='position:fixed;left:-30000px;top:0;background:#fff';
  box.innerHTML=html;wrap.appendChild(box);document.body.appendChild(wrap);await new Promise(r=>setTimeout(r,250));
  const W=Math.max(700,Math.ceil(box.scrollWidth)),H=Math.ceil(box.scrollHeight),mmW=194,k=mmW/W,pageH=Math.floor(W*281/194);
  /* page breaks: only between table rows / tiles / sections, never through the middle of one */
  const t0=box.getBoundingClientRect().top,cand=[],forced=[];
  const grp=box.querySelector('tr.f')?'tr.f':box.querySelector('tr.e')?'tr':'';
  box.querySelectorAll((grp&&grp!=='tr'?grp:'tr')+',.tile,.rs').forEach(e=>{if(e.tagName==='TR'&&grp==='tr'&&e.previousElementSibling&&!e.previousElementSibling.classList.contains('e'))return;const y=Math.round(e.getBoundingClientRect().top-t0);if(y>0){cand.push(y);if(e.classList.contains('rs'))forced.push(y)}});
  const bands=[];let st=0;
  while(st<H-1){const lim=st+pageH,f=forced.find(y=>y>st+1&&y<=lim);let en;
   if(f)en=f;else if(H<=lim)en=H;else{const c=cand.filter(y=>y>st+pageH*.4&&y<=lim);en=c.length?Math.max(...c):lim}
   bands.push([st,en]);st=en}
  const sc=Math.max(1,Math.min(2,Math.sqrt(3.5e6/(W*pageH)))),pdf=new window.jspdf.jsPDF({unit:'mm',format:'a4',orientation:'portrait'});
  for(let i=0;i<bands.length;i++){const a=bands[i][0],e=bands[i][1];bar.textContent='Making PDF… page '+(i+1)+' of '+bands.length;
   const cv=await html2pdf().set({html2canvas:{scale:sc,y:a,height:e-a,backgroundColor:'#ffffff',useCORS:true,scrollX:0,scrollY:0}}).from(box).toCanvas().get('canvas');
   if(i)pdf.addPage();pdf.addImage(cv.toDataURL('image/jpeg',.92),'JPEG',8,8,mmW,(e-a)*k)}
  pdf.save(name);
 }catch(err){alert('Could not make the PDF: '+(err&&err.message||err)+'\n\nThe PDF maker needs an internet connection the first time it loads.')}
 finally{if(wrap)wrap.remove();bar.remove();window.scrollTo(0,sy)}}
function finishOut(cls,sel,title,pcls){if(CAP){document.body.classList.remove(cls);return}
 const m=OUTMODE;OUTMODE='print';const el=$(sel);
 if(m==='pdf'){toPdf(el.innerHTML,pcls||el.className.replace(/\bsheet\b/,'').trim(),pdfName(title));return}
 document.body.classList.add(cls);window.print()}
function outAll(title){const m=OUTMODE;OUTMODE='print';const el=$('#allsheet');
 if(m==='pdf'){toPdf(el.innerHTML,'',pdfName(title));return}
 document.body.classList.add('pa');setTimeout(()=>window.print(),200)}
async function fmlPdf(){const f=patFormula(S.pat.tree);if(!f||!f.rows)return alert('Add yarns with ends in the Warp pattern first.');
 const bar=document.createElement('div');bar.id='pdfbusy';bar.textContent='Making PDF…';document.body.appendChild(bar);
 try{
  if(!(window.jspdf&&window.jspdf.jsPDF))await loadScript(JSPDF);
  const pdf=new window.jspdf.jsPDF({unit:'mm',format:'a4'}),T=t=>String(t==null?'':t).replace(/[–—]/g,'-').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[^\x20-\xFF]/g,'?'),PX=0.3527778;
  const base=0.2646,sc=Math.min(base*1.25,186/f.w,190/f.h),ox=12,oy=34,fs=px=>px*sc/PX,X=x=>ox+x*sc,Y=y=>oy+y*sc;
  const nm=S.pat.name||S.name||'';
  pdf.setTextColor(11,27,43);pdf.setFont('helvetica','bold');pdf.setFontSize(17);pdf.text('Dharm Textiles',12,16);
  pdf.setFont('helvetica','normal');pdf.setFontSize(10);pdf.text(T('Warp pattern formula'+(nm?' - '+nm:'')),12,22);pdf.text('Date: '+D(),198,16,{align:'right'});
  pdf.setDrawColor(11,27,43);pdf.setLineWidth(.5);pdf.line(12,26,198,26);
  const RH=f.RH;
  f.rows.forEach(r=>{const cy=r.y+RH/2;
   pdf.setFillColor(r.c);pdf.setDrawColor(85,85,85);pdf.setLineWidth(.15);pdf.roundedRect(X(0),Y(cy-6),12*sc,12*sc,.5,.5,'FD');
   pdf.setTextColor(17,17,17);pdf.setFont('helvetica','bold');pdf.setFontSize(fs(15));pdf.text(T(r.name),X(f.NX),Y(cy+5));pdf.text(T(r.num),X(f.NUMR),Y(cy+5),{align:'right'});
   if(r.sub){pdf.setFont('helvetica','normal');pdf.setFontSize(fs(12));pdf.setTextColor(85,85,85);pdf.text(T(r.sub),X(f.NUMR+10),Y(cy+4))}});
  const Q=(a,b,c)=>{const o=[];for(let i=1;i<=6;i++){const t=i/6,u=1-t;o.push([u*u*a[0]+2*u*t*b[0]+t*t*c[0],u*u*a[1]+2*u*t*b[1]+t*t*c[1]])}return o};
  f.br.forEach(b=>{const x=f.xs?f.xs[b.L]:0,y1=b.y1+4,y2=b.y2-4,ym=(y1+y2)/2,q=Math.max(2,Math.min(10,(y2-y1)/4)),bw=8;
   const pts=[[x,y1],...Q([x,y1],[x+bw,y1],[x+bw,y1+q]),[x+bw,ym-q],...Q([x+bw,ym-q],[x+bw,ym],[x+bw*2,ym]),...Q([x+bw*2,ym],[x+bw,ym],[x+bw,ym+q]),[x+bw,y2-q],...Q([x+bw,y2-q],[x+bw,y2],[x,y2])];
   pdf.setDrawColor(34,34,34);pdf.setLineWidth(1.3*sc);const d=[];for(let i=1;i<pts.length;i++)d.push([(pts[i][0]-pts[i-1][0])*sc,(pts[i][1]-pts[i-1][1])*sc]);
   pdf.lines(d,X(pts[0][0]),Y(pts[0][1]),[1,1],'S',false);
   pdf.setTextColor(17,17,17);pdf.setFont('helvetica','bold');pdf.setFontSize(fs(15));pdf.text(T(b.lab),X(x+bw*2+10),Y(ym+5))});
  pdf.setDrawColor(153,153,153);pdf.setLineWidth(.2);pdf.line(X(0),Y(f.ty-6),X(f.NUMR),Y(f.ty-6));
  pdf.setTextColor(17,17,17);pdf.setFont('helvetica','bold');pdf.setFontSize(fs(15));pdf.text('TOTAL ENDS',X(f.NX),Y(f.ty+RH/2+1));pdf.text(T(pFx(f.total)),X(f.NUMR),Y(f.ty+RH/2+1),{align:'right'});
  /* total ends per yarn */
  const P=S.pat,m={},md={};pTally(P.tree,m,1);pTallyD(P.tree,md,1);const ys=P.yarns.filter(y=>(m[y.id]||0)>0);
  let y=oy+f.h*sc+12;const need=()=>{if(y>275){pdf.addPage();y=20}};
  if(ys.length){need();pdf.setTextColor(11,27,43);pdf.setFont('helvetica','bold');pdf.setFontSize(10);pdf.text('Total ends per yarn',12,y);y+=3;
   const row=(a,b,c,hd,col)=>{need();pdf.setFillColor(hd?'#e8edf3':'#ffffff');pdf.setDrawColor(200,208,218);pdf.setLineWidth(.2);pdf.rect(12,y,186,7,'FD');
    if(col){pdf.setFillColor(col);pdf.setDrawColor(85,85,85);pdf.rect(15,y+1.9,4,3.2,'FD')}
    pdf.setFont('helvetica',hd?'bold':'normal');pdf.setFontSize(10);pdf.setTextColor(17,17,17);pdf.text(T(a),col?22:15,y+4.8);pdf.text(T(b),140,y+4.8,{align:'right'});pdf.text(T(c),192,y+4.8,{align:'right'});y+=7};
   row('Yarn','Total ends','Dents',1);let te=0,td=0;ys.forEach(yy=>{te+=m[yy.id]||0;td+=md[yy.id]||0;row(yy.name,pFx(m[yy.id]),pFx(md[yy.id]||0),0,yy.color)});row('Total',pFx(te),pFx(td),1);y+=8}
  need();pdf.setFont('helvetica','normal');pdf.setFontSize(8.5);pdf.setTextColor(80,80,80);
  pdf.text(pdf.splitTextToSize('Each row shows the yarn, its ends and how many ends go in one dent. The number after a bracket is how many times the yarns inside it repeat, then "= total ends" of that bracket (for example 24 = 144 means 24 repeats make 144 ends). A bigger bracket repeats the smaller ones inside it.',186),12,y);
  pdf.save(pdfName('Warp-formula-'+nm));
 }catch(err){alert('Could not make the PDF: '+(err&&err.message||err)+'\n\nThe PDF maker needs an internet connection the first time it loads.')}
 finally{bar.remove()}}
function outFml(m){if(m==='pdf')return fmlPdf();const h=repFml();if(!h||!patFormula(S.pat.tree))return alert('Add yarns with ends in the Warp pattern first.');
 $('#allsheet').innerHTML='<div class="rs">'+h+'</div>';OUTMODE=m;outAll('Warp-formula-'+(S.name||''))}
function pdfView(){const s=document.querySelector('#app .sheet');if(!s)return;const c=s.cloneNode(true),a=s.querySelectorAll('input,textarea'),b=c.querySelectorAll('input,textarea');
 a.forEach((e,i)=>{if(b[i]&&b[i].tagName==='INPUT')b[i].setAttribute('value',e.value)});c.querySelectorAll('.bar').forEach(x=>x.remove());
 toPdf(c.innerHTML,c.className.replace(/\bsheet\b/,'').trim(),pdfName((view=='job'?'Job-card-':'Cost-sheet-')+(S.name||'')))}
const PDFJS='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/',TESS='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';

/* ---------- print / PDF report ---------- */
const rh=t=>'<div class="hd"><div><h3>Dharm Textiles</h3><div>'+t+(S.name?' – '+esc(S.name):'')+'</div></div><div style="text-align:right">Date: '+D()+'</div></div>';
const inner=(h,mk)=>{const i=h.indexOf(mk);return h.slice(i+mk.length,h.lastIndexOf('</div>'))};
function capSheet(fn,sel,cls){CAP=true;try{fn()}finally{CAP=false;document.body.classList.remove(cls)}return $(sel).innerHTML}
const RPW=680,RPH=820;
function repWarp(z){const P=S.pat,t=pCalc(P.tree),m={},md={};pTally(P.tree,m,1);pTallyD(P.tree,md,1);const du=Math.ceil(t.d-1e-9),rc=P.reed||100;let img='';
 if(t.e>0&&t.e<=200000){const a=patFlat(),tot=a.length,mk=(s0,ne,zz,h,ru,fs)=>{const cv=document.createElement('canvas');pvDraw(cv,a,{s0,ne,z:zz,h,ruler:ru,fs});return cv};let note='';
  let zp=z==='fit'?0:+z;if(zp&&Math.ceil(tot/Math.max(1,Math.floor(RPW/zp)))>60){zp=0;note='Zoom too large for this many ends; printed to fit the page width instead.'}
  if(!zp){const rz=Math.floor(1600/tot),zz=rz>=1?rz:1600/tot,W=Math.round(tot*zz),k=RPW/W,cv=mk(0,tot,zz,Math.round(44/k),Math.round(22/k),Math.round(11/k));img=`<div class="tile"><small>All ${tot.toLocaleString()} ends · fit to page width</small><img src="${cv.toDataURL()}" style="width:${RPW}px"></div>`}
  else{const E=Math.max(1,Math.floor(RPW/zp));for(let s=0;s<tot;s+=E){const ne=Math.min(E,tot-s),cv=mk(s,ne,zp,60,22,11);img+=`<div class="tile"><small>Ends ${s+1} – ${s+ne} · zoom ${zp} px per end</small><img src="${cv.toDataURL()}"></div>`}}
  img='<div style="margin:8px 0"><b>Warp pattern preview</b>'+(note?` <small>${note}</small>`:'')+img+'</div>'}
 return rh('Warp pattern')+`<table><tr><th>Total ends</th><th>Total dents</th><th>Reed dents</th><th>Reed count</th><th>Reed space</th></tr><tr><td>${pFx(t.e)}</td><td>${pFx(t.d)}</td><td>${du}</td><td>${rc}</td><td>${pFx(+(du/rc*2).toFixed(2))} in</td></tr></table>${img}
 <b>Formula</b>${fmlHTML(680,620,1)}
 <table><tr><th>Yarn</th><th>Pattern ends</th><th>Dents</th></tr>${P.yarns.map(y=>`<tr><td><span class="p-sw" style="background:${y.color};-webkit-print-color-adjust:exact;print-color-adjust:exact"></span> ${esc(y.name)}</td><td>${pFx(m[y.id]||0)}</td><td>${pFx(md[y.id]||0)}</td></tr>`).join('')}</table>`}
function repSim(z){const fitG=simGeom(1400,1400/Math.max(1,simGeom().ne)),sm=simGet(),NP=fitG.NP;if(!NP)return '';let zp=z==='fit'?0:Math.max(1,+z),note='',h='',G=fitG;
 if(zp){G=simGeom(RPW,zp);const E=Math.max(1,Math.floor(RPW/zp)),Pk=Math.max(1,Math.floor(RPH/zp));if(Math.ceil(G.ne/E)*Math.ceil(G.np/Pk)>60){zp=0;G=fitG;note=' Zoom too large for this size; printed to fit the page instead.'}}
 const {ne,np,s0,p0}=G;
 if(!zp){const cv=document.createElement('canvas');simDraw(cv,{fit:true,cw:1400,np:G.np});const k=Math.min(RPW/cv.width,RPH/cv.height);
  h=`<div class="tile"><small>All ${ne.toLocaleString()} ends (${s0+1} – ${s0+ne}) · Picks ${p0+1} – ${p0+np} · fit to page</small><img src="${cv.toDataURL()}" style="width:${Math.round(cv.width*k)}px"></div>`}
 else{const E=Math.max(1,Math.floor(RPW/zp)),Pk=Math.max(1,Math.floor(RPH/zp)),cx=Math.ceil(ne/E),cy=Math.ceil(np/Pk);
  for(let b=cy-1;b>=0;b--)for(let c0=0;c0<cx;c0++){const c=sm.back?cx-1-c0:c0,e0=c*E,ee=Math.min(E,ne-e0),q0=b*Pk,qq=Math.min(Pk,np-q0),cv=document.createElement('canvas');
   simDraw(cv,{s0:s0+e0,ne:ee,p0:p0+q0,np:qq,cs:zp});h+=`<div class="tile"><small>Ends ${s0+e0+1} – ${s0+e0+ee} · Picks ${p0+q0+1} – ${p0+q0+qq} · zoom ${zp} px per thread</small><img src="${cv.toDataURL()}"></div>`}}
 return rh('Fabric simulation')+h+`<p style="font-size:12px">${sm.back?'Back':'Face'} view · pick 1 at the bottom${note}${G.clip?' '+G.clip:''}</p>`}
function repPrint(mode){const o={};document.querySelectorAll('#mdl [data-rp]').forEach(c=>o[c.dataset.rp]=c.checked);document.querySelectorAll('#mdl [data-rz]').forEach(c=>o['z'+c.dataset.rz]=c.value);mclose();const sec=[];
 try{
 if(o.cost)sec.push(inner(vSheet(),'<div class="sheet">'));
 if(o.warp)sec.push(repWarp(o.zwarp));
 if(o.fml)sec.push(repFml());
 if(o.peg&&S.peg.picks.length)sec.push('<div class="pgp">'+capSheet(pegPrint,'#pegsheet','pp')+'</div>');
 if(o.draw&&S.draw.b.length)sec.push('<div class="dp">'+capSheet(drPrint,'#drawsheet','pd')+'</div>');
 if(o.lat&&S.lat.rows.length)sec.push('<div class="rl">'+capSheet(lPrint,'#latsheet','pl')+'</div>');
 if(o.sim&&S.peg.picks.length)sec.push(repSim(o.zsim));
 if(o.yarn)sec.push(rh('Yarn requirement')+yarnRes());
 if(o.job)sec.push('<div class="jc">'+inner(vJob(),'<div class="sheet jc">')+'</div>');
 }catch(err){alert('Could not build the report: '+err.message);return}
 if(!sec.length)return alert('Nothing to print: select sections that have data.');
 $('#allsheet').innerHTML=sec.map(h=>'<div class="rs">'+h+'</div>').join('');OUTMODE=mode==='pdf'?'pdf':'print';outAll('Report-'+(S.name||''))}
window.addEventListener('afterprint',()=>document.body.classList.remove('pa'));
function repDialog(d){const only=d&&d.only,it=[['cost','Cost sheet (yarn spec, factory cost, profit)',1],['warp','Warp pattern (preview, formula, ends per yarn)',1],['fml','Warp pattern formula only (bracket diagram)',0],['peg','Peg plan',1],['draw','Weaving drawing',1],['lat','Weft lattice',1],['sim','Fabric simulation picture',1],['yarn','Yarn requirement (order planning)',0],['job','Job card slip',0]];
 const zo=cur=>['fit',1,2,3,4,6,8,12,16,24,32].map(v=>`<option value="${v}"${(v==='fit'?!(+cur>0):v==+cur)?' selected':''}>${v==='fit'?'Fit page width':'Zoom '+v+' px'}</option>`).join('');
 const zs={warp:S.pz,sim:simGet().cs};
 mdl(`<h2 style="margin:0 0 4px">Print / PDF report</h2><p class="sub">Choose what goes into the report. Each section starts on a new page. “Print” opens the printer window; “Save PDF” downloads a PDF file directly.</p>${it.map(a=>`<label class="mk"><input type="checkbox" data-rp="${a[0]}" ${(only?only===a[0]:a[2])?'checked':''}><span>${a[1]}</span>${zs[a[0]]!==undefined?`<select data-rz="${a[0]}" style="width:auto;padding:4px">${zo(zs[a[0]])}</select>`:''}</label>`).join('')}
 <p class="sub" style="margin:8px 0 0">Zoom for the warp preview and fabric simulation: “Fit page width” prints the whole picture on one page. A bigger zoom prints it larger and splits it into page-size pieces.</p>
 <div class="bar" style="margin:14px 0 0"><button class="btn p" data-a="repprint">Print</button><button class="btn p" data-a="reppdf">Save PDF</button><button class="btn" data-a="mclose">Cancel</button></div>`)}

/* ---------- upload PDF / image and transfer details ---------- */
async function pdfText(file,msg){if(!window.pdfjsLib){await loadScript(PDFJS+'pdf.min.js');pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS+'pdf.worker.min.js'}
 const doc=await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise,out=[];
 for(let p=1;p<=doc.numPages;p++){msg('Reading page '+p+' of '+doc.numPages+'…');const pg=await doc.getPage(p),tc=await pg.getTextContent(),rows=[];
  tc.items.forEach(it=>{if(!it.str.trim())return;const y=it.transform[5],x=it.transform[4];let r=rows.find(r=>Math.abs(r.y-y)<3);if(!r){r={y,a:[]};rows.push(r)}r.a.push([x,it.str])});
  rows.sort((a,b)=>b.y-a.y).forEach(r=>out.push(r.a.sort((a,b)=>a[0]-b[0]).map(z=>z[1].trim()).join(' ')));out.push('')}
 return{text:out.join('\n'),doc}}
async function ocr(src,msg){if(!window.Tesseract)await loadScript(TESS);const r=await Tesseract.recognize(src,'eng',{logger:m=>{if(m.status)msg('Reading text (OCR): '+m.status+' '+Math.round((m.progress||0)*100)+'%')}});return r.data.text}
async function readFile(file,msg){const isPdf=/pdf$/i.test(file.type)||/\.pdf$/i.test(file.name);
 if(!isPdf)return{text:await ocr(file,msg),how:'image (OCR)'};
 const r=await pdfText(file,msg);if(r.text.replace(/\s/g,'').length>40)return{text:r.text,how:'PDF text'};
 let t='';for(let p=1;p<=Math.min(6,r.doc.numPages);p++){msg('Scanned PDF: page '+p+'…');const pg=await r.doc.getPage(p),vp=pg.getViewport({scale:2}),cv=document.createElement('canvas');cv.width=vp.width;cv.height=vp.height;await pg.render({canvasContext:cv.getContext('2d'),viewport:vp}).promise;t+=await ocr(cv,msg)+'\n'}
 return{text:t,how:'scanned PDF (OCR)'}}
function parseDoc(text){const L=text.split(/\n/).map(s=>s.replace(/[–—]/g,'-').replace(/[”″]/g,'"').trim()).filter(Boolean),R={};
 for(const l of L){const m=l.match(/^(.+?)\s*-\s*Peg\s*Plan\b/i)||l.match(/^(?:Peg\s*plan|Weaving drawing|Weft lattice)\s*[-:]?\s+(.+)$/i);
  if(m){const nm=m[1].replace(/^[^\w(]+/,'').replace(/\s+Date:.*$/i,'').replace(/\s+\d+\s*shafts.*$/i,'').trim();if(nm&&!/^dharm/i.test(nm)){R.name=nm;break}}}
 const pk=[];let mp=1,ms=0;
 L.forEach(l=>{const m=l.match(/^(\d+)\s*[.\-]\s*(\d+)\s*(?:-+>|=>|→|:|=)\s*([\d\s,;]+)$/);if(m){const a=m[3].split(/[\s,;]+/).filter(Boolean).map(Number).filter(x=>x>0);pk.push([...new Set(a)].sort((x,y)=>x-y));mp=Math.max(mp,+m[2]);a.forEach(x=>ms=Math.max(ms,x))}});
 let pl=mp;
 if(!pk.length){const hi=L.findIndex(l=>/\bLift\b.*\bPick\b/i.test(l));
  if(hi>=0){const rows=[];let stop=false;L.slice(hi+1).forEach(l=>{if(stop||/[A-Za-z]{3}/.test(l)){stop=true;return}const m=l.match(/((?:\d+\s*,\s*)+\d+)\s*$/);if(!m)return;const a=m[1].split(/\s*,\s*/).map(Number),nums=(l.match(/\d+/g)||[]),ex=nums.length-a.length;rows.push({a:[...new Set(a)].sort((x,y)=>x-y),ex})});
   if(rows.length){let k=0;L.slice(hi+1).some(l=>{if(/[A-Za-z]{3}/.test(l))return true;if(/^\d+$/.test(l)&&+l===k+1)k++;return false});rows.forEach(r=>{pk.push(r.a);r.a.forEach(x=>ms=Math.max(ms,x))});pl=k>1?Math.max(1,Math.round(rows.length/k)):2}}}
 if(pk.length){const dm=text.match(/(\d+)\s*shafts/i);R.peg={title:R.name||'',shafts:Math.max(ms,dm?+dm[1]:0)||8,perLift:Math.max(1,pl),picks:pk}}
 if(/Avg\.?\s*EPI|Total\s*dent|Reed\s*space/i.test(text)){const g=(re)=>{const m=text.match(re);return m?m[1]:''},p={shaft:g(/\bShaft[ \t]*[:=]?[ \t]*(\d+)/i),reed:g(/Reed[ \t]*space[ \t]*[:=]?[ \t]*([\d.]+)/i),reed2:g(/Reed\/2[ \t]*in[ \t]*[:=]?[ \t]*([\d\/.]+)/i),epi:g(/Avg\.?[ \t]*EPI[ \t]*[:=]?[ \t]*([\d.]+)/i),dent:g(/Total[ \t]*dent[ \t]*[:=]?[ \t]*(\d+)/i),pick:g(/Total[ \t]*dent[ \t]*[:=]?[ \t]*\d+[ \t]+Pick[ \t]*[:=]?[ \t]*(\d+)\b/i),ppi:g(/Avg\.?[ \t]*PPI[ \t]*[:=]?[ \t]*([\d.]+)/i),ends:g(/Total[ \t]*ends[ \t]*[:=]?[ \t]*(\d+)/i)};
  if(Object.values(p).filter(Boolean).length>=3)R.draw=p}
 const wm=text.match(/Width:\s*([\d.]+)\s*"/i);if(wm)R.panno=+wm[1];
 const W=[],F=[];
 L.forEach(l=>{let m=l.match(/^Warp\s*\d+(?:\s*-?\s*(.+?))?\s+(\d+)\s*ends\s+([\d.]+)\s*D\s+([\d.]+)\s*%(?:\s+[\d.]+\s+\S?\s*([\d,]+\.?\d*))?/i);
  if(m)return W.push({name:(m[1]||'').replace(/^[^\w(]+/,''),ends:+m[2],den:+m[3],wast:+m[4],rate:m[5]?+m[5].replace(/,/g,''):0});
  m=l.match(/^Weft\s*\d+(?:\s*-?\s*(.+?))?\s+([\d.]+)\s*pick\s+([\d.]+)\s*D\s+([\d.]+)\s*%(?:\s+[\d.]+\s+\S?\s*([\d,]+\.?\d*))?/i);
  if(m)F.push({name:(m[1]||'').replace(/^[^\w(]+/,''),pick:+m[2],den:+m[3],wast:+m[4],rate:m[5]?+m[5].replace(/,/g,''):0})});
 if(W.length)R.warps=W;if(F.length)R.wefts=F;return R}
let IMP=null;
function impDialog(R,how,text){IMP=R;const it=[];
 if(R.name)it.push(['name','Quality name',esc(R.name)]);
 if(R.peg)it.push(['peg','Peg plan',R.peg.picks.length+' picks · '+R.peg.shafts+' shafts · '+R.peg.perLift+' picks per lift → Warp ▸ Peg plan']);
 if(R.draw)it.push(['draw','Drawing details',Object.entries(R.draw).filter(a=>a[1]).map(a=>a[0]+' '+esc(a[1])).join(', ')+' → Weaving drawing']);
 if(R.panno)it.push(['panno','Panno / width',R.panno+'"']);
 if(R.warps)it.push(['warps','Warp rows',R.warps.length+' rows ('+R.warps.reduce((a,r)=>a+r.ends,0)+' ends) – replaces current warp rows']);
 if(R.wefts)it.push(['wefts','Weft rows',R.wefts.length+' rows – replaces current weft rows']);
 mdl(`<h2 style="margin:0 0 4px">Read from file</h2><p class="sub">Source: ${how}. ${it.length?'Tick what to transfer:':'Nothing recognisable was found.'}</p>
 ${it.map(a=>`<label class="mk"><input type="checkbox" data-imp="${a[0]}" checked><span><b>${a[1]}</b><br><small>${a[2]}</small></span></label>`).join('')}
 <details style="margin-top:10px"><summary style="cursor:pointer">Show text that was read</summary><pre style="white-space:pre-wrap;max-height:200px;overflow:auto;font-size:11px;background:#f8fafc;padding:8px;border-radius:6px">${esc(text.slice(0,4000))}</pre></details>
 <div class="bar" style="margin:14px 0 0">${it.length?'<button class="btn p" data-a="impapply">Transfer selected</button>':''}<button class="btn" data-a="mclose">${it.length?'Cancel':'Close'}</button></div>`)}
async function importFile(file){mdl('<h2 style="margin:0 0 6px">Reading “'+esc(file.name)+'”</h2><p id="impmsg" class="sub">Starting…</p>');const msg=t=>{const e=$('#impmsg');if(e)e.textContent=t};
 try{const r=await readFile(file,msg);impDialog(parseDoc(r.text),r.how,r.text)}
 catch(err){mdl('<h2 style="margin:0 0 6px">Could not read this file</h2><p class="bad">'+esc(err.message||err)+'</p><div class="bar"><button class="btn" data-a="mclose">Close</button></div>')}}
document.addEventListener('change',e=>{const t=e.target;if(t.id!=='upl')return;const f=t.files[0];t.value='';if(f)importFile(f)});
const EX={
 mclose,report:repDialog,fmlprint(){outFml('print')},fmlpdf(){outFml('pdf')},repprint(){repPrint('print')},reppdf(){repPrint('pdf')},upload(){$('#upl').click()},
 fmode(d){S.fmode=d.m;render()},pmode(d){S.pmode=d.m;render()},
 impapply(){const R=IMP,on=k=>{const c=document.querySelector('#mdl [data-imp="'+k+'"]');return c&&c.checked};if(!R)return;let go='calc';
  if(on('name'))S.name=R.name;
  if(on('panno'))S.panno=R.panno;
  if(on('warps')){S.warps=R.warps.map(w=>Object.assign(wr(),w));}
  if(on('wefts')){S.wefts=R.wefts.map(w=>Object.assign(wf(),w));}
  if(on('peg')){R.peg.type=S.peg.type||'plain';S.peg=R.peg;pegFix();S.wtab='peg'}
  if(on('draw')){Object.assign(S.draw.p,R.draw);if(!on('peg'))go='calc'}
  mclose();view=go;save();render();
  if(on('draw')&&!on('peg')&&!on('warps')&&!on('wefts')){view='draw';render()}}};
/* ---------- render / update ---------- */
const vWpat=()=>`<div class="dr-top"><div class="bar"><button class="btn" data-a="dback">← Back to calculator</button><input style="width:200px" placeholder="Quality name" data-k="name" data-t="text" value="${esc(S.name)}"><button class="btn" data-a="savq">Save quality</button><button class="btn p" data-a="report" data-only="warp">Print / PDF</button><button class="btn" data-a="fmlprint">Print formula</button><button class="btn" data-a="fmlpdf">Formula PDF</button></div></div>
<h1>Warp pattern</h1><p class="sub">Full page design — yarns and reed from your Warp rows.</p>
<div class="card pvcard"><div class="p-gh"><b style="font-size:15px">Warp pattern preview</b><span class="p-sp"></span><span id="pvz" class="pvz"></span><button class="pb" data-a="pzout">− Zoom out</button><button class="pb" data-a="pzin">+ Zoom in</button><button class="pb" data-a="pzfit">Fit width</button></div><div id="pvw" class="pvw"><canvas id="pcv"></canvas></div></div>
<div class="card"><div id="pat">${patHTML()}</div></div>`;
const V={wpat:vWpat,sim:vSim,draw:vDraw,calc:vCalc,saved:()=>vSaved(),yarn:vYarn,loom:vLoom,sheet:vSheet,job:vJob};
let lastView;
function render(){if(view=='calc'&&S.wtab=='pat')view='wpat';const keep=lastView===view,sy=window.scrollY;lastView=view;syncPat();S.picks=calc().picks;$('#app').innerHTML=V[view]();$('#app').classList.toggle('wide',view=='draw'||view=='wpat');
 document.querySelectorAll('.side [data-v]').forEach(b=>b.classList.toggle('on',b.dataset.v==view||(view=='wpat'&&b.dataset.v=='calc')));$('#qn').textContent=Q.length?`(${Q.length})`:'';update();pclipUpd();if(view=='sim')simDraw();window.scrollTo(0,keep?sy:0)}
function update(){syncPat();const c=calc();S.picks=c.picks;const o={warpW:f(c.warpW,3),weftW:f(c.weftW,3),total:f(c.total,3),warpC:inr(c.warpC)+'/m',weftC:inr(c.weftC)+'/m',glm:f(c.glm,1),gsm:f(c.gsm,1),
 yarn:inr(c.yarn)+'/m',actW:f(c.actW,3),fpm:inr(c.fpm)+'/m',cost:inr(c.cost)+'/m',bill:inr(c.bill)+'/m',profit:inr(c.profit)+'/m',mm:f(c.mm,0),monthly:inr(c.monthly)};
 document.querySelectorAll('[data-o]').forEach(e=>{e.textContent=o[e.dataset.o]});patLive();latLive();
 const p=document.querySelector('[data-o=profit]');if(p)p.className=c.profit<0?'bad':'good';save()}

/* ---------- csv ---------- */
const csvq=s=>'"'+String(s).replace(/"/g,'""')+'"';
function parseCSV(t){const r=[];let row=[],c='',q=false;for(let i=0;i<t.length;i++){const h=t[i];if(q){if(h=='"'){if(t[i+1]=='"'){c+='"';i++}else q=false}else c+=h}else if(h=='"')q=true;else if(h==','){row.push(c);c=''}else if(h=='\n'){row.push(c);r.push(row);row=[];c=''}else if(h!='\r')c+=h}if(c||row.length){row.push(c);r.push(row)}return r}
function dl(name,text){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+text],{type:'text/csv'}));a.download=name;a.click()}
function exportCSV(){const h='Quality,Party,Panno,Warp ends,Weft picks,Fabric weight kg/100m,GLM,GSM,Yarn cost/m,Deal rate,Data';
 dl('Dharm-Textiles-Qualities.csv',[h,...Q.map(x=>{const c=calc(x.s);return [csvq(x.name),csvq(x.s.party),x.s.panno,c.ends,c.picks,f(c.total,3),f(c.glm,1),f(c.gsm,1),f(c.yarn),n(x.s.deal),csvq(JSON.stringify(Object.assign({},x.s,{docs:[],doc:null})))].join(',')})].join('\r\n'))}
function migDoc(o){if(!Array.isArray(o.docs))o.docs=[];if(o.doc&&o.doc.data)o.docs.unshift(o.doc);delete o.doc;o.docs.forEach(d=>{if(!d.id)d.id='f'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);if(d.data){idbPut(d.id,d.data).catch(()=>{});delete d.data}});return o}
function normS(x){const o=migDoc(Object.assign(def(),x||{}));if(!o.pat||!o.pat.tree)o.pat=patDef();if(!o.peg||!o.peg.picks)o.peg=pegDef();if(!o.draw||!o.draw.b)o.draw=drDef();if(!o.lat||!o.lat.rows)o.lat=latDef();return o}
async function backupAll(){try{const cl=o=>JSON.parse(JSON.stringify(o)),cur=cl(S),qs=cl(Q),ids=new Set(),files={};[cur,...qs.map(q=>q.s)].forEach(x=>(x.docs||[]).forEach(d=>ids.add(d.id)));let miss=0;
 for(const id of ids){try{const v=await idbGet(id);if(v)files[id]=v;else miss++}catch(e){miss++}}
 const d={app:'Dharm Textiles',kind:'full-backup',version:3,saved:new Date().toISOString(),current:cur,qualities:qs,files},
 a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(d)],{type:'application/json'}));
 a.download='Dharm-Textiles-Full-Backup-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>alert('Full backup saved: '+Q.length+' saved qualities'+(S.name?' + the open quality "'+S.name+'"':' + the open quality')+' and '+Object.keys(files).length+' attached image/PDF file(s).'+(miss?'\n'+miss+' attached file(s) were missing from this browser and could not be included.':'')+'\nEach one includes warp, weft, costing, warp pattern, peg plan, weaving drawing, weft lattice and simulation settings.'),100)}catch(err){alert('Backup failed (the attached files may be too large for one file): '+err.message)}}
function restoreCSV(text){const rows=parseCSV(text.replace(/^\ufeff/,'')).slice(1);let k=0,bad=0;
 rows.forEach(c=>{if(c.length<11){if(c.join('').trim())bad++;return}let s;try{s=normS(JSON.parse(c[10]))}catch(e){bad++;return}
  const i=Q.findIndex(x=>x.name==c[0]),q={id:Date.now()+k++,name:c[0],party:c[1],s};if(i>=0)Q[i]=q;else Q.push(q)});
 return{k,bad}}
$('#file').onchange=e=>{const fl=e.target.files[0];if(!fl)return;const r=new FileReader();
 r.onload=()=>{try{
  if(/\.json$/i.test(fl.name)||/^\s*\{/.test(r.result)){const d=JSON.parse(r.result);if(!d||!Array.isArray(d.qualities))throw new Error('not a backup');if(d.files)Object.keys(d.files).forEach(id=>idbPut(id,d.files[id]).catch(()=>{}));
   let k=0;d.qualities.forEach(q=>{if(!q||!q.s)return;const s=normS(q.s),i=Q.findIndex(x=>x.name==q.name),n={id:q.id||Date.now()+k,name:q.name,party:q.party||s.party||'',s};k++;if(i>=0){n.id=Q[i].id;Q[i]=n}else Q.push(n)});
   let cur=false;if(d.current&&confirm('Backup restored: '+k+' saved qualities.\n\nAlso load the quality that was open when this backup was made'+(d.current.name?' ("'+d.current.name+'")':'')+'?\nOK = load it now (replaces what is open on screen). Cancel = keep what you have open.')){S=normS(d.current);cur=true}
   save();alert('Restored '+k+' saved qualities'+(cur?' and the open quality':'')+' with all warp pattern, peg plan, drawing and weft lattice data.');view=cur?'calc':'saved';render()}
  else{const o=restoreCSV(r.result);save();alert(o.k+' qualities restored.'+(o.bad?'\n'+o.bad+' row(s) could not be read (the data cell was probably cut short by Excel). Use the new Full backup (.json) to avoid this.':''));view='saved';render()}
 }catch(err){alert('Could not read this backup file.')}};r.readAsText(fl);e.target.value=''};

/* ---------- events ---------- */
document.addEventListener('input',e=>{const t=e.target;if(t.closest&&t.closest('.pat')){patInput(t);return}if(t.id=='sq'){const p=t.selectionStart;$('#app').innerHTML=vSaved(t.value);const s=$('#sq');s.focus();s.setSelectionRange(p,p);return}
 if(!t.dataset.k)return;setp(t.dataset.k,t.dataset.t=='text'?t.value:t.value);if(t.tagName=='SELECT'){render();return}S.picks=calc().picks;if(view=='yarn'||view=='loom'){$('#res').innerHTML=view=='yarn'?yarnRes():loomRes();save()}else update()});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
 if(d.v){if(d.v=='calc'&&S.wtab=='pat')S.wtab='warp';view=d.v;return render()}
 const A=Object.assign({},PA,PG,DR,LT,SM,EX,{wtab(){if(d.t==='draw'){view='draw';render();return}if(d.t==='pat'){S.wtab='pat';view='wpat';render();return}S.wtab=d.t;render()},dback(){view='calc';S.wtab='warp';render()},dsave(){if(!S.name.trim()&&S.draw.p.name)S.name=S.draw.p.name;A.savq()},add(){S[d.kind].push(d.kind=='warps'?wr():wf());render()},del(){S[d.kind].splice(+d.i,1);render()},
  clear(){if(confirm('Clear all fields?')){S=def();render()}},clearjob(){S.job={};render()},print(){window.print()},pdf(){pdfView()},
  docup(){$('#docfile').click()},docmgr(){docMgr(S.docs,true,render)},qdoc(){const q=Q.find(x=>x.id==d.id);if(q)docMgr(migDoc(q.s).docs,false)},
  savq(){if(!S.name.trim())return alert('Enter a quality name first.');const i=Q.findIndex(x=>x.name==S.name.trim()),q={id:Date.now(),name:S.name.trim(),party:S.party,s:JSON.parse(JSON.stringify(S))};
   if(i>=0){if(!confirm('Quality exists. Overwrite?'))return;q.id=Q[i].id;Q[i]=q}else Q.push(q);save();render();alert('Saved.')},
  load(){const q=Q.find(x=>x.id==d.id);S=migDoc(Object.assign(def(),JSON.parse(JSON.stringify(q.s))));view='calc';render()},
  loadjob(){A.load();view='job';render()},delq(){if(confirm('Delete this quality?')){Q=Q.filter(x=>x.id!=d.id);save();docGC();render()}},
  new(){if(!confirm('Start a new quality? All current fields will be reset. Saved qualities are kept.'))return;S=def();view='calc';render()},applyloom(){S.prod=+d.val;view='calc';render()},
  copy(){const c=calc();navigator.clipboard?.writeText(`${S.name||'Quality'}: ${f(c.total,3)} kg/100m, GLM ${f(c.glm,1)}, GSM ${f(c.gsm,1)}, yarn ${inr(c.yarn)}/m, profit ${inr(c.profit)}/m, monthly ${inr(c.monthly)}`);alert('Summary copied.')},
  export:exportCSV,backup:backupAll,restore(){$('#file').click()}});
 A[d.a]?.(d)});
document.addEventListener('keydown',e=>{if(e.key!=='Enter'||e.isComposing)return;const t=e.target;if(t.tagName!=='INPUT'||t.type==='file')return;e.preventDefault();
 const L=[...document.querySelectorAll('#app input:not([disabled])')].filter(x=>x.offsetParent),i=L.indexOf(t),nx=L[i+(e.shiftKey?-1:1)];
 if(nx){nx.focus();nx.select&&nx.select()}else t.blur()});
try{render()}catch(err){
 console.error(err);
 document.getElementById('app').innerHTML='<div style="max-width:520px;margin:60px auto;padding:20px;background:#fff;border:1px solid #e2e8f0;border-radius:10px"><h2>Saved data could not be loaded</h2><p>The app hit an error while reading data saved in this browser.</p><p style="color:#9b2c2c;font-size:12px">'+esc(err&&err.message)+'</p><button class="btn p" id="rst">Reset current calculation &amp; reload</button> <button class="btn" id="rstall">Erase ALL saved data &amp; reload</button></div>';
 document.getElementById('rst').onclick=()=>{try{localStorage.removeItem('dharm_state')}catch(e){}location.reload()};
 document.getElementById('rstall').onclick=()=>{if(confirm('This deletes all saved qualities in this browser. Continue?')){try{localStorage.removeItem('dharm_state');localStorage.removeItem('dharm_q')}catch(e){}location.reload()}};
}
