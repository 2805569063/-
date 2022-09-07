<script>
	export default {
		onLaunch: function() {
			
		},
		onShow: function() {
			
		},
		onHide: function() {
			
		}
	}
</script>

<style>
	/*每个页面公共css */
	.container{
		width: 100%;
		height: calc(100vh - 70px);
		overflow: hidden;
	}
	.container scroll-view{
		height: 100%;
	}
	.fixbg{
		width: 100%;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		background-image: url(static/logo.png);
		background-size: cover;
		background-position: center 0;
		/* 毛玻璃模糊效果 */
		 filter: blur(20px);
		 /* 不让用户看到白边 缩放*/
         transform: scale(1.2);		 
	}
</style>
