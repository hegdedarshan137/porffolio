/* -------------------------------------------------------------
   Darshan Hegde - Portfolio JavaScript Logic
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. Loading Screen Handler
    // ---------------------------------------------------------
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('fade-out');
                // Initiate animations once page is loaded
                triggerScrollReveal();
            }, 800); // Give enough time for smooth experience
        });
    }

    // ---------------------------------------------------------
    // 2. Light/Dark Theme Switcher
    // ---------------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check LocalStorage or system preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('dark-theme')) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // ---------------------------------------------------------
    // 3. Scroll Progress Indicator & Navbar Scrolled Class
    // ---------------------------------------------------------
    const scrollProgress = document.getElementById('scroll-progress');
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolledVal = (scrollTop / docHeight) * 100;
        
        if (scrollProgress) {
            scrollProgress.style.width = `${scrolledVal}%`;
        }

        // Add scrolled class to navbar
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // ---------------------------------------------------------
    // 4. Mobile Menu Navigation Handler
    // ---------------------------------------------------------
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ---------------------------------------------------------
    // 5. Typing Animation Logic
    // ---------------------------------------------------------
    const typingTextElement = document.getElementById('typing-text');
    const roles = [
        "MCA Student", 
        "Aspiring Software Engineer", 
        "Cloud & DevOps Enthusiast"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        if (!typingTextElement) return;

        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster backspacing
        } else {
            typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        // Determine pauses & status swaps
        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000; // Pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    }
    
    // Launch typing
    if (typingTextElement) {
        setTimeout(typeEffect, 1000);
    }

    // ---------------------------------------------------------
    // 6. Floating Particles Background (Canvas)
    // ---------------------------------------------------------
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        
        // Resize Handler
        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle Blueprint
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1; // size between 1 and 4
                this.speedX = Math.random() * 0.6 - 0.3; // speed X
                this.speedY = Math.random() * 0.6 - 0.3; // speed Y
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce boundaries
                if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
                if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
            }

            draw() {
                ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000); // density
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
        window.addEventListener('resize', initParticles);
    }

    // ---------------------------------------------------------
    // 7. Dynamic Project Loading & Filter Animation
    // ---------------------------------------------------------
    const projectsGrid = document.getElementById('projects-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let allProjectsData = [];

    // Fetch details from local projects.json
    async function loadProjects() {
        if (!projectsGrid) return;
        try {
            const response = await fetch('data/projects.json');
            if (!response.ok) throw new Error('Failed to fetch projects data');
            
            allProjectsData = await response.json();
            renderProjects(allProjectsData);
        } catch (error) {
            console.error('Error loading projects:', error);
            projectsGrid.innerHTML = `
                <div class="project-card-loading">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: var(--secondary-color); margin-bottom:10px;"></i>
                    <p>Failed to load projects. Please try running on a local web server.</p>
                </div>
            `;
        }
    }

    function renderProjects(projects) {
        if (!projectsGrid) return;
        projectsGrid.innerHTML = '';

        if (projects.length === 0) {
            projectsGrid.innerHTML = '<div class="project-card-loading">No projects found.</div>';
            return;
        }

        projects.forEach((proj, idx) => {
            const card = document.createElement('article');
            card.className = 'project-card scroll-reveal';
            card.setAttribute('data-animation', 'slide-up');
            card.style.transitionDelay = `${(idx % 3) * 0.1}s`;

            // Setup feature items
            const featuresHTML = proj.features.map(feat => `<li>${feat}</li>`).join('');
            
            // Setup technology tags
            const techHTML = proj.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('');

            card.innerHTML = `
                <div class="project-img-wrapper">
                    <img src="${proj.image}" alt="${proj.title}" class="project-img" onerror="this.src='https://placehold.co/600x400/121024/f3f4f6?text=${proj.title}'">
                    <div class="project-badge-container">
                        <span class="project-badge badge-status">${proj.status}</span>
                        <span class="project-badge badge-category">${proj.category === 'devops' ? 'Cloud & DevOps' : 'Web App'}</span>
                    </div>
                </div>
                <div class="project-body">
                    <h3 class="project-title">${proj.title}</h3>
                    <p class="project-desc">${proj.description}</p>
                    <h4 class="project-features-title">Key Features:</h4>
                    <ul class="project-features">
                        ${featuresHTML}
                    </ul>
                    <div class="project-tech-tags">
                        ${techHTML}
                    </div>
                    <div class="project-links">
                        <a href="${proj.github}" target="_blank" class="btn btn-sm btn-secondary project-link">
                            <i class="fab fa-github"></i> Repository
                        </a>
                        <a href="${proj.demo}" target="_blank" class="btn btn-sm btn-primary project-link">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                    </div>
                </div>
            `;
            
            projectsGrid.appendChild(card);
            
            // Trigger IntersectionObserver scan on newly added card
            setTimeout(() => {
                card.classList.add('reveal-visible');
            }, 100);
        });
    }

    // Setup filtering actions
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            // Add slight fade-out, filter data, re-render, and fade back in
            if (projectsGrid) {
                projectsGrid.style.opacity = '0';
                projectsGrid.style.transform = 'translateY(10px)';
                projectsGrid.style.transition = 'all var(--transition-fast)';
                
                setTimeout(() => {
                    let filtered = allProjectsData;
                    if (filterValue !== 'all') {
                        filtered = allProjectsData.filter(p => p.category === filterValue);
                    }
                    renderProjects(filtered);
                    
                    projectsGrid.style.opacity = '1';
                    projectsGrid.style.transform = 'translateY(0)';
                }, 300);
            }
        });
    });

    loadProjects();

    // ---------------------------------------------------------
    // 8. Scroll Reveal & Intersection Observers
    // ---------------------------------------------------------
    function triggerScrollReveal() {
        const revealElements = document.querySelectorAll('.scroll-reveal');
        
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    obs.unobserve(entry.target); // Unobserve once animated
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }

    // Trigger skills fill animation when tech section is visible
    const techSection = document.getElementById('tech-stack');
    if (techSection) {
        const skillFills = document.querySelectorAll('.skill-fill');
        const skillsObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillFills.forEach(fill => {
                        const targetWidth = fill.getAttribute('data-width');
                        fill.style.width = targetWidth;
                    });
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        skillsObserver.observe(techSection);
    }

    // Navigation Active Link on Scroll
    const sections = document.querySelectorAll('section, main > section');
    const navItems = document.querySelectorAll('.nav-link');
    
    if (sections.length > 0 && navItems.length > 0) {
        const activeNavObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.getAttribute('id');
                    
                    navItems.forEach(item => {
                        item.classList.remove('active');
                        if (item.getAttribute('href') === `#${activeId}`) {
                            item.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.35,
            rootMargin: '-80px 0px -40% 0px'
        });
        
        sections.forEach(sec => activeNavObserver.observe(sec));
    }

    // ---------------------------------------------------------
    // 9. Back To Top Action
    // ---------------------------------------------------------
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ---------------------------------------------------------
    // 10. Certifications Modals (Lightbox Details)
    // ---------------------------------------------------------
    const certModal = document.getElementById('cert-modal');
    const modalClose = document.getElementById('modal-close');
    const viewCertButtons = document.querySelectorAll('.view-cert-btn');

    // Certificate metadata mapping
    const certData = {
        aws: {
            title: "AWS Cloud Fundamentals",
            issuer: "AWS Training & Certification",
            date: "Completed: 2025",
            icon: "fab fa-aws",
            gradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)"
        },
        devops: {
            title: "DevOps Fundamentals",
            issuer: "Linux Foundation / Coursera",
            date: "Completed: 2025",
            icon: "fas fa-infinity",
            gradient: "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)"
        },
        web: {
            title: "Web Development Certification",
            issuer: "freeCodeCamp / Udemy",
            date: "Completed: 2024",
            icon: "fas fa-code",
            gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
        },
        python: {
            title: "Python Programming Certification",
            issuer: "Python Institute / Coursera",
            date: "Completed: 2024",
            icon: "fab fa-python",
            gradient: "linear-gradient(135deg, #0369a1 0%, #0284c7 100%)"
        },
        database: {
            title: "Database Management Certification",
            issuer: "Oracle / Udemy",
            date: "Completed: 2024",
            icon: "fas fa-database",
            gradient: "linear-gradient(135deg, #701a75 0%, #a21caf 100%)"
        }
    };

    function openCertModal(key) {
        if (!certModal || !certData[key]) return;
        
        const data = certData[key];
        const modalPlaceholder = document.getElementById('modal-cert-img-placeholder');
        const modalTitle = document.getElementById('modal-cert-title');
        const modalIssuer = document.getElementById('modal-cert-issuer');
        const modalDate = document.getElementById('modal-cert-date');

        if (modalPlaceholder) {
            modalPlaceholder.style.background = data.gradient;
            modalPlaceholder.innerHTML = `
                <i class="${data.icon}"></i>
                <span>${data.title}</span>
            `;
        }

        if (modalTitle) modalTitle.textContent = data.title;
        if (modalIssuer) modalIssuer.innerHTML = `<i class="fas fa-building"></i> ${data.issuer}`;
        if (modalDate) modalDate.innerHTML = `<i class="far fa-calendar-alt"></i> ${data.date}`;

        certModal.classList.add('show');
        body.style.overflow = 'hidden'; // Lock background scroll
    }

    function closeCertModal() {
        if (!certModal) return;
        certModal.classList.remove('show');
        body.style.overflow = ''; // Release scroll
    }

    viewCertButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-cert');
            openCertModal(key);
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeCertModal);
    }
    
    if (certModal) {
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) closeCertModal();
        });
    }

    // ---------------------------------------------------------
    // 11. Contact Form Verification & Dialogue Popup
    // ---------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formModal = document.getElementById('form-modal');
    const formModalClose = document.getElementById('form-modal-close');
    const formModalBtn = document.getElementById('form-modal-btn');
    
    function showFormModal(status, title, message) {
        if (!formModal) return;
        
        const iconDiv = document.getElementById('form-modal-icon');
        const titleH3 = document.getElementById('form-modal-title');
        const messageP = document.getElementById('form-modal-message');

        if (iconDiv) {
            iconDiv.className = `form-modal-icon ${status}`;
            iconDiv.innerHTML = status === 'success' 
                ? '<i class="fas fa-check"></i>' 
                : '<i class="fas fa-times"></i>';
        }

        if (titleH3) titleH3.textContent = title;
        if (messageP) messageP.textContent = message;

        formModal.classList.add('show');
        body.style.overflow = 'hidden';
    }

    function closeFormModal() {
        if (!formModal) return;
        formModal.classList.remove('show');
        body.style.overflow = '';
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnHTML = submitBtn.innerHTML;
            
            // Set button loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            // Simulate server request delay
            setTimeout(() => {
                // Reset button status
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
                
                const emailInput = document.getElementById('email').value.trim();
                const nameInput = document.getElementById('name').value.trim();
                
                // Basic validation triggers mock results
                if (emailInput.includes('@') && nameInput.length > 2) {
                    showFormModal(
                        'success', 
                        'Message Sent Successfully!', 
                        `Thank you, ${nameInput}. Your message has been sent successfully. Darshan will get back to you soon at ${emailInput}.`
                    );
                    contactForm.reset();
                } else {
                    showFormModal(
                        'error', 
                        'Submission Failed', 
                        'Please verify your credentials and try again.'
                    );
                }
            }, 1500);
        });
    }

    if (formModalClose) formModalClose.addEventListener('click', closeFormModal);
    if (formModalBtn) formModalBtn.addEventListener('click', closeFormModal);
    if (formModal) {
        formModal.addEventListener('click', (e) => {
            if (e.target === formModal) closeFormModal();
        });
    }
});
