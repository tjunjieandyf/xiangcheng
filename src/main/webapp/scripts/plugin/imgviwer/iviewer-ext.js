/**
 * iviewer控件扩展
 */
var iviewerUtil = {
	imgLoading: '#imgLoading',
	init : function(iviewerDivId,imgUrl){
		var imgLoadingId = this.imgLoading;
		return  $(iviewerDivId).iviewer(
	    {
	        src: imgUrl,
	        onStartLoad:function(){
	        	$(imgLoadingId).removeClass('img_loadederror_bg');
	        	$(imgLoadingId).addClass('img_loading_bg');
	        	$(imgLoadingId).show();
	        },
	        onFinishLoad:function(){
	        	$(imgLoadingId).hide();
	        },
	        onErrorLoad:function(){
	           $(imgLoadingId).removeClass('img_loading_bg');
	           $(imgLoadingId).addClass('img_loadederror_bg');
	        }        
	    });
	}
};