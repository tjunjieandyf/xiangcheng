var echartsUtil = {
	/**
	 * 保存图片并跳转到图片收藏
	 */
	saveAsImg : function(p1, p2){
		option = p1.getOption();
		option.animation = false;
		p1.setOption(option);
		var picBase64Info = p2.getDataURL();
		$.ajax({
			url:saveEchartsImgUrl_base64,
			type:"POST",
			data:{
				picBase64Info:picBase64Info
			},
			success:function(data){
				var param = {
						URL:data
				};
				gas.imgCollect(param);
			},
			error:function(data){
				
			}
		});
	},
	/**
	 * echarts初始化函数
	 * 
	 * @param divId
	 *            需初始化的div的id
	 */
	init : function(divId, theme) {
		return echarts.init(document.getElementById(divId), power
				.isEmpty(theme) ? 'custom' : theme);
	},
	/**
	 * echarts显示加载中函数
	 * 
	 * @param echartObj
	 *            echarts实例对象
	 */
	showLoading : function(echartObj) {
		echartObj.showLoading({
			effect : 'whirling',
			text : '正在努力的读取数据中...' // loading话术
		});
	},
	/**
	 * echarts隐藏加载中函数
	 * 
	 * @param echartObj
	 *            echarts实例对象
	 */
	hideLoading : function(echartObj) {
		echartObj.hideLoading();
	},
	/**
	 * ajax相关操作(暂负责单个统计图ajax请求的操作)
	 * 
	 * echartsUtil.echartsAjaxLoad:function({ echartDivId:'xxx',
	 * ajax_url:'xxxx', ajax_Entity：{method:"test",adminId:"test01"} });
	 * 
	 * @param requestEntity
	 *            参数 如：{method:"test",adminId:"test01"}
	 */
	echartsAjaxLoad : function(requestEntity) {

		var echartObj = this.init(requestEntity.echartDivId);
		this.showLoading(echartObj);
		// 默认回调函数
		requestEntity.ajax_Entity.callBackFun = "echartsUtil.ecCallBackFun";
		// 回调函数的json对象参数,ec_key_id：echarts实例对象的id
		requestEntity.ajax_Entity.callBackParams = {
			ec_key_id : echartObj.id,
			chartType : requestEntity.chartType,
			remark : requestEntity.remark
		};
		// 异步
		requestEntity.ajax_Entity.ajax_async = true;
		ewaq.ajaxRequest(requestEntity.ajax_url, requestEntity.ajax_Entity);
	},
	/**
	 * ajax回调函数
	 * 
	 * @param data
	 *            ajax返回json对象
	 * @param echartObj
	 *            返回参数
	 */
	ecCallBackFun : function(data, echartObj) {
		var ecObj = echarts.getInstanceById(echartObj.ec_key_id);
		if (echartObj.chartType) {
			if (echartObj.chartType == 'line') {
				if (echartObj.remark == 'AQI') {
					ecObj.setOption(echartsUtil.line_AQI(data.result));
				} else {
					ecObj.setOption(echartsUtil.line_default(data.result));
				}
			} else if (echartObj.chartType == 'bar') {
				ecObj.setOption(echartsUtil.bar_default(data.result));
			} else if (echartObj.chartType == 'radar') {
				ecObj.setOption(echartsUtil.radar_default(data.result));
			} else {
				ecObj.setOption(echartsUtil.line_fault(data.result));
			}
		}

		echartsUtil.hideLoading(ecObj);
	}
};
// 默认样式
echartsUtil.def = {
	// 工具箱
	toolbox : {
		feature : {
			/*myTool1:{//注意，自定义的工具名字，只能以 my 开头，例如下例中的 myTool1，myTool2：
	            show:(("undefined" == typeof imgCollectVisible) ? parent.imgCollectVisible:imgCollectVisible) == "false" ? false:true,//是否显示    
	            title:'图片收藏', //鼠标移动上去显示的文字    browserAddress
	            icon:'image://' + ctx + '/skins/default/images/gas/wbqxsj/echartsImgCollect.png', //图标    
	            option:{},    
	            onclick:function(p1, p2, p3, p4) {
	            	echartsUtil.saveAsImg(p1, p2);
	            }    
	        },*/
			dataZoom : {
				backgroundColor:'green',
				show : true,
				title : {
					dataZoom : "区域缩放",
					dataZoomReset : "区域缩放后退"
				}
			},
			magicType : {
				show : true,
				title : {
					bar : "柱形图切换",
					line : "折线图切换",
					stack : "堆积",
					tiled : "平铺"
				},
				type : [ "line", "bar", "stack", "tiled" ]
			},
			restore : {
				show : true,
				title : "还原"
			},
			saveAsImage : {
				lang : [ "点击保存" ],
				show : true,
				title : "保存为图片",
				type : "png"
			}
		},
		orient : "horizontal",
		show : true,
		right : "3.5%",
		y : "top"
	},
	toolbox_right : {
		feature : {
			/*myTool1:{//注意，自定义的工具名字，只能以 my 开头，例如下例中的 myTool1，myTool2：
	            show:(("undefined" == typeof imgCollectVisible) ? parent.imgCollectVisible:imgCollectVisible) == "false" ? false:true,//是否显示    
	            title:'图片收藏', //鼠标移动上去显示的文字    browserAddress
	            icon:'image://' + ctx + '/skins/default/images/gas/wbqxsj/echartsImgCollect.png', //图标    
	            option:{},    
	            onclick:function(p1, p2, p3, p4) {    
	            	echartsUtil.saveAsImg(p1, p2);
	            }    
	        },*/
			dataZoom : {
				backgroundColor:'green',
				show : true,
				title : {
					dataZoom : "区域缩放",
					dataZoomReset : "区域缩放后退"
				}
			},
			magicType : {
				show : true,
				title : {
					bar : "柱形图切换",
					line : "折线图切换",
					stack : "堆积",
					tiled : "平铺"
				},
				type : [ "line", "bar", "stack", "tiled" ]
			},
			restore : {
				show : true,
				title : "还原"
			},
			saveAsImage : {
				lang : [ "点击保存" ],
				show : true,
				title : "保存为图片",
				type : "png"
			}
		},
		orient : "vertical",
		show : true,
		right : 5,
		y : "center"
	},
	dataZoom : [ {
		backgroundColor : 'rgba(47,69,84,0)',
		fillerColor : 'rgba(167,183,204,0.4)',
		end : 100,
		start : 0,
		/*
		 * startValue:0, endValue:20,
		 */
		/* maxSpan:40, */
		type : "slider",
		left : '35%',
		right : '35%',
		bottom : '0%',
		handleIcon : 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
		handleSize : '80%',
		handleStyle : {
			color : '#fff',
			shadowBlur : 3,
			shadowColor : 'rgba(0, 0, 0, 0.6)',
			shadowOffsetX : 2,
			shadowOffsetY : 2
		}
	} ],
	tooltip : {
		trigger : 'axis',
		show : true
	},
	setTitle :function (text,subtext,btwz ){
   		return {
    		//水平安放位置 居中
    		x : power.isEmpty(btwz)?'center':btwz,
    		//主标题文本样式
    		textStyle : {
    			fontSize : 14,
    			fontWeight : 'bolder',
    			fontFamily : 'Microsoft YaHei'
    		},
    		text : text,
    		subtext : subtext
    	};
   	},
	/**
   	 * 设置图例
   	 * 
   	 * @param data 图例数组
   	 * @returns legend
   	 */
   	setLegend : function(data){//图例
   		return {
    		show : true,
    		x : 'center',//设置主题
    		y : "bottom",
    		data : data
    		
    	};
   	}
}
/**
 * 空气质量AQI 折线图自定义样式,带有空气指标背景色
 * 
 * @param data 返回的json对象
 *           
 */
echartsUtil.line_AQI = function(result) {
	console.log(result)
	var option = {
		// 工具箱
		title : {
			text : result.title.text,
			textStyle : {
				fontSize : 16
			},
			left : '4%',
			top : 4
		},
		color:["#37B70C"],
		toolbox : echartsUtil.def.toolbox,
		dataZoom : echartsUtil.def.dataZoom,
		tooltip : echartsUtil.def.tooltip,
		legend : {
			top : 5,
			itemWidth : 27,
			itemHeight : 17,
			data : getLegendData(result),
			selected : getLegendSelect(result)
		},
		grid : {
			top : result.legend == undefined ? '11%' : '15%',
			left : '2%',
			right : '4%',
			bottom : '15%',
			containLabel : true
		},
		xAxis : getXAxis(result),
		yAxis : getAQIYAxis(result),
		series : getAQILineSeries(result)
	}
	return option;
}

/**
 * 空气质量 PM2.5,PM10,O3,NO2,SO2,CO 折线图通用自定义样式
 * 
 * @param 返回的json对象
 * 
 */
echartsUtil.line_default = function(result) {

	var option = {
		// 工具箱
		title : {
			text : result.title.text,
			textStyle : {
				fontSize : 16
			},
			left : '4%',
			top : 4
		},
		toolbox : echartsUtil.def.toolbox,
		dataZoom : echartsUtil.def.dataZoom,
		tooltip : echartsUtil.def.tooltip,
		legend : {
			top : 5,
			itemWidth : 27,
			itemHeight : 17,
			data : getLegendData(result),
			selected : getLegendSelect(result)
		},
		grid : {
			top : '15%',
			left : '2%',
			right : '3%',
			bottom : '12%',
			containLabel : true
		},
		xAxis : getXAxis(result),
		yAxis : getYAxis(result),
		series : getDefaultLineSeries(result)
	}
	return option;
}

/**
 * 空气质量 PM2.5,PM10,O3,NO2,SO2,CO 折线图通用自定义样式2 适用于高度300PX及以下折线图 该方法无dataZoom组件
 * 
 * @param data 返回的json对象
 *            
 */
echartsUtil.line_default_small = function(result) {

	var option = {
		// 工具箱
		toolbox : {
			feature : {
				dataZoom : {
					show : true,
					title : {
						dataZoom : "区域缩放",
						dataZoomReset : "区域缩放后退"
					}
				},
				magicType : {
					show : true,
					title : {
						bar : "柱形图切换",
						line : "折线图切换",
						stack : "堆积",
						tiled : "平铺"
					},
					type : [ "line", "bar", "stack", "tiled" ]
				},
				restore : {
					show : true,
					title : "还原"
				},
				saveAsImage : {
					lang : [ "点击保存" ],
					show : true,
					title : "保存为图片",
					type : "png"
				}
			},
			orient : "horizontal",
			show : true,
			right : 8,
			y : "top"
		},
		title : {
			text : result.title.text,
			textStyle : {
				fontSize : 16
			},
			left : 20,
			top : 4
		},
		tooltip : echartsUtil.def.tooltip,
		legend : {
			left : 'center',
			bottom : 0,
			width : '100%',
			itemWidth : 24,
			itemHeight : 13,
			/* itemGap:8, */
			textStyle : {
				fontSize : 13
			},
			data : getLegendData(result),
			selected : getLegendSelect(result)
		},
		grid : {
			top : 35,
			left : 40,
			right : 20,
			bottom : 45,
			containLabel : false
		},
		xAxis : getXAxis(result),
		yAxis : getYAxis(result),
		series : getDefaultLineSeries(result)
	}
	return option;
}

/**
 * 柱状图通用样式
 * 
 * @param data 返回的json对象
 * 
 */
echartsUtil.bar_default = function(result) {

	var option = {
		title : {
			text : result.title.text,
			textStyle : {
				fontSize : 16
			},
			left : 20,
			top : 4
		},
		toolbox : echartsUtil.def.toolbox,
		tooltip : echartsUtil.def.tooltip,
		legend : {
			right : 'center',
			bottom : 0,
			width : '100%',
			itemWidth : 24,
			itemHeight : 13,
			/* itemGap:8, */
			textStyle : {
				fontSize : 13
			},
			selected : getLegendSelect(result),
			data : getLegendData(result)
		},
		grid : {
			top : '15%',
			left : 40,
			right : 25,
			bottom : 45,
			containLabel : false
		},
		xAxis : getXAxis(result),
		yAxis : getYAxis(result),
		series : getDefaultBarSeries(result)

	}

	return option;
}

/**
 * 仪表盘通用样式
 * 
 * @param data
 *            数组对象
 */
echartsUtil.gauge_default = function(result) {

	var option = {
		title : {
			text : result.title.text,
			textStyle : {
				fontSize : 14
			}
		},
		toolbox : {
			orient : 'horizontal',
			show : true,
			x : 'right',
			feature : {
				saveAsImage : {
					lang : [ '点击保存' ],
					show : true,
					title : '保存为图片',
					type : 'png'
				}
			}
		},
		tooltip : {
			trigger:'item',
			show:true
		},
		series : result.series ? result.series : []
	}

	return option;
}
/**
 * 玫瑰图(雷达图)通用样式
 * 
 * @param data
 *            数组对象
 */
echartsUtil.radar_default = function(result) {

	var radar = [ {
		radius : '68%',
		splitNumber : 8,
		axisLine : {
			lineStyle : {
				color : 'black',
				opacity : .2
			}
		},
		splitLine : {
			lineStyle : {
				color : 'black',
				opacity : .2
			}
		},
		splitArea : {
			areaStyle : {
				color : 'rgba(127,95,132,.3)',
				opacity : 1,
				shadowBlur : 45,
				shadowColor : 'rgba(0,0,0,.5)',
				shadowOffsetX : 0,
				shadowOffsetY : 15,
			}
		},
		indicator : []
	} ];
	// 2.0雷达图使用的坐标属性是polar,3.0已变更为radar
	if (result.polar) {
		/*radar=result.polar;*/
		radar[0].indicator = result.polar[0].indicator;
	} else if (result.radar) {
	/*	radar=result.radar;*/
		radar[0].indicator = result.radar[0].indicator;
	}

	var option = {
		title : {
			text : result.title ? result.title.text : "",
			textStyle : {
				color : '#000',
				fontFamily : 'Microsoft YaHei',
				fontSize : 14
			},

			top : 2,
			left : 'center'
		},
/*		color : [ '#ef4b4c', '#b1eadb' ],*/
	/*	backgroundColor : {
			type : 'radial',
			x : 0.4,
			y : 0.4,
			r : 0.35,
			colorStops : [ {
				offset : 0,
				color : '#895355' // 0% 处的颜色
			}, {
				offset : .4,
				color : '#593640' // 100% 处的颜色
			}, {
				offset : 1,
				color : '#39273d' // 100% 处的颜色
			} ],
			globalCoord : false
		},*/
		tooltip : {
			show : true,
			trigger : 'item'
		},
		legend : {
			left : 'center',
			bottom : 2,
			textStyle : {
				color : 'black'
			},
			data : getLegendData(result)
		},
		radar : radar,
		series : result.series ? result.series : []
	};
	return option;
}

// 获取legend中的data,统一设置icon为圆角矩形
function getLegendData(result) {
	var len = [];
	if (result.legend) {
		for (var i = 0; i < result.legend.data.length; i++) {
			len.push({
				name : result.legend.data[i],
				icon : 'roundRect'
			})
		}
	}
	return len;
}
// 筛选series中数据为0的系列，默认不显示
function getLegendSelect(result) {
	var selected = {};
	for (var i = 0; i < result.series.length; i++) {
		if (result.legend) {
			if (result.series[i].data) {
				if (result.series[i].data.length < 1/* &&result.series[i].data[0]=='0' */) {
					selected[result.legend.data[i]] = false;
				} else {
					selected[result.legend.data[i]] = true;
				}
			}
		}
	}
	return selected;
}

// 设置AQI 图例 MarkLine背景色数组
function getAQIMarkLineData() {
	var markLineData = [];
	for (var i = 0; i < 6; i++) {
		markLineData.push({
			name : '轻度污染',
			yAxis : 50,
			symbolSize : 0,
			label : {
				normal : {
					show : true
				}
			},
			lineStyle : {
				normal : {
					width : 0,
					color : 'red'
				},
				emphasis : {
					width : 2
				}
			}
		})
	}
	markLineData[0].name = '优';
	markLineData[0].yAxis = 50;
	markLineData[0].lineStyle.normal.color = '#179DDE';
	markLineData[0].lineStyle.emphasis.color = '#B3FFB3';

	markLineData[1].name = '良';
	markLineData[1].yAxis = 100;
	markLineData[1].lineStyle.normal.color = '#179DDE';
	markLineData[1].lineStyle.emphasis.color = '#FFFFB3';

	markLineData[2].name = '轻度污染';
	markLineData[2].yAxis = 150;
	markLineData[2].lineStyle.normal.color = '#179DDE';
	markLineData[2].lineStyle.emphasis.color = '#F5AF67';

	markLineData[3].name = '中度污染';
	markLineData[3].yAxis = 200;
	markLineData[3].lineStyle.normal.color = '#179DDE';
	markLineData[3].lineStyle.emphasis.color = '#FC2E43';

	markLineData[4].name = '重度污染';
	markLineData[4].yAxis = 300;
	markLineData[4].lineStyle.normal.color = '#179DDE';
	markLineData[4].lineStyle.emphasis.color = '#cc00cc';

	markLineData[5].name = '严重污染';
	markLineData[5].yAxis = 400;
	markLineData[5].lineStyle.normal.color = '#179DDE';
	markLineData[5].lineStyle.emphasis.color = '#990000';
	return markLineData;
}

// 加载line属性的series,并设置AQI markLine
function getAQILineSeries(result) {
	var sers = [];
	for (var i = 0; i < result.series.length; i++) {
		sers.push({
			name : result.series[i].name,
			type : 'line',
			stack : '总量' + i,
			markPoint : {
				symbol : 'pin',
				silent : true,
				label : {
					normal : {
						show : true
					}
				},
				data : [ {
					type : 'max',
					name : '最大值'
				} /*
					 * , { type: 'min', name: '最小值' }
					 */]
			},
			markLine : {
				animation : false,
				silent : true,
				symbolSize : 0,
				label : {
					normal : {
						formatter : '{b}'
					}
				},
				data : getAQIMarkLineData()
			},
			data : result.series[i].data
		})
	}
	return sers;
}


//加载默认line图例的series
function getDefaultLineSeries(result) {

	var sers = [];
	for (var i = 0; i < result.series.length; i++) {
		sers.push({
			name : result.series[i].name,
			type : 'line',
			stack : '总量' + i,
			markPoint : {
				symbol : 'pin',
				silent : true,
				label : {
					normal : {
						show : true
					}
				},
				data : [ {
					type : 'max',
					name : '最大值'
				} ]
			},
			data : result.series[i].data
		})
	}
	
	return sers;
}

//加载默认bar图例的series
function getDefaultBarSeries(result) {
	var sers = [];
	for (var i = 0; i < result.series.length; i++) {
		sers.push({
			name : result.series[i].name,
			type : 'bar',
			stack : '总量' + i,
			data : result.series[i].data
		})
	}
	return sers;
}

// 根据数据加载X轴
function getXAxis(result) {
	var xA = [];
	if(result.yAxis&&result.yAxis instanceof Array){
		for (var i = 0; i < result.xAxis.length; i++) {
			xA.push({
				name:result.xAxis[i].name?result.xAxis[i].name:'',
				type : 'category',
				boundaryGap : false,
				splitLine : {
					show : true
				},
				data : result.xAxis[i].data
			})
		}
	}
	return xA;
}

//根据数据加载Y轴
function getYAxis(result) {
	var yA = [];
	if(result.yAxis&&result.yAxis instanceof Array){
		for (var i = 0; i < result.yAxis.length; i++) {
			yA.push({
				name:result.yAxis[i].name?result.yAxis[i].name:null,
				type : result.yAxis[i].type?result.yAxis[i].type:null,
				scale : true,
				min:result.yAxis[i].min?result.yAxis[i].min:null,
				max:result.yAxis[i].max?result.yAxis[i].max:null,		
				splitLine : {
					show : true
				},
				data : result.yAxis[i].data?result.yAxis[i].data:null
			})
		}
	}	

	return yA;
}

//根据AQI数据加载Y轴,并设置背景色区域
function getAQIYAxis(result) {
	var yA = [];
	var max=getMaxY(result.series);
	if(result.yAxis&&result.yAxis instanceof Array){
		for (var i = 0; i < result.yAxis.length; i++) {
			yA.push({
				name:result.yAxis[i].name?result.yAxis[i].name:null,
				type : result.yAxis[i].type?result.yAxis[i].type:null,
				scale : true,
				minInterval : 50,
				interval : 50,
				min : 0,
				max : Math.round(max / 50) * 50 + 50,
				splitArea : {
					show : true,
					areaStyle : {

						/*color : [ "#B3FFB3", "#FFFFB3", "#F5AF67", "#FC2E43",
								"#cc00cc", "#cc00cc", "#990000", "#990000", "#990000", "#990000", "#990000", "#990000" ]*/
					}
				},
				data : result.yAxis[i].data?result.yAxis[i].data:null
			})
		}
	}
	return yA;
}

// 特殊方法   求出series数组中最大的数据，方便AQI图例中y轴显示刻度
function getMaxY(series) {
	var max = 0;
	if (series[0].data) {
		for (var i = 0; i < series.length; i++) {
			for (var j = 0; j < series[i].data.length; j++) {

				if (max < parseInt(series[i].data[j])) {
					max = parseInt(series[i].data[j]);
				}

			}
		}
	}
	return max;
}
