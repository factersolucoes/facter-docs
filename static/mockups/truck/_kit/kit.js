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
/* DS 1.45 MobileNav: at most 5 slots; the last becomes "Mais" and opens the rest in a sheet. Labels on one line (shortLabel when given). */
const SHORT={os:'OS'};
function mobileNav(sec,moreOpen){
  const shown=MOBILE.slice(0,4), rest=MOBILE.slice(4), restOn=rest.some(n=>isOn(n,sec));
  const slot=(n,on,label,icon)=>`<span class="fx-mi ${on?'on':''}"><span class="fx-mic">${ic(icon,'s20',on&&icon!=='dots-three')}</span><span class="fx-ml">${label}</span>${on?'<i></i>':''}</span>`;
  const bar=`<nav class="fx-mnav">${shown.map(n=>slot(n,isOn(n,sec),SHORT[n.id]||n.label,n.icon)).join('')}${slot(null,restOn,'Mais','dots-three')}</nav>`;
  const sheet=moreOpen?`<div class="fx-more"><div><i class="g"></i><h4>Mais</h4><div class="gr">${rest.map(n=>`<span class="${isOn(n,sec)?'on':''}"><span class="ib">${ic(n.icon,'s20',isOn(n,sec))}</span>${n.label}</span>`).join('')}</div></div></div>`:'';
  return bar+sheet;
}
const statusBar=()=>`<div class="fx-status"><b>9:41</b><span>${ic('cell-signal-full','s14',1)}${ic('wifi-high','s14',1)}${ic('battery-full','s16',1)}</span></div>`;
/* the whole app around a content slot; returns [before, after] so callers can wrap content */
function frame(o){
  const dev=o.device||'web', phone=dev==='phone';
  const pad=o.console?'p3':(dev==='web'||dev==='tablet-l'?'p6':'p4');
  const before=`<div class="fx-device ${dev}" ${o.scale?`style="zoom:${o.scale}"`:''}>${dev==='web'?'':'<div class="fx-bezel">'}<div class="fx-screen" ${o.height?`style="height:${o.height}px"`:''}>${dev==='web'?'':statusBar()}<div class="fx-shell">${phone?'':sidebar(o.section,o.sidebar==='expanded')}<div class="fx-main">${navbar({...o,device:dev})}<main class="fx-body ${pad} ${o.dots?'fx-dots':''}">`;
  const after=`</main>${phone?mobileNav(o.section,o.more):''}</div></div></div>${dev==='web'?'':'</div>'}</div>`;
  return [before,after];
}
function app(o,inner=''){const [a,b]=frame(o);return a+inner+b;}

/* <fx-app device="web|tablet-l|tablet-p|phone" section="os" eyebrow="…" title="…" console user="…" dots height="…">content</fx-app> */
class FxApp extends HTMLElement{
  connectedCallback(){
    if(this._built) return;
    const build=()=>{ if(this._built) return; this._built=true;
      const o={device:this.getAttribute('device')||'web',section:this.getAttribute('section')||'home',eyebrow:this.getAttribute('eyebrow'),title:this.getAttribute('title')||'',console:this.hasAttribute('console'),user:this.getAttribute('user')||'Rafael Lima',dots:this.hasAttribute('dots'),height:this.getAttribute('height'),scale:this.getAttribute('scale'),sidebar:this.getAttribute('sidebar'),search:this.getAttribute('search'),controls:this.getAttribute('controls'),crumb:this.getAttribute('crumb'),more:this.hasAttribute('more')};
      this.removeAttribute('title');
      const kids=[...this.childNodes]; const [a,b]=frame(o); this.innerHTML=a+'<span data-fx-slot></span>'+b;
      const slot=this.querySelector('[data-fx-slot]'); kids.forEach(k=>slot.parentNode.insertBefore(k,slot)); slot.remove();
    };
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',build); else build();
  }
}
if(!customElements.get('fx-app')) customElements.define('fx-app',FxApp);

/* ---------- atoms: same classes as @facter/ds-core 1.45 and the app's composed pieces ---------- */
const TONES=['primary','success','warning','danger','info','muted'];
const toneOfName=n=>[...String(n)].reduce((t,c)=>t+c.charCodeAt(0),0)%5;
const initialsOf=n=>{const w=String(n).trim().split(/\s+/).filter(x=>x.length>2||/^[A-ZÀ-Ú]/.test(x));return ((w[0]||'').charAt(0)+(w[1]||'').charAt(0)).toUpperCase()||String(n).slice(0,2).toUpperCase();};
const DUR=(d,h,m)=>d?`${d}d ${h}h`:h?`${h}h ${m}min`:`${m}min`;
const A={
  ic, esc, initials, logo, DUR,
  pageHeader:(title,desc,actions='')=>`<div class="fx-ph"><div class="fx-pht"><h1>${title}</h1>${desc?`<p>${desc}</p>`:''}</div>${actions?`<div class="fx-pha">${actions}</div>`:''}</div>`,
  btn:(label,o={})=>{const v=o.variant||'default';const ico=o.loading?'<span class="fx-spin"></span>':o.icon?ic(o.icon,'s16',o.fill):'';
    return `<button class="fx-btn ${v} ${o.size||''} ${o.state||''} ${o.action?'action':''}" ${o.disabled||o.loading?'disabled':''} type="button" ${o.title?`title="${esc(o.title)}"`:''}>${ico}${o.loading&&o.loadingText?o.loadingText:label}</button>`;},
  badge:(text,o={})=>`<span class="fx-badge ${o.variant||'default'} ${o.size||''} ${o.shape==='label'?'label':''}">${o.icon?ic(o.icon,'s14',o.fill):''}${text}</span>`,
  chip:(tone,text,icon)=>`<span class="fx-badge ${tone==='muted'?'secondary':tone} label">${icon?ic(icon,'s14'):''}${text}</span>`,
  avatar:(name,o={})=>`<span class="fx-av ${o.size||''}" title="${esc(name)}">${initials(name)}</span>`,
  initials:(name,status)=>`<span class="fx-ini t${toneOfName(name)}" title="${esc(name)}">${initialsOf(name)}${status?`<i class="dot ${status}"></i>`:''}</span>`,
  donut:(value,total,o={})=>{const size=o.size||140,th=o.thickness||12,pct=total?Math.round(value/total*100):0,hole=size-th*2;
    return `<span class="fx-donut" style="width:${size}px;height:${size}px" role="img" aria-label="${value} de ${total}"><i style="background:conic-gradient(hsl(var(--primary)) 0 ${pct}%, hsl(var(--primary) / .14) ${pct}% 100%)"></i><span style="width:${hole}px;height:${hole}px"><span><b style="font-size:${Math.round(size*.19)}px">${o.text??`${value}/${total}`}</b>${o.label?`<em>${o.label}</em>`:''}</span></span></span>`;},
  ring2:(conform,failing,text)=>`<span class="fx-ring2" style="background:conic-gradient(hsl(var(--primary)) 0 ${conform}%, hsl(var(--danger)) ${conform}% ${conform+failing}%, hsl(var(--muted)) 0)"><span>${text}</span></span>`,
  ring:(done,total,size=40,label)=>{const r=(size-6)/2,c=2*Math.PI*r,f=total?done/total:0,col=total&&done===total?'hsl(var(--success))':'hsl(var(--primary))';
    return `<span class="fx-ring" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="hsl(var(--muted))" stroke-width="4"/>${f>0?`<circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${col}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${c*f} ${c}" transform="rotate(-90 ${size/2} ${size/2})"/>`:''}</svg><b>${label??`${done}/${total}`}</b></span>`;},
  plate:p=>`<span class="fx-plate">${esc(p)}</span>`,
  plateOs:p=>`<span class="fx-plate-os">${esc(p)}</span>`,
  comp:(states,w)=>`<span class="fx-comp" style="width:${w||86}px" title="${states.map((s,i)=>`${i+1}º: ${({working:'Em manutenção',paused:'Pausada',waiting:'Na fila',done:'Concluída',left:'Saiu'})[s]}`).join(', ')}">${states.map(s=>`<i class="${s}"></i>`).join('')}</span>`,
  cbar:states=>`<span class="fx-cbar">${states.map(s=>`<i class="${s}"></i>`).join('')}</span>`,
  kind:k=>`<span class="fx-kind">${k}</span>`,
  prio:p=>`<span class="fx-prio ${p}">${p==='critical'||p==='high'?ic('flag','s12',1):''}${({critical:'Crítica',high:'Alta',medium:'Média',low:'Baixa'})[p]}</span>`,
  status:(st,label)=>`<span class="fx-stat ${st}">${label||({queued:'Na fila',in_maintenance:'Em manutenção',paused:'Pausada',finished:'Concluída',canceled:'Cancelada'})[st]}</span>`,
  tile:(tone,icon,size='')=>`<span class="fx-tile ${tone} ${size}">${ic(icon,size==='lg'?'s20':size==='xl'?'s24':'s16')}</span>`,
  selbar:(count,label,actions)=>`<div class="fx-selbar"><span class="fx-selc"><b>${count}</b>${label}</span>${actions.map(a=>`<span class="fx-sela ${a.primary?'p':''}">${a.icon?ic(a.icon,'s16'):''}${a.label}</span>`).join('')}</div>`,
  dialog:o=>`<div class="fx-overlay"><div class="fx-dialog ${o.size||''}"><div class="fx-dh">${o.eyebrow?`<div class="fx-deb">${o.eyebrow}</div>`:''}<h3>${o.title}</h3>${o.desc?`<p>${o.desc}</p>`:''}<span class="fx-x">${ic('x','s16')}</span></div><div class="fx-db">${o.body}</div>${o.foot||o.action?`<div class="fx-df">${o.consequence?`<span class="fx-cons2">${ic(o.consequenceIcon||'info','s16')}<span>${o.consequence}</span></span>`:''}${o.foot||`<div class="fx-dfb">${A.btn(o.cancel||'Cancelar',{variant:'outline'})}${A.btn(o.action,{action:1,disabled:o.disabled,icon:o.actionIcon})}</div>`}</div>`:''}</div></div>`,
  sheet:o=>`<div class="fx-overlay fx-bottom"><div class="fx-sheet"><i class="fx-grab"></i><div class="fx-dh">${o.eyebrow?`<div class="fx-deb">${o.eyebrow}</div>`:''}<h3>${o.title}</h3><span class="fx-x">${ic('x','s16')}</span></div><div class="fx-db">${o.body}</div>${o.action||o.foot?`<div class="fx-df">${o.consequence?`<span class="fx-cons2">${ic('info','s16')}<span>${o.consequence}</span></span>`:''}${o.foot||A.btn(o.cancel||'Cancelar',{variant:'outline',size:'lg'})+A.btn(o.action,{size:'lg',action:1,disabled:o.disabled})}</div>`:''}</div></div>`,
  sideSheet:o=>`<div class="fx-side-sheet"><div class="h"><h3>${o.title}</h3>${o.desc?`<p>${o.desc}</p>`:''}</div><span class="c">${ic('x','s16')}</span><div class="b">${o.body}</div>${o.foot?`<div class="f">${o.foot}</div>`:''}</div>`,
  sk:(w,h,r)=>`<span class="fx-sk" style="width:${typeof w==='number'?w+'px':w};height:${h}px;${r?`border-radius:${r}px`:''}"></span>`,
  empty:o=>`<div class="fx-empty ${o.canvas?'canvas':''} ${o.size||''}"><span class="fx-halo">${ic(o.icon||'tray','s24')}</span><b>${o.title}</b>${o.hint?`<p>${o.hint}</p>`:'<p></p>'}${o.action||''}</div>`,
  notice:(tone,icon,text,action='',bar)=>`<div class="fx-notice ${tone==='muted'?'info':tone} ${bar?'bar':''}">${ic(icon,'s16')}<span>${text}</span>${action}</div>`,
  seg:(opts,on,o={})=>`<div class="fx-seg ${o.variant||''} ${o.size||''} ${o.full?'full':''}">${opts.map(x=>{const [l,n]=Array.isArray(x)?x:[x];return `<span class="${l===on?'on':''}">${l}${n!=null?` <span class="n">${n}</span>`:''}</span>`;}).join('')}</div>`,
  fchip:(label,o={})=>`<span class="fx-fchip ${o.on?'on':''} ${o.size||''}">${o.icon?ic(o.icon,'s14'):''}${label}${o.count!=null?` <b>${o.count}</b>`:''}${o.removable&&o.on?ic('x','s14'):''}${o.menu?ic('caret-down','s14'):''}</span>`,
  tooltip:(text,size='sm')=>`<span class="fx-tip ${size}">${text}</span>`,
  input:o=>`<div><div class="fx-input ${o.label?'':'nolabel'} ${o.icon?'icon':''} ${o.state||''}">${o.icon?ic(o.icon,'s16'):''}${o.label?`<label>${o.label}${o.required?'<span style="color:hsl(var(--danger));margin-left:2px">*</span>':''}</label>`:''}${o.value?`<span>${o.value}</span>`:`<span class="ph">${o.placeholder||''}</span>`}${o.select?ic('caret-down','s16 chev'):''}</div>${o.help?`<div class="fx-help ${o.state==='error'?'err':''}">${o.help}</div>`:''}</div>`,
  search:(placeholder,o={})=>`<span class="fx-searchf ${o.state||''}" style="${o.width?`width:${o.width}px`:''}">${ic('magnifying-glass','s16')}<span>${o.value||placeholder}</span></span>`,
  menu:(groups)=>`<div class="fx-menu">${groups.map(g=>`${g.label?`<div class="lbl">${g.label}</div>`:''}${g.items.map(i=>`<div class="it ${i.on?'on':''} ${i.hl?'hl':''}">${i.label}</div>`).join('')}`).join('')}</div>`,
  tabs:(items,on)=>`<div class="fx-tabs">${items.map(t=>`<span class="${t===on?'on':''}">${t}</span>`).join('')}</div>`,
  dtabs:(items,on)=>`<div class="fx-dtabs">${items.map(([t,n])=>`<span class="${t===on?'on':''}">${t}${n!=null?`<span class="n">${n}</span>`:''}</span>`).join('')}</div>`,
  card:(inner,o={})=>`<div class="fx-card ${o.app?'app':''}" style="${o.pad!=null?`padding:${o.pad}px`:''}">${inner}</div>`,
  itemRow:o=>`<div class="fx-irow">${o.icon?A.tile(o.tone||'muted',o.icon):''}<span class="t">${o.chip?`<span class="pill ${o.chipTone||'muted'}">${o.chip}</span>`:''}<b>${o.title}</b>${o.sub?`<span>${o.sub}</span>`:''}</span>${o.right?`<span class="r"><b>${o.right}</b>${o.rightSub?`<span>${o.rightSub}</span>`:''}</span>`:''}</div>`,
  statStrip:items=>`<div class="fx-sstrip" style="--n:${items.length}">${items.map(i=>`<div><span class="l">${i.label}</span><span class="v ${i.tone||''}">${i.value}</span>${i.hint?`<span class="h">${i.hint}</span>`:''}</div>`).join('')}</div>`,
  bignum:o=>`<div class="fx-bignum"><div class="l">${o.label}</div><div class="v">${o.value}</div>${o.delta?`<div class="d up">${ic('trend-up','s16')}${o.delta}</div>`:''}${o.hint?`<div class="h">${o.hint}</div>`:''}</div>`,
  timer:(t,tone='success')=>`<span class="fx-timer ${tone}">${ic('timer','s12')}${t}</span>`,
  fab:(icon='plus',abs)=>`<span class="fx-fab ${abs?'abs':''}">${ic(icon,'s24')}</span>`,
  missing:(t='falta no DS')=>`<span class="fx-missing">${t}</span>`,
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

/* ---------- real screens: copies of what the app renders today, to start proposals from ---------- */
/* apps/web/src/features/work-orders/pages/work-orders-page.tsx + components/work-orders-feed.tsx */
const WO_ROWS=[
  {n:'OS-001042',set:'C-320',fronts:['working','working','done'],plates:'RTF6K38 · RTE1J77 · SRK9H46',problem:'Freio puxando para a direita e vazamento de ar',kind:'Corretiva',prio:'high',base:'Base Curitiba',box:'Box 3',stop:'2d 8h',status:'in_maintenance',open:2,done:1,left:0,
   add:{who:[['Carlos Souza','busy']],block:['warning','package','Esperando mola de retorno']}},
  {n:'OS-001040',plate:'DLY1J07',fleet:'812',problem:'Vazamento no circuito do freio',kind:'Corretiva',prio:'critical',base:'Base Curitiba',box:'Box 7',stop:'3d 2h',status:'in_maintenance',
   add:{who:[['Ana Lima','busy'],['Bruno Reis','busy']],block:null}},
  {n:'OS-001038',set:'C-900',fronts:['done','left','working','working','working','working'],plates:'RTA1A11 · RTA2A22 · RTA3A33 · RTA4A44 · RTA5A55 · RTA6A66',problem:'Preventiva de 50 mil km',kind:'Preventiva',prio:'medium',base:'Base Curitiba',box:'Box 1',stop:'4d 1h',status:'in_maintenance',open:4,done:1,left:1,
   add:{who:[],block:['warning','user','2 serviços sem mecânico']}},
];
const dot='<span class="fx-dot"></span>';
function woRow(r,o={}){
  const asSet=!!r.set;
  const ident=asSet?`<span class="fx-setid"><span class="fx-plate-os" style="display:block;text-align:center;overflow:hidden;text-overflow:ellipsis" title="${r.set}">${r.set}</span>${A.comp(r.fronts,'auto')}</span>`:`<span class="fx-plate-os">${r.plate}</span>`;
  const meta=asSet?`${ic('link-simple','s14')}<span class="trunc2" title="${r.plates}"><b>Conjunto ${r.set}</b> · ${r.plates}</span>`:`${ic('truck','s14')}<span class="trunc2">${r.fleet||r.plate}</span>`;
  const openSt=r.status==='in_maintenance'?'working':r.status==='paused'?'paused':'waiting';
  const openLbl={working:'em manutenção',paused:r.open>1?'pausadas':'pausada',waiting:'na fila'}[openSt];
  const rest=[r.done?`${r.done} ${r.done>1?'prontas':'pronta'}`:'',r.left?`${r.left} ${r.left>1?'saíram':'saiu'}`:''].filter(Boolean).join(' · ');
  const right=asSet?`<span class="fx-fsum">${r.open?`<span class="fx-stat ${openSt}">${r.open} ${openLbl}</span>`:''}${rest?`<span class="m">${rest}</span>`:''}</span>`:A.status(r.status);
  const add=o.deltas&&r.add?`<div class="fx-delta"><span class="fx-newtag">novo</span>${r.add.who.length?`<span class="who">${r.add.who.map(w=>A.initials(w[0],w[1])).join('')}<span>${r.add.who.map(w=>w[0].split(' ')[0]).join(' e ')} ${r.add.who.length>1?'trabalhando':'trabalhando'}</span></span>`:'<span class="who muted">Ninguém trabalhando</span>'}${r.add.block?`<span class="fx-badge ${r.add.block[0]} label">${ic(r.add.block[1],'s14')}${r.add.block[2]}</span>`:''}</div>`:'';
  return `<div class="fx-worow ${r.prio==='critical'?'acc-d':r.prio==='high'?'acc-w':''}">
    <span class="num">${r.n}</span>${ident}
    <div style="min-width:0"><div class="l1"><span class="trunc2" title="${r.problem}">${r.problem}</span>${A.kind(r.kind)}${A.prio(r.prio)}</div>
      <div class="l2">${meta}${dot}<span class="trunc2">${r.base}</span>${r.box?dot+`<span class="trunc2">${r.box}</span>`:''}</div>${add}</div>
    <div class="rt"><span class="stop"><span class="v ${r.prio==='critical'?'d':''}">${ic('clock','s14')}${r.stop}</span><span class="s">parado</span></span>${right}${ic('caret-right','s16 car')}</div></div>`;
}
A.real={
  workOrdersPage(o={}){
    const tab=o.tab||'Em manutenção';
    const head=A.pageHeader('Ordens de serviço','Os veículos parados para manutenção, da entrada à liberação.',A.btn('Abrir OS',{icon:'plus'}));
    const kpi=`<div class="fx-kpi4">${[['Na fila',2],['Em manutenção',3],['Pausadas',1],['Concluídas',128]].map(([l,v])=>`<div><p>${l}</p><b>${v}</b></div>`).join('')}</div>`;
    const tabs=A.dtabs([['Fila',2],['Em manutenção',3],['Pausadas',1],['Concluídas',128]],tab);
    const search=A.input({icon:'magnifying-glass',placeholder:'Buscar por nº, placa ou frota',value:o.search});
    let list;
    if(o.state==='loading') list=`<div style="display:flex;flex-direction:column;gap:8px">${[1,2,3,4].map(()=>A.sk('100%',64)).join('')}</div>`;
    else if(o.state==='empty') list=A.empty({icon:'wrench',title:'Nenhuma OS em manutenção',hint:'Uma OS aparece aqui quando entra num box e o serviço começa.'});
    else list=`<ul class="fx-wolist">${(o.rows||WO_ROWS).map(r=>`<li>${woRow(r,o)}</li>`).join('')}</ul>`;
    return head+`<div style="display:flex;flex-direction:column;gap:16px">${kpi}<div style="display:flex;flex-direction:column;gap:12px">${tabs}${search}${list}</div></div>`;
  },
  woRow, WO_ROWS,
};

/* apps/web/src/features/work-orders/components/work-order-header.tsx */
A.real.workOrderHeader=(o={})=>{
  const facts=[['Criado','07 nov., 08:42'],['Por','Rafael Lima'],['Box','Box 3']];
  return `<section class="fx-woh"><div class="l"><i class="grid"></i><div style="position:relative">
    <div class="top"><span class="back">${ic('caret-left','s16')}</span><span class="pill ${o.stopped===false?'':'stopped'}"><i></i>Em manutenção há 2d 8h<span class="play">${ic('play','s14',1)}</span></span><span style="flex:1"></span><span class="os">OS <b>OS-001042</b></span></div>
    <h1>Conjunto C-320 ${A.comp(['working','working','done'],110)}</h1>
    <p>Corretiva<span class="fx-dot"></span>cavalo QRT4B22 deixou com 152.318 km<span class="fx-dot"></span>3 veículos</p>
    <div class="facts">${facts.map(f=>`<div><span>${f[0]}</span><b>${f[1]}</b></div>`).join('')}</div></div></div>
    <div class="r"><span class="lb">Progresso</span>${A.donut(2,6,{label:'serviços'})}<div class="ms"><div><b style="color:hsl(var(--primary))">3</b><span>abertos</span></div><div><b style="color:hsl(var(--warning-ink))">1</b><span>travados</span></div><div><b>2d 8h</b><span>Parada</span></div></div></div></section>`;
};
window.FX=A;
})();
