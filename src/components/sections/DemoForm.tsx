"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheck, LoaderCircle, Phone } from "lucide-react";
import { site } from "@/lib/site";

type State = { status: "idle" | "sending" | "sent" | "error"; message?: string };

const industries = ["Jewellery", "Paint", "FMCG", "Manufacturing", "Trading", "Pharmaceutical", "Automobile", "Other"];

const field =
  "h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-teal-light/60 focus:bg-white/[0.06]";

export function DemoForm() {
  const [state, setState] = useState<State>({ status: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState({ status: "sending" });
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setState({ status: "sent" });
    } catch (err) {
      setState({ status: "error", message: (err as Error).message });
    }
  }

  return (
    <div className="relative rounded-3xl border border-white/10 bg-midnight-900/80 p-5 backdrop-blur sm:p-7">
      <AnimatePresence mode="wait">
        {state.status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex min-h-[380px] flex-col items-center justify-center text-center"
          >
            <CircleCheck className="size-12 text-teal-light" aria-hidden />
            <p className="mt-4 text-xl font-semibold text-white">Thank you — request received.</p>
            <p className="mt-2 max-w-xs text-sm text-white/60">Our team will reach out to schedule your Tivora demo.</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} className="grid gap-3" exit={{ opacity: 0 }}>
            <p className="text-lg font-semibold text-white">Book a demo</p>
            <p className="-mt-1 mb-1 text-sm text-white/50">Tell us a little about your business.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="sr-only" htmlFor="df-name">Full name</label>
              <input id="df-name" name="name" required autoComplete="name" placeholder="Full name" className={field} />
              <label className="sr-only" htmlFor="df-company">Company</label>
              <input id="df-company" name="company" autoComplete="organization" placeholder="Company" className={field} />
              <label className="sr-only" htmlFor="df-phone">Phone</label>
              <input id="df-phone" name="phone" type="tel" autoComplete="tel" placeholder="Phone" className={field} />
              <label className="sr-only" htmlFor="df-email">Work email</label>
              <input id="df-email" name="email" type="email" autoComplete="email" placeholder="Work email" className={field} />
            </div>
            <label className="sr-only" htmlFor="df-industry">Industry</label>
            <select id="df-industry" name="industry" defaultValue="" className={`${field} appearance-none text-white/70`}>
              <option value="" disabled className="text-midnight">Industry</option>
              {industries.map((i) => (
                <option key={i} value={i} className="text-midnight">{i}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="df-message">Message</label>
            <textarea id="df-message" name="message" rows={3} placeholder="What would you like to see? (optional)" className={`${field} h-auto py-3`} />

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              disabled={state.status === "sending"}
              className="mt-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo text-[15px] font-semibold text-white transition-colors hover:bg-[#4757ea] disabled:opacity-70"
            >
              {state.status === "sending" && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
              {state.status === "sending" ? "Sending…" : "Request a demo"}
            </motion.button>

            <AnimatePresence>
              {state.status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  role="alert"
                  className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-3.5 py-2.5 text-[13px] text-amber-100"
                >
                  {state.message} Please call us on{" "}
                  <a className="font-semibold underline" href={`tel:${site.phones[0].replace(/-/g, "")}`}>
                    {site.phones[0]}
                  </a>
                  .
                </motion.p>
              )}
            </AnimatePresence>

            <p className="flex items-center justify-center gap-1.5 text-[12px] text-white/40">
              <Phone className="size-3.5" aria-hidden /> Prefer to talk? {site.phones.join(" · ")}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
