import type { Metadata } from 'next';
import Link from 'next/link';
import { REGIONS, OPEN_PAGES, PLACES, openRegions, regionPages, regionPath, regionEncodedPath, pagePath, pageEncodedPath, inSitemap } from '../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { IconArrow, JsonLd } from '../../components/Common';
import { BRAND, shareMeta } from '../../lib/site';

const TITLE = `지역별 정화조·변기막힘·누수탐지 안내 | ${BRAND}`;
const DESC = '인천·시흥·부천·서울 강서구·구로구 지역별 정화조수리, 변기막힘, 누수탐지 업체 안내. 시·구, 생활권, 동·읍면별 페이지를 모았습니다.';
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/area/' },
  ...shareMeta('area', '지역별 정화조·변기막힘·누수탐지 안내', { title: TITLE, description: DESC, url: '/area/' }),
};

// 열린 모든 키워드 페이지로 가는 크롤 경로 (권역별)
export default function AreaIndex() {
  const regions = openRegions();
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역', path: '/area/' }]),
        itemListJsonLd([
          ...regions.map((r) => ({ name: `${r} 지역 안내`, path: regionEncodedPath(r), image: `/og/${encodeURIComponent(`area-${r}`)}.jpg` })),
          ...OPEN_PAGES.filter(inSitemap).map((p) => ({ name: p.kw, path: pageEncodedPath(p) })),
        ]),
      ]} />
      <div className="wrap content page-top">
        <p className="eyebrow dark">지역</p>
        <h1 className="page-title">지역별 정화조·변기막힘·누수탐지 안내</h1>
        <p className="prose-p">{BRAND}이 다니는 지역의 안내 페이지입니다. 지금 {OPEN_PAGES.length.toLocaleString()}개가 열려 있습니다.</p>
        <section className="sec">
          <h2 className="area-h">권역</h2>
          <div className="cities">
            {regions.map((r) => (
              <Link key={r} href={regionPath(r)} className="city-row">
                <div><b>{r}</b><span>{REGIONS[r].full}</span></div>
                <em>{regionPages(r).length}</em>
              </Link>
            ))}
          </div>
        </section>
        {regions.map((r) => (
          <section key={r} className="sec">
            <h2 className="area-h"><Link href={regionPath(r)}>{r} <IconArrow /></Link></h2>
            {Array.from(new Set(regionPages(r).map((p) => p.place))).map((key) => (
              <div key={key} className="area-block">
                <h3>{PLACES[key].name}</h3>
                <ul className="area-list">
                  {regionPages(r).filter((p) => p.place === key).map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}</Link></li>)}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
