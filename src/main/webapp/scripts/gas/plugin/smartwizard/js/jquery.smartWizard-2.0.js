/* SmartWizard 2.0 plugin
 * jQuery Wizard control Plugin
 * http://www.techlaboratory.net/smartwizard
 * 
 * by Dipu Raj  
 * http://dipuraj.me
 * 
 * License 
 * https://github.com/techlab/SmartWizard/blob/master/MIT-LICENSE.txt 
 * 
 */
 (function($){
    $.fn.smartWizard = function(action) {
        var options = $.extend({}, $.fn.smartWizard.defaults, action);
        var args = arguments;
        return this.each(function(){
                var obj = $(this);
                var curStepIdx = options.selected;
                var steps = $("ul > li > a[href^='#step-']", obj); // Get all anchors in this array
                var contentWidth = 0;
                var loader,msgBox,elmActionBar,elmStepContainer,btNext,btPrevious,btFinish;
                
                elmActionBar = $('.actionBar',obj);
                if(elmActionBar.length == 0){
                  elmActionBar = $('<div></div>').addClass("actionBar");                
                }

                msgBox = $('.msgBox',obj);
                if(msgBox.length == 0){
                  msgBox = $('<div class="msgBox"><div class="content"></div><a href="#" class="close">X</a></div>');
                  elmActionBar.append(msgBox);                
                }
                
                $('.close',msgBox).click(function() {
                    msgBox.fadeOut("normal");
                    return false;
                });
                

                // Method calling logic
                if (!action || action === 'init' || typeof action === 'object') {
                  init();
                }else if (action === 'showMessage') {
                  //showMessage(Array.prototype.slice.call( args, 1 ));
                  var ar =  Array.prototype.slice.call( args, 1 );
                  showMessage(ar[0]);
                  return true;
                }else if (action === 'setError') {
                  var ar =  Array.prototype.slice.call( args, 1 );
                  setError(ar[0].stepnum,ar[0].iserror);
                  return true;
                } else {
                  $.error( 'Method ' +  action + ' does not exist' );
                }
                $("a").attr("draggable",'false');
                function init(){
                  var allDivs =obj.children('div'); //$("div", obj);                
                  obj.children('ul').addClass("anchor");
                  allDivs.addClass("content");
                  // Create Elements
                  loader = $('<div>Loading</div>').addClass("loader");
                  elmActionBar = $('<div></div>').addClass("actionBar");
                  elmStepContainer = $('<div></div>').addClass("stepContainer");
                  btNext = $('<a>'+options.labelNext+'</a>').attr("href","#").addClass("buttonNext");
                  btPrevious = $('<a>'+options.labelPrevious+'</a>').attr("href","#").addClass("buttonPrevious");
                  btFinish = $('<a>'+options.labelFinish+'</a>').attr("href","#").attr("target","_blank").addClass("buttonFinish");
                  // highlight steps with errors
                  if(options.errorSteps && options.errorSteps.length>0){
                    $.each(options.errorSteps, function(i, n){
                      setError(n,true);
                    });
                  }


                  elmStepContainer.append(allDivs);
                  elmActionBar.append(loader);
                  obj.append(elmStepContainer);
                  obj.append(elmActionBar); 
                  if (options.includeFinishButton) {
                    elmActionBar.append(btFinish);
                  }
                  elmActionBar.append(btNext).append(btPrevious); 
                  contentWidth = elmStepContainer.width();

                  $(btNext).click(function() {
                      if($(this).hasClass('buttonDisabled')){
                        return false;
                      }
                      doForwardProgress();
                      return false;
                  }); 
                  $(btPrevious).click(function() {
                      if($(this).hasClass('buttonDisabled')){
                        return false;
                      }
                      doBackwardProgress();
                      return false;
                  }); 
                  $(btFinish).click(function() {
                      if(!$(this).hasClass('buttonDisabled')){
                         if($.isFunction(options.onFinish)) {
                            if(!options.onFinish.call(this,$(steps))){
                              return false;
                            }
                         }else{
                           var frm = obj.parents('form');
                           if(frm && frm.length){
                             frm.submit();
                           }                         
                         }                      
                      }

                      return false;
                  }); 
                  
                  $(steps).bind("click", function(e){
                      if(steps.index(this) == curStepIdx){
                        return false;                    
                      }
                      var nextStepIdx = steps.index(this);
                      var isDone = steps.eq(nextStepIdx).attr("isDone") - 0;
                      if(isDone == 1){
                        LoadContent(nextStepIdx,true);                    
                      }
                      return false;
                  }); 
                  
                  // Enable keyboard navigation                 
                  if(options.keyNavigation){
                      $(document).keyup(function(e){
                          if(e.which==39){ // Right Arrow
                            //doForwardProgress();
                          }else if(e.which==37){ // Left Arrow
                            //doBackwardProgress();
                          }
                      });
                  }
                  //  Prepare the steps
                  prepareSteps();
                  //显示默认节点之前的节点 
                  doneBeforeSteps(curStepIdx);          
                  // Show the first slected step
                  LoadContent(curStepIdx);
                }

				function doneBeforeSteps(curStepIdx){
					var stepIndex = curStepIdx;
					for(var stepIndex = 0;stepIndex < curStepIdx;stepIndex++){
						var doneStep = steps.eq(stepIndex);
						$(doneStep, obj).addClass("done");
                   		$(doneStep, obj).removeClass("disabled");
                   		$(doneStep, obj).attr("isDone",1);
					}
				}
				
                function prepareSteps(){
                  if(!options.enableAllSteps){
                    $(steps, obj).removeClass("selected").removeClass("done").addClass("disabled"); 
                    $(steps, obj).attr("isDone",0);                 
                  }else{
                    $(steps, obj).removeClass("selected").removeClass("disabled").addClass("done"); 
                    $(steps, obj).attr("isDone",1); 
                  }

            	    $(steps, obj).each(function(i){
                        $($(this).attr("href"), obj).hide();
                        $(this).attr("rel",i+1);
                  });
                }
                function LoadContent(stepIdx,isprev){
                	var selStep = steps.eq(stepIdx);
                	var url = selStep.attr("tourl");
                	var html;
                	var opentype = selStep.attr("opentype");
                	if(showStep(stepIdx,isprev)){
	                	if(opentype== 'iframe'){
	                		if($("#frame_content").size()>0){
	                			$("#frame_content").attr("src",url);
	                		}else{
		                		html = '<iframe id="frame_content" src="'+url+'" frameborder="0" border="1" style="height:100%;width:100%"></iframe>';
	                			$("#step-div", obj).empty();
	                			$("#step-div", obj).append(html);
	                		}
	                	}else if(opentype== 'panel'){
	                		if($("#panel_content").size()>0){
	                			$("#panel_content").panel("refresh",url);
	                		}else{
		                		html = $('<div id="panel_content"></div>');
	                			$("#step-div", obj).empty();
	                			$("#step-div", obj).append(html);
	                			$("#panel_content").panel({
		                			fit:true,
		                			href:url
		                		});
	                		}
	                	}
                	}
                }
                function showStep(stepIdx,isprev){//如果是返回上一步,则不验证回调函数
                    var selStep = steps.eq(stepIdx); 
                    var curStep = steps.eq(curStepIdx);
                    if(stepIdx != curStepIdx){
                      if($.isFunction(options.onLeaveStep)&&!isprev) {
                        if(!options.onLeaveStep.call(this,$(curStep))){
                          return false;
                        }
                      }
                    }
                   	var s = $("#step-div", obj);
                   	var sHeight = $(window).height()-$(".anchor",obj).outerHeight(true)-$(".actionBar",obj).outerHeight(true);
                   	sHeight = sHeight - parseInt(s.css("padding-top"))-parseInt(s.css("padding-bottom"));
                   	s.height(sHeight);
                   	elmStepContainer.height(s.outerHeight());
                   	$("#step-div", obj).show();  
                    curStepIdx =  stepIdx;                        
                    SetupStep(curStep,selStep);
                    return true;
                }
                
                function SetupStep(curStep,selStep){
                   $(curStep, obj).removeClass("selected");
                   $(curStep, obj).addClass("done");
                   
                   $(selStep, obj).removeClass("disabled");
                   $(selStep, obj).removeClass("done");
                   $(selStep, obj).addClass("selected");
                   $(selStep, obj).attr("isDone",1);
                   adjustButton();
                   if($.isFunction(options.onShowStep)) {
                      if(!options.onShowStep.call(this,$(selStep))){
                        return false;
                      }
                   } 
                }                
                
                function doForwardProgress(){
                  var nextStepIdx = curStepIdx + 1;
                  if(steps.length <= nextStepIdx){
                    if(!options.cycleSteps){
                      return false;
                    }                  
                    nextStepIdx = 0;
                  }
                  LoadContent(nextStepIdx);
                }
                
                function doBackwardProgress(){
                  var nextStepIdx = curStepIdx-1;
                  if(0 > nextStepIdx){
                    if(!options.cycleSteps){
                      return false;
                    }
                    nextStepIdx = steps.length - 1;
                  }
                  LoadContent(nextStepIdx,true);
                }  
                
                function adjustButton(){
                  if(!options.cycleSteps){                
                    if(0 >= curStepIdx){
                      $(btPrevious).addClass("buttonDisabled");
                    }else{
                      $(btPrevious).removeClass("buttonDisabled");
                    }
                    if((steps.length-1) <= curStepIdx){
                      $(btNext).addClass("buttonDisabled");
                    }else{
                      $(btNext).removeClass("buttonDisabled");
                    }
                  }
                  // Finish Button 
                  if(!steps.hasClass('disabled') || options.enableFinishButton){
                    $(btFinish).removeClass("buttonDisabled");
                  }else{
                    $(btFinish).addClass("buttonDisabled");
                  }                  
                }
                
                function showMessage(msg){
                  $('.content',msgBox).html(msg);
              		msgBox.show();
                }
                
                function setError(stepnum,iserror){
                  if(iserror){                    
                    $(steps.eq(stepnum-1), obj).addClass('error')
                  }else{
                    $(steps.eq(stepnum-1), obj).removeClass("error");
                  }                                   
                }                        
        });  
    };  
 
    // Default Properties and Events
    $.fn.smartWizard.defaults = {
          selected: 0,  // Selected Step, 0 = first step   
          keyNavigation: true, // Enable/Disable key navigation(left and right keys are used if enabled)
          enableAllSteps: false,
          updateHeight: true,
          transitionEffect: 'fade', // Effect on navigation, none/fade/slide/slideleft
          contentURL:null, // content url, Enables Ajax content loading
          contentCache:true, // cache step contents, if false content is fetched always from ajax url
          cycleSteps: false, // cycle step navigation
          includeFinishButton: true, // whether to show a Finish button
          enableFinishButton: false, // make finish button enabled always
          errorSteps:[],    // Array Steps with errors
          labelNext:'Next',
          labelPrevious:'Previous',
          labelFinish:'Finish',          
          onLeaveStep: null, // triggers when leaving a step
          onShowStep: null,  // triggers when showing a step
          onFinish: null  // triggers when Finish button is clicked
    };    
    
})(jQuery);
