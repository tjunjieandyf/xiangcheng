//获取默认的po控件id
function getDefTagId(){
	return document.getElementById("defPoTagId").value;
}
//保存word
function saveDoc(){
	document.getElementById(getDefTagId()).WebSave();
}
//另存为
function saveAsDoc(){
	document.getElementById(getDefTagId()).ShowDialog(3); 
}
//打印
function printDoc(){
	document.getElementById(getDefTagId()).ShowDialog(4); 
}
//打印预览
function printViewDoc(){
	document.getElementById(getDefTagId()).PrintPreview(); 
}
//页面设置
function printSetDoc(){
	document.getElementById(getDefTagId()).ShowDialog(5); 
}
//全屏
function setFullScreen(){
	document.getElementById(getDefTagId()).FullScreen = !document.getElementById(getDefTagId()).FullScreen;
}
/**设置书签的值*/
function setBookMarkValue(bookName,value){
	 bookName = "PO_" + bookName;
	 var drlist = document.getElementById(getDefTagId()).DataRegionList;
	 drlist.GetDataRegionByName(bookName).Value = value;
}