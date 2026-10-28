import type { Metadata } from 'next';
import Link from 'next/link';
import { CASES, POSTS, OPEN_PAGES, inSitemap, pagePath, pageEncodedPath } from '../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { Actions, IconArrow, JsonLd } from '../../components/Common';
import { BRAND, SITE_URL, HOMEPAGE, shareMeta } from '../../lib/site';

const TITLE = `시공사례 | ${BRAND} 정화조·변기·누수 현장 기록`;
const DESC = `${BRAND} 시공사례 게시판 글 4건 — 부천 단독주택 PE정화조 방수, 상가건물 누수, 빌라 변기 역류, 정화조 막힘·역류 현장의 작업 과정과 사진.`;
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/cases/' },
  ...shareMeta('cases', `${BRAND} 시공사례`, { title: TITLE, description: DESC, url: '/cases/' }),
};

const fmt = (d: string) => d.replace(/-/g, '.');
const svcOf: Record<string, string> = { 정화조: '정화조수리', 누수탐지: '누수탐지', 변기: '변기막힘' };
// 게시글 서비스로 이어지는 열린 대표 페이지 (부천 글은 부천 페이지로)
const linkFor = (service: string, place: string) =>
  OPEN_PAGES.find((p) => inSitemap(p) && p.service === svcOf[service] && place.includes('부천') && p.place === '부천') ||
  OPEN_PAGES.find((p) => inSitemap(p) && p.service === svcOf[service] && p.place === '인천');

export default function Cases() {
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '시공사례', path: '/cases/' }]),
        {
          '@context': 'https://schema.org', '@type': 'ItemList',
          itemListElement: CASES.map((k, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'ImageObject', contentUrl: `${SITE_URL}/img/${k.img}.jpg`, name: k.space, description: k.scene } })),
        },
        itemListJsonLd(OPEN_PAGES.filter((p) => inSitemap(p) && p.unit === '시구').slice(0, 15).map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))),
      ]} />
      <div className="wrap content page-top">
        <p className="eyebrow dark">시공사례 게시판</p>
        <h1 className="page-title">시공사례</h1>
        <p className="prose-p">기존 홈페이지(<a href={HOMEPAGE} target="_blank" rel="noopener">sunhoenv.com</a>) 시공사례 게시판의 글 4건과 첨부 사진입니다. 작업 내용은 게시글 본문에 적힌 것만 옮겼습니다.</p>
        {POSTS.map((post) => {
          const lk = linkFor(post.service, post.place);
          const photos = CASES.filter((c) => c.uid === post.uid);
          return (
            <section key={post.uid} className="sec case-post" data-reveal>
              <p className="meta">{post.service} · 글 제목 날짜 {fmt(post.date)} · 게시 {fmt(post.posted)}</p>
              <h2 className="area-h">{post.title}</h2>
              <p className="prose-p"><b>{post.place}</b> — {post.summary.join('. ')}.</p>
              <div className="shots">
                {photos.map((k) => (
                  <figure key={k.img}>
                    <img src={`/img/${k.img}.webp`} alt={`${BRAND} ${post.title} 시공 사진 - ${k.scene}`} loading="lazy" />
                    <figcaption>{k.scene}</figcaption>
                  </figure>
                ))}
              </div>
              {lk && <p><Link href={pagePath(lk)} className="more">{lk.kw} 안내 <IconArrow /></Link></p>}
            </section>
          );
        })}
        <section className="sec">
          <h2 className="area-h">현장 사진을 보내 주시면</h2>
          <p className="prose-p">증상이 보이는 곳과 정화조 뚜껑·계량기·변기 주변을 찍어 카톡상담으로 보내 주시면 통화 때 바로 이어서 설명드립니다.</p>
          <Actions />
        </section>
      </div>
    </main>
  );
}
