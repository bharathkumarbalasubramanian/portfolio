document.addEventListener('DOMContentLoaded', () => {
    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    // Add initial reveal styles via JS once instead of external CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.active { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(style);

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Theme toggle logic for Tailwind
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            html.classList.toggle('dark');
            const theme = html.classList.contains('dark') ? 'dark' : 'light';
            localStorage.setItem('portfolio-theme', theme);
        });
    }

    // Smooth scroll for nav links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    e.preventDefault();
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- NEW: API Integration ---
    const API_BASE_URL = 'http://127.0.0.1:8000'; // Local FastAPI URL

    async function fetchStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/stats`);
            if (response.ok) {
                const data = await response.json();
                document.getElementById('stat-projects').textContent = data.projects_built;
                document.getElementById('stat-models').textContent = data.ai_models_used;
                document.getElementById('stat-impact').textContent = data.impact_driven;
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }

    async function fetchProjects() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/projects`);
            if (response.ok) {
                const projects = await response.json();
                const grid = document.getElementById('projects-grid');
                grid.innerHTML = ''; // Clear skeleton/existing

                projects.forEach(project => {
                    const card = document.createElement('div');
                    card.className = 'group relative flex flex-col p-8 rounded-3xl glass border border-white dark:border-slate-800 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 reveal';
                    card.innerHTML = `
                        <div class="flex justify-between items-start mb-6">
                            <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">Healthcare AI</span>
                            <a href="#" class="text-slate-400 hover:text-primary transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>
                        </div>
                        <h3 class="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">${project.title}</h3>
                        <p class="text-xs font-medium text-slate-400 mb-4 uppercase tracking-widest">${project.role} • ${project.year}</p>
                        <p class="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">${project.impact}</p>
                        <a href="#" class="w-full btn btn-primary justify-center text-sm py-4 mt-auto">View Case Study</a>
                    `;
                    grid.appendChild(card);
                    revealObserver.observe(card); // Re-observe the new card
                });
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    // Call API functions
    fetchStats();
    fetchProjects();
});
