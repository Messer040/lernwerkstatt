import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path=''+__import__('os').environ.get('CHROME','/usr/bin/google-chrome')+'')
        pg=await b.new_page(viewport={'width':900,'height':900},device_scale_factor=2)
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(''+(__import__('pathlib').Path(__file__).resolve().parents[1]/'zeichnung'/'index.html').as_uri()+'');await pg.wait_for_timeout(1200)
        res=await pg.evaluate('''()=>{const out=[];tasks.forEach((t,i)=>{if(t.ktest||!['7','9','10','11','12','ME'].includes(t.kap))return;const c=document.getElementById('card-'+t.id);
          if(t.questions){const qs=c.querySelectorAll('.q');t.questions.forEach((q,qi)=>{const b=qs[qi];if(q.num){b.querySelector('input').value=String(q.a).replace('.',',');}else if(q.multi){q.a.forEach(k=>b.querySelectorAll('input')[k].checked=true);}else b.querySelectorAll('input')[q.a].checked=true;});c.querySelector('.actions .btn').click();}
          else if(t.entry){c.querySelector('.actions button:nth-child(2)').click();c.querySelector('.actions .btn').click();}
          out.push(t.id+':'+c.querySelector('.fb').className);});return out;}''')
        print(res)
        await pg.add_style_tag(content='header{position:static}')
        for tid in ['me1','me3','me7']:
            await pg.evaluate(f"go(tasks.findIndex(t=>t.id==='{tid}'))")
            el=await pg.query_selector(f'#card-{tid} .draw');await el.screenshot(path=f'/tmp/{tid}.png')
        print('errors:',errs)
        await b.close()
asyncio.run(main())
