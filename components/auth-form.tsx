import Link from "next/link";
import { signIn, signUp } from "@/app/auth/actions";

export function LoginForm({ message }: { message?: string }) {
  return (
    <form action={signIn} className="login-card auth-form">
      <span className="eyebrow">Approved members</span>
      <h2>Welcome back</h2>
      {message && <p className="form-message">{message}</p>}
      <label>Email<input name="email" type="email" autoComplete="email" required /></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
      <button className="button button-full" type="submit">Sign in</button>
      <p className="form-note">New here? <Link href="/the-happy-veteran/signup">Request membership</Link>.</p>
    </form>
  );
}

export function SignupForm({ message }: { message?: string }) {
  return (
    <form action={signUp} className="login-card auth-form">
      <span className="eyebrow">Membership request</span>
      <h2>Join the community</h2>
      {message && <p className="form-message">{message}</p>}
      <label>Full name<input name="fullName" autoComplete="name" required /></label>
      <label>Discord username<input name="discordName" placeholder="Your current Discord name" required /></label>
      <label>Email<input name="email" type="email" autoComplete="email" required /></label>
      <label>Password<input name="password" type="password" minLength={8} autoComplete="new-password" required /></label>
      <button className="button button-full" type="submit">Submit request</button>
      <p className="form-note">Already registered? <Link href="/the-happy-veteran/login">Sign in</Link>.</p>
    </form>
  );
}
