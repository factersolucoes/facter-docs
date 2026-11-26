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
  c320:{name:'C-320',full:'Conjunto C-320',sub:'Cavalo QRT4B22 e 3 carretas',parts:[['QRT4B22','cav',''],['RTF6K38','car',''],['RTE1J77','car','d'],['SRK9H46','car','']],svc:'Preventiva carreta 40 mil',more:'+2 preventivas',when:'venceu há 1.850 km',t:'d'},
  dly:{name:'DLY1J07',full:'Cavalo DLY1J07',sub:'Frota 812, transportadora JSL',parts:[['DLY1J07','cav','d']],svc:'Revisão 60 mil',more:'',when:'venceu há 4.300 km',t:'d'},
  c207:{name:'C-207',full:'Conjunto C-207',sub:'Cavalo QRT9D14 e 2 carretas',parts:[['QRT9D14','cav',''],['RTC3B19','car','d'],['RTC3B20','car','']],svc:'Inspeção semanal do conjunto',more:'',when:'venceu há 3 dias',t:'d'},
  c118:{name:'C-118',parts:[['QRT7C10','cav','w'],['RTB2A41','car',''],['RTB2A42','car','']],svc:'Inspeção semanal do conjunto',more:'',when:'sáb 28/11',t:'w'},
  q1a:{name:'QRT1A09',parts:[['QRT1A09','cav','w']],svc:'Preventiva 20 mil',more:'',when:'dom 29/11',t:'w'},
  rta:{name:'RTA4A44',parts:[['RTA4A44','car','w']],svc:'Lubrificação carreta 15 dias',more:'',when:'dom 29/11',t:'w'},
  c072:{name:'C-072',parts:[['QRT5F80','cav',''],['RTG1H22','car','']],svc:'Munck 250 h',more:'',when:'seg 07/12',t:''},
  q9b:{name:'QRT9B71',parts:[['QRT9B71','cav','']],svc:'Preventiva 20 mil',more:'',when:'qua 09/12',t:''},
  c320d:{name:'C-320',parts:[['QRT4B22','cav','w'],['RTF6K38','car',''],['RTE1J77','car',''],['SRK9H46','car','']],svc:'Troca de óleo e filtros',more:'',when:'sáb 28/11',t:'w',tag:1},
  c044:{name:'C-044',parts:[['QRT2E55','cav',''],['RTD8F12','car',''],['RTD8F13','car','']],svc:'Revisão 60 mil',more:'',when:'qui 10/12',t:''},
  q6h:{name:'QRT6H33',parts:[['QRT6H33','cav','']],svc:'Verificação do cronotacógrafo',more:'',when:'ter 15/12',t:''},
  rtf:{name:'RTF2D10',parts:[['RTF2D10','car','']],svc:'Lubrificação carreta 15 dias',more:'',when:'sex 18/12',t:''},
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
const history=(title,rows)=>`<div class="sec hist">${secHead(title,'<span class="lk vt">Ver todas</span>')}<ol class="tl">${rows.map(([d,sv,os])=>`<li><span class="d">${d}</span><span class="s">${sv}</span><span class="o">${os}</span></li>`).join('')}</ol></div>`;
const foot=t=>`<p class="foot">${ic('clock-counter-clockwise','s14')}<span>${t}</span></p>`;
const TILE_IC={'Atraso':'clock-countdown','Peças':'package','Duração':'timer','Na OS':'wrench','Adiadas':'clock','Adiada':'clock','Vence':'calendar-blank','Leva':'timer','Veículos':'truck','Lonas':'disc','Molas':'columns'};
function tiles(o){let where='';
  if(o.status){const m=o.status.match(/class="spill (\w)"[\s\S]*<\/span>([^<]+)<\/span>\s*$/);if(m){const txt=m[2].trim().replace(/ aberta$/,'');const road=o.status.includes('road-horizon');
    where=`<div class="wcard"><span class="wci">${ic(road?'road-horizon':'garage','s16')}</span>${(()=>{const mm=txt.match(/^(.*?) desde (.*?) · (OS \d+)$/);const main=mm?`${mm[1]} · ${mm[3]}`:txt;const sub=mm?`desde ${mm[2]}${mm[2]==='ontem'?' às 14h':''}`:'';return `<span class="tlab"><small>Onde está</small><b>${main.replace(/OS (\d)/,'OS&nbsp;$1')}</b>${sub?`<small class="wsub">${sub}</small>`:''}</span>`;})()}${/OS \d/.test(txt)?'<span class="lk wca">Abrir OS ›</span>':''}</div>`;}}
  const out=(o.metrics||[]).map(([l,v,t])=>[l,v,t||(l==='Duração'?'p':''),TILE_IC[l]||'info']);
  return `<div class="tiles2">${where}<div class="tiles3">${out.map(([l,v,t,i])=>`<div class="tile"><span class="tic">${ic(i,'s16')}</span><span class="tlab"><small>${l}</small><b class="${t}">${String(v).replace(/(\d) (km|h|min)/g,'$1&nbsp;$2')}</b></span></div>`).join('')}</div></div>`;}
function pHead(v,o={}){return `<div class="phd">${o.phone?'<div class="grab"></div>':''}<div class="ph">${o.back?`<span class="xb back" role="button" aria-label="Voltar">${ic('arrow-left','s16')}</span>`:''}<div class="t"><h2>${o.title||v.full}</h2><p>${mark(v.parts)}${o.sub||v.sub}</p></div>${o.back?'':`<span class="xb" role="button" aria-label="Fechar">${ic('x','s16')}</span>`}</div>${o.src?`<p class="src">${ic('arrows-left-right','s14')}${o.src}</p>`:''}${o.status||o.metrics?tiles(o):''}</div>`;}
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
  ${open?`<div class="pnest prlist">${partRows(k.parts)}</div>`:''}`;}
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
  return partsBox(dropOil?{items:4,ok:3,miss:1,kits:[K_LONA],loose:[GRAXA],off:'Kit troca de óleo fica para depois.'}:{items:8,ok:7,miss:1,kits:[K_LONA,K_OLEO],loose:[GRAXA]});
}
const kitsDly=()=>partsBox({items:4,ok:3,miss:1,mt:'d',kits:[{name:'Kit da Revisão 60 mil',loc:'Cavalo',locd:'cavalo',t:'d',parts:[['30 l','Óleo 15W40','','s'],['1','Filtro de óleo','','s'],['1','Filtro de ar','','d'],['1','Filtro de diesel','','s']]}]})+'<p class="ptotal">O pedido de compra do filtro de ar sai junto com o agendamento.</p>';
const kits044=()=>partsBox({items:5,ok:5,kits:[{name:'Kit da Revisão 60 mil',loc:'Cavalo',locd:'cavalo',t:'s',parts:[['30 l','Óleo 15W40','','s'],['1','Filtro de óleo','','s'],['1','Filtro de ar','','s'],['1','Filtro de diesel','','s']]}],loose:[['Graxa','1ª carreta','1 kg','s']]});
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
const REASONS=['Falta peça','Sem tempo agora','Conjunto vai sair','Sem mecânico','Outro'];
const WHENS=['Quando o conjunto vier de novo','Em 7 dias','Em 1.000 km','Escolher dia'];
const opts=(list,on)=>`<div class="opts" role="radiogroup">${list.map(c=>`<span class="op ${c===on?'on':''}" role="radio" aria-checked="${c===on}"><i></i>${c==='Escolher dia'?ic('calendar-blank','s14'):''}${c}</span>`).join('')}</div>`;
const deferAsk=(what)=>`<div class="defer"><div class="dh">${ic('clock-countdown','s16')}<div><b>${what||'As 3 ficam para depois'}</b><span>Conta como atraso</span></div></div>
  <div class="q"><span>Motivo</span>${opts(REASONS,'Falta peça')}</div>
  <div class="q"><span>Lembrar de novo</span>${opts(WHENS,'Quando o conjunto vier de novo')}</div></div>`;
function visitBodyM(m){
  const tail=`${kits320(m)}
  ${history('Últimas manutenções deste conjunto',[['27/10','Lubrificação geral','OS 0998'],['02/09','Troca de óleo e filtros','OS 0954'],['12/05','Lona de freio na 2ª carreta, eixo 3','OS 0871']])}`;
  if(m==='done') return `<div class="done"><span class="halo sm">${ic('check-circle','s24')}</span><div class="dtx"><b>2 preventivas na OS 1042</b><p>1 adiada por falta de peça. Volta quando o conjunto vier de novo.</p></div><span class="undo">Desfazer <i>10 s</i></span></div>
  <div class="sec">${secHead('Na OS 1042',count(2))}<div class="ilist">${ITEMS_C320.slice(0,2).map(([n,w])=>`<div class="ii dn"><span class="okk">${ic('check','s12')}</span><span class="ib"><b>${n}</b><span class="iw">${w}</span></span></div>`).join('')}</div></div>
  <p class="dnote">${ic('info','s16')}<span>Mudou de ideia depois? Na OS, cada preventiva tem <b>Tirar da OS</b> no menu do serviço. Ela volta para a agenda como não feita, sem contar como adiada.</span></p>
  <div class="sec">${secHead('Adiada',count(1))}<div class="ilist"><div class="ii dn"><span class="ib"><span class="it1"><b>Troca de óleo e filtros</b><span class="tag">adiada · falta peça</span></span><span class="iw">No cavalo</span><span class="ir">Volta quando o conjunto vier de novo.</span></span></div></div></div>`;
  if(m==='allDefer') return `<div class="sec">${secHead('Adiar as 3 preventivas')}<div class="ilist">${ITEMS_C320.map(([n,w,v,t])=>`<div class="ii dn"><span class="ib"><span class="it1"><b>${n}</b><span class="tp sm ${t}">${v}</span></span><span class="iw">${w}</span></span></div>`).join('')}</div></div>${deferAsk('')}`;
  if(m==='left') return `<div class="sec">${prevHead('Preventivas para marcar','3 preventivas',OVERCHIP)}<div class="plist">${ITEMS_C320.map(ckItem(()=>true)).join('')}</div></div>${tail}`;
  if(m==='closed') return `<div class="notice-w">${ic('warning','s16')}<span><b>A OS 1042 foi concluída por Carlos às 14h52.</b> Sua escolha continua aqui: abra uma OS nova ou marque um dia.</span></div>
  <div class="sec">${prevHead('Preventivas para fazer agora','2 de 3 marcadas',OVERCHIP)}<div class="plist">${ITEMS_C320.map(ckItem(i=>i<2)).join('')}</div><p class="dl2"><b>1 fica para depois:</b> Troca de óleo e filtros, por falta de peça. Volta quando o conjunto vier de novo.</p></div>${tail}`;
  const on=i=>m==='all'||m==='sap'?true:m==='none'?false:i<2;
  const lede=m!=='all'&&m!=='sap'?'Marque o que dá para fazer enquanto o conjunto está parado.':'Venceram ou vencem logo. Dá para fazer todas enquanto o conjunto está parado.';
  return `<div class="sec">${prevHead('Preventivas para fazer agora',m==='one'?'2 de 3 marcadas':m==='none'?'Nenhuma marcada':'3 preventivas',OVERCHIP)}<div class="plist">${ITEMS_C320.map(ckItem(on)).join('')}</div>
  ${m==='one'?deferAsk('Troca de óleo e filtros fica para depois'):''}</div>${tail}`;
}
function visitFootM(m){
  if(m==='sap') return `<div class="pf"><p class="sapn">${ic('arrows-left-right','s14')}<span>Adiar e marcar dia ficam no SAP · <span class="lk">ver ordem 4000131</span></span></p>${btn('Incluir as 3 na OS 1042',{icon:'plus',action:1})}</div>`;
  if(m==='left') return `<div class="pf"><div class="bb">${btn('<span>Adiar<span class="lgx"> todas</span></span>',{variant:'outline'})}${btn('Marcar dia na oficina',{icon:'calendar-check',action:1})}</div></div>`;
  if(m==='closed') return `<div class="pf"><div class="bb">${btn('Marcar dia na oficina',{variant:'outline'})}${btn('Abrir OS nova com as 2',{icon:'plus',action:1})}</div></div>`;
  if(m==='done') return `<div class="pf"><div class="bb">${btn('Fechar',{variant:'outline'})}${btn('Abrir a OS 1042',{icon:'arrow-square-out',action:1})}</div></div>`;
  if(m==='allDefer') return `<div class="pf"><div class="bb">${btn('Voltar',{variant:'outline'})}${btn('Adiar as 3',{icon:'clock-countdown',action:1})}</div></div>`;
  const n=m==='one'?2:3;
  return `<div class="pf"><div class="bb">${btn('<span>Adiar<span class="lgx"> todas</span></span>',{variant:'outline'})}${m==='none'?btn('Escolha o que fazer agora',{disabled:1}):btn(`Incluir as ${n} na OS 1042`,{icon:'plus',action:1})}</div></div>`;
}
/* =====================================================================
   Interactive drawer for C-320: one shared state, every C-320 drawer on the
   page re-renders from it. Toggle, defer with smart defaults, adiar todas,
   confirm, undo for 10 s, close and reopen from the card.
   ===================================================================== */
const IXS={visit:'all',kitopen:'all',pick:'none',defer1:'one',deferall:'allDefer',done:'done'};
/* packages: the plan's revisions, each with its services and their parts */
/* packages: the company's own name; meaning comes from the trigger and the due status, both from data */
const trig=t=>t.text||[t.km?`${(t.km/1000).toLocaleString('pt-BR')} mil km`:'',t.days?(t.days%30===0&&t.days>=60?`${t.days/30} meses`:`${t.days} dias`):'',t.hours?`${t.hours} horas de motor`:''].filter(Boolean).join(' ou ').replace(/^/,'a cada ')+(([t.km,t.days,t.hours].filter(Boolean).length>1)?', o que vier primeiro':'')+(t.reg?` (${t.reg})`:'');
const PKGS=[
  {id:'b',veh:'2ª carreta RTE1J77',where:'2ª carreta',name:'Preventiva carreta 40 mil',trigger:{km:40000,days:120},due:'Venceu há 1.850 km',t:'d',svcs:[
    {n:'Rolamentos de cubo',min:60,parts:[['6','retentores','1 por cubo']]},
    {n:'Lonas de freio, eixos 1 a 3',min:70,parts:[['12','lonas','2 por lado'],['24','molas de retorno','4 por lado'],['2','jogos de rebites','1 por lado','w']]},
    {n:'Torque das rodas',min:20,parts:[]},
    {n:'Buchas da suspensão',min:40,parts:[['4','buchas','']]}]},
  {id:'l',veh:'2ª carreta RTE1J77',where:'2ª carreta',name:'Lubrificação carreta 15 dias',trigger:{days:15,km:5000},due:'Vence hoje',t:'w',svcs:[
    {n:'Graxa nos balancins e mancal',min:30,parts:[['1 kg','de graxa']]},
    {n:'Quinta roda e pino-rei',min:20,parts:[['0,5 kg','de graxa']]}]},
  {id:'a',veh:'Cavalo QRT4B22',where:'cavalo',name:'Preventiva 20 mil',trigger:{km:20000,days:90},due:'Vence em 1.200 km',t:'',svcs:[
    {n:'Óleo e filtros do motor',min:40,parts:[['38 l','de óleo 15W40'],['1','filtro de óleo']]},
    {n:'Filtro separador de água',min:15,parts:[['1','filtro separador']]},
    {n:'Drenar reservatórios de ar',min:15,parts:[]}]},
];
const defReason=(p,i)=>p.id==='b'&&(i===undefined||i===1)?'Falta peça':'Sem tempo agora';
const G={inside:null,menu:null,on:{},open:{},parts:{},def:{},edit:null,all:0,prevSel:null,done:0,undo:0,closed:0};
const allOn=()=>Object.fromEntries(PKGS.map(p=>[p.id,p.svcs.map(()=>1)]));
function setG(s){const m=IXS[s];const on=allOn();
  if(m==='none'||m==='allDefer') PKGS.forEach(p=>on[p.id]=p.svcs.map(()=>0));
  if(m==='one'||m==='done') on.a=on.a.map(()=>0);
  Object.assign(G,{inside:null,menu:null,on,open:{b:1},parts:s==='kitopen'?{b:1}:{},def:{},edit:null,all:m==='allDefer'?1:0,prevSel:m==='allDefer'?allOn():null,done:m==='done'?1:0,undo:m==='done'?10:0,closed:0});
  if(G.done)startUndo();}
const fmtDur=m=>m?`${Math.floor(m/60)} h${m%60?' '+m%60:''}`.replace(/^0 h /,'')+(m<60?' min':''):'0 h';
const pkOn=p=>G.on[p.id].filter(Boolean).length;
const pkState=p=>{const n=pkOn(p);return n===p.svcs.length?'on':n===0?'off':'tri';};
const totMin=()=>PKGS.reduce((a,p)=>a+p.svcs.reduce((b,sv,i)=>b+(G.on[p.id][i]?sv.min:0),0),0);
const svcsOn=()=>PKGS.reduce((a,p)=>a+pkOn(p),0);
const pkgsOn=()=>PKGS.filter(p=>pkOn(p)>0).length;
const lackOn=()=>G.on.b&&G.on.b[1];
const defOf=k=>G.def[k]||{reason:k.length===1?defReason(PKGS.find(p=>p.id===k)):defReason(PKGS.find(p=>p.id===k[0]),+k.split('.')[1]),when:'Na próxima parada'};
const WHENS2=['Na próxima parada','Em 7 dias','Em 1.000 km','Escolher dia'];
const WHY={'Falta peça':'por falta de peça','Sem tempo agora':'por falta de tempo','Conjunto vai sair':'porque o conjunto vai sair','Sem mecânico':'por falta de mecânico','Outro':'por outro motivo'};
const BACK={'Na próxima parada':'Volta na próxima parada.','Em 7 dias':'Volta em 7 dias.','Em 1.000 km':'Volta em 1.000 km.','Escolher dia':'Volta no dia escolhido.'};
const defSentence=k=>{const d=defOf(k);return `Adiada ${WHY[d.reason]}. ${BACK[d.when]||`Volta ${d.when.toLowerCase()}.`}`;};
const cb3=st=>`<i class="cbx ${st==='on'?'on':st==='tri'?'tri':''}">${st==='on'?ic('check','s14'):st==='tri'?'<b class="dash"></b>':''}</i>`;
let RPH=false; /* rendering the phone sheet */
const RICON={'Falta peça':'package','Sem tempo agora':'clock','Conjunto vai sair':'road-horizon','Sem mecânico':'users-three','Outro':'dots-three'};
const CAL=[['sex','27/11'],['sáb','28/11'],['seg','30/11'],['ter','01/12'],['qua','02/12'],['qui','03/12'],['sex','04/12'],['sáb','05/12']];
const STOP='2026-12-11';
const ddmm=day=>`${day.slice(8,10)}/${day.slice(5,7)}`;
function menuHtml(k,kind){const d=defOf(k);
  if(kind==='w'||kind==='cal'){const isDate=/^Em \d\d\/\d\d/.test(d.when);
    const tileW=(on,icn,l,v,act)=>`<button type="button" class="wtile ${on?'on':''}" aria-pressed="${on}" ${act}><b>${ic(icn,'s14')}${l}</b><span>${v}</span></button>`;
    const tl=`<div class="wtiles">${tileW(d.when==='Na próxima parada','calendar-check','Na próxima parada','sex 11/12',`data-ixa="w:${k}:Na próxima parada"`)}${tileW(d.when==='Em 7 dias','clock','Em 7 dias','qui 03/12',`data-ixa="w:${k}:Em 7 dias"`)}${tileW(isDate,'calendar-blank','Outra data',isDate?d.when.slice(3):'escolher no calendário',`data-ixa="m:${k}:cal"`)}${tileW(d.when==='Em 1.000 km','road-horizon','Em 1.000 km','pelo km rodado',`data-ixa="w:${k}:Em 1.000 km"`)}</div>`;
    const cm=G.cm||0, mo=12+cm, yr=2026+Math.floor((mo-1)/12), mm=((mo-1)%12)+1;
    const val=isDate?`2026-${d.when.slice(6,8)}-${d.when.slice(3,5)}`:null;
    const cal=kind==='cal'?`<div class="mcalw">${F.monthCal({year:yr,month:mm,value:val,today:'2026-11-26',min:'2026-11-27',marked:{day:STOP,label:'próxima parada agendada'},act:day=>`data-ixa="w:${k}:Em ${ddmm(day)}"`,nav:dir=>`data-ixa="cm:${k}:${dir}"`})}</div>`:'';
    return `<div class="mtitle">Quando lembrar de novo</div>${tl}${cal}`;}
  return `<div class="mtitle">Por que fica para depois</div>${REASONS.map(o=>{const on=o===d.reason;
    return `<div class="mopt ${on?'on':''}" role="${RPH?'radio':'menuitemradio'}" aria-checked="${on}" data-ixa="r:${k}:${o}">${RPH?`<i class="rd ${on?'on':''}"></i>`:''}${ic(RICON[o],'s16')}<span>${o}</span>${!RPH&&on?ic('check','s16 ck'):''}</div>`;}).join('')}`;}
const dpill=k=>{const d=defOf(k);const open=G.menu&&G.menu.startsWith(k+'|');const kind=open?G.menu.split('|')[1]:'';
  return `<span class="dpr"><span class="spl warn ${open&&kind==='r'?'on':''}" data-ixa="m:${k}:r" role="button" aria-haspopup="menu" tabindex="0">${ic(RICON[d.reason],'s14')}Adiada · ${d.reason.toLowerCase()}${ic('caret-down','s12')}</span><span class="spl ${open&&kind!=='r'?'on':''}" data-ixa="m:${k}:w" role="button" aria-haspopup="menu" tabindex="0">${ic('calendar-blank','s14')}${d.when}${ic('caret-down','s12')}</span>${open&&!RPH?`<span class="pop" role="menu">${menuHtml(k,kind)}</span>`:''}</span>`;};
const phoneMenu=()=>{if(!G.menu||!RPH)return '';const [k,kind]=G.menu.split('|');return `<div class="msheet-ov" data-ixa="m:-:-"><div class="msheet" role="dialog"><i class="grab"></i>${kind==='vi'?insideHtml(PKGS.find(p=>p.id===k)||PKG044.find(p=>p.id===k)):menuHtml(k,kind)}</div></div>`;};
function editor(k){const d=defOf(k);const pills=(list,cur,key)=>`<div class="pills">${list.map(r=>`<span class="pl ${r===cur?'on':''}" role="radio" aria-checked="${r===cur}" data-ixa="${key}:${k}:${r}">${r==='Escolher dia'?ic('calendar-blank','s14'):''}${r}</span>`).join('')}</div>`;
  return `<div class="ded"><div class="q"><span>Motivo</span>${pills(REASONS,d.reason,'r')}</div><div class="q"><span>Lembrar de novo</span>${pills(WHENS2,d.when,'w')}</div><div class="dr"><span data-ixa="e:-">${btn('Pronto',{variant:'outline',size:'sm'})}</span></div></div>`;}
function partsLine(p){const on=G.on[p.id];const parts=p.svcs.flatMap((sv,i)=>on[i]?sv.parts:[]);if(!parts.length)return '';
  const miss=parts.some(x=>x[3]==='w');const open=!!G.parts[p.id];
  return `<div class="pline" data-ixa="pp:${p.id}" role="button" tabindex="0" title="${esc(parts.map(([q,n])=>`${q} ${n}`).join(', '))}"><span class="pl1"><b>Peças:</b> ${miss?'<span class="w">falta 1 jogo de rebites, chega quinta</span>':'todas em estoque'}</span><span class="pmore">${open?'esconder':'ver as '+parts.length}</span>${ic('caret-down','s14 chev'+(open?' up':''))}</div>
  ${open?`<div class="pnest">${parts.map(([q,n,rule,t])=>`<div class="pn"><span class="q">${q}</span><span class="nm"><span>${n}</span>${rule?`<span class="m">${rule}</span>`:''}</span><span class="tg ${t||'s'}">${t==='w'?'falta 1, chega quinta':ic('check','s12')+'tem'}</span></div>`).join('')}</div>`:''}`;}
function pkgCard(p){const st=pkState(p), open=!!G.open[p.id], off=st==='off';
  const meta=[`${p.svcs.length} ${p.svcs.length>1?"serviços":"serviço"}`,'leva '+fmtDur(p.svcs.reduce((a,sv)=>a+sv.min,0))].join(' · ');
  const head=`<div class="pkh ${off?'off':''}"><span data-ixa="pc:${p.id}" role="checkbox" aria-checked="${st==='on'?'true':st==='tri'?'mixed':'false'}" tabindex="0" class="cbw">${cb3(st)}</span><span class="pkic">${ic(p.reg?'seal-check':p.trigger&&p.trigger.hours?'gauge':'wrench','s16')}</span>
    <div class="pkt" data-ixa="po:${p.id}"><b>${p.name}${p.reg?' <span class="tag reg">Obrigatório</span>':''}</b><span class="sit ${off?'n':p.t||'n'} pks">${p.due}</span><small class="trg">${trig(p.trigger)}</small>${p.incl?`<small>Inclui a ${p.incl}</small>`:''}<small>${meta}${p.reg?` · certificado vence em ${p.reg}`:''}</small>${off?dpill(p.id):''}</div>
    <span class="chv" data-ixa="po:${p.id}">${ic('caret-down','s16 chev'+(open?' up':''))}</span></div>`;
  const ed=G.edit===p.id&&off?editor(p.id):'';
  const body=open&&!off?`<div class="pkb">${p.svcs.map((sv,i)=>{const on=!!G.on[p.id][i];const k=p.id+'.'+i;
      return `<div class="svr ${on?'':'off'}" data-ixa="sc:${p.id}:${i}" role="checkbox" aria-checked="${on}" tabindex="0">${cbx(on)}<span class="sn">${sv.n}${sv.inh?`<span class="inh"> · da ${sv.inh}</span>`:''}</span><span class="sm">${fmtDur(sv.min)}</span>${on?'':`<span class="sdf">${dpill(k)}</span>`}</div>${G.edit===k&&!on?editor(k):''}`;}).join('')}${partsLine(p)}</div>`:'';
  return `<div class="pkg ${off?'off':''} ${open?'open':''}">${head}${ed}${body}</div>`;}
const shortTrig=p=>trig(p.trigger).replace(', o que vier primeiro','');
const PART_IC=n=>/lona/i.test(n)?'disc':/retentor|rolamento/i.test(n)?'circle-notch':/graxa/i.test(n)?'drop-half':/óleo/i.test(n)?'drop':/filtro/i.test(n)?'wind':/bucha|barrote/i.test(n)?'columns':/mola/i.test(n)?'arrows-clockwise':'package';
const capName=n=>{const x=n.replace(/^de /,'');return x.charAt(0).toUpperCase()+x.slice(1);};
const qtyU=q=>/[a-z]/i.test(q)?q.replace(/ /g,'&nbsp;'):`${q}&nbsp;un`;
function partRows(parts){const sorted=[...parts].sort((a,b)=>(b[3]==='w')-(a[3]==='w'));
  return sorted.map(([q,n,rule,t])=>`<div class="prw"><span class="prx">${ic(PART_IC(n),'s16')}</span><span class="prn"><b>${capName(n)}</b>${rule?`<small>${rule}</small>`:''}</span><span class="prq"><b>${qtyU(q)}</b>${t==='w'?`<small class="w">${ic('warning','s12')}falta 1 · chega quinta</small>`:'<small>em estoque</small>'}</span></div>`).join('');}
const SVC_IC=n=>/freio|lona/i.test(n)?'disc':/rolamento|cubo/i.test(n)?'circle-notch':/graxa|lubri|quinta roda/i.test(n)?'drop-half':/óleo|drenar|água/i.test(n)?'drop':/filtro/i.test(n)?'wind':/bucha|fueiro|barrote/i.test(n)?'columns':'wrench';
function insideHtml(p){const parts=p.svcs.flatMap(sv=>sv.parts);const miss=parts.filter(x=>x[3]==='w').length;const tot=p.svcs.reduce((a,sv)=>a+sv.min,0);
  const tile=(icn,l,v,sub,cls)=>`<div class="tile"><span class="tic">${ic(icn,'s16')}</span><span class="tlab"><small>${l}</small><b class="${cls||''}">${v}</b>${sub?`<small class="tsub">${sub}</small>`:''}</span></div>`;
  const svcs=p.svcs.map(sv=>{const [nm,pos]=sv.n.split(/, (.+)/);return `<div class="vis2"><span class="vic">${ic(SVC_IC(sv.n),'s14')}</span><span class="vn">${nm}${pos?` <span class="vtag">${pos}</span>`:''}${sv.inh?` <span class="vtag">da ${sv.inh}</span>`:''}</span><span class="vd">${fmtDur(sv.min)}</span></div>`;}).join('');
  const prt=partRows(parts);
  return `<div class="vihead"><b>${p.name}</b><span>${p.veh}</span><small>${shortTrig(p)}</small></div>
  <div class="tiles vtiles">${tile('wrench','Serviços',String(p.svcs.length),'leva '+fmtDur(tot))}${parts.length?tile('package','Peças',String(parts.length),miss?`${ic('warning','s12')}falta ${miss}`:'todas em estoque'):''}</div>
  <div class="visec"><div class="vish">Serviços<span class="cnt">${p.svcs.length}</span></div><div class="vilist">${svcs}</div></div>
  ${parts.length?`<div class="visec"><div class="vish">Peças<span class="cnt">${parts.length}</span>${miss?`<span class="vmiss2">${miss} em falta</span>`:''}</div><div class="vilist">${prt}</div></div>`:''}
  ${PKGS.includes(p)?`<span class="lk viact">Abrir a OS 1042 ›</span>`:''}`;}
const contentsLabel=p=>{const ns=p.svcs.length,np=p.svcs.reduce((a,sv)=>a+sv.parts.length,0);return `${ns} ${ns===1?'serviço':'serviços'}${np?`<span class="pcx"> e ${np} ${np===1?'peça':'peças'}</span>`:''}`;};
function pkgRow(p){const st=pkState(p), off=st==='off', menu=G.menu===p.id+'|vi';
  const trigTok=shortTrig(p).split(' ou ').map((x,i)=>`<span class="nw">${(i?'ou ':'')+x.replace(/ /g,'&nbsp;')}</span>`).join(' ');
  const meta=`<span class="nw">leva ${fmtDur(p.svcs.reduce((a,sv)=>a+sv.min,0)).replace(/ /g,'&nbsp;')}&nbsp;·</span> ${trigTok} <span class="lk vin" data-ixa="m:${p.id}:vi" role="button" tabindex="0">${contentsLabel(p)} ›</span>`;
  return `<div class="prow ${off?'off':''}"><span data-ixa="pc:${p.id}" role="checkbox" aria-checked="${!off}" tabindex="0" class="cbw">${cb3(off?'off':'on')}</span>
    <div class="prt2"><b>${p.name}${p.reg?' <span class="tag reg">Obrigatório</span>':''}</b><small>${meta}</small>${menu&&!RPH?`<div class="pop vipop" role="dialog">${insideHtml(p)}</div>`:''}</div>
    <span class="prr"><span class="sit ${off?'n':p.t||'n'}">${p.due}</span><span class="lk vin2" data-ixa="m:${p.id}:vi" role="button" tabindex="0">${contentsLabel(p)} ›</span></span>${off?`<div class="prdef">${dpill(p.id)}</div>`:''}</div>`;}
const pkgGroups=list=>[...new Set(list.map(p=>p.veh))].map(v=>`<div class="vgrp"><p class="vh">${v}</p><div class="prows">${list.filter(p=>p.veh===v).map(pkgRow).join('')}</div></div>`).join('');
function ixBody(){
  const hist=history('Últimas manutenções deste conjunto',[['27/10','Preventiva 30 dias, 2ª carreta','OS 0998'],['02/09','Preventiva 20 mil, cavalo','OS 0954'],['12/05','Preventiva 60 mil, 2ª carreta','OS 0871']]);
  if(G.done){const inc=PKGS.filter(p=>pkOn(p)>0), dfr=PKGS.filter(p=>pkOn(p)===0);
    const top=inc.length?`${inc.length} ${inc.length>1?'preventivas':'preventiva'} na OS&nbsp;1042`:`${dfr.length} ${dfr.length>1?'preventivas ficaram':'preventiva ficou'} para depois`;
    const sub=[inc.length?'leva '+fmtDur(totMin()):'',dfr.length?`${dfr.length} ${dfr.length>1?'ficaram':'ficou'} para depois · ${defOf(dfr[0].id).reason.toLowerCase()}`:'nada ficou para depois'].filter(Boolean).join(' · ');
    const row=(p,def)=>`<div class="dnr"><span class="dni ${def?'w':''}">${ic(def?'clock':'check','s12')}</span><span class="dnt"><b>${p.name}</b><small>${p.where==='cavalo'?'Cavalo':p.where} · ${p.svcs.length} serviços</small></span>${def?`<span class="vtag">${defOf(p.id).reason.toLowerCase()}</span>`:''}</div>`;
    return `<div class="dnok"><span class="dnc">${ic('check','s20')}</span><div class="dnx"><b>${top}</b><small>${sub}</small>${G.undo>0?`<span class="undo" data-ixa="u" role="button" tabindex="0">Desfazer · <i class="cd10">${G.undo} s</i></span>`:''}</div></div>
    ${inc.length?`<div class="dnl"><p class="vh">Na OS</p>${inc.map(p=>row(p)).join('')}</div>`:''}
    ${dfr.length?`<div class="dnl"><p class="vh">Para depois</p>${dfr.map(p=>row(p,1)).join('')}</div>`:''}`;}
  const n=pkgsOn(), anyOff=PKGS.some(p=>pkState(p)!=='on');
  const sub=G.all?'As 3 ficam para depois':n===0?'Nenhuma marcada':n===3?'3 preventivas':`${n} de 3 marcadas`;
  const miss=lackOn()?`<p class="missl">${ic('warning','s14')}Falta 1 jogo de rebites, chega quinta</p>`:'';
  return `<div class="sec plain"><div class="sh"><h3>Preventivas para fazer agora</h3><span class="shs">${sub}</span></div>${pkgGroups(PKGS)}${anyOff?`<p class="late">${ic('clock-countdown','s14')}Conta como atraso</p>`:''}${miss}</div>`;}
function ixFoot(){
  if(G.done) return `<div class="pf"><div class="bb"><span data-ixa="c">${btn('Fechar',{variant:'outline'})}</span>${pkgsOn()?btn('Abrir a OS 1042',{icon:'arrow-square-out',action:1}):''}</div></div>`;
  if(G.all) return `<div class="pf"><div class="bb"><span data-ixa="B">${btn('Voltar',{variant:'outline'})}</span><span data-ixa="ok">${btn('Adiar as 3',{icon:'clock-countdown',action:1})}</span></div></div>`;
  const n=pkgsOn(), full=PKGS.every(p=>pkState(p)!=='tri');
  const fp=PKGS.filter(p=>pkState(p)==='on').length, ps=PKGS.filter(p=>pkState(p)==='tri').reduce((x,p)=>x+pkOn(p),0);
  const pv=x=>`${x} ${x>1?'preventivas':'preventiva'}`, sv=x=>`${x} ${x>1?'serviços':'serviço'}`;
  const label=`<span>Incluir ${n}<span class="pvx"> ${n>1?'preventivas':'preventiva'}</span><span class="osx"> na OS 1042</span></span>`;
  return `<div class="pf"><div class="bb"><span data-ixa="A">${btn('<span>Adiar<span class="lgx"> todas</span></span>',{variant:'outline'})}</span>${n?`<span data-ixa="ok">${btn(label,{icon:'plus',action:1})}</span>`:btn('Escolha o que fazer agora',{disabled:1})}</div></div>`;}
function ixDrawer(phone){
  if(G.closed) return phone?'<div class="sheet-ov" data-ix="1" hidden></div>':'<div class="ixw" data-ix="0" hidden></div>';
  const miss=lackOn()&&!G.done;
  const metricsX=G.done?[['Na OS',`${pkgsOn()} ${pkgsOn()===1?'preventiva':'preventivas'}`,''],['Adiadas',String(3-pkgsOn()),3-pkgsOn()?'w':''],['Duração',fmtDur(totMin()),'']]:[['Atraso','1.850 km','d'],['Peças',miss?'Falta 1':'Em estoque',miss?'w':'s'],['Duração',fmtDur(totMin()),'']];
  const head=G.done?pHead(V.c320,{phone}):pHead(V.c320,{status:pill('s','garage','No pátio desde ontem · OS 1042 aberta'),metrics:metricsX,phone});
  RPH=!!phone;if(G.inside){const pk=PKGS.find(x=>x.id===G.inside)||PKG044.find(x=>x.id===G.inside);const ih=`<div class="phd">${phone?'<div class="grab"></div>':''}<div class="ph"><span class="xb back" data-ixa="bk" role="button" tabindex="0" aria-label="Voltar">${ic('arrow-left','s16')}</span><div class="t"><h2 class="bkt">Conjunto C-320</h2></div></div></div>`;const body=`${ih}<div class="${phone?'sb':'pb'} insb">${insideHtml(pk)}</div>`;return phone?`<div class="sheet-ov" data-ix="1"><div class="sheet">${body}</div></div>`:`<div class="ixw" data-ix="0">${drawer(body)}</div>`;}
  const inner=`${head.replace(/<\/div>\s*$/,'<span class="lk lastm">Últimas manutenções'+ic('caret-right','s14')+'</span></div>')}<div class="${phone?'sb':'pb'}">${ixBody()}</div>${ixFoot()}${phone?phoneMenu():''}`;
  return phone?`<div class="sheet-ov" data-ix="1"><div class="sheet">${inner}</div></div>`:`<div class="ixw" data-ix="0">${drawer(inner)}</div>`;}
function ixRender(){
  document.querySelectorAll('[data-ix]').forEach(el=>{const sc=el.querySelector('.pb,.sb');const top=sc?sc.scrollTop:0;const ph=el.dataset.ix==='1';
    const t=document.createElement('div');t.innerHTML=ixDrawer(ph);const nw=t.firstElementChild;el.replaceWith(nw);const sc2=nw.querySelector('.pb,.sb');if(sc2)sc2.scrollTop=top;const pop=nw.querySelector('.pop');if(pop)pop.scrollIntoView({block:'nearest'});});
  document.querySelectorAll('[data-id="c320"]').forEach(c=>c.classList.toggle('on',!G.closed));
}
let undoTimer=null;
function startUndo(){clearInterval(undoTimer);undoTimer=setInterval(()=>{if(G.undo<=0){clearInterval(undoTimer);return;}G.undo--;document.querySelectorAll('.cd10').forEach(x=>x.textContent=G.undo+' s');if(G.undo===0)document.querySelectorAll('.undo').forEach(x=>x.remove());},1000);}
const clone=o=>JSON.parse(JSON.stringify(o));
function ixAct(a){
  const [k,id,v]=a.split(':');
  if(k==='pc'){const p=PKGS.find(x=>x.id===id);const st=pkState(p);G.on[id]=p.svcs.map(()=>st==='on'?0:1);G.all=0;if(st!=='on')G.open[id]=1;}
  else if(k==='po'){G.open[id]=!G.open[id];}
  else if(k==='sc'){G.on[id][+v]=G.on[id][+v]?0:1;G.all=0;}
  else if(k==='pp'){G.parts[id]=!G.parts[id];}
  else if(k==='e'){G.edit=id==='-'||G.edit===id?null:id;}
  else if(k==='r'){G.def[id]={...defOf(id),reason:v};G.menu=null;}
  else if(k==='w'){G.def[id]={...defOf(id),when:v};G.menu=null;}
  else if(k==='cm'){G.cm=(G.cm||0)+(+v);}
  else if(k==='m'&&v==='vi'){G.inside=id;G.menu=null;}
  else if(k==='bk'){G.inside=null;}
  else if(k==='m'){const key=id+'|'+v;if(v!=='cal')G.cm=0;G.menu=id==='-'?null:(G.menu===key?null:key);}
  else if(k==='A'){G.prevSel=clone(G.on);PKGS.forEach(p=>G.on[p.id]=p.svcs.map(()=>0));G.all=1;G.edit=null;}
  else if(k==='B'){G.on=G.prevSel||allOn();G.all=0;}
  else if(k==='ok'){G.done=1;G.all=0;G.edit=null;G.undo=10;startUndo();}
  else if(k==='u'){G.done=0;G.undo=0;clearInterval(undoTimer);}
  else if(k==='c'){G.closed=1;}
  ixRender();}
document.addEventListener('click',e=>{const c=e.target.closest('.fx-kb-card[data-id],.ev[data-id],.wev[data-id],.agc[data-id],.cd[data-id]');if(c&&!e.target.closest('[data-ix]')){const sec=c.closest('section.sc');const dev=c.closest('.fx-device');if(sec&&dev&&!dev.querySelector('[data-ix]:not([hidden]),.sheet-ov:not([hidden]) .sheet,.drawer')){const bar=sec.querySelector('.states');const b=bar&&bar.querySelector('button[data-s="visit"]');if(b){b.click();return;}}}
  const t=e.target.closest('[data-ixa]');if(t&&t.closest('[data-ix]')){e.preventDefault();if(t.classList.contains('msheet-ov')&&e.target.closest('.msheet'))return;ixAct(t.dataset.ixa);return;}
  if(G.menu&&!e.target.closest('.pop,.msheet')){G.menu=null;ixRender();}
  const card=e.target.closest('[data-id="c320"]');if(card&&G.closed){G.closed=0;ixRender();}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&G.inside){G.inside=null;ixRender();return;}if(e.key==='Escape'&&G.menu){G.menu=null;ixRender();return;}if(e.key==='Escape'&&!G.closed&&document.querySelector('[data-ix]:not([hidden])')){G.closed=1;ixRender();return;}
  const t=document.activeElement&&document.activeElement.closest&&document.activeElement.closest('[data-ixa]');
  if(t&&t.closest('[data-ix]')&&(e.key===' '||e.key==='Enter')){e.preventDefault();const a=t.dataset.ixa;ixAct(a);const again=document.querySelector(`[data-ix] [data-ixa="${a}"]`);if(again)again.focus();}});

/* C-044: a package that includes another, a mandatory one, an annual one and one by engine hours */
const PKG044=[
  {id:'r60',veh:'Cavalo QRT2E55',where:'cavalo',name:'Revisão 60 mil',incl:'Preventiva 20 mil',trigger:{km:60000},due:'Vence em 14 dias',t:'',svcs:[
    {n:'Óleo e filtros do motor',min:40,inh:'Preventiva 20 mil',parts:[['38 l','de óleo 15W40'],['1','filtro de óleo']]},
    {n:'Filtro separador de água',min:15,inh:'Preventiva 20 mil',parts:[['1','filtro separador']]},
    {n:'Embreagem e freio motor',min:60,parts:[]},
    {n:'Alinhamento e cambagem',min:45,parts:[]}]},
  {id:'cr',veh:'Cavalo QRT2E55',where:'cavalo',name:'Verificação do cronotacógrafo',reg:'12/03',trigger:{text:'a cada 2 anos (Inmetro)'},due:'Vence em 3 meses',t:'',svcs:[{n:'Ensaio no posto credenciado',min:60,parts:[]}]},
  {id:'mk',veh:'Cavalo QRT2E55',where:'cavalo',name:'Munck 250 h',trigger:{hours:250},due:'Vence em 40 horas',t:'',svcs:[{n:'Lubrificação da lança',min:30,parts:[['0,5 kg','de graxa']]},{n:'Inspeção dos cabos',min:20,parts:[]}]},
  {id:'an',veh:'1ª carreta RTD8F12',where:'1ª carreta',name:'Revisão anual do conjunto',trigger:{text:'todo ano em março'},due:'Vence em 3 meses',t:'',svcs:[{n:'Inspeção estrutural',min:60,parts:[]},{n:'Laudo de freios',min:30,parts:[]}]},
];
function pk044Drawer(phone){
  PKG044.forEach(p=>{if(!G.on[p.id])G.on[p.id]=p.svcs.map(()=>1);});G.open.r60=1;RPH=!!phone;
  const head=pHead(C044,{status:pill('n','road-horizon','Na estrada · roda 610 km por dia'),metrics:[['Vence','em 14 dias',''],['Peças','Em estoque','s'],['Duração','6 h 20','']],phone});
  const body=`<div class="sec plain"><div class="sh"><h3>Preventivas para marcar</h3><span class="shs">4 preventivas</span></div>${pkgGroups(PKG044)}</div>`.replace(/data-ixa=/g,'data-x=');
  const foot=`<div class="pf"><div class="bb">${btn('<span>Adiar<span class="lgx"> todas</span></span>',{variant:'outline'})}${btn('Marcar dia na oficina',{icon:'calendar-check',action:1})}</div></div>`;
  return phone?`<div class="sheet-ov"><div class="sheet">${head}<div class="sb">${body}</div>${foot}</div></div>`:drawer(`${head}<div class="pb">${body}</div>${foot}`);}
const markOn=(html,id)=>html.replace(new RegExp(`(class="(?:cd|fx-aprow lrow)[^"]*)(" data-id="${id}")`),'$1 on$2');
const withPk044=(html,phone)=>markOn(html,'c044').replace(/<\/div>\s*$/,pk044Drawer(phone)+'</div>');
const visitDrawer=(s,phone)=>{if(IXS[s]){setG(s);return ixDrawer(phone);}const m=VMODE[s];const head=pHead(V.c320,{...h320(m),phone,...(m==='sap'?{src:'Plano do SAP · ordem 4000131'}:{}),...(m==='allDefer'?{title:'Adiar todas',back:1,sub:'Conjunto C-320'}:{})});
  return phone?`<div class="sheet-ov"><div class="sheet">${head}<div class="sb">${visitBodyM(m)}</div>${visitFootM(m)}</div></div>`:drawer(`${head}<div class="pb">${visitBodyM(m)}</div>${visitFootM(m)}`);};

const WD=['seg','ter','qua','qui','sex','sáb'];
const DAYS=[['23','',2],['24','',2],['25','',2],['26','cheia',1],['27','cheia',1],['28','6 h',0,1],['30','18 h'],['01','22 h'],['02','28 h'],['03','3 h',1],['04','32 h'],['05','8 h']];
const HDLY={title:'Marcar dia na oficina',sub:'Cavalo DLY1J07, Revisão 60 mil',back:1,status:pill('n','road-horizon','Na estrada · roda 640 km por dia'),metrics:[['Atraso','4.300 km','d'],['Peças','Falta 1','w'],['Duração','4 h','']]};
const SHOP_HOURS={'2026-11-26':{text:'cheio',off:1},'2026-11-27':{text:'cheio',off:1},'2026-11-28':{text:'6 h'},'2026-11-29':{text:'fechado',off:1},'2026-11-30':{text:'18 h'}};
const shopCal=(value,extra)=>F.monthCal({year:2026,month:11,value,today:'2026-11-26',min:'2026-11-26',dayInfo:{...SHOP_HOURS,...extra},legend:'<span>embaixo do dia: horas livres na oficina</span>'});
function scheduleBody(){
  return `<div class="sec cal">${secHead('Escolha o dia',`<span class="hh">horas livres na oficina</span>`)}
  ${shopCal('2026-11-28',{'2026-11-28':{text:'6 h'},'2026-12-03':{text:'3 h',off:1}})}<p class="first">${ic('calendar-check','s16')}<span><b>Primeiro dia com espaço: sáb 28/11</b>, com 6&nbsp;h livres</span></p></div>
  <div class="sec">${prevHead('Preventivas para fazer','1 preventiva',OVERCHIP)}${items([['Revisão 60 mil','No cavalo, inclui a Preventiva 20 mil','Venceu há 4.300 km','d','Fazer a cada 30 mil km. Última em 03/06.']])}</div>
  ${kitsDly()}
  <label class="chk"><i>${ic('check','s14')}</i>Avisar a transportadora JSL por e-mail</label>`;}
const scheduleFoot=()=>`<div class="pf"><div class="bb">${btn('Voltar',{variant:'outline'})}${btn('<span>Agendar<span class="lgx"> para</span> sáb 28/11</span>',{icon:'calendar-check',action:1})}</div></div>`;

function skList(phone){
  const r=()=>`<div style="display:flex;align-items:center;gap:20px;min-height:64px;padding:10px 12px">${'<span class="sk" style="width:140px;height:16px"></span>'}<span style="flex:1;display:flex;flex-direction:column;gap:6px"><span class="sk" style="width:60%;height:15px"></span><span class="sk" style="width:30%;height:12px"></span></span>${phone?'':'<span class="sk" style="width:120px;height:15px"></span>'}</div>`;
  const g=n=>`<section class="grp"><header><span class="sk" style="width:32px;height:32px;border-radius:10px"></span><span class="sk" style="width:120px;height:16px"></span></header>${Array.from({length:n},r).join('')}</section>`;
  return `<div class="hl"><div class="tx" style="display:flex;flex-direction:column;gap:10px"><span class="sk" style="width:${phone?'90%':'420px'};height:24px"></span><span class="sk" style="width:${phone?'60%':'260px'};height:15px"></span></div></div>${g(3)}${g(3)}`;
}

const C044={full:'Conjunto C-044',sub:'Cavalo QRT2E55 e 2 carretas',parts:V.c044.parts};
function nextPanel(){return `<aside class="pnl">${pHead(C044,{status:pill('n','road-horizon','Na estrada · roda 610 km por dia'),metrics:[['Vence','qui 10/12',''],['Peças','Em estoque','s'],['Duração','3 h','']]})}<div class="pb"><div class="sec">${prevHead('Preventivas para fazer','2 preventivas','')}${items([['Revisão 60 mil','No cavalo','Vence qui 10/12','','Fazer a cada 30 mil km. Última em 14/06.'],['Lubrificação geral','Na 1ª carreta','Vence sáb 12/12','','Fazer a cada 30 dias. Última em 12/11.']])}</div>
  ${kits044()}</div>
  <div class="pf"><div class="bb">${btn('Adiar',{variant:'outline'})}${btn('Marcar dia na oficina',{icon:'calendar-check',action:1})}</div></div></aside>`;}

/* ---------- board: the three columns side by side, the whole week at once ---------- */
const pillMore=v=>/^\+\d/.test(v.more)?`<span class="pill">${v.more.split(' ')[0]}</span>`:'';
function card(id,sel){const v=V[id];const pk=PICK&&MULTI.includes(id);return `<div class="cd ${sel===id?'on':''} ${pk?'picked':''}" data-id="${id}" role="button" tabindex="0"><div class="l1">${PICK?cbx(pk):''}<b title="${esc(v.name)}">${v.name}</b>${mark(v.parts)}<span class="when ${v.t}">${v.when}</span></div><div class="l2"><span>${v.svc}</span>${/cronotac/.test(v.svc)?'<span class="tag">Obrigatório</span>':''}${pillMore(v)}${v.tag?'<span class="tag">adiada · falta peça</span>':''}</div></div>`;}
const colHead=g=>`<header class="ch"><span class="gt ${g.tone}">${ic(g.icon,'s16')}</span><h3>${g.title}</h3><span class="gc ${g.count.startsWith('0')?'':g.tone}">${g.count.split(' ')[0]}</span></header>`;
function column(g,sel,empty){
  return `<section class="cl">${colHead(empty?{...g,count:'0'}:g)}<div class="cards">${empty?`<div class="cempty">${ic('check-circle','s20')}<span>${empty}</span></div>`:g.ids.map(id=>card(id,sel)).join('')}${!empty&&g.more?`<div class="more">${g.more}${ic('caret-down','s14')}</div>`:''}</div></section>`;}
const nokm=()=>`<span class="nokm">${ic('gauge','s16')}<b>2 veículos sem km</b><span>ver</span>${ic('caret-right','s14')}</span>`;
const slim=(o={})=>o.empty
  ?`<div class="hero slim"><span class="halo sm">${ic('calendar-check','s20')}</span><div class="tx"><h2>Frota em dia esta semana</h2><p>Nenhuma preventiva vencida. A próxima é a Revisão 60 mil do C-044, na qui 10/12.</p></div>${nokm()}</div>`
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
Object.assign(V,{
  rx1:{name:'RTX4A10',parts:[['RTX4A10','car','d']],svc:'Preventiva carreta 40 mil',more:'',when:'venceu há 900 km',t:'d'},
  rx2:{name:'RTX4B22',parts:[['QRT2M10','cav',''],['RTX4B22','car','w']],svc:'Lubrificação carreta 15 dias',more:'',when:'sex 27/11',t:'w'},
  rx3:{name:'RTX4C05',parts:[['RTX4C05','car','']],svc:'Preventiva carreta 40 mil',more:'',when:'qui 10/12',t:''},
  rx4:{name:'RTX4D18',parts:[['RTX4D18','car','']],svc:'Revisão anual do conjunto',more:'',when:'ter 15/12',t:''}});
const KWHERE_EXTRA=Object.assign({},{rx1:['garage','No pátio'],rx2:['road-horizon','Na estrada'],rx3:['road-horizon','Na estrada'],rx4:['garage','Parada na base']});
function searchBlock(s,phone){
  const clear=`<span class="lk">Limpar busca</span>`;
  if(s==='nores0') return `<div class="eb ${phone?'ph':''}">${F.empty({canvas:1,icon:'magnifying-glass',title:'Nenhum veículo com “RTX4”',hint:'Confira a placa.',action:`<div class="ea">${clear}</div>`})}</div>`;
  const card=id=>v2card(id,null);
  if(s==='nores2'){const grp=(base,ids)=>`<div class="sgrp"><p class="vh">${base}</p>${ids.map(card).join('')}</div>`;
    return `<div class="eb ${phone?'ph':''}"><div class="fx-empty canvas srch"><div class="sres"><b class="st">“RTX4” está em outras bases</b><p>Nenhum veículo com “RTX4” na Base Curitiba.</p>${grp('Base Ponta Grossa',['rx1','rx2'])}${grp('Base Três Lagoas',['rx3'])}<p class="smore">e mais 1 em outra base</p><div class="sacts">${btn('Ver todas as bases',{icon:'arrows-left-right'})}${clear}</div></div></div></div>`;}
  return `<div class="eb ${phone?'ph':''}"><div class="fx-empty canvas srch"><div class="sres"><b class="st">RTX4A10 está na Base Ponta Grossa</b><p>Nenhum veículo com “RTX4” na Base Curitiba.</p>${card('rx1')}<div class="sacts">${btn('Ver na Base Ponta Grossa',{icon:'arrows-left-right'})}${clear}</div></div></div></div>`;}
const EMPTY={
  first:{icon:'calendar-plus',title:'A agenda começa com um plano',text:'Com um plano, a agenda mostra o que vence e quando trazer cada veículo.',action:()=>btn('Começar pelos planos sugeridos',{icon:'sparkle',action:1}),link:'Criar um plano do zero'},
  noperm:{icon:'lock-simple',title:'Você ainda não vê a agenda',text:'A agenda fica com quem planeja a manutenção. Peça acesso a Marina Souza, gestora da Base Curitiba.',action:()=>btn('Pedir acesso à Marina',{icon:'envelope'})},
  nores:{icon:'magnifying-glass',title:'Nenhum veículo com “RTX4” na agenda',text:'Confira a placa ou procure em outra base.',link:'Limpar busca',hint:'<b>RTX4A10</b> está na Base Ponta Grossa · <span class="lk">ver</span>'},
};
const emptyBlock=(k,phone)=>{const e=EMPTY[k];return `<div class="eb ${phone?'ph':''}">${F.empty({canvas:1,icon:e.icon,title:e.title,hint:e.text,action:`${e.hint?`<p class="ehint">${ic('map-pin','s16')}<span>${e.hint}</span></p>`:''}<div class="ea">${e.action?e.action():''}${e.link?`<span class="lk">${e.link}</span>`:''}</div>`})}</div>`;};
const errNoteM=()=>`<div class="notice-w err ph" role="alert">${ic('wifi-slash','s16')}<span class="etx"><b>Não deu para atualizar</b><small>Mostrando o de 9h10</small></span><span class="lk etry">${ic('arrow-clockwise','s14')}Tentar de novo</span></div>`;
const errNote=()=>`<div class="notice-w err" role="alert">${ic('wifi-slash','s16')}<span class="etx"><b>Não deu para atualizar a agenda.</b> Mostrando o que estava aqui às 9h10.</span>${btn('Tentar de novo',{size:'sm',icon:'arrow-clockwise'})}</div>`;
const sapChip=()=>`<span class="nokm sapc">${ic('arrows-left-right','s16')}<b>Planos do SAP</b><span class="m">atualizado há 12 min</span></span>`;
const searchOn=()=>`<span class="sf on" role="search">${ic('magnifying-glass','s16')}<b>RTX4</b><span class="x">${ic('x','s14')}</span></span>`;
/* by service: the same week grouped by what has to be done, to buy parts */
const SVC={
  over:[['Lona de freio','2 veículos','8 lonas, 16 molas',1],['Óleo e filtros do motor','1 veículo','30 l de óleo, 3 filtros'],['Fueiros e barrotes','1 veículo','12 barrotes'],['Lubrificação geral','2 veículos','2 kg de graxa']],
  week:[['Rolamentos de cubo','2 veículos','12 retentores'],['Troca de óleo e filtros','1 veículo','38 l de óleo, 3 filtros'],['Fueiros e barrotes','1 veículo','6 barrotes']],
  next:[['Óleo e filtros do motor','2 veículos','60 l de óleo, 6 filtros'],['Lubrificação geral','3 veículos','3 kg de graxa'],['Lona de freio','1 veículo','8 lonas, 16 molas'],['Troca de óleo e filtros','2 veículos','76 l de óleo, 6 filtros']],
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
  ${shopCal('2026-11-30',{'2026-11-28':{text:'6 h',off:1},'2026-11-30':{text:'18 h'}})}<p class="first">${ic('calendar-check','s16')}<span><b>Primeiro dia com espaço para as 9 h: seg 30/11</b></span></p></div>
  <div class="sec">${secHead('Veículos',count(3))}<div class="ilist">${[['DLY1J07','Revisão 60 mil','4 h'],['C-118','Preventiva 20 mil e mais 1','3 h'],['QRT1A09','Preventiva 20 mil','2 h']].map(([n,w,h])=>`<div class="ii dn"><span class="ib"><span class="it1"><b>${n}</b><span class="tp sm">${h}</span></span><span class="iw">${w}</span></span></div>`).join('')}</div></div>
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
const SVCS=['Preventiva 60 mil','Lona de freio','Fueiros e barrotes','Lubrificação geral','Preventiva 20 mil','Troca de óleo e filtros','Lona de freio, eixos 2 e 3'];
const genIds=(pre,n,mk)=>Array.from({length:n},(_,i)=>{const id=pre+i;if(!V[id])V[id]=mk(i);if(!LM[id])LM[id]={pos:i%2?'Cavalo':'2ª carreta',where:i%3?'Rodando, 600 km/dia':'No pátio, OS '+(1100+i),sub:i%3?'em '+(i+2)+' dias':'venceu '+(20-i%9)+'/11',act:i%3?'Agendar':'Incluir na OS'};return id;});
const setParts=(i,t)=>i%3===0?[['P'+i,'cav',t]]:[['P'+i,'cav',''],['C'+i,'car',t],['D'+i,'car','']];
const VOL={over:{n:31,ids:()=>genIds('vo',8,i=>({name:i%3?'C-'+(400+i*7):'QRT'+(2+i)+'B'+(10+i),parts:setParts(i,'d'),svc:SVCS[i%7],more:i%4===1?'+2 nesta visita':'',when:'venceu há '+[(1850+i*913),(420+i*77),(12400+i*1700)][i%3].toLocaleString('pt-BR')+' km',t:'d'}))},
  week:{n:47,ids:()=>genIds('vw',8,i=>({name:'C-'+(500+i*5),parts:setParts(i,'w'),svc:SVCS[(i+2)%7],more:'',when:['sex 27/11','sáb 28/11','dom 29/11','seg 30/11','ter 01/12','qua 02/12'][i%6],t:'w'}))},
  next:{n:180,ids:()=>genIds('vn',8,i=>({name:'C-'+(600+i*3),parts:setParts(i,''),svc:SVCS[(i+4)%7],more:'',when:['qui 03/12','sex 04/12','seg 07/12','ter 08/12','qua 09/12','qui 10/12','sex 11/12','seg 14/12'][i],t:''}))}};
/* long sets and text, partial data */
Object.assign(V,{
  rt9:{name:'RT-9',full:'Rodotrem RT-9',sub:'Cavalo QRT1Z99, 2 carretas e dolly sem placa',parts:[['QRT1Z99','cav','d'],['RTL4M01','car',''],['sem placa','dolly','d'],['RTL4M02','car','']],svc:'Revisão completa do sistema de freio pneumático com troca de válvulas',more:'+2 nesta visita',when:'venceu há 128.400 km',t:'d'},
  e9:{name:'Bitrem 9 eixos B-77',parts:[['QRT8Y12','cav',''],['RTM2N10','car','d'],['RTM2N11','car',''],['sem placa','dolly',''],['RTM2N12','car','']],svc:'Inspeção do dolly e do pino-rei',more:'',when:'venceu há 1 ano e 2 meses',t:'d'},
  km7:{name:'QRT0A01',parts:[['QRT0A01','cav','d']],svc:'Preventiva 60 mil',more:'',when:'venceu há 3.210 km',t:'d'},
  wk3:{name:'C-318',parts:[['QRT4C77','cav','w'],['RTP1A20','car','']],svc:'Troca do filtro secador de ar',more:'',when:'vence em 3 dias',t:'w'},
  yr1:{name:'C-901',parts:[['QRT9Z01','cav',''],['RTZ0A11','car','']],svc:'Troca do óleo do diferencial',more:'',when:'vence em 1 ano',t:''},
  nob:{name:'QRT7X55',parts:[['QRT7X55','cav','']],svc:'Preventiva 20 mil',more:'',when:'qui 10/12',t:''},
});

const LONG={over:['rt9','e9','km7'],week:['wk3','c118'],next:['yr1','nob','c044']};
/* drawers */
const pvList=(rows,on)=>`<div class="plist">${rows.map(([n,w,v,t,r],i)=>pvRow(on?on(i):true,n,w,v,t,r)).join('')}</div>`;
const moreRow=t=>`<div class="pk morerow"><span class="lk">${t}</span>${ic('caret-down','s14')}</div>`;
const BIG=[['Preventiva 120 mil','No cavalo','Venceu há 42.300 km','d','A cada 120 mil km'],['Lona de freio','Na 1ª carreta, eixos 1 a 3','Venceu há 18.900 km','d','A cada 60 mil km'],['Lona de freio','Na 2ª carreta, eixos 1 a 3','Venceu há 18.900 km','d','A cada 60 mil km'],['Lona de freio','Na 3ª carreta, eixos 1 a 3','Venceu há 9.100 km','d','A cada 60 mil km'],['Fueiros e barrotes','Na 1ª carreta','Venceu há 4 meses','d','A cada 6 meses'],['Fueiros e barrotes','Na 2ª carreta','Venceu há 4 meses','d','A cada 6 meses'],['Fueiros e barrotes','Na 3ª carreta','Venceu há 2 meses','d','A cada 6 meses'],['Lubrificação geral','Nas 3 carretas','Venceu há 3 meses','d','A cada 30 dias'],['Rolamento de cubo','Na 1ª carreta, eixo 2','Vence hoje','w','A cada 200 mil km'],['Troca de óleo e filtros','No cavalo','Vence em 900 km','','A cada 20 mil km'],['Alinhamento','Nas 3 carretas','Vence em 2.400 km','','A cada 40 mil km']];
const kk=(name,locd,t,parts)=>({name,locd,t,parts});
const BIGKITS=[kk('Kit da Revisão anual do conjunto','cavalo','s',[['40 l','Óleo 15W40','','s']]),kk('Kit lona de freio','1ª carreta, eixos 1 a 3','w',[['12','Lona de freio','2 por lado','w']]),kk('Kit lona de freio','2ª carreta, eixos 1 a 3','w',[['12','Lona','','w']]),kk('Kit lona de freio','3ª carreta, eixos 1 a 3','w',[['12','Lona','','w']]),kk('Kit fueiros','3 carretas','s',[['36','Barrote','','s']]),kk('Kit rolamento de cubo','1ª carreta, eixo 2','s',[['2','Rolamento','1 por lado','s']]),kk('Kit troca de óleo','cavalo','s',[['38 l','Óleo','','s']])];
function stressDrawer(s,phone){
  let head,body,foot;
  if(s==='sLong'){
    head=pHead(V.rt9,{status:pill('n','road-horizon','Na estrada · Transportadora Rodoviária Irmãos Albuquerque de Mato Grosso do Sul'),metrics:[['Atraso','128.400 km','d'],['Peças','Sem estoque','d'],['Duração','6 h','']],phone});
    body=`<div class="sec">${prevHead('Preventivas para fazer agora','3 preventivas')}${pvList([['Revisão completa do sistema de freio pneumático com troca de válvulas','No cavalo','Venceu há 128.400 km','d','Nunca feita'],['Inspeção do dolly e do pino-rei','No dolly sem placa','Venceu há 1 ano e 2 meses','d','A cada 12 meses'],['Troca do óleo do diferencial','No cavalo','Vence em 1 ano','','A cada 2 anos']])}</div>
    ${partsBox({items:6,ok:0,miss:5,mt:'d',kits:[kk('Kit válvulas do freio pneumático com reparo completo','cavalo · nenhuma base tem','d',[['4','Válvula relé','','d'],['1','Válvula moduladora','','d']])],loose:[['Graxa para pino-rei','dolly','1 kg','n']]})}`;
    foot=`<div class="pf"><div class="bb">${btn('<span>Adiar<span class="lgx"> todas</span></span>',{variant:'outline'})}${btn('Marcar dia na oficina',{icon:'calendar-check',action:1})}</div></div>`;
  } else if(s==='sBig'){
    const C712={full:'Conjunto C-712',sub:'Cavalo QRT6K40 e 3 carretas',parts:[['QRT6K40','cav','d'],['RTS1A01','car','d'],['RTS1A02','car','d'],['RTS1A03','car','d']]};
    head=pHead(C712,{status:pill('s','garage','No pátio desde hoje às 7h · OS 1101 aberta'),metrics:[['Atraso','42.300 km','d'],['Peças','Falta 3','w'],['Duração','14 h · 2 dias','w']],phone});
    body=`<div class="notice-w">${ic('warning','s16')}<span><b>Não cabe nesta parada.</b> São 14 h de oficina e o conjunto sai amanhã às 8h. Marque o que dá para fazer agora.</span></div>
    <div class="sec">${prevHead('Preventivas para fazer agora','11 preventivas')}<div class="plist">${BIG.slice(0,5).map(([n,w,v,t,r])=>pvRow(true,n,w,v,t,r)).join('')}${moreRow('Mostrar mais 6')}</div></div>
    ${partsBox({items:37,ok:34,miss:3,kits:BIGKITS.slice(0,4),loose:[]}).replace('</div></div>',`${moreRow('Mostrar mais 3 kits e 5 avulsas')}</div></div>`).replace('em 4 kits','em 7 kits e 5 avulsas')}`;
    foot=`<div class="pf"><div class="bb">${btn('<span>Adiar<span class="lgx"> todas</span></span>',{variant:'outline'})}${btn('Incluir as 11 na OS 1101',{icon:'plus',action:1})}</div></div>`;
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

/* =====================================================================
   Three views in the product: Quadro (DS Kanban by work stage), Lista, Calendário
   ===================================================================== */
const viewSeg=on=>`<div class="vseg vi" role="tablist" aria-label="Visão">${[['Quadro','squares-four'],['Lista','rows'],['Calendário','calendar-blank']].map(([l,i])=>`<span class="${l===on?'on':''}" role="tab" aria-selected="${l===on}" aria-label="${l}" data-tip="${l}" tabindex="0">${ic(i,'s16')}</span>`).join('')}</div>`;
const vtop=on=>'';
Object.assign(V,{
  d1:{name:'C-512',parts:[['QRT6M30','cav',''],['RTN2B11','car','']],svc:'Preventiva 20 mil',more:'',when:'feita ter 24/11',t:'s'},
  d2:{name:'QRT3K18',parts:[['QRT3K18','cav','']],svc:'Lubrificação carreta 15 dias',more:'',when:'feita seg 23/11',t:'s'},
});
let KCOMPACT=false;
const STAGES=[
  {k:'todo',title:'A agendar',ids:['dly','q1a','rta','c072','q9b','c044','q6h']},
  {k:'sched',title:'Agendada',ids:['c118','rtf']},
  {k:'shop',title:'Na oficina',ids:['c320','c207']},
  {k:'done',title:'Feita (7 dias)',ids:['d1','d2']}];
const SCHED={c118:'sex 27/11',rtf:'seg 14/12'};
const KWHERE={dly:['road-horizon','Na estrada'],q1a:['road-horizon','Na estrada'],rta:['garage','Parada na base'],c072:['road-horizon','Na estrada'],q9b:['road-horizon','Na estrada'],c044:['road-horizon','Na estrada'],q6h:['road-horizon','Na estrada'],
  c118:['clock','às 8h'],rtf:['clock','às 7h'],c320:['garage','No pátio'],c207:['garage','No pátio'],d1:['wrench','OS 1031'],d2:['wrench','OS 1027']};
const KDUE_IC={d:'warning',w:'clock',c:'calendar-check',s:'check','':'calendar-blank'};
function kcard(id,sel,o={}){const v0=V[id];const v1=SCHED[id]?{...v0,when:SCHED[id],t:'c'}:v0;const v={...v1,when:v1.when.replace(/^venceu há (.+)$/,'$1 de atraso')};const w=KWHERE[id]||['road-horizon','Na estrada'];
  const inner=`<div class="kg"><div class="ka"><b title="${esc(v.name)}">${v.name}</b>${mark(v.parts)}</div><span class="kd ${v.t}">${ic(KDUE_IC[v.t]||'calendar-blank','s14')}${v.when}</span><div class="kpk" title="${esc(v.svc)}">${v.svc}</div><span class="kw">${ic(w[0],'s14')}${w[1]}</span></div>`;
  return F.kbCard(inner,{state:['cmp',id==='d1'||id==='d2'?'disabled':'',sel===id?'on':'',o.dragging?'dragging':'',o.ghost?'ghostc':''].join(' '),attrs:`data-id="${id}"`});}
/* the board: KanbanV2 of the DS (ColumnShell + CardShell from facter-tasks), proposed DS tweaks: no card border, flat header */
const KDUR={dly:'leva 4 h',q1a:'leva 1 h 10',rta:'leva 50 min',c072:'leva 50 min',q9b:'leva 1 h 10',c044:'leva 2 h 40',q6h:'leva 1 h',c118:'leva 1 h 30',rtf:'leva 50 min',c320:'leva 5 h 10',c207:'leva 2 h',d1:'levou 1 h 20',d2:'levou 40 min'};
const kindOf=v=>v.parts.length>1?'Conjunto':v.parts[0][1]==='cav'?'Cavalo':'Carreta';
function v2card(id,sel,o={}){const v0=V[id];const v1=SCHED[id]?{...v0,when:SCHED[id],t:'c'}:v0;const due=v1.when.replace(/^venceu há (.+)$/,'$1 de atraso');
  const w=KWHERE[id]||KWHERE_EXTRA[id]||['road-horizon','Na estrada'];const done=id==='d1'||id==='d2';
  const act=done?['arrow-square-out','Ver a OS']:SCHED[id]?['calendar-check','Remarcar']:w[1]==='No pátio'?['plus','Incluir na OS']:['calendar-check','Marcar dia'];
  const kind=kindOf(v0);
  return `<div class="v2card ${sel===id?'on':''} ${o.overlay?'ov':''} ${done?'fin':''}" data-id="${id}" role="button" tabindex="0"><div class="v2top"><div class="v2tl"><span class="v2key">${v0.name}${mark(v0.parts)}</span><h3>${v0.svc}</h3></div><span class="v2pri tone-${v1.t||'n'}">${due}</span></div>
    <div class="v2chips"><span class="v2chip">${ic(w[0],'s12')}${w[1]}</span><span class="v2chip">${ic('timer','s12')}${KDUR[id]||'leva 1 h'}</span>${/^\+\d/.test(v0.more)?`<span class="v2chip">${ic('stack','s12')}${v0.more.replace('nesta visita','preventiva')}</span>`:''}${/cronotac/.test(v0.svc)?'<span class="v2chip">Obrigatório</span>':''}</div>
    <div class="v2foot"><span class="v2kind">${ic(kind==='Cavalo'?'truck':'truck-trailer','s14')}${kind}</span><span class="v2act">${ic(act[0],'s12')}${act[1]}</span></div></div>`;}
const v2col=(title,count,body,o={})=>`<section class="v2col ${o.state?'kb-'+o.state:''}"><div class="v2h"><span class="v2dot st-${o.tone||'x'}"></span><h3>${title}</h3><span class="v2n">${count}</span></div>${o.top||''}<div class="v2b">${body||`<div class="v2empty">${o.empty||'Nada aqui'}</div>`}</div>${o.footer?`<div class="v2f">${o.footer}</div>`:''}${o.after||''}</section>`;
function kanban(s,sel){
  const drag=s==='drag', no=s==='dropno', toSched=s==='schedule'||s==='dropok';
  const cols=STAGES.map(st=>{
    let ids=st.ids.slice();
    if(toSched&&st.k==='todo')ids=ids.filter(i=>i!=='dly');
    let body=ids.map(id=>(drag||no)&&id==='dly'?'<div class="v2slot"></div>':v2card(id,sel)).join('');
    if(toSched&&st.k==='sched')body=v2card('dly','dly')+body;
    if(drag&&st.k==='sched')body=`<div class="kslot">${ic('calendar-plus','s16')}Soltar aqui para marcar o dia</div>`+body;
    const state=drag?(st.k==='sched'?'hover':st.k==='done'||st.k==='shop'?'no':''):no&&st.k==='shop'?'nodrop':'';
    const top=no&&st.k==='shop'?`<div class="krefuse">${ic('road-horizon','s16')}<span><b>DLY1J07 está na estrada.</b> Marque um dia na oficina.</span></div>`:'';
    const n=ids.length+(toSched&&st.k==='sched'?1:0);
    const after=(drag&&st.k==='sched')||(no&&st.k==='shop')?v2card('dly',null,{overlay:1}):'';
    return v2col(st.title,st.k==='todo'?(toSched?14:15):n,body,{state,top,after,tone:st.k,footer:st.k==='todo'?`<div class="more pg">Ver as 15 até 24/12${ic('caret-down','s14')}</div>`:st.k==='done'?'<p class="kdone">Feita vem da OS concluída</p>':''});});
  const chips=`<div class="kfil">${F.fchip('Todas',{on:1})}${F.fchip('Vencidas',{count:3})}${F.fchip('Esta semana',{count:3})}${F.fchip('Próximas',{count:9})}<i class="kdiv"></i><span class="ksort" role="button" aria-haspopup="menu">${ic('sort-ascending','s14')}Mais urgente primeiro${ic('caret-down','s12')}</span><span class="vsp"></span>${viewSeg('Quadro')}</div>`;
  return chips+`<div class="v2board">${cols.join('')}</div>`;}
/* phone kanban: stage tabs and horizontal snap columns */
function phoneKanban(s){const on=s==='kb2'?'sched':'todo';
  const tabs=`<div class="fx-mtabs jump stg">${STAGES.map(st=>`<span class="${st.k===on?'on':''}">${st.title}<b>${st.k==='todo'?15:st.ids.length}</b></span>`).join('')}</div>`;
  const cols=STAGES.map(st=>`<div class="kpc">${v2col(st.title,st.k==='todo'?15:st.ids.length,st.ids.slice(0,4).map(id=>v2card(id,null)).join(''),{tone:st.k})}</div>`).join('');
  return `<div class="ph-wrap pm pkban">${`<div class="phead"><div class="phr"><span class="pbase">Base Curitiba${ic('caret-down','s14')}</span><span class="pdate">qui 26/11</span></div></div>`}<div class="stick srow">${tabs}${viewSeg('Quadro')}</div><div class="ksnap ${on==='sched'?'at2':''}">${cols}</div><div class="safe"></div></div>`;}

/* ---------- Calendário: month and week, ported from the v1 design ---------- */
const FREE={'2026-11-26':0,'2026-11-27':0,'2026-11-28':6,'2026-11-29':-1,'2026-11-30':18,'2026-12-01':22,'2026-12-02':28,'2026-12-03':3,'2026-12-04':32,'2026-12-05':8};
const EV=[
  {d:'2026-11-23',id:'d2',k:'done',t:'s',txt:'QRT3K18 · Lubrificação 15 dias'},
  {d:'2026-11-24',id:'d1',k:'done',t:'s',txt:'C-512 · Preventiva 20 mil'},
  {d:'2026-11-26',id:'c320',k:'sched',t:'d',txt:'C-320 · Preventiva carreta 40 mil',h:[7,12]},
  {d:'2026-11-26',id:'c207',k:'sched',t:'d',txt:'C-207 · Inspeção semanal',h:[13,16]},
  {d:'2026-11-27',id:'c118',k:'sched',t:'w',txt:'C-118 · Inspeção semanal',h:[8,11]},
  {d:'2026-11-28',id:'dly',k:'pred',t:'d',txt:'DLY1J07 · Revisão 60 mil'},
  {d:'2026-11-29',id:'q1a',k:'pred',t:'w',txt:'QRT1A09 · Preventiva 20 mil'},
  {d:'2026-11-29',id:'rta',k:'pred',t:'w',txt:'RTA4A44 · Lubrificação 15 dias'},
  {d:'2026-12-03',id:'c072',k:'pred',t:'',txt:'C-072 · Munck 250 h'},
  {d:'2026-12-04',id:'q9b',k:'pred',t:'',txt:'QRT9B71 · Preventiva 20 mil'},
  {d:'2026-12-10',id:'c044',k:'pred',t:'',txt:'C-044 · Revisão 60 mil'},
  {d:'2026-12-14',id:'rtf',k:'sched',t:'',txt:'RTF2D10 · Lubrificação 15 dias'},
  {d:'2026-12-15',id:'q6h',k:'pred',t:'',txt:'QRT6H33 · Cronotacógrafo'},
  {d:'2026-12-18',id:'c118',k:'pred',t:'',txt:'C-118 · Preventiva 20 mil'},
];
const evChip=(e,o={})=>`<span class="ev ${e.k} ${o.sel?'on':''} ${o.drag?'dragging':''}" data-id="${e.id}" title="${esc(e.txt)}${e.k==='pred'?' · prevista pelo km':''}"><i class="dot ${e.t}"></i><span>${e.txt}</span></span>`;
const freeOf=d=>{if(FREE[d]!==undefined)return FREE[d];if(d<'2026-11-26')return undefined;const wd=new Date(d+'T12:00:00Z').getUTCDay();return wd===0?-1:wd===6?10:[24,20,30,16,28,22][+d.slice(8)%6];};
const loadBar=d=>{const f=freeOf(d);if(f===undefined)return '';if(f===-1)return '<span class="ld off">fechado</span>';const busy=Math.round((1-f/32)*100);return `<span class="ld ${f===0?'full':''}"><i><b style="width:${busy}%"></b></i>${f===0?'cheio':f+' h livres'}</span>`;};
const iso=(y,m,d)=>`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
function monthView(s,full){const days=[];for(let i=0;i<35;i++){const dt=new Date(Date.UTC(2026,10,(full?1:22)+i));days.push(iso(dt.getUTCFullYear(),dt.getUTCMonth()+1,dt.getUTCDate()));}
  const wd=['dom','seg','ter','qua','qui','sex','sáb'];
  return `<div class="mgrid">${wd.map(w=>`<span class="mwd">${w}</span>`).join('')}${days.map(d=>{const evs=EV.filter(e=>e.d===d);const other=full?d.slice(5,7)!=='11':d<'2026-11-26';const today=d==='2026-11-26';
    const over=(s==='cdrag'&&d==='2026-11-30')?'dropok':(s==='cno'&&d==='2026-11-26')?'dropno':'';
    const list=evs.map(e=>evChip(e,{sel:s==='visit'&&e.id==='c320',drag:(s==='cdrag'||s==='cno')&&e.id==='c118'})).join('');
    return `<div class="mcell ${other?'oth':''} ${over}"><span class="mday ${today?'today':''}">${+d.slice(8)}</span><div class="mevs">${over==='dropno'?'<span class="mrefuse">Dia cheio na oficina</span>':''}${list}${over==='dropok'?`<span class="ev ghost">${ic('calendar-plus','s12')}C-118 · remarcar para seg 30/11</span>`:''}</div>${loadBar(d)}</div>`;}).join('')}</div>`;}
function weekView(s){const days=['2026-11-22','2026-11-23','2026-11-24','2026-11-25','2026-11-26','2026-11-27','2026-11-28'];const hrs=[7,8,9,10,11,12,13,14,15,16,17,18];const H=44;
  const wd=['dom','seg','ter','qua','qui','sex','sáb'];
  const head=`<div class="wkh"><span></span>${days.map((d,i)=>`<div class="wkd ${d==='2026-11-26'?'today':''}"><small>${wd[i]}</small><b>${+d.slice(8)}</b>${loadBar(d)}</div>`).join('')}</div>`;
  const allday=`<div class="wkad"><span class="wkl">dia todo</span>${days.map(d=>`<div>${EV.filter(e=>e.d===d&&!e.h).map(e=>evChip(e)).join('')}</div>`).join('')}</div>`;
  const grid=`<div class="wkg" style="--H:${H}px"><div class="wkt">${hrs.map(h=>`<span>${h}h</span>`).join('')}</div>${days.map(d=>`<div class="wkc ${d==='2026-11-26'?'today':''}">${hrs.map(()=>'<i></i>').join('')}${EV.filter(e=>e.d===d&&e.h).map(e=>`<div class="wev ${e.k} ${s==='visit'&&e.id==='c320'?'on':''}" style="top:${(e.h[0]-7)*H}px;height:${(e.h[1]-e.h[0])*H-4}px" data-id="${e.id}"><i class="dot ${e.t}"></i><b>${e.txt.split(' · ')[0]}</b><span>${e.txt.split(' · ')[1]}</span><small>${e.h[0]}h às ${e.h[1]}h</small></div>`).join('')}${d==='2026-11-26'?`<div class="now" style="top:${(10.33-7)*H}px"></div>`:''}</div>`).join('')}</div>`;
  return `<div class="wkv">${head}${allday}<div class="wks">${grid}</div></div>`;}
function calHead(mode){return `<div class="calh"><div class="today"><small>nov</small><b>26</b></div><div class="cht"><h2>${mode==='week'?'22 a 28 de novembro de 2026':mode==='full'?'Novembro de 2026':'22 de novembro a 26 de dezembro'}</h2><p>${mode==='week'?'7 preventivas na semana':mode==='full'?'11 preventivas no mês':'15 preventivas nas próximas 5 semanas'}</p></div><span class="cnav">${ic('caret-left','s16')}</span><span class="cnav">${ic('caret-right','s16')}</span><span class="tbtn">Hoje</span><span style="flex:1"></span>${F.fchip('Todas as transportadoras',{menu:1})}<div class="vseg">${[['Próximas 5 semanas','month'],['Mês completo','full'],['Semana','week']].map(([l,m])=>`<span class="${m===mode?'on':''}">${l}</span>`).join('')}</div>${viewSeg('Calendário')}</div>
  <div class="clegend"><span><i class="ev sched"></i>agendada</span><span><i class="ev pred"></i>prevista pelo km por dia</span><span><i class="ldk"></i>ocupação da oficina</span></div>`;}
function calWeb(s,dev){if(dev==='tabp'){return calWeb(s==='visit'?'week':s==='month'?'week':s,'webs').replace('class="bd calv"','class="bd calv tpv"')+(s==='visit'?visitDrawer('visit',1):'');}
  if(s==='loading') return `<div class="bd calv">${vtop('Calendário')}<div class="calbox">${F.sk('40%',28)}<div style="height:14px"></div>${F.sk('100%',560,16)}</div></div>`;
  if(s==='empty') return `<div class="bd calv">${vtop('Calendário')}<div class="calbox">${calHead('month')}${emptyBlock('first').replace('A agenda começa com um plano','Nada marcado nem previsto neste mês').replace(/<p>Um plano[^<]*<\/p>/,'<p>As preventivas aparecem aqui quando um plano prevê a próxima pelo km por dia ou quando alguém marca um dia.</p>')}</div></div>`;
  const mode=s==='week'?'week':s==='full'?'full':'month';
  const note=s==='cno'?`<div class="krefuse cal">${ic('warning','s16')}<span><b>Não dá para remarcar para qui 26/11.</b> A oficina está cheia nesse dia.</span></div>`:'';
  const dr=s==='visit'?visitDrawer('visit',0):'';
  return `<div class="bd calv">${vtop('Calendário')}<div class="calbox">${calHead(mode)}${note}${mode==='week'?weekView(s):monthView(s,mode==='full')}</div>${dr}</div>`;}
function calPhone(s){
  if(s==='visit') return calPhone('month')+visitDrawer('visit',1);
  const strip=['2026-11-22','2026-11-23','2026-11-24','2026-11-25','2026-11-26','2026-11-27','2026-11-28'];const wd=['D','S','T','Q','Q','S','S'];
  const head=`<div class="phead"><div class="pcrow"><span>Novembro de 2026</span>${viewSeg('Calendário')}</div><div class="wstrip">${strip.map((d,i)=>`<span class="${d==='2026-11-26'?'on':''}"><small>${wd[i]}</small><b>${+d.slice(8)}</b>${EV.some(e=>e.d===d)?'<i></i>':''}</span>`).join('')}</div></div>`;
  if(s==='loading') return `<div class="ph-wrap pm">${head}${[1,2,3].map(()=>`<div class="cd sk-cd" style="margin-top:12px"><span class="sk" style="width:55%;height:15px"></span><span class="sk" style="width:80%;height:12px;margin-top:10px"></span></div>`).join('')}</div>`;
  if(s==='empty') return `<div class="ph-wrap pm">${head}${emptyBlock('first',1).replace('A agenda começa com um plano','Nada marcado nem previsto').replace(/<p>Um plano[^<]*<\/p>/,'<p>As preventivas aparecem aqui quando um plano prevê a próxima ou alguém marca um dia.</p>')}</div>`;
  const days=['2026-11-26','2026-11-27','2026-11-28','2026-11-29','2026-12-03'];const lab={'2026-11-26':'Hoje, qui 26/11','2026-11-27':'Amanhã, sex 27/11','2026-11-28':'sáb 28/11','2026-11-29':'dom 29/11','2026-12-03':'qui 03/12'};
  const groups=days.map(d=>`<section class="agd"><h3 class="msh"><span>${lab[d]}</span><span class="agl">${loadBar(d)}</span></h3><div class="mcards">${EV.filter(e=>e.d===d).map(e=>`<div class="agc ${e.k}" data-id="${e.id}"><i class="dot ${e.t}"></i><div><b>${e.txt.split(' · ')[0]}</b><span>${e.txt.split(' · ')[1]}</span></div><small>${e.k==='pred'?'prevista':e.h?e.h[0]+'h às '+e.h[1]+'h':''}</small></div>`).join('')}</div></section>`).join('');
  return `<div class="ph-wrap pm">${head}${groups}<div class="safe"></div></div>`;}

function sheetFor(s){return isVisit(s)?visitDrawer(s,1):s==='schedule'||s==='dropok'?`<div class="sheet-ov"><div class="sheet">${pHead(V.dly,{...HDLY,phone:1})}<div class="sb">${scheduleBody()}</div>${scheduleFoot()}</div></div>`:'';}
function web(s,dev){if(dev==='tabl'||dev==='tabp'){KCOMPACT=true;let out;
    if(dev==='tabl'){out=web(s,'webs').replace('class="bd ','class="bd tlv ');}
    else{const base=isVisit(s)||s==='schedule'||s==='dropok'?'board':s;out=web(base,'webs').replace('class="bd ','class="bd tpv ')+sheetFor(s);}
    KCOMPACT=false;return out;}if(s==='drag'||s==='dropno')return web('kbdrag:'+s,dev);if(s.startsWith('kbdrag:')){const st=s.slice(7);return `<div class="bd kbv ${dev==='webs'?'s':''}">${slim().replace(nokm(),segView('Por veículo')+nokm())}${kanban(st,null)}</div>`;}if(s==='dropok')s='schedule';if(s==='pk044')return withPk044(web('board',dev),0);if(STRESS[s])return stressWeb(s,dev);KITOPEN=s==='kitopen';
  const small=dev==='webs';
  if(s==='loading') return `<div class="bd kbv"><div class="hero slim">${F.sk(48,40,12)}<div class="tx" style="display:flex;flex-direction:column;gap:8px">${F.sk(260,18)}${F.sk(180,12)}</div></div><div class="kfil"><span class="vsp"></span>${viewSeg('Quadro')}</div><div class="v2board">${STAGES.map(st=>v2col(st.title,'',[1,2,3].map(()=>`<div class="v2card">${F.sk('40%',12)}${F.sk('80%',16)}${F.sk('60%',20,99)}</div>`).join(''),{tone:st.k})).join('')}</div></div>`;
  if(s==='empty') return `<div class="bd kbv">${vtop('Quadro')}<div class="hero slim"><span class="halo sm">${ic('calendar-check','s20')}</span><div class="tx"><h2>Frota em dia esta semana</h2><p>A próxima é a Revisão 60 mil do C-044, na qui 10/12.</p></div></div><div class="kfil"><span class="vsp"></span>${viewSeg('Quadro')}</div><div class="v2board">${v2col('A agendar',2,v2card('c044',null)+v2card('q6h',null),{tone:'todo'})}${v2col('Agendada',0,'',{empty:'Nada agendado',tone:'sched'})}${v2col('Na oficina',0,'',{empty:'Nenhum conjunto na oficina',tone:'shop'})}${v2col('Feita (7 dias)',2,v2card('d1',null)+v2card('d2',null),{tone:'done'})}</div></div>`;
  PICK=s==='multi'||s==='multisched';
  if(s==='first'||s==='noperm') return `<div class="bd ${small?'s':''}">${emptyBlock(s)}</div>`;
  if(/^nores/.test(s)) return `<div class="bd ${small?'s':''}"><div class="hero slim"><div class="tx"><h2>Busca na Base Curitiba</h2></div>${searchOn()}</div>${searchBlock(s)}</div>`;
  if(s==='byservice'){const [o,w,n]=GROUPS_ALL;return `<div class="bd ${small?'s':''}"><div class="hero slim"><span class="big">5</span><div class="tx"><h2>preventivas vencidas</h2><p>em <b>4 serviços</b></p></div>${segView('Por serviço')}</div><div class="cols">${svcColumn(o,'over')}${svcColumn(w,'week')}${svcColumn(n,'next')}</div>${svcDrawer()}</div>`;}
  DONE=s==='done';const [over,week,next]=gs();
  if(s==='empty') return `<div class="bd ${small?'s':''}">${slim({empty:1})}<div class="cols">${column(over,null,'Nada vencido')}${column(week,null,'Nada vence esta semana')}${column({...next,count:'9 veículos'},null)}</div></div>`;
  DONE=s==='done';const sel=s==='done'?null:s==='schedule'?'dly':isVisit(s)?'c320':null;
  const dr=s==='schedule'?drawer(`${pHead(V.dly,HDLY)}<div class="pb">${scheduleBody()}</div>${scheduleFoot()}`)
    :isVisit(s)?visitDrawer(s,0):'';
  const top=s==='error'?errNote():'';
  const hero=s==='sap'?slim().replace(nokm(),sapChip()):slim().replace(nokm(),segView('Por veículo')+nokm());
  const md=s==='multisched'?multiDrawer(0):'';
  return `<div class="bd kbv ${small?'s':''}">${hero}${top}${kanban(s,sel)}${dr}${md}${s==='multi'?selBar():''}</div>`;
}

/* ---------- phone: sticky tabs, one list at a time; the overdue count stays in the first tab ---------- */
const tabs=on=>`<div class="seg3" role="tablist">${[['over','Vencidas',N().over,'d'],['week','Semana',N().week,'w'],['next','Próximas','9','']].map(([k,l,n,t])=>`<span class="${k===on?'on':''}" role="tab">${l}<b class="${t}">${n}</b></span>`).join('')}</div>`;
/* =====================================================================
   Phone: one continuous list with sticky section headers; the segmented
   control jumps between sections and follows the one in view
   ===================================================================== */
const CTX={c320:['s','garage','No pátio · OS 1042','Incluir'],c207:['s','garage','No pátio · OS 1051','Incluir'],dly:['n','road-horizon','Na estrada · 640 km/dia','Marcar dia'],
  c118:['p','calendar-check','Agendado sex 27/11',''],q1a:['n','road-horizon','Na estrada · 710 km/dia','Marcar dia'],rta:['n','garage','Parada na base','Marcar dia'],
  c072:['n','road-horizon','Na estrada · 580 km/dia','Marcar dia'],q9b:['n','road-horizon','Na estrada · 600 km/dia','Marcar dia'],c044:['n','road-horizon','Na estrada · 610 km/dia','Marcar dia'],
  q6h:['n','road-horizon','Na estrada · 520 km/dia','Marcar dia'],rtf:['p','calendar-check','Agendado seg 14/12',''],c320d:['s','garage','No pátio · OS 1042','Incluir']};
function mcard(id,o={}){const v=V[id];const c=CTX[id]||['n','road-horizon','Na estrada',''];
  const body=`<div class="l1"><b title="${esc(v.name)}">${v.name}</b>${mark(v.parts)}<span class="when ${v.t}">${v.when}</span></div><div class="l2"><span>${v.svc}</span>${/cronotac/.test(v.svc)?'<span class="tag">Obrigatório</span>':''}${pillMore(v)}${v.tag?'<span class="tag">adiada · falta peça</span>':''}</div>
    <div class="l3"><span class="cx ${c[0]}">${ic(c[1],'s14')}${c[2]}</span>${c[3]?`<span class="cact">${c[3]}</span>`:''}</div>`;
  if(o.swipe) return `<div class="swp"><div class="swa"><span class="sw-d">${ic('clock-countdown','s16')}Adiar</span><span class="sw-p">${ic('calendar-check','s16')}Marcar dia</span></div><div class="cd mc sw" role="button">${body}</div></div>`;
  return `<div data-id="${id}" class="cd mc ${o.sel===id?'on':''} ${o.press===id?'pressed':''}" role="button" tabindex="0">${body}</div>`;}
function mobileList(s,o={}){
  const g=gs(), on=s==='mid'?'week':'over';
  const sel=o.sel, total=N().over+N().week+9;
  const bar=`<div class="wbar">${[['d',N().over],['w',N().week],['n',9]].map(([t,n])=>`<i class="${t}" style="flex:${n}"></i>`).join('')}</div><div class="wlab"><span class="d"><b>${N().over}</b> vencidos</span><span class="w"><b>${N().week}</b> nesta semana</span><span><b>9</b> depois</span></div>`;
  const hero=o.list?'':`<div class="hero slim mh ov"><span class="big">${N().big}</span><div class="tx"><h2>preventivas vencidas</h2><p>em <b>${N().veh} veículos</b>, <b>${N().yard}</b> já no pátio</p></div>${bar}</div>`;
  const ctx=`<div class="phead ${o.list?'lst':''}"><div class="phr"><span class="pbase">Base Curitiba${ic('caret-down','s14')}</span><span class="pdate">qui 26/11</span></div><span class="psearch">${ic('magnifying-glass','s16')}<span>Buscar placa, frota ou conjunto</span></span></div>`;
  const ptr=s==='ptr'?`<div class="ptr">${ic('arrows-clockwise','s16')}<span>Atualizando a agenda</span></div>`:'';
  const jump=o.list?`<div class="fx-mtabs jump">${[['over','Vencidas',N().over,'d'],['week','Esta semana',N().week,'w'],['next','Próximas',9,'']].map(([k,t,n,c])=>`<span class="${k===on?'on':''}">${t}<b class="${c}">${n}</b></span>`).join('')}</div>`
    :`<div class="fx-mtabs jump" role="tablist">${[['over','Vencidas',N().over,'d'],['week','Esta semana',N().week,'w'],['next','Próximas',9,'']].map(([k,l,n,t])=>`<span class="${k===on?'on':''}" role="tab">${l}<b class="${t}">${n}</b></span>`).join('')}</div>`;
  const secs=g.slice(0,3).map((gr,i)=>`<section class="msec" data-sec="${['over','week','next'][i]}"><h3 class="msh"><span class="gt ${gr.tone}">${ic(gr.icon,'s14')}</span>${gr.title}<span class="gc ${gr.tone}">${gr.count.split(' ')[0]}</span></h3><div class="mcards">${gr.ids.map((id,j)=>o.list?(s==='swipe'&&id==='dly'?`<div class="swp"><div class="swa"><span class="sw-d">${ic('clock-countdown','s16')}Adiar</span><span class="sw-p">${ic('calendar-check','s16')}Marcar dia</span></div>${lcard(id,sel).replace('fx-wocard lcard','fx-wocard lcard sw')}</div>`:lcard(id,sel).replace('fx-wocard lcard','fx-wocard lcard'+(s==='press'&&id==='c320'?' pressed':''))):mcard(id,{sel,press:s==='press'?'c320':null,swipe:s==='swipe'&&id==='dly'})).join('')}${gr.more?`<div class="more">${gr.more}${ic('caret-down','s14')}</div>`:''}</div></section>`).join('');
  return `<div class="ph-wrap pm ${o.list?'pml':''}">${ctx.replace('<div class="phr">',ptr+'<div class="phr">')}${hero}${s==='error'?errNoteM():''}<div class="stick srow">${jump}${viewSeg(o.list?'Lista':'Quadro')}</div>${secs}${nokm()}<div class="safe"></div></div>`;
}
const PHONE_ONLY={ptr:1,mid:1,press:1,swipe:1};
function phone(s){if(s==='pk044')return phone('list')+pk044Drawer(1);if(STRESS[s])return stressPhone(s,0);KITOPEN=s==='kitopen';DONE=s==='done';PICK=null;
  if(s==='first'||s==='noperm') return `<div class="ph-wrap">${emptyBlock(s,1)}</div>`;
  if(/^nores/.test(s)) return `<div class="ph-wrap">${searchOn()}${searchBlock(s,1)}</div>`;
  if(s==='loading') return `<div class="ph-wrap pm pkban"><div class="phead"><div class="phr"><span class="pbase">Base Curitiba${ic('caret-down','s14')}</span><span class="pdate">qui 26/11</span></div></div><div class="ksnap"><div class="kpc">${v2col('A agendar','',[1,2,3].map(()=>`<div class="v2card">${F.sk('40%',12)}${F.sk('80%',16)}${F.sk('60%',20,99)}</div>`).join(''),{tone:'todo'})}</div></div></div>`;
  if(s==='__old_loading') return `<div class="ph-wrap"><div class="hero slim"><span class="sk" style="width:40px;height:40px;border-radius:12px"></span><span class="sk" style="width:200px;height:18px"></span></div><span class="sk" style="width:100%;height:44px;border-radius:12px"></span>${[1,2,3,4].map(()=>`<div class="cd sk-cd"><span class="sk" style="width:55%;height:15px"></span><span class="sk" style="width:80%;height:12px;margin-top:10px"></span></div>`).join('')}</div>`;
  if(s==='empty') return phoneKanban('list').replace(/<div class="ksnap[\s\S]*<div class="safe">/,`<div class="bempty ph" style="margin-top:12px"><span class="halo md">${ic('calendar-check','s24')}</span><b>Frota em dia esta semana</b><p>A próxima é a Revisão 60 mil do C-044, na qui 10/12.</p></div><div class="safe">`);
  if(s==='__old_empty') return `<div class="ph-wrap"><div class="hero slim"><span class="halo sm">${ic('calendar-check','s20')}</span><div class="tx"><h2>Frota em dia esta semana</h2><p>A próxima é a Revisão 60 mil do C-044, na qui 10/12.</p></div></div><div class="stick">${tabs('next').replace('<b class="d">3</b>','<b>0</b>').replace('<b class="w">3</b>','<b>0</b>')}</div><div class="cards">${GROUPS_ALL[2].ids.map(id=>card(id,null)).join('')}<div class="more">${GROUPS_ALL[2].more}${ic('caret-down','s14')}</div></div></div>`;
  DONE=s==='done';const sel=s==='list'||s==='error'||PHONE_ONLY[s]?null:s==='schedule'?'dly':'c320';
  if(s==='list'||s==='kb2')return phoneKanban(s);
  const list=mobileList(s,{sel});
  if(s==='error'||PHONE_ONLY[s]) return list;
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
  return `<div class="fx-aprow lrow ${sel===id?'on':''} ${pk?'picked':''}" data-id="${id}" role="button" tabindex="0">
    <div class="m"><div class="l1">${PICK?cbx(PICK&&MULTI.includes(id)):''}<b class="nm">${v.name}</b>${mark(v.parts)}<span class="trunc2">${v.svc}</span>${v.tag?'<span class="tag">adiada · falta peça</span>':''}</div>
      <div class="l2"><span class="nw">${m.pos}</span>${more}${dotSep}<span class="trunc2">${m.where}</span></div></div>
    <div class="apst"><b class="${v.t||'n'}">${v.when.replace('venceu há ','')}</b><span>${m.sub}</span></div>
    <div class="apss">${btn(m.act,{variant:'secondary',size:'sm'})}</div>
    ${ic('caret-right','s16 car')}</div>`;}
const lsub=g=>`<div class="lsub"><span class="gt ${g.tone}">${ic(g.icon,'s14')}</span><b>${g.title}</b><span class="n">${g.count}</span></div>`;
const LTABS=[['Todas',17],['Vencidas',3],['Esta semana',3],['Próximas',9],['Sem km',2]];
function listTop(o={}){
  const head=vtop('Lista')+F.pageHeader('Agenda','O que trazer para a oficina, e quando.',`${F.fchip('Base Curitiba',{menu:1})}${btn('Ver planos',{variant:'outline',icon:'list-checks'})}`);
  const kpi=`<div class="fx-kpi4">${[['Vencidas',o.zero?0:5,'d'],['Vencem esta semana',4,'w'],['Próximas semanas',14,''],['Sem km',2,'']].map(([l,v,t])=>`<div><p>${l}</p><b class="k${v?t:''}">${v}</b></div>`).join('')}</div>`;
  const tools=`<div class="ltools">${F.search('Buscar placa, frota ou conjunto',{width:340})}${F.fchip('Todas as transportadoras',{menu:1})}${F.fchip('Todos os planos',{menu:1})}<span class="vsp"></span>${viewSeg('Lista')}</div>`;
  return head+`<div class="lstack"><div class="lstack s">${F.dtabs([['Todas',17-(DONE?0:0)],['Vencidas',N().over],['Esta semana',N().week],['Próximas',9],['Sem km',2]],o.tab||'Todas')}${tools}`;
}
function listWeb(s,dev){if(dev==='tabp'){const base=isVisit(s)||s==='schedule'?'list':s;return listWeb(base).replace('class="lv"','class="lv tpv"')+sheetFor(s);}if(s==='pk044')return withPk044(listWeb('list'),0);if(STRESS[s])return stressList(s);KITOPEN=s==='kitopen';DONE=s==='done';PICK=s==='multi'||s==='multisched';
  if(s==='first'||s==='noperm') return `<div class="lv">${vtop('Lista')}${F.pageHeader('Agenda','O que trazer para a oficina, e quando.','')}${emptyBlock(s)}</div>`;
  DONE=s==='done';const sel=s==='schedule'?'dly':isVisit(s)?'c320':null;
  let body;
  if(s==='loading') body=`<div style="display:flex;flex-direction:column;gap:8px">${[1,2,3,4,5].map(()=>F.sk('100%',64)).join('')}</div>`;
  else if(/^nores/.test(s)) body=searchBlock(s);
  else if(s==='empty') body=`<div class="lempty">${F.empty({icon:'calendar-check',title:'Nada vencido',hint:'Uma preventiva aparece aqui quando passa do prazo. A próxima vence sáb 28/11, na Inspeção semanal do C-118.',action:btn('Ver esta semana',{variant:'outline'})})}</div>`;
  else body=`<div class="fx-wolist llist">${gs().map(g=>lsub(g)+g.ids.map(id=>lrow(id,sel)).join('')).join('')}</div>${btn('Carregar mais',{variant:'outline'}).replace('fx-btn','fx-btn lmore')}`;
  const dr=s==='schedule'?drawer(`${pHead(V.dly,HDLY)}<div class="pb">${scheduleBody()}</div>${scheduleFoot()}`)
    :isVisit(s)?visitDrawer(s,0):'';
  const lt=listTop({tab:s==='empty'?'Vencidas':'Todas',zero:s==='empty'});
  const top=(/^nores/.test(s)?lt.replace(F.search('Buscar placa, frota ou conjunto',{width:340}),searchOn()):s==='sap'?lt.replace('<div class="ltools">','<div class="ltools">'+sapChip()):lt);
  return `<div class="lv">${top}${s==='error'?errNote():''}${body}</div></div></div>${dr}${s==='multisched'?multiDrawer(0):''}${s==='multi'?selBar():''}</div>`;
}
function lcard(id,sel,o={}){const v=V[id],m=LM[id];
  return `<button type="button" data-id="${id}" class="fx-wocard lcard ${sel===id?'on':''}"><span class="l1"><b class="nm">${v.name}</b>${mark(v.parts)}<span style="flex:1"></span><span class="lwhen ${v.t}">${v.when}</span></span>
    <span class="l3">${v.svc}${v.tag?' <span class="tag">adiada · falta peça</span>':''}</span><span class="l4"><span class="trunc2">${m.pos}${/^\+\d/.test(v.more)?' · '+v.more:''}</span></span>
    <span class="ft">${(c=>`<span class="cx ${c[0]}">${ic(c[1],'s14')}${c[2]}</span><span style="flex:1"></span>${c[3]?`<span class="lact">${c[3]}</span>`:''}`)(CTX[id]||['n','road-horizon',m.where,m.act])}</span></button>`;}
function listPhone(s){if(s==='pk044')return listPhone('list')+pk044Drawer(1);if(STRESS[s])return stressPhone(s,1);KITOPEN=s==='kitopen';DONE=s==='done';PICK=null;
  if(s==='first'||s==='noperm') return `<div class="fx-mlist"><div class="fx-mcards">${emptyBlock(s,1)}</div></div>`;
  const tabsM=on=>`<div class="fx-mtabs">${[['Vencidas',N().over,'d'],['Esta semana',N().week,'w'],['Próximas',9,''],['Sem km',2,'']].map(([t,n,c])=>`<span class="${t===on?'on':''}">${t}<b class="${c}">${n}</b></span>`).join('')}</div>`;
  const search=`<div class="fx-msearch"><span class="fx-searchf" style="flex:1;height:44px;font-size:14px">${ic('magnifying-glass','s16')}<span class="trunc2">Buscar placa, frota ou conjunto</span></span><span class="fx-btn outline icon" style="height:44px;width:44px">${ic('sliders-horizontal','s20')}</span></div>`;
  let body;
  if(s==='loading') body=[1,2,3].map(()=>`<div class="fx-wocard sk">${F.sk('40%',16)}${F.sk('60%',22)}${F.sk('100%',36)}${F.sk('100%',28)}</div>`).join('');
  else if(s==='empty') body=F.empty({icon:'calendar-check',title:'Nada vencido',hint:'A próxima vence sáb 28/11, na Inspeção semanal do C-118.'});
  else if(s==='first'||s==='noperm') body=emptyBlock(s,1);
  else if(/^nores/.test(s)) body=searchBlock(s,1);
  if(s==='error') body=errNoteM()+gs()[0].ids.map(id=>lcard(id,null)).join('');
  DONE=s==='done';const sel=s==='schedule'?'dly':isVisit(s)?'c320':null;
  if(!body||PHONE_ONLY[s]){const list=mobileList(s,{list:1,sel:PHONE_ONLY[s]?null:sel});
    if(!isVisit(s)&&s!=='schedule') return list;
    return list+(s==='schedule'?`<div class="sheet-ov"><div class="sheet">${pHead(V.dly,{...HDLY,phone:1})}<div class="sb">${scheduleBody()}</div>${scheduleFoot()}</div></div>`:visitDrawer(s,1));}
  const list=`<div class="fx-mlist"><div class="fx-msticky">${/^nores/.test(s)?`<div class="fx-msearch">${searchOn()}</div>`:search}${tabsM('Vencidas').replace(s==='empty'?'<b class="d">3</b>':'@@','<b>0</b>')}</div><div class="fx-mcards">${body}</div><div style="height:72px"></div></div>`;
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
    const dv=app.getAttribute('device');const ctl=app.querySelector('.fx-ctl');const right=app.querySelector('.fx-right');
    if(ctl&&right&&dv!=='web'&&!right.contains(ctl)){right.insertBefore(ctl,right.querySelector('.fx-me'));ctl.classList.add('ctxpill');}
  });
}
function texture(){document.querySelectorAll('.fx-device.phone .fx-screen').forEach(sc=>{const has=!!sc.querySelector('.pm');let t=sc.querySelector(':scope>.ptex');
  if(has&&!t){t=document.createElement('div');t.className='ptex';t.setAttribute('aria-hidden','true');sc.prepend(t);}
  if(!has&&t)t.remove();
  if(has&&t){const z=parseFloat(getComputedStyle(sc.closest('.fx-device')).zoom)||1;const ph=sc.querySelector('.phead');const nb=sc.querySelector('.fx-navbar');const ref=ph&&ph.offsetHeight>20?ph:nb;if(ref)t.style.height=Math.round((ref.getBoundingClientRect().bottom-sc.getBoundingClientRect().top)/z)+'px';}});}
function lift(){texture();document.querySelectorAll('.fx-device.phone,.fx-device.tablet-p').forEach(d=>{const ov=d.querySelector('.fx-body .sheet-ov');if(ov) d.querySelector('.fx-screen').appendChild(ov);});}
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
function midScroll(k,s){document.querySelectorAll(`[data-render="${k}"]`).forEach(el=>{const body=el.closest('.fx-body');if(!body)return;const st=el.querySelector('.stick');const h=st?st.offsetHeight+parseFloat(getComputedStyle(st).top||0):48;el.querySelectorAll('.msh').forEach(x=>x.style.top=h+'px');body.scrollTop=0;const t=el.querySelector('[data-sec="week"]');if(s==='mid'&&t){const z=parseFloat(getComputedStyle(body.closest('.fx-device')).zoom)||1;body.scrollTop=(t.getBoundingClientRect().top-body.getBoundingClientRect().top)/z-h-12;}});}
/* ---------- "Cartão do quadro · 3 opções": the same four cards in each option ---------- */
const CC=[
  {id:'dly',name:'DLY1J07',kind:'cavalo',parts:V.dly.parts,pkg:'Revisão 60 mil',more:'',due:'4.300 km de atraso',t:'d',where:['road-horizon','Na estrada'],dur:'leva 4 h',blk:['4,3 mil','km atrasada']},
  {id:'c320',name:'Conjunto C-320',kind:'conjunto',parts:V.c320.parts,pkg:'Preventiva carreta 40 mil',more:'+2 preventivas',due:'1.850 km de atraso',t:'d',where:['garage','No pátio'],dur:'leva 5 h 10',blk:['1,9 mil','km atrasada'],tails:['B22','K38','J77','H46']},
  {id:'q1a',name:'QRT1A09',kind:'cavalo',parts:V.q1a.parts,pkg:'Preventiva 20 mil',more:'',due:'dom 29/11',t:'w',where:['road-horizon','Na estrada'],dur:'leva 1 h 10',blk:['29','nov']},
  {id:'c072',name:'C-072',kind:'conjunto',parts:V.c072.parts,pkg:'Munck 250 h',more:'',due:'seg 07/12',t:'',where:['road-horizon','Na estrada'],dur:'leva 50 min',blk:['07','dez'],tails:['F80','H22']}];
const DUEIC={d:'warning',w:'clock','':'calendar-blank'};
const ccTails=c=>c.tails||[c.name.slice(-3)];
function cardOpt(opt,c){
  const due=`<span class="cdue ${c.t}">${ic(DUEIC[c.t],'s14')}${c.due}</span>`;
  const where=`<span class="cwh">${ic(c.where[0],'s14')}${c.where[1]}</span>`;
  if(opt==='atual') return `<div class="ccard"><div class="kg"><div class="ka"><b>${c.name.replace('Conjunto ','')}</b>${mark(c.parts)}</div><span class="kd ${c.t}">${ic(DUEIC[c.t],'s14')}${c.due}</span><div class="kpk">${c.pkg}</div><span class="kw">${ic(c.where[0],'s14')}${c.where[1]}</span></div></div>`;
  if(opt==='ds'){const act=c.where[1]==='No pátio'?['plus','Incluir na OS 1042']:['calendar-check','Marcar dia na oficina'];
    return `<div class="fx-kb-card dsc ${c.hover?'hov':''}"><div class="dst"><span class="dsch tone-${c.t||'n'}">${ic(DUEIC[c.t],'s12')}${c.due}</span><span class="dsch">${ic(c.where[0],'s12')}${c.where[1]}</span></div>
      <h4 class="dstt"><span>${c.name}</span>${mark(c.parts)}</h4>
      <div class="dsrow em">${ic('wrench','s14')}<span>${c.pkg}</span></div>
      <div class="dsrow">${ic('timer','s12')}<span>${c.dur}${c.more?` · ${c.more}`:''}</span></div>
      <button type="button" class="dsact">${ic(act[0],'s14')}${act[1]}</button></div>`;}
  if(opt==='v2'){const act=c.where[1]==='No pátio'?['plus','Incluir na OS']:['calendar-check','Marcar dia'];
    return `<div class="v2card ${c.overlay?'ov':''}"><div class="v2top"><div class="v2tl"><span class="v2key">${c.name.replace('Conjunto ','')}${mark(c.parts)}</span><h3>${c.pkg}</h3></div><span class="v2pri tone-${c.t||'n'}">${c.due}</span></div>
      <div class="v2chips"><span class="v2chip">${ic(c.where[0],'s12')}${c.where[1]}</span><span class="v2chip">${ic('timer','s12')}${c.dur}</span>${c.more?`<span class="v2chip">${ic('stack','s12')}${c.more}</span>`:''}</div>
      <div class="v2foot"><span class="v2kind">${ic(c.kind==='cavalo'?'truck':'truck-trailer','s14')}${c.kind==='cavalo'?'Cavalo':'Conjunto'}</span><span class="v2act">${ic(act[0],'s12')}${act[1]}</span></div></div>`;}
  if(opt==='a') return `<div class="ccard ca"><span class="cvt">${ic(c.kind==='cavalo'?'truck':'truck-trailer','s20')}</span><div class="cab"><div class="cr1"><b>${c.name}</b>${mark(c.parts)}</div><div class="cr2">${c.pkg}${c.more?` <span class="cmore">${c.more.split(' ')[0]}</span>`:''}</div><div class="cr3"><span class="ctags"><span class="ctag">${ic(c.where[0],'s12')}${c.where[1]}</span></span><b class="cprice ${c.t||'p'}">${c.due}</b></div></div></div>`;
  if(opt==='b') return `<div class="ccard cb"><span class="cblk ${c.t}"><b>${c.blk[0]}</b><small>${c.blk[1]}</small></span><div class="cab"><div class="cr1"><b>${c.name}</b>${mark(c.parts)}${c.more?`<span class="cmore">${c.more.split(' ')[0]}</span>`:''}</div><div class="cr2">${c.pkg}</div><div class="cr4">${where}<span class="cdot">·</span><span>${c.dur}</span></div></div></div>`;
  const segs=c.parts.map(([p,k,st],i)=>`<span class="cseg ${k==='cav'?'cav':''} ${st==='d'?'d':''}">${st==='d'?ic('warning','s12'):''}${ccTails(c)[i]||p.slice(-3)}</span>`).join('');
  return `<div class="ccard cc"><div class="cstrip"><b>${c.name}</b><span class="csegs">${segs}</span></div><div class="cr5"><span class="cpk">${c.pkg}${c.more?` <span class="cmore">${c.more.split(' ')[0]}</span>`:''}</span>${due}</div><div class="cr4">${where}<span class="cdot">·</span><span>${c.dur}</span></div></div>`;}
function cardCompare(){
  const OPTS=[['ds','Kanban (história do DS)','Kanban.Column e o cartão da história: etiquetas no topo, título, linhas e a ação rápida que aparece ao passar o mouse (mostrada no primeiro)'],['v2','KanbanV2 (facter-tasks)','ColumnShell com o topo em tom e o contador; CardShell do facter-tasks: chave, título, prioridade, etiquetas e rodapé. O segundo cartão está sendo arrastado'],['atual','Atual','O cartão de hoje, só para comparar']];
  const col=(opt,w)=>opt==='v2'?`<div class="ccol" style="width:${w}px"><div class="v2col"><div class="v2h"><span class="v2dot"></span><h3>A agendar</h3><span class="v2n">15</span><span class="v2plus">${ic('plus','s16')}</span></div><div class="v2b">${CC.map((c,i)=>i===1?`<div class="v2slot"></div>`:cardOpt('v2',c)).join('')}</div>${cardOpt('v2',{...CC[1],overlay:1})}</div></div>`:`<div class="ccol ${opt==='ds'?'dsstory':''}" style="width:${w}px"><div class="fx-kb-col"><div class="fx-kb-h"><h3>A agendar</h3><span class="n">15</span></div><div class="fx-kb-b">${CC.map((c,i)=>cardOpt(opt,{...c,hover:i===0})).join('')}</div></div></div>`;
  return `<div class="cmpgrid">${OPTS.map(([k,t,d])=>`<div class="copt"><h3>${t}</h3><p>${d}</p>${col(k,300)}</div>`).join('')}</div>
  <h3 class="cmph">No celular</h3><div class="cmpgrid ph">${OPTS.map(([k,t])=>`<div class="copt"><h3>${t}</h3>${col(k,358)}</div>`).join('')}</div>`;}
const R={cards:()=>cardCompare(),cw:(s,dev)=>{clean('cw');setTimeout(lift);return calWeb(s,dev);},cpl:()=>calPhone('month'),cps:(s)=>{clean('cps');setTimeout(lift);return calPhone(s);},a320:()=>phone('sBig'),a720:()=>phone('sLong'),ag:(s,dev)=>{clean('ag');setTimeout(lift);return web(s,dev);},phl:()=>phone('list'),phs:(s)=>{clean('phs');setTimeout(()=>{lift();midScroll('phs',s);});return phone(s);},lg:(s,dev)=>{clean('lg');setTimeout(lift);return listWeb(s,dev);},lpl:()=>listPhone('list'),lps:(s)=>{clean('lps');setTimeout(()=>{lift();midScroll('lps',s);});return listPhone(s);}};
function boot(){patchNav();F.bind(R);lift();views();themes();
  document.querySelectorAll('.states button').forEach(b=>b.addEventListener('click',()=>setTimeout(lift)));
  let t;window.addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(fit,120);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot));else setTimeout(boot);
})();
