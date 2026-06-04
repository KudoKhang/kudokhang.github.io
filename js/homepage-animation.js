/**
 * Ambient background animation for homepage and listing pages.
 * Layered particles, geometric outlines, and subtle pointer parallax.
 */

(function () {
    'use strict';

    function createHomepageScene() {
        const path = window.location.pathname.replace(/\/$/, '');
        const isAmbientPage = path === '' ||
            path === '/' ||
            path === '/archives' ||
            path.startsWith('/archives/') ||
            path === '/category' ||
            path.startsWith('/category/') ||
            path.startsWith('/categories/') ||
            path === '/tag' ||
            path.startsWith('/tag/') ||
            path.startsWith('/tags/');

        if (!isAmbientPage) return;

        const prefersReducedMotion = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const canvas = document.createElement('canvas');
        canvas.className = 'floating-shapes-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        document.body.insertBefore(canvas, document.body.firstChild);

        const ctx = canvas.getContext('2d');
        const particles = [];
        const shapes = [];
        const pointer = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            targetX: window.innerWidth / 2,
            targetY: window.innerHeight / 2
        };

        let width = 0;
        let height = 0;
        let pixelRatio = 1;
        let frame = 0;

        const palette = {
            light: ['#2d96bd', '#18c37e', '#ff6a00', '#8b5cf6'],
            dark: ['#81d6f3', '#18c37e', '#b7a5ff', '#f59e0b']
        };

        function themeColors() {
            return document.body.classList.contains('dark-theme') ? palette.dark : palette.light;
        }

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(width * pixelRatio);
            canvas.height = Math.floor(height * pixelRatio);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

            particles.length = 0;
            shapes.length = 0;

            const isMobile = width < 768;
            const particleCount = isMobile ? 34 : 64;
            const shapeCount = isMobile ? 7 : 15;

            for (let i = 0; i < particleCount; i += 1) {
                particles.push(new Particle());
            }
            for (let i = 0; i < shapeCount; i += 1) {
                shapes.push(new Shape());
            }
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.28;
                this.vy = (Math.random() - 0.5) * 0.28;
                this.radius = Math.random() * 1.8 + 0.7;
                this.depth = Math.random() * 0.8 + 0.2;
                this.phase = Math.random() * Math.PI * 2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.phase += 0.018;

                if (this.x < -20) this.x = width + 20;
                if (this.x > width + 20) this.x = -20;
                if (this.y < -20) this.y = height + 20;
                if (this.y > height + 20) this.y = -20;
            }

            draw(colors) {
                const parallaxX = (pointer.x - width / 2) * 0.018 * this.depth;
                const parallaxY = (pointer.y - height / 2) * 0.018 * this.depth;
                const pulse = 0.55 + Math.sin(this.phase) * 0.25;

                ctx.beginPath();
                ctx.fillStyle = hexToRgba(colors[0], 0.14 + pulse * 0.16);
                ctx.arc(this.x + parallaxX, this.y + parallaxY, this.radius + pulse * 0.7, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        class Shape {
            constructor() {
                this.reset(true);
            }

            reset(initial) {
                this.x = Math.random() * width;
                this.y = initial ? Math.random() * height : height + 80;
                this.size = Math.random() * 56 + 28;
                this.vy = -(Math.random() * 0.22 + 0.08);
                this.vx = (Math.random() - 0.5) * 0.18;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.012;
                this.type = Math.floor(Math.random() * 4);
                this.depth = Math.random() * 0.9 + 0.2;
                this.colorIndex = Math.floor(Math.random() * 4);
            }

            update() {
                this.x += this.vx + Math.sin(frame * 0.006 + this.depth) * 0.05;
                this.y += this.vy;
                this.rotation += this.rotationSpeed;

                if (this.y < -100 || this.x < -120 || this.x > width + 120) {
                    this.reset(false);
                }
            }

            draw(colors) {
                const parallaxX = (pointer.x - width / 2) * 0.026 * this.depth;
                const parallaxY = (pointer.y - height / 2) * 0.026 * this.depth;

                ctx.save();
                ctx.translate(this.x + parallaxX, this.y + parallaxY);
                ctx.rotate(this.rotation);
                ctx.lineWidth = 1.4;
                ctx.strokeStyle = hexToRgba(colors[this.colorIndex], 0.13);
                ctx.fillStyle = hexToRgba(colors[this.colorIndex], 0.024);

                if (this.type === 0) {
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                } else if (this.type === 1) {
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size / 2);
                    ctx.lineTo(this.size / 2, this.size / 2);
                    ctx.lineTo(-this.size / 2, this.size / 2);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                } else if (this.type === 2) {
                    const half = this.size / 2;
                    ctx.strokeRect(-half, -half, this.size, this.size);
                } else {
                    drawHexagon(this.size / 2);
                }

                ctx.restore();
            }
        }

        function drawHexagon(radius) {
            ctx.beginPath();
            for (let i = 0; i < 6; i += 1) {
                const angle = Math.PI / 3 * i;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        function drawConnections(colors) {
            const maxDistance = width < 768 ? 110 : 150;

            for (let i = 0; i < particles.length; i += 1) {
                for (let j = i + 1; j < particles.length; j += 1) {
                    const a = particles[i];
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance > maxDistance) continue;

                    const opacity = (1 - distance / maxDistance) * 0.085;
                    ctx.beginPath();
                    ctx.strokeStyle = hexToRgba(colors[0], opacity);
                    ctx.lineWidth = 1;
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        function drawGlow(colors) {
            const glowX = width * 0.5 + (pointer.x - width / 2) * 0.04;
            const glowY = height * 0.52 + (pointer.y - height / 2) * 0.04;
            const gradient = ctx.createRadialGradient(glowX, glowY, 20, glowX, glowY, Math.max(width, height) * 0.52);

            gradient.addColorStop(0, hexToRgba(colors[0], 0.052));
            gradient.addColorStop(0.45, hexToRgba(colors[2], 0.024));
            gradient.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }

        function hexToRgba(hex, alpha) {
            const value = hex.replace('#', '');
            const bigint = parseInt(value, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;

            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        function animate() {
            frame += 1;
            pointer.x += (pointer.targetX - pointer.x) * 0.055;
            pointer.y += (pointer.targetY - pointer.y) * 0.055;

            ctx.clearRect(0, 0, width, height);
            const colors = themeColors();

            drawGlow(colors);
            particles.forEach((particle) => particle.update());
            drawConnections(colors);
            particles.forEach((particle) => particle.draw(colors));
            shapes.forEach((shape) => {
                shape.update();
                shape.draw(colors);
            });

            requestAnimationFrame(animate);
        }

        document.addEventListener('mousemove', (event) => {
            pointer.targetX = event.clientX;
            pointer.targetY = event.clientY;
        }, { passive: true });

        window.addEventListener('resize', resize);

        resize();
        animate();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createHomepageScene);
    } else {
        createHomepageScene();
    }
})();
