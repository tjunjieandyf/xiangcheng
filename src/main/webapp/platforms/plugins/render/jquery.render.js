/**
 * Author : 刘宇阳
 * Date : 2015.07.13
 * Desc : 表单渲染插件
 */
//自定义渲染器
//$.render('', function(){
//	return {
//		replace : 'true',
//      require : '',  必需在哪个组件下
//		addClass : '',  当replace=false时解析此属性， 在元素上添加class
//		transclude : true,
//		params : {
//			a : true, //true/false是否必须此属性
//		},
//	    template: '<h3>Hello World!!</h3>',
//      compile : function(element, tpl, params){
//	         //在模板未替换之前调用的方法，用于改变模板内容
//		},
//      element 替换之后的元素对象
//      params 参数对象
//      当require参数存在时会有第三个参数，代表父组件对象
//		link ： function(element, params, parant){
//          模板替换之后调用的方法
//          return ;//返回组件对象
//		}
//	}
//});
//调用
//$(selector).render(flag);
(function($, window) {
	'use strict'; //开启严格检查
	var render = createRender();
	$.render = render.render;
	/**
	 * $(selector).render();
	 * @param {Object} flag 是否渲染自身
	 */
	$.fn.render = function(flag) {
		//如果渲染自身
		if(flag){
			var renderName = $(this).attr('render');
			if(renderName && $.trim(renderName) != ''){
				render.$render(renderName, this.get(0));
			}else{
				render.$compile(this.get(0)); //从此标签开始编译
			}
		}else{
			render.$compile(this.get(0)); //从此标签开始编译
		}
	}

	/**
	 * @description 创建render对象
	 */
	function createRender() {
		var renderMap = {}; //存储渲染器
		var renderAttr = "render";
		/**
		 * 定义render对象
		 * @param {Object} name
		 * @param {Object} fun
		 */
		function render(name, fun) {
			if (!name || $.trim(name) == '' || !$.isFunction(fun)) {
				throw new Error("参数不正确");
			}
			renderMap[name] = fun(); //执行方法返回render对象
		}

		/**
		 * 判断是否有此渲染器
		 */
		function hasRender(name) {
			var flag = false;
			if (renderMap[name])
				flag = true;
			return flag;
		}

		/**
		 * 渲染方法
		 * @param {Object} name   渲染器名称
		 * @param {Object} element 需要渲染的dom对象
		 */
		function $render(name, element) {
			var renderObj = renderMap[name]; //拿到渲染对象
			var params = {}; //存储参数对象
			var dom = element;
			var htmlTpl = renderObj.template;
			var parent = null; //存储父组件对象
			//如果定义了norender属性就不渲染
			if ($(dom).attr('norender')) {
				return;
			}
			$(dom).attr('norender', true);//设置元素只渲染一次
			//父组件判断
			if(renderObj.require && $.type(renderObj.require) === "string"){
				var parentsJq = $(dom).parents("[render=" + $.trim(renderObj.require) + "]:eq(0)");
				if(parentsJq && parentsJq.length > 0){
					parent = parentsJq.data('component'); //获取parent对象
				}else{
					throw new Error("请指定" + name + "组件所需的" + renderObj.require + "父组件");
				}
			}
			//参数获取
			if (renderObj.params) {
				for (var param in renderObj.params) {
					params[param] = $(element).attr(param);
				}
				//options获取
				if($(element).attr("options")){
					try{
						var options = eval('({' + $(element).attr("options") + '})') || {};
						params = $.extend(params, options);
					}catch(e){
						//console.error('options参数格式错误哦');
						//console.error(e);
					}
				}
				$.map(renderObj.params, function(value, key){
					if(value != undefined && value != null && (params[key] == undefined || params == null)){
						params[key] = value;
					}
				});
			}
			//是否添加Class
			if (renderObj.addClass && $.trim(renderObj.addClass) != '') {
				$(element).addClass(renderObj.addClass);
			}
			//动态拼接模板的步骤
			if (renderObj.compile && $.isFunction(renderObj.compile)) {
				try{
					htmlTpl = renderObj.compile(element, htmlTpl, params);
				}catch(e){
					//console.error(e);
				}
			}
			//替换模板操作
			if (renderObj.replace) {
				if (renderObj.transclude) {
					var innerHtml = $(element).html(); //获取内部html内容
					htmlTpl = htmlTpl.replace(/\{transclude\}/g, innerHtml); //替换模板中的{transclude}字段
				}
				dom = $(htmlTpl).insertAfter(element).get(0); //替换
				$(element).remove();
			}
			$(dom).attr('norender', true);//设置元素只渲染一次
			$(dom).attr('render', name);//设置元素只渲染一次
			//执行渲染回调方法
			if (renderObj.link && $.isFunction(renderObj.link)){
				try {
					var component = renderObj.link(dom, params, parent); //返回组件对象
					if((params.id || params.name) && component){
						var cname = params.name ? params.name : params.id;
						getComponents(name)(cname, component); //存储对象到 render.renderName(cname)中
					}
					//存储对象
					if(component){
						$(dom).data('component', component);
					}
				}catch (e){
					//console.error(e);
				}
			}
			//渲染完毕递归渲染子元素
			$compile(dom); //渲染模板内部的元素
		}

		/**
		 * 渲染DOM内的元素
		 * @param {Object} element dom元素
		 */
		function $compile(element) {
			var selector = '[' + renderAttr + ']';
			$(element).children().each(function() {
				if ($(this).attr(renderAttr)) {
					var renderName = $(this).attr(renderAttr);
					if (hasRender(renderName)) {
						$render(renderName, this);
					}
				}else{
					$compile(this); //不存在就扫描下级
				}
			});
		}

		/**
		 * 获取作用域对象
		 * @param {Object} scope
		 * @param {Object} parent
		 */
		function getObj(scope, parent) {
			var parent = parent;
			if (!parent) {
				parent = window;
			}
			if (scope == '' || scope == 'window') {
				return window;
			}
			var arr = String(scope).split('.');
			if (arr.length > 1) {
				if (parent[arr[0]])
					return getObj(scope.substring(scope.indexOf('.') + 1), parent[arr[0]]);
				else
					return (parent[arr[0]] = {});
			} else {
				if (parent[arr[0]])
					return parent[arr[0]];
				else
					return (parent[arr[0]] = {});
			}
		}
		/**
		 * 获取对象
		 **/
		function ensure(obj, name, factory) {
			return obj[name] || (obj[name] = factory());
		}
		/**
		 * 获取集合操作方法
		 * var create = getComponents('page');
		 * create('key',{});
		 * */
		function getComponents(componentName){
			var obj = ensure(window, 'render', Object);
			var map = {};
			componentName = componentName.indexOf('-') == -1 ? componentName : componentName.toColumnStyle();
			return obj[componentName] ? obj[componentName] : (obj[componentName] = function(name, obj){
				if(map[name] && !obj) return map[name];
				return (map[name] = obj);
			});
		}
		return {
			render: render,
			$render: $render,
			hasRender: hasRender,
			$compile: $compile
		};
	}

})(jQuery, window);
/**
 * 字符串操作扩展
 * @param {Object}
 */
String.prototype.endWith = function(s) {
	if (s == null || s == "" || this.length == 0 || s.length > this.length)
		return false;
	if (this.substring(this.length - s.length) == s)
		return true;
	else
		return false;
	return true;
}
String.prototype.startWith = function(s) {
	if (s == null || s == "" || this.length == 0 || s.length > this.length)
		return false;
	if (this.substr(0, s.length) == s)
		return true;
	else
		return false;
	return true;
}

String.prototype.toColumnStyle = function() {
	return this.replace(/([A-Z])/g,"_$1").toUpperCase();
}