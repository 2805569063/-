<template>
	<view class="index">
		<musicHead title='云音乐' :icon='false'></musicHead>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="index-search" @tap="handleToSearch">
					<text class="iconfont icon-Magnifier"></text>
					<input type="text" placeholder="搜索歌曲" />
				</view>
				<view v-if="isLoading">
				<m-for-skeleton :avatarSize="200" :row="3" :loading="isLoading" isarc="square"
					v-for="(item,key) in 4" :key="key" :titleStyle="{}">
				</m-for-skeleton>	
				</view>
				<view class="index-list" v-else>
					<!-- <view class="index-list-item">
						<view class="index-list-img">
							<image src="../../static/logo.png" mode=""></image>
							<text>每天更新</text>
						</view>
						<view class="index-list-text">
							<view>1.与我无关 - 阿哟</view>
							<view>1.与我无关 - 阿哟</view>
							<view>1.与我无关 - 阿哟</view>
						</view>
					</view> -->
					<view class="index-list-item" v-for="(item,index) in topList" :key="index"
						@tap="handleToList(item.id)">
						<view class="index-list-img">
							<image :src="item.coverImgUrl" mode=""></image>
							<text>{{item.updateFrequency}}</text>
						</view>
						<view class="index-list-text">
							<view v-for="(item,index) in item.tracks" :key="index">{{index+1}}.{{item.first}} -
								{{item.second}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	//引入iconfont样式
	import '@/common/iconfont.css'
	//引入头部
	import musicHead from '../../components/musichead/musichead.vue'
	//榜单数据接口
	import {
		topList
	} from '../../common/api.js'
	//骨架屏
	import mForSkeleton from "@/components/m-for-skeleton/m-for-skeleton.vue"
	export default {
		components: {
			musicHead,
			mForSkeleton
		},
		data() {
			return {
				topList: [],
				isLoading:true,
			}
		},
		//页面加载完毕触发
		onLoad() {
			topList().then((res) => {
				console.log(res);
				if (res.length) {
					this.topList = res;
					this.isLoading=false;
				}
			}).catch(err => {
				console.log('err', err);
			})
		},
		methods: {
			handleToList(listId) {
				uni.navigateTo({
					url: '/pages/list/list?listId=' + listId,
				});
			},
			handleToSearch() {
				uni.navigateTo({
					url: '/pages/search/search',
				})
			}
		}
	}
</script>

<style scoped>
	.index {}

	.index-search {
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		background: #f7f7f7;
		border-radius: 50rpx;
	}

	.index-search text {
		font-size: 26rpx;
		margin-left: 28rpx;
		margin-right: 26rpx;
	}

	.index-search input {
		font-size: 28rpx;
		flex: 1;
	}

	.index-list {
		margin: 0 30rpx;
	}

	.index-list-item {
		display: flex;
		margin-bottom: 34rpx;
	}

	.index-list-img {
		width: 212rpx;
		height: 212rpx;
		position: relative;
		border-radius: 30rpx;
		overflow: hidden;
		margin-right: 22rpx;
	}

	.index-list-img image {
		width: 100%;
		height: 100%;
	}

	.index-list-img text {
		position: absolute;
		left: 12rpx;
		bottom: 16rpx;
		color: white;
		font-size: 20rpx;
	}

	.index-list-text {
		width: 450rpx;
		font-size: 24rpx;
		line-height: 66rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>
