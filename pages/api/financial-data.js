export default function handler(req, res) {
  const data = {
    lastUpdated: "6 April 2026",
    netPosition: -35394.64,
    totalAssets: 3290.09,
    totalDebt: 38684.73,
    monthlyIncome: 8347.08,
    monthlyOutgoings: 6901.25,
    monthlySurplus: 1445.83,
    monthlyInterestCost: 316.15,
    debtFreeDate: {
      optimistic: "February 2028",
      currentTrajectory: "December 2028",
    },
    accounts: [
      { name: "Westpac Choice Basic (576792)", type: "asset", balance: 1089.04 },
      { name: "Westpac Choice Basic (814552)", type: "asset", balance: 1115.81 },
      { name: "Westpac Life", type: "asset", balance: 1085.24 },
      { name: "ANZ Low Rate CC", type: "debt", balance: -13670.00, rate: 0.00, note: "0% BT promo until Feb 2028", priority: 4 },
      { name: "Westpac Personal Loan", type: "debt", balance: -10276.47, rate: 11.99, note: "Fixed rate, contractual $795.80/mo", priority: 3 },
      { name: "Altitude Qantas Black CC", type: "debt", balance: -8572.54, rate: 20.00, note: "ATTACK FIRST — highest rate", priority: 1 },
      { name: "Low Rate Mastercard", type: "debt", balance: -6165.72, rate: 13.74, note: "Attack second after Altitude", priority: 2 },
    ],
    debtPayoffPlan: [
      { step: 1, name: "Altitude Qantas Black CC", balance: 8572.54, rate: 20.00, targetPayment: 2500, payoffDate: "Aug 2026", months: 4 },
      { step: 2, name: "Low Rate Mastercard", balance: 6165.72, rate: 13.74, targetPayment: 2500, payoffDate: "Nov 2026", months: 3 },
      { step: 3, name: "Westpac Personal Loan", balance: 10276.47, rate: 11.99, targetPayment: 795.80, payoffDate: "Jan 2027", months: 14 },
      { step: 4, name: "ANZ Low Rate CC", balance: 13670.00, rate: 0.00, targetPayment: 600, payoffDate: "Feb 2028", months: 23 },
    ],
    monthlyBreakdown: {
      income: [
        { label: "Buchan Group Salary", amount: 7647.08 },
        { label: "Rental Support (Clare)", amount: 600.00 },
        { label: "Medicare/Misc", amount: 100.00 },
      ],
      fixedOutgoings: [
        { label: "Rent", amount: 2760.00 },
        { label: "Personal Loan", amount: 750.00 },
        { label: "ANZ CC", amount: 600.00 },
        { label: "Health Insurance (NIB)", amount: 155.82 },
        { label: "Car Insurance (Youi)", amount: 83.47 },
        { label: "Telstra Mobile", amount: 116.87 },
        { label: "Telstra Broadband", amount: 80.00 },
        { label: "Triclub (Jarrasport)", amount: 220.00 },
        { label: "Subscriptions (digital)", amount: 513.37 },
        { label: "Loan Account Fee", amount: 15.00 },
        { label: "Bicycle Insurance", amount: 80.72 },
      ],
      variableOutgoings: [
        { label: "Groceries", amount: 650.00 },
        { label: "Dining & Cafes", amount: 280.00 },
        { label: "Sport Gear & Events", amount: 300.00 },
        { label: "Pet (Petbarn)", amount: 60.00 },
        { label: "Transport", amount: 80.00 },
        { label: "Entertainment", amount: 150.00 },
      ],
    },
    recommendations: [
      {
        priority: "CRITICAL",
        title: "Stop using the Altitude Qantas Black CC for daily spend",
        detail: "Every dollar spent on this card costs 20% p.a. in interest. Transfer all daily spending to the Low Rate Mastercard or debit until this card is cleared.",
      },
      {
        priority: "CRITICAL",
        title: "Redirect Altitude CC ad hoc payments to a fixed $2,500/mo schedule",
        detail: "Current pattern ($700, $1,000, $2,000 etc.) is erratic. Set up an automatic $2,500/mo direct debit to the Altitude card to clear it by Aug 2026.",
      },
      {
        priority: "HIGH",
        title: "Pay the ANZ minimum before the due date — you're incurring late fees",
        detail: "A $20 late payment fee appeared on 08/03/26. Set up a BPAY direct debit for at least $286/mo minimum (ideally $600). The 0% promo is too valuable to lose.",
      },
      {
        priority: "HIGH",
        title: "Cancel or downgrade digital subscriptions — $513/mo is excessive",
        detail: "Make.com ($158), Claude.ai ($154), Anthropic API ($32), Google One ($33), Audible, Kayo, Crunchyroll, Twitch, Uber One. Total ~$513/mo. Review each. Consider pausing non-essential ones until Altitude CC is cleared.",
      },
      {
        priority: "MEDIUM",
        title: "Consolidate Telstra bills — two separate Telstra services ($197/mo)",
        detail: "Telstra Mobile $116.87 + Telstra Broadband $80 = $196.87/mo. Review whether bundling saves money or whether a cheaper mobile provider (e.g. Belong, Aussie Broadband) reduces this.",
      },
      {
        priority: "MEDIUM",
        title: "Japan trip / large one-off spend warning",
        detail: "Jan-Feb 2026 saw ~$5,000+ in Japan travel (hotel bookings, Seiko watch $1,447, ski boots $759, Klook $137, accommodation). These significantly delayed debt reduction. Budget explicitly for next travel event.",
      },
      {
        priority: "MEDIUM",
        title: "Start super contributions once Altitude CC is cleared (Aug 2026)",
        detail: "You have no visible super contributions appearing beyond employer SG. From Aug 2026, redirect freed $2,500/mo to Low Rate MC, then from Nov 2026 split freed cash between personal loan and salary sacrifice super. Target $500/mo salary sacrifice.",
      },
      {
        priority: "LOW",
        title: "Build a $5,000 emergency buffer in Westpac Life by mid-2027",
        detail: "Once personal loan is paid off (Jan 2027), redirect $795/mo to emergency fund. At this rate, $5k buffer is achievable within 7 months (Aug 2027). This prevents future credit card reliance.",
      },
    ],
    retirementProjection: {
      note: "Once debt-free (Feb 2028), with current income ~$8,347/mo:",
      freeCashflowPostDebt: 8347 - (2760 + 155.82 + 83.47 + 116.87 + 80 + 220 + 1520),
      steps: [
        "Feb 2028: Debt free. ~$3,411/mo available for wealth building.",
        "2028-2030: Max salary sacrifice super to reduce tax. At $27k concessional cap.",
        "2030+: Consider property or ETF investment with surplus (~$2,000/mo).",
        "Target: $1M super by age 60 requires ~$1,500/mo return @ 7% from age 35.",
      ],
    },
  };

  res.status(200).json(data);
}
