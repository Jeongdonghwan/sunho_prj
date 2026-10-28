"""기존 홈페이지 사진 원본(source/raw) → public/img (긴 변 1200, jpg+webp)
   python -I scripts/prepare_images.py
   - 시공사례 게시판 첨부(cases) → case-NN, 홈페이지 서비스 사진(site) → site-*
   - 로고·인증서는 그대로 크기만 줄인다. 거래처 로고(clients/)·출동 차량 사진(다른 번호가 보임)은 쓰지 않는다.
"""
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / 'source' / 'raw'
OUT = ROOT / 'public' / 'img'
OUT.mkdir(parents=True, exist_ok=True)
d = json.loads((ROOT / 'data' / 'cases.json').read_text(encoding='utf-8'))


def save(src, name, size=1200, jpg=True):
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    im.thumbnail((size, size), Image.LANCZOS)
    if jpg:
        im.save(OUT / f'{name}.jpg', 'JPEG', quality=80, optimize=True, progressive=True)
    im.save(OUT / f'{name}.webp', 'WEBP', quality=78)
    return im.size


for c in d['cases']:
    print(c['img'], save(RAW / f"{c['src']}.jpg", c['img']))
for c in d['site']:
    print(c['img'], save(RAW / f"{c['src']}.webp", c['img']))
print('cert', save(RAW / 't_cert.png', 'cert', 900, jpg=False))
print('gov-cert', save(RAW / 't_gov_cert.webp', 'gov-cert', 900, jpg=False))
for n in ('logo_c-1', 'logo_w'):
    Image.open(RAW / f't_{n}.png').save(OUT / f"{n.replace('_c-1', '').replace('_', '-')}.png", optimize=True)
print('logo done')
