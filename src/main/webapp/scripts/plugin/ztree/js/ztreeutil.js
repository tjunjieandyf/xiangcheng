function ztree(){};	
ztree.prototype = {
		isCheckBox : "radio",	// radio || checkbox 
		globSetting :"",	// 树的配置
		globFucName : "",  // 回调方法
		/**
		 * 简单树
		 * @param {} domId divid
		 * @param {} method	访问的方法
		 * @param {} otherParam: ["id", "1", "name", "test"] 其他需要传递的参数
		 * @param {} ajaxDataFilter: ajax回调函数，可以修改图标等..
		 * @param {} onclick 点击事件
		 * @param {} onclick 异步加载完成事件
		 */
		singleTree:function(domId,url,otherParam,ajaxDataFilter,onclick,zTreeOnAsyncSuccess){
			var setting = {
				data: {
					simpleData: {
						enable: true
					}
				},
				async: { //异步加载
		                 type: "post",
		                 enable: true,
		                 url:url,
		                 autoParam: ["id"],
		                 otherParam: otherParam,
		                 dataFilter :ajaxDataFilter,
		         },
				callback: {
					onClick: onclick,
					onAsyncSuccess :zTreeOnAsyncSuccess
				},
				view: {
					showLine: false
				}
			};
		    $.fn.zTree.init($("#"+domId),setting);
		},
		/**
		 * 简单的树 包含Check框 
		 * @param {} domId	页面DOM元素ID
		 * @param {} url 调用的方法
		 * @param {} checkType	radio || checkbox 
		 * @param {} otherParam: ["id", "1", "name", "test"] 其他需要传递的参数
		 * @param {} ajaxDataFilter: ajax回调函数，可以修改图标等..
		 * @param {} onclick 点击事件
		 * @param {} onCheck 复选框点击事件
		 */
		simpleTree:function(domId,url,checkType,otherParam,ajaxDataFilter,onclick,onCheck){
			var setting = {
				check: {
					enable: true,
					chkStyle: checkType,
					radioType: "all"
				},
				data: {
					simpleData: {
						enable: true
					}
				},
				async: { //异步加载
		                 type: "post",
		                 enable: true,
		                 url:url,
		                 autoParam: ["id"],
		                 otherParam:otherParam,
		                 dataFilter:ajaxDataFilter
		         },
				callback: {
					onClick: onclick,
					onAsyncSuccess:function(){removeLoding(domId);},
					onCheck: onCheck
				},
				view: {
					showLine: false
				}
			};
			$.fn.zTree.init($("#"+domId),setting);	
		},
		/**
		 * 收起树：只展开根节点下的一级节点
		 * @param treeId
		*/
		 close_ztree :function(treeId){
			 var treeObj = $.fn.zTree.getZTreeObj(treeId);
			 var nodes = treeObj.transformToArray(treeObj.getNodes());
			 var nodeLength = nodes.length;
			 for (var i = 0; i < nodeLength; i++) {
				 if (nodes[i].id == '0') {
					 //根节点：展开
					 treeObj.expandNode(nodes[i], true, true, false);
				 } else {
					 //非根节点：收起
					 treeObj.expandNode(nodes[i], false, true, false);
				}
			}
		},
}
function removeLoding(domId){
	$("#div"+domId+"_span").remove();
}
var ztree = new ztree();