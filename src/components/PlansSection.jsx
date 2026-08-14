const plans = [
  {
    name: "Free", price: "₹0", period: "/ month",
    desc: "Perfect for getting started with AI assistance.",
    btn: "Get started free", btnType: "outline",
    features: ["20 messages per day", "Access to Luma 3.5", "Basic chat features", "Web access"],
  },
  {
    name: "Pro", price: "₹199", period: "/ month",
    desc: "For power users who need more speed and capability.",
    btn: "Upgrade to Pro", btnType: "fill", popular: true,
    features: ["Unlimited messages", "Access to Luma Pro model", "Priority response speed", "Advanced file uploads", "Projects & memory"],
  },
  {
    name: "Team", price: "₹399", period: "/ month",
    desc: "For teams that want to collaborate with AI together.",
    btn: "Contact sales", btnType: "outline",
    features: ["Everything in Pro", "Up to 10 team members", "Shared workspaces", "Admin dashboard", "Priority support"],
  },
];

export default function PlansSection() {
  return (
    <div className="luma-plans-wrap" style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div className="luma-badge">✦ Pricing</div>
      <h2 className="luma-section-title">Explore plans</h2>
      <p className="luma-section-sub">Choose the plan that fits your needs. Upgrade or downgrade anytime.</p>

      <div className="luma-plans-grid">
        {plans.map((p) => (
          <div key={p.name} className={`luma-plan-card ${p.popular ? "popular" : ""}`}>
            {p.popular && <div className="luma-popular-badge">Most popular</div>}
            <div className="luma-plan-name">{p.name}</div>
            <div className="luma-plan-price">{p.price} <span>{p.period}</span></div>
            <div className="luma-plan-desc">{p.desc}</div>
            <button className={`luma-plan-btn ${p.btnType === "fill" ? "fill" : "outline"}`}>{p.btn}</button>
            <ul className="luma-plan-features">
              {p.features.map((f) => (
                <li key={f}><span className="check">✓</span>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
