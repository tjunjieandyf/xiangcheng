/**
* 日期面板插件
* @module $.datetab
*/

(function($){
	/**
	* 日期面板插件入口
	* @constructor $.datetab
	* @class $.datetab
	* @param {Object} options 渲染参数
	* @param {Object} undefined 预留参数
	* @return {object}
	* @example 
		$('#test').datetab({
			 //开始时间
             ybcsrq:'2015-07-23',
             //点击事件
             onSelect:function(params){
             	alert(1);
             },
          });
	*/
	$.fn.datetab = function(options,undefined){
		return initDateTab(this,options,undefined)
	}	
	/**
	* 初始化日期面板插件
	* @method initDateTab
	* @private
	* @param {Object} obj jquery对象
	* @param {Object} options 渲染参数
	* @param {Object} undefined 预留参数
	* @return {object} 
	*/
	function initDateTab(jq,options,undefined){
		var params = $.extend({},$.fn.datetab.default,options);
		 $(jq).data('paramData',{
		 	ybcsrq:params.ybcsrq,
		 	ybHour: params.ybHour,
		 	onSelect:params.onSelect,
		 	plain:params.plain,
		 	required:params.required,
		 	editable:params.editable,
		 	panelWidth:params.panelWidth,
		 	panelHeight:params.panelHeight,
		 	selectFirst:params.selectFirst,
		 	showPanel:params.showPanel,
		 	sjjg:params.sjjg,
		 	delay:params.delay,
			panelWidth:params.panelWidth,
		 	panelHeight:params.panelHeight
		});
		return  $.fn.datetab.methods.createDateCombo(jq,undefined);
	}
	
	$.fn.datetab.default = {
		/**
		*开始时间
		*@property ybcsrq
		*@type String
		*@default ''
		*/
		ybcsrq:'',
		/**
		*预报小时数 天数*24-1
		*@property ybHour
		*@type String
		*@default ''
		*/
		ybHour:'',
		/**
		*点击事件
		*@property onSelect
		*@type Function
		*@default function(){$.noop();}
		*/
		onSelect:function(){
			$.noop();
		},
		/**
		*控制面板背景
		*@property plain
		*@type Boolean
		*@default true
		*/
		plain:true,
		/**
		*定义是否为必填字段
		*@property required
		*@type Boolean
		*@default true
		*/
		required:true,
		/**
		*定义用户是否可以直接输入文本到字段中
		*@property editable
		*@type Boolean
		*@default false
		*/
		editable:false,
		/**
		*下拉面板宽度
		*@property panelWidth
		*@type Number
		*@default 264
		*/
		panelWidth:226,
		/**
		*下拉面板高度
		*@property panelWidth
		*@type Number
		*@default 247
		*/
		panelHeight:185,
		/**
		*是否第一次触发点击事件
		*@property editable
		*@type Boolean
		*@default true
		*/
		selectFirst:true,
		/**
		*是否显示panel
		*@property showPanel
		*@type Boolean
		*@default false
		*/
		showPanel:false,
		/**
		 * 日期往后推的天数
		 *@property delay
		 */
		delay:0,
		/**
		 * 时间间隔小时
		 */
		sjjg:1
	}
	
	$.fn.datetab.methods = {
		/**
		* 创建日期面板下拉框
		* @method createDateCombo
		* @private
		* @param {Object} obj jquery对象
		* @param {Object} undefined 预留参数
		* @return {object} 
		*/
		createDateCombo:function(jq,undefined){
			var panelHeight = $(jq).data('paramData').panelHeight;
			var panelWidth = $(jq).data('paramData').panelWidth;
			var required = $(jq).data('paramData').required;
			var editable = $(jq).data('paramData').editable;
			var showPanel = $(jq).data('paramData').showPanel;
			if(!showPanel){
				$('#'+jq.attr('id')).combo({
		               required:required,
		               editable:false,
		               panelWidth:panelWidth,
		               panelHeight:panelHeight,
		           });
			}
          $.fn.datetab.methods.createComboTabs(jq);
		},
		/**
		* 创建日期面板选项卡面板
		* @method createComboTabs
		* @private
		* @param {Object} obj jquery对象
		* @return {object} 
		*/
		createComboTabs:function(jq){
			var ybcsrq = $(jq).data('paramData').ybcsrq;
			var ybhour = $(jq).data('paramData').ybHour;
			var onselect = $(jq).data('paramData').onSelect;
			var plain = $(jq).data('paramData').plain;
			var panelHeight = $(jq).data('paramData').panelHeight;
			var panelWidth = $(jq).data('paramData').panelWidth;
			var showPanel = $(jq).data('paramData').showPanel;
			var delay = $(jq).data('paramData').delay;
			var sjjg = $(jq).data('paramData').sjjg;
			var container$ = $("<div></div>");
			$('body').append(container$);
			$(container$).tabs({
				plain:plain,
				border:false,
				width:panelWidth-4,
				height:panelHeight-2
			});
			$.ajax({
				type:'get',
				url:ctx+'/scripts/gas/plugin/datetab/jsp/dateTab.jsp?ybcsrq='+ybcsrq+"&ybHour="+ybhour+"&delay="+delay+"&sjjg="+sjjg,
				dataType:'json',
				async : false,
				success:function(result){
					if(result != null && result.length>0){
						$(result).each(function(ybsjIndex,ybsjValue){
							var div$ = $("<div titel='"+ybsjValue.key+"'></div>");
							var ul$ = $("<ul class=\"eawqdatetab\"></ul>");
							var tabValue = ybsjValue.value;
							$(tabValue).each(function(tabindex,value){
								var li$ = $('<li>'+value.xsxs+'</li>');
								$(li$).on('click',function(){
									if(!showPanel){
										$(jq).combo('setValue', value.ybsj).combo('setText', value.text).combo('hidePanel');
									}
									$(container$).find('ul.eawqdatetab').find("li.selected").removeClass('selected');
									$(this).addClass('selected');
									eval("var callBackFun ="+$(jq).data('paramData').onSelect);
									callBackFun({value:value.ybsj,text:value.text,xsxs:value.xsxs});
								})
								ul$.append(li$);
							})
							
							$(container$).tabs('add',{
								title:ybsjValue.key,
								content:ul$
							})
							
						})
					}
				}
			})
			if(showPanel){
				$(container$).appendTo($(jq));
			}else{
				$(container$).appendTo($(jq).combo('panel'));
			}
			var selectFirst = $(jq).data('paramData').selectFirst;
			if(selectFirst){
				$(container$).tabs('select',0);
				$(container$).find('ul.eawqdatetab').children("li:first").click();
			}
		}
	}
})(jQuery)