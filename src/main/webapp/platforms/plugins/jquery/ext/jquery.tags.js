// 本文件中两个控件样式依赖于tags.css

if(!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(e){
		for(var i=0,j; j=this[i]; i++){
			if(j==e){return i;}
		}
		return -1;
	};
}

$.fn.doAutosize = function(o){
    var minWidth = $(this).data('minwidth'),
        maxWidth = $(this).data('maxwidth'),
        val = '',
        input = $(this),
        testSubject = $('#'+$(this).data('tester_id'));

    if (val === (val = input.val())) {return;}

    // Enter new content into testSubject
    var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    testSubject.html(escaped);
    // Calculate new width + whether to change
    var testerWidth = testSubject.width(),
        newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth,
        currentWidth = input.width(),
        isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
            || (newWidth > minWidth && newWidth < maxWidth);

    // Animate width
    if (isValidWidthChange) {
        input.width(newWidth);
    }
};

$.fn.resetAutosize = function(options){
    // alert(JSON.stringify(options));
    var minWidth =  $(this).data('minwidth') || options.minInputWidth || $(this).width(),
        maxWidth = $(this).data('maxwidth') || options.maxInputWidth || ($(this).closest('.tagsinput').width() - options.inputPadding),
        val = '',
        input = $(this),
        testSubject = $('<tester/>').css({
            position: 'absolute',
            top: -9999,
            left: -9999,
            width: 'auto',
            fontSize: input.css('fontSize'),
            fontFamily: input.css('fontFamily'),
            fontWeight: input.css('fontWeight'),
            letterSpacing: input.css('letterSpacing'),
            whiteSpace: 'nowrap'
        }),
        testerId = $(this).attr('id')+'_autosize_tester';
    if(! $('#'+testerId).length > 0){
        testSubject.attr('id', testerId);
        testSubject.appendTo('body');
    }

    input.data('minwidth', minWidth);
    input.data('maxwidth', maxWidth);
    input.data('tester_id', testerId);
    input.css('width', minWidth);
};

/**
 * 选择标签控件
 * @author 黄冠豪
 * @create-date 2015-07-29
 *
 * 此控件用于把textarea转成一个标签选择控件，控件高宽与textarea一致
 * 配置项
 * @option: 
 * 		separator 	{String}        标签分隔符，默认为','。
 * 			此分隔符用于读取textarea  和生成多个标签的字符串时分隔。
 * 		data 		{Array}	        字符串数组，可选择的标签
 * 		toolIconCls {String}	    按钮class属性
 * 	    hideToolBtn {Boolean}       是否隐藏工具按钮，点击工具按钮会触发onToolClick函数
 * 		onToolClick {function}	    点击控件按钮的事件函数
 * 	    canSelect   {Boolean}       是否打开选中功能，当打开时，表单内容为选中内容，否则，表单内容为所有标签
 * 	    editable    {Boolean}       是否可编辑标签
 * 	    viewMode	{Boolean}		视图模式，只展示标签，不可选择与编辑，此模式只显示表单已有的标签，不会读取data参数
 * 		inputTextLength	{Number}	标签输入框文字最大长度，默认为10
 * 		editableTitle	{String}	可编辑状态下标签框的提示信息
 * 		selectedAfterEdit	{Boolean}	在添加一个标签后是否自动选中，默认为true
 */
(function($) {
	var DATA_KEY = 'tags'
        INDEX = 0,
        TAG_WRAP_PRE = 'tag-wrap-';
	// private function
    // 显示标签输入框
    var showInput = function() {
        var me = this,
            data =  getPrivateData.call(me),
            input = data.inputObject;
        data.tagWrap.append(input);
        input.show();
        input.focus();
    };
    // 隐藏并把input的内容生成标签
    var hideInput = function() {
        var me = this,
            settings = me.data(DATA_KEY),
            data =  getPrivateData.call(me),
            input = data.inputObject,
            tagWrap = data.tagWrap,
            val = $.trim(input.val());
        input.hide();
        input.val('');
        if(val.length > 0) {
            tagWrap.append(generateTag.call(me, {
                text: val,
                canDel: settings.editable
            }));
            // 在可选择状态下，selectedAfterEdit为true，自动选中标签
            if(settings.canSelect && settings.selectedAfterEdit) {
            	selectTag.call(me, val);
            }
            //更新原始表单数据
            updateInput.call(me);
        }
    };
    // 创建标签输入input
    var createInput = function() {
        var me = this,
            data = getPrivateData.call(me),
            settings = me.data(DATA_KEY),
            input = $(document.createElement('input')),
            tagWrap = data.tagWrap;
        data.inputObject = input;
        // 初始化自动宽度计算控件
        input.resetAutosize({
            minInputWidth: 50,
            maxInputWidth: 200
        });

        // 点击控件以外的区域完成输入
        var onDocClick = function(e) {
            // 判断控件元素是否被销毁，如已销毁，解除此控件对document点击事件的监听
            if($(this).has(me).length === 0) {
                $(document).unbind('click', onDocClick);
                return;
            }
            // 点击空白处，显示input
            if(e.target.id === data.wrapId) {
                showInput.call(me);
            } else if(tagWrap.has(e.target).length === 0) {
                // 点击Tags控件以外的地方，隐藏并根据input内容生成标签
                hideInput.call(me);
            }
        };
        input.attr('maxlength', settings.inputTextLength);
        $(document).bind('click', onDocClick);
        input.bind('keypress', function(e) {
            // 回车或分隔符创建标签
            if(e.which === 13 || e.which === settings.separator.charCodeAt(0)) {
                hideInput.call(me);
                showInput.call(me);
                // 阻止把字符输入到input
                e.preventDefault();
            } else {
                // 内容改变时调整输入框宽度
                input.doAutosize({
                    comfortZone: 10
                });
            }
        });
        input.bind('keydown', function(e) {
            // backspace删除上一个标签
            if(e.which === 8 && input.val().length === 0) {
                removeTag.call(me, data.tags[data.tags.length - 1]);
            }
        });
    };

	var generateTag = function(options) {
		var me = this,
			data = me.data(DATA_KEY),
			text = options.text;
		// 如果标签已存在，不再生成
		if(isExist.call(this, text)) {
			return null;
		}
		// 标签文字
        var tag = $(document.createElement('span'));
        tag.text(text);
		// 标签边框
        tag = $(document.createElement('span')).append(tag);
        tag.data('data', {
        	text: text
        }).addClass('tag');
		if(data.canSelect) {
			tag.css('cursor', 'pointer');
		}
		// 标签删除按钮
		if(options.canDel) {
			$(document.createElement('button'))
				.attr({
					type: 'button'
				})
				.addClass('delBtn')
				.text('x')
				.appendTo(tag);
		}

        var privateData = getPrivateData.call(this);
        privateData.tagEls[text] = tag;
		privateData.tags.push(text);
        // 添加click事件
        tag.click(this, onClickTag);
        return tag;
    };
    // 删除标签
	var removeTag = function(text) {
		var me = this,
			privateData = getPrivateData.call(me),
			selectedTags = privateData.selectedTags,
			tagIndex = selectedTags.indexOf(text),
			tags = privateData.tags,
            tagEls = privateData.tagEls;
		selectedTags.splice(tagIndex, 1);
		tagIndex = tags.indexOf(text);
		tags.splice(tagIndex, 1);
        tagEls[text].remove();
        delete tagEls[text];
        updateInput.call(me);
	};
	// 选中标签
	var selectTag = function (index) {
		var $this = $(this),
			data = $this.data(DATA_KEY);
		if(!data.canSelect) {
			//TODO 会导致表单无数据，因为没有选中的标签
			return;
		}
		var privateData = getPrivateData.call($this);
		var tag = privateData.tagEls[index];
		if(tag) {
			tag.addClass('selected');
			tag.data('data').selected = true;
			privateData.selectedTags.push(index);
		}
	};
	// 取消选中标签
	var unselectTag = function (index) {
		var $this = $(this);
		var privateData = getPrivateData.call($this);
		var tag = privateData.tagEls[index];
		if(tag) {
			tag.removeClass('selected');
			tag.data('data').selected = false;
			
			var selectedTags = privateData.selectedTags;
			$.each(selectedTags, function(i, text) {
				if(text == index) {
					selectedTags.splice(i, 1);
					return false;
				}
			});
		}
	};
	// 更新原始表单
	var updateInput = function () {
		var me = this,
			settings = me.data(DATA_KEY),
			data = getPrivateData.call(this);
		if(settings.canSelect) {
			$(this).val(data.selectedTags.join($(this).data('tags').separator));
		} else {
			$(this).val(data.tags.join(settings.separator));
		}
	};
	// 判断是否存在某标签
	var isExist = function (index) {
		return getPrivateData.call($(this)).tagEls[index] ? true : false;
	};
	// 判断标签是否被选中
	var isSelected = function (index) {
		if(typeof index === 'object') {
			return $(index).data('data').selected;
		}
		return getPrivateData.call($(this)).tagEls[index].data('data').selected;
	};
	// 标签点击事件，选中与取消选中
	var onClickTag = function (event) {
		var me = event.data,
			tag = $(this),
			text = tag.data('data').text;
		if(event.target.className === 'delBtn') {
			removeTag.call(me, text);
		} else {
			if(!isSelected.call(me, text)) {
				selectTag.call(me, text);
			} else {
				unselectTag.call(me, text);
			}
		}

		updateInput.call(me);
	};
	// 生成更多操作按钮，点击会执行回调函数options.onToolClick
	var generateTools = function() {
		var data = $(this).data('tags');
		var cls = data.toolIconCls;
		var tool = $('<button type="button"></button>');
		tool.addClass(cls);
		tool.css({
			border: 'none',
			outline: 'none'
		});
		tool.click(data.onToolClick);
		var span = $('<span class="tags-tool"></span>');
		span.append(tool);
		return span;
	};
	// 生成标签控件最顶端元素
	var generateTagPanel = function() {
		var me = this,
			data = me.data(DATA_KEY),
			tagsPanel = $(document.createElement('div')),
			paddingRight;
		if(data.hideToolBtn) {
			paddingRight = '1px';
		} else {
			paddingRight = '25px';
		}
		tagsPanel.css({
			paddingRight: paddingRight
		});
		return tagsPanel;
	};
	// 创建标签包裹元素
	var generateTagWrap = function() {
		var me = this,
			data = me.data(DATA_KEY),
            privateData = getPrivateData.call(me),
			wrapDiv = $(document.createElement('div')),
            wrapId = TAG_WRAP_PRE + INDEX,
			tagsStr = me.val(),
			tags = tagsStr ? tagsStr.split(data.separator) : [];

		if(!data.viewMode) {
			$.each(data.data, function (index, val) {
				wrapDiv.append(generateTag.call(me, {
					text: val,
					canDel: data.editable
				}));
			});
		}

		// 选中原始表单中的标签
		$.each(tags, function (index, val) {
			if(!isExist.call(me, val)) {
				wrapDiv.append(generateTag.call(me, {
					text: val,
					canDel: data.editable
				}));
			}
			selectTag.call(me, val);
		});

		wrapDiv.addClass('tags-wrap');
        wrapDiv.attr('id', wrapId);
        privateData.wrapId = wrapId;
		var cssOptions = {
			width: '100%'
		};
		if(data.viewMode) {
			cssOptions.border = 'none';
			cssOptions.background = 'none';
		} else {
			cssOptions.height = me.outerHeight();
		}
		wrapDiv.css(cssOptions);
		// 可编辑状态下添加输入提示信息
		if(data.editable) {
			wrapDiv.attr('title', data.editableTitle);
		}
		
        privateData.tagWrap = wrapDiv;
		return wrapDiv;
	};
	var getPrivateData = function() {
		var data = $(this).data('privateData');
		if(!data) {
			data = {
				tagEls: {},
				selectedTags: [],
				tags: []
			};
			$(this).data('privateData', data);
		}
		return data;
	};
	var verifyOptions = function(options) {
		// 验证并修正传入参数是否有误
		options.data = options.data || [];
	};
	// public function
	var methods = {
		init: function (options) {
			return this.each(function () {
				var $this = $(this);
				var settings = $this.data(DATA_KEY);
				
				if(typeof settings == 'undefined') {
					var defaults = {
						separator: ',',
						data: [],
						onToolClick: function(){},
						toolIconCls: 'icon-manager-ext',
						hideToolBtn: false,
						canSelect: true,
						selectedAfterEdit: true,
						editable: false,
						viewMode: false,
						inputTextLength: 10,
						editableTitle: '点击空白此可添加标签，按回车完成添加'
					};
					settings = $.extend({}, defaults, options);
				} else {
					settings = $.extend({}, settings, options);
				}
				verifyOptions(settings);
				$this.data(DATA_KEY, settings);
				var privateData = getPrivateData.call($this);
				// 获取表单值
				var value = $this.val(), values = [];
				var width = $this.outerWidth(),
					height = $this.outerHeight();
				if(value) {
					values = value.split(settings.separator);
				}
				// 创建标签元素
				var wrapDiv = generateTagWrap.call($this);

				// 控件顶端元素
				var tagsPanel = generateTagPanel.call($this);
				tagsPanel.append(wrapDiv);
                if(!settings.hideToolBtn) {
                    tagsPanel.append(generateTools.call($this));
                }
				tagsPanel.insertAfter($this);
				privateData.topEl = tagsPanel;
                // 创建标签输入框
                if(settings.editable) {
                    createInput.call($this);
                }
				$this.hide();
			});
		},
        destroy: function(options) {
            return $(this).each(function() {
                var $this = $(this),
                	privateData = privateData.call($this);
                privateData.topEl.remove();
                $this.removeData('tags');
                $this.removeData('privateData');
                $this.show();
            });
        },
        val: function(options) {
            var someValue = $(this).data('tags').selectedTags;
 
            return someValue;
        },
        // 重新加载数据，必须有一个参数data，新的标签数据，字符串数组
        reload: function(data) {
        	return $(this).each(function() {
        		var $this = $(this),
        			privateData = getPrivateData.call($this);
        		privateData.topEl.remove();
        		privateData.tagEls = {};
        		privateData.selectedTags = [];
				privateData.tags = [];
                $this.show();
        		$this.tags({
        			data: data
        		});
        	});
        }
	};
	
	$.fn.tags = function () {
		var method = arguments[0];
		if(methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if( typeof(method) == 'object' || !method ) {
            method = methods.init;
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tags' );
            return this;
        }
 
        return method.apply(this, arguments);
	};
}(jQuery));


/**
 * 此标签控件用于检索条件的input表单替换成标签选择控件
 * @author 黄冠豪
 * @create-date 2015-07-29
 * 选项参数如下：
 *	@param option
 * 	separator: 		String	分隔符，默认为','，读取和生成多个标签字符串的分隔符，字符串会赋值到原始input表单
 * 	emptyText: 		String	当未选择标签时显示的字符串，默认为：'可选择标签查询'
 *  searchEmptyText	String	在选择标签tooltip输入框中的提示字符串
 *  tipPosition		String	选择标签tooltip显示的方位，可配置的值有：'bottom', 'top', 'left', 'right'
 * 	data: 			Array	字符串数组，此数组为所有标签的集合
 * 	addBtnIcon: 	String	标签选择tooltip按钮class，默认为：'icon-arrow-open'
 *  showSearchTypeBtn	Boolean	是否显示检索方式选择表单，如果为true，本表单会在原始表单后创建一个隐藏的表单，
 *  							name属性为searchType，默认vlaue为OR，用户可通过下拉框选择“与”（AND）或“或”（“OR”）
 * 	searchByPinyin	Boolean	在选择标签tooltip里是否可通过拼音进行筛选，默认为true
 * 	pinyinSrc		String	中文转拼音js文件url路径，默认为同目录下的jQuery.Hz2Py-min.js。如果你不需要通过拼音进行检索，
 *							searchByPinyin配置为false后无需配置此项，插件也不会依赖jQuery.Hz2Py-min.js。
 *  						此JS必须为String对象添加两个函数toPinYin（转成拼音），toShouZiMu（转成拼音首字母）
 * 							如果你用其他方式实现中文转拼音，无需配置此选项，然后定义以下转换函数：
 * 	toPinyinFunction 		Function(tagStr)	配置此函数用于中文转换成拼音
 * 	toInitialPinyinFunction Function(tagStr) 	配置此函数用于中文转换成拼音首字母
 * */
(function($) {
	var DATA_KEY = 'tagInput';
	// private function
	var generateTag = function(options) {
        var tag = $('<span></span>');
        tag.text(options.text);
        tag = $('<span></span>').append(tag);
        tag.addClass('tag');
        if(options.showRemoveBtn) {
        	var removeBtn = $('<a style="margin-left:3px;color:#6492D1;cursor:pointer;">X</a>');
            removeBtn.data('data', {
            	text: options.text
            });
            removeBtn.click(this, options.onRemove);
            tag.append(removeBtn);
        }
        if(options.onClick) {
        	tag.click(options.onClick);
        }
        return tag;
    };
    var loadjs = function (script_filename) {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', script_filename);
        script.setAttribute('id', 'coolshell_script_id');
     
        script_id = document.getElementById('coolshell_script_id');
        if(script_id){
            document.getElementsByTagName('head')[0].removeChild(script_id);
        }
        document.getElementsByTagName('head')[0].appendChild(script);
    };
    // 判断某标签是否存在
	var isExist = function (index) {
		return getPrivateData.call($(this)).tagEls[index] ? true : false;
	};
	// 判断已选标签是否为空
	var isEmpty = function () {
		var data = getPrivateData.call($(this));
		return data.tags && data.tags.length > 0 ? false : true;
	};
	// 更新原始表单
	var updateInput = function () {
		var data = getPrivateData.call($(this));
		$(this).val(data.tags.join(data.separator));
	};
	// 标签x按钮事件
	var onRemoveBtnClick = function(event) {
		$this = $(this);
		removeTag.call(event.data, $this.data('data').text);
	};
	// 生成按钮函数
	var generateTools = function() {
		var addBtn = $('<a class="add-tool"></a>');
		var $this = $(this);
		var settings = $this.data(DATA_KEY),
			privateData = getPrivateData.call($this);
		addBtn.addClass(settings.addBtnIcon);
		// 生成标签选择tooltip
		privateData.selectTip = generateAddTip({
			el: addBtn,
			searchByPinyin: settings.searchByPinyin,
			toPinyinFunction: settings.toPinyinFunction,
			toInitialPinyinFunction: settings.toInitialPinyinFunction,
			searchEmptyText: settings.searchEmptyText,
			position: settings.tipPosition,
			data: settings.data,
			onSelect: function(tag) {
				addTag.call($this, tag);
			},
			onUnselect: function(tag) {
				removeTag.call($this, tag);
			}
		});
		var tool = $('<span class="tools"></span>');
		tool.append(addBtn);
		var marginRight = '-20px';
		if(settings.showSearchTypeBtn) {
			marginRight = '-55px';
			var searchTypeBtn = $('<select><option value="AND">与</option><option selected="selected" value="OR">或</option></select>');
			tool.append(searchTypeBtn);
			searchTypeBtn.change(function() {
				privateData.searchTypeInputEl.val($(this).val());
			});
		}
		tool.css({
			marginRight: marginRight
		});
		return tool
	};
	
	// 生成标签选择tooltip
	var generateAddTip = function(options) {
		var tagEls = {};
		var selectedTags = [];
		var tipWrap = $('<div class="add-tip"><header><span style="line-height:21px;padding-left:5px;">标签</span></header></div>');
		var seachForm = $('<form onsubmit="return false;"><label>查询条件：</label><input style="width:180px;" /></form>');
		seachForm.find('input').attr('placeholder', options.searchEmptyText);
		tipWrap.append(seachForm);
		var tagWrap = $('<div class="add-tags-wrap clearfix"></div>');
		// 此tooltip公开给调用者的函数
		var thisTipObject = {
			select: function (tag) {
				// 选中标签
				if(selectedTags.indexOf(tag) < 0) {
					selectedTags.push(tag);
				}
				var tagEl = tagEls[tag];
				if(!tagEl) {
					return;
				}
				var data = tagEl.data('data');
				tagEl.addClass('selected');
				data.selected = true;
				// 如果选中标签，调用此函数。
				options.onSelect(data.text);
			},
			unselect: function (tag) {
				// 取消选中标签
				var index = selectedTags.indexOf(tag);
				if(index >= 0) {
					selectedTags.splice(index, 1);
				}
				var tagEl = tagEls[tag];
				if(!tagEl) {
					return;
				}
				var data = tagEl.data('data');
				tagEl.removeClass('selected');
				data.selected = false;
				// 如果取消选中标签，调用此函数。
				options.onUnselect(data.text);
			}
		};
		// 标签点击事件
		var clickTag = function () {
			var $tag = $(this);
			var data = $tag.data('data');
			if(!data.selected) {
				thisTipObject.select(data.text);
			} else {
				thisTipObject.unselect(data.text);
			}
		};
		// 生成每一个标签
		$.each(options.data, function(index, tag) {
			var tagEl = generateTag({
				text:tag, 
				showRemoveBtn: false, 
				onClick: clickTag
			});
			tagWrap.append(tagEl);
			tagEls[tag] = tagEl;
			tagEl.data('data', {
				text: tag
			});
		});
		tipWrap.append(tagWrap);
		if(!$.fn.tooltip) {
			$.error('本插件依赖easy tooltip控件，请在本插件前加载');
			return;
		}
		$(options.el).tooltip({
			content: tipWrap,
			showEvent: 'click',
			showDelay: 0,
			position: options.position,
            onShow: function(){
                var t = $(this);
                t.tooltip('tip').unbind().bind('mouseenter', function(){
                    t.tooltip('show');
                }).bind('mouseleave', function(){
                    t.tooltip('hide');
                });
            }
		});
		// 此函数只用于搜索触发的重载事件，只加载带有关键词的标签
		var reload = function (event) {
			var key = event.data.val();
			tagWrap.empty();
			tagEls = {};
			$.each(options.data, function(index, tag) {
				var matchPY = false;
				if(options.searchByPinyin) {
					var py = options.toPinyinFunction(tag);
					if(py.indexOf(key) >= 0) {
						matchPY = true;
					}
					var szm = options.toInitialPinyinFunction(tag);
					if(szm.indexOf(key) >= 0) {
						matchPY = true;
					}
				}
				if(tag.indexOf(key) >= 0 || matchPY) {
					var tagEl = generateTag({
						text: tag,
						showRemoveBtn: false, 
						onClick: clickTag
					});
					tagEls[tag] = tagEl;
					tagEl.data('data', {
						text: tag
					});
					for(var i in selectedTags) {
						if(selectedTags[i] == tag) {
							tagEl.data('data').selected = true;
							tagEl.addClass('selected');
						}
					}
					tagWrap.append(tagEl);
				}
			});
		};
		//seachForm.find('button').click(seachForm.find('input'), reload);
		seachForm.find('input').keyup(seachForm.find('input'), reload);
		
		return thisTipObject;
	};
	// 添加标签
	var addTag = function(index) {
		var $this = $(this),
		data = getPrivateData.call($this);
		// 如果已存在此标签，不再添加
		if(data.tags.indexOf(index) >= 0) {
			return;
		}
		data.tags.push(index);
		// 生成标签
		var tag = generateTag.call($this, {
			text: index, 
			showRemoveBtn: true,
			onRemove: onRemoveBtnClick
		});
		data.tagEls[index] = tag;
		data.tagWrapEl.append(tag);
		// 更新原始表单
		updateInput.call($this);
		
		// 隐藏空白文字
		data.emptyTextEl.hide();
		data.tagWrapEl.show();
	};
	// 删除标签
	var removeTag = function(index) {
		var $this = $(this),
		data = getPrivateData.call($this);
		// 找到标签并删除
		$.each(data.tags, function(i, text) {
			if(text == index) {
				data.tags.splice(i, 1);
				data.tagEls[index].remove();
				data.selectTip.unselect(index);
				// 更新原始表单
				updateInput.call($this);
				return false;
			}
		});
		// 删除标签后判断是否为空，为空时显示空白文字
		if(isEmpty.call($this)) {
			data.emptyTextEl.show();
			data.tagWrapEl.hide();
		}
	};
	// 读取本控件数据
	var getPrivateData = function () {
		var $this = $(this);
		var data = $this.data('tags-data');
		if(!data) {
			data = {
				tags:[],
				tagEls: {},
				tagWrapEl: null,
				selectTip: null,
				emptyTextEl: null
			};
			$this.data('tags-data', data);
		}
		return data;
	};
	// public function
	var methods = {
		init: function (options) {
			return $(this).each(function() {
				var $this = $(this);
				var settings = $this.data(DATA_KEY);
				
				if(typeof settings == 'undefined') {
					var defaults = {
						separator: ',',
						emptyText: '可选择标签查询',
						searchEmptyText: '可输入关键字、拼音或首字母查询',
						data: [],
						tipPosition: 'bottom',
						tipBtnIcon: 'icon-arrow-open',
						addBtnIcon: 'icon-arrow-open',
						showSearchTypeBtn: true,
						searchByPinyin: true,
						pinyinSrc: 'jQuery.Hz2Py-min.js',
						toPinyinFunction: function(str) {
							return String.prototype.toPinYin ? str.toPinYin() : '';
						},
						toInitialPinyinFunction: function(str) {
							return String.prototype.toShouZiMu ? str.toShouZiMu() : '';
						}
					};
					
					settings = $.extend({}, defaults, options);
				} else {
					settings = $.extend({}, settings, options);
				}
				$this.data(DATA_KEY, settings);
				// 加载中文转拼音JS
				if(settings.searchByPinyin && settings.pinyinSrc) {
					loadjs(settings.pinyinSrc);
				}
				// 获取本插件数据
				var privateData = getPrivateData.call($this);
				$this.hide();
				var inputWrap = $('<div></div>');
				// 是否显示展示tip，顶端容器右方保留的空间不同
				var paddingRight = '20px';
				if(settings.showSearchTypeBtn) {
					paddingRight = '58px';
				}
				inputWrap.css({
					height: '30px',
					paddingRight: paddingRight
				});
				inputWrap.addClass('tagInput');
				// 创建未选中标签时显示的文字元素
				var emptyText = $('<p style="display: inline;" class="empty-text"></p>');
				emptyText.text(settings.emptyText);
				privateData.emptyTextEl = emptyText;
				inputWrap.append(emptyText);
				// 标签容器
				var tagWrap = $('<div></div>');
				privateData.tagWrapEl = tagWrap;
				inputWrap.append(tagWrap);
				// 生成工具按钮
				var tools = generateTools.call(this);
				inputWrap.append(tools);
				// 读取默认标签
				var value = $this.val(), values = [];
				if(value) {
					values = value.split(settings.separator);
				}
				$.each(values, function (index, val) {
					if(!isExist.call($this, val)) {
						addTag.call($this, val);
						privateData.selectTip.select(val);
					}
				});
				// 根据是否有标签来显示和隐藏空白文字
				if(isEmpty.call($this)) {
					privateData.emptyTextEl.show();
					privateData.tagWrapEl.hide();
				} else {
					privateData.emptyTextEl.hide();
					privateData.tagWrapEl.show();
				}
				inputWrap.insertAfter($this);
				
				if(settings.showSearchTypeBtn) {
					var searchType = $('<input hidden="hidden" name="searchType" value="OR"/>');
					privateData.searchTypeInputEl = searchType;
					searchType.insertAfter($this);
				}
				
				privateData.isInit = true;
			});
		},
		isInit: function() {
			var privateData = getPrivateData.call($(this));
			return !!privateData.isInit;
		}
	};
	$.fn.tagInput = function () {
		var method = arguments[0];
		if(methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if( typeof(method) == 'object' || !method ) {
            method = methods.init;
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tagInput' );
            return this;
        }
 
        return method.apply(this, arguments);
	};
}(jQuery));
