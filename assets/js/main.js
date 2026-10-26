// --- Show/Hide Section Logic ---
window.showSection = function(sectionId) {
    document.querySelectorAll('.app-section').forEach(sec => sec.classList.remove('active'));
    const targetSection = document.getElementById(`section-${sectionId}`);
    if (targetSection) targetSection.classList.add('active');
};

// --- Load Section Dynamically ---
async function loadSection(sectionName, folder = 'auth') {
    const container = document.getElementById('app-container');
    
    if (document.getElementById(`section-${sectionName}`)) {
        showSection(sectionName);
        return;
    }

    try {
        const response = await fetch(`/sections/${folder}/${sectionName}.html`);
        const html = await response.text();
        
        const sectionWrapper = document.createElement('div');
        sectionWrapper.id = `section-${sectionName}`;
        sectionWrapper.className = 'app-section';
        sectionWrapper.innerHTML = html;
        container.appendChild(sectionWrapper);

        // Load section-specific CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = `/sections/${folder}/${sectionName}.css`;
        document.head.appendChild(cssLink);

        // Load section-specific JS
        const script = document.createElement('script');
        script.src = `/sections/${folder}/${sectionName}.js`;
        script.type = 'module';
        document.body.appendChild(script);

        showSection(sectionName);
    } catch (error) {
        console.error("Error loading section:", error);
    }
}
window.loadSection = loadSection;

// --- Startup Logic ---
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('global-splash').classList.add('hidden');
        loadSection('role-selection');
    }, 1500);
});

// --- Footer Logic (Single Click vs Long Press) ---
let pressTimer;
let isLongPress = false;

const footerText = document.getElementById('gi-footer-text');

const startPress = (e) => {
    e.preventDefault();
    isLongPress = false;
    pressTimer = setTimeout(() => {
        // Long Press (3 seconds) -> Open GI Admin Login
        isLongPress = true;
        alert("GI Super Admin Login (Phase 3)");
        // Future: loadSection('gi-login', 'auth');
        pressTimer = null;
    }, 3000);
};

const cancelPress = () => {
    if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
        if (!isLongPress) {
            // Single Click -> Open Popup
            document.getElementById('gi-popup').classList.add('active');
        }
    }
};

// Mouse Events (Desktop)
footerText.addEventListener('mousedown', startPress);
footerText.addEventListener('mouseup', cancelPress);
footerText.addEventListener('mouseleave', () => { 
    if(pressTimer) clearTimeout(pressTimer); 
});

// Touch Events (Mobile)
footerText.addEventListener('touchstart', startPress, {passive: false});
footerText.addEventListener('touchend', cancelPress);

// --- GI Popup Logic ---
window.openGiPopup = () => document.getElementById('gi-popup').classList.add('active');
window.closeGiPopup = () => document.getElementById('gi-popup').classList.remove('active');

// --- Dark Mode Toggle ---
window.toggleDarkMode = function() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('sv_dark_mode', isDark);
    
    const icon = document.getElementById('dark-mode-toggle-icon');
    if (icon) {
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
};

// Apply saved dark mode on load
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('sv_dark_mode') === 'true') {
        document.body.classList.add('dark-mode');
        const icon = document.getElementById('dark-mode-toggle-icon');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
});

// --- PWA Install Logic ---
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const banner = document.getElementById('install-banner');
    if (banner) banner.classList.add('show');
});

document.addEventListener('DOMContentLoaded', () => {
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to the install prompt: ${outcome}`);
                deferredPrompt = null;
                const banner = document.getElementById('install-banner');
                if (banner) banner.classList.remove('show');
            }
        });
    }
});

window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    const banner = document.getElementById('install-banner');
    if (banner) banner.classList.remove('show');
    deferredPrompt = null;
});
