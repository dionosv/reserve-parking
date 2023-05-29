<template>
<div class="all">
    <div class="wrap">
        <div class="vid_content">
            <Videonotes></Videonotes>

        </div>
        <div class="landscape">
          <img src="/src/photos/bg2.jpg" alt="">
        </div>

        <!-- <video autoplay="" loop="true" muted="" class="custom-video" poster="">
            <source src="/src/video/Vid1.mp4" type="video/mp4">
        </video> -->
    </div>

    <div class="wrap2">
        <div class="vid_content">
            <Videonotes></Videonotes>
        </div>
        <div class="potrait">
          <img src="/src/photos/bg.jpg" alt="">
        </div>
        <!-- <video autoplay="" loop="true" muted="" class="custom-video" poster="">
            <source src="/src/video/Vid2.mp4" type="video/mp4">
        </video> -->
    </div>

</div>
<br>
<br>
</template>

<script>
import Videonotes from './videonotes.vue';
export default{
    components : {Videonotes}
}
</script>

<style>

.wrap {
  position: relative;
  padding-bottom: 56.25%; /* Set the aspect ratio of the video (16:9) */
  height: 0;
  overflow: hidden;
}

.vid_content {
    position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  color: white;
  font-size: 24px;
  text-align: center;
}

.landscape img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 140%;
  filter: brightness(60%);
}

.wrap2  {
    display: none;
  }


@media (max-width: 777px) {
  .wrap {
    display: none;
  }

  .wrap2 {
    display: block;
  position: relative;
  padding-bottom: 200%; 
  height: 0;
  overflow: hidden;
}

  .potrait img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 125%;
    filter: brightness(60%);
  }

  
}


</style>