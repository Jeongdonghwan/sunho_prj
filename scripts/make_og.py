"""페이지별 og 이미지(1200x630 JPEG) → public/og/<key>.jpg  (home, area, cases, area-<시구>, <키워드 슬러그>)
   python -I scripts/make_og.py           # 없는 것만 생성
   python -I scripts/make_og.py --force   # 전부 다시
배경 = 실제 시공 사진(public/img/case-*.jpg, site-*.jpg — 기존 홈페이지 사진) 어둡게, 글자 = 굵은 한글 키워드.
네이버는 og 이미지를 가운데 정사각형으로 잘라 보여 주므로 글자는 가운데 630px 안쪽에 둔다.
"""
import json, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'og'
W, H = 1200, 630
SAFE_L, SAFE_W = 300, 600  # 가운데 정사각형(285~915) 안쪽
BRAND, PHONE = '선호환경', '1666-8086'  # lib/site.ts 와 맞출 것
NAVY, ACCENT = (16, 42, 42), (242, 183, 5)
BOLD, REG = r'C:\Windows\Fonts\malgunbd.ttf', r'C:\Windows\Fonts\malgun.ttf'


def fnv(s):  # lib/data.ts hash 와 같은 FNV-1a
    h = 2166136261
    for ch in s:
        h = ((h ^ ord(ch)) * 16777619) & 0xFFFFFFFF
    return h


def base(path):
    im = Image.open(path).convert('RGB')
    s = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    l, t = (im.width - W) // 2, (im.height - H) // 2
    im = ImageEnhance.Brightness(im.crop((l, t, l + W, t + H))).enhance(0.38)
    return Image.blend(im, Image.new('RGB', (W, H), NAVY), 0.35)


def wrap(d, text, font, maxw):
    lines, cur = [], ''
    for w in text.split():
        t = (cur + ' ' + w).strip()
        if d.textlength(t, font=font) <= maxw:
            cur = t
        else:
            lines.append(cur); cur = w
    return lines + [cur] if cur else lines


def render(bases, key, title, sub):
    im = bases[fnv(key) % len(bases)].copy()
    d = ImageDraw.Draw(im)
    size = 76
    while True:
        f = ImageFont.truetype(BOLD, size)
        lines = wrap(d, title, f, SAFE_W)
        if (len(lines) <= 3 and all(d.textlength(x, font=f) <= SAFE_W for x in lines)) or size <= 40:
            break
        size -= 4
    y = 300 - len(lines) * size * 0.62
    d.rectangle((SAFE_L, y - 34, SAFE_L + 70, y - 26), fill=ACCENT)
    for ln in lines:
        d.text((SAFE_L, y), ln, font=f, fill='white'); y += size * 1.2
    d.text((SAFE_L, y + 14), sub, font=ImageFont.truetype(REG, 28), fill=(214, 226, 236))
    d.text((SAFE_L, 540), f'{BRAND}  ·  {PHONE}', font=ImageFont.truetype(BOLD, 28), fill=ACCENT)
    im.save(OUT / f'{key}.jpg', 'JPEG', quality=80, optimize=True, progressive=True)


def main():
    force = '--force' in sys.argv
    OUT.mkdir(parents=True, exist_ok=True)
    pages = json.loads((ROOT / 'data' / 'site-pages.json').read_text(encoding='utf-8'))['pages']
    cities = ['인천', '시흥', '부천', '강서구', '구로구']
    sub = {'누수탐지': '열화상·청음·가스 탐지 · 누수보험 서류', '변기막힘': '막힘·역류 · 공용 오수관까지', '정화조수리': '수리·교체·방수 · A/S 2년', '정화조': '수리·교체·방수 · A/S 2년'}
    jobs = [('home', '정화조·변기·누수탐지 선호환경', '365일 24시간 접수 · 수도권 전지역'),
            ('area', '지역별 정화조·변기막힘·누수탐지', '인천 · 시흥 · 부천 · 강서구 · 구로구'),
            ('cases', '정화조·변기·누수 시공사례', '시공사례 게시판 글 4건')] + \
           [(f'area-{c}', f'{c} 정화조·변기막힘·누수탐지 안내', '동네별 정화조수리 · 변기막힘 · 누수탐지') for c in cities] + \
           [(p['slug'], p['kw'], sub[p['service']]) for p in pages]
    jobs = [j for j in jobs if force or not (OUT / f'{j[0]}.jpg').exists()]
    # 배경 사진은 서비스 묶음(cases.json 태그)이 맞는 것만 — 누수 페이지에 변기 사진이 깔리지 않게
    cj = json.loads((ROOT / 'data' / 'cases.json').read_text(encoding='utf-8'))
    tags = {c['img']: c['tags'] for c in cj['cases'] + cj['site']}
    imgs = {p.stem: base(p) for p in sorted((ROOT / 'public' / 'img').glob('*.jpg')) if p.stem in tags} if jobs else {}
    group = {'누수탐지': '누수탐지', '변기막힘': '변기', '정화조수리': '정화조', '정화조': '정화조'}
    svc_of = {p['slug']: group[p['service']] for p in pages}
    pool = lambda key: [im for k, im in imgs.items() if svc_of.get(key, '') in tags[k]] or list(imgs.values())
    for i, (key, title, sub) in enumerate(jobs, 1):
        render(pool(key), key, title, sub)
        if i % 200 == 0:
            print(i, '/', len(jobs))
    print('생성', len(jobs), '/ 전체', len(pages) + 3 + len(cities))


if __name__ == '__main__':
    assert fnv('a') == 0xE40C292C  # FNV-1a 기준값
    main()
