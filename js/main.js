(() => {
  // Mobile navigation
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  const setNav = (open) => {
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  burger.addEventListener("click", () => {
    setNav(!nav.classList.contains("open"));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setNav(false);
    }
  });

  // Scroll spy
  const links = {};

  nav.querySelectorAll("a.l").forEach((link) => {
    links[link.dataset.s] = link;
  });

  const sectionIds = [
    "about",
    "services",
    "locations",
    "opportunities",
    "contact",
  ];

  const updateScrollSpy = () => {
    const scrollPosition = window.scrollY + 140;
    let currentSection = "top";

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);

      if (section && section.offsetTop <= scrollPosition) {
        currentSection = id;
      }
    });

    Object.keys(links).forEach((key) => {
      links[key].classList.toggle("on", key === currentSection);
    });
  };

  window.addEventListener("scroll", updateScrollSpy, {
    passive: true,
  });

  updateScrollSpy();

  // Prefill contact form from buttons
  const role = document.getElementById("f-role");
  const service = document.getElementById("f-service");

  document.querySelectorAll("[data-role]").forEach((button) => {
    button.addEventListener("click", () => {
      role.value = button.dataset.role;
    });
  });

  document.querySelectorAll("[data-service]").forEach((button) => {
    button.addEventListener("click", () => {
      role.value = "Employer";

      for (let index = 0; index < service.options.length; index += 1) {
        if (service.options[index].text === button.dataset.service) {
          service.selectedIndex = index;
          break;
        }
      }
    });
  });

  // Map <-> list highlight
  const locationRows = document.querySelectorAll(".loc[data-c]");

  locationRows.forEach((row) => {
    const pin = document.getElementById(`c-${row.dataset.c}`);

    const highlight = () => {
      if (pin) {
        pin.classList.add("hl");
      }
    };

    const removeHighlight = () => {
      if (pin) {
        pin.classList.remove("hl");
      }
    };

    row.addEventListener("mouseenter", highlight);
    row.addEventListener("mouseleave", removeHighlight);
    row.addEventListener("focus", highlight);
    row.addEventListener("blur", removeHighlight);
  });

  // Contact form -> Web3Forms
  const form = document.getElementById("cform");
  const status = document.getElementById("status");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = (formData.get("name") || "").trim();
    const email = (formData.get("email") || "").trim();

    // Basic validation
    if (!name || !email || !email.includes("@")) {
      status.textContent =
        "Please add your name and a valid email so we can reply.";
      return;
    }

    status.textContent = "Sending...";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        status.textContent =
          "Thank you. Your message has been sent successfully.";

        form.reset();
        return;
      }

      status.textContent =
        result.message || "Something went wrong. Please try again.";
    } catch (error) {
      console.error("Contact form error:", error);

      status.textContent =
        "Unable to send your message right now. Please try again.";
    }
  });
})();
