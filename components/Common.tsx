// 공통 UI — 이모지 없이 선 아이콘, 각진 버튼, 번호 붙은 섹션 머리.
// 사용자 요청: 전화번호가 보이는 모든 곳 바로 아래에 기존 홈페이지(sunhoenv.com) 링크 → HomeLink 를 전화번호와 한 묶음으로 쓴다.
import Link from 'next/link';
import { BRAND, CONTACT, BUSINESS, HOMEPAGE, HOMEPAGE_LABEL, KAKAO, tel } from '../lib/site';

export const JsonLd = ({ data }: { data: object | object[] }) => (
  <>{(Array.isArray(data) ? data : [data]).map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />)}</>
);

const Svg = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
export const IconPhone = () => <Svg d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />;
export const IconMsg = () => <Svg d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
export const IconArrow = () => <Svg d="M5 12h14M13 6l6 6-6 6" size={16} />;
export const IconOut = () => <Svg d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" size={14} />;

// 전화번호 바로 아래 붙는 기존 홈페이지 링크
export const HomeLink = ({ className = 'home-link' }: { className?: string }) => (
  <a className={className} href={HOMEPAGE} target="_blank" rel="noopener">기존 홈페이지 {HOMEPAGE_LABEL} 바로가기<IconOut /></a>
);

// 전화 버튼 + 그 아래 홈페이지 링크 (한 묶음)
export const PhoneBlock = ({ label = '' }: { label?: string }) => (
  <div className="phone-block">
    <a className="btn-primary" href={tel}><IconPhone /><span>{label}{CONTACT.phone}</span></a>
    <HomeLink />
  </div>
);

// 본문 버튼 묶음: 전화(+홈페이지 링크) · 카톡상담
export const Actions = ({ kakao = true }: { kakao?: boolean }) => (
  <div className="actions">
    <PhoneBlock />
    {kakao && <a className="btn-text" href={KAKAO} target="_blank" rel="noopener"><IconMsg /><span>카톡상담 · 현장 사진 보내기</span><IconArrow /></a>}
  </div>
);

export const SectionHead = ({ no, title, sub }: { no: string; title: string; sub?: string }) => (
  <header className="sh" data-reveal>
    <span className="sh-no" aria-hidden="true">{no}</span>
    <h2>{title}</h2>
    {sub && <p>{sub}</p>}
  </header>
);

export const Ticker = ({ items }: { items: string[] }) => (
  <div className="ticker" aria-hidden="true">
    <div className="ticker-track">{[...items, ...items].map((x, i) => <span key={i}>{x}</span>)}</div>
  </div>
);

export const Header = () => (
  <header className="site-header">
    <div className="wrap header-inner">
      <Link href="/" className="logo" aria-label={`${BRAND} 홈`}>
        <img src="/img/logo.png" alt={`${BRAND} 정화조·누수탐지 로고`} width={574} height={199} className="logo-img" />
      </Link>
      <nav className="nav" aria-label="주 메뉴">
        <Link href="/area/" className="hide-m">지역</Link>
        <Link href="/cases/" className="hide-m">시공사례</Link>
        <a href={KAKAO} className="hide-m" target="_blank" rel="noopener">카톡상담</a>
        <div className="nav-phone">
          <a href={tel} className="nav-call" aria-label={`전화 ${CONTACT.phone}`}><IconPhone /><span>{CONTACT.phone}</span></a>
          <HomeLink className="nav-home" />
        </div>
      </nav>
    </div>
  </header>
);

export const Footer = () => (
  <footer className="site-footer">
    <div className="wrap foot-grid">
      <div>
        <strong className="foot-brand">{BRAND}</strong>
        <p>정화조 · 누수탐지공사 · 변기 · 하수구 · 수도동파<br />인천 · 시흥 · 부천 · 서울 강서구 · 구로구 포함 수도권 전지역 · {CONTACT.hours}</p>
        <p><Link href="/area/">지역 안내</Link> · <Link href="/cases/">시공사례</Link> · <a href="/rss.xml">RSS</a></p>
      </div>
      <ul className="foot-info">
        <li><span>상호</span>{BRAND} · 대표 {BUSINESS.ceo}</li>
        <li><span>사업자</span>{BUSINESS.bizNumber}</li>
        <li><span>본사</span>{BUSINESS.address}</li>
        <li><span>이메일</span>{BUSINESS.email}</li>
        <li className="foot-phone"><span>대표번호</span><div><a href={tel}>{CONTACT.phone}</a><HomeLink /></div></li>
      </ul>
    </div>
    <div className="wrap foot-bottom">© {new Date().getFullYear()} {BRAND} · 소비자만족지수 1위(상하수도설비) · 조달청 등록업체 · 본사 무상 A/S 2년 — 기존 홈페이지 표기 기준</div>
  </footer>
);

export const StickyBar = () => (
  <div className="sticky-bar">
    <div className="sb-row">
      <a href={tel} className="sb-call"><IconPhone />{CONTACT.phone}</a>
      <a href={KAKAO} className="sb-kakao" target="_blank" rel="noopener"><IconMsg />카톡상담</a>
    </div>
    <HomeLink className="sb-home" />
  </div>
);
