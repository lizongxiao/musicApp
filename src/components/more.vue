<template>
<div >
  <!--      轮播图-->
  <div class="carousel_body">
    <el-carousel height="200px" direction="vertical" :autoplay="true">
      <el-carousel-item v-for="item in 3" :key="item">
        <h3 class="medium">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
  </div>

  <img class="more_logo" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fqqpublic.qpic.cn%2Fqq_public%2F0%2F0-2510534250-ED215CF14CBF9805EE931A36D07B3CD2%2F0%3Ffmt%3Dgif%26size%3D20%26h%3D206%26w%3D300%26ppv%3D1.jpg&refer=http%3A%2F%2Fqqpublic.qpic.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648101260&t=ae73fb10a3eead5485f3f89d312add4a" alt="">
</div>
</template>

<script>
export default {
  name: "more" ,
}
</script>

<style scoped>
.more_logo {
  margin:  100px 30%;
  width: 500px;
  height: auto;
}
</style>
