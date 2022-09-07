import App from './App'
import Vue from 'vue'
import store from '@/store/index.js'

// #ifndef VUE3
Vue.config.productionTip = false

App.mpType = 'app'

//处理数字的过滤器
Vue.filter('formatCount',function(value){
	if(value>=10000 && value<=100000000){
		value /= 10000;
		//保留一位小数
		return value.toFixed(1)+'万';
	}else if(value>100000000){
		value /= 100000000;
		return value.toFixed(1)+'亿';
	}else{
		return value;
	}
})
//处理时间戳的过滤器
Vue.filter('formatTime',function(value){
	var date = new Date(value);
	return date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日';
})
const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif