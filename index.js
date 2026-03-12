/**
 * Mandhi House - Cinematic Storyteller Engine
 * Refined for shorter gaps and faster transitions
 */

document.addEventListener('DOMContentLoaded', () => {
    const potContainer = document.querySelector('.mandhi-pot-container');
    const titleSection = document.querySelector('.reveal-section');
    const cards = Array.from(document.querySelectorAll('.dish-card'));
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    // Smooth Scroll State - EXTRA SLOW for ultimate premium feel
    let currentY = 0;
    let targetY = 0;
    const lerpAmount = 0.02; // Reduced from 0.05 to 0.02 for maximum smoothness and weight

    function updateStatus() {
        const hour = new Date().getHours();
        const isOpen = hour >= 11 && hour < 23;
        if (statusDot) statusDot.className = `dot ${isOpen ? 'open' : 'closed'}`;
        if (statusText) statusText.textContent = isOpen ? "Open Now • A.G. Road" : "Opening at 11 AM";
    }

    function animate() {
        currentY += (targetY - currentY) * lerpAmount;

        // --- STAGE 1: HERO (0 - 1000px) ---
        // Landing name and pot zoom
        if (currentY < 1200) {
            const progress = currentY / 1000;
            
            // Zoom & Move Up
            const zoom = 1 + (progress * 6); // Faster zoom
            const moveUp = progress * 600;
            const heroBlur = progress * 30; // Stronger progressive blur
            
            potContainer.style.transform = `translate(-50%, calc(-50% - ${moveUp}px)) scale(${zoom})`;
            potContainer.style.filter = `blur(${heroBlur}px)`;
            potContainer.style.opacity = Math.max(0, 1 - (progress * 1.8));

            // Name Reveal/Fade
            titleSection.style.opacity = Math.max(0, 1 - (progress * 1.5));
            titleSection.style.transform = `translate(-50%, calc(-50% - ${moveUp * 0.4}px))`;
            titleSection.style.filter = `blur(${heroBlur * 0.6}px)`;
        } else {
            potContainer.style.opacity = 0;
            titleSection.style.opacity = 0;
        }

        // --- STAGE 2: GALLERY CARDS ---
        const cardInterval = 500; // Significantly closer for "layer" feel
        const startOffset = 600; // Start sooner after hero

        cards.forEach((card, index) => {
            const cardStart = startOffset + (index * cardInterval);
            const cardCenter = cardStart + 500;
            const cardEnd = cardStart + 1000;

            if (currentY > cardStart && currentY < cardEnd) {
                // Determine stage relative to center (-1 to 1)
                const relativePos = (currentY - cardCenter) / 500;
                
                // Faster disappear: Using power of 4 for a sharp exit
                const opacity = 1 - Math.pow(relativePos, 4);
                
                // Layering movement: Shorter vertical throw (60vh) for closer appearance
                const verticalOffset = relativePos * 60; 
                
                // No Blur as requested
                const scale = 1.1 - Math.abs(relativePos * 0.2);

                card.classList.add('visible');
                card.style.opacity = opacity;
                card.style.filter = 'none'; 
                card.style.transform = `translate(-50%, calc(-50% + ${verticalOffset}vh)) scale(${scale})`;
                card.style.zIndex = 100 + index;
            }
 else {
                card.classList.remove('visible');
                card.style.opacity = 0;
            }
        });

        // --- STAGE 3: GRAND FINALE ---
        const finale = document.getElementById('grand-finale');
        // Brought much closer due to shorter card intervals
        const finaleStart = 5000; 
        const finaleCenter = 7000; 
        const finaleEnd = 9000; 

        if (currentY > finaleStart && currentY < finaleEnd) {
            // Using a wider divisor for a slower transition in/out
            const relativePos = (currentY - finaleCenter) / 3000; // -1 to 1 range over 6000px
            
            const opacity = 1 - Math.pow(relativePos, 4);
            const scale = 1.05 - Math.abs(relativePos * 0.05);

            if (opacity > 0) {
                finale.style.display = 'block'; // Ensure it's not hidden
                finale.classList.add('visible');
                finale.style.opacity = opacity;
                finale.style.filter = 'none';
                finale.style.transform = `translate(-50%, -50%) scale(${scale})`;
                finale.style.pointerEvents = 'all';
            } else {
                finale.style.opacity = 0;
                finale.style.pointerEvents = 'none';
                finale.style.display = 'none';
            }
        } else {
            finale.style.opacity = 0;
            finale.style.pointerEvents = 'none';
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('scroll', () => {
        targetY = window.scrollY;
    }, { passive: true });

    updateStatus();
    animate();
});
