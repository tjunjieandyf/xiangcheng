/**
 * 编辑器资源文件根路径
 */
window.UMEDITOR_HOME_URL = ctx+'/scripts/ewaq/plugin_temp/umeditor/';

//屏蔽按Backspace键时回退页面
window.document.onkeydown = function(){
	var evt =  window.event;
	if(evt.keyCode == 8){
		if((evt.srcElement.tagName == "INPUT" || evt.srcElement.tagName == "TEXTAREA") && evt.srcElement.readOnly == false){
			return true;
		}else{
			if($(evt.srcElement).attr("class").trim() == 'edui-body-container'){
				return true;
			}
		}
		return false;
	}
	return true;
}