import Image from "next/image";
import Link from "next/link";

const products = [
  { image: "/shop/44-specs.webp", name: "44 Specs" },
  { image: "/shop/9oz.webp", name: "9 oz. Item" },
  { image: "/shop/dall-e-2024-09-16-13-53-22-an-enhanced-version-of-the-growers-box-product-icon-featuring-a-sprout-emerging-from-soil-edited.webp", name: "Growers Box" },
  { image: "/shop/hdg-35-e1564467676150.webp", name: "HDG-35" },
  { image: "/shop/hdg-55.webp", name: "HDG-55" },
  { image: "/shop/img-1796.webp", name: "Homegrown4Heroes Item" },
  { image: "/shop/mugs.webp", name: "Homegrown4Heroes Mugs" },
  { image: "/shop/sbox-front-open-websized-244x300.webp", name: "Seed Box" }
];

export default function ShopPage() {
  return (
    <>
      <section className="inner-hero inner-hero-short">
        <div className="shell">
          <span className="eyebrow">Homegrown4Heroes shop</span>
          <h1>Products that support the mission.</h1>
          <p className="lead">Browse Homegrown4Heroes products and contact the organization for pricing and availability.</p>
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell">
          <div className="shop-grid">
            {products.map((product) => (
              <article className="shop-card" key={product.image}>
                <div className="shop-card-media">
                  <Image src={product.image} alt={product.name} width={700} height={700} />
                </div>
                <div className="shop-card-content">
                  <h2>{product.name}</h2>
                  <p>Contact Homegrown4Heroes for pricing and availability.</p>
                  <Link className="button button-full" href="/contact">Contact Us</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
