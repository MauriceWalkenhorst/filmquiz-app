/**
 * Film Quiz - Main Application
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Check if API is available
    try {
        await API.healthCheck();
        console.log('✅ API connected');
    } catch (error) {
        console.error('❌ API not available:', error);
        // Show offline message
        document.querySelector('.loading-animation p').textContent = 'Verbindungsfehler. Bitte später erneut versuchen.';
        return;
    }

    // Initialize UI
    UI.init();

    // Hide loading screen and show start screen
    setTimeout(() => {
        UI.showScreen('start');
    }, 1000);
});

// Handle visibility change (pause/resume game)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden - pause game
        if (game && game.timer && UI.currentScreen === 'game') {
            game.pauseTimer();
        }
    } else {
        // Page is visible - resume game
        if (game && game.timer && UI.currentScreen === 'game') {
            game.resumeTimer();
        }
    }
});

// Prevent zoom on double-tap (mobile)
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Prevent pull-to-refresh on mobile
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const scrollTop = document.documentElement.scrollTop;
    
    // Prevent pull-to-refresh when at top of page
    if (scrollTop === 0 && touchY > touchStartY) {
        e.preventDefault();
    }
}, { passive: false });
