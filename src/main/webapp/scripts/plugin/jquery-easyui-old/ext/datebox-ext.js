(function($){
	function createBox(target){
		var state = $.data(target,"dateboxExt");
		var opts = state.options;
		$(target).addClass('datebox-f').combo($.extend({}, opts, {
			onShowPanel:function(){
			//initCalendar();
			}
		}));
		$(target).combo('textbox').parent().addClass('datebox');
		/**
		 * if the calendar isn't created, create it.
		 */
		if (!state.calendar){
			createCalendar();
		}
		initCalendar();
		function initCalendar(){
			var curVal = $(target).combo("getValue").replace(".","");
			var val = opts.formatter.call(target,opts.parser.call(target,curVal));
			if(curVal != '') setValue(target,val);
		}
		function createCalendar(){
			var panel = $(target).combo('panel').css('overflow','hidden');
			var cc = $('<div class="datebox-calendar-inner"></div>').appendTo(panel);
			var calendar = $('<div class="datebox-calendar-body"></div>').html(
					'<div class="calendar-header">' +
					'<div class="calendar-prevmonth"></div>' +
					'<div class="calendar-nextmonth"></div>' +
					'<div class="calendar-prevyear"></div>' +
					'<div class="calendar-nextyear"></div>' +
					'<div class="calendar-title">' +
						'<span>Aprial 2010</span>' +
					'</div>' +
				'</div>' +
				'<div class="calendar-body">' +
					'<div class="calendar-menu">' +
						'<div class="calendar-menu-year-inner">' +
							'<span class="calendar-menu-prev"></span>' +
							'<span><input class="calendar-menu-year" type="text"></input></span>' +
							'<span class="calendar-menu-next"></span>' +
						'</div>' +
						'<div class="calendar-menu-month-inner">' +
						'</div>' +
					'</div>' +
				'</div>'
			);
			calendar.appendTo(cc);
			state.calendar = calendar;
			$('.calendar-prevmonth,.calendar-nextmonth,.calendar-prevyear,.calendar-nextyear', calendar).hover(
				function(){$(this).addClass('calendar-nav-hover');},
				function(){$(this).removeClass('calendar-nav-hover');}
			);
			$(calendar).find('.calendar-nextmonth').click(function(){
				showMonth(target, 1);
			});
			$(calendar).find('.calendar-prevmonth').click(function(){
				showMonth(target, -1);
			});
			$(calendar).find('.calendar-nextyear').click(function(){
				showYear(target, 1);
			});
			$(calendar).find('.calendar-prevyear').click(function(){
				showYear(target, -1);
			});
			show(target);
			var button = $('<div class="datebox-button"><table cellspacing="0" cellpadding="0" style="width:100%"><tr></tr></table></div>').appendTo(panel);
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
			setCalendar();
		}
		
		function setCalendar(){
			var panel = $(target).combo('panel');
			var calendar = state.calendar;
			var body = calendar.find(".calendar-menu");
			body.width(panel.outerWidth() - 10).height(body.height());
			var yearBody = calendar.find(".calendar-menu-year-inner");
			calendar.find(".calendar-menu-month-inner table")._outerHeight(body.height() - yearBody.height()-25)._outerWidth(body.width());
			calendar.find(".calendar-menu-month-inner table").find("td").width(30);
		}
	}
	
	/**
	 * show the calendar corresponding to the current month.
	 */
	function showMonth(target, delta){
		var opts = $.data(target, 'dateboxExt').options;
		opts.month += delta;
		if (opts.month > 12){
			opts.year++;
			opts.month = 1;
		} else if (opts.month < 1){
			opts.year--;
			opts.month = 12;
		}
		show(target);
		var panel = $(target).combo("panel");
		var menu = $(panel).find('.calendar-menu-month-inner');
		menu.find('td.calendar-selected').removeClass('calendar-selected');
		menu.find('td:eq(' + (opts.month-1) + ')').addClass('calendar-selected');
	}
	
	/**
	 * show the calendar corresponding to the current year.
	 */
	function showYear(target, delta){
		var opts = $.data(target, 'dateboxExt').options;
		opts.year += delta;
		show(target);
		var panel = $(target).combo("panel");
		var menu = panel.find('.calendar-menu-year');
		menu.val(opts.year);
	}
	
	function show(target){
		var opts = $.data(target, 'dateboxExt').options;
		var panel = $(target).combo('panel');
		$(panel).find('.calendar-menu').show();
		$(panel).find('.calendar-title span').html(opts.months[opts.month-1] + ' ' + opts.year);
		$(panel).find('.calendar-menu-year').val(opts.year);
		
		if ($(panel).find('.calendar-menu-month-inner').is(':empty')){
			$(panel).find('.calendar-menu-month-inner').empty();
			var t = $('<table class="calendar-mtable"></table>').appendTo($(panel).find('.calendar-menu-month-inner'));
			var idx = 0;
			for(var i=0; i<3; i++){
				var tr = $('<tr></tr>').appendTo(t);
				for(var j=0; j<4; j++){
					$('<td class="calendar-menu-month"></td>').html(opts.months[idx++]).attr('abbr',idx).appendTo(tr);
				}
			}
			
			$(panel).find('.calendar-menu-prev,.calendar-menu-next').hover(
					function(){$(this).addClass('calendar-menu-hover');},
					function(){$(this).removeClass('calendar-menu-hover');}
			);
			$(panel).find('.calendar-menu-next').click(function(){
				var y = $(panel).find('.calendar-menu-year');
				if (!isNaN(y.val())){
					opts.year = parseInt(y.val()) + 1; 
					show(target);
				}
			});
			$(panel).find('.calendar-menu-prev').click(function(){
				var y = $(panel).find('.calendar-menu-year');
				if (!isNaN(y.val())){
					opts.year = parseInt(y.val()) - 1; 
					show(target);
				}
			});
			
			$(panel).find('.calendar-menu-year').keypress(function(e){
				if (e.keyCode == 13){
					if (!isNaN($(this).val())){
						opts.year = parseInt($(this).val()); 
					}
					doEnter(target);
				}
			}).blur(function(e){
				if (!isNaN($(this).val())){
					opts.year = parseInt($(this).val()); 
				}
			});
			
			$(panel).find('.calendar-menu-month').hover(
					function(){$(this).addClass('calendar-menu-hover');},
					function(){$(this).removeClass('calendar-menu-hover');}
			).click(function(){
				//选择时间
				var menu = $(panel).find('.calendar-menu');
				menu.find('.calendar-selected').removeClass('calendar-selected');
				$(this).addClass('calendar-selected');
				var month = $(this).attr('abbr');
				if (!isNaN(month)){
					opts.month = parseInt(month);
				}
				doEnter(target);
			});
		}
	}
	
	function doQuery(target, q){
		setValue(target, q, true);
	}
	
	/**
	 * called when user press enter key
	 */
	function doEnter(target){
		var state = $.data(target, 'dateboxExt');
		var opts = state.options;
		var current = new Date(opts.year,opts.month-1,1);
		if (current){
			setValue(target, opts.formatter.call(target, current));
			$(target).combo('hidePanel');
		}
	}
	
	function moveCalendar(target,curDate){
		var state = $.data(target,"dateboxExt");
		var opts = state.options;
		opts.current = curDate;
		opts.year  = curDate.getFullYear();
		opts.month = curDate.getMonth()+1;
		showYear(target,0);
		showMonth(target,0);
		//$(target).combo("setText",opts.formatter.call(target,curDate));
	}
	
	function setValue(target, value, remainText){
		var state = $.data(target, 'dateboxExt');
		var opts = state.options;
		$(target).combo('setValue', value).combo('setText',value);
		var oldValue = opts.current;
		try{
			opts.current = opts.parser.call(target,value);
		}catch(e){
			opts.current = new Date(opts.year,opts.month-1,1);
		}
		moveCalendar(target,opts.current);
		opts.onChange.call(target,opts.current,oldValue);
	}
	
	$.fn.dateboxExt = function(options, param){
		if(typeof options == "string"){
			var method = $.fn.datebox.methods[options];
			if (method){
				return $.fn.dateboxExt.methods[options](this,param);
			} else {
				return this.combo(options, param);
			}
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this,"dateboxExt");
			if(state){
				$.extend(state.options, options);
			}else{
				state = $.data(this, 'dateboxExt', {
					options:$.extend({}, $.fn.dateboxExt.defaults, $.parser.parseOptions(this), options)
				});
				createBox(this);
			}
		});
	};
	
	$.fn.dateboxExt.methods = {
		options: function(jq){
			return $.data(jq[0], 'dateboxExt').options;
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		}
	};
	
	$.fn.dateboxExt.defaults = {
		firstDay:0,
		currentText:'本月',
		closeText:'关闭',
		okText:'Ok',
		panelWidth:180,
		panelHeight:'auto',
		editable:false,
		buttons:[{
			text: function(target){return $(target).dateboxExt('options').currentText;},
			handler: function(target){
				var state = $.data(target,"dateboxExt");
				var opts = state.options;
				opts.year = new Date().getFullYear();
				opts.month = new Date().getMonth()+1;
				opts.current = new Date();
				doEnter(target);
			}
		},{
			text: function(target){return $(target).dateboxExt('options').closeText;},
			handler: function(target){
				$(this).closest('div.combo-panel').panel('close');
			}
		}],
		weeks:['日','一','二','三','四','五','六'],
		months:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
		year:new Date().getFullYear(),
		month:new Date().getMonth()+1,
		current:(function(){
			var d = new Date();
			return new Date(d.getFullYear(), d.getMonth(), d.getDate());
		})(),
		parser:function(s){
			s = s.replace(/-/g,"/");
			var t = Date.parse(s);
			if(isNaN(t)){
				t = Date.parse(s + "/01");
			}
			if (!isNaN(t)){
				return new Date(t);
			} else {
				return new Date();
			}
		},
		formatter:function(date){
			var y = date.getFullYear();
			var m = date.getMonth()+1;
			m = m > 9 ? m :'0'+m;
			return y+'-'+m;
		},
		keyHandler: {
			up:function(e){},
			down:function(e){},
			left: function(e){},
			right: function(e){},
			enter:function(e){doEnter(this)},
			query:function(q,e){doQuery(this, q)}
		},
		novalidate:true,
		missingMessage:'该输入项为必输项',
		styler:function(date){return ''},
		validator:function(date){return true},
		onSelect: function(date){},
		onChange: function(newDate, oldDate){}
	};
	$.parser.plugins.push('dateboxExt');
})(jQuery)