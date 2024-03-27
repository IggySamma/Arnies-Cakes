const galleryCarousel = document.querySelector('#carouselContainer')

const gCarousel = new bootstrap.Carousel(galleryCarousel, {
  /*interval: 2000,*/
  touch: false
})

var homeGallery = document.querySelectorAll(".carousel-button")
var homeGalleryActive = document.querySelector(".carousel-item.active") 

homeGallery.forEach(button => {
    button.addEventListener('click', function(){
        let item = document.getElementsByClassName("carousel-item")
        homeGalleryActive.classList.replace("active", "invisible")
        item[button.getAttribute('data-bs-slide-to')].classList.replace("invisible", "active")
        homeGalleryActive = document.querySelector(".carousel-item.active")
    })
})
/*
const galCarousel = document.querySelector('#carouselContainer')

const g1Carousel = new bootstrap.Carousel(galCarousel, {
  interval: 2000,
  touch:    true,
  pause:    "hover",
  ride:     true,
  wrap:     true
})
*/