import { LoginForm } from "@/components/auth-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const { message } = await searchParams;
  return <main className="community-page thv-auth-theme"><div className="shell community-layout"><section className="community-intro"><span className="eyebrow">Private member space</span><h1>Sign in to the community.</h1><p className="lead">Approved members can see today’s shares, place an order, and participate in private conversations.</p></section><LoginForm message={message} /></div></main>;
}
