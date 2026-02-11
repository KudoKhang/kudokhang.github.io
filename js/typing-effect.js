/**
 * Typing Effect for Homepage Slogan
 * Creates a typewriter animation for the description text
 */

(function () {
    'use strict';

    function initTypingEffect() {
        // Only run on homepage
        const descriptionElement = document.querySelector('.profile-container .description');
        if (!descriptionElement) return;

        // Get the original text
        const originalHTML = descriptionElement.innerHTML;

        // Extract text content (strip HTML for typing, we'll add it back)
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalHTML;
        const fullText = tempDiv.textContent || tempDiv.innerText;

        // Clear the element
        descriptionElement.innerHTML = '';
        descriptionElement.style.minHeight = '3em'; // Prevent layout shift

        // Add typing cursor
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = '|';
        descriptionElement.appendChild(cursor);

        // Typing configuration
        let charIndex = 0;
        const typingSpeed = 80; // Slower (previous was 50)
        const startDelay = 1000; // Delay before starting

        // Split text into lines for <br> handling
        const lines = originalHTML.split(/<br\s*\/?>/i);
        let currentLine = 0;
        let typedLinesContent = []; // To store content of completed lines

        function type() {
            if (currentLine < lines.length) {
                const lineText = lines[currentLine].replace(/<[^>]*>/g, ''); // Content for current line

                if (charIndex < lineText.length) {
                    charIndex++;
                    let currentLineTyped = lineText.substring(0, charIndex);

                    // Formatting for current typing line
                    currentLineTyped = currentLineTyped.replace(/master/gi, '<strong>master</strong>');
                    currentLineTyped = currentLineTyped.replace(/pro/gi, '<strong>pro</strong>');
                    currentLineTyped = currentLineTyped.replace(/beginner/gi, '<em>beginner</em>');
                    currentLineTyped = currentLineTyped.replace(/amateur/gi, '<em>amateur</em>');

                    // Combine with previous lines
                    let fullHTML = typedLinesContent.join('<br>') + (typedLinesContent.length > 0 ? '<br>' : '') + currentLineTyped;

                    descriptionElement.innerHTML = fullHTML + '<span class="typing-cursor">|</span>';

                    setTimeout(type, typingSpeed);
                } else {
                    // Line complete
                    typedLinesContent.push(lines[currentLine]);

                    currentLine++;
                    charIndex = 0;

                    if (currentLine < lines.length) {
                        setTimeout(type, typingSpeed * 6);
                    } else {
                        // Complete - Clear everything and restore original HTML exactly
                        setTimeout(() => {
                            descriptionElement.innerHTML = originalHTML;
                        }, 1500);
                    }
                }
            }
        }

        // Start typing after delay
        setTimeout(type, startDelay);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTypingEffect);
    } else {
        initTypingEffect();
    }
})();
