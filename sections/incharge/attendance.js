// --- Mock Data (Later replaced by Firestore) ---
const mockStudents = [
    { roll: 1, name: "Ravi Kumar" },
    { roll: 2, name: "Sita Sharma" },
    { roll: 3, name: "Arjun Reddy" },
    { roll: 4, name: "Priya Singh" },
    { roll: 5, name: "Kiran Rao" }
];

// --- Load Students on Page Open ---
window.addEventListener('DOMContentLoaded', () => {
    const target = document.getElementById('section-attendance');
    if (target && target.classList.contains('active')) {
        loadStudents();
        setTodayDate();
    }
});

// Also load when section becomes active
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.id === 'section-attendance' && mutation.target.classList.contains('active')) {
            loadStudents();
            setTodayDate();
        }
    });
});
window.addEventListener('DOMContentLoaded', () => {
    const target = document.getElementById('section-attendance');
    if (target) observer.observe(target, { attributes: true, attributeFilter: ['class'] });
});

// --- Render Students ---
function loadStudents() {
    const container = document.getElementById('student-attendance-list');
    if (!container) return;

    let html = '';
    mockStudents.forEach(student => {
        html += `
            <div class="attendance-card">
                <div class="student-info">
                    <span class="roll-badge">${String(student.roll).padStart(2, '0')}</span>
                    <span class="student-name">${student.name}</span>
                </div>
                <div class="attendance-actions">
                    <button class="att-btn active-p" onclick="markAttendance(this, 'P')">P</button>
                    <button class="att-btn" onclick="markAttendance(this, 'A')">A</button>
                    <button class="att-btn" onclick="markAttendance(this, 'L')">L</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// --- Set Today's Date ---
function setTodayDate() {
    const dateEl = document.getElementById('today-date');
    if (dateEl) {
        const today = new Date();
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        dateEl.textContent = today.toLocaleDateString('en-IN', options);
    }
}

// --- Mark Attendance (P / A / L) ---
window.markAttendance = function(btn, status) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.att-btn').forEach(b => {
        b.classList.remove('active-p', 'active-a', 'active-l');
    });
    if (status === 'P') btn.classList.add('active-p');
    if (status === 'A') btn.classList.add('active-a');
    if (status === 'L') btn.classList.add('active-l');
};

// --- Submit Attendance ---
window.submitAttendance = function() {
    alert("Attendance Submitted Successfully! (Firestore integration in Phase 2)");
};
