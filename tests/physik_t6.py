import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path=''+__import__('os').environ.get('CHROME','/usr/bin/google-chrome')+'')
        pg=await b.new_page(viewport={'width':390,'height':800},device_scale_factor=2)
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(''+(__import__('pathlib').Path(__file__).resolve().parents[1]/'physik'/'index.html').as_uri()+'');await pg.wait_for_timeout(500)
        await pg.evaluate("for(const q of document.querySelectorAll('section'))q.style.display=''")
        # Modus 4 Antworten: richtige Option je Feld anklicken
        await pg.evaluate("setMode('wahl')")
        r=await pg.evaluate('''()=>{let ok=0,n=0,bad=[],few=[];for(const id in window.__cur){const c=document.getElementById('task-'+id);const labs=c.querySelectorAll('.row.wahl label');n++;
           labs.forEach((lb,k)=>{const v=window.__cur[id][k];const bs=[...lb.querySelectorAll('.choice')];if(bs.length<4)few.push(id+':'+bs.length);
             const target=bs.find(b=>{b.click();const iv=parseFloat(lb.querySelector('input').value.replace(',','.'));return Math.abs(iv-v)<1e-9;});if(target)target.click();});
           c.querySelector('.btn.p').click();if(c.querySelector('.fb').classList.contains('ok'))ok++;else bad.push(id);}return [ok,n,bad.join(' '),few.join(' ')];}''')
        print('wahl ok/n:',r)
        # falsche Option -> Diagnose
        d=await pg.evaluate('''()=>{const c=document.getElementById('task-d1');const lb=c.querySelector('.row.wahl label');const v=window.__cur.d1[0];const w=[...lb.querySelectorAll('.choice')].find(b=>{b.click();return Math.abs(parseFloat(lb.querySelector('input').value.replace(',','.'))-v)>1e-9;});w.click();c.querySelector('.btn.p').click();return c.querySelector('.fb').innerText.replace(/\\n/g,' | ');}''')
        print('falsch:',d)
        await (await pg.query_selector('#task-w3')).screenshot(path='m_wahl.png')
        # Modus Ansatz
        await pg.evaluate("setMode('bau')")
        r=await pg.evaluate('''()=>{let n=0,opt=[],ok=0;document.querySelectorAll('[id^=task-]').forEach(c=>{n++;const bs=c.querySelectorAll('.bau .choice');opt.push(bs.length);});
           const c=document.getElementById('task-l2');const bs=[...c.querySelectorAll('.bau .choice')];return [n,Math.min(...opt),Math.max(...opt),bs.map(b=>b.innerText).join(' || ')];}''')
        print('bau:',r)
        await pg.evaluate('''()=>{const c=document.getElementById('task-l2');const bs=[...c.querySelectorAll('.bau .choice')];bs.forEach(b=>{if(!b.disabled)b.click();});}''')
        await (await pg.query_selector('#task-l2')).screenshot(path='m_bau.png')
        await pg.evaluate("setMode('tippen')")
        print('tippen inputs:',await pg.evaluate("document.querySelectorAll('#task-d1 input[type=text]:not([style*=none])').length"))
        await pg.evaluate("document.querySelector('[data-k=exam]').click()");await pg.evaluate("setMode('bau')");await pg.click('text=Neue Prüfung starten');await pg.wait_for_timeout(300)
        print('exam wahl-felder:',await pg.evaluate("document.querySelectorAll('[id^=exam-] .choice').length"))
        print('errors:',errs);await b.close()
asyncio.run(main())
