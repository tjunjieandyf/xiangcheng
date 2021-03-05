/*
 *scrollup插件必须导入fontawesome/css/font-awesome.min.css样式文件
 *用<div>、<span>或者<a>标签加class="scrollup"装载
 */
jQuery(function($){
	var scrollUp = $(".scrollup");
	scrollUp.prepend("<i class='fa fa-angle-double-up'></i>");
	scrollUp.on("click",function(){
		var c = Math.min(400, Math.max(100, parseInt($("html").scrollTop() / 3)));
		$("html,body").animate({scrollTop:0}, c);
	});
	$(window).scroll(function(){
		var viewH =parseInt($(this).height());//可见高度  
           var contentH =parseInt($(this.document).height());//内容高度  
           var scrollTop =parseInt($(this).scrollTop());//滚动高度
           //if(contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容,若需要调整按钮显示时机,修改数字即可
           if(scrollTop>0){//当滚动条不在最初位置
           	scrollUp.css("display","inline-block");
           }else{
           	scrollUp.css("display","none");
           }
	});
});