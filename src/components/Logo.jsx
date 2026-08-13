export default function Logo({ size = 32 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="27" stroke="rgba(124,95,230,0.35)" strokeWidth="0.8"/>
        <line x1="30" y1="3" x2="30" y2="8" stroke="rgba(124,95,230,0.45)" strokeWidth="0.8"/>
        <line x1="30" y1="52" x2="30" y2="57" stroke="rgba(124,95,230,0.45)" strokeWidth="0.8"/>
        <line x1="3" y1="30" x2="8" y2="30" stroke="rgba(124,95,230,0.45)" strokeWidth="0.8"/>
        <line x1="52" y1="30" x2="57" y2="30" stroke="rgba(124,95,230,0.45)" strokeWidth="0.8"/>
        <line x1="9" y1="9" x2="13" y2="13" stroke="rgba(124,95,230,0.3)" strokeWidth="0.8"/>
        <line x1="47" y1="47" x2="51" y2="51" stroke="rgba(124,95,230,0.3)" strokeWidth="0.8"/>
        <line x1="51" y1="9" x2="47" y2="13" stroke="rgba(124,95,230,0.3)" strokeWidth="0.8"/>
        <line x1="13" y1="47" x2="9" y2="51" stroke="rgba(124,95,230,0.3)" strokeWidth="0.8"/>
        <polygon points="30,12 42,26 30,48 18,26" fill="rgba(90,60,200,0.5)" stroke="#a78bfa" strokeWidth="0.8"/>
        <polygon points="30,12 42,26 30,30" fill="rgba(124,95,230,0.65)" stroke="#c4b5fd" strokeWidth="0.5"/>
        <polygon points="30,12 18,26 30,30" fill="rgba(80,50,180,0.65)" stroke="#a78bfa" strokeWidth="0.5"/>
        <polygon points="18,26 30,48 30,30" fill="rgba(60,35,160,0.75)" stroke="#8b6fd4" strokeWidth="0.5"/>
        <polygon points="42,26 30,48 30,30" fill="rgba(100,70,210,0.65)" stroke="#a78bfa" strokeWidth="0.5"/>
        <line x1="30" y1="12" x2="30" y2="48" stroke="rgba(196,181,253,0.2)" strokeWidth="0.5" strokeDasharray="2,3"/>
        <line x1="18" y1="26" x2="42" y2="26" stroke="rgba(196,181,253,0.2)" strokeWidth="0.5" strokeDasharray="2,3"/>
        <circle cx="30" cy="30" r="1.5" fill="#c4b5fd"/>
      </svg>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: size * 0.55, fontWeight: 500, color: "#e8e4d9", letterSpacing: "-0.01em", lineHeight: 1 }}>
          luma<span style={{ color: "#a78bfa" }}>AI</span>
        </span>
        <span style={{ fontSize: size * 0.25, color: "rgba(255,255,255,0.3)", letterSpacing: "0.18em", marginTop: 2 }}>
          INTELLIGENT CONVERSATION
        </span>
      </div>
    </div>
  );
}
