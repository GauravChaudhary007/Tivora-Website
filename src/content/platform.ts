// Platform and Work Desk copy, from the CEO brochure (pp. 2-10). Sample figures are deliberately left out.

export const truthRows = [
  ["Staff start the day asking \"what should I do?\"", "My Work Desk shows today's tasks, critical items and pending work, and lets them finish it from the same screen."],
  ["Review meetings run on memory and assumption", "Live dashboards and KPIs for every department and every person."],
  ["The same transaction is typed in sales, store and accounts", "Single entry. One document flows into every linked step with one click."],
  ["Managers chase approvals, dues and dispatches", "Workflow and approval engines route, remind and escalate automatically."],
  ["Mistakes are found at month end", "Guardrails warn before a wrong action: credit limit, low margin, near expiry, budget overrun."],
  ["Plans live in Excel, far from execution", "Forecast, MRP and project budgets drive purchase, production and spending directly."],
  ["Generic software forces you to change how you work", "Customised solutions for your industry: Jewellery, Paint, FMCG, Pharmacy, Automobile, Trading, Manufacturing."],
] as const;

export const pillars = [
  { title: "Intelligent", body: "It knows every open item in your business and acts like your manager: what to do, why it matters and what comes next." },
  { title: "Integrated", body: "Every module on one database. Every entry updates stock, ledgers, dashboards and KPIs the moment it is saved." },
  { title: "Focused", body: "Each person sees only what matters to their role, so attention goes to the work that moves your targets." },
];

export const salesChain = [
  { title: "Quotation", detail: "Customer, items and price list", auto: "Applies price list, schemes and VAT; sends it by email or WhatsApp." },
  { title: "Sales order", detail: "One click from the quotation", auto: "Checks credit limit, floor rate and stock; holds for approval if a rule is crossed." },
  { title: "Challan", detail: "Delivery note from the order", auto: "Reduces stock, picks batch by expiry, assigns own vehicle or transporter." },
  { title: "Invoice", detail: "Tax invoice from the challan", auto: "Posts sales, VAT and receivable ledgers, connects to IRD, locks the issued bill." },
  { title: "Send to customer", detail: "From the same screen", auto: "Invoice PDF reaches the customer's email and WhatsApp in minutes." },
  { title: "Receipt", detail: "Payment set against bills", auto: "Updates customer ageing, salesperson target and cash position." },
];

export const purchaseChain = ["Reorder", "Purchase order", "Goods received", "Bill", "Landed cost", "Payment"];
export const productionChain = ["Plan", "Production order", "Material to floor", "Receipt costed batch by batch", "Variance"];

export const approvalFlow = [
  { title: "Document saved", detail: "PO, sales order, payment, discount, journal." },
  { title: "Rule engine checks", detail: "Amount, discount %, credit limit, margin, budget, user role. Within limits: no approval needed." },
  { title: "Approval levels", detail: "For example Level 1 branch manager up to Rs 5 L, Level 2 general manager up to Rs 25 L, Level 3 director above Rs 25 L. Each company sets its own." },
  { title: "Auto-escalation", detail: "No action in 4 hours: reminder, then next level." },
  { title: "Rejected", detail: "Back to the maker with a comment." },
  { title: "Posted automatically", detail: "Once approved: stock, ledgers and KPIs update, the maker is notified, the full audit trail is saved." },
];

export const guardrails = ["Rate below floor? Needs approval.", "Discount above limit? Needs approval.", "Issued IRD bill? Locked forever."];

export const controlFacts = [
  "Approval PIN and multi-factor login for every approver.",
  "Full context on the approval: bill, limit, overdue.",
  "Audit trail for the owner: who created, who approved, when.",
  "Approve from the Work Desk wherever you are.",
];

export const mrpFlow = [
  { title: "Forecast and confirmed orders", detail: "Your sales forecast and confirmed orders set the demand." },
  { title: "BOM explosion", detail: "Demand is exploded through the bill of materials." },
  { title: "Net of stock and open POs", detail: "Stock and open orders are netted off." },
  { title: "Lead-time scheduling", detail: "Each item is scheduled by its lead time." },
  { title: "Purchase and work orders", detail: "What to buy, what to make and by when." },
];

export const planningFacts = [
  "Sales forecast from history, season and targets.",
  "Production plan by plant, line and shift.",
  "Reorder policy per product group.",
];
export const executionFacts = [
  "Purchase requests and work orders created from the workbench.",
  "Imported items scheduled with LC and shipping lead time.",
  "Plan vs actual tracked daily on the dashboard.",
];

export const costSteps = [
  { title: "Plan", detail: "Standard cost from the BOM and the production plan, before a single batch starts." },
  { title: "Compare", detail: "Actual against standard for every batch, product and stage, the day it is received." },
  { title: "Correct", detail: "Imports too: landed cost estimate against actual for every charge on every shipment." },
];

export const taxFacts = [
  "VAT on every line and every document.",
  "Annex 9 and Annex 13 reports.",
  "TDS and income tax.",
  "Connected to IRD; issued bills locked forever.",
  "Bikram Sambat and AD dates; Nepali fiscal year.",
];
export const tradeFacts = [
  "Letters of credit: register, margin held, documents and acceptance.",
  "Trust receipt and short-term loans: statements and due dates.",
  "Bank limits: limit, used and headroom per facility, with alerts.",
  "Bank guarantees and foreign-currency settlement.",
];

export const landedCost = [
  ["Goods", "Purchase order and bill"],
  ["Customs duty", "Manual, per line"],
  ["Inland freight", "Weight"],
  ["Marine insurance", "Value"],
  ["Clearing and forwarding (CHA)", "Value"],
  ["LC and bank charges", "Value"],
  ["Port and ICD charges", "Value"],
] as const;

export const deskReminders = [
  "Tasks generated from live transactions, not typed manually.",
  "Due follow-ups, collections, dispatches and approvals in one queue.",
  "Escalation to the manager when a task overruns.",
];
export const deskStops = [
  "Sale beyond credit limit goes for approval.",
  "Price below minimum or margin below floor is flagged.",
  "Near-expiry batch is suggested first; spend beyond budget is blocked.",
];
export const deskParts = [
  { label: "Needs you now", body: "Critical items first, such as a credit approval or an order past its due date, then what is due today and this week, each with the button that deals with it." },
  { label: "TiVora reminds you", body: "A prompt when a pattern needs action, such as customers who usually reorder and have not, with a one-click way to create the follow-up tasks for your team." },
  { label: "Around you", body: "What is happening in other departments that touches your work: stock below reorder level, a loan headroom alert, a payment received." },
];

export const meetingSteps = [
  { title: "Open the dashboard", detail: "Not a spreadsheet someone prepared last night." },
  { title: "Start with exceptions", detail: "What is red, who owns it, by when." },
  { title: "Review each person's KPIs", detail: "Against target, live." },
  { title: "Assign actions", detail: "They land directly on each person's Work Desk." },
];

export const kpiLibrary = [
  ["Sales", "Target vs achievement, new customers, quotation conversion, order value, visit compliance, collection efficiency"],
  ["Purchase", "On-time delivery by vendor, price variance, PO cycle time, vendor rating"],
  ["Production", "Plan adherence, output vs standard, wastage %, cost per unit, machine downtime"],
  ["Store & Inventory", "Inventory days, stock accuracy, near-expiry value, dead stock, dispatch turnaround"],
  ["Finance", "Receivable and payable days, cash position, budget vs actual, margin by product and customer"],
  ["Customer Service", "Complaints opened and closed, resolution time, repeat complaints"],
] as const;
