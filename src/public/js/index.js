/*const galleryCarousel = document.querySelector('#carouselContainer')*/
const testimonialCarousel = document.querySelector('#testimonialsCarousel')

const homeGallery = document.querySelectorAll(".carousel-button")
let homeGalleryActive = document.querySelector('#carouselContainer').querySelector(".carousel-item.active") 

const gCarousel = new bootstrap.Carousel(document.querySelector('#carouselContainer'), {
  /*interval: 2000,*/
  touch: false,
  ride: false
})


homeGallery.forEach(button => {
    button.addEventListener('click', function(){
        let item = document.getElementsByClassName("carousel-item")
        homeGalleryActive.classList.replace("active", "invisible")
        item[button.getAttribute('data-bs-slide-to')].classList.replace("invisible", "active")
        homeGalleryActive = document.querySelector(".carousel-item.active")
    })
})

/*
const tCarousel = new bootstrap.Carousel(testimonialCarousel, {
  interval: 3000,
  touch:    true,
  pause:    "hover",
  ride:     true,
  wrap:     true
})*/
/*
const galleryHref = document.querySelectorAll(".carousel-button")
var carouselMobileJumpTo = window.matchMedia("(max-width: 992px)")
carouselMobileJumpTo.addEventListener("change", function(){updateMobileCarousel(carouselMobileJumpTo)})

function updateMobileCarousel(width){
  if(width.matches){
    galleryHref.forEach(button => {
      button.href = "#carousel-items"
    })
  } else {
    galleryHref.forEach(button => {
      button.href = ""
    })
  }
}
*/