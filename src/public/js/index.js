const testimonialCaoursel = document.getElementById('testimonialsCarousel');
const galContainer = document.getElementById('carouselContainer');

const gCarousel = new bootstrap.Carousel(document.querySelector('#carouselContainer'), {
  touch: true,
  ride: false,
  keyboard: false,
})

const tCarousel = new bootstrap.Carousel(testimonialCaoursel, {
  interval: 3000,
  touch:    true,
  pause:    "hover",
  ride:     true,//true
  wrap:     true,
  keyboard: true,
})

galContainer.addEventListener('slide.bs.carousel', event => {
  scrollDisable = true;
  const container = document.getElementById("navbar");
  container.style.top = "-150px";
  document.getElementsByClassName('galleryHeader')[0].scrollIntoView({behavior: "instant"});

  let to  = document.querySelector("[data-bs-slide-to='" + event.to + "']").innerHTML;
  let from = document.querySelector("[data-bs-slide-to='" + event.from + "']");

  let links = document.querySelectorAll('.carousel-button');
  links.forEach(link => {
    if (link.innerHTML == to){
      link.classList.add('active');
      from.classList.remove('active');
    }
  })
})

galContainer.addEventListener('slid.bs.carousel', () => {
  setTimeout(() => {
    scrollDisable = false
  },1000);
})


testimonialCaoursel.addEventListener('slide.bs.carousel', event => {
  let all = document.querySelectorAll('div.testimonialContainer')
  let animeSpeed = '0.5s'
  all.forEach((container) => {
    container.addEventListener("animationend", () => {
      container.style.removeProperty("animation");
      container.style.removeProperty("-webkit-animation");
      container.className = updateOrder(container, event.direction)
    }, { once: true })
  })

  all.forEach((container) => {
    //Animation to shrink or grow based on position from centre
    switch(+container.className[container.className.search('order')+6]){
      case 1:
        if(event.direction == 'left'){
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,leftEdge " + animeSpeed + ";" + "-webkit-animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,leftEdge " + animeSpeed + ";"
        } else {
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,grow2 " + animeSpeed + ";" + "-webkit-animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,grow2 " + animeSpeed + ";"
        }
        break;
      case 2:
        if(event.direction == 'left'){
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,shrink2 " + animeSpeed + ";" + "-webkit-animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,shrink2 " + animeSpeed + ";"
        } else {
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,grow1 " + animeSpeed + ";" + "-webkit-animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,grow1 " + animeSpeed + ";"
        }
        break;
      case 3:
        container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,shrink1 " + animeSpeed + ";" + "-webkit-animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,shrink1 " + animeSpeed + ";"
        break;
      case 4:
        if(event.direction == 'left'){
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,grow1 " + animeSpeed + ";" + "-webkit-animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,grow1 " + animeSpeed + ";"
        } else {
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,shrink2 " + animeSpeed + ";" + "-webkit-animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,shrink2 " + animeSpeed + ";"
        }
        break;
      case 5:
        if(event.direction == 'left'){
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,grow2 " + animeSpeed + ";" + "-webkit-animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,grow2 " + animeSpeed + ";"
        } else {
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,rightEdge  " + animeSpeed + ";" + "-webkit-animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,rightEdge  " + animeSpeed + ";"
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
  bg[0].style.removeProperty("background-image")
  bg[0].style="background-image: url('" + div[0].children[0].children[1].children[0].src + "');"
}

loadTestBG();