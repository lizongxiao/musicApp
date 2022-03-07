<template>
  <div id="app">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#3c3f41"
      text-color="#909399"
      active-text-color="#fefdf8">
      <el-menu-item :disabled="disabled" index="1"><a href="#/login" style="text-decoration: none"><div   style="width: 100% " class="nva-login"  v-show="show">登录</div> </a> </el-menu-item>
      <el-menu-item index="2"><a href="#/home" style="text-decoration: none"><div style="width: 100%" class="nva-login">发现音乐</div> </a> </el-menu-item>
     <el-menu-item index="3"><a href="#/more" style="text-decoration: none"><div style="width: 100%" class="nva-login">更多精彩敬请期待</div> </a> </el-menu-item>
    </el-menu>
    <!--        //退出登录-->
    <div  v-show="quit" class="user_quit">
      <button @click="user_quit()">退出登录</button>
    </div>
    <!--      用户登录信息-->
    <div class="user_info" v-show="this.$store.state.user_info_active">
     <div class="drop_menu">
       <el-dropdown @command="handleCommand"  >
           <span class="el-dropdown-link" >

      <el-avatar class="user_avatar" :src="this.$store.state.user_avatar"></el-avatar>
            </span>
         <el-dropdown-menu slot="dropdown">
           <el-dropdown-item command="musicLove">喜欢列表</el-dropdown-item>
<!--           <el-dropdown-item command="massage">消息中心</el-dropdown-item>-->
<!--           <el-dropdown-item command="history">播放历史</el-dropdown-item>-->
         </el-dropdown-menu>
       </el-dropdown>
     </div>
      <span class="user user_name">用户名:{{this.$store.state.user_name}}</span>
      <span class="user user_up">用户等级:{{this.$store.state.user_up}}</span>
      <span class="user user_day">登录天数:{{this.$store.state.user_day}}</span>
      <span class="user user_time">听歌次数:{{this.$store.state.user_time}}</span>
    </div>
    <!--    //全组件的路由集合点，需要传递时，并经之路-->
    <router-view @get_data="getData" />
  </div>
</template>
<script>
import { userQuit,music_detail,user_love } from './Api/api';
export default {
  name: 'App',
  created() {
  },
  data() {
    return {
      activeIndex: "",
      suc_login:'',
      disabled:false,
      show:true,
      quit:false
    }
  },
  methods:{
    //通过传入参数形式，回调函数判断下拉菜单item
    handleCommand(command){
      if (command=="musicLove"){
        this.userLove()
      }
      if (command=="massage"){
        this.userMassage()
      }
      if (command=="history"){
        this. userHistory()
      }
    },
    async  userLove(){
      await   user_love({uid:this.$store.state.user_id}).then((res)=>{
        // console.log('喜欢列表')
        // console.log(res)
        //获取喜欢列表的ID数组后，转换成字符串，
        var arr=[];
        arr=res.data.ids;
        console.log(arr)
        this.$store.state.user_love_id=arr.join(",");
        console.log(this.$store.state.user_love_id)
      }).catch((err) => {
        console.log(err)
      })
      await    music_detail({ids:this.$store.state.user_love_id}).then((res)=>{
        //搜索所有歌曲的详情
        console.log("-------ids的详情")
        console.log(res)
        //将用户喜欢的歌曲列表存入公共库
        this.$store.state.user_love_list=res.data.songs;
        console.log(this.$store.state.user_love_list)
        this.$store.state.music_list_title="喜欢列表"
        //显示主页按钮
        this.$store.state.homeIsactive =true
        this.$store.state.turnIsactive=false;
      })
      //当用户登录，点击喜欢列表后，将登录获取到的用户喜欢列表复制给home页面展示
      console.log("展示喜欢列表")
    },
    userMassage(){
      console.log("消息记录")

    },
    userHistory(){
      console.log("历史记录")
    },
    handleSelect(key, keyPath) {
      this.activeIndex=key;
    },
    //同步点击导航栏样式，通过子传父值的方式
    getData(data){
      this.activeIndex=data;
      this.disabled=true;
      this.show=false;
      this.quit=true;
    },
    user_quit(){
      //用户退出登录状态
      userQuit({}).then(()=>{
        alert("退出成功")
        //分别显示登录按钮，隐藏退出按钮
        this.disabled=false;
        this.show=true;
        this.quit=false;
        //隐藏登录视窗
        this.$store.state.user_info_active=false;
        //清空登录状态
        // this.$store.state.user_up='';
        // this.$store.state.user_day='';
        // this.$store.state.user_time='';
        // this.$store.state.user_name='';
        // this.$store.state.user_avatar='';
      })
    },

  }
}
</script>
<style>
body {
  margin: 0;
  padding: 0;
}
</style>

<style lang="less" scoped>

//用户退出按钮
.user_quit:hover{
  background-color: #303234;
}
.user_quit {
  position: absolute;
  left: 4px;
  top: 3px;
  float: left;
  z-index: 999;
  border: none;
  mso-border-shadow: no;
}
.user_quit button{
  width: 342px;
  height: 55px;
  background-color: transparent;
  font-size: 25px;
  font-family: 华光行书_CNKI;
  color:#909399 ;
  border: none;
  cursor: pointer;
}
.user_quit button:hover{
  color: #fff;
}
//导航栏
.el-menu {
  width: 100%;
  z-index: 99;
}
.el-menu-item {
  width: 22.8%;
  text-align: center;
  padding: 0;
  font-size: 25px;
  font-family: 华光行书_CNKI;
}

//用户登录信息展示
.user_info {
  display: inline-block;
  position: absolute;
  right: 60px;
  top: 5px;
  z-index: 999;
  //border: 1px solid red;
  font-family: 华光行书_CNKI;
  font-size: 16px;
}
  .user_name {
    //background-color: pink ;
    right: 75px;
    width: 181px;
    font-size: 15px;
  }
.user_up {
  //background-color: skyblue ;
  right: -33px;
  width: 100px;
}
.user_day {
  top: 25px;
  //background-color: purple ;
  right: 155px;
  width: 100px;
}
.user_time {
  //background-color: oldlace ;
  right: -48px;
  width: 116px;
  top: 25px;

}
.user_avatar {
  //background-color: oldlace ;
  position: absolute;
  right: -27px;
  top: -26px;
}
.user {
  position: absolute;
  color: #fff;

}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.drop_menu {
  display: inline-block;
  //background-color: #fff;
  //border: 1px solid red;
  position: absolute;
  right: 241px;
  top: 15px;
  z-index: 99;
  width: 50px;
  height: 50px;
}
</style>
