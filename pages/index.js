import { useState, useEffect } from "react";
import Head from "next/head";

const fmt = (n) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

const fmtDec = (n) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(n);

const PRIORITY_COLORS = {
  CRITICAL: { bg: "#fee2e2", border: "#ef4444", text: "#991b1b", dot: "#dc2626" },
  HIGH:     { bg: "#fef3c7", border: "#f59e0b", text: "#92400e", dot: "#d97706" },
  MEDIUM:   { bg: "#dbeafe", border: "#3b82f6", text: "#1e3a8a", dot: "#2563eb" },
  LOW:      { bg: "#dcfce7", border: "#22c55e", text: "#14532d", dot: "#16a34a" },
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetch("/api/financial-data")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0f172a" }}>
      <div style={{ color: "#94a3b8", fontSize: 18 }}>Loading ARIA Financial Dashboard...</div>
    </div>
  );

  const tabs = ["overview", "debts", "cashflow", "plan", "retirement"];

  return (
    <>
      <Head>
        <title>ARIA Financial Dashboard — Jake Alderman</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

        {/* Header */}
        <div style={{ background: "#1e293b", borderBottom: "1px solid #334155", padding: "20px 32px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>ARIA Financial Dashboard</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>Jake Martin Alderman · Updated {data.lastUpdated}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>Net Position</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: data.netPosition < 0 ? "#f87171" : "#4ade80" }}>
                {fmtDec(data.netPosition)}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div style={{ background: "#1e293b", borderBottom: "1px solid #334155" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 0 }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "14px 22px", fontSize: 13, fontWeight: 500,
                  color: activeTab === tab ? "#38bdf8" : "#94a3b8",
                  borderBottom: activeTab === tab ? "2px solid #38bdf8" : "2px solid transparent",
                  textTransform: "capitalize", transition: "color 0.15s",
                }}
              >
                {tab === "plan" ? "Payoff Plan" : tab === "cashflow" ? "Cash Flow" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 32px" }}>

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div>
              {/* Top KPI Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
                {[
                  { label: "Total Debt", value: fmt(-data.totalDebt), color: "#f87171", sub: "across 4 facilities" },
                  { label: "Total Assets", value: fmt(data.totalAssets), color: "#4ade80", sub: "cash & savings" },
                  { label: "Monthly Surplus", value: fmt(data.monthlySurplus), color: "#fb923c", sub: "before extra debt payments" },
                  { label: "Monthly Interest", value: fmt(-data.monthlyInterestCost), color: "#f87171", sub: "being charged right now" },
                  { label: "Debt-Free (Optimistic)", value: data.debtFreeDate.optimistic, color: "#38bdf8", sub: "with aggressive paydown" },
                  { label: "Debt-Free (Current Track)", value: data.debtFreeDate.currentTrajectory, color: "#94a3b8", sub: "no behaviour change" },
                ].map((kpi) => (
                  <div key={kpi.label} style={{ background: "#1e293b", borderRadius: 12, padding: "20px 22px", border: "1px solid #334155" }}>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{kpi.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{kpi.sub}</div>
                  </div>
                ))}
              </div>

              {/* Debt Waterfall Bar */}
              <div style={{ background: "#1e293b", borderRadius: 12, padding: "24px", border: "1px solid #334155", marginBottom: 28 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 16 }}>Debt Composition</div>
                {data.accounts.filter(a => a.type === "debt").sort((a,b) => b.balance - a.balance).map((acc) => {
                  const pct = (Math.abs(acc.balance) / data.totalDebt) * 100;
                  const colors = { 1: "#ef4444", 2: "#f97316", 3: "#eab308", 4: "#22c55e" };
                  return (
                    <div key={acc.name} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 13, color: "#cbd5e1" }}>{acc.name}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: colors[acc.priority] }}>{fmtDec(acc.balance)} · {acc.rate}% p.a.</span>
                      </div>
                      <div style={{ background: "#334155", borderRadius: 4, height: 10, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: colors[acc.priority], borderRadius: 4 }} />
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{acc.note}</div>
                    </div>
                  );
                })}
              </div>

              {/* Recommendations */}
              <div style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 14 }}>Action Items</div>
              <div style={{ display: "grid", gap: 12 }}>
                {data.recommendations.map((rec, i) => {
                  const c = PRIORITY_COLORS[rec.priority];
                  return (
                    <div key={i} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: "16px 18px", display: "flex", gap: 14 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.dot, marginTop: 5, flexShrink: 0 }} />
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, background: c.dot, color: "#fff", padding: "2px 7px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>{rec.priority}</span>
                          <span style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{rec.title}</span>
                        </div>
                        <div style={{ fontSize: 13, color: c.text, opacity: 0.85, lineHeight: 1.5 }}>{rec.detail}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DEBTS TAB */}
          {activeTab === "debts" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
                {data.accounts.filter(a => a.type === "debt").sort((a,b) => a.priority - b.priority).map((acc) => {
                  const colors = { 1: "#ef4444", 2: "#f97316", 3: "#eab308", 4: "#22c55e" };
                  const col = colors[acc.priority];
                  return (
                    <div key={acc.name} style={{ background: "#1e293b", border: `1px solid ${col}44`, borderTop: `3px solid ${col}`, borderRadius: 12, padding: "22px" }}>
                      <div style={{ fontSize: 11, color: col, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Priority {acc.priority}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 14 }}>{acc.name}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                        <div>
                          <div style={{ fontSize: 11, color: "#64748b" }}>Balance</div>
                          <div style={{ fontSize: 22, fontWeight: 700, color: col }}>{fmtDec(acc.balance)}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: "#64748b" }}>Interest Rate</div>
                          <div style={{ fontSize: 22, fontWeight: 700, color: acc.rate === 0 ? "#4ade80" : col }}>{acc.rate}%</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: "#94a3b8", background: "#0f172a", borderRadius: 8, padding: "10px 12px" }}>{acc.note}</div>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: "22px", marginTop: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 12 }}>Assets</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                  {data.accounts.filter(a => a.type === "asset").map((acc) => (
                    <div key={acc.name} style={{ background: "#0f172a", borderRadius: 8, padding: "14px 16px" }}>
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{acc.name}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "#4ade80" }}>{fmtDec(acc.balance)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CASH FLOW TAB */}
          {activeTab === "cashflow" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: "#1e293b", borderRadius: 12, padding: "22px", border: "1px solid #334155" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#4ade80", marginBottom: 16 }}>Monthly Income — {fmt(data.monthlyIncome)}</div>
                {data.monthlyBreakdown.income.map((item) => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1e293b" }}>
                    <span style={{ fontSize: 13, color: "#cbd5e1" }}>{item.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#4ade80" }}>{fmtDec(item.amount)}</span>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ background: "#1e293b", borderRadius: 12, padding: "22px", border: "1px solid #334155", marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#f87171", marginBottom: 16 }}>Fixed Outgoings — {fmt(data.monthlyBreakdown.fixedOutgoings.reduce((a,b)=>a+b.amount,0))}</div>
                  {data.monthlyBreakdown.fixedOutgoings.map((item) => (
                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #0f172a" }}>
                      <span style={{ fontSize: 12, color: "#cbd5e1" }}>{item.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#f87171" }}>{fmtDec(item.amount)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#1e293b", borderRadius: 12, padding: "22px", border: "1px solid #334155" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#fb923c", marginBottom: 16 }}>Variable Outgoings — {fmt(data.monthlyBreakdown.variableOutgoings.reduce((a,b)=>a+b.amount,0))}</div>
                  {data.monthlyBreakdown.variableOutgoings.map((item) => (
                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #0f172a" }}>
                      <span style={{ fontSize: 12, color: "#cbd5e1" }}>{item.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#fb923c" }}>{fmtDec(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ gridColumn: "1 / -1", background: "#1e293b", borderRadius: 12, padding: "22px", border: "1px solid #334155" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                  {[
                    { label: "Total Income", value: data.monthlyIncome, color: "#4ade80" },
                    { label: "Total Outgoings", value: -data.monthlyOutgoings, color: "#f87171" },
                    { label: "Monthly Surplus", value: data.monthlySurplus, color: data.monthlySurplus > 0 ? "#fb923c" : "#f87171" },
                  ].map((item) => (
                    <div key={item.label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{fmtDec(item.value)}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, padding: "12px 16px", background: "#0f172a", borderRadius: 8, fontSize: 13, color: "#94a3b8" }}>
                  Note: The {fmt(data.monthlySurplus)} surplus represents available cash after all regular payments but before the additional CC payments visible in the transaction data. The Altitude Qantas CC ad hoc transfers ($700–$2,164 per payment) come from this pool.
                </div>
              </div>
            </div>
          )}

          {/* PAYOFF PLAN TAB */}
          {activeTab === "plan" && (
            <div>
              <div style={{ background: "#1e293b", borderRadius: 12, padding: "24px", border: "1px solid #334155", marginBottom: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#38bdf8", marginBottom: 6 }}>Recommended Payoff Strategy — Debt Avalanche</div>
                <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
                  Attack highest-interest debt first. Minimum payments on all others. Redirect freed cash to next target. Do not use the Altitude CC for purchases during paydown.
                </div>
              </div>

              <div style={{ display: "grid", gap: 16 }}>
                {data.debtPayoffPlan.map((step, i) => (
                  <div key={i} style={{ background: "#1e293b", borderRadius: 12, padding: "22px 24px", border: "1px solid #334155", display: "flex", gap: 20, alignItems: "flex-start" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: ["#ef4444","#f97316","#eab308","#22c55e"][i], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: "#fff", flexShrink: 0 }}>
                      {step.step}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 10 }}>{step.name}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                        {[
                          { label: "Balance", value: fmtDec(step.balance), color: "#f87171" },
                          { label: "Interest Rate", value: `${step.rate}% p.a.`, color: step.rate === 0 ? "#4ade80" : "#fb923c" },
                          { label: "Target Payment", value: `${fmt(step.targetPayment)}/mo`, color: "#38bdf8" },
                          { label: "Target Payoff", value: step.payoffDate, color: "#a78bfa" },
                        ].map((kpi) => (
                          <div key={kpi.label} style={{ background: "#0f172a", borderRadius: 8, padding: "10px 12px" }}>
                            <div style={{ fontSize: 10, color: "#64748b", marginBottom: 3 }}>{kpi.label}</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#0f172a", borderRadius: 12, padding: "20px 24px", border: "1px solid #1e3a8a", marginTop: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#38bdf8", marginBottom: 8 }}>Timeline Summary</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {[
                    { date: "Aug 2026", event: "Altitude Qantas Black CC cleared. Free up $2,500/mo." },
                    { date: "Nov 2026", event: "Low Rate Mastercard cleared. Free up further $2,500/mo." },
                    { date: "Jan 2027", event: "Westpac Personal Loan paid off. Free up $795/mo. Start emergency fund." },
                    { date: "Feb 2028", event: "ANZ 0% BT cleared before promo expires. DEBT FREE. Net position goes positive." },
                    { date: "2028+", event: "Begin serious wealth accumulation: super salary sacrifice, ETF investments." },
                  ].map((item) => (
                    <div key={item.date} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#38bdf8", minWidth: 80, marginTop: 1 }}>{item.date}</div>
                      <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>{item.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* RETIREMENT TAB */}
          {activeTab === "retirement" && (
            <div>
              <div style={{ background: "#1e293b", borderRadius: 12, padding: "24px", border: "1px solid #334155", marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#a78bfa", marginBottom: 12 }}>Post-Debt Financial Freedom Projection</div>
                <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, marginBottom: 16 }}>
                  Once debt-free (Feb 2028), at current income and without the debt burden, free monthly cashflow rises to approximately:
                </div>
                <div style={{ fontSize: 36, fontWeight: 800, color: "#4ade80", marginBottom: 4 }}>{fmtDec(data.retirementProjection.freeCashflowPostDebt)}/mo</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>available for wealth building (after rent, insurance, subscriptions, living costs)</div>
              </div>

              <div style={{ background: "#1e293b", borderRadius: 12, padding: "24px", border: "1px solid #334155", marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 16 }}>Wealth Building Roadmap</div>
                <div style={{ display: "grid", gap: 14 }}>
                  {data.retirementProjection.steps.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6, paddingTop: 4 }}>{step}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  {
                    title: "Super Contribution Target",
                    icon: "🏦",
                    color: "#a78bfa",
                    items: [
                      "Concessional cap: $30,000/yr (FY2026+)",
                      "Employer SG at 11.5% of ~$95k salary = ~$10,925/yr",
                      "Room for salary sacrifice: ~$19,075/yr (~$1,590/mo)",
                      "Start salary sacrifice from Nov 2026 when MC cleared",
                      "Tax saving at 32.5% bracket: ~$6,200/yr",
                    ],
                  },
                  {
                    title: "Investment Strategy (from 2028)",
                    icon: "📈",
                    color: "#38bdf8",
                    items: [
                      "Emergency fund: $10k–$15k (Westpac Life or HISA)",
                      "ETF investment: $1,000–$1,500/mo (VGS + VAS split)",
                      "Consider offset account if purchasing property",
                      "SWD income: develop into $500–$1,000/mo passive",
                      "SARO client growth: target $10k+ consulting revenue",
                    ],
                  },
                ].map((card) => (
                  <div key={card.title} style={{ background: "#1e293b", borderRadius: 12, padding: "22px", border: "1px solid #334155" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: card.color, marginBottom: 14 }}>{card.icon} {card.title}</div>
                    <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                      {card.items.map((item, i) => (
                        <li key={i} style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 10, padding: "14px 18px", marginTop: 16, fontSize: 11, color: "#475569" }}>
                Please note, this document was formatted using AI but was checked by a human. Not financial advice — for informational purposes only. Consult a licensed financial adviser before making major financial decisions.
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
