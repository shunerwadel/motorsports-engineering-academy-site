const STORAGE_KEY = "mea-waitlist";

const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const mobileNav = document.querySelector("#mobile-nav");
const form = document.querySelector("#notify-form");
const statusEl = document.querySelector("#form-status");

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

function readWaitlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeWaitlist(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function showStatus(message, isError = false) {
  if (!statusEl) return;
  statusEl.hidden = false;
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const student = String(data.get("student") || "").trim();
  const notes = String(data.get("notes") || "").trim();

  const nameInput = form.querySelector("#name");
  const emailInput = form.querySelector("#email");
  nameInput?.classList.toggle("invalid", !name);
  emailInput?.classList.toggle("invalid", !email || !emailInput.checkValidity());

  if (!name || !email || !emailInput.checkValidity()) {
    showStatus("Please enter a valid name and email.", true);
    return;
  }

  const entries = readWaitlist();
  const existing = entries.find(
    (entry) => entry.email.toLowerCase() === email.toLowerCase()
  );

  const payload = {
    name,
    email,
    student,
    notes,
    createdAt: new Date().toISOString(),
  };

  if (existing) {
    Object.assign(existing, payload);
  } else {
    entries.push(payload);
  }

  writeWaitlist(entries);
  form.reset();
  nameInput?.classList.remove("invalid");
  emailInput?.classList.remove("invalid");
  showStatus(
    existing
      ? "You are already on the list — we updated your details."
      : "You are on the list. We will email you when registration opens."
  );
});

// Helpful during local iteration: expose waitlist in the console.
window.MEA = {
  getWaitlist: readWaitlist,
  clearWaitlist() {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  },
};
