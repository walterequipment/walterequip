/**
 * Walter Equipment - Website V3
 * Main JavaScript
 * Handles: Header scroll, Mobile menu, Product filter tabs,
 *          Scroll animations, Form validation (3 forms)
 */

'use strict';

// ================================================
// 1. STICKY HEADER WITH SCROLL EFFECT
// ================================================
const header = document.getElementById('header');

function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleHeaderScroll, { passive: true });
handleHeaderScroll();

// ================================================
// 2. MOBILE HAMBURGER MENU
// ================================================
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');

function toggleMobileMenu() {
    const isOpen = hamburger.classList.contains('active');
    if (isOpen) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
        document.body.style.overflow = '';
    } else {
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        nav.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (nav.classList.contains('open')) closeMobileMenu();
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) closeMobileMenu();
});

// ================================================
// 3. ACTIVE NAV LINK ON SCROLL
// ================================================
function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 130;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveNavLink, { passive: true });
setActiveNavLink();

// ================================================
// 4. INTERSECTION OBSERVER — FADE-IN ANIMATIONS
// ================================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in-up');
    if (!animatedElements.length) return;

    if (!('IntersectionObserver' in window)) {
        animatedElements.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        entry.target.classList.add('visible');
                    });
                    observer.unobserve(entry.target);
                }
            });
        },
        { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.08 }
    );

    animatedElements.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initScrollAnimations);

// ================================================
// 5. PRODUCT CATEGORY FILTER TABS
// ================================================
const categoryTabs = document.getElementById('categoryTabs');
const productsGrid = document.getElementById('productsGrid');

if (categoryTabs && productsGrid) {
    categoryTabs.addEventListener('click', (e) => {
        const tab = e.target.closest('.category-tab');
        if (!tab) return;

        const category = tab.dataset.category;

        // Update active tab
        categoryTabs.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Filter product cards
        const cards = productsGrid.querySelectorAll('.product-card');
        cards.forEach(card => {
            const cardCategory = card.dataset.category;
            if (category === 'all' || cardCategory === category) {
                card.classList.remove('hidden');
                card.classList.add('visible');
            } else {
                card.classList.add('hidden');
            }
        });
    });
}

// ================================================
// 6. FORM VALIDATION HELPER
// ================================================
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const parent = field.closest('.form-group');
    const errorEl = parent ? parent.querySelector('.form-error') : null;

    let isValid = true;
    let errorMsg = '';

    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMsg = 'This field is required';
    }

    if (isValid && fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMsg = 'Please enter a valid email address';
        }
    }

    if (isValid) {
        field.classList.remove('error');
    } else {
        field.classList.add('error');
    }

    if (errorEl) errorEl.textContent = errorMsg;

    return isValid;
}

function setupFormValidation(formEl, submitBtnId, successId) {
    if (!formEl) return;

    const submitBtn = document.getElementById(submitBtnId);
    const formSuccess = document.getElementById(successId);

    // Real-time validation
    const fields = formEl.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                field.classList.remove('error');
                const parent = field.closest('.form-group');
                const errorEl = parent ? parent.querySelector('.form-error') : null;
                if (errorEl) errorEl.textContent = '';
            }
        });
    });

    // Form submission
    formEl.addEventListener('submit', async (e) => {
        e.preventDefault();

        const allFields = formEl.querySelectorAll('input, select, textarea');
        let isFormValid = true;

        allFields.forEach(field => {
            if (!validateField(field)) isFormValid = false;
        });

        if (!isFormValid) {
            const firstError = formEl.querySelector('.error');
            if (firstError) firstError.focus();
            return;
        }

        // Show loading
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Reset button
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;

        // Show success
        formSuccess.style.display = 'flex';
        formEl.reset();

        setTimeout(() => {
            formSuccess.style.display = 'none';
        }, 5000);
    });
}

// Initialize all three forms
setupFormValidation(document.getElementById('inquiryForm'), 'inqSubmitBtn', 'inqFormSuccess');
setupFormValidation(document.getElementById('applyForm'), 'appSubmitBtn', 'appFormSuccess');
setupFormValidation(document.getElementById('contactForm'), 'submitBtn', 'formSuccess');

// ================================================
// 7. SMOOTH SCROLL
// ================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            const headerHeight = header ? header.offsetHeight : 72;
            const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ================================================
// 8. DEBOUNCED RESIZE
// ================================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

window.addEventListener(
    'resize',
    debounce(() => {
        if (window.innerWidth > 768 && nav.classList.contains('open')) {
            closeMobileMenu();
        }
    }, 200),
    { passive: true }
);

// ================================================
// 9. CONSOLE BRANDING
// ================================================
console.log(
    '%c🚜 Walter Equipment',
    'font-size: 16px; font-weight: bold; color: #1b5e20;'
);
console.log(
    '%cMini Excavators, Attachments & Parts | Dealer Program Available',
    'font-size: 12px; color: #6b8e6b;'
);
