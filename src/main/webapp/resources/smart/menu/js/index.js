
function clickMsg(event) {
    $('#headerNavList li.on').removeClass('on');
    event.stopPropagation();
}

var wsTimeout = 0;
//platform.webSocket.addListener('报警信息_提醒_小时', 'onmessage', function (msg) {
//    var link = `${msg.lj}`;
//    link = Common.link(link);
//
//    if (msg.kzcs == '2' || msg.kzcs == '') {
//		var cut1 = msg.xxnr.indexOf('站点AQI达到');
//		var cut2 = msg.xxnr.indexOf('，首要污染物');
//		
//		var part1 = msg.xxnr.slice(0, cut1);
//		var part2 = msg.xxnr.slice(cut1, cut1+7);
//		var part3 = msg.xxnr.slice(cut1+7, cut2)
//		var part4 = msg.xxnr.slice(cut2);
//	} else if (msg.kzcs == '5') {
//		var cut1 = msg.xxnr.indexOf('超标报警：浓度');
//		var cut2 = msg.xxnr.indexOf('mg/m³超标');
//		
//		var part1 = msg.xxnr.slice(0, cut1);
//		var part2 = msg.xxnr.slice(cut1, cut1+7);
//		var part3 = msg.xxnr.slice(cut1+7, cut2+5)
//		var part4 = msg.xxnr.slice(cut2+5);
//	} else if (msg.kzcs == '6') {
//		var cut1 = msg.xxnr.indexOf('超标报警：浓度');
//		var cut2 = msg.xxnr.indexOf('μg/m³超');
//		
//		var part1 = msg.xxnr.slice(0, cut1);
//		var part2 = msg.xxnr.slice(cut1, cut1+7);
//		var part3 = msg.xxnr.slice(cut1+7, cut2+5)
//		var part4 = msg.xxnr.slice(cut2+5);
//	} else if (msg.kzcs == '8') {
//		var cut1 = msg.xxnr.indexOf('报警：报警值');
//		var cut2 = msg.xxnr.indexOf('mg/m³，阈值');
//		
//		var part1 = msg.xxnr.slice(0, cut1);
//		var part2 = msg.xxnr.slice(cut1, cut1+6);
//		var part3 = msg.xxnr.slice(cut1+6, cut2+5)
//		var part4 = msg.xxnr.slice(cut2+5);
//	}
	
//    var contentStr = '<div class="pd-dlgbd">'
//		+	'<ul class="pd-ullst1">'
//		+ 		'<li>'
//		+ 			'<h1><span>' + msg.xxbt + '</span><a target="_blank" href="' + link + '">查看详情</a></h1>'
//		+ 			'<p><em>【' + part1 + '】</em>' + part2 + '<i>' + part3 + '</i>' + part4 + '</p>'
//		+		'</li>'
//		+	'</ul>'
//		+'</div>';
    
//    clearTimeout(wsTimeout);
    //ttsRecorder.textTemp += msg.xxnr + "    ";
    //去掉 时间
//    ttsRecorder.textTemp += msg.xxnr.substring(16, msg.xxnr.length) + "    ";
//    ttsRecorder.layerConter += '<li> <h1><span>' + msg.xxbt + '</span><a target="_blank" href="' + link + '">查看详情</a></h1>'
//							   + '<p><em>【' + part1 + '】</em>' + part2 + '<i>' + part3 + '</i>' + part4 + '</p></li>';
//    wsTimeout = setTimeout(() => {
//    	if (ttsRecorder.textTemp != '' && ttsRecorder.layerConter != ''){
//    		layer.open({
//                type: 1
//                ,title: '报警提醒'
//                ,offset: 'auto' //居中
//                ,area: ['970px', '650px']
//                ,content: '<div class="pd-dlgbd"> <ul class="pd-ullst1">' + ttsRecorder.layerConter + '</ul></div>'
//                // ,btn: '关闭全部'
//                ,btnAlign: 'c' //按钮居中
//                ,shade: 0 //不显示遮罩
//                ,time: 1000*60*10
//            });
//            
////            console.log(ttsRecorder.textTemp);
//            ttsRecorder.setText(ttsRecorder.textTemp);
//            ttsRecorder.start();
//            ttsRecorder.textTemp = '';
//            ttsRecorder.layerConter = '';
//    	}
//      }, 3000);
//});

// 国控站点分种突高报警      国控点5分钟数据，连续三个5分钟突高四个国控点同时上升选择一个最高的
// 2020年09月01日21:00达活泉站点分钟超标报警，NO2：21:00-21:55持续超标，浓度范围55-85μg/m³。
//platform.webSocket.addListener('AIR_TUGAO_ALARM', 'onmessage', function (msg) {
//    var link = `${msg.lj}`;
//    link = Common.link(link);
//    var cut1 = msg.xxnr.indexOf('站点分钟超标报警');
//	var cut2 = msg.xxnr.indexOf('，浓度范围');
//	
//	var part1 = msg.xxnr.slice(0, cut1);
//	var part2 = msg.xxnr.slice(cut1, cut1+9);
//	var part3 = msg.xxnr.slice(cut1+9, cut2)
//	var part4 = msg.xxnr.slice(cut2);
//	
//	var contentStr = '<div class="pd-dlgbd">'
//		+	'<ul class="pd-ullst1">'
//		+ 		'<li>'
//		+ 			'<h1><span>' + msg.xxbt + '</span><a target="_blank" href="' + link + '">查看详情</a></h1>'
//		+ 			'<p><em>【' + part1 + '】</em>' + part2 + '<i>' + part3 + '</i>' + part4 + '</p>'
//		+		'</li>'
//		+	'</ul>'
//		+'</div>';
//	
//    layer.open({
//        type: 1
//        ,title: '报警提醒'
//        ,offset: 'auto' //居中
//        ,area: ['970px', '650px']
//        ,content: contentStr
//        // ,btn: '关闭全部'
//        ,btnAlign: 'c' //按钮居中
//        ,shade: 0 //不显示遮罩
//        ,time: 1000*600
//    });
//    ttsRecorder.setText(msg.xxnr.substring(16, msg.xxnr.length));
//    ttsRecorder.start();
//});
////手动报警
//platform.webSocket.addListener('MANUAL_ALARM', 'onmessage', function (msg) {
//    var link = `${msg.lj}`;
//    link = Common.link(link);
//
//	var contentStr = '<div class="pd-dlgbd">'
//		+	'<ul class="pd-ullst1">'
//		+ 		'<li>'
//		+ 			'<h1><span>' + msg.xxbt + '</span><a target="_blank" href="' + link + '">查看详情</a></h1>'
//		+ 			'<p>' + msg.xxnr +  '</p>'
//		+		'</li>'
//		+	'</ul>'
//		+'</div>';
//	
//    layer.open({
//        type: 1
//        ,title: '报警提醒'
//        ,offset: 'auto' //居中
//        ,area: ['970px', '650px']
//        ,content: contentStr
//        // ,btn: '关闭全部'
//        ,btnAlign: 'c' //按钮居中
//        ,shade: 0 //不显示遮罩
//        ,time: 1000*600
//    });
//    ttsRecorder.setText(msg.xxnr);
//    ttsRecorder.start();
//});
//
//platform.webSocket.addListener('业务协同_任务反馈', 'onmessage', function (msg) {
//    var link = `${msg.lj}`;
//    if (link.indexOf('http') < 0) {
//        link = `${ctx}${link}`;
//    }
//    layer.open({
//        type: 1
//        ,offset: 'rb' //具体配置参考：offset参数项
//        ,content:
//            `<div class="msg-panel">
//                <h1 class="title">${msg.xxbt}</h1>
//                <p>${msg.xxnr}</p>
//                <a style="float: right;"
//                target="_blank"
//                href="${link}">查看详情</a>
//             </div>`
//        // ,btn: '关闭全部'
//        ,btnAlign: 'c' //按钮居中
//        ,shade: 0 //不显示遮罩
//        ,time: 1000*600
//    });
//});

$('#message-number').hide();
platform.webSocket.addListener("not_received_message", "onmessage", function(message){
    var msgNu = $('#message-number');
    msgNu.text(message.kzcs);
    if (message.kzcs && message.kzcs > 0) {
        msgNu.show();
    } else {
        msgNu.hide();
    }
});

platform.webSocket.connect = function (config) {
    if (!window.WebSocket) {
        window.WebSocket = window.MozWebSocket;
    }
    if (window.WebSocket) { // 检查浏览器是否支持websocket
        var topWindow = TOP_WINDOW.window;
        topWindow.platform.webSocket.config = config;

        if (!topWindow.platform.webSocket.socket) {
            topWindow.platform.webSocket.socket = new WebSocket(config.url);
        }
        var objSocket = topWindow.platform.webSocket.socket;
        // 接收到服务器发来消息时处理动作
        objSocket.onmessage = function (event) {
            var data = JSON.parse(event.data);

            // 获取消息类型
            var xxlx = data.xxlx;

            // 获取消息序号集合
            var xxxhs = [];

            if (data.xxlx == 'not_received_message') {
                var xxList = JSON.parse(data.xxnr);
                for (var i = 0; i < xxList.length; i++) {
                    xxxhs.push(xxList[i].messageVO.xh);
                }
            } else {
                if (data.xh) {
                    xxxhs.push(data.xh);
                }
            }
            // 接收到消息，更新消息的接收状态
            if (xxxhs.length > 0) {
                $.ajax({
                    method: 'POST',
                    url: Common.webRoot() + '/platform/message/messagecontroller/receivemessage',
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        xxxhs : xxxhs
                    })
                });
            }

            if (null == topWindow.platform.webSocket.listeners) {
                topWindow.platform.webSocket.listeners = {};
            }
            var listener = topWindow.platform.webSocket.listeners[xxlx];
            if (listener && listener.event == "onmessage" && listener.fn && typeof listener.fn == 'function') {
                listener.fn(data)
            }
        }

        // 成功连接到服务器后的处理动作
        objSocket.onopen = function(event) {
            topWindow.platform.webSocket.isConnect = true;

            // 关闭重连接
            if (topWindow.platform.webSocket.isReconnect) {
                topWindow.platform.webSocket.isReconnect = false;
                clearInterval(topWindow.platform.webSocket.isReconnectInterval);
            }

            // 初始化websocket，绑定用户
            topWindow.platform.webSocket.send({
                wsOperateType : "platform.bindUser"
            });

            // 通知所有消息监听者
            for (var xxlx in topWindow.platform.webSocket.listeners) {
                var listener = topWindow.platform.webSocket.listeners[xxlx];
                try {
                    if (listener && listener.event == "onopen" && listener.fn && typeof listener.fn == 'function') {
                        listener.fn(event);
                    }
                } finally {
                    continue ;
                }
            }
        };

        // 断开连接后的处理动作
        objSocket.onclose = function(event) {
            topWindow.platform.webSocket.socket = null;
            topWindow.platform.webSocket.isConnect = false;
            // 执行监听的onclose
            for (var xxlx in topWindow.platform.webSocket.listeners) {
                var listener = topWindow.platform.webSocket.listeners[xxlx];
                try {
                    if (listener && listener.event == "onclose" && listener.fn && typeof listener.fn == 'function') {
                        listener.fn(event);
                    }
                } finally {
                    continue ;
                }
            }

            // 判断是否已开启过连接
            if (!topWindow.platform.webSocket.isReconnect) {
                // 掉了就重新连接
                topWindow.platform.webSocket.isReconnectInterval = setInterval(function () {
                    if (!topWindow.platform.webSocket.isConnect) {
                        topWindow.platform.webSocket.connect(scope, http, topWindow.platform.webSocket.config);
                    } else {
                        return ;
                    }
                }, 5 * 1000);
                topWindow.platform.webSocket.isReconnect = true;
            }
        };
    }
};

platform.webSocket.connect({
    url : wsUrl
});