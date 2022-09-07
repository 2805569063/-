import {
	baseUrl
} from '@/common/config.js'

export function topList() {
	return new Promise(function(reslove, reject) {
		//首页榜单接口
		uni.request({
			url: `${baseUrl}/toplist/detail`,
			method: 'GET',
			success: res => {
				// console.log('res',res);
				let result = res.data.list;
				//处理数据 为了快 只要前四个
				result.length = 4;
				// console.log(result);
				//扔出数据
				reslove(result);
			},
			fail:()=> {},
			complete: () => {},
		});
	});
}

export function list(listId){
	return uni.request({
		url:`${baseUrl}/playlist/detail?id=${listId}`,
		method:'GET',
	})
}
//详情页面的数据接口
//歌曲详情接口 url:/song/detail参数：ids
export function songDetail(songId){
	return uni.request({
		url:`${baseUrl}/song/detail?ids=${songId}`,
		method:'GET',
	})
}
//相似音乐 url:/simi/song 参数：id
export function songSimi(songId){
	return uni.request({
		url:`${baseUrl}/simi/song?id=${songId}`,
		method:'GET',
	})
}
//获取音乐评论： url:/comment/music 参数：id（必选）limit(可选)
export function songComment(songId){
	return uni.request({
		url:`${baseUrl}/comment/music?id=${songId}`,
		method:'GET',
	})
}
//获取歌词 url:/lyric 参数：id
export function songLyric(songId){
	return uni.request({
		url:`${baseUrl}/lyric?id=${songId}`,
		method:'GET',
	})
}
//获取音乐url  url:/song/url 参数：id
export function songUrl(songId){
	return uni.request({
		url:`${baseUrl}/song/url?id=${songId}`,
		method:'GET',
	})
}

//搜索页面接口
//热搜列表 接口地址 : /search/hot/detail
export function searchHot() {
	return uni.request({
		url:`${baseUrl}/search/hot/detail`,
		method:'GET'
	})
}
//搜索 接口地址 : /search 或者 /cloudsearch(更全) 必选参数 : keywords : 关键词
export function searchWord(word) {
	return uni.request({
		url:`${baseUrl}/search?keywords=${word}`,
		method:'GET'
	})
}
//搜索建议 接口地址 : /search/suggest 必选参数 : keywords : 关键词 可选参数 : type : 如果传 'mobile' 则返回移动端数据
export function searchSuggest(word) {
	return uni.request({
		url:`${baseUrl}/search/suggest?keywords=${word}&type=mobile`,
		method:'GET'
	})
}