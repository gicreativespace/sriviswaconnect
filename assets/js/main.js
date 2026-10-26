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

// --- Startup Logic ---
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('global-splash').classList.add('hidden');
        loadSection('role-selection');
    }, 1500);
});

// --- Footer Logic (Single Click vs Long Press) ---
let pressTimer;

const footerText = document.getElementById('gi-footer-text');

const startPress = (e) => {
    e.preventDefault();
    pressTimer = setTimeout(() => {
        // Long Press (3 seconds) -> Open GI Admin Login
        alert("GI Super Admin Login (Phase 3)");
        // Future: loadSection('gi-login', 'auth');
        pressTimer = null;
    }, 3000);
};

const cancelPress = () => {
    if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
        // Single Click -> Open Popup
        document.getElementById('gi-popup').classList.add('active');
    }
};

// Mouse Events (Desktop)
footerText.addEventListener('mousedown', startPress);
footerText.addEventListener('mouseup', cancelPress);
footerText.addEventListener('mouseleave', () => { if(pressTimer) clearTimeout(pressTimer); });

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
    }
});
