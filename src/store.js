import Vue from 'vue'
import Vuex from 'vuex'
import fa from "element-ui/src/locale/lang/fa";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user_name:'',
    user_avatar:'',
    user_day:'',
    user_up:'',
    user_time:'',
    user_info_active:false,
    user_id:'',
    //喜欢列表id
    user_love_id:'',
    //喜欢列表详情
    user_love_list:[],
    //音乐列表标题
    music_list_title:"今日热曲放送",
    //栈存储音乐列表
    music_temporary:[],
    //列表home指针
    homeIsactive:false,
    //列表turn指针
    turnIsactive:false,
    //存储列表所有歌曲id
    playAll_music_id:'',
    //存储列表所有歌曲的url
    playALL_music_url:[],
    //存储列表音乐id指针
    playAll_music_index_1:'',
    playAll_music_index_2:''
  },
  mutations:{

  }
})
