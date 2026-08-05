import Link from "next/link";

const items = [
  ["Healing Heroes", "Veteran-focused wellness resources, program enrollment, and support.", "/programs/healing-heroes"],
  ["Medical Card", "Information about Homegrown4Heroes' medical cannabis card resource partner.", "/programs/medical-card"],
  ["Planting for Patriots", "Grow for a cause and support veterans through cultivation.", "/programs/planting-for-patriots"],
  ["Coloring Pages", "Downloadable veteran-themed coloring pages for families and supporters.", "/programs/coloring-pages"],
];

export default function ProgramsPage() {
  return <><section className="inner-hero inner-hero-short"><div className="shell"><span className="eyebrow">Programs</span><h1>Resources built around veterans.</h1><p className="lead">Explore Homegrown4Heroes programs, education, cultivation initiatives, and community resources.</p></div></section><section className="section"><div className="shell"><div className="card-grid program-page-grid">{items.map(([title,text,href], index)=><article className="card feature-card" key={title}><span className="card-number">0{index+1}</span><h2>{title}</h2><p>{text}</p><Link className="text-link" href={href}>View program →</Link></article>)}</div></div></section></>;
}
