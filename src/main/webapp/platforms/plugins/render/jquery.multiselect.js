/**
 * Author : 刘宇阳
 * Date : 2015-07-16
 * Desc : jquery-render  多选下拉框插件
 * Depend : jquery jquery.render
 * <input type="text" render="multiselect" options="name : '', valueField:'DM',textField:'DMNR', data:[{DM:'0',DMNR:'可以'},{DM:'1',DMNR:'不可以'}]"/>
 */
(function($){
	"use strict"; //严格检查模式
	/**
	 * 创建对象
	 *
	 *
	 * 
	 * @returns {Function}
	 */
	function createMultiselect(element, options) {
		var multiSelect = $.extend({
			name: name,
			element: element,
			value: $(options.targetElement).val(),
			height: '240',
			text: ''
		}, options);//参数传递

		//设置值
		multiSelect.select = function (values) {
			var value = [];
			var text = []
			if (values) {
				if (!$.isArray(values)) {
					values = values.split(',');
				}
				$(multiSelect.element).find('li :checkbox:checked').prop('checked', false);
				for (var i = 0; i < values.length; i++) {
					if (!$(multiSelect.element).find('li :checkbox[value="' + values[i] + '"]').is(':checked')) {
						$(multiSelect.element).find('li :checkbox[value="' + values[i] + '"]').prop('checked', true);
					}
				}
			}
			$(multiSelect.element).find('li :checkbox:checked').each(function () {
				value.push($(this).val());
				text.push($(this).next().text());
			});
			multiSelect.value = value.join(',');
			multiSelect.text = text.join(',');
			$(multiSelect.element).find(':text').val(multiSelect.text);
			$(multiSelect.targetElement).val(multiSelect.value);
		}
		/**
		 * 加载参数
		 * @param  {[type]} options [description]
		 * @return {[type]}         [description]
		 */
		multiSelect.load = function (options) {
			if(options){
				if(options.url){
					this.url = options.url;
					this.data = [];
				}
				if(options.params){
					this.params = options.params;
					this.data = [];
				}
				if(options.data && options.data.length > 0){
					this.data = options.data;
				}
			}
			if (this.data && $.isArray(this.data) && this.data.length > 0) {
				loadHtml(this);
				setHeight(this);
				multiSelect.select(multiSelect.value);
			} else if (this.url) {
				var _this = this;
				$.ajax({
					url: this.url,
					type: 'post',
					data: this.params,
					dataType: 'json',
					success: function (data) {
						if (_this.onloadSucess && $.isFunction(_this.onloadSucess)) {
							_this.onloadSucess(data);
						}
						if(data && data.result && $.isArray(data.result)){
							_this.data = data.result;
						}else{
							_this.data = data;
						}
						loadHtml(_this);
						setHeight(_this);
						multiSelect.select(multiSelect.value);
					},
					error:function(data){
					}
				});
			}
		}
		init(multiSelect);//初始化操作
		return multiSelect;
	}

	//初始化参数
	function init(multiSelect) {
		var element = multiSelect.element;
		var contentJq = $(element).find('.ms-content');
		$(element).find(':text').click(function (e) {
			contentJq.toggle();
			e.stopPropagation();
		});
		$(window).click(function () {
			contentJq.hide();
		});
		contentJq.delegate('li', 'click', function (e) {
			if ($(this).find(':checkbox').is(':checked')) {
				$(this).find(':checkbox').prop('checked', false);
			} else {
				$(this).find(':checkbox').prop('checked', true);
			}
			setHeight(this);
			multiSelect.select();
			e.stopPropagation();
		});
		contentJq.delegate('li :checkbox', 'click', function (e) {
			multiSelect.select();
			e.stopPropagation();
		});
		multiSelect.load();
	}

	//高度处理
	function setHeight(multiSelect) {
		var height = $(multiSelect.element).find('.ms-content').height();
		if (height > multiSelect.height) {
			$(multiSelect.element).find('.ms-content').height(multiSelect.height);
		}
	}

	function isHidden(multiSelect) {
		return $(multiSelect.element).find(':text').is(':hidden');
	}

	//加载html内容
	function loadHtml(multiSelect) {
		if (!multiSelect.data || !$.isArray(multiSelect.data)) return;
		var liTpl = '<li><input type="checkbox" name="' + multiSelect.name + '"  value="{value}"><span>{text}</span></li>';
		var html = '';
		var textField = multiSelect.textField;
		var valueField = multiSelect.valueField;
		for (var i = 0; i < multiSelect.data.length; i++) {
			html += liTpl.replace(/\{value\}/i, multiSelect.data[i][valueField]).replace(/\{text\}/i, multiSelect.data[i][textField]);
		}
		$(multiSelect.element).find('ul').html(html);//插入
	}


	$.render('multiselect', function(){
		return {
			replace : false,
			transclude : false,
			template : '<div class="ms-box">' +
							'<input type="text" readOnly class="form-input multiselect"/>'+
							'<div class="ms-content" style="display:none">'+
								'<ul>'+
								'</ul>'+
							'</div>'+
						'</div>',
			params : {
				name : null, //name值
				data : null, //数据
				url : null, //url参数
				params : {}, //params参数
				onloadSuccess : function(){}, //成功时调用方法
				textField : '', //文本字段
				valueField : '', //值字段
				width : '100%', //宽度
				required : false
			},
			link : function(element, params){
				$(element).hide();//隐藏原来的元素
				//插入模板内容
				var dom = $(this.template).insertAfter(element).get(0);
				params.targetElement = element;
				//宽度处理
				if (params && params.width) {
					if (params.width.endWith('%') || params.width.endWith('px'))
						$(dom).css('width', params.width);
					else
						$(dom).css('width', params.width + 'px');
				}
				if(params.required){
					$(dom).find('input').addClass('easyui-validatebox').attr('data-options', 'required:true');
				}
				return createMultiselect( dom, params);
			}
		}
	});
})(jQuery);