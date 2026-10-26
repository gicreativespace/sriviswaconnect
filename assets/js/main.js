// --- Show/Hide Section Logic ---
window.showSection = function(sectionId) {
    document.querySelectorAll('.app-section').forEach(sec => sec.classList.remove('active'));
    const targetSection = document.getElementById(`section-${sectionId}`);
    if (targetSection) targetSection.classList.add('active');
};

// --- Role Selection ---
window.selectPortal = function(role) {
    localStorage.setItem('sv_role', role);
    if (role === 'school') {
        showSection('school-login');
    } else {
        // Parent (తర్వాత link-child సెక్షన్ యాడ్ చేయండి)
        alert("Parent Portal logic coming soon!");
    }
};

// --- School Login (Firestore) ---
window.handleSchoolLogin = async function(event) {
    event.preventDefault();
    
    const phone = document.getElementById('login-phone').value;
    const pin = document.getElementById('login-pin').value;
    
    try {
        const { db } = await import('./firebase-config.js');
        const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
        
        const userDocRef = doc(db, "users", phone);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.pin === pin) {
                alert(`Welcome ${userData.name}!`);
                localStorage.setItem('sv_user', JSON.stringify(userData));
                
                if (userData.role === 'principal' || userData.role === 'admin') {
                    showSection('principal-dashboard');
                } else if (userData.role === 'incharge') {
                    // showSection('attendance'); // తర్వాత
                    alert("Incharge dashboard coming soon!");
                }
            } else {
                alert("Incorrect PIN!");
            }
        } else {
            alert("User not found!");
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("Something went wrong. Check console.");
    }
};

// --- Startup ---
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('global-splash').classList.add('hidden');
    }, 1500);
});

// --- Footer, Dark Mode, PWA (మీరు ఇంతకుముందు ఇచ్చిన కోడ్ అలాగే ఉంచండి) ---
// (Footer long press, GI popup, dark mode, install logic)
