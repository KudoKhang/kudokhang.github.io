/**
 * Homepage 3D Floating Shapes Animation
 * Minimalist geometric shapes with parallax effect
 */

(function () {
    'use strict';

    // Create canvas for shapes
    function createFloatingShapes() {
        // Check if we're on homepage
        const container = document.querySelector('.profile-container');
        if (!container) return;

        const canvas = document.createElement('canvas');
        canvas.className = 'floating-shapes-canvas';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        container.insertBefore(canvas, container.firstChild);

        const ctx = canvas.getContext('2d');
        const shapes = [];
        const shapeCount = 12; // Increased to 12 as requested

        // Mouse position for parallax
        let mouseX = 0;
        let mouseY = 0;

        // Shape class
        class Shape {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
                this.opacity = Math.random() * 0.3 + 0.1;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -50;
                this.size = Math.random() * 60 + 30;
                this.speedY = Math.random() * 0.5 + 0.2;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.01;
                this.type = Math.floor(Math.random() * 3); // 0: circle, 1: triangle, 2: square
                this.parallaxFactor = Math.random() * 0.05 + 0.02;
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.rotation += this.rotationSpeed;

                // Parallax effect
                const parallaxX = (mouseX - canvas.width / 2) * this.parallaxFactor;
                const parallaxY = (mouseY - canvas.height / 2) * this.parallaxFactor;

                this.drawX = this.x + parallaxX;
                this.drawY = this.y + parallaxY;

                // Reset if out of bounds
                if (this.y > canvas.height + 50) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.drawX, this.drawY);
                ctx.rotate(this.rotation);
                ctx.globalAlpha = this.opacity;

                // Get theme color
                const isDark = document.body.classList.contains('dark-theme');
                ctx.strokeStyle = isDark ? 'rgba(78, 205, 196, 0.3)' : 'rgba(255, 107, 107, 0.3)';
                ctx.lineWidth = 2;

                switch (this.type) {
                    case 0: // Circle
                        ctx.beginPath();
                        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                        ctx.stroke();
                        break;
                    case 1: // Triangle
                        ctx.beginPath();
                        ctx.moveTo(0, -this.size / 2);
                        ctx.lineTo(this.size / 2, this.size / 2);
                        ctx.lineTo(-this.size / 2, this.size / 2);
                        ctx.closePath();
                        ctx.stroke();
                        break;
                    case 2: // Square
                        ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
                        break;
                }

                ctx.restore();
            }
        }

        // Initialize shapes
        for (let i = 0; i < shapeCount; i++) {
            shapes.push(new Shape());
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            shapes.forEach(shape => {
                shape.update();
                shape.draw();
            });

            requestAnimationFrame(animate);
        }

        // Mouse move handler
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        // Start animation
        animate();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingShapes);
    } else {
        createFloatingShapes();
    }
})();
