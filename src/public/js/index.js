const galleryCarousel = document.querySelector('#carouselContainer')
const testimonialCarousel = document.querySelector('#testimonialsCarousel')

const homeGallery = document.querySelectorAll(".carousel-button")
let homeGalleryActive = galleryCarousel.querySelector(".carousel-item.active") 

const gCarousel = new bootstrap.Carousel(galleryCarousel, {
  interval: 2000,
  touch: false
})



homeGallery.forEach(button => {
    button.addEventListener('click', function(){
        let item = document.getElementsByClassName("carousel-item")
        homeGalleryActive.classList.replace("active", "invisible")
        item[button.getAttribute('data-bs-slide-to')].classList.replace("invisible", "active")
        homeGalleryActive = document.querySelector(".carousel-item.active")
    })
})



const tCarousel = new bootstrap.Carousel(testimonialCarousel, {
  interval: 3000,
  touch:    true,
  pause:    "hover",
  ride:     true,
  wrap:     true
})
