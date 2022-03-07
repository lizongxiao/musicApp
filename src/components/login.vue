<template>
  <div class="box">
    <div class="main">
<!--    //行星背景-->
      <div  class="solarsys"  >
      <!--太阳-->
      <div class='sun'></div>
      <!--水星轨道-->
      <div class='mercuryOrbit'></div>
      <!--水星-->
      <div class='mercury'></div>
      <!--金星轨道-->
      <div class='venusOrbit'></div>
      <!--金星-->
      <div class='venus'></div>
      <!--地球轨道-->
      <div class='earthOrbit'></div>
      <!--地球-->
      <div class='earth'></div>
      <!--火星轨道-->
      <div class='marsOrbit'></div>
      <!--火星-->
      <div class='mars'></div>
      <!--木星轨道-->
      <div class='jupiterOrbit'></div>
      <!--木星-->
      <div class='jupiter'></div>
      <!--土星轨道-->
      <div class='saturnOrbit'></div>
      <!--土星-->
      <div class='saturn'></div>
      <!--天王星轨道-->
      <div class='uranusOrbit'></div>
      <!--天王星-->
      <div class='uranus'></div>
      <!--海王星轨道-->
      <div class='neptuneOrbit'></div>
      <!--海王星-->
      <div class='neptune'></div>
    </div>

  <div class="login-bd">
    <h1 class="login-title" >登录即享音乐世界</h1>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="">
        <el-input  autofocus  type="tel" focus="tip" :clearable="true" :validate-event="true" autocomplete="on"  maxlength="11" minlength="11" placeholder="请输入手机号" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="" >
        <el-input   @keyup.enter.native="lg" show-password placeholder="请输入密码" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item >
        <el-button class="login-button" type="primary" @click="lg">
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</div>
</template>

<script>
import { phoneLogin,user_info,user_love} from '../Api/api'
export default {
  name: "login",
  data() {
    return {
      form: {
        name: '',
        password: '',
        user_Name:'',
        user_token:'',
      }
    }
  },
  methods:{
    //用户登录
   async lg(){
      var that =this;
     await phoneLogin({phone:this.form.name,password:this.form.password}).then((res) =>{
          // console.log('--------')
          // console.log(res)
          //用户名
          this.$store.state.user_name=res.data.profile.nickname;
          //用户头像
          this.$store.state.user_avatar=res.data.profile.avatarUrl;
          //用户登录token
          that.user_token=res.data.token
          localStorage.setItem("token", that.user_token);
          //用户id
          this.$store.state.user_id= res.data.account.id
         console.log(res.data.account.id)
        if (res.data.code===200){
          //展示登录信息
          this.$store.state.user_info_active=true;
          //验证成功后跳转只根目录：home2
          this.$router.push('/home')
          //同步导航栏样式
          this.$emit('get_data',"2")
          alert("欢迎回来    " + res.data.profile.nickname)
        } else{
          //验证失败弹窗提醒
          alert('账号或密码错误')
        }
      },function (error) {
          //请求失败捕获服务端或请求段错误信息
          if (error.response) {
            //请求已经发出，服务器用状态码作出响应
            //超出了2xx 的范围
            console.log('错误代码'+error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            //提出了请求，但没有收到任何答复
            console.log('错误代码'+error.request);
          } else {
            // 在设置触发错误的请求时发生了一些事情
            console.log('Error', error.message);
          }
          console.log('错误代码'+error.config);
        }
      )
      //获取用户详情
     await   user_info({uid:this.$store.state.user_id}).then((res)=>{
        // console.log('------------')
        // console.log(res)
        this.$store.state.user_day=res.data.data.nowLoginCount;
        this.$store.state.user_time=res.data.data.nowPlayCount;
        this.$store.state.user_up=res.data.data.level;
      })
    },

    test(){
      console.log("测试")
    }
  }
}
</script>
<style  lang="less" scoped  >
  .main {
    position: relative;
  }

  .login-bd {
    position: absolute;
    top: 5%;
    left: -5%;
    width: 500px;
    height: 300px;
    margin: 27px auto;
    padding: 5px 20px;
    z-index: 999;
}
.login-title {
  text-align: center;
  margin-left: 78px;
  font-family: 华光行书_CNKI;
  margin-top: 0;
  margin-bottom: 26px;
  font-size: 50px;
  color: white;
  text-shadow: 5px 5px 5px #052e3f;
}
.el-form-item {
  position: relative;
}
  .el-input {
    width: 80%;
    margin-left: 39px;
  }
.login-button {
  position: absolute;
  height: 100px;
  width: 100px;
  top: -88px;
  left: 148.5%;
  border-radius: 50%;
  background-color: transparent;
  border: none;
  border-inline: none;
}
//行星背景动画
.solarsys{
  width: 800px;
  height: 800px;;
  position: absolute;
  top: 10%;
  left: 19.5%;
  margin-top: -196px;
  transition: all 5s;
  padding: 0;
  transform: scale(1);
  float: left;
  position: absolute;
  z-index: 1;
}

/*太阳*/
.sun {
  left:357px;
  top:357px;
  height: 90px;
  width: 90px;
  background-image: url('../assets/icon.png');
  background-repeat: no-repeat;
  background-position:center;
  background-color: rgb(248,107,35);
  border-radius: 50%;
  box-shadow: 5px 5px 10px rgb(248,107,35), -5px -5px 10px rgb(248,107,35), 5px -5px 10px rgb(248,107,35), -5px 5px 10px rgb(248,107,35);
  position: absolute;
  margin: 0;
}

/*水星*/
.mercury {
  left:337.5px;
  top:395px;
  height: 10px;
  width: 10px;
  background-color: rgb(166,138,56);
  border-radius: 50%;
  position: absolute;
  transform-origin: 62.5px 5px;
  animation: rotate 1.5s infinite linear;
}

/*水星轨道*/
.mercuryOrbit {
  left:342.5px;
  top:342.5px;
  height: 115px;
  width: 115px;
  background-color: transparent;
  border-radius: 50%;
  border-style: dashed;
  border-color: gray;
  position: absolute;
  border-width: 1px;
  margin: 0px;
  padding: 0px;
}

/*金星*/
.venus {
  left:309px;
  top:389px;
  height: 22px;
  width: 22px;
  background-color: rgb(246,157,97);
  border-radius: 50%;
  position: absolute;
  transform-origin: 91px 11px;
  animation: rotate 3.84s infinite linear;
}

/*金星轨道*/
.venusOrbit {
  left:320px;
  top:320px;
  height: 160px;
  width: 160px;
  background-color: transparent;
  border-radius: 50%;
  border-style: dashed;
  border-color: gray;
  position: absolute;
  border-width: 1px;
  /*margin: 100px;*/
  /*transform-origin: -75px -75px;*/
  /*animation: rotate 4s infinite linear;*/
  margin: 0px;
  padding: 0px;
}

/*地球*/
.earth {
  left:266.5px;
  top:391px;
  height: 18px;
  width: 18px;
  background-color: rgb(115,114,174);
  border-radius: 50%;
  position: absolute;
  transform-origin: 134px 9px;
  animation: rotate 6.25s infinite linear;
}

/*地球轨道*/
.earthOrbit {
  left:275px;
  top:275px;
  height: 250px;
  width: 250px;
  background-color: transparent;
  border-radius: 50%;
  border-style: dashed;
  border-color: gray;
  position: absolute;
  border-width: 1px;
  /*margin: 100px;*/
  /*transform-origin: -75px -75px;*/
  /*animation: rotate 4s infinite linear;*/
  margin: 0px;
  padding: 0px;
}

/*火星*/
.mars {
  left:222.5px;
  top:392.5px;
  height: 15px;
  width: 15px;
  background-color: rgb(140,119,63);
  border-radius: 50%;
  position: absolute;
  transform-origin: 177.5px 7.5px;
  animation: rotate 11.75s infinite linear;
}

/*火星轨道*/
.marsOrbit {
  left:230px;
  top:230px;
  height: 340px;
  width: 340px;
  background-color: transparent;
  border-radius: 50%;
  border-style: dashed;
  border-color: gray;
  position: absolute;
  border-width: 1px;
  /*margin: 100px;*/
  /*transform-origin: -75px -75px;*/
  /*animation: rotate 4s infinite linear;*/
  margin: 0px;
  padding: 0px;
}

/*木星*/
.jupiter {
  left:134px;
  top:379px;
  height: 42px;
  width: 42px;
  background-color: rgb(156,164,143);
  border-radius: 50%;
  position: absolute;
  transform-origin: 266px 21px;
  animation: rotate 74.04s infinite linear;
}

/*木星轨道*/
.jupiterOrbit {
  left:155px;
  top:155px;
  height: 490px;
  width: 490px;
  background-color: transparent;
  border-radius: 50%;
  border-style: dashed;
  border-color: gray;
  position: absolute;
  border-width: 1px;
  /*margin: 100px;*/
  /*transform-origin: -75px -75px;*/
  /*animation: rotate 4s infinite linear;*/
  margin: 0px;
  padding: 0px;
}

/*土星*/
.saturn {
  left:92px;
  top:387px;
  height: 26px;
  width: 26px;
  background-color: rgb(215,171,68);
  border-radius: 50%;
  position: absolute;
  transform-origin: 308px 13px;
  animation: rotate 183.92s infinite linear;
}

/*土星轨道*/
.saturnOrbit {
  left:105px;
  top:105px;
  height: 590px;
  width: 590px;
  background-color: transparent;
  border-radius: 50%;
  border-style: dashed;
  border-color: gray;
  position: absolute;
  border-width: 1px;
  /*margin: 100px;*/
  /*transform-origin: -75px -75px;*/
  /*animation: rotate 4s infinite linear;*/
  margin: 0px;
  padding: 0px;
}

/*天王星*/
.uranus {
  left:41.5px;
  top:386.5px;
  height: 27px;
  width: 27px;
  background-color: rgb(164,192,206);
  border-radius: 50%;
  position: absolute;
  transform-origin: 358.5px 13.5px;
  animation: rotate 524.46s infinite linear;
}

/*天王星轨道*/
.uranusOrbit {
  left:55px;
  top:55px;
  height: 690px;
  width: 690px;
  background-color: transparent;
  border-radius: 50%;
  border-style: dashed;
  border-color: gray;
  position: absolute;
  border-width: 1px;
  /*margin: 100px;*/
  /*transform-origin: -75px -75px;*/
  /*animation: rotate 4s infinite linear;*/
  margin: 0px;
  padding: 0px;
}

/*海王星*/
.neptune {
  left:10px;
  top:390px;
  height: 20px;
  width: 20px;
  background-color: rgb(133,136,180);
  border-radius: 50%;
  position: absolute;
  transform-origin: 390px 10px;
  animation: rotate 1028.76s infinite linear;
}

/*海王星轨道*/
.neptuneOrbit {
  left:20px;
  top:20px;
  height: 760px;
  width: 760px;
  background-color: transparent;
  border-radius: 50%;
  border-style: dashed;
  border-color: gray;
  position: absolute;
  border-width: 1px;
  /*margin: 100px;*/
  /*transform-origin: -75px -75px;*/
  /*animation: rotate 4s infinite linear;*/
  margin: 0px;
  padding: 0px;
}

@keyframes rotate {
  100% {
    transform: rotate(-360deg);
  }
}
.box {
  width: 100%;
  height: 100vh;
  background-image: url(../assets/galaxy.png);
  background-repeat: no-repeat;
  background-position: left;
  -moz-background-size:100%;
  background-size:100%;
  overflow: hidden;
}
  @keyframes enter {
    0% {}
    100% {}
  }
</style>
