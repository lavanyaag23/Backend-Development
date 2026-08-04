// Update experience output
const experience = document.getElementById('experience');
const output = document.getElementById('experienceOutput');
experience.addEventListener('input', function() {
    output.textContent = this.value;
});

// Form validation demo
document.getElementById('contactForm').addEventListener('submit', function(e) {
    // This prevents actual submission for demo purposes
    e.preventDefault();
    alert('Form submitted successfully! (Demo)');
    return false;
});