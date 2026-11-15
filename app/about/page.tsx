// 소개 — 사실만 평서문으로 (무엇을·어디서·어떻게 연락). site.ts 와 데이터에 있는 것만 쓴다. 없는 정보는 줄을 내지 않는다.
import type { Metadata } from 'next';
import Link from 'next/link';
import { BRAND, BUSINESS, CONTACT, HOMEPAGE, KAKAO, YOUTUBE, UPDATED, shareMeta, tel } from '../../lib/site';
import { breadcrumbJsonLd, businessJsonLd } from '../../lib/jsonld';
import { JsonLd } from '../../components/Common';

const TITLE = `소개 | ${BRAND}`;
const DESC = `정화조·변기막힘·누수탐지·하수구 작업을 하는 ${BRAND} 소개입니다. 하는 일, 다니는 지역, 연락 방법, 사업자 정보를 사실대로 정리했습니다.`;
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/about/' },
  ...shareMeta('home', `${BRAND} 소개`, { title: TITLE, description: DESC, url: '/about/' }),
};

export default function About() {
  return (
    <main>
      <JsonLd data={[businessJsonLd(), breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '소개', path: '/about/' }])]} />
      <div className="wrap content page-top">
        <h1 className="page-title">{BUSINESS.name} 소개</h1>
        <p className="prose-p">{BUSINESS.name}은 정화조, 누수탐지공사, 변기, 하수구, 수도동파 작업을 합니다.</p>
        <section className="sec">
          <h2 className="area-h">하는 일</h2>
          <p className="prose-p">정화조 수리·교체·방수공사, 변기막힘·역류, 누수탐지·누수공사, 하수구막힘·고압세척 작업을 합니다. 현장 기록은 <Link href="/cases/">시공사례</Link>에 있습니다.</p>
        </section>
        <section className="sec">
          <h2 className="area-h">다니는 지역</h2>
          <p className="prose-p">인천, 시흥, 부천, 서울 강서구, 구로구를 포함한 수도권 지역을 다닙니다. 동네별 안내는 <Link href="/area/">지역 안내</Link>에 있습니다.</p>
        </section>
        <section className="sec">
          <h2 className="area-h">연락 방법</h2>
          <p className="prose-p">대표번호 <a href={tel}>{CONTACT.phone}</a>로 받습니다. 접수 시간은 {CONTACT.hours}입니다.</p>
          <p className="prose-p"><a href={HOMEPAGE} target="_blank" rel="noopener">기존 홈페이지</a> · <a href={KAKAO} target="_blank" rel="noopener">카카오톡 채널</a> · <a href={YOUTUBE} target="_blank" rel="noopener">유튜브</a></p>
        </section>
        <section className="sec">
          <h2 className="area-h">사업자 정보</h2>
          <p className="prose-p">상호는 {BUSINESS.name}, 대표는 {BUSINESS.ceo}입니다.</p>
          <p className="prose-p">사업자등록번호는 {BUSINESS.bizNumber}입니다.</p>
          <p className="prose-p">본사 주소는 {BUSINESS.address}입니다.</p>
          <p className="prose-p">지사 주소는 {BUSINESS.branches.join(', ')}입니다.</p>
          <p className="prose-p">이메일은 {BUSINESS.email}입니다.</p>
        </section>
        <p className="prose-p">이 페이지의 최종 수정일은 <time dateTime={UPDATED}>{UPDATED}</time>입니다.</p>
      </div>
    </main>
  );
}
