$(function(){
	// 元素
	var oFileBox = $(".fileBox");					// 选择文件父级盒子
	var oFileInput = $("#fileInput");				// 选择文件按钮
	var oFileSpan = $("#fileSpan");					// 选择文件框
	var oFileList_parent = $(".fileList_parent");	// 表格
	var oFileList = $(".fileList");					// 表格tbody
	var oFileBtn = $("#fileBtn");					// 上传按钮
	var flieList = [];								// 数据，为一个复合数组
	var sizeObj = [];								// 存放每个文件大小的数组，用来比较去重
	// 拖拽外部文件，进入目标元素触发
	oFileSpan.on("dragenter",function(){
		$(this).text("可以释放鼠标了！").css("background","#ccc");
	});
	// 拖拽外部文件，进入目标、离开目标之间，连续触发
	oFileSpan.on("dragover",function(){
		return false;
	});

	// 拖拽外部文件，离开目标元素触发
	oFileSpan.on("dragleave",function(){
		$(this).text("或者将文件拖到此处").css("background","none");
	});

	// 拖拽外部文件，在目标元素上释放鼠标触发
	oFileSpan.on("drop",function(ev){
		var fs = ev.originalEvent.dataTransfer.files;
		analysisList(fs);		// 解析列表函数
		$(this).text("或者将文件拖到此处").css("background","none");
		return false;
	});

	// 点击选择文件按钮选文件
	oFileInput.on("change",function(){
		analysisList(this.files);
	})
	
	// 解析列表函数
	function analysisList(obj){
		// 如果没有文件
		if( obj.length<1 ){
			return false;
		}
		if( obj.length>5 ){
			power.msgTip($('body'),{level:'fail', msg: '上传文件不能超过5个！', time:'show'});
			return false;
		}
		for( var i=0;i<obj.length;i++ ){
			var fileObj = obj[i];		// 单个文件
			var name = fileObj.name;	// 文件名
			var size = fileObj.size;	// 文件大小
			var type = fileType(name);	// 文件类型，获取的是文件的后缀
			// 文件大于30M，就不上传
			
			if( size > 1024*1024*30 || size == 0 ){
				power.msgTip($('body'),{level:'fail', msg: '“'+ name +'”超过了30M，不能上传', time:'show'});
				continue;
			}
			
			// 把文件大小放到一个数组中，然后再去比较，如果有比较上的，就认为重复了，不能上传
			if( sizeObj.indexOf(size) != -1 ){
				er.msgTip($('body'),{level:'fail', msg: '“'+ name +'”已经选择，不能重复上传', time:'show'});
				continue;
			}
			// 给json对象添加内容，得到选择的文件的数据
			var itemArr = [fileObj,name,size,type];	// 文件，文件名，文件大小，文件类型
			flieList.push(itemArr);
			// 把这个文件的大小放进数组中
			sizeObj.push(size);
			
		}
		createList()				// 生成列表
		oFileList_parent.show();	// 表格显示
		oFileBtn.show();			// 上传按钮显示
	};
	
		
	// 生成列表
function createList(){
		oFileList.empty();					// 先清空元素内容
		for( var i=0;i<flieList.length;i++ ){
			var fileData = flieList[i];		// flieList数组中的某一个
			var objData = fileData[0];		// 文件
			var name = fileData[1];			// 文件名
			var size = fileData[2];			// 文件大小
			var type = fileData[3];			// 文件类型
			var volume = bytesToSize(size);	// 文件大小格式化
			var oTr = $("<tr></tr>");
			var str = '<td><cite title="'+ name +'">'+ name +'</cite></td>';
			str += '<td>'+ type +'</td>';
			str += '<td>'+ volume +'</td>';
			// str += '<td><input type="radio" /></td>';
			str += '<td>';
			str += '<div class="progressParent">';
			str += '<p class="progress"></p>';
			str += '<span class="progressNum">0%</span>';
			str += '</div>';
			str += '</td>';
			str += '<td><a href="javascript:;" class="operation">删除</a></td>';
			oTr.html(str);
			oTr.appendTo( oFileList );
		}
	}
	
	// 删除表格行
	oFileList.on("click","a.operation",function(){
		var oTr = $(this).parents("tr");
		var index = oTr.index();
		oTr.remove();		// 删除这一行
		flieList.splice(index,1);	// 删除数据
		sizeObj.splice(index,1);	// 删除文件大小数组中的项
		
	});
	
	
	
	// 上传
	oFileBtn.on("click",function(){
		oFileBtn.off();
		var tr = oFileList.find("tr");		// 获取所有tr列表
		var successNum = 0;					// 已上传成功的数目
		oFileList.off();					// 取消删除事件
		oFileBox.slideUp();					// 隐藏输入框
		oFileList.find("a.operation").text("等待上传");
		for( var i=0;i<tr.length;i++ ){
			uploadFn(tr.eq(i),i);		// 参数为当前项，下标
		}
		function uploadFn(obj,i){
			$('#fileBtn').hide();
			var formData = new FormData();
			var arrNow = flieList[i];						// 获取数据数组的当前项
			// 从当前项中获取上传文件，放到 formData对象里面，formData参数以key name的方式
			var result = arrNow[0];					// 数据
			formData.append("LXBH" ,fileTypeItem);
			formData.append("LXMC" ,fileTypeItem);
			formData.append("imageFile" , result);
			var name = arrNow[1];							// 文件名
			var progress = obj.find(".progress");			// 上传进度背景元素
			var progressNum = obj.find(".progressNum");		// 上传进度元素文字
			var oOperation = obj.find("a.operation");		// 按钮
			oOperation.text("正在上传");							// 改变操作按钮
			oOperation.off();
			var request = $.ajax({
				type: "POST",
				url:upload,
				data: formData,			// 这里上传的数据使用了formData 对象
				processData : false, 	// 必须false才会自动加上正确的Content-Type
				contentType : false,
				// 这里我们先拿到jQuery产生的XMLHttpRequest对象，为其增加 progress
				// 事件绑定，然后再返回交给ajax使用
				xhr: function(){
					var xhr = $.ajaxSettings.xhr();
					if(onprogress && xhr.upload) {
						xhr.upload.addEventListener("progress" , onprogress, false);　
						return xhr;
					}
				},
				
				// 上传成功后回调
				success: function(message){
					oOperation.text("成功");
					successNum++;
					 // 解析数组
				     var json=$.parseJSON(message); // jQuery.parseJSON(jsonstr),可以将json字符串转换成json对象
				     createFileTable(json[0]);
					 
				},
				
				// 上传失败后回调
				error: function(){
					oOperation.text("重传");
					oOperation.on("click",function(){
						request.abort();		// 终止本次
						uploadFn(obj,i);
					});
				}
				
			});
			// 生成html列表
			function createFileTable(json){
				var divId=json.WJXH.split(".")[0];
				var str = '<div id='+"'"+divId+"'"+' style="padding-top: 10px;">';
				str+='<i class="fa fa-credit-card" >   '+ json.WJMC+'('+json.SIZE+')</i>';
				str+='<a  id='+"'"+json.WJXH+':'+ json.WJMC+"'"+' href="javascript:void(0)" onclick="email.deleteFile('+"'"+json.LXMC+"'"+','+"'"+json.WJXH+"'"+');" >';
				str+='<i class="fa fa-trash" aria-hidden="true" style="padding-left: 10px;"></i></a></div>';
				//parent.$('#txtList').append(str);
				var html=localStorage.getItem("fileList"); //获取键的值 
				localStorage.setItem("fileList", html+str);
				
			}
			
			// 侦查附件上传情况 ,这个方法大概0.05-0.1秒执行一次
			function onprogress(evt){
				var loaded = evt.loaded;	// 已经上传大小情况
				var tot = evt.total;		// 附件总大小
				var per = Math.floor(100*loaded/tot);  // 已经上传的百分比
				progressNum.html( per +"%" ); 
				progress.css("width" , per +"%");
			}
		}					
	});
})
// 字节大小转换，参数为b
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};
// 通过文件名，返回文件的后缀名
function fileType(name){
	var nameArr = name.split(".");
	return nameArr[nameArr.length-1].toLowerCase();
}
// 更新父文件列表
function createFileListLaber(){
	oFileList.empty();					// 先清空元素内容
	for( var i=0;i<flieList.length;i++ ){
		var fileData = flieList[i];		// flieList数组中的某一个
		var objData = fileData[0];		// 文件
		var name = fileData[1];			// 文件名
		var size = fileData[2];			// 文件大小
		var type = fileData[3];			// 文件类型
		var volume = bytesToSize(size);	// 文件大小格式化
		var oTr = $("<tr></tr>");
		var str = '<td><cite title="'+ name +'">'+ name +'</cite></td>';
		str += '<td>'+ type +'</td>';
		str += '<td>'+ volume +'</td>';
		str += '<td>';
		str += '<div class="progressParent">';
		str += '<p class="progress"></p>';
		str += '<span class="progressNum">0%</span>';
		str += '</div>';
		str += '</td>';
		str += '<td><a href="javascript:;" class="operation">删除</a></td>';
		oTr.html(str);
		oTr.appendTo( oFileList );
	}
}