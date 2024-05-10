const testimonialCaoursel = document.getElementById('testimonialsCarousel')

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
  keyboard: false,
})

testimonialCaoursel.addEventListener('slid.bs.carousel', event => {
  let all = document.querySelectorAll('div.testimonialContainer')
  all.forEach((container) => {
    container.style="transition: 0.05s ease-in-out; "
    container.className = updateOrder(container, event.direction)
  })
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

