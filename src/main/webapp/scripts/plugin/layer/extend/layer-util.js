var layerUtils = {
		/**
		 * iframe 加载
		 * 
		 */
		iframeLoader:function(isAceIndex){
			if(!isAceIndex){
				if(document.readyState){
					var loader;
					if(document.readyState == 'interactive'){
						loader = layer.load(1,{shade: 0.6});
					}
					document.onreadystatechange = function(){
						if(document.readyState == 'loaded' || document.readyState == 'complete'){
							layer.close(loader);
							document.onreadystatechange = null;
						}
					}
				}
			}
		},
		/**
	     * 弹出层操作
	     * @param params 数据对象
	     * @returns
	     */
		openLayer:function(params){
			//默认参数
			var defParams = {
				//类型，1为页面层，2为iframe层 当为2是content为url
				type:2,
				//标题
				title:'信息',
				//内容
				content:'',
				//宽度
				width:$(window).width(),
				//高度
				height:$(window).height(),
				//是否立即全屏
				isFull:true,
				//最大最小化。
				maxmin:false,
				// 遮罩
				shade: true,
				// 是否点击遮罩关闭
			    shadeClose:true,
			    //固定
			    fix :false,
			    //拖拽风格
				moveType:0,
				//是否允许拖拽到窗口外
				moveOut:false,
				//弹出成功回调函数
				sucessFun:function(){
					$.noop();
				},
				//最大化回调函数
				fullFun:function(){
					$.noop();
				},
				//最小化回调函数
				minFun:function(){
					$.noop();
				},
				//还原回调函数
				restoreFun:function(){
					$.noop();
				},
				//销毁弹出层回调函数
				endFun:function(){
					$.noop();
				}
			};
			//合并参数
			var paramdata = $.extend({},defParams,params);
			layer.open({
			 	type: paramdata.type, 
			    title: [paramdata.title,'font-size:18px;'],
			    content: paramdata.content,
			    area : [paramdata.width+'px',paramdata.height+'px'],
			    maxmin:paramdata.maxmin,
			    shade: paramdata.shade,
			    shadeClose: paramdata.shadeClose,
			    //固定
			    fix : paramdata.fix,
			    //拖拽风格
				moveType: paramdata.moveType,
				moveOut: paramdata.moveOut,
			    success:function(layero,index){
			    	if(paramdata.isFull){
			    		layer.full(index);
			    	}
			    	eval("var sucessFun ="+paramdata.sucessFun);
			    	sucessFun(layero,index);
			    },
			    full:function(layero){
			    	eval("var fullFun ="+ paramdata.fullFun);
			    	fullFun(layero);
			    },
			    min:function(layero){
			    	eval("var minFun ="+ paramdata.minFun);
			    	minFun(layero);
			    },
			    restore:function(layero){
			    	eval("var restoreFun ="+ paramdata.restoreFun);
			    	restoreFun(layero);
			    },
			    end:function(){
			    	eval("var endFun ="+ paramdata.endFun);
			    	endFun();
			    }  
			});
		},
		/**
		 * 显示页面加载 
		 */
		showLoader:function(){
			var index = layer.load(1,{shade: 0.3});
			return index;
		},
		/**
		 * 关闭弹出层
		 */
		closeLayer:function(index){
			layer.close(index);
		}
}