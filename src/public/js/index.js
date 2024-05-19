const testimonialCaoursel = document.getElementById('testimonialsCarousel')

const gCarousel = new bootstrap.Carousel(document.querySelector('#carouselContainer'), {
  touch: true,
  ride: false,
  keyboard: false,
})
/*
const tCarousel = new bootstrap.Carousel(document.querySelector('#testimonialsCarousel'), {
  interval: 3000,
  touch:    true,
  pause:    "hover",
  ride:     false,//true
  wrap:     true,
  keyboard: false,
})*/

const tCarousel = new bootstrap.Carousel(testimonialCaoursel, {
  interval: 3000,
  touch:    true,
  pause:    "hover",
  ride:     true,//true
  wrap:     true,
  keyboard: true,
})

//const tCarouselInstance = bootstrap.Carousel.getInstance(testimonialCaoursel)

//tCarouselInstance.next()



testimonialCaoursel.addEventListener('slide.bs.carousel', event => {
  let all = document.querySelectorAll('div.testimonialContainer')
  let animeSpeed = '0.5s'
  all.forEach((container) => {
    container.addEventListener("animationend", () => {
      container.style.removeProperty("animation");
      container.className = updateOrder(container, event.direction)
    }, { once: true })
  })

  all.forEach((container) => {
    //Animation to shrink or grow based on position from centre
    switch(+container.className[container.className.search('order')+6]){
      case 1:
        if(event.direction == 'left'){
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,leftEdge " + animeSpeed + ";"
        } else {
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,grow2 " + animeSpeed + ";"
        }
        break;
      case 2:
        if(event.direction == 'left'){
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,shrink2 " + animeSpeed + ";"
        } else {
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,grow1 " + animeSpeed + ";"
        }
        break;
      case 3:
        container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,shrink1 " + animeSpeed + ";"
        break;
      case 4:
        if(event.direction == 'left'){
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,grow1 " + animeSpeed + ";"
        } else {
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,shrink2 " + animeSpeed + ";"
        }
        break;
      case 5:
        if(event.direction == 'left'){
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,grow2 " + animeSpeed + ";"
        } else {
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,rightEdge  " + animeSpeed + ";"
        }
        break;
    }
  })
  updateBG(event.relatedTarget, animeSpeed);
})

function updateOrder(div, direction){
  if(direction == 'right'){
    if(+div.className[div.className.search('order')+6] == 5) {
      return div.className.replace(div.className[div.className.search('order')+6],1);
    }
    return div.className.replace(div.className[div.className.search('order')+6],+div.className[div.className.search('order')+6]+1);
  } else {
    if(+div.className[div.className.search('order')+6] == 1) {
      return div.className.replace(div.className[div.className.search('order')+6],5);
    }
    return div.className.replace(div.className[div.className.search('order')+6],+div.className[div.className.search('order')+6]-1);
  }
}

function updateBG(div, animeSpeed){
  let bg = document.getElementsByClassName('testBGInView')
  let bgLoad = document.getElementsByClassName('testBGLoad')

  bgLoad[0].addEventListener("animationend", () => {
    bg[0].style.removeProperty("background-image")
    bg[0].style.removeProperty("animation")
    bg[0].setAttribute("style", "background-image: url('" + div.children[0].children[1].children[0].src + "'); animation: fade-in ease-in-out " + animeSpeed + ";")
    bgLoad[0].style.removeProperty("background-image")
    bgLoad[0].style.removeProperty("animation")
  }, { once: true })

  bgLoad[0].style.removeProperty("background-image")
  bgLoad[0].style.removeProperty("animation")
  bgLoad[0].setAttribute("style", "background-image: url('" + div.children[0].children[1].children[0].src + "'); animation: fade-in ease-in-out " + animeSpeed + ";")
}

function loadTestBG(){
  let bg = document.getElementsByClassName('testBGInView')
  let div = document.querySelectorAll('div.testimonialContainer.active')
  //console.log(div[0].children[0].children[1].children[0].src)
  bg[0].style.removeProperty("background-image")
  bg[0].style="background-image: url('" + div[0].children[0].children[1].children[0].src + "');"
}

loadTestBG();