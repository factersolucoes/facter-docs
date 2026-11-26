/* preventiva-agenda: calm agenda, on top of ../_kit/kit.js (window.FX) */
(function(){
const F=window.FX, ic=F.ic, esc=F.esc, btn=F.btn;

/* composition mark: [plate, kind, state] in coupling order; state d = overdue, w = this week */
const STATE={d:'vencida',w:'vence esta semana','':'em dia'};
function mark(parts){
  let ci=0;const tip=parts.map(([p,k,s])=>`${k==='cav'?'Cavalo':k==='dolly'?'Dolly':`${++ci}ª carreta`} ${p}: ${STATE[s||'']}`).join(' · ');
  return `<span class="cm" title="${esc(tip)}" aria-label="${esc(tip)}">${parts.map(([,k,s])=>`<i class="${k==='cav'?'cav':k==='dolly'?'dly':''} ${s||''}"></i>`).join('')}</span>`;
}

/* ---------- data: Base Curitiba, hoje qui 26/11/2026 ---------- */
const V={
  c320:{name:'C-320',full:'Conjunto C-320',sub:'Cavalo QRT4B22 e 3 carretas',parts:[['QRT4B22','cav',''],['RTF6K38','car',''],['RTE1J77','car','d'],['SRK9H46','car','']],svc:'Lona de freio, eixo 3',more:'+2 preventivas',when:'venceu há 1.850 km',t:'d'},
  dly:{name:'DLY1J07',full:'Cavalo DLY1J07',sub:'Frota 812, transportadora JSL',parts:[['DLY1J07','cav','d']],svc:'Revisão B',more:'Inclui a revisão A',when:'venceu há 4.300 km',t:'d'},
  c207:{name:'C-207',full:'Conjunto C-207',sub:'Cavalo QRT9D14 e 2 carretas',parts:[['QRT9D14','cav',''],['RTC3B19','car','d'],['RTC3B20','car','']],svc:'Fueiros e barrotes',more:'+1 preventiva',when:'venceu há 3 dias',t:'d'},
  c118:{name:'C-118',parts:[['QRT7C10','cav','w'],['RTB2A41','car',''],['RTB2A42','car','']],svc:'Revisão A',more:'+1 preventiva',when:'sáb 28/11',t:'w'},
  q1a:{name:'QRT1A09',parts:[['QRT1A09','cav','w']],svc:'Revisão A',more:'',when:'dom 29/11',t:'w'},
  rta:{name:'RTA4A44',parts:[['RTA4A44','car','w']],svc:'Fueiros e barrotes',more:'',when:'dom 29/11',t:'w'},
  c072:{name:'C-072',parts:[['QRT5F80','cav',''],['RTG1H22','car','']],svc:'Troca de óleo e filtros',more:'',when:'seg 07/12',t:''},
  q9b:{name:'QRT9B71',parts:[['QRT9B71','cav','']],svc:'Revisão A',more:'',when:'qua 09/12',t:''},
  c320d:{name:'C-320',parts:[['QRT4B22','cav','w'],['RTF6K38','car',''],['RTE1J77','car',''],['SRK9H46','car','']],svc:'Troca de óleo e filtros',more:'',when:'sáb 28/11',t:'w',tag:1},
  c044:{name:'C-044',parts:[['QRT2E55','cav',''],['RTD8F12','car',''],['RTD8F13','car','']],svc:'Revisão B',more:'+1 preventiva',when:'qui 10/12',t:''},
  q6h:{name:'QRT6H33',parts:[['QRT6H33','cav','']],svc:'Lona de freio, eixos 2 e 3',more:'',when:'ter 15/12',t:''},
  rtf:{name:'RTF2D10',parts:[['RTF2D10','car','']],svc:'Lubrificação geral',more:'',when:'sex 18/12',t:''},
  srt:{name:'SRT2C55',parts:[['SRT2C55','car','']],svc:'Sem leitura de km',more:'3 preventivas esperando',when:'desde 12/10',t:'m'},
  rtc:{name:'RTC9K21',parts:[['RTC9K21','car','']],svc:'Km a conferir',more:'Salto de 9.800 km em um dia',when:'desde ontem',t:'m'},
};
const GROUPS_ALL=[
  {k:'over',title:'Vencidas',count:'3 veículos',tone:'d',icon:'warning-octagon',ids:['c320','dly','c207']},
  {k:'week',title:'Esta semana',count:'3 veículos',tone:'w',icon:'hourglass-medium',ids:['c118','q1a','rta']},
  {k:'next',title:'Próximas semanas',count:'9 veículos',tone:'',icon:'calendar-blank',ids:['c072','q9b','c044','q6h','rtf'],more:'Ver as 9 até 24/12'},
  {k:'nokm',title:'Sem km',count:'2 veículos',tone:'',icon:'gauge',ids:['srt','rtc']},
];

/* ---------- pieces ---------- */
const motif=()=>`<span class="motif" aria-hidden="true">${[[1,1,0,1],[1,0,1],[1,1,1,0],[1,0],[1,1,0]].map(r=>`<span>${r.map((x,i)=>`<i class="${i===0?'cav':''} ${x?'':'o'}"></i>`).join('')}</span>`).join('')}</span>`;
const head=o=>`<div class="hl hero">${motif()}<div class="big">5</div><div class="tx"><h2>preventivas vencidas</h2><p>em <b>3 veículos</b>, <b>2</b> já no pátio</p></div><div class="stats"><span class="st w"><b>4</b>esta semana</span><span class="st"><b>9</b>próximas</span></div></div>`;
const search=()=>`<span class="sf" role="search">${ic('magnifying-glass','s16')}<span>Buscar placa ou conjunto</span></span>`;
function row(id,sel){const v=V[id];
  return `<div class="vr ${sel===id?'on':''}" role="button" tabindex="0"><div class="who"><b>${v.name}</b>${mark(v.parts)}</div><div class="what"><b>${v.svc}</b>${v.more?`<span>${v.more}</span>`:''}</div><div class="when ${v.t}">${v.when}</div>${ic('caret-right','s16 car')}</div>`;}
function group(g,sel){
  return `<section class="grp"><header><span class="gt ${g.tone}">${ic(g.icon,'s16')}</span><h3>${g.title}</h3><span class="gc">${g.count}</span></header><div class="rows">${g.ids.map(id=>row(id,sel)).join('')}</div>${g.more?`<div class="more">${g.more}${ic('caret-down','s14')}</div>`:''}</section>`;}

/* visit item: [service, where, state, tone, rule and last time]. No bars or axle drawings:
   in the comprehension test nobody could explain them without a legend */
const ITEMS_C320=[
  ['Lona de freio','Na 2ª carreta, eixo 3','Venceu há 1.850 km','d','Trocar a cada 60 mil km. Última troca em 12/05.'],
  ['Lubrificação geral','Na 2ª carreta','Vence hoje','w','Fazer a cada 30 dias. Última em 27/10.'],
  ['Troca de óleo e filtros','No cavalo','Vence em 1.200 km','','Trocar a cada 20 mil km. Última troca em 02/09.'],
];
const item=([n,where,v,t,rule],i)=>pvRow(null,n,where,v,t,rule);
const items=list=>`<div class="plist">${list.map(item).join('')}</div>`;
const secHead=(title,right='')=>`<div class="sh"><h3>${title}</h3>${right}</div>`;
const count=n=>`<span class="cnt">${n}</span>`;
const pill=(tone,icon,text)=>`<span class="spill ${tone}">${ic(icon,'s16')}${text}</span>`;
const metrics=m=>`<div class="mstrip">${m.map(([l,v,t])=>`<div><span>${l}</span><b class="${t||''}">${v}</b></div>`).join('')}</div>`;
const parts=(ok,list,note)=>`<div class="sec">${secHead('Peças necessárias',ok?`<span class="kchip s">${ic('check-circle','s16')}Todas em estoque</span>`:`<span class="kchip w">${ic('package','s16')}${note[0]}</span>`)}<div class="kgrid">${list.map(([q,n,has])=>`<span class="kp ${has?'':'miss'}"><b>${q}</b><span>${n}</span>${has?`<i class="okk">${ic('check','s12')}</i>`:'<i class="miss">falta</i>'}</span>`).join('')}</div>${ok?'':`<p class="sub">${note[1]}</p>`}</div>`;
const history=(title,rows)=>`<div class="sec hist">${secHead(title)}<ol class="tl">${rows.map(([d,sv,os])=>`<li><span class="d">${d}</span><span class="s">${sv}</span><span class="o">${os}</span></li>`).join('')}</ol></div>`;
const foot=t=>`<p class="foot">${ic('clock-counter-clockwise','s14')}<span>${t}</span></p>`;
function pHead(v,o={}){return `<div class="phd">${o.phone?'<div class="grab"></div>':''}<div class="ph">${o.back?`<span class="xb back" role="button" aria-label="Voltar">${ic('arrow-left','s16')}</span>`:''}<div class="t"><h2>${o.title||v.full}</h2><p>${mark(v.parts)}${o.sub||v.sub}</p></div>${o.back?'':`<span class="xb" role="button" aria-label="Fechar">${ic('x','s16')}</span>`}</div>${o.status?`<div class="pst">${o.status}</div>`:''}${o.src?`<p class="src">${ic('arrows-left-right','s14')}${o.src}</p>`:''}${o.metrics?metrics(o.metrics):''}</div>`;}
/* drawer modes: all = everything checked; none = nothing checked; one = one left for later;
   allDefer = "Adiar todas"; done = after including */
const VMODE={kitopen:'all',sap:'sap',visit:'all',pick:'none',defer1:'one',deferall:'allDefer',done:'done',left:'left',closed:'closed'};
const isVisit=s=>s in VMODE;
let DONE=false; /* after "Feito" the included items leave the agenda; the deferred one moves to its real group */
const gs=()=>DONE?[{...GROUPS_ALL[0],count:'2 veículos',ids:['dly','c207']},{...GROUPS_ALL[1],count:'4 veículos',ids:['c320d','c118','q1a','rta']},GROUPS_ALL[2],GROUPS_ALL[3]]:GROUPS_ALL;
const N=()=>DONE?{over:2,week:4,big:3,veh:2,yard:1}:{over:3,week:3,big:5,veh:3,yard:2};

const DUR={all:'3 h 20',one:'2 h 10',none:'0 h',done:'2 h 10',closed:'2 h 10',left:'3 h 20'};
const STATUS320={left:pill('n','road-horizon','Saiu do pátio às 15h10 · OS 1042 fechada como pronta'),closed:pill('n','garage','No pátio desde ontem · OS 1042 concluída')};
/* parts and supplies, the v1 work-order pattern: kits as rows that open, loose parts below.
   Situação here is availability: Em estoque / Falta 1, chega quinta / Sem estoque */
const SIT={s:'Em estoque',w:'Falta 1',d:'Sem estoque'};
const TAG={s:'tem',w:'falta 1, chega quinta',d:'sem estoque'};
let KITOPEN=false;
const sit=t=>`<span class="sit ${t}">${SIT[t]}</span>`;
/* one compact row per kit: name and situation, then "3 peças · where"; opening shows the parts one line each */
function kitRow(k,open){
  const extra='';
  return `<div class="pk ${open?'open':''}" role="button" aria-expanded="${open}"><span class="kic">${ic('stack','s14')}</span><span class="pt"><b title="${esc(k.name)}">${k.name}</b><small>${k.parts.length} peças · ${k.locd||k.loc}${extra}</small></span>${sit(k.t)}${ic('caret-down','s16 chev')}</div>
  ${open?`<div class="pnest">${k.parts.map(([q,n,rule,t])=>`<div class="pn"><span class="q">${q}</span><span class="nm"><span>${n}</span>${rule?`<span class="m">${rule}</span>`:''}</span><span class="tg ${t}">${t==='s'?ic('check','s12'):''}${TAG[t]}</span></div>`).join('')}</div>`:''}`;}
const looseRow=([n,l,q,t])=>`<div class="pk lo"><span class="kic">${ic('drop','s14')}</span><span class="pt"><b>${n}</b><small>${q} · ${l}</small></span>${sit(t)}<span class="chev"></span></div>`;
function partsBox(o){
  const nl=(o.loose||[]).length, nk=o.kits.length;
  const comp=`${nk} ${nk>1?'kits':'kit'}${nl?` e ${nl} ${nl>1?'avulsas':'avulsa'}`:''}`;
  const sum=o.miss?`<span class="psum ${o.mt||'w'}">${ic(o.mt==='d'?'x-circle':'clock','s14')}${o.miss} ${o.mt==='d'?'sem estoque':'em falta'}</span>`:`<span class="psum s">${ic('check-circle','s14')}Tudo em estoque</span>`;
  return `<div class="sec pr"><div class="prh"><span class="gt">${ic('package','s16')}</span><div class="prt"><h3>Peças e insumos</h3><p>${o.items} itens, em ${comp}</p></div>${sum}</div>
  <div class="plist">${o.kits.map((k,i)=>kitRow(k,KITOPEN&&i===0)).join('')}${(o.loose||[]).map(looseRow).join('')}</div>${o.off?`<p class="kitoff">${o.off}</p>`:''}</div>`;}
const K_LONA={name:'Kit lona de freio',loc:'2ª carreta · eixo 3',locd:'2ª carreta, eixo 3',t:'w',parts:[['4','Lona de freio','2 por lado','s'],['8','Mola de retorno','4 por lado','s'],['2','Jogo de rebites','1 por lado','w']]};
const K_OLEO={name:'Kit troca de óleo',loc:'Cavalo',locd:'cavalo',t:'s',parts:[['38 l','Óleo 15W40','','s'],['1','Filtro de óleo','','s'],['1','Filtro de ar','','s'],['1','Filtro de diesel','','s']]};
const GRAXA=['Graxa','2ª carreta','1 kg','s'];
function kits320(m){
  if(m==='none') return `<div class="sec">${secHead('Peças e insumos')}<p class="lede">Marque uma preventiva para ver as peças dela.</p></div>`;
  const dropOil=m==='one'||m==='closed';
  return partsBox(dropOil?{items:4,ok:3,miss:1,kits:[K_LONA],loose:[GRAXA],off:'Kit troca de óleo fica para depois, junto com a preventiva adiada.'}:{items:8,ok:7,miss:1,kits:[K_LONA,K_OLEO],loose:[GRAXA]});
}
const kitsDly=()=>partsBox({items:4,ok:3,miss:1,mt:'d',kits:[{name:'Kit revisão B',loc:'Cavalo',locd:'cavalo',t:'d',parts:[['30 l','Óleo 15W40','','s'],['1','Filtro de óleo','','s'],['1','Filtro de ar','','d'],['1','Filtro de diesel','','s']]}]})+'<p class="ptotal">O pedido de compra do filtro de ar sai junto com o agendamento.</p>';
const kits044=()=>partsBox({items:5,ok:5,kits:[{name:'Kit revisão B',loc:'Cavalo',locd:'cavalo',t:'s',parts:[['30 l','Óleo 15W40','','s'],['1','Filtro de óleo','','s'],['1','Filtro de ar','','s'],['1','Filtro de diesel','','s']]}],loose:[['Graxa','1ª carreta','1 kg','s']]});
const h320=m=>({status:STATUS320[m]||pill('s','garage','No pátio desde ontem · OS 1042 aberta'),metrics:m==='done'?[['Na OS','2 preventivas',''],['Adiada','1','w'],['Duração','2 h 10','']]:[['Atraso','1.850 km','d'],['Peças','Falta 1','w'],['Duração',DUR[m]||'3 h 20','']]});
const H320=h320('all');
const cbx=on=>`<i class="cbx ${on?'on':''}">${on?ic('check','s14'):''}</i>`;
const whereShort=w=>{const x=w.replace(/^(Na|No) /,'');return x.charAt(0).toUpperCase()+x.slice(1);};
const ruleShort=r=>r?r.split('.')[0].replace(/^(Trocar|Fazer) /,''):'';
const pvRow=(on,n,where,v,t,rule)=>`<label class="pk pv ${on===null?'nock':''} ${on===false?'off':''}">${on===null?`<span class="kic">${ic('calendar-check','s14')}</span>`:cbx(on)}<span class="pt"><b title="${n}">${n}</b><small title="${rule?ruleShort(rule).replace(/^a /,'A '):''}">${whereShort(where)}${rule?` · ${ruleShort(rule).replace(/^a cada /,'')}`:''}</small></span><span class="sit ${t||'n'}">${v}</span><span></span></label>`;
const prevHead=(title,sub,chip)=>`<div class="prh pvh"><span class="gt">${ic('calendar-check','s16')}</span><div class="prt"><h3>${title}</h3><p>${sub}</p></div>${chip||''}</div>`;
const OVERCHIP="";
const ckItem=on=>([n,where,v,t,rule],i)=>pvRow(on(i),n,where,v,t,rule);
const chips=(list,on)=>`<div class="chips">${list.map(c=>F.fchip(c,{on:c===on,icon:c==='Escolher dia'?'calendar-blank':''})).join('')}</div>`;
const REASONS=['Falta peça','Sem tempo nesta parada','Conjunto precisa sair','Sem mecânico','Outro'];
const WHENS=['Na próxima vinda à oficina','Em 7 dias','Em 1.000 km','Escolher dia'];
const deferAsk=(lead)=>`<div class="defer">${lead}
  <div class="q"><span>Por quê?</span>${chips(REASONS,'Falta peça')}</div>
  <div class="q"><span>Quando lembrar de novo?</span>${chips(WHENS,'Na próxima vinda à oficina')}</div>
  <p class="dnote">${ic('info','s16')}<span>Conta como atraso.</span></p></div>`;
function visitBodyM(m){
  const tail=`${kits320(m)}
  ${history('Últimas manutenções deste conjunto',[['27/10','Lubrificação geral','OS 0998'],['02/09','Troca de óleo e filtros','OS 0954'],['12/05','Lona de freio na 2ª carreta, eixo 3','OS 0871']])}`;
  if(m==='done') return `<div class="done"><span class="halo sm">${ic('check-circle','s24')}</span><div class="dtx"><b>2 preventivas na OS 1042</b><p>1 adiada para a próxima vinda (falta peça)</p></div><span class="undo">Desfazer <i>10 s</i></span></div>
  <div class="sec">${secHead('Na OS 1042',count(2))}<div class="ilist">${ITEMS_C320.slice(0,2).map(([n,w])=>`<div class="ii dn"><span class="okk">${ic('check','s12')}</span><span class="ib"><b>${n}</b><span class="iw">${w}</span></span></div>`).join('')}</div></div>
  <p class="dnote">${ic('info','s16')}<span>Mudou de ideia depois? Na OS, cada preventiva tem <b>Tirar da OS</b> no menu do serviço. Ela volta para a agenda como não feita, sem contar como adiada.</span></p>
  <div class="sec">${secHead('Adiada',count(1))}<div class="ilist"><div class="ii dn"><span class="ib"><span class="it1"><b>Troca de óleo e filtros</b><span class="tag">adiada · falta peça</span></span><span class="iw">No cavalo</span><span class="ir">Volta na próxima vinda à oficina.</span></span></div></div></div>`;
  if(m==='allDefer') return `<div class="sec">${secHead('Adiar as 3 preventivas')}<div class="ilist">${ITEMS_C320.map(([n,w,v,t])=>`<div class="ii dn"><span class="ib"><span class="it1"><b>${n}</b><span class="tp sm ${t}">${v}</span></span><span class="iw">${w}</span></span></div>`).join('')}</div></div>${deferAsk('')}`;
  if(m==='left') return `<div class="sec">${prevHead('Preventivas para marcar','3 preventivas',OVERCHIP)}<div class="plist">${ITEMS_C320.map(ckItem(()=>true)).join('')}</div></div>${tail}`;
  if(m==='closed') return `<div class="notice-w">${ic('warning','s16')}<span><b>A OS 1042 foi concluída por Carlos às 14h52.</b> Sua escolha continua aqui: abra uma OS nova ou marque um dia.</span></div>
  <div class="sec">${prevHead('Preventivas para fazer agora','2 de 3 marcadas',OVERCHIP)}<div class="plist">${ITEMS_C320.map(ckItem(i=>i<2)).join('')}</div><p class="dl2"><b>1 fica para depois:</b> Troca de óleo e filtros · falta peça · na próxima vinda</p></div>${tail}`;
  const on=i=>m==='all'||m==='sap'?true:m==='none'?false:i<2;
  const lede=m!=='all'&&m!=='sap'?'Marque o que dá para fazer enquanto o conjunto está parado.':'Venceram ou vencem logo. Dá para fazer todas enquanto o conjunto está parado.';
  return `<div class="sec">${prevHead('Preventivas para fazer agora',m==='one'?'2 de 3 marcadas':m==='none'?'Nenhuma marcada':'3 preventivas',OVERCHIP)}<div class="plist">${ITEMS_C320.map(ckItem(on)).join('')}</div>
  ${m==='one'?deferAsk('<p class="dl"><b>1 fica para depois:</b> Troca de óleo e filtros</p>'):''}</div>${tail}`;
}
function visitFootM(m){
  if(m==='sap') return `<div class="pf"><p class="sapn">${ic('arrows-left-right','s14')}<span>Adiar e marcar dia ficam no SAP · <span class="lk">ver ordem 4000131</span></span></p>${btn('Incluir as 3 na OS 1042',{icon:'plus',action:1})}</div>`;
  if(m==='left') return `<div class="pf"><div class="bb">${btn('Adiar todas',{variant:'outline'})}${btn('Marcar dia na oficina',{icon:'calendar-check',action:1})}</div></div>`;
  if(m==='closed') return `<div class="pf"><div class="bb">${btn('Marcar dia na oficina',{variant:'outline'})}${btn('Abrir OS nova com as 2',{icon:'plus',action:1})}</div></div>`;
  if(m==='done') return `<div class="pf"><div class="bb">${btn('Fechar',{variant:'outline'})}${btn('Abrir a OS 1042',{icon:'arrow-square-out',action:1})}</div></div>`;
  if(m==='allDefer') return `<div class="pf"><div class="bb">${btn('Voltar',{variant:'outline'})}${btn('Adiar as 3',{icon:'clock-countdown',action:1})}</div></div>`;
  const n=m==='one'?2:3;
  return `<div class="pf"><div class="bb">${btn('Adiar todas',{variant:'outline'})}${m==='none'?btn('Escolha o que fazer agora',{disabled:1}):btn(`Incluir as ${n} na OS 1042`,{icon:'plus',action:1})}</div></div>`;
}
const visitDrawer=(s,phone)=>{const m=VMODE[s];const head=pHead(V.c320,{...h320(m),phone,...(m==='sap'?{src:'Plano do SAP · ordem 4000131'}:{}),...(m==='allDefer'?{title:'Adiar todas',back:1,sub:'Conjunto C-320'}:{})});
  return phone?`<div class="sheet-ov"><div class="sheet">${head}<div class="sb">${visitBodyM(m)}</div>${visitFootM(m)}</div></div>`:drawer(`${head}<div class="pb">${visitBodyM(m)}</div>${visitFootM(m)}`);};

const WD=['seg','ter','qua','qui','sex','sáb'];
const DAYS=[['23','',2],['24','',2],['25','',2],['26','cheia',1],['27','cheia',1],['28','6 h',0,1],['30','18 h'],['01','22 h'],['02','28 h'],['03','3 h',1],['04','32 h'],['05','8 h']];
const HDLY={title:'Marcar dia na oficina',sub:'Cavalo DLY1J07, revisão B',back:1,status:pill('n','road-horizon','Na estrada · roda 640 km por dia'),metrics:[['Atraso','4.300 km','d'],['Peças','Falta 1','w'],['Duração','4 h','']]};
function scheduleBody(){
  return `<div class="sec cal">${secHead('Escolha o dia',`<span class="hh">horas livres na oficina</span>`)}
  <div class="wk">${WD.map(d=>`<span class="wd">${d}</span>`).join('')}${DAYS.map(([n,l,off,pick])=>`<div class="day ${off===2?'off past':off?'off':''} ${pick?'pick':''}"><b>${n}</b><span>${l||'&nbsp;'}</span></div>`).join('')}</div><p class="first">${ic('calendar-check','s16')}<span><b>Primeiro dia com espaço: sáb 28/11</b>, com 6&nbsp;h livres</span></p></div>
  <div class="sec">${prevHead('Preventivas para fazer','1 preventiva',OVERCHIP)}${items([['Revisão B','No cavalo, junto com a revisão A','Venceu há 4.300 km','d','Fazer a cada 30 mil km. Última em 03/06.']])}</div>
  ${kitsDly()}
  <label class="chk"><i>${ic('check','s14')}</i>Avisar a transportadora JSL por e-mail</label>`;}
const scheduleFoot=()=>`<div class="pf"><div class="bb">${btn('Voltar',{variant:'outline'})}${btn('Agendar para sáb 28/11',{icon:'calendar-check',action:1})}</div></div>`;

function skList(phone){
  const r=()=>`<div style="display:flex;align-items:center;gap:20px;min-height:64px;padding:10px 12px">${'<span class="sk" style="width:140px;height:16px"></span>'}<span style="flex:1;display:flex;flex-direction:column;gap:6px"><span class="sk" style="width:60%;height:15px"></span><span class="sk" style="width:30%;height:12px"></span></span>${phone?'':'<span class="sk" style="width:120px;height:15px"></span>'}</div>`;
  const g=n=>`<section class="grp"><header><span class="sk" style="width:32px;height:32px;border-radius:10px"></span><span class="sk" style="width:120px;height:16px"></span></header>${Array.from({length:n},r).join('')}</section>`;
  return `<div class="hl"><div class="tx" style="display:flex;flex-direction:column;gap:10px"><span class="sk" style="width:${phone?'90%':'420px'};height:24px"></span><span class="sk" style="width:${phone?'60%':'260px'};height:15px"></span></div></div>${g(3)}${g(3)}`;
}

const C044={full:'Conjunto C-044',sub:'Cavalo QRT2E55 e 2 carretas',parts:V.c044.parts};
function nextPanel(){return `<aside class="pnl">${pHead(C044,{status:pill('n','road-horizon','Na estrada · roda 610 km por dia'),metrics:[['Vence','qui 10/12',''],['Peças','Em estoque','s'],['Duração','3 h','']]})}<div class="pb"><div class="sec">${prevHead('Preventivas para fazer','2 preventivas','')}${items([['Revisão B','No cavalo','Vence qui 10/12','','Fazer a cada 30 mil km. Última em 14/06.'],['Lubrificação geral','Na 1ª carreta','Vence sáb 12/12','','Fazer a cada 30 dias. Última em 12/11.']])}</div>
  ${kits044()}</div>
  <div class="pf"><div class="bb">${btn('Adiar',{variant:'outline'})}${btn('Marcar dia na oficina',{icon:'calendar-check',action:1})}</div></div></aside>`;}

/* ---------- board: the three columns side by side, the whole week at once ---------- */
const pillMore=v=>/^\+\d/.test(v.more)?`<span class="pill">${v.more.split(' ')[0]}</span>`:'';
function card(id,sel){const v=V[id];const pk=PICK&&MULTI.includes(id);return `<div class="cd ${sel===id?'on':''} ${pk?'picked':''}" role="button" tabindex="0"><div class="l1">${PICK?cbx(pk):''}<b title="${esc(v.name)}">${v.name}</b>${mark(v.parts)}<span class="when ${v.t}">${v.when}</span></div><div class="l2"><span>${v.svc}</span>${pillMore(v)}${v.tag?'<span class="tag">adiada · falta peça</span>':''}</div></div>`;}
const colHead=g=>`<header class="ch"><span class="gt ${g.tone}">${ic(g.icon,'s16')}</span><h3>${g.title}</h3><span class="gc ${g.count.startsWith('0')?'':g.tone}">${g.count.split(' ')[0]}</span></header>`;
function column(g,sel,empty){
  return `<section class="cl">${colHead(empty?{...g,count:'0'}:g)}<div class="cards">${empty?`<div class="cempty">${ic('check-circle','s20')}<span>${empty}</span></div>`:g.ids.map(id=>card(id,sel)).join('')}${!empty&&g.more?`<div class="more">${g.more}${ic('caret-down','s14')}</div>`:''}</div></section>`;}
const nokm=()=>`<span class="nokm">${ic('gauge','s16')}<b>2 veículos sem km</b><span>ver</span>${ic('caret-right','s14')}</span>`;
const slim=(o={})=>o.empty
  ?`<div class="hero slim"><span class="halo sm">${ic('calendar-check','s20')}</span><div class="tx"><h2>Frota em dia esta semana</h2><p>Nenhuma preventiva vencida. A próxima é a revisão B do C-044, na qui 10/12.</p></div>${nokm()}</div>`
  :`<div class="hero slim"><span class="big">${N().big}</span><div class="tx"><h2>preventivas vencidas</h2><p>em <b>${N().veh} veículos</b>, <b>${N().yard}</b> já no pátio</p></div>${nokm()}</div>`;
function drawer(inner){return `<div class="scrim"></div><aside class="pnl drawer">${inner}</aside>`;}
function skBoard(){
  const c=()=>`<div class="cd sk-cd"><span class="sk" style="width:55%;height:15px"></span><span class="sk" style="width:80%;height:12px;margin-top:10px"></span></div>`;
  const col=n=>`<section class="cl"><header class="ch"><span class="sk" style="width:34px;height:34px;border-radius:11px"></span><span class="sk" style="width:110px;height:16px"></span></header><div class="cards">${Array.from({length:n},c).join('')}</div></section>`;
  return `<div class="bd"><div class="hero slim"><span class="sk" style="width:48px;height:44px;border-radius:12px"></span><div class="tx" style="display:flex;flex-direction:column;gap:8px"><span class="sk" style="width:260px;height:18px"></span><span class="sk" style="width:200px;height:13px"></span></div></div><div class="cols">${col(3)}${col(3)}${col(4)}</div></div>`;
}
/* =====================================================================
   Restored states: no search result, first time, no permission, error,
   SAP mode, by service, several selected to schedule together
   ===================================================================== */
const EMPTY={
  first:{icon:'calendar-plus',title:'A agenda começa com um plano',text:'Um plano diz o que fazer em cada tipo de veículo e de quanto em quanto tempo. Com ele, a agenda mostra o que vence e quando trazer cada veículo para a oficina.',action:()=>btn('Começar pelos planos sugeridos',{icon:'sparkle',action:1}),link:'Criar um plano do zero'},
  noperm:{icon:'lock-simple',title:'Você ainda não vê a agenda',text:'A agenda fica com quem planeja a manutenção. Peça acesso a Marina Souza, gestora da Base Curitiba.',action:()=>btn('Pedir acesso a Marina',{variant:'outline'})},
  nores:{icon:'magnifying-glass',title:'Nenhum veículo com “RTX4” na agenda',text:'Confira a placa ou procure em outra base.',link:'Limpar busca',hint:'<b>RTX4A10</b> está na Base Ponta Grossa · <span class="lk">ver</span>'},
};
const emptyBlock=(k,phone)=>{const e=EMPTY[k];return `<div class="bempty ${phone?'ph':''}"><span class="halo md">${ic(e.icon,'s24')}</span><b>${e.title}</b><p>${e.text}</p>${e.hint?`<p class="ehint">${ic('map-pin','s16')}<span>${e.hint}</span></p>`:''}<div class="ea">${e.action?e.action():''}${e.link?`<span class="lk">${e.link}</span>`:''}</div></div>`;};
const errNote=()=>`<div class="notice-w err">${ic('wifi-slash','s16')}<span><b>Não deu para atualizar a agenda.</b> A internet caiu às 9h12. A tela mostra o que estava aqui às 9h10.</span>${btn('Tentar de novo',{variant:'outline',size:'sm',icon:'arrow-clockwise'})}</div>`;
const sapChip=()=>`<span class="nokm sapc">${ic('arrows-left-right','s16')}<b>Planos do SAP</b><span class="m">atualizado há 12 min</span></span>`;
const searchOn=()=>`<span class="sf on" role="search">${ic('magnifying-glass','s16')}<b>RTX4</b><span class="x">${ic('x','s14')}</span></span>`;
/* by service: the same week grouped by what has to be done, to buy parts */
const SVC={
  over:[['Lona de freio','2 veículos','8 lonas, 16 molas',1],['Revisão B','1 veículo','30 l de óleo, 3 filtros'],['Fueiros e barrotes','1 veículo','12 barrotes'],['Lubrificação geral','2 veículos','2 kg de graxa']],
  week:[['Revisão A','2 veículos','60 l de óleo, 4 filtros'],['Troca de óleo e filtros','1 veículo','38 l de óleo, 3 filtros'],['Fueiros e barrotes','1 veículo','6 barrotes']],
  next:[['Revisão B','2 veículos','60 l de óleo, 6 filtros'],['Lubrificação geral','3 veículos','3 kg de graxa'],['Lona de freio','1 veículo','8 lonas, 16 molas'],['Troca de óleo e filtros','2 veículos','76 l de óleo, 6 filtros']],
};
const svcCard=([n,c,p,on])=>`<div class="cd sv ${on?'on':''}"><div class="l1"><b>${n}</b><span class="when">${c}</span></div><div class="l2"><span>${p}</span></div></div>`;
const svcColumn=(g,k)=>`<section class="cl">${colHead({...g,count:String(SVC[k].length)})}<div class="cards">${SVC[k].map(svcCard).join('')}</div></section>`;
const svcDrawer=()=>drawer(`<div class="phd"><div class="ph"><div class="t"><h2>Lona de freio</h2><p>Vencida em 2 veículos</p></div><span class="xb" role="button" aria-label="Fechar">${ic('x','s16')}</span></div>${metrics([['Veículos','2',''],['Lonas','8',''],['Molas','16','']])}</div>
  <div class="pb"><div class="sec">${secHead('Veículos',count(2))}<div class="ilist">${[['C-320','Na 2ª carreta, eixo 3','Venceu há 1.850 km','d'],['C-207','Na 1ª carreta, eixo 2','Venceu há 900 km','d']].map(([n,w,v,t])=>`<div class="ii dn"><span class="ib"><span class="it1"><b>${n}</b><span class="tp sm ${t}">${v}</span></span><span class="iw">${w}</span></span></div>`).join('')}</div></div>
  <div class="sec">${secHead('Para comprar')}<p class="sub">A Base Curitiba tem 6 lonas e 20 molas. Faltam <b>2 lonas</b> para as duas trocas.</p></div></div>
  <div class="pf"><div class="bb">${btn('Ver por veículo',{variant:'outline'})}${btn('Pedir 2 lonas',{icon:'package',action:1})}</div></div>`);
const segView=on=>`<div class="vseg" role="radiogroup">${['Por veículo','Por serviço'].map(l=>`<span class="${l===on?'on':''}">${l}</span>`).join('')}</div>`;
/* several selected: checkbox on cards and rows, a bottom bar, then one calendar for all */
const MULTI=['dly','c118','q1a'];
const selBar=()=>`<div class="selbar">${F.selbar(3,' selecionados',[{label:'Limpar'},{label:'Marcar dia na oficina',icon:'calendar-check',primary:1}])}</div>`;
const HMULTI={title:'Marcar dia na oficina',sub:'3 veículos juntos',back:1,status:pill('n','road-horizon','Na estrada · chegam juntos'),metrics:[['Veículos','3',''],['Peças','Falta 1','w'],['Duração','9 h no total','']]};
const DAYS_M=[['23','',2],['24','',2],['25','',2],['26','cheia',1],['27','cheia',1],['28','6 h',1],['30','18 h',0,1],['01','22 h'],['02','28 h'],['03','3 h',1],['04','32 h'],['05','8 h',1]];
function multiBody(){
  return `<div class="sec cal">${secHead('Escolha o dia',`<span class="hh">horas livres na oficina</span>`)}
  <div class="wk">${WD.map(d=>`<span class="wd">${d}</span>`).join('')}${DAYS_M.map(([n,l,off,pick])=>`<div class="day ${off===2?'off past':off?'off':''} ${pick?'pick':''}"><b>${n}</b><span>${l||'&nbsp;'}</span></div>`).join('')}</div><p class="first">${ic('calendar-check','s16')}<span><b>Primeiro dia com espaço para as 9 h: seg 30/11</b></span></p></div>
  <div class="sec">${secHead('Veículos',count(3))}<div class="ilist">${[['DLY1J07','Revisão B','4 h'],['C-118','Revisão A e mais 1','3 h'],['QRT1A09','Revisão A','2 h']].map(([n,w,h])=>`<div class="ii dn"><span class="ib"><span class="it1"><b>${n}</b><span class="tp sm">${h}</span></span><span class="iw">${w}</span></span></div>`).join('')}</div></div>
  <label class="chk"><i>${ic('check','s14')}</i>Avisar as transportadoras por e-mail</label>`;}
const multiFoot=()=>`<div class="pf"><div class="bb">${btn('Voltar',{variant:'outline'})}${btn('Agendar os 3 para seg 30/11',{icon:'calendar-check',action:1})}</div></div>`;
const multiDrawer=phone=>phone?`<div class="sheet-ov"><div class="sheet">${pHead(V.dly,{...HMULTI,phone:1})}<div class="sb">${multiBody()}</div>${multiFoot()}</div></div>`:drawer(`${pHead(V.dly,HMULTI)}<div class="pb">${multiBody()}</div>${multiFoot()}`);
let PICK=null; /* ids with a visible checkbox; the ones in MULTI are checked */

/* =====================================================================
   Stress: big fleet, long sets and text, a set with 11 preventives,
   partial data, two people at once, no signal
   ===================================================================== */
const STRESS={sVol:1,sLong:1,sBig:1,sConc:1,sOff:1};
SIT.n='Não informado'; TAG.n='sem acesso ao estoque';
/* big fleet: generated rows; each column shows the first 8 and pages the rest */
const SVCS=['Revisão B','Lona de freio','Fueiros e barrotes','Lubrificação geral','Revisão A','Troca de óleo e filtros','Lona de freio, eixos 2 e 3'];
const genIds=(pre,n,mk)=>Array.from({length:n},(_,i)=>{const id=pre+i;if(!V[id])V[id]=mk(i);if(!LM[id])LM[id]={pos:i%2?'Cavalo':'2ª carreta',where:i%3?'Rodando, 600 km/dia':'No pátio, OS '+(1100+i),sub:i%3?'em '+(i+2)+' dias':'venceu '+(20-i%9)+'/11',act:i%3?'Agendar':'Incluir na OS'};return id;});
const setParts=(i,t)=>i%3===0?[['P'+i,'cav',t]]:[['P'+i,'cav',''],['C'+i,'car',t],['D'+i,'car','']];
const VOL={over:{n:31,ids:()=>genIds('vo',8,i=>({name:i%3?'C-'+(400+i*7):'QRT'+(2+i)+'B'+(10+i),parts:setParts(i,'d'),svc:SVCS[i%7],more:i%4===1?'+2 nesta visita':'',when:'venceu há '+[(1850+i*913),(420+i*77),(12400+i*1700)][i%3].toLocaleString('pt-BR')+' km',t:'d'}))},
  week:{n:47,ids:()=>genIds('vw',8,i=>({name:'C-'+(500+i*5),parts:setParts(i,'w'),svc:SVCS[(i+2)%7],more:'',when:['sex 27/11','sáb 28/11','dom 29/11','seg 30/11','ter 01/12','qua 02/12'][i%6],t:'w'}))},
  next:{n:180,ids:()=>genIds('vn',8,i=>({name:'C-'+(600+i*3),parts:setParts(i,''),svc:SVCS[(i+4)%7],more:'',when:['qui 03/12','sex 04/12','seg 07/12','ter 08/12','qua 09/12','qui 10/12','sex 11/12','seg 14/12'][i],t:''}))}};
/* long sets and text, partial data */
Object.assign(V,{
  rt9:{name:'RT-9',full:'Rodotrem RT-9',sub:'Cavalo QRT1Z99, 2 carretas e dolly sem placa',parts:[['QRT1Z99','cav','d'],['RTL4M01','car',''],['sem placa','dolly','d'],['RTL4M02','car','']],svc:'Revisão completa do sistema de freio pneumático com troca de válvulas',more:'+2 nesta visita',when:'venceu há 128.400 km',t:'d'},
  e9:{name:'Bitrem 9 eixos B-77',parts:[['QRT8Y12','cav',''],['RTM2N10','car','d'],['RTM2N11','car',''],['sem placa','dolly',''],['RTM2N12','car','']],svc:'Inspeção do dolly e do pino-rei',more:'',when:'venceu há 1 ano e 2 meses',t:'d'},
  km7:{name:'QRT0A01',parts:[['QRT0A01','cav','d']],svc:'Revisão B',more:'',when:'venceu há 3.210 km',t:'d'},
  wk3:{name:'C-318',parts:[['QRT4C77','cav','w'],['RTP1A20','car','']],svc:'Troca do filtro secador de ar',more:'',when:'vence em 3 dias',t:'w'},
  yr1:{name:'C-901',parts:[['QRT9Z01','cav',''],['RTZ0A11','car','']],svc:'Troca do óleo do diferencial',more:'',when:'vence em 1 ano',t:''},
  nob:{name:'QRT7X55',parts:[['QRT7X55','cav','']],svc:'Revisão A',more:'',when:'qui 10/12',t:''},
});

const LONG={over:['rt9','e9','km7'],week:['wk3','c118'],next:['yr1','nob','c044']};
/* drawers */
const pvList=(rows,on)=>`<div class="plist">${rows.map(([n,w,v,t,r],i)=>pvRow(on?on(i):true,n,w,v,t,r)).join('')}</div>`;
const moreRow=t=>`<div class="pk morerow"><span class="lk">${t}</span>${ic('caret-down','s14')}</div>`;
const BIG=[['Revisão C','No cavalo','Venceu há 42.300 km','d','A cada 120 mil km'],['Lona de freio','Na 1ª carreta, eixos 1 a 3','Venceu há 18.900 km','d','A cada 60 mil km'],['Lona de freio','Na 2ª carreta, eixos 1 a 3','Venceu há 18.900 km','d','A cada 60 mil km'],['Lona de freio','Na 3ª carreta, eixos 1 a 3','Venceu há 9.100 km','d','A cada 60 mil km'],['Fueiros e barrotes','Na 1ª carreta','Venceu há 4 meses','d','A cada 6 meses'],['Fueiros e barrotes','Na 2ª carreta','Venceu há 4 meses','d','A cada 6 meses'],['Fueiros e barrotes','Na 3ª carreta','Venceu há 2 meses','d','A cada 6 meses'],['Lubrificação geral','Nas 3 carretas','Venceu há 3 meses','d','A cada 30 dias'],['Rolamento de cubo','Na 1ª carreta, eixo 2','Vence hoje','w','A cada 200 mil km'],['Troca de óleo e filtros','No cavalo','Vence em 900 km','','A cada 20 mil km'],['Alinhamento','Nas 3 carretas','Vence em 2.400 km','','A cada 40 mil km']];
const kk=(name,locd,t,parts)=>({name,locd,t,parts});
const BIGKITS=[kk('Kit revisão C','cavalo','s',[['40 l','Óleo 15W40','','s']]),kk('Kit lona de freio','1ª carreta, eixos 1 a 3','w',[['12','Lona de freio','2 por lado','w']]),kk('Kit lona de freio','2ª carreta, eixos 1 a 3','w',[['12','Lona','','w']]),kk('Kit lona de freio','3ª carreta, eixos 1 a 3','w',[['12','Lona','','w']]),kk('Kit fueiros','3 carretas','s',[['36','Barrote','','s']]),kk('Kit rolamento de cubo','1ª carreta, eixo 2','s',[['2','Rolamento','1 por lado','s']]),kk('Kit troca de óleo','cavalo','s',[['38 l','Óleo','','s']])];
function stressDrawer(s,phone){
  let head,body,foot;
  if(s==='sLong'){
    head=pHead(V.rt9,{status:pill('n','road-horizon','Na estrada · Transportadora Rodoviária Irmãos Albuquerque de Mato Grosso do Sul'),metrics:[['Atraso','128.400 km','d'],['Peças','Sem estoque','d'],['Duração','6 h','']],phone});
    body=`<div class="sec">${prevHead('Preventivas para fazer agora','3 preventivas')}${pvList([['Revisão completa do sistema de freio pneumático com troca de válvulas','No cavalo','Venceu há 128.400 km','d','Nunca feita'],['Inspeção do dolly e do pino-rei','No dolly sem placa','Venceu há 1 ano e 2 meses','d','A cada 12 meses'],['Troca do óleo do diferencial','No cavalo','Vence em 1 ano','','A cada 2 anos']])}</div>
    ${partsBox({items:6,ok:0,miss:5,mt:'d',kits:[kk('Kit válvulas do freio pneumático com reparo completo','cavalo · nenhuma base tem','d',[['4','Válvula relé','','d'],['1','Válvula moduladora','','d']])],loose:[['Graxa para pino-rei','dolly','1 kg','n']]})}`;
    foot=`<div class="pf"><div class="bb">${btn('Adiar todas',{variant:'outline'})}${btn('Marcar dia na oficina',{icon:'calendar-check',action:1})}</div></div>`;
  } else if(s==='sBig'){
    const C712={full:'Conjunto C-712',sub:'Cavalo QRT6K40 e 3 carretas',parts:[['QRT6K40','cav','d'],['RTS1A01','car','d'],['RTS1A02','car','d'],['RTS1A03','car','d']]};
    head=pHead(C712,{status:pill('s','garage','No pátio desde hoje às 7h · OS 1101 aberta'),metrics:[['Atraso','42.300 km','d'],['Peças','Falta 3','w'],['Duração','14 h · 2 dias','w']],phone});
    body=`<div class="notice-w">${ic('warning','s16')}<span><b>Não cabe nesta parada.</b> São 14 h de oficina e o conjunto sai amanhã às 8h. Marque o que dá para fazer agora.</span></div>
    <div class="sec">${prevHead('Preventivas para fazer agora','11 preventivas')}<div class="plist">${BIG.slice(0,5).map(([n,w,v,t,r])=>pvRow(true,n,w,v,t,r)).join('')}${moreRow('Mostrar mais 6')}</div></div>
    ${partsBox({items:37,ok:34,miss:3,kits:BIGKITS.slice(0,4),loose:[]}).replace('</div></div>',`${moreRow('Mostrar mais 3 kits e 5 avulsas')}</div></div>`).replace('em 4 kits','em 7 kits e 5 avulsas')}`;
    foot=`<div class="pf"><div class="bb">${btn('Adiar todas',{variant:'outline'})}${btn('Incluir as 11 na OS 1101',{icon:'plus',action:1})}</div></div>`;
  } else if(s==='sConc'){
    head=pHead(V.c320,{...h320('one'),phone});
    body=`<div class="notice-w">${ic('users-three','s16')}<span><b>Mariana incluiu 2 destas preventivas na OS 1042 há 1 minuto.</b> Sobrou 1 para você decidir.</span></div>
    <div class="sec">${prevHead('Preventivas para fazer agora','1 de 3 ainda fora da OS')}<div class="plist">${ITEMS_C320.map(([n,w,v,t,r],i)=>i<2?`<div class="pk pv nock done2"><span class="okk">${ic('check','s12')}</span><span class="pt"><b>${n}</b><small>Já na OS 1042, por Mariana</small></span><span></span><span></span></div>`:pvRow(true,n,w,v,t,r)).join('')}</div></div>`;
    foot=`<div class="pf"><div class="bb">${btn('Adiar',{variant:'outline'})}${btn('Incluir a 1 na OS 1042',{icon:'plus',action:1})}</div></div>`;
  } else {
    head=pHead(V.c320,{...H320,phone});
    body=`<div class="notice-n">${ic('cloud-arrow-up','s16')}<span><b>Sem sinal agora.</b> As 3 preventivas vão para a OS 1042 quando voltar o sinal. Pode fechar a tela.</span></div>
    <div class="sec">${prevHead('Preventivas para fazer agora','3 na fila para enviar')}${pvList(ITEMS_C320)}</div>`;
    foot=`<div class="pf"><div class="bb">${btn('Desfazer',{variant:'outline'})}${btn('Na fila para enviar',{icon:'clock',disabled:1})}</div></div>`;
  }
  return phone?`<div class="sheet-ov"><div class="sheet">${head}<div class="sb">${body}</div>${foot}</div></div>`:drawer(`${head}<div class="pb">${body}</div>${foot}`);
}
const filterChips=()=>`<span class="hchips">${F.fchip('Todas as transportadoras',{menu:1})}${F.fchip('Todos os planos',{menu:1})}</span>`;
const pageMore=(n,shown,w)=>`<div class="more pg">Ver todas as ${n} ${w}${ic('caret-right','s14')}</div>`;
function stressGroups(s){
  const [o,w,n]=GROUPS_ALL;
  if(s==='sVol') return [{...o,count:'31',ids:VOL.over.ids(),more:'',pg:pageMore(31,8,'vencidas')},{...w,count:'47',ids:VOL.week.ids(),more:'',pg:pageMore(47,8,'desta semana')},{...n,count:'180',ids:VOL.next.ids(),more:'',pg:pageMore(180,8,'próximas')}];
  return [{...o,count:'3',ids:LONG.over,more:''},{...w,count:'2',ids:LONG.week,more:''},{...n,count:'3',ids:LONG.next,more:''}];
}
const stressHero=s=>s==='sVol'
  ?`<div class="hero slim"><span class="big">38</span><div class="tx"><h2>preventivas vencidas</h2><p>em <b>31 veículos</b>, <b>6</b> já no pátio</p></div>${filterChips()}</div>`
  :`<div class="hero slim"><span class="big">5</span><div class="tx"><h2>preventivas vencidas</h2><p>em <b>3 veículos</b>, <b>0</b> no pátio</p></div>${segView('Por veículo')}</div>`;
const SELS={sLong:'rt9',sBig:'c320',sConc:'c320',sOff:'c320'};
function stressWeb(s,dev){
  const gsx=stressGroups(s==='sVol'?'sVol':'sLong');
  const col=g=>`<section class="cl">${colHead(g)}<div class="cards">${g.ids.map(id=>card(id,SELS[s])).join('')}${g.pg||''}</div></section>`;
  const gx=s==='sBig'||s==='sConc'||s==='sOff'?gs():gsx;
  const colsHtml=s==='sBig'||s==='sConc'||s==='sOff'?gx.slice(0,3).map(g=>column(g,'c320')).join(''):gx.map(col).join('');
  return `<div class="bd ${dev==='webs'?'s':''}">${s==='sVol'||s==='sLong'?stressHero(s):slim()}<div class="cols">${colsHtml}</div>${s==='sVol'?'':stressDrawer(s,0)}</div>`;
}
function stressList(s){
  const gx=s==='sVol'?stressGroups('sVol'):s==='sLong'?stressGroups('sLong'):gs();
  const sel=SELS[s];
  const rows=gx.map(g=>lsub(g)+g.ids.slice(0,s==='sVol'?4:9).map(id=>lrow(id,sel)).join('')+(s==='sVol'?`<div class="lpg">${pageMore(g.count,4,'')}</div>`:'')).join('');
  const lt=listTop({tab:'Todas'}).replace(/\[\['Todas',17\]/,'').replace('>17<','>'+(s==='sVol'?'260':'17')+'<');
  return `<div class="lv">${lt}<div class="fx-wolist llist">${rows}</div></div></div></div>${s==='sVol'?'':stressDrawer(s,0)}</div>`;
}
function stressPhone(s,list){
  const gx=s==='sVol'?stressGroups('sVol'):s==='sLong'?stressGroups('sLong'):gs();
  const sel=SELS[s];
  const over=gx[0];
  const cards=over.ids.slice(0,s==='sVol'?6:9).map(id=>list?lcard(id,sel):card(id,sel)).join('')+(s==='sVol'?`<div class="more pg">Ver mais 25${ic('caret-down','s14')}</div>`:'');
  const tabsTxt=s==='sVol'?['31','47','180']:[N().over,N().week,9];
  const top=list?`<div class="fx-mlist"><div class="fx-msticky"><div class="fx-msearch"><span class="fx-searchf" style="flex:1;height:44px;font-size:14px">${ic('magnifying-glass','s16')}<span class="trunc2">Buscar placa, frota ou conjunto</span></span></div><div class="fx-mtabs">${[['Vencidas',tabsTxt[0],'d'],['Esta semana',tabsTxt[1],'w'],['Próximas',tabsTxt[2],'']].map(([t,n,c],i)=>`<span class="${i===0?'on':''}">${t}<b class="${c}">${n}</b></span>`).join('')}</div></div><div class="fx-mcards">${cards}</div><div style="height:72px"></div></div>`
    :`<div class="ph-wrap"><div class="hero slim"><span class="big">${s==='sVol'?38:5}</span><div class="tx"><h2>preventivas vencidas</h2><p>em <b>${s==='sVol'?31:3} veículos</b></p></div></div><div class="stick"><div class="seg3" role="tablist">${[['Vencidas',tabsTxt[0],'d'],['Semana',tabsTxt[1],'w'],['Próximas',tabsTxt[2],'']].map(([l,n,t],i)=>`<span class="${i===0?'on':''}" role="tab">${l}<b class="${t}">${n}</b></span>`).join('')}</div></div><div class="cards">${cards}</div></div>`;
  return top+(s==='sVol'?'':stressDrawer(s,1));
}

function web(s,dev){if(STRESS[s])return stressWeb(s,dev);KITOPEN=s==='kitopen';
  const small=dev==='webs';
  if(s==='loading') return skBoard();
  PICK=s==='multi'||s==='multisched';
  if(s==='first'||s==='noperm') return `<div class="bd ${small?'s':''}">${emptyBlock(s)}</div>`;
  if(s==='nores') return `<div class="bd ${small?'s':''}"><div class="hero slim"><div class="tx"><h2>Busca na Base Curitiba</h2></div>${searchOn()}</div>${emptyBlock('nores')}</div>`;
  if(s==='byservice'){const [o,w,n]=GROUPS_ALL;return `<div class="bd ${small?'s':''}"><div class="hero slim"><span class="big">5</span><div class="tx"><h2>preventivas vencidas</h2><p>em <b>4 serviços</b></p></div>${segView('Por serviço')}</div><div class="cols">${svcColumn(o,'over')}${svcColumn(w,'week')}${svcColumn(n,'next')}</div>${svcDrawer()}</div>`;}
  DONE=s==='done';const [over,week,next]=gs();
  if(s==='empty') return `<div class="bd ${small?'s':''}">${slim({empty:1})}<div class="cols">${column(over,null,'Nada vencido')}${column(week,null,'Nada vence esta semana')}${column({...next,count:'9 veículos'},null)}</div></div>`;
  DONE=s==='done';const sel=s==='done'?null:s==='schedule'?'dly':isVisit(s)?'c320':null;
  const dr=s==='schedule'?drawer(`${pHead(V.dly,HDLY)}<div class="pb">${scheduleBody()}</div>${scheduleFoot()}`)
    :isVisit(s)?visitDrawer(s,0):'';
  const top=s==='error'?errNote():'';
  const hero=s==='sap'?slim().replace(nokm(),sapChip()):slim().replace(nokm(),segView('Por veículo')+nokm());
  const md=s==='multisched'?multiDrawer(0):'';
  return `<div class="bd ${small?'s':''}">${hero}${top}<div class="cols">${column(over,sel)}${column(week,sel)}${column(next,sel)}</div>${dr}${md}${s==='multi'?selBar():''}</div>`;
}

/* ---------- phone: sticky tabs, one list at a time; the overdue count stays in the first tab ---------- */
const tabs=on=>`<div class="seg3" role="tablist">${[['over','Vencidas',N().over,'d'],['week','Semana',N().week,'w'],['next','Próximas','9','']].map(([k,l,n,t])=>`<span class="${k===on?'on':''}" role="tab">${l}<b class="${t}">${n}</b></span>`).join('')}</div>`;
function phone(s){if(STRESS[s])return stressPhone(s,0);KITOPEN=s==='kitopen';DONE=s==='done';PICK=null;
  if(s==='first'||s==='noperm') return `<div class="ph-wrap">${emptyBlock(s,1)}</div>`;
  if(s==='nores') return `<div class="ph-wrap">${searchOn()}${emptyBlock('nores',1)}</div>`;
  if(s==='loading') return `<div class="ph-wrap"><div class="hero slim"><span class="sk" style="width:40px;height:40px;border-radius:12px"></span><span class="sk" style="width:200px;height:18px"></span></div><span class="sk" style="width:100%;height:44px;border-radius:12px"></span>${[1,2,3,4].map(()=>`<div class="cd sk-cd"><span class="sk" style="width:55%;height:15px"></span><span class="sk" style="width:80%;height:12px;margin-top:10px"></span></div>`).join('')}</div>`;
  if(s==='empty') return `<div class="ph-wrap"><div class="hero slim"><span class="halo sm">${ic('calendar-check','s20')}</span><div class="tx"><h2>Frota em dia esta semana</h2><p>A próxima é a revisão B do C-044, na qui 10/12.</p></div></div><div class="stick">${tabs('next').replace('<b class="d">3</b>','<b>0</b>').replace('<b class="w">3</b>','<b>0</b>')}</div><div class="cards">${GROUPS_ALL[2].ids.map(id=>card(id,null)).join('')}<div class="more">${GROUPS_ALL[2].more}${ic('caret-down','s14')}</div></div></div>`;
  DONE=s==='done';const sel=s==='list'||s==='error'?null:s==='schedule'?'dly':'c320';
  const list=`<div class="ph-wrap">${s==='error'?errNote():''}<div class="hero slim"><span class="big">${N().big}</span><div class="tx"><h2>preventivas vencidas</h2><p>em <b>${N().veh} veículos</b>, <b>${N().yard}</b> já no pátio</p></div></div><div class="stick">${tabs('over')}</div><div class="cards">${gs()[0].ids.map(id=>card(id,sel)).join('')}</div>${nokm()}</div>`;
  if(s==='list'||s==='error') return list;
  const sheet=s==='schedule'
    ?`<div class="sheet-ov"><div class="sheet">${pHead(V.dly,{...HDLY,phone:1})}<div class="sb">${scheduleBody()}</div>${scheduleFoot()}</div></div>`
    :visitDrawer(s,1);
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
  c320d:{pos:'Cavalo QRT4B22',where:'No pátio, OS 1042',sub:'em 2 dias',act:'Incluir na OS'},
  c072:{pos:'Cavalo QRT5F80',where:'Rodando, 580 km/dia',sub:'em 11 dias',act:'Agendar'},
  q9b:{pos:'Cavalo, frota 833',where:'Rodando, 600 km/dia',sub:'em 13 dias',act:'Agendar'},
  c044:{pos:'Cavalo QRT2E55',where:'Rodando, 610 km/dia',sub:'em 14 dias',act:'Agendar'},
  q6h:{pos:'Cavalo, frota 841',where:'Rodando, 520 km/dia',sub:'em 19 dias',act:'Agendar'},
  rtf:{pos:'1ª carreta RTF2D10',where:'Rodando',sub:'em 22 dias',act:'Agendar'},
  srt:{pos:'Carreta',where:'Sem leitura desde 12/10',sub:'sem km',act:'Informar km'},
  rtc:{pos:'Carreta',where:'Salto de 9.800 km em um dia',sub:'a conferir',act:'Conferir km'},
};
const dotSep='<span class="fx-dot"></span>';
function lrow(id,sel){const v=V[id],m=LM[id];const pk=PICK&&MULTI.includes(id);const more=/^\+\d/.test(v.more)?`${dotSep}<span class="nw">${v.more}</span>`:'';
  return `<div class="fx-aprow lrow ${sel===id?'on':''} ${pk?'picked':''}" role="button" tabindex="0">
    <div class="m"><div class="l1">${PICK?cbx(PICK&&MULTI.includes(id)):''}<b class="nm">${v.name}</b>${mark(v.parts)}<span class="trunc2">${v.svc}</span>${v.tag?'<span class="tag">adiada · falta peça</span>':''}</div>
      <div class="l2"><span class="nw">${m.pos}</span>${more}${dotSep}<span class="trunc2">${m.where}</span></div></div>
    <div class="apst"><b class="${v.t||'n'}">${v.when.replace('venceu há ','')}</b><span>${m.sub}</span></div>
    <div class="apss">${btn(m.act,{variant:'secondary',size:'sm'})}</div>
    ${ic('caret-right','s16 car')}</div>`;}
const lsub=g=>`<div class="lsub"><span class="gt ${g.tone}">${ic(g.icon,'s14')}</span><b>${g.title}</b><span class="n">${g.count}</span></div>`;
const LTABS=[['Todas',17],['Vencidas',3],['Esta semana',3],['Próximas',9],['Sem km',2]];
function listTop(o={}){
  const head=F.pageHeader('Agenda','O que trazer para a oficina, e quando.',`${F.fchip('Base Curitiba',{menu:1})}${btn('Ver planos',{variant:'outline',icon:'list-checks'})}`);
  const kpi=`<div class="fx-kpi4">${[['Vencidas',o.zero?0:5,'d'],['Vencem esta semana',4,'w'],['Próximas semanas',14,''],['Sem km',2,'']].map(([l,v,t])=>`<div><p>${l}</p><b class="k${v?t:''}">${v}</b></div>`).join('')}</div>`;
  const tools=`<div class="ltools">${F.search('Buscar placa, frota ou conjunto',{width:340})}${F.fchip('Todas as transportadoras',{menu:1})}${F.fchip('Todos os planos',{menu:1})}</div>`;
  return head+`<div class="lstack"><div class="lstack s">${F.dtabs([['Todas',17-(DONE?0:0)],['Vencidas',N().over],['Esta semana',N().week],['Próximas',9],['Sem km',2]],o.tab||'Todas')}${tools}`;
}
function listWeb(s){if(STRESS[s])return stressList(s);KITOPEN=s==='kitopen';DONE=s==='done';PICK=s==='multi'||s==='multisched';
  if(s==='first'||s==='noperm') return `<div class="lv">${F.pageHeader('Agenda','O que trazer para a oficina, e quando.','')}${emptyBlock(s)}</div>`;
  DONE=s==='done';const sel=s==='schedule'?'dly':isVisit(s)?'c320':null;
  let body;
  if(s==='loading') body=`<div style="display:flex;flex-direction:column;gap:8px">${[1,2,3,4,5].map(()=>F.sk('100%',64)).join('')}</div>`;
  else if(s==='nores') body=emptyBlock('nores');
  else if(s==='empty') body=`<div class="lempty">${F.empty({icon:'calendar-check',title:'Nada vencido',hint:'Uma preventiva aparece aqui quando passa do prazo. A próxima vence sáb 28/11, na revisão A do C-118.',action:btn('Ver esta semana',{variant:'outline'})})}</div>`;
  else body=`<div class="fx-wolist llist">${gs().map(g=>lsub(g)+g.ids.map(id=>lrow(id,sel)).join('')).join('')}</div>${btn('Carregar mais',{variant:'outline'}).replace('fx-btn','fx-btn lmore')}`;
  const dr=s==='schedule'?drawer(`${pHead(V.dly,HDLY)}<div class="pb">${scheduleBody()}</div>${scheduleFoot()}`)
    :isVisit(s)?visitDrawer(s,0):'';
  const lt=listTop({tab:s==='empty'?'Vencidas':'Todas',zero:s==='empty'});
  const top=(s==='nores'?lt.replace(F.search('Buscar placa, frota ou conjunto',{width:340}),searchOn()):s==='sap'?lt.replace('<div class="ltools">','<div class="ltools">'+sapChip()):lt);
  return `<div class="lv">${top}${s==='error'?errNote():''}${body}</div></div></div>${dr}${s==='multisched'?multiDrawer(0):''}${s==='multi'?selBar():''}</div>`;
}
function lcard(id,sel){const v=V[id],m=LM[id];
  return `<button type="button" class="fx-wocard lcard ${sel===id?'on':''}"><span class="l1"><b class="nm">${v.name}</b>${mark(v.parts)}<span style="flex:1"></span><span class="lwhen ${v.t}">${v.when}</span></span>
    <span class="l3">${v.svc}${v.tag?' <span class="tag">adiada · falta peça</span>':''}</span><span class="l4"><span class="trunc2">${m.pos}${/^\+\d/.test(v.more)?' · '+v.more:''}</span></span>
    <span class="ft"><span class="trunc2 lwhere">${m.where}</span><span style="flex:1"></span><span class="lact">${m.act}${ic('caret-right','s14')}</span></span></button>`;}
function listPhone(s){if(STRESS[s])return stressPhone(s,1);KITOPEN=s==='kitopen';DONE=s==='done';PICK=null;
  if(s==='first'||s==='noperm') return `<div class="fx-mlist"><div class="fx-mcards">${emptyBlock(s,1)}</div></div>`;
  const tabsM=on=>`<div class="fx-mtabs">${[['Vencidas',N().over,'d'],['Esta semana',N().week,'w'],['Próximas',9,''],['Sem km',2,'']].map(([t,n,c])=>`<span class="${t===on?'on':''}">${t}<b class="${c}">${n}</b></span>`).join('')}</div>`;
  const search=`<div class="fx-msearch"><span class="fx-searchf" style="flex:1;height:44px;font-size:14px">${ic('magnifying-glass','s16')}<span class="trunc2">Buscar placa, frota ou conjunto</span></span><span class="fx-btn outline icon" style="height:44px;width:44px">${ic('sliders-horizontal','s20')}</span></div>`;
  let body;
  if(s==='loading') body=[1,2,3].map(()=>`<div class="fx-wocard sk">${F.sk('40%',16)}${F.sk('60%',22)}${F.sk('100%',36)}${F.sk('100%',28)}</div>`).join('');
  else if(s==='empty') body=F.empty({icon:'calendar-check',title:'Nada vencido',hint:'A próxima vence sáb 28/11, na revisão A do C-118.'});
  else if(s==='first'||s==='noperm'||s==='nores') body=emptyBlock(s,1);
  if(s==='error') body=errNote()+gs()[0].ids.map(id=>lcard(id,null)).join('');
  DONE=s==='done';const sel=s==='schedule'?'dly':isVisit(s)?'c320':null;
  if(!body) body=gs()[0].ids.map(id=>lcard(id,sel)).join('');
  const list=`<div class="fx-mlist"><div class="fx-msticky">${s==='nores'?`<div class="fx-msearch">${searchOn()}</div>`:search}${tabsM('Vencidas').replace(s==='empty'?'<b class="d">3</b>':'@@','<b>0</b>')}</div><div class="fx-mcards">${body}</div><div style="height:72px"></div></div>`;
  if(!isVisit(s)&&s!=='schedule') return list;
  return list+(s==='schedule'
    ?`<div class="sheet-ov"><div class="sheet">${pHead(V.dly,{...HDLY,phone:1})}<div class="sb">${scheduleBody()}</div>${scheduleFoot()}</div></div>`
    :visitDrawer(s,1));
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
Object.assign(LM,{
  rt9:{pos:'Cavalo QRT1Z99',where:'Base Três Lagoas, Unidade Florestal Norte · Transportadora Rodoviária Irmãos Albuquerque de Mato Grosso do Sul',sub:'1.284.330 km no painel',act:'Agendar'},
  e9:{pos:'Dolly sem placa',where:'Base Três Lagoas, Unidade Florestal Norte',sub:'nunca feita',act:'Agendar'},
  km7:{pos:'Cavalo, frota 9001',where:'Rodando, 1.020 km/dia',sub:'1.004.880 km no painel',act:'Agendar'},
  wk3:{pos:'Cavalo QRT4C77',where:'Rodando, 700 km/dia',sub:'dom 29/11',act:'Agendar'},
  yr1:{pos:'Cavalo QRT9Z01',where:'Rodando, 300 km/dia',sub:'nov/2027',act:'Agendar'},
  nob:{pos:'Cavalo, sem base definida',where:'Sem base definida',sub:'em 14 dias',act:'Definir base'},
});
const R={a320:()=>phone('sBig'),a720:()=>phone('sLong'),ag:(s,dev)=>web(s,dev),phl:()=>phone('list'),phs:(s)=>{clean('phs');setTimeout(lift);return phone(s);},lg:(s)=>listWeb(s),lpl:()=>listPhone('list'),lps:(s)=>{clean('lps');setTimeout(lift);return listPhone(s);}};
function boot(){patchNav();F.bind(R);lift();views();themes();
  document.querySelectorAll('.states button').forEach(b=>b.addEventListener('click',()=>setTimeout(lift)));
  let t;window.addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(fit,120);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot));else setTimeout(boot);
})();
