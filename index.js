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

    // Smooth Scroll State
    let currentY = 0;
    let targetY = 0;
    const lerpAmount = 0.08;

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
        // Reduced gap: cards trigger faster
        const cardInterval = 1000; // Was 1500, now 1000 for shorter gaps
        const startOffset = 1000;  // Was 1500, now 1000 to start sooner

        cards.forEach((card, index) => {
            const cardStart = startOffset + (index * cardInterval);
            const cardCenter = cardStart + 500;
            const cardEnd = cardStart + 1000;

            if (currentY > cardStart && currentY < cardEnd) {
                // Determine stage relative to center (-1 to 1)
                const relativePos = (currentY - cardCenter) / 500;
                
                // Opacity: Peak at center
                const opacity = 1 - Math.pow(relativePos, 2);
                
                // Position: Top-Down Vertical Flow
                // Cards drop from top (-100vh), reach center (0vh), and exit bottom (100vh)
                const verticalOffset = relativePos * 120; // Movement range in vh
                
                // Zoom & Blur
                const scale = 1.1 - Math.abs(relativePos * 0.4);
                const blur = Math.abs(relativePos * 25);

                card.classList.add('visible');
                card.style.opacity = opacity;
                card.style.filter = `blur(${blur}px)`;
                card.style.transform = `translate(-50%, calc(-50% + ${verticalOffset}vh)) scale(${scale})`;
            } else {
                card.classList.remove('visible');
                card.style.opacity = 0;
            }
        });

        // --- STAGE 3: GRAND FINALE (7500px+) ---
        const finale = document.getElementById('grand-finale');
        const finaleStart = 7500;
        const finaleCenter = 8500;
        const finaleEnd = 9500;

        if (currentY > finaleStart) {
            const relativePos = (currentY - finaleCenter) / 1000; // -1 to 1
            const opacity = 1 - Math.abs(relativePos);
            const scale = 1.2 - Math.abs(relativePos * 0.2);
            const blur = Math.max(0, Math.abs(relativePos * 30));

            if (opacity > 0) {
                finale.classList.add('visible');
                finale.style.opacity = opacity;
                finale.style.filter = `blur(${blur}px)`;
                finale.style.transform = `translate(-50%, -50%) scale(${scale})`;
                finale.style.pointerEvents = 'all';
            } else {
                finale.style.opacity = 0;
                finale.style.pointerEvents = 'none';
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
