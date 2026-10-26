import { db } from '../../assets/js/firebase-config.js';
import { collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Load approvals on page load
window.addEventListener('DOMContentLoaded', () => {
    // Only load if this section is active
    if (document.getElementById('section-principal-dashboard')) {
        loadApprovals();
    }
});

// Also reload when the section becomes active (after navigation)
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.id === 'section-principal-dashboard' && mutation.target.classList.contains('active')) {
            loadApprovals();
        }
    });
});
// Observe after DOM ready
window.addEventListener('DOMContentLoaded', () => {
    const target = document.getElementById('section-principal-dashboard');
    if (target) {
        observer.observe(target, { attributes: true, attributeFilter: ['class'] });
    }
});

// --- Load Pending Approvals from Firestore ---
async function loadApprovals() {
    const container = document.getElementById('approvals-list');
    const countEl = document.getElementById('pending-count');
    if (!container) return;

    try {
        const querySnapshot = await getDocs(collection(db, "ediary"));
        let html = '';
        let count = 0;

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.status === 'pending') {
                count++;
                html += `
                    <div class="approval-card" id="approval-${docSnap.id}">
                        <div class="approval-header">
                            <span class="badge class-badge">${data.className}</span>
                            <span class="time">${data.subject}</span>
                        </div>
                        <p class="approval-text"><strong>${data.subject}:</strong> ${data.notes}</p>
                        <div class="approval-actions">
                            <button class="btn-approve" onclick="approveDiary('${docSnap.id}')">
                                <i class="fa-solid fa-check"></i> Approve
                            </button>
                            <button class="btn-reject" onclick="rejectDiary('${docSnap.id}')">
                                <i class="fa-solid fa-xmark"></i> Reject
                            </button>
                        </div>
                    </div>
                `;
            }
        });

        if (count === 0) {
            html = `<p class="loading-text">No pending approvals.</p>`;
        }
        
        container.innerHTML = html;
        if (countEl) countEl.textContent = count;

    } catch (error) {
        console.error("Error loading approvals:", error);
        container.innerHTML = `<p class="loading-text" style="color:red;">Error loading data. Check console.</p>`;
    }
}

// --- Approve Diary ---
window.approveDiary = async function(diaryId) {
    try {
        const diaryRef = doc(db, "ediary", diaryId);
        await updateDoc(diaryRef, {
            status: "approved",
            approvedBy: "Principal",
            approvedAt: new Date().toISOString()
        });
        alert("Diary Approved Successfully!");
        loadApprovals(); // Refresh
    } catch (error) {
        console.error("Approval Error:", error);
        alert("Failed to approve. Check console.");
    }
};

// --- Reject Diary ---
window.rejectDiary = async function(diaryId) {
    try {
        const diaryRef = doc(db, "ediary", diaryId);
        await updateDoc(diaryRef, {
            status: "rejected",
            approvedBy: "Principal",
            approvedAt: new Date().toISOString()
        });
        alert("Diary Rejected.");
        loadApprovals();
    } catch (error) {
        console.error("Rejection Error:", error);
        alert("Failed to reject. Check console.");
    }
};
