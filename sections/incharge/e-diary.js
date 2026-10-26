import { db } from '../../assets/js/firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- Class-wise Subjects (మీరు ఇచ్చిన డేటా) ---
const classSubjects = {
    "Class I": ["Telugu", "Hindi", "English", "Maths", "EVS", "Computers"],
    "Class II": ["Hindi", "English", "Maths", "EVS", "Computers", "Telugu"],
    "Class III": ["English", "Maths", "GS", "Telugu", "Hindi", "Social", "Computers", "Vedic Maths"],
    "Class IV": ["Maths", "Social", "Telugu", "Hindi", "Computers", "GS", "English", "Vedic Maths"],
    "Class V": ["GS", "Telugu", "Computers", "English", "Maths", "Hindi", "Social", "Vedic Maths"],
    "Class VI": ["G.S", "Telugu", "Maths", "English", "Social", "Hindi"],
    "Class VII": ["English", "Hindi", "Social", "Telugu", "GS", "Maths"],
    "Class VIII": ["Maths", "Social", "English", "Biology", "Hindi", "Telugu", "Physics"],
    "Class IX": ["Hindi", "Telugu", "Maths", "English", "Physics", "Biology", "Social"]
};

// --- Load Subjects on Page Open ---
window.addEventListener('DOMContentLoaded', () => {
    const target = document.getElementById('section-e-diary');
    if (target && target.classList.contains('active')) {
        loadSubjects();
        setTodayDate();
    }
});

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.id === 'section-e-diary' && mutation.target.classList.contains('active')) {
            loadSubjects();
            setTodayDate();
        }
    });
});
window.addEventListener('DOMContentLoaded', () => {
    const target = document.getElementById('section-e-diary');
    if (target) observer.observe(target, { attributes: true, attributeFilter: ['class'] });
});

// --- Render Subjects ---
window.loadSubjects = function() {
    const classSelect = document.getElementById('diary-class-select');
    const container = document.getElementById('subjects-container');
    if (!classSelect || !container) return;

    const selectedClass = classSelect.value;
    const subjects = classSubjects[selectedClass] || [];

    let html = '';
    subjects.forEach(subject => {
        html += `
            <div class="subject-card">
                <div class="subject-header">
                    <span class="subject-name">📘 ${subject}</span>
                </div>
                <textarea class="subject-textarea" placeholder="Enter ${subject} notes here..." data-subject="${subject}"></textarea>
            </div>
        `;
    });
    container.innerHTML = html;
};

// --- Set Today's Date ---
function setTodayDate() {
    const dateEl = document.getElementById('diary-date');
    if (dateEl) {
        const today = new Date();
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        dateEl.textContent = today.toLocaleDateString('en-IN', options);
    }
}

// --- Add Manual Subject ---
window.addManualSubject = function() {
    const subjectName = prompt("Enter subject name:");
    if (subjectName && subjectName.trim() !== '') {
        const container = document.getElementById('subjects-container');
        const newCard = document.createElement('div');
        newCard.className = 'subject-card';
        newCard.innerHTML = `
            <div class="subject-header">
                <span class="subject-name">📘 ${subjectName}</span>
            </div>
            <textarea class="subject-textarea" placeholder="Enter ${subjectName} notes here..." data-subject="${subjectName}"></textarea>
        `;
        container.appendChild(newCard);
    }
};

// --- Submit E-Diary to Firestore ---
window.submitEDiary = async function() {
    const classSelect = document.getElementById('diary-class-select');
    const selectedClass = classSelect.value;

    const textareas = document.querySelectorAll('.subject-textarea');
    let hasData = false;
    let subjectNotes = {};

    textareas.forEach(textarea => {
        const subject = textarea.getAttribute('data-subject');
        const notes = textarea.value.trim();
        if (notes !== '') {
            hasData = true;
            subjectNotes[subject] = notes;
        }
    });

    if (!hasData) {
        alert("Please enter at least one subject notes before sending.");
        return;
    }

    try {
        // Firestore లో ఒక డాక్యుమెంట్ గా సేవ్ చేయడం
        for (const [subject, notes] of Object.entries(subjectNotes)) {
            await addDoc(collection(db, "ediary"), {
                className: selectedClass,
                subject: subject,
                notes: notes,
                status: "pending",
                createdAt: new Date().toISOString(),
                createdBy: "Incharge"
            });
        }
        alert("E-Diary sent for Principal Approval!");
        // Clear textareas
        textareas.forEach(t => t.value = '');
    } catch (error) {
        console.error("Error saving to Firestore:", error);
        alert("Failed to send. Check console.");
    }
};
