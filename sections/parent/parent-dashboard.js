import { db } from '../../assets/js/firebase-config.js';
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- Load Data on Page Open ---
window.addEventListener('DOMContentLoaded', () => {
    const target = document.getElementById('section-parent-dashboard');
    if (target && target.classList.contains('active')) {
        loadParentDashboard();
    }
});

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.id === 'section-parent-dashboard' && mutation.target.classList.contains('active')) {
            loadParentDashboard();
        }
    });
});
window.addEventListener('DOMContentLoaded', () => {
    const target = document.getElementById('section-parent-dashboard');
    if (target) observer.observe(target, { attributes: true, attributeFilter: ['class'] });
});

// --- Load Parent Dashboard Data ---
async function loadParentDashboard() {
    const activeChildEl = document.getElementById('active-child-name');
    const attendanceEl = document.getElementById('parent-attendance-status');
    const diaryList = document.getElementById('parent-diary-list');
    const noticeList = document.getElementById('parent-notice-list');

    if (!activeChildEl) return;

    try {
        // 1. LocalStorage నుండి లింక్ చేసిన పిల్లల వివరాలు తీసుకోవడం
        const linkedChild = JSON.parse(localStorage.getItem('sv_linked_child') || 'null');
        
        if (!linkedChild) {
            activeChildEl.textContent = "No child linked";
            diaryList.innerHTML = `<p class="loading-text">Please link a child first.</p>`;
            noticeList.innerHTML = `<p class="loading-text">Please link a child first.</p>`;
            return;
        }

        // 2. పిల్లల పేరు మరియు క్లాస్ చూపించడం
        activeChildEl.textContent = `${linkedChild.name} (${linkedChild.className})`;

        // 3. Attendance తెచ్చుకోవడం
        // (ప్రస్తుతానికి డమ్మీ డేటా. తర్వాత Firestore నుండి తెస్తాము)
        attendanceEl.textContent = "Present";
        attendanceEl.style.color = "#3F8F29";

        // 4. E-Diary తెచ్చుకోవడం (Approved మాత్రమే)
        const diarySnapshot = await getDocs(collection(db, "ediary"));
        let diaryHtml = '';
        let diaryCount = 0;

        diarySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.status === 'approved' && data.className === linkedChild.className) {
                diaryCount++;
                diaryHtml += `
                    <div class="diary-card">
                        <div class="diary-header">
                            <span class="badge class-badge">${data.subject}</span>
                            <span class="time">Approved</span>
                        </div>
                        <p>${data.notes}</p>
                    </div>
                `;
            }
        });

        if (diaryCount === 0) {
            diaryHtml = `<p class="loading-text">No approved diary entries.</p>`;
        }
        diaryList.innerHTML = diaryHtml;

        // 5. Notice Board తెచ్చుకోవడం (Approved మాత్రమే)
        // (ప్రస్తుతానికి డమ్మీ డేటా)
        noticeList.innerHTML = `
            <div class="notice-card">
                <p><strong>School Reopening:</strong> School will reopen on Monday after Dussehra holidays.</p>
            </div>
        `;

    } catch (error) {
        console.error("Error loading parent dashboard:", error);
        diaryList.innerHTML = `<p class="loading-text" style="color:red;">Error loading data.</p>`;
    }
}
