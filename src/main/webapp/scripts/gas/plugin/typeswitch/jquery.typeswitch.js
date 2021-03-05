/**
* 类型切换插件
* @module $.typeswitch
*/

(function($) {
	/**
	* 渲染类型插件
	* @constructor $.typeswitch
	* @class $.typeswitch
	* @param {Object} options 渲染参数
	* @param {Object} param 预留参数
	* @return {object}
	* @example 
		$("#main").typeswitch({
			selValue:'CMAQ',
			type:'mode',
			isTouch:true,
			properties:[{"DM":'CMAQ',"DMNR":'WRF-CMAQ'},{"DM":'CAMX',"DMNR":'WRF-CAMX'}],
			onChange:function(param){}
		});
	*/ 
	$.fn.typeswitch = function(options,param){
		if(typeof options == 'string'){
			var method = $.fn.typeswitch.methods[options];
			if(method){
				return method(this,param);
			}
		}else{
			return typeswitch(this,options);
		}
	};
	
	/**
	* 初始化typeswitch组件
	* @method typeswitch
	* @private
	* @param {Object} obj jquery对象
	* @param {Object} options 渲染参数
	* @return {object} 
	*/
	function typeswitch(jq,options){
		var defualt = $.fn.typeswitch.defaults;
		var params = $.extend({},defualt,options);
		$(jq).data('paramData',{
				divId:$(jq).attr('id'),
				selValue:params.selValue,
				type:params.type,
				properties:params.properties,
				onChange:params.onChange,
				isTouch:params.isTouch
		});
		$.fn.typeswitch.methods.createTypeswitchDiv(jq);
	};
	
	$.fn.typeswitch.defaults = $.extend({},{
		/**
		*默认选中值
		*@property selValue
		*@type String
		*@default ''
		*/
		selValue:'',
		/**
		*数据对象[{"DM":'CMAQ',"DMNR":'WRF-CMAQ'},{"DM":'CAMX',"DMNR":'WRF-CAMX'},....]
		*@property properties
		*@type Object
		*@default ''
		*/
		properties:'',
		/**
		*类型
		*@property type
		*@type String
		*@default ''
		*/
		type:'',
		/**
		*是否第一次加载触发选中事件
		*@property isTouch
		*@type Boolean
		*@default false
		*/
		isTouch:false,
		/**
		*点击事件回调函数
		*@property onChange
		*@type Function
		*@default function(record){return record;}
		*/
		onChange:function(record){
			return record;
		}
	
	});

	$.fn.typeswitch.methods = {
		/**
		* 创建typeswitch组件div
		* @method createTypeswitchDiv
		* @private
		* @param {Object} jq jquery对象
		* @return {object} 
		*/
		createTypeswitchDiv : function(jq){
			var selValue = $(jq).data('paramData').selValue;
			var properties = $(jq).data('paramData').properties;
			var type = $(jq).data('paramData').type;
			var table = $.fn.typeswitch.methods.createTable(properties);
			table.appendTo($(jq));
			// 设置元素的宽度
			$.fn.typeswitch.methods.calTabWidth(jq);
	 		//赋默认选中，如果没有默认值，则默认为第1个
	 		if(power.isNotEmpty(selValue)){
	 			$(jq).find("a[id='"+selValue+"']").addClass("cur");
	 		}else{
	 			$($(jq).find(".swichTxt").get(0)).addClass("cur");
	 		}
	 		//获取浮动span离左边的宽度
	 		var sbtn_l = $(jq).find("#switchBtn").offset().left;
	 		//获取a标签离左边的宽度
	 		var ml = parseInt($($(jq).find(".swichTxt").get(0)).css("paddingLeft"));
	 		var os = sbtn_l - ml-2;
	 		//当前选中对象
	 		var curObj = $(jq).find("a[class='swichTxt cur']");
	 		//如果默认值a标签不在第一个位置则移动浮动span
	 		var spanIndex = curObj.index();
	 		var size =  $($(jq).find('a')).size();
	 		if(spanIndex > 1){
	 			os = curObj.css("left").replace('px','');
	 		}
	 		//重新设置浮动span离左边的宽度 让浮动span在a标签的中间
	 		//$(jq).find("#switchBtn").offset({left: os });
	 		//设置显示文字span的宽度
	 		var showWith = curObj.outerWidth();
	 		$(jq).find("#switchBtn").width(showWith);
	 		$(jq).find('.curTxt').width(showWith);
	 		$(jq).find('.curTxt').text(curObj.html());
	 		//绑定点击事件
	 		$(jq).find('a').each(function(){
		 		$(this).bind("click",function(){
		 			var index = $(this).index();
		 			var curTxt = $(this).html();
		 			var value = $(this).attr("id");
		 			var curIndex = $(jq).find('.cur').index();
		 			var eleWidth = $(this).outerWidth();
		 			var id = $(this).attr('id');
		 			var text = $(this).html();
		 		    //重新设置选中值
		 			$(jq).data('paramData').selValue = value;
					var distant = $.fn.typeswitch.methods.moveWidth(jq,curIndex,index);
					//左移动
		 			if(index>curIndex){
		 				$(jq).find("#switchBtn").animate({'left':'+='+distant+'px'},function(){
		 					$(this).find('.curTxt').html(curTxt);
		 					$(jq).find("#switchBtn").width(eleWidth);
		 					$(jq).find('.curTxt').width(eleWidth);
		 					var onChange = $(jq).data('paramData').onChange;
		 					if(onChange){
		 						//执行回调函数
			 					eval( "var callBackFun = " + onChange);
			    				callBackFun({DM:id,DMNR:text,TYPE:type});
		 					}
		 				});
		 				curIndex=index;
		 			}else if(index<curIndex){ //右移动
		 				$(jq).find("#switchBtn").animate({'left':'-='+distant+'px'},function(){
		 					$(this).find('.curTxt').html(curTxt);
		 					$(jq).find("#switchBtn").width(eleWidth);
		 					$(jq).find('.curTxt').width(eleWidth);
		 					var onChange = $(jq).data('paramData').onChange;
		 					if(onChange){
		 						//执行回调函数
			 					eval( "var callBackFun = " + onChange);
			    				callBackFun({DM:id,DMNR:text,TYPE:type});
		 					}
		 				});
		 				curIndex=index;
		 			}
		 			$(jq).find('.cur').removeClass('cur');
		 			$(this).addClass('cur');
		 		});
	 		});
	 		//第一次加载是否触发事件
	 		var isTouch =  $(jq).data('paramData').isTouch;
	 		if(isTouch){
	 			var selId = $(jq).find("a[class='swichTxt cur']");
	 			var id = $(selId).attr('id');
		 		var text = $(selId).html();
	 			eval( "var callBackFun = " + $(jq).data('paramData').onChange);
		    	callBackFun({DM:id,DMNR:text,TYPE:type});
	 		}
		},
		 /**
		* 创建typeswitch组件table
		* @method createTable
		* @private
		* @param {Object} properties 数据对象
		* @return {object} 
		*/
		createTable : function(properties){
		
			$("head").remove("link[href$='typeswitch.css']");
			//加载css文件样式
			var cssFileUrl = ctx+"/scripts/ewaq/plugin/typeswitch/themes/"+skin+"/css/typeswitch.css";
		    var fileref = document.createElement('link');
	        fileref.setAttribute("rel","stylesheet");
	        fileref.setAttribute("type","text/css");
	        fileref.setAttribute("href",cssFileUrl);
	        $("head")[0].appendChild(fileref);
			var table = $("<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" ></table>");
			var tr = $("<tr ></tr>");
			var tdl =$("<td class=\"switch_box_l\"></td>"); 
			tdl.appendTo(tr);
			var tdc =$("<td class=\"switch_box_c rel\"></td>") ;
			var span = $("<span class=\"abs switchBtn\" id=\"switchBtn\"></span>");
			var i_l = $("<i class=\"switchBtn-l\"></i>");
			var i_r = $("<i class=\"switchBtn-r\"></i>")
			var span_nb = $("<span  class=\"curTxt\"></span>")
			i_l.appendTo(span);
			span_nb.appendTo(span);
			i_r.appendTo(span);
			span.appendTo(tdc);
			for(var i=0;i<properties.length;i++){
				var a = $("<a href=\"javascript:void(0);\" id= '"+properties[i].DM+"' class=\"swichTxt\">"+properties[i].DMNR+"</a>");
				a.appendTo(tdc);
			};
			tdc.appendTo(tr);
			var tdr = $("<td class=\"switch_box_r\"></td>");
			tdr.appendTo(tr);
			tr.appendTo(table);
			return table;
		},
		 /**
		* 计算table的宽度 
		* @method calTabWidth
		* @private
		* @param {Object} jq jquery对象
		* @return 
		*/
		calTabWidth : function(jq){
			var div_width = 0;
			//a标签离对于父元素左边距
			var a_left = 0;
			$(jq).find('a').each(function(){
				//定位a标签
				$(this).css({'left':a_left+'px','top':'0px'});
				//下一个a标签对于父元素左边距
				a_left = a_left + $(this).outerWidth() + 18;
				div_width += $(this).outerWidth() + 18;
			});
			//设置div的宽度
			$(jq).width(div_width);
		},
		 /**
		* 计算滑动的距离
		* @method calTabWidth
		* @private
		* @param {Number} curIndex 没移动前a标签的索引
		* @param {Number} index 目标a标签的索引
		* @return  
		*/
		moveWidth : function(jq,curIndex,index){
			var i = 0;
			var width = 0;
			var a_ml = 0;
			//向右移动
			if(curIndex < index){
				//当前span左边线离左边的距离
				var curBtn = $(jq).find("#switchBtn").offset().left;
				//目标标签左边线离左边的距离
				var einA = $(jq).find('.swichTxt').eq(index-1).offset().left;
				//目标标签的左边距
				var a_ml = parseInt($(jq).find('.swichTxt').eq(index-1).css("paddingLeft"));
				width = einA - curBtn - a_ml*2;
			}else{
				var curBtn = $(jq).find("#switchBtn").offset().left;
				var einA = $(jq).find('.swichTxt').eq(index-1).offset().left;
				var a_ml = parseInt($(jq).find('.swichTxt').eq(index-1).css("paddingLeft"));
				width = curBtn - einA + a_ml*2;
			}
			return width;
		},
		/**
		* 获取选中的元素的属性
		* @method getSelected
		* @param {Object} jq jquery对象
		* @param {Number} index 目标a标签的索引
		* @return {Object}
		* @example
			var test = $("#main").typeswitch('getSelected');
		*/
		getSelected:function(jq){
			var type = $(jq).data('paramData').type;
			var selId = $(jq).find("a[class='swichTxt cur']");
			var id = $(selId).attr('id');
 			var text = $(selId).html();
 			var param ;
 			if(power.isNotEmpty(id) && power.isNotEmpty(text)){
 				param = {DM:id,DMNR:text,TYPE:type};
 			}
			return param;
		},
		/**
		* 设置选中元素
		* @method selecte
		* @param {Object} jq jquery对象
		* @param {Object} param 选中元素的id
		* @return {Object}
		* @example
			$("#main2").typeswitch('selecte','CMAQ2');
		*/
		selecte:function(jq,param){
			if(param){
				$(jq).find("a[id='"+param+"']").click();
			}else{
				return false;
			}
		}
	}
})(jQuery);