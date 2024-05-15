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
  keyboard: false,
})

//const tCarouselInstance = bootstrap.Carousel.getInstance(testimonialCaoursel)

//tCarouselInstance.next()



testimonialCaoursel.addEventListener('slide.bs.carousel', event => {
  let all = document.querySelectorAll('div.testimonialContainer')
  let animeSpeed = '5s'
  all.forEach((container) => {
    container.addEventListener("animationend", () => {
      container.style.removeProperty("animation");
      container.className = updateOrder(container, event.direction)
    }, { once: true })
  })

  all.forEach((container) => {
    console.log(container.height)
  })

  all.forEach((container) => {
    //Animation to shrink or grow based on position from centre
    switch(+container.className[container.className.search('order')+6]){
      case 1:
        if(event.direction == 'left'){
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,shrink3 " + animeSpeed + ";"
        } else {
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,grow2 " + animeSpeed + ";"
        }
        break;
      case 2:
        if(event.direction == 'left'){
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,shrink2 " + animeSpeed + ";"
        } else {
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,grow1 " + animeSpeed + ",fade-in " + animeSpeed +  ";"
        }
        break;
      case 3:
        container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,shrink1 " + animeSpeed + ",fade-out " + animeSpeed + ";"
        break;
      case 4:
        if(event.direction == 'left'){
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,grow1 " + animeSpeed + ",fade-in " + animeSpeed + ";"
        } else {
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,shrink2 " + animeSpeed + ";"
        }
        break;
      case 5:
        if(event.direction == 'left'){
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,grow2 " + animeSpeed + ";"
        } else {
          container.style="animation: "+ event.direction + " ease-in-out " + animeSpeed + " ,shrink3 " + animeSpeed + ";"
        }
        break;
    }
  })

})



/*

  <button type="button" id="myBtn" class="btn btn-success btn-lg" id="myBtn">Previous Item</button>
  <button type="button" id="myBtn2" class="btn btn-danger btn-lg" id="myBtn">Next Item</button><br><br>


<script>
$(document).ready(function(){

  // Go to the previous item
  $("#myBtn").click(function(){
    $("#myCarousel").carousel("prev");
  });

  // Go to the next item
  $("#myBtn2").click(function(){
    $("#myCarousel").carousel("next");
  });
    
});
</script>*/

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
