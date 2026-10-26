// Make function global so onclick in HTML can access it
window.selectPortal = function(role) {
    // 1. Save the selected role to LocalStorage
    localStorage.setItem('sv_role', role);
    
    // 2. Navigate to the respective login screen
    if (role === 'school') {
        // School Login (to be created in next step)
        alert("School Portal Selected! Next: Login Screen (Phase 2)");
        // Future: loadSection('school-login', 'auth');
    } else {
        // Parent Link Child (to be created in next step)
        alert("Parent Portal Selected! Next: Link Child Screen (Phase 2)");
        // Future: loadSection('link-child', 'parent');
    }
};
