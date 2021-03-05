/**
 * 城市站点选择插件
 * @module $.sitePicker
 */

(function($){
	/**
	* 城市站点选择插件入口
	* @constructor $.sitePicker
	* @class $.sitePicker
	* @param {Object} options 渲染参数
	* @param {Object} undefined 预留参数
	* @return {object}
	* @example 
		eq1:区域
		$("#main").sitePicker({
			type:'AREA',
			onSelect:function(params){
				alert(params.DMNR);
			},
			selectFirst:true,
			width:350
		});
		
	   eq2:城市
	   $("#main").sitePicker({
			type:'CITY',
			onSelect:function(params){
				alert(params.DMNR);
			},
			selectFirst:true
		});
		
	   eq3：行政区 形式1：获取所有城市的行政区
	   $("#main").sitePicker({
			type:'XZQ',
			onSelect:function(params){
				alert(params.DMNR);
			},
			selectFirst:false
		});
		
		eq4: 行政区 形式2：获取指定城市的行政区
		$("#main").sitePicker({
			type:'XZQ',
			onSelect:function(params){
				alert(params.DMNR);
			},
			selectFirst:false,
			csdm:'420100000000'
		});
		
		eq5:站点 形式1 ：展示所有城市的站点
		$("#main").sitePicker({
			type:'STATION',
			onSelect:function(params){
				alert(params.DMNR);
			},
			selectFirst:true
		});
		
		eq6:站点 形式2 ：只展示某个城市的站点
		$("#main").sitePicker({
			type:'STATION',
			onSelect:function(params){
				alert(params.DMNR);
			},
			selectFirst:false,
			csdm:'420100000000'
		});
	*/
	$.fn.sitePicker = function(options, param){
		if(typeof options == 'string'){
			var method = $.fn.sitePicker.methods[options];
			if(method){
				return method(this,param);
			}
		}else{
			return initSitePicker(this,options,param);
		}
		
	}
	/**
	* 初始化SitePicker组件
	* @method initSitePicker
	* @private
	* @param {Object} obj jquery对象
	* @param {Object} options 渲染参数
	* @param {Object} undefined 预留参数
	* @return {object} 
	*/
	function initSitePicker(jq,options,param){
		var params = $.extend({},$.fn.sitePicker.defaults,options);
		$(jq).data('paramsData',{
					type:params.type,
					onSelect:params.onSelect,
					selectFirst:params.selectFirst,
					csdm:params.csdm,
					width:params.width,
					checkbox:params.checkbox
		});
		//创建城市站点列表
		$.fn.sitePicker.methods.createSitePickerDiv(jq);
		//为当前对象绑定鼠标进入事件
		return $.fn.sitePicker.methods.inputEvent(jq);
	}
	
   $.fn.sitePicker.defaults = $.extend({},{
   		/**
		* 类型  支持'AREA'、'XZQ'、'CITY','STATION'
		*@property type
		*@type String
		*@default 'STATION'
		*/
   		type:'STATION',
   		/**
		* 选择事件 
		*@property onSelect
		*@type Function
		*@default function(){$.noop();}
		*/
   		onSelect:function(){
   			$.noop();
   		},
   		/**
		* 是否第一选中
		*@property selectFirst
		*@type Boolean
		*@default true
		*/
   		selectFirst:true,
   		/**
		* 城市代码
		*@property csdm
		*@type String
		*@default ''
		*/
   		csdm:'',
   		/**
		* 宽度
		*@property width
		*@type Number
		*@default 490
		*/
   		width:472
	});
   
   //区域
   var AREA = 'AREA';
   //城市
   var CITY = 'CITY';
   //行政区
   var XZQ = 'XZQ';
   //站点
   var STATION = 'STATION';
   
   $.fn.sitePicker.methods = {
   		/**
		* 为当前对象绑定鼠标进入事件
		* @method inputEvent
		* @private
		* @param {Object} jq jquery对象
		* @return  
		*/
   		inputEvent:function(jq){
   			//处理easyui样式冲突问题
			$(jq).parents().find("div.layout-panel").each(function(){
				$(this).css('overflow','initial');
			})
   			$(jq).on('mouseenter',function(){
   				$(jq).removeClass("choiceInput");
   				$(jq).addClass("choiceInput_hover");
   				$(jq).next().addClass("sitePicker_hover");
   				$(jq).next().show();
				$.fn.sitePicker.methods.divLocate(jq);   		
	    	})
	    	//鼠标移出则隐藏
			$(jq).next().on('mouseleave',function(){
				$(jq).next().hide();
				$(jq).addClass("choiceInput");
				$(jq).removeClass("choiceInput_hover");
				$(jq).next().removeClass("sitePicker_hover");
			})
   		},
   		/**
		* 定位生成div的位置
		* @method divLocate
		* @private
		* @param {Object} jq jquery对象
		* @return  
		*/
   		divLocate:function(jq){
   			var left = $(jq).offset().left;
   			var top = $(jq).offset().top;
   			var width = $(jq).width();
   			var height = $(jq).height()
   			var div_width = $(jq).next().width();
   			var div_height =  $(jq).next().height();
   			var win_width = $(window).width();
   			var win_height = $(window).height();
   			//如果div宽度大于屏幕的宽度
   			if(win_width < (left+div_width)){
   				var pos_left = left-div_width+width+1;
   				$(jq).next().offset({'left':pos_left});
   			}
   			$(jq).next().css({'z-index':9999999});
   		},
   		/**
		* 创建插件的容器div
		* @method createSitePickerDiv
		* @private
		* @param {Object} jq jquery对象
		* @return  
		*/
   		createSitePickerDiv:function(jq){
   			var type = $(jq).data('paramsData').type;
   			var ajaxurl = ctx+'/scripts/gas/plugin/sitePicker/jsp/ajaxSitePicker.jsp';
   			$.ajax({
   				type:'post',
   				url:ajaxurl,
   				data:{TYPE:type},
   				dataType:'json',
   				async:false,
   				success:function(data){
   					if(data){
	   					var div$ = $("<div class=\"sitePicker\"></div>");
	   					var width = $(jq).data('paramsData').width;
	   					div$.width(width);
	   					//设置为隐藏
	   					div$.hide();
	   					//取消按钮
	   					/*
	   					var button = $("<button class=\"cancel\">取消</button>");
	   					div$.append(button);
	   					button.on('click',function(){
	   						$(jq).next().find('li a.selected').removeClass('selected');
	   						$(jq).val('');
	   						$(jq).data('data-dm','');
	   						$(jq).data('data-type','');
	   					})*/
	   					var contain_div$ = $("<div class=\"data-container data-container-0\"></div>");
	   					if(type == AREA){
							//创建区域列表
		   					$.fn.sitePicker.methods.createCityDiv(jq,contain_div$,data);
						}else if(type == STATION){
							var csdm = $(jq).data('paramsData').csdm;
	   						if(csdm){
	   							//创建站点列表
	   							$.fn.sitePicker.methods.createStationDiv(jq,contain_div$,data,csdm);
	   						}else{
	   							//创建城市列表
	   							$.fn.sitePicker.methods.createCityDiv(jq,contain_div$,data);
	   						}
	   					}else if(type == CITY){
	   						//创建城市列表
		   					$.fn.sitePicker.methods.createCityDiv(jq,contain_div$,data);
	   					}else if(type == XZQ){
	   						var csdm = $(jq).data('paramsData').csdm;
	   						if(csdm){
	   							//创建站点列表
	   							$.fn.sitePicker.methods.createStationDiv(jq,contain_div$,data,csdm);
	   						}else{
	   							//创建城市列表
		   						$.fn.sitePicker.methods.createCityDiv(jq,contain_div$,data);
	   						}
	   					}
	   					div$.append(contain_div$);
	   					$(jq).after(div$);
	   				}
   				}
   			})
   		},
   		/**
		* 创建城市或者区域内容容器div
		* @method createCityDiv
		* @private
		* @param {Object} jq jquery对象 
		* @param {Object} obj jquery对象 生成div的容器
		* @param {Object} data 城市或者区域数据
		* @return  
		*/
   		createCityDiv:function(jq,obj,data){
   			var type = $(jq).data('paramsData').type;
   			var selectFirst = $(jq).data('paramsData').selectFirst;
			var datalist_hot_div$ = $(" <div class=\"data-list data-list-hot\"></div>");
			var city_ul$ = $("<ul class=\"clearfix\"></ul");
 					//获取数据
   			var value;
   			if(type == AREA){
   				value = data.areaValue;
   			}else{
   				value = data.cityValue;
   			}
   			$(jq).data("data-dm","");
			$(jq).data("data-dmnr","");
   			if(value.length>0){
	   			//遍历数据，创建li
				$(value).each(function(index,item){
					var text;
					if(type == AREA){
						text = item.qymc;
					}else{
						text = item.csmc;
					}
					var li$ = $("<li><a class=\"d-item\" href=\"javascript:void(0);\">"+text+"</a></li>");
					city_ul$.append(li$);
					//绑定点击事件
					li$.find('a').on('click',function(){
						//修改多选的点击事件
						if($(jq).data('paramsData').checkbox&&type == CITY ){
							if($(this).hasClass("selected")){
								$(this).removeClass('selected');
							}else{
								$(this).addClass('selected');
							}
						}else{
							$(jq).data("data-dm","");
							$(jq).data("data-dmnr","");
							$(this).parent().parent().find('a.selected').removeClass('selected');
							$(this).addClass('selected');
						}
			         /* $(this).parent().parent().find('a.selected').removeClass('selected');
						$(this).addClass('selected'); */
						if(type == CITY){
							//$(jq).val(item.csmc); 城市多选
							if(power.isEmpty($(jq).data("data-dm"))){
								$(jq).data("data-dm", new Array());
								$(jq).data("data-dmnr", new Array());
							}
							var index=$.inArray(item.csdm,$(jq).data("data-dm"));
							if(index >= 0){
								$(jq).data("data-dm").splice(index,1);
								$(jq).data("data-dmnr").splice(index,1);
							}else{
								$(jq).data("data-dm").push(item.csdm);
								$(jq).data("data-dmnr").push(item.csmc);
							}
							$(jq).data("data-type",CITY);
							$(jq).val($(jq).data("data-dmnr"));
	   						eval("var callBackFun ="+$(jq).data('paramsData').onSelect);
							callBackFun({DM:$(jq).data("data-dm"),DMNR:$(jq).data("data-dmnr"),TYPE:CITY});
						}else if(type == STATION){
							obj.find(".station").remove();
							var xzbh = item.csdm;
							//创建站点列表
							$(jq).data("data-dm","");
							$(jq).data("data-dmnr","");
							$.fn.sitePicker.methods.createStationDiv(jq,obj,data,xzbh);
						}else if(type == AREA){
							$(jq).val(item.qymc);
							$(jq).data("data-dm",item.qybh);
							$(jq).data("data-type",AREA);
	   						eval("var callBackFun ="+$(jq).data('paramsData').onSelect);
							callBackFun({DM:item.qybh,DMNR:item.qymc,TYPE:AREA});
						}else if(type == XZQ){
							obj.find(".station").remove();
							var xzbh = item.csdm;
							//创建行政区列表
							$(jq).data("data-dm","");
							$(jq).data("data-dmnr","");
							$.fn.sitePicker.methods.createStationDiv(jq,obj,data,xzbh);
						}
					})
				})
   			}else{
   				var li$ = $("<li><a class=\"d-item\" href=\"javascript:void(0);\">无数据</a></li>");
				city_ul$.append(li$);
				//绑定点击事件
				li$.find('a').on('click',function(){
			/*		if($(jq).data('paramsData').checkbox){
						if($(this).hasClass("selected")){
							$(this).removeClass('selected');
						}else{
							$(this).addClass('selected');
						}
					}else{}*/
					$(this).parent().parent().find('a.selected').removeClass('selected');
					$(this).addClass('selected');
					
					if(type == CITY){
						$(jq).val('无数据');
						$(jq).data("data-dm",'0000000000');
						$(jq).data("data-type",CITY);
   						eval("var callBackFun ="+$(jq).data('paramsData').onSelect);
						callBackFun({DM:'0000000000',DMNR:'无数据',TYPE:CITY});
					}else if(type == STATION){
						obj.find(".station").remove();
						var xzbh = '0000000000';
						//创建站点列表
						$.fn.sitePicker.methods.createStationDiv(jq,obj,data,xzbh);
					}else if(type == AREA){
						$(jq).val('无数据');
						$(jq).data("data-dm",'0000000000');
						$(jq).data("data-type",AREA);
   						eval("var callBackFun ="+$(jq).data('paramsData').onSelect);
						callBackFun({DM:'0000000000',DMNR:'无数据',TYPE:AREA});
					}else if(type == XZQ){
						obj.find(".station").remove();
						var xzbh = '0000000000';
						//创建行政区列表
						$.fn.sitePicker.methods.createStationDiv(jq,obj,data,xzbh);
					}
				})
   			}
			datalist_hot_div$.append(city_ul$);
			//将创建的div插入到obj中
			obj.append(datalist_hot_div$);
			//是否加载第一个元素的点击事件
			if(type == XZQ || type == STATION){
				city_ul$.find('li:first a').click();
			}else{
				if(selectFirst){
					city_ul$.find('li:first a').click();
				}
			}
   		},
   		/**
		* 创建行政区或者站点内容容器div
		* @method createStationDiv
		* @private
		* @param {Object} jq jquery对象 
		* @param {Object} obj jquery对象 生成div的容器
		* @param {Object} data 城市或者区域数据
		* @param {String} xzbh 行政编号
		* @return  
		*/
   		createStationDiv:function(jq,obj,data,xzbh){
   			//是否需要第一次加载
			var selectFirst = $(jq).data('paramsData').selectFirst;
			//类型
   			var type = $(jq).data('paramsData').type;
   			var value;
   			if(type == STATION){
   				value = data.staCityJson[0][xzbh];
   			}else if(type == XZQ){
   				value = data.xzqCityJson[0][xzbh];
   			}
			var datalist_div$ = $("<div class=\"data-list station\"></div>");
			var station_ul$ = $("<ul class=\"clearfix\"></ul");
			if(value.length>0){
				$(value).each(function(index,item){
					var text;
		   			if(type == STATION){
		   				text = power.isEmpty(item.cdjc)?item.cdmc:item.cdjc;
		   			}else if(type == XZQ){
		   				text = item.xzqmc;
		   			}
					var li$ = $("<li><a class=\"d-item\" href=\"javascript:void(0);\">"+text+"</a></li>");
					station_ul$.append(li$);
					//绑定点击事件
					li$.find('a').on('click',function(){
						if($(jq).data('paramsData').checkbox){
							if($(this).hasClass("selected")){
								$(this).removeClass('selected');
							}else{
								$(this).addClass('selected');
							}
						}else{
							$(jq).data("data-dm","");
							$(jq).data("data-dmnr","");
							$(this).parent().parent().find('a.selected').removeClass('selected');
							$(this).addClass('selected');
						}
				/*		$(this).parent().parent().find('a.selected').removeClass('selected');
						$(this).addClass('selected');*/
						if(type == STATION){
							//站点多选
							if(power.isEmpty($(jq).data("data-dm"))){
								$(jq).data("data-dm", new Array());
								$(jq).data("data-dmnr", new Array());
							}
							var index=$.inArray(item.cdbh,$(jq).data("data-dm"));
							if(index >= 0){
								$(jq).data("data-dm").splice(index,1);
								$(jq).data("data-dmnr").splice(index,1);
							}else{
								$(jq).data("data-dm").push(item.cdbh);
								$(jq).data("data-dmnr").push(item.cdmc);
							}
							$(jq).data("data-type",STATION);
							$(jq).val($(jq).data("data-dmnr"));
							eval("var callBackFun ="+$(jq).data('paramsData').onSelect);
							callBackFun({DM:$(jq).data("data-dm"),DMNR:$(jq).data("data-dmnr"),TYPE:STATION});
							/*$(jq).val(item.cdmc);
							$(jq).data("data-dm",item.cdbh);
	 						eval("var callBackFun ="+$(jq).data('paramsData').onSelect);
							callBackFun({DM:item.cdbh,DMNR:item.cdmc,TYPE:STATION});*/
						}else if(type == XZQ){
							//行政区多选
							if(power.isEmpty($(jq).data("data-dm"))){
								$(jq).data("data-dm", new Array());
								$(jq).data("data-dmnr", new Array());
							}
							var index=$.inArray(item.xzqdm,$(jq).data("data-dm"));
							if(index >= 0){
								$(jq).data("data-dm").splice(index,1);
								$(jq).data("data-dmnr").splice(index,1);
							}else{
								$(jq).data("data-dm").push(item.xzqdm);
								$(jq).data("data-dmnr").push(item.xzqmc);
							}
							$(jq).data("data-type",XZQ);
							$(jq).val($(jq).data("data-dmnr"));
							eval("var callBackFun ="+$(jq).data('paramsData').onSelect);
							callBackFun({DM:$(jq).data("data-dm"),DMNR:$(jq).data("data-dmnr"),TYPE:XZQ});
						/*	$(jq).val(item.xzqmc);
							$(jq).data("data-dm",item.xzqdm);
							$(jq).data("data-type",XZQ);
	 						eval("var callBackFun ="+$(jq).data('paramsData').onSelect);
							callBackFun({DM:item.xzqdm,DMNR:item.xzqjc,TYPE:XZQ});*/
						}
					})
				})
			}else{
				var li$ = $("<li><a class=\"d-item\" href=\"javascript:void(0);\">无数据</a></li>");
				station_ul$.append(li$);
				//绑定点击事件
				li$.find('a').on('click',function(){
					$(this).parent().parent().find('a.selected').removeClass('selected');
					$(this).addClass('selected');
					if(type == STATION){
						$(jq).data("data-type",STATION);
					}else if(type == XZQ){
						$(jq).data("data-type",XZQ);
					}
					$(jq).val('无数据');
					$(jq).data("data-dm",'999999999');
					eval("var callBackFun ="+$(jq).data('paramsData').onSelect);
					callBackFun({DM:'999999999',DMNR:'无数据',TYPE:STATION});
				})
			}
			datalist_div$.append(station_ul$);
			//将创建的div插入到obj中
			obj.append(datalist_div$);
			//是否需要加载第一个元素的点击事件
			if(selectFirst){
				station_ul$.find('li:first a').click();
			}
   		},
   		/**
		* 获取选中元素的数据
		* @method getSelectd
		* @param {Object} jq jquery对象 
		* @param {Object} undefined 预留参数
		* @return  {Object}
		* @example 
		
			var param = $("#main").sitePicker('getSelectd');
		*/
   		getSelected:function(jq,undefined){
		 	var param = {
		 		DM:$(jq).data('data-dm'),
		 		DMNR:$(jq).val(),
		 		TYPE:$(jq).data('data-type')
		 	}
		 	return param;
   		}
   };
})(jQuery)