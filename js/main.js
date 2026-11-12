import { content as C } from "./content.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const { gsap, ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);

// ── render content ──────────────────────────────────────
document.title = `${C.name} | ${C.role}`;
$("#preMark").textContent = C.initials;
$("#navLogo").textContent = C.initials;
$("#navStatusText").textContent = C.availability;
$("#heroRole").textContent = C.role;
$("#heroTag").textContent = C.tagline;
$("#heroName").innerHTML = `<span class="line" aria-hidden="true">${[...C.name].map((ch) => `<span class="char">${ch === " " ? "&nbsp;" : esc(ch)}</span>`).join("")}</span>`;
$("#heroName").setAttribute("aria-label", C.name);

const resume = $("#heroResume");
C.links.resume ? (resume.href = C.links.resume) : resume.remove();

$("#stats").innerHTML = C.stats.map((s) =>
  `<div class="stat"><div class="stat__n">${esc(s.prefix ?? "")}<span data-count="${s.value}">0</span><em>${esc(s.suffix)}</em></div><div class="stat__l">${esc(s.label)}</div></div>`
).join("");

$("#aboutHeading").textContent = C.about.heading;
$("#aboutBody").innerHTML = C.about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("");
$("#aboutHighlights").innerHTML = C.about.highlights.map((h) => `<li>${esc(h)}</li>`).join("");

$("#timeline").insertAdjacentHTML("beforeend", C.career.map((j) => `
  <article class="tl" data-reveal>
    <div class="tl__card tilt">
      <div class="tl__top"><b>${esc(j.period)}</b><span>${esc(j.location)}</span></div>
      <h3>${esc(j.role)} <span>@ ${esc(j.company)}</span></h3>
      <p class="tl__sum">${esc(j.summary)}</p>
      <ul class="ticks">${j.wins.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>
      <div class="chips">${j.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>
    </div>
  </article>`).join(""));

const statusLabel = { live: "Live", building: "In progress", exited: "Exited", paused: "Paused" };
$("#ventureCards").innerHTML = C.ventures.map((v) => `
  <article class="card tilt" data-reveal>
    <div class="card__top"><span>${esc(v.year)}</span><span class="badge badge--${esc(v.status)}">${statusLabel[v.status] ?? esc(v.status)}</span></div>
    <h3>${esc(v.name)}</h3>
    <p class="card__role">${esc(v.role)}</p>
    <p class="card__blurb">${esc(v.blurb)}</p>
    <div class="chips">${v.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
    ${v.link ? `<a class="card__link" href="${esc(v.link)}" target="_blank" rel="noopener">Visit →</a>` : ""}
  </article>`).join("");

const rows = (list) => list.map((r) => `<li><b>${esc(r.title)}</b><span>${esc(r.meta)}</span></li>`).join("");
$("#recognitionList").innerHTML = rows(C.recognition);
$("#educationList").innerHTML = rows(C.education);

$("#labList").innerHTML = C.lab.map((l) => `
  <div class="lab__row">
    <h3>${esc(l.name)} <span>${esc(l.stage)}</span></h3>
    <p>${esc(l.note)}</p>
  </div>`).join("");

$("#marquee").innerHTML = C.skills.map((row) => {
  const items = row.map((s) => `<span>${esc(s)}</span>`).join("");
  return `<div class="marquee__row">${items}${items}${items}${items}</div>`;
}).join("");

const mail = $("#contactMail");
mail.textContent = C.email;
mail.href = `mailto:${C.email}`;
$("#contactLinks").innerHTML = [
  C.links.linkedin && ["LinkedIn", C.links.linkedin],
  C.links.github && ["GitHub", C.links.github],
  C.links.resume && ["Résumé", C.links.resume],
].filter(Boolean).map(([l, h]) => `<a class="btn magnetic" href="${esc(h)}" target="_blank" rel="noopener"><span>${l} ↗</span></a>`).join("");
$("#footName").textContent = `© ${new Date().getFullYear()} ${C.name}`;
$("#footLoc").textContent = C.location;
$("#draft").hidden = !C.draft;

// ── globe (page still works if WebGL or the CDN fails) ──
// lon = the longitude the globe turns toward the viewer; it keeps turning west as you scroll
const SCENES = {
  hero:        { x: 2.7,  y: -0.1, scale: 2.0, lon: 74,   dim: 1 },    // India
  about:       { x: -2.9, y: 0,    scale: 1.9, lon: 20,   dim: 0.9 },
  career:      { x: 3.5,  y: 0,    scale: 1.7, lon: -98,  dim: 0.8 },  // United States
  ventures:    { x: 0,    y: -2.6, scale: 3.4, lon: -200, dim: 0.35 },
  recognition: { x: -2.9, y: 0,    scale: 1.9, lon: -260, dim: 0.9 },
  lab:         { x: 3.0,  y: 0,    scale: 1.8, lon: -285, dim: 0.85 }, // back over India
  contact:     { x: 0,    y: -2.9, scale: 3.2, lon: -283, dim: 0.5 },
};
const state = { ...SCENES.hero, lon: 150, dim: 0 };
import("./scene.js")
  .then((m) => m.createScene($("#stage"), state, { reducedMotion: reduced, labelsEl: $("#geos") }))
  .catch((e) => { console.warn("3D scene unavailable:", e); $("#stage").remove(); });

// ── preloader → intro ───────────────────────────────────
const loaded = new Promise((r) => (document.readyState === "complete" ? r() : addEventListener("load", r)));
const counter = { v: 0 };
gsap.to(counter, {
  v: 100, duration: reduced ? 0.2 : 1.4, ease: "power2.inOut",
  onUpdate() { $("#preCount").textContent = Math.round(counter.v); $("#preBar").style.transform = `scaleX(${counter.v / 100})`; },
  onComplete: () => Promise.race([loaded, new Promise((r) => setTimeout(r, 2500))]).then(intro),
});

function intro() {
  document.body.classList.remove("is-loading");
  ScrollTrigger.refresh();
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.to("#preloader", { autoAlpha: 0, duration: 0.8, ease: "power2.out", onComplete: () => $("#preloader").remove() })
    .to(state, { ...SCENES.hero, duration: 2.8, ease: "power3.out" }, 0.2)
    .to(".hero__name .char", { y: 0, duration: 1.2, stagger: 0.03 }, 0.4)
    .from("#heroRole, .hero__tag, .hero__cta > *, .stat, .scrollhint", { y: 24, autoAlpha: 0, duration: 1, stagger: 0.06 }, 0.8)
    .from(".nav", { autoAlpha: 0, duration: 1 }, 0.8)
    .add(() => $$("[data-count]").forEach((el) => {
      const o = { v: 0 };
      gsap.to(o, { v: +el.dataset.count, duration: 1.6, ease: "power3.out", onUpdate: () => (el.textContent = Math.round(o.v)) });
    }), 1);
}

// ── scroll choreography ─────────────────────────────────
let prev = SCENES.hero;
$$("[data-scene]").slice(1).forEach((sec) => {
  const next = SCENES[sec.dataset.scene];
  gsap.fromTo(state, { ...prev }, { ...next, ease: "power1.inOut", immediateRender: false,
    scrollTrigger: { trigger: sec, start: "top 90%", end: "top 20%", scrub: 1.5 } });
  prev = next;
});

gsap.to("#progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
gsap.to("#rail", { scaleY: 1, ease: "none", scrollTrigger: { trigger: "#timeline", start: "top 70%", end: "bottom 60%", scrub: 0.6 } });
ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => $("#nav").classList.toggle("is-stuck", s.scroll() > 40) });

if (!reduced) {
  gsap.set("[data-reveal]", { y: 36, autoAlpha: 0 });
  ScrollTrigger.batch("[data-reveal]", {
    start: "top 88%", once: true,
    onEnter: (els) => gsap.to(els, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out", stagger: 0.1 }),
  });
  gsap.to(".hero > .wrap:first-child", { yPercent: -12, autoAlpha: 0.15, ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });
}

$$(".nav__links a").forEach((a) => ScrollTrigger.create({
  trigger: a.getAttribute("href"), start: "top 50%", end: "bottom 50%",
  onToggle: (s) => a.classList.toggle("is-active", s.isActive),
}));

// ── gentle card tilt (desktop only) ─────────────────────
if (fine && !reduced) {
  $$(".tilt").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.classList.add("is-tilting");
      el.style.setProperty("--ry", `${(x - 0.5) * 4}deg`);
      el.style.setProperty("--rx", `${(0.5 - y) * 3}deg`);
      el.style.setProperty("--gx", `${x * 100}%`);
      el.style.setProperty("--gy", `${y * 100}%`);
    });
    el.addEventListener("pointerleave", () => {
      el.classList.remove("is-tilting");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  });
}

addEventListener("load", () => ScrollTrigger.refresh());
