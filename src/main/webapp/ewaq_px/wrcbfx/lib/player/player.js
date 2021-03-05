var player = {
	ele: null,//绑定的元素
	dateArr: [],//播放的所有时间
	curDate: '',//当前播放时间
	curIdx: 0,//当前播放序号
	data: null,//所有可播放数据
	timer: null, //定时器
	period: 1000,//播放间隔时间
	//初始化播放
	initPlayer: function(data, eleId, callback){//数据集合[]， 绑定元素选择器'#id' 每次播放时的回调	
		var ele = $('<div class="play-bar">\
					<div class="play btn" title="播放" style="left: -168px;"></div>\
					<div class="pause btn" title="暂停" style="left: -168px; display: none;"></div>\
					<div class="prev btn" title="向前" style="left: -125px;"></div>\
					<div class="next btn" title="向后" style="left: -85px;"></div>\
					<ul class="time-list"></ul>\
				</div');					
		this.ele = ele;
		var lis = '';
		$.each(data, function(i,v) {
			var tip = '<div class="slide-tip">\
						<div class="bb"></div>\
						<div class="cc"></div>\
						<span>'+v.date+'</span>\
					</div>';
			if(v.day){
				if(v.type== 'day'){
					tip = tip + '<div class="day-div" style="width: 114px;"><span class="day-span" style="left:15px">'+v.day+'</span></div>';
				}else{
					tip = tip + '<div class="day-div"><span class="day-span">'+v.day+'</span></div>';
				}
				
			}
			lis += '<li idx="'+i+'" title="'+v.date+'">'+tip+'</li>';
		});
		ele.find('.time-list').html(lis);
		var w = Math.floor((100/data.length)*10000)/10000;
		ele.find('.time-list>li').css('width', w + '%');
		$(eleId).empty().append(ele);
		this.bindEvent();
		
		this.clearTimer();
		this.dateArr = data;
		this.callback = callback;
		this.getCurData(0);
		
	},
	//获取当前播放数据
	getCurData:function(idx){
		var curData = this.dateArr[idx];
		this.curDate = curData.date;
		this.curIdx = Number(idx);
		
		this.ele.find('.time-list>li').removeClass('on').removeClass('prev');
		this.ele.find('.time-list>li').eq(idx).addClass('on').prevAll().addClass('prev');

		this.callback && this.callback(curData, idx);
	},
	//清除播放定时器
	clearTimer: function(){
		if(this.timer){
			clearInterval(this.timer);
			this.timer = null;
		}
		this.ele.find('.pause').hide();
		this.ele.find('.play').show();
	},
	//调整进度
	setPlayer: function(idx, shouldStop){
		if(idx >= this.dateArr.length || idx < 0){
			//console.log('播放结束');
			this.clearTimer();
			return;
		}
		shouldStop && this.clearTimer();
		this.getCurData(idx);
	},
	//开始或继续播放
	runPlayer: function(){
		var self = this;
		this.clearTimer();
		this.timer = setInterval(function(){
			self.setPlayer(self.curIdx+1);		
		}, self.period);
		this.ele.find('.pause').show();
		this.ele.find('.play').hide();
	},
	//向前 或 向后播放一帧
	stepOne: function(n){ // 1 或 -1
		this.setPlayer(this.curIdx + n, true);	
	},
	//绑定操作事件
	bindEvent: function(ele){
		var self = this;
		var ele = self.ele;
		//点击播放指针
		ele.on('click', '.time-list>li', function(){
			var idx = $(this).attr('idx');
			self.setPlayer(idx, true);
		});
		
		//点击播放
		ele.on('click', '.play', function(){
			self.runPlayer();
		});
		
		//点击停止播放
		ele.on('click', '.pause', function(){
			self.clearTimer();
		});

		//点击向前
		ele.on('click', '.next', function(){
			self.stepOne(1);
		});
		
		//点击回退
		ele.on('click', '.prev', function(){
			self.stepOne(-1);
		});
	}
}


