<template>
  <div class="box"
       :style="{
        backgroundImage: 'url(' + srcImgUrl + ')',
        backgroundSize:'69% 100%', backgroundRepeat: 'no-repeat'  }">
    <!--      MV播放-->
    <div class="mv_media" @click="close_mv" v-show="mv_Isactive">
      <video
        :src="mvUrl"
        autoplay
        class="mv_video"
        controls ="controls"
        width ="900px"
        height ="600px"
        preload ="metadata" >
    </video >

    </div>
    <div class="hearth">
      <!--头部动画-->
      <div class="section">
        <div clss="icon-img"></div>
        <div clss="icon-img"></div>
        <div clss="icon-img"></div>
        <div clss="icon-img"></div>
        <div clss="icon-img"></div>
        <div clss="icon-img"></div>
        <div clss="icon-img"></div>
        <div clss="icon-img"></div>
        <div clss="icon-img"></div>
      </div>
      <!--气泡-->
      <div class="dog_talk" v-show="searchIsactive">
        <!--气泡箭头-->
        <div class="jiantou1"></div>
        <!--说话-->
        <div class="title1">
          <div class="con1">
            <h1 class="line1" >来首音乐怎么样？</h1>
          </div>
        </div>
        <!-- 搜索框-->
        <el-input
          :placeholder="placeH"
          prefix-icon="el-icon-search"
          v-model="user_input"
          @keyup.enter.native="searchMusic"
          title="回车搜索">
        </el-input>
      </div>
        <div class="input_2" v-show="!searchIsactive">
          <el-input
            placeholder="请输入 歌曲名称 or 歌手名称"
            prefix-icon="el-icon-search"
            v-model="user_input"
            @keyup.enter.native="searchMusic"
            title="回车搜索">
          </el-input>
        </div>
<!--      播放器控件-->
     <div class="playContrl">
       <span class="songCycle"   :style="{color:cycleIsactive}"   @click="songCycle" title="点击开启单曲循环">单</span>
       <span class="songLyric" @click="mLyric"  :style="{color:lyricIsactive}" >词</span>
       <div class="prebtn" title="上一首" >
         <img src="../assets/pre.png" @click="preMusic" alt="">
       </div>
       <div class="playbtn" @click="playAll" title="随机播放">
         <img src="../assets/play.png" alt="">
       </div>
       <div class="nextbtn">
         <img src="../assets/next.png" @click="nextMusic" alt="" title="下一首">
       </div>
     </div>
    </div>
    <div class="main">
      <!--音乐列表-->
      <div v-show="active?false:true">
        <b class="opn"  @click="opn">
        </b>
        <span class="opn_list_title"  @click="opn" aria-selected="false">
        音乐列表
      </span>
      </div>
      <div class="list_body"  v-show="active?active :'' ">
        <div class="list_title">
          <span class="title" >
            {{this.$store.state.music_list_title}}
          </span>

        </div>
        <b class="turn"  v-show="this.$store.state.turnIsactive"  @click="turn"><img src="../assets/turn.png" alt=""></b>
        <b class="home"  v-show="this.$store.state.homeIsactive"  @click="home"><img src="../assets/home.png" alt=""></b>
        <!--        音乐列表表格-->
        <div class="music_list">
          <el-card style="height:596px">
            <span class="list-title1">歌名</span>
            <span   class="list-title2">歌手</span>
            <ul class="song_list" style="overflow-y:scroll;" >
              <li title="点击播放 双击可添加到喜欢列表"
                  v-for="(item,index) in  user_list"
                  :key="index" @dblclick="loveMusic(item.id)"
                  @click="playMusic(item.id,index),musicLyric(item.id)">
                <span>{{ item.name }}</span>
                <span>{{ item.ar[0].name}}</span>
              </li>
            </ul>
          </el-card>
        </div>
      </div>
    </div>
    <div class="footer">
<!--      正在播放的歌曲信息-->
      <div class="music_detail" v-show="music_name_active">
          <span class="music_name">{{ "歌曲名称："+ music_name }}</span>
          <span class="music_author">{{"歌曲作者："+music_authors}}</span>
      </div>
<!--      歌曲头像-->
      <div class="musicAvatar"  v-show="isAvatar" title="暂无MV">
<!--        mv播放遮罩层-->
        <div v-show="mv_button_isActive" :class="mv_button"  @click="playMv" title="播放歌曲MV">
        </div>
        <el-avatar shape="square" :size="80" fit="cover" :src="mAvatar">
        </el-avatar>
      </div>
<!--      歌曲评论-->
      <div class="comment_body" v-show="com_body" >
        <div class="comment_move_body" >
          <ul>
            <li v-for="(item,index) in commentList" :key="index">
            <span class="cmt_demo">
              <el-avatar class="comment_avater" :src="item.user.avatarUrl"></el-avatar>
              <b class="comment_name" >{{item.user.nickname}}</b>
              <span class="commented">{{item.content}}</span>
            </span>
            </li>
          </ul>
        </div>
      </div>
<!--      歌曲播放audio-->
      <audio
        ref='audio'
        :src="musicSrc"
        controls
        autoplay
        :loop="audioLoop"
        class="myaudio"
        v-show="audioIsshow"
        @play="onPlay"
        @ended="overAudio"
        @timeupdate="updateTime"
      >
      </audio>
    </div>
<!--    歌词-->
    <div class="lyricBox"  v-show="musicIsacitve">
    <ul  ref="lyricUL">
      <li v-for="(item, i) in lyricsObjArr"
          :style="{color: lyricIndex === i ? '#10d968' : '#ded9d9'}"
          :key="item.uid"
          :data-index='i'
          ref="lyric"
          class="myLyric"
      >
                      {{item.lyric}}
      </li>
    </ul>
    </div>
  </div>
</template>

<script>

import {
  //歌曲搜素
  searchMusic,
  //音乐播放
  musicPlay,
  //热门歌曲推荐
  hotMusic,
  //歌曲评论
  hotComment,
  //歌曲详情
  music_detail,
  //歌曲MV
  music_Mv,
  //最近播放音乐列表
  recent_music,
  //添加音乐到喜欢
  addLove_music,
  //音乐歌词
  songLyric,

} from "../Api/api.js";
export default {
  name: "home",
  created() {
    //最近播放列表
    recent_music({}).then((res)=>{
      // console.log(res)
    })
    //日推歌曲
    hotMusic().then((res)=>{
      // console.log(res);
      this.user_list=res.data.data.dailySongs;
      // console.log(this.user_list)
        this.$store.state.music_temporary=res.data.data.dailySongs;
      // console.log(  this.$store.state.music_temporary)
    })
  },
  watch:{
    //监听音乐列表，如用户选择登录后选择喜欢列表，则将最新的值复制给音乐列表组件
    "$store.state.user_love_list"(newVal,oldVal){
      this.user_list=newVal
      // console.log("---new")
      // console.log(newVal);
      // console.log(this)
      // console.log(this.user_list)
    },

  },
  data() {
    return {
      //歌词位置指针
      lyricIndex:'',
      //默认背景图
      srcImgUrl: require('../assets/musicbg.png'),
      //用户输入
      user_input:'',
      //输入框
      placeH:"请输入 歌曲名称 or 歌手名称",
      //用户歌曲列表
      user_list:[],
      //歌曲地址
      musicSrc:'',
      //歌曲列表显示或隐藏
      active:true,
      //歌曲列表标题切换
      titleActive:false,
      //歌曲头像
      mAvatar:'',
      //头像显示指针
      isAvatar:false,
      //评论列表
      commentList:[],
      //歌曲评论指针
      com_body:false,
      //歌曲名称容器指针
      music_name_active:false,
      //歌曲名称
      music_name:'',
      //歌曲作者名称
      music_authors:'',
      //歌曲mvID
      music_mvId:'',
      //歌曲mv组件指针
      mv_Isactive:false,
      //歌曲头像遮罩层指针
      mv_button:'',
      //歌曲MV播放按钮指针
      mv_button_isActive:false,
      //歌曲MV地址
      mvUrl:'',
      //返回键指针
      turnIsactive:false,
      //audio指针
      audioIsshow:false,
      //默认搜索框指针
      searchIsactive:true,
      //歌曲单曲循环
      audioLoop:false,
      //开启单曲循环状态
      cycleIsactive:'',
      //歌词开启状态
      lyricIsactive:'',
      //歌词原型
      music_lyric:'',
      //歌词按钮
      musicIsacitve:false,
      //歌词容器
      lyricsObjArr:[]

    }
  },
  methods:{
    //单曲循环开关
    songCycle(){
      this.audioLoop=!this.audioLoop;
      if(this.audioLoop){
        this.cycleIsactive='#a1dcbb'
      } else {
        this.cycleIsactive=''
      }
    },
    //歌词开关
    mLyric(){
      this.musicIsacitve=!this.musicIsacitve;
      if(this.musicIsacitve){
        this.lyricIsactive='#a1dcbb'
      } else {
        this.lyricIsactive=''
      }

    },
    //获取音乐歌词
    musicLyric(id){
    songLyric({id:id}).then((res)=>{
      this.lyricsObjArr=[];
    this.music_lyric=res.data.lrc.lyric;
    // console.log(res.data.lrc.lyric)
    //定义分组依据，以\n换行符为界限，分割字符串，把每句歌词分别放在一个数组里
    const regNewLine = /\n/
    //得到一个数组，一行歌词
    const lineArr =  this.music_lyric.split(regNewLine) // 每行歌词的数组
    console.log(lineArr)
    //匹配时间
    const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/
    //对数组里面的歌词遍历
    lineArr.forEach(item => {
    if (item === '')
      return
    const obj = {}
    const time = item.match(regTime)
    obj.lyric = item.split(']')[1].trim() === '' ? '' : item.split(']')[1].trim()
    obj.time = time ?this.formatLyricTime(time[0].slice(1, time[0].length - 1)) : 0
    obj.uid = Math.random().toString().slice(-6)
    if (obj.lyric === '') {
      console.log('这一行没有歌词')
    } else {
      this.lyricsObjArr.push(obj)
    }

    })
    })
    },
    // 格式化歌词的时间 转换成 sss:ms
    formatLyricTime (time)
    {
      const regMin = /.*:/
      const regSec = /:.*\./
      const regMs = /\./
      const min = parseInt(time.match(regMin)[0].slice(0, 2))
      let sec = parseInt(time.match(regSec)[0].slice(1, 3))
      const ms = time.slice(time.match(regMs).index + 1, time.match(regMs).index + 3)
      if (min !== 0) {
        sec += min * 60
      }
      return Number(sec + '.' + ms)
    },
    //传入歌曲ID，添加音乐到喜欢列表
    loveMusic(id){
      addLove_music({id:id}).then((res)=>{
        console.log(res)
        if (res.data.code){
          alert("成功添加音乐到喜欢列表")
        }
      })
    },
    //空间播放上一首
    async  preMusic(){
      // this.$store.state.playAll_music_index_2 音乐列表指针-1，即是上一首
        this.$store.state.playAll_music_index_1--
        this.musicSrc = this.$store.state.playALL_music_url[this.$store.state.playAll_music_index_1].url;
        await  music_detail({ids:this.$store.state.playALL_music_url[this.$store.state.playAll_music_index_1].id}).then((res)=>{
        // console.log(res)
        this.music_name= res.data.songs[0].al.name;
        this.music_authors=res.data.songs[0].ar[0].name;
        this.music_mvId =res.data.songs[0].mv;
        this.mAvatar =res.data.songs[0].al.picUrl;
        this.srcImgUrl =res.data.songs[0].al.picUrl;
        // console.log(this.music_mvId)
        if (this.music_mvId!==0){
          this.mv_button_isActive =true;
          this.mv_button ='mv_button';
        }
      })
        await  hotComment({id:this.$store.state.playALL_music_url[this.$store.state.playAll_music_index_1].id,limit:50}).then((res)=>{
        // console.log("--------")
        // console.log(res)
        this.commentList = res.data.comments;
      })
      //获取歌词
      await  songLyric({id:this.$store.state.playALL_music_url[this.$store.state.playAll_music_index_1].id}).then((res)=>{
        this.lyricsObjArr=[];
        this.music_lyric=res.data.lrc.lyric;
        // console.log(res.data.lrc.lyric)
        //定义分组依据，以\n换行符为界限，分割字符串，把每句歌词分别放在一个数组里
        const regNewLine = /\n/
        //得到一个数组，一行歌词
        const lineArr =  this.music_lyric.split(regNewLine) // 每行歌词的数组
        console.log(lineArr)
        //匹配时间
        const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/
        //对数组里面的歌词遍历
        lineArr.forEach(item => {
          if (item === '')
            return
          const obj = {}
          const time = item.match(regTime)
          obj.lyric = item.split(']')[1].trim() === '' ? '' : item.split(']')[1].trim()
          obj.time = time ?this.formatLyricTime(time[0].slice(1, time[0].length - 1)) : 0
          obj.uid = Math.random().toString().slice(-6)
          if (obj.lyric === '') {
            console.log('这一行没有歌词')
          } else {
            this.lyricsObjArr.push(obj)
          }

        })
      })
    },
  async  nextMusic(){
      // this.$store.state.playAll_music_index_2 音乐列表指针+1，即是下一首
        this.$store.state.playAll_music_index_1++
        this.musicSrc = this.$store.state.playALL_music_url[this.$store.state.playAll_music_index_1].url;
        await  music_detail({ids:this.$store.state.playALL_music_url[this.$store.state.playAll_music_index_1+1].id}).then((res)=>{
        // console.log(res)
        this.music_name= res.data.songs[0].al.name;
        this.music_authors=res.data.songs[0].ar[0].name;
        this.music_mvId =res.data.songs[0].mv;
        this.mAvatar =res.data.songs[0].al.picUrl;
        this.srcImgUrl =res.data.songs[0].al.picUrl;
        // console.log(this.music_mvId)
        if (this.music_mvId!==0){
          this.mv_button_isActive =true;
          this.mv_button ='mv_button';
        }
      })
      await hotComment({id:this.$store.state.playALL_music_url[this.$store.state.playAll_music_index_1].id,limit:50}).then((res)=>{
        // console.log("--------")
        // console.log(res)
        this.commentList = res.data.comments;
      })
    //获取歌词
    await  songLyric({id:this.$store.state.playALL_music_url[this.$store.state.playAll_music_index_1].id}).then((res)=>{
      this.lyricsObjArr=[];
      this.music_lyric=res.data.lrc.lyric;
      // console.log(res.data.lrc.lyric)
      //定义分组依据，以\n换行符为界限，分割字符串，把每句歌词分别放在一个数组里
      const regNewLine = /\n/
      //得到一个数组，一行歌词
      const lineArr =  this.music_lyric.split(regNewLine) // 每行歌词的数组
      console.log(lineArr)
      //匹配时间
      const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/
      //对数组里面的歌词遍历
      lineArr.forEach(item => {
        if (item === '')
          return
        const obj = {}
        const time = item.match(regTime)
        obj.lyric = item.split(']')[1].trim() === '' ? '' : item.split(']')[1].trim()
        obj.time = time ?this.formatLyricTime(time[0].slice(1, time[0].length - 1)) : 0
        obj.uid = Math.random().toString().slice(-6)
        if (obj.lyric === '') {
          console.log('这一行没有歌词')
        } else {
          this.lyricsObjArr.push(obj)
        }

      })
    })
    },
    //空间播放下一首
    //控件播放列表全部歌曲
  async  playAll(){
    //调出歌曲名称、评论、头像、播放器、搜索框
      this.music_name_active=true;
      this.com_body=true;
      this.isAvatar= true;
      this.audioIsshow =true;
      this.searchIsactive=false;
      var str =''
      for (let i = 0;i<this.user_list.length; i++){
        str = this.user_list[i].id
        //取出所有目前列表音乐id
        this.$store.state.playAll_music_id+=str+','
      }
        //处理id，去除最后一个逗号
      this.$store.state.playAll_music_id= this.$store.state.playAll_music_id.substr(0, this.$store.state.playAll_music_id.length-1)
      // console.log(this.$store.state.playAll_music_id)
        //获取所有id对应的音乐url
    //播放音乐
      await  musicPlay({id:this.$store.state.playAll_music_id}).then((res)=>{
        console.log(res)
        //随机播放列表第一首歌
      var nums_1=parseInt(Math.random()*this.user_list.length-1);
      this.$store.state.playAll_music_index_1=nums_1;
      this.musicSrc = res.data.data[nums_1].url;
        //将列表的所有歌曲的url存储
        this.$store.state.playALL_music_url=res.data.data;
        console.log(this.$store.state.playALL_music_url[nums_1].id)
      })
    //获取歌曲详情
      await music_detail({ids:this.$store.state.playALL_music_url[this.$store.state.playAll_music_index_1].id}).then((res)=>{
       console.log(res)
      this.music_name= res.data.songs[0].al.name;
      this.music_authors=res.data.songs[0].ar[0].name;
      this.music_mvId =res.data.songs[0].mv;
      this.mAvatar =res.data.songs[0].al.picUrl;
      this.srcImgUrl =res.data.songs[0].al.picUrl;
      // console.log(this.music_mvId)
      if (this.music_mvId!==0){
        this.mv_button_isActive =true;
        this.mv_button ='mv_button';
      }
    })
    //获取评论
       await  hotComment({id:this.$store.state.playALL_music_url[this.$store.state.playAll_music_index_1].id,limit:50}).then((res)=>{
      // console.log("--------")
      // console.log(res)
        this.commentList = res.data.comments;
    })
      //获取歌词
      await  songLyric({id:this.$store.state.playALL_music_url[this.$store.state.playAll_music_index_1].id}).then((res)=>{
        this.lyricsObjArr=[];
        this.music_lyric=res.data.lrc.lyric;
        // console.log(res.data.lrc.lyric)
        //定义分组依据，以\n换行符为界限，分割字符串，把每句歌词分别放在一个数组里
        const regNewLine = /\n/
        //得到一个数组，一行歌词
        const lineArr =  this.music_lyric.split(regNewLine) // 每行歌词的数组
        console.log(lineArr)
        //匹配时间
        const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/
        //对数组里面的歌词遍历
        lineArr.forEach(item => {
          if (item === '')
            return
          const obj = {}
          const time = item.match(regTime)
          obj.lyric = item.split(']')[1].trim() === '' ? '' : item.split(']')[1].trim()
          obj.time = time ?this.formatLyricTime(time[0].slice(1, time[0].length - 1)) : 0
          obj.uid = Math.random().toString().slice(-6)
          if (obj.lyric === '') {
            console.log('这一行没有歌词')
          } else {
            this.lyricsObjArr.push(obj)
          }

        })
        })

    },
    //监听audio的timeupdate事件以匹配歌词
    updateTime(e){
      //获取当前播放时间
      this.currentTime = e.target.currentTime;
      // console.log(this.currentTime)
      for (let i = 0; i < this.lyricsObjArr.length; i++) {
        if (this.currentTime > (parseInt(this.lyricsObjArr[i].time))) {
          const index = this.$refs.lyric[i].dataset.index
          if (i === parseInt(index)) {
            this.lyricIndex = i
            this.$refs.lyricUL.style.transform = `translateY(${170 - (20 * (i + 1))}px)`
          }
        }
      }
    },
    //监听audio开始播放
   onPlay(){

   },
    //监听audio播放完毕
   async overAudio(){
      this.lyricsObjArr=[];
      var nums_2=parseInt(Math.random()* this.$store.state.playALL_music_url.length);
        this.$store.state.playAll_music_index_2=nums_2;
        this.musicSrc = this.$store.state.playALL_music_url[nums_2].url;
     await  music_detail({ids:this.$store.state.playALL_music_url[this.$store.state.playAll_music_index_2].id}).then((res)=>{
      this.music_name= res.data.songs[0].al.name;
      this.music_authors=res.data.songs[0].ar[0].name;
      this.music_mvId =res.data.songs[0].mv;
      this.mAvatar =res.data.songs[0].al.picUrl;
      this.srcImgUrl =res.data.songs[0].al.picUrl;
      // console.log(this.music_mvId)
      if (this.music_mvId!==0){
        this.mv_button_isActive =true;
        this.mv_button ='mv_button';
      }
    })
   await  hotComment({id:this.$store.state.playALL_music_url[this.$store.state.playAll_music_index_2].id,limit:50}).then((res)=>{
      // console.log("--------")
      // console.log(res)
      this.commentList = res.data.comments;
    })
      //获取歌词
     await  songLyric({id:this.$store.state.playALL_music_url[this.$store.state.playAll_music_index_2].id}).then((res)=>{
       this.lyricsObjArr=[];
        this.music_lyric=res.data.lrc.lyric;
        // console.log(res.data.lrc.lyric)
        //定义分组依据，以\n换行符为界限，分割字符串，把每句歌词分别放在一个数组里
        const regNewLine = /\n/
        //得到一个数组，一行歌词
        const lineArr =  this.music_lyric.split(regNewLine) // 每行歌词的数组
        console.log(lineArr)
        //匹配时间
        const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/
        //对数组里面的歌词遍历
        lineArr.forEach(item => {
          if (item === ''){
            return
          }
          const obj = {}
          const time = item.match(regTime)
          obj.lyric = item.split(']')[1].trim() === '' ? '' : item.split(']')[1].trim()
          obj.time = time ?this.formatLyricTime(time[0].slice(1, time[0].length - 1)) : 0
          obj.uid = Math.random().toString().slice(-6)
          if (obj.lyric === '') {
            console.log('这一行没有歌词')
          } else {
            this.lyricsObjArr.push(obj)
          }
        })
      })
    },
    //取出栈存储主页列表
    home(){
      this.user_list=this.$store.state.music_temporary;
      this.$store.state.music_list_title="今日热曲放送"
      this.$store.state.homeIsactive =false
    },
    //取出栈存储列表
    turn(){
      this.user_list=this.$store.state.music_temporary;
      this.$store.state.turnIsactive=false;
      this.$store.state.music_list_title="今日热曲放送"
    },
    //MV播放
    playMv(){
      var that =this;
      music_Mv({id:this.music_mvId}).then((res)=>{
        // console.log(res)
        that.mvUrl=res.data.data.url;
        // console.log(that.mvUrl)
        that.mv_Isactive =true;
        that.mv_button_isActive=true;
        that.$refs.audio.pause()
      })
    },
    //歌曲搜索
    searchMusic(){
      searchMusic({keywords:this.user_input,limit:60}).then((res)=>{
        // console.log(res)
        this.user_list =res.data.result.songs;
        //存储列表，供返回用，减少请求
        this.turnIsactive=true;
        //打开列表
        // this.active = true;
        //打开搜索结果标题
        // this.titleActive=true;
        this.$store.state.music_list_title="为您找到如下歌曲"
        //打开返回，隐藏home
        this.$store.state.homeIsactive=false;
        this.$store.state.turnIsactive=true;
        //清空输入框
        this.user_input ='';
      })
    },
    //关闭搜索列表
    cls(){
      this.active = false;
    },
    //打开搜索列表
    opn(){
      this.active = !this.active;
    },
    //关闭MV
    close_mv(){
      //关闭图层
      this.mv_Isactive =false;
      //清空MVUrl
      this.mvUrl = ''
      //打开audio
      this.$refs.audio.play()
    },
    // 歌曲播放
    playMusic(id,index){
      //调出歌曲名称、评论、头像、播放器、搜索框
      this.music_name_active=true;
      this.com_body=true;
      this.isAvatar= true;
      this.audioIsshow =true;
      this.searchIsactive=false;
      //歌曲播放
      musicPlay({id:id}).then((res)=>{
        // console.log(res)
        // console.log(id)
        this.musicSrc = res.data.data[0].url;
        this.mAvatar = this.user_list[index].al.picUrl;
        this.srcImgUrl =this.user_list[index].al.picUrl;
      })
      //歌曲评论
      hotComment({id:id,limit:50}).then((res)=>{
        // console.log("--------")
        // console.log(res)
        this.commentList = res.data.comments;
      })
      //歌曲详情
      music_detail({ids:id}).then((res)=>{
        // console.log("-----------")
        // console.log(res)
        this.music_name= res.data.songs[0].al.name;
        this.music_authors=res.data.songs[0].ar[0].name;
        this.music_mvId =res.data.songs[0].mv;
        // console.log(this.music_mvId)
        if (this.music_mvId!==0){
          this.mv_button_isActive =true;
          this.mv_button ='mv_button';
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
//主体盒子
 li {
   list-style: none;
 }
.box {
  position: relative;
  width: 100%;
  height: 660px;
  background-image: url(../assets/musicbg.png);
  overflow: hidden;
}
//头部区域
.hearth {
  width: 100%;
  height: 15%;
  //background-color: skyblue;
  //border: 1px solid green;
  box-sizing: border-box;
}
//main区域
.main {
  position: relative;
  width: 100%;
  height: 50%;
  box-sizing: border-box;
  //border: 1px solid red;
}
//footer部分
.footer {
  width: 100%;
  height: 23%;
  //border: 1px solid gold;
  box-sizing: border-box;
}
.total  {
  position: absolute;
  top: 0;
}

//音乐字符
.section {
  position: relative;
  width: 54px;
  height: 52px;
  margin-left: 32.5%;
  transform-style: preserve-3d;
  /* 添加动画效果 */
  animation: rotate 100s linear infinite;
}
@keyframes rotate {
  0% {
    transform: rotateY(0);
  }
  100% {
    transform: rotateY(360deg);
  }
}
.section div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url(../assets/icon.png) no-repeat;
  z-index: 99;
}
.section div:nth-child(1) {
  transform: rotateY(0) translateZ(800px);
}
.section div:nth-child(2) {
  /* 先旋转好了再 移动距离 */
  transform: rotateY(60deg) translateZ(800px);
}
.section div:nth-child(3) {
  /* 先旋转好了再 移动距离 */
  transform: rotateY(120deg) translateZ(800px);
}
.section div:nth-child(4) {
  /* 先旋转好了再 移动距离 */
  transform: rotateY(180deg) translateZ(800px);
}
.section div:nth-child(5) {
  /* 先旋转好了再 移动距离 */
  transform: rotateY(240deg) translateZ(800px);
}
.section div:nth-child(6) {
  /* 先旋转好了再 移动距离 */
  transform: rotateY(300deg) translateZ(800px);
}
.section div:nth-child(7)
{
  /* 先旋转好了再 移动距离 */
  transform: rotateY(360deg) translateZ(800px);
}
.section div:nth-child(8)
{
  /* 先旋转好了再 移动距离 */
  transform: rotateY(0deg) translateZ(800px);
}
.section div:nth-child(9)
{
  /* 先旋转好了再 移动距离 */
  transform: rotateY(60deg) translateZ(800px);
}
//用户气泡
.user_talk {
  opacity:0.9;
  display: block;
  position: absolute;
  float: left;
  //z-index: 5;
  left: 9%;
  top: 54%;
  width: 24%;
  height: 15%;
  background-color: #fff;
  border-radius: 50%;
}
//箭头
.jiantou2 {
  position: absolute;
  float: right;
  left: 7%;
  top: 31%;
  width: -12%;
  height: -14%;
  -webkit-transform: rotateZ(24deg);
  transform: rotateZ(294deg);
  border-width: 53px;
  border-style: solid;
  border-color: #FFf transparent transparent transparent;
}
//提醒气泡
.con2 {
  position: absolute;
  top: 100%;
  left: 509%;
  padding: 104px 11px 48px 0;
  transform: translate(-50%, -50%);
}
.line2 {
  border-right: 2px solid #000;
  font-size: 170%; /* 字体大小 */
  font-family: monospace; /* 等宽字体 */
  text-align: center; /* 文字横向居中 */
  white-space: nowrap; /* 文字不换行 */
  overflow: hidden; /* 多余的文字内容隐藏 */
  animation: borders 0.7s infinite normal,
  widths 1s steps(10); /* 步数 steps() */
}
//用户搜索按钮主体
.btn {
  position: absolute;
  left: 37%;
  top: 53%;
}
//用户搜索按钮
.el-button {
  background-color: #fff;
  color: #000;
}
//气泡
.dog_talk {
  opacity:0.9;
  position: absolute;
  float: left;
  z-index: 5;
  left: 26%;
  top: 0%;
  width: 28%;
  height: 20%;
  background-color: #fff;
  border-radius: 50%;
}
//气泡箭头
.jiantou1 {
  position: absolute;
  float: right;
  left: 4%;
  top: 33%;
  width: -12%;
  height: -14%;
  -webkit-transform: rotateZ(
    24deg);
  transform: rotateZ(
    284deg);
  border-width: 53px;
  border-style: solid;
  border-color: #FFf transparent transparent transparent;
}
.title2 {
  position: absolute;
  top: 8%;
  left: 12%;
  display: inline-block;
  float: left;
  font-family: 华光行书_CNKI;
  //background-color: #052e3f;
  border-radius: 12px;
  padding: 0 15px;
  //box-shadow: 10px 10px #000000;
  color: #000;
}

//输入框
.con1 {
  position: absolute;
  top: 100%;
  left: 526%;
  padding: 104px 11px 48px 0;
  transform: translate(-50%, -50%);
}
.line1 {
  border-right: 2px solid #000;
  font-size: 200%; /* 字体大小 */
  font-family: monospace; /* 等宽字体 */
  text-align: center; /* 文字横向居中 */
  white-space: nowrap; /* 文字不换行 */
  overflow: hidden; /* 多余的文字内容隐藏 */
  animation: borders 0.7s infinite normal,
  widths 2s steps(20); /* 步数 steps() */
}
.title1 {
  position: absolute;
  top: 8%;
  left: 12%;
  display: inline-block;
  float: left;
  font-family: 华光行书_CNKI;
  border-radius: 12px;
  padding: 0 15px;
  color: #000;
}

/* 边框闪烁动画 模拟指针闪烁 */
@keyframes broders {
  from {border-right-color: #000;}
  to {border-right-color: #fff;}
}
/* 容器宽的改变动画 */
@keyframes widths {
  from {width: 0;}
  to {width: 100%;} /* 也可以是固定宽 */
}

//搜索框
.el-input {
  width: 70%;
  position: absolute;
  top: 50%;
  left: 15%;
}
.input_2 {
  position: absolute;
  right: -32px;
  bottom: 42px;
  width: 21.5%;
  z-index: 99;
}
//音乐列表
.list_body {
  position: absolute;
  right: -35px;
  top: -110px;
  width: 36%;
  height: 500px;
  border-radius: 50px;
  //background-image: linear-gradient(
  //  97deg, #f7f7f9,#0a0d16);
  border-radius: 15%;
  padding: 10px 35px;
  box-sizing: border-box;
  //opacity:0.9
}
//音乐卡片
 .el-card {
   overflow: visible;

 }

//音乐列表标题
.list_title {
  text-align: center;
  line-height: 25px;
  font-size: 18px;
  //border: 1px solid red;
  height: 66px;
  font-weight: bold;
  text-align: center;
  color: #fff;
  background-image: linear-gradient(
    -5deg, #f7eef9, #041b32);
  //opacity: 0.9;
}
//音乐列表
.song_list {
  width: 438px;
  height: 487px ;
  //background-color: red;
  border-radius: 12px;
  //overflow: hidden;
  border: 1px solid #ccc;
  padding-left: 0;
  //background-color: red;
  //background-color: skyblue;
}
//列表文字
.list-title1 {
    margin-left: 75px;

}
.list-title2 {
  margin-left: 200px;

}
//歌曲小LI
.song_list li {
list-style: none;
  //background-color: red;
  padding: 35px 0 30px 0;
  position: relative;
  justify-content: left;
  text-align: center;
  //background-color: red;
  overflow: hidden;
  cursor: pointer;
}
.el-card__body .song_list li:hover {
  background-color: #DCDFE6;
}
.song_list li:nth-child(2n) {
  background-color: #F2F6FC;
}
.song_list li:nth-child(2n+1) {
  background-color: #EBEEF5;
}
.song_list li span:nth-child(1)  {
  position: absolute;
  top: 15px;
  left: 0px;
  height: 100px;
  //background-color: red;
  text-align: center;
  padding-top: 5px ;
  text-overflow: ellipsis;
  overflow: hidden;

  width: 180px;
}
.song_list li span:nth-child(2)  {
  padding-top: 5px ;
  width: 180px;
  text-align: center;
  height: 100px;
  top: 15px;
  //background-color: pink;
  position: absolute;
  right: 5px;
  text-overflow:ellipsis;
  overflow: hidden;

}
//主页列表
.home {
  float: left;
  position: absolute;
  right: 60px;
  top: 27px;
  width: 25px;
  height: 25px;
  border-radius: 30px;
  text-align: center;
  line-height: 25px;
  cursor: pointer;
}
.home img {
  width: 30px;
  height: 30px;
}
//返回列表
.turn {
  float: left;
  position: absolute;
  right: 60px;
  top: 27px;
  width: 25px;
  height: 25px;
  border-radius: 30px;
  text-align: center;
  line-height: 25px;
  cursor: pointer;
}
.turn img {
  width: 30px;
  height: 30px;
}
  //关闭搜索列表
  .close {
    float: left;
    position: absolute;
    right: 60px;
    top: 27px;
    width: 25px;
    height: 25px;
    border-radius: 30px;
    text-align: center;
    line-height: 25px;
    cursor: pointer;
  }
.close img {
  width: 30px;
  height: 30px;
}
  //打开搜索按钮
  //关闭搜索列表
.opn {
  float: left;
  position: absolute;
  right: -53px;
  top: -152px;
  border-width: 53px;
  border-style: solid;
  border-color: #fff transparent transparent transparent;
  -webkit-transform: rotate(-90deg);
  transform: rotate(225deg);
  border-radius: 30px;
  text-align: center;
  line-height: 25px;
  cursor: pointer;
  z-index: 99;

}
 .opn_list_title {
   cursor: pointer;
   position: absolute;
   right: -2px;
   top: -80px;
   z-index: 100;
   font-weight: 400;
   font-size: 10px;
   transform: rotateZ(44deg);
 }
 //用户信息按钮
 .opn_user_info {
   float: left;
   position: absolute;
   left: -53px;
   top: -152px;
   border-width: 53px;
   border-style: solid;
   border-color: #fff transparent transparent transparent;
   -webkit-transform: rotate(-90deg);
   transform: rotate(225deg);
   border-radius: 30px;
   text-align: center;
   line-height: 25px;
   cursor: pointer;
   z-index: 99;
 }
//audio
.audio_con {

  overflow: hidden;
  width: 100%;
  height: 50px;
  float: bottom;
  box-sizing: border-box;
  z-index: 10;
}
.myaudio {
  z-index: 10;
  position: absolute;
  bottom: 0;
  left: 98px;
  width: 62%;
  height: 94px;
  opacity: 0.9;
  border-radius: 0;
}

//跑马灯效果
.title {
  display: inline-block;
  text-align: center;
  line-height: 40px;
  position: absolute;
  top: 22px;
  left: 57px;
  background-image: -webkit-linear-gradient(left, #c5d7e7, #f47920 10%, #d71345 20%, #f7acbc 30%, #ffd400 40%, #3498db 50%, #f47920 60%, #d71345 70%, #f7acbc 80%, #ffd400 90%, #3498db);
  color: transparent;
  -webkit-background-clip: text;
  background-size: 200% 100%;
  -webkit-animation: slide 2s infinite linear;
  animation: slide 3s infinite linear;
  font-size: 25px;
}

@keyframes slide {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -100% 0;
  }
}
 //歌曲第三标题
  .three_title {
    display: inline-block;
    text-align: center;
    line-height: 40px;
    position: absolute;
    top: 25px;
    left: 165px;
    background-image: -webkit-linear-gradient(left, #c5d7e7, #f47920 10%, #d71345 20%, #f7acbc 30%, #ffd400 40%, #3498db 50%, #f47920 60%, #d71345 70%, #f7acbc 80%, #ffd400 90%, #3498db);
    color: transparent;
    -webkit-background-clip: text;
    background-size: 200% 100%;
    -webkit-animation: slide 2s infinite linear;
    animation: slide 5s infinite linear ;
    font-size: 25px;
  }

  //评论容器
 .comment_body  {
   position: absolute;
   background-image: linear-gradient(-5deg,#f7eef9,#b5cde1);
   opacity: 0.7;
   bottom: 89px;
   left: 12px;
   width: 67%;
   padding: 0;
   height: 60px;
   overflow: hidden;
   border-radius: 10px;
   z-index: 10;
 }
 //评论移动体
 .comment_move_body {
   //background-color: skyblue;
   animation:move 180s linear infinite normal ;
   animation-delay:2s;
   position: absolute;
   top: 0;
   width: 100%;
   z-index: 10;
 }
//评论滚动动画
@keyframes move {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-100%);
  }
}
  //commentedDemo
   .cmt_demo {
     position: relative;
     display: inline-block;
     height: 70px;
     width: 100%;
     overflow: hidden;
     z-index: 10;
   }

 //评论者头像
.comment_avater {
  display: inline-block;
  position: absolute;
  top: 2px;
  z-index: 10;
}
 //评论者名字
  .comment_name {
    display: inline-block;
    position: absolute;
    left: 55px;
    z-index: 10;
  }
  //评论
  .commented {
    display: inline-block;
    position: absolute;
    left: 55px;
    top: 24px;
    z-index: 10;
  }
  //歌曲信息
 .music_detail {
   z-index: 10;
   position: absolute;
   bottom: 58px;
   left: 102px;
   float: left;
   background-image: linear-gradient(-5deg,#f7eef9,#b5cde1);
   height: 25px;
   width: 61%;
   border-radius: 5px;
   opacity: 0.8;
   -webkit-box-align: center;
   -ms-flex-align: center;
   align-items: center;
   -webkit-box-pack: center;
   -ms-flex-pack: center;
   justify-content: center;
 }

//歌曲名称
  .music_name {
    //background-color: pink;
    position: absolute;
    bottom: 0px;
    left: 3%;
    font-family: 华光行书_CNKI;
    font-size: 15px;
    z-index: 10;
  }
  .music_author {
    //background-color: skyblue;
    position: absolute;
    bottom: 0px;
    left: 50%;
    font-family: 华光行书_CNKI;
    font-size: 15px;
    margin-left: 12%;
    z-index: 10;
  }
  //MV媒体
  .mv_media {
    position: relative;
    background-color: #030303;
    width: 100%;
    height: 100%;
    //opacity: 0.9;
    z-index: 1000;
  }
  .mv_video {
    position: absolute;
    top: 8px;
    left: 22.5%;
    z-index: 1100;

  }
  //歌曲头像
  .musicAvatar {
    position: absolute;
    bottom: 55px;
    left: 16px;
    bottom: 0;
    z-index: 10;
  }
  //mv播放按钮
  .musicAvatar:hover .mv_button{
    background-color: #030303;
    opacity: 0.7;
    width: 80px;
    height: 80px;
    position: absolute;
    top: 0px;
    left: 0px;
    box-sizing: border-box;
    background-image: url(../assets/play_mv.png);
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
  }
  //播放器控件
  .playContrl {
    position: absolute;
    right: 254px;
    bottom: -6px;
    height: 50px;
    padding: 0;
    margin: 0;
    //border: 1px solid red;
    z-index: 100;
  }
  .playbtn {
   display: inline-block;
    width: 38px;
    height: 42px;
    z-index: 100;
    cursor: pointer;
    margin-left: 15px;
  }
  .playbtn img {
    width: 42px;
  }
  .prebtn {
    display: inline-block;
    width: 38px;
    height: 42px;
    z-index: 100;
    cursor: pointer;
    margin-left: 15px;
  }
  .prebtn img {
    width: 38px;
  }
  .nextbtn {
    display: inline-block;
    width:38px;
    height: 42px;
    z-index: 100;
    cursor: pointer;
    margin-left: 20px;
  }
  .nextbtn img {
    width: 38px;
  }
  //歌词板块
  .lyricBox{
    width: 68.6%;
    height: 100%;
    background-color: #000;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0.88;
  }
  .myLyric {
    text-align: center;
  }
//歌词按钮
 .songLyric {
   position: absolute;
   top: 11px;
   left: -14px;
   cursor: pointer;
 }
.songLyric:hover {
  color: #a1dcbb;
}
//单曲循环
 .songCycle{
   position: absolute;
   top: 11px;
   left: -40px;
   cursor: pointer;
 }
.songCycle:hover{
  color: #a1dcbb;
}
</style>
