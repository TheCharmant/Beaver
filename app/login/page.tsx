"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { FormEvent, useState } from "react";
import "./login.css";

type View = "login" | "register" | "forgot";

export default function LoginPage() {
  const [view, setView] = useState<View>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  const selectView = (next: View) => {
    setView(next);
    setNotice("");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(view === "forgot" ? "If an account exists for that email, we’ll send reset instructions shortly." : "Authentication will be connected securely before portal access is enabled.");
    try {
      const form = event.currentTarget as HTMLFormElement;
      const fd = new FormData(form);
      const email = fd.get("email");
      const name = fd.get("name");
      if (email) {
        localStorage.setItem("beaver_user_email", String(email));
      }
      if (name) {
        localStorage.setItem("beaver_user_name", String(name));
      }
    } catch (e) {
      // ignore storage errors in environments without localStorage
    }
  };

  const copy = {
    login: { eyebrow: "WELCOME BACK", title: "Your project hub, all in one place.", detail: "Sign in to see your projects, files, tasks, and messages.", action: "Sign in" },
    register: { eyebrow: "CREATE YOUR ACCOUNT", title: "Start building with clarity.", detail: "Create your student portal account and keep every project detail together.", action: "Create account" },
    forgot: { eyebrow: "PASSWORD RECOVERY", title: "Let’s get you back in.", detail: "Enter your email address and we’ll send you a secure reset link.", action: "Send reset link" },
  }[view];

  return (
    <main className="portal-shell">
      <section className="portal-intro">
        <a className="portal-brand" href="/" aria-label="BEAVER home"><span>B</span> BEAVER</a>
        <div className="intro-content">
          <p className="portal-kicker">BE A VERsion of Success.</p>
          <h1>Bring your best work<br />into focus.</h1>
          <p>One focused workspace for research, engineering, development, and defense preparation.</p>
          <div className="intro-points">
            <span><CheckCircle2 size={16} /> Track every milestone</span>
            <span><CheckCircle2 size={16} /> Keep files and feedback together</span>
            <span><CheckCircle2 size={16} /> Collaborate with your support team</span>
          </div>
        </div>
        <p className="portal-footer">© 2026 BeaverSolutions</p>
      </section>

      <section className="portal-panel">
        <a className="back-home" href="/"><ArrowLeft size={15} /> Back to site</a>
        <div className="auth-card">
          <p className="auth-kicker">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
          <p className="auth-detail">{copy.detail}</p>

          {view !== "forgot" && <button className="google-button" type="button" onClick={() => setNotice("Google sign-in will be available when the authentication service is connected.")}><GoogleMark /> Continue with Google</button>}
          {view !== "forgot" && <div className="or-divider"><span />or continue with email<span /></div>}

          <form className="auth-form" onSubmit={submit}>
            {view === "register" && <label>Full name<div className="input-wrap"><UserRound size={17} /><input required name="name" type="text" placeholder="Your full name" autoComplete="name" /></div></label>}
            <label>Email address<div className="input-wrap"><Mail size={17} /><input required name="email" type="email" placeholder="you@example.com" autoComplete="email" /></div></label>
            {view !== "forgot" && <label>Password<div className="input-wrap"><LockKeyhole size={17} /><input required type={showPassword ? "text" : "password"} placeholder="Enter your password" autoComplete={view === "login" ? "current-password" : "new-password"} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>}
            {view === "login" && <button className="forgot-link" type="button" onClick={() => selectView("forgot")}>Forgot password?</button>}
            <button className="auth-submit" type="submit">{copy.action} <ArrowRight size={17} /></button>
          </form>

          {notice && <p className="auth-notice" role="status">{notice}</p>}
          <p className="auth-switch">{view === "login" ? <>New to BEAVER? <button onClick={() => selectView("register")}>Create an account</button></> : view === "register" ? <>Already have an account? <button onClick={() => selectView("login")}>Sign in</button></> : <>Remembered your password? <button onClick={() => selectView("login")}>Back to sign in</button></>}</p>
        </div>
      </section>
    </main>
  );
}

function GoogleMark() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M21.8 12.23c0-.71-.06-1.39-.18-2.04H12v3.86h5.5a4.7 4.7 0 0 1-2.04 3.08v2.5h3.22c1.88-1.73 3.12-4.29 3.12-7.4Z"/><path fill="#34A853" d="M12 22c2.75 0 5.05-.91 6.73-2.37l-3.22-2.5c-.9.6-2.04.96-3.51.96-2.65 0-4.9-1.79-5.7-4.2H3v2.58A10.16 10.16 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.3 13.89A6.1 6.1 0 0 1 6 12c0-.66.11-1.29.3-1.89V7.53H3A10.1 10.1 0 0 0 1.9 12c0 1.62.39 3.15 1.1 4.47l3.3-2.58Z"/><path fill="#EA4335" d="M12 5.91c1.59 0 3.02.55 4.14 1.62l3.1-3.1C17.04 2.38 14.75 1 12 1A10.16 10.16 0 0 0 3 7.53l3.3 2.58c.8-2.41 3.05-4.2 5.7-4.2Z"/></svg>;
}
