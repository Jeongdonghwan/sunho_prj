// 데이터 로더 — data/site-pages.json(키워드 페이지), places.json(지역), cases.json(시공 사진). 빌드 전용.
import pagesData from '../data/site-pages.json';
import placesData from '../data/places.json';
import casesData from '../data/cases.json';
import { OPEN_WAVE, MERGE_VARIANTS } from './site';

export type Svc = '누수탐지' | '변기막힘' | '정화조수리' | '정화조';
export type Ctx = 'apt' | 'villa' | 'house' | 'shop' | 'island';
export interface Page {
  n: number; kw: string; slug: string; label: string; place: string; region: string; unit: string;
  service: Svc; group: string; mod: string; prio: number; wave: number; variantOf?: string;
}
export interface Place { key: string; name: string; region: string; kind: string; zone: string; ctx: Ctx; admin: string; gu: string; homes: string; spots: string[]; note: string }
export interface Region { full: string; short: string; route: string; traits: string }
export interface Zone { region: string; name: string; homes: string; note: string; spots: string[] }
export interface Case { img: string; uid: number; scene: string; space: string; tags: string[] }
export interface Post { uid: number; title: string; date: string; posted: string; service: string; place: string; summary: string[] }
export interface SitePhoto { img: string; scene: string; tags: string[] }

export const ALL_PAGES = pagesData.pages as Page[];
export const OPEN_PAGES = ALL_PAGES.filter((p) => p.wave <= OPEN_WAVE);
const openSet = new Set(OPEN_PAGES.map((p) => p.slug));
export const isOpen = (slug: string) => openSet.has(slug);

export const PLACES = placesData.places as Record<string, Place>;
export const REGIONS = placesData.regions as Record<string, Region>;
export const ZONES = placesData.zones as Record<string, Zone>;
export const REGION_ORDER = placesData.regionOrder as string[];
export const CASES = casesData.cases as Case[];
export const POSTS = casesData.posts as Post[];
export const SITE_PHOTOS = casesData.site as SitePhoto[];
export const postOf = (uid: number) => POSTS.find((x) => x.uid === uid)!;

export const pagePath = (p: Page) => `/${p.slug}/`;
export const pageEncodedPath = (p: Page) => `/${encodeURIComponent(p.slug)}/`;
export const regionPath = (r: string) => `/area/${r}/`;
export const regionEncodedPath = (r: string) => `/area/${encodeURIComponent(r)}/`;

// canonical: 스위치가 켜져 있고 대표 페이지가 열려 있으면 대표 페이지로
export const canonicalPath = (p: Page) =>
  MERGE_VARIANTS && p.variantOf && openSet.has(p.variantOf) ? `/${encodeURIComponent(p.variantOf)}/` : pageEncodedPath(p);
export const inSitemap = (p: Page) => canonicalPath(p) === pageEncodedPath(p);

export function getPage(slug: string): Page | undefined {
  let key = slug;
  try { key = decodeURIComponent(slug); } catch {}
  return OPEN_PAGES.find((p) => p.slug === key);
}

export const openRegions = () => REGION_ORDER.filter((r) => OPEN_PAGES.some((p) => p.region === r));
export const regionPages = (r: string) => OPEN_PAGES.filter((p) => p.region === r);

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h;
};
export const seedOf = hash;
export const rotate = <T,>(arr: T[], seed: string, salt = ''): T[] => {
  if (!arr.length) return arr;
  const k = hash(`${seed}::${salt}`) % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
};

// 서비스 묶음 (정화조·정화조수리는 같은 묶음) — 사진 태그와 같은 이름
export const svcGroup = (s: string) => (s === '정화조' || s === '정화조수리' ? '정화조' : s === '변기막힘' ? '변기' : '누수탐지');

// 관련 페이지 — 열린 대표 페이지만. 같은 장소 다른 서비스 / 같은 생활권 묶음 이웃 / 같은 권역 시·구·생활권 / 다른 권역
export function related(p: Page) {
  const pool = OPEN_PAGES.filter((x) => x.slug !== p.slug && inSitemap(x));
  const P = PLACES[p.place];
  const samePlace = pool.filter((x) => x.place === p.place);
  const sameZone = rotate(pool.filter((x) => x.place !== p.place && PLACES[x.place].zone === P.zone && x.service === p.service), p.slug, 'rel').slice(0, 8);
  const sameRegion = rotate(pool.filter((x) => x.region === p.region && x.place !== p.place && PLACES[x.place].kind !== '동' && x.service === p.service && !sameZone.includes(x)), p.slug, 'rel2').slice(0, 6);
  const otherRegions = pool.filter((x) => x.region !== p.region && PLACES[x.place].kind === '시구' && x.service === p.service).slice(0, 5);
  return { samePlace, sameZone, sameRegion, otherRegions };
}

// 시공 사진 배정 — 서비스 묶음 태그가 맞는 사진을 앞에 두고 슬러그 해시로 돌린다.
// 게시판에 지역이 적힌 글은 부천 1건뿐이라 지역은 배정 기준이 아니다. 같은 게시글 사진이 몰리지 않게 글별로 번갈아 고른다.
export function casesFor(p: Page, n = 3): Case[] {
  const want = svcGroup(p.service);
  const fit = rotate(CASES.filter((c) => c.tags.includes(want)), p.slug, 'case');
  const rest = rotate(CASES.filter((c) => !c.tags.includes(want)), p.slug, 'case2');
  const groups = Array.from(new Set(fit.map((c) => c.uid))).map((u) => fit.filter((c) => c.uid === u));
  const mixed: Case[] = [];
  for (let i = 0; mixed.length < fit.length; i++) groups.forEach((g) => g[i] && mixed.push(g[i]));
  return [...mixed, ...rest].slice(0, n);
}
export const sitePhotoFor = (p: Page) => rotate(SITE_PHOTOS.filter((x) => x.tags.includes(svcGroup(p.service))), p.slug, 'site')[0];
