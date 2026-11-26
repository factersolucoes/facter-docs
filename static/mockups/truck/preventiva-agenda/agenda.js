/* preventiva-agenda: calm agenda, on top of ../_kit/kit.js (window.FX) */
(function(){
const F=window.FX, ic=F.ic, esc=F.esc, btn=F.btn;

/* composition mark: [plate, kind, state] in coupling order; state d = overdue, w = this week */
const STATE={d:'vencida',w:'vence esta semana','':'em dia'};
function mark(parts){
  const tip=parts.map(([p,k,s],i)=>`${k==='cav'?'Cavalo':`${i}ª carreta`} ${p}: ${STATE[s||'']}`).join(' · ');
  return `<span class="cm" title="${esc(tip)}" aria-label="${esc(tip)}">${parts.map(([,k,s])=>`<i class="${k==='cav'?'cav':''} ${s||''}"></i>`).join('')}</span>`;
}

/* ---------- data: Base Curitiba, hoje qui 26/11/2026 ---------- */
const V={
  c320:{name:'C-320',full:'Conjunto C-320',sub:'QRT4B22 com 3 carretas',parts:[['QRT4B22','cav',''],['RTF6K38','car',''],['RTE1J77','car','d'],['SRK9H46','car','']],svc:'Lona de freio, eixo 3',more:'+2 nesta visita',when:'vencida há 1.850 km',t:'d'},
  dly:{name:'DLY1J07',full:'Cavalo DLY1J07',sub:'Frota 812, transportadora JSL',parts:[['DLY1J07','cav','d']],svc:'Revisão B',more:'Inclui a revisão A',when:'vencida há 4.300 km',t:'d'},
  c207:{name:'C-207',full:'Conjunto C-207',sub:'QRT9D14 com 2 carretas',parts:[['QRT9D14','cav',''],['RTC3B19','car','d'],['RTC3B20','car','']],svc:'Fueiros e barrotes',more:'+1 nesta visita',when:'vencida há 3 dias',t:'d'},
  c118:{name:'C-118',parts:[['QRT7C10','cav','w'],['RTB2A41','car',''],['RTB2A42','car','']],svc:'Revisão A',more:'+1 nesta visita',when:'sáb 28/11',t:'w'},
  q1a:{name:'QRT1A09',parts:[['QRT1A09','cav','w']],svc:'Revisão A',more:'',when:'dom 29/11',t:'w'},
  rta:{name:'RTA4A44',parts:[['RTA4A44','car','w']],svc:'Fueiros e barrotes',more:'',when:'dom 29/11',t:'w'},
  c044:{name:'C-044',parts:[['QRT2E55','cav',''],['RTD8F12','car',''],['RTD8F13','car','']],svc:'Revisão B',more:'+1 nesta visita',when:'qui 10/12',t:''},
  q6h:{name:'QRT6H33',parts:[['QRT6H33','cav','']],svc:'Lona de freio, eixos 2 e 3',more:'',when:'ter 15/12',t:''},
  rtf:{name:'RTF2D10',parts:[['RTF2D10','car','']],svc:'Lubrificação geral',more:'',when:'sex 18/12',t:''},
  srt:{name:'SRT2C55',parts:[['SRT2C55','car','']],svc:'Sem leitura de km',more:'3 preventivas esperando',when:'desde 12/10',t:'m'},
  rtc:{name:'RTC9K21',parts:[['RTC9K21','car','']],svc:'Km a conferir',more:'Salto de 9.800 km em um dia',when:'desde ontem',t:'m'},
};
const GROUPS=[
  {k:'over',title:'Vencidas',count:'3 visitas',tone:'d',icon:'warning-octagon',ids:['c320','dly','c207']},
  {k:'week',title:'Esta semana',count:'3 visitas',tone:'w',icon:'hourglass-medium',ids:['c118','q1a','rta']},
  {k:'next',title:'Próximas semanas',count:'9 visitas',tone:'',icon:'calendar-blank',ids:['c044','q6h','rtf'],more:'Ver as 9 visitas até 24/12'},
  {k:'nokm',title:'Sem km',count:'2 veículos',tone:'',icon:'gauge',ids:['srt','rtc']},
];

/* ---------- pieces ---------- */
const motif=()=>`<span class="motif" aria-hidden="true">${[[1,1,0,1],[1,0,1],[1,1,1,0],[1,0],[1,1,0]].map(r=>`<span>${r.map((x,i)=>`<i class="${i===0?'cav':''} ${x?'':'o'}"></i>`).join('')}</span>`).join('')}</span>`;
const head=o=>`<div class="hl hero">${motif()}<div class="big">5</div><div class="tx"><h2>preventivas vencidas</h2><p>em 3 visitas, 2 com o veículo no pátio</p></div><div class="stats"><span class="st w"><b>4</b>esta semana</span><span class="st"><b>9</b>próximas</span></div></div>`;
const search=()=>`<span class="sf" role="search">${ic('magnifying-glass','s16')}<span>Buscar placa ou conjunto</span></span>`;
function row(id,sel){const v=V[id];
  return `<div class="vr ${sel===id?'on':''}" role="button" tabindex="0"><div class="who"><b>${v.name}</b>${mark(v.parts)}</div><div class="what"><b>${v.svc}</b>${v.more?`<span>${v.more}</span>`:''}</div><div class="when ${v.t}">${v.when}</div>${ic('caret-right','s16 car')}</div>`;}
function group(g,sel){
  return `<section class="grp"><header><span class="gt ${g.tone}">${ic(g.icon,'s16')}</span><h3>${g.title}</h3><span class="gc">${g.count}</span></header><div class="rows">${g.ids.map(id=>row(id,sel)).join('')}</div>${g.more?`<div class="more">${g.more}${ic('caret-down','s14')}</div>`:''}</section>`;}

const ITEMS_C320=[['Lona de freio, eixo 3','2ª carreta RTE1J77','vencida há 1.850 km','d'],['Lubrificação geral','2ª carreta RTE1J77','vence hoje','w'],['Troca de óleo e filtros','Cavalo QRT4B22','em 1.200 km','']];
const item=([n,s,v,t])=>`<div class="it"><i class="dot ${t}"></i><div class="n"><b>${n}</b><span>${s}</span></div><span class="v ${t}">${v}</span></div>`;
function pHead(v,o={}){return `<div class="phd">${o.phone?'<div class="grab"></div>':''}<div class="ph">${o.back?`<span class="xb back" role="button" aria-label="Voltar">${ic('arrow-left','s16')}</span>`:''}<div class="t"><h2>${o.title||v.full}</h2><p>${o.title?'':mark(v.parts)}${o.sub||v.sub}</p></div>${o.back?'':`<span class="xb" role="button" aria-label="Fechar">${ic('x','s16')}</span>`}</div></div>`;}
function visitBody(){
  return `<div class="where"><span class="wi">${ic('garage','s16')}</span><div><b>No pátio desde ontem às 14h</b><span>OS 1042 aberta, corretiva</span></div></div>
  <div class="ps"><h4>Nesta visita</h4>${ITEMS_C320.map(item).join('')}</div>
  <div class="ps"><h4>Peças do kit</h4><p>4 lonas, 8 molas, 38 l de óleo e 3 filtros</p><span class="ok">${ic('check-circle','s16')}<b>Tudo em estoque</b></span></div>
  <div class="ps"><h4>Última vez</h4><p>Lona do eixo 3 trocada em 12/05, na OS 0871</p></div>`;}
const visitFoot=(phone)=>`<div class="pf"><div class="bb">${btn('Adiar',{variant:'outline'})}${btn('Incluir as 3 na OS 1042',{icon:'plus',action:1})}</div><span class="hint">A OS fica cerca de 3 h 20 mais longa</span></div>`;

const WD=['seg','ter','qua','qui','sex','sáb'];
const DAYS=[['23','',2],['24','',2],['25','',2],['26','cheia',1],['27','cheia',1],['28','6 h',0,1],['30','18 h'],['01','22 h'],['02','28 h'],['03','3 h',1],['04','32 h'],['05','8 h']];
function scheduleBody(){
  return `<div class="where"><span class="wi">${ic('road-horizon','s16')}</span><div><b>Rodando, 640 km por dia</b><span>Fora do pátio desde 21/11</span></div></div>
  <div class="ps cal"><h4>Quando trazer</h4><p class="cap">Horas livres por dia na oficina. A visita leva 4&nbsp;h.</p>
  <div class="wk">${WD.map(d=>`<span class="wd">${d}</span>`).join('')}${DAYS.map(([n,l,off,pick])=>`<div class="day ${off===2?'off past':off?'off':''} ${pick?'pick':''}"><b>${n}</b><span>${l||'&nbsp;'}</span></div>`).join('')}</div><p class="first">${ic('calendar-check','s16')}<span><b>Primeira vaga: sáb 28/11</b>, 6&nbsp;h livres</span></p></div>
  <div class="ps"><h4>Itens da visita</h4>${item(['Revisão B','Inclui a revisão A','vencida há 4.300 km','d'])}<span class="lack">${ic('package','s16')}Falta 1 filtro de ar; o pedido sai junto</span></div>
  <label class="chk"><i>${ic('check','s14')}</i>Avisar a JSL por e-mail</label>`;}
const scheduleFoot=()=>`<div class="pf"><div class="bb">${btn('Voltar',{variant:'outline'})}${btn('Agendar para sáb 28/11',{icon:'calendar-check',action:1})}</div></div>`;

function skList(phone){
  const r=()=>`<div style="display:flex;align-items:center;gap:20px;min-height:64px;padding:10px 12px">${'<span class="sk" style="width:140px;height:16px"></span>'}<span style="flex:1;display:flex;flex-direction:column;gap:6px"><span class="sk" style="width:60%;height:15px"></span><span class="sk" style="width:30%;height:12px"></span></span>${phone?'':'<span class="sk" style="width:120px;height:15px"></span>'}</div>`;
  const g=n=>`<section class="grp"><header><span class="sk" style="width:32px;height:32px;border-radius:10px"></span><span class="sk" style="width:120px;height:16px"></span></header>${Array.from({length:n},r).join('')}</section>`;
  return `<div class="hl"><div class="tx" style="display:flex;flex-direction:column;gap:10px"><span class="sk" style="width:${phone?'90%':'420px'};height:24px"></span><span class="sk" style="width:${phone?'60%':'260px'};height:15px"></span></div></div>${g(3)}${g(3)}`;
}

const C044={full:'Conjunto C-044',sub:'QRT2E55 com 2 carretas',parts:V.c044.parts};
function nextPanel(){return `<aside class="pnl">${pHead(C044)}<div class="pb"><div class="where"><span class="wi">${ic('road-horizon','s16')}</span><div><b>Rodando, 610 km por dia</b><span>Fora do pátio desde 18/11</span></div></div>
  <div class="ps"><h4>Nesta visita</h4>${item(['Revisão B','Cavalo QRT2E55','qui 10/12',''])}${item(['Lubrificação geral','1ª carreta RTD8F12','sáb 12/12',''])}</div>
  <div class="ps"><h4>Peças do kit</h4><p>38 l de óleo, 4 filtros e graxa</p><span class="ok">${ic('check-circle','s16')}<b>Tudo em estoque</b></span></div></div>
  <div class="pf"><div class="bb">${btn('Adiar',{variant:'outline'})}${btn('Agendar visita',{icon:'calendar-check',action:1})}</div></div></aside>`;}

/* ---------- notebook ---------- */
function web(s,dev){
  const small=dev==='webs';
  if(s==='loading') return `<div class="ag ${small?'s':''}"><div class="col">${skList()}</div><aside class="pnl"><div class="phd" style="padding:24px"><span class="sk" style="width:60%;height:22px"></span></div><div class="pb">${[1,2,3,4].map(()=>'<span class="sk" style="width:100%;height:44px"></span>').join('')}</div></aside></div>`;
  if(s==='empty') return `<div class="ag ${small?'s':''}"><div class="col"><div class="allgood"><span class="halo">${ic('calendar-check','s24')}</span><div><b>Frota em dia esta semana</b><p>Nenhuma preventiva vencida. A próxima é a revisão B do C-044, na qui 10/12, e dá para agendar com folga.</p></div></div>${group(GROUPS[2],'c044')}${group(GROUPS[3],null)}</div>${nextPanel()}</div>`;
  const sel=s==='schedule'?'dly':'c320';
  const panel=s==='schedule'
    ?`<aside class="pnl">${pHead(V.dly,{title:'Agendar visita',sub:'DLY1J07, revisão B',back:1})}<div class="pb">${scheduleBody()}</div>${scheduleFoot()}</aside>`
    :`<aside class="pnl">${pHead(V.c320)}<div class="pb">${visitBody()}</div>${visitFoot()}</aside>`;
  return `<div class="ag ${small?'s':''}"><div class="col">${head({})}${GROUPS.map(g=>group(g,sel)).join('')}</div>${panel}</div>`;
}

/* ---------- phone ---------- */
function mrow(id,sel){const v=V[id];return `<div class="mr ${sel===id?'on':''}"><div class="l1"><b>${v.name}</b>${mark(v.parts)}<span class="when ${v.t}">${v.when}</span></div><div class="l2"><span>${v.svc}</span>${/^\+\d/.test(v.more)?`<span class="pill">${v.more.split(' ')[0]}</span>`:''}</div></div>`;}
function mgroup(g,sel){return `<section class="grp"><header><span class="gt ${g.tone}">${ic(g.icon,'s16')}</span><h3>${g.title}</h3><span class="gc">${g.count}</span></header>${g.ids.map(id=>mrow(id,sel)).join('')}${g.more?`<div class="more">${g.more}${ic('caret-down','s14')}</div>`:''}</section>`;}
function phone(s){
  if(s==='loading') return `<div class="ph-wrap">${skList(1)}</div>`;
  if(s==='empty') return `<div class="ph-wrap"><div class="allgood" style="flex-direction:column;text-align:center;padding:28px 20px"><span class="halo">${ic('calendar-check','s24')}</span><div><b>Frota em dia esta semana</b><p>Nenhuma preventiva vencida. A próxima é a revisão B do C-044, na qui 10/12.</p></div></div>${mgroup(GROUPS[2],null)}</div>`;
  const sel=s==='list'?null:s==='schedule'?'dly':'c320';
  const list=`<div class="ph-wrap">${head({phone:1})}${search()}${GROUPS.map(g=>mgroup(g,sel)).join('')}</div>`;
  if(s==='list') return list;
  const sheet=s==='schedule'
    ?`<div class="sheet-ov"><div class="sheet">${pHead(V.dly,{phone:1,title:'Agendar visita',sub:'DLY1J07, revisão B',back:1})}<div class="sb">${scheduleBody()}</div>${scheduleFoot()}</div></div>`
    :`<div class="sheet-ov"><div class="sheet">${pHead(V.c320,{phone:1})}<div class="sb">${visitBody()}</div>${visitFoot(1)}</div></div>`;
  return list+sheet;
}

/* ---------- kit integration: the proposed Preventiva menu item; sheets cover the whole phone screen ---------- */
function patchNav(){
  document.querySelectorAll('fx-app').forEach(app=>{
    const side=app.querySelector('.fx-side');
    if(side&&!side.querySelector('[data-pv]')){
      const os=[...side.querySelectorAll('.fx-ni')].find(n=>n.getAttribute('title')==='Ordens de serviço');
      if(os){os.insertAdjacentHTML('afterend',`<div class="fx-ni on" title="Preventiva" data-pv><i class="fx-bar"></i><span class="fx-nib">${ic('calendar-check','s16',1)}</span></div>`);}
      side.querySelectorAll('.fx-ni.on:not([data-pv])').forEach(n=>{n.classList.remove('on');n.querySelector('.fx-bar')?.remove();});
    }
    const mn=app.querySelectorAll('.fx-mnav .fx-mi');const more=mn[mn.length-1];
    if(more&&!more.classList.contains('on')){more.classList.add('on');more.insertAdjacentHTML('beforeend','<i></i>');}
    app.querySelector('.fx-body')?.classList.add('calm');
  });
}
function lift(){document.querySelectorAll('.fx-device.phone').forEach(d=>{const ov=d.querySelector('.fx-body .sheet-ov');if(ov) d.querySelector('.fx-screen').appendChild(ov);});}
function fit(){
  document.querySelectorAll('.devices .fx-device').forEach(d=>{d.style.zoom='';const box=d.closest('.devices');if(!box)return;const avail=box.clientWidth,w=d.offsetWidth;if(w>avail&&avail>0)d.style.zoom=(avail/w).toFixed(4);});
}
function themes(){
  document.querySelectorAll('.themebar').forEach(t=>t.querySelectorAll('button').forEach(b=>b.onclick=()=>{
    t.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));
    t.closest('section').querySelectorAll('.fx-device').forEach(d=>d.classList.toggle('dark',b.dataset.t==='dark'));
  }));
}
function clean(){document.querySelectorAll('.fx-device.phone .fx-screen>.sheet-ov').forEach(o=>o.remove());}
const R={ag:(s,dev)=>{clean();return dev==='phone'?phone(s):web(s,dev);},phl:()=>phone('list'),phs:(s)=>{clean();setTimeout(lift);return phone(s);}};
R.ag=(s,dev)=>web(s,dev);
function boot(){patchNav();F.bind(R);lift();fit();themes();
  document.querySelectorAll('.states button').forEach(b=>b.addEventListener('click',()=>setTimeout(lift)));
  let t;window.addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(fit,120);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot));else setTimeout(boot);
})();
