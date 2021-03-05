(function($){
	function createBox(target){
		var state = $.data(target,"timebox");
		var opts = state.options;
		if($(target).val()){
			var vals = $(target).val().split(opts.separator);
			if(opts.showSeconds){
				//显示秒
				if(vals.length < 3){
					vals.push(0);
				}
			}else{
				//不显示秒
				if(vals.length == 3){
					vals = [vals[0],vals[1]];
				}
			}
			$(target).val(vals.join(opts.separator));
		}
		
		$(target).spinner($.extend(opts,{value:$(target).val()}));
		$(target).closest("span").addClass("timebox-spinner");
		$(target).bind("click",function(e){
			var index = 0;
			if(this.selectionStart!=null){
				index = this.selectionStart;
			}else{
				if(this.createTextRange){
					var textRange = target.createTextRange();
					var s = document.selection.createRange();
					s.setEndPoint("StartToStart",textRange);
					index = s.text.length;
				}
			}
			if(index >= 0 && index <= 2){
				opts.highlight = 0
			}else if(index >=3 && index <= 5){
				opts.highlight = 1;
			}else if(index >=6 && index <= 8){
				opts.highlight = 2;
			}
			//选中相应的文本
			checkText(target);
			if(opts.highlight == 0){
				//显示时间选择框
				showHour(target);
			}else if(opts.highlight == 1){
				showMin(target);
				var offset = $(target).offset();
				var minObj = opts.minObj;
				minObj.css({left:offset.left + 20});
			}else if(opts.highlight == 2){
				showMin(target);
				var offset = $(target).offset();
				var minObj = opts.minObj;
				minObj.css({left:offset.left + 38});
			}
		}).bind("blur",function(){
			setValue(target);
//			if(opts.hourObj)opts.hourObj.hide();
//			if(opts.minObj)opts.minObj.hide();
		}).bind("keyup",function(){
			if(opts.highlight == 0){
				showHour(target);
			}else{
				showMin(target);
			}
		})
		$(document).bind("mouseup.timebox",function(e){
			var e = $(e.target).closest(".timebox-spinner");
			if(e.length != 1){
				if(opts.hourObj)opts.hourObj.hide();
				if(opts.minObj)opts.minObj.hide();
			}
		});
	}
	
	function showHour(target){
		var opts = $.data(target,"timebox").options;
		var hourObj = opts.hourObj;
		var minObj = opts.minObj;
		if(minObj) minObj.hide();
		if(hourObj){
			hourObj.show();
		}else{
			//创建小时选择框
			var cc = $('<div style="timebox-hour-inner"></div>').appendTo("body");
			var offset = $(target).offset();
			cc.css({height:opts.panelHeight,width:opts.panelWidth,position:'absolute',top:offset.top + 22,left:offset.left,zIndex:9999999,backgroud:'red'});	
			opts.hourObj = cc;
			var tt = $('<div class="timebox-menu"></div>').appendTo(cc);
			var t = $('<table width="100%" height="100%"></table>').appendTo(tt);
			var idx = 0;
			for(var i= 0;i < 6;i++){
				var tr = $('<tr></tr>').appendTo(t);
				for(var j=0; j<4; j++){
					$('<td class="timebox-menu-td"></td>').html(opts.hours[idx++]).attr('abbr',idx).appendTo(tr);
				}
			}
			tt.width(tt.width() + 10);
			showButton(target);
			cc.find('.timebox-menu-td').hover(
					function(){$(this).addClass('timebox-menu-hover');},
					function(){$(this).removeClass('timebox-menu-hover');}
			).click(function(){
				//选择时间
				cc.find('.timebox-selected').removeClass('timebox-selected');
				$(this).addClass('timebox-selected');
				var hour = $(this).attr('abbr')-1;
				var val = $(target).val();
				if(val == ""){
					val = [hour,0,0].join(opts.separator);
				}else{
					vals = val.split(opts.separator);
					vals[0] = hour;
					val = vals.join(opts.separator)
				}
				$(target).val(val);
				setValue(target);
				cc.hide();
			});
			cc.show();
		}
		var curDate = getDate(target,$(target).val());
		if(!curDate) curDate = new Date();
		var curHour = curDate.getHours();
		opts.hourObj.find('td.timebox-menu-td').removeClass('timebox-selected');
		opts.hourObj.find('td:eq(' + curHour + ')').addClass('timebox-selected');
	}
	
	function showMin(target){
		var opts = $.data(target,"timebox").options;
		var minObj = opts.minObj;
		var hourObj = opts.hourObj;
		if(hourObj) hourObj.hide();
		if(minObj){
			minObj.show();
		}else{
			//创建小时选择框
			var cc = $('<div style="timebox-min-inner"></div>').appendTo("body");
			var offset = $(target).offset();
			cc.css({height:opts.panelHeight,width:opts.panelWidth + 70,position:'absolute',top:offset.top + 22,left:offset.left+10,zIndex:99999,backgroud:'red'});	
			opts.minObj = cc;
			var tt = $('<div class="timebox-menu"></div>').appendTo(cc);
			var t = $('<table width="100%" height="100%"></table>').appendTo(tt);
			var idx = 0;
			for(var i= 0;i < 10;i++){
				var tr = $('<tr></tr>').appendTo(t);
				for(var j=0; j<6; j++){
					$('<td class="timebox-menu-td"></td>').html(idx++).attr('abbr',idx).appendTo(tr);
				}
			}
			tt.width(tt.width() + 10);
			showButton(target)
			cc.find('.timebox-menu-td').hover(
					function(){$(this).addClass('timebox-menu-hover');},
					function(){$(this).removeClass('timebox-menu-hover');}
			).click(function(){
				//选择时间
				cc.find('.timebox-selected').removeClass('timebox-selected');
				$(this).addClass('timebox-selected');
				var min = $(this).attr('abbr')-1;
				var val = $(target).val();
				if(val == ""){
					if(opts.highlight == 1){
						val = [0,min,0].join(opts.separator);
					}else if(opts.highlight == 2){
						val = [0,0,min].join(opts.separator);
					}
				}else{
					vals = val.split(opts.separator);
					if(opts.highlight == 1){
						vals[1] = min;
					}else if(opts.highlight == 2){
						vals[2] = min;
					}
					val = vals.join(opts.separator)
				}
				$(target).val(val);
				setValue(target);
				cc.hide();
			});
			cc.show();
		}
		var curDate = getDate(target,$(target).val());
		if(!curDate) curDate = new Date();
		if(opts.highlight == 1){
			var curMin = curDate.getMinutes();	
			opts.minObj.find('td.timebox-menu-td').removeClass('timebox-selected');
			opts.minObj.find('td:eq(' + curMin + ')').addClass('timebox-selected');
		}else if(opts.highlight == 2){
			var curSecond = curDate.getSeconds();	
			opts.minObj.find('td.timebox-menu-td').removeClass('timebox-selected');
			opts.minObj.find('td:eq(' + curSecond + ')').addClass('timebox-selected');
		}
	}
	
	function showButton(target){
		var opts = $.data(target,"timebox").options;
		var targetObj = opts.highlight == 0 ? opts.hourObj : opts.minObj;
		var button = $('<div class="datebox-button"><table cellspacing="0" cellpadding="0" style="width:100%"><tr></tr></table></div>').appendTo(targetObj.find(".timebox-menu"));
		var tr = button.find('tr');
		for(var i=0; i<opts.buttons.length; i++){
			var td = $('<td></td>').appendTo(tr);
			var btn = opts.buttons[i];
			var t = $('<a href="javascript:void(0)"></a>').html($.isFunction(btn.text) ? btn.text(target) : btn.text).appendTo(td);
			t.bind('click', {target: target, handler: btn.handler}, function(e){
				e.data.handler.call(this, e.data.target);
			});
		}
		tr.find('td').css('width', (100/opts.buttons.length)+'%');
	}
	
	function moveTo(target,down){
		var opts = $.data(target,"timebox").options;
		var val = $(target).val();
		if(val == ""){
			val = [0,0,0].join(opts.separator);
		}
		var vv = val.split(opts.separator);
		for(var i=0;i<vv.length;i++){
			vv[i]=parseInt(vv[i],10);
		}
		if(down==true){
			vv[opts.highlight]+= opts.increment;
		}else{
			vv[opts.highlight]-= opts.increment;
		}
		$(target).val(vv.join(opts.separator));
		setValue(target);
		checkText(target);
		if(opts.highlight ==0){
			showHour(target);
		}else{
			showMin(target);
		}
	}
	
	function getDate(target,value){
		var opts=$.data(target,"timebox").options;
		if(!value){
			return null;
		}
		var vv=value.split(opts.separator);
		for(var i=0;i<vv.length;i++){
			if(isNaN(vv[i])){
				return null;
			}
		}
		while(vv.length<3){
			vv.push(0);
		}
		return new Date(1900,0,0,vv[0],vv[1],vv[2]);
	};
	
	function setValue(target){
		var opts=$.data(target,"timebox").options;
		var value=$(target).val();
		var curDate=getDate(target,value);
		if(!curDate){
			opts.value="";
			$(target).spinner("setValue","");
			return;
		}
		var minDate=getDate(target,opts.min);
		var maxDate=getDate(target,opts.max);
		if(minDate&&minDate>curDate){
			curDate=curDate;
		}
		if(maxDate&&maxDate<curDate){
			curDate=maxDate;
		}
		var tt=[toString(curDate.getHours()),toString(curDate.getMinutes())];
		if(opts.showSeconds){
			tt.push(toString(curDate.getSeconds()));
		}
		var val=tt.join(opts.separator);
		opts.value=val;
		$(target).spinner("setValue",val);
		function toString(value){
			return (value<10?"0":"")+value;
		};
	}
	
	//选中相就应的文本
	function checkText(target){
		var opts = $.data(target,"timebox").options;
		var startIndex = 0,endIndex = 0;
		if(opts.highlight == 0){
			startIndex = 0;
			endIndex = 2;
		}else if(opts.highlight == 1){
			startIndex = 3;
			endIndex = 5;
		}else if(opts.highlight == 2){
			startIndex = 6;
			endIndex = 8;
		}
		if(target.selectionStart!=null){
			target.setSelectionRange(startIndex,endIndex);
		}else if(target.createTextRange){
			var textRange = target.createTextRange();
			textRange.collapse();
			textRange.moveEnd("character",endIndex);
			textRange.moveStart("character",startIndex);
			textRange.select();
		}
		$(target).focus();
	}
	
	$.fn.timebox = function(options, params){
		if(typeof options == 'string'){
			return $.fn.timebox.methods[options](this,params);
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this,"timebox");
			if(state){
				$.extend(state.options,options);
			}else{
				state = $.data(this, 'timebox', {
					options:$.extend({},$.fn.timebox.defaults, $.parser.parseOptions(this), options)
				});
				createBox(this);
			}
		});
	}
	
	$.fn.timebox.methods = {
		options : function(jq){
			return $.data(jq[0],"timebox").options;
		},
		setValue:function(jq,value){
			return jq.each(function(){
				$(this).val(value);
				setValue(this);
			});
		},
		getHours:function(jq){
			var opts=$.data(jq[0],"timebox").options;
			var vv=jq.val().split(opts.separator);
			return parseInt(vv[0],10)||0;
		},
		getMinutes:function(jq){
			var opts=$.data(jq[0],"timebox").options;
			var vv=jq.val().split(opts.separator);
			return parseInt(vv[1],10)||0;
		},
		getSeconds:function(jq){
			var opts=$.data(jq[0],"timebox").options;
			var vv=jq.val().split(opts.separator);
			return parseInt(vv[2],10)||0;
		}
	}
	
	$.fn.timebox.defaults = $.extend({},$.fn.spinner.defaults,{
		showSeconds:true,
		highlight:0,
		separator:':',
		panelHeight:90,
		panelWidth:110,
		currentText:'当前时间',
		closeText:'关闭',
		okText:'Ok',
		editable:false,
		novalidate:true,
		missingMessage:'该输入项为必输项',
		buttons:[{
			text: function(target){return $(target).timebox('options').currentText;},
			handler: function(target){
				var opts = $.data(target,"timebox").options;
				var now = new Date();
				var vals = new Array();
				vals.push(now.getHours());
				vals.push(now.getMinutes());
				vals.push(now.getSeconds());
				$(target).val(vals.join(opts.separator));
				setValue(target);
				if(opts.hourObj)opts.hourObj.hide();
				if(opts.minObj)opts.minObj.hide();
			}
		},{
			text: function(target){return $(target).timebox('options').closeText;},
			handler: function(target){
				var opts = $.data(target,"timebox").options;
				if(opts.hourObj)opts.hourObj.hide();
				if(opts.minObj)opts.minObj.hide();
			}
		}],
       hours:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
       spin:function(down){moveTo(this,down)}
	});
	$.parser.plugins.push('timebox');
})(jQuery)