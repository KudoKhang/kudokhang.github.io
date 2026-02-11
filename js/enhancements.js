/**
 * Blog UX Enhancements - Phase 1
 * Features: Reading Progress, Copy Code, Back to Top
 */

(function () {
    'use strict';

    // ==================== READING PROGRESS BAR ====================
    function initReadingProgress() {
        // Only show on post pages
        if (!document.querySelector('.post-content')) return;

        // Create progress bar element
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
        document.body.appendChild(progressBar);

        const progressFill = progressBar.querySelector('.reading-progress-fill');

        // Update progress on scroll
        function updateProgress() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Calculate progress percentage
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            const clampedPercent = Math.min(100, Math.max(0, scrollPercent));

            progressFill.style.width = clampedPercent + '%';
        }

        // Throttle scroll events for performance
        let ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    updateProgress();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Initial update
        updateProgress();
    }

    // ==================== COPY CODE BUTTON ====================
    function initCopyCode() {
        const codeBlocks = document.querySelectorAll('pre code, .highlight');

        codeBlocks.forEach(function (block) {
            // Skip if already has copy button
            if (block.parentElement.querySelector('.copy-code-btn')) return;

            // Create copy button
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-code-btn';
            copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
            copyBtn.setAttribute('aria-label', 'Copy code');
            copyBtn.setAttribute('title', 'Copy code');

            // Find the appropriate parent element
            const container = block.tagName === 'CODE' ? block.parentElement : block;

            // Make container relative for absolute positioning
            if (window.getComputedStyle(container).position === 'static') {
                container.style.position = 'relative';
            }

            container.appendChild(copyBtn);

            // Copy functionality
            copyBtn.addEventListener('click', function (e) {
                e.preventDefault();

                // Get code text
                const codeElement = block.tagName === 'CODE' ? block : block.querySelector('code') || block;
                const code = codeElement.textContent || codeElement.innerText;

                // Copy to clipboard
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(code).then(function () {
                        showCopySuccess(copyBtn);
                    }).catch(function () {
                        fallbackCopy(code, copyBtn);
                    });
                } else {
                    fallbackCopy(code, copyBtn);
                }
            });
        });
    }

    // Fallback copy method for older browsers
    function fallbackCopy(text, button) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
            showCopySuccess(button);
        } catch (err) {
            console.error('Copy failed:', err);
        }

        document.body.removeChild(textarea);
    }

    // Show success feedback
    function showCopySuccess(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        button.classList.add('copied');

        setTimeout(function () {
            button.innerHTML = originalHTML;
            button.classList.remove('copied');
        }, 2000);
    }

    // ==================== BACK TO TOP BUTTON ====================
    function initBackToTop() {
        // Create back to top button
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        backToTopBtn.setAttribute('title', 'Back to top');
        document.body.appendChild(backToTopBtn);

        // Show/hide button based on scroll position
        function toggleBackToTop() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // Smooth scroll to top
        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Throttle scroll events
        let ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    toggleBackToTop();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Initial check
        toggleBackToTop();
    }

    // ==================== INITIALIZE ALL ====================
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                initReadingProgress();
                initCopyCode();
                initBackToTop();
            });
        } else {
            initReadingProgress();
            initCopyCode();
            initBackToTop();
        }
    }

    // Start initialization
    init();
})();
