/* Facter Truck mockup kit: the real app shell (sidebar, navbar, phone bottom nav) and the atoms the app uses.
   Mirrors apps/web/src/app/shell/app-shell.tsx and @facter/ds-core 1.43 (truck theme, light).
   Load kit.css in <head> and kit.js at the end of <body>. Plain JS, no build step. */
(function(){
const LOGO_PATH="M25.8384 196.911L15.4739 183.729C-10.7189 150.411 0.44781 101.422 38.4895 82.7344L206.266 0.307297V34.2396C206.266 60.1875 191.448 83.8698 168.12 95.2396L56.578 149.594C48.4634 153.547 41.3489 159.344 35.9791 166.609C30.5936 173.901 25.9582 183.906 26.3176 196.526C29.9947 193.609 34.0624 191.026 38.4843 188.854L206.26 106.432V140.359C206.26 166.313 191.437 189.995 168.109 201.365L56.578 255.708C48.4634 259.667 41.3489 265.464 35.9791 272.724C30.4426 280.224 25.6978 290.578 26.3593 303.693L15.4739 289.854C-7.54698 260.568 -1.72407 219.193 25.8384 196.911ZM134.818 266.526L206.208 303.724L206.187 210.802L134.953 246.661C126.828 250.755 126.755 262.323 134.818 266.526Z";
const ic=(name,cls='s16',fill)=>`<span class="ic ${cls}" style="--i:url(https://api.iconify.design/ph/${name}${fill?'-fill':''}.svg)"></span>`;
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const initials=n=>{const w=String(n||'').trim().split(/\s+/).filter(Boolean);if(!w.length)return'?';return w.length===1?w[0].slice(0,2).toUpperCase():(w[0][0]+w[w.length-1][0]).toUpperCase();};
const logo=(w=26,cls='')=>`<svg class="${cls}" width="${w}" viewBox="0 0 207 304" aria-label="Facter"><path fill="currentColor" d="${LOGO_PATH}"/></svg>`;

/* navigation exactly as the shell: NAVIGATION + Pessoas group, then Novidades and Configurações at the end */
const NAV=[
  {id:'home',label:'Início',icon:'house'},
  {id:'assets',label:'Ativos',icon:'truck-trailer',children:[{id:'vehicles',label:'Veículos',icon:'truck'},{id:'sets',label:'Conjuntos',icon:'link-simple'}]},
  {id:'os',label:'Ordens de serviço',icon:'wrench'},
  {id:'yard',label:'Pátio',icon:'garage'},
  {id:'checklists',label:'Checklists',icon:'clipboard-text',children:[{id:'runs',label:'Inspeções',icon:'list-checks'},{id:'templates',label:'Modelos',icon:'note-pencil'}]},
  {id:'stock',label:'Estoque',icon:'package'},
  {id:'tires',label:'Pneus',icon:'tire',children:[{id:'tirestock',label:'Estoque de pneus',icon:'list-bullets'},{id:'movement',label:'Movimentação',icon:'arrows-down-up'}]},
  {id:'people',label:'Pessoas',icon:'users-three',children:[{id:'shop',label:'Oficina',icon:'wrench'},{id:'leaders',label:'Liderança',icon:'user-gear'},{id:'jobs',label:'Cargos',icon:'identification-badge'},{id:'shifts',label:'Turnos',icon:'clock'}]},
];
const NAV_END=[{id:'updates',label:'Novidades',icon:'megaphone-simple'},{id:'settings',label:'Configurações',icon:'gear-six'}];
const MOBILE=[...NAV.filter(n=>n.id!=='people'),...NAV_END];
const isOn=(n,sec)=>n.id===sec||(n.children||[]).some(c=>c.id===sec);

function sidebar(sec,expanded){
  const item=(n,nested)=>{const on=isOn(n,sec);return `<div class="fx-ni ${on?'on':''} ${nested?'nested':''}" title="${esc(n.label)}">${on&&!nested?'<i class="fx-bar"></i>':''}<span class="fx-nib">${ic(n.icon,'s16',on)}</span>${expanded?`<span class="fx-nil">${n.label}</span>${n.children&&!nested?ic('caret-right','s12 fx-car'):''}`:''}</div>`+(expanded&&n.children&&on?`<div class="fx-sub">${n.children.map(c=>item(c,1)).join('')}</div>`:'');};
  return `<aside class="fx-side ${expanded?'exp':''}"><div class="fx-logo">${logo(26)}${expanded?'<span class="fx-ldiv"></span><span class="fx-lw"><span class="fx-brand"><span>Facter</span> <b>Truck</b></span><span class="fx-tag">Gestão inteligente de frotas</span></span>':''}</div>
    <nav class="fx-nav-l">${expanded?'<div class="fx-sec">Principal</div>':''}${NAV.map(n=>item(n)).join('')}<div class="fx-end">${NAV_END.map(n=>item(n)).join('')}</div></nav></aside>`;
}
function navbar(o){
  const left=o.console?`<div class="fx-cons"><div class="fx-ct"><span class="fx-eb">${esc(o.eyebrow||'')}</span><span class="fx-tt" title="${esc(o.title)}">${esc(o.title)}</span></div>${o.controls?`<span class="fx-vdiv"></span><div class="fx-ctl">${o.controls}</div>`:''}</div>`
    :(o.device==='phone'?`<div class="fx-lock">${logo(26,'fx-primary')}<span class="fx-ldiv d"></span><span class="fx-brand d"><span>Facter</span> <b>Truck</b></span></div>`:`<div class="fx-crumb">${esc(o.crumb||o.title||'')}</div>`);
  const search=o.device==='phone'?'':`<div class="fx-sw"><div class="fx-search">${ic('sparkle','s16 fx-primary',1)}<span>${esc(o.search||'Buscar placa, frota ou OS')}</span>${o.device==='web'||o.device==='tablet-l'?'<kbd>Ctrl K</kbd>':''}</div></div>`;
  const org=o.device==='phone'?'':`<span class="fx-org"><span class="fx-orgi">TD</span><span class="fx-orgn">Transportadora Demo</span></span><span class="fx-vdiv"></span>`;
  return `<header class="fx-navbar">${left}${search}<div class="fx-right">${org}<span class="fx-me" title="${esc(o.user)}">${initials(o.user)}</span></div></header>`;
}
function mobileNav(sec){
  return `<nav class="fx-mnav">${MOBILE.map(n=>{const on=isOn(n,sec);return `<span class="fx-mi ${on?'on':''}"><span class="fx-mic">${ic(n.icon,'s20',on)}</span><span class="fx-ml">${n.label}</span>${on?'<i></i>':''}</span>`;}).join('')}</nav>`;
}
const statusBar=()=>`<div class="fx-status"><b>9:41</b><span>${ic('cell-signal-full','s14',1)}${ic('wifi-high','s14',1)}${ic('battery-full','s16',1)}</span></div>`;
/* the whole app around a content slot; returns [before, after] so callers can wrap content */
function frame(o){
  const dev=o.device||'web', phone=dev==='phone';
  const pad=o.console?'p3':(dev==='web'||dev==='tablet-l'?'p6':'p4');
  const before=`<div class="fx-device ${dev}" ${o.scale?`style="zoom:${o.scale}"`:''}>${dev==='web'?'':'<div class="fx-bezel">'}<div class="fx-screen" ${o.height?`style="height:${o.height}px"`:''}>${dev==='web'?'':statusBar()}<div class="fx-shell">${phone?'':sidebar(o.section,o.sidebar==='expanded')}<div class="fx-main">${navbar({...o,device:dev})}<main class="fx-body ${pad} ${o.dots?'fx-dots':''}">`;
  const after=`</main>${phone?mobileNav(o.section):''}</div></div></div>${dev==='web'?'':'</div>'}</div>`;
  return [before,after];
}
function app(o,inner=''){const [a,b]=frame(o);return a+inner+b;}

/* <fx-app device="web|tablet-l|tablet-p|phone" section="os" eyebrow="…" title="…" console user="…" dots height="…">content</fx-app> */
class FxApp extends HTMLElement{
  connectedCallback(){
    if(this._built) return;
    const build=()=>{ if(this._built) return; this._built=true;
      const o={device:this.getAttribute('device')||'web',section:this.getAttribute('section')||'home',eyebrow:this.getAttribute('eyebrow'),title:this.getAttribute('title')||'',console:this.hasAttribute('console'),user:this.getAttribute('user')||'Rafael Lima',dots:this.hasAttribute('dots'),height:this.getAttribute('height'),scale:this.getAttribute('scale'),sidebar:this.getAttribute('sidebar'),search:this.getAttribute('search'),controls:this.getAttribute('controls'),crumb:this.getAttribute('crumb')};
      this.removeAttribute('title');
      const kids=[...this.childNodes]; const [a,b]=frame(o); this.innerHTML=a+'<span data-fx-slot></span>'+b;
      const slot=this.querySelector('[data-fx-slot]'); kids.forEach(k=>slot.parentNode.insertBefore(k,slot)); slot.remove();
    };
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',build); else build();
  }
}
if(!customElements.get('fx-app')) customElements.define('fx-app',FxApp);

/* ---------- atoms (same look as the DS components the app uses) ---------- */
const TONES=['primary','success','warning','danger','info','muted'];
const A={
  ic, esc, initials, logo,
  pageHeader:(title,desc,actions='')=>`<div class="fx-ph"><div class="fx-pht"><h1>${title}</h1>${desc?`<p>${desc}</p>`:''}</div>${actions?`<div class="fx-pha">${actions}</div>`:''}</div>`,
  plate:p=>`<span class="fx-plate">${esc(p)}</span>`,
  chip:(tone,text,icon)=>`<span class="fx-chip ${tone}">${icon?ic(icon,'s12'):''}${text}</span>`,
  tile:(tone,icon,size='')=>`<span class="fx-tile ${tone} ${size}">${ic(icon,size==='lg'?'s20':size==='xl'?'s24':'s16')}</span>`,
  avatar:(name,on,size='')=>`<span class="fx-av ${on?'on':''} ${size}" title="${esc(name)}">${name&&name.length<=3&&name===name.toUpperCase()?name:initials(name)}</span>`,
  ring:(done,total,size=40,label)=>{const r=(size-6)/2,c=2*Math.PI*r,f=total?done/total:0,col=total&&done===total?'hsl(var(--success))':'hsl(var(--primary))';
    return `<span class="fx-ring" style="width:${size}px;height:${size}px" role="img" aria-label="${done} de ${total}"><svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="hsl(var(--muted))" stroke-width="4"/>${f>0?`<circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${col}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${c*f} ${c}" transform="rotate(-90 ${size/2} ${size/2})"/>`:''}</svg><b>${label??`${done}/${total}`}</b></span>`;},
  cbar:states=>`<span class="fx-cbar">${states.map(s=>`<i class="${s}"></i>`).join('')}</span>`,
  selbar:(count,label,actions)=>`<div class="fx-selbar"><span class="fx-selc"><b>${count}</b>${label}</span><span class="fx-sels"></span>${actions.map(a=>`<span class="fx-sela ${a.primary?'p':''}">${a.icon?ic(a.icon,'s16'):''}${a.label}</span>`).join('')}</div>`,
  dialog:o=>`<div class="fx-overlay"><div class="fx-dialog" style="${o.width?`width:min(${o.width}px,100%)`:''}"><div class="fx-dh"><div><div class="fx-deb">${o.eyebrow||''}</div><h3>${o.title}</h3>${o.desc?`<p>${o.desc}</p>`:''}</div><span class="fx-x">${ic('x','s16')}</span></div><div class="fx-db">${o.body}</div>${o.foot?`<div class="fx-df">${o.foot}</div>`:''}</div></div>`,
  sheet:o=>`<div class="fx-overlay fx-bottom"><div class="fx-sheet"><i class="fx-grab"></i><div class="fx-dh"><div><div class="fx-deb">${o.eyebrow||''}</div><h3>${o.title}</h3></div><span class="fx-x">${ic('x','s16')}</span></div><div class="fx-db">${o.body}</div>${o.foot?`<div class="fx-df col">${o.foot}</div>`:''}</div></div>`,
  sk:(w,h,r)=>`<span class="fx-sk" style="width:${typeof w==='number'?w+'px':w};height:${h}px;${r?`border-radius:${r}px`:''}"></span>`,
  empty:o=>`<div class="fx-empty ${o.canvas?'canvas':''}"><span class="fx-halo">${ic(o.icon||'tray','s24')}</span><b>${o.title}</b>${o.hint?`<p>${o.hint}</p>`:''}${o.action||''}</div>`,
  notice:(tone,icon,text,action='')=>`<div class="fx-notice ${tone}">${ic(icon,'s16')}<span>${text}</span>${action}</div>`,
  seg:(opts,on)=>`<div class="fx-seg">${opts.map(o=>`<span class="${o===on?'on':''}">${o}</span>`).join('')}</div>`,
  fchip:(label,o={})=>`<span class="fx-fchip ${o.on?'on':''} ${o.general?'gen':''}">${label}${o.count!=null?` <b>${o.count}</b>`:''}</span>`,
  tooltip:text=>`<span class="fx-tip">${text}</span>`,
  btn:(label,o={})=>`<button class="fx-btn ${o.variant||'primary'} ${o.size||''}" ${o.disabled?'disabled':''} type="button">${o.icon?ic(o.icon,o.size==='lg'?'s20':'s16',o.fill):''}${label}</button>`,
  /* state bars: <div class="states" data-for="k"> with buttons data-s, and targets [data-render="k"] (data-device optional) */
  bind(renderers){
    document.querySelectorAll('.states[data-for]').forEach(g=>{
      const k=g.dataset.for, fn=renderers[k]; if(!fn) return;
      const draw=s=>document.querySelectorAll(`[data-render="${k}"]`).forEach(el=>{el.innerHTML=fn(s,el.dataset.device||'web',el);});
      g.querySelectorAll('button').forEach(b=>b.onclick=()=>{g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));draw(b.dataset.s);});
      draw((g.querySelector('button[aria-pressed=true]')||g.querySelector('button')).dataset.s);
    });
    Object.keys(renderers).forEach(k=>{ if(document.querySelector(`.states[data-for="${k}"]`)) return; document.querySelectorAll(`[data-render="${k}"]`).forEach(el=>{el.innerHTML=renderers[k](el.dataset.state,el.dataset.device||'web',el);}); });
    document.querySelectorAll('.vtoggle[data-sec]').forEach(t=>t.querySelectorAll('button').forEach(b=>b.onclick=()=>{t.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));const sc=t.closest('section');sc.querySelector(':scope>.ver-new').hidden=b.dataset.v!=='new';sc.querySelector(':scope>.ver-old').hidden=b.dataset.v!=='old';}));
  },
  app, frame, TONES,
};
window.FX=A;
})();
