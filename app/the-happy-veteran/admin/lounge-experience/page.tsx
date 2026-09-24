import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateEdibleExperienceTime, updateFlowerExperienceTime } from "@/app/admin/actions";

export default async function LoungeExperienceAdminPage(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/the-happy-veteran/login");
  const {data:current}=await supabase.from("profiles").select("role, status").eq("id",user.id).single();
  if(current?.role!=="admin" || current.status!=="approved") redirect("/the-happy-veteran/community");
  const [{data:edibleTimes},{data:flowerTimes}]=await Promise.all([
    supabase.from("lounge_edible_times").select("id, label, minutes, position").order("position",{ascending:true}),
    supabase.from("lounge_flower_times").select("id, rating, minutes_1, minutes_2, minutes_3, minutes_4, position").order("position",{ascending:true}),
  ]);
  return <main className="admin-page thv-admin-theme"><div className="shell admin-shell">
    <header className="admin-header"><div><span className="eyebrow">Homegrown4Heroes administration</span><h1>Suggested Lounge Experience</h1><p>Edit the member lounge experience values on their own page.</p></div><div className="actions"><Link className="button button-ghost" href="/the-happy-veteran/admin">Admin Dashboard</Link><Link className="button button-ghost" href="/the-happy-veteran/lounge-experience">View Member Page</Link></div></header>
    <section className="admin-card lounge-experience-admin-card"><div className="experience-admin-grid">
      <section><h3>Edibles</h3><div className="experience-admin-list">{(edibleTimes||[]).map((item)=><form action={updateEdibleExperienceTime} className="experience-edible-admin-row" key={item.id}><input type="hidden" name="id" value={item.id}/><label>Label<input name="label" defaultValue={item.label} required/></label><label>Minutes<input name="minutes" type="number" min="0" step="1" defaultValue={item.minutes} required/></label><button className="button button-small button-ghost" type="submit">Save</button></form>)}</div></section>
      <section><h3>Flower</h3><p className="admin-form-note">Edit the four minute values shown for each flower rating.</p><div className="experience-admin-list">{(flowerTimes||[]).map((item)=><form action={updateFlowerExperienceTime} className="experience-flower-admin-row" key={item.id}><input type="hidden" name="id" value={item.id}/><label className="experience-rating-field">Rating<input name="rating" defaultValue={item.rating} required/></label>{[item.minutes_1,item.minutes_2,item.minutes_3,item.minutes_4].map((value,index)=><label key={index}>Min {index+1}<input name={`minutes${index+1}`} type="number" min="0" step="1" defaultValue={value} required/></label>)}<button className="button button-small button-ghost" type="submit">Save</button></form>)}</div></section>
    </div></section>
  </div></main>;
}
