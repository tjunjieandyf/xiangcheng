/**
* 条件切换插件
* @module $.segment
*/

(function( $ ){
	/**
	* 查询统计模块组件入口
	* @constructor $.segment
	* @class $.segment
	* @param {Object} options 渲染参数
	* @param {Object} undefined 预留参数
	* @return {object}
	* @example 
		eq1:渲染插件
		$("#test").segment({
			onSelect:function(param){
				//ewaq.test();
				//require('ewaq-common').test();
				console.info('test:'+param.text+' '+param.value+' '+param.type);
			},
			selectFirst:false,
			selValue:'CAMX',
			segmentId:'YBMS',
			data:[{DM:'CMAQ',DMNR:'WRF-CMAQ'},{DM:'CAMX',DMNR:'WRF-CAMx'}]
	   });
	   eq2:设置默认值
	   $("#PJLX").segment('select','24');
	   eq3：获取选中值
	   var param = $("#YBMS").segment('getSelected');
	*/
	$.fn.segment = function(options,undefined){
		if(typeof options == 'string'){
			var method = $.fn.segment.methods[options];
			if(method){
				return method(this,undefined);
			}
		}else{
			return initSegemt(this,options,undefined);
		}
	}
	
   $.fn.segment.defaults = $.extend({},{
		/**
		*点击事件回调函数
		*@property onSelect
		*@type Function
		*@default function(record){return record;}
		*/
		onSelect: function(record){
			return record;
		},
		/**
		*是否第一次触发
		*@property selectFirst
		*@type Boolean
		*@default true
		*/
		selectFirst: true,
		/**
		*需要渲染的数据 eq:[{DM:'CMAQ',DMNR:'WRF-CMAQ'},{DM:'CAMX',DMNR:'WRF-CAMx'}]，也可以的请求地址
		*@property data
		*@type Object
		*@default {}
		*/
		data:{},
		/**
		*默认选中值，如果没有，则为第一个 eq：CMAQ
		*@property selValue
		*@type String
		*@default ''
		*/
		selValue:'',
		/**
		*id
		*@property segmentId
		*@type String
		*@default ''
		*/ 
		segmentId:''
	});
	
	/**
	* 初始化segment组件
	* @method initSegemt
	* @private
	* @param {Object} obj jquery对象
	* @param {Object} options 渲染参数
	* @param {Object} undefined 预留参数
	* @return {object} 
	*/
	function initSegemt(obj,options,undefined){
		var params = $.extend({},$.fn.segment.defaults,options);
		$(obj).data('paramData',{
			selectFirst:params.selectFirst,
			onSelect:params.onSelect,
			data:params.data,
			selValue:params.selValue,
			segmentId:params.segmentId
		});
		$.fn.segment.methods.createSegment(obj,undefined);
	}
	
	$.fn.segment.methods = {
		/**
		* 创建segment组件div
		* @method createSegment
		* @private
		* @param {Object} obj jquery对象
		* @param {Object} undefined 预留参数
		* @return  
		*/
		createSegment:function(obj,undefined){
			$(obj).each(function (){
				//需要渲染的数据
				var objData;
				var self = $(this);
				var data = obj.data('paramData').data;
				var selValue = obj.data('paramData').selValue;
				//如果传入的data 是ajax请求地址
				if($.type(data) == 'string'){
					$.ajax({
						type : 'post',
						url : data,
						async : false,
						dataType : 'json',
						success:function(result){
							objData = result;
						},
						error:function(){
							objData = {};
						}
					})
				}else{
					objData = data;
				}
				if(objData != null && objData.length>0){
					var wrapper = $("<div class=\"ui-segment\">");
					var id = obj.data('paramData').segmentId; 
					if(id != ''){
						wrapper.attr('id',id);
					}
					//遍历数据，创建span
					$(objData).each(function (index,value){
						var option = $("<span class=\"option\" value ="+value.DM+">"+value.DMNR+"</span>");
						//设置选中样式
						if (selValue == value.DM){
							option.addClass("active");
						}
						wrapper.append(option);
					});
					//获取选中的span
					var selObj = wrapper.find('span.active');
					//如果没有选中的span,则默认为第一个
					if(selObj.length <= 0){
						wrapper.find('span:first-child').addClass("active");
					}
					wrapper.find("span.option").click(function (){
						wrapper.find("span.option").removeClass("active");
						$(this).addClass("active");
						self.val($(this).attr('value'));
						eval("var callBackFun ="+obj.data('paramData').onSelect);
						callBackFun({value:$(this).attr('value'),text:$(this).html(),type:wrapper.attr("id")});
					});
					$(this).after(wrapper);
					$(this).hide();
					if(obj.data('paramData').selectFirst){
						wrapper.find("span[class='option active']").click();
					}
				}else{
					return false;
				}
			});
		},
		/**
		*  获取选中的元素的属性
		* @method getSelected
		* @param {Object} jq jquery对象
		* @return  {Object}
		* @example 
			var param = $("#YBMS").segment('getSelected');
		*/
		 getSelected:function(jq,undefined){
		 	var obj = $(jq).find("span[class='option active']");
		 	var param = {
		 		value:obj.attr("value"),
		 		text:obj.text(),
		 		type:$(jq).attr("id")
		 	}
		 	return param
		 },
		 /**
		 *  设置选中元素
		 * @method select
		 * @param {Object} jq jquery对象
		 * @return  {Object} undefined  选中元素的id
		 * @example 
			 $("#PJLX").segment('select','24');
		 */
		 select:function(jq,undefined){
		 	var obj = $(jq);
		 	if(undefined){
		 		obj.find("span.option").removeClass("active");
		 		obj.find("span[value='"+undefined+"']").addClass('active');
			}else{
				return false;
			}
		 }	
	}
})(jQuery);