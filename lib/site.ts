// 사이트 설정 — 연락처·사업자 정보·도메인은 이 파일만 고치면 전 페이지에 반영된다.
// 근거: 기존 홈페이지(https://sunhoenv.com/) 메인·회사소개·하위 메뉴 표기 (2026-10-28 확인).

// TODO(도메인 확정 후): SITE_URL 환경변수로 넘기거나 기본값 교체. 배포: bash scripts/deploy.sh <단계> <URL>
export const SITE_URL = process.env.SITE_URL || 'https://sunho.example';
export const BRAND = '선호환경';
export const SITE_NAME = `${BRAND} | 정화조·변기막힘·누수탐지`;

// 기존 홈페이지 — 사용자 요청: 전화번호가 보이는 모든 곳 바로 아래에 이 링크
export const HOMEPAGE = 'https://sunhoenv.com/';
export const HOMEPAGE_LABEL = 'sunhoenv.com';
// 카카오톡 채널 — 홈페이지 '카톡상담' 버튼 주소
export const KAKAO = 'https://pf.kakao.com/_VxdPnX';
export const YOUTUBE = 'https://www.youtube.com/@%EC%84%A0%ED%98%B8%ED%99%98%EA%B2%BD';

export const CONTACT = {
  phone: '1666-8086', // 대표번호만 쓴다(홈페이지의 휴대폰 번호는 넣지 않음 — 사용자 지시)
  hours: '365일 24시간 접수', // 홈페이지 표기
  arrive: '수도권 전지역 30분 내 출동', // 홈페이지 표기(FAQ: 대부분 30분 내 도착)
};

// 홈페이지 회사소개·푸터 표기
export const BUSINESS = {
  name: BRAND,
  ceo: '장선호',
  bizNumber: '282-49-00256',
  email: 'sunho9638@hanmail.net',
  address: '인천광역시 부평구 항동로 148', // TODO 확인: 홈페이지 표기 그대로(도로명이 속한 구 확인 필요)
  branches: ['인천 검단구 이음1로 173', '경기 부천시 소사구 중동로 64', '경기 부천시 신흥로100번길 44', '서울 강북구 도봉로38길 23-7', '경기 용인시 기흥구 덕영대로2077번길 55'],
};

// 홈페이지 '선택하는 6가지 이유'·인증 표기 (출처 문구 그대로)
export const TRUST = [
  { t: '소비자만족지수 1위', d: '서비스(상하수도설비) 부문 · 주최 강소기업개발진흥원 · 후원 한국입법기자협회 (인증서 2023)' },
  { t: 'JTBC 방송 출연', d: 'JTBC 〈이규연의 스포트라이트〉에 현장 작업이 소개됨' },
  { t: '국가기술자격 보유', d: '한국산업인력공단 발급 국가기술자격을 보유한 대표가 직접 시공' },
  { t: '조달청 등록업체', d: '관공서·학교·공공기관 발주 및 계약 가능, 세금계산서·견적서 발행' },
  { t: '본사 무상 A/S 2년', d: '본사 직접 시공 건, 작업일 기준 2년' },
  { t: '365일 24시간', d: '밤·주말·명절에도 접수, 서울·인천·경기 수도권 전지역 출장' },
];

// 순차 오픈: 이 단계 이하의 페이지만 빌드·사이트맵·내부링크에 포함된다. 단계 = 키워드 엑셀 우선순위
//   OPEN_WAVE=1 npx next build  (1 = 권역 대표 15 / 2 = +시·구·생활권 303 / 3 = 전체 1,020)
export const OPEN_WAVE = Number(process.env.OPEN_WAVE || 3);

// 표기만 다른 키워드 페이지(인천/인천시/인천광역시, 부평/부평구, 구월/구월동 …)는 대표 페이지로 canonical + 사이트맵 제외
export const MERGE_VARIANTS = true;

export const tel = `tel:${CONTACT.phone.replace(/[^0-9]/g, '')}`;
export const absUrl = (path: string) => `${SITE_URL}${path}`;

// og·트위터 카드: public/og/<key>.jpg (scripts/make_og.py 로 생성)
export const shareMeta = (key: string, alt: string, o: { title?: string; description?: string; url?: string } = {}) => {
  const images = [{ url: `${SITE_URL}/og/${encodeURIComponent(key)}.jpg`, width: 1200, height: 630, alt }];
  return {
    openGraph: { type: 'website' as const, siteName: SITE_NAME, locale: 'ko_KR', ...o, images },
    twitter: { card: 'summary_large_image' as const, title: o.title, description: o.description, images },
  };
};
