var Index = new Vue({
	el: '#app',
	data(){ 
		return {
			radiaNum: 1,
			pickerOptionsEnd: {
                disabledDate: time => {
                    var beginDateVal = new Date(date.getTime());
                    if (beginDateVal) {
                        return (
                            time.getTime() >
                            new Date(beginDateVal).getTime()
                        );
                    }
                },
            },
			regionType: qyxz,//区域内 区域外 outside
			time: [new Date(date.getTime() - 24*60*60*1000), new Date(date.getTime() + 0*60*60*1000)],
			pollutionType: 'o3',
			result: '',
			ldtlx :'',
			src: 'http://202.104.140.36:8899/gas_weather/ewaq/trace/index.jsp?&cityOrStation=code&code=360300',
			insideSrc: ''
		}
	},
	watch: {
		pollutionType: 'renderRightRegion'
	},
	mounted: function(){
		
		
		var self = this;
//		$('#cityList').areaChioce({
//			xzqhdm:"", 
//			checkBox:"", 
//			type:"",				
//			onSelect:function(params){
//				name = params.text;
//				bh = params.dm;
//				STtype = params.lb;
//				Index.renderRegion();
//			},
//			width:280,
//			height:250
//		});
		$("#cityList").on("change",function() {
					name =  $("#cityList").find("option:selected").text();
					bh = $(this).val();
					Index.renderRegion();
					var statime=self.time[1].format("yyyy-MM-dd hh") + ':00:00';
					for(var i=0;i<zdxx.length;i++){
						if(zdxx[i].ZDBH==bh){
							JD=zdxx[i].JD;
							WD=zdxx[i].WD;
							FX=zdxx[i].FX;
							FS=zdxx[i].FS;
//							statime=zdxx[i].jcsj;
						}
					}
					data = {
				            type: 'param',
				            GIS: {
				                centerY: WD, //必须
				                warmingType: 2,
				                centerX: JD, //必须
				                JGJB: 1,
				                time: statime, //必须
				                windDirection: FX, //必须
				                winVelocity: FS //必须
				            }
				        };
					$('#insideBox')[0].contentWindow.postMessage(data, '*'); 
				});
		
		console.log(12);
		var self = this;
//		setTimeout(function(){
//			$('.divider a').each(function(){
//				var dm = $(this).attr('dm');
//				if(dm == CDBH){
//					$(this).click();
//					setTimeout(function(){
//						var startDate = self.time[0].format("yyyy-MM-dd hh") + ':00:00';
//						var endDate = self.time[1].format("yyyy-MM-dd hh") + ':00:00';
//						var insideSrc = 'http://202.104.140.38:81/YBYJ_JX_PX/index2.html?mod=RoundCheck&config=config-round2.json&kqzdmc='+name+'&startDate='+startDate+'&endDate='+endDate+'&lastDate='+lastDate
//						$('#insideBox').attr('src', insideSrc);
//					})
//				}
//			})
//		},1000)
		
		
		this.bindJqEvent();
	},
	methods: {
		bindJqEvent: function(){
			$(".px-pop .title i.close").click(function () {
		        $(".px-pop,.mask").fadeOut("fast")
		    })
		    //点击切换样式
		    $(".px-message .btn,.px-map-table-cut ul li,.px-map-cut ul li").click(function () {
		        $(this).addClass("on").siblings().removeClass("on")
		    });
		    //点击疑问图标出现弹窗
		    $(".px-item h3 i.query").click(function () {
		        $(this).find('.px-query-mess').fadeToggle("fast")
		    });
		},
		replacePltName : function(value) {
	        value = value || '';
	        var labelObj = {
	            'PM2.5': 'PM₂.₅',
	            PM25: 'PM₂.₅',
	            PM10: 'PM₁₀',
	            O3: 'O₃',
	            NO2: 'NO₂',
	            SO2: 'SO₂'
	        };
	        return value.replace(/[A-Z]+[0-9]+\.*[0-9]*/g, function() {
	            return labelObj[arguments[0]] || arguments[0];
	        });
	    },  
		//渲染区域
		renderRegion: function(){
			var self = this;	
			var startDate = self.time[0].format("yyyy-MM-dd hh") + ':00:00';
			var endDate = self.time[1].format("yyyy-MM-dd hh") + ':00:00';
			
			if(startTime){
				startDate = startTime;
				endDate = endTime;
			}
			$.ajax({
				//url: 'http://192.168.3.55:3000/mock/225/air/areaInside',
				url:  getQXXX,
				data: {
					startDate: startDate,
					endDate: endDate
				},
				dataType: 'json',
				success: function(data){
					FX=data.data.FX;
					FS=data.data.FS;
					console.log(data);
					data = {
				            type: 'param',
				            GIS: {
				                centerY: WD, //必须
				                warmingType: 2,
				                centerX: JD, //必须
				                JGJB: 1,
				                time: endDate, //必须
				                windDirection: FX, //必须
				                winVelocity: FS //必须
				            }
				        };
					$('#insideBox')[0].contentWindow.postMessage(data, '*');
				}
			});
			
			
			
			if(this.regionType == 'outside'){
				$(".timer").hide();
				$("#cityList").hide();
				var src = this.src+"&startTime="+self.time[0].format("yyyy-MM-dd");
				this.$nextTick(function(){
					$('#iframeBox').attr('src', src)
				})
				
				// 渲染外区域右侧区域
//				this.renderOutsideRegion();
			}else{
				$(".timer").show();
				$("#cityList").show();
				this.renderInsideRegion();
			}
		},
		changeRegionType: function(type){
			this.regionType = type;
			
			
			
			//渲染区域
			this.renderRegion();
		},
		//渲染内区域
		renderInsideRegion:function(){
			var self = this;
			var startDate = self.time[0].format("yyyy-MM-dd hh") || '';
			var endDate = self.time[1].format("yyyy-MM-dd hh") || '';
			
			if(startTime){
				startDate = startTime;
				endDate = endTime;
			}
			$.ajax({
				//url: 'http://192.168.3.55:3000/mock/225/air/areaInside',
				url:  drawStationFxBhqs,
				data: {
					cdbh: bh,
					startDate: startDate,
					endDate: endDate,
					type: STtype
				},
				dataType: 'json',
				success: function(data){
					self.result = data.data.result;
					self.ldtlx = data.data.ldtlx;
					//处理下标开始
					var airLegendData = [];
					data.data.airLegendData.forEach(function(item){
						airLegendData.push(self.replacePltName(item));
					})
					data.data.airLegendData = airLegendData;
					
					var pollutionLegendData = [];
					data.data.pollutionLegendData.forEach(function(item){
						pollutionLegendData.push(self.replacePltName(item));
					})
					data.data.pollutionLegendData = pollutionLegendData;
					//处理下标结束
					
					
					self.renderAirChart(data.data, 'air', 'airChart');
					self.renderWindChart(data.data);
					self.renderAirChart(data.data, 'pollution', 'pollutionChart');
					// 几个echats关联
					echarts.connect(
							[self.airChart,
							 self.pollutionChart,
							 self.windChart
							 ])
					// 判断几个雷达图	 
					self.radiaNum = Math.ceil(data.data.radarChart.length/ 4);
	
					self.$nextTick(function(){
						// 挂载节点	 
						 data.data.radarChart.forEach(function(item, index){
							 self.renderRadia( $('.bg-purple').eq(index), item);
						 })
					})
				}
			})
		},
		renderRadia: function(ele, data){
			var self = this;
			var indicator = [];
			data.indicator.forEach(function(item){
				item.name = self.replacePltName(item.name);
				indicator.push(item)
			})
			
			var myChart = echarts.init(ele[0]);
			option = {
				"color": ["#68cffe", "#49a1fe", "#65c233", "#f2b71d", "#9600e2", "#e73f60", "#9f9f9f"],
			    title: {
			        text: data.type,
			        subtext: data.date,
			        bottom: '0%',
			        right: 'center',
			        textStyle: {
			        	fontSize: 14,
			        	color: '#fff'
			        }
			    },
			    tooltip: {
			    	position: 'center'
			    },
			    legend: {
			    	itemWidth:10,
			    	right: 0,
			    	itemHeight: 10,
			        data: data.legendData,
			        textStyle:{
//			            color:'#707070',
			        	color: '#fff',
			            fontSize:12
			        }
			    },
			    grid: {
			    	top: '10%',
			    	bottom: '10%',
			    },
			    radar: {
			    	radius: '35%',
			        // shape: 'circle',
			        name: {
			            textStyle: {
			                color: '#fff',
			                backgroundColor: '#999',
			                borderRadius: 3,
			                padding: [3, 5]
			           }
			        },
			        indicator: indicator
			    },
			    series: [{
			        name: '',
			        type: 'radar',
			        // areaStyle: {normal: {}},
			        data : data.seriesData
			    }]
			}
			myChart.setOption(option)
		},
		// 渲染空气图
		renderAirChart: function(data, type, id){	
			var self = this;
			var myChart = echarts.init(document.getElementById(id));
			var seriesData = [];
			var legendData = [];
			if(type == 'air'){
				// 统一控制返回的提示
				var formatter = function(params) {
		        	var index = params[0].dataIndex;
		        	var returnHtml = params[0].name + '时<br />';
		        	params.forEach(function(item){
		        		if(item.seriesName == 'CO'){
		        			returnHtml += item.marker + item.seriesName + '：' + item.value + 'mg/m³<br />';
		        		}else if(item.seriesName == 'AQI'){
		        			returnHtml += item.marker + item.seriesName + '：' + item.value + '<br />';
		        		}else{
		        			returnHtml += item.marker + item.seriesName + '：' + item.value + 'ug/m³<br />';
		        		}
		        	})
		        	
		            return returnHtml + [
		                '风速：' + data.windData[index] + 'm/s',
		                '风向：' + self.selectWindName(data.windArrowData[index]),
		                '温度：' + data.temperatureData[index] + '℃',
		                '湿度：' + data.pressureData[index]+'%',
		                self.replacePltName('PM25/PM10：') + data.pollutionSeriesData[0][index],
		                self.replacePltName('SO2/NO2：') + data.pollutionSeriesData[1][index],
		                '雷达特征图：' + data.radarChart[index].type
		            ].join('<br>');
		        }
				legendData = data.airLegendData
				var yAxis = [{
			    	name: 'ug/m³',
			        type: 'value',
			        axisLabel: {
			            textStyle: {
			                fontSize: 12,
//			                color: '#4D4D4D'
			                color: '#fff'
			            }
			        },
			        axisLine: {
			        	show: false,
			            lineStyle: {
//			                color: '#707070'
			            	color: '#fff'
			            }
			        }
			    },{
			    	name: 'CO（ mg/m³）',
			        type: 'value',
			        axisTick: { //刻度值线
			            show: false
			        },
			        splitLine: { //网格线
			            show: false
			        },
			        axisLabel: {
			            textStyle: {
			                fontSize: 12,
			                color: '#fff'
//			                color: '#4D4D4D'
			            }
			        },
			        axisLine: {
			        	show: false,
			            lineStyle: {
			            	color: '#fff'
//			                color: '#707070'
			            }
			        }
			    }]
				
				data.airSeriesData.forEach(function(item, index){
					if(data.airLegendData[index] == 'CO'){
						seriesData.push({
							"yAxisIndex": "1",
							name: data.airLegendData[index],
				            smooth:true, //平滑
				            symbol:'none',
				            type:'line',
				            data:item
						})
					}else{
						seriesData.push({
							"yAxisIndex": "0",
							name: data.airLegendData[index],
				            smooth:true, //平滑
				            symbol:'none',
				            type:'line',
				            data:item
						})
					}
					
				})
				var axisLabelType = false;
				this.airChart = myChart;
			}else{
				var formatter = function(params) {
		        	var index = params[0].dataIndex;
		        	return '';
		        }
				data.pollutionSeriesData.forEach(function(item, index){
					seriesData.push({
						name: data.pollutionLegendData[index],
			            smooth:true, //平滑
			            symbol:'none',
			            type:'line',
			            data:item
					})
				})
				var axisLabelType = true;
				legendData = data.pollutionLegendData
				this.pollutionChart = myChart;
				var yAxis = {
			        type: 'value',
			        axisLabel: {
			            textStyle: {
			                fontSize: 12,
			                color: '#fff'
//			                color: '#4D4D4D'
			            }
			        },
			        axisLine: {
			        	show: false,
			            lineStyle: {
			            	color: '#fff'
//			                color: '#707070'
			            }
			        }
			    }
			}
			var preditDate = data.preditDate;
			seriesData.push({
			        name: '平行于y轴的趋势线',
			        type: 'line',
			        color: ['black'],
			        markLine: {
			            data: [
			                [{
			                    symbol: "line",
			                    coord: [preditDate, 0]
			                }, {
			                    symbol: "line",
			                    coord: [preditDate, 1]
			                }]
			            ]
			        }
			    })
			
			
			var option = {
				"color": ["#68cffe", "#49a1fe", "#65c233", "#f2b71d", "#9600e2", "#e73f60", "#9f9f9f"],
			    tooltip: {
			    	position: 'bottom',
			        trigger: 'axis',
			        position: function (point, params, dom, rect, size) {
			        	  // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
			        	  // 提示框位置
			        	  var x = 0; // x坐标位置
			        	  var y = 0; // y坐标位置
			        	 
			        	  // 当前鼠标位置
			        	  var pointX = point[0];
			        	  var pointY = point[1];
			        	 
			        	  // 外层div大小
			        	  // var viewWidth = size.viewSize[0];
			        	  // var viewHeight = size.viewSize[1];
			        	 
			        	  // 提示框大小
			        	  var boxWidth = size.contentSize[0];
			        	  var boxHeight = size.contentSize[1];
			        	 
			        	  // boxWidth > pointX 说明鼠标左边放不下提示框
			        	  if (boxWidth > pointX) {
			        	    x = 5;
			        	  } else { // 左边放的下
			        	    x = pointX - boxWidth;
			        	  }
			        	 
			        	  // boxHeight > pointY 说明鼠标上边放不下提示框
			        	  if (boxHeight > pointY) {
			        	    y = 5;
			        	  } else { // 上边放得下
			        	    y = pointY - boxHeight;
			        	  }
			        	 
			        	  return [x, y];

			        },
			        formatter: formatter
			    },
			   
			    legend: {
			        data: legendData,
			        right:'150',
			        textStyle:{
			        	color: '#fff',
//			            color:'#707070',
			            fontSize:12
			        }
			    },
			    grid : {
			    	left : '70',
			        top : '25%',
			        bottom : '25%'
			    },
			    dataZoom: {
			    	show: axisLabelType,
			        bottom: '0',
			        height: '20',
			        end: 100
			    },
			    xAxis: {
			        type: 'category',
			        data: data.xAxisData,
			        axisTick: {
			            show: false,
			            color: '#fff'
//			            color: '#4D4D4D'
			        },
			        axisLabel: {
			        	show: axisLabelType,
			            textStyle: {
			                fontSize: 14,
			                color: '#fff'
//			                color: '#4D4D4D'
			            }
			        },
			        axisLine: {
			        	show: false,
			            lineStyle: {
			            	color: '#fff'
//			                color: '#4D4D4D'
			            }
			        }
			    },
			    yAxis: yAxis,
			    series: seriesData
			}
			myChart.setOption(option)
			
			
		},
		selectWindName : function(name) {
	        var obj = {
	            W: '西风',
	            WSW: '西南偏西',
	            SW: '西南风',
	            SSW: '西南偏南',
	            S: '南风',
	            SSE: '东南偏南',
	            SE: '东南风',
	            ESE: '东南偏东',
	            E: '东风',
	            ENE: '东北偏东',
	            NE: '东北风',
	            NNE: '东北偏北',
	            N: '北风',
	            NNW: '西北偏西',
	            NW: '西北风',
	            WNW: '西北偏西'
	        };
	        return obj[name] || '';
	    },
		renderWindChart: function(data){
			var self = this;
			var myChart = echarts.init(document.getElementById('windChart'));
			this.windChart = myChart;
			var xAxisData = data.xAxisData;
			var seriesData = data.windData;
			var arrowArr = data.windArrowData;
			var preditDate = data.preditDate;
			var beforeEnsure = '09-04';
			var afterEnsure = '09-07';

			//总长度
			var num = xAxisData.length - 1;
			var index = 0;
			var actualPercent = '';
			var preditPercent = '';

			var firstNum = 0;
			var firstIndex = 0;
			var secondNum = 0;

			var arrowDataArr = [];
			xAxisData.forEach(function(item, i) {
			    var arr = [];
			    arr.push(xAxisData[i]);
			    arr.push(seriesData[i]);
			    arr.push(arrowArr[i]);
			    arrowDataArr.push(arr);

			    if (item == preditDate) {
			        index = i;
			        //实测比例
			        actualPercent = i / num * 90;
			        preditPercent = (num - i) / num * 90;
			    }

			    if (item == beforeEnsure) {
			        firstIndex = i;
			        firstNum = i / num * 90;
			    }


			    if (item == afterEnsure) {
			        secondNum = (i - firstIndex) / num * 90;
			    }
			})




			//箭头处理函数
			var directionMap = {};
			echarts.util.each(
			    ['W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE', 'E', 'ENE', 'NE', 'NNE', 'N', 'NNW', 'NW', 'WNW'],
			    function(name, index) {
			        directionMap[name] = Math.PI / 8 * index;
			    }
			);

			var dims = {
			    time: 0,
			    windSpeed: 1,
			    R: 2,
			    waveHeight: 3,
			    weatherIcon: 2,
			    minTemp: 3,
			    maxTemp: 4
			};
			var arrowSize = 18;
			var weatherIconSize = 45;

			function renderArrow(param, api) {
			    var point = api.coord([
			        api.value(dims.time),
			        api.value(dims.windSpeed)
			    ]);

			    return {
			        type: 'path',
			        shape: {
			            pathData: 'M31 16l-15-15v9h-26v12h26v9z',
			            x: -arrowSize / 2,
			            y: -arrowSize / 2,
			            width: arrowSize,
			            height: arrowSize
			        },
			        rotation: directionMap[api.value(dims.R)],
			        position: point,
			        style: api.style({
			            stroke: '#555',
			            lineWidth: 1
			        })
			    };
			}



			var option = {
			    color: ['#259e72', '#178fcd'],
			    tooltip: {
			    	trigger: 'axis',
			        formatter: function(params) {
			        	var index = params[0].dataIndex;
			        	return '';
			            return [
			                '风速：' + params[1].value[dims.windSpeed]+'m/s',
			                '风向：' + self.selectWindName(params[1].value[dims.R]),
			                '温度：' + data.temperatureData[index] + '℃',
			                '湿度：' + data.pressureData[index] + '%<br>'
			            ].join('<br>');
			        }
			    },
			    dataZoom: {
			    	show: false,
			    	bottom: '140',
			        height: '20',
			        end: 100,
			        xAxisIndex: [0, 1, 2]
			    },
			    xAxis: [{
			    	 	axisTick: { alignWithLabel: true, textStyle: { color: '#707070' } },
			    	    axisTick: {
				            show: false,
				            color: '#fff'
//				            color: '#4D4D4D'
				        },
				        axisLabel: {
				        	show: false,
				            textStyle: {
				                fontSize: 14,
				                color: '#fff'
//				                color: '#4D4D4D'
				            }
				        },
				        axisLine: {
				        	show: false,
				            lineStyle: {
				            	color: '#fff'
//				                color: '#4D4D4D'
				            }
				        },
			            data: xAxisData
			        },
			        {
			            name: '温度 ℃',
			            type: 'category',
			            position: 'bottom',
			            offset: 8,
			            axisTick: {
			                show: false
			            },
			            axisLine: {
			                show: false
			            },
			            axisLabel: {
			                show: true,
			                textStyle: {
			                	color: '#fff',
//			                    color: '#2779DD',
			                    fontSize: 14,
			                    backgroundColor: '#005076',
//			                    backgroundColor: '#EEF5FF',
			                    lineHeight: 20,
			                    padding: [3, 14]
			                },
			                interval: 0
			            },
			            nameTextStyle: {
			            	color: '#fff',
//			                color: '#585858',
			                padding: [0, 0, -38]
			            },
			            nameLocation: 'start',
			            data:  data.temperatureData
			        },
			        {
			            name: '湿度',
			            type: 'category',
			            position: 'bottom',
			            offset: 40,
			            axisTick: {
			                show: false
			            },
			            axisLine: {
			                show: false
			            },
			            axisLabel: {
			                show: true,
			                textStyle: {
			                	color: '#fff',
//			                    color: '#2779DD',
			                    fontSize: 14,
			                    backgroundColor: '#005076',
//			                    backgroundColor: '#EEF5FF',
			                    lineHeight: 20,
			                    padding: [3, 14]
			                },
			                interval: 0
			            },
			            nameTextStyle: {
			            	color: '#fff',
//			                color: '#585858',
			                padding: [0, 0, -46]
			            },
			            nameLocation: 'start',
			            data:  data.pressureData
			        }
			    ],
			    grid : {
			    	top: '20%',
			    	bottom: '70',
			        left : '70'
			    },
			    yAxis: {
			    	name: '风速：m/s',
			        axisLabel: {
			            color: '#ccc'
			        },
			        axisLabel: {
			            textStyle: {
			                fontSize: 12,
			                color: '#fff'
//			                color: '#4D4D4D'
			            }
			        },
			        axisLine: {
			        	show: false,
			            lineStyle: {
			            	color: '#fff'
//			                color: '#707070'
			            }
			        }
			    },
			    "visualMap": [{
			        "show": false,
			        "dimension": 0,
			        "seriesIndex": 0,
			        "pieces": [{
			            "lte": index,
			            "color": "#259e72"
			        }, {
			            "gt": index,
			            "lte": seriesData.length + 1,
			            "color": "#51d9a7"
			        }]
			    }],
			    series: [{
			        name: '风速',
			        type: 'line',
			        smooth: true,
			        "yAxisIndex": "0",
			        "xAxisIndex": "0",
			        data: seriesData,
			        markLine: {
			            label: {
			                color: '#666',
			                position: 'middle',
			                textStyle: {
			                    padding: -50
			                }
			            },
			            lineStyle: {
			                color: '#666'
			            }
			        }
			    }, {
			        name: '风向',
			        "type": "custom",
			        renderItem: renderArrow,
			        "encode": {
			            "x": 0,
			            "y": 1
			        },
			        "data": arrowDataArr,
			        "z": 10
			    }, {
			        name: '平行于y轴的趋势线',
			        type: 'line',
			        color: ['black'],
			        markLine: {
			            data: [
			                [{
			                    symbol: "line",
			                    coord: [preditDate, 0]
			                }, {
			                    symbol: "line",
			                    coord: [preditDate, 1]
			                }]
			            ]
			        }
			    }]
			};
			myChart.setOption(option);
			myChart.on('click',function(params){
				console.log(params);
				var startDate = self.time[0].format("yyyy-MM-dd hh") + ':00:00';
				var endDate = self.time[1].format("yyyy-MM-dd hh") + ':00:00';
				var selectDate = params.data[0].replace(/"/g,"").replace(/-/g,"/");
				$('#insideBox')[0].contentWindow.postMessage({"type":"1","selectDate":selectDate}, '*');
//				var insideSrc = 'http://192.168.3.209:81/YBYJ_JX_PX/index2.html?mod=RoundCheck&config=config-round2.json&kqzdmc='
//					+name+'&startDate='+startDate+'&endDate='+endDate+'&lastDate='+lastDate+'&type=1&selectDate='+selectDate;
//				$('#insideBox').attr('src', insideSrc);
				
			});

		},
		// 渲染外区域右侧区域
		renderOutsideRegion: function(){
			/*var self = this;
			
//			var data = {"success":true,"errMsg":"","data":[{"date":"2019-09-28 11:00","pm25":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}},"o3":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}}},{"date":"2019-09-28 11:00","pm25":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}},"o3":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":135,"name":"工业源"},{"value":335,"name":"电厂"},{"value":135,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}}},{"date":"2019-09-28 11:00","pm25":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}},"o3":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}}},{"date":"2019-09-29 11:00","pm25":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}},"o3":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}}},{"date":"2019-09-28 11:00","pm25":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}},"o3":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}}},{"date":"2019-09-28 11:00","pm25":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}},"o3":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}}},{"date":"2019-09-28 11:00","pm25":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}},"o3":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}}},{"date":"2019-09-28 11:00","pm25":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}},"o3":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}}},{"date":"2019-09-28 11:00","pm25":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}},"o3":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}}},{"date":"2019-09-28 11:00","pm25":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}},"o3":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}}},{"date":"2019-09-28 11:00","pm25":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}},"o3":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}}},{"date":"2019-09-28 11:00","pm25":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}},"o3":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}}},{"date":"2019-09-28 11:00","pm25":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}},"o3":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}}},{"date":"2019-09-28 11:00","pm25":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}},"o3":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}}},{"date":"2019-09-28 11:00","pm25":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}},"o3":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}}},{"date":"2019-09-28 11:00","pm25":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}},"o3":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}}},{"date":"2019-09-28 11:00","pm25":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}},"o3":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}}},{"date":"2019-09-28 11:00","pm25":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}},"o3":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}}},{"date":"2019-09-28 11:00","pm25":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}},"o3":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}}},{"date":"2019-09-28 12:00","pm25":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}},"o3":{"pieChart":{"legendData":["工业源","电厂","民用"],"seriesData":[{"value":335,"name":"工业源"},{"value":335,"name":"电厂"},{"value":335,"name":"民用"}]},"barChart":{"xAxisData":["浙江","湖南","重庆"],"seriesData":[20,15,10]}}}]}
				$.ajax({
				url: drawStationCsyjx,
				data: {
					cdbh: bh,
					startDate: self.time[0].format("yyyy-MM-dd hh") || '',
					endDate: self.time[1].format("yyyy-MM-dd hh") || '',
					type: STtype
				},
				dataType: 'json',
				success: function(data){
					var data = data.data;
					//console.log(JSON.stringify(data));
					var arr = [];
					var day = data[0].date.slice(0, 11)
					data.forEach(function(item, idx){
						var newDate = item.date.slice(0, 11);
						if(day !== newDate){
							day = newDate;
							item.day = newDate
						}else{
	    					item.day = '';
	    				}
	    				arr.push(item)
	    			})
					player.initPlayer(data, '#palyerBar', function(data, idx){
						
						var siteType = 'ayqzf';
						switch(bh){
							case '2351A': type = 'ayqzf';break;
							case '2350A': type = 'shbj';break;
							case '2349A': type = 'szfck';break;
							case '2347A': type = 'wgsqxz';break;
							case '2348A': type = 'zyy';break;
						}	
						
			    		//TODO 这里要gis对接
						window.addEventListener('message', function(e) {
							$('#iframeBox')[0].contentWindow.postMessage({"type":"ChangeModel","NAME":siteType,"JCSJ":"20191015-1"}, '*');
					    }, false);
						
						$('#iframeBox')[0].contentWindow.postMessage({"type":"ChangeModel","NAME":siteType,"JCSJ":"20191015-1"}, '*');
						
						if(self.pollutionType == 'o3'){
							self.renderRightPieChart(data.o3.pieChart);
				    		self.renderRightBarChart(data.o3.barChart);
						}else{
							self.renderRightPieChart(data.pm25.pieChart);
				    		self.renderRightBarChart(data.pm25.barChart);
						}
						
			    		
					});
					}
			})*/
		},
		renderRightPieChart: function(data){
			var myChart = echarts.init(document.getElementById('pieChart'));
			var option = {
			    "color": ["#68cffe", "#49a1fe", "#65c233", "#f2b71d", "#9600e2", "#e73f60", "#9f9f9f"],
			    "legend": {
			        "bottom": 0,
			        "itemGap": 10,
			        "itemWidth": 12,
			        "itemHeight": 12,
			        "data": data.legendData,
			        "symbolKeepAspect": false,
			        "textStyle": {
			        	color: '#fff'
//			            "color": "#57a6ff"
			        },
			        "icon": "circle"
			    },
			    "grid": {
			        "top": "5%",
			        "left": "5%",
			        "right": "5%",
			        "bottom": "5%",
			        "containLabel": true
			    },
			    "series": [{
			        "name": "",
			        "type": "pie",
			        "radius": ["45%", "70%"],
			        "center": ["45%", "45%"],
			        "label": {
			            "color": "#57a6ff",
			            "formatter": "{b}：{c}"
			        },
			        "itemStyle": {
			            "normal": {
			                "shadowColor": "rgba(0,0,0,0.4)",
			                "shadowBlur": 15
			            }
			        },
			        "labelLine": {
			            "lineStyle": {
			                "color": "#57a6ff",
			                "width": 1.5
			            }
			        },
			        "data": data.seriesData
			    }]
			}
			myChart.setOption(option)
		},
		renderRightBarChart: function(data){
			var myChart = echarts.init(document.getElementById('barChart'));
			var option = {
				    color: ['#56B9ED'],
				    tooltip: {
				        trigger: 'axis',
				        axisPointer: {
				            type: 'shadow'
				        }
				    },
				    grid: {
				    	top: '3%',
				        left: '3%',
				        right: '4%',
				        bottom: '5%',
				        containLabel: true
				    },
				    xAxis: [{
				        type: 'category',
				        axisTick: {
				            show: false,
				            color: '#fff'
//				            color: '#707070'
				        },
				        axisLabel: {
				            textStyle: {
				                fontSize: 14,
				                color: '#fff'
//				                color: '#4D4D4D'
				            }
				        },
				        axisLine: {
				            lineStyle: {
				            	color: '#fff'
//				                color: '#707070'
				            }
				        },
				        data: data.xAxisData,
				    }],
				    yAxis: {
				        type: 'value',
				        nameTextStyle: {
				            fontSize: 14,
				            color: '#fff'
//				            color: '#4D4D4D'
				        },
				        axisLabel: {
				            textStyle: {
				                fontSize: 12,
				                color: '#fff'
//				                color: '#4D4D4D'
				            }
				        },
				        axisLine: {
				            lineStyle: {
				            	color: '#fff'
//				                color: '#707070'
				            }
				        }
				    },
				    series: [{
				        name: '区域污染来源解析',
				        type: 'bar',
				        barWidth: '60%',
				        data: data.seriesData
				    }]
				}
			myChart.setOption(option)
		}
	}
	
});
Index.renderRegion();