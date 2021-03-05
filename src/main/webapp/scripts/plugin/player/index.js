/******************************************************************************
* Copyright (C) 2018 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/
/**
 * @desc 视频与音频的播放器，图片显示
 * @author Caijw
 */
//引入对应插件
var http  = ctx + "/scripts/plugin/";
//var http = Common.webRoot();
(function() {
	var jsArray = [
		http + "player/viewer/js/viewer.js"
		//http + "/resources/plugin/uploadFile/review.init.js",
		//http + "/resources/plugin/player/viewer/js/viewer.js"
	];
	var oHead = document.getElementsByTagName('HEAD').item(0);
	for(var i = 0; i < jsArray.length; i++) {
		document.write('<script src="' + jsArray[i] + '" type="text/javascript" charset="utf-8"></script>');
	}
	//var cssURL = http + "/resources/plugin/player/viewer/css/viewer.css",
	var cssURL = http + "player/viewer/css/viewer.css",
    linkTag = $('<link href="' + cssURL + '" rel="stylesheet" type="text/css" />');
	// 请看清楚，是动态将link标签添加到head里   
	$($('head')[0]).append(linkTag);
})()
;(function($){  
    $.extend({  
    	// url：视频地址  poster视频未播放的时候的图片， title：播放视频名称
        playVideo : function(url, poster, title){ 
        	if(!title){ title = '视频播放'}
        	if(!poster){ poster = 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=='}
        	layer.open({
    		  type: 1,
    		  closeBtn: 1,
    		  shadeClose: true,
    		  title: title,
    		  area: ['732px', '461px'],
    		  content: '<video style="background:black" playsinline preload="auto" autoplay="autoplay" id="v" src="'+url+'" controls="controls" width="730" height="414" poster="'+poster+'"></video>',
    		  success: function(layero){
    			  // hack处理layer层中video播放器全屏样式错乱问题
    			  setTimeout(function() {
    				  $(layero).removeClass('layer-anim');
    			  }, 0);
    		  }
    		});
        }, 
        // url：音频地址
        playAudio : function(url, title){ 
        	var isEdge = this.isIE();
        	if(!title){ title = '音频播放'}
        	if(isEdge){
        		layer.open({
        		  type: 1,
        		  title: title,
        		  closeBtn: 1,
        		  shadeClose: true,
        		  area: ['550px', '125px'],
        		  content: '<audio src="'+url+'" controls="controls">',
        		});
        	}else{
        		layer.open({
          		  type: 1,
          		  title: title,
          		  closeBtn: 1,
          		  shadeClose: true,
          		  area: ['310px', '88px'],
          		  content: '<audio src="'+url+'" controls="controls">',
          		});
        	}
        	
        },
        //显示图片
        showImage : function(url){
        	$('#imgWin').remove();
        	$(document.body).prepend($('<ul class="images" id="imgWin" style="display:none;"><img data-original="http://pic1.sc.chinaz.com/files/pic/pic9/201802/bpic5759.jpg" src="http://pic1.sc.chinaz.com/files/pic/pic9/201802/bpic5759.jpg" alt="Cuo Na Lake"></ul> '))
        	setTimeout(function() {
			  $('.layui-layer').removeClass('layer-anim');
        	}, 0);
        	$('#imgWin img').attr('src', url);
		    $('#imgWin img').attr('data-original', url);
			 $("#imgWin").viewer({
	             shown: function () {
	                 $("#imgWin").viewer('view',1);
	             }
	         });
	         $("#imgWin").viewer('show');
        },
        //显示多张图片
        showMoreImage:function(json,index){
        	//var imgUrl = "http://172.16.30.9/vdir/easSy"//删除	
        	$('#imgWin').remove();
        	$(document.body).prepend($('<ul class="images" id="imgWin" style="display:none;"></ul> '));
        	var li = '';
        	for(var i=0;i<json.length;i++){
        		//li += '<li><img data-original="'+imgUrl+json[i].MLSY+'" src="'+imgUrl+json[i].MLSY+'" alt="Cuo Na Lake"></li>';//测试
        		li += '<li><img data-original="'+json[i].fileUrl+'" src="'+json[i].fileUrl+'" alt="Cuo Na Lake"></li>';
        	}	
        	$("#imgWin").append(li);		
        	setTimeout(function() {
			  $('.layui-layer').removeClass('layer-anim');
        	}, 0);
			 $("#imgWin").viewer({
	             shown: function () {
	                 $("#imgWin").viewer('view',index);
	             }
	         });
	         $("#imgWin").viewer('show');
        },
        isIE : function() { //ie?
        	if (!!window.ActiveXObject || "ActiveXObject" in window)
	    	  return true;
	    	  else
	    	  return false;
    	 }
    });  
})(jQuery);  