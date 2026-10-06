// Beat copy for "Follow one bill" (docs/REVAMP-SPEC.md Scene 1). Module lines are the app's own wording.
export const BEATS = [
  {
    tag: "Counter",
    title: "A bill at the counter.",
    body: "Sales & Accounts Receivable: billing at the counter, orders and estimates, receipts, and what customers owe.",
    card: ["Sales & Accounts Receivable", "Bill raised."],
  },
  {
    tag: "Godown",
    title: "The stock moves with it.",
    body: "Store & Inventory: items, today's rate, where stock is, and everything that moves it. FIFO, LIFO, moving average or board-rate valuation.",
    card: ["Store & Inventory", "Stock moves with it."],
  },
  {
    tag: "Floor",
    title: "The floor knows what to make.",
    body: "Production: BOMs, production plans and orders, material to the floor, receipts costed batch by batch, variance and the Production Journal.",
    card: ["Production", "Material to the floor."],
  },
  {
    tag: "Ledger",
    title: "And the ledger already has it.",
    body: "Finance & Accounts, Tax & IRD: true double-entry, VAT worked out on each line and gathered into the VAT books, Annex 9 and Annex 13.",
    card: ["Finance & Accounts, Tax & IRD", "Double-entry and the VAT books."],
  },
];
