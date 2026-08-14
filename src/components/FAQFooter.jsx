import { useState } from "react";
import Logo from "./Logo";

const faqs = [
  { q: "What is LumaAI?", a: "LumaAI is an intelligent AI assistant that helps you with writing, coding, learning, and much more. Built for everyone." },
  { q: "Is LumaAI free to use?", a: "Yes! Free plan gives 20 messages/day. Upgrade to Pro or Team for unlimited access and advanced features." },
  { q: "What languages does LumaAI support?", a: "Hindi, English, and all major languages. It auto-detects your language and responds accordingly." },
  { q: "Can I cancel my subscription anytime?", a: "Yes. Cancel anytime from account settings. Pro access continues till end of billing period." },
  { q: "Is my data safe with LumaAI?", a: "All conversations are encrypted. We never sell your data. Delete your data anytime from settings." },
  { q: "How is LumaAI different from other AI tools?", a: "Built for India — Hindi support, INR pricing, and blazing fast responses powered by the best AI models." },
];

export function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <div className="luma-faq-wrap" style={{ maxWidth: 800, margin: "0 auto" }}>
      <div className="luma-badge">✦ FAQ</div>
      <h2 className="luma-section-title" style={{ marginBottom: 40 }}>Frequently asked questions</h2>
      {faqs.map((f, i) => (
        <div key={i} className="luma-faq-item" onClick={() => setOpen(open === i ? null : i)}>
          <div className="luma-faq-q">
            <span className="luma-faq-q-text">{f.q}</span>
            <span className="luma-faq-icon" style={{ transform: open === i ? "rotate(45deg)" : "none" }}>+</span>
          </div>
          {open === i && <div className="luma-faq-a">{f.a}</div>}
        </div>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <div className="luma-footer">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Logo size={28} />
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 4 }}>by Infygen · © 2026 All rights reserved</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        {["Privacy", "Terms", "Support", "Blog"].map(l => (
          <a key={l} href="#" className="luma-footer-link">{l}</a>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button className="luma-social-icon" title="Twitter / X">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </button>
        <button className="luma-social-icon" title="LinkedIn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </button>
        <button className="luma-social-icon" title="Instagram">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        </button>
      </div>
    </div>
  );
}
