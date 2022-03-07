import request from '../router/request';

//手机号登录
function phoneLogin(data) {
  return request({
    url: '/login/cellphone',
    method: 'get',
    data: data
  })
}
//用户退出
function userQuit (data){
  return request({
    url:'/logout',
    method:"get",
    data:data
  })
}

//歌曲搜索
function searchMusic(data) {
  return request({
    url:'/cloudsearch',
    method:'get',
    data:data
  })
}

//歌曲播放
function musicPlay (data) {
  return request({
    url:'/song/url',
    method:'get',
    data:data
  })
}

//获取热门歌曲
function hotMusic(data){
  return request({
    url:'/recommend/songs',
    method:'get',
    data:data
  })
}

//获取歌曲评论
function hotComment(data){
  return request({
    url:'/comment/music',
    method:'get',
    data:data
  })
}
//获取用户详情
  function user_info(data){
  return request({
    url:'/user/level',
    method:'get',
    data:data
  })
  }
  //获取歌曲详情(获取mvId)
  function music_detail(data){
  return request({
    url:'/song/detail',
    method:'get',
    data:data
  })
  }
  //获取歌曲MV播放地址
  function music_Mv(data){
   return request({
     url:'/mv/url',
     method:'get',
     data:data
   })
  }
//获取用户喜欢列表
function user_love(data){
  return request({
    url:'/likelist',
    method:'get',
    data:data
  })
}
//获取最近播放列表
function recent_music(data){
  return request({
    url:'/record/recent/song',
    method:'get',
    data:data
  })
}
//添加音乐到喜欢列表
function addLove_music(data){
  return request({
    url:'/like',
    method:'get',
    data:data
  })
}
//获取歌词
function songLyric (data){
  return request({
    url:'/lyric',
    method:'get',
    data:data
  })
}
export {
  phoneLogin,
  userQuit,
  searchMusic,
  musicPlay,
  hotMusic,
  hotComment,
  user_info,
  music_detail,
  music_Mv,
  user_love,
  recent_music,
  addLove_music,
  songLyric
}
