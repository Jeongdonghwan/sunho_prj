import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OPEN_PAGES, PLACES, getPage, pagePath, pageEncodedPath, canonicalPath, regionPath, regionEncodedPath, related, postOf } from '../../lib/data';
import { compose } from '../../lib/compose';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, serviceJsonLd } from '../../lib/jsonld';
import { BRAND, shareMeta } from '../../lib/site';
import { Actions, IconArrow, JsonLd, SectionHead } from '../../components/Common';

export const dynamicParams = false;

// 순차 오픈: lib/site.ts 의 OPEN_WAVE 이하 페이지만 생성
export function generateStaticParams() {
  return OPEN_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPage(params.slug);
  if (!p) return {};
  const c = compose(p);
  const url = canonicalPath(p);
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: url },
    ...shareMeta(p.slug, `${p.kw} - ${BRAND}`, { title: c.title, description: c.description, url }),
  };
}

const fmt = (d: string) => d.replace(/-/g, '.');

export default function KeywordPage({ params }: { params: { slug: string } }) {
  const p = getPage(params.slug);
  if (!p) notFound();
  const c = compose(p);
  const P = PLACES[p.place];
  const rel = related(p);
  const path = pageEncodedPath(p);
  const relAll = [...rel.samePlace, ...rel.sameZone, ...rel.sameRegion, ...rel.otherRegions];
  const relList = relAll.map((x) => ({ name: x.kw, path: pageEncodedPath(x), image: `/og/${encodeURIComponent(x.slug)}.jpg` }));
  const words = p.kw.split(' ');
  const h1a = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  const h1b = words.slice(Math.ceil(words.length / 2)).join(' ');

  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: '홈', path: '/' },
            { name: '지역', path: '/area/' },
            { name: `${p.region} 지역 안내`, path: regionEncodedPath(p.region) },
            { name: p.kw, path },
          ]),
          serviceJsonLd({ name: p.kw, type: p.service, description: c.description, path, area: P.admin, image: `/img/${c.hero.img}.jpg` }),
          faqJsonLd(c.faq),
          itemListJsonLd(relList.length ? relList : [{ name: `${p.region} 지역 안내`, path: regionEncodedPath(p.region) }]),
        ]}
      />

      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-text">
            <nav className="crumbs" aria-label="경로">
              <Link href="/">홈</Link><span>/</span><Link href="/area/">지역</Link><span>/</span><Link href={regionPath(p.region)}>{p.region}</Link>
            </nav>
            <p className="eyebrow">{c.eyebrow}</p>
            <h1><span><i>{h1a}</i></span>{h1b && <span><i>{h1b}</i></span>}</h1>
            <p className="hero-lead">{c.lead}</p>
            <Actions />
          </div>
          <figure className="hero-photo mask">
            <img src={`/img/${c.hero.img}.webp`} alt={c.hero.alt} />
            <figcaption><b>{BRAND}</b>{c.hero.cap}</figcaption>
          </figure>
        </div>
      </section>

      <div className="wrap">
        <section className="answer" aria-label="요약" data-reveal>
          <p>{c.answer}</p>
          <dl>{c.summary.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </section>
      </div>


      <div className="wrap content">
        <section className="sec">
          <SectionHead no="01" title={c.region.heading} />
          <div className="cols">
            <div className="prose" data-reveal>
              {c.intro.map((t, i) => <p key={i} className={i === 0 ? 'first' : ''}>{t}</p>)}
              {c.region.paras.map((t, i) => <p key={`r${i}`}>{t}</p>)}
            </div>
            <aside className="memo" data-reveal>
              <h3>{P.name} 주변</h3>
              <ol>{c.region.spots.map((h) => <li key={h}>{h}</li>)}</ol>
              {c.region.nearby.length > 0 && <><h3>같이 다니는 동네</h3><p>{c.region.nearby.join(' · ')}</p></>}
            </aside>
          </div>
        </section>

        <section className="sec mist">
          <SectionHead no="02" title={c.view.heading} />
          <div className="prose" data-reveal>{c.view.paras.map((t, i) => <p key={i}>{t}</p>)}</div>
          <dl className="spec" data-reveal>{c.view.table.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </section>

        <section className="sec">
          <SectionHead no="03" title={c.symptoms.heading} sub="하나라도 해당되면 더 늦기 전에 연락 주세요. 마지막 네 줄은 홈페이지 체크리스트 문구입니다." />
          <div className="signs">
            <ul className="reveal-group">{c.symptoms.items.map((x) => <li key={x}>{x}</li>)}</ul>
            <figure data-reveal className="mask">
              <img src={`/img/${c.symptoms.photo.img}.webp`} alt={c.symptoms.photo.alt} loading="lazy" />
              <figcaption>{c.symptoms.photo.cap}</figcaption>
            </figure>
          </div>
        </section>
      </div>

      <section className="band">
        <div className="wrap">
          <SectionHead no="04" title={c.items.heading} sub={c.items.text} />
          <ol className="tools reveal-group">
            {c.items.list.map((t) => <li key={t.name}><div><h3>{t.name}</h3><p>{t.d}</p></div></li>)}
          </ol>
        </div>
      </section>

      <section className="cta-band" data-reveal>
        <div className="wrap cta-band-in">
          <p>{c.cta}</p>
          <Actions kakao={false} />
        </div>
      </section>

      <div className="wrap content">
        <section className="sec">
          <SectionHead no="05" title={c.cases.heading} sub={c.cases.sub} />
          <div className="shots">
            {c.cases.items.map(({ c: k, caption }, i) => (
              <figure key={k.img} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                <img src={`/img/${k.img}.webp`} alt={`${p.kw} - ${k.scene}`} loading="lazy" />
                <figcaption><b>{postOf(k.uid).title} · {fmt(postOf(k.uid).date)}</b>{caption}</figcaption>
              </figure>
            ))}
          </div>
          <p className="case-note" data-reveal><Link href="/cases/" className="more">시공사례 전체 보기 <IconArrow /></Link></p>
        </section>

        <section className="sec mist">
          <SectionHead no="06" title={c.stepsHeading} sub="홈페이지에 적힌 작업 절차 4단계 그대로입니다." />
          <ol className="flow reveal-group">
            {c.steps.map((st) => <li key={st.title}><strong>{st.title}</strong><p>{st.text}</p></li>)}
          </ol>
        </section>

        <section className="sec">
          <SectionHead no="07" title={c.tell.heading} />
          <div className="cols">
            <ol className="memo-list reveal-group">{c.tell.items.map((x) => <li key={x}>{x}</li>)}</ol>
            <div className="prose" data-reveal><p>{c.tell.text}</p>
              <dl className="info">{c.info.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            </div>
          </div>
        </section>

        <section className="sec mist" id="faq">
          <SectionHead no="08" title="자주 묻는 질문" />
          <div className="faq">
            {c.faq.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}
          </div>
        </section>

        <section className="sec">
          <SectionHead no="09" title={`${p.kw} 관련 안내`} />
          <div className="related">
            {rel.samePlace.length > 0 && <div><h3>{P.name} 다른 서비스</h3><ul>{rel.samePlace.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
            {rel.sameZone.length > 0 && <div><h3>가까운 동네</h3><ul>{rel.sameZone.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
            {rel.sameRegion.length > 0 && <div><h3>{p.region} 시·구·생활권</h3><ul>{rel.sameRegion.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
            <div><h3>다른 권역</h3><ul>
              {rel.otherRegions.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}
              <li><Link href={regionPath(p.region)}>{p.region} 지역 전체<IconArrow /></Link></li>
            </ul></div>
          </div>
        </section>
      </div>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>{c.closing.heading}</h2>
          <p>{c.closing.text}</p>
          <Actions />
        </div>
      </section>
    </main>
  );
}
