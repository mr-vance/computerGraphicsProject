// JavaScript to handle the pop-up card
document.addEventListener('DOMContentLoaded', function () {
    const howToPlayBtn = document.getElementById('howToPlayBtn');
    const popupCard = document.getElementById('popupCard');
    const closeBtn = document.getElementById('closeBtn');

    // Open the pop-up when "How to Play" button is clicked
    howToPlayBtn.addEventListener('click', function () {
        popupCard.style.display = 'block';
    });

    // Close the pop-up when "Close" button is clicked
    closeBtn.addEventListener('click', function () {
        popupCard.style.display = 'none';
    });
});

// Check if the screen width is less than 868 pixels (adjust this value as needed)
const isMobile = window.innerWidth < 868;

// Get references to the mobile message and overlay elements
const mobileMessage = document.getElementById('mobile-message');
const overlay = document.getElementById('overlay');

// Show the message and overlay if it's a mobile device
if (isMobile) {
    mobileMessage.style.display = 'block';
    overlay.style.display = 'block';
    overlay.classList.add('active'); // Enable interactions with overlay
} else {
    // Initialize your Three.js game if it's not a mobile device
    // Your game initialization code goes here
    overlay.classList.remove('active'); // Disable interactions with overlay
}



