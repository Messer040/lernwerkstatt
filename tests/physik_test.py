import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path=''+__import__('os').environ.get('CHROME','/usr/bin/google-chrome')+'')
        pg=await b.new_page(viewport={'width':900,'height':900})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(''+(__import__('pathlib').Path(__file__).resolve().parents[1]/'physik'/'index.html').as_uri()+'');await pg.wait_for_timeout(600);await pg.evaluate("for(const q of document.querySelectorAll('section'))q.style.display=''")
        res=await pg.evaluate('''()=>{const out=[];for(const id in window.__cur){const c=document.getElementById('task-'+id);const ins=c.querySelectorAll('input[type=text]');window.__cur[id].forEach((v,i)=>ins[i].value=String(Math.round(v*100)/100).replace('.',','));c.querySelector('.btn.p').click();out.push(id+':'+c.querySelector('.fb').className+':'+window.__cur[id].map(v=>v.toFixed(1)).join('/'));}return out;}''')
        print(res)
        await pg.evaluate("document.querySelectorAll('.card .btn:nth-child(3)').forEach(b=>b.click())")
        el=(await pg.query_selector_all('section'))[-1];await el.screenshot(path='full.png')
        print('errors:',errs)
        await b.close()
asyncio.run(main())
