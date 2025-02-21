$(document).ready(function () {
    let currentIndex = 0; // Track the current image
    const totalImages = $(".banner-slide").length; // Total number of images

    // Function to slide to the next image
    function slideToNext() {
        currentIndex = (currentIndex + 1) % totalImages; // Loop back to the first image after the last
        const offset = -currentIndex * 100; // Calculate the offset for the next image
        $(".banner-container").css("transform", "translateX(" + offset + "%)"); // Apply the offset
    }

    // Slide every 1 second
    setInterval(slideToNext, 3000); // 1000 milliseconds = 1 second
});
