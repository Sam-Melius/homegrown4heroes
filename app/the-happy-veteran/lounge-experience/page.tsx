import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function LoungeExperiencePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/the-happy-veteran/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("status")
    .eq("id", user.id)
    .single();

  if (profile?.status !== "approved") {
    redirect("/the-happy-veteran/pending");
  }

  const [{ data: edibleTimes }, { data: flowerTimes }] = await Promise.all([
    supabase
      .from("lounge_edible_times")
      .select("id, label, minutes, position")
      .order("position", { ascending: true }),
    supabase
      .from("lounge_flower_times")
      .select("id, rating, minutes_1, minutes_2, minutes_3, minutes_4, position")
      .order("position", { ascending: true }),
  ]);

  return (
    <main className="lounge-experience-page thv-subpage-theme thv-experience-theme">
      <div className="shell lounge-experience-shell">
        <Link className="text-link lounge-back-link" href="/the-happy-veteran/community">
          ← Back to The Happy Veteran
        </Link>

        <header className="lounge-experience-header">
          <span className="eyebrow">The Happy Veteran</span>
          <h1>Suggested Lounge Experience</h1>
          <p>A community lounge reference for approved members.</p>
        </header>

        <div className="lounge-experience-layout">
          <section className="lounge-experience-panel">
            <h2>Edibles</h2>
            <div className="edible-time-list">
              {(edibleTimes || []).map((item) => (
                <article key={item.id}>
                  <strong>{item.label}</strong>
                  <span>{item.minutes}</span>
                  <small>minutes</small>
                </article>
              ))}
            </div>
          </section>

          <section className="lounge-experience-panel flower-experience-panel">
            <h2>Flower</h2>
            <div className="flower-time-table">
              <div className="flower-time-heading">
                <span>Rating</span>
                <span>Suggested lounge experience (minutes)</span>
              </div>
              {(flowerTimes || []).map((item) => (
                <article key={item.id}>
                  <strong>{item.rating}</strong>
                  <div>
                    <span>{item.minutes_1}</span>
                    <span>{item.minutes_2}</span>
                    <span>{item.minutes_3}</span>
                    <span>{item.minutes_4}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="lounge-experience-panel concentrates-panel">
            <h2>Concentrates</h2>
            <div className="concentrate-list">
              {["Rosin", "Live Resin", "Temple Balls", "Diamonds", "Crumble / Sugar", "Hash"].map(
                (item) => <span key={item}>{item}</span>,
              )}
            </div>
          </section>
        </div>

        <section className="additional-products-strip">
          <h2>Additional Products</h2>
          <div>
            {["Pre-Rolls", "Infused Pre-Rolls", "Disposable Devices", "Topicals", "Seeds"].map(
              (item) => <span key={item}>{item}</span>,
            )}
          </div>
        </section>

        <p className="experience-disclaimer">
          Experience times are estimates provided by The Happy Veteran and may vary by individual.
        </p>
      </div>
    </main>
  );
}
