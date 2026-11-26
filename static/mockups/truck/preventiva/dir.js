/* preventiva · visual directions A ("Painel de operação") and B ("Lista densa") for Agenda, Chegada and Plano */
(function(){
const F=window.FX, ic=F.ic, btn=F.btn;
const D={};

/* ---------- atoms ---------- */
function sil(parts,h=18){
  const gap=3;let x=0;const g=[];let marks=false;
  const mark=(cx,t)=>{if(t==='over'){marks=true;return `<g class="mo"><circle cx="${cx}" cy="-5.5" r="5"/><path d="M${cx} -8.4v3.4M${cx} -2.8v.1"/></g>`;}if(t==='now'){marks=true;return `<circle class="mn" cx="${cx}" cy="-5.5" r="3.4"/>`;}return '';};
  parts.forEach(([k,t])=>{
    const c='s-'+(t||'none');
    const cw=k==='cav'?32:k==='dolly'?15:42; g.push(mark(x+cw/2,t));
    if(k==='cav'){g.push(`<g class="${c}" transform="translate(${x},0)"><rect class="b" x="0" y="12" width="32" height="3.6" rx="1"/><path class="b" d="M1 13V5.6Q1 3 3.6 3H11.2l3.6 5.2V13z"/><path class="g" d="M3.6 5h6.9l2.5 3.5H3.6z"/><rect class="b" x="19" y="9.6" width="9" height="2.4" rx="1"/><circle class="w" cx="6" cy="18" r="2.9"/><circle class="w" cx="21" cy="18" r="2.9"/><circle class="w" cx="27.4" cy="18" r="2.9"/></g>`);x+=32+gap;}
    else if(k==='dolly'){g.push(`<g class="${c}" transform="translate(${x},0)"><rect class="b" x="0" y="12" width="15" height="3.6" rx="1"/><circle class="w" cx="4" cy="18" r="2.9"/><circle class="w" cx="11" cy="18" r="2.9"/></g>`);x+=15+gap;}
    else {const w=42;g.push(`<g class="${c}" transform="translate(${x},0)"><rect class="b" x="0" y="2.5" width="${w}" height="10.5" rx="1.6"/><rect class="b" x="0" y="12" width="${w}" height="3.6" rx="1"/><circle class="w" cx="${w-16}" cy="18" r="2.9"/><circle class="w" cx="${w-9.6}" cy="18" r="2.9"/><circle class="w" cx="${w-3.2}" cy="18" r="2.9"/></g>`);x+=w+gap;}
  });
  const W=x-gap, top=marks?11:0, H=21+top, hh=h*H/21;
  return `<svg class="sil" width="${(W*hh/H).toFixed(1)}" height="${hh.toFixed(1)}" viewBox="0 ${-top} ${W} ${H}" role="img" aria-label="Composição do conjunto; o sinal acima marca o veículo com preventiva">${g.join('')}</svg>`;
}
function meter(used,v,o={}){
  const over=used>1, near=!over&&used>=.9;
  return `<div class="mt ${over?'over':''} ${near?'near':''} ${o.sm?'sm':''}" title="${o.tip||''}"><div class="tr"><i class="win" style="width:${(o.win||.08)*100}%"></i><i class="wt" style="right:${(o.win||.08)*100}%"></i><i class="fl" style="width:${Math.min(used,1)*100}%"></i></div>${v!=null?`<span class="v">${v}</span>`:''}</div>`;
}
const kb=k=>`<span class="kb">${k}</span>`;
const sw=on=>`<span class="sw2 ${on?'on':''}" role="switch" aria-checked="${!!on}"></span>`;

/* ---------- data ---------- */
const V=[
  {g:'over',id:'C-320',set:1,parts:[['cav','now'],['car'],['car','over'],['car']],sub:'QRT4B22 + 3 carretas',base:'Base Curitiba',svc:'Lona de freio, eixo 3',svs:'2º RTE1J77 · +2 nesta visita',used:1.03,mv:'−1.850 km',when:['há 3 dias','venceu em 23/11'],where:['garage','No pátio · OS 1042'],act:'Incluir na OS',pk:[1,'peças ok'],h:'3 h 20'},
  {g:'over',id:'DLY1J07',parts:[['cav','over']],sub:'Cavalo · frota 812',base:'Base Curitiba',svc:'Revisão B',svs:'inclui a A',used:1.07,mv:'−4.300 km',when:['há 7 dias','venceu em 19/11'],where:['road-horizon','Rodando · 640 km/dia'],act:'Agendar sáb 28/11',pk:[0,'falta 1 filtro de ar'],h:'4 h'},
  {g:'over',id:'C-207',set:1,parts:[['cav'],['car','over'],['car','now']],sub:'QRT9D14 + 2 carretas',base:'Base Três Lagoas',svc:'Fueiros e barrotes',svs:'1º RTC3B19 · +1 nesta visita',used:1.1,mv:'−3 dias',when:['há 3 dias','venceu em 23/11'],where:['calendar-check','Agendado sex 27/11'],act:'Reagendar',pk:[1,'sem peças'],h:'1 h'},
  {g:'week',id:'C-118',set:1,parts:[['cav','now'],['car'],['car','soon']],sub:'QRT7C10 + 2 carretas',base:'Base Curitiba',svc:'Revisão A',svs:'cavalo · +1 que cabe junto',used:.9,mv:'1.900 km',when:['sáb 28/11','previsto · em 2 dias'],where:['road-horizon','Rodando · 650 km/dia'],act:'Agendar',pk:[1,'peças ok'],h:'2 h 30'},
  {g:'week',id:'QRT1A09',parts:[['cav','now']],sub:'Cavalo · frota 820',base:'Base Ponta Grossa',svc:'Revisão A',svs:'',used:.88,mv:'2.400 km',when:['dom 29/11','previsto · em 3 dias'],where:['road-horizon','Rodando · 710 km/dia'],act:'Agendar',pk:[1,'peças ok'],h:'1 h 30'},
  {g:'week',id:'RTA4A44',parts:[['car','now']],sub:'Carreta · no QRT2E88',base:'Base Três Lagoas',svc:'Fueiros e barrotes',svs:'',used:.93,mv:'3 dias',when:['dom 29/11','pela data'],where:['link-simple','Engatada no QRT2E88'],act:'Agendar',pk:[1,'sem peças'],h:'30 min'},
  {g:'later',id:'C-044',set:1,parts:[['cav','soon'],['car'],['car','soon']],sub:'QRT3F21 + 2 carretas',base:'Base Curitiba',svc:'Revisão B',svs:'cavalo · +1',used:.85,mv:'9.200 km',when:['qui 10/12','previsto · em 14 dias'],where:['road-horizon','Rodando · 690 km/dia'],act:'Agendar',pk:[0,'falta 2 lonas'],h:'5 h'},
  {g:'later',id:'QRT6H33',parts:[['cav','soon']],sub:'Cavalo · frota 818',base:'Base Ponta Grossa',svc:'Lona de freio, eixos 2 e 3',svs:'',used:.8,mv:'11.800 km',when:['ter 15/12','previsto · em 19 dias'],where:['road-horizon','Rodando · 600 km/dia'],act:'Agendar',pk:[1,'peças ok'],h:'2 h'},
  {g:'nokm',id:'SRT2C55',parts:[['car']],sub:'Carreta · sem engate desde 05/11',base:'Base Curitiba',svc:'3 preventivas por km paradas',svs:'as por data seguem',used:null,mv:'sem km',when:['sem data','último km 05/11'],where:['question','Sem engate há 21 dias'],act:'Registrar engate',pk:[1,''],h:''},
];
const CAP=[['qui 26','hoje',40,40],['sex 27','',39,40],['sáb 28','',14,24],['seg 30','',22,40],['ter 01','',18,40],['qua 02','',12,40],['qui 03','',30,40],['sex 04','',8,40]];
function capStrip(o={}){
  return `<div class="cap ${o.compact?'cp':''}">${o.compact?'':`<div class="caph"><b>Carga da oficina</b><span>Base Curitiba · horas marcadas e disponíveis por dia</span><span class="sp"></span>${F.fchip('Base Curitiba',{menu:1,size:'sm'})}</div>`}<div class="capd">${CAP.slice(0,o.n||8).map(([d,t,b,a],i)=>{const free=a-b, first=i===2;return `<div class="cd ${first?'first':''} ${free<=1?'full':''}" title="${d}: ${b} h de ${a} h marcadas"><span class="bar"><i style="height:${b/a*100}%"></i></span><b>${d}</b><span class="f">${free<=1?'cheio':free+' h livres'}</span>${first?'<span class="tag2">primeira vaga</span>':''}</div>`;}).join('')}</div></div>`;
}
const G={over:['Vencidas','3 visitas · 5 preventivas'],week:['Próximos 7 dias','3 visitas'],later:['Próximos 30 dias','9 visitas · mostrando 2'],nokm:['Sem km','2 veículos']};

/* =====================================================================
   AGENDA · A
   ===================================================================== */
function horizon(){
  const days=[[2,'C-118',1],[3,'',1],[3.4,'',1],[6,'',0],[9,'',0],[11,'',0],[14,'C-044',1],[16,'',0],[19,'QRT6H33',1],[22,'',0],[24,'',0],[27,'',0]];
  const pos=d=>`${d/30*100}%`;
  return `<div class="hz"><div class="ax"><div class="hlate" title="3 visitas vencidas"><span class="dt"></span>3 vencidas</div>
    <div class="rail"><span class="wnd" style="width:${7/30*100}%"></span>${[7,14,21,28].map(d=>`<i class="hwk" style="left:${pos(d)}"></i><span class="wl" style="left:${pos(d)}">${({7:'3/12',14:'10/12',21:'17/12',28:'24/12'})[d]}</span>`).join('')}<span class="wl" style="left:0;transform:none">hoje 26/11</span><i class="today"></i>
      ${days.map(([d,l,big])=>`<i class="mk ${big?'':'sm'}" style="left:${pos(d)}" title="${l||'visita'} · dia ${Math.round(d)}"></i>${l?`<span class="ml" style="left:${pos(d)}">${l}</span>`:''}`).join('')}</div></div>
    <div class="legend2"><span><i class="mk" style="position:static;margin:0;width:10px;height:10px;box-shadow:none"></i>visita prevista pelo km por dia</span><span><span style="display:inline-block;width:18px;height:8px;border-radius:3px;background:hsl(0 0% 100%/.16)"></span>esta semana</span></div></div>`;
}
function bandA(){
  return `<div class="band"><div class="top">
    <div class="hero2"><span class="k">Vencidas agora</span><div class="hn"><span class="n tn">5</span><span class="sm">preventivas em 3 visitas<br>6.150 km rodados vencidas</span></div></div>
    <span class="sp"></span>
    <div class="mini2"><div><span class="n">4</span><span class="k">em 7 dias</span></div><div><span class="n">14</span><span class="k">em 30 dias</span></div><div><span class="n">2</span><span class="k">sem km</span></div></div>
    <div class="act"><span class="qa">${ic('chart-bar','s14')}78% no prazo em 90 dias${ic('caret-right','s12')}</span><span class="qa">${ic('package','s14')}Peças dos 30 dias</span></div></div>${horizon()}</div>`;
}
function rowA(v,sel){
  const act=sel?`${btn(v.act==='Incluir na OS'?'Incluir na OS 1042':v.act,{size:'sm',icon:v.act==='Incluir na OS'?'plus':'calendar-plus'})}<span class="ib" title="Mais ações" aria-label="Mais ações">${ic('dots-three-vertical-bold','s16')}</span>`:`<span class="ib ghost" title="Mais ações" aria-label="Mais ações">${ic('dots-three-vertical-bold','s16')}</span>`;
  const pk=v.pk&&v.pk[1]?`<span class="pk ${v.pk[0]?'':'miss'}">${ic(v.pk[0]?'package':'package','s12')}${v.pk[1]}</span>`:'';
  const over=v.g==='over';
  return `<div class="ra ${sel?'sel':''}"><div class="id"><div class="nm"><b>${v.set?'Conjunto ':''}${v.id}</b><span title="${v.sub} · ${v.base}">${v.sub}</span></div>${sil(v.parts,26)}</div>
    <div class="sv"><div class="t"><b title="${v.svc}">${v.svc}</b>${v.svs?`<span>${v.svs}</span>`:''}${pk}</div>${v.used==null?`<div class="mt"><div class="tr" style="background:repeating-linear-gradient(90deg,hsl(var(--foreground)/.1) 0 4px,transparent 4px 8px)"></div><span class="v" style="color:hsl(var(--muted-foreground))">sem km</span></div>`:meter(v.used,v.mv)}</div>
    <div class="wn"><b>${v.when[0]}</b><span>${v.when[1]}</span></div>
    <div class="wh">${ic(v.where[0],'s16')}<span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${v.where[1]}">${v.where[1]}</span></div>
    <div class="ac">${act}</div></div>`;
}
D.agA=(s,dev)=>{
  if(dev==='phone') return agAphone(s);
  if(s==='loading') return `<div class="canvas"><div class="band" style="height:190px"></div><div class="surf">${[1,2,3,4,5].map(()=>`<div class="ra">${F.sk('70%',34)}${F.sk('90%',30)}${F.sk('60%',30)}${F.sk('70%',20)}${F.sk(90,28)}</div>`).join('')}</div></div>`;
  if(s==='first') return `<div class="canvas"><div class="band"><div class="top"><div class="stat"><span class="k">Agenda da frota</span><span class="n" style="font-size:22px">Sem plano ainda</span></div><span class="sp"></span></div><p style="margin-top:10px;max-width:640px;color:hsl(0 0% 100%/.75);font-size:14px">Sugerimos 3 planos pela frota que já está cadastrada: 24 cavalos 6x4, 61 carretas florestais e 8 dollies. O km já está sendo gravado, então a agenda aparece no mesmo dia.</p><div style="margin-top:14px">${btn('Ver planos sugeridos',{icon:'sparkle'})}</div></div></div>`;
  const tools=`<div class="toolbar"><span class="fx-searchf" style="flex:0 1 280px;background:hsl(var(--card))">${ic('magnifying-glass','s16')}<span>Buscar placa, frota ou conjunto</span>${kb('/')}</span><span class="qa">${ic('sort-ascending','s14')}Ordem: quando vence</span>${F.fchip('Todas as transportadoras',{menu:1,size:'sm'}).replace('fx-fchip','fx-fchip all')}${F.fchip('Todos os planos',{menu:1,size:'sm'}).replace('fx-fchip','fx-fchip all')}</div>`;
  const groups=['over','week','later','nokm'].map(g=>`<div class="ga ${g==='over'?'d':''}"><b>${G[g][0]}</b><span>${G[g][1]}</span><i class="ln"></i></div><div class="surf">${V.filter(v=>v.g===g).map((v,i)=>rowA(v,s==='hover'&&g==='over'&&i===1)).join('')}</div>`).join('');
  return `<div class="canvas">${bandA()}${capStrip()}${tools}<div>${groups}</div></div>`;
};
function agAphone(s){
  const band=`<div class="ps" style="padding:0"><div class="pband"><div style="display:flex;align-items:flex-end;gap:14px"><div style="display:flex;flex-direction:column"><span style="font:600 12px Inter;color:hsl(0 0% 100%/.7)">Vencidas agora</span><span style="font:700 34px/1 Sora;color:hsl(var(--danger-soft))" class="tn">5</span></div><div style="display:flex;gap:14px;margin-left:auto;text-align:right"><div><b class="tn" style="font:700 17px Sora;display:block">4</b><span style="font:600 12px Inter;color:hsl(0 0% 100%/.7)">em 7 dias</span></div><div><b class="tn" style="font:700 17px Sora;display:block">14</b><span style="font:600 12px Inter;color:hsl(0 0% 100%/.7)">em 30 dias</span></div></div></div>
    <div class="mini"><i class="d" style="left:4%"></i>${[8,11,12,20,30,37,47,53,63,73,80,90].map(p=>`<i style="left:${p}%;width:6px;height:6px;margin:-3px 0 0 -3px"></i>`).join('')}</div><div style="display:flex;justify-content:space-between;margin-top:4px;font:600 10px Inter;color:hsl(0 0% 100%/.55)"><span>hoje</span><span>+30 dias</span></div></div></div>`;
  if(s==='loading') return `${band}<div style="display:flex;flex-direction:column;gap:10px;padding-top:12px">${[1,2,3].map(()=>F.sk('100%',130,16)).join('')}</div>`;
  const card=(v,i)=>`<div class="pc ${s==='swipe'&&i===1?'swiped':''}">${s==='swipe'&&i===1?`<div class="sw"><span class="a1">${ic('clock-countdown','s20')}Adiar</span><span class="a2">${ic('calendar-plus','s20')}Agendar</span></div>`:''}<div class="in"><div class="l1"><b>${v.set?'C-':''}${v.id.replace('C-','')}</b>${sil(v.parts,18)}<span class="w">${v.when[0]}</span></div>
    <div class="sv"><b>${v.svc}</b><span>${v.svs||v.sub}</span></div>${meter(v.used,v.mv)}${v.pk&&v.pk[1]?`<span class="pk ${v.pk[0]?'':'miss'}">${ic('package','s12')}${v.pk[1]}</span>`:''}<div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:hsl(var(--muted-foreground))">${ic(v.where[0],'s16')}<span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${v.where[1]}</span>${ic('caret-left','s14')}<span>deslize</span></div></div></div>`;
  let out=`${band}<div style="display:flex;flex-direction:column;gap:10px;padding:12px 0 96px"><div class="ga d" style="margin:2px 2px 0"><b>Vencidas</b><span>3 visitas</span><i class="ln"></i></div>${V.filter(v=>v.g==='over').map(card).join('')}<div class="ga" style="margin:6px 2px 0"><b>Próximos 7 dias</b><span>3 visitas</span><i class="ln"></i></div>${V.filter(v=>v.g==='week').slice(0,1).map((v)=>card(v,9)).join('')}</div>`;
  if(s==='sheet') out+=F.sheet({title:'Agendar visita',body:`<div style="display:flex;align-items:center;gap:10px"><b style="font:700 16px Sora">DLY1J07</b>${sil([['cav','over']],16)}<span class="muted" style="font-size:12.5px">Revisão B</span></div><div class="fld"><label>Dia, pela carga da Base Curitiba</label>${capStrip({compact:1,n:5})}<span class="hint">Sábado é o primeiro dia com vaga para as 4 h da revisão. Hoje e sexta estão cheios</span></div><div class="fld"><label>Base</label><div class="in2">Base Curitiba${ic('caret-down','s16 muted')}</div></div>`,action:'Agendar sáb 28/11',consequence:'Aparece na portaria e entra na OS na chegada'});
  return out;
}

/* =====================================================================
   AGENDA · B
   ===================================================================== */
function rowB(v,sel){
  return `<div class="tr2 ${sel?'sel':''}"><span class="cbx ${sel?'on':''}">${sel?ic('check-bold','s12'):''}</span>
    <span class="v1" title="${v.sub} · ${v.base}">${sil(v.parts,16)}<b>${v.set?'C-':''}${v.id.replace('C-','')}</b></span>
    <span class="s1" title="${v.svc}">${v.svc}${v.svs?` <span>· ${v.svs}</span>`:''}</span>
    ${v.used==null?`<span class="muted" style="font-size:12.5px">sem km</span>`:meter(v.used,v.mv,{sm:1})}
    <span class="w1 r">${v.when[0]}</span>
    <span class="pk ${v.pk&&!v.pk[0]?'miss':''}">${v.pk&&v.pk[1]?ic('package','s12')+v.pk[1]:''}</span></div>`;
}
function paneB(id){
  if(id==='DLY1J07') return `<div class="pane dock"><div class="ph"><div class="r1"><h4>DLY1J07</h4><span style="flex:1"></span><span class="qa">${kb('Esc')}</span></div><div class="s">Cavalo 6x4 · frota 812 · Base Curitiba</div>${sil([['cav','over']],26)}</div>
    <div class="facts"><div><div class="k">Vencida há</div><div class="v dang">4.300 km</div></div><div><div class="k">Km por dia</div><div class="v">640</div></div><div><div class="k">Onde</div><div class="v" style="font-size:13px">Rodando</div></div></div>
    <div class="sec"><span class="lbl">Revisão B · inclui a A</span>${meter(1.07,'−4.300 km')}<div class="hl2" style="margin-top:10px"><div><span class="m">Última</span><span>02/06 · 96.100 km</span><span class="m">OS 0702</span></div><div><span class="m">Era em</span><span>156.100 km</span><span class="m">19/11</span></div></div></div>
    <div class="sec"><span class="lbl">Quando cabe · Base Curitiba · 4 h</span>${capStrip({compact:1,n:5})}</div>
    <div class="sec"><span class="lbl">Peças do kit</span><div class="kitl"><div><span>Óleo e filtros</span><span class="ok">em estoque</span></div><div><span>Filtro de ar</span><span style="font-weight:600">falta 1 · chega seg 30/11</span></div></div></div>
    <div class="pf">${btn('Adiar',{variant:'outline'})}${btn('Agendar sáb 28/11',{icon:'calendar-plus'})}</div></div>`;
  const it=(n,p,u,v)=>`<div class="pi"><div class="t"><b>${n}</b><span>${p}</span></div>${meter(u,v,{sm:1})}</div>`;
  return `<div class="pane dock"><div class="ph"><div class="r1"><h4>Conjunto C-320</h4><span style="flex:1"></span><span class="qa">${kb('J')}${kb('K')}</span></div><div class="s">QRT4B22 + RTF6K38 · RTE1J77 · SRK9H46 · Base Curitiba</div>${sil([['cav','now'],['car'],['car','over'],['car']],26)}</div>
    <div class="facts"><div><div class="k">No pátio</div><div class="v">OS 1042</div></div><div><div class="k">Pior atraso</div><div class="v dang">1.850 km</div></div><div><div class="k">A mais na OS</div><div class="v">+3 h 20</div></div></div>
    <div class="sec"><span class="lbl">Preventivas desta visita</span>${it('Lona de freio, eixo 3','2º RTE1J77',1.03,'−1.850 km')}${it('Lubrificação geral','1º, 2º e 3º',.94,'2 dias')}${it('Troca de óleo e filtros','cavalo',.94,'1.200 km')}</div>
    <div class="sec"><span class="lbl">Peças do kit</span><div class="kitl"><div><span>4 lonas, 8 molas</span><span class="ok">em estoque</span></div><div><span>38 l de óleo, 3 filtros</span><span class="ok">em estoque</span></div></div></div>
    <div class="sec"><span class="lbl">Últimas visitas</span><div class="hl2"><div><span class="m">07/11</span><span>OS 1042 · corretiva</span><span class="m">aberta</span></div><div><span class="m">12/05</span><span>OS 0871 · lona eixo 3</span><span class="m">no prazo</span></div></div></div>
    <div class="pf">${btn('Adiar',{variant:'outline'})}${btn('Incluir as 3 na OS',{icon:'plus'})}</div></div>`;
}
D.agB=(s,dev)=>{
  if(dev==='phone') return agBphone(s);
  const sel=s==='sel2'?'DLY1J07':s==='closed'?'':'C-320';
  const tbar=`<div class="tbar">${[['Todas',25],['Vencidas',3],['7 dias',3],['30 dias',9],['Sem km',2]].map(([l,n],i)=>`<span class="vch ${i===0?'on':''}">${l} <b>${n}</b></span>`).join('')}<span style="flex:1"></span><span class="qa">${ic('chart-bar','s14')}78% no prazo em 90 dias${ic('caret-right','s12')}</span><span class="fx-searchf" style="width:200px">${ic('magnifying-glass','s14')}<span>Buscar</span>${kb('/')}</span><span class="qa">${ic('sliders-horizontal','s14')}Filtros</span><span class="qa">${ic('rows','s14')}Por visita</span></div>`;
  const th=`<div class="th"><span></span><span>Veículo</span><span>Preventiva</span><span>Até vencer</span><span class="r srt">Quando${ic('arrow-up','s12')}</span><span>Peças</span></div>`;
  const body=s==='loading'?[1,2,3,4,5,6].map(()=>`<div class="tr2">${F.sk(16,16)}${F.sk('80%',14)}${F.sk('80%',14)}${F.sk('100%',6)}${F.sk(60,14)}${F.sk('70%',14)}</div>`).join('')
    :['over','week','later','nokm'].map(g=>`<div class="gb ${g==='over'?'d':''}">${ic('caret-down','s12')}<b>${G[g][0]}</b><span class="n">${G[g][1]}</span></div>${V.filter(v=>v.g===g).map(v=>rowB(v,v.id===sel)).join('')}`).join('');
  const table=`<div class="surf" style="overflow:hidden">${tbar}${th}${body}<div class="tfoot"><span>25 visitas</span><span style="flex:1"></span>${kb('J')}${kb('K')} navegar ${kb('A')} agendar ${kb('D')} adiar</div></div>`;
  if(s==='closed') return `<div class="canvas">${table}</div>`;
  return `<div class="lb">${table}${s==='loading'?`<div class="pane dock">${F.sk('100%',300)}</div>`:paneB(sel)}</div>`;
};
function agBphone(s){
  const tabs=`<div class="fx-msticky"><div class="fx-mtabs">${[['Todas',25],['Vencidas',3],['7 dias',3],['30 dias',9]].map(([t,n],i)=>`<span class="${i===0?'on':''}">${t}<b>${n}</b></span>`).join('')}</div></div>`;
  const rows=g=>V.filter(v=>v.g===g).map(v=>`<div class="pr"><span class="a">${sil(v.parts,16)}<b>${v.set?'C-':''}${v.id.replace('C-','')}</b></span><span class="w">${v.when[0]}</span><div class="b"><span style="flex:0 1 auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:46%">${v.svc}${v.pk&&!v.pk[0]?` · <b style="color:hsl(var(--foreground))">${v.pk[1]}</b>`:''}</span>${v.used==null?'':meter(v.used,v.mv,{sm:1})}</div></div>`).join('');
  let out=`<div class="fx-mlist">${tabs}<div style="padding:0 12px 96px">${['over','week','later'].map(g=>`<div class="pgh ${g==='over'?'d':''}"><b>${G[g][0]}</b><span class="n">${G[g][1].split(' · ')[0]}</span></div>${rows(g)}`).join('')}</div></div>`;
  if(s==='detail') out+=`<div class="fsheet"><div class="h">${ic('caret-left','s20')}<b>Conjunto C-320</b></div><div class="bd">${sil([['cav','now'],['car'],['car','over'],['car']],30)}
    <div class="surf" style="padding:12px 14px;display:flex;flex-direction:column;gap:12px">${[['Lona de freio, eixo 3','2º RTE1J77',1.03,'−1.850 km'],['Lubrificação geral','1º, 2º e 3º',.94,'2 dias'],['Troca de óleo e filtros','cavalo',.94,'1.200 km']].map(x=>`<div><div style="display:flex;justify-content:space-between;gap:8px;font-size:14px"><b style="font-weight:600">${x[0]}</b><span class="muted" style="font-size:12.5px">${x[1]}</span></div>${meter(x[2],x[3])}</div>`).join('')}</div>
    <div class="surf" style="padding:12px 14px" class="kitl"><span class="lbl">Kit</span><div class="kitl" style="margin-top:6px"><div><span>4 lonas, 8 molas</span><span class="ok">em estoque</span></div><div><span>38 l de óleo, 3 filtros</span><span class="ok">em estoque</span></div></div></div></div>
    <div class="ft">${btn('Adiar',{variant:'outline',size:'lg'})}${btn('Incluir na OS 1042',{size:'lg'})}</div></div>`;
  return out;
}

/* =====================================================================
   CHEGADA · A and B
   ===================================================================== */
const CV=[
  {pos:'Cavalo',pl:'QRT4B22',k:'cav',items:[{n:'Troca de óleo e filtros',p:'Revisão A',u:.94,v:'1.200 km',t:40,pk:[1,'kit ok']}]},
  {pos:'1º',pl:'RTF6K38',k:'car',items:[{n:'Lubrificação geral',p:'todo o veículo',u:.94,v:'2 dias',t:20,pk:[1,'graxa ok']}]},
  {pos:'2º',pl:'RTE1J77',k:'car',items:[{n:'Lona de freio, eixo 3',p:'os dois lados',u:1.03,v:'−1.850 km',t:70,pk:[0,'falta 2 lonas · chegam 14h']},{n:'Lubrificação geral',p:'todo o veículo',u:.94,v:'2 dias',t:20,pk:[1,'graxa ok']}]},
  {pos:'3º',pl:'SRK9H46',k:'car',items:[{n:'Regulagem de catraca',p:'eixos 1 a 3 · cabe junto',u:.92,v:'3.600 km',t:30,pk:[1,'sem peças']},{n:'Fueiros e barrotes',p:'os dois lados',u:1.07,v:'−2 dias',t:20,pk:[1,'sem peças']}]},
];
const hm=m=>m>=60?`${Math.floor(m/60)} h${m%60?' '+(m%60):''}`:`${m} min`;
const cbx2=(st)=>`<span class="cb3 ${st}" role="checkbox" aria-checked="${st==='on'?'true':st==='mix'?'mixed':'false'}">${st==='on'?ic('check-bold','s14'):st==='mix'?ic('minus-bold','s14'):''}</span>`;
function chState(s){
  const offN=s==='off'?['Regulagem de catraca']:[];
  const chk=s==='check';
  const isOff=(v,i)=>offN.includes(i.n)||(chk&&v.pos==='Cavalo');
  let n=0,mins=0;CV.forEach(v=>v.items.forEach(i=>{if(!isOff(v,i)){n++;mins+=i.t;}}));
  const base=13*60+20, out=base+mins, hh=`${Math.floor(out/60)}h${String(out%60).padStart(2,'0')}`;
  return {isOff,n,total:6,mins,hh,chk};
}
function downtime(st){
  return `<div class="dtm"><span class="dk">A mais na parada</span><b class="tn">+${hm(st.mins)}</b><span class="dv">sai <b>${st.hh}</b> em vez de 13h20</span></div>`;
}
function headCheck(st){return `<span class="hck">${cbx2(st.n===st.total?'on':st.n?'mix':'')}<span><b class="tn">${st.n} de ${st.total}</b> incluídas</span></span>`;}
function cform(s){
  return `<div class="cform"><div class="fl2"><label>Km do cavalo QRT4B22 <span class="req">*</span></label><div class="in2 km" ${s==='check'?'style="box-shadow:inset 0 0 0 2px hsl(var(--warning))"':''}>${s==='check'?'215.318':'152.318'}<span class="u">km</span></div></div>
    <div class="fl2"><label>Problema <span class="req">*</span></label><div class="in2"><span class="t">Freio puxando para a direita e vazamento de ar</span></div></div>
    <div class="fl2"><label>Box</label><div style="display:flex;gap:6px">${F.fchip('Box 3 · livre',{on:1,size:'lg'})}${F.fchip('Box 5',{size:'lg'})}</div></div></div>`;
}
function obar(st){
  return `<div class="obar stick"><div class="sum"><b>${st.n} preventivas entram na OS · +${hm(st.mins)}</b><span>Kit sugerido: 4 lonas, 8 molas, 38 l de óleo, 3 filtros, graxa. Faltam 2 lonas, que chegam às 14h</span></div><div class="bt">${btn('Cancelar',{variant:'outline',size:'lg'})}${btn(`Abrir OS com ${st.n} preventivas`,{size:'lg',icon:'check'})}</div></div>`;
}
const itemPk=i=>`<span class="pk ${i.pk[0]?'':'miss'}">${ic('package','s12')}${i.pk[1]}</span>`;
D.chA=(s,dev)=>{
  if(dev==='phone') return chAphone(s);
  const st=chState(s);
  const cols=CV.map(v=>{const over=v.items.some(i=>i.u>1);
    return `<div class="vcol2 has ${over?'over':''}"><div class="vh2"><div class="r"><b>${v.pos}</b><span>${v.pl}</span><span class="c">${v.items.length}</span></div>${sil([[v.k,over?'over':'now']],18)}</div>
      ${v.items.map(i=>{const off=st.isOff(v,i);return `<div class="tg ${off?'off':''}">${cbx2(off?'':'on')}<div><b>${i.n}</b><span>${st.chk&&v.pos==='Cavalo'?'espera o km ser conferido':i.p}</span>${meter(i.u,i.v,{sm:1})}<span class="meta2"><span class="tn">${ic('clock','s12')}${hm(i.t)}</span>${itemPk(i)}</span></div></div>`;}).join('')}</div>`;}).join('');
  const band=`<div class="setband"><div class="hd">${sil([['cav','now'],['car','now'],['car','over'],['car','now']],30)}<div style="min-width:0"><b>Conjunto C-320</b><br><span>${st.chk?'A do cavalo espera o km ser conferido':'3 vencidas e 3 que cabem junto'}</span></div><span style="flex:1"></span>${downtime(st)}${headCheck(st)}</div><div class="vcols">${cols}</div>
    <div style="display:flex;align-items:center;gap:8px;margin-top:10px;font-size:12.5px;color:hsl(var(--muted-foreground))">${ic('info','s14')}<span style="flex:1">Rolamento de cubo do 1º vence em 11 mil km e fica para a próxima visita</span><span class="qa" style="color:hsl(var(--primary))">Incluir mesmo assim</span></div></div>`;
  const warn=st.chk?F.notice('warning','warning','215.318 km é 63 mil km a mais que ontem. Fica a conferir; as preventivas do cavalo esperam, as das carretas seguem'):'';
  return `<div class="canvas">${cform(s)}${warn}${band}${obar(st)}</div>`;
};
function chAphone(s){
  const st=chState(s);
  const all=CV.flatMap(v=>v.items.map(i=>({...i,vv:v,veh:`${v.pos} ${v.pl}`})));
  return `<div class="canvas" style="padding-bottom:96px"><div class="setband" style="padding:12px"><div style="margin-bottom:8px">${sil([['cav','now'],['car','now'],['car','over'],['car','now']],22)}</div><b style="font:800 16px Sora">Conjunto C-320</b>${downtime(st)}
    <div style="display:flex;gap:6px;margin-top:10px;overflow:hidden">${F.fchip('Todos 6',{on:1,size:'sm'})}${F.fchip('Cavalo 1',{size:'sm'})}${F.fchip('2º 2',{size:'sm'})}${F.fchip('3º 2',{size:'sm'})}</div></div>
    <div class="surf" style="overflow:hidden"><div class="tbar" style="padding:10px 12px">${headCheck(st)}</div>${all.slice(0,4).map(i=>{const off=st.isOff(i.vv,i);return `<div class="tg">${cbx2(off?'':'on')}<div><b>${i.n}</b><span>${i.veh} · ${hm(i.t)}</span>${meter(i.u,i.v,{sm:1})}<span class="meta2">${itemPk(i)}</span></div></div>`;}).join('')}<div class="tfoot">e mais 2 nas carretas</div></div></div>
    <div style="position:absolute;z-index:6;left:0;right:0;bottom:84px;padding:10px 16px;background:hsl(var(--card));border-top:1px solid hsl(var(--border))"><div class="bigbtn">${ic('check','s20')}Abrir OS com ${st.n} preventivas</div></div>`;
}
D.chB=(s,dev)=>{
  if(dev==='phone') return chBphone(s);
  const st=chState(s);
  const left=`<div class="surf" style="padding:14px;display:flex;flex-direction:column;gap:14px"><div style="display:flex;flex-direction:column;gap:8px"><span class="lbl">Entrando</span><b style="font:800 18px Sora">Conjunto C-320</b>${sil([['cav','now'],['car','now'],['car','over'],['car','now']],26)}<span class="muted" style="font-size:12.5px">QRT4B22 + RTF6K38 · RTE1J77 · SRK9H46</span></div>
    <div class="fl2"><label>Km do cavalo <span class="req">*</span></label><div class="in2 km" ${st.chk?'style="box-shadow:inset 0 0 0 2px hsl(var(--warning))"':''}>${st.chk?'215.318':'152.318'}<span class="u">km</span></div>${st.chk?`<span style="font-size:12.5px;color:hsl(var(--warning-ink));font-weight:600">63 mil km a mais que ontem · fica a conferir</span>`:`<span class="muted" style="font-size:12px">Telemetria 08:12 · ontem 151.690</span>`}</div>
    <div class="fl2"><label>Problema <span class="req">*</span></label><div class="in2" style="height:auto;min-height:64px;align-items:flex-start;padding:10px 14px;font-size:14px">Freio puxando para a direita e vazamento de ar</div></div>
    <div class="fl2"><label>Box</label><div style="display:flex;gap:6px">${F.fchip('Box 3 · livre',{on:1,size:'lg'})}${F.fchip('Box 5',{size:'lg'})}</div></div>
    <div class="fl2"><label>Previsão de saída</label><div class="in2"><span class="tn" style="font-weight:600">hoje ${st.hh}</span><span class="u">era 13h20</span></div></div></div>`;
  const rows=CV.map(v=>{const over=v.items.some(i=>i.u>1);return `<div class="gb ${over?'d':''}">${sil([[v.k,over?'over':'now']],13)}<b>${v.pos}</b><span class="n">${v.pl} · ${v.items.length}</span></div>${v.items.map(i=>{const off=st.isOff(v,i);return `<div class="tr2 c ${off?'off':''}">${cbx2(off?'':'on')}<span class="s1"><b style="font-weight:600">${i.n}</b><br><span>${st.chk&&v.pos==='Cavalo'?'espera o km':i.p}</span></span>${itemPk(i)}<span class="r tn">${hm(i.t)}</span>${meter(i.u,i.v,{sm:1})}</div>`;}).join('')}`;}).join('');
  const right=`<div class="surf" style="overflow:hidden"><div class="tbar" style="padding:10px 14px">${headCheck(st)}<b style="font:700 15px Sora;margin-left:6px">Preventivas desta visita</b><span style="flex:1"></span>${downtime(st)}</div><div class="th c"><span></span><span>Serviço</span><span>Peças</span><span class="r">Tempo</span><span>Até vencer</span></div>${rows}<div class="tfoot">${ic('info','s14')}<span style="flex:1">Rolamento de cubo do 1º vence em 11 mil km e fica para a próxima</span><span class="qa" style="color:hsl(var(--primary))">Incluir mesmo assim</span></div></div>`;
  return `<div class="canvas"><div class="cb2">${left}${right}</div>${obar(st)}</div>`;
};
function chBphone(s){
  const st=chState(s);
  return `<div class="fx-mlist"><div class="fx-msticky" style="padding-bottom:10px"><div style="display:flex;align-items:center;gap:10px">${sil([['cav','now'],['car','now'],['car','over'],['car','now']],18)}<b style="font:800 15px Sora">C-320</b><span class="muted tn" style="font-size:12.5px;margin-left:auto">+${hm(st.mins)} · sai ${st.hh}</span></div><div style="margin-top:8px">${headCheck(st)}</div></div>
    <div style="padding:0 12px 120px">${CV.map(v=>`<div class="pgh ${v.items.some(i=>i.u>1)?'d':''}"><b>${v.pos}</b><span class="n">${v.pl}</span></div>${v.items.map(i=>{const off=st.isOff(v,i);return `<div class="tg" style="padding:10px 4px">${cbx2(off?'':'on')}<div><b>${i.n}</b><span>${i.p} · ${hm(i.t)}</span>${meter(i.u,i.v,{sm:1})}<span class="meta2">${itemPk(i)}</span></div></div>`;}).join('')}`).join('')}</div></div>
    <div style="position:absolute;z-index:6;left:0;right:0;bottom:84px;padding:10px 16px;background:hsl(var(--card));border-top:1px solid hsl(var(--border))"><div class="bigbtn">${ic('check','s20')}Abrir OS com ${st.n} preventivas</div></div>`;
}

/* =====================================================================
   PLANO · A and B
   ===================================================================== */
const PI=[
  {l:'A',t:'Revisão A',e:'a cada 10 mil km ou 30 dias',items:[
    {n:'Lubrificação geral',w:'todo o veículo',ax:'whole',km:'10 mil km',tm:'30 dias',av:'1 mil km',kit:'graxa',fr:[1,6,52]},
    {n:'Fueiros e barrotes',w:'os dois lados',ax:'b',km:'',tm:'30 dias',av:'3 dias',kit:'sem peças',fr:[1,4,54]}]},
  {l:'B',t:'Revisão B',e:'inclui a A · a cada 60 mil km ou 6 meses',items:[
    {n:'Lona de freio',w:'eixos 1, 2 e 3 · os dois lados',ax:'b',km:'60 mil km',tm:'6 meses',av:'3 mil km',kit:'2 lonas e 4 molas por lado',fr:[2,3,54]},
    {n:'Regulagem de catraca',w:'cada eixo',ax:'whole',km:'60 mil km',tm:'6 meses',av:'3 mil km',kit:'sem peças',fr:[0,2,57]}]},
  {l:'C',t:'Revisão C',e:'inclui a A e a B · a cada 120 mil km ou 12 meses',items:[
    {n:'Rolamento de cubo',w:'cada eixo · os dois lados',ax:'b',km:'120 mil km',tm:'12 meses',av:'5 mil km',kit:'1 rolamento e 1 retentor por lado',fr:[0,0,59]},
    {n:'Sistema de ar',w:'todo o veículo',ax:'whole',km:'120 mil km',tm:'12 meses',av:'5 mil km',kit:'kit de reparo da válvula',fr:[1,0,58]}]},
];
const axd=t=>`<span class="axd ${t==='whole'?'whole':''}" title="Eixos 1, 2 e 3">${[1,2,3].map(()=>`<i class="${t==='whole'?'':'b'}"></i>`).join('')}</span>`;
const frm=f=>{const t=f[0]+f[1]+f[2];return `<div class="dist" style="height:6px" title="${f[0]} vencidas · ${f[1]} vencem agora · ${f[2]} em dia">${f[0]?`<i class="over" style="width:${f[0]/t*100}%"></i>`:''}${f[1]?`<i style="width:${f[1]/t*100}%;background:hsl(var(--foreground)/.6)"></i>`:''}<i style="width:${f[2]/t*100}%;background:hsl(var(--foreground)/.14)"></i></div>`;};
function cycle(){
  const ticks=(every,big)=>Array.from({length:Math.floor(120/every)},(_, i)=>(i+1)*every).map(k=>`<i class="${big?'big':''}" style="left:${k/120*100}%"></i>`).join('');
  return `<div class="cyc"><div class="rowc"><span class="n"><i>A</i>Revisão A</span><div class="trk">${ticks(10)}</div><span class="e">12 vezes</span></div><div class="rowc"><span class="n"><i>B</i>Revisão B</span><div class="trk">${ticks(60,1)}</div><span class="e">2 vezes, com a A</span></div><div class="rowc"><span class="n"><i>C</i>Revisão C</span><div class="trk">${ticks(120,1)}</div><span class="e">1 vez, com A e B</span></div>
    <div class="axl2"><span></span><div>${[0,30,60,90,120].map(k=>`<span style="left:${k/120*100}%">${k?k+' mil km':'0'}</span>`).join('')}</div><span></span></div></div>`;
}
function ptRows(selN,o={}){
  return PI.map(lv=>`<div class="lvb"><span class="lv">${lv.l}</span><b>${lv.t}</b><span>${lv.e}</span><span class="sp"></span>${o.ro?'':`<span class="qa">${ic('plus','s12')}Serviço</span>`}</div>${lv.items.map(x=>{const sel=x.n===selN;return `<div class="pt r ${o.narrow?'nar':''} ${sel?'sel':''}"><span class="sv2"><b>${x.n}</b><span>${x.w}</span></span><span>${axd(x.ax)}</span><span class="nm2">${x.km||x.tm}<span>${x.km?'ou '+x.tm:'por data'}</span></span><span class="nm2">${x.av}<span>antes</span></span>${o.narrow?'':`<span class="kit2" title="${x.kit}">${ic('package','s12')} ${x.kit}</span>`}${frm(x.fr)}</div>${sel&&o.plain?`<div class="plain">${ic('chat-text','s16')}<span><b>Lona de freio</b>, eixos 1 a 3 de cada carreta, os dois lados: a cada <b>60 mil km ou 6 meses</b>, o que vier primeiro; avisa <b>3 mil km</b> antes. <span class="muted">Pelo seu histórico, a lona dura em média 58 mil km.</span></span><span style="flex:1"></span><span class="qa">${ic('pencil-simple','s14')}Editar</span></div>`:''}`;}).join('')}`).join('');
}
D.plA=(s,dev)=>{
  if(dev==='phone') return plAphone(s);
  const band=`<div class="band"><div class="top"><div class="stat"><span class="k">Plano · versão 2 em uso desde 02/11</span><span class="n" style="font-size:24px">Carreta florestal 3 eixos</span></div><span class="sp"></span>
    <div class="stat"><span class="k">Vale para</span><span class="n">61<small>carretas</small></span></div><div class="stat d"><span class="k">Vencidas</span><span class="n">4</span></div><div class="stat"><span class="k">Vencem agora</span><span class="n">9</span></div>
    <div class="act">${s==='edit'?btn('Salvar versão 3',{icon:'check'}):`<span class="qa">${ic('clock-counter-clockwise','s14')}Versões</span><span class="qa">${ic('copy','s14')}Duplicar</span>`}</div></div><div style="margin-top:16px">${cycle()}</div></div>`;
  const table=`<div class="surf" style="overflow:hidden"><div class="pt h"><span>Serviço e onde</span><span>Eixos</span><span>A cada</span><span>Avisa</span><span class="kit2">Kit</span><span>Na frota</span></div>${ptRows(s==='edit'||s==='ok'?'Lona de freio':'',{plain:1})}</div>`;
  const side=`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:12px">
    <div class="surf" style="padding:14px 16px"><span class="lbl">Vale para</span><div style="display:flex;align-items:center;gap:10px;margin-top:8px">${sil([['car']],18)}<span style="font-size:13.5px"><b>Carreta florestal, 3 eixos</b> · todas as bases</span></div><div class="muted" style="font-size:12.5px;margin-top:6px">Carreta nova desse tipo entra sozinha</div></div>
    <div class="surf" style="padding:14px 16px"><span class="lbl">Exceções · 2</span><div class="hl2" style="margin-top:6px"><div><b>RTA2A22</b><span>lona a cada 40 mil km</span><span class="m">rota de serra</span></div><div><b>RTD8K02</b><span>sem fueiros</span><span class="m">cavaco</span></div></div></div>
    <div class="surf" style="padding:14px 16px"><span class="lbl">${s==='edit'?'Se salvar a versão 3':'Versões'}</span>${s==='edit'?`<div class="imp" style="margin-top:8px"><div class="d"><div class="n">+2</div><div class="k">ficam vencidas</div></div><div><div class="n">+3</div><div class="k">entram na janela</div></div><div><div class="n">56</div><div class="k">seguem iguais</div></div></div>`:`<div class="hl2" style="margin-top:6px"><div><b>v2</b><span>lona de 50 para 60 mil km</span><span class="m">02/11</span></div><div><b>v1</b><span>18 carretas fizeram preventiva</span><span class="m">15/08</span></div></div>`}</div></div>`;
  if(s==='loading') return `<div class="canvas"><div class="band" style="height:220px"></div><div class="surf">${[1,2,3,4,5].map(()=>`<div class="pt r">${F.sk('80%',30)}${F.sk(40,14)}${F.sk(80,30)}${F.sk(60,30)}${F.sk('80%',14)}${F.sk('100%',6)}</div>`).join('')}</div></div>`;
  let out=`<div class="canvas">${band}${table}${side}</div>`;
  if(s==='edit') out=out.replace(/<div class="plain">[\s\S]*?<\/div>/,`<div class="plain" style="flex-direction:column;gap:10px;background:hsl(var(--primary-soft)/.6)"><div class="row wrap" style="gap:8px;font-size:14px"><b>Lona de freio</b> em <span class="nin" style="height:34px">eixos 1, 2 e 3 · os dois lados${ic('caret-down','s14')}</span> a cada <span class="nin foc" style="height:34px">55.000<span class="u">km</span></span> ou <span class="nin" style="height:34px">6<span class="u">meses</span></span> avisa <span class="nin" style="height:34px">3.000<span class="u">km</span></span></div><div class="row" style="gap:8px;font-size:12.5px" ><span class="muted">${kb('Enter')} aplica · ${kb('Esc')} cancela</span><span style="flex:1"></span><span style="color:hsl(var(--danger-ink));font-weight:600">+2 carretas ficam vencidas</span></div></div>`);
  return out;
};
function plAphone(s){
  return `<div class="canvas" style="padding-bottom:90px"><div class="band" style="padding:14px"><span style="font:600 11.5px Inter;color:hsl(0 0% 100%/.62)">Versão 2 · 61 carretas</span><div style="font:800 18px Sora;margin-top:2px">Carreta florestal 3 eixos</div><div style="display:flex;gap:18px;margin-top:10px"><div class="stat d"><span class="n" style="font-size:22px">4</span><span class="k">vencidas</span></div><div class="stat"><span class="n" style="font-size:22px">9</span><span class="k">vencem agora</span></div></div></div>
    ${PI.map(lv=>`<div class="surf" style="overflow:hidden"><div class="lvb"><span class="lv">${lv.l}</span><b>${lv.t}</b><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${lv.e.replace('a cada ','')}</span></div>${lv.items.map(x=>`<div class="pr" style="padding:10px 14px"><span class="a" style="flex-direction:column;align-items:flex-start;gap:0;min-width:0"><b style="font:600 14px Inter">${x.n}</b><span class="muted" style="font-size:12px">${x.w}</span></span><span class="w" style="text-align:right">${x.km||x.tm}<span class="muted" style="display:block;font-weight:400;font-size:11.5px">${x.km?'ou '+x.tm:'por data'}</span></span></div>`).join('')}</div>`).join('')}</div>`;
}
D.plB=(s,dev)=>{
  if(dev==='phone') return plBphone(s);
  const head=`<div class="tbar" style="padding:12px 14px"><b style="font:800 17px Sora">Carreta florestal 3 eixos</b><span class="vch on">v2 em uso</span>${s!=='ok'?`<span class="vch" style="color:hsl(var(--warning-ink))">${ic('pencil-simple','s12')}rascunho v3</span>`:''}<span style="flex:1"></span><span class="qa">${sil([['car']],14)}61 carretas</span><span class="qa">${ic('clock-counter-clockwise','s14')}Versões</span>${btn('Salvar versão 3',{size:'sm',disabled:s==='ok'})}</div>`;
  const tbl=`<div class="surf" style="overflow:hidden">${head}<div class="pt h nar"><span>Serviço e onde</span><span>Eixos</span><span>A cada</span><span>Avisa</span><span>Na frota</span></div>${ptRows('Lona de freio',{narrow:1})}</div>`;
  const insp=`<div class="pane dock"><div class="ph"><div class="r1"><span class="lv" style="display:inline-grid;place-items:center;width:22px;height:22px;border-radius:6px;background:hsl(var(--foreground));color:hsl(var(--background));font:800 11px Sora">B</span><h4 style="font-size:16px">Lona de freio</h4><span style="flex:1"></span><span class="qa">${kb('Esc')}</span></div><div class="s">Kit: 2 lonas e 4 molas por lado</div></div>
    <div class="ins"><div><span class="lbl">Onde, em cada carreta</span><div class="axpick" style="margin-top:6px">${[1,2,3].map(e=>`<div><em>Eixo ${e}</em><span class="on">esquerdo</span><span class="on">direito</span></div>`).join('')}</div></div>
      <div class="grid2"><div class="fl2"><label>A cada</label><div class="nin ${s==='edit'?'foc':''}">${s==='edit'?'55.000':'60.000'}<span class="u">km</span></div></div><div class="fl2"><label>ou a cada</label><div class="nin">6<span class="u">meses</span></div></div><div class="fl2"><label>Avisa antes</label><div class="nin">3.000<span class="u">km</span></div></div><div class="fl2"><label>Aceita atraso</label><div class="nin">1.000<span class="u">km</span></div></div></div>
      <div class="sent2">${ic('chat-text','s14')} <b>Lona de freio</b>, eixos 1 a 3, os dois lados: a cada <b>${s==='edit'?'55':'60'} mil km ou 6 meses</b>, o que vier primeiro; avisa 3 mil km antes</div>
      <div style="display:flex;gap:8px;align-items:center;font-size:12.5px;color:hsl(var(--success-ink))">${ic('chart-line-up','s14')}Pelo seu histórico: 58 mil km em média, 41 trocas</div>
      ${s==='edit'?`<div><span class="lbl">Se aplicar</span><div class="imp" style="margin-top:6px"><div class="d"><div class="n">+2</div><div class="k">ficam vencidas</div></div><div><div class="n">+3</div><div class="k">entram na janela</div></div><div><div class="n">56</div><div class="k">iguais</div></div></div></div>`:''}</div>
    <div class="pf">${btn('Descartar',{variant:'outline',disabled:s!=='edit'})}${btn('Aplicar ao rascunho',{variant:'outline',disabled:s!=='edit'})}</div></div>`;
  if(s==='loading') return `<div class="lb"><div class="surf">${[1,2,3,4,5,6].map(()=>`<div class="pt r">${F.sk('80%',30)}${F.sk(40,14)}${F.sk(80,30)}${F.sk(60,30)}${F.sk('100%',6)}</div>`).join('')}</div><div class="pane dock">${F.sk('100%',320)}</div></div>`;
  return `<div class="lb">${tbl}${insp}</div>`;
};
function plBphone(s){
  let out=`<div class="fx-mlist"><div class="fx-msticky" style="padding-bottom:10px"><b style="font:800 15px Sora">Carreta florestal 3 eixos</b><div class="muted" style="font-size:12px">versão 2 · 61 carretas</div></div><div style="padding:0 12px 96px">${PI.map(lv=>`<div class="pgh"><b>${lv.l} · ${lv.t}</b><span class="n">${lv.e.split(' · ')[0]}</span></div>${lv.items.map(x=>`<div class="pr"><span class="a" style="flex-direction:column;align-items:flex-start;gap:0;min-width:0"><b style="font:600 14px Inter">${x.n}</b><span class="muted" style="font-size:12px">${x.w}</span></span><span class="w">${x.km||x.tm}</span></div>`).join('')}`).join('')}</div></div>`;
  if(s==='edit') out+=`<div class="fsheet"><div class="h">${ic('x','s20')}<b>Lona de freio</b></div><div class="bd"><div class="axpick">${[1,2,3].map(e=>`<div><em>Eixo ${e}</em><span class="on" style="height:40px">esquerdo</span><span class="on" style="height:40px">direito</span></div>`).join('')}</div><div class="ins" style="padding:0"><div class="grid2"><div class="fl2"><label>A cada</label><div class="nin foc" style="height:48px">55.000<span class="u">km</span></div></div><div class="fl2"><label>ou</label><div class="nin" style="height:48px">6<span class="u">meses</span></div></div></div><div class="sent2"><b>Lona de freio</b>, eixos 1 a 3: a cada <b>55 mil km ou 6 meses</b>, o que vier primeiro</div><div style="color:hsl(var(--danger-ink));font-weight:600;font-size:13px">+2 carretas ficam vencidas</div></div></div><div class="ft">${btn('Cancelar',{variant:'outline',size:'lg'})}${btn('Aplicar',{size:'lg'})}</div></div>`;
  return out;
}

/* =====================================================================
   ANALYTICS · PREVENÇÃO (pilar 6)
   ===================================================================== */
const MO=[['Set',74,9,17],['Out',77,8,15],['Nov',82,7,11]];
const BA=[['Base Curitiba',71,'84%',6,'9.800',5,'6.200'],['Base Ponta Grossa',52,'79%',7,'14.100',4,'5.900'],['Base Três Lagoas',41,'68%',10,'17.300',4,'6.500']];
const CA=[['Transportadora Demo',112,'81%',12,'21.300',8,'11.200'],['Florestal Sul',52,'71%',11,'19.900',5,'7.400']];
function stack100(m,phone){
  const seg=(cls,v,lbl)=>`<i class="${cls}" style="width:${v}%" title="${m[0]}: ${v}% ${lbl}">${v>=7?`<b>${v}%</b>`:''}</i>`;
  return `<div class="sbr"><b class="m">${m[0]}</b><div class="bar">${seg('c-on',m[1],'no prazo')}${seg('c-early',m[2],'adiantadas')}${seg('c-late',m[3],'atrasadas')}</div></div>`;
}
D.prev=(s,dev)=>{
  const phone=dev==='phone';
  if(s==='noperm') return F.empty({icon:'lock-simple',title:'Sem acesso a Analytics',hint:'Seu papel não permite ver os indicadores. Peça a quem administra a empresa'});
  const chips=`<div class="achips">${F.fchip('Últimos 90 dias',{menu:1,size:'sm',on:1})}${F.fchip('Todas as bases',{menu:1,size:'sm'}).replace('fx-fchip','fx-fchip all')}${s==='carrier'?F.fchip('Por transportadora',{on:1,removable:1,size:'sm'}):F.fchip('Todas as transportadoras',{menu:1,size:'sm'}).replace('fx-fchip','fx-fchip all')}${F.fchip('Todos os planos',{menu:1,size:'sm'}).replace('fx-fchip','fx-fchip all')}${phone?'':`<span style="flex:1"></span><span class="qa">${ic('download-simple','s14')}Exportar</span>`}</div>`;
  if(s==='loading') return `<div class="canvas">${chips}${F.sk('100%',200,12)}<div class="ag2">${F.sk('100%',220,12)}${F.sk('100%',220,12)}</div></div>`;
  if(s==='empty') return `<div class="canvas">${chips}${F.empty({canvas:1,icon:'chart-bar',title:'Os números aparecem com a primeira preventiva concluída',hint:'Os planos começaram em 26/11. Enquanto isso, a agenda mostra o que vence',action:btn('Ver a agenda',{variant:'outline'})})}</div>`;
  const hero=`<div class="surf ahero"><div class="hl"><span class="q">Prevenindo ou apagando incêndio?</span><div class="hn"><span class="n tn">39%</span><span class="sm">das OS foram preventiva<br>nos últimos 90 dias</span></div><span class="tr">${ic('trend-up','s14')}eram 30% em setembro · meta da empresa 50%</span></div>
    <div class="hc"><span class="lbl">Preventiva nas OS, por mês</span><div class="cols3">${[['Set',30],['Out',34],['Nov',39]].map(([m,v])=>`<div><b class="tn">${v}%</b><span class="b" style="height:${v*2}px" title="${m}: ${v}%"></span><span class="m">${m}</span></div>`).join('')}<div class="goal" style="bottom:122px"><span>meta 50%</span></div></div></div></div>`;
  const facts=`<div class="afacts">${[['No prazo','78%','128 de 164'],['Atrasadas','23','41.200 km rodados vencidas'],['Adiantadas','13','18.600 km de vida gasta antes'],['Adiadas com motivo','9','5 por falta de peça']].map(f=>`<div><span class="k">${f[0]}</span><b class="tn">${f[1]}</b><span class="h">${f[2]}</span></div>`).join('')}</div>`;
  const chart=`<div class="surf achart"><div class="ah"><b>Preventivas concluídas, por mês</b><span>no prazo, adiantadas e atrasadas, sempre nessa ordem</span></div>${MO.map(m=>stack100(m,phone)).join('')}
    <div class="lg"><span><i class="c-on"></i>No prazo</span><span><i class="c-early"></i>Adiantada</span><span><i class="c-late"></i>${ic('warning','s12')}Atrasada</span></div></div>`;
  const rows=s==='carrier'?CA:BA;
  const table=`<div class="surf" style="overflow:hidden"><div class="ah" style="padding:12px 16px"><b>${s==='carrier'?'Por transportadora':'Por base'}</b></div><div class="bt3 h"><span>${s==='carrier'?'Transportadora':'Base'}</span><span class="r">Concluídas</span><span class="r srt">No prazo${ic('arrow-down','s12')}</span><span class="r">Atrasadas</span><span class="r">Km vencidos</span><span class="r">Adiantadas</span><span class="r">Km antes</span></div>
    ${rows.map(r=>`<div class="bt3"><b>${r[0]}</b><span class="r tn">${r[1]}</span><span class="r tn"><b>${r[2]}</b></span><span class="r tn">${r[3]}</span><span class="r tn">${r[4]}</span><span class="r tn">${r[5]}</span><span class="r tn">${r[6]}</span></div>`).join('')}</div>`;
  const worst=`<div class="surf" style="overflow:hidden;align-self:start"><div class="ah" style="padding:12px 16px"><b>Mais tempo vencidas agora</b><span class="qa" style="margin-left:auto">Abrir na agenda${ic('caret-right','s12')}</span></div>${[['DLY1J07','Revisão B','4.300 km','adiada 1 vez: sem peça'],['C-320','Lona de freio, eixo 3','1.850 km','no pátio, OS 1042'],['C-207','Fueiros e barrotes','3 dias','agendado 27/11']].map(x=>`<div class="bt3 w"><b>${x[0]}</b><span>${x[1]}</span><span class="r tn">${x[2]}</span><span class="m">${x[3]}</span></div>`).join('')}</div>`;
  if(phone) return `<div class="canvas" style="padding-bottom:90px">${chips}${hero}${facts}${chart}<div class="surf" style="overflow:hidden"><div class="ah" style="padding:12px 14px"><b>Por base</b></div>${BA.map(r=>`<div class="pr" style="padding:10px 14px"><span class="a"><b style="font:600 14px Inter">${r[0]}</b></span><span class="w">${r[2]}</span><div class="b"><span class="tn">${r[3]} atrasadas · ${r[4]} km vencidos</span></div></div>`).join('')}</div></div>`;
  return `<div class="canvas">${chips}<div class="ag2">${hero}${facts}</div><div class="ag2">${chart}${worst}</div>${table}</div>`;
};
/* the analytics area has its own sidebar (proposta analytics-pillars) */
function analyticsSide(){
  document.querySelectorAll('fx-app[data-area="analytics"]').forEach(app=>{
    const side=app.querySelector('.fx-side'); if(!side) return;
    const logo=side.querySelector('.fx-logo').outerHTML;
    const P=[['Operacional','gauge'],['Ativos','truck'],['Financeiro','currency-circle-dollar'],['Pessoas','users-three'],['Qualidade','seal-check'],['Prevenção','shield-check']];
    side.classList.add('exp');
    side.innerHTML=`${logo}<nav class="fx-nav-l"><div class="fx-ni" title="Voltar ao sistema"><span class="fx-nib">${ic('arrow-left','s16')}</span><span class="fx-nil">Voltar ao sistema</span></div><div class="fx-sec" style="margin-top:8px">Analytics</div>${P.map(([l,i])=>{const on=l==='Prevenção';return `<div class="fx-ni ${on?'on':''}" title="${l}">${on?'<i class="fx-bar"></i>':''}<span class="fx-nib">${ic(i,'s16',on)}</span><span class="fx-nil">${l}</span>${ic(on?'caret-down':'caret-right','s12 fx-car')}</div>${on?`<div class="fx-sub"><div class="fx-ni nested on" title="Manutenção preventiva"><span class="fx-nib">${ic('calendar-check','s16',1)}</span><span class="fx-nil">Manutenção preventiva</span></div></div>`:''}`;}).join('')}</nav>`;
    const logoW=side.querySelector('.fx-logo'); if(logoW&&!logoW.querySelector('.fx-lw')) logoW.insertAdjacentHTML('beforeend','<span class="fx-ldiv"></span><span class="fx-lw"><span class="fx-brand"><span>Facter</span> <b>Analytics</b></span><span class="fx-tag">Truck</span></span>');
  });
}

function fit(){document.querySelectorAll('.devices .fx-device').forEach(d=>{d.style.zoom='';const box=d.closest('.devices');if(!box)return;const a=box.clientWidth,w=d.offsetWidth;if(w>a&&a>0)d.style.zoom=(a/w).toFixed(4);});}
document.addEventListener('DOMContentLoaded',()=>{analyticsSide();F.bind(D);fit();document.querySelectorAll('.states button').forEach(b=>b.addEventListener('click',()=>setTimeout(fit,0)));});
})();
