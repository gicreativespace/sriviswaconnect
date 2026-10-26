// --- Poster Generator Logic ---
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('posterCanvas');
    if (canvas) {
        drawPoster();
    }
});

function drawPoster() {
    const canvas = document.getElementById('posterCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // 1. Background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    // 2. Top Border
    ctx.fillStyle = "#0F4C81";
    ctx.fillRect(0, 0, width, 15);

    // 3. Logo (Placeholder - Image Load)
    const logoImg = new Image();
    logoImg.src = '/assets/images/logo.png';
    logoImg.onload = () => {
        ctx.drawImage(logoImg, width / 2 - 40, 30, 80, 80);
    };

    // 4. School Name
    ctx.fillStyle = "#0F4C81";
    ctx.font = "bold 28px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SRI VISWA GROUP OF INSTITUTIONS", width / 2, 150);

    // 5. Divider Line
    ctx.strokeStyle = "#3F8F29";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, 170);
    ctx.lineTo(width - 100, 170);
    ctx.stroke();

    // 6. Title
    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 24px Poppins, sans-serif";
    ctx.fillText("📚 E-DIARY UPDATE", width / 2, 220);

    // 7. Class and Date (Mock Data)
    ctx.font = "18px Poppins, sans-serif";
    ctx.fillStyle = "#64748B";
    ctx.fillText("Class: IX  |  Date: 26 Oct 2023", width / 2, 260);

    // 8. Subjects (Mock Data)
    const subjects = [
        { name: "MATHS", notes: "Complete chapter 5 exercises." },
        { name: "SCIENCE", notes: "Bring practical records tomorrow." },
        { name: "ENGLISH", notes: "Read page 45 and write summary." }
    ];

    let yPos = 320;
    ctx.textAlign = "left";
    subjects.forEach((sub, index) => {
        // Subject Name
        ctx.fillStyle = "#0F4C81";
        ctx.font = "bold 20px Poppins, sans-serif";
        ctx.fillText(`🔹 ${sub.name}`, 80, yPos);

        // Notes
        ctx.fillStyle = "#1E293B";
        ctx.font = "16px Poppins, sans-serif";
        ctx.fillText(sub.notes, 100, yPos + 30);

        yPos += 100;
    });

    // 9. Approved Stamp
    ctx.save();
    ctx.translate(width / 2, yPos + 50);
    ctx.rotate(-10 * Math.PI / 180);

    ctx.strokeStyle = "#3F8F29";
    ctx.lineWidth = 4;
    ctx.strokeRect(-100, -30, 200, 60);

    ctx.fillStyle = "#3F8F29";
    ctx.font = "bold 24px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✅ APPROVED", 0, 10);

    ctx.restore();

    // 10. Footer
    ctx.fillStyle = "#64748B";
    ctx.font = "14px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Generated via Sri Viswa Connect App", width / 2, height - 40);
}

// --- Download Poster ---
window.downloadPoster = function() {
    const canvas = document.getElementById('posterCanvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `SriViswa_Poster_${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
};

// --- Share to WhatsApp ---
window.shareToWhatsApp = function() {
    const text = encodeURIComponent("*SRI VISWA GROUP OF INSTITUTIONS*\n*E-Diary Update* 📚\n\nClass: IX\nDate: 26 Oct 2023\n\n🔹 *Maths:* Complete chapter 5 exercises.\n🔹 *Science:* Bring practical records tomorrow.\n\n_This is an automated message._");
    window.open(`https://wa.me/?text=${text}`, '_blank');
};
