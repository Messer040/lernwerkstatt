"""Baut zeichnung/index.html aus src/index.html, full.js und der Schrift osifont (base64)."""
from pathlib import Path
d=Path(__file__).parent
s=(d/'index.html').read_text(encoding='utf8')
s=s.replace('/*@@FULL@@*/',(d/'full.js').read_text(encoding='utf8'))
s=s.replace('@@FONT@@',(d/'osifont.b64').read_text().strip())
(d.parent/'index.html').write_text(s,encoding='utf8')
print('zeichnung/index.html',len(s))
