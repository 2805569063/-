<template>
	<view class="detail">
		<view class="fixbg" :style="{'backgroundImage' : 'url('+songDetail.al.picUrl+')'}"></view>
		<musicHead :title='songDetail.name' :icon='true' color='white'></musicHead>
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true">
				<view class="detail-play">
					<image :src="songDetail.al.picUrl" :class="{'detail-play-run' : isPlayRotate }" mode=""></image>
					<text class="iconfont" :class="iconPlay" @tap="handleToPlay"></text>
					<view></view>
				</view>
				<view class="detail-lyric">
					<view class="detail-lyric-wrap" :style="{'transform': 'translateY('+-(lyricIndex-1)*82+'rpx)'}">
						<view class="detail-lyric-item" :class="{active:lyricIndex == index}" v-for="(item,index) in songLyric" :key="index">{{item.lyric}}</view>
					</view>
				</view>
				<!-- 此处还有一个分享 可以自己做 前面已有 -->
				<view class="detail-like">
					<view class="detail-like-head">喜欢这首歌的人也听</view>
					<!-- <view class="detail-like-item">
						<view class="detail-like-img">
							<image src="../../static/logo.png" mode=""></image>
						</view>
						<view class="detail-like-song">
							<view>蓝</view>
							<view>
								<image src="../../static/独家验证-01.png" mode=""></image>
								<image src="../../static/24gf-rectangle.png" mode=""></image>
							    石白其 - 蓝
							</view>
						</view>
						<text class="iconfont icon-bofang"></text>
					</view> -->
					<view class="detail-like-item" v-for="(item,index) in songSimi" :key="index" @tap="handleToSimi(item.id)">
						<view class="detail-like-img">
							<image :src="item.album.picUrl" mode=""></image>
						</view>
						<view class="detail-like-song">
							<view>{{item.name}}</view>
							<view>
								<image v-if="item.privilege.flag>60&&item.privilege.flag<70" src="../../static/独家验证-01.png" mode=""></image>
								<image v-if="item.privilege.maxbr==999000" src="../../static/24gf-rectangle.png" mode=""></image>
							    {{item.artists[0].name}} - {{item.name}}
							</view>
						</view>
						<text class="iconfont icon-bofang"></text>
					</view>
				</view>
				<view class="detail-comment">
					<view class="detail-comment-head">精彩评论</view>
					<!-- <view class="detail-comment-item">
						<view class="detail-comment-img">
							<image src="../../static/logo.png" mode=""></image>
						</view>
						<view class="detail-comment-content">
							<view class="detail-comment-title">
								<view class="detail-comment-name">
									<view>是阿冗的冗</view>
									<view>2020年1月6日</view>
								</view>
								<view class="detail-comment-like">56027 <text class="iconfont icon-dianzan"></text></view>
							</view>
							<view class="detail-comment-text">案发生发射点发生反射看见那块每次看麻烦</view>
						</view>
					</view> -->
					<view class="detail-comment-item" v-for="(item,index) in songComment" :key="index">
						<view class="detail-comment-img">
							<image :src="item.user.avatarUrl" mode=""></image>
						</view>
						<view class="detail-comment-content">
							<view class="detail-comment-title">
								<view class="detail-comment-name">
									<view>{{item.user.nickname}}</view>
									<view>{{item.time | formatTime}}</view>
								</view>
								<view class="detail-comment-like">{{item.likedCount | formatCount}}<text class="iconfont icon-dianzan"></text></view>
							</view>
							<view class="detail-comment-text">{{item.content}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import musicHead from '../../components/musichead/musichead.vue'
	import {songDetail,songSimi,songComment,songLyric,songUrl} from '../../common/api.js'
	export default {
		data() {
			return {
				songDetail:{
					al:{
						picUrl:'',
					},
				},
				songSimi:[],
				songComment : [],
				songLyric:[],
				//控制歌词高亮（即当前歌词播放的位置）
				lyricIndex:0,
				//用图片控制暂停与播放
				iconPlay:'icon-zanting',
				//胶片是否旋转
				isPlayRotate:true,
				isLoading:true,
			}
		},
		components:{
			musicHead,
		},
		onLoad(options) {
			// console.log(options.songId);
			this.getMusic(options.songId);
		},
		onUnload() {
			this.cancelLyricIndex();
			// #ifdef H5
			this.bgAudioManager.destroy();
			// #endif
		},
		onHide() {
			this.cancelLyricIndex();
			// #ifdef H5
			this.bgAudioManager.destroy();
			// #endif
		},
		methods: {
			getMusic(songId){
				uni.showLoading({
					title:'加载中...'
				});
				//预备下一首的id
				this.$store.commit('NEXT_ID',songId);
				this.isLoading = true;
				Promise.all([songDetail(songId),songSimi(songId),songComment(songId),songLyric(songId),songUrl(songId)]).then(res=>{
					console.log(res);
					if(res[0][1].data.code==200){
						this.songDetail=res[0][1].data.songs[0];
					}
					if(res[1][1].data.code==200){
						this.songSimi=res[1][1].data.songs;
					}
					if(res[2][1].data.code==200){
						this.songComment=res[2][1].data.hotComments;
					}
					if(res[3][1].data.code==200){
						let lyric = res[3][1].data.lrc.lyric;
						// console.log(lyric);
						//拆解歌词  正则表达式
						let re =/\[([^\]]+)\]([^\[]+)/g;
						// console.log(lyric.match(re));
						let result=[];
						lyric.replace(re,($0,$1,$2)=>{
							result.push({"time":this.formatTimeToSec($1),"lyric":$2});
						})
						this.songLyric=result;
						console.log(this.songLyric);
					}
					if(res[4][1].data.code==200){
						
						// #ifdef MP-WEIXIN
						this.bgAudioManager = uni.getBackgroundAudioManager();
						// console.log(this.bgAudioManager);
						this.bgAudioManager.title = this.songDetail.name;
						this.bgAudioManager.singer = this.songDetail.ar[0].name;
						// console.log(this.songDetail.ar[0].name);
						// #endif
						
						// #ifdef H5
						if(!this.bgAudioManager){
							this.bgAudioManager = uni.createInnerAudioContext();
						}
						this.iconPlay='icon-bofang1';
						this.isPlayRotate=false;
						// #endif
						
						this.bgAudioManager.src = res[4][1].data.data[0].url || '';
						this.listenLyricIndex();
						//音乐播放事件
						this.bgAudioManager.onPlay(()=>{
							this.iconPlay='icon-zanting';
							this.isPlayRotate=true;
							this.listenLyricIndex();
						});
						//音乐暂停事件
						this.bgAudioManager.onPause(()=>{
							this.iconPlay='icon-bofang1';
							this.isPlayRotate=false;
							this.cancelLyricIndex();
						});
						this.bgAudioManager.onEnded(()=>{
							this.getMusic(this.$store.state.nextId);
						})
					}
					this.isLoading=false;
					uni.hideLoading();
				});
			},
			//处理歌词时间
			formatTimeToSec(value){
				let arr=value.split(':')
				// return parseFloat(arr[0]*60)+parseFloat(arr[1]*1).toFixed(1);
				return (Number(arr[0]*60)+Number(arr[1])).toFixed(1)*1;
			},
			//点击触发播放与暂停
			handleToPlay(){
				// console.log('@@');
				if(this.bgAudioManager.paused){
					this.bgAudioManager.play();
				}else{
					this.bgAudioManager.pause();
				}
			},
			//歌词滚动实现 （底层为定时器监听）
			listenLyricIndex(){
				clearInterval(this.timer);
				this.timer = setInterval(()=>{
					//遍历歌词 寻找当前时间对应的歌词
					for(var i=0;i<this.songLyric.length;i++){
						if(this.bgAudioManager.currentTime>this.songLyric[this.songLyric.length-1].time){
							console.log('@');
							this.lyricIndex=songLyric.length-1;
							break;
						}
						if(this.bgAudioManager.currentTime>this.songLyric[i].time && this.bgAudioManager.currentTime<this.songLyric[i+1].time){
							this.lyricIndex=i;
						}
						// console.log(this.lyricIndex);
					}
				},500);
			},
			//关闭定时器
			cancelLyricIndex(){
				clearInterval(this.timer);
			},
			//相似歌曲点击刷新当前页面歌曲
			handleToSimi(songId){
				this.getMusic(songId);
			}
		}
	}
</script>

<style scoped>
  .detail-play{width: 580rpx;height: 580rpx;background: url(~@/static/disc.png);background-size: cover;margin: 214rpx auto 0 auto;position: relative;}
  .detail-play image{width: 370rpx;height: 370rpx;border-radius: 50%;position: absolute;left: 0;top: 0;right: 0;bottom: 0;margin: auto;animation:10s linear move infinite; animation-play-state:paused;}
  .detail-play .detail-play-run{animation-play-state: running;}
  @keyframes move {
  	from{transform: rotate(0deg);}
	to{transform: rotate(360deg);}
  }
  .detail-play text{width: 100rpx;height: 100rpx;font-size: 100rpx;color: white;position: absolute;left: 0;top: 0;right: 0;bottom: 0;margin: auto;}
  .detail-play view{width: 250rpx;height: 360rpx;background: url(~@/static/needle.png);position: absolute;left: 100rpx;right: 0;margin: auto;background-size: cover;top: -200rpx;}
  
  .detail-lyric{font-size: 32rpx;line-height: 82rpx;height: 246rpx;text-align: center;overflow: hidden;color: #919191;}
  .detail-lyric-wrap{transition: 0.5s;}
  .detail-lyric-item{height: 82rpx;}
  .detail-lyric-item.active{color: white;}
  
  .detail-like{margin: 0 30rpx;}
  .detail-like-head{font-size: 36rpx;color: white;margin: 50rpx 0;}
  .detail-like-item{display: flex;align-items: center;margin-bottom: 28rpx;}
  .detail-like-img{width: 82rpx;height: 82rpx;border-radius: 20rpx;overflow: hidden;margin-right: 20rpx;}
  .detail-like-img image{width: 100%;height: 100%;}
  .detail-like-song{flex: 1;color: #c6c2bf;}
  .detail-like-song view:nth-child(1){font-size: 28rpx;color: white;margin-bottom: 12rpx;}
  .detail-like-song view:nth-child(2){font-size: 22rpx;}
  .detail-like-song image{width: 26rpx;height: 20rpx;margin-right: 10rpx;}
  .detail-like-item text{font-size: 50rpx;color: #c6c2bf;}
  
  .detail-comment{margin: 0 30rpx;}
  .detail-comment-head{font-size: 36rpx;color: white;margin: 50rpx 0;}
  .detail-comment-item{margin-bottom: 28rpx;display: flex;}
  .detail-comment-img{width: 64rpx;height: 64rpx;border-radius: 50%;overflow: hidden;margin-right: 18rpx;}
  .detail-comment-img image{width: 100%;height: 100%;}
  .detail-comment-content{flex: 1;color: #cbcacf;}
  .detail-comment-title{display: flex;justify-content: space-between;}
  .detail-comment-name{}
  .detail-comment-name view:nth-child(1){font-size: 26rpx;color: white;}
  .detail-comment-name view:nth-child(2){font-size: 20rpx;}
  .detail-comment-like{font-size: 28rpx;}
  .detail-comment-text{font-size: 28rpx;line-height: 40rpx;color: white;margin-top: 20rpx;border-bottom: 1px solid #e0e0e0;padding-bottom: 40rpx;}
</style>
