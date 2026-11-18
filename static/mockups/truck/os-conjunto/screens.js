const ST={work:['t-work','Em manutenção'],wait:['t-wait','Na fila'],done:['t-ok','Concluída'],out:['t-pause','Saiu'],moved:['t-pause','Transferida'],pause:['t-pause','Pausada']};
const train=fs=>`<span class="train">${fs.map(f=>`<i class="${f}"></i>`).join('')}</span>`;
const X=`<span class="x"><span class="ic i-x s16"></span></span>`;
const head=(eb,title,sub)=>`<div class="dh"><div class="t"><div class="eyebrow">${eb}</div><h3>${title}</h3>${sub?`<p>${sub}</p>`:''}</div>${X}</div>`;
const R={};
const CONC={
  done:[
    {tone:'ok',plate:'RTF6K38',pos:'1º',kind:'Carreta',line:'3 serviços · terminou hoje 16:40 · Carlos',stop:'2 d 8 h',cost:'1.240,00'},
    {tone:'ok',plate:'RTE1J77',pos:'2º',kind:'Carreta',line:'1 serviço · terminou hoje 15:10 · Ana',stop:'2 d 6 h',cost:'180,00'},
    {tone:'ok',plate:'SRK9H46',pos:'3º',kind:'Carreta',line:'1 serviço · terminou ontem 17:05 · Bruno',stop:'1 d 9 h',cost:'310,00'}],
};
CONC.followup=[CONC.done[0],CONC.done[1],{tone:'left',plate:'SRK9H46',pos:'3º',kind:'Carreta',line:'Saiu para seguir viagem · 1 serviço foi para a <a href="#" class="lnk">OS 1043</a>',stop:'1 d 2 h',cost:'120,00'}];
CONC.blocked=[CONC.done[0],{tone:'open',plate:'RTE1J77',pos:'2º',kind:'Carreta',line:'1 de 2 serviços feitos · troca de cuíca em andamento com Ana',stop:'2 d 8 h',cost:'90,00',go:true},CONC.done[2]];
CONC.noperm=CONC.done;
const TONE_TILE={ok:['hsl(var(--success-soft))','hsl(var(--success-text))','i-check'],left:['hsl(var(--muted))','hsl(var(--muted-foreground))','i-exit'],open:['hsl(var(--primary-soft))','hsl(var(--primary))','i-wrench']};
function concluirBody(s,narrow){
  const cost=s!=='noperm', fs=CONC[s==='ready'?'done':s];
  const stats=[['Serviços',s==='blocked'?'4 de 5 feitos':s==='followup'?'4 feitos':'5 de 5 feitos',s==='followup'?'1 foi para a OS 1043':'na OS 1042'],['Na oficina','2 d 8 h','desde 07/11 08:42']];
  if(cost) stats.push(['Custo',s==='followup'?'R$ 1.540,00':s==='blocked'?'R$ 1.640,00':'R$ 1.730,00','peças e mão de obra']);
  const strip=`<div class="stats">${stats.map(([l,v,h])=>`<div class="stat"><div class="eyebrow">${l}</div><div class="v">${v}</div><div class="muted" style="font-size:12px">${h}</div></div>`).join('')}</div>`;
  const rows=fs.map(f=>{const [bg,fg,ic]=TONE_TILE[f.tone];
    return `<div class="frow ${f.tone==='open'?'open':''}"><span class="tile" style="background:${bg};color:${fg}"><span class="ic ${ic} s20"></span></span>
      <div style="flex:1 1 220px;min-width:0"><div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap"><b class="plate">${f.plate}</b><span class="muted" style="font-size:12.5px">${f.pos} · ${f.kind}</span>${f.tone==='left'?'<span class="chip t-pause" style="height:20px;font-size:11px">Saiu</span>':f.tone==='open'?'<span class="chip t-work" style="height:20px;font-size:11px">Em manutenção</span>':''}</div><div style="font-size:12.5px;margin-top:1px;text-wrap:pretty">${f.line}</div>${f.go?'<button class="btn outline" style="height:30px;margin-top:8px;font-size:12.5px">Ir para RTE1J77<span class="ic i-right s14"></span></button>':''}</div>
      ${cost?`<div class="nums"><div><span class="muted">parado</span> ${f.stop}</div><div><b>R$ ${f.cost}</b></div></div>`:''}</div>`;}).join('');
  const after=[];
  if(s==='blocked') after.push(['i-lock','muted','Os veículos continuam nesta OS até o último ficar pronto']);
  else after.push(['i-check','ok',s==='followup'?'RTF6K38 e RTE1J77 ficam livres para outra OS':'RTF6K38, RTE1J77 e SRK9H46 ficam livres para outra OS']);
  if(s==='followup'){after.push(['i-link','muted','A <a href="#" class="lnk">OS 1043</a> continua aberta com 1 serviço do SRK9H46']);after.push(['i-warn','warn','2 falhas do checklist CK-0041 ainda sem decisão. <a href="#" class="lnk">Decidir agora</a>']);}
  const C={ok:'hsl(var(--success-text))',muted:'hsl(var(--muted-foreground))',warn:'hsl(var(--warning-text))'};
  const afterBlock=`<div class="after"><div class="eyebrow" style="margin-bottom:6px">Ao concluir</div>${after.map(([ic,t,txt])=>`<div style="display:flex;gap:8px;align-items:flex-start;font-size:13px;${t==='warn'?'color:'+C.warn+';font-weight:600':''}"><span class="ic ${ic} s16" style="color:${C[t]};margin-top:2px"></span><span style="text-wrap:pretty">${txt}</span></div>`).join('')}</div>`;
  const foot=s==='blocked'?`<span style="display:inline-flex;gap:6px;align-items:center;color:hsl(var(--warning-text));font-weight:600"><span class="ic i-info s14"></span>RTE1J77 ainda está em manutenção</span>`:`<b>OS 1042</b> · ${s==='followup'?'2 veículos liberados · 1 saiu antes':'3 veículos liberados'}`;
  return {body:`${strip}<div class="flist">${rows}</div>${afterBlock}`,foot,ready:s!=='blocked'};
}
R.concluir=s=>{const b=concluirBody(s);
  return `<div class="dh"><div class="t"><div class="eyebrow">OS 1042 · Conjunto C-320</div><h3>Concluir a OS 1042</h3></div>${X}</div><div class="db">${b.body}</div><div class="df" style="flex-wrap:wrap"><span class="grow" style="min-width:220px;color:hsl(var(--foreground))">${b.foot}</span><div style="display:flex;gap:10px;margin-left:auto"><button class="btn outline">Cancelar</button><button class="btn primary" ${b.ready?'':'disabled'}><span class="ic i-flag s16"></span>Concluir OS</button></div></div>`;};
const AX3=[{no:1,fn:'livre',dual:true},{no:2,fn:'livre',dual:true},{no:3,fn:'livre',dual:true}];
const VEH={RTF6K38:{plate:'RTF6K38',kind:'semi',axles:AX3},RTE1J77:{plate:'RTE1J77',kind:'semi',axles:[]},DLY1J07:{plate:'DLY1J07',kind:'truck',axles:[{no:1,fn:'direcional',dual:false},{no:2,fn:'tração',dual:true}]}};
const SIDE={L:'esquerdo',R:'direito'};
const LEVEL={none:'Nenhuma',side:'Lado',axle:'Eixo',axle_side:'Eixo e lado',wheel:'Roda'};
const TAP={side:'Toque em um ou nos dois lados',axle:'Toque em um ou mais eixos',axle_side:'Toque no lado de cada eixo',wheel:'Toque nas rodas'};
const wheelsOf=a=>a.dual?[['L','o',66],['L','i',100],['R','i',260],['R','o',294]]:[['L','s',92],['R','s',268]];
const listJoin=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' e '+a[a.length-1];
function summary(v,level,sel){
  if(level==='none') return '';
  if(level==='side'){const s=['L','R'].filter(x=>sel.has(x)); if(!s.length) return ''; return s.length===2?'os dois lados':'lado '+SIDE[s[0]];}
  if(level==='axle'){const n=v.axles.filter(a=>sel.has('a'+a.no)).map(a=>String(a.no)); return n.length?(n.length>1?'eixos ':'eixo ')+listJoin(n):'';}
  const per=v.axles.map(a=>{let t;
    if(level==='axle_side'){const s=['L','R'].filter(x=>sel.has('a'+a.no+x)); if(!s.length) return null; t=s.length===2?'os dois lados':SIDE[s[0]];}
    else{const all=wheelsOf(a),ws=all.filter(([s,sl])=>sel.has('a'+a.no+s+sl)); if(!ws.length) return null;
      if(ws.length===all.length) t=a.dual?'as 4 rodas':'os dois lados';
      else t=['L','R'].map(s=>{const sl=ws.filter(w=>w[0]===s).map(w=>w[1]); if(!sl.length) return null; if(!a.dual) return SIDE[s]; return SIDE[s]+' '+(sl.length===2?'interno e externo':(sl[0]==='i'?'interno':'externo'));}).filter(Boolean).join(' e ');}
    return {no:a.no,t};}).filter(Boolean);
  const groups=[]; per.forEach(p=>{const g=groups.find(x=>x.t===p.t); if(g) g.n.push(String(p.no)); else groups.push({t:p.t,n:[String(p.no)]});});
  return groups.map(g=>(g.n.length>1?'eixos ':'eixo ')+listJoin(g.n)+', '+g.t).join('; ');
}
function planSVG(v,level,sel,o={}){
  const W=360,CX=180,cab=v.kind==='truck',top=cab?96:50,gap=82;
  const yOf=i=>top+46+i*gap,last=yOf(v.axles.length-1),H=last+(level==='side'?66:40);
  const PR='hsl(var(--primary))',PS='hsl(var(--primary-soft))',BD='hsl(var(--border))';
  const box=(x,y,w,h,on,r=10)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${on?PS:'transparent'}" stroke="${on?PR:o.readonly?'transparent':BD}" stroke-width="${on?1.6:1}" ${on?'':'stroke-dasharray="4 3"'}/>`;
  let g=`<text x="12" y="20" font-size="10.5" font-weight="600" fill="hsl(var(--muted-foreground))">↑ frente</text>`;
  if(level==='side') ['L','R'].forEach(s=>{const on=sel.has(s),x=s==='L'?46:234;
    g+=box(x,top+16,80,last-top+14,on,14)+`<text x="${x+40}" y="${last+52}" text-anchor="middle" font-size="12" font-weight="700" fill="${on?PR:'hsl(var(--muted-foreground))'}">${s==='L'?'Esquerdo':'Direito'}</text>`;});
  g+=`<rect x="${CX-14}" y="${top}" width="8" height="${last+24-top}" rx="4" fill="#d3d8de" stroke="#9aa0aa"/><rect x="${CX+6}" y="${top}" width="8" height="${last+24-top}" rx="4" fill="#d3d8de" stroke="#9aa0aa"/>`;
  g+=cab?`<rect x="${CX-42}" y="14" width="84" height="70" rx="15" fill="#d3d8de" stroke="#9aa0aa" stroke-width="1.5"/><path d="M${CX-34} 36 q34 -14 68 0 v-8 q-34 -12 -68 0 z" fill="#9aa6b2"/>`:`<rect x="${CX-10}" y="${top-16}" width="20" height="16" rx="4" fill="#d3d8de" stroke="#9aa0aa"/><circle cx="${CX}" cy="${top-8}" r="4" fill="#9aa0aa"/>`;
  v.axles.forEach((a,i)=>{const y=yOf(i),ws=wheelsOf(a),xs=ws.map(w=>w[2]),x0=Math.min(...xs)-12,x1=Math.max(...xs)+12;
    if(level==='axle') g+=box(x0-12,y-28,x1-x0+24,56,sel.has('a'+a.no),12);
    if(level==='axle_side') ['L','R'].forEach(s=>{const sx=ws.filter(w=>w[0]===s).map(w=>w[2]); g+=box(Math.min(...sx)-17,y-28,Math.max(...sx)-Math.min(...sx)+34,56,sel.has('a'+a.no+s),10);});
    const axOn=level==='axle'&&sel.has('a'+a.no);
    g+=`<rect x="${x0}" y="${y-4}" width="${x1-x0}" height="8" rx="4" fill="${axOn?PR:'#d3d8de'}" stroke="${axOn?PR:'#9aa0aa'}"/>`;
    g+=`<text x="${x0-12}" y="${y-34}" font-size="10.5" font-weight="700" font-family="Sora,Inter" fill="hsl(240 4% 44%)">Eixo ${a.no} · ${a.fn}</text>`;
    ws.forEach(([s,sl,x])=>{const on=level==='wheel'?sel.has('a'+a.no+s+sl):level==='axle'?sel.has('a'+a.no):level==='axle_side'?sel.has('a'+a.no+s):false;
      const dim=(level==='side'||level==='none')||(o.readonly&&!on);
      if(on&&level==='wheel') g+=`<rect x="${x-13}" y="${y-25}" width="26" height="50" rx="8" fill="none" stroke="hsl(var(--primary)/.3)" stroke-width="4"/>`;
      g+=`<rect x="${x-9}" y="${y-21}" width="18" height="42" rx="5" fill="${on?PR:'#23262c'}" opacity="${dim?.35:1}"/>`;
      if(level==='wheel'&&!o.readonly&&!on) g+=`<rect x="${x-13}" y="${y-25}" width="26" height="50" rx="8" fill="none" stroke="${BD}" stroke-dasharray="4 3"/>`;});
  });
  return `<svg viewBox="0 0 ${W} ${H}" style="display:block;width:100%;max-width:${o.w||340}px;margin:0 auto" role="img">${g}</svg>`;
}
const locChip=(plate,l,extra='')=>`<span class="loc" style="max-width:360px" ${extra}><b style="color:hsl(var(--foreground))">${plate}</b>${l?` · <span${l==='sem posição'?' class="muted"':''}>${l}</span>`:''}</span>`;
R.tipo=s=>{
  if(s==='list'){
    const rows=[['Troca de lona de freio','Freios','Eixo e lado'],['Regulagem de catraca','Freios','Eixo e lado'],['Troca de pneu','Pneus','Roda'],['Troca de bucha da suspensão','Suspensão','Eixo'],['Reparo de para-lama','Estrutura','Lado'],['Lubrificação geral','Lubrificação','']];
    return `<div class="pane" style="max-width:900px;margin:0 auto"><div class="lrow lhead" style="grid-template-columns:minmax(0,1.6fr) 1fr 150px"><span>Tipo de serviço</span><span>Categoria</span><span>Pede posição</span></div>${rows.map(r=>`<div class="lrow" style="grid-template-columns:minmax(0,1.6fr) 1fr 150px"><b>${r[0]}</b><span class="muted">${r[1]}</span><span>${r[2]?`<span class="chip t-none">${r[2]}</span>`:'<span class="muted" style="font-size:12.5px">Não pede</span>'}</span></div>`).join('')}</div>`;}
  const ex={none:'Ex.: troca de óleo, lubrificação geral',side:'Ex.: para-lama, estrutura lateral',axle:'Ex.: suspensão, alinhamento',axle_side:'Ex.: freio, cubo',wheel:'Ex.: pneu'}[s];
  const sel={none:[],side:['L'],axle:['a2'],axle_side:['a2L'],wheel:['a2Lo']}[s];
  const nm={none:'Lubrificação geral',side:'Reparo de para-lama',axle:'Troca de bucha da suspensão',axle_side:'Troca de lona de freio',wheel:'Troca de pneu'}[s];
  const prev=s==='none'?`<div class="planbox" style="padding:16px;text-align:center" class="muted"><span class="muted" style="font-size:13px">A OS não pede posição para este serviço</span></div>`:`<div class="planbox">${planSVG(VEH.RTF6K38,s,new Set(sel),{w:240})}</div>`;
  return `<div class="scrim" style="background:transparent;align-items:start"><div class="dialog" style="max-height:none">${head('Configurações','Editar tipo de serviço','')}<div class="db">
    <div class="field"><label>Nome</label><div class="input"><input value="${nm}"></div></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px"><div class="field"><label>Categoria</label><div class="input"><input value="${TYPES[nm].cat}"></div></div><div class="field"><label>Componente sugerido</label><div class="input"><input value="${TYPES[nm].comp||'Sem componente'}"></div></div></div>
    <div class="field"><label>Pede posição</label><div class="seg" style="flex-wrap:wrap;align-self:flex-start">${Object.entries(LEVEL).map(([k,l])=>`<span class="${k===s?'on':''}">${l}</span>`).join('')}</div><span class="hint">${ex}</span></div>
    <div class="field"><label>Na OS, a planta pede assim</label>${prev}</div>
    <div class="field"><label>Aplica-se a</label><div class="input"><input value="Todos os veículos"></div></div>
  </div><div class="df"><span class="grow"><span class="ic i-gear s14"></span> 1 alteração</span><button class="btn outline">Cancelar</button><button class="btn primary">Salvar</button></div></div></div>`;
};

function chkPreview(){
  const sel=new Set(['a2L']);
  return `
  <div class="pane" style="flex:1 1 380px;min-width:0"><div style="padding:12px 14px;border-bottom:1px solid hsl(var(--border))"><div class="eyebrow">Freios · RTF6K38</div></div>
   <div style="padding:12px 14px;display:flex;align-items:center;gap:10px"><b style="flex:1">Lona de freio dentro do limite</b><span class="chip t-nok">Não conforme</span></div>
   <div style="padding:0 14px 14px;display:flex;flex-direction:column;gap:10px;background:hsl(var(--danger-soft)/.5);padding-top:12px"><div class="field"><div style="display:flex;align-items:baseline;gap:8px"><label>Onde</label><span class="hint">Toque no lado de cada eixo</span></div><div class="planbox" style="background:hsl(var(--card))">${planSVG(VEH.RTF6K38,'axle_side',sel,{w:260})}</div></div><div class="field"><label>Observação</label><div class="input"><input value="Lona no rebite, lado do motorista"></div></div></div></div>
  <div class="pane" style="flex:1 1 380px;min-width:0"><div style="padding:10px 14px;background:hsl(var(--toolbar))"><span class="eyebrow">Na OS 1042 · serviço criado da falha</span></div>
   <div class="svc" style="align-items:center"><span class="tile" style="width:30px;height:30px;background:hsl(var(--muted))"><span class="ic i-wrench s16 muted"></span></span><div style="flex:1;min-width:0"><b>Troca de lona de freio</b><div style="margin-top:3px;display:flex;gap:6px;flex-wrap:wrap">${locChip('RTF6K38','eixo 2, esquerdo')}<span class="chip t-none"><span class="ic i-check s14"></span>Do checklist CK-0041</span></div></div><span class="chip t-wait">Na fila</span></div>
   <div style="padding:10px 14px" class="muted"><span style="font-size:12.5px">A posição vem da marcação de quem inspecionou. Se estiver errada, troque pelo menu do serviço antes de começar.</span></div></div>`;
}
const TYPES={
  'Troca de lona de freio':{cat:'Freios',lv:'axle_side',kit:3,comp:'Freio › Lona de freio',parts:'lona, rebite e mola'},
  'Regulagem de catraca':{cat:'Freios',lv:'axle_side',kit:0,comp:'Freio › Catraca'},
  'Troca de pneu':{cat:'Pneus',lv:'wheel',kit:1,comp:'Rodado › Pneu',parts:'válvula'},
  'Troca de bucha da suspensão':{cat:'Suspensão',lv:'axle',kit:4,comp:'Suspensão › Bucha',parts:'buchas e parafusos'},
  'Reparo de para-lama':{cat:'Estrutura',lv:'side',kit:0,comp:'Carroceria › Para-lama'},
  'Lubrificação geral':{cat:'Lubrificação',lv:'none',kit:2,comp:'',parts:'graxa e óleo'},
  'Troca de cuíca':{cat:'Freios',lv:'axle_side',kit:1,comp:'Freio › Cuíca',parts:'cuíca'},
};
const kitText=n=>n===0?'':n===1?'1 peça do kit':`${n} peças do kit`;
const AX2D=[{no:1,fn:'livre',dual:true},{no:2,fn:'livre',dual:true}];
const SETV=()=>[
  {pos:'1º',plate:'RTF6K38',kind:'Carreta',axles:AX3,n:2},
  {pos:'2º',plate:'RTE1J77',kind:'Carreta',axles:AX3,n:1},
  {pos:'3º',plate:'SRK9H46',kind:'Carreta',axles:AX2D,n:1}];
const PRc='hsl(var(--primary))',PSc='hsl(var(--primary-soft))';
const vxs=a=>a.dual?[['L','o',36],['L','i',66],['R','i',194],['R','o',224]]:[['L','s',58],['R','s',202]];
function vplan(v,o={}){
  const W=260,CX=130,top=34,gap=80,yOf=i=>top+54+i*gap,last=yOf(v.axles.length-1),H=last+40;
  const sel=o.sel||new Set(),bd=o.badges||{};
  let g='';
  const whole=sel.has('whole');
  if(o.hl==='whole'||whole) g+=`<rect x="4" y="4" width="${W-8}" height="${H-8}" rx="16" fill="${whole?PSc:'transparent'}" stroke="${PRc}" stroke-width="1.5" ${whole?'':'stroke-dasharray="5 4"'}/>`;
  g+=`<rect x="${CX-14}" y="${top}" width="8" height="${last+22-top}" rx="4" fill="#d3d8de" stroke="#9aa0aa"/><rect x="${CX+6}" y="${top}" width="8" height="${last+22-top}" rx="4" fill="#d3d8de" stroke="#9aa0aa"/>`;
  g+=`<rect x="${CX-10}" y="${top-14}" width="20" height="14" rx="4" fill="#d3d8de" stroke="#9aa0aa"/><circle cx="${CX}" cy="${top-7}" r="3.5" fill="#9aa0aa"/>`;
  v.axles.forEach((a,i)=>{const y=yOf(i),ws=vxs(a),xs=ws.map(w=>w[2]),x0=Math.min(...xs)-12,x1=Math.max(...xs)+12;
    if(o.hl==='axle_side') ['L','R'].forEach(s=>{const sx=ws.filter(w=>w[0]===s).map(w=>w[2]);const on=ws.filter(w=>w[0]===s).every(w=>sel.has('a'+a.no+w[0]+w[1]));
      g+=`<rect x="${Math.min(...sx)-16}" y="${y-28}" width="${Math.max(...sx)-Math.min(...sx)+32}" height="56" rx="10" fill="${on?PSc:'transparent'}" stroke="${PRc}" stroke-width="1.4" ${on?'':'stroke-dasharray="4 3"'}/>`;});
    g+=`<rect x="${x0}" y="${y-4}" width="${x1-x0}" height="8" rx="4" fill="#d3d8de" stroke="#9aa0aa"/>`;
    g+=`<text x="${x0}" y="${y-33}" font-size="11" font-weight="700" font-family="Sora,Inter" fill="hsl(240 4% 44%)">Eixo ${a.no}</text>`;
    ws.forEach(([s,sl,x])=>{const k='a'+a.no+s+sl,on=sel.has(k),foc=o.focus&&o.focus.includes(k);
      if(foc) g+=`<rect x="${x-14}" y="${y-26}" width="28" height="52" rx="9" fill="none" stroke="hsl(var(--primary)/.3)" stroke-width="5"/>`;
      if(o.hl==='wheel'&&!on&&!foc) g+=`<rect x="${x-13}" y="${y-25}" width="26" height="50" rx="8" fill="none" stroke="${PRc}" stroke-width="1.2" stroke-dasharray="4 3"/>`;
      g+=`<rect x="${x-9}" y="${y-21}" width="18" height="42" rx="5" fill="${on||foc?PRc:'#23262c'}" opacity="${o.dim&&!on?.35:1}"/>`;
      const b=bd[k]; if(b) g+=`<circle cx="${x+9}" cy="${y-21}" r="8.5" fill="${b==='chk'?'hsl(var(--warning))':'hsl(var(--foreground))'}" stroke="hsl(var(--background))" stroke-width="2"/><text x="${x+9}" y="${y-17.5}" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">${b==='chk'?'!':b}</text>`;});
  });
  return `<svg viewBox="0 0 ${W} ${H}" style="display:block;width:100%;max-width:${o.big?340:300}px;margin:0 auto" role="img">${g}</svg>`;
}
function vcol(v,o={}){
  const hd=`<div class="vhd"><span class="pos">${v.pos}</span><b class="plate">${v.plate}</b><span class="muted" style="font-size:12px">${v.kind}</span>${v.n&&!o.nobadge?`<span class="chip t-none" style="margin-left:auto;height:20px;font-size:11px" title="${v.n} serviço${v.n>1?'s':''} já nesta OS">${v.n} nesta OS</span>`:''}</div>`;
  const body=v.axles.length?vplan(v,o):`<div class="noax dots"><span class="tile" style="width:44px;height:44px;border-radius:99px;background:hsl(var(--warning-soft));color:hsl(var(--warning-text))"><span class="ic i-warn s20"></span></span><b>Sem eixos cadastrados</b><span class="muted" style="font-size:12.5px;text-wrap:pretty">Serviços do veículo todo entram normalmente. Os de eixo ou roda entram sem posição.</span><button class="btn outline" style="height:32px">Cadastrar eixos</button></div>`;
  return `<div class="veh ${o.act?'act':''}">${hd}<div class="vbody">${body}${o.pop||''}</div></div>`;
}
const pill=(t,muted)=>`<span class="pill ${muted?'m':''}"><span class="ic i-user s14"></span>${t}</span>`;
const LN={
  cat:{plate:'RTF6K38',pos:'1º',where:'eixo 3, os dois lados',svc:'Regulagem de catraca',mech:'Carlos',parts:[['Graxa para came','0,1 kg',1]]},
  lona:{plate:'RTE1J77',pos:'2º',where:'eixo 2, esquerdo',svc:'Troca de lona de freio',mech:'',parts:[['Lona de freio','2',1],['Rebite 6 mm','16',1],['Mola de retorno','1',0]],chips:['rework','chk']},
  pneu:{plate:'RTE1J77',pos:'2º',where:'eixo 3, esquerdo externo',svc:'Troca de pneu',mech:'Ana',parts:[['Válvula','1',1]]},
  lub:{plate:'RTF6K38 e SRK9H46',pos:'1º e 3º',where:'veículo todo',svc:'Lubrificação geral',mech:'',parts:[['Graxa','2 × 0,5 kg',1],['Óleo de cubo','2 × 1 L',1]],count:2},
  cuica:{plate:'SRK9H46',pos:'3º',where:'sem posição',svc:'Troca de cuíca',mech:'',parts:[['Cuíca','1',1]],noax:true},
};
function lineCard(l,i,o={}){
  const chips=(l.chips||[]).map(c=>c==='rework'?'<span class="chip t-wait" style="height:20px;font-size:11px">Retrabalho</span>':'<span class="chip t-none" style="height:20px;font-size:11px">Do checklist CK-0041</span>').join('');
  const miss=l.parts.filter(p=>!p[2]);
  const right=o.status==='pending'?'<span class="chip t-wait" style="height:20px;font-size:11px">Pendente</span>':o.status==='sending'?'<span class="chip t-work" style="height:20px;font-size:11px">Enviando…</span>':'<button class="ib" title="Tirar da lista" aria-label="Tirar da lista"><span class="ic i-x s14"></span></button>';
  return `<div class="line ${o.err?'err':''} ${o.new?'new':''}">
    <div class="lhd"><span class="n">${i}</span><div class="lwhere" title="${l.plate} · ${l.where}"><span class="muted">${l.pos}</span> <b>${l.plate}</b> · <span class="${l.noax?'muted':''}">${l.where}</span></div>${right}</div>
    <div class="lsvc"><b>${l.svc}</b>${l.count?`<span class="chip t-none" style="height:20px;font-size:11px">${l.count} serviços</span>`:''}${chips}</div>
    <div class="lmeta">${o.nomech?'':(l.mech?pill(l.mech):pill('Sem mecânico',1))}${o.start?'<span class="tog on"><i></i>Começar agora</span>':''}</div>
    <div class="parts">${l.parts.map(p=>`<span class="part ${p[2]?'':'out'}" title="${p[0]} · ${p[1]} · ${p[2]?'em estoque':'em falta'}"><span class="ic ${p[2]?'i-check':'i-warn'} s14"></span>${p[0]} <span class="q">${p[1]}</span></span>`).join('')}</div>
    ${miss.length?`<div class="lnote warn"><span class="ic i-clock s14"></span>${miss[0][0]} em falta: o serviço vai esperar peça</div>`:''}
    ${o.err?`<div class="lnote danger"><span class="ic i-warn s14"></span>${o.err}</div>`:''}
  </div>`;
}
const KBD=k=>`<kbd>${k}</kbd>`;
function popTap(){return `<div class="pop" style="left:64px;top:214px">
  <div class="pophd"><b>RTE1J77</b><span class="muted">eixo 3, esquerdo externo</span><span class="ib" style="margin-left:auto"><span class="ic i-x s14"></span></span></div>
  <div class="last"><span class="ic i-clock s14"></span>Último aqui: troca de pneu há 4 meses, 31.000 km</div>
  <div class="shorts"><span class="on">Só esta roda</span><span>As duas do lado</span><span>O eixo todo</span><span>Todas as rodas</span></div>
  <div class="og" style="padding-left:2px">Para esta roda</div>
  ${[['Troca de pneu','Roda','1 peça do kit'],['Troca de lona de freio','Eixo e lado','3 peças do kit'],['Revisão do cubo','Eixo e lado','2 peças do kit'],['Regulagem de catraca','Eixo e lado','']].map((r,i)=>`<div class="sug ${i===0?'hl':''}"><div style="flex:1;min-width:0"><b>${r[0]}</b><div class="muted" style="font-size:12px">${r[1]}${r[2]?' · '+r[2]:''}</div></div><span class="ic i-plus s14 muted"></span></div>`).join('')}
  <div class="input" style="height:36px;margin-top:6px"><span class="ic i-search s14 muted"></span><input type="search" autocomplete="off" placeholder="Outro serviço"></div></div>`;}
function popRework(){return `<div class="pop" style="left:96px;top:120px">
  <div class="pophd"><b>RTE1J77</b><span class="muted">eixo 2, esquerdo</span></div>
  <div style="font-weight:600;margin-top:2px">Troca de lona de freio</div>
  <div class="rw"><span class="ic i-warn s16"></span><div><b>Lona trocada aqui há 18 dias, 4.200 km</b><div style="font-size:12.5px">OS 1029 · Carlos · vai como retrabalho?</div></div></div>
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px"><button class="btn outline" style="height:34px;flex:1">Seguir sem marcar</button><button class="btn primary" style="height:34px;flex:1">Marcar retrabalho</button></div></div>`;}
function popChk(){return `<div class="pop" style="left:64px;top:136px">
  <div class="pophd"><span class="chip t-wait" style="height:20px;font-size:11px">Sem decisão</span><span class="muted">CK-0041 · ontem 18:10</span></div>
  <div style="font-weight:600;margin-top:4px">Lona de freio fora do limite</div>
  <div class="muted" style="font-size:12.5px">RTE1J77 · eixo 2, esquerdo · “lona no rebite, lado do motorista”</div>
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px"><button class="btn outline" style="height:34px">Ver no checklist</button><button class="btn primary" style="height:34px;flex:1"><span class="ic i-plus s14"></span>Adicionar troca de lona</button></div></div>`;}
R.montar=s=>{
  const V=SETV(); let o=[{},{},{}],lines=[],search='',bar='',listTop='',kb=false,foot='',ready=true,count='';
  const B={0:{a2Lo:'1',a2Ro:'1',a3Lo:'1'},1:{a2Lo:'chk',a3Lo:'chk'},2:{a1Ro:'1'}};
  const withB=()=>o.forEach((x,i)=>x.badges=B[i]);
  if(s!=='empty'&&s!=='loading') withB();
  if(s==='empty'){V.forEach(v=>v.n=0);}
  if(s==='tap'){o[1].focus=['a3Lo'];o[1].pop=popTap();o[1].act=true;lines=[['cat',{}]];}
  if(s==='rework'){o[1].sel=new Set(['a2Lo','a2Li']);o[1].pop=popRework();o[1].act=true;lines=[['cat',{}]];}
  if(s==='checklist'){o[1].focus=['a2Lo'];o[1].pop=popChk();o[1].act=true;listTop=`<div class="notice warn" style="align-items:center"><span class="ic i-warn s16"></span><span style="flex:1"><b>2 falhas do checklist sem decisão</b> no RTE1J77</span><button class="btn outline" style="height:30px;font-size:12.5px">Adicionar as 2</button></div>`;}
  if(s==='servicefirst'){search='Troca de lona de freio';o.forEach(x=>x.hl='axle_side');o[1].sel=new Set(['a2Lo','a2Li']);bar=`<div class="hintbar"><span class="ic i-hand s16"></span><span style="flex:1;min-width:200px"><b>Troca de lona de freio</b> · toque no lado de cada eixo</span><span class="shorts" style="margin:0"><span>Os dois lados</span><span>O eixo todo</span></span></div>`;lines=[['cat',{}],['lona',{new:1}]];}
  if(s==='general'){search='Lubrificação geral';o.forEach(x=>{x.hl='whole';x.dim=true;});o[0].sel=new Set(['whole']);o[2].sel=new Set(['whole']);bar=`<div class="hintbar"><span class="ic i-hand s16"></span><span style="flex:1;min-width:200px"><b>Lubrificação geral</b> vale para o veículo todo · toque nos veículos</span><button class="btn outline" style="height:30px;font-size:12.5px">Aplicar nos 3 veículos</button></div>`;lines=[['cat',{}],['lub',{new:1}]];}
  if(['list','nomech','offline','error'].includes(s)) lines=[['cat',{}],['lona',{}],['pneu',{}],['lub',{}]];
  if(s==='list'){o[1].sel=new Set(['a2Lo','a2Li','a3Lo']);o[0].sel=new Set(['a3Lo','a3Li','a3Ri','a3Ro']);}
  if(s==='nomech') listTop=`<div class="notice info"><span class="ic i-lock s16"></span><span>Seu papel não permite escolher o mecânico. O encarregado escolhe depois</span></div>`;
  if(s==='offline'){listTop=`<div class="notice warn"><span class="ic i-wifi s16"></span><span>Sem sinal. A lista fica salva neste aparelho e vai quando a conexão voltar</span></div>`;lines=lines.map((l,i)=>[l[0],{status:i===0?'sending':'pending'}]);}
  if(s==='error'){listTop=`<div class="notice danger"><span class="ic i-warn s16"></span><span>Nenhum serviço foi criado. Ajuste a linha 2 e crie de novo</span></div>`;lines[1]=['lona',{err:'RTE1J77 já tem troca de lona no eixo 2, esquerdo, nesta OS. Tire a linha ou troque o lugar'}];}
  if(s==='keyboard'){kb=true;o[1].focus=['a2Lo','a2Li'];lines=[['cat',{}]];}
  if(s==='noaxles'){V[2].axles=[];V[2].n=0;lines=[['cat',{}],['cuica',{}]];}
  if(s==='nomech') lines=lines.map(l=>[l[0],{nomech:1}]);
  // totals
  const svcN=lines.reduce((n,[k])=>n+(LN[k].count||1),0);
  const vehs=new Set(lines.flatMap(([k])=>LN[k].plate.split(' e ')));
  const partsN=lines.reduce((n,[k])=>n+LN[k].parts.length*(LN[k].count||1),0), miss=lines.reduce((n,[k])=>n+LN[k].parts.filter(p=>!p[2]).length,0);
  if(!lines.length){ready=false;foot=`<span class="why0"><span class="ic i-info s14"></span>Toque num lugar da planta ou busque um serviço</span>`;}
  else foot=`<b>${svcN} serviço${svcN>1?'s':''} em ${vehs.size} veículo${vehs.size>1?'s':''}</b> · ${partsN} ${partsN>1?'peças':'peça'} do kit${miss?`, <span style="color:hsl(var(--danger-text));font-weight:600">${miss} em falta</span>`:''}`;
  const btn=s==='offline'?`<button class="btn primary" disabled>${svcN} pendentes</button>`:`<button class="btn primary" ${ready&&!kb?'':'disabled'}>${lines.length?`Criar ${svcN} serviço${svcN>1?'s':''}`:'Criar serviços'}</button>`;
  const planArea=s==='loading'?V.map(()=>`<div class="veh"><div class="vhd"><span class="sk" style="width:120px;height:18px"></span></div><div class="vbody" style="display:flex;flex-direction:column;gap:34px;align-items:center;padding:30px 10px"><span class="sk" style="width:20px;height:14px"></span><span class="sk" style="width:200px;height:42px"></span><span class="sk" style="width:200px;height:42px"></span></div></div>`).join(''):V.map((v,i)=>vcol(v,o[i])).join('');
  const legend=`<div class="legend"><span><i class="bdot"></i>Serviço nesta OS</span><span><i class="bdot w">!</i>Falha do checklist sem decisão</span></div>`;
  const editor=kb?`<div class="line editing"><div class="egrid"><div class="field"><label>Veículo</label><div class="input sm"><input value="2º RTE1J77"></div></div><div class="field"><label>Onde</label><div class="input sm"><input value="eixo 2, os dois lados"></div></div><div class="field" style="grid-column:1/-1;position:relative"><label>Serviço</label><div class="input sm" style="border-color:hsl(var(--foreground)/.55)"><span class="ic i-search s14 muted"></span><input type="search" autocomplete="off" value="lona"></div>
      <div class="optlist" style="margin-top:4px"><div class="opt" style="background:hsl(var(--muted))"><div style="flex:1"><b style="font-weight:600">Troca de lona de freio</b><div class="muted" style="font-size:12px">Freios · 3 peças do kit</div></div>${KBD('Enter')}</div><div class="opt"><div style="flex:1"><b style="font-weight:600">Regulagem de lona</b><div class="muted" style="font-size:12px">Freios</div></div></div></div></div></div>
      <div class="kbds">${KBD('Enter')} adiciona a linha ${KBD('Tab')} próximo campo ${KBD('↑')}${KBD('↓')} escolhe ${KBD('Esc')} cancela</div></div>`:'';
  const listEmpty=!lines.length&&!kb?`<div class="lempty dots"><span class="tile" style="width:52px;height:52px;border-radius:99px;background:hsl(var(--primary-soft));color:hsl(var(--primary));box-shadow:0 0 0 8px hsl(var(--primary-soft)/.45)"><span class="ic i-hand s24"></span></span><b style="font:700 15px Sora">Monte a lista do conjunto</b><span class="muted" style="font-size:13px;text-wrap:pretty">Toque onde está o problema, em qualquer veículo, ou busque o serviço. Tudo entra de uma vez.</span></div>`:'';
  const listLoading=s==='loading'?[1,2].map(()=>`<span class="sk" style="height:110px;border-radius:14px"></span>`).join(''):'';
  return `<div class="ws">
    <div class="dh" style="padding-bottom:8px"><div class="t"><div class="eyebrow">OS 1042 · Conjunto C-320</div><h3>Adicionar serviços</h3></div>${X}</div>
    <div class="wstool"><div class="input" style="flex:1 1 260px;height:40px"><span class="ic i-search s16 muted"></span><input type="search" autocomplete="off" placeholder="Buscar serviço (ex.: lubrificação)" value="${search}">${search?'<span class="ib"><span class="ic i-x s14"></span></span>':`<span class="kbdh">${KBD('/')}</span>`}</div></div>
    ${bar}
    <div class="wsgrid">
      <div class="setplan">${planArea}${s==='loading'?'':legend}</div>
      <div class="lpanel"><div class="lphd"><span class="eyebrow">Lista${lines.length?` · ${lines.length}`:''}</span>${lines.length?'<button class="btn" style="height:26px;padding:0 6px;font-size:12px;margin-left:auto;color:hsl(var(--muted-foreground))">Limpar</button>':''}</div>${listTop}${editor}${listEmpty}${listLoading}${lines.map(([k,lo],i)=>lineCard(LN[k],i+1,lo)).join('')}</div>
    </div>
    <div class="df" style="flex-wrap:wrap"><span class="grow" style="min-width:240px;color:hsl(var(--foreground));text-wrap:pretty">${foot}</span><div style="display:flex;gap:10px;margin-left:auto"><button class="btn outline">Cancelar</button>${btn}</div></div>
  </div>`;
};
const tt=(tone,ic,sz='')=>`<span class="tt ${tone} ${sz}"><span class="ic ${ic} ${sz==='lg'?'s20':'s16'}"></span></span>`;
const av=(ini,on)=>`<span class="av ${on?'on':''}">${ini}</span>`;
function ring(d,t,sz=40,label){const r=(sz-6)/2,c=2*Math.PI*r,f=t?d/t:0,col=d===t&&t?'hsl(var(--success))':'hsl(var(--primary))';
  return `<span class="ring" style="width:${sz}px;height:${sz}px"><svg width="${sz}" height="${sz}" viewBox="0 0 ${sz} ${sz}"><circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="hsl(var(--muted))" stroke-width="4"/>${f>0?`<circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="${col}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${c*f} ${c}" transform="rotate(-90 ${sz/2} ${sz/2})"/>`:''}</svg><b>${label??`${d}/${t}`}</b></span>`;}
const cbar=fs=>`<span class="cbar">${fs.map(f=>`<i class="${f}"></i>`).join('')}</span>`;
const VST={work:['t-work','Em manutenção','primary'],part:['t-wait','Esperando peça','warning'],wait:['t-none','Na fila','muted'],done:['t-ok','Pronto','success'],out:['t-pause','Saiu','muted'],pause:['t-pause','Pausado','muted']};
const SST={work:['primary','Em andamento'],wait:['muted','Na fila'],part:['warning','Esperando peça'],done:['success','Feito'],pause:['muted','Pausado']};
const KIND={brake:'i-disc',lube:'i-drop',elec:'i-bolt',tire:'i-tire',struct:'i-wrench'};
const OSV=[
  {pos:'1º',plate:'RTF6K38',kind:'Carreta',st:'work',done:1,total:3,now:['CS','Carlos','Troca de lona de freio','0:42'],stop:'2 d 8 h',cost:'1.240,00'},
  {pos:'2º',plate:'RTE1J77',kind:'Carreta',st:'part',done:0,total:2,block:['Esperando mola de retorno','pedido há 3 h'],stop:'2 d 8 h',cost:'180,00',chk:1},
  {pos:'3º',plate:'SRK9H46',kind:'Carreta',st:'done',done:1,total:1,ready:'Pronto há 2 h',stop:'1 d 9 h',cost:'310,00'}];
const SVC2={
  RTF6K38:[
    {n:'Troca de lona de freio',k:'brake',loc:'eixo 2, os dois lados',st:'work',who:['CS','Carlos'],time:'0:42',parts:['ok','Peças separadas']},
    {n:'Regulagem de catraca',k:'brake',loc:'eixos 1, 2 e 3, os dois lados',st:'wait',who:null,parts:['ok','Sem peças do kit']},
    {n:'Lubrificação geral',k:'lube',loc:'',st:'done',who:['AL','Ana'],time:'0:35',parts:['ok','2 peças usadas']}],
  RTE1J77:[
    {n:'Troca de lona de freio',k:'brake',loc:'eixo 2, esquerdo',st:'part',who:['AL','Ana'],parts:['wait','Esperando mola de retorno'],chips:['chk','rework']},
    {n:'Troca de cuíca',k:'brake',loc:'eixo 1, direito',st:'wait',who:null,parts:['ok','Peças separadas']}],
  SRK9H46:[
    {n:'Revisão elétrica',k:'elec',loc:'lado direito',st:'done',who:['BR','Bruno'],time:'1:05',parts:['ok','1 peça usada']}]};
function srow(x,o={}){
  const [tone,word]=SST[x.st];
  const chips=(x.chips||[]).map(c=>c==='chk'?'<span class="chip t-none sm">Do checklist CK-0041</span>':'<span class="chip t-wait sm">Retrabalho</span>').join('');
  const who=x.who?`<span class="mi2">${av(x.who[0],x.st==='work')}${x.who[1]}</span>`:`<span class="mi2 muted"><span class="av dash"><span class="ic i-person s14"></span></span>Sem mecânico</span>`;
  const time=x.time?`<span class="mi2 num ${x.st==='work'?'run':''}">${x.st==='work'?'<span class="ic i-timer s14"></span>':''}${x.time}${x.st==='done'?' de trabalho':''}</span>`:'';
  const parts=`<span class="mi2 ${x.parts[0]==='wait'?'warn':''}"><span class="ic ${x.parts[0]==='wait'?'i-clock':'i-box'} s14"></span>${x.parts[1]}</span>`;
  let act='';
  if(!o.noact){
    if(x.st==='work') act=`<button class="ib2" title="Pausar" aria-label="Pausar"><span class="ic i-pause s16"></span></button><button class="btn outline sm"><span class="ic i-check s14"></span>Concluir</button>`;
    else if(x.st==='wait'&&!x.who) act=`<button class="btn outline sm"><span class="ic i-person s14"></span>Escolher mecânico</button>`;
    else if(x.st==='wait') act=`<button class="btn soft sm"><span class="ic i-play s14"></span>Começar</button>`;
    else if(x.st==='part') act=`<button class="btn outline sm">Ver pedido</button>`;
  }
  return `<div class="srow2 ${x.st==='done'?'done':''}">${tt(tone,KIND[x.k])}
    <div class="sm2"><div class="l1"><b class="sn" title="${x.n}">${x.n}</b>${x.loc?`<span class="loc" title="${x.loc}">${x.loc}</span>`:''}${chips}</div>
    <div class="l2"><span class="mi2 st ${tone}">${word}</span>${who}${time}${parts}</div></div>
    <div class="sa">${act}</div>${o.nomenu?'':'<button class="ib2 ghost" title="Mais ações" aria-label="Mais ações"><span class="ic i-dots s16"></span></button>'}</div>`;
}
function ghd(v,o={}){const [c,l]=VST[v.st];
  return `<div class="ghd"><span class="pos">${v.pos}</span><b class="plate">${v.plate}</b><span class="muted" style="font-size:12.5px">${v.kind}</span><span class="chip ${c} sm">${l}</span><span class="gprog"><span class="bar"><i style="width:${v.total?v.done/v.total*100:0}%;${v.done===v.total?'background:hsl(var(--success))':''}"></i></span><span class="num">${v.done} de ${v.total} ${v.total>1?'feitos':'feito'}</span></span>${o.menu?'':'<button class="ib2 ghost" title="Ações do veículo" aria-label="Ações do veículo"><span class="ic i-dots s16"></span></button>'}${o.menuOpen||''}</div>`;}
function svcGroups(o={}){return OSV.filter(v=>!o.only||v.plate===o.only).map(v=>`<div class="grp">${ghd(v,{menuOpen:o.menuFor===v.plate?vmenu():''})}${SVC2[v.plate].map(x=>srow(x,o)).join('')}</div>`).join('');}
const vmenu=()=>`<div class="popover" style="right:10px;top:40px;width:240px;padding:6px"><div class="mi"><span class="ic i-pause s16"></span>Pausar o veículo</div><div class="mi"><span class="ic i-check s16"></span>Marcar pronto</div><div class="mi"><span class="ic i-exit s16"></span>Sai antes</div><div class="mi"><span class="ic i-swap s16"></span>Transferir para outra OS</div></div>`;

/* ===== 1 lista ===== */
const LROWS=[
  {set:'Conjunto C-320',tile:['primary','i-link'],train:['work','wait','done'],sub:'Rodotrem · RTF6K38 · RTE1J77 · SRK9H46',os:'OS 1042',p:'Freio puxando, vazamento de ar',d:1,t:3,sum:'1 de 3 prontos',tip:'RTE1J77 esperando peça · RTF6K38 em manutenção · SRK9H46 pronto',who:[['CS']],whoT:'Carlos',block:['warning','i-box','Esperando mola de retorno'],stop:'2 d 8 h',hot:1,where:'Box 3',f:['part','stale']},
  {set:'Conjunto C-118',tile:['primary','i-link'],train:['wait','wait'],sub:'Bitrem · RTC3G56 · SRK9H45',os:'OS 1043',p:'Ruído metálico ao frear',d:0,t:2,sum:'2 na fila',tip:'RTC3G56 e SRK9H45 na fila',who:[],whoT:'Ninguém ainda',block:['warning','i-person','2 serviços sem mecânico'],stop:'5 h',where:'Sem box',f:['nomech']},
  {set:'DLY1J07',tile:['muted','i-truck'],train:null,sub:'Caminhão · frota 812',os:'OS 1040',p:'Vazamento no circuito do freio',d:2,t:4,sum:'2 de 4 feitos',tip:'2 serviços em andamento',who:[['AL'],['BR']],whoT:'Ana e Bruno',block:null,stop:'3 d 2 h',hot:1,where:'Box 7',f:['stale']},
  {set:'Conjunto C-900',tile:['primary','i-link'],train:['done','out','work','work','wait','wait'],sub:'Hexatrem · 6 carretas, 1 saiu',os:'OS 1038',p:'Preventiva de 50 mil km',d:1,t:5,sum:'1 de 5 prontos',tip:'RTA1A11 pronto · RTA2A22 saiu · RTA3A33 e RTA4A44 em manutenção · RTA5A55 e RTA6A66 na fila',who:[['DM'],['RF']],whoT:'Diego e Rafa',block:['warning','i-warn','1 falha do checklist sem decisão'],stop:'4 d 1 h',hot:1,where:'Box 1',f:['chk','stale']}];
R.lista2=s=>{
  const hdr=`<div class="phead"><div style="flex:1;min-width:240px"><h1>Ordens de serviço</h1><p class="muted">O que está na oficina, quem está em cada uma e o que está travando</p></div><button class="btn primary lg"><span class="ic i-plus s16"></span>Abrir OS</button></div>`;
  const tabs=`<div class="ltabs"><a aria-current="page">Abertas <span class="n">4</span></a><a>Concluídas</a></div>`;
  const chipsF=[['all','Todas',''],['part','Esperando peça','1'],['nomech','Sem mecânico','1'],['chk','Falha sem decisão','1'],['stale','Parada há mais de 1 dia','3']];
  const act=s==='filter'?'part':'all';
  const tb=`<div class="ltool"><div class="input" style="flex:0 1 320px;height:38px"><span class="ic i-search s16 muted"></span><input type="search" autocomplete="off" placeholder="Placa, frota, conjunto ou OS" value="${s==='nofound'?'XYZ9':''}"></div><div class="fchips">${chipsF.map(([k,l,n])=>`<span class="fchip ${k==='all'?'gen':''} ${k===act?'on':''}">${l}${n?` <b class="num">${n}</b>`:''}</span>`).join('')}${s==='filter'?'<span class="fchip clear">Limpar filtros</span>':''}</div></div>`;
  const head=`<div class="lrow3 lh"><span>Veículo</span><span>OS e problema</span><span>Andamento</span><span>Agora</span><span style="text-align:right">Parada há</span></div>`;
  let body;
  if(s==='loading') body=head+[1,2,3,4].map(()=>`<div class="lrow3"><span style="display:flex;gap:10px"><span class="sk" style="width:36px;height:36px"></span><span class="sk" style="flex:1;height:36px"></span></span><span class="sk" style="height:32px"></span><span class="sk" style="height:24px"></span><span class="sk" style="height:28px"></span><span class="sk" style="height:28px"></span></div>`).join('');
  else if(s==='empty') body=`<div class="dots" style="padding:70px 20px;text-align:center"><div class="tile" style="margin:0 auto;width:56px;height:56px;border-radius:99px;background:hsl(var(--primary-soft));color:hsl(var(--primary));box-shadow:0 0 0 10px hsl(var(--primary-soft)/.45)"><span class="ic i-wrench s24"></span></div><p style="font:700 17px Sora;margin-top:18px">Nenhuma OS aberta</p><p class="muted">Quando um conjunto ou veículo entrar na oficina, abra a OS para acompanhar o trabalho</p><button class="btn primary" style="margin-top:12px"><span class="ic i-plus s14"></span>Abrir OS</button></div>`;
  else if(s==='nofound') body=`<div class="dots" style="padding:56px 20px;text-align:center"><p style="font:700 15px Sora">Nenhuma OS encontrada para “XYZ9”</p><p class="muted">Confira a placa, a frota, o conjunto ou o número da OS</p><button class="btn outline" style="margin-top:10px">Limpar busca</button></div>`;
  else if(s==='error') body=`<div style="padding:24px"><div class="notice danger"><span class="ic i-warn s16"></span><span>Não conseguimos carregar as OS agora. Tente de novo em alguns segundos</span></div><button class="btn outline" style="margin-top:10px">Tentar de novo</button></div>`;
  else body=head+LROWS.filter(r=>s!=='filter'||r.f.includes('part')).map(r=>`<div class="lrow3">
    <div class="c1">${tt(r.tile[0],r.tile[1])}<div style="min-width:0"><div style="display:flex;gap:4px 8px;align-items:center;flex-wrap:wrap"><b class="plate" style="white-space:nowrap">${r.set}</b>${r.train?cbar(r.train):''}</div><div class="muted trunc" style="font-size:12px" title="${r.sub}">${r.sub}</div></div></div>
    <div style="min-width:0"><div class="num muted" style="font-size:11.5px;font-weight:700">${r.os}</div><div class="trunc" title="${r.p}">${r.p}</div></div>
    <div class="c3" ${r.tip?`title="${r.tip}"`:''}>${ring(r.d,r.t,32,'')}<span style="min-width:0"><b class="num" style="font-size:13px;white-space:nowrap">${r.sum}</b>${r.tip?`<span class="muted trunc" style="font-size:11.5px">${r.tip}</span>`:''}</span></div>
    <div style="min-width:0;display:flex;flex-direction:column;gap:4px"><span class="mi2">${r.who.length?`<span class="avs">${r.who.map(w=>av(w[0],1)).join('')}</span>`:'<span class="av dash"><span class="ic i-person s14"></span></span>'}<span class="${r.who.length?'':'muted'}">${r.whoT}</span></span>${r.block?`<span class="bchip ${r.block[0]}" title="${r.block[2]}"><span class="ic ${r.block[1]} s14"></span><span class="trunc">${r.block[2]}</span></span>`:'<span class="muted" style="font-size:12px">Sem bloqueio</span>'}</div>
    <div style="text-align:right"><div class="num" style="font-size:15px;font-weight:700;${r.hot?'color:hsl(var(--warning-text))':''}">${r.stop}</div><div class="muted" style="font-size:12px">${r.where}</div></div></div>`).join('');
  const pag=['ok','filter'].includes(s)?`<div class="muted" style="padding:12px 16px;font-size:12.5px;border-top:1px solid hsl(var(--border))">Mostrando ${s==='filter'?1:4} de ${s==='filter'?1:4}</div>`:'';
  return `${FX.pageHeader('Ordens de serviço','O que está na oficina, quem está em cada uma e o que está travando',FX.btn('Abrir OS',{icon:'plus'}))}${tabs}<div class="card" style="overflow:hidden">${tb}${body}${pag}</div>`;
};
/* ===== 2 abrir OS (uma tela) ===== */
R.abrir=s=>{
  const single=s==='single', pick=s==='pick';
  let what;
  if(pick) what=`<div class="field"><label>O que entra <span class="req">*</span></label><div class="input" style="border-color:hsl(var(--foreground)/.5)"><span class="ic i-search s16 muted"></span><input type="search" autocomplete="off" placeholder="Conjunto, placa ou frota"></div>
      <div class="optlist"><div class="og">Chegaram no pátio hoje</div>${[['Conjunto C-320','Rodotrem · 3 carretas · deixado pelo QRT4B22 às 08:42',['done','done','done']],['Conjunto C-118','Bitrem · 2 carretas · na portaria desde 07:10',['done','done']]].map((r,i)=>`<div class="opt ${i?'':'hl'}" style="align-items:center">${tt('primary','i-link')}<div style="flex:1;min-width:0"><b>${r[0]}</b> ${cbar(r[2].map(()=>''))}<div class="muted trunc" style="font-size:12px">${r[1]}</div></div></div>`).join('')}<div class="og">Veículo solto</div><div class="opt" style="align-items:center">${tt('muted','i-truck')}<div style="flex:1"><b>DLY1J07</b><div class="muted" style="font-size:12px">Caminhão · frota 812</div></div></div></div></div>`;
  else if(single) what=`<div class="field"><label>O que entra <span class="req">*</span></label><div class="setcard">${tt('muted','i-truck','lg')}<div style="flex:1;min-width:0"><div style="display:flex;gap:8px;align-items:center"><b class="plate" style="font-size:16px">DLY1J07</b><span class="chip t-none sm">Caminhão</span></div><div class="muted" style="font-size:12.5px">Frota 812 · última OS há 2 meses</div></div><button class="btn sm">Trocar</button></div></div>`;
  else{
    const units=[['1º','RTF6K38'],['2º','RTE1J77'],['3º','SRK9H46']];
    const vt=units.map(([n,p],i)=>{const locked=s==='lock'&&i===1, off=s==='disbanded'&&i===2;
      return `<div class="utile ${locked?'lock':''} ${off?'off':''}">${s==='disbanded'?`<span class="cb ${off?'':'on'}"></span>`:''}<span class="pos">${n}</span><b class="plate" style="font-size:13.5px">${p}</b><span class="${locked?'':'muted'}" style="font-size:11.5px;${locked?'color:hsl(var(--warning-text));font-weight:600':''}">${locked?'Na OS 1031':'Carreta'}</span></div>`;}).join('');
    what=`<div class="field"><label>O que entra <span class="req">*</span></label><div class="setcard" style="flex-direction:column;align-items:stretch">
      <div style="display:flex;gap:12px;align-items:center">${tt('primary','i-link','lg')}<div style="flex:1;min-width:0"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b class="plate" style="font-size:16px">Conjunto C-320</b><span class="chip t-none sm">Rodotrem</span></div><div class="muted" style="font-size:12.5px">${s==='disbanded'?'Desfeito em 06/11 · escolha quais entram':'Deixado pelo QRT4B22 hoje às 08:42'}</div></div><button class="btn sm">Trocar</button></div>
      <div class="utiles">${vt}</div>
      ${s==='lock'?'<div class="lnote warn"><span class="ic i-lock s14"></span>RTE1J77 está na OS 1031 e entra quando ela fechar. As outras 2 carretas entram agora</div>':''}</div>
      <button class="btn" style="align-self:flex-start;height:26px;padding:0;font-size:12.5px;color:hsl(var(--muted-foreground))">Abrir só para um veículo</button></div>`;
  }
  let km='';
  if(!pick){
    const who=single?'DLY1J07':s==='external'?'ABC1D23':'QRT4B22';
    const tag=s==='external'?'<span class="chip t-none sm">De terceiro · Transportes Lima</span>':single?'':'<span class="muted" style="font-size:12px;font-weight:500">cavalo que trouxe</span>';
    const val={typed:'152.300',lower:'15.230',external:'88.410'}[s]||(single?'98.112':'152.318');
    const chip=['typed','lower','external'].includes(s)?'':`<span class="chip t-ok sm"><span class="ic i-wifi s14"></span>Telemetria 08:42</span>`;
    km=`<div class="kmrow"><div class="field" style="flex:1 1 240px"><label>Km do ${who} <span class="req">*</span> ${tag}</label><div class="input ${s==='lower'?'err':''}"><span class="ic i-road s16 muted"></span><input inputmode="numeric" class="num" value="${val}"><span class="muted">km</span>${chip}</div>
      ${s==='lower'?'<span class="hint err">Menor que o último (151.980 km em 06/11). Confira o número</span>':s==='typed'?'<span class="hint">Último: 151.980 km em 06/11</span>':''}</div>
      ${s!=='external'&&!single?'<button class="btn sm" style="align-self:flex-end;margin-bottom:4px">Outro cavalo</button>':''}</div>`;
    if(s==='hub') km+=`<div class="field"><label>Hodômetro de cubo do RTE1J77 <span class="req">*</span></label><div class="input"><span class="ic i-gear s16 muted"></span><input inputmode="numeric" class="num" placeholder="Leitura do cubo"><span class="muted">km</span></div></div>`;
  }
  const prob=`<div class="field"><label>Problema relatado <span class="req">*</span></label><div class="input" style="height:72px;align-items:flex-start;padding-top:10px"><span style="font-size:14.5px">${pick?'':'Freio puxando para a direita e vazamento de ar'}</span></div></div>`;
  const box=`<div class="field"><label>Box</label><div class="input"><span class="ic i-wrench s16 muted"></span><span style="flex:1">Box 3</span><span class="chip t-ok sm">Livre</span></div></div>`;
  const ok=!['pick','lower','hub'].includes(s);
  const n=s==='lock'?2:s==='disbanded'?2:3;
  const foot=ok?`<b>${single?'DLY1J07':`Conjunto C-320 · ${n} carretas`}</b> · Box 3`:`<span class="why0"><span class="ic i-info s14"></span>${pick?'Escolha o conjunto ou o veículo':s==='lower'?'Confira o km':'Informe o hodômetro de cubo'}</span>`;
  return `<div class="dh"><div class="t"><div class="eyebrow">Ordens de serviço</div><h3>Abrir OS</h3></div>${X}</div><div class="db">${what}${km}<div class="cols" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))"><div style="grid-column:1/-1">${prob}</div></div>${pick?'':box}</div><div class="df" style="flex-wrap:wrap"><span class="grow" style="min-width:220px;color:hsl(var(--foreground))">${foot}</span><div style="display:flex;gap:10px;margin-left:auto"><button class="btn outline">Cancelar</button><button class="btn primary" ${ok?'':'disabled'}>Abrir OS</button></div></div>`;
};
/* ===== 3 detalhe ===== */
function vcard(v,o={}){const [c,l,tone]=VST[v.st];
  let now;
  if(v.now) now=`<div class="vnow">${av(v.now[0],1)}<span style="flex:1;min-width:0" class="trunc" title="${v.now[1]} · ${v.now[2]}"><b>${v.now[1]}</b> · ${v.now[2].toLowerCase()}</span><span class="num run">${v.now[3]}</span></div>`;
  else if(v.block) now=`<div class="vnow warn"><span class="ic i-box s16"></span><span style="flex:1;min-width:0" class="trunc" title="${v.block[0]} · ${v.block[1]}"><b>${v.block[0]}</b></span><span style="font-size:11.5px">${v.block[1]}</span></div>`;
  else now=`<div class="vnow ok"><span class="ic i-check s16"></span><b>${v.ready}</b></div>`;
  return `<div class="vcard ${o.on?'on':''} ${v.st==='out'?'dim':''}"><div class="vch">${ring(v.done,v.total,42)}<div style="flex:1;min-width:0"><div style="display:flex;gap:6px;align-items:baseline"><span class="pos">${v.pos}</span><b class="plate">${v.plate}</b></div><span class="chip ${c} sm">${l}</span></div><button class="ib2 ghost" title="Ações do veículo" aria-label="Ações do veículo"><span class="ic i-dots s16"></span></button></div>
    ${o.note?`<div class="lnote warn" style="font-size:12px"><span class="ic i-swap s14"></span>${o.note}</div>`:''}${now}
    <div class="vfoot"><span><span class="muted">Parado</span> <b class="num">${v.stop}</b></span>${o.nocost?'':`<span class="num">R$ ${v.cost}</span>`}</div></div>`;}
R.detalhe2=s=>{
  if(s==='loading') return `<div class="dpad"><span class="sk" style="height:120px;border-radius:16px"></span><div class="dgrid" style="margin-top:14px"><div style="display:flex;flex-direction:column;gap:10px">${[1,2,3,4].map(()=>'<span class="sk" style="height:96px;border-radius:14px"></span>').join('')}</div><div style="display:flex;flex-direction:column;gap:10px">${[1,2,3,4,5].map(()=>'<span class="sk" style="height:58px;border-radius:12px"></span>').join('')}</div></div></div>`;
  const nocost=s==='noperm';
  const kpi=(l,v,h)=>`<div class="kpi"><div class="eyebrow">${l}</div><div class="v num">${v}</div>${h?`<div class="muted" style="font-size:12px">${h}</div>`:''}</div>`;
  const hero=`<div class="card hero"><div class="hl">${tt('primary','i-link','xl')}<div style="min-width:0;flex:1"><div style="display:flex;gap:6px;flex-wrap:wrap"><span class="chip t-work">Em manutenção</span><span class="chip t-none">Corretiva</span><span class="chip t-none">Box 3</span></div>
      <h2>Conjunto C-320 ${cbar(['work','wait','done'])}</h2><p>Freio puxando para a direita e vazamento de ar</p><p class="muted" style="font-size:12.5px">${s==='disbanded'?'Conjunto desfeito hoje às 11:00 · ':''}Entrou em 07/11 às 08:42 · QRT4B22 deixou com 152.318 km</p></div></div>
    <div class="hr">${kpi('Prontos','1 de 3','')}${kpi('Na oficina','2 d 8 h','desde 07/11')}${nocost?'':kpi('Custo','R$ 1.730','até agora')}</div>
    <div class="hact"><button class="btn primary"><span class="ic i-plus s16"></span>Adicionar serviços</button><button class="btn outline"><span class="ic i-truck s16"></span>Adicionar veículo</button><button class="btn outline" title="Falta 2 veículos ficarem prontos" disabled><span class="ic i-flag s16"></span>Concluir OS</button><button class="ib2" title="Mais ações da OS" aria-label="Mais ações da OS"><span class="ic i-dots s16"></span></button></div></div>`;
  const att=[['danger','i-clock','RTE1J77 parado sem ninguém','há 2 d 8 h','Escolher mecânico'],['warning','i-box','Esperando mola de retorno','RTE1J77 · pedido há 3 h','Ver pedido'],['warning','i-person','2 serviços sem mecânico','Regulagem de catraca, troca de cuíca','Escolher'],['warning','i-warn','1 falha do checklist sem decisão','CK-0041 · RTE1J77, eixo 2','Decidir']];
  if(s==='left') att.unshift(['warning','i-swap','SRK9H46 saiu do conjunto','hoje 10:20 · agora no C-118','Decidir']);
  const attn=`<div class="attn"><div class="ahd"><span class="ic i-warn s16"></span><b>Precisa de atenção</b><span class="num chip t-wait sm">${att.length}</span></div><div class="alist">${att.map(a=>`<div class="aitem">${tt(a[0],a[1])}<div style="flex:1;min-width:0"><b class="trunc" title="${a[2]}">${a[2]}</b><div class="muted trunc" style="font-size:12px" title="${a[3]}">${a[3]}</div></div><button class="btn outline sm">${a[4]}</button></div>`).join('')}</div></div>`;
  const only=s==='filtered'?'RTF6K38':null;
  const vs=OSV.map(v=>vcard(v,{on:only===v.plate,nocost,note:s==='left'&&v.plate==='SRK9H46'?'Saiu do conjunto às 10:20':''})).join('');
  const all=`<div class="vcard all ${only?'':'on'}"><div class="vch">${ring(2,6,42)}<div style="flex:1"><b style="font-family:Sora">Todos</b><div class="muted" style="font-size:12px">6 serviços · 2 feitos</div></div></div></div>`;
  const filt=only?`<div class="fbar"><span class="fchip on">1º RTF6K38 <span class="ic i-x s14"></span></span><button class="btn sm" style="color:hsl(var(--primary))">Ver todos</button></div>`:'';
  const list=`<div class="card" style="overflow:hidden"><div class="lhd2"><b style="font-family:Sora">Serviços</b><span class="muted num" style="font-size:12.5px">${only?'3 de 6':'6'}</span>${filt}</div>${svcGroups({only,menuFor:s==='menu'?'RTE1J77':null})}</div>`;
  return `<div class="dpad">${hero}${attn}<div class="dgrid"><div class="vcol">${all}${vs}</div>${list}</div></div>`;
};
/* ===== 4a linha do serviço (grupo por veículo) ===== */
R.linha2=s=>{
  if(s==='loading') return `<div class="card" style="overflow:hidden">${[1,2,3,4].map(()=>`<div class="srow2"><span class="sk" style="width:36px;height:36px"></span><div style="flex:1;display:flex;flex-direction:column;gap:6px"><span class="sk" style="width:260px;height:14px"></span><span class="sk" style="width:340px;height:14px"></span></div><span class="sk" style="width:110px;height:32px"></span></div>`).join('')}</div>`;
  let extra='';
  if(s==='tip') extra=`<div class="tipbox" style="left:68px;top:150px">eixos 1, 2 e 3, os dois lados</div>`;
  if(s==='plan') extra=`<div class="popover" style="left:200px;top:96px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><b>RTF6K38</b><span class="muted" style="font-size:12px">eixo 2, os dois lados</span><span class="x" style="margin-left:auto;width:26px;height:26px"><span class="ic i-x s14"></span></span></div><div class="planbox">${planSVG(VEH.RTF6K38,'axle_side',new Set(['a2L','a2R']),{readonly:true,w:220})}</div></div>`;
  if(s==='menu') extra=`<div class="popover" style="right:14px;top:150px;width:220px;padding:6px"><div class="mi"><span class="ic i-pin s16"></span>Trocar posição</div><div class="mi"><span class="ic i-person s16"></span>Mecânicos</div><div class="mi"><span class="ic i-box s16"></span>Peças</div><div class="mi" style="color:hsl(var(--danger-text))"><span class="ic i-x s16"></span>Cancelar serviço</div></div>`;
  const note=s==='noperm'?`<div class="notice info" style="margin:10px 14px"><span class="ic i-lock s16"></span><span>Seu papel permite ver os serviços. Começar e concluir ficam com quem está no serviço</span></div>`:'';
  return `<div class="card" style="overflow:visible;position:relative"><div class="lhd2"><b style="font-family:Sora">Serviços</b><span class="muted num" style="font-size:12.5px">6</span>${s==='noperm'?'':'<button class="btn outline sm" style="margin-left:auto"><span class="ic i-plus s14"></span>Adicionar serviços</button>'}</div>${note}${svcGroups({noact:s==='noperm'})}${extra}</div>`;
};
/* ===== adicionar veículo (ajuste) ===== */
R.adicionar=s=>head('OS 1042 · Conjunto C-320','Adicionar veículo','')+`<div class="db">
  <div class="input"><span class="ic i-search s16 muted"></span><input type="search" autocomplete="off" value="${s==='lock'?'RTB9A01':''}" placeholder="Placa ou frota"></div>
  <div class="eyebrow">${s==='lock'?'Resultado':'Sugestão'}</div>
  <div class="choice on" style="align-items:flex-start"><span class="radio" style="margin-top:4px"></span>${tt(s==='lock'?'warning':'primary',s==='lock'?'i-lock':'i-truck')}<div style="flex:1;min-width:0"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b class="plate">${s==='lock'?'RTB9A01':'RTA2B33'}</b><span class="chip t-none sm">Carreta</span>${s==='lock'?'':'<span class="bchip warning"><span class="ic i-warn s14"></span>1 falha sem decisão</span>'}</div><div class="muted" style="font-size:12.5px">${s==='lock'?'<b style="color:hsl(var(--warning-text))">Na OS 1035</b>, em manutenção há 1 dia':'Engatado no C-320 hoje às 09:10, depois da abertura'}</div></div></div>
  ${s==='lock'?`<div class="notice warn"><span class="ic i-lock s16"></span><span>RTB9A01 está na OS 1035. Para trazer para cá, transfira a partir da OS 1035</span></div>`:''}
</div><div class="df"><span class="grow">${s==='lock'?'':'<b>RTA2B33</b> entra como 4º veículo'}</span><button class="btn outline">Cancelar</button><button class="btn primary" ${s==='lock'?'disabled':''}>Adicionar</button></div>`;
/* ===== sai antes ===== */
R.sai2=s=>{
  const reasons=['Seguir viagem','Foi para outro conjunto','Outro'];
  const r=s==='other'?2:0;
  const pend=s==='pending'||s==='cancel';
  const svcs=pend?SVC2.RTE1J77.map(x=>srow(x,{noact:1,nomenu:1})).join(''):'';
  return head('OS 1042 · Conjunto C-320',`${pend?'RTE1J77':'SRK9H46'} sai antes`,'')+`<div class="db">
    <div class="field"><label>Por quê <span class="req">*</span></label><div class="fchips">${reasons.map((x,i)=>`<span class="fchip ${i===r?'on':''}">${x}</span>`).join('')}</div></div>
    ${s==='other'?'<div class="field"><label>Conte em poucas palavras <span class="req">*</span></label><div class="input"><input value="Cliente pediu de volta para carregar" ></div></div>':''}
    ${pend?`<div class="field"><label>2 serviços ainda abertos</label><div class="card" style="overflow:hidden;box-shadow:none">${svcs}</div></div>
      <div class="field"><label>O que fazer com eles</label>
      <div class="choice ${s==='pending'?'on':''}"><span class="radio"></span>${tt('primary','i-plus')}<div style="flex:1"><b>Levar para uma OS nova do RTE1J77</b><div class="muted" style="font-size:12.5px">Os 2 serviços seguem nela, ligada a esta</div></div></div>
      <div class="choice ${s==='cancel'?'on':''}"><span class="radio"></span>${tt('muted','i-x')}<div style="flex:1"><b>Cancelar os 2 serviços</b><div class="muted" style="font-size:12.5px">Ficam no histórico como cancelados</div></div></div></div>
      ${s==='cancel'?'<div class="field"><label>Motivo do cancelamento <span class="req">*</span></label><div class="input"><input placeholder="Ex.: o cliente vai fazer em outra oficina"></div></div>':''}`
    :`<div class="setcard">${tt('success','i-check')}<div><b>Nada aberto no SRK9H46</b><div class="muted" style="font-size:12.5px">1 serviço feito · revisão elétrica, com Bruno</div></div></div>`}
  </div><div class="df" style="flex-wrap:wrap"><span class="grow" style="min-width:200px;color:hsl(var(--foreground))">${pend?(s==='cancel'?'<span class="why0"><span class="ic i-info s14"></span>Informe o motivo</span>':'<b>RTE1J77</b> sai · OS nova com 2 serviços'):'<b>SRK9H46</b> sai · os outros 2 seguem na OS'}</span><div style="display:flex;gap:10px;margin-left:auto"><button class="btn outline">Cancelar</button><button class="btn primary" ${s==='cancel'?'disabled':''}>${pend&&s==='pending'?'Registrar saída e abrir OS':'Registrar saída'}</button></div></div>`;
};
/* ===== transferir ===== */
R.transf2=s=>{
  const none=s==='none';
  const opts=none?`<div class="setcard dots" style="flex-direction:column;text-align:center;padding:22px">${tt('primary','i-link','lg')}<b>Nenhuma OS aberta para o C-118</b><span class="muted" style="font-size:12.5px">Abra a OS do C-118 e a transferência já vai junto</span><button class="btn outline sm">Abrir OS para o C-118</button></div>`
    :`<div class="choice on" style="align-items:flex-start"><span class="radio" style="margin-top:4px"></span>${tt('primary','i-link')}<div style="flex:1;min-width:0"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b>OS 1043 · Conjunto C-118</b><span class="chip t-work sm">Sugerida</span></div><div class="muted" style="font-size:12.5px">SRK9H46 engatou nele hoje às 10:20 · na fila</div></div></div>
      <div class="choice" style="align-items:flex-start"><span class="radio" style="margin-top:4px"></span>${tt('muted','i-link')}<div style="flex:1;min-width:0"><b>OS 1038 · Conjunto C-900</b><div class="muted" style="font-size:12.5px">Em manutenção · box 1</div></div></div>`;
  const col=(t,items,tone)=>`<div class="tcol"><div class="eyebrow">${t}</div>${items.map(x=>`<div class="titem">${tt(tone,KIND[x[1]])}<span style="flex:1;min-width:0" class="trunc" title="${x[0]}">${x[0]}</span><span class="muted" style="font-size:12px">${x[2]}</span></div>`).join('')}</div>`;
  return head('OS 1042 · Conjunto C-320','Transferir SRK9H46','')+`<div class="db"><div class="field"><label>Para qual OS <span class="req">*</span></label>${opts}</div>
    ${none?'':`<div class="tcols">${col('Fica nesta OS',[['Revisão elétrica','elec','feito']],'success')}${col('Vai para a OS 1043',[['Vazamento de ar na linha','struct','na fila']],'primary')}</div>`}
  </div><div class="df"><span class="grow">${none?'':'<b>SRK9H46</b> vai para a OS 1043 com 1 serviço'}</span><button class="btn outline">Cancelar</button><button class="btn primary" ${none?'disabled':''}>Transferir</button></div>`;
};
/* ===== engate ===== */
R.engate2=s=>{
  if(s==='estimated') return `<div class="card" style="max-width:860px;margin:0 auto;overflow:hidden"><div style="padding:16px 18px;border-bottom:1px solid hsl(var(--border));display:flex;align-items:center;gap:10px">${tt('primary','i-link')}<div><b style="font-family:Sora">Histórico de engate</b><div class="muted" style="font-size:12.5px">RTE1J77 · carreta</div></div></div>
    ${[['QRT4B22','02/11 06:10','151.120','08/11 08:42','152.318','1.198',''],['ABC1D23','28/10 14:00','87.900','01/11 18:30','88.410','510','terceiro'],['QRT4B22','20/10 07:00','149.300','27/10 22:10','150.040','740','est']].map(r=>`<div class="hrow">${tt('muted','i-truck')}<div><b class="plate">${r[0]}</b>${r[6]==='terceiro'?' <span class="chip t-none sm">De terceiro</span>':''}</div><div class="num" style="font-size:12.5px"><span class="muted">Engatou</span> ${r[1]}<div>${r[2]} km</div></div><div class="num" style="font-size:12.5px"><span class="muted">Soltou</span> ${r[3]}<div>${r[4]} km ${r[6]==='est'?'<span class="chip t-wait sm" title="Sem leitura no desengate: estimado entre as leituras de 27/10 e 29/10">Estimado</span>':''}</div></div><b class="num" style="text-align:right;font-size:15px">${r[5]} km</b></div>`).join('')}</div>`;
  const lower=s==='lower', ext=s==='external';
  const opts=[['QRT4B22','Trouxe o conjunto · frota 812'],['RTB7F31','Livre no pátio · frota 815']];
  return `<div class="scrim" style="background:transparent;align-items:start"><div class="dialog" style="max-height:none">${head('Conjunto C-320 · OS 1042 concluída','Engatar para sair','')}<div class="db">
    <div class="field"><label>Cavalo <span class="req">*</span></label>${ext?`<div class="input"><span class="ic i-truck s16 muted"></span><input value="ABC1D23"><span class="chip t-none sm">De terceiro</span></div><div class="input"><input value="Transportes Lima" placeholder="Transportadora"></div>`:`<div class="utiles" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">${opts.map((o,i)=>`<div class="utile row ${i===1?'sel':''}">${tt(i===1?'primary':'muted','i-truck')}<span style="min-width:0"><b class="plate" style="font-size:14px">${o[0]}</b><span class="muted trunc" style="display:block;font-size:11.5px" title="${o[1]}">${o[1]}</span></span></div>`).join('')}</div><button class="btn" style="align-self:flex-start;height:24px;padding:0;font-size:12.5px;color:hsl(var(--muted-foreground))">Cavalo de terceiro</button>`}</div>
    <div class="field"><label>Km do ${ext?'ABC1D23':'RTB7F31'} <span class="req">*</span></label><div class="input ${lower?'err':''}"><span class="ic i-road s16 muted"></span><input class="num" inputmode="numeric" value="${lower?'9.775':ext?'88.990':'98.775'}"><span class="muted">km</span>${lower||ext?'':'<span class="chip t-ok sm"><span class="ic i-wifi s14"></span>Telemetria</span>'}</div>${lower?'<span class="hint err">Menor que o último (98.402 km em 08/11). Confira o número</span>':''}</div>
  </div><div class="df" style="flex-wrap:wrap"><span class="grow" style="min-width:200px;color:hsl(var(--foreground))">${lower?'<span class="why0"><span class="ic i-info s14"></span>Confira o km</span>':`<b>C-320</b> sai com 3 carretas, puxado pelo ${ext?'ABC1D23':'RTB7F31'}`}</span><div style="display:flex;gap:10px;margin-left:auto"><button class="btn outline">Cancelar</button><button class="btn primary" ${lower?'disabled':''}>Engatar</button></div></div></div></div>`;
};
/* ===== celular ===== */

/* ===================== round 4: device-aware screens on the kit ===================== */
const F=FX;
const isPhone=d=>d==='phone', isTab=d=>String(d).startsWith('tablet');
const dlg=(inner,w=560)=>`<div class="fx-overlay"><div class="dialog" style="width:min(${w}px,100%);max-height:100%">${inner}</div></div>`;
const sht=inner=>`<div class="fx-overlay fx-bottom"><div class="fx-sheet"><i class="fx-grab"></i>${inner}</div></div>`;
const bg=html=>`<div class="bgdim">${html}</div>`;
const stripHead=html=>html.replace(/<div class="dh"[^]*?<span class="x">[^]*?<\/span><\/span><\/div>/,'');
const RR={};

/* ---------- 1 lista ---------- */
function listaPhone(s){
  const chipsF=[['all','Todas',''],['part','Esperando peça','1'],['nomech','Sem mecânico','1'],['chk','Falha sem decisão','1'],['stale','Parada há mais de 1 dia','3']];
  const act=s==='filter'?'part':'all';
  const head=F.pageHeader('Ordens de serviço','',F.btn('Abrir OS',{icon:'plus',size:'sm'}))+`<div class="ltabs"><a aria-current="page">Abertas <span class="n">4</span></a><a>Concluídas</a></div>`+
    `<div class="input" style="height:40px;margin-bottom:8px"><span class="ic i-search s16 muted"></span><input type="search" autocomplete="off" placeholder="Placa, frota, conjunto ou OS" value="${s==='nofound'?'XYZ9':''}"></div><div class="pfchips" style="margin-bottom:10px">${chipsF.map(([k,l,n])=>F.fchip(l,{on:k===act,general:k==='all',count:n||null})).join('')}</div>`;
  if(s==='loading') return head+[1,2,3].map(()=>`<div class="pcard" style="padding:14px;margin-bottom:10px;display:flex;flex-direction:column;gap:10px">${F.sk('60%',18)}${F.sk('90%',14)}${F.sk('100%',40,12)}</div>`).join('');
  if(s==='empty') return head+F.empty({canvas:1,icon:'wrench',title:'Nenhuma OS aberta',hint:'Quando um conjunto ou veículo entrar na oficina, abra a OS para acompanhar o trabalho',action:F.btn('Abrir OS',{icon:'plus'})});
  if(s==='nofound') return head+F.empty({icon:'magnifying-glass',title:'Nenhuma OS encontrada para “XYZ9”',hint:'Confira a placa, a frota, o conjunto ou o número da OS',action:F.btn('Limpar busca',{variant:'outline'})});
  if(s==='error') return head+F.notice('danger','warning-circle','Não conseguimos carregar as OS agora. Tente de novo em alguns segundos')+`<div style="margin-top:10px">${F.btn('Tentar de novo',{variant:'outline'})}</div>`;
  return head+`<div style="display:flex;flex-direction:column;gap:10px">${LROWS.filter(r=>s!=='filter'||r.f.includes('part')).map(r=>`<div class="pcard" style="overflow:hidden">
    <div style="display:flex;gap:12px;align-items:center;padding:12px 14px 8px">${tt(r.tile[0],r.tile[1])}<div style="flex:1;min-width:0"><div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap"><b class="plate" style="white-space:nowrap">${r.set}</b>${r.train?cbar(r.train):''}</div><div class="muted trunc" style="font-size:12px" title="${r.os} · ${r.p}"><b class="num" style="color:hsl(var(--primary));font-family:Sora">${r.os}</b> · ${r.p}</div></div><div style="text-align:right"><div class="num" style="font:800 15px Sora;${r.hot?'color:hsl(var(--warning-ink))':''}">${r.stop}</div><div class="muted" style="font-size:11.5px">${r.where}</div></div></div>
    <div style="display:flex;gap:10px;align-items:center;padding:0 14px 10px">${ring(r.d,r.t,34,'')}<b class="num" style="font-size:13px;white-space:nowrap">${r.sum}</b><span style="flex:1"></span><span class="mi2">${r.who.length?`<span class="avs">${r.who.map(w=>av(w[0],1)).join('')}</span>`:'<span class="av dash"><span class="ic i-person s14"></span></span>'}<span class="${r.who.length?'':'muted'}">${r.whoT}</span></span></div>
    ${r.block?`<div style="padding:8px 14px;border-top:1px solid hsl(var(--border));background:hsl(var(--${r.block[0]}-soft)/.6)"><span class="bchip ${r.block[0]}" style="background:none;padding:0;height:auto" title="${r.block[2]}"><span class="ic ${r.block[1]} s14"></span><span class="trunc">${r.block[2]}</span></span></div>`:''}</div>`).join('')}</div>`;
}
RR.lista=(s,d)=>(isPhone(d)||d==='tablet-p')?F.mobile.workOrders({deltas:s==='proposal',state:s,cols2:d==='tablet-p'}):s==='loading'||s==='empty'?F.real.workOrdersPage({state:s}):F.real.workOrdersPage({deltas:s==='proposal',state:s==='filters'?null:s});

/* ---------- 2 abrir ---------- */
RR.abrir=(s,d)=>bg(isPhone(d)?F.mobile.workOrders():F.real.workOrdersPage())+(isPhone(d)?sht(R.abrir(s)):dlg(R.abrir(s),680));

/* ---------- 3 detalhe ---------- */
function prow(x){const [tone,word]=SST[x.st];
  const act=x.st==='work'?`<button class="fx-btn outline sm" style="height:40px"><span class="ic i-check s16"></span>Concluir</button>`:x.st==='wait'&&!x.who?`<button class="fx-btn outline sm" style="height:40px"><span class="ic i-person s16"></span>Escolher</button>`:x.st==='part'?`<button class="fx-btn outline sm" style="height:40px">Ver pedido</button>`:'';
  return `<div class="prow">${tt(tone,KIND[x.k])}<div style="flex:1;min-width:0"><b class="trunc" style="font-size:14px" title="${x.n}">${x.n}</b><div class="muted trunc" style="font-size:12px" title="${x.loc}">${x.loc||'veículo todo'}</div><div class="l2" style="display:flex;gap:4px 10px;flex-wrap:wrap;margin-top:3px"><span class="mi2 st ${tone}">${word}</span>${x.who?`<span class="mi2">${av(x.who[0],x.st==='work')}${x.who[1]}</span>`:'<span class="mi2 muted">Sem mecânico</span>'}${x.time?`<span class="mi2 num ${x.st==='work'?'run':''}">${x.time}</span>`:''}${x.parts[0]==='wait'?'<span class="mi2 warn"><span class="ic i-clock s14"></span>Esperando mola</span>':''}</div></div>${act}</div>`;}
function detalhePhone(s){
  if(s==='loading') return `<div class="mec">${F.sk('100%',120,16)}${F.sk('100%',80,16)}${F.sk('100%',200,16)}</div>`;
  const hero=`<div class="pcard" style="padding:14px;display:flex;flex-direction:column;gap:10px"><div style="display:flex;gap:12px;align-items:center">${tt('primary','i-link','lg')}<div style="flex:1;min-width:0"><div style="display:flex;gap:8px;align-items:center"><b style="font:800 19px Sora">Conjunto C-320</b>${cbar(['work','wait','done'])}</div><div class="muted trunc" style="font-size:12.5px">Freio puxando para a direita e vazamento de ar</div></div></div>
    <div class="kpis"><div class="kpi2"><div class="v">1 de 3</div><div class="l">prontos</div></div><div class="kpi2"><div class="v">2 d 8 h</div><div class="l">na oficina</div></div><div class="kpi2"><div class="v">Box 3</div><div class="l">${s==='disbanded'?'desfeito 11:00':'rodotrem'}</div></div></div></div>`;
  const att=[['danger','i-clock','RTE1J77 parado sem ninguém','Escolher'],['warning','i-box','Esperando mola de retorno','Ver']];
  if(s==='left') att.unshift(['warning','i-swap','SRK9H46 saiu do conjunto','Decidir']);
  const attn=`<div class="attn" style="margin:0"><div class="ahd"><span class="ic i-warn s16"></span><b>Precisa de atenção</b><span class="chip t-wait sm num">${att.length+2}</span></div><div class="alist" style="grid-template-columns:1fr">${att.map(a=>`<div class="aitem">${tt(a[0],a[1])}<b class="trunc" style="flex:1;min-width:0;font-size:13.5px" title="${a[2]}">${a[2]}</b><button class="fx-btn outline sm" style="height:40px">${a[3]}</button></div>`).join('')}<button class="fx-btn ghost sm" style="height:40px">Ver mais 2</button></div></div>`;
  const only=s==='filtered'?'RTF6K38':null;
  const strip=`<div class="sech"><b>Veículos</b><span>toque para filtrar</span></div><div class="hscroll">${OSV.map(v=>vcard(v,{on:only===v.plate,nocost:s==='noperm'})).join('')}</div>`;
  const groups=OSV.filter(v=>!only||v.plate===only).map(v=>`<div class="pcard" style="overflow:hidden">${ghd(v)}${SVC2[v.plate].map(prow).join('')}</div>`).join('');
  return `<div class="mec">${hero}${attn}${strip}${only?`<div style="display:flex;gap:8px;align-items:center">${F.fchip('1º RTF6K38 ✕',{on:1})}<span class="muted" style="font-size:12.5px">3 de 6 serviços</span></div>`:''}${groups}<div style="height:70px"></div></div><span class="fab"><span class="ic i-plus s20"></span>Serviços</span>`;
}
RR.detalhe=(s,d)=>s==='today'?`<div class="dpad">${F.real.workOrderHeader()}<div class="fx-delta" style="margin-top:14px"><span class="fx-newtag">a copiar</span><span style="font-size:12.5px">Abaixo do topo, hoje: a faixa de frentes, o painel de serviços e o de peças (work-order-fronts-panel, work-order-services-panel). Entram aqui na próxima rodada, copiados do código.</span></div></div>`:isPhone(d)?detalhePhone(s):R.detalhe2(s);

/* ---------- 4 montar ---------- */
function montarPhone(s){
  const V=SETV(),B={0:{a2Lo:'1'},1:{a2Lo:'chk'}};
  const cols=V.map((v,i)=>vcol(v,{badges:B[i],big:true,...(i===1&&s!=='empty'?{sel:new Set(['a3Lo'])}:{}),...(i===1&&s==='tap'?{focus:['a3Lo'],sel:new Set()}:{})})).join('');
  const bar=s==='empty'?`<div class="pbar"><span class="why0"><span class="ic i-info s14"></span>Toque onde está o problema</span></div>`:`<div class="pbar"><span style="flex:1;font-size:12.5px"><b>3 serviços em 2 veículos</b><br><span class="muted">5 peças do kit, 1 em falta</span></span><button class="fx-btn primary" style="height:48px">Revisar e criar</button></div>`;
  let over='';
  if(s==='tap') over=sht(`<div class="dh"><div class="t"><div class="eyebrow">RTE1J77 · eixo 3, esquerdo externo</div><h3>O que fazer aqui</h3></div><span class="x"><span class="ic i-x s16"></span></span></div><div class="db" style="gap:8px"><div class="last"><span class="ic i-clock s14"></span>Último aqui: troca de pneu há 4 meses, 31.000 km</div><div class="shorts"><span class="on">Só esta roda</span><span>As duas do lado</span><span>O eixo todo</span><span>Todas as rodas</span></div>${[['Troca de pneu','Roda · 1 peça do kit'],['Troca de lona de freio','Eixo e lado · 3 peças do kit'],['Revisão do cubo','Eixo e lado · 2 peças do kit']].map((r,i)=>`<div class="qcard" style="padding:10px 12px">${tt(i?'muted':'primary',i===0?'i-tire':'i-disc')}<div class="t"><b>${r[0]}</b><span class="muted" style="font-size:12px">${r[1]}</span></div><span class="ic i-plus s20 muted"></span></div>`).join('')}<div class="input" style="height:44px"><span class="ic i-search s16 muted"></span><input type="search" autocomplete="off" placeholder="Outro serviço"></div></div>`);
  if(s==='list') over=sht(`<div class="dh"><div class="t"><div class="eyebrow">OS 1042 · Conjunto C-320</div><h3>Lista · 3 serviços</h3></div><span class="x"><span class="ic i-x s16"></span></span></div><div class="db" style="gap:8px">${[['cat',{}],['lona',{}],['pneu',{}]].map(([k,lo],i)=>lineCard(LN[k],i+1,lo)).join('')}</div><div class="df" style="flex-direction:column;align-items:stretch"><div style="font-size:12.5px"><b>3 serviços em 2 veículos</b> · 5 peças do kit, <span style="color:hsl(var(--danger-ink));font-weight:600">1 em falta</span></div><div style="display:flex;gap:8px"><button class="fx-btn outline" style="flex:1;height:48px">Voltar à planta</button><button class="fx-btn primary" style="flex:1;height:48px">Criar 3 serviços</button></div></div>`);
  if(s==='offline') return `${F.notice('warning','wifi-slash','Sem sinal. A lista fica salva neste aparelho e vai quando a conexão voltar')}<div style="display:flex;flex-direction:column;gap:10px;margin-top:10px">${cols}</div><div style="height:80px"></div><div class="pbar"><span style="flex:1;font-size:12.5px"><b>3 pendentes</b><br><span class="muted">vão quando o sinal voltar</span></span><button class="fx-btn outline" style="height:48px">Ver lista</button></div>`;
  return `<div class="input" style="height:44px;margin-bottom:10px"><span class="ic i-search s16 muted"></span><input type="search" autocomplete="off" placeholder="Buscar serviço"></div><div style="display:flex;flex-direction:column;gap:10px">${cols}</div><div style="height:80px"></div>${bar}${over}`;
}
RR.montar=(s,d)=>{
  if(isPhone(d)) return montarPhone(s);
  const body=R.montar(s);
  if(isTab(d)) return `<div class="ws flat">${stripHead(body.replace(/^<div class="ws">/,''))}`;
  return bg(R.detalhe2('ok'))+`<div class="fx-overlay" style="place-items:start center;padding:16px">${`<div style="width:min(1300px,100%)">${body}</div>`}</div>`;
};

/* ---------- 4a, 4b, 4c ---------- */
RR.linha=s=>R.linha2(s);
const toOverlay=h=>h.replace('<div class="scrim" style="background:transparent;align-items:start">','<div class="fx-overlay" style="place-items:start center">');
RR.tipo=s=>s==='list'?R.tipo(s):`<div class="bgdim">${R.tipo('list')}</div>`+toOverlay(R.tipo(s));
RR.chk=()=>chkPreview();

/* ---------- 5 adicionar veículo, 6 sai, 7 transferir, 8 concluir, 9 engate ---------- */
RR.adicionar=s=>bg(R.detalhe2('ok'))+dlg(R.adicionar(s),580);
RR.sai=(s,d)=>isPhone(d)?bg(detalhePhone('ok'))+sht(R.sai2(s)):bg(R.detalhe2('ok'))+dlg(R.sai2(s),620);
RR.transf=s=>bg(R.detalhe2('ok'))+dlg(R.transf2(s),620);
RR.concluir=(s,d)=>isPhone(d)?bg(detalhePhone('ok'))+sht(R.concluir(s)):bg(R.detalhe2('ok'))+dlg(R.concluir(s),720);
RR.engate=s=>toOverlay(R.engate2(s));

/* ---------- 10 mecânico ---------- */
const MY={run:{n:'Troca de lona de freio',plate:'RTF6K38',loc:'eixo 2, os dois lados',t:'0:42',os:'OS 1042',box:'Box 3'},
  next:{n:'Regulagem de catraca',plate:'RTF6K38',loc:'eixos 1, 2 e 3, os dois lados',k:'brake',parts:'Sem peças do kit'},
  queue:[{n:'Troca de cuíca',plate:'RTE1J77',loc:'eixo 1, direito',st:'wait',k:'brake',why:'Na fila'},{n:'Troca de lona de freio',plate:'RTE1J77',loc:'eixo 2, esquerdo',st:'part',k:'brake',why:'Esperando mola'},{n:'Revisão do cubo',plate:'DLY1J07',loc:'eixo 2, direito',st:'wait',k:'brake',why:'Na fila · OS 1040'}],
  done:[['Lubrificação geral','RTF6K38','0:35'],['Revisão elétrica','SRK9H46','1:05']]};
function runCard(s,d){
  const paused=s==='paused';
  return `<div class="runcard2 ${paused?'paused':''}"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="pill2"><span class="ic ${paused?'i-pause':'i-timer'} s14"></span>${paused?'Pausado · almoço':'Em andamento'}</span><span style="flex:1"></span><span style="font-size:12.5px;opacity:.85">${MY.run.os} · ${MY.run.box}</span>${s==='offline'?'<span class="pill2">Pendente</span>':''}</div>
    <div><b style="font:800 ${isPhone(d)?18:22}px Sora;display:block">${MY.run.n}</b><span style="font-size:13.5px;opacity:.88"><b>${MY.run.plate}</b> · ${MY.run.loc}</span></div>
    <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:10px;flex-wrap:wrap"><span class="big" style="${isPhone(d)?'':'font-size:64px'}">${paused?'0:42':MY.run.t}</span><span style="font-size:12.5px;opacity:.85;display:inline-flex;gap:6px;align-items:center"><span class="ic i-box s14"></span>Peças separadas</span></div>
    <div class="btns">${paused?`<button class="b1"><span class="ic i-check s16"></span>Concluir</button><button class="b2"><span class="ic i-play s16"></span>Retomar</button>`:`<button class="b1"><span class="ic i-pause s16"></span>Pausar</button><button class="b2"><span class="ic i-check s16"></span>Concluir</button>`}</div></div>`;}
function nextCard(s,d,hero){
  return `<div class="nextcard ${hero?'hero':''}"><div class="sech" style="margin:0"><b>${hero?'Seu próximo serviço':'Próximo'}</b><span>OS 1042 · Box 3</span></div><div style="display:flex;gap:12px;align-items:center">${tt(hero?'primary':'muted','i-disc','lg')}<div style="flex:1;min-width:0"><b style="font-size:15.5px">${MY.next.n}</b><div class="muted trunc" style="font-size:12.5px" title="${MY.next.plate} · ${MY.next.loc}"><b style="color:hsl(var(--foreground))">${MY.next.plate}</b> · ${MY.next.loc}</div></div></div>
    <div class="meta3"><span><span class="ic i-box s14"></span>${MY.next.parts}</span><span><span class="ic i-clock s14"></span>leva cerca de 40 min</span></div>
    <button class="fx-btn ${hero?'primary':'soft'} lg" style="width:100%"><span class="ic i-play s20"></span>Começar</button>${hero?'':'<span class="muted" style="font-size:11.5px;text-align:center">Começar pausa a troca de lona</span>'}</div>`;}
function queueList(cols){
  return `<div class="sech"><b>Na sua fila</b><span>3</span></div><div style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:8px">${MY.queue.map(q=>`<div class="qcard">${tt(q.st==='part'?'warning':'muted',KIND[q.k])}<div class="t"><b class="trunc" title="${q.n}">${q.n}</b><span class="muted trunc" style="font-size:12px;display:block" title="${q.plate} · ${q.loc}"><b style="color:hsl(var(--foreground))">${q.plate}</b> · ${q.loc}</span></div><span class="chip ${q.st==='part'?'t-wait':'t-none'} sm">${q.why}</span></div>`).join('')}</div>`;}
const doneToday=()=>`<div class="pcard" style="padding:4px 0"><div class="sech" style="padding:8px 14px 4px"><b>Feitos hoje</b><span>2 · 1 h 40 de trabalho</span></div>${MY.done.map(x=>`<div class="prow">${tt('success','i-check')}<div style="flex:1;min-width:0"><b style="font-size:13.5px">${x[0]}</b><div class="muted" style="font-size:12px">${x[1]}</div></div><b class="num muted">${x[2]}</b></div>`).join('')}</div>`;
const todayKpis=()=>`<div class="kpis"><div class="kpi2"><div class="v">2</div><div class="l">feitos hoje</div></div><div class="kpi2"><div class="v">3 h 10</div><div class="l">trabalhadas</div></div><div class="kpi2"><div class="v">3</div><div class="l">na sua fila</div></div></div>`;
RR.mec=(s,d)=>{
  if(s==='loading') return `<div class="mec">${F.sk('100%',70,14)}${F.sk('100%',220,20)}${F.sk('100%',160,18)}</div>`;
  if(s==='empty') return `<div class="mec">${todayKpis().replace('>3<','>0<')}${F.empty({canvas:1,icon:'coffee',title:'Nenhum serviço com você agora',hint:'Quando o encarregado passar um serviço, ele aparece aqui com o Começar'})}${doneToday()}</div>`;
  const off=s==='offline'?F.notice('warning','wifi-slash','Sem sinal. O que você marcar fica salvo e vai quando a conexão voltar'):'';
  const top=s==='idle'?nextCard(s,d,true):runCard(s,d)+nextCard(s,d,false);
  if(d==='tablet-l') return `<div class="mec">${off}<div class="mec-grid"><div class="mec">${top}</div><div class="mec">${todayKpis()}${queueList(1)}${doneToday()}</div></div></div>`;
  if(d==='tablet-p') return `<div class="mec">${off}${todayKpis()}<div class="mec-grid" style="grid-template-columns:1fr 1fr">${s==='idle'?`<div style="grid-column:1/-1">${top}</div>`:`<div>${runCard(s,d)}</div><div>${nextCard(s,d,false)}</div>`}</div>${queueList(2)}${doneToday()}</div>`;
  return `<div class="mec">${off}${top}${queueList(1)}${doneToday()}</div>`;
};

/* ---------- boot ---------- */
FX.bind({lista:RR.lista,abrir:RR.abrir,detalhe:RR.detalhe,montar:RR.montar,linha:RR.linha,tipo:RR.tipo,chk:RR.chk,adicionar:RR.adicionar,sai:RR.sai,transf:RR.transf,concluir:RR.concluir,engate:RR.engate,mec:RR.mec});
