/* *
 * 下拉选择组件
 * @ListChoice
 * */
var Choice = {
};
/** 搜索数据 */
Choice.Items = "";
/** 定位位置 */
 /* 正则表达式 筛选中文城市名、拼音、首字母 */
Choice.regEx = /^([\u4E00-\u9FA5\uf900-\ufa2d]+)\|(\w+)\|(\w)\w*$/i;
var optionsAll;
(function($) {
	/**
	* 初始化方法
	* @param jq 初始化的元素
	* @param options 初始化属性
	* @param param 参数
	*/
	function initAreaChioce(jq,options,param){
		
		var param = $.extend($.fn.areaChioce.defaults,options);
		optionsAll = options;
		$(jq).addClass('choiceInput');
		$(jq).data('choice',{
					defValue:param.selectFirst,
					type:param.type,
					onSelect:param.onSelect,
					checkBox:param.checkBox,
					width:param.width,
					height:param.height,
					xzqhdm:param.xzqhdm,
					zdqx:param.zdqx
		});
		var createDiv = $.fn.areaChioce.methods.createAreaDiv(jq,param.type);
		$.fn.areaChioce.methods.inputEvent(jq);
	}
	/**
	 *  调用区域选择组件  如：$('#choice').areaChioce({onSelect:function(params){console.info(params);}});
	 * @param options 选项
	 * @param param 参数
	 **/
   $.fn.areaChioce = function(options, param){
   		//如果为字符串则执行方法
   		if (typeof options == 'string'){
			var method = $.fn.areaChioce.methods[options];
			if (method){
				return method(this, param);
			} 
		//初始化
		}else{
			return initAreaChioce(this,options, param);
		}
   }
   /**
    * 默认值
    */
   $.fn.areaChioce.defaults = $.extend({},{
		selectFirst: true,
		onSelect: function(record){
			return record;
		},	
		width:775,
		height:410,
		checkBox:'',
		type:'',
		xzqhdm:''
	});
   $.fn.areaChioce.methods = {
   		/**
   		 * 创建区域内容
   		 * @param jq  被渲染的input
   		 * @param args  传入的参数
   		 */
   		createAreaDiv:function(jq,args){
   			console.log(12);
			var div = document.createElement('div');
			$(div).addClass('hide');
			$(div).addClass("inputBox");
			$(jq).after(div);
			$(div).data('inputId',$(jq).attr('id'));
			var flag = $(jq).data('choice').defValue;
			var width = $(jq).data('choice').width;
			var height = $(jq).data('choice').height;
			var xzqhdm = $(jq).data('choice').xzqhdm;
			var zdqx = $(jq).data('choice').zdqx;
			var url = ctx+'/scripts/gas/plugin/listchoice/jsp/listChoice.jsp?type='+args+"&xzqhdm="+xzqhdm+"&zdqx="+zdqx;
			$(div).panel({
				width:width,    
	  			height:height,
	  			border:false,
	  			href:url,
	  			isChoose:flag,
	  			inputId:$(jq).attr('id')
			});
			$(div).panel('options').onLoad = function(){
				var type =  $(jq).data('choice').type;
				$.fn.areaChioce.methods.linkEvent(this,jq);
				$.fn.areaChioce.methods.createPyOrQpData(this);
				if($(this).panel('options').isChoose){
					if(type=="STATION" || type =="XZQ"){
						$($(this).find('li .mcate-item-bd a').get(0)).click();
					}else{
						$($(this).find('li .mcate-item-hd a').get(0)).click();
					}	
				}
				$(this).find('.allcategorys').css({'width':'99%','height':$(this).height()-10+'px','overflow':'auto'})
				$(this).find('.allcategorys .divider:last').css("border-bottom","none");
			}
			$(jq).data('listDiv',div);
			this.divEvent(div,jq);
		},
		/**
	     * 创建全拼和简拼的数据
	     * @param obj 创建的内容div
	    **/
	    createPyOrQpData:function(obj){
	    	if(power.isEmpty(Choice.Items)){
		    	Choice.Items = new Array();
		    	var element = $(obj).find('li a');
		    	$.each(element,function(index,data){
		    		var text = $(this).text();
		    		var dm = $(this).attr('dm');
		    		Choice.Items[index] = text + '|' +  text.toPinYin() + '|' +  text.toShouZiMu() + '#' +dm;
		    	});
	    	}
	    },
	   	/**
		 * 输入框事件
		 * @param input 需要绑定的input元素
		 **/
		inputEvent:function(input){
			var checkBox = $(input).data('choice').checkBox;
			var type =  $(input).data('choice').type;
			var xzqhdm =  $(input).data('choice').xzqhdm;
	    	$(input).bind('mouseenter',function(){
				$.fn.areaChioce.methods.divLocate(input);  
	    		$($(this).next().children().get(0)).removeClass('hide');
	    		$($(this).next().children().get(0)).addClass('show');
	    		if(xzqhdm!=""&&xzqhdm.indexOf("0000")==-1){
	    			var width = 280;
	    			var height = 330;
	    			if(typeof optionsAll.width != 'undefined'){
	    				width = optionsAll.width;
	    			}
	    			if(typeof optionsAll.height != 'undefined'){
	    				height = optionsAll.height;
	    			}
	    			$(".inputBox").css({"width":width,"height":height})
					$(".allcategorys").css({"width":width - 10,"height":height - 10})
	    		}
	    		if(type == "CITY" || type == 'AREA'){
	    			var width = 302;
	    			var height = 170;
	    			if(typeof optionsAll.width != 'undefined'){
	    				width = optionsAll.width;
	    			}
	    			if(typeof optionsAll.height != 'undefined'){
	    				height = optionsAll.height;
	    			}
	    			$(".inputBox").css({"width":width,"height":height})
					$(".allcategorys").css({"width":width - 2,"height":height - 10})
				  }
	    		optionsAll = null;
	    	});
	    	
	    	$(input).bind('keyup',function(){
	    		$.fn.areaChioce.methods.createSearchUl(this);
	    	});
	    },
	    /**
	     * 获取创建div的定位
	     * @param pos 位置信息
	     * @param obj input
	     **/
	    divLocate:function(obj){
	    	var pos = $.fn.areaChioce.methods.getPos(obj);
	    	pos.left = Math.ceil(pos.left);
	    	pos.top = Math.ceil(pos.top)+3;
	     	var win = $(window).width();
	     	var divWid = $($(obj).data('listDiv')).width();
	     	var iconLeft = $(obj).width()/2;
	     	if((win - pos.left - divWid)<0){
	     		pos.left =  pos.left - (pos.left + divWid - win)-20;
	     		iconLeft = $(obj).offset().left - pos.left + iconLeft;
	     	}
	    	$($(obj).data('listDiv')).css({'left':pos.left+'px','position':'absolute','z-index':'9999'});
	    	$($(obj).data('listDiv')).find('.inputBox-arrow').css({'left':iconLeft+'px'});
	    },
	     /**
	     * div鼠标移入移出事件、输入框移出事件
	     * @param obj 被绑定的元素
	     * 计时器
	     **/
	    divEvent:function(obj,jq){
	    	var checkBox = $(jq).data('choice').checkBox;
	    	var type =  $(jq).data('choice').type;
		  	var input = '#' + $(obj).data('inputId');
		  	var xzqhdm =  $(input).data('choice').xzqhdm;
		  	var div = $(input).data('listDiv');		  	
		  	//鼠标移出
		  	$(obj).on("mouseleave",function(){
				$(div).removeClass('show');
				$(div).addClass('hide');
				if(checkBox===true){	
					if((type=="STATION"||xzqhdm!=="")&&$(this).find('li .mcate-item-bd .stasel').length==0){						
						$($(this).find('li .mcate-item-bd a').get(0)).click();
					}
					if((type=="CITY"||type==="")&&$(this).find('li .mcate-item-hd  .citysel').length==0){
						$($(this).find('li .mcate-item-hd a').get(0)).click();
					}
					if((type=="AREA"||type==="")&&$(this).find('li .mcate-item-hd  .citysel').length==0){
						$($(this).find('li .mcate-item-hd a').get(0)).click();
					}
					eval( "var callBackFun = " + $(input).data('choice').onSelect);
					callBackFun({dm:$(jq).data("param-dms").dms,lb:$(jq).data("param-lbs").lbs,text:$(input).val()});
				}	
			});
		  //计时器  输入框移出事件
	  		var timer;
	  		var div = $(input).data('listDiv');
	  		$(input).on("mouseleave",function(){
	  		   timer=setTimeout(function(){
	  				  $(div).removeClass("show");
					  $(div).addClass("hide");
	  			   },300);
	  		});
		   //鼠标移入div
		  	$(obj).on("mouseenter",function(){
		  		clearTimeout(timer);
		  	});  		
		},
		/**
		 * 列表中选择项点击事件 
		 * @ param obj 列表div
		 */
		linkEvent:function(obj,jq){
			/**
			 * 定义数组方法：indexOf、remove
			 */
			Array.prototype.indexOf = function(val) {   //定义数组方法:indexOf
				for (var i = 0; i < this.length; i++) {
					if (this[i] == val) return i;
				}
					return -1;
				};
				Array.prototype.remove = function(val) {  //定义数组方法:remove
					var index = this.indexOf(val);
						if (index > -1) {
						  this.splice(index, 1);
						}
					};
					var checkBox = $(jq).data('choice').checkBox;
					var type =  $(jq).data('choice').type;
					var input = '#' + $(obj).data('inputId');
					var xzqhdm =  $(jq).data('choice').xzqhdm;
					var stationSelect = [];
					var citySelect = [];
					var dms=[]; 
					var lbs=[];
					
					$(".allcategorys li a").on("click", function(index,boj) {
						var seltemp = $(this).text();
						var dmtemp = $(this).attr('dm');
						var lbtemp = $(this).attr('lb');

						if(checkBox===true) {
							if(type == "CITY" || type == 'AREA' ||type === "") {
								if($(this).parent().hasClass("mcate-item-hd")) {

									//添加或移除选中的样式
									if($(this).hasClass("citysel")){
										$(this).removeClass("citysel")
									} else {
										$(this).addClass("citysel")
									}
									
									//选中或移除的判断
									if(stationSelect.indexOf(seltemp) > -1) {
										stationSelect.remove(seltemp);
										dms.remove(dmtemp);
										$(input).val(stationSelect);
									} else {
										stationSelect.push(seltemp);
										dms.push(dmtemp);
										$(input   ).val(stationSelect);
									}	
								}
							} 
							if(type == "XZQ"||type == "STATION" ||xzqhdm!=="") {
								if($(this).parent().hasClass("mcate-item-bd")) {
									//添加或移除选中的样式
									if($(this).hasClass("stasel")) {
										$(this).removeClass("stasel")
									} else {
										$(this).addClass("stasel")
									}
									//选中或移除的判断
									if(stationSelect.indexOf(seltemp) > -1) {
										stationSelect.remove(seltemp);
										dms.remove(dmtemp);
										$(input).val(stationSelect);
									} else {
										stationSelect.push(seltemp);
										dms.push(dmtemp);
										$(input).val(stationSelect);
									}	
								}
							}

						} else if(checkBox===false||checkBox===""){
							citySelect = [];stationSelect=[];dms=[]; lbs=[];
							//城市 或 单选 
							if(type == "CITY" || type == "AREA" ||(checkBox===false&&type === "")&&xzqhdm==="") {	
								$(".allcategorys  li .mcate-item-hd a").removeClass("citysel");
								if($(this).parent().hasClass("mcate-item-hd")) {
									$(input).val($(this).text());
									dms.push(dmtemp);
									lbs.push(dmtemp);
									if(!($(this).hasClass("citysel"))) {
										$(this).addClass("citysel")
									}
								  var div = $(input).data('listDiv');
								  $(div).removeClass('show');
								  $(div).addClass('hide');
								  eval( "var callBackFun = " + $(input).data('choice').onSelect);
								  callBackFun({dm:$(this).attr('dm'),lb:$(this).attr('lb'),text:$(input).val()});
								}							
							} 
							if(type == "XZQ" || type == "AREA" || type == "STATION"||xzqhdm!=="") {
								if($(this).parent().hasClass("mcate-item-bd")) {
									$(input).val($(this).text());
									dms.push(dmtemp);
									lbs.push(dmtemp);
									$(".allcategorys .sublist li a").removeClass("stasel");

									if($(this).hasClass("stasel")){
										$(this).removeClass("stasel")
									} else {
										$(this).addClass("stasel")
									}
								  eval( "var callBackFun = " + $(input).data('choice').onSelect);
							      callBackFun({dm:$(this).attr('dm'),lb:$(this).attr('lb'),text:$(input).val()});
								  var div = $(input).data('listDiv');
								  $(div).removeClass('show');
								  $(div).addClass('hide');
								}
							} 
							if(checkBox===""&&type == "") {
								//城市单选
									$(".allcategorys .sublist li a").removeClass("citysel")
									$(".allcategorys .sublist li a").removeClass("stasel")
									if($(this).parent().hasClass("mcate-item-hd")) {
										$(input).val($(this).text());
										dms.push(dmtemp);
										lbs.push(dmtemp);
										if(!($(this).hasClass("citysel"))) {
											$(this).addClass("citysel")
										}
										eval( "var callBackFun = " + $(input).data('choice').onSelect);
										callBackFun({dm:$(this).attr('dm'),lb:$(this).attr('lb'),text:$(input).val()});
										var div = $(input).data('listDiv');
										$(div).removeClass('show');
										$(div).addClass('hide');
									}
								
								//站点单选
								if($(this).parent().hasClass("mcate-item-bd")) {
									$(input).val($(this).text());
									dms.push(dmtemp);
									lbs.push(dmtemp);

									if($(this).hasClass("stasel")) {
										$(this).removeClass("stasel")
									}else {
										$(this).addClass("stasel")
									}
									eval( "var callBackFun = " + $(input).data('choice').onSelect);
								    callBackFun({dm:$(this).attr('dm'),lb:$(this).attr('lb'),text:$(input).val()});
									var div = $(input).data('listDiv');
								    $(div).removeClass('show');
									$(div).addClass('hide');
								}  
							}						
						}						
						$(jq).data('param-dms',dms);
						$(jq).data('param-lbs',lbs);			
			})
		},
		/**
	 	 * 获取元素的位置
	 	 * @param obj 元素
	 	 * 
		**/
		getPos:function(obj){
			var left = $(obj).offset().left;
			var top = $(obj).offset().top;
			var h = $(obj).height();
			var ptop = $(obj).css('padding-top');
			var pbottom = $(obj).css('padding-bottom');
			if(power.isNotEmpty(ptop)){
				h += Number(ptop.replace('px',''));
			}
			if(power.isNotEmpty(pbottom)){
				h += Number(pbottom.replace('px',''));
			}
			var pos = {'left':left,'top':top+h};
			return pos;
		}, 
		/* *
	     * 生成搜索下拉选择列表
	     * @ param input 搜索的文本框
	     * */
	    createSearchUl:function (input) {
	        var str;
	        var value = $.trim($(input).val());
	        // 当value不等于空的时候执行
	        if (value !== '') {
	            var reg = new RegExp("^" + value + "|\\|" + value, 'gi');
	            var searchResult = [];
	            for (var i = 0, n =  Choice.Items.length; i < n; i++) {
	                if (reg.test(Choice.Items[i].split('#')[0])) {
	                    var match = Choice.regEx.exec(Choice.Items[i].split('#')[0]);
	                    if (searchResult.length !== 0) {
	                        str = '<li><b class="cityname" dm='+Choice.Items[i].split('#')[1]+'>' + match[1] + '</b><b class="cityspell">' + match[2] + '</b></li>';
	                    } else {
	                        str = '<li class="on"><b class="cityname" dm='+Choice.Items[i].split('#')[1]+'>' + match[1] + '</b><b class="cityspell">' + match[2] + '</b></li>';
	                    }
	                    searchResult.push(str);
	                }
	            }
	            this.isEmpty = false;
	            // 如果搜索数据为空
	            $($(input).data('listDiv')).find('.allcategorys').removeClass('show');
	            $($(input).data('listDiv')).find('.allcategorys').addClass('hide');
	            if (searchResult.length == 0) {
	                this.isEmpty = true;
	                str = '<li class="empty">对不起，没有找到数据 "<em>' + value + '</em>"</li>';
	                searchResult.push(str);
	            }
	            // 如果slideul不存在则添加ul
	            if (!$(input).data('searchUl')) {
	                var ul  = document.createElement('ul');
	                $(ul).addClass('cityslide');
	                $(input).data('listDiv') && $(input).data('listDiv').appendChild(ul);
	                $(input).data('searchUl',ul);
	            } else {
	                $.fn.areaChioce.methods.searchDivShow(input);
	               
	            }
	            $(input).data('searchUl').innerHTML = searchResult.join('');
	            $.fn.areaChioce.methods.searchDivShow(input);
	            $.fn.areaChioce.methods.searchEvent(input);
	        }else{
	            $.fn.areaChioce.methods.listDivShow(input);
	        }
	    },
	    /**
	     * 搜索列表点击事件
	    **/
	    searchEvent:function(input){
	    	$('.cityslide').find('li').bind('click',function(){
	    		var dm = $(this).find('.cityname').attr('dm');
	    		var a = $(this).parent().parent().find('.allcategorys').find('a[dm="'+dm+'"]');
	    		var inputId = $(this).parent().parent().data('inputId');
	    		$('#'+inputId).val($(a).text());
	    		$('#'+inputId).attr('dm',$(a).attr('dm'));
				$('#'+inputId).attr('lb',$(a).attr('lb'));
				var div = $('#' + inputId).data('listDiv');
				eval( "var callBackFun = " + $('#'+inputId).data('choice').onSelect);
	    		callBackFun({dm:$('#'+inputId).attr('dm'),lb:$('#'+inputId).attr('lb'),text:$(a).text()});
				$(div).removeClass('show');
	    		$(div).addClass('hide');
	    	});
	    },
	     /**
	     * 搜索列表显示
	    **/
	    searchDivShow:function(obj){
	    	$($(obj).data('listDiv')).removeClass('hide');
	    	$($(obj).data('listDiv')).find('.allcategorys').removeClass('show');
	    	$($(obj).data('listDiv')).find('.allcategorys').addClass('hide');
	    	$($(obj).data('searchUl')).addClass('show');
	    	$($(obj).data('listDiv')).panel('resize',{width: 273,height: $($(obj).data('searchUl')).height()});
	    	this.divLocate(obj);
	    },
	    /**
	     * 选择列表显示
	     **/
	    listDivShow:function(obj){
	    	$($(obj).data('searchUl')).removeClass('show');
	    	$($(obj).data('searchUl')).addClass('hide');
	    	$($(obj).data('listDiv')).find('.allcategorys').removeClass('hide');
	    	$($(obj).data('listDiv')).find('.allcategorys').addClass('show');
	    	$($(obj).data('listDiv')).panel('resize',{width: 1010,height: 410});
	    	this.divLocate(obj);
	    }
   };
 
})(jQuery);
