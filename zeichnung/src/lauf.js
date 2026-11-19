/* ============ Erklärung: Rundlauf und Gesamtrundlauf ============ */
(function(){
  const card=H('div',{class:'card',id:'card-lauf'});
  card.innerHTML=`<span class="tag">Erklärung</span><h2>Rundlauf und Gesamtrundlauf</h2>
  <p class="task-text">Beide Toleranzen sind Lauftoleranzen. Man dreht das Teil um die Bezugsachse A. Eine Messuhr tastet die Fläche ab. Der Unterschied: Beim Rundlauf steht die Messuhr still. Beim Gesamtrundlauf fährt sie zusätzlich der Länge nach über die ganze Fläche.</p>
  <h3>1. Rundlauf <span id="lf-f1"></span></h3>
  <p>Die Messuhr steht an einer Stelle. Das Teil dreht einmal um die Bezugsachse A. Die Rundlaufabweichung ist der grösste Zeigerwert minus der kleinste Zeigerwert. Sie muss kleiner oder gleich dem Toleranzwert t sein.</p>
  <div class="zone" id="lf-z1"></div>
  <div class="row">
    <label>Exzentrizität e in mm: <b id="lf-ev">0,015</b><input type="range" id="lf-e" min="0" max="0.05" step="0.005" value="0.015" class="slider"></label>
    <label>Unrundheit u in mm: <b id="lf-ov">0,000</b><input type="range" id="lf-o" min="0" max="0.03" step="0.005" value="0" class="slider"></label>
    <button class="btn sec" id="lf-play">Drehung anhalten</button>
  </div>
  <div class="fb" id="lf-r1" style="display:block"></div>
  <ul>
    <li><b>Toleranzzone:</b> In jeder Messebene zwei konzentrische Kreise. Ihr Abstand ist t. Ihr Mittelpunkt liegt auf der Bezugsachse A.</li>
    <li><b>Was der Rundlauf erfasst:</b> Exzentrizität (Koaxialität) und Unrundheit zusammen.</li>
    <li><b>Merke:</b> Ist das Teil nur exzentrisch, dann gilt: Rundlaufabweichung = 2 · e. Dabei ist e der Versatz der Ist-Achse zur Bezugsachse in mm.</li>
    <li><b>Wichtig:</b> Jede Messebene gilt für sich allein. Der Rundlauf vergleicht die Messebenen nicht miteinander.</li>
  </ul>
  <h3>2. Gesamtrundlauf <span id="lf-f2"></span></h3>
  <p>Das Teil dreht um die Bezugsachse A. Gleichzeitig fährt die Messuhr parallel zur Achse über die ganze Länge. Die Gesamtrundlaufabweichung ist der grösste Zeigerwert minus der kleinste Zeigerwert über die ganze Fläche.</p>
  <div class="zone" id="lf-z2"></div>
  <div class="row">
    <label>Exzentrizität e in mm: <b id="lf-e2v">0,010</b><input type="range" id="lf-e2" min="0" max="0.04" step="0.005" value="0.01" class="slider"></label>
    <label>Konizität k in mm: <b id="lf-kv">0,040</b><input type="range" id="lf-k" min="0" max="0.08" step="0.005" value="0.04" class="slider"></label>
    <label>Position der Messuhr<input type="range" id="lf-z" min="0" max="1" step="0.01" value="0.3" class="slider"></label>
  </div>
  <div class="actions"><button class="btn sec" id="lf-p1">Beispiel: nur exzentrisch</button><button class="btn sec" id="lf-p2">Beispiel: nur konisch</button><button class="btn sec" id="lf-p3">Beispiel: beides</button></div>
  <div class="fb" id="lf-r2" style="display:block"></div>
  <ul>
    <li><b>Toleranzzone:</b> Zwei koaxiale Zylinder. Ihr radialer Abstand ist t. Ihre Achse ist die Bezugsachse A.</li>
    <li><b>Was der Gesamtrundlauf erfasst:</b> Exzentrizität, Unrundheit und zusätzlich Konizität, Durchbiegung und Balligkeit. Also Zylindrizität und Koaxialität zusammen.</li>
    <li><b>Merke:</b> Im Modell gilt: Gesamtrundlaufabweichung = 2 · e + k. Dabei ist k der Unterschied der Radien zwischen linkem und rechtem Ende in mm.</li>
    <li><b>Der entscheidende Fall:</b> Ein konisches Teil ohne Exzentrizität hat die Rundlaufabweichung 0. Trotzdem kann der Gesamtrundlauf überschritten sein. Probiere das Beispiel «nur konisch».</li>
  </ul>
  <h3>3. Vergleich</h3>
  <table style="border-collapse:collapse;width:100%;font-size:15px">
   <tr><th style="text-align:left;border-bottom:1px solid #d4d8dd;padding:6px"></th><th style="text-align:left;border-bottom:1px solid #d4d8dd;padding:6px">Rundlauf</th><th style="text-align:left;border-bottom:1px solid #d4d8dd;padding:6px">Gesamtrundlauf</th></tr>
   <tr><td style="padding:6px">Messuhr</td><td style="padding:6px">steht still</td><td style="padding:6px">fährt axial über die Fläche</td></tr>
   <tr><td style="padding:6px">Geprüft wird</td><td style="padding:6px">jede Messebene einzeln</td><td style="padding:6px">die ganze Fläche auf einmal</td></tr>
   <tr><td style="padding:6px">Toleranzzone</td><td style="padding:6px">zwei konzentrische Kreise</td><td style="padding:6px">zwei koaxiale Zylinder</td></tr>
   <tr><td style="padding:6px">Erfasst Konizität</td><td style="padding:6px">nein</td><td style="padding:6px">ja</td></tr>
   <tr><td style="padding:6px">Strenge</td><td style="padding:6px">weniger streng</td><td style="padding:6px">strenger und teurer zu prüfen</td></tr>
  </table>
  <p class="hint">Die Abweichungen sind stark vergrössert gezeichnet. Die Rechnung ist ein vereinfachtes Modell zum Verstehen. Für Planflächen gibt es dasselbe Paar: Planlauf und Gesamtplanlauf. Dort tastet die Messuhr axial.</p>`;
  host.appendChild(card);
  const q=id=>card.querySelector('#'+id);
  // kleine Toleranzrahmen neben den Titeln
  [['lf-f1','rundlauf'],['lf-f2','gesamtlauf']].forEach(([id,sym])=>{const s=E('svg',{viewBox:'0 0 31 9',style:'height:24px;vertical-align:middle;margin-left:8px'});frame(s,.5,1,sym,'0,05',['A']);q(id).appendChild(s);});
  const U=(g,x,y,t,o={})=>T(g,x,y,t,{'font-family':'Barlow','font-size':'3.2',...o});
  const f3=n=>n.toFixed(3).replace('.',',');
  const TOL=0.05,SC=200;
  let phi=0,run=true;

  /* --- Panel 1 --- */
  const s1=E('svg',{viewBox:'0 0 200 104'});q('lf-z1').appendChild(s1);
  const g1=E('g');s1.appendChild(g1);
  const A={x:52,y:64},R=26;
  const zoneIn=E('circle',{cx:A.x,cy:A.y,r:R,fill:'none','stroke-width':'.4','stroke-dasharray':'2 1'}),zoneOut=E('circle',{cx:A.x,cy:A.y,r:R,fill:'none','stroke-width':'.4','stroke-dasharray':'2 1'});
  const part=E('path',{fill:'#dfe6ee',stroke:'#000','stroke-width':'.6'});
  const mark=E('line',{stroke:'#000','stroke-width':'.5'});
  g1.append(part,zoneIn,zoneOut,mark);
  ctr(g1,A.x-34,A.y,A.x+34,A.y);ctr(g1,A.x,A.y-30,A.x,A.y+34);
  U(g1,A.x+2,A.y+5,'A');
  const stem=E('line',{stroke:'#000','stroke-width':'.8'});const tip=E('circle',{r:1,fill:'#000'});
  g1.append(stem,tip);
  g1.appendChild(E('rect',{x:A.x-2,y:17,width:4,height:6,fill:'#fff',stroke:'#000','stroke-width':'.4'}));
  g1.appendChild(E('circle',{cx:A.x,cy:10,r:8,fill:'#fff',stroke:'#000','stroke-width':'.5'}));
  for(let i=-4;i<=4;i++){const a=(-90+i*30)*Math.PI/180;L(g1,A.x+6.6*Math.cos(a),10+6.6*Math.sin(a),A.x+7.8*Math.cos(a),10+7.8*Math.sin(a),'thin');}
  const needle=E('line',{x1:A.x,y1:10,stroke:'#b3261e','stroke-width':'.6'});g1.appendChild(needle);
  U(g1,A.x+11,9,'Messuhr steht still');U(g1,A.x+11,13.5,'Teil dreht um A');
  PATH(g1,`M${A.x-22},${A.y+27} A35,35 0 0 0 ${A.x+22},${A.y+27}`,'thin',{'marker-end':'url(#arr)'});
  // Diagramm
  const px=112,pw=78,py=58,ph=40;
  L(g1,px,py-ph/2-4,px,py+ph/2+4,'thin');L(g1,px,py,px+pw,py,'thin',{'stroke-dasharray':'1 1'});
  U(g1,px,py-ph/2-7,'Zeigerwert');U(g1,px+pw-22,py+ph/2+9,'Drehwinkel 0° … 360°');
  const band=E('rect',{x:px,width:pw,'fill-opacity':'.15'});const curve=E('path',{fill:'none',stroke:'#0b5fa5','stroke-width':'.7'});const dot=E('circle',{r:1.3,fill:'#b3261e'});
  const lmax=E('line',{stroke:'#000','stroke-width':'.25','stroke-dasharray':'1.5 1'}),lmin=E('line',{stroke:'#000','stroke-width':'.25','stroke-dasharray':'1.5 1'});
  g1.append(band,curve,lmax,lmin,dot);
  const tmax=U(g1,px+pw+1,0,'max'),tmin=U(g1,px+pw+1,0,'min');
  const rho=(a,e,o)=>e*Math.cos(a)+o*Math.cos(2*a);
  function draw1(){
    const e=+q('lf-e').value,o=+q('lf-o').value;
    q('lf-ev').textContent=f3(e);q('lf-ov').textContent=f3(o);
    let d='',mn=1e9,mx=-1e9,c='';
    for(let i=0;i<=180;i++){const th=i/180*2*Math.PI;const v=rho(th,e,o);mn=Math.min(mn,v);mx=Math.max(mx,v);
      const r=R+v*SC,a=th+phi;d+=(i?'L':'M')+(A.x+r*Math.cos(a)).toFixed(2)+','+(A.y-r*Math.sin(a)).toFixed(2);
      c+=(i?'L':'M')+(px+pw*i/180).toFixed(2)+','+(py-v*SC*1.6).toFixed(2);}
    part.setAttribute('d',d+'Z');curve.setAttribute('d',c);
    const r0=R+rho(0,e,o)*SC;mark.setAttribute('x1',A.x+(r0-5)*Math.cos(phi));mark.setAttribute('y1',A.y-(r0-5)*Math.sin(phi));mark.setAttribute('x2',A.x+r0*Math.cos(phi));mark.setAttribute('y2',A.y-r0*Math.sin(phi));
    const al=Math.PI/2-phi,v=rho(al,e,o),ys=A.y-(R+v*SC);
    stem.setAttribute('x1',A.x);stem.setAttribute('x2',A.x);stem.setAttribute('y1',23);stem.setAttribute('y2',ys-1);tip.setAttribute('cx',A.x);tip.setAttribute('cy',ys-1);
    const na=(-90+v/0.06*120)*Math.PI/180;needle.setAttribute('x2',A.x+6.5*Math.cos(na));needle.setAttribute('y2',10+6.5*Math.sin(na));
    const dev=mx-mn,ok=dev<=TOL+1e-9,col=ok?'#1f7a3a':'#b3261e';
    zoneIn.setAttribute('r',R+mn*SC);zoneOut.setAttribute('r',R+mn*SC+TOL*SC);zoneIn.setAttribute('stroke',col);zoneOut.setAttribute('stroke',col);
    band.setAttribute('y',py-(mn+TOL)*SC*1.6);band.setAttribute('height',TOL*SC*1.6);band.setAttribute('fill',col);
    [[lmax,mx,tmax],[lmin,mn,tmin]].forEach(([l,val,t])=>{const y=py-val*SC*1.6;l.setAttribute('x1',px);l.setAttribute('x2',px+pw);l.setAttribute('y1',y);l.setAttribute('y2',y);t.setAttribute('y',y+1);});
    let ang=((al%(2*Math.PI))+2*Math.PI)%(2*Math.PI);dot.setAttribute('cx',px+pw*ang/(2*Math.PI));dot.setAttribute('cy',py-v*SC*1.6);
    const fb=q('lf-r1');fb.className='fb '+(ok?'ok':'bad');
    fb.innerHTML=`<b>Rundlaufabweichung = max − min = ${f3(dev)} mm.</b> Toleranz t = 0,05 mm. ${ok?'Das Teil ist in Ordnung.':'Das Teil ist nicht in Ordnung.'} Das farbige Band zeigt die Toleranzzone mit der Breite t.`;
  }

  /* --- Panel 2 --- */
  const s2=E('svg',{viewBox:'0 0 200 112'});q('lf-z2').appendChild(s2);
  const g2=E('g');s2.appendChild(g2);
  const X0=36,X1=150,AY=52,RR=15;
  const body=E('path',{fill:'#dfe6ee',stroke:'#000','stroke-width':'.6'});g2.appendChild(body);
  // Spitzen
  PG(g2,[[X0-14,AY-4],[X0-4,AY],[X0-14,AY+4]],'thin');PG(g2,[[X1+14,AY-4],[X1+4,AY],[X1+14,AY+4]],'thin');
  ctr(g2,X0-18,AY,X1+18,AY);U(g2,X1+16,AY-2,'A');
  const zt=E('line',{stroke:'#1f7a3a','stroke-width':'.4','stroke-dasharray':'2 1'}),zb=E('line',{stroke:'#1f7a3a','stroke-width':'.4','stroke-dasharray':'2 1'});g2.append(zt,zb);
  const gg=E('g');g2.appendChild(gg);
  gg.appendChild(E('circle',{cx:0,cy:10,r:7,fill:'#fff',stroke:'#000','stroke-width':'.5'}));
  gg.appendChild(E('rect',{x:-1.6,y:16.5,width:3.2,height:4,fill:'#fff',stroke:'#000','stroke-width':'.4'}));
  const st2=E('line',{x1:0,x2:0,y1:20.5,stroke:'#000','stroke-width':'.8'});const nd2=E('line',{x1:0,y1:10,stroke:'#b3261e','stroke-width':'.6'});gg.append(st2,nd2);
  L(g2,X0,6,X1,6,'thin',{'marker-start':'url(#arr)','marker-end':'url(#arr)'});U(g2,X0+30,4.5,'Messuhr fährt über die ganze Länge');
  // Diagramm
  const QY=96;
  U(g2,4,QY-12,'Zeigerwert');U(g2,X1+4,QY+1,'Länge');
  const bandT=E('rect',{x:X0,width:X1-X0,'fill-opacity':'.15'});const area=E('path',{fill:'#0b5fa5','fill-opacity':'.35',stroke:'#0b5fa5','stroke-width':'.4'});
  const loc=E('line',{stroke:'#b3261e','stroke-width':'1.4'});g2.append(bandT,area,loc);
  L(g2,X0,QY-22,X0,QY+8,'thin');
  U(g2,X0+2,QY+12,'Blaue Fläche: Zeigerbereich an jeder Stelle. Roter Strich: Rundlauf an der Messuhr.',{'font-size':'2.8',fill:'#5f6670'});
  function draw2(){
    const e=+q('lf-e2').value,k=+q('lf-k').value,z=+q('lf-z').value;
    q('lf-e2v').textContent=f3(e);q('lf-kv').textContent=f3(k);
    const off=e*Math.cos(phi)*SC,kk=k*SC;
    body.setAttribute('d',`M${X0},${AY-RR-off} L${X1},${AY-RR-kk-off} L${X1},${AY+RR+kk-off} L${X0},${AY+RR-off} Z`);
    const tot=2*e+k,loc1=2*e,ok=tot<=TOL+1e-9,col=ok?'#1f7a3a':'#b3261e';
    const top=AY-RR+e*SC;[[zt,top],[zb,top-TOL*SC]].forEach(([l,y])=>{l.setAttribute('x1',X0-4);l.setAttribute('x2',X1+4);l.setAttribute('y1',y);l.setAttribute('y2',y);l.setAttribute('stroke',col);});
    const gx=X0+z*(X1-X0),v=e*Math.cos(phi)+k*z,ys=AY-RR-v*SC;
    gg.setAttribute('transform',`translate(${gx},0)`);st2.setAttribute('y2',ys-0.5);
    const na=(-90+(v-0.03)/0.08*120)*Math.PI/180;nd2.setAttribute('x2',5.6*Math.cos(na));nd2.setAttribute('y2',10+5.6*Math.sin(na));
    const s=140,base=QY+4;const y=(val)=>base-(val+e)*s;
    area.setAttribute('d',`M${X0},${y(-e)} L${X1},${y(k-e)} L${X1},${y(k+e)} L${X0},${y(e)} Z`);
    bandT.setAttribute('y',y(-e+TOL));bandT.setAttribute('height',TOL*s);bandT.setAttribute('fill',col);
    loc.setAttribute('x1',gx);loc.setAttribute('x2',gx);loc.setAttribute('y1',y(k*z-e)+0.4);loc.setAttribute('y2',y(k*z+e)-0.4);
    const fb=q('lf-r2');fb.className='fb '+(ok?'ok':'bad');
    fb.innerHTML=`<b>Rundlaufabweichung an der Messuhr = 2 · e = ${f3(loc1)} mm.</b> ${loc1<=TOL+1e-9?'Rundlauf 0,05: in Ordnung.':'Rundlauf 0,05: nicht in Ordnung.'}<br><b>Gesamtrundlaufabweichung = 2 · e + k = ${f3(tot)} mm.</b> ${ok?'Gesamtrundlauf 0,05: in Ordnung.':'Gesamtrundlauf 0,05: nicht in Ordnung.'}`;
  }
  const set=(e,k)=>{q('lf-e2').value=e;q('lf-k').value=k;draw2();};
  q('lf-p1').onclick=()=>set(0.02,0);q('lf-p2').onclick=()=>set(0,0.07);q('lf-p3').onclick=()=>set(0.015,0.04);
  ['lf-e','lf-o'].forEach(i=>q(i).oninput=draw1);['lf-e2','lf-k','lf-z'].forEach(i=>q(i).oninput=draw2);
  q('lf-play').onclick=()=>{run=!run;q('lf-play').textContent=run?'Drehung anhalten':'Drehung starten';};
  let last=0;function tick(t){if(run&&card.classList.contains('show')){phi+=(t-last)/1000*1.2;draw1();draw2();}last=t;requestAnimationFrame(tick);}
  draw1();draw2();requestAnimationFrame(tick);
  window.showLauf=()=>{cur=-1;document.querySelectorAll('.card').forEach(c=>{if(c.id.startsWith('card-'))c.classList.remove('show');});card.classList.add('show');renderNav();window.scrollTo({top:0,behavior:'smooth'});};
})();
