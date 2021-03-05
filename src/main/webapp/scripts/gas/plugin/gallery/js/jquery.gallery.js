/**
* jquery相册图片浏览插件
* @module $.gallery
*/

(function($){
	/**
	 * jquery相册图片浏览插件
	 * @constructor $.gallery
	 * @class $.gallery
	 * @param {Object} options 渲染参数
	 * @param {Object} param 预留参数
	 * @return {object}
	 * @example 
		 $("#main").gallery({
			//图片数据对象 
			properties:[{picUrl:'scripts/plugin/gallery/images/thumbs/1.jpg',picInfo:'test1'}],
			// 相册名称
			galleryName:'测试',
			// 图片名称
			picName:'请选择照片',
			//如果为true 则将iviewer插件引入，需要加载 jqeury.iviewer.js等相关信息，同时后面的width和height属性将无效
			isIviwer:true,
			//图片放映宽度 如果isIviwer = ture 则无效
			//picWidth:800,
			//图片放映高度 如果isIviwer = ture 则无效
			//picHeight:500
		});
	 */
	$.fn.gallery = function(optinos,param){
		return createGallery(this,optinos);
	}
	
	function createGallery(jq,optinos){
		var params = $.extend({},$.fn.gallery.defaults, optinos);
		$.fn.gallery.methods.createGallery(jq,params);
	}
	
	$.fn.gallery.defaults = $.extend({},{
		/**
		*图片数据对象 [{picUrl:'scripts/plugin/gallery/images/thumbs/1.jpg',picInfo:'test1'},...]
		*@property properties
		*@type Object
		*@default ''
		*/
		properties:'',
		/**
		*图片名称
		*@property picName
		*@type String
		*@default '请选择照片'
		*/
		picName:'请选择照片',
		/**
		*相册名称
		*@property galleryName
		*@type String
		*@default '图册'
		*/
		galleryName:'图册',
		/**
		*相册名称
		*@property isIviwer
		*@type Boolean
		*@default true
		*/
		isIviwer:true,
		/**
		*图片放映宽度，即图片的可视宽度，为0时，为自适应
		*@property picWidth
		*@type Number
		*@default 0
		*/
		picWidth:0,
		/**
		*图片放映高度，即图片的可视高度，为0时，为自适应
		*@property picHeight
		*@type Number
		*@default 0
		*/
		picHeight:0
	})
	
	//相册div
	var $fp_gallery = '#fp_gallery'; 
	//相册打开/关闭div
	var $btn_thumbs = '#fp_thumbtoggle';
	//加载图片过渡
	var $loader = '#fp_loading';
	//下一图片导航键
	var $btn_next = '#fp_next';
	//前一图片导航键
	var $btn_prev = '#fp_prev';
	//相册图片存放div
	var $thumbScroller = '#thumbScroller';
	var current	= -1;
	
	$.fn.gallery.methods = {
		
		createGallery:function(jq,params){
			$.fn.gallery.methods.createPhotoFrame(jq,params);
			//current thumb's index being viewed
			//图片的个数
			var nmb_thumbs = $($thumbScroller).find('.focus_content').length;
			var cnt_thumbs = 0;
			for(var i=0;i<nmb_thumbs;++i){
				var $thumb = $($thumbScroller).find('.focus_content:nth-child('+parseInt(i+1)+')');
				$('<img/>').load(function(){
					++cnt_thumbs;
					if(cnt_thumbs == nmb_thumbs){
						$.fn.gallery.methods.showThumbs(2000);
					} 
				}).attr('src',$thumb.find('img').attr('src'));
			}
			//make the document scrollable
			//when the the mouse is moved up/down
			//the user will be able to see the full image
			//makeScrollable();
			$($thumbScroller).find('.focus_content').bind('click',function(){
				var $content = $(this);
				var $elem = $content.find('img');
				current = $content.index()+1;
				var pos_left = $elem.offset().left;
				var pos_top = $elem.offset().top;
				var $clone = $elem.clone()
							.addClass('clone')
							.css({'position':'fixed',
								'left': pos_left + 'px',
								'top': pos_top + 'px'	
							}).insertAfter($(jq));
				var jqW = $(jq).width() == 0 ? $(window).width():$(jq).width() ;
				var jqH = $(jq).height() == 0 ? $(window).height():$(jq).height();
				$clone.stop()
				.animate({
						'left': jqW/2 + 'px',
						'top': jqH/2 + 'px',
						'margin-left' :-$clone.width()/2 -5 + 'px',
						'margin-top': -$clone.height()/2 -5 + 'px'
					},500,
					function(){
						var $theClone = $(this);
						var ratio = $clone.width()/120;
						var final_w = 400*ratio;
						$($loader).show();
						//expand clone
						$theClone.animate({
							'opacity' : 0,
							'top' : jqH/2 + 'px',
							'left' : jqW/2 + 'px',
							'margin-top' : '-200px',
							'margin-left' : -final_w/2 + 'px',
							'width' : final_w + 'px',
							'height' : '400px'
						},1000,function(){$(this).remove();});
						if(params.isIviwer){
							$($loader).hide();
							var bodyW = $(window).width();
							var bodyH = $(window).height(); 
							$($fp_gallery).width(bodyW);
							$($fp_gallery).height(bodyH);
							$($fp_gallery).iviewer({src:$elem.attr('alt')})
							if(power.isNotEmpty($('#fp_gallery img:first'))){
								$($fp_gallery).iviewer('loadImage',$elem.attr('alt'));
							}
						}else{
							$('<img class="fp_preview"/>').load(function(){
								var $newimg = $(this);
								var $currImage = $($fp_gallery).children('img:first');
								if(params.picWidth != 0 && params.picHeight != 0){
									var center_left = (jqW-params.picWidth)/2+'px';
									var center_top = (jqH-params.picHeight)/2+'px';
									$newimg.css({'width':params.picWidth +'px','height':params.picHeight+'px','left':center_left,'top':center_top});
								}
								$newimg.insertBefore($currImage);
								$($loader).hide();
								//now we have two large images on the page
								//fadeOut the old one so that the new one gets shown
								$currImage.fadeOut(2000,function(){
									$(this).remove();
								});
							}).attr('src',$elem.attr('alt'));
						}
						
					});
				//显示左右导航箭头
				$.fn.gallery.methods.showNav();
				//修改标题
				$.fn.gallery.methods.changeImgInfo($elem.next().html());
				//将相框隐藏起来
				$.fn.gallery.methods.hideThumbs();
				event.preventDefault();
			});
			$($btn_thumbs).bind('click',function(){
				$.fn.gallery.methods.showThumbs(500);
				$.fn.gallery.methods.hideNav();
			});
			$($btn_next).bind('click',function(){
				$.fn.gallery.methods.showNext(jq,params);
			});
			$($btn_prev).bind('click',function(){
				$.fn.gallery.methods.showPrev(jq,params);
			});
		},
		showNext:function(jq,params){
			++current;
			var $e_next	= $($thumbScroller).find('.focus_content:nth-child('+current+')');
			if($e_next.length == 0){
				current = 1;
				$e_next	= $($thumbScroller).find('.focus_content:nth-child('+current+')');
			}
			$($loader).show();
			if(params.isIviwer){
				$($loader).hide();
				$($fp_gallery).iviewer('loadImage',$e_next.find('img').attr('alt'));
			}else{
				$('<img class="fp_preview"/>').load(function(){
					var $newimg = $(this);
					var $currImage = $($fp_gallery).children('img:first');
					$newimg.insertBefore($currImage);
					var jqW = $(jq).width() == 0 ? $(window).width():$(jq).width() ;
					var jqH = $(jq).height() == 0 ? $(window).height():$(jq).height();
					if(params.width != 0 && params.picHeight != 0){
						var center_left = (jqW-params.picWidth)/2+'px';
						var center_top = (jqH-params.picHeight)/2+'px';
						$newimg.css({'width':params.picWidth +'px','height':params.picHeight+'px','left':center_left,'top':center_top});
					}
					$($loader).hide();
					$currImage.fadeOut(2000,function(){$(this).remove();});
				}).attr('src',$e_next.find('img').attr('alt'));
			}
			$.fn.gallery.methods.changeImgInfo($e_next.find('span').html());
		},
		showPrev:function(jq,params){
			--current;
			var $e_next	= $($thumbScroller).find('.focus_content:nth-child('+current+')');
			if($e_next.length == 0){
				current =  $($thumbScroller).find('.focus_content').length;
				$e_next	= $($thumbScroller).find('.focus_content:nth-child('+current+')');
			}
			$($loader).show();
			if(params.isIviwer){
				$($loader).hide();
				$($fp_gallery).iviewer('loadImage',$e_next.find('img').attr('alt'));
			}else{
				$('<img class="fp_preview"/>').load(function(){
					var $newimg = $(this);
					var $currImage = $($fp_gallery).children('img:first');
					$newimg.insertBefore($currImage);
					var jqW = $(jq).width() == 0 ? $(window).width():$(jq).width() ;
					var jqH = $(jq).height() == 0 ? $(window).height():$(jq).height();
					if(params.picWidth != 0 && params.picHeight != 0){
						var center_left = (jqW-params.picWidth)/2+'px';
						var center_top = (jqH-params.picHeight)/2+'px';
						$newimg.css({'width':params.picWidth +'px','height':params.picHeight+'px','left':center_left,'top':center_top});
					}
					$($loader).hide();
					$currImage.fadeOut(2000,function(){$(this).remove();});
				}).attr('src',$e_next.find('img').attr('alt'));
			}
			$.fn.gallery.methods.changeImgInfo($e_next.find('span').html());
		},
		/**
		 * 隐藏左右导航键
		 */
		hideNav:function(){
			$($btn_next).stop().animate({'right':'-50px'},500);
			$($btn_prev).stop().animate({'left':'-50px'},500);
		},
		/**
		 * 显示左右导航键
		 */
		showNav:function(){
			$($btn_next).stop().animate({'right':'0px'},500);
			$($btn_prev).stop().animate({'left':'0px'},500);
		},
		/**
		 * 隐藏相框
		 */
		hideThumbs:function(){
			$('#outer_container').stop().animate({'bottom':'-160px'},500);
			$.fn.gallery.methods.showThumbsBtn();
		},
		/**
		 * 显示相框
		 */
		showThumbs:function(speed){
			$('#outer_container').stop().animate({'bottom':'-30px'},speed);
			$.fn.gallery.methods.hideThumbsBtn();
		},
		/**
		 * 隐藏相框按钮
		 */
		hideThumbsBtn:function(){
			$($btn_thumbs).stop().animate({'bottom':'-50px'},500);
		},
		/**
		 * 显示相框按钮
		 */
		showThumbsBtn:function(){
			$($btn_thumbs).stop().animate({'bottom':'0px'},500);
		},
		changeImgInfo:function(text){
			$('#galleryTitle').empty();
            $('#galleryTitle').append(text);
		},
		createPhotoFrame:function(jq,params){
			//加载样式文件
			var cssFileUrl = ctx+"/scripts/plugin/gallery/themes/"+skin+"/css/gallery.css";
		    var fileref = document.createElement('link');
	        fileref.setAttribute("rel","stylesheet");
	        fileref.setAttribute("type","text/css");
	        fileref.setAttribute("href",cssFileUrl);
	        $("head")[0].appendChild(fileref);
			var titleDiv = $("<div id=\"galleryTitle\">"+params.picName+"</div>");
			titleDiv.appendTo($(jq));
			var gallerDiv = $("<div id=\"fp_gallery\" class=\"fp_gallery\"></div>");
			var preview_img = $("<img src=\"\"  alt=\"\"  class=\"fp_preview\" style=\"display:none;\"/>");
			preview_img.appendTo(gallerDiv);
			var laodDiv = $("<div id=\"fp_loading\" class=\"fp_loading\"></div>");
			laodDiv.appendTo(gallerDiv);
			var fbNextDiv = $("<div id=\"fp_next\" class=\"fp_next\"></div>");
			fbNextDiv.appendTo(gallerDiv);
			var fbPreDiv = $("<div id=\"fp_prev\" class=\"fp_prev\"></div>");
			fbPreDiv.appendTo(gallerDiv);
			var outer_containerDiv = $("<div id=\"outer_container\"></div>");
			var thumbScrollerDiv = $("<div id=\"thumbScroller\"></div>");
			var container = $("<div class=\"container\"></div>");
			$.fn.gallery.methods.creatGalleryImg(container,params);
			container.appendTo(thumbScrollerDiv);
			thumbScrollerDiv.appendTo(outer_containerDiv);
			outer_containerDiv.appendTo(gallerDiv);
			var thumbtoggleDiv = $("<div id=\"fp_thumbtoggle\" class=\"fp_thumbtoggle\">"+params.galleryName+"</div>")
			thumbtoggleDiv.appendTo(gallerDiv);
			gallerDiv.appendTo($(jq));
			
		},
		creatGalleryImg:function($obj,params){
        	var imghref;
			var datas;
			if(params){
				datas = params.properties;
			}
        	if(power.isNotEmpty(datas)){
        		$.each(datas,function(index,value){
        			var url = value.picUrl;
        			var info = value.picInfo;
        			if(power.isNotEmpty(url)){
        				var focus_content_Div = $("<div class='focus_content'></div>");
						var inner_div = $("<div style='position: relative;'></div>");
						var inner_a = $("<a href='javascript:void(0)' ></a>");
        				var thumb_img = $("<img src='"+url+"' alt='"+url+"' onerror='$.fn.gallery.methods.errorImg(this)'  class='thumb'></img>");
						var imgFoucInfo_span = $("<span style=\"width:100%\" class='foucs_img_info'>"+info+"</span>");
						thumb_img.appendTo(inner_a);
						imgFoucInfo_span.appendTo(inner_a);
						inner_a.appendTo(inner_div);
						inner_div.appendTo(focus_content_Div);
        				focus_content_Div.appendTo($obj);
        			}
        		});
        	}
		},
		errorImg:function(img){
			img.src = ctx + '/scripts/plugin/gallery/themes/'+skin+'/images/nodata.gif'; 
			img.onerror = null; 
		}
	}
})(jQuery)