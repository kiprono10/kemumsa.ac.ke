// ===== WAIT FOR DOM TO LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ANNOUNCEMENT BAR =====
    const announcementBar = document.querySelector('.announcement-bar');
    const closeAnnouncement = document.querySelector('.close-announcement');
    
    if (closeAnnouncement) {
        closeAnnouncement.addEventListener('click', function() {
            if (announcementBar) {
                announcementBar.style.display = 'none';
                localStorage.setItem('announcementClosed', Date.now().toString());
            }
        });
    }
    
    // Check if announcement was recently closed
    const announcementClosed = localStorage.getItem('announcementClosed');
    if (announcementClosed && announcementBar) {
        const closedTime = parseInt(announcementClosed);
        const twentyFourHours = 24 * 60 * 60 * 1000;
        if (Date.now() - closedTime < twentyFourHours) {
            announcementBar.style.display = 'none';
        }
    }
    
    // ===== THEME TOGGLE =====
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            if (themeIcon) {
                if (document.body.classList.contains('dark-theme')) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                } else {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
            }
            
            // Save preference
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        }
    }
    
    // ===== LOGIN BUTTON HANDLER =====
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/login.html';
        });
    }

    // ===== JOIN NOW BUTTON HANDLER =====
    const joinBtn = document.querySelector('.btn-join');
    if (joinBtn) {
        joinBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/signup.html';
        });
    }

    // ===== ANIMATED COUNTERS =====
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length > 0) {
        const observerOptions = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target;
                    const target = parseInt(statNumber.getAttribute('data-count'));
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;
                    
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            statNumber.textContent = target.toLocaleString();
                            clearInterval(timer);
                        } else {
                            statNumber.textContent = Math.floor(current).toLocaleString();
                        }
                    }, 16);
                    
                    observer.unobserve(statNumber);
                }
            });
        }, observerOptions);
        
        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }
    
    // ===== FLOATING ELEMENTS ANIMATION =====
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 2}s`;
    });
    
    // ===== MOBILE BOTTOM NAV ACTIVE STATE =====
    const navItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            item.classList.add('active');
        }
        
        // Remove active class from others
        if (href !== currentPage && item.classList.contains('active')) {
            item.classList.remove('active');
        }
        
        item.addEventListener('click', function(e) {
            if (this.classList.contains('menu-toggle')) {
                e.preventDefault();
                // Toggle mobile menu
                document.querySelector('.desktop-nav')?.classList.toggle('show');
            }
        });
    });
    
    // ===== FAQ TOGGLE =====
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            faqItem.classList.toggle('active');
            
            // Close other FAQ items
            faqQuestions.forEach(otherQuestion => {
                const otherItem = otherQuestion.parentElement;
                if (otherItem !== faqItem && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });
    
    // ===== FORM VALIDATION =====
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#dc3545';
                    isValid = false;
                    
                    // Add error message
                    if (!field.nextElementSibling?.classList.contains('error-message')) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'This field is required';
                        errorMsg.style.color = '#dc3545';
                        errorMsg.style.fontSize = '0.8rem';
                        errorMsg.style.marginTop = '5px';
                        field.parentNode.insertBefore(errorMsg, field.nextSibling);
                    }
                } else {
                    field.style.borderColor = '';
                    const errorMsg = field.nextElementSibling;
                    if (errorMsg?.classList.contains('error-message')) {
                        errorMsg.remove();
                    }
                }
            });
            
            if (isValid) {
                // Show success message
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                submitBtn.style.background = '#28a745';
                submitBtn.disabled = true;
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    
                    // Show confirmation message
                    const successMsg = document.createElement('div');
                    successMsg.className = 'success-message';
                    successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Your message has been sent successfully!';
                    successMsg.style.color = '#28a745';
                    successMsg.style.marginTop = '20px';
                    successMsg.style.padding = '15px';
                    successMsg.style.borderRadius = '8px';
                    successMsg.style.background = 'rgba(40, 167, 69, 0.1)';
                    successMsg.style.textAlign = 'center';
                    
                    this.appendChild(successMsg);
                    
                    // Remove message after 5 seconds
                    setTimeout(() => {
                        successMsg.remove();
                    }, 5000);
                }, 3000);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.style.borderColor = '#dc3545';
                } else {
                    this.style.borderColor = '';
                    const errorMsg = this.nextElementSibling;
                    if (errorMsg?.classList.contains('error-message')) {
                        errorMsg.remove();
                    }
                }
            });
        });
    });
    
    // ===== MEMBER SEARCH FUNCTIONALITY =====
    const searchInput = document.querySelector('.search-input');
    const memberCards = document.querySelectorAll('.member-card');
    
    if (searchInput && memberCards.length > 0) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            memberCards.forEach(card => {
                const name = card.querySelector('h3').textContent.toLowerCase();
                const role = card.querySelector('.member-role').textContent.toLowerCase();
                const year = card.querySelector('.member-year').textContent.toLowerCase();
                const interests = card.querySelector('.member-interests').textContent.toLowerCase();
                
                if (name.includes(searchTerm) || 
                    role.includes(searchTerm) || 
                    year.includes(searchTerm) || 
                    interests.includes(searchTerm)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    }
    
    // ===== MEMBER FILTER FUNCTIONALITY =====
    const filterSelect = document.querySelector('.filter-select');
    
    if (filterSelect && memberCards.length > 0) {
        filterSelect.addEventListener('change', function() {
            const selectedYear = this.value;
            
            memberCards.forEach(card => {
                const yearText = card.querySelector('.member-year').textContent.toLowerCase();
                
                if (selectedYear === 'all' || 
                    (selectedYear === 'alumni' && yearText.includes('alumni')) ||
                    yearText.includes(`${selectedYear}`)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    }
    
    // ===== EVENT FILTER FUNCTIONALITY =====
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                // Filter events based on the selected filter
                filterEventsByType(filter);
            });
        });
    }

    // Function to filter events by type
    function filterEventsByType(filterType) {
        const allEventContainers = document.querySelectorAll('.events-container');
        const allSections = document.querySelectorAll('.events-list');

        if (filterType === 'all') {
            // Show all sections
            allSections.forEach(section => {
                section.style.display = 'block';
                setTimeout(() => {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, 10);
            });
        } else {
            // Hide all sections first
            allSections.forEach(section => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    section.style.display = 'none';
                }, 300);
            });

            // Show only the relevant section
            const targetSection = document.getElementById(filterType);
            if (targetSection) {
                setTimeout(() => {
                    targetSection.style.display = 'block';
                    setTimeout(() => {
                        targetSection.style.opacity = '1';
                        targetSection.style.transform = 'translateY(0)';
                    }, 10);
                }, 300);
            }
        }
    }
    
    // ===== RSVP BUTTON FUNCTIONALITY =====
    const rsvpButtons = document.querySelectorAll('.btn-rsvp');
    
    rsvpButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const eventTitle = this.closest('.event-details')?.querySelector('h3')?.textContent || 'Event';
            const eventDate = this.closest('.event-item')?.querySelector('.date-day')?.textContent || '';
            const eventMonth = this.closest('.event-item')?.querySelector('.date-month')?.textContent || '';
            
            // Show confirmation modal
            const modal = document.createElement('div');
            modal.className = 'rsvp-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3><i class="fas fa-calendar-check"></i> RSVP Confirmation</h3>
                    <p>You have successfully registered for:</p>
                    <p class="modal-event-title">${eventTitle}</p>
                    <p class="modal-event-date">${eventDate} ${eventMonth}</p>
                    <p>A confirmation email has been sent to your registered email address.</p>
                    <div class="modal-actions">
                        <button class="modal-close">Close</button>
                        <button class="modal-calendar"><i class="fas fa-calendar-plus"></i> Add to Calendar</button>
                    </div>
                </div>
            `;
            
            // Add modal styles
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '9999';
            
            const modalContent = modal.querySelector('.modal-content');
            modalContent.style.background = 'white';
            modalContent.style.padding = '30px';
            modalContent.style.borderRadius = 'var(--border-radius)';
            modalContent.style.maxWidth = '500px';
            modalContent.style.width = '90%';
            modalContent.style.textAlign = 'center';
            
            document.body.appendChild(modal);
            
            // Add event listeners to modal buttons
            modal.querySelector('.modal-close').addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            
            modal.querySelector('.modal-calendar').addEventListener('click', () => {
                alert('Event added to your calendar!');
                document.body.removeChild(modal);
            });
            
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
        });
    });
    
    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== LAZY LOAD IMAGES =====
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window && images.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // ===== ADD DARK THEME STYLES DYNAMICALLY =====
    const style = document.createElement('style');
    style.textContent = `
        .dark-theme {
            --text-dark: #f8f9fa;
            --text-light: #adb5bd;
            --white: #212529;
            --background-light: #343a40;
            --gray-light: #495057;
            --shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            --shadow-heavy: 0 20px 40px rgba(0, 0, 0, 0.4);
        }
        
        .dark-theme .feature-card,
        .dark-theme .stat-card,
        .dark-theme .event-card,
        .dark-theme .member-card,
        .dark-theme .contact-card,
        .dark-theme .value-item,
        .dark-theme .leader-card,
        .dark-theme .benefit-card {
            background: #2d3436;
        }
        
        .dark-theme .form-group input,
        .dark-theme .form-group select,
        .dark-theme .form-group textarea,
        .dark-theme .search-input {
            background: #495057;
            border-color: #6c757d;
            color: #f8f9fa;
        }
    `;
    document.head.appendChild(style);
    
    // ===== INITIALIZE MOBILE MENU =====
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const desktopNav = document.querySelector('.desktop-nav');

    if (mobileMenuToggle && desktopNav) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            desktopNav.classList.toggle('show');

            // Transform hamburger to X
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // ===== PULSE ANIMATION FOR NEW MEMBERS =====
    function createPulseEffect() {
        const pulseElements = document.querySelectorAll('.pulse');
        pulseElements.forEach(element => {
            element.style.animation = 'pulse 2s infinite';
        });
    }
    
    createPulseEffect();
});