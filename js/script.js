/* =========================================================
   SCHOOL WEBSITE JAVASCRIPT
========================================================= */


let schoolData = null;


/* =========================================================
   LOAD SCHOOL DATA
========================================================= */

async function loadSchoolData() {

    try {

        const response = await fetch("data/school.json");

        if (!response.ok) {

            throw new Error(
                "school.json could not be loaded."
            );

        }

        schoolData = await response.json();

        renderWebsite();

    } catch (error) {

        console.error(error);

        document.body.innerHTML = `
            <div style="
                padding:50px;
                text-align:center;
                font-family:Arial;
            ">
                <h2>Website Data Loading Error</h2>

                <p>
                    Please run this website using a local server.
                </p>
            </div>
        `;
    }
}


/* =========================================================
   RENDER WEBSITE
========================================================= */

function renderWebsite() {

    renderBasicInformation();

    initThemeToggle();

    initHeroSlider();

    renderFeatures();

    renderAbout();

    renderLeadership();

    renderVision();

    renderAcademics();

    renderStats();

    renderSchoolLife();

    renderGallery();

    renderAdmission();

    renderContact();

    renderFooter();

    initRevealAnimations();
}


function initRevealAnimations() {
    if (!("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    const elements = document.querySelectorAll(
        ".section-heading, .about-image, .about-content, .feature-grid > *, " +
        ".leaders-grid > *, .vision-card, .academic-grid > *, .stat, " +
        ".life-grid > *, .gallery-grid > *, .admission-box, .contact-info, .contact-form"
    );

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

    elements.forEach(element => {
        element.classList.add("reveal");
        observer.observe(element);
    });
}


/* =========================================================
   THEME TOGGLE
========================================================= */

function initThemeToggle() {

    const button =
        document.getElementById("themeToggle");

    const savedTheme =
        localStorage.getItem("schoolTheme");

    document.documentElement.dataset.theme =
        savedTheme === "dark" ? "dark" : "light";

    function updateButton() {

        const isNight =
            document.documentElement.dataset.theme === "dark";

        button.innerHTML = isNight
            ? '<i class="bi bi-sun-fill" aria-hidden="true"></i>'
            : '<i class="bi bi-moon-stars-fill" aria-hidden="true"></i>';
        button.setAttribute("aria-pressed", String(isNight));
        button.setAttribute("aria-label", isNight ? "Switch to day mode" : "Switch to night mode");
        button.title = isNight ? "Switch to day mode" : "Switch to night mode";
    }

    button.addEventListener("click", () => {
        const nextTheme =
            document.documentElement.dataset.theme === "dark" ? "light" : "dark";

        document.documentElement.dataset.theme = nextTheme;
        localStorage.setItem("schoolTheme", nextTheme);
        updateButton();
    });

    updateButton();
}


/* =========================================================
   HERO PHOTO SLIDER
========================================================= */

function initHeroSlider() {

    const slides =
        [...document.querySelectorAll(".hero-slide")];

    const dots =
        [...document.querySelectorAll(".hero-slider-dot")];

    const arrows =
        [...document.querySelectorAll(".hero-slider-arrow")];

    if (slides.length === 0 || dots.length !== slides.length) {
        return;
    }

    let activeIndex = 0;
    let timer;
    const motionPreference =
        window.matchMedia("(prefers-reduced-motion: reduce)");

    function showSlide(index) {

        activeIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === activeIndex;
            slide.classList.toggle("is-active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
        });

        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === activeIndex;
            dot.classList.toggle("is-active", isActive);

            if (isActive) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });
    }

    function restartTimer() {
        window.clearInterval(timer);
        if (motionPreference.matches) {
            return;
        }

        timer = window.setInterval(() => {
            showSlide(activeIndex + 1);
        }, 6000);
    }

    arrows.forEach(arrow => {
        arrow.addEventListener("click", () => {
            showSlide(activeIndex + (arrow.dataset.slideDirection === "next" ? 1 : -1));
            restartTimer();
        });
    });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index);
            restartTimer();
        });
    });

    const slider = document.querySelector(".hero");
    slider.addEventListener("mouseenter", () => window.clearInterval(timer));
    slider.addEventListener("mouseleave", restartTimer);
    slider.addEventListener("focusin", () => window.clearInterval(timer));
    slider.addEventListener("focusout", event => {
        if (!slider.contains(event.relatedTarget)) {
            restartTimer();
        }
    });

    motionPreference.addEventListener("change", restartTimer);

    showSlide(0);
    restartTimer();
}


/* =========================================================
   BASIC INFORMATION
========================================================= */

function renderBasicInformation() {

    const school = schoolData.school;

    document.title =
        `${school.name} | ${school.city}`;


    document.getElementById("schoolName").textContent =
        school.name;


    document.getElementById("schoolTagline").textContent =
        school.tagline;


    document.getElementById("heroTitle").innerHTML =
        `<span class="hero-title-primary">${school.heroTitle.trim()}</span><br>
        <span>${school.heroHighlight.trim()}</span>`;


    document.getElementById("heroDescription").textContent =
        school.heroDescription;


    document.getElementById("topAdmission").textContent =
        `Admissions Open for Session ${school.admissionSession}`;


    document.getElementById("topPhone").textContent =
        `📞 ${school.phone}`;


    document.getElementById("topPhone").href =
        `tel:${school.phone.replace(/\s/g, "")}`;


    document.getElementById("topEmail").textContent =
        `✉ ${school.email}`;


    document.getElementById("topEmail").href =
        `mailto:${school.email}`;


    document.getElementById("schoolLogo").src =
        school.logo;


    document.getElementById("footerLogo").src =
        school.logo;
}


/* =========================================================
   FEATURES
========================================================= */

function renderFeatures() {

    const container =
        document.getElementById("featureGrid");


    container.innerHTML =
        schoolData.features.map(feature => {

            return `

                <div class="col-md-6 col-xl-4">
                    <article class="feature-card card h-100">
                        <div class="feature-icon">${feature.icon}</div>
                        <h3>${feature.title}</h3>
                        <p>${feature.description}</p>
                    </article>
                </div>

            `;

        }).join("");
}


/* =========================================================
   ABOUT
========================================================= */

function renderAbout() {

    const about =
        schoolData.about;


    document.getElementById("campusImage").src =
        about.image;


    document.getElementById("experienceYears").textContent =
        about.experience;


    document.getElementById("aboutTitle").textContent =
        about.title;


    document.getElementById("aboutDescription").innerHTML =
        about.paragraphs.map(text => {

            return `<p>${text}</p>`;

        }).join("");
}


/* =========================================================
   LEADERSHIP
========================================================= */

function renderLeadership() {

    const container =
        document.getElementById("leadersGrid");


    container.innerHTML =
        schoolData.leadership.map(person => {

            return `

                <div class="col-md-6 col-lg-4">
                    <article class="leader-card card h-100">
                        <img src="${person.image}" alt="${person.name}" loading="lazy">
                        <div class="leader-content">
                            <span class="leader-role">${person.role}</span>
                            <h3>${person.name}</h3>
                            <p>${person.message}</p>
                            <strong>With Best Wishes</strong>
                        </div>
                    </article>
                </div>

            `;

        }).join("");
}


/* =========================================================
   VISION
========================================================= */

function renderVision() {

    document.getElementById("missionText").textContent =
        schoolData.vision.mission;


    document.getElementById("visionText").textContent =
        schoolData.vision.vision;
}


/* =========================================================
   ACADEMICS
========================================================= */

function renderAcademics() {

    const container =
        document.getElementById("academicGrid");


    container.innerHTML =
        schoolData.academics.map((item, index) => {

            const number =
                String(index + 1).padStart(2, "0");


            return `

                <div class="col-sm-6 col-xl-3">
                    <article class="academic-card card h-100">
                        <span class="academic-number">${number}</span>
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </article>
                </div>

            `;

        }).join("");
}


/* =========================================================
   STATS
========================================================= */

function renderStats() {

    const container =
        document.getElementById("statsGrid");


    container.innerHTML =
        schoolData.stats.map(stat => {

            return `

                <div class="stat col">

                    <strong>
                        ${stat.number}
                    </strong>

                    <span>
                        ${stat.label}
                    </span>

                </div>

            `;

        }).join("");
}


/* =========================================================
   SCHOOL LIFE
========================================================= */

function renderSchoolLife() {

    const container =
        document.getElementById("lifeGrid");


    container.innerHTML =
        schoolData.schoolLife.map(item => {

            return `

                <div class="col-md-6">
                    <article class="life-card card" style="background-image: url('${item.image}');">
                        <div class="life-overlay">
                            <div>
                                <h3>${item.title}</h3>
                                <p>${item.description}</p>
                            </div>
                        </div>
                    </article>
                </div>

            `;

        }).join("");
}


/* =========================================================
   GALLERY
========================================================= */

function renderGallery() {

    const container =
        document.getElementById("galleryGrid");

    container.innerHTML =
        schoolData.gallery.map((image, index) => {

            return `
                <figure class="gallery-item col-6 col-lg-4">
                    <img src="${image}" alt="School gallery photo ${index + 1}" loading="lazy">
                </figure>
            `;

        }).join("");
}


/* =========================================================
   ADMISSION
========================================================= */

function renderAdmission() {

    document.getElementById("admissionText").textContent =
        `Admissions are open for the academic session
        ${schoolData.school.admissionSession}.`;
}


/* =========================================================
   CONTACT
========================================================= */

function renderContact() {

    const school =
        schoolData.school;


    document.getElementById("contactAddress").innerHTML =
        school.address;


    document.getElementById("contactPhone").textContent =
        school.phone;


    document.getElementById("contactEmail").textContent =
        school.email;


    document.getElementById("officeHours").innerHTML =
        school.officeHours;
}


/* =========================================================
   FOOTER
========================================================= */

function renderFooter() {

    const school =
        schoolData.school;


    document.getElementById("footerSchoolName").textContent =
        school.name;


    document.getElementById("footerDescription").textContent =
        school.footerDescription;


    document.getElementById("footerAddress").innerHTML =
        school.address;


    document.getElementById("footerPhone").textContent =
        `📞 ${school.phone}`;


    document.getElementById("footerEmail").textContent =
        `✉ ${school.email}`;


    document.getElementById("copyrightName").textContent =
        school.name;


    document.getElementById("currentYear").textContent =
        new Date().getFullYear();
}


/* =========================================================
   MOBILE MENU
========================================================= */

const navLinks =
    document.getElementById("navLinks");


const activityToggle =
    document.getElementById("activityToggle");


const activityMenuItem =
    activityToggle.closest(".nav-dropdown");


activityToggle.addEventListener("click", () => {
    const isExpanded = activityToggle.getAttribute("aria-expanded") === "true";
    activityToggle.setAttribute("aria-expanded", String(!isExpanded));
    activityMenuItem.classList.toggle("open", !isExpanded);
});


document.querySelectorAll(
    ".nav-links a"
).forEach(link => {

    link.addEventListener(
        "click",
        () => {

            bootstrap.Collapse.getOrCreateInstance(navLinks).hide();
            activityMenuItem.classList.remove("open");
            activityToggle.setAttribute("aria-expanded", "false");

        }
    );

});


/* =========================================================
   BACK TO TOP
========================================================= */

const backTop =
    document.getElementById("backTop");


window.addEventListener(
    "scroll",
    () => {

        if (window.scrollY > 500) {

            backTop.classList.add("show");

        } else {

            backTop.classList.remove("show");

        }

    }
);


backTop.addEventListener(
    "click",
    () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }
);


/* =========================================================
   FORM
========================================================= */

const enquiryForm =
    document.getElementById("enquiryForm");


enquiryForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const formData =
            new FormData(this);


        const message = [
            "Admission enquiry for Sant Raghwacharya Public School",
            `Parent's name: ${formData.get("parent")}`,
            `Phone: ${formData.get("phone")}`,
            `Email: ${formData.get("email")}`,
            `Class: ${formData.get("class")}`,
            `Message: ${formData.get("message")}`
        ].join("\n");

        const whatsappUrl =
            `https://wa.me/917007827516?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, "_blank", "noopener,noreferrer");


        this.reset();

    }
);


/* =========================================================
   START
========================================================= */

loadSchoolData();