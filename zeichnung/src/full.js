/* ============ Ganzes Teil tolerieren ============ */
const AXIS_SYMS=['koaxialitaet','position'];
const FORM_SYMS=['geradheit','ebenheit','rundheit','zylindrizitaet'];
function needsDatum(s){return s&&!FORM_SYMS.includes(s)&&s!=='linienprofil'&&s!=='flaechenprofil';}

tasks.unshift({id:'g1',type:'Ganzes Teil tolerieren',title:'Getriebewelle mit Fest- und Loslager',
text:'Die Welle läuft in zwei Rillenkugellagern 6205. Links sitzt das Festlager, rechts das Loslager. Beide Lagerringe liegen an einer Schulter an. Das Zahnrad sitzt auf ⌀28 k6 und liegt am Bund ⌀32 an. Rechts sitzt eine Kupplung mit Spannelement auf ⌀20 k6. Das Zahnrad soll ruhig laufen. Lege die Bezüge fest. Trage dann alle nötigen Form- und Lagetoleranzen ein.',
full:{
 feats:{
  f1:{n:'Lagersitz links ⌀25 k6',mk:[66,64],surf:{fx:24,fy:26,pts:[[71,29.5],[71,55]]},axis:{fx:24,fy:26,pts:[[52,29.5],[52,55]]},dat:[52,105]},
  f2:{n:'Bund ⌀32, linke Stirnfläche (Lagerschulter)',mk:[77,52.5],surf:{fx:48,fy:12,pts:[[82,15.5],[82,36],[74,36]]},ext:[74,48,74,34]},
  f3:{n:'Bund ⌀32, rechte Stirnfläche (Anlage Zahnrad)',mk:[87,52.5],surf:{fx:100,fy:12,pts:[[96,15.5],[96,50],[90,50]]}},
  f4:{n:'Zahnradsitz ⌀28 k6',mk:[112,63],surf:{fx:100,fy:26,pts:[[140,29.5],[140,52]]},axis:{fx:100,fy:26,pts:[[130,29.5],[130,52]]},dat:[130,108]},
  f5:{n:'Schulter ⌀28/⌀25 (Anlage Loslager)',mk:[153.5,60],surf:{fx:164,fy:12,pts:[[158,15.5],[158,38],[150,38]]},ext:[150,52,150,36]},
  f6:{n:'Lagersitz rechts ⌀25 k6',mk:[172,64],surf:{fx:184,fy:26,pts:[[177,29.5],[177,55]]},axis:{fx:184,fy:26,pts:[[158,29.5],[158,55]]},dat:[158,105]},
  f7:{n:'Kupplungssitz ⌀20 k6',mk:[222,72],surf:{fx:226,fy:12,pts:[[222,15.5],[222,60]]},axis:{fx:226,fy:12,pts:[[210,15.5],[210,60]]},dat:[210,100]}
 },
 datumFeats:['f1','f4','f6','f7'],
 needDatum:['f1','f6'],
 datumWhy:'Die Welle dreht sich in den beiden Lagern. Die Drehachse entsteht also aus beiden Lagersitzen zusammen. Deshalb setzt man je einen Bezug auf beide Lagersitze, zum Beispiel A und B. Im Rahmen steht dann der gemeinsame Bezug A-B. Genau so ist es im Kursbuch bei der Wälzlagerung eingetragen.',
 reqs:[
  {f:'f1',v:[{sym:['zylindrizitaet','rundheit'],dat:null,r:[0.003,0.01]},{sym:['rundlauf','gesamtlauf'],dat:'f1+f6',datMsg:'Bezug sollte die gemeinsame Drehachse A-B sein',r:[0.004,0.015]}],
   why:'Lagersitz: Der Innenring ist dünn. Er nimmt die Form der Welle an. Darum begrenzt man die Form: Zylinderform etwa 0,004 bis 0,006 (rund IT5/2).'},
  {f:'f2',v:[{sym:['rundlauf','gesamtlauf','rechtwinkligkeit'],dat:'f1+f6',datMsg:'Bezug sollte die gemeinsame Drehachse A-B sein',r:[0.005,0.02]}],
   why:'Lagerschulter: Das Festlager liegt hier an. Steht die Schulter schief, verkantet der Innenring. Planlauf zur Drehachse A-B, etwa 0,01.'},
  {f:'f3',v:[{sym:['rundlauf','gesamtlauf','rechtwinkligkeit'],dat:'f1+f6',datMsg:'Bezug sollte die gemeinsame Drehachse A-B sein',r:[0.008,0.03]}],
   why:'Anlage Zahnrad: Steht die Fläche schief, taumelt das Zahnrad. Planlauf zu A-B, etwa 0,01 bis 0,02.'},
  {f:'f4',v:[{sym:['rundlauf','gesamtlauf'],dat:'f1+f6',datMsg:'Bezug sollte die gemeinsame Drehachse A-B sein',r:[0.008,0.03]},{sym:['koaxialitaet'],dia:true,dat:'f1+f6',datMsg:'Bezug sollte die gemeinsame Drehachse A-B sein',r:[0.01,0.04]}],
   why:'Zahnradsitz: Das Zahnrad muss rund um die Drehachse laufen. Rundlauf zu A-B, etwa 0,02. Koaxialität mit ⌀ ist auch möglich. Rundlauf ist aber einfacher zu prüfen.'},
  {f:'f5',v:[{sym:['rundlauf','gesamtlauf','rechtwinkligkeit'],dat:'f1+f6',datMsg:'Bezug sollte die gemeinsame Drehachse A-B sein',r:[0.005,0.02]}],
   why:'Schulter für das Loslager: Der Lagerring liegt hier an. Planlauf zu A-B, etwa 0,01.'},
  {f:'f6',v:[{sym:['zylindrizitaet','rundheit'],dat:null,r:[0.003,0.01]},{sym:['rundlauf','gesamtlauf'],dat:'f1+f6',datMsg:'Bezug sollte die gemeinsame Drehachse A-B sein',r:[0.004,0.015]}],
   why:'Zweiter Lagersitz: gleiche Begründung wie links. Zylinderform etwa 0,005.'},
  {f:'f7',v:[{sym:['rundlauf','gesamtlauf'],dat:'f1+f6',datMsg:'Bezug sollte die gemeinsame Drehachse A-B sein',r:[0.01,0.06]},{sym:['koaxialitaet'],dia:true,dat:'f1+f6',datMsg:'Bezug sollte die gemeinsame Drehachse A-B sein',r:[0.02,0.06]}],
   why:'Kupplungssitz: Er muss zur Drehachse laufen, sonst schlägt die Kupplung. Die Anforderung ist kleiner als beim Zahnrad. Rundlauf zu A-B, etwa 0,03.'}
 ],
 solution:{dat:{f1:'A',f6:'B'},rows:[['f1','zylindrizitaet','0,005',''],['f2','rundlauf','0,01','A-B'],['f3','rundlauf','0,02','A-B'],['f4','rundlauf','0,02','A-B'],['f5','rundlauf','0,01','A-B'],['f6','zylindrizitaet','0,005',''],['f7','rundlauf','0,03','A-B']]}
},
draw(){
  const {svg,g}=sheet({title:'Getriebewelle',subtitle:'Stirnradgetriebe, Zwischenwelle',material:'C45E/1.1191',partno:'LW 201 001',ra:'3,2',scale:'2:1'});
  const cy=80,x0=44;
  const xs=shaft(g,x0,cy,[[50,30,2,0],[64,16,0,0],[56,60,0,0],[50,30,0,0],[40,50,0,2]]);
  const [a,b,c,d,e,f]=xs;
  ctr(g,x0-6,cy,f+6,cy);
  // Durchmesser (Massstab 2:1, Masszahlen in wahrer Grösse)
  dim(g,52,55,52,105,0,'⌀25 k6',{noext:true,sh:-12});
  dim(g,82,48,82,112,0,'⌀32',{noext:true,sh:-14});
  dim(g,130,52,130,108,0,'⌀28 k6',{noext:true,sh:-13});
  dim(g,158,55,158,105,0,'⌀25 k6',{noext:true,sh:-12});
  dim(g,210,60,210,100,0,'⌀20 k6',{noext:true,sh:-10});
  // Längen: Masshilfslinien ab der unteren Kontur
  const yc=126,yo=136,bot=[[a,103],[b,112],[c,112],[d,108],[e,105],[f,98]];
  bot.forEach(([x,y],i)=>L(g,x,y+1,x,(i===0||i===5?yo:yc)+1.5));
  [[a,b,'15'],[b,c,'8'],[c,d,'30'],[d,e,'15'],[e,f,'25']].forEach(([p,q,t])=>dim(g,p,yc,q,yc,0,t,{noext:true}));
  dim(g,a,yo,f,yo,0,'93',{noext:true});
  note(g,a+1,104,'1×45°',a-5,114);
  note(g,f-1,99,'1×45°',f+6,110);
  surf(g,47,55,'0,8');surf(g,104,52,'1,6');surf(g,155,55,'0,8');surf(g,184,60,'1,6');
  const pv=E('g');g.appendChild(pv);svg._pv=pv;
  const mk=E('g',{class:'marks'});g.appendChild(mk);svg._mk=mk;
  return svg;
}});

function buildFull(t,card,svg,fb){
  const F=t.full,feats=F.feats;
  // Nummern im Bild
  Object.keys(feats).forEach((k,i)=>{const [x,y]=feats[k].mk;const h=E('g',{class:'hot'});h.appendChild(E('circle',{cx:x,cy:y,r:2.3}));T(h,x,y+1.1,String(i+1),{'text-anchor':'middle'});svg._mk.appendChild(h);});
  const fNo=k=>Object.keys(feats).indexOf(k)+1;
  const box=H('div',{class:'method'},'<b>Vorgehen</b><ol><li>Lies die Funktion. Welche Flächen berühren andere Teile?</li><li>Lege die Bezüge fest: Auf welchen Flächen läuft oder liegt das Teil im Betrieb?</li><li>Wähle für jede Funktionsfläche die Eigenschaft: Form, Richtung, Ort oder Lauf.</li><li>Wähle einen sinnvollen Wert. Hilfe unten bei «Typische Werte».</li></ol>');
  card.insertBefore(box,card.querySelector('.draw'));
  const hideMk=H('label',{class:'hint'},'<input type="checkbox"> Nummern ausblenden');hideMk.querySelector('input').onchange=e=>{svg._mk.style.display=e.target.checked?'none':'';};
  card.appendChild(hideMk);
  // 1. Bezüge
  const qd=H('div',{class:'q'});qd.appendChild(H('p',{class:'lead'},'1. Bezüge festlegen'));
  const drow=H('div',{class:'row'});const dsel={};
  F.datumFeats.forEach(k=>{const l=H('label',{},fNo(k)+' · '+feats[k].n);const s=H('select');['–','A','B','C','D'].forEach(o=>s.appendChild(H('option',{value:o==='–'?'':o},o)));l.appendChild(s);drow.appendChild(l);dsel[k]=s;});
  qd.appendChild(drow);card.appendChild(qd);
  // 2. Toleranzen
  const qt=H('div',{class:'q'});qt.appendChild(H('p',{class:'lead'},'2. Toleranzen eintragen'));
  qt.appendChild(H('div',{class:'frow'},'<span class="hd">Element</span><span class="hd">Symbol</span><span class="hd">Zone</span><span class="hd">Wert</span><span class="hd">Bezug</span><span></span>'));
  const rowsEl=H('div');qt.appendChild(rowsEl);
  const add=H('button',{class:'btn sec'},'+ Zeile hinzufügen');qt.appendChild(add);
  qt.appendChild(H('details',{class:'rw'},'<summary>Typische Werte (Richtwerte)</summary><ul class="reqs"><li>Lagersitz Wälzlager (k6, j6): Zylinderform 0,004–0,008</li><li>Lagerschulter: Planlauf 0,008–0,015</li><li>Sitz Zahnrad: Rundlauf 0,01–0,03</li><li>Sitz Kupplung, Riemenscheibe: Rundlauf 0,02–0,05</li><li>Gefräste Anlagefläche: Ebenheit 0,02–0,1</li></ul><p class="hint">Faustregel: Die Form- oder Lagetoleranz ist kleiner als die Masstoleranz. k6 bei ⌀25 hat 0,013 Toleranz.</p>'));
  card.appendChild(qt);
  const rows=[];
  function datOpts(){const map={};for(const k in dsel)if(dsel[k].value)map[dsel[k].value]=k;const L=Object.keys(map).sort();const o=[''];L.forEach(x=>o.push(x));for(let i=0;i<L.length;i++)for(let j=i+1;j<L.length;j++)o.push(L[i]+'-'+L[j]);for(const x of L)for(const y of L)if(x!==y)o.push(x+'|'+y);return {o,map};}
  function refreshDat(){const {o}=datOpts();rows.forEach(r=>{const v=r.dat.value;r.dat.innerHTML='';o.forEach(x=>r.dat.appendChild(H('option',{value:x},x||'– keiner –')));r.dat.value=o.includes(v)?v:'';});}
  function addRow(pre){
    const el=H('div',{class:'frow'});
    const fs=H('select');fs.appendChild(H('option',{value:''},'– Element –'));Object.keys(feats).forEach(k=>fs.appendChild(H('option',{value:k},fNo(k)+' · '+feats[k].n)));
    const ss=symSelect();const dz=H('select');[['0','ohne ⌀'],['1','mit ⌀']].forEach(([v,o])=>dz.appendChild(H('option',{value:v},o)));
    const vi=H('input',{type:'text',placeholder:'0,02'});const ds=H('select');const del=H('button',{class:'btn sec',title:'Zeile löschen'},'✕');
    el.append(fs,ss,dz,vi,ds,del);rowsEl.appendChild(el);
    const r={el,f:fs,sym:ss,dia:dz,val:vi,dat:ds};rows.push(r);refreshDat();
    if(pre){fs.value=pre[0];ss.value=pre[1];vi.value=pre[2];dz.value=pre[4]?'1':'0';refreshDat();ds.value=pre[3];}
    [fs,ss,dz,vi,ds].forEach(x=>x.addEventListener('input',redraw));
    del.onclick=()=>{rows.splice(rows.indexOf(r),1);el.remove();redraw();};
    redraw();
  }
  add.onclick=()=>addRow();
  Object.values(dsel).forEach(s=>s.addEventListener('input',()=>{refreshDat();redraw();}));
  function redraw(){
    const pv=svg._pv;pv.innerHTML='';
    for(const k in dsel)if(dsel[k].value){const [x,y,dd]=feats[k].dat;datum(pv,x,y,dsel[k].value,dd||'down',3);}
    const cnt={};
    rows.forEach(r=>{const k=r.f.value,s=r.sym.value;if(!k||!s)return;const ft=feats[k];
      const isAxis=AXIS_SYMS.includes(s)||(r.dia.value==='1'&&ft.axis);const an=(isAxis&&ft.axis)?ft.axis:ft.surf;
      const n=cnt[k]=(cnt[k]||0)+1;const vv=(r.dia.value==='1'?'⌀':'')+(r.val.value.trim()||'…');const d=r.dat.value?r.dat.value.split('|'):[];
      if(n===1){tol(pv,an.fx,an.fy,s,vv,d,an.pts||[]);if(ft.ext)L(pv,...ft.ext);}else frame(pv,an.fx,an.fy+7*(n-1),s,vv,d);
    });
    if(F.onRedraw)F.onRedraw(pv,rows);
  }
  // Prüfen
  function check(){
    const {map}=datOpts();const li=[];let ok=0,tot=0;
    const set=r=>{const v=r.dat.value;if(!v)return null;if(v.includes('|'))return v.split('|').map(x=>map[x]).join('>');return v.split('-').map(x=>map[x]).sort().join('+');};
    // Bezüge
    tot++;const dk=Object.keys(dsel).filter(k=>dsel[k].value);const dOk=F.needDatum.every(k=>dk.includes(k));
    const used=new Set();rows.forEach(r=>{if(r.dat.value)r.dat.value.split(/[-|]/).forEach(x=>used.add(map[x]));});
    const commonUsed=(F.datumUse||[F.needDatum.slice().sort().join('+')]).every(u=>rows.some(r=>set(r)===u));
    if(dOk&&commonUsed)ok++;
    li.push(`<li class="${dOk&&commonUsed?'g':'b'}"><b>Bezüge: ${dOk&&commonUsed?'richtig':'noch nicht richtig'}.</b> ${dOk?(commonUsed?'':(F.datumUseMsg||'Du hast die Bezüge gesetzt, aber im Rahmen nicht richtig verwendet. ')):'Es fehlt ein Bezug. '}${F.datumWhy}</li>`);
    // Regeln pro Zeile
    rows.forEach(r=>{const s=r.sym.value;if(!r.f.value||!s)return;const nm=fNo(r.f.value)+' '+SYM[s].n;
      if(FORM_SYMS.includes(s)&&r.dat.value)li.push(`<li class="b"><b>Regelfehler bei ${nm}:</b> Formtoleranzen haben nie einen Bezug.</li>`);
      if(needsDatum(s)&&!r.dat.value)li.push(`<li class="b"><b>Regelfehler bei ${nm}:</b> Diese Toleranz braucht immer einen Bezug.</li>`);
      if(r.dia.value==='1'&&!AXIS_SYMS.includes(s)&&!feats[r.f.value].axis)li.push(`<li class="b"><b>Regelfehler bei ${nm}:</b> Eine Fläche hat keine Zylinderzone. Kein ⌀ vor dem Wert.</li>`);
    });
    // Anforderungen
    F.reqs.forEach(q=>{tot++;const mine=rows.filter(r=>r.f.value===q.f&&r.sym.value);const nm=fNo(q.f)+' · '+feats[q.f].n;
      if(q.none){if(!mine.length){ok++;li.push(`<li class="g"><b>${nm}: richtig, keine Eintragung.</b> ${q.why}</li>`);}else li.push(`<li class="p"><b>${nm}: nicht nötig.</b> ${q.why}</li>`);return;}
      let best=null,score=-1;
      mine.forEach(r=>q.v.forEach(v=>{const sOk=v.sym.includes(r.sym.value);if(!sOk)return;const dz=(r.dia.value==='1')===!!v.dia;const dt=v.dat?set(r)===v.dat:!r.dat.value;const val=parseNum(r.val.value);const vOk=val>=v.r[0]-1e-9&&val<=v.r[1]+1e-9;const sc=1+dz+dt+vOk;if(sc>score){score=sc;best={r,v,dz,dt,vOk,val};}}));
      let cls,msg;
      if(!mine.length){cls='b';msg='fehlt.';}
      else if(!best){cls='b';msg='falsches Symbol ('+mine.map(r=>SYM[r.sym.value].n).join(', ')+').';}
      else if(score===4){cls='g';msg='richtig.';ok++;}
      else{cls='p';const p=[];if(!best.dz)p.push(best.v.dia?'⌀ fehlt':'⌀ ist hier falsch');if(!best.dt)p.push(best.v.dat?'Bezug sollte die gemeinsame Drehachse sein':'kein Bezug bei einer Formtoleranz');if(!best.vOk)p.push(isNaN(best.val)?'Wert fehlt':(best.val<best.v.r[0]?'Wert sehr eng, teuer':'Wert zu gross')+' – üblich '+fmt(best.v.r[0])+' bis '+fmt(best.v.r[1]));msg='Symbol passt. '+p.join('; ')+'.';}
      li.push(`<li class="${cls}"><b>${nm}: ${msg}</b> ${q.why}</li>`);
    });
    const extra=rows.filter(r=>r.f.value&&!F.reqs.some(q=>q.f===r.f.value));
    const all=ok===tot&&!li.some(x=>x.includes('Regelfehler'));
    fb.className='fb '+(all?'ok':ok>tot/2?'part':'bad');
    fb.innerHTML=`<h4>${all?'Alles richtig toleriert.':'Ergebnis: '+ok+' von '+tot+' Punkten.'}</h4><ul class="res">${li.join('')}</ul>${extra.length?'<p class="hint">Zusätzliche Eintragungen sind nicht falsch. Jede Toleranz kostet aber Geld in Fertigung und Prüfung.</p>':''}<p class="hint">Andere Lösungen können auch sinnvoll sein. Frag im Zweifel deine Lehrperson.</p>`;
    setResult(t.id,all);
  }
  const show=H('button',{class:'btn sec'},'Musterlösung zeigen');
  show.onclick=()=>{const S=F.solution;for(const k in dsel)dsel[k].value=S.dat[k]||'';rows.slice().forEach(r=>r.el.remove());rows.length=0;S.rows.forEach(p=>addRow(p));refreshDat();S.rows.forEach((p,i)=>rows[i].dat.value=p[3]);redraw();check();fb.querySelector('h4').textContent='Musterlösung';setResult(t.id,false);};
  addRow();
  return {check,show};
}

/* Durchmessermass schräg durch die Mitte (Pfeile innen am Kreis, Text aussen) */
function diaLine(g,cx,cy,r,ang,txt,ted,tr){
  tr=tr||r;const a=ang*Math.PI/180,ux=Math.cos(a),uy=-Math.sin(a),R=tr+4+txt.length*2.2;
  L(g,cx-ux*r,cy-uy*r,cx+ux*r,cy+uy*r,'thin',{'marker-start':'url(#arr)','marker-end':'url(#arr)'});
  L(g,cx+ux*r,cy+uy*r,cx+ux*R,cy+uy*R,'thin');
  const tx=cx+ux*(tr+2.5+txt.length*1.1),ty=cy+uy*(tr+2.5+txt.length*1.1);let rot=-ang;if(ux<0)rot+=180;
  const gg=E('g',{transform:`rotate(${rot} ${tx} ${ty})`});
  if(ted){const w=txt.length*2.2+1.8;gg.appendChild(E('rect',{x:tx-w/2,y:ty-5.1,width:w,height:4.7,class:'thin'}));}
  T(gg,tx,ty-1.1,txt,{'text-anchor':'middle'});g.appendChild(gg);
}

tasks.splice(1,0,{id:'g2',type:'Ganzes Teil tolerieren',title:'Lagerdeckel mit O-Ring-Nut',
text:'Der Deckel wird mit 4 Schrauben M6 an ein Getriebegehäuse geschraubt. Er liegt mit der Flanschfläche am Gehäuse an. Ein O-Ring in der Nut dichtet das Öl ab (statisch, axial). Der Zentrieransatz ⌀52 f7 zentriert den Deckel in der Lagerbohrung. Seine Stirnfläche drückt den Aussenring des Festlagers axial an. Lege die Bezüge fest. Trage alle nötigen Form- und Lagetoleranzen ein. Nicht jede Fläche braucht eine.',
full:{
 feats:{
  f1:{n:'Flanschfläche (Anlage Gehäuse, Dichtfläche)',mk:[86,123],surf:{fx:30,fy:124.65,pts:[[90,128.15]]},dat:[90,41.85,'left']},
  f2:{n:'Zentrieransatz ⌀52 f7',mk:[80,54.5],surf:{fx:24,fy:46,pts:[[87,49.5],[87,59]]},axis:{fx:24,fy:46,pts:[[70,49.5],[70,59]]},dat:[70,111]},
  f3:{n:'Stirnfläche Zentrieransatz (drückt auf Lager)',mk:[79,86],surf:{fx:24,fy:24,pts:[[76,27.5],[76,73],[84,73]]},dat:[84,97,'left']},
  f4:{n:'4× Durchgangsbohrung ⌀6,6',mk:[147,93],surf:{fx:236,fy:71},axis:{fx:236,fy:71}},
  f5:{n:'Rückseite (aussen)',mk:[107,70],surf:{fx:110,fy:12,pts:[[106,15.5],[106,60],[102,60]]}},
  f6:{n:'Aussendurchmesser ⌀90',mk:[100,36],surf:{fx:110,fy:24,pts:[[98,27.5],[98,40]]}}
 },
 datumFeats:['f1','f2','f3'],
 needDatum:['f1','f2'],
 datumUse:['f1>f2'],
 datumUseMsg:'Bei der Position der Bohrungen fehlt das Bezugssystem: zuerst die Flanschfläche, dann der Zentrieransatz. ',
 datumWhy:'Der Deckel liegt zuerst mit der Flanschfläche am Gehäuse an. Sie ist der Primärbezug A. Dann zentriert ihn der Ansatz ⌀52 f7. Seine Achse ist der Sekundärbezug B. Darum steht bei der Position der Bohrungen A|B, in dieser Reihenfolge. So wird der Deckel auch montiert.',
 reqs:[
  {f:'f1',v:[{sym:['ebenheit'],dat:null,r:[0.01,0.05]}],
   why:'Flanschfläche: Sie ist Primärbezug und Dichtfläche. Darum braucht sie eine Formtoleranz: Ebenheit etwa 0,02 bis 0,03. Im Kursbuch steht beim Flanschdichtungs-Einbauraum ebenfalls eine Ebenheit.'},
  {f:'f2',v:[{sym:['rechtwinkligkeit'],dia:true,dat:'f1',datMsg:'Bezug sollte die Flanschfläche A sein',r:[0.01,0.05]}],
   why:'Zentrieransatz: Seine Achse muss senkrecht zur Flanschfläche stehen. Sonst sitzt der Deckel schief in der Bohrung. Rechtwinkligkeit ⌀0,02 zu A. Das ⌀ steht, weil eine Achse toleriert wird. Der Pfeil steht darum in der Verlängerung der Masslinie.'},
  {f:'f3',v:[{sym:['parallelitaet'],dat:'f1',datMsg:'Bezug sollte die Flanschfläche A sein',r:[0.01,0.05]},{sym:['rundlauf','gesamtlauf'],dat:'f2',datMsg:'Bezug sollte die Achse B sein',r:[0.01,0.05]}],
   why:'Stirnfläche: Sie drückt den Lageraussenring an. Steht sie schief zur Flanschfläche, verkantet der Lagerring. Parallelität 0,02 zu A. Planlauf zur Achse B ist auch möglich.'},
  {f:'f4',v:[{sym:['position'],dia:true,dat:'f1>f2',datMsg:'Bezugssystem sollte A|B sein (zuerst Fläche, dann Achse)',r:[0.1,0.5]}],
   why:'Bohrungen: Es sind Durchgangslöcher mit 0,6 mm Spiel (M6 in ⌀6,6). Darum reicht eine grobe Position: ⌀0,2 bis ⌀0,4 zu A|B. Bei einer Positionstoleranz wird der Lochkreis ⌀76 zum theoretisch exakten Mass (TED, im Rahmen).'},
  {f:'f5',none:true,why:'Die Rückseite berührt kein anderes Teil. Die Allgemeintoleranzen reichen.'},
  {f:'f6',none:true,why:'Der Aussendurchmesser ist frei. Er hat keine Funktion. Die Allgemeintoleranzen reichen.'}
 ],
 solution:{dat:{f1:'A',f2:'B'},rows:[['f1','ebenheit','0,03',''],['f2','rechtwinkligkeit','0,02','A',1],['f3','parallelitaet','0,02','A'],['f4','position','0,3','A|B',1]]},
 onRedraw(pv,rows){
  const ted=rows.some(r=>r.f.value==='f4'&&r.sym.value==='position');
  diaLine(pv,185,85,38,210,'⌀76',ted,47);
 }
},
draw(){
  const {svg,g}=sheet({title:'Lagerdeckel',subtitle:'Stirnradgetriebe, Festlagerseite',material:'S235JR/1.0038',partno:'LW 201 002',ra:'1,6',raOnly:true});
  const cy=85,y=r=>cy-r,yb=r=>cy+r;
  // Schnitt A-A
  const hp=(pts)=>PG(g,pts);
  hp([[102,y(34.7)],[90,y(34.7)],[90,y(30.7)],[91.5,y(30.7)],[91.5,y(28)],[90,y(28)],[90,y(26)],[84,y(26)],[84,yb(26)],[90,yb(26)],[90,yb(28)],[91.5,yb(28)],[91.5,yb(30.7)],[90,yb(30.7)],[90,yb(34.7)],[102,yb(34.7)]]);
  hp([[90,y(41.3)],[102,y(41.3)],[102,y(45)],[90,y(45)]]);
  hp([[90,yb(41.3)],[102,yb(41.3)],[102,yb(45)],[90,yb(45)]]);
  ctr(g,79,cy,107,cy);ctr(g,87,y(38),105,y(38));ctr(g,87,yb(38),105,yb(38));
  viewLabel(g,89,33,'A-A');
  dim(g,102,y(45),102,yb(45),10,'⌀90');
  dim(g,84,y(26),84,yb(26),-14,'⌀52 f7');
  L(g,84,yb(26)+1,84,151.5);L(g,90,yb(45)+1,90,143.5);L(g,102,yb(45)+1,102,151.5);
  dim(g,84,142,90,142,0,'6',{noext:true,arrowsOut:true});dim(g,90,142,102,142,0,'12',{noext:true});dim(g,84,150,102,150,0,'18',{noext:true});
  // Einzelheit Z markieren
  C(g,90.7,yb(29.4),4.6,'thin');T(g,80,yb(29.4)+6,'Z',{'font-size':'5'});
  // Seitenansicht (von links, nach Methode 1 rechts)
  const cx=185;
  C(g,cx,cy,45);C(g,cx,cy,26);C(g,cx,cy,28);C(g,cx,cy,30.7);
  E;const lk=E('circle',{cx,cy,r:38,class:'center'});g.appendChild(lk);
  [[0,-38],[38,0],[0,38],[-38,0]].forEach(([dx,dy])=>{C(g,cx+dx,cy+dy,3.3);ctr(g,cx+dx-5,cy+dy,cx+dx+5,cy+dy);ctr(g,cx+dx,cy+dy-5,cx+dx,cy+dy+5);});
  ctr(g,cx-50,cy,cx+50,cy);
  L(g,cx,cy-53,cx,cy-46,'cut');L(g,cx,cy+46,cx,cy+53,'cut');
  [cy-51,cy+51].forEach(yy=>L(g,cx+9,yy,cx+1,yy,'thin',{'marker-end':'url(#arrS)'}));
  T(g,cx-2,cy-49,'A',{'font-size':'5','text-anchor':'end'});T(g,cx-2,cy+55,'A',{'font-size':'5','text-anchor':'end'});
  diaLine(g,cx,cy,28,60,'⌀56',false,47);
  // 4x 6,6 mit Hinweislinie
  {const hx=cx+38+2.33,hy=cy-2.33;L(g,cx+51,cy-14,hx,hy,'thin',{'marker-end':'url(#arr)'});L(g,cx+51,cy-14,cx+80,cy-14,'thin');T(g,cx+52,cy-15.2,'4× ⌀6,6');}
  // Einzelheit Z 4:1
  const ox=262,oy=38,X=x=>ox+(x-90)*4,Y=r=>oy-(r-29.35)*4;
  const zp=PG(g,[[X(90),Y(26.5)],[X(90),Y(28)],[X(91.5),Y(28)],[X(91.5),Y(30.7)],[X(90),Y(30.7)],[X(90),Y(32.5)],[X(95),Y(32.5)],[X(95),Y(26.5)]]);zp.setAttribute('style','stroke:none');
  P(g,[[X(90),Y(26.5)],[X(90),Y(28)],[X(91.5),Y(28)],[X(91.5),Y(30.7)],[X(90),Y(30.7)],[X(90),Y(32.5)]]);
  PATH(g,`M${X(90)},${Y(32.5)} q4,-1.5 8,0 t8,0 t4,0 M${X(95)},${Y(32.5)} q1.5,4 0,8 t0,8 t0,8 M${X(90)},${Y(26.5)} q4,1.5 8,0 t8,0 t4,0`,'thin');
  viewLabel(g,X(92.5),Y(32.5)-10,'Z (4:1)');
  dim(g,X(90),Y(28),X(90),Y(30.7),-8,'2,7');
  dim(g,X(90),Y(30.7),X(91.5),Y(30.7),-10,'1,5',{arrowsOut:true});
  const pv=E('g');g.appendChild(pv);svg._pv=pv;
  const mk=E('g',{class:'marks'});g.appendChild(mk);svg._mk=mk;
  return svg;
}});
