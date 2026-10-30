import type { Metadata } from 'next';
import Link from 'next/link';
import { CASES, OPEN_PAGES, PLACES, REGIONS, openRegions, regionPages, regionPath, pagePath, pageEncodedPath, inSitemap, postOf } from '../lib/data';
import { BRAND, CONTACT, TRUST, KAKAO, YOUTUBE, shareMeta } from '../lib/site';
import { faqJsonLd, itemListJsonLd } from '../lib/jsonld';
import { Actions, IconArrow, IconMsg, JsonLd, PhoneBlock, SectionHead } from '../components/Common';

const HOME_TITLE = `${BRAND} | 정화조수리·변기막힘·누수탐지 업체`;
const HOME_DESC = '정화조·누수탐지공사·변기·하수구 전문 선호환경. 365일 24시간 접수, 수도권 전지역 출동. 진단 후 견적, 동의 후 작업, 본사 무상 A/S 2년. 인천·시흥·부천·강서·구로 지역 안내.';
export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESC,
  alternates: { canonical: '/', types: { 'application/rss+xml': '/rss.xml' } },
  ...shareMeta('home', `${BRAND} 정화조·누수탐지`, { title: HOME_TITLE, description: HOME_DESC, url: '/' }),
};

// 홈페이지 '주요 서비스 4가지' 문구 그대로
const SERVICES = [
  { t: '정화조', d: '수리 · 교체 · 방수 · 설비공사 · 오수펌프 · 브로와 설치', svc: '정화조수리', img: 'site-septic' },
  { t: '누수탐지공사', d: '누수탐지 · 누수공사 · 빗물누수 · 방수 · 복구 · 인테리어', svc: '누수탐지', img: 'site-leak' },
  { t: '변기', d: '막힘 · 역류 · 교체 · 누수 · 비데 설치 · 배관 고압세척', svc: '변기막힘', img: 'site-toilet' },
  { t: '하수구', d: '막힘 뚫음 · 싱크대·세면대 · 고압세척 · 내시경 진단 · 악취', svc: '변기막힘', img: 'site-drain' },
];
// 홈페이지 'Process' 4단계
const PROCESS = [
  { t: '접수', d: '전화·문자·카톡으로 증상과 주소만 알려 주세요.' },
  { t: '방문·진단', d: '가까운 기사가 출동해 원인을 눈으로 확인시켜 드립니다. (홈페이지 표기: 30분 내 방문)' },
  { t: '견적 확인 후 작업', d: '비용을 먼저 안내하고, 동의하신 뒤에만 작업합니다.' },
  { t: '무상 A/S 2년', d: '본사 직접 시공 건은 작업일 기준 2년간 책임집니다.' },
];
// 홈페이지 '실제 이용 고객 후기' — 원문을 줄여 옮김
const REVIEWS = [
  { t: '정화조수리 및 방수공사', d: '오래된 노후주택 담벼락 아래와 옆 건물로 냄새나는 물이 새기 시작했는데, 정화조 크랙을 진단받고 방수·수리 후 정화조 누수가 해결됐다는 후기.' },
  { t: '정화조교체 및 맨홀공사', d: '정화조 청소 중 파손이 발견돼 정확한 검사 후 정화조를 교체했고, 큰 공사인데도 신속하게 끝났다는 후기.' },
  { t: '수도공사 및 관로탐사', d: '노후 아파트라 누수가 잦아 냉온수 전체 수도배관을 교체했고, 관로탐사와 마감이 깔끔했다는 후기.' },
  { t: '누수탐지공사', d: '수도요금이 갑자기 두 배가 나와 맡겼더니 원인을 찾고 공사까지 하루에 끝났고, 최소 범위만 작업해 비용이 적게 들었다는 후기.' },
  { t: '배관막힘 및 고압세척', d: '싱크대·화장실 역류·베란다 배관 막힘을 맨홀에서 고압세척 장비로 뚫어 배수가 잘 된다는 후기.' },
  { t: '변기수리 및 수전교체', d: '변기에서 미세한 물소리가 나 물통 부속을 교체했고, 주방 싱크대 수전도 함께 고쳤다는 후기.' },
];
// 홈페이지 FAQ
const FAQ = [
  { q: '출장비나 진단비가 따로 있나요?', a: '방문 진단 후 비용을 먼저 안내드리고, 동의하신 뒤에만 작업합니다.' },
  { q: '밤이나 주말에도 오시나요?', a: '네. 365일 24시간 접수·출장합니다. 대표번호나 카톡으로 연락 주세요.' },
  { q: '어느 지역까지 가능한가요?', a: '서울·인천·경기 수도권 전지역입니다. 홈페이지 안내로는 대부분 30분 내 도착합니다. 섬 지역은 배편 일정에 맞춰 날짜를 정합니다.' },
  { q: '누수 보험 처리가 되나요?', a: '누수탐지·시공 후 보험사 접수에 필요한 소견서·견적서·시공 사진을 제공해 드립니다.' },
  { q: 'A/S는 얼마나 되나요?', a: '본사 직접 시공 건은 작업일 기준 2년간 무상 A/S입니다.' },
  { q: '관공서·기관 발주도 가능한가요?', a: '조달청 등록업체로 공공기관 계약이 가능합니다. 세금계산서·견적서 발행 가능.' },
];

export default function Home() {
  const regions = openRegions();
  // 메인 캐러셀: 시·구·생활권 대표 페이지 (최대 30)
  const hubs = OPEN_PAGES.filter((p) => inSitemap(p) && PLACES[p.place].kind !== '동').slice(0, 30);
  const svcLink = (svc: string) => OPEN_PAGES.find((p) => inSitemap(p) && p.service === svc && p.place === '인천') || OPEN_PAGES.find((p) => p.service === svc);

  return (
    <main>
      <JsonLd data={[faqJsonLd(FAQ), itemListJsonLd(hubs.map((p) => ({ name: p.kw, path: pageEncodedPath(p), image: `/og/${encodeURIComponent(p.slug)}.jpg` })))]} />
      <section className="hero hero-home">
        <div className="wrap hero-grid">
          <div className="hero-text">
            <p className="eyebrow">{CONTACT.hours} · {CONTACT.arrive}</p>
            <h1><span><i>정화조·변기·누수탐지</i></span><span><i>{BRAND}</i></span></h1>
            <p className="hero-lead">정화조 · 누수탐지공사 · 변기 · 하수구 · 인테리어 복구공사. 진단부터 준공·A/S까지 본사가 직접 합니다.</p>
            <Actions />
          </div>
          <figure className="hero-photo mask">
            <img src="/img/site-septic.webp" alt={`${BRAND} 기사들이 땅을 파고 새 PE정화조를 묻는 교체 공사 현장`} width={1000} height={750} />
            <figcaption><b>{BRAND}</b>PE정화조 교체 공사 현장</figcaption>
          </figure>
        </div>
      </section>

      <div className="wrap">
        <ul className="trust" aria-label="홈페이지 표기 인증·이력">
          {TRUST.map((x, i) => <li key={x.t} data-reveal style={{ transitionDelay: `${(i % 3) * 70}ms` }}><b>{x.t}</b><span>{x.d}</span></li>)}
        </ul>
      </div>


      <div className="wrap content">
        <section className="sec">
          <SectionHead no="01" title="주요 서비스 4가지" sub="기존 홈페이지 서비스 메뉴 그대로입니다. 지역별 안내로 이어집니다." />
          <div className="svc-grid">
            {SERVICES.map((x, i) => {
              const lk = svcLink(x.svc);
              return (
                <article key={x.t} className={`svc svc-${i}`} data-reveal style={{ transitionDelay: `${(i % 2) * 80}ms` }}>
                  <figure className="mask"><img src={`/img/${x.img}.webp`} alt={`${BRAND} ${x.t} 작업 사진`} loading="lazy" /></figure>
                  <div>
                    <span className="svc-no">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{x.t}</h3>
                    <p>{x.d}</p>
                    {lk && <Link href={pagePath(lk)} className="more">{lk.kw} <IconArrow /></Link>}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <section className="band">
        <div className="wrap">
          <SectionHead no="02" title="접수부터 A/S까지, 4단계" sub="홈페이지 작업 절차입니다. 비용은 진단 뒤 먼저 안내하고, 안내한 견적 그대로 진행합니다." />
          <ol className="tools reveal-group">{PROCESS.map((t) => <li key={t.t}><div><h3>{t.t}</h3><p>{t.d}</p></div></li>)}</ol>
        </div>
      </section>

      <div className="wrap content">
        <section className="sec">
          <SectionHead no="03" title="시공사례 게시판 사진" sub="기존 홈페이지 시공사례 게시판 글 4건의 사진입니다." />
          <div className="rail-nav">
            <button type="button" data-scroll="-1" data-target="case-rail" aria-label="이전 사진">←</button>
            <button type="button" data-scroll="1" data-target="case-rail" aria-label="다음 사진">→</button>
          </div>
          <div className="rail" id="case-rail">
            {CASES.map((k, i) => (
              <figure key={k.img} data-reveal style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
                <div className="ph"><img src={`/img/${k.img}.webp`} alt={`${BRAND} 시공 사진 - ${k.scene}`} loading="lazy" /></div>
                <figcaption><b>{postOf(k.uid).title}</b>{k.scene}</figcaption>
              </figure>
            ))}
          </div>
          <p data-reveal><Link href="/cases/" className="more">시공사례 글 4건 보기 <IconArrow /></Link></p>
        </section>
      </div>

      <section className="cta-band" data-reveal>
        <div className="wrap cta-band-in">
          <p>막힘·누수·정화조,<br />현장 확인부터 비용 안내, 시공 후 2년 A/S까지</p>
          <Actions kakao={false} />
        </div>
      </section>

      <div className="wrap content">
        <section className="sec mist">
          <SectionHead no="04" title="실제 이용 고객 후기" sub="기존 홈페이지 후기 6건을 짧게 옮겼습니다." />
          <ol className="works">
            {REVIEWS.map((w, i) => (
              <li key={w.t} data-reveal style={{ transitionDelay: `${(i % 2) * 80}ms` }}>
                <span className="works-no">{String(i + 1).padStart(2, '0')}</span>
                <div><h3>{w.t}</h3><p>{w.d}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="sec">
          <SectionHead no="05" title="증빙 자료" sub="홈페이지에 올린 인증서와 공공조달 등록 안내 이미지입니다. 등록 확인은 나라장터(g2b.go.kr)." />
          <div className="certs">
            <figure data-reveal><img src="/img/cert.webp" alt="선호환경 2023 올해의 소비자 만족지수 1위 인증서 - 서비스(상하수도설비) 부문" width={637} height={900} loading="lazy" /><figcaption>소비자 만족지수 1위 인증서 · 상하수도설비 부문</figcaption></figure>
            <figure data-reveal><img src="/img/gov-cert.webp" alt="선호환경 공공조달 등록업체 안내 - 조달청 나라장터 등록" width={636} height={900} loading="lazy" /><figcaption>공공조달 등록 안내 · 조달청 나라장터</figcaption></figure>
            <div className="prose" data-reveal>
              <p className="first">JTBC 〈이규연의 스포트라이트〉에 선호환경의 현장 작업이 소개됐다고 홈페이지에 적혀 있습니다.</p>
              <p>정화조 안에서 실제로 무엇이 나오는지, 어떻게 처리하는지는 <a href={YOUTUBE} target="_blank" rel="noopener">선호환경 유튜브 채널</a> 영상으로 볼 수 있습니다.</p>
              <p>카톡상담으로 현장 사진을 보내 주시면 더 정확한 견적을 드립니다.</p>
              <a className="btn-text" href={KAKAO} target="_blank" rel="noopener"><IconMsg /><span>카톡상담 열기</span><IconArrow /></a>
            </div>
          </div>
        </section>

        <section className="sec mist">
          <SectionHead no="06" title="지역 안내" sub="권역을 고르면 동네별 정화조수리·변기막힘·누수탐지 안내로 이어집니다." />
          <div className="cities">
            {regions.map((r) => (
              <Link key={r} href={regionPath(r)} className="city-row" data-reveal>
                <div><b>{r}</b><span>{REGIONS[r].full}</span></div>
                <em>{regionPages(r).length}</em>
              </Link>
            ))}
          </div>
          <ul className="linklist" style={{ marginTop: 28 }}>
            {hubs.slice(0, 12).map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}
          </ul>
          <p data-reveal><Link href="/area/" className="more">전체 지역 페이지 <IconArrow /></Link></p>
        </section>

        <section className="sec">
          <SectionHead no="07" title="자주 묻는 질문" />
          <div className="faq">{FAQ.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </section>
      </div>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>증상과 주소만 알려 주세요</h2>
          <p>가까운 기사가 출동합니다. 진단 후 견적, 동의 후 작업.</p>
          <div className="actions"><PhoneBlock label="전화상담 " /></div>
        </div>
      </section>
    </main>
  );
}
