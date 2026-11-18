// Formspree form ID from https://formspree.io (Dashboard → form → endpoint).
// Example endpoint: https://formspree.io/f/xpwzyabc → use "xpwzyabc"
const FORMSPREE_FORM_ID = "mrpqqrrk";
const NOTIFY_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const mobileNav = document.querySelector("#mobile-nav");
const form = document.querySelector("#notify-form");
const statusEl = document.querySelector("#form-status");
const submitButton = form?.querySelector('button[type="submit"]');

function setMobileNav(open) {
  if (!toggle || !mobileNav) return;
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  mobileNav.hidden = !open;
}

toggle?.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  setMobileNav(open);
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMobileNav(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMobileNav(false);
});

window.addEventListener("scroll", () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 8);
});

const animated = document.querySelectorAll("[data-animate]");
animated.forEach((el) => {
  const delay = el.getAttribute("data-delay");
  if (delay) el.style.setProperty("--delay", `${delay}ms`);
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );
  animated.forEach((el) => observer.observe(el));
} else {
  animated.forEach((el) => el.classList.add("is-visible"));
}

function showStatus(message, isError = false) {
  if (!statusEl) return;
  statusEl.hidden = false;
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

function setSubmitting(isSubmitting) {
  if (!submitButton) return;
  submitButton.disabled = isSubmitting;
  submitButton.textContent = isSubmitting ? "Sending…" : "Notify Me";
}

function isConfigured() {
  return Boolean(
    FORMSPREE_FORM_ID && FORMSPREE_FORM_ID !== "REPLACE_WITH_FORMSPREE_FORM_ID"
  );
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const student = String(data.get("student") || "").trim();
  const notes = String(data.get("notes") || "").trim();
  const honeypot = String(data.get("_gotcha") || "").trim();

  const nameInput = form.querySelector("#name");
  const emailInput = form.querySelector("#email");
  nameInput?.classList.toggle("invalid", !name);
  emailInput?.classList.toggle("invalid", !email || !emailInput.checkValidity());

  if (!name || !email || !emailInput.checkValidity()) {
    showStatus("Please enter a valid name and email.", true);
    return;
  }

  // Bot trap — silently succeed without sending.
  if (honeypot) {
    form.reset();
    showStatus("You are on the list. We will email you when registration opens.");
    return;
  }

  if (!isConfigured()) {
    showStatus(
      "Email delivery is not configured yet. Please try again after setup is finished.",
      true
    );
    return;
  }

  setSubmitting(true);
  showStatus("Sending your signup…");

  try {
    const response = await fetch(NOTIFY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        student: student || "(not provided)",
        notes: notes || "(none)",
        _subject: "New Race Engineering Course notify signup",
        _replyto: email,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const detail =
        result.errors?.[0]?.message ||
        result.error ||
        result.detail ||
        result.message ||
        `Unable to send signup (${response.status}).`;
      throw new Error(detail);
    }

    form.reset();
    nameInput?.classList.remove("invalid");
    emailInput?.classList.remove("invalid");
    showStatus(
      "You are on the list. We will email you when registration opens."
    );
  } catch (error) {
    console.error(error);
    showStatus(
      "Something went wrong sending your signup. Please try again in a moment.",
      true
    );
  } finally {
    setSubmitting(false);
  }
});

function initMentorCarousel(root) {
  const slides = Array.from(root.querySelectorAll("[data-slide]"));
  const dotsHost = root.querySelector("[data-carousel-dots]");
  const prevBtn = root.querySelector("[data-carousel-prev]");
  const nextBtn = root.querySelector("[data-carousel-next]");
  if (slides.length < 2) return;

  let index = slides.findIndex((slide) => slide.classList.contains("is-active"));
  if (index < 0) index = 0;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const intervalMs = 4500;
  let timer = null;

  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "mentor-carousel-dot";
    dot.setAttribute("aria-label", `Show photo ${i + 1}`);
    dot.addEventListener("click", () => goTo(i, true));
    dotsHost?.appendChild(dot);
    return dot;
  });

  function render() {
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
    });
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-current", active ? "true" : "false");
    });
  }

  function goTo(nextIndex, userDriven = false) {
    index = (nextIndex + slides.length) % slides.length;
    render();
    if (userDriven) restart();
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function start() {
    if (reduceMotion || timer) return;
    timer = window.setInterval(next, intervalMs);
  }

  function restart() {
    stop();
    start();
  }

  prevBtn?.addEventListener("click", () => {
    prev();
    restart();
  });
  nextBtn?.addEventListener("click", () => {
    next();
    restart();
  });

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", (event) => {
    if (!root.contains(event.relatedTarget)) start();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  render();
  start();
}

document.querySelectorAll("[data-carousel]").forEach(initMentorCarousel);
