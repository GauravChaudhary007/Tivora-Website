"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Loaded only through loadGsap() in src/lib/scene.ts (dynamic import, after first paint). Never import this file statically.
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
gsap.defaults({ ease: "power3.out", duration: 0.8 });

export { MOTION_QUERIES, live } from "./scene";
export { gsap, ScrollTrigger };
