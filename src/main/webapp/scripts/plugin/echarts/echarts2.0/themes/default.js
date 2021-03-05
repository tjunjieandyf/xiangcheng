//定义一套绿色的皮肤
var theme = {
	//animationEasing:'BounceIn',
	//标题
	title : {
		//水平安放位置 居中
		x : 'center',
		//主标题文本样式
		textStyle : {
			fontSize : 14,
			fontWeight : 'bolder',
			fontFamily : 'Microsoft YaHei'
		}
	},
	//提示框
	tooltip : {
		//触发类型
		show : true,
		trigger : 'axis'
	},
	//图例
	legend : {
		show:true,
		//水平安放位置 居中 
		x : 'right'
		
	},
	//启用拖拽重计算特性
	calculable : true,
	categoryAxis : {
		//分隔线
		splitLine : {
			show : false
		},
		//类目起始和结束两端空白 顶头
		boundaryGap : false,
		axisLine:{show:false},
		axisTick:{
			//length:8,
			lineStyle:{
				color:'#C0D0E0'
			}
			
		},
		//坐标轴文本标签
		axisLabel :{
			show : true,
			interval:3,
			//标签旋转角度
			//rotate : 45,
			clickable : true,
			textStyle : {
				fontSize : 11,
				//color:'#C0D0E0',
				fontFamily : '微软雅黑, Arial'
			}
		}
	},
    // 数值型坐标轴默认参数
    valueAxis: {
    	//脱离0值比例 放大聚焦到最终_min，_max区间
    	scale : true,
    	//show:false,
    	axisLine:{
    		show:false
    	},
    	splitNumber:5,
       /* splitArea : {
            show : false,
            areaStyle : {
                color : ['rgba(250,250,250,0.1)', 'rgba(242,251,255,0.5)']
           }
        },*/
        //precision : 1
    },
    //绘制直角坐标系
    grid: {
    	x : 30,
		y : 30,
		x2 : 30,
		borderWidth:0
	},
    textStyle : {
        fontFamily : '微软雅黑, Arial, Verdana, sans-serif'
    }
};