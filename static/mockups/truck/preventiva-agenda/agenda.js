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
  c072:{name:'C-072',parts:[['QRT5F80','cav',''],['RTG1H22','car','']],svc:'Troca de óleo e filtros',more:'',when:'seg 07/12',t:''},
  q9b:{name:'QRT9B71',parts:[['QRT9B71','cav','']],svc:'Revisão A',more:'',when:'qua 09/12',t:''},
  c044:{name:'C-044',parts:[['QRT2E55','cav',''],['RTD8F12','car',''],['RTD8F13','car','']],svc:'Revisão B',more:'+1 nesta visita',when:'qui 10/12',t:''},
  q6h:{name:'QRT6H33',parts:[['QRT6H33','cav','']],svc:'Lona de freio, eixos 2 e 3',more:'',when:'ter 15/12',t:''},
  rtf:{name:'RTF2D10',parts:[['RTF2D10','car','']],svc:'Lubrificação geral',more:'',when:'sex 18/12',t:''},
  srt:{name:'SRT2C55',parts:[['SRT2C55','car','']],svc:'Sem leitura de km',more:'3 preventivas esperando',when:'desde 12/10',t:'m'},
  rtc:{name:'RTC9K21',parts:[['RTC9K21','car','']],svc:'Km a conferir',more:'Salto de 9.800 km em um dia',when:'desde ontem',t:'m'},
};
const GROUPS=[
  {k:'over',title:'Vencidas',count:'3 visitas',tone:'d',icon:'warning-octagon',ids:['c320','dly','c207']},
  {k:'week',title:'Esta semana',count:'3 visitas',tone:'w',icon:'hourglass-medium',ids:['c118','q1a','rta']},
  {k:'next',title:'Próximas semanas',count:'9 visitas',tone:'',icon:'calendar-blank',ids:['c072','q9b','c044','q6h','rtf'],more:'Ver as 9 até 24/12'},
  {k:'nokm',title:'Sem km',count:'2 veículos',tone:'',icon:'gauge',ids:['srt','rtc']},
];

/* ---------- pieces ---------- */
const motif=()=>`<span class="motif" aria-hidden="true">${[[1,1,0,1],[1,0,1],[1,1,1,0],[1,0],[1,1,0]].map(r=>`<span>${r.map((x,i)=>`<i class="${i===0?'cav':''} ${x?'':'o'}"></i>`).join('')}</span>`).join('')}</span>`;
const head=o=>`<div class="hl hero">${motif()}<div class="big">5</div><div class="tx"><h2>preventivas vencidas</h2><p>em <b>3 visitas</b>, <b>2</b> com o veículo no pátio</p></div><div class="stats"><span class="st w"><b>4</b>esta semana</span><span class="st"><b>9</b>próximas</span></div></div>`;
const search=()=>`<span class="sf" role="search">${ic('magnifying-glass','s16')}<span>Buscar placa ou conjunto</span></span>`;
function row(id,sel){const v=V[id];
  return `<div class="vr ${sel===id?'on':''}" role="button" tabindex="0"><div class="who"><b>${v.name}</b>${mark(v.parts)}</div><div class="what"><b>${v.svc}</b>${v.more?`<span>${v.more}</span>`:''}</div><div class="when ${v.t}">${v.when}</div>${ic('caret-right','s16 car')}</div>`;}
function group(g,sel){
  return `<section class="grp"><header><span class="gt ${g.tone}">${ic(g.icon,'s16')}</span><h3>${g.title}</h3><span class="gc">${g.count}</span></header><div class="rows">${g.ids.map(id=>row(id,sel)).join('')}</div>${g.more?`<div class="more">${g.more}${ic('caret-down','s14')}</div>`:''}</section>`;}

/* visit item: [service, where, state, tone, rule and last time]. No bars or axle drawings:
   in the comprehension test nobody could explain them without a legend */
const ITEMS_C320=[
  ['Lona de freio','2ª carreta, eixo 3','vencida há 1.850 km','d','Troca a cada 60 mil km. Última em 12/05, com&nbsp;94.720&nbsp;km.'],
  ['Lubrificação geral','2ª carreta','vence hoje','w','A cada 30 dias. Última em 27/10.'],
  ['Troca de óleo e filtros','Cavalo','em 1.200 km','','A cada 20 mil km. Última em 02/09.'],
];
const item=([n,where,v,t,rule],i)=>`<div class="ii ${i===0?'lead':''}"><div class="it1"><b>${n}</b><span class="tp sm ${t}">${v}</span></div><span class="iw">${where}</span>${rule?`<span class="ir">${rule}</span>`:''}</div>`;
const items=list=>`<div class="ilist">${list.map(item).join('')}</div>`;
const secHead=(title,right='')=>`<div class="sh"><h3>${title}</h3>${right}</div>`;
const count=n=>`<span class="cnt">${n}</span>`;
const pill=(tone,icon,text)=>`<span class="spill ${tone}">${ic(icon,'s16')}${text}</span>`;
const metrics=m=>`<div class="mstrip">${m.map(([l,v,t])=>`<div><span>${l}</span><b class="${t||''}">${v}</b></div>`).join('')}</div>`;
const parts=(ok,list,note)=>`<div class="sec">${secHead('Peças do kit',ok?`<span class="kchip s">${ic('check-circle','s16')}Tudo em estoque</span>`:`<span class="kchip w">${ic('package','s16')}${note[0]}</span>`)}<div class="kgrid">${list.map(([q,n,has])=>`<span class="kp ${has?'':'miss'}"><b>${q}</b><span>${n}</span>${has?`<i class="okk">${ic('check','s12')}</i>`:'<i class="miss">falta</i>'}</span>`).join('')}</div>${ok?'':`<p class="sub">${note[1]}</p>`}</div>`;
const history=(title,rows)=>`<div class="sec hist">${secHead(title)}<ol class="tl">${rows.map(([d,sv,os])=>`<li><span class="d">${d}</span><span class="s">${sv}</span><span class="o">${os}</span></li>`).join('')}</ol></div>`;
const foot=t=>`<p class="foot">${ic('clock-counter-clockwise','s14')}<span>${t}</span></p>`;
function pHead(v,o={}){return `<div class="phd">${o.phone?'<div class="grab"></div>':''}<div class="ph">${o.back?`<span class="xb back" role="button" aria-label="Voltar">${ic('arrow-left','s16')}</span>`:''}<div class="t"><h2>${o.title||v.full}</h2><p>${mark(v.parts)}${o.sub||v.sub}</p></div>${o.back?'':`<span class="xb" role="button" aria-label="Fechar">${ic('x','s16')}</span>`}</div>${o.status?`<div class="pst">${o.status}</div>`:''}${o.metrics?metrics(o.metrics):''}</div>`;}
const H320={status:pill('s','garage','No pátio · OS 1042 aberta'),metrics:[['Pior atraso','1.850 km','d'],['Peças','Em estoque','s'],['Na OS','+3 h 20','']]};
function visitBody(){
  return `<div class="sec">${secHead('Nesta visita',count(3))}${items(ITEMS_C320)}</div>
  ${parts(1,[['4×','lona de freio',1],['8×','mola de retorno',1],['38 l','óleo 15W40',1],['3×','filtro',1]])}
  ${history('Últimas visitas deste conjunto',[['27/10','Lubrificação geral','OS 0998'],['02/09','Troca de óleo e filtros','OS 0954'],['12/05','Lona de freio, 2ª carreta, eixo 3','OS 0871']])}`;}
const visitFoot=()=>`<div class="pf"><div class="bb">${btn('Adiar',{variant:'outline'})}${btn('Incluir as 3 na OS 1042',{icon:'plus',action:1})}</div></div>`;

const WD=['seg','ter','qua','qui','sex','sáb'];
const DAYS=[['23','',2],['24','',2],['25','',2],['26','cheia',1],['27','cheia',1],['28','6 h',0,1],['30','18 h'],['01','22 h'],['02','28 h'],['03','3 h',1],['04','32 h'],['05','8 h']];
const HDLY={title:'Agendar visita',sub:'DLY1J07 · revisão B',back:1,status:pill('n','road-horizon','Rodando · 640 km por dia'),metrics:[['Atraso','4.300 km','d'],['Peças','Falta 1','w'],['Leva','4 h','']]};
function scheduleBody(){
  return `<div class="sec cal">${secHead('Quando trazer',`<span class="hh">horas livres por dia</span>`)}
  <div class="wk">${WD.map(d=>`<span class="wd">${d}</span>`).join('')}${DAYS.map(([n,l,off,pick])=>`<div class="day ${off===2?'off past':off?'off':''} ${pick?'pick':''}"><b>${n}</b><span>${l||'&nbsp;'}</span></div>`).join('')}</div><p class="first">${ic('calendar-check','s16')}<span><b>Primeira vaga: sáb 28/11</b>, 6&nbsp;h livres</span></p></div>
  <div class="sec">${secHead('Nesta visita',count(1))}${items([['Revisão B','Cavalo, inclui a revisão A','vencida há 4.300 km','d','A cada 30 mil km. Última em 03/06, com&nbsp;182.400&nbsp;km.']])}</div>
  ${parts(0,[['30 l','óleo 15W40',1],['1×','filtro de óleo',1],['1×','filtro de ar',0],['1×','filtro de diesel',1]],['Falta 1 filtro de ar','O filtro é pedido ao agendar.'])}
  <label class="chk"><i>${ic('check','s14')}</i>Avisar a JSL por e-mail</label>`;}
const scheduleFoot=()=>`<div class="pf"><div class="bb">${btn('Voltar',{variant:'outline'})}${btn('Agendar para sáb 28/11',{icon:'calendar-check',action:1})}</div></div>`;

function skList(phone){
  const r=()=>`<div style="display:flex;align-items:center;gap:20px;min-height:64px;padding:10px 12px">${'<span class="sk" style="width:140px;height:16px"></span>'}<span style="flex:1;display:flex;flex-direction:column;gap:6px"><span class="sk" style="width:60%;height:15px"></span><span class="sk" style="width:30%;height:12px"></span></span>${phone?'':'<span class="sk" style="width:120px;height:15px"></span>'}</div>`;
  const g=n=>`<section class="grp"><header><span class="sk" style="width:32px;height:32px;border-radius:10px"></span><span class="sk" style="width:120px;height:16px"></span></header>${Array.from({length:n},r).join('')}</section>`;
  return `<div class="hl"><div class="tx" style="display:flex;flex-direction:column;gap:10px"><span class="sk" style="width:${phone?'90%':'420px'};height:24px"></span><span class="sk" style="width:${phone?'60%':'260px'};height:15px"></span></div></div>${g(3)}${g(3)}`;
}

const C044={full:'Conjunto C-044',sub:'QRT2E55 com 2 carretas',parts:V.c044.parts};
function nextPanel(){return `<aside class="pnl">${pHead(C044,{status:pill('n','road-horizon','Rodando · 610 km por dia'),metrics:[['Vence','qui 10/12',''],['Peças','Em estoque','s'],['Leva','3 h','']]})}<div class="pb"><div class="sec">${secHead('Nesta visita',count(2))}${items([['Revisão B','Cavalo','qui 10/12','','A cada 30 mil km. Última em 14/06.'],['Lubrificação geral','1ª carreta','sáb 12/12','','A cada 30 dias. Última em 12/11.']])}</div>
  ${parts(1,[['38 l','óleo 15W40',1],['4×','filtro',1],['1 kg','graxa',1]])}</div>
  <div class="pf"><div class="bb">${btn('Adiar',{variant:'outline'})}${btn('Agendar visita',{icon:'calendar-check',action:1})}</div></div></aside>`;}

/* ---------- board: the three columns side by side, the whole week at once ---------- */
const pillMore=v=>/^\+\d/.test(v.more)?`<span class="pill">${v.more.split(' ')[0]}</span>`:'';
function card(id,sel){const v=V[id];return `<div class="cd ${sel===id?'on':''}" role="button" tabindex="0"><div class="l1"><b>${v.name}</b>${mark(v.parts)}<span class="when ${v.t}">${v.when}</span></div><div class="l2"><span>${v.svc}</span>${pillMore(v)}</div></div>`;}
const colHead=g=>`<header class="ch"><span class="gt ${g.tone}">${ic(g.icon,'s16')}</span><h3>${g.title}</h3><span class="gc ${g.count.startsWith('0')?'':g.tone}">${g.count.split(' ')[0]}</span></header>`;
function column(g,sel,empty){
  return `<section class="cl">${colHead(empty?{...g,count:'0'}:g)}<div class="cards">${empty?`<div class="cempty">${ic('check-circle','s20')}<span>${empty}</span></div>`:g.ids.map(id=>card(id,sel)).join('')}${!empty&&g.more?`<div class="more">${g.more}${ic('caret-down','s14')}</div>`:''}</div></section>`;}
const nokm=()=>`<span class="nokm">${ic('gauge','s16')}<b>2 veículos sem km</b><span>ver</span>${ic('caret-right','s14')}</span>`;
const slim=(o={})=>o.empty
  ?`<div class="hero slim"><span class="halo sm">${ic('calendar-check','s20')}</span><div class="tx"><h2>Frota em dia esta semana</h2><p>Nenhuma preventiva vencida. A próxima é a revisão B do C-044, na qui 10/12.</p></div>${nokm()}</div>`
  :`<div class="hero slim"><span class="big">5</span><div class="tx"><h2>preventivas vencidas</h2><p>em <b>3 visitas</b>, <b>2</b> com o veículo no pátio</p></div>${nokm()}</div>`;
function drawer(inner){return `<div class="scrim"></div><aside class="pnl drawer">${inner}</aside>`;}
function skBoard(){
  const c=()=>`<div class="cd sk-cd"><span class="sk" style="width:55%;height:15px"></span><span class="sk" style="width:80%;height:12px;margin-top:10px"></span></div>`;
  const col=n=>`<section class="cl"><header class="ch"><span class="sk" style="width:34px;height:34px;border-radius:11px"></span><span class="sk" style="width:110px;height:16px"></span></header><div class="cards">${Array.from({length:n},c).join('')}</div></section>`;
  return `<div class="bd"><div class="hero slim"><span class="sk" style="width:48px;height:44px;border-radius:12px"></span><div class="tx" style="display:flex;flex-direction:column;gap:8px"><span class="sk" style="width:260px;height:18px"></span><span class="sk" style="width:200px;height:13px"></span></div></div><div class="cols">${col(3)}${col(3)}${col(4)}</div></div>`;
}
function web(s,dev){
  const small=dev==='webs';
  if(s==='loading') return skBoard();
  const [over,week,next]=GROUPS;
  if(s==='empty') return `<div class="bd ${small?'s':''}">${slim({empty:1})}<div class="cols">${column(over,null,'Nada vencido')}${column(week,null,'Nada vence esta semana')}${column({...next,count:'9 visitas'},null)}</div></div>`;
  const sel=s==='schedule'?'dly':s==='visit'?'c320':null;
  const dr=s==='schedule'?drawer(`${pHead(V.dly,HDLY)}<div class="pb">${scheduleBody()}</div>${scheduleFoot()}`)
    :s==='visit'?drawer(`${pHead(V.c320,H320)}<div class="pb">${visitBody()}</div>${visitFoot()}`):'';
  return `<div class="bd ${small?'s':''}">${slim()}<div class="cols">${column(over,sel)}${column(week,sel)}${column(next,sel)}</div>${dr}</div>`;
}

/* ---------- phone: sticky tabs, one list at a time; the overdue count stays in the first tab ---------- */
const tabs=on=>`<div class="seg3" role="tablist">${[['over','Vencidas','3','d'],['week','Semana','3','w'],['next','Próximas','9','']].map(([k,l,n,t])=>`<span class="${k===on?'on':''}" role="tab">${l}<b class="${t}">${n}</b></span>`).join('')}</div>`;
function phone(s){
  if(s==='loading') return `<div class="ph-wrap"><div class="hero slim"><span class="sk" style="width:40px;height:40px;border-radius:12px"></span><span class="sk" style="width:200px;height:18px"></span></div><span class="sk" style="width:100%;height:44px;border-radius:12px"></span>${[1,2,3,4].map(()=>`<div class="cd sk-cd"><span class="sk" style="width:55%;height:15px"></span><span class="sk" style="width:80%;height:12px;margin-top:10px"></span></div>`).join('')}</div>`;
  if(s==='empty') return `<div class="ph-wrap"><div class="hero slim"><span class="halo sm">${ic('calendar-check','s20')}</span><div class="tx"><h2>Frota em dia esta semana</h2><p>A próxima é a revisão B do C-044, na qui 10/12.</p></div></div><div class="stick">${tabs('next').replace('<b class="d">3</b>','<b>0</b>').replace('<b class="w">3</b>','<b>0</b>')}</div><div class="cards">${GROUPS[2].ids.map(id=>card(id,null)).join('')}<div class="more">${GROUPS[2].more}${ic('caret-down','s14')}</div></div></div>`;
  const sel=s==='list'?null:s==='schedule'?'dly':'c320';
  const list=`<div class="ph-wrap"><div class="hero slim"><span class="big">5</span><div class="tx"><h2>preventivas vencidas</h2><p>em <b>3 visitas</b>, <b>2</b> no pátio</p></div></div><div class="stick">${tabs('over')}</div><div class="cards">${GROUPS[0].ids.map(id=>card(id,sel)).join('')}</div>${nokm()}</div>`;
  if(s==='list') return list;
  const sheet=s==='schedule'
    ?`<div class="sheet-ov"><div class="sheet">${pHead(V.dly,{...HDLY,phone:1})}<div class="sb">${scheduleBody()}</div>${scheduleFoot()}</div></div>`
    :`<div class="sheet-ov"><div class="sheet">${pHead(V.c320,{...H320,phone:1})}<div class="sb">${visitBody()}</div>${visitFoot(1)}</div></div>`;
  return list+sheet;
}

/* =====================================================================
   List version: the same anatomy as the work-order list (PageHeader, KPI strip,
   tabs, search and chips, approved row with fixed right columns, load more)
   ===================================================================== */
const LM={
  c320:{pos:'2ª carreta RTE1J77',where:'No pátio, OS 1042',sub:'venceu 23/11',act:'Incluir na OS'},
  dly:{pos:'Cavalo, frota 812',where:'Rodando, 640 km/dia',sub:'venceu 19/11',act:'Agendar'},
  c207:{pos:'1ª carreta RTC3B19',where:'No pátio, OS 1051',sub:'venceu 23/11',act:'Incluir na OS'},
  c118:{pos:'Cavalo QRT7C10',where:'Rodando, 650 km/dia',sub:'em 2 dias',act:'Agendar'},
  q1a:{pos:'Cavalo, frota 820',where:'Rodando, 710 km/dia',sub:'em 3 dias',act:'Agendar'},
  rta:{pos:'Carreta solta',where:'Parada na Base Curitiba',sub:'em 3 dias',act:'Agendar'},
  c072:{pos:'Cavalo QRT5F80',where:'Rodando, 580 km/dia',sub:'em 11 dias',act:'Agendar'},
  q9b:{pos:'Cavalo, frota 833',where:'Rodando, 600 km/dia',sub:'em 13 dias',act:'Agendar'},
  c044:{pos:'Cavalo QRT2E55',where:'Rodando, 610 km/dia',sub:'em 14 dias',act:'Agendar'},
  q6h:{pos:'Cavalo, frota 841',where:'Rodando, 520 km/dia',sub:'em 19 dias',act:'Agendar'},
  rtf:{pos:'1ª carreta RTF2D10',where:'Rodando',sub:'em 22 dias',act:'Agendar'},
  srt:{pos:'Carreta',where:'Sem leitura desde 12/10',sub:'sem km',act:'Informar km'},
  rtc:{pos:'Carreta',where:'Salto de 9.800 km em um dia',sub:'a conferir',act:'Conferir km'},
};
const dotSep='<span class="fx-dot"></span>';
function lrow(id,sel){const v=V[id],m=LM[id];const more=/^\+\d/.test(v.more)?`${dotSep}<span class="nw">${v.more}</span>`:'';
  return `<div class="fx-aprow lrow ${sel===id?'on':''}" role="button" tabindex="0">
    <div class="m"><div class="l1"><b class="nm">${v.name}</b>${mark(v.parts)}<span class="trunc2">${v.svc}</span></div>
      <div class="l2"><span class="nw">${m.pos}</span>${more}${dotSep}<span class="trunc2">${m.where}</span></div></div>
    <div class="apst"><b class="${v.t||'n'}">${v.when.replace('vencida há ','')}</b><span>${m.sub}</span></div>
    <div class="apss">${btn(m.act,{variant:'secondary',size:'sm'})}</div>
    ${ic('caret-right','s16 car')}</div>`;}
const lsub=g=>`<div class="lsub"><span class="gt ${g.tone}">${ic(g.icon,'s14')}</span><b>${g.title}</b><span class="n">${g.count}</span></div>`;
const LTABS=[['Todas',17],['Vencidas',3],['Esta semana',3],['Próximas',9],['Sem km',2]];
function listTop(o={}){
  const head=F.pageHeader('Agenda','O que trazer para a oficina, e quando.',`${F.fchip('Base Curitiba',{menu:1})}${btn('Ver planos',{variant:'outline',icon:'list-checks'})}`);
  const kpi=`<div class="fx-kpi4">${[['Vencidas',o.zero?0:5,'d'],['Vencem esta semana',4,'w'],['Próximas semanas',14,''],['Sem km',2,'']].map(([l,v,t])=>`<div><p>${l}</p><b class="k${v?t:''}">${v}</b></div>`).join('')}</div>`;
  const tools=`<div class="ltools">${F.search('Buscar placa, frota ou conjunto',{width:340})}${F.fchip('Todas as transportadoras',{menu:1})}${F.fchip('Todos os planos',{menu:1})}</div>`;
  return head+`<div class="lstack"><div class="lstack s">${F.dtabs(LTABS,o.tab||'Todas')}${tools}`;
}
function listWeb(s){
  const sel=s==='schedule'?'dly':s==='visit'?'c320':null;
  let body;
  if(s==='loading') body=`<div style="display:flex;flex-direction:column;gap:8px">${[1,2,3,4,5].map(()=>F.sk('100%',64)).join('')}</div>`;
  else if(s==='empty') body=`<div class="lempty">${F.empty({icon:'calendar-check',title:'Nada vencido',hint:'Uma preventiva aparece aqui quando passa do prazo. A próxima vence sáb 28/11, na revisão A do C-118.',action:btn('Ver esta semana',{variant:'outline'})})}</div>`;
  else body=`<div class="fx-wolist llist">${GROUPS.map(g=>lsub(g)+g.ids.map(id=>lrow(id,sel)).join('')).join('')}</div>${btn('Carregar mais',{variant:'outline'}).replace('fx-btn','fx-btn lmore')}`;
  const dr=s==='schedule'?drawer(`${pHead(V.dly,HDLY)}<div class="pb">${scheduleBody()}</div>${scheduleFoot()}`)
    :s==='visit'?drawer(`${pHead(V.c320,H320)}<div class="pb">${visitBody()}</div>${visitFoot()}`):'';
  return `<div class="lv">${listTop({tab:s==='empty'?'Vencidas':'Todas',zero:s==='empty'})}${body}</div></div></div>${dr}</div>`;
}
function lcard(id,sel){const v=V[id],m=LM[id];
  return `<button type="button" class="fx-wocard lcard ${sel===id?'on':''}"><span class="l1"><b class="nm">${v.name}</b>${mark(v.parts)}<span style="flex:1"></span><span class="lwhen ${v.t}">${v.when}</span></span>
    <span class="l3">${v.svc}</span><span class="l4"><span class="trunc2">${m.pos}${/^\+\d/.test(v.more)?' · '+v.more:''}</span></span>
    <span class="ft"><span class="trunc2 lwhere">${m.where}</span><span style="flex:1"></span><span class="lact">${m.act}${ic('caret-right','s14')}</span></span></button>`;}
function listPhone(s){
  const tabsM=on=>`<div class="fx-mtabs">${[['Vencidas',3,'d'],['Esta semana',3,'w'],['Próximas',9,''],['Sem km',2,'']].map(([t,n,c])=>`<span class="${t===on?'on':''}">${t}<b class="${c}">${n}</b></span>`).join('')}</div>`;
  const search=`<div class="fx-msearch"><span class="fx-searchf" style="flex:1;height:44px;font-size:14px">${ic('magnifying-glass','s16')}<span class="trunc2">Buscar placa, frota ou conjunto</span></span><span class="fx-btn outline icon" style="height:44px;width:44px">${ic('sliders-horizontal','s20')}</span></div>`;
  let body;
  if(s==='loading') body=[1,2,3].map(()=>`<div class="fx-wocard sk">${F.sk('40%',16)}${F.sk('60%',22)}${F.sk('100%',36)}${F.sk('100%',28)}</div>`).join('');
  else if(s==='empty') body=F.empty({icon:'calendar-check',title:'Nada vencido',hint:'A próxima vence sáb 28/11, na revisão A do C-118.'});
  const sel=s==='schedule'?'dly':s==='visit'?'c320':null;
  if(!body) body=GROUPS[0].ids.map(id=>lcard(id,sel)).join('');
  const list=`<div class="fx-mlist"><div class="fx-msticky">${search}${tabsM('Vencidas').replace(s==='empty'?'<b class="d">3</b>':'@@','<b>0</b>')}</div><div class="fx-mcards">${body}</div><div style="height:72px"></div></div>`;
  if(s!=='visit'&&s!=='schedule') return list;
  return list+(s==='schedule'
    ?`<div class="sheet-ov"><div class="sheet">${pHead(V.dly,{...HDLY,phone:1})}<div class="sb">${scheduleBody()}</div>${scheduleFoot()}</div></div>`
    :`<div class="sheet-ov"><div class="sheet">${pHead(V.c320,{...H320,phone:1})}<div class="sb">${visitBody()}</div>${visitFoot(1)}</div></div>`);
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
function clean(k){document.querySelectorAll(`[data-render="${k}"]`).forEach(el=>el.closest('.fx-screen')?.querySelectorAll(':scope>.sheet-ov').forEach(o=>o.remove()));}
function views(){const bar=document.querySelector('.viewbar');if(!bar)return;const show=v=>{bar.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===v));document.querySelectorAll('section[data-view]').forEach(sec=>sec.hidden=sec.dataset.view!==v);fit();};bar.querySelectorAll('button').forEach(b=>b.onclick=()=>show(b.dataset.v));show('board');}
const R={ag:(s,dev)=>web(s,dev),phl:()=>phone('list'),phs:(s)=>{clean('phs');setTimeout(lift);return phone(s);},lg:(s)=>listWeb(s),lpl:()=>listPhone('list'),lps:(s)=>{clean('lps');setTimeout(lift);return listPhone(s);}};
function boot(){patchNav();F.bind(R);lift();views();themes();
  document.querySelectorAll('.states button').forEach(b=>b.addEventListener('click',()=>setTimeout(lift)));
  let t;window.addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(fit,120);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot));else setTimeout(boot);
})();
