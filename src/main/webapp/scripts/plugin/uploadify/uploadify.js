var Uploadify;
if (Uploadify == undefined) {
	Uploadify = function (settings) {
		this.initUploadify(settings);
	};
}

Uploadify.browseType = 0;
Uploadify.prototype.initUploadify = function (settings) {
	var uploadifyObj = this;
	this.settings = settings;
	//判断是否是谷歌浏览器
	var isChrome = navigator.userAgent.toLowerCase().match(/chrome/) != null;
	if(isChrome){
		Uploadify.browseType = 1;
	}
	var scripts;
	if(Uploadify.browseType == 1){
		this.settings['uploadScript'] = settings.url;
		script = [
	               ctx+"/scripts/plugin/uploadify/uploadifive/uploadifive.css",
	               ctx+"/scripts/plugin/uploadify/uploadifive/jquery.uploadifive.min.js"
	             ];
	}else{
		this.settings['uploader'] = settings.url;
		this.settings['swf'] = ctx + "/scripts/plugin/uploadify/uploadify/uploadify.swf";
		script = [
	               ctx+"/scripts/plugin/uploadify/uploadify/uploadify.css",
	               ctx+"/scripts/plugin/uploadify/uploadify/jquery.uploadify.min.js"
	             ];
	}
	parallelLoadScripts(script,function(){
		uploadifyObj.loadUploadify();
	});
}

Uploadify.prototype.loadUploadify = function(){
	if(Uploadify.browseType == 1){
		$(this.settings.uploadiyId).uploadifive(this.settings);
	}else{
		$(this.settings.uploadiyId).uploadify(this.settings);
		$(this.settings.uploadiyId).find("object." + this.settings['buttonClass']).css("background","none").css("cursor","pointer");
	}
	$(this.settings.uploadiyId).find("." + this.settings['buttonClass']).css({"right":"0","cursor":"pointer","text-align":"center","width":this.settings['width']
											,"height":this.settings['height'],"line-height":this.settings['height']});
}

Uploadify.prototype.setParams = function (settings) {
	if(Uploadify.browseType == 1){
		$(this.settings.uploadiyId).uploadifive('destroy');
	}else{
		 $(this.settings.uploadiyId).uploadify("destroy");  
	}
	this.initUploadify(settings);
}

function parallelLoadScripts(scripts,callback) {
	   if(typeof(scripts) != "object") var scripts = [scripts];
	   var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement, s = new Array(), loaded = 0;
	   for(var i=0; i<scripts.length; i++) {
		   var script = scripts[i];
		   if(script.indexOf('.js') > 0){
		       s[i] = document.createElement("script");
		       s[i].setAttribute("type","text/javascript");
		       s[i].onload = s[i].onreadystatechange = function() { //Attach handlers for all browsers
		           if(!/*@cc_on!@*/0 || this.readyState == "loaded" || this.readyState == "complete") {
		               this.onload = this.onreadystatechange = null; this.parentNode.removeChild(this); 
		               if(typeof(callback) == "function") callback();
		           }
		       };
		       s[i].setAttribute("src",scripts[i]);
		   }else if(script.indexOf('.css') > 0){
			    s[i] = document.createElement('link');
			    s[i].setAttribute("rel","stylesheet");
			    s[i].setAttribute("type","text/css");
			    s[i].setAttribute("href",scripts[i]);
		   }
	       HEAD.appendChild(s[i]);
	   }
}
	 