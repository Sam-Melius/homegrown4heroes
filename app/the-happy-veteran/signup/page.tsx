import { SignupForm } from "@/components/auth-form";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const { message } = await searchParams;
  return <main className="community-page thv-auth-theme"><div className="shell community-layout"><section className="community-intro"><span className="eyebrow">Verified membership</span><h1>Request access.</h1><p className="lead">Enter your Member ID to request access. After email confirmation, the request remains pending until Jennifer manually approves it.</p><div className="approval-steps"><div><strong>1</strong><span>Verify email</span></div><div><strong>2</strong><span>Membership reviewed</span></div><div><strong>3</strong><span>Account approved</span></div><div><strong>4</strong><span>Community unlocked</span></div></div></section><SignupForm message={message} /></div></main>;
}
