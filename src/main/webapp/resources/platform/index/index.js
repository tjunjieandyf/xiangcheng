/**
 * Created by Administrator on 2016/5/3.
 */
var app =Common.initApp();
Common.initRenderFinish(app);
Common.initDirective(app);
var webRoot = Common.webRoot();
Notifier.element.toInitMessageHtml({
    id : 'message',
});
var contentCSS = {
    setWidth : function (bool,className) {
        var leftWidth;
        className = className ? className : 'menuBig';
        var windowWidth = window.innerWidth;
        // var leftWidth = $("."+className).width();
        if(bool && !className){
            leftWidth  = $(".menuContent").width();
        }else if(!bool){
            leftWidth = 0
        }else if(bool && className){
            leftWidth = $("."+className).width();
        }else {

        }
        var contentWidth = windowWidth - leftWidth - 10;
        var iframeWidth = windowWidth - leftWidth - 10 ;
        if(contentWidth <= 998){
            iframeWidth = 992
        }
        if(platform.isWebkit()){
            $('.content').width(contentWidth + 'px');
            $("#boandaContent").width(iframeWidth + 'px');
        }else {
            $('.content').width(contentWidth  + 'px');
            $("#boandaContent").width(iframeWidth + 'px');
        }
    },
    setHeight : function () {
        var windowHeight = window.innerHeight;
        var headerHeight = 60;
        var footerHeight = $('footer').height();
        footerHeight = footerHeight?footerHeight:0;
        $('.wrapper').height((windowHeight - headerHeight - footerHeight) + 'px');
        $('.menuBig').height((windowHeight - headerHeight - footerHeight) + 'px');
        $('.menuSmall').height((windowHeight - headerHeight - footerHeight) + 'px');
        $('.content').height((windowHeight - headerHeight - footerHeight - 10) + 'px');
        $("#boandaContent").height((windowHeight - headerHeight - footerHeight - 10) + 'px');
    },
    init : function(){
        contentCSS.setHeight();
        contentCSS.setWidth();
    }
};
var FirstMenuCSS = {
    setWidth : function (width) {
        width = width ? width : FirstMenuCSS.getMaxWidth();
        $('.mession-list').width(width + 'px');
        $('.firstMenu').width(width + 'px');
    },
    getMaxWidth : function () {
        var maxWidth = 0;
        var Width;
        var allMenu = $('.mession-list > li');
        allMenu.each(function(index,element){
            maxWidth = maxWidth > $(this).outerWidth() ? maxWidth : $(this).outerWidth();
        });
        if(allMenu.length > 7){
            Width = maxWidth * 8;
        }else{
            Width = maxWidth * allMenu.length;
        }
        return Width;
    },
    init : function () {
        FirstMenuCSS.setWidth();
    }
};



app.controller('indexController',['$scope','$rootScope', '$http','$cookieStore','$window','$timeout',function ($scope,$rootScope,$http,$cookieStore,$window,$timeout) {
	
    // 添加监听器
    platform.webSocket.addListener("not_received_message", "onmessage", function(message){
        var messageArray = [];
        var xxList = JSON.parse(message.xxnr);
        for(var i=0;i<xxList.length;i++){
            messageArray.push({
            	xh : xxList[i].messageVO.xh,
                title : xxList[i].messageVO.xxbt,
                content : xxList[i].messageVO.xxnr,
                url : xxList[i].messageVO.lj,
                time: 20000,
                callback : function (message) {
                	if (message.url) {
                		if (message.url.indexOf('/') != 0) {
                			message.url = '/' + message.url;
                		}
                		var connector = message.url.indexOf("?") > 0 ? "&" : "?";
                		message.url += connector + "xh=" + message.xh;
                		Common.dialog({
    						type : "open",
    						url : webRoot + message.url,
    						title : "消息详情",
    						width : "100%",
    						height : "100%"
    					});
//                		$("#boandaContent").attr("src", webRoot + message.url);
                	}
                    TOP_WINDOW.window.currentShowMessageNum--;
                    if(TOP_WINDOW.window.currentShowMessageNum < 0){
                    	TOP_WINDOW.window.currentShowMessageNum = 0;
                    }
                    Notifier.element.setNewMessageAction("message", {
                        number : TOP_WINDOW.window.currentShowMessageNum
                    }, false, TOP_WINDOW.window.document);
                    var xxxhs = [];
                    xxxhs.push(message.xh);
                    Common.send($scope, $http, {
                		method: 'POST',
                		url: webRoot + '/platform/message/messagecontroller/readmessage',
                		data: {
                			xxxhs : xxxhs
                		}
                	});
                }
            })
        }
        Notifier.pushShowMessage.addMessageQueueItem(messageArray);
        var animate = messageArray.length > 0 ? true : false;
        Notifier.element.setNewMessageAction("message", {
            number : message.kzcs
        }, animate, TOP_WINDOW.window.document);
        TOP_WINDOW.window.currentShowMessageNum = message.kzcs;
    });


    // 添加监听器
    platform.webSocket.addListener("rygx", "onmessage", function(message){
        var messageArray = [];
        messageArray.push({
        	xh : message.xh,
            title : message.xxbt,
            content : message.xxnr,
            url : message.lj,
            time: 20000,
            callback : function (message) {
            	if (message.url) {
            		if (message.url.indexOf('/') != 0) {
            			message.url = '/' + message.url;
            		}
            		var connector = message.url.indexOf("?") > 0 ? "&" : "?";
            		message.url += connector + "xh=" + message.xh;
//            		$("#boandaContent").attr("src", webRoot + message.url);
            		Common.dialog({
						type : "open",
						url : webRoot + message.url,
						title : "消息详情",
						width : "100%",
						height : "100%"
					});
            	}
                TOP_WINDOW.window.currentShowMessageNum--;
                if(TOP_WINDOW.window.currentShowMessageNum < 0){
                	TOP_WINDOW.window.currentShowMessageNum = 0;
                }
                Notifier.element.setNewMessageAction("message",{
                    number : TOP_WINDOW.window.currentShowMessageNum
                }, false, TOP_WINDOW.window.document);
                var xxxhs = [];
                xxxhs.push(message.xh);
                Common.send($scope, $http, {
            		method: 'POST',
            		url: webRoot + '/platform/message/messagecontroller/readmessage',
            		data: {
            			xxxhs : xxxhs
            		}
            	});
            }
        })
        Notifier.pushShowMessage.addMessageQueueItem(messageArray);
        TOP_WINDOW.window.currentShowMessageNum++;
        Notifier.element.setNewMessageAction("message",{
            number : TOP_WINDOW.window.currentShowMessageNum
        }, true, TOP_WINDOW.window.document);
    });
    
    
    // 点击铃铛事件
    $scope.clickBell = function($event) {
    	$scope.showLeftMenu = false;
        $(".menuContent").hide();
        contentCSS.setWidth($scope.showLeftMenu);
        $(".selectMenu").removeClass('selectMenu');
        checkIframeScroll("",true);
        $("#boandaContent").attr("src", webRoot + '/platform/message/messagecontroller/usermessage');
        $('.portalDiv').find('.on').removeClass('on');
        $(".portalDiv > p >span:first").addClass('on');
        $('.firstMenu >li').find('a').removeClass('on');
        $('.mession-list >div').find('a').removeClass('on');
        $($event.target).addClass('on');
        $event.stopPropagation($event);
        $event.preventDefault($event);
    };
    
    // 用户名称最多显示5个字符，多了用...代替
    if ($scope.yhmc.length > 5) {
    	$scope.yhmc = $scope.yhmc.substring(0, 4) + '...';
    }

    $scope.showLeftMenu = false;
    $(".menuContent").hide();
    $scope.allThemes = [
        {name:'蓝色',value:'default'},
        {name:'红色',value:'red'},
        {name:'黑色',value:'black'}];
    $scope.isSkinActive = false;
    $scope.searchInput = false;
    $scope.isFontActive = false;
    $scope.isMessageActive = false;
    $scope.isSetActive = false;
    $scope.isExitActive = false;
    $scope.isShowBigMenuBox = true;
    $scope.menuUpDownTips = 'show-up';
    $scope.isShowAllFirstMenu = false;
    $scope.isSearchActive = false;
    $scope.clickIndex = '';
    $scope.userSetList = [];
    checkIframeScroll('',true);
    if (!$("#boandaContent").attr("src")) {
    	$("#boandaContent").attr("src", $("#defaultIframeURL").val());
    }
    // $scope.UserSkin = $cookieStore.get("UserSkin") ? $cookieStore.get("UserSkin") : {};
    $scope.UserSkin = JSON.parse($window.localStorage['UserSkin'] || '{}');
    $scope.skinItem = webRoot+'/resources/platform/index/css/index-default.css';
    if(sessionID && ($scope.UserSkin.sessionID == sessionID)){
        $scope.skinItem = webRoot+'/resources/platform/index/css/index-'+$scope.UserSkin.skinName+'.css';
        var allSkinDiv = $('.skinDiv').find('span');
        allSkinDiv.removeClass('on');
        for(var i=0;i<allSkinDiv.length;i++){
            if($(allSkinDiv[i]).attr('data-value') == $scope.UserSkin.skinName){
                $('.skinDiv').find('.on').removeClass('on');
                $(allSkinDiv[i]).addClass('on');
            }
        }
    }
    $scope.changeMenuBox = function (first) {
        if(first && $scope.isShowBigMenuBox){
            return false;
        }else{
            $scope.isShowBigMenuBox = !$scope.isShowBigMenuBox;
            var className = $scope.isShowBigMenuBox ? 'menuBig' : 'menuSmall';
            contentCSS.setWidth($scope.showLeftMenu,className);
            if($scope.showLeftMenu) {
            	$(".menuContent").show();
            } else {
            	$(".menuContent").hide();
            }
        }
    };
    $scope.clickMenuSmall = function (item,$event) {
    	//切换目录
    	$scope.changeMenuBox();
    	//打开子节点
    	$scope.openChildNode(item);
    	
//        if(item.CDURL){
//            $scope.openWinLink(item)
//        }
    };
    $scope.openChildNode = function(item) {
    	var list = $scope.allMenuItem.menuSecond;
    	for (var i = 0; i < list.length; i++) {
			if(!($scope.allMenuItem.menuSecond[i].CDBH === item.CDBH)){
				$scope.allMenuItem.menuSecond[i].sign = false;
				$scope.allMenuItem.menuSecond[i].showicon = 'show-down';
				
			}else{
				$scope.allMenuItem.menuSecond[i].sign = true;
				$scope.allMenuItem.menuSecond[i].showicon = 'show-up';
			}
		}
    };
    $scope.obtainI = function(item) {
    	var list = $scope.allMenuItem.menuSecond;
    	for (var i = 0; i < list.length; i++) {
			if(list[i].CDBH === item.CDBH){
				return i;
			}
		}
    };
    
    
    $scope.allMenuItem = {
    	menuFirst : [],
    	menuSecond : []
    };
    
    var temp = [];
    
    //查询当前用户的菜单
    Common.send($scope, $http, {
		method: "POST",
		url: Common.webRoot() + '/platform/rms/usercontroller/findcurrentusermenu',
		success: function(result){
			var menus = result.data;
			Common.send($scope, $http, {
				method: "POST",
				url: Common.webRoot() + '/platform/rms/usercontroller/getsystemroot',
				success: function(res){
					//获取系统根
					var systemRoot = res.data.SYSTEM_ROOT;
					//一级菜单
					for(var i=0;i<menus.length;i++){
						if(menus[i].FCDXH == systemRoot){
							var menuItem = {CDBH: menus[i].XH,CDMC: menus[i].CDMC,TPLJ: menus[i].TPWZ,CDURL: menus[i].LJDZ,SFXCKDK: menus[i].SFXCKDK,SFWBCD: menus[i].SFWBCD,CDURL:menus[i].LJDZ,SFXSZCCD:menus[i].SFXSZCCD};
							$scope.allMenuItem.menuFirst.push(menuItem);
						}else{
							temp.push(menus[i]);
						}
					}
					//二级菜单
					for(var i=0;i<temp.length;i++){
						for(var j=0;j<$scope.allMenuItem.menuFirst.length;j++){
							if(temp[i].FCDXH == $scope.allMenuItem.menuFirst[j].CDBH){
								var menuItem = {CDBH: temp[i].XH,parentbh: temp[i].FCDXH,CDMC: temp[i].CDMC,TPLJ: temp[i].TPWZ?temp[i].TPWZ:"/",CDURL:temp[i].LJDZ, SFXCKDK: temp[i].SFXCKDK, SFWBCD: temp[i].SFWBCD, children:[],sign:true};
								$scope.allMenuItem.menuSecond.push(menuItem);
							}
						}
					}
					//三级菜单
					for(var i=0;i<temp.length;i++){
						for(var j=0;j<$scope.allMenuItem.menuSecond.length;j++){
							if(temp[i].FCDXH == $scope.allMenuItem.menuSecond[j].CDBH){
								var menuItem = {CDBH: temp[i].XH,CDMC: temp[i].CDMC,CDURL: temp[i].LJDZ, SFXCKDK: temp[i].SFXCKDK, SFWBCD: temp[i].SFWBCD,sign:true};
								$scope.allMenuItem.menuSecond[j].children.push(menuItem);
								break;
							}
						}
					}
				}
			});
		}
    });
    // 更换图标状态（选中，普通）
    $scope.imgSrcDefault = function(event){
        var imgAll = $(event.target).parents('.headerContent');
        imgAll = imgAll.find('img');
        imgAll.each(function(){
            var hasFocu = this.src.indexOf('_focu.png');
            if(hasFocu != -1){
                var imgSrc = this.src.slice(0, hasFocu);
                this.src = imgSrc + '.png';
            }
        })

        // 更换图标
        var img = $(event.target).parent().find('img');
        var imgSrc = img.attr('src');
        if (imgSrc) {
        	var imgSrcNoName = imgSrc.slice(0, imgSrc.lastIndexOf('.'));
            img.attr('src', imgSrcNoName + '_focu.png');
        }
    }
    //一级菜单打开
    $scope.openMenuCenter = function ($event,item) {
    	//大屏的菜单BH
    	if('1608602463233029790208'==item.CDBH){
			var locationObj = window.location;
			var url = locationObj.protocol+"//"+locationObj.host+"/suichang/smart/main";
			var tempwindow=window.open('_blank'); // 先打开页面
			tempwindow.location.href=url; // 后更改页面地址
			return;
		}
    	$scope.showLeftMenu = false;
    	$(".menuContent").hide();
        contentCSS.setWidth($scope.showLeftMenu);
        $(".selectMenu").removeClass('selectMenu');
        checkIframeScroll("",true);
    	$('.portalDiv').find('.on').removeClass('on');
        $($event.target).addClass('on');
        $('.firstMenu >li').find('a').removeClass('on');
        $('.mession-list >div').find('a').removeClass('on');
        $($event.target).parent().find('a').addClass('on');

        $('.portalDiv').find('.on').removeClass('on');
        if(item.CDURL){
            $scope.openWinLink(item)
        }
        
        $event.stopPropagation();
        $event.preventDefault();

        // 更换图标状态
        $scope.imgSrcDefault($event);
        
        $event.stopPropagation();
        $event.preventDefault();
        //如果是一级菜单调用,且一级菜单存在默认的展示页面,判断是否显示左侧菜单
    	if(item.SFXSZCCD == 1){
    		$scope.openMenuLeft($event,item,1);
    	}
    };
    
    $scope.openMenuLeft = function ($event,item,type) {
    	var showLeftMenuContent = false;
    	$scope.showLeftMenu = item.SFXSZCCD == 0 ? false : true;
    	if($scope.showLeftMenu == false){
    		showLeftMenuContent = true;
    	}
    	if(type == 1){
        	return
        }
        $(".menuContent").show();
        //此处应不区分true/false
        $scope.showLeftMenu = true;
        
        contentCSS.setWidth($scope.showLeftMenu);

        $('.big-menu-box > div').addClass('hide');
        $('.iconMenu').addClass('hide');
        $(".parent_"+item.CDBH).removeClass('hide');
        $('.firstMenu >li').find('a').removeClass('on');
        $('.mession-list >div').find('a').removeClass('on');

        $($event.target).parent().find('a').addClass('on');

        $('.portalDiv').find('.on').removeClass('on'); 
        
        if(type == 1){
        	return
        }
        // 更换图标状态
        $scope.imgSrcDefault($event);
        
    
        var first = 1;
        $scope.changeMenuBox(first);
        for(var i=0;i<$scope.allMenuItem.menuSecond.length;i++){
            if($scope.allMenuItem.menuSecond[i].parentbh == item.CDBH){
                if($scope.allMenuItem.menuSecond[i].children.length){
                	$timeout(function() {
                        var el = document.getElementById($scope.allMenuItem.menuSecond[i].children[0].CDBH);
                        angular.element(el).triggerHandler('click');
                    }, 0);
                }else {
                	$timeout(function() {
                        var el = document.getElementById($scope.allMenuItem.menuSecond[i].CDBH).children[1];
                        angular.element(el).triggerHandler('click');
                    }, 0);
                }
                break;
            }
        }
        $event.stopPropagation();
        $event.preventDefault();
        if(showLeftMenuContent){
        	$scope.changeMenuBox();
        }
    };
    $scope.openWinLink = function (menu,$event) {
    	
    	//打开子节点
    	$scope.changeMenuUpDown2(menu,$event);
    	//保存当前菜单页面的菜单编号
    	sessionStorage.setItem("currentMenu", JSON.stringify(menu));
    	var link = menu.CDURL;
    	if(!menu.CDURL){
    		return;
    	}
    	if(menu.SFWBCD == 0){
    		if (link.indexOf('/') != 0) {
    			link = '/' + link;
    		}
    		link = webRoot + link;
            link = Common.link(link);
    	}
        if(menu.SFXCKDK == 1){
            window.open(link);
        }else {
            checkIframeScroll(menu);
            $("#boandaContent").attr("src", link);
        }
        
        $(".selectMenu").removeClass('selectMenu');
        if(!menu.children || menu.children.length == 0){
        	if($event){
                $($event.target).addClass('selectMenu');
            }
        }
        var YM = Base64.encode(document.domain);
         
        //添加菜单访问记录到数据库
        Common.send($scope, $http, {
        	method: 'POST',
    		url: Common.webRoot() + '/platform/rms/menucontroller/addmenuaccess',
    		data: JSON.stringify({
    			YM :YM,
    			CDBH : menu.CDBH,
    			CDMC : menu.CDMC,
    			KHDLX : '电脑',
    			XDLJ : menu.CDURL
    		})
        });
        
    };
    $scope.changeMenuUpDown = function (item,$event) {
    	if(!item.children || !item.children.length){
            $scope.openWinLink(item,$event)
        }
    	var list = $scope.allMenuItem.menuSecond;
    	for (var i = 0; i < list.length; i++) {
			if(($scope.allMenuItem.menuSecond[i].CDBH === item.CDBH)){
				if(!$scope.allMenuItem.menuSecond[i].sign && $scope.allMenuItem.menuSecond[i].showicon === 'show-down'){
				$scope.allMenuItem.menuSecond[i].sign = true;
				$scope.allMenuItem.menuSecond[i].showicon = 'show-up';
			}else{
				$scope.allMenuItem.menuSecond[i].sign = false;
				$scope.allMenuItem.menuSecond[i].showicon = 'show-down';
			}
			return;
			}
    	}
    };
    $scope.changeMenuUpDown2 = function (item,$event) {
    	var list = $scope.allMenuItem.menuSecond;
    	for (var i = 0; i < list.length; i++) {
			if(($scope.allMenuItem.menuSecond[i].CDBH === item.CDBH)){
				if(!$scope.allMenuItem.menuSecond[i].sign && $scope.allMenuItem.menuSecond[i].showicon === 'show-down'){
				$scope.allMenuItem.menuSecond[i].sign = true;
				$scope.allMenuItem.menuSecond[i].showicon = 'show-up';
			}else{
				$scope.allMenuItem.menuSecond[i].sign = false;
				$scope.allMenuItem.menuSecond[i].showicon = 'show-down';
			}
			return;
			}
		}
    };
    $scope.showAllMenu = function () {
        $scope.isShowAllFirstMenu = true
    };
    $scope.hideAllMenu = function () {
        $scope.isShowAllFirstMenu = false
    };
    $scope.showHideAllMenu = function () {
        $scope.isShowAllFirstMenu = !$scope.isShowAllFirstMenu;
    };
    $scope.backToIndex = function ($event) {
        $scope.showLeftMenu = false;
        $(".menuContent").hide();
        contentCSS.setWidth($scope.showLeftMenu);
        $(".selectMenu").removeClass('selectMenu');
        checkIframeScroll("",true);
        $("#boandaContent").attr("src", $("#defaultIframeURL").val());
        $('.portalDiv').find('.on').removeClass('on');
        $(".portalDiv > p >span:first").addClass('on');
        // $('.big-menu-box > div').addClass('hide');
        // $('.iconMenu').addClass('hide');
        $('.firstMenu >li').find('a').removeClass('on');
        $('.mession-list >div').find('a').removeClass('on');
        
        $($event.target).parent().find('a').addClass('on');
        
        // 更换图标
        $scope.imgSrcDefault($event);

        // var first = 1;
        // $scope.changeMenuBox(first);
        $event.stopPropagation($event);
        $event.preventDefault($event);
    };

    $scope.showTips = function ($event) {
       $($event.target).data('tipIndex', Common.dialog({'type':'tips','content':$($event.target).attr('data-text'),'id':$($event.target).attr('id'),width:'110px',height:'35px'}));
    };
    $scope.hideTips = function ($event) {
        Common.dialog({'type':'close','index':$($event.target).data('tipIndex')});
    };
    $scope.chooseFont = function (font,$event) {
        switch (font){
            case 'big' :
                $('html').removeClass('fontDefault').removeClass('fontBig').removeClass('fontSmall').addClass('fontBig');
                $('#boandaContent').contents().find('html').removeClass('fontDefault').removeClass('fontBig').removeClass('fontSmall').addClass('fontBig');
                break;
            case 'default' :
                $('html').removeClass('fontDefault').removeClass('fontBig').removeClass('fontSmall').addClass('fontDefault');
                $('#boandaContent').contents().find('html').removeClass('fontDefault').removeClass('fontBig').removeClass('fontSmall').addClass('fontDefault');
                break;
            case 'small' :
                $('html').removeClass('fontDefault').removeClass('fontBig').removeClass('fontSmall').addClass('fontSmall');
                $('#boandaContent').contents().find('html').removeClass('fontDefault').removeClass('fontBig').removeClass('fontSmall').addClass('fontSmall');
                break;
            default :break;
        }
        $('.fontDiv').find('.on').removeClass('on');
        $($event.target).addClass('on');
        $event.stopPropagation();
        $event.preventDefault();
    };
    $scope.chooseSkin = function (type,$event) {
        var skin = type;
        $('#skinTheme').attr('href',Common.webRoot()+'/resources/platform/index/css/index-'+skin+'.css');
        $('#colorLink').attr('href',webRoot+'/resources/platform/common/css/color-'+skin+'.css');
        $("#boandaContent").contents().find('#colorLink').attr('href',webRoot+'/resources/platform/common/css/color-'+skin+'.css');
        $('.skinDiv').find('.on').removeClass('on');
        $($event.target).addClass('on');
        // $cookieStore.put("UserSkin", {'sessionID':sessionID,'skinName':skin});
        $window.localStorage['UserSkin']=JSON.stringify({'sessionID':sessionID,'skinName':skin});
        //
        // $event.stopPropagation();
        // $event.preventDefault();
    };
    $scope.choosePortal = function (portal, $event) {
    	$scope.showLeftMenu = false;
    	$(".menuContent").hide();
        contentCSS.setWidth($scope.showLeftMenu);
        $(".selectMenu").removeClass('selectMenu');
    	var param = "?portalId=" + portal.value;
        checkIframeScroll("",true);
    	$("#boandaContent").attr("src", $("#defaultIframeURL").val() + param);
    	$('.portalDiv').find('.on').removeClass('on');
        $($event.target).addClass('on');
        $('.firstMenu >li').find('a').removeClass('on');
        $('.mession-list >div').find('a').removeClass('on');
        $('.firstMenu >li >span >a:first').addClass('on');
        $event.stopPropagation();
        $event.preventDefault();
    };
    $scope.openUserSet = function () {
        Common.dialog({
            type : 'open',
            title : '个人信息设置',
            url : webRoot+'/platform/rms/usercontroller/userset',
            width : '900px',
            height : '480px'
        })
    };
    $scope.openSearch = function () {
        $scope.searchInput = !$scope.searchInput
    };
    $scope.openQuitConfirm = function () {
        Common.dialog({
            type : 'confirm',
            content : '确认退出吗？',
            title : '退出',
            callback: function () {
            	var basePath = window.location.href;
                window.location.href= 'http://183.131.138.232:8888/cas/logout?service='+basePath;
            },
            error: function () {
                return false
            }
        })
    };
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        $('.firstMenu >li:eq(0)').find('a').addClass('on');
        var id = $('.firstMenu >li:eq(0)').attr('id');
        if(id){
            $('.parent_'+id).removeClass('hide');
        }
    });
    $(window).resize(function() {
        contentCSS.setHeight();
        var className = $scope.isShowBigMenuBox ? 'menuBig' : 'menuSmall';
        contentCSS.setWidth($scope.showLeftMenu,className);
        if($scope.showLeftMenu) {
        	$(".menuContent").show();
        } else {
        	$(".menuContent").hide();
        }
    });
    
    if($("#defaultIframeURL").val().indexOf('/platform/home/homecontroller/portalhomepage') > -1){
    	Common.send($scope, $http, {
    		method : "POST",
    		url : Common.webRoot() + "/platform/system/portal/portalmanagement/portalcontroller/finduserportal",
    		success : function(result){
    			var portals = result.data;
    			$scope.allPortals = [];
    			if(portals){
    				for(var portal in portals){
    					var portalInfo = portal.split("_");
    					var obj = {name : portalInfo[1], value : portalInfo[0]};
    					$scope.allPortals.push(obj);
    				}
    			}
    			if($scope.allPortals.length > 1) {
    				$scope.isShowList = true;
    			}else {
    				$scope.isShowList = false;
    			}
    		}
    	});
    };
    if(userSet && userSet.list && userSet.list.length){
        $scope.userSetList = userSet.list;
    }
    $scope.clickUserSetList = function (item,event) {
        var contentUrl = item.url;
        if(item){
            switch (item.type){
                case  "1" :
                    var contentWidth = item.property.width ? item.property.width : "60%";
                    var contentHeight = item.property.height ? item.property.height : "60%";
                    var contentTitle = item.property.title ? item.property.title : item.name;
                    Common.dialog({
                        type : 'open',
                        title : contentTitle,
                        url : Common.webRoot() + contentUrl,
                        width : '900px',
                        height : '480px'
                    });
                    break;
                case "0" :
                    $scope.showLeftMenu = false;
                    $(".menuContent").hide();
                    contentCSS.setWidth($scope.showLeftMenu);
                    $(".selectMenu").removeClass('selectMenu');
                    checkIframeScroll("",true);
                    $("#boandaContent").attr("src", Common.webRoot() + contentUrl);
                    $('.firstMenu >li').find('a').removeClass('on');
                    $('.mession-list >div').find('a').removeClass('on');
                    event.stopPropagation(event);
                    break;
            }
        }
        /*
        * 为解决angularjs与layer.js之间的不兼容，必须加上阻止时间冒泡，否则打开的窗口无法关闭。
        * */
        event.stopPropagation();
    }
    
}]);
$(function () {
    contentCSS.init();
  //没有首页的情况下默认显示第一个菜单
    setTimeout(clickFirstMenu,150)
    
});

function checkIframeScroll(menuItem,bool) {
    if(bool){
        $("#boandaContent").attr("scrolling","no");
        return false;
    }
    if(menuItem.SFWBCD){
        $("#boandaContent").attr("scrolling","auto");
    }else {
        $("#boandaContent").attr("scrolling","no");
    }
}
//没有首页的情况下默认显示第一个菜单
function clickFirstMenu (){
	var isShowHomePage = $('#isShowHomePage').val();
	 if(isShowHomePage &&( isShowHomePage == false || isShowHomePage == 'false')){
	    	$('.firstMenu li div:first').click();
	    }
}