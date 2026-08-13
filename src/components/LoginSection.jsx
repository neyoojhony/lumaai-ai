import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import AnimatedBackground from "./AnimatedBackground";
import Logo from "./Logo";

export default function LoginSection() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate("/chat");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <AnimatedBackground />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, padding: "20px 28px" }}>
        <Logo size={32} />
      </div>
      <div style={{
        position: "relative", zIndex: 2, width: 380,
        background: "rgba(10,10,12,0.78)", border: "0.5px solid rgba(255,255,255,0.1)",
        borderRadius: 16, padding: 36, backdropFilter: "blur(20px)"
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 400, color: "#e8e4d9", marginBottom: 6, letterSpacing: "-0.02em", textAlign: "center" }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 24, textAlign: "center" }}>
          Sign in to continue your conversations
        </p>

        <button className="luma-social-btn" onClick={handleGoogle} style={{ marginBottom: 20 }}>
          <GoogleIcon /> Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.07)" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>or</span>
          <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.07)" }} />
        </div>

        <input className="luma-input" type="email" placeholder="Email address" style={{ marginBottom: 10 }} />
        <input className="luma-input" type="password" placeholder="Password" />

        <button className="luma-btn-primary" style={{ marginTop: 14, width: "100%" }} onClick={handleGoogle}>
          Sign in to LumaAI
        </button>

        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.22)", textAlign: "center", marginTop: 14, lineHeight: 1.8 }}>
          Don't have an account? <a href="#" style={{ color: "#a78bfa" }} onClick={(e) => { e.preventDefault(); handleGoogle(); }}>Sign up free</a>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}