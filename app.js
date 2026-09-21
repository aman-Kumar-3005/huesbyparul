/**
 * Huesby.Paul Photography & Retouching
 * Master Interactive Controller
 * Handles Before/After Sliders, Lightbox, Hero Carousel, Lead Capture, WhatsApp Hand-off & Social Proof
 */

// Global Configuration
const PAUL_CONFIG = {
  phone: "+91 86883 65399",
  whatsappNumber: "918688365399",
  instagram: "huesby.paul",
  instagramUrl: "https://www.instagram.com/huesby.paul",
  brandName: "Huesby.Paul",
  cameraModel: "Sony α7R Full-Frame Mirrorless",
};

// Social Proof Notifications Data
const SOCIAL_PROOF_EVENTS = [
  { name: "Ananya", location: "Hyderabad", service: "Maternity Saree Shoot", time: "8 mins ago" },
  { name: "Vikram & Sneha", location: "Secunderabad", service: "Pre-Wedding Couple Session", time: "22 mins ago" },
  { name: "Arjun K.", location: "Banjara Hills", service: "12 RAW Photos Paid Retouching", time: "40 mins ago" },
  { name: "Pooja M.", location: "Jubilee Hills", service: "Traditional Festive Portrait", time: "1 hour ago" },
  { name: "Design Studio", location: "Hyderabad", service: "Architectural & Interior Shoot", time: "2 hours ago" },
  { name: "Kunal R.", location: "Gachibowli", service: "Commercial Product Photography", time: "3 hours ago" }
];

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initBeforeAfterSliders();
  initLightbox();
  initHeroCarousel();
  initSocialProofToast();
  initExitIntentModal();
  initLeadForms();
  initCategoryFilters();

  // Initialize Lucide icons if loaded
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

/**
 * 1. Mobile Menu Drawer
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeBtn = document.getElementById("mobile-menu-close");

  if (!toggleBtn || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.classList.remove("hidden");
    setTimeout(() => {
      mobileMenu.classList.remove("opacity-0", "-translate-y-4");
    }, 10);
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    mobileMenu.classList.add("opacity-0", "-translate-y-4");
    setTimeout(() => {
      mobileMenu.classList.add("hidden");
      document.body.style.overflow = "";
    }, 300);
  };

  toggleBtn.addEventListener("click", () => {
    if (mobileMenu.classList.contains("hidden")) {
      openMenu();
    } else {
      closeMenu();
    }
  });
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });
}

/**
 * 2. Interactive Before/After Sliders
 */
function initBeforeAfterSliders() {
  const containers = document.querySelectorAll(".ba-container");

  containers.forEach(container => {
    const afterWrapper = container.querySelector(".ba-after-wrapper");
    const handle = container.querySelector(".ba-handle");
    const afterImg = container.querySelector(".ba-after-image");

    if (!afterWrapper || !handle) return;

    // Sync image width with parent container
    const syncImageWidth = () => {
      if (afterImg) {
        afterImg.style.width = `${container.offsetWidth}px`;
      }
    };
    syncImageWidth();
    window.addEventListener("resize", syncImageWidth);

    let isDragging = false;

    const updateSliderPosition = (clientX) => {
      const rect = container.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      afterWrapper.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    };

    // Mouse Events
    container.addEventListener("mousedown", (e) => {
      isDragging = true;
      updateSliderPosition(e.clientX);
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      updateSliderPosition(e.clientX);
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Touch Events
    container.addEventListener("touchstart", (e) => {
      isDragging = true;
      if (e.touches[0]) updateSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (!isDragging || !e.touches[0]) return;
      updateSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener("touchend", () => {
      isDragging = false;
    });
  });
}

/**
 * 3. Lightbox Modal with EXIF Data
 */
let currentGalleryItems = [];
let currentLightboxIndex = 0;

function initLightbox() {
  const modal = document.getElementById("lightbox-modal");
  if (!modal) return;

  const modalImg = document.getElementById("lightbox-img");
  const modalTitle = document.getElementById("lightbox-title");
  const modalCategory = document.getElementById("lightbox-category");
  const modalGear = document.getElementById("lightbox-gear");
  const modalSettings = document.getElementById("lightbox-settings");
  const modalClose = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  const galleryTriggers = document.querySelectorAll("[data-lightbox-src]");
  currentGalleryItems = Array.from(galleryTriggers);

  const openLightbox = (index) => {
    currentLightboxIndex = index;
    const item = currentGalleryItems[index];
    if (!item) return;

    const src = item.getAttribute("data-lightbox-src") || item.querySelector("img")?.src;
    const title = item.getAttribute("data-title") || "Photography by Paul";
    const category = item.getAttribute("data-category") || "Portfolio";
    const gear = item.getAttribute("data-gear") || "Sony α7R • 85mm f/1.4 GM";
    const settings = item.getAttribute("data-settings") || "f/1.8 • 1/320s • ISO 100";

    if (modalImg) {
      modalImg.src = src;
      modalImg.classList.remove("zoomed");
    }
    const imgContainer = document.getElementById("lightbox-img-container");
    if (imgContainer) imgContainer.classList.remove("is-zoomed");
    const zoomBtn = document.getElementById("lightbox-zoom-btn");
    if (zoomBtn) {
      zoomBtn.innerHTML = '<i data-lucide="zoom-in" class="w-4 h-4"></i> <span>100% HD Detail</span>';
      if (window.lucide) window.lucide.createIcons();
    }
    if (modalTitle) modalTitle.textContent = title;
    if (modalCategory) modalCategory.textContent = category;
    if (modalGear) modalGear.textContent = gear;
    if (modalSettings) modalSettings.textContent = settings;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    modal.classList.remove("active");
    if (modalImg) modalImg.classList.remove("zoomed");
    const imgContainer = document.getElementById("lightbox-img-container");
    if (imgContainer) imgContainer.classList.remove("is-zoomed");
    document.body.style.overflow = "";
  };

  const toggleZoom = () => {
    if (!modalImg) return;
    const isZoomed = modalImg.classList.toggle("zoomed");
    const imgContainer = document.getElementById("lightbox-img-container");
    if (imgContainer) imgContainer.classList.toggle("is-zoomed", isZoomed);
    const zoomBtn = document.getElementById("lightbox-zoom-btn");
    if (zoomBtn) {
      zoomBtn.innerHTML = isZoomed ? '<i data-lucide="zoom-out" class="w-4 h-4"></i> <span>Fit Screen</span>' : '<i data-lucide="zoom-in" class="w-4 h-4"></i> <span>100% HD Detail</span>';
      if (window.lucide) window.lucide.createIcons();
    }
  };

  const zoomBtn = document.getElementById("lightbox-zoom-btn");
  if (zoomBtn) zoomBtn.addEventListener("click", toggleZoom);
  if (modalImg) modalImg.addEventListener("click", toggleZoom);

  const showNext = () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % currentGalleryItems.length;
    openLightbox(currentLightboxIndex);
  };

  const showPrev = () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
    openLightbox(currentLightboxIndex);
  };

  currentGalleryItems.forEach((item, idx) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      openLightbox(idx);
    });
  });

  if (modalClose) modalClose.addEventListener("click", closeLightbox);
  if (prevBtn) prevBtn.addEventListener("click", showPrev);
  if (nextBtn) nextBtn.addEventListener("click", showNext);

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("lightbox-backdrop")) {
      closeLightbox();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });
}

/**
 * 4. Hero Carousel Auto-Advance
 */
function initHeroCarousel() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  if (!slides.length) return;

  let activeIndex = 0;
  let interval;

  const goToSlide = (index) => {
    slides.forEach((s, i) => {
      s.classList.toggle("opacity-100", i === index);
      s.classList.toggle("opacity-0", i !== index);
      s.classList.toggle("pointer-events-none", i !== index);
    });

    dots.forEach((d, i) => {
      d.classList.toggle("bg-gold-500", i === index);
      d.classList.toggle("w-8", i === index);
      d.classList.toggle("bg-white/40", i !== index);
      d.classList.toggle("w-2.5", i !== index);
    });

    activeIndex = index;
  };

  const nextSlide = () => {
    goToSlide((activeIndex + 1) % slides.length);
  };

  const startAutoPlay = () => {
    interval = setInterval(nextSlide, 5500);
  };

  const stopAutoPlay = () => {
    clearInterval(interval);
  };

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      stopAutoPlay();
      goToSlide(idx);
      startAutoPlay();
    });
  });

  startAutoPlay();
}

/**
 * 5. Live Social-Proof Notification Toast
 */
function initSocialProofToast() {
  const toast = document.getElementById("social-proof-toast");
  if (!toast) return;

  let eventIndex = 0;

  const showNotification = () => {
    const data = SOCIAL_PROOF_EVENTS[eventIndex];
    const nameEl = toast.querySelector(".sp-name");
    const serviceEl = toast.querySelector(".sp-service");
    const timeEl = toast.querySelector(".sp-time");

    if (nameEl) nameEl.textContent = `${data.name} (${data.location})`;
    if (serviceEl) serviceEl.textContent = `Inquired: ${data.service}`;
    if (timeEl) timeEl.textContent = data.time;

    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 6000);

    eventIndex = (eventIndex + 1) % SOCIAL_PROOF_EVENTS.length;
  };

  // Trigger initial toast after 4s, then every 20s
  setTimeout(showNotification, 4000);
  setInterval(showNotification, 22000);

  const closeToast = toast.querySelector(".sp-close");
  if (closeToast) {
    closeToast.addEventListener("click", (e) => {
      e.stopPropagation();
      toast.classList.remove("show");
    });
  }
}

/**
 * 6. Exit-Intent & Scroll Quote Modal
 */
function initExitIntentModal() {
  const modal = document.getElementById("quote-modal");
  if (!modal) return;

  const closeBtn = document.getElementById("quote-modal-close");
  let hasTriggered = sessionStorage.getItem("huesby_quote_triggered");

  const openModal = () => {
    modal.classList.remove("hidden");
    setTimeout(() => {
      modal.classList.add("opacity-100");
      const dialog = modal.querySelector(".modal-dialog");
      if (dialog) dialog.classList.remove("scale-95");
    }, 10);
    hasTriggered = "true";
    sessionStorage.setItem("huesby_quote_triggered", "true");
  };

  const closeModal = () => {
    const dialog = modal.querySelector(".modal-dialog");
    if (dialog) dialog.classList.add("scale-95");
    modal.classList.remove("opacity-100");
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 300);
  };

  // Exit intent on desktop
  document.addEventListener("mouseleave", (e) => {
    if (e.clientY <= 0 && !hasTriggered) {
      openModal();
    }
  });

  // Trigger after 45s if not triggered yet
  setTimeout(() => {
    if (!hasTriggered) {
      openModal();
    }
  }, 45000);

  // Manual trigger buttons
  document.querySelectorAll("[data-open-quote]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

/**
 * 7. Lead Capture & Direct WhatsApp Handoff
 */
function initLeadForms() {
  const forms = document.querySelectorAll(".lead-form");

  forms.forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.querySelector("[name='name']")?.value || "Client";
      const phone = form.querySelector("[name='phone']")?.value || "";
      const shootType = form.querySelector("[name='shoot_type']")?.value || "Photography Shoot / Retouching";
      const date = form.querySelector("[name='date']")?.value || "Flexible / Upcoming";
      const details = form.querySelector("[name='message']")?.value || "Interested in booking details and pricing.";

      const message = `Hi Paul (@huesby.paul),\n\nI am reaching out via your website portfolio to book a shoot / retouching session.\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Service/Shoot:* ${shootType}\n*Preferred Date:* ${date}\n*Notes:* ${details}\n\nPlease let me know your package details and availability!`;

      const encodedMessage = encodeURIComponent(message);
      const waUrl = `https://wa.me/${PAUL_CONFIG.whatsappNumber}?text=${encodedMessage}`;

      // Open WhatsApp in new tab
      window.open(waUrl, "_blank");

      // Optional feedback message
      const submitBtn = form.querySelector("button[type='submit']");
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>✓ Redirecting to WhatsApp...</span>`;
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          form.reset();
        }, 3000);
      }
    });
  });
}

/**
 * 8. Category Filter Buttons (for Portfolio Grid)
 */
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll("[data-filter]");
  const items = document.querySelectorAll("[data-category-item]");

  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      filterBtns.forEach(b => {
        b.classList.remove("bg-gold-500", "text-black", "border-gold-500");
        b.classList.add("bg-dark-800", "text-neutral-300", "border-white/10");
      });
      btn.classList.remove("bg-dark-800", "text-neutral-300", "border-white/10");
      btn.classList.add("bg-gold-500", "text-black", "border-gold-500");

      items.forEach(item => {
        const itemCat = item.getAttribute("data-category-item");
        if (filter === "all" || itemCat === filter) {
          item.style.display = "";
          item.style.opacity = "1";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
}

/**
 * Helper: Quick WhatsApp Click
 */
function openWhatsAppInquiry(service = "Photography Shoot") {
  const text = encodeURIComponent(`Hi Paul (@huesby.paul), I was browsing your website and I'd like to check availability and packages for *${service}*.`);
  window.open(`https://wa.me/${PAUL_CONFIG.whatsappNumber}?text=${text}`, "_blank");
}
window.openWhatsAppInquiry = openWhatsAppInquiry;
