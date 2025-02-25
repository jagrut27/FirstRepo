$(document).ready(function () {
    let currentIndex = 0; 
    const totalImages = $(".banner-slide").length; 


    function slideToNext() {
        currentIndex = (currentIndex + 1) % totalImages;
        const offset = -currentIndex * 100; 
        $(".banner-container").css("transform", "translateX(" + offset + "%)"); 
    }

  
    setInterval(slideToNext, 3000); 
});
