import { SITE_URL, SITE_NAME, BRAND, CONTACT, BUSINESS, HOMEPAGE, KAKAO, YOUTUBE } from './site';

export const businessJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Plumber',
  '@id': `${SITE_URL}/#business`,
  name: BRAND,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/img/site-septic.jpg`,
  logo: `${SITE_URL}/img/logo.png`,
  telephone: CONTACT.phone,
  email: BUSINESS.email,
  founder: BUSINESS.ceo,
  taxID: BUSINESS.bizNumber,
  address: { '@type': 'PostalAddress', addressCountry: 'KR', addressRegion: '인천광역시', addressLocality: '부평구', streetAddress: '항동로 148' },
  openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' },
  sameAs: [HOMEPAGE, KAKAO, YOUTUBE],
  areaServed: ['인천광역시', '경기도 시흥시', '경기도 부천시', '서울특별시 강서구', '서울특별시 구로구'],
  knowsAbout: ['정화조수리', '정화조교체', '정화조방수공사', '오수펌프', '변기막힘', '변기역류', '누수탐지', '누수공사', '하수구막힘', '고압세척'],
});

export const webSiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  inLanguage: 'ko',
  publisher: { '@id': `${SITE_URL}/#business` },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE_URL}${it.path}` })),
});

export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const serviceJsonLd = (o: { name: string; type: string; description: string; path: string; area: string; image: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: o.name,
  serviceType: o.type,
  description: o.description,
  url: `${SITE_URL}${o.path}`,
  image: `${SITE_URL}${o.image}`,
  areaServed: { '@type': 'Place', name: o.area },
  provider: { '@id': `${SITE_URL}/#business` },
});

// 관련 페이지·허브 목록(캐러셀). path 는 인코딩된 경로
export const itemListJsonLd = (items: { name: string; path: string; image?: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}${it.path}`, name: it.name, ...(it.image ? { image: `${SITE_URL}${it.image}` } : {}) })),
});
