var EasyuiValidation = {
    
    error_box : null,
    
    createErrorBox : function (msg,event) {
        var error_box = document.createElement("div");
        document.body.appendChild(error_box);
        
        error_box.style.position = "absolute";
        var evt = window.event || event;
        var x = evt.x || evt.pageX;
        var y = evt.y || evt.pageY;
        error_box.style.left = (x + 5) + "px";
        error_box.style.top = (y + document.body.scrollTop + 5) + "px";
        error_box.className = "";
        //error_box.style.filter = "alpha(opacity=70)";
      
        error_box.innerHTML = msg;
        
        return error_box;
    },
    
    isMouseLeaveOrEnter : function(e, handler) {  
	    if (e.type != 'mouseout' && e.type != 'mouseover') return false;     
	    var reltg = e.relatedTarget ? e.relatedTarget : e.type == 'mouseout' ? e.toElement : e.fromElement;     
	    while (reltg && reltg != handler){     
	        reltg = reltg.parentNode;     
	    }
	    return (reltg != handler);     
	},

    showError : function (e, errorMsg) {
        e.style.border = "1px solid #ffa8a8";
        e.style.backgroundColor = "rgb(255, 243, 243)";
        
        if (EasyuiValidation.error_box) {
            document.body.removeChild(EasyuiValidation.error_box);
            EasyuiValidation.error_box = null;
        }
   
        if(document.all){
	        e.onmouseenter = function () {
	            if (EasyuiValidation.error_box) {
	                document.body.removeChild(EasyuiValidation.error_box);
	                EasyuiValidation.error_box = null;
	            }
	            EasyuiValidation.error_box = EasyuiValidation.createErrorBox(errorMsg);
	        };
	        e.onmouseleave = function () {
	            if (EasyuiValidation.error_box) {
	                document.body.removeChild(EasyuiValidation.error_box);
	                EasyuiValidation.error_box = null;
	            }
	        };
        }else{
        	e.onmouseover = function (event){
        		if(EasyuiValidation.isMouseLeaveOrEnter(event,this)){
        			if (EasyuiValidation.error_box) {
		                document.body.removeChild(EasyuiValidation.error_box);
		                EasyuiValidation.error_box = null;
		            }
		            EasyuiValidation.error_box = EasyuiValidation.createErrorBox(errorMsg,event);
        		}
        	};
        	
        	e.onmouseout = function (event){
        		if(EasyuiValidation.isMouseLeaveOrEnter(event,this)){
	        		if (EasyuiValidation.error_box) {
		                document.body.removeChild(EasyuiValidation.error_box);
		                EasyuiValidation.error_box = null;
		            }
	            }
        	}
        }
        
        e.onmousemove = function (event) {
            if (!EasyuiValidation.error_box) {
                return;
            }
            var evt = window.event || event;
            EasyuiValidation.error_box.style.left = (evt.x + 5) + "px";
            EasyuiValidation.error_box.style.top = (evt.y + document.body.scrollTop + 5) + "px";
        };
    },

    hideError : function (e) {
        e.style.border = "1px solid green";
        e.style.backgroundColor = "";
        
        if (EasyuiValidation.error_box) {
            document.body.removeChild(EasyuiValidation.error_box);
            EasyuiValidation.error_box = null;
        }
        
        e.onmouseenter = null;
        e.onmouseleave = null;
        e.onmousemove = null;
    }
};

 /**********************************************************************************
 * 验证checkbox 和 radio 是否选中
 **********************************************************************************/
function easyCheckOther(form){
	var tmpElement = null;
    var flag = true;
    var label = null;
	if(!form){
	          form = $('form').last();
	}
    if(form!=null && form!=undefined){
		var frm = form.get(0);
		var ele  = frm.elements;
		for(var i=0; i< ele.length; i++){
		 	p_node = ele[i].parentNode;
		  while ("TD" !== p_node.tagName && p_node.parentNode) {
		      p_node = p_node.parentNode;
		  }
		  var pre = null;
		  if(p_node && p_node.previousSibling){
		   var pre = p_node.previousSibling;
		   while(pre && "TD" !== pre.tagName){
		   	pre = pre.previousSibling;
		   }
		  }
		  label = pre ? (pre.innerText || pre.textContent) : "";
		  if(ele[i].type!="hidden" && ele[i].type!="button" && isMustEnter(ele[i])){
		  	if(ele[i].tagName == "INPUT" && (ele[i].type == "checkbox" ||ele[i].type == "radio")){
		  		 if(tmpElement != ele[i].name){
	                 tmpElement = ele[i].name;
	                 var rflag = validateEasyCheckOrRadios(ele[i],true);
	                 if(flag == true){
	                     flag = rflag;
	                 }
	             }else{
	                 continue;
	             }
		  	}
		  }
		}
    } 
    return flag;
    
    /**
     * 判断是否必填
     */
     function isMustEnter(obj){
         var p_node = obj.parentNode;
         while ("TD" !== p_node.tagName && p_node.parentNode) {
              p_node = p_node.parentNode;
          }
         //修复了previousSibling浏览器兼容问题
          p_node=p_node.previousSibling;
         while (p_node && p_node.nodeType!=1)
 		{
 			p_node=p_node.previousSibling;
 		}
         var label = p_node ?(p_node.innerText||p_node.textContent): "";
         return label && "*" === label.charAt(0);
     }
}
    /**********************************************************************************
    * 验证checkbox 和 radio 是否选中
    **********************************************************************************/
 function validateEasyCheckOrRadios(obj,isShowError){
       var validateflag = false;
       if( obj!=null && (obj.type == "checkbox" || obj.type == "radio" )){
           var elements = document.getElementsByName(obj.name);
           for(var j = 0 ;j < elements.length;j++){
               if(elements[j].checked){
                   if(isShowError == true){
                      EasyuiValidation.hideError(obj.parentNode);
                   }
                   return true;
               }
           }
           if(isShowError == true){
           	 EasyuiValidation.showError(obj.parentNode,createDivMessage("该选项为必选项"));
           }
           return false;
       }
       throw new Error("validateEasyCheckOrRadios方法只验证easyui表单中checkbox 和 radio 是否选中");
   }

function createDivMessage(msg){
	return "<span class=\"validatebox-tip-content\">" +msg+ "</span>" + "<span class=\"validatebox-tip-pointer\">" + "</span>";
}