import { db } from '../../assets/js/firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- Real Login Logic (Firestore) ---
window.handleSchoolLogin = async function(event) {
    event.preventDefault();
    
    const phone = document.getElementById('login-phone').value;
    const pin = document.getElementById('login-pin').value;
    
    try {
        const userDocRef = doc(db, "users", phone);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            if (userData.pin === pin) {
                alert(`Welcome ${userData.name}!`);
                localStorage.setItem('sv_user', JSON.stringify(userData));
                
                if (userData.role === 'principal') {
                    window.loadSection('principal-dashboard', 'admin');
                } else if (userData.role === 'incharge') {
                    window.loadSection('attendance', 'incharge');
                } else if (userData.role === 'admin') {
                    window.loadSection('principal-dashboard', 'admin');
                } else {
                    alert("Role not recognized.");
                }
            } else {
                alert("Incorrect PIN! Please try again.");
            }
        } else {
            alert("User not found! Please check your phone number.");
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("Something went wrong. Check console for details.");
    }
};
