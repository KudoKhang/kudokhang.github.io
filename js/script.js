// declaraction of document.ready() function.
(function () {
    var ie = !!(window.attachEvent && !window.opera);
    var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
    var fn = [];
    var run = function () {
        for (var i = 0; i < fn.length; i++) fn[i]();
    };
    var d = document;
    d.ready = function (f) {
        if (!ie && !wk && d.addEventListener)
            return d.addEventListener('DOMContentLoaded', f, false);
        if (fn.push(f) > 1) return;
        if (ie)
            (function () {
                try {
                    d.documentElement.doScroll('left');
                    run();
                } catch (err) {
                    setTimeout(arguments.callee, 0);
                }
            })();
        else if (wk)
            var t = setInterval(function () {
                if (/^(loaded|complete)$/.test(d.readyState))
                    clearInterval(t), run();
            }, 0);
    };
})();


document.ready(
    // toggleTheme function.
    // this script shouldn't be changed.
    () => {
        var _Blog = window._Blog || {};
        const pagebody = document.getElementsByTagName('body')[0];
        const toggleButton = document.getElementById('theme-toggle');
        const mobileToggle = document.getElementById('mobile-toggle-theme');

        const setTheme = (isDark, shouldPersist = true) => {
            pagebody.classList.toggle('dark-theme', isDark);

            if (toggleButton) {
                toggleButton.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            }
            if (mobileToggle) {
                mobileToggle.innerText = isDark ? 'Dark' : 'Light';
            }

            if (shouldPersist) {
                window.localStorage &&
                window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
            }
        };

        const currentTheme = window.localStorage && window.localStorage.getItem('theme');
        setTheme(currentTheme === 'dark', false);

        _Blog.toggleTheme = function () {
            if (toggleButton) {
                toggleButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setTheme(!pagebody.classList.contains('dark-theme'));
                });
            }

            if (mobileToggle) {
                mobileToggle.addEventListener('click', () => {
                    setTheme(!pagebody.classList.contains('dark-theme'));
                });
            }
        };
        _Blog.toggleTheme();
        // ready function.
    }
);

document.ready(() => {
    const revealItems = document.querySelectorAll('.about-reveal, .project-reveal, .story-item, .about-project-card, .showcase-card, .publication-card');
    if (!revealItems.length) return;

    if (!('IntersectionObserver' in window)) {
        revealItems.forEach((item) => item.classList.add('is-visible'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.16,
        rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach((item) => revealObserver.observe(item));
});

document.ready(() => {
    const filterButtons = document.querySelectorAll('[data-project-filter]');
    const projectCards = document.querySelectorAll('[data-project-kind]');
    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const activeFilter = button.getAttribute('data-project-filter');

            filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
            projectCards.forEach((card) => {
                const projectKinds = (card.getAttribute('data-project-kind') || '').split(' ');
                const shouldShow = activeFilter === 'all' || projectKinds.includes(activeFilter);

                card.classList.toggle('is-hidden', !shouldShow);
            });
        });
    });
});

document.ready(() => {
    const modal = document.getElementById('project-modal');
    const projectCards = document.querySelectorAll('.showcase-card');
    if (!modal || !projectCards.length) return;

    const projectDetails = {
        'Soccer Match Analysis': {
            kicker: 'Application · UpWork freelance · Apr 2025 - Jun 2025',
            summary: 'A cross-platform desktop product for football tactical analysis, turning feeds from two wide-angle cameras into a usable panoramic view with automated focus on the active play area.',
            highlights: [
                'Built a robust video stitching pipeline with camera calibration and lens distortion correction for wide-angle footage.',
                'Fine-tuned an object detection model and clustering logic to identify player groups and simulate camera-operator style focus.',
                'Delivered a complete GUI application across operating systems, including product packaging and client handoff.',
                'Managed the full freelance lifecycle and reached the first $1,000 UpWork milestone.'
            ],
            stack: ['Computer Vision', 'Video Stitching', 'Camera Calibration', 'Object Detection', 'GUI'],
            link: 'https://www.youtube.com/watch?v=ZNacjRtL9JQ',
            linkText: 'Watch demo'
        },
        'LectureHub': {
            kicker: 'Application · Personal project · Jun 2025 - Present',
            summary: 'A full-stack platform for looking up competitive programming solutions from multiple online judges, built from idea to production deployment.',
            highlights: [
                'Designed and implemented the full web application with a structured, production-oriented codebase.',
                'Built CI/CD and deployed the system on AWS with self-managed cloud configuration.',
                'Owned product planning, implementation, deployment, and iteration independently.'
            ],
            stack: ['Full-stack', 'AWS', 'CI/CD', 'Product Engineering', 'Competitive Programming'],
            link: 'https://www.lecturehub.tech/',
            linkText: 'Open website'
        },
        'API Services for Long-Running Tasks': {
            kicker: 'Engineering · FTECH · Sep 2023 - Jan 2025',
            summary: 'A microservices API platform for resource-intensive video generation workloads that can run for hours while still returning immediate task responses.',
            highlights: [
                'Designed a scalable microservices architecture for long-running CPU/GPU/memory-heavy workloads.',
                'Added CI/CD, monitoring, alerting, and error tracking with Prometheus, Grafana, and Sentry.',
                'Optimized GPU usage with sleep/wake-up behavior and in-memory caching for intermittent workloads.',
                'Improved fault tolerance and operational visibility for production processing.'
            ],
            stack: ['Microservices', 'GPU', 'CI/CD', 'Prometheus', 'Grafana', 'Sentry'],
            link: '',
            linkText: ''
        },
        'Automatic Image and Video Merging': {
            kicker: 'Application · FTECH · Sep 2023 - Jan 2025',
            summary: 'An image processing and deep learning module for automatically merging images and videos into predefined templates, including green-screen video workflows.',
            highlights: [
                'Engineered a high-performance module for green-screen video merging with strong speed and resource constraints.',
                'Managed deployment strategy with rolling updates and production monitoring.',
                'Tracked model performance, CPU/GPU utilization, and availability.',
                'Mentored a junior engineer on Git, Docker, performance reporting, and delivery practice.'
            ],
            stack: ['Deep Learning', 'Image Processing', 'MLOps', 'Docker', 'Monitoring'],
            link: '',
            linkText: ''
        },
        'Advanced Q&A Chatbot': {
            kicker: 'Application · LectureHub feature · PoC',
            summary: 'A RAG-based chatbot for conversational investigation of programming problems, grounded in problem descriptions, optimal code, and detailed solutions.',
            highlights: [
                'Designed a complete RAG pipeline backed by a pre-computed vector database.',
                'Improved retrieval latency and answer precision for complex problem-specific questions.',
                'Reduced hallucinations compared with a non-RAG baseline by grounding answers in curated knowledge.'
            ],
            stack: ['RAG', 'Vector Database', 'LLM', 'Retrieval', 'Prompting'],
            link: 'https://github.com/LectureHubTeam/lecturehub-chatbox',
            linkText: 'Open repository'
        },
        'CodeMath Solver': {
            kicker: 'Application · Personal project · Apr 2025 - Present',
            summary: 'An autonomous coding-problem solver for platforms like codemath.vn and lqdoj.edu.vn, powered by prompt engineering and browser automation.',
            highlights: [
                'Designed a multi-stage prompt framework for accurate solution generation and stable output formatting.',
                'Built resilient Selenium automation with exception handling for long-running operation.',
                'Reached #1 rank on codemath.vn within 24 hours of deployment.'
            ],
            stack: ['LLM', 'Prompt Engineering', 'Selenium', 'Automation', 'Python'],
            link: 'https://github.com/LectureHubTeam/codemath-solver',
            linkText: 'Open repository'
        },
        'Programming Educator & Mentor': {
            kicker: 'Education · Freelance · May 2024 - Present',
            summary: 'A programming curriculum for primary and secondary students, focused on computational thinking, Scratch, Python, and hands-on problem solving.',
            highlights: [
                'Simplified Python syntax and core algorithms into interactive, age-appropriate lessons.',
                'Designed exercises to build logical thinking and problem-solving habits.',
                'Mentored students toward strong results in the Tin Hoc Tre competition.'
            ],
            stack: ['Python', 'Scratch', 'Algorithms', 'Curriculum Design', 'Mentoring'],
            link: '',
            linkText: ''
        },
        'Boom Mail': {
            kicker: 'Engineering · Freelance · Dec 2022 - Jul 2023',
            summary: 'A backend service for email automation, focused on Python processing, MySQL data management, API design, and frontend integration.',
            highlights: [
                'Designed and implemented backend APIs for an email automation workflow.',
                'Collaborated with frontend developers through clear integration requirements.',
                'Gained deeper experience in backend-to-frontend architecture and delivery.'
            ],
            stack: ['Python', 'MySQL', 'Backend', 'API Design', 'Integration'],
            link: 'https://github.com/KudoKhang/boom_mail',
            linkText: 'Open repository'
        },
        'License Plate Recognition': {
            kicker: 'Research · Freelance · Jul 2022 - Sep 2022',
            summary: 'A factory-deployed license plate recognition system with Dockerized API delivery and research output at ATiGB 2022.',
            highlights: [
                'Developed and deployed an automated license plate recognition system in a factory setting.',
                'Reached 97% accuracy on a private real-world test dataset.',
                'Built Docker image and API for convenient deployment.',
                'Published the research in the ATiGB 2022 conference proceedings.'
            ],
            stack: ['CNN', 'OCR', 'Docker', 'API', 'Computer Vision'],
            link: 'https://github.com/KudoKhang/LPR',
            linkText: 'Open repository'
        },
        'Product Classification System': {
            kicker: 'Research · University project · May 2022',
            summary: 'A graduation thesis project for orange classification using deep learning, Jetson Nano video processing, conveyor design, and robotic arms.',
            highlights: [
                'Designed a conveyor system and two robotic arms for product classification.',
                'Used Jetson Nano to process camera video and control robotic arms.',
                'Achieved A+ in the graduation thesis defense, the highest score in class.'
            ],
            stack: ['Jetson Nano', 'Deep Learning', 'Robotics', 'Computer Vision', 'Embedded AI'],
            link: '',
            linkText: ''
        }
    };

    const titleEl = document.getElementById('project-modal-title');
    const kickerEl = document.getElementById('project-modal-kicker');
    const summaryEl = document.getElementById('project-modal-summary');
    const metaEl = document.getElementById('project-modal-meta');
    const highlightsEl = document.getElementById('project-modal-highlights');
    const stackEl = document.getElementById('project-modal-stack');
    const linkEl = document.getElementById('project-modal-link');

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    };

    const openModal = (card) => {
        const title = card.querySelector('h2') && card.querySelector('h2').innerText;
        const detail = projectDetails[title];
        if (!detail) return;

        titleEl.innerText = title;
        kickerEl.innerText = detail.kicker;
        summaryEl.innerText = detail.summary;
        metaEl.innerHTML = '';
        detail.kicker.split(' · ').forEach((item) => {
            const span = document.createElement('span');
            span.innerText = item;
            metaEl.appendChild(span);
        });
        highlightsEl.innerHTML = '';
        detail.highlights.forEach((item) => {
            const li = document.createElement('li');
            li.innerText = item;
            highlightsEl.appendChild(li);
        });
        stackEl.innerHTML = '';
        detail.stack.forEach((item) => {
            const span = document.createElement('span');
            span.innerText = item;
            stackEl.appendChild(span);
        });

        if (detail.link) {
            linkEl.href = detail.link;
            linkEl.innerText = detail.linkText || 'Open link';
            linkEl.style.display = 'inline-flex';
        } else {
            linkEl.style.display = 'none';
        }

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        modal.querySelector('.project-modal-close').focus();
    };

    projectCards.forEach((card) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');

        card.addEventListener('click', (event) => {
            if (event.target.closest('a')) return;
            openModal(card);
        });

        card.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            openModal(card);
        });
    });

    modal.querySelectorAll('[data-project-modal-close]').forEach((item) => {
        item.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
});
