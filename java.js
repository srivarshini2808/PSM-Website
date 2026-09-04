/* Prime Source Materials FZE — shared site behavior */
(() => {
  "use strict";

  const categories = {
    "industrial-solvents": {
      name: "Industrial Solvents", code: "514904",
      short: "Industrial solvent sourcing for process, formulation and cleaning requirements.",
      description: "PSM supports sourcing of industrial solvents against defined technical and commercial requirements. Enquiries can be evaluated by specification, pack format, quantity and destination without assuming a particular product or grade.",
      applications: ["Manufacturing processes", "Formulation and processing", "Industrial cleaning", "General process requirements"]
    },
    "plastic-nylon": {
      name: "Plastic & Nylon Raw Materials", code: "514909",
      short: "Polymer and nylon raw-material sourcing aligned to customer specifications.",
      description: "PSM sources plastic and nylon raw materials according to the specification supplied by the buyer. Product selection can be discussed around material requirements, quantity, pack format and intended application.",
      applications: ["Plastics processing", "Polymer conversion", "Engineering-material applications", "Manufacturing supply"]
    },
    "adhesives": {
      name: "Adhesives", code: "514917",
      short: "Industrial adhesive sourcing for manufacturing and bonding requirements.",
      description: "PSM handles adhesive enquiries as a trading and sourcing requirement, focusing on the customer's intended use, technical specification, quantity and commercial parameters.",
      applications: ["Manufacturing", "Bonding processes", "Assembly applications", "Industrial production"]
    },
    "waste-plastic": {
      name: "Waste Plastic", code: "514921",
      short: "Sourcing support for waste-plastic and recycling-material requirements.",
      description: "PSM can evaluate waste-plastic sourcing requirements based on the material description, condition, quantity, packaging and destination provided by the buyer.",
      applications: ["Recycling", "Material recovery", "Secondary raw-material supply", "Circular-material applications"]
    },
    "basic-industrial-chemicals": {
      name: "Basic Industrial Chemicals", code: "514923",
      short: "General industrial chemical sourcing against defined specifications.",
      description: "PSM supports enquiries for basic industrial chemicals with a specification-led trading approach. Buyers can provide their required material details, quantity, pack format and destination for sourcing evaluation.",
      applications: ["Industrial processing", "Manufacturing", "Formulation", "General industrial supply"]
    },
    "construction-chemicals": {
      name: "Construction Chemicals", code: "514924",
      short: "Construction-chemical sourcing for building and infrastructure-related requirements.",
      description: "PSM evaluates construction-chemical enquiries according to the intended use and technical requirement provided by the customer, together with quantity, packaging and commercial terms.",
      applications: ["Construction", "Concrete-related applications", "Building materials", "Infrastructure supply"]
    },
    "packaging-materials": {
      name: "Packing & Packaging Materials", code: "514929",
      short: "Industrial packing and packaging-material sourcing for supply-chain needs.",
      description: "PSM sources packing and packaging materials according to the required format, material specification, quantity and application. The trading process is built around clear buyer requirements.",
      applications: ["Industrial packaging", "Manufacturing supply chains", "Material handling", "Product packing"]
    },
    "raw-materials": {
      name: "Raw Materials", code: "514939",
      short: "Specification-led sourcing for general industrial raw-material requirements.",
      description: "PSM works from the buyer's defined requirement to evaluate suitable sourcing options for general industrial raw materials, with attention to specification, quantity and commercial fit.",
      applications: ["Manufacturing", "Processing", "Production inputs", "Industrial procurement"]
    },
    "petrochemicals": {
      name: "Petrochemicals", code: "514942",
      short: "Petrochemical sourcing support for industrial and manufacturing requirements.",
      description: "PSM handles petrochemical enquiries on a specification-first basis, assessing the requested material, quantity, packaging or shipment format, destination and commercial requirement.",
      applications: ["Industrial processing", "Manufacturing", "Chemical-related applications", "Petrochemical value-chain requirements"]
    },
    "acids-alkaline": {
      name: "Acids & Alkaline", code: "514908",
      short: "Sourcing support for acids, alkaline materials and related industrial requirements.",
      description: "PSM evaluates acids and alkaline enquiries from the customer's stated specification and intended application, with quantity, packaging and destination considered as part of the commercial enquiry.",
      applications: ["Industrial processing", "pH-related processes", "Chemical processing", "General industrial supply"]
    }
  };

  const icons = {
    "industrial-solvents":"01","plastic-nylon":"02","adhesives":"03","waste-plastic":"04",
    "basic-industrial-chemicals":"05","construction-chemicals":"06","packaging-materials":"07",
    "raw-materials":"08","petrochemicals":"09","acids-alkaline":"10"
  };

  function categoryCards() {
    return Object.entries(categories).map(([slug,c]) => `
      <article class="category-card reveal" data-search="${c.name.toLowerCase()} ${c.short.toLowerCase()} ${c.code}">
        <div class="card-top"><span class="index-mark">${icons[slug]}</span><span class="activity-code">${c.code}</span></div>
        <h3>${c.name}</h3>
        <p>${c.short}</p>
        <div class="card-actions">
          <a class="text-link" href="product.html?cat=${slug}">View category <span>→</span></a>
          <a class="mini-quote" href="quote.html?cat=${slug}" aria-label="Request a quote for ${c.name}">Quote</a>
        </div>
      </article>`).join("");
  }

  function relatedCards(current) {
    return Object.entries(categories).filter(([slug]) => slug !== current).slice(0,3)
      .map(([slug,c]) => `<a class="related-card reveal" href="product.html?cat=${slug}">
        <span>${icons[slug]}</span><strong>${c.name}</strong><small>${c.code}</small>
      </a>`).join("");
  }

  function setupMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("open"); toggle.setAttribute("aria-expanded","false");
    }));
  }

  function setupReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) { items.forEach(x=>x.classList.add("visible")); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }});
    }, {threshold:.08});
    items.forEach(x=>io.observe(x));
  }

  function markActive() {
    const page = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".site-nav a[data-page]").forEach(a => {
      if (a.dataset.page === page) a.classList.add("active");
    });
  }

  function initProducts() {
    const grid = document.querySelector("#category-grid");
    if (!grid) return;
    // The catalogue is rendered in HTML so it also works reliably from local file:// URLs.
    // JavaScript enhances it with search/filtering when available.
    if (!grid.querySelector(".category-card")) {
      grid.innerHTML = categoryCards();
    }
    const input = document.querySelector("#product-search");
    const count = document.querySelector("#result-count");
    const cards = () => [...grid.querySelectorAll(".category-card")];

    const filter = () => {
      const q = input.value.trim().toLowerCase();
      let shown = 0;
      cards().forEach(card => {
        const match = !q || card.dataset.search.includes(q);
        card.hidden = !match;
        if (match) shown++;
      });
      count.textContent = `${shown} ${shown === 1 ? "category" : "categories"} shown`;
    };
    input.addEventListener("input", filter);
    filter();
  }

  function initProduct() {
    const key = new URLSearchParams(location.search).get("cat");
    const c = categories[key];
    const empty = document.querySelector("#product-empty");
    const content = document.querySelector("#product-content");
    if (!c) { content.hidden = true; empty.hidden = false; return; }
    empty.hidden = true; content.hidden = false;
    document.title = `${c.name} | Prime Source Materials FZE`;
    document.querySelector("#product-name").textContent = c.name;
    document.querySelector("#product-name-side").textContent = c.name;
    document.querySelector("#product-code-side").textContent = `ACTIVITY CODE ${c.code}`;
    document.querySelector("#product-code").textContent = `Activity code ${c.code}`;
    document.querySelector("#product-description").textContent = c.description;
    document.querySelector("#product-applications").innerHTML = c.applications.map(x=>`<li>${x}</li>`).join("");
    document.querySelector("#quote-link").href = `quote.html?cat=${key}`;
    document.querySelector("#related-grid").innerHTML = relatedCards(key);
  }

  function initQuote() {
    const select = document.querySelector("#category");
    if (!select) return;
    Object.entries(categories).forEach(([slug,c]) => {
      const opt = document.createElement("option");
      opt.value = c.name; opt.textContent = c.name; opt.dataset.slug = slug; select.appendChild(opt);
    });
    const key = new URLSearchParams(location.search).get("cat");
    if (categories[key]) select.value = categories[key].name;

    const form = document.querySelector("#quote-form");
    form.addEventListener("submit", e => {
      e.preventDefault();
      const fd = new FormData(form);
      const subject = encodeURIComponent(`Quotation enquiry — ${fd.get("category") || "Industrial materials"}`);
      const body = encodeURIComponent(
`Name: ${fd.get("name")}
Company: ${fd.get("company")}
Email: ${fd.get("email")}
Phone: ${fd.get("phone")}
Category: ${fd.get("category")}
Quantity: ${fd.get("quantity")}

Message:
${fd.get("message")}`
      );
      window.location.href = `mailto:info@primesourcematerials.com?subject=${subject}&body=${body}`;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupMenu(); markActive(); initProducts(); initProduct(); initQuote(); setupReveal();
    const year = document.querySelector("#year"); if (year) year.textContent = new Date().getFullYear();
  });
})();
