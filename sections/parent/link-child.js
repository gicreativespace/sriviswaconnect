import { db } from '../../assets/js/firebase-config.js';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.handleLinkChild = async function(event) {
    event.preventDefault();

    const relation = document.getElementById('child-relation').value;
    const parentName = document.getElementById('parent-name').value.trim();
    const childClass = document.getElementById('child-class').value;
    const rollNumber = document.getElementById('child-roll').value;
    const dob = document.getElementById('child-dob').value;

    if (!parentName || !rollNumber || !dob) {
        alert("Please fill all fields.");
        return;
    }

    // Parent కి ఒక యూనిక్ ID క్రియేట్ చేయడం (ఫోన్ నంబర్ లేకుంటే టైమ్ స్టాంప్)
    // ప్రస్తుతానికి మనం డమ్మీ ID వాడుతున్నాము. తర్వాత ఫోన్ నంబర్ తో లింక్ చేస్తాము.
    const parentId = parentName.replace(/\s+/g, '_').toLowerCase() + "_" + rollNumber;

    try {
        // 1. ఆ క్లాస్ లో ఆ రోల్ నంబర్ ఉన్న విద్యార్థి ఉన్నారా చెక్ చేయడం
        // (ప్రస్తుతానికి మనం డమ్మీ డేటా వాడుతున్నాము. తర్వాత classes collection నుండి తెస్తాము)
        
        // 2. Parent డాక్యుమెంట్ ని Firestore లో సేవ్ చేయడం
        const parentRef = doc(db, "parents", parentId);
        await setDoc(parentRef, {
            relation: relation,
            parentName: parentName,
            linkedStudents: [{
                name: "Student_" + rollNumber, // తర్వాత అసలైన పేరు వస్తుంది
                className: childClass,
                rollNo: parseInt(rollNumber),
                dob: dob
            }],
            createdAt: new Date().toISOString()
        });

        alert("Child Linked Successfully!");
        // Parent Dashboard కి వెళ్ళడం
        window.loadSection('parent-dashboard', 'parent');

    } catch (error) {
        console.error("Link Child Error:", error);
        alert("Something went wrong. Check console.");
    }
};
