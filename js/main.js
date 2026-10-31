document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
  }
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a => {
    const href = a.getAttribute("href") || "";
    if (href.split("/").pop() === current) a.classList.add("active");
  });
  document.querySelectorAll("[data-faq]").forEach(button => {
    button.addEventListener("click", () => {
      const answer = button.nextElementSibling;
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      answer.hidden = expanded;
      const icon = button.querySelector(".faq-icon");
      if (icon) icon.textContent = expanded ? "+" : "−";
    });
  });
  const back = document.querySelector(".back-top");
  if (back) {
    window.addEventListener("scroll", () => back.classList.toggle("show", window.scrollY > 500));
    back.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));
  }
  const search = document.querySelector("#countrySearch");
  const cards = [...document.querySelectorAll("[data-country-card]")];
  const filters = [...document.querySelectorAll("[data-country-filter]")];
  let selected = "All";
  function filterCards() {
    const q = (search?.value || "").toLowerCase();
    cards.forEach(card => {
      const matchesText = card.textContent.toLowerCase().includes(q);
      const matchesGroup = selected === "All" || card.dataset.group === selected;
      card.hidden = !(matchesText && matchesGroup);
    });
  }
  search?.addEventListener("input", filterCards);
  filters.forEach(btn => btn.addEventListener("click", () => {
    selected = btn.dataset.countryFilter;
    filters.forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
    filterCards();
  }));
  const wa = document.querySelectorAll("[data-whatsapp]");
  const number = window.VIDHYA_CONFIG?.whatsappNumber || "";
  wa.forEach(a => {
    if (number) a.href = `https://wa.me/${number}?text=${encodeURIComponent("Hello Vidhya Overseas, I would like to enquire about studying abroad.")}`;
    else { a.href = "#contact-details"; a.addEventListener("click", e => { if (!number) { e.preventDefault(); alert("Please configure the WhatsApp number in js/config.js."); } }); }
  });
});
