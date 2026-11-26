/* preventiva: screens of the preventive maintenance mockup, on top of ../_kit/kit.js (window.FX) */
(function(){
const F=window.FX, ic=F.ic, esc=F.esc;
const tile=(tone,icon,size)=>F.tile(tone,icon,size);
const chip=(tone,t,i)=>F.chip(tone,t,i);
const btn=(l,o)=>F.btn(l,o);
const R={};

/* ---------- vocabulary of due states (one name each, the yard's words) ---------- */
const DS={
  over:['danger','Vencida','warning-octagon'],
  now:['warning','Vence agora','hourglass-medium'],
  soon:['primary','Vence logo','calendar-blank'],
  ok:['success','Em dia','check-circle'],
  nokm:['muted','Sem km','gauge'],
  chk:['warning','Km a conferir','question'],
};
const dchip=s=>chip(DS[s][0],DS[s][1],DS[s][2]);
const comp=(arr,tip)=>`<span class="comp" title="${esc(tip||'')}">${arr.map(s=>`<i class="${s}"></i>`).join('')}</span>`;
/* proximity: used = fraction of the interval already run (1 = due). Due mark at 80% of the bar; the warning zone is the early window */
function prox(used,state,o={}){
  const due=80, win=o.win??.06, f=Math.max(0,Math.min(used*due,100));
  return `<div class="prox" title="${esc(o.tip||'')}"><span class="w" style="left:${due-win*due}%;width:${win*due}%"></span><span class="f ${state}" style="width:${state==='nokm'?100:f}%"></span><span class="m" style="left:${due}%"></span></div>${o.l?`<div class="proxl"><span>${o.l[0]}</span><span>${o.l[1]}</span></div>`:''}`;
}
const KIND={oil:'drop',brake:'disc',lube:'drop-half',hub:'circle-notch',air:'wind',stake:'columns',rev:'list-checks',tach:'speedometer',belt:'arrows-clockwise'};
const svcTile=(k,tone='muted')=>tile(tone,KIND[k]||'wrench');

/* ---------- kit integration: add the proposed "Preventiva" menu item (the kit mirrors today's app, which doesn't have it yet) ---------- */
function patchNav(){
  document.querySelectorAll('fx-app').forEach(app=>{
    const on=app.getAttribute('section')==='plan';
    const side=app.querySelector('.fx-side');
    if(side&&!side.querySelector('[data-pv]')){
      const exp=side.classList.contains('exp');
      const os=[...side.querySelectorAll('.fx-ni')].find(n=>n.getAttribute('title')==='Ordens de serviço');
      if(os){
        const el=document.createElement('div');
        el.setAttribute('data-pv','');
        const sub=app.getAttribute('data-sub')||'Agenda';
        el.innerHTML=`<div class="fx-ni ${on?'on':''}" title="Preventiva">${on?'<i class="fx-bar"></i>':''}<span class="fx-nib">${ic('calendar-check','s16',on)}</span>${exp?`<span class="fx-nil">Preventiva</span>${ic('caret-right','s12 fx-car')}`:''}</div>${exp&&on?`<div class="fx-sub">${[['Agenda','calendar-dots'],['Planos','list-checks'],['Conformidade','chart-bar']].map(([l,i])=>`<div class="fx-ni nested ${l===sub?'on':''}" title="${l}"><span class="fx-nib">${ic(i,'s16',l===sub)}</span><span class="fx-nil">${l}</span></div>`).join('')}</div>`:''}`;
        os.after(...el.childNodes);
      }
    }
    if(on){const mn=app.querySelectorAll('.fx-mnav .fx-mi');const more=mn[mn.length-1];if(more&&!more.classList.contains('on')){more.classList.add('on');more.insertAdjacentHTML('beforeend','<i></i>');}}
  });
}
/* scale each device frame to fit the page width: no horizontal scroll at any width */
function fit(){
  document.querySelectorAll('.devices .fx-device').forEach(d=>{
    d.style.zoom='';
    const box=d.closest('.devices'); if(!box) return;
    const avail=box.clientWidth, w=d.offsetWidth;
    if(w>avail&&avail>0) d.style.zoom=(avail/w).toFixed(4);
  });
}

/* =====================================================================
   1 AGENDA DA FROTA
   ===================================================================== */
const VIS=[
  {g:'over',id:'Conjunto C-320',set:1,comp:['now','ok','over','ok'],tip:'Cavalo QRT4B22: vence agora · 1º RTF6K38: em dia · 2º RTE1J77: vencida · 3º SRK9H46: em dia',sub:'QRT4B22 + RTF6K38 · RTE1J77 · SRK9H46',base:'Base Curitiba',carrier:'Transportadora Demo',
   what:'Lona de freio · 2º RTE1J77, eixo 3',more:'e mais 2 que cabem nesta visita',chips:['over','now'],
   when:['vencida há 1.850 km','d','desde 19/11'],where:['garage','No pátio · OS 1042','box 3, desde 07/11'],act:'Incluir na OS',
   items:[
     {k:'brake',n:'Lona de freio',p:'2º RTE1J77 · eixo 3, os dois lados',last:['12/05/2026','38.570 km','OS 0871'],used:1.03,st:'over',due:'vencida há 1.850 km',sub:'era em 96.570 km',src:'km pelo engate'},
     {k:'lube',n:'Lubrificação geral',p:'1º, 2º e 3º',last:['28/10/2026','','OS 0988'],used:.94,st:'now',due:'vence sáb 28/11',sub:'a cada 30 dias'},
     {k:'oil',n:'Troca de óleo e filtros',p:'Cavalo QRT4B22 · Revisão A',last:['16/10/2026','133.518 km','OS 0961'],used:.94,st:'now',due:'faltam 1.200 km',sub:'~2 dias pelo km/dia'}],
   kit:['ok','Kit em estoque na Base Curitiba','4 lonas, 8 molas, 38 l de óleo, 3 filtros']},
  {g:'over',id:'DLY1J07',sub:'Cavalo 6x4 · frota 812',comp:['over'],base:'Base Curitiba',carrier:'Transportadora Demo',
   what:'Revisão B',more:'inclui a A',chips:['over'],when:['vencida há 4.300 km','d','rodou 7 dias vencida'],where:['road-horizon','Rodando','640 km por dia · km de hoje'],act:'Agendar',
   items:[{k:'rev',n:'Revisão B (inclui a A)',p:'Cavalo DLY1J07',last:['02/06/2026','96.100 km','OS 0702'],used:1.07,st:'over',due:'vencida há 4.300 km',sub:'era em 156.100 km'}],
   kit:['warning','Falta 1 filtro de ar no estoque','pedido de compra 2231 chega seg 30/11']},
  {g:'over',id:'Conjunto C-207',set:1,comp:['ok','over','now'],tip:'Cavalo QRT9D14: em dia · 1º RTC3B19: vencida · 2º RTC4B20: vence agora',sub:'QRT9D14 + RTC3B19 · RTC4B20',base:'Base Três Lagoas',carrier:'Florestal Sul',
   what:'Inspeção de fueiros · 1º RTC3B19',more:'e mais 1',chips:['over','now'],when:['vencida há 3 dias','d','era em 23/11'],where:['calendar-check','Agendado sex 27/11','Base Três Lagoas, por Marina'],act:'Reagendar',
   items:[{k:'stake',n:'Inspeção de fueiros e barrotes',p:'1º RTC3B19 · os dois lados',last:['24/10/2026','','OS 0975'],used:1.1,st:'over',due:'vencida há 3 dias',sub:'a cada 30 dias'},{k:'lube',n:'Lubrificação geral',p:'2º RTC4B20',last:['30/10/2026','',''],used:.9,st:'now',due:'vence seg 30/11',sub:'a cada 30 dias'}]},
  {g:'week',id:'Conjunto C-118',set:1,comp:['now','ok','soon'],tip:'Cavalo QRT7C10: vence agora · 1º RTA1A11: em dia · 2º RTA2A22: vence logo',sub:'QRT7C10 + RTA1A11 · RTA2A22',base:'Base Curitiba',carrier:'Transportadora Demo',
   what:'Revisão A · cavalo QRT7C10',more:'e mais 1 que cabe junto',chips:['now','soon'],when:['~sáb 28/11','w','faltam 1.900 km'],where:['road-horizon','Rodando','650 km por dia'],act:'Agendar',
   items:[{k:'oil',n:'Revisão A',p:'Cavalo QRT7C10',last:['20/10/2026','118.040 km','OS 0966'],used:.9,st:'now',due:'faltam 1.900 km',sub:'~sáb 28/11'},{k:'brake',n:'Lona de freio',p:'2º RTA2A22 · eixo 1, os dois lados',last:['03/06/2026','52.300 km','OS 0715'],used:.93,st:'soon',due:'faltam 4.100 km',sub:'cabe junto, pela janela de 5 mil km',src:'km pelo engate'}]},
  {g:'week',id:'QRT1A09',sub:'Cavalo 6x4 · frota 820',comp:['now'],base:'Base Ponta Grossa',carrier:'Transportadora Demo',
   what:'Revisão A',more:'',chips:['now'],when:['~dom 29/11','w','faltam 2.400 km'],where:['road-horizon','Rodando','710 km por dia'],act:'Agendar',
   items:[{k:'oil',n:'Revisão A',p:'Cavalo QRT1A09',last:['25/10/2026','141.600 km','OS 0979'],used:.88,st:'now',due:'faltam 2.400 km',sub:'~dom 29/11'}]},
  {g:'week',id:'RTA4A44',sub:'Carreta florestal · engatada no QRT2E88',comp:['now'],base:'Base Três Lagoas',carrier:'Florestal Sul',
   what:'Inspeção de fueiros',more:'',chips:['now'],when:['dom 29/11','w','a cada 30 dias'],where:['link-simple','Engatada no QRT2E88','desde 19/11'],act:'Agendar',
   items:[{k:'stake',n:'Inspeção de fueiros e barrotes',p:'RTA4A44 · os dois lados',last:['30/10/2026','',''],used:.93,st:'now',due:'vence dom 29/11',sub:'a cada 30 dias'}]},
  {g:'later',id:'Conjunto C-044',set:1,comp:['soon','ok','soon'],tip:'Cavalo QRT3F21: vence logo · 2º RTD8K02: vence logo',sub:'QRT3F21 + RTD7K01 · RTD8K02',base:'Base Curitiba',carrier:'Transportadora Demo',what:'Revisão B · cavalo QRT3F21',more:'e mais 1',chips:['soon'],when:['~qui 10/12','','faltam 9.200 km'],where:['road-horizon','Rodando','690 km por dia'],act:'Agendar'},
  {g:'later',id:'QRT6H33',sub:'Cavalo 6x4 · frota 818',comp:['soon'],base:'Base Ponta Grossa',carrier:'Transportadora Demo',what:'Lona de freio · eixos 2 e 3',more:'',chips:['soon'],when:['~ter 15/12','','faltam 11.800 km'],where:['road-horizon','Rodando','600 km por dia'],act:'Agendar'},
  {g:'later',id:'RTB2C14',sub:'Dolly · engatado no QRT8A70',comp:['soon'],base:'Base Três Lagoas',carrier:'Florestal Sul',what:'Rolamento de cubo · eixo 1',more:'',chips:['soon'],when:['~sex 18/12','','faltam 6.900 km'],where:['link-simple','Engatado no QRT8A70','desde 12/11'],act:'Agendar'},
  {g:'nokm',id:'SRT2C55',sub:'Carreta florestal · sem engate desde 05/11',comp:['nokm'],base:'Base Curitiba',carrier:'Transportadora Demo',what:'3 preventivas por km paradas',more:'as por data seguem',chips:['nokm'],when:['sem km','','último em 05/11'],where:['question','Nenhum engate registrado','há 21 dias'],act:'Registrar engate'},
  {g:'nokm',id:'FHK8J21',sub:'Cavalo 4x2 · frota 702',comp:['nokm'],base:'Base Ponta Grossa',carrier:'Transportadora Demo',what:'Revisão A e B paradas',more:'',chips:['nokm'],when:['sem km','','última leitura há 34 dias'],where:['question','Sem leitura','telemetria sem sinal desde 23/10'],act:'Registrar km'},
];
const GRP={over:['Vencidas','3 visitas · 5 preventivas'],week:['Próximos 7 dias','3 visitas · 4 preventivas'],later:['Próximos 30 dias','9 visitas · 14 preventivas · mostrando 3'],nokm:['Sem km','2 veículos: as preventivas por km esperam uma leitura']};

function counters(){
  const c=(tone,icon,v,l,h)=>`<div class="cnt">${tile(tone,icon)}<div style="min-width:0"><div class="v num">${v}</div><div class="l">${l}</div><div class="h trunc" title="${h}">${h}</div></div></div>`;
  return `<div class="cnts">${c('danger','warning-octagon',5,'Vencidas','em 3 visitas')}${c('warning','hourglass-medium',4,'Próximos 7 dias','em 3 visitas')}${c('primary','calendar-blank',14,'Próximos 30 dias','em 9 visitas')}${c('muted','gauge',2,'Sem km','veículos sem leitura')}</div>`;
}
function agTools(o={}){
  return `<div class="toolbar"><span class="fx-searchf ${o.q?'val':''}" style="flex:0 1 300px">${ic('magnifying-glass','s16')}<span class="trunc">${o.q||'Buscar placa, frota ou conjunto'}</span></span>
    ${F.fchip('Todas as bases',{menu:1,size:'sm'}).replace('fx-fchip','fx-fchip all')}${o.base?F.fchip(o.base,{on:1,removable:1,size:'sm'}):''}${F.fchip('Todas as transportadoras',{menu:1,size:'sm'}).replace('fx-fchip','fx-fchip all')}${F.fchip('Todos os planos',{menu:1,size:'sm'}).replace('fx-fchip','fx-fchip all')}
    <span style="flex:1"></span>${F.seg(['Por visita','Por serviço'],o.by||'Por visita',{variant:'pill',size:'sm',full:false})}</div>`;
}
function agRow(v,o={}){
  const [ic1,w1,w2]=v.where, wnCls=v.when[1];
  const act=v.act==='Reagendar'?btn('Reagendar',{variant:'ghost',size:'sm'}):v.act==='Incluir na OS'?btn('Incluir na OS',{variant:'outline-primary',size:'sm',icon:'plus'}):v.act.startsWith('Registrar')?btn(v.act,{variant:'outline',size:'sm'}):btn('Agendar',{variant:'outline',size:'sm',icon:'calendar-plus'});
  const id=`<div class="id"><span class="l1">${v.set?ic('link-simple','s14 muted'):ic(v.sub.startsWith('Carreta')||v.sub.startsWith('Dolly')?'truck-trailer':'truck','s14 muted')}<span class="pl trunc" title="${v.id}">${v.id}</span>${comp(v.comp,v.tip||v.sub)}</span><span class="l2 trunc" title="${v.sub} · ${v.base}">${v.sub} · ${v.base}</span></div>`;
  const what=`<div class="wt"><b class="trunc" title="${v.what}">${v.what}</b><span class="cs">${v.chips.map(dchip).join('')}${v.more?`<span class="muted" style="font-size:12px">${v.more}</span>`:''}</span></div>`;
  const when=`<div class="wn"><b class="${wnCls}">${v.when[0]}</b><span>${v.when[2]}</span></div>`;
  const where=`<div class="wh">${ic(ic1,'s16')}<span style="min-width:0"><b class="trunc" style="font-weight:600" title="${w1}">${w1}</b><span class="trunc muted" style="font-size:11.5px">${w2}</span></span></div>`;
  const ex=o.open&&v.items?`<div class="agx">${v.items.map(agItem).join('')}${v.kit?`<div class="kit">${chip(v.kit[0],v.kit[1],v.kit[0]==='ok'?'package':'warning')}<span class="muted">${v.kit[2]}</span><span style="flex:1"></span>${btn('Adiar',{variant:'ghost',size:'sm',icon:'clock-countdown'})}${btn(v.act==='Incluir na OS'?'Incluir as 3 na OS 1042':'Agendar visita',{size:'sm'})}</div>`:''}</div>`:'';
  return `<div class="agr ${o.open?'on':''}">${o.sel?`<span class="cb ${o.sel===2?'on':''}">${o.sel===2?ic('check','s12'):''}</span>`:ic('caret-right','s16 car')}${id}${what}${when}${where}<div class="ac">${act}<span class="ib" title="Mais ações" aria-label="Mais ações">${ic('dots-three-vertical-bold','s16')}</span></div></div>${ex}`;
}
function agItem(x){
  return `<div class="agi"><div class="row">${svcTile(x.k,DS[x.st][0])}<span class="t" style="min-width:0"><b class="trunc" title="${x.n}">${x.n}</b><span class="trunc" title="${x.p}">${x.p}</span></span></div>
    <div class="last">Última: <b>${x.last[0]}</b>${x.last[1]?` · ${x.last[1]}`:''}${x.last[2]?` · ${x.last[2]}`:''}${x.src?`<br><span title="O km da carreta é a soma do que os cavalos rodaram com ela">${ic('link-simple','s12')} ${x.src}</span>`:''}</div>
    <div>${prox(x.used,x.st,{tip:`${x.due} · ${x.sub}`})}</div>
    <div class="wn" style="display:flex;flex-direction:column;align-items:flex-end;text-align:right"><b class="${x.st==='over'?'d':x.st==='now'?'w':''}" style="font-size:13px">${x.due}</b><span style="font-size:11.5px;color:hsl(var(--muted-foreground))">${x.sub}</span></div></div>`;
}
function agList(o={}){
  const groups=['over','week','later','nokm'];
  return groups.map(g=>{
    const rows=VIS.filter(v=>v.g===g);
    return `<div class="agrp">${tile(DS[g==='over'?'over':g==='week'?'now':g==='later'?'soon':'nokm'][0],DS[g==='over'?'over':g==='week'?'now':g==='later'?'soon':'nokm'][2])}<b>${GRP[g][0]}</b><span>${GRP[g][1]}</span></div>
      <div class="card agl">${g==='over'?`<div class="agh"><span></span><span>Veículo ou conjunto</span><span>O que vence</span><span>Quando</span><span class="wh">Onde está</span><span style="text-align:right">Ação</span></div>`:''}${rows.map((v,i)=>agRow(v,{open:o.open&&g==='over'&&i===0,sel:o.sel?(o.sel.includes(v.id)?2:1):0})).join('')}${g==='later'?`<div class="addl" style="justify-content:center;color:hsl(var(--primary));font-weight:600">Ver as 9 visitas${ic('caret-down','s14')}</div>`:''}</div>`;
  }).join('');
}
function agByService(){
  const rows=[['brake','Lona de freio','3 carretas e 1 cavalo','over','1 vencida · 3 vencem em 30 dias','16 lonas, 32 molas','ok','em estoque'],
    ['oil','Revisão A','4 cavalos','now','3 vencem em 7 dias · 1 em 30','4 kits de óleo e filtros','ok','em estoque'],
    ['rev','Revisão B','2 cavalos','over','1 vencida · 1 em 30 dias','2 kits de revisão B','warning','falta 1 filtro de ar'],
    ['stake','Inspeção de fueiros','5 carretas','over','1 vencida · 4 em 7 dias','sem peças','muted',''],
    ['lube','Lubrificação geral','9 carretas','now','4 em 7 dias · 5 em 30','graxa: 6 kg','ok','em estoque'],
    ['hub','Rolamento de cubo','1 dolly','soon','em 30 dias','2 rolamentos, 2 retentores','ok','em estoque']];
  return `<div class="card agl"><div class="agh" style="grid-template-columns:36px minmax(0,1.2fr) minmax(0,1.3fr) minmax(0,1.3fr) 120px"><span></span><span>Serviço</span><span>Quantos e quando</span><span>Peças do kit, 30 dias</span><span style="text-align:right">Ação</span></div>
    ${rows.map(r=>`<div class="agr" style="grid-template-columns:36px minmax(0,1.2fr) minmax(0,1.3fr) minmax(0,1.3fr) 120px">${svcTile(r[0],DS[r[3]][0])}<div class="id"><span class="pl" style="font-family:Inter;font-weight:600;font-size:14px">${r[1]}</span><span class="l2">${r[2]}</span></div><div class="wt"><span class="cs">${dchip(r[3])}</span><span class="muted" style="font-size:12px">${r[4]}</span></div><div class="wt"><b style="font-weight:500;font-size:13px">${r[5]}</b>${r[7]?`<span class="cs">${chip(r[6],r[7],r[6]==='ok'?'package':'warning')}</span>`:''}</div><div class="ac">${btn('Ver veículos',{variant:'ghost',size:'sm'})}</div></div>`).join('')}</div>`;
}
const dlgSchedule=()=>F.dialog({title:'Agendar visita',desc:'Conjunto C-118 · QRT7C10 + RTA1A11 · RTA2A22',size:'',body:`
  <div class="fld"><label>Base</label><div class="inp" style="font-size:14px">Base Curitiba${ic('caret-down','s16 muted')}</div></div>
  <div class="fld"><label>Dia</label><div class="row wrap">${F.fchip('sáb 28/11 · chega pelo km',{on:1})}${F.fchip('seg 30/11')}${F.fchip('Outro dia',{icon:'calendar-blank'})}</div><span class="hint">Pelos 650 km por dia, o conjunto passa dos 1.900 km que faltam no sábado</span></div>
  <div class="fld"><label>Preventivas desta visita</label><div class="card" style="box-shadow:none">
    ${[['oil','Revisão A','Cavalo QRT7C10 · faltam 1.900 km',1,'now'],['brake','Lona de freio, eixo 1','2º RTA2A22 · faltam 4.100 km · cabe junto',1,'soon']].map(x=>`<div class="pvi" style="padding-left:8px"><span class="cbhit"><span class="cb ${x[3]?'on':''}">${ic('check','s12')}</span></span><span class="tx"><b>${x[1]}</b><span>${x[2]}</span></span>${dchip(x[4])}</div>`).join('')}</div></div>
  <div class="row" style="justify-content:space-between;padding:10px 12px;border-radius:10px;background:hsl(var(--muted)/.5)"><span style="font-size:13.5px"><b style="font-weight:600">Avisar a Transportadora Demo</b><br><span class="muted" style="font-size:12.5px">por e-mail, com o dia e o que vai ser feito</span></span><span class="switch on"></span></div>`,
  consequence:'A visita aparece na portaria da Base Curitiba, e as 2 preventivas entram na OS quando o conjunto chegar',action:'Agendar',actionIcon:'calendar-check'});
const dlgDefer=()=>F.dialog({title:'Adiar Revisão B do DLY1J07',desc:'Vencida há 4.300 km',body:`
  <div class="fld"><label>Motivo <span class="req">*</span></label><div class="row wrap">${['Em viagem longa','Sem peça','Sem box livre','Pedido da transportadora','Outro'].map((m,i)=>F.fchip(m,{on:i===1})).join('')}</div></div>
  <div class="fld"><label>Até quando</label>${F.seg(['2 mil km','5 mil km','15 dias','Outro'],'5 mil km',{variant:'pill'})}<span class="hint">O que vier primeiro: 5 mil km ou o filtro de ar chegar (seg 30/11)</span></div>
  <div class="fld"><label>Observação <span class="opt">(opcional)</span></label><div class="inp ta"><span class="ph">Ex.: pedido de compra 2231</span></div></div>`,
  consequence:'Volta para a agenda em 5 mil km. O adiamento fica no histórico do veículo e conta como atraso na conformidade',action:'Adiar',actionIcon:'clock-countdown'});

R.agenda=(s,dev)=>{
  if(dev==='phone') return agendaPhone(s);
  if(s==='loading') return `<div class="ag">${`<div class="cnts">${[1,2,3,4].map(()=>F.sk('100%',74,14)).join('')}</div>`}${F.sk('60%',36)}<div class="card">${[1,2,3,4,5].map(()=>`<div class="agr" style="cursor:default">${F.sk(16,16)}${F.sk('80%',30)}${F.sk('70%',30)}${F.sk('60%',30)}${F.sk('70%',30)}${F.sk(110,32)}</div>`).join('')}</div></div>`;
  if(s==='first') return `<div class="ag">${F.empty({canvas:1,icon:'calendar-check',title:'Nenhum plano de preventiva ainda',hint:'Sugerimos 3 planos pela sua frota (24 cavalos 6x4, 61 carretas florestais e 8 dollies). Revise e a agenda aparece aqui no mesmo dia',action:`<div class="row" style="justify-content:center;gap:10px">${btn('Ver planos sugeridos',{icon:'sparkle'})}</div>`})}
    <div class="card" style="padding:12px 16px;display:flex;gap:12px;align-items:center">${tile('success','gauge')}<span style="font-size:13.5px"><b style="font-weight:600">O km já está sendo gravado</b><br><span class="muted">93 de 96 veículos com leitura nos últimos 7 dias. Quando o plano entrar, cada um já começa com o km certo</span></span></div></div>`;
  if(s==='noperm') return F.empty({icon:'lock-simple',title:'Sem acesso à agenda de preventivas',hint:'Seu papel não permite ver a agenda. Peça a quem administra a empresa'});
  if(s==='error') return `<div class="ag">${counters().replace(/class="v num">\d+/g,'class="v num">·')}${F.empty({icon:'cloud-x',title:'Não conseguimos carregar a agenda',hint:'Tente de novo em alguns segundos. Se continuar, fale com o suporte e informe o código A7F3',action:btn('Tentar de novo',{variant:'outline',icon:'arrow-clockwise'})})}</div>`;
  const tools=agTools({q:s==='nores'?'RTX9':'',base:s==='nores'?'Base Curitiba':'',by:s==='byservice'?'Por serviço':'Por visita'});
  if(s==='nores') return `<div class="ag">${counters()}${tools}<div class="card">${F.empty({icon:'magnifying-glass',title:'Nenhuma preventiva para "RTX9" na Base Curitiba',hint:'Confira a placa ou procure em todas as bases',action:btn('Limpar filtros',{variant:'link'})})}</div></div>`;
  if(s==='byservice') return `<div class="ag">${counters()}${tools}${agByService()}</div>`;
  const sap=s==='sap'?`<div class="card" style="padding:10px 14px;display:flex;gap:12px;align-items:center;flex-wrap:wrap"><span class="sapbadge">${ic('arrows-left-right','s14')}Planos do SAP</span><span style="font-size:13px;flex:1;min-width:240px">A agenda vem das ordens e planos do SAP. Agendar e adiar são feitos lá; aqui o pátio inclui na OS quando o conjunto chega</span><span class="muted" style="font-size:12px">sincronizado há 12 min</span></div>`:'';
  let body=`<div class="ag">${sap}${counters()}${tools}${agList({open:s==='open',sel:s==='select'?['Conjunto C-118','QRT1A09','RTA4A44']:null})}</div>`;
  if(s==='sap') body=body.replace(/>Agendar</g,'>Ver no SAP<').replace(/calendar-plus/g,'arrow-square-out');
  if(s==='select') body+=`<div class="selb">${F.selbar(3,' visitas',[{label:'Agendar as 3',icon:'calendar-plus',primary:1},{label:'Adiar',icon:'clock-countdown'},{label:'Limpar',icon:'x'}])}</div>`;
  if(s==='schedule') body+=dlgSchedule();
  if(s==='defer') body+=dlgDefer();
  return body;
};
function agendaPhone(s){
  if(s==='loading') return `<div class="mcards">${[1,2,3].map(()=>`<div class="mcard">${F.sk('50%',18)}${F.sk('90%',16)}${F.sk('100%',36)}</div>`).join('')}</div>`;
  if(s==='first') return F.empty({icon:'calendar-check',title:'Nenhum plano de preventiva ainda',hint:'Sugerimos 3 planos pela sua frota. Revise no computador ou aqui mesmo',action:btn('Ver planos sugeridos',{icon:'sparkle'})});
  if(s==='noperm') return F.empty({icon:'lock-simple',title:'Sem acesso à agenda',hint:'Seu papel não permite ver a agenda. Peça a quem administra a empresa'});
  if(s==='error') return F.empty({icon:'cloud-x',title:'Não conseguimos carregar a agenda',hint:'Tente de novo em alguns segundos',action:btn('Tentar de novo',{variant:'outline'})});
  const tab=s==='nores'?'Vencidas':'Vencidas';
  const top=`<div class="fx-msticky"><div class="fx-msearch"><span class="fx-searchf ${s==='nores'?'val':''}" style="flex:1;height:44px">${ic('magnifying-glass','s16')}<span class="trunc">${s==='nores'?'RTX9':'Buscar placa ou conjunto'}</span></span><span class="fx-btn outline icon" style="height:44px;width:44px" title="Filtros" aria-label="Filtros">${ic('sliders-horizontal','s20')}</span></div>
    <div class="fx-mtabs">${[['Vencidas',3],['7 dias',3],['30 dias',9],['Sem km',2]].map(([t,n])=>`<span class="${t===tab?'on':''}">${t}<b>${n}</b></span>`).join('')}</div></div>`;
  if(s==='nores') return `<div class="fx-mlist">${top}<div style="padding:24px 0">${F.empty({icon:'magnifying-glass',title:'Nenhuma preventiva para "RTX9"',hint:'Confira a placa ou limpe a busca',action:btn('Limpar busca',{variant:'link'})})}</div></div>`;
  const cards=VIS.filter(v=>v.g==='over').map(v=>{
    const act=v.act==='Incluir na OS'?btn('Incluir na OS 1042',{size:'sm',icon:'plus'}):v.act==='Reagendar'?btn('Reagendar',{variant:'outline',size:'sm'}):btn('Agendar',{size:'sm',icon:'calendar-plus'});
    return `<div class="mcard"><div class="l1">${v.set?ic('link-simple','s16 muted'):ic('truck','s16 muted')}<span class="pl" style="font-size:15.5px">${v.id}</span>${comp(v.comp,v.tip)}</div>
      <div class="row" style="gap:8px"><span class="muted trunc" style="font-size:12.5px;flex:1" title="${v.sub}">${v.sub}</span><b class="num" style="font-size:12.5px;color:hsl(var(--danger-ink));white-space:nowrap">${v.when[0]}</b></div>
      <div class="it">${tile('danger','warning-octagon')}<span style="min-width:0"><b>${v.what}</b><br><span class="muted" style="font-size:12.5px">${v.more||v.when[2]}</span></span></div>
      <div class="ft">${ic(v.where[0],'s16 muted')}<span class="trunc" style="flex:1;font-size:12.5px" title="${v.where[1]}">${v.where[1]}</span>${act}</div></div>`;}).join('');
  let out=`<div class="fx-mlist">${top}<div class="mcards" style="padding:12px 16px 90px">${s==='sap'?`<div class="row" style="gap:8px;font-size:12.5px"><span class="sapbadge">${ic('arrows-left-right','s14')}Do SAP</span><span class="muted">sincronizado há 12 min</span></div>`:''}${cards}</div></div>`;
  if(s==='schedule'||s==='defer'){
    out+=s==='schedule'?F.sheet({title:'Agendar visita',body:`<span class="muted" style="font-size:13px">Conjunto C-118 · 2 preventivas</span><div class="fld"><label>Dia</label><div class="row wrap">${F.fchip('sáb 28/11 · chega pelo km',{on:1})}${F.fchip('seg 30/11')}${F.fchip('Outro dia')}</div></div><div class="fld"><label>Base</label><div class="inp" style="font-size:14px">Base Curitiba${ic('caret-down','s16 muted')}</div></div><div class="row" style="justify-content:space-between"><span style="font-size:13.5px">Avisar a transportadora</span><span class="switch on"></span></div>`,action:'Agendar',consequence:'Aparece na portaria e entra na OS na chegada'})
      :F.sheet({title:'Adiar Revisão B do DLY1J07',body:`<div class="fld"><label>Motivo <span class="req">*</span></label><div class="row wrap">${['Em viagem longa','Sem peça','Sem box livre','Pedido da transportadora','Outro'].map((m,i)=>F.fchip(m,{on:i===1})).join('')}</div></div><div class="fld"><label>Até quando</label>${F.seg(['2 mil km','5 mil km','15 dias'],'5 mil km',{variant:'pill'})}</div>`,action:'Adiar',consequence:'Volta em 5 mil km e conta como atraso na conformidade'});
  }
  return out;
}

/* =====================================================================
   2 CHEGADA DO CONJUNTO · ABRIR OS COM AS PREVENTIVAS
   ===================================================================== */
const ARR=[
  {g:'Cavalo',pl:'QRT4B22',items:[{k:'oil',n:'Troca de óleo e filtros',s:'Revisão A · faltam 1.200 km',st:'now',kit:'38 l de óleo, 3 filtros'}]},
  {g:'2º',pl:'RTE1J77',items:[{k:'brake',n:'Lona de freio · eixo 3, os dois lados',s:'vencida há 1.850 km',st:'over',kit:'4 lonas, 8 molas'}]},
  {g:'1º, 2º e 3º',pl:'as 3 carretas',items:[{k:'lube',n:'Lubrificação geral',s:'vence sáb 28/11',st:'now',kit:'graxa'},{k:'stake',n:'Inspeção de fueiros e barrotes',s:'vencida há 2 dias no 3º SRK9H46',st:'over',kit:'sem peças'}]},
  {g:'3º',pl:'SRK9H46',items:[{k:'brake',n:'Regulagem de catraca · eixos 1 a 3',s:'faltam 3.600 km · cabe junto',st:'soon',kit:'sem peças'}]},
];
function pvBlock(o={}){
  const touch=o.touch;
  const off=o.off||[];
  let n=0;
  const groups=ARR.map(g=>`<div class="vg"><div class="vgh"><b>${g.g}</b><span>${g.pl}</span></div>${g.items.map(x=>{n++;const isOff=off.includes(x.n);const chk=o.check&&g.g==='Cavalo';
      return `<div class="pvi ${isOff?'off':''}"><span class="cbhit"><span class="cb ${touch?'lg':''} ${isOff||chk?'':'on'}">${isOff||chk?'':ic('check',touch?'s14':'s12')}</span></span>${svcTile(x.k,chk?'muted':DS[x.st][0])}<span class="tx" style="margin-left:6px"><b>${x.n}</b><span>${chk?'Espera o km do cavalo ser conferido':x.s}${o.kit!==false?` · kit: ${x.kit}`:''}</span></span><span class="r">${chk?dchip('chk'):dchip(x.st)}</span></div>`;}).join('')}</div>`).join('');
  const cnt=o.check?4:5-off.length;
  return `<div class="pvb"><div class="hd">${tile('primary','calendar-check','lg')}<span class="tx"><b>${o.check?'4 preventivas cabem nesta visita':'5 preventivas cabem nesta visita'}</b><span>${o.check?'2 vencidas · a do cavalo espera o km':'2 vencidas · 3 que vencem logo entram junto'}</span></span><span class="row" style="gap:8px;font-size:13px;font-weight:600;flex:none"><span class="${touch?'':'trunc'}">Incluir todas</span><span class="switch ${off.length?'':'on'}"></span></span></div>
    ${groups}<div class="more">${ic('info','s16')}<span>Rolamento de cubo do 1º RTF6K38 vence em 11 mil km e fica para a próxima visita</span><b style="white-space:nowrap">Incluir mesmo assim</b></div></div>`;
}
function arrive(s,dev){
  const touch=dev!=='web';
  const km=s==='check'
    ?`<div class="fld"><label>Km do cavalo QRT4B22 <span class="req">*</span></label><div class="inp big warn">215.318<span class="u">km</span></div><span class="hint w">${ic('warning','s14')} 63 mil km a mais que ontem. Fica a conferir e as preventivas do cavalo esperam</span></div>`
    :`<div class="fld"><label>Km do cavalo QRT4B22 <span class="req">*</span></label><div class="inp big">152.318<span class="u">km</span></div><span class="hint">Telemetria de 08:12 · ontem 151.690 km</span></div>`;
  const only=s==='only';
  const setc=only
    ?`<div class="card setc">${tile('primary','truck','lg')}<span class="tx"><b class="t">DLY1J07</b><span class="muted" style="font-size:12.5px">Cavalo 6x4 · frota 812 · agendado para hoje</span></span>${btn('Trocar',{variant:'ghost',size:'sm'})}</div>`
    :`<div class="card setc">${tile('primary','link-simple','lg')}<span class="tx"><b class="t">Conjunto C-320 ${comp(['now','ok','over','ok'],'Cavalo QRT4B22 · 1º RTF6K38 · 2º RTE1J77 · 3º SRK9H46')}</b><span class="muted trunc" style="font-size:12.5px" title="QRT4B22 + RTF6K38 · RTE1J77 · SRK9H46">QRT4B22 + RTF6K38 · RTE1J77 · SRK9H46</span></span>${btn('Trocar',{variant:'ghost',size:'sm'})}</div>`;
  const prob=only
    ?`<div class="fld"><label>Problema <span class="opt">(opcional)</span></label><div class="inp ta"><span class="ph">A OS já entra como preventiva. Escreva só se o motorista relatou algo</span></div></div>`
    :`<div class="fld"><label>Problema <span class="req">*</span></label><div class="inp ta">Freio puxando para a direita e vazamento de ar</div></div>`;
  const box=`<div class="fld"><label>Box</label><div class="row wrap">${F.fchip('Box 3 · livre',{on:1,size:touch?'lg':''})}${F.fchip('Box 5',{size:touch?'lg':''})}${F.fchip('Outro',{size:touch?'lg':''})}</div></div>`;
  let right;
  if(s==='none') right=`<div class="card" style="padding:14px 16px;display:flex;gap:12px;align-items:center">${tile('success','check-circle')}<span style="font-size:13.5px"><b style="font-weight:600">Nenhuma preventiva perto de vencer neste conjunto</b><br><span class="muted">A próxima é a lubrificação do 1º RTF6K38, em 12 dias</span></span></div>`;
  else if(only) right=`<div class="pvb"><div class="hd">${tile('primary','calendar-check','lg')}<span class="tx"><b>Revisão B do DLY1J07</b><span>Vencida há 4.300 km · agendada por Marina para hoje</span></span><span class="switch on"></span></div><div class="vg">${[['rev','Revisão B (inclui a A)','troca de óleo, filtros de ar e combustível, regulagem de freio','over'],['belt','Correia do alternador','cabe junto · faltam 2.900 km','soon']].map(x=>`<div class="pvi"><span class="cbhit"><span class="cb lg on">${ic('check','s14')}</span></span>${svcTile(x[0],DS[x[3]][0])}<span class="tx" style="margin-left:6px"><b>${x[1]}</b><span>${x[2]}</span></span>${dchip(x[3])}</div>`).join('')}</div></div>`;
  else if(s==='sap') right=`<div class="pvb"><div class="hd">${tile('primary','arrows-left-right','lg')}<span class="tx"><b>Ordem do SAP 4000123 · Revisão B</b><span>Gerada pelo plano 30012 do SAP em 24/11 · 4 operações viram serviços</span></span><span class="sapbadge">Do SAP</span></div><div class="vg">${[['oil','Troca de óleo do motor','Cavalo QRT4B22 · operação 0010'],['air','Filtros de ar e combustível','Cavalo QRT4B22 · operação 0020'],['brake','Lona de freio · eixo 3','2º RTE1J77 · operação 0030'],['lube','Lubrificação geral','1º, 2º e 3º · operação 0040']].map(x=>`<div class="pvi"><span class="cbhit"><span class="cb lg on">${ic('check','s14')}</span></span>${svcTile(x[0],'primary')}<span class="tx" style="margin-left:6px"><b>${x[1]}</b><span>${x[2]}</span></span></div>`).join('')}</div><div class="more">${ic('info','s16')}<span>Ao concluir, a OS volta ao SAP com a data e o km reais e fecha a ordem</span></div></div>`;
  else right=pvBlock({touch,check:s==='check',off:s==='untick'?['Regulagem de catraca · eixos 1 a 3']:[]});
  const n=s==='none'?0:only?2:s==='sap'?4:s==='check'?4:s==='untick'?4:5;
  const foot=`<div class="footbar stick">${s==='none'?`<span class="c">${ic('info','s16')}<span>A OS abre na fila do Box 3</span></span>`:`<span class="c">${ic('info','s16')}<span>${only?'A OS abre como preventiva, com 2 serviços e o kit de peças sugerido':`A OS abre com ${n} preventivas${s==='sap'?' da ordem do SAP':''} e o kit de peças sugerido. O mecânico confirma as peças ao começar`}</span></span>`}<span class="bt">${btn('Cancelar',{variant:'outline',size:touch?'lg':''})}${btn(s==='none'?'Abrir OS':`Abrir OS com ${n} ${only?'serviços':'preventivas'}`,{size:touch?'lg':'',icon:'check'})}</span></div>`;
  return `<div class="fcol"><div class="arr"><div class="fcol">${setc}${km}${prob}${box}</div><div class="fcol">${right}</div></div>${foot}</div>`;
}
function arrivePhone(s){
  const only=s==='only';
  let block;
  if(s==='none') block=`<div class="card" style="padding:12px 14px;display:flex;gap:10px;align-items:center">${tile('success','check-circle')}<span style="font-size:13px"><b style="font-weight:600">Nada perto de vencer</b><br><span class="muted">Próxima: lubrificação do 1º, em 12 dias</span></span></div>`;
  else if(s==='sap') block=`<div class="pvb"><div class="hd">${tile('primary','arrows-left-right')}<span class="tx"><b style="font-size:15px">Ordem do SAP 4000123</b><span>Revisão B · 4 operações</span></span><span class="sapbadge">SAP</span></div></div>`;
  else if(only) block=`<div class="pvb"><div class="hd">${tile('primary','calendar-check')}<span class="tx"><b style="font-size:15px">Revisão B e 1 que cabe junto</b><span>Vencida há 4.300 km</span></span><span class="switch on"></span></div></div>`;
  else block=`<div class="pvb"><div class="hd">${tile('primary','calendar-check')}<span class="tx"><b style="font-size:15px">${s==='check'?'4':'5'} preventivas cabem nesta visita</b><span>${s==='check'?'a do cavalo espera o km':'2 vencidas · 3 entram junto'}</span></span><span class="switch on"></span></div>
    ${ARR.slice(0,2).map(g=>`<div class="vg"><div class="vgh"><b>${g.g}</b><span>${g.pl}</span></div>${g.items.map(x=>{const chk=s==='check'&&g.g==='Cavalo';return `<div class="pvi"><span class="cbhit"><span class="cb lg ${chk?'':'on'}">${chk?'':ic('check','s14')}</span></span><span class="tx"><b>${x.n}</b><span>${chk?'espera o km ser conferido':x.s}</span></span>${chk?dchip('chk'):dchip(x.st)}</div>`;}).join('')}</div>`).join('')}
    <div class="more"><span>e mais 3 nas carretas</span><b>Ver todas</b></div></div>`;
  const km=s==='check'?`<div class="fld"><label>Km do cavalo <span class="req">*</span></label><div class="inp big warn">215.318<span class="u">km</span></div><span class="hint w">63 mil km a mais que ontem. Fica a conferir</span></div>`:`<div class="fld"><label>Km do cavalo <span class="req">*</span></label><div class="inp big">${only?'160.400':'152.318'}<span class="u">km</span></div><span class="hint">Telemetria de 08:12</span></div>`;
  const n=s==='none'?'':only?' com 2 serviços':s==='check'||s==='sap'?' com 4 preventivas':' com 5 preventivas';
  return `<div class="fcol" style="padding-bottom:90px"><div class="card setc">${tile('primary',only?'truck':'link-simple')}<span class="tx"><b class="t" style="font-size:16px">${only?'DLY1J07':'Conjunto C-320'} ${only?'':comp(['now','ok','over','ok'])}</b><span class="muted" style="font-size:12px">${only?'Cavalo · frota 812':'QRT4B22 + 3 carretas'}</span></span></div>${km}${block}${only?'':`<div class="fld"><label>Problema <span class="req">*</span></label><div class="inp ta" style="min-height:60px">Freio puxando para a direita</div></div>`}</div>
    <div style="position:absolute;left:0;right:0;bottom:84px;padding:10px 16px;background:hsl(var(--card));border-top:1px solid hsl(var(--border))"><div class="bigbtn">${ic('check','s20')}Abrir OS${n}</div></div>`;
}
R.chegada=(s,dev)=>{
  if(s==='loading') return `<div class="fcol"><div class="arr"><div class="fcol">${F.sk('100%',72,14)}${F.sk('100%',76)}${F.sk('100%',96)}</div><div class="fcol">${F.sk('100%',300,16)}</div></div></div>`;
  return dev==='phone'?arrivePhone(s):arrive(s,dev);
};

/* inside the OS that is already open: the same item in "Precisa de atenção", then the services with their origin */
R.naos=(s,dev)=>{
  const phone=dev==='phone';
  const hero=`<div class="card hero">${phone?'':tile('primary','link-simple','xl')}<div style="min-width:0;flex:1 1 260px"><div class="row wrap">${chip('primary','Em manutenção')}${chip('muted','Corretiva')}${s==='added'?chip('primary','Preventiva','calendar-check'):''}${chip('muted','Box 3')}</div><h2>Conjunto C-320 ${comp(['now','ok','over','ok'])}</h2><p class="muted" style="font-size:13px">Freio puxando para a direita e vazamento de ar</p></div>${phone?'':`<div class="k"><div class="kpi"><div class="eyebrow">Prontos</div><div class="v num">1 de 3</div></div><div class="kpi"><div class="eyebrow">Na oficina</div><div class="v num">2 d 8 h</div></div></div>`}</div>`;
  const pvRow=`<div class="arow3 hl">${tile('primary','calendar-check')}<span class="t"><b class="${phone?'':'trunc'}">5 preventivas cabem nesta visita</b><span class="${phone?'':'trunc'}">Lona do 2º RTE1J77 vencida há 1.850 km · óleo do cavalo em 1.200 km</span></span><span class="go">${phone?ic('caret-right','s16'):'Incluir as 5'+ic('arrow-right','s14')}</span></div>`;
  const others=`<div class="arow3">${tile('danger','clock')}<span class="t"><b class="${phone?'':'trunc'}">RTE1J77 parado · esperando mola de retorno</b><span class="${phone?'':'trunc'}">pedida há 3 h, ainda sem entrega</span></span><span class="go">${phone?ic('caret-right','s16'):'Ver pedido'+ic('arrow-right','s14')}</span></div>`;
  const attn=s==='added'?`<div class="attn2"><div class="attnbar">${ic('warning','s16',1)}<b>Precisa de atenção</b><span class="cn">3</span><span class="muted trunc" style="font-size:13px">RTE1J77 parado há 2d 8h, esperando mola</span><span class="tg">Ver${ic('caret-right','s14')}</span></div></div>`
    :`<div class="attn2 open"><div class="attnbar">${ic('warning','s16',1)}<b>Precisa de atenção</b><span class="cn">4</span><span class="tg">Recolher${ic('caret-down','s14')}</span></div>${others}${pvRow}</div>`;
  const S=(k,n,p,st,who,orig,isNew)=>`<div class="srow ${isNew?'newrow':''}">${svcTile(k,st==='done'?'success':st==='work'?'primary':'muted')}<span class="t" style="min-width:0"><b class="${phone?'':'trunc'}">${n}</b><span>${p}</span>${orig?`<span class="row" style="gap:6px;margin-top:4px">${orig}</span>`:''}</span><span class="row" style="gap:8px">${phone?'':who}${btn(st==='work'?'Pausar':'Começar',{variant:st==='work'?'outline':'ghost',size:'sm'})}</span></div>`;
  const pvo=chip('primary','Preventiva','calendar-check')+`<span class="muted" style="font-size:11.5px">plano Carreta florestal · versão 2</span>`;
  const who=n=>n?`<span class="row" style="gap:6px;font-size:12.5px">${F.initials(n)}${n.split(' ')[0]}</span>`:`<span class="muted" style="font-size:12.5px">Sem mecânico</span>`;
  const list=`<div class="card" style="overflow:hidden"><div class="hd"><b>Serviços</b><span class="sub">${s==='added'?'5 entraram agora · mostrando 3 veículos':'mostrando o cavalo e o 2º'}</span><span class="sp"></span>${s==='added'?`<span class="muted" style="font-size:12px">${ic('arrow-counter-clockwise','s14')} Desfazer</span>`:''}</div>
    <div class="grp"><div class="gh"><b>Cavalo</b> QRT4B22</div>${s==='added'?S('oil','Troca de óleo e filtros','Revisão A · kit: 38 l de óleo, 3 filtros','wait',who(''),pvo,1):`<div class="srow"><span></span><span class="muted" style="font-size:12.5px">Nenhum serviço no cavalo</span><span></span></div>`}</div>
    <div class="grp"><div class="gh"><b>2º</b> RTE1J77</div>${S('brake','Troca de lona de freio','eixo 2, esquerdo','wait',who('Ana Lima'),chip('muted','Do checklist CK-0041'))}${s==='added'?S('brake','Lona de freio','eixo 3, os dois lados · kit: 4 lonas, 8 molas','wait',who(''),pvo,1):''}</div>
    ${s==='added'?`<div class="grp"><div class="gh"><b>1º, 2º e 3º</b> as 3 carretas</div>${S('lube','Lubrificação geral','todo o veículo','wait',who(''),pvo,1)}${S('stake','Inspeção de fueiros e barrotes','os dois lados','wait',who(''),pvo,1)}</div>`:''}</div>`;
  return `<div class="fcol">${hero}${attn}${list}</div>`;
};
/* the mechanic: nothing new to fill; the preventive shows its origin and what finishing it does */
R.mec=()=>`<div class="fcol"><div class="card" style="padding:14px;display:flex;flex-direction:column;gap:10px;border-color:hsl(var(--primary)/.35);box-shadow:0 0 0 4px hsl(var(--primary)/.08)">
  <div class="row">${chip('primary','Em andamento')}${chip('primary','Preventiva','calendar-check')}<span style="flex:1"></span>${F.timer('0:42','primary')}</div>
  <b style="font:800 19px Sora">Lona de freio</b><span style="font-size:13.5px">2º RTE1J77 · <b>eixo 3, os dois lados</b></span>
  <div class="row wrap" style="gap:6px">${chip('success','Peças separadas','package')}<span class="muted" style="font-size:12.5px">4 lonas, 8 molas</span></div>
  <div class="row" style="gap:8px;padding:8px 10px;border-radius:10px;background:hsl(var(--muted)/.6);font-size:12.5px">${ic('arrows-clockwise','s16 muted')}<span>Ao concluir, a próxima conta de hoje: em 60 mil km ou 6 meses</span></div>
  <div style="display:grid;grid-template-columns:1fr 1.4fr;gap:8px">${btn('Pausar',{variant:'outline',size:'lg'})}${btn('Concluir',{size:'lg',icon:'check'})}</div></div>
  <div class="sech" style="display:flex;gap:8px;margin:4px 2px 0"><b style="font:700 13px Sora">Na sua fila</b><span class="muted" style="font-size:12px">2</span></div>
  <div class="card">${[['lube','Lubrificação geral','1º, 2º e 3º · Preventiva'],['brake','Troca de cuíca','2º RTE1J77 · eixo 1, direito']].map((x,i)=>`<div class="srow" ${i?'':'style="border-top:0"'}>${svcTile(x[0])}<span class="t"><b>${x[1]}</b><span>${x[2]}</span></span>${btn('Começar',{variant:'ghost',size:'sm'})}</div>`).join('')}</div></div>`;

/* =====================================================================
   3 PLANOS: lista, primeira vez, editor
   ===================================================================== */
const PLANS=[
  {n:'Carreta florestal 3 eixos',ic:'truck-trailer',v:2,veh:'61 carretas',items:'7 serviços em 3 revisões',d:[4,9,10,36,2],ln:['Lona de freio, eixos 1 a 3: a cada 60 mil km ou 6 meses','Fueiros e barrotes: a cada 30 dias'],who:'Marina Alves em 02/11'},
  {n:'Cavalo 6x4',ic:'truck',v:4,veh:'24 cavalos',items:'9 serviços em 3 revisões',d:[2,3,5,13,1],ln:['Revisão A: a cada 20 mil km ou 4 meses','Revisão B: a cada 60 mil km, inclui a A'],who:'Marina Alves em 18/10'},
  {n:'Dolly 2 eixos',ic:'circle-half',v:1,veh:'8 dollies',items:'4 serviços em 2 revisões',d:[0,1,1,6,0],ln:['Rolamento de cubo, cada eixo: a cada 120 mil km ou 12 meses'],who:'Rafael Lima em 15/08'},
];
const distBar=d=>{const t=d.reduce((a,b)=>a+b,0);const k=['over','now','soon','ok','nokm'];return `<div class="dist" title="${d[0]} vencidas · ${d[1]} vencem agora · ${d[2]} vencem logo · ${d[3]} em dia · ${d[4]} sem km">${d.map((x,i)=>x?`<i class="${k[i]}" style="width:${x/t*100}%"></i>`:'').join('')}</div>`;};
function planCard(p,o={}){
  return `<div class="card plc"><div class="h">${tile('primary',p.ic,'lg')}<span style="flex:1;min-width:0"><b>${p.n}</b><span>${p.veh} · ${p.items}</span></span>${o.sap?`<span class="sapbadge">${ic('lock-simple','s14')}Do SAP</span>`:chip('muted',`Versão ${p.v}`)}</div>
    ${p.ln.map(l=>`<div class="ln">${ic('arrows-clockwise','s14')}<span>${l}</span></div>`).join('')}
    <div>${distBar(p.d)}<div class="proxl"><span><b style="color:hsl(var(--danger-ink))">${p.d[0]} vencidas</b> · ${p.d[1]+p.d[2]} vencem em 30 dias</span><span>${p.d[3]} em dia</span></div></div>
    <div class="ft">${o.sap?`${ic('arrows-left-right','s14')}<span>Plano SAP ${o.sap} · sincronizado há 12 min</span>`:`${ic('pencil-simple','s14')}<span>Mudado por ${p.who}</span>`}</div></div>`;
}
const SUGG=[
  {n:'Cavalo 6x4',ic:'truck',veh:'24 cavalos 6x4 sem plano',items:['Revisão A: óleo e filtros a cada 20 mil km ou 4 meses','Revisão B: inclui a A, a cada 60 mil km','Lona de freio dos eixos de tração a cada 80 mil km'],hist:'Pelo seu histórico, o óleo foi trocado em média a cada 19,6 mil km (212 trocas)'},
  {n:'Carreta florestal 3 eixos',ic:'truck-trailer',veh:'61 carretas, km pelo engate',items:['Lona de freio, eixos 1 a 3, os dois lados: a cada 60 mil km ou 6 meses','Lubrificação geral a cada 10 mil km ou 30 dias','Fueiros e barrotes a cada 30 dias'],hist:'Pelo seu histórico, a lona durou em média 58 mil km (41 trocas). Sugerimos 55 mil'},
  {n:'Dolly 2 eixos',ic:'circle-half',veh:'8 dollies',items:['Rolamento de cubo, cada eixo: a cada 120 mil km ou 12 meses','Lubrificação geral a cada 10 mil km'],hist:''},
];
R.planos=(s,dev)=>{
  const phone=dev==='phone';
  if(s==='loading') return `<div class="plans">${[1,2,3].map(()=>`<div class="card plc">${F.sk('70%',22)}${F.sk('90%',14)}${F.sk('80%',14)}${F.sk('100%',8)}</div>`).join('')}</div>`;
  if(s==='noperm') return `<div class="fcol">${F.notice('info','eye','Seu papel permite ver os planos. Para criar ou mudar, peça a quem administra a empresa')}<div class="plans">${PLANS.map(p=>planCard(p)).join('')}</div></div>`;
  if(s==='first'||s==='empty') return `<div class="firstrun"><div class="top">${tile('primary','sparkle','xl')}<div><b>3 planos sugeridos para a sua frota</b><p>Montados pelo tipo de veículo e pelos eixos cadastrados, e ajustados pelo que a oficina já fez. Revise, mude o que quiser e a agenda começa hoje</p></div></div>
    <div class="sugg">${SUGG.map(p=>`<div class="sgc"><div class="h">${tile('primary',p.ic,'lg')}<span><b>${p.n}</b><span>${p.veh}</span></span></div><ul>${p.items.map(i=>`<li>${ic('arrows-clockwise','s14')}<span>${i}</span></li>`).join('')}</ul>${p.hist?`<div class="hist">${ic('chart-line-up','s16')}<span>${p.hist}</span></div>`:''}<div class="row" style="margin-top:auto">${btn('Revisar e usar',{size:'sm'})}</div></div>`).join('')}</div>
    <div class="row" style="justify-content:center;margin-top:16px;gap:6px">${btn('Começar um plano do zero',{variant:'ghost',size:'sm',icon:'plus'})}</div></div>`;
  if(s==='sap') return `<div class="fcol">${F.notice('info','arrows-left-right','Os planos desta empresa vêm do SAP. Mudanças são feitas lá e chegam aqui em até 15 min')}<div class="plans">${planCard({...PLANS[1],n:'Cavalo Suzano',v:'-'},{sap:'30012'})}${planCard({...PLANS[0],n:'Carreta florestal Suzano'},{sap:'30019'})}</div></div>`;
  const banner=`<div class="card" style="padding:12px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap">${tile('warning','sparkle')}<span style="flex:1 1 260px;font-size:13.5px"><b style="font-weight:600">12 veículos sem plano</b><br><span class="muted">8 julietas e 4 cavalos 4x2. Temos uma sugestão para cada tipo</span></span>${btn('Ver sugestões',{variant:'outline',size:'sm'})}</div>`;
  return `<div class="fcol">${banner}<div class="toolbar"><span class="fx-searchf" style="flex:0 1 280px">${ic('magnifying-glass','s16')}<span>Buscar plano</span></span><span style="flex:1"></span>${phone?'':btn('Novo plano',{icon:'plus'})}</div><div class="plans">${PLANS.map(p=>planCard(p)).join('')}</div></div>${phone?F.fab('plus',1):''}`;
};

/* the editor: each service is one sentence; the tokens are the only things to decide */
const LV=[
  {l:'A',t:'Revisão A',sub:'a cada 10 mil km ou 30 dias',items:[
    {k:'lube',svc:'Lubrificação geral',where:'todo o veículo',every:'10 mil km ou 30 dias',warn:'1 mil km ou 3 dias',kit:'graxa'},
    {k:'stake',svc:'Inspeção de fueiros e barrotes',where:'os dois lados',every:'30 dias',warn:'3 dias',kit:'sem peças'}]},
  {l:'B',t:'Revisão B',inc:'inclui a A',sub:'a cada 60 mil km ou 6 meses',items:[
    {k:'brake',svc:'Lona de freio',where:'eixos 1, 2 e 3, os dois lados',every:'60 mil km ou 6 meses',warn:'3 mil km',kit:'2 lonas e 4 molas por lado'},
    {k:'brake',svc:'Regulagem de catraca',where:'cada eixo',every:'60 mil km ou 6 meses',warn:'3 mil km',kit:'sem peças'}]},
  {l:'C',t:'Revisão C',inc:'inclui a A e a B',sub:'a cada 120 mil km ou 12 meses',items:[
    {k:'hub',svc:'Rolamento de cubo',where:'cada eixo, os dois lados',every:'120 mil km ou 12 meses',warn:'5 mil km',kit:'1 rolamento e 1 retentor por lado'},
    {k:'air',svc:'Revisão do sistema de ar',where:'todo o veículo',every:'120 mil km ou 12 meses',warn:'5 mil km',kit:'kit de reparo da válvula'}]},
];
const sentence=(x,lock)=>{const T=t=>`<span class="tok ${lock?'lock':''}">${t}</span>`;return `<b class="svc">${x.svc}</b>, ${T(x.where)}: a cada ${T(x.every)}${x.every.includes(' ou ')?', o que vier primeiro':''}; avisa ${T(x.warn)} antes`;};
function itemEdit(pop){
  return `<div class="it edit" style="position:relative">${svcTile('brake','primary')}<div class="fcol" style="gap:10px">
    <div class="sent"><span class="f">${ic('disc','s16')}Lona de freio${ic('caret-down','s14')}</span><span>em</span><span class="f ${pop?'foc':''}">eixos 1, 2 e 3 · os dois lados${ic('caret-down','s14')}</span><span>a cada</span><span class="f n foc">55.000</span><span>km ou</span><span class="f n">6</span><span>meses, o que vier primeiro. Avisa</span><span class="f n">3.000</span><span>km antes</span></div>
    <div class="prev">${ic('chat-text','s16')}<span><b style="font-weight:600">Como fica:</b> Lona de freio, eixos 1 a 3 de cada carreta, os dois lados: a cada 55 mil km ou 6 meses, o que vier primeiro; avisa 3 mil km antes. Kit: 2 lonas e 4 molas por lado</span></div>
    <div class="row wrap" style="gap:8px">${chip('success','Pelo seu histórico: 58 mil km em média (41 trocas)','chart-line-up')}<span class="muted" style="font-size:12.5px">Mais opções: horas de motor, atraso aceito (padrão 1 mil km)</span><span style="flex:1"></span><span class="muted" style="font-size:12px"><span class="kbd">Enter</span> salva · <span class="kbd">Esc</span> cancela</span></div></div>
    ${pop?`<div class="pop" style="left:200px;top:54px;width:330px"><div class="eyebrow" style="margin-bottom:8px">Onde, em cada carreta</div><div class="axp">${[1,2,3].map(e=>`<div class="axl"><b>Eixo ${e}</b><span class="s on">esquerdo</span><span class="s on">direito</span></div>`).join('')}</div><div class="row wrap" style="gap:6px;margin-top:10px">${F.fchip('Todos os eixos',{on:1,size:'sm'})}${F.fchip('Só o eixo 3',{size:'sm'})}${F.fchip('Cada eixo, um serviço',{size:'sm'})}</div><p class="muted" style="font-size:12px;margin-top:8px">Só aparece o que a carreta florestal 3 eixos tem. A lona pede eixo e lado pelo tipo de serviço</p></div>`:''}</div>`;
}
R.editor=(s,dev)=>{
  if(dev==='phone') return editorPhone(s);
  if(s==='loading') return `<div class="ed"><div class="fcol">${F.sk('100%',70,14)}${[1,2,3].map(()=>F.sk('100%',150,14)).join('')}</div><div class="fcol">${F.sk('100%',180,14)}${F.sk('100%',160,14)}</div></div>`;
  const sap=s==='sap', ro=sap||s==='noperm';
  const head=`<div class="card edh">${tile('primary','truck-trailer','lg')}<div style="flex:1 1 260px;min-width:0"><div class="nm" ${ro?'style="background:none"':''}>${sap?'Carreta florestal Suzano':'Carreta florestal 3 eixos'}</div><div class="row wrap" style="gap:6px;margin-top:4px">${sap?`<span class="sapbadge">${ic('lock-simple','s14')}Do SAP · plano 30019</span><span class="muted" style="font-size:12.5px">sincronizado há 12 min</span>`:`${chip('success','Versão 2 em uso','check-circle')}${s==='edit'||s==='where'||s==='save'?chip('warning','Mudanças não salvas','pencil-simple'):''}<span class="muted" style="font-size:12.5px">61 carretas · desde 02/11</span>`}</div></div>${ro?'':`<div class="row" style="gap:8px">${btn('Descartar',{variant:'outline',disabled:!(s==='edit'||s==='where'||s==='save')})}${btn('Salvar versão 3',{disabled:!(s==='edit'||s==='where'||s==='save')})}</div>`}</div>`;
  const note=sap?F.notice('info','arrows-left-right','Este plano vem do SAP. Para mudar, mude no SAP; a mudança chega aqui em até 15 min. Os itens sem posição no SAP aparecem como "sem posição"')
    :s==='noperm'?F.notice('info','eye','Seu papel permite ver o plano. Para mudar, peça a quem administra a empresa'):'';
  const levels=LV.map(lv=>`<div class="card lvl"><div class="hd"><span class="badge">${lv.l}</span><b>${lv.t}</b>${lv.inc?`<span class="inc">${ic('stack','s12')}${lv.inc}</span>`:''}<span class="sub">${lv.sub}</span><span class="sp"></span>${ro?'':`<span class="ib" title="Mais ações da revisão" aria-label="Mais ações da revisão">${ic('dots-three-vertical-bold','s16')}</span>`}</div>
    ${lv.items.map((x,i)=>lv.l==='B'&&i===0&&(s==='edit'||s==='where')?itemEdit(s==='where'):`<div class="it">${svcTile(x.k)}<span class="sn">${sentence(x,ro)}</span><span class="kitm" title="Kit do tipo de serviço">${ic('package','s12')} ${x.kit}</span>${ro?'<span></span>':`<span class="ib" title="Mais ações" aria-label="Mais ações">${ic('dots-three-vertical-bold','s16')}</span>`}</div>`).join('')}
    ${ro?'':`<div class="addl">${ic('plus','s16')}Adicionar serviço à ${lv.t}</div>`}</div>`).join('');
  const applies=`<div class="card"><div class="hd">${ic('target','s16 muted')}<b>Vale para</b><span class="sp"></span>${ro?'':btn('Mudar',{variant:'ghost',size:'sm'})}</div>
    <div style="padding:12px 16px;display:flex;flex-direction:column;gap:8px"><div class="row wrap" style="gap:6px">${chip('primary','Carreta florestal','truck-trailer')}${chip('primary','3 eixos','dots-three')}${chip('muted','Todas as bases')}</div><span style="font-size:13px"><b>61 carretas</b> hoje. Carreta nova desse tipo entra sozinha</span></div>
    <div class="hd" style="border-top:1px solid hsl(var(--border))"><b style="font-size:13px">Exceções</b><span class="sub">2</span><span class="sp"></span>${ro?'':btn('Adicionar',{variant:'ghost',size:'sm',icon:'plus'})}</div>
    <div class="exc">${F.plate('RTA2A22')}<span class="tx">Lona a cada 40 mil km<span>Rota de serra · por Marina em 02/11</span></span></div>
    <div class="exc">${F.plate('RTD8K02')}<span class="tx">Sem inspeção de fueiros<span>Carreta de cavaco, sem fueiro · por Rafael em 15/08</span></span></div></div>`;
  const impact=`<div class="card"><div class="hd">${ic('chart-bar','s16 muted')}<b>Na frota hoje</b></div><div style="padding:12px 16px 6px">${distBar([4,9,10,36,2])}</div>
    <div class="kv"><span>${dchip('over')}</span><b>4</b></div><div class="kv"><span>${dchip('now')}</span><b>9</b></div><div class="kv"><span>${dchip('soon')}</span><b>10</b></div><div class="kv"><span>${dchip('ok')}</span><b>36</b></div><div class="kv"><span>${dchip('nokm')}</span><b>2</b></div>
    ${s==='edit'||s==='where'||s==='save'?`<div style="padding:10px 16px 14px">${F.notice('warning','info','Com a lona em 55 mil km: 2 carretas vencem na hora e 3 entram na janela')}</div>`:''}</div>`;
  const versions=`<div class="card"><div class="hd">${ic('clock-counter-clockwise','s16 muted')}<b>Versões</b></div>
    <div class="ver">${chip('success','2')}<span class="tx">Em uso desde 02/11<span>Marina Alves · lona de 50 para 60 mil km</span></span></div>
    <div class="ver">${chip('muted','1')}<span class="tx">15/08 a 02/11<span>Rafael Lima · 18 carretas fizeram preventiva nela</span></span></div></div>`;
  let out=`<div class="ed"><div class="fcol">${head}${note}${levels}</div><div class="aside">${applies}${impact}${sap?'':versions}</div></div>`;
  if(s==='save') out+=F.dialog({title:'Salvar versão 3 do plano',desc:'Carreta florestal 3 eixos',body:`<div class="diff"><div>${ic('disc','s16 muted')}<span>Lona de freio: a cada <s>60 mil km</s> <b class="n">55 mil km</b></span></div></div>
    <div class="fld"><label>O que muda na frota</label><div class="card" style="box-shadow:none"><div class="kv"><span>Passam a vencida</span><b>2 carretas</b></div><div class="kv"><span>Passam a vence agora</span><b>3 carretas</b></div><div class="kv"><span>Seguem como estão</span><b>56 carretas</b></div></div></div>
    <div class="fld"><label>Motivo <span class="opt">(opcional)</span></label><div class="inp ta" style="min-height:60px">Lona durando menos na rota nova de Três Lagoas</div></div>`,
    consequence:'As 61 carretas seguem a versão 3 a partir de hoje. O que já foi feito continua contado na versão 2',action:'Salvar versão 3',actionIcon:'check'});
  return out;
};
function editorPhone(s){
  const ro=s==='sap';
  return `<div class="fcol" style="padding-bottom:90px"><div class="card" style="padding:14px;display:flex;flex-direction:column;gap:6px"><b style="font:800 18px Sora">${ro?'Carreta florestal Suzano':'Carreta florestal 3 eixos'}</b><div class="row wrap" style="gap:6px">${ro?`<span class="sapbadge">${ic('lock-simple','s14')}Do SAP</span>`:chip('success','Versão 2 em uso')}<span class="muted" style="font-size:12.5px">61 carretas</span></div>${distBar([4,9,10,36,2])}</div>
    ${LV.map(lv=>`<div class="card lvl"><div class="hd"><span class="badge">${lv.l}</span><span style="min-width:0"><b>${lv.t}</b><br><span class="sub">${lv.inc?lv.inc+' · ':''}${lv.sub}</span></span></div>${lv.items.map(x=>`<div class="it" style="grid-template-columns:36px minmax(0,1fr)">${svcTile(x.k)}<span class="sn" style="font-size:13.5px">${sentence(x,1)}</span></div>`).join('')}</div>`).join('')}
    ${ro?'':`<div class="card" style="padding:12px 14px;display:flex;gap:10px;align-items:center">${ic('desktop','s20 muted')}<span style="font-size:13px" class="muted">Dá para mudar aqui, mas no computador você vê a frota inteira ao lado</span></div>`}</div>`;
}

/* =====================================================================
   4 PLANO NO VEÍCULO (aba Preventiva do detalhe do veículo)
   ===================================================================== */
const VEH={
  cav:{pl:'QRT4B22',k:'Cavalo 6x4 · frota 815 · Base Curitiba',km:'152.318 km',kms:'hoje 08:12 · OS 1042',rate:'640 km por dia',plan:'Cavalo 6x4 · versão 4',ic:'truck',
    rows:[
      {k:'oil',n:'Troca de óleo e filtros',p:'Revisão A',last:['16/10/2026','133.518 km','OS 0961, concluída por Carlos'],used:.94,st:'now',due:'faltam 1.200 km',sub:'em 153.518 km ou 16/02/2027',hist:[['16/10/2026','133.518 km','OS 0961','no prazo','success'],['18/08/2026','114.200 km','OS 0809','adiantada 1.100 km','warning'],['30/06/2026','95.300 km','OS 0722','atrasada 2.400 km','danger']]},
      {k:'rev',n:'Revisão B',p:'inclui a A',last:['02/06/2026','101.000 km','OS 0702'],used:.86,st:'soon',due:'faltam 8.700 km',sub:'em 161.000 km · ~14 dias'},
      {k:'rev',n:'Revisão C',p:'inclui a A e a B',last:null,used:.45,st:'ok',due:'faltam 66 mil km',sub:'conta de 12/03, quando o plano começou'},
      {k:'brake',n:'Lona de freio',p:'eixos 2 e 3, os dois lados',last:['20/03/2026','104.900 km','OS 0598'],used:.59,st:'ok',due:'faltam 32 mil km',sub:'em 184.900 km ou 20/03/2027'},
      {k:'tach',n:'Aferição do tacógrafo',p:'por data',last:['14/01/2025','',''],used:.92,st:'soon',due:'vence 14/01/2027',sub:'a cada 2 anos'},
    ]},
  car:{pl:'RTE1J77',k:'Carreta florestal 3 eixos · 2º do conjunto C-320',km:'98.420 km',kms:'pelo engate · atualizado 08:12',rate:'610 km por dia',plan:'Carreta florestal 3 eixos · versão 2',ic:'truck-trailer',
    rows:[
      {k:'brake',n:'Lona de freio',p:'eixo 3, os dois lados',last:['12/05/2026','38.570 km','OS 0871'],used:1.03,st:'over',due:'vencida há 1.850 km',sub:'era em 96.570 km'},
      {k:'brake',n:'Lona de freio',p:'eixos 1 e 2, os dois lados',last:['04/09/2026','71.200 km','OS 0902'],used:.45,st:'ok',due:'faltam 32.800 km',sub:'trocadas depois, em outra OS'},
      {k:'lube',n:'Lubrificação geral',p:'todo o veículo',last:['28/10/2026','',''],used:.94,st:'now',due:'vence sáb 28/11',sub:'a cada 30 dias'},
      {k:'stake',n:'Inspeção de fueiros e barrotes',p:'os dois lados',last:['03/11/2026','',''],used:.73,st:'ok',due:'vence 03/12',sub:'a cada 30 dias'},
      {k:'hub',n:'Rolamento de cubo',p:'cada eixo, os dois lados',last:['12/05/2026','38.570 km','OS 0871'],used:.5,st:'ok',due:'faltam 60 mil km',sub:'em 158.570 km'},
    ]},
};
const READ=[
  ['wrench','152.318 km','hoje 08:12','OS 1042 · Rafael Lima',''],
  ['broadcast','151.690 km','ontem 22:40','telemetria',''],
  ['door-open','150.968 km','ter 24/11 06:10','portaria · Joana Reis',''],
  ['door-open','215.700 km','seg 23/11 18:02','portaria · Bruno Reis','chk'],
  ['broadcast','149.070 km','seg 23/11 07:00','telemetria',''],
  ['arrows-clockwise','0 km no painel novo','03/08/2026','troca de painel · antigo parou em 88.410 km','mi'],
];
function readings(o={}){
  const rows=READ.map(r=>{
    const isChk=r[4]==='chk';
    const v=isChk&&o.resolved?`<s>${r[1]}</s>`:r[1];
    return `<div class="rd ${isChk&&!o.resolved?'chk':''} ${r[4]==='mi'?'mi':''}">${tile(isChk&&!o.resolved?'warning':'muted',r[0])}<span class="tx" style="min-width:0"><b style="font-weight:600">${r[2]}</b><span class="trunc" title="${r[3]}">${r[3]}</span>${isChk?(o.resolved?`<span style="color:hsl(var(--success-ink))">${ic('check','s12')} digitado errado, corrigido para 150.700 por Rafael</span>`:`<span style="color:hsl(var(--warning-ink));font-weight:600">63 mil km em 1 dia. Não conta até alguém conferir</span>`):''}</span><span class="v">${v}</span>${isChk&&!o.resolved?`<span class="acts">${btn('Confirmar assim',{variant:'ghost',size:'sm'})}${btn('Corrigir',{variant:'outline',size:'sm'})}</span>`:''}</div>`;}).join('');
  return `<div class="card"><div class="hd">${ic('gauge','s16 muted')}<b>Leituras de km</b>${o.resolved?'':chip('warning','1 a conferir','question')}<span class="sp"></span><span class="fx-btn ghost icon-sm" title="Registrar leitura" aria-label="Registrar leitura">${ic('plus','s16')}</span></div>
    <div class="wk">${[38,44,41,0,47,45,43,46].map((h,i)=>`<i style="height:${h?h:3}px;${h?'':'background:hsl(var(--muted-foreground)/.25)'}" title="Semana ${i+1}: ${h?(h*100).toLocaleString('pt-BR')+' km':'parado na oficina'}"></i>`).join('')}</div><div class="wkl"><span>8 semanas atrás</span><span>esta semana</span></div>
    ${rows}</div>`;
}
function couplings(){
  return `<div class="card"><div class="hd">${ic('link-simple','s16 muted')}<b>Km pelo engate</b><span class="sp"></span><span class="muted" style="font-size:12px">nunca digitado</span></div>
    <div style="padding:10px 16px;font-size:12.5px" class="muted">Cada engate soma à carreta o que o cavalo rodou com ela</div>
    ${[['QRT4B22','desde 20/11 · engatada agora','+3.810 km','até a leitura de hoje'],['QRT7C10','02/11 a 20/11','+8.940 km','151.120 → 160.060'],['QRT9D14','18/10 a 01/11','+7.120 km','88.300 → 95.420'],['sem engate','01/11 a 02/11','0 km','parada no pátio']].map(c=>`<div class="cpl"><span style="min-width:0"><b class="pl" style="font-size:13px">${c[0]}</b><span style="display:block">${c[1]}</span></span><span class="v">${c[2]}<span style="display:block;font-weight:400">${c[3]}</span></span></div>`).join('')}</div>`;
}
function tlRow(r,o={}){
  const last=r.last?`<b style="font-weight:600">${r.last[0]}</b>${r.last[1]?' · '+r.last[1]:''}<span>${r.last[2]||'sem OS registrada'}</span>`:`<span style="color:hsl(var(--foreground))">Sem registro anterior</span><span><a style="color:hsl(var(--primary));font-weight:600">Informar a última</a></span>`;
  const st=o.nokm&&r.used!==undefined&&!r.sub.startsWith('a cada')&&!r.due.startsWith('vence')?'nokm':r.st;
  const due=st==='nokm'?'sem km':r.due;
  const pb=prox(r.used,st,{l:[r.last?r.last[0].slice(0,5):'início','próxima']});
  return `<div class="tl ${o.open?'open':''}">${svcTile(r.k,DS[st][0])}<span class="t" style="min-width:0"><b class="trunc" title="${r.n}">${r.n}</b><span>${r.p}</span>${o.exc?`<span style="display:block;margin-top:4px">${chip('primary','Exceção: a cada 40 mil km','user-gear')}</span>`:''}<span class="pbm" style="display:none">${pb}</span></span>
    <span class="ls">${last}</span><span class="pb">${pb}</span><span class="nx">${dchip(st)}<b class="num" style="font-size:13px">${due}</b><span>${st==='nokm'?'último km em 23/10':r.sub}</span></span></div>
    ${o.open&&r.hist?`<div class="tl open" style="padding-top:0;border-top:0"><span></span><div class="hist">${r.hist.map(h=>`<div><b style="font-weight:600">${h[0]}</b><span class="num">${h[1]}</span><span class="muted">${h[2]} · a próxima contou da conclusão</span>${chip(h[4],h[3])}</div>`).join('')}</div></div>`:''}`;
}
R.veiculo=(s,dev)=>{
  const phone=dev==='phone';
  if(s==='loading') return `<div class="fcol">${F.sk('100%',86,14)}${F.sk('60%',40)}<div class="vg2"><div class="card">${[1,2,3,4].map(()=>`<div class="tl">${F.sk(36,36)}${F.sk('80%',30)}${F.sk('80%',30)}${F.sk('100%',8)}${F.sk(100,30)}</div>`).join('')}</div>${F.sk('100%',300,14)}</div></div>`;
  const car=s==='car', nokm=s==='nokm';
  const v=car?VEH.car:VEH.cav;
  const pl=nokm?'FHK8J21':v.pl;
  const head=`<div class="card vh"><div class="idb">${tile('primary',v.ic,'xl')}<div style="min-width:0"><h2>${pl}</h2><span class="muted" style="font-size:13px">${nokm?'Cavalo 4x2 · frota 702 · Base Ponta Grossa':v.k}</span></div></div>
    <div class="k"><div class="kpi"><div class="eyebrow">Km</div><div class="v num">${nokm?'88.140 km':v.km}</div><div class="muted" style="font-size:11.5px">${nokm?'há 34 dias':v.kms}</div></div>${phone?'':`<div class="kpi"><div class="eyebrow">Média</div><div class="v num">${nokm?'sem dado':v.rate}</div><div class="muted" style="font-size:11.5px">últimos 30 dias</div></div><div class="kpi"><div class="eyebrow">Plano</div><div class="v" style="font-size:14px;margin-top:4px">${s==='none'?'Nenhum':v.plan}</div><div class="muted" style="font-size:11.5px">${s==='none'?'':'pelo tipo de veículo'}</div></div>`}</div></div>`;
  const tabs=`<div class="vtabs">${['Resumo',['OS',12],'Conjunto e engates','Eixos e pneus',['Preventiva',s==='none'?null:car?1:2],'Leituras de km','Custos','Histórico'].map(t=>{const [l,n]=Array.isArray(t)?t:[t];return `<span class="${l==='Preventiva'?'on':''}">${l}${n?`<b style="${l==='Preventiva'?'background:hsl(var(--danger-soft));color:hsl(var(--danger-ink))':''}">${n}</b>`:''}</span>`;}).join('')}</div>`;
  if(s==='none') return `<div class="fcol">${head}${tabs}${F.empty({canvas:1,icon:'calendar-plus',title:'QRT4B22 não segue nenhum plano',hint:'O plano Cavalo 6x4 serve para este veículo pelo tipo e pelos eixos. Ao aplicar, ele começa do último serviço feito ou do km de hoje',action:btn('Aplicar Cavalo 6x4',{icon:'check'})})}</div>`;
  const notice=nokm?F.notice('warning','gauge','Sem km desde 23/10: as preventivas por km estão paradas, as por data seguem. A telemetria parou de mandar leitura',btn('Registrar km',{size:'sm'}))
    :car?F.notice('primary','link-simple','Carreta não tem hodômetro: o km vem do que os cavalos rodaram com ela, engate por engate'):'';
  const rows=(car?VEH.car.rows:VEH.cav.rows).map((r,i)=>tlRow(r,{open:s==='hist'&&i===0,nokm,exc:s==='exc'&&car&&i===0})).join('');
  const list=`<div class="card" style="overflow:hidden"><div class="hd"><b>${car?'Carreta florestal 3 eixos':'Cavalo 6x4'}</b><span class="sub">versão ${car?2:4}</span><span class="sp"></span>${btn('Adicionar exceção',{variant:'ghost',size:'sm',icon:'plus'})}</div>
    <div class="tlh"><span></span><span>Serviço e onde</span><span class="ls">Última vez</span><span class="pb">Até a próxima</span><span style="text-align:right">Próxima</span></div>${rows}</div>`;
  const side=car?couplings():readings({resolved:s==='resolved'});
  return `<div class="fcol">${head}${tabs}${notice}<div class="vg2">${list}<div class="fcol">${side}${car?'':''}</div></div></div>`;
};

/* =====================================================================
   5 LEITURA DE KM (portaria e pátio, celular)
   ===================================================================== */
const KEYS=`<div class="keys">${['1','2','3','4','5','6','7','8','9','','0','⌫'].map(k=>`<span class="${k===''||k==='⌫'?'fn':''}">${k==='⌫'?ic('backspace','s24'):k}</span>`).join('')}</div>`;
R.leitura=(s,dev)=>{
  const tab=dev!=='phone';
  if(s==='pick') return `<div class="kmw"><span class="fx-searchf" style="height:48px;font-size:15px">${ic('magnifying-glass','s20')}<span>Placa, frota ou conjunto</span><span style="flex:1"></span>${ic('scan','s20')}</span>
    <div class="mhead"><b>Chegando hoje</b><span>pela agenda e pelo km</span></div>
    <div class="card recent">${[['link-simple','C-118','QRT7C10 + 2 carretas · agendado','calendar-check'],['truck','DLY1J07','frota 812 · agendado para hoje','calendar-check']].map(r=>`<div class="rv">${tile('primary',r[0])}<span class="tx"><b>${r[1]}</b><span>${r[2]}</span></span>${ic('caret-right','s16 muted')}</div>`).join('')}</div>
    <div class="mhead"><b>No pátio agora</b><span>12</span></div>
    <div class="card recent">${[['truck','QRT4B22','frota 815 · última leitura hoje 08:12','success'],['truck','QRT1A09','frota 820 · última há 2 dias','muted'],['truck-trailer','RTE1J77','carreta · km pelo engate','muted']].map(r=>`<div class="rv">${tile(r[3],r[0])}<span class="tx"><b>${r[1]}</b><span>${r[2]}</span></span>${ic('caret-right','s16 muted')}</div>`).join('')}</div></div>`;
  const veh=s==='trailer'?`<div class="card vpick">${tile('primary','truck-trailer','lg')}<span class="tx"><b>RTE1J77</b><span>Carreta florestal · 2º do C-320</span></span>${btn('Trocar',{variant:'ghost',size:'sm'})}</div>`
    :`<div class="card vpick">${tile('primary','truck','lg')}<span class="tx"><b>QRT1A09</b><span>Cavalo · frota 820 · último 148.220 km, ter 24/11</span></span>${btn('Trocar',{variant:'ghost',size:'sm'})}</div>`;
  if(s==='trailer') return `<div class="kmw">${veh}<div class="card" style="padding:16px;display:flex;flex-direction:column;gap:10px;align-items:flex-start">${tile('primary','link-simple','lg')}<b style="font:800 26px Sora" class="num">98.420 km</b><span style="font-size:14px">Carreta não tem hodômetro: o km vem do cavalo que puxa ela. Não precisa digitar</span><span class="muted" style="font-size:12.5px">Engatada no QRT4B22 desde 20/11</span></div>
    <div style="margin-top:auto;display:flex;flex-direction:column;gap:8px"><div class="bigbtn">${ic('truck','s20')}Registrar km do QRT4B22</div><div class="bigbtn out">Próximo veículo</div></div></div>`;
  if(s==='done') return `<div class="kmw"><div class="okbox">${tile('success','check-circle','xl')}<b>149.620 km registrado</b><p>QRT1A09 · agora, por Joana Reis</p></div>
    <div class="card" style="padding:12px 14px;display:flex;gap:10px;align-items:center">${tile('warning','calendar-check')}<span style="font-size:13.5px"><b style="font-weight:600">Revisão A vence em 1.000 km</b><br><span class="muted">O chefe de oficina já vê isso na chegada</span></span></div>
    <div class="mhead"><b>Hoje</b><span>14 leituras</span></div><div class="card recent">${[['QRT1A09','149.620 km · agora'],['QRT4B22','152.318 km · 08:12'],['DLY1J07','160.400 km · 07:40']].map(r=>`<div class="rv">${tile('muted','gauge')}<span class="tx"><b>${r[0]}</b><span>${r[1]}</span></span></div>`).join('')}</div>
    <div style="margin-top:auto"><div class="bigbtn">${ic('plus','s20')}Próximo veículo</div></div></div>`;
  if(s==='offline') return `<div class="kmw">${F.notice('warning','wifi-slash','Sem sinal. As leituras ficam no aparelho e enviam sozinhas quando o sinal voltar')}<div class="card"><div class="hd"><b>Guardadas no aparelho</b><span class="sub">2</span></div>${[['QRT1A09','149.620 km · 10:42'],['DLY1J07','160.400 km · 10:31']].map(r=>`<div class="pend">${ic('cloud-arrow-up','s20 muted')}<span class="tx"><b>${r[0]}</b><span>${r[1]}</span></span>${chip('muted','Enviando ao voltar')}</div>`).join('')}</div>
    <div style="margin-top:auto"><div class="bigbtn">${ic('plus','s20')}Próximo veículo</div></div></div>`;
  const val=s==='jump'?'213.620':s==='lower'?'14.620':'149.620';
  const disp=`<div class="kmd ${s==='jump'||s==='lower'?'warn':''}"><span class="eyebrow">Km no painel</span><span class="v">${val}<small>km</small></span><span class="e">${s==='jump'||s==='lower'?'Esperado perto de 149.600':'Esperado perto de 149.600 · ok'}</span></div>`;
  let mid='';
  if(s==='jump') mid=`<div class="chkbox"><b>${ic('warning','s16')} 65 mil km a mais em 2 dias</b><p>Confira o painel. Se registrar assim, a preventiva só usa este km depois que alguém da manutenção conferir</p><div class="bt">${btn('Corrigir',{variant:'outline'})}${btn('Registrar assim',{variant:'secondary'})}</div></div>`;
  if(s==='lower') mid=`<div class="chkbox"><b>${ic('warning','s16')} Menor que o último (148.220 km)</b><p>O painel foi trocado? Se foi, o km antigo fica guardado e o novo começa daqui</p><div class="bt">${btn('Corrigir',{variant:'outline'})}${btn('Painel trocado',{variant:'secondary'})}</div></div>`;
  const cta=s==='jump'||s==='lower'?'':`<div class="bigbtn">${ic('check','s20')}Registrar 149.620 km</div>`;
  const today=`<div class="mhead"><b>Hoje nesta portaria</b><span>14 leituras · 1 a conferir</span></div><div class="card recent">${[['QRT4B22','152.318 km · 08:12 · OS 1042','success','gauge'],['DLY1J07','160.400 km · 07:40','success','gauge'],['QRT2E88','213.900 km · 07:05 · a conferir','warning','question']].map(r=>`<div class="rv">${tile(r[2],r[3])}<span class="tx"><b>${r[0]}</b><span>${r[1]}</span></span></div>`).join('')}</div>`;
  return `<div class="kmw">${veh}${disp}${mid}${cta}${tab?today:KEYS}</div>`;
};

/* =====================================================================
   6 CONFORMIDADE (dono, diretoria)
   ===================================================================== */
const MON=[['Set',74,17,9],['Out',77,15,8],['Nov',82,11,7]];
const BASES=[['Base Curitiba',71,'84%','6 · 9.800 km','5 · 6.200 km antes'],['Base Ponta Grossa',52,'79%','7 · 14.100 km','4 · 5.900 km antes'],['Base Três Lagoas',41,'68%','10 · 17.300 km','4 · 6.500 km antes']];
const CARR=[['Transportadora Demo',112,'81%','12 · 21.300 km','8 · 11.200 km antes'],['Florestal Sul',52,'71%','11 · 19.900 km','5 · 7.400 km antes']];
R.conf=(s,dev)=>{
  const phone=dev==='phone';
  if(s==='loading') return `<div class="cf">${F.sk('50%',34)}<div class="tiles">${[1,2,3,4].map(()=>F.sk('100%',96,14)).join('')}</div><div class="cfg">${F.sk('100%',220,14)}${F.sk('100%',220,14)}</div></div>`;
  if(s==='noperm') return F.empty({icon:'lock-simple',title:'Sem acesso à conformidade',hint:'Seu papel não permite ver os indicadores de preventiva. Peça a quem administra a empresa'});
  if(s==='empty') return `<div class="cf">${F.empty({canvas:1,icon:'chart-bar',title:'A conformidade aparece com a primeira preventiva concluída',hint:'Os planos começaram em 26/11. Até lá, a agenda mostra o que vence',action:btn('Ver a agenda',{variant:'outline'})})}</div>`;
  const filters=`<div class="toolbar">${F.seg(['30 dias','90 dias','12 meses'],'90 dias',{variant:'pill',size:'sm',full:false})}${F.fchip('Todas as bases',{menu:1,size:'sm'}).replace('fx-fchip','fx-fchip all')}${F.fchip(s==='carrier'?'Por transportadora':'Todas as transportadoras',{menu:1,size:'sm',on:s==='carrier'})}${F.fchip('Todos os planos',{menu:1,size:'sm'}).replace('fx-fchip','fx-fchip all')}<span style="flex:1"></span>${phone?'':btn('Exportar',{variant:'outline',size:'sm',icon:'download-simple'})}</div>`;
  const T=(tone,icon,l,v,h)=>`<div class="tile2"><span class="l">${tile(tone,icon)}${l}</span><span class="v">${v}</span><span class="h">${h}</span></div>`;
  const tiles=`<div class="tiles">${T('success','check-circle','No prazo','78%','<b>128</b> de 164 feitas dentro da janela')}${T('danger','warning-octagon','Atrasadas','14%','<b>23</b> · rodaram <b>41.200 km</b> vencidas')}${T('warning','rewind','Adiantadas','8%','<b>13</b> · <b>18.600 km</b> de vida gasta antes')}${T('primary','clock-countdown','Adiadas com motivo','9','<b>5</b> por falta de peça')}</div>`;
  const chart=`<div class="card"><div class="hd"><b>Por mês</b><span class="sub">das preventivas concluídas</span></div><div style="padding:10px 0 4px">${MON.map(m=>`<div class="sb"><b>${m[0]}</b><div class="bar"><i class="b-on" style="width:${m[1]}%" title="${m[0]}: ${m[1]}% no prazo"></i><i class="b-late" style="width:${m[2]}%" title="${m[0]}: ${m[2]}% atrasadas"></i><i class="b-early" style="width:${m[3]}%" title="${m[0]}: ${m[3]}% adiantadas"></i></div><span class="num muted">${m[1]}%</span></div>`).join('')}</div>
    <div class="legend"><span><i class="b-on"></i>${ic('check','s12')}No prazo</span><span><i class="b-late"></i>${ic('warning-octagon','s12')}Atrasada</span><span><i class="b-early"></i>${ic('rewind','s12')}Adiantada</span></div>
    <div style="padding:0 16px 14px">${F.notice('primary','info','Corretiva × preventiva no período: 61% × 39% das OS (eram 70% × 30% em setembro)')}</div></div>`;
  const rows=s==='carrier'?CARR:BASES;
  const table=`<div class="card" style="overflow:hidden"><div class="hd"><b>${s==='carrier'?'Por transportadora':'Por base'}</b><span class="sp"></span></div><div class="bt2 hd"><span>${s==='carrier'?'Transportadora':'Base'}</span><span class="r">Feitas</span><span class="r">No prazo</span><span>Atrasadas · km vencidos</span><span>Adiantadas</span></div>
    ${rows.map((r,i)=>`<div class="bt2" ${s==='drill'&&i===2?'style="background:hsl(var(--muted)/.6)"':''}><b style="font-weight:600" class="trunc" title="${r[0]}">${r[0]}</b><span class="r num">${r[1]}</span><span class="r num"><b>${r[2]}</b></span><span class="num">${r[3]}</span><span class="num muted">${r[4]}</span></div>`).join('')}
    ${s==='drill'?`<div style="background:hsl(var(--muted)/.35);border-top:1px solid hsl(var(--border))"><div class="eyebrow" style="padding:10px 16px 0">Base Três Lagoas · atrasadas</div>${[['rev','DLY1J07 · Revisão B','rodou 4.300 km vencida · adiada 1 vez: sem peça','OS 1051'],['brake','RTE1J77 · Lona de freio, eixo 3','rodou 1.850 km vencida · estava em viagem','OS 1042'],['stake','RTC3B19 · Fueiros e barrotes','3 dias vencida','agendada 27/11']].map(x=>`<div class="late">${svcTile(x[0],'danger')}<span class="t" style="min-width:0"><b class="trunc">${x[1]}</b><span>${x[2]}</span></span><span style="font-size:12.5px;color:hsl(var(--primary));font-weight:600;white-space:nowrap">${x[3]}</span></div>`).join('')}</div>`:''}</div>`;
  const worst=s==='drill'?'':`<div class="card" style="overflow:hidden"><div class="hd"><b>Mais tempo vencidas</b><span class="sub">abertas agora</span></div>${[['rev','DLY1J07 · Revisão B','rodou 4.300 km vencida · adiada 1 vez: sem peça','Agenda'],['brake','RTE1J77 · Lona de freio, eixo 3','rodou 1.850 km vencida','OS 1042'],['stake','RTC3B19 · Fueiros e barrotes','3 dias vencida','agendada 27/11']].map(x=>`<div class="late">${svcTile(x[0],'danger')}<span class="t" style="min-width:0"><b class="trunc">${x[1]}</b><span>${x[2]}</span></span><span style="font-size:12.5px;color:hsl(var(--primary));font-weight:600;white-space:nowrap">${x[3]}</span></div>`).join('')}</div>`;
  return `<div class="cf">${filters}${tiles}<div class="cfg">${chart}<div class="fcol">${table}${worst}</div></div></div>`;
};

/* =====================================================================
   7 SAP MODO A
   ===================================================================== */
R.sap=s=>{
  const down=s==='down', link=s==='link';
  const status=down?F.notice('danger','plugs','O SAP não responde desde 10:40. As leituras ficam guardadas e seguem sozinhas quando ele voltar. A oficina continua trabalhando normal',btn('Tentar agora',{variant:'outline',size:'sm'}))
    :link?F.notice('warning','link-break','3 veículos sem equipamento do SAP: as leituras deles não vão para lá',btn('Ligar agora',{size:'sm'}))
    :F.notice('success','check-circle','Tudo sincronizado · última troca há 2 min');
  const flow=(t,rows)=>`<div class="card flow"><div class="hd"><b>${t}</b></div>${rows.map(r=>`<div class="fl">${tile(r[3]||'primary',r[0])}<span class="t" style="min-width:0"><b>${r[1]}</b><span>${r[2]}</span></span><span class="v">${r[4]?`<b class="num">${r[4]}</b>`:''}${r[5]||''}</span></div>`).join('')}</div>`;
  const out=flow('Do Truck para o SAP',[
    ['gauge','Leituras de km e horas','dos cavalos, da portaria, da OS e da telemetria','primary',down?'38':'214',down?'<span style="color:hsl(var(--warning-ink))">esperando</span>':'hoje'],
    ['link-simple','Km das carretas pelo engate','cada carreta com o próprio ponto de medição','primary',down?'12':'61',down?'<span style="color:hsl(var(--warning-ink))">esperando</span>':'hoje'],
    ['check-square','Ordens concluídas','com a data e o km reais da conclusão','primary','5','esta semana'],
    ['arrow-clockwise',down?'Conferência de volta':'1 leitura reenviada hoje',down?'retoma quando o SAP voltar':'o SAP aceitou e não gravou; o Truck percebeu e reenviou às 10:12','muted','','<span class="muted">gravada 10:14</span>']]);
  const inn=flow('Do SAP para o Truck',[
    ['list-checks','Planos','só leitura, com o dono à vista','muted','4','planos'],
    ['clipboard-text','Ordens de manutenção','viram OS quando o conjunto chega no pátio','muted','6','abertas'],
    ['hourglass-medium','Esperando chegar','ordem 4000131 · Conjunto C-207','warning','1','']]);
  const eq=`<div class="card"><div class="hd"><b>Equipamentos ligados</b><span class="sub">${link?'93 de 96':'96 de 96'}</span><span class="sp"></span>${btn('Ver todos',{variant:'ghost',size:'sm'})}</div>${link?[['QRT0Z11','Cavalo novo, cadastrado em 20/11'],['RTF0A01','Carreta nova'],['RTF0A02','Carreta nova']].map(r=>`<div class="exc">${F.plate(r[0])}<span class="tx">${r[1]}<span>sem equipamento do SAP</span></span>${btn('Ligar',{variant:'outline',size:'sm'})}</div>`).join(''):`<div style="padding:12px 16px;font-size:13px" class="muted">Cada veículo do Truck aponta para um equipamento e um ponto de medição do SAP</div>`}</div>`;
  const mode=`<div class="card" style="padding:14px 16px;display:flex;gap:14px;align-items:center;flex-wrap:wrap">${tile('info','arrows-left-right','lg')}<span style="flex:1 1 300px"><b style="font:700 15px Sora">O SAP planeja, o Truck faz o pátio</b><br><span class="muted" style="font-size:13px">Planos e ordens nascem no SAP. O Truck manda o km e fecha a ordem com o que aconteceu de verdade</span></span>${btn('Mudar o modo',{variant:'ghost',size:'sm'})}</div>`;
  return `<div class="fcol">${mode}${status}<div class="sapg">${out}${inn}</div>${eq}</div>`;
};

/* nav preview body */
R.nav=()=>`<div class="navnote"><div class="card" style="padding:16px;display:flex;flex-direction:column;gap:10px"><b style="font:700 15px Sora">Preventiva, um item do menu</b><span style="font-size:13.5px">Logo depois de Ordens de serviço: <b>Agenda</b> (o que vence), <b>Planos</b> (as regras) e <b>Conformidade</b> (como foi). No celular fica em Mais; o porteiro registra o km pelo Pátio, e o chefe vê as preventivas na própria OS.</span></div></div>`;

document.addEventListener('DOMContentLoaded',()=>{
  patchNav(); F.bind(R); fit();
  let t; window.addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(fit,120);});
  document.querySelectorAll('.states button').forEach(b=>b.addEventListener('click',()=>setTimeout(fit,0)));
});
})();
