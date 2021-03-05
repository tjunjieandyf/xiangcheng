<%@include file="/platform/common/header.jsp" %>
<link rel="stylesheet" href="<common:webRoot />/resources/platform/common/js/animate.min.css">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<body class="home-page" ng-init="yhmc='${SESSION_USER.yhmc }';">
<link rel="stylesheet" type="text/css" href="<common:webRoot />/resources/platform/index/css/index-default.css" />
<link rel="stylesheet" type="text/css" href="<common:webRoot /><common:configValue key="bd.sys.platform.config.systemConfig.base.index.cssPath" defaultValue="#"/>" />
<script>
    var userSet = <common:configValue key='bd.sys.platform.config.systemConfig.base.index.YHZX' defaultValue='false' />;
</script>
<div ng-controller="indexController" id="indexPage" class="container-fluid " style="height: 100%;overflow: hidden"  data-webRoot="<common:webRoot />">
	<!-- <link id="skinTheme" rel="stylesheet" type="text/css" href="{{skinItem}}" /> -->
	<div class="row header clear"  style="position: relative">
		<img src="<common:configValue key='bd.sys.platform.config.systemConfig.base.login.LSTP' defaultValue='resources/platform/index/images/logo1.png' />" class="logo">
		<div class="headerContent" ng-mouseleave="hideAllMenu()">
			<ul class="clear">
				<div class="firstMenu">
					<li id="backToIndex" ng-if="<common:configValue key='bd.sys.platform.config.systemConfig.base.index.isShowHomePage' defaultValue='true' />">
						<span ng-click="backToIndex($event)" ng-mouseenter="isPortalActive = true" ng-mouseleave="isPortalActive = false"
		 					 ng-class="{true:'span-portal-on', false: 'span-portal'}[isPortalActive]">
		 					<div class="imgDiv"  ng-class="{true: 'titleImg', false: ''}[$index == 0]">
								<img src="<common:webRoot /><common:configValue key='bd.sys.platform.config.systemConfig.base.index.homeIconUrl' defaultValue='/resources/power/ui/vendor/images/menu_homepage.png' />">
							</div>
							<a><common:configValue key='bd.sys.platform.config.systemConfig.base.index.homeName' defaultValue='系统首页' /></a>
							<div class="portalBox" ng-show="isPortalActive">
								<div class="portalDiv" ng-show="isShowList">
									<p ng-repeat="item in allPortals">
										<span ng-class="{true: 'on', false: ''}[$index == 0]" data-value="{{item.value}}" ng-click="choosePortal(item, $event)">{{item.name}}</span>
									</p>
								</div>
							</div>
						</span>
					</li>
					<li ng-repeat="item in allMenuItem.menuFirst | limitTo : 5" id="{{item.CDBH}}" on-finish-render-filters>
						<div  ng-if="!item.CDURL" ng-click="openMenuLeft($event,item)" class="imgDiv">
							<img src="<common:webRoot />{{item.TPLJ}}" ng-class="{true: 'titleImg', false: ''}[$index >= 0]"/>
						</div>
						<div ng-if="item.CDURL" ng-click="openMenuCenter($event,item)" class="imgDiv">
							<img src="<common:webRoot />{{item.TPLJ}}" ng-class="{true: 'titleImg', false: ''}[$index >= 0]"/>
						</div>
						<a ng-if="!item.CDURL" ng-click="openMenuLeft($event,item)">{{item.CDMC}}</a>
						<a ng-if="item.CDURL" ng-click="openMenuCenter($event,item)">{{item.CDMC}}</a>
					</li>
				</div>
				<li ng-if="allMenuItem.menuFirst.length >= 6"><span class="breadMenu-icon" ng-class="{true: 'breadMenu-on', false: 'breadMenu'}[isShowAllFirstMenu]" ng-click="showHideAllMenu()" ></span></li>
			</ul>
			<div class="mession-list clear" ng-show="isShowAllFirstMenu">
				<div ng-repeat="item in allMenuItem.menuFirst | after: 5" class="mession-list-item" id="{{item.CDBH}}">
					<div  ng-if="!item.CDURL" ng-click="openMenuLeft($event,item)" class="imgDiv">
						<img src="<common:webRoot />{{item.TPLJ}}" ng-class="{true: 'titleImg', false: ''}[$index >= 0]"/>
					</div>
					<div ng-if="item.CDURL" ng-click="openMenuCenter($event,item)" class="imgDiv">
						<img src="<common:webRoot />{{item.TPLJ}}" ng-class="{true: 'titleImg', false: ''}[$index >= 0]"/>
					</div>
					<a ng-if="!item.CDURL" ng-click="openMenuLeft($event,item)">{{item.CDMC}}</a>
					<a ng-if="item.CDURL" ng-click="openMenuCenter($event,item)">{{item.CDMC}}</a>
				</div>
			</div>


		</div>
		<%--<div class="icon-message-content">
			<i id="messageIcon" class="icon-message" title="消息"></i>
			<span class="icon-message-content" id="message-number"></span>
		</div>--%>
		
		<div class="pt-tools">
			<span class="info header-rt" ng-class="{true:'span-info-on', false: 'span-info'}[isUserSetActive]">
				<span ng-mouseenter="isUserSetActive = true" ng-mouseleave="isUserSetActive = false">
					<em ng-click="openUserSet()">{{yhmc}}&nbsp;&nbsp;</em>
					<div class="outerBox" ng-show="isUserSetActive" ng-if="userSetList.length">
						<div class="userSetDiv">
							<p ng-repeat="item in userSetList">
								<span ng-click="clickUserSetList(item,$event)">{{item.name}}</span>
							</p>
						</div>
					</div>
				</span>
				<span style="float:right;padding-top:10px" ng-mouseenter="isExitActive = true" ng-mouseleave="isExitActive = false">
					<i ng-class="{true: 'icon-exit-on', false: 'icon-exit'}[isExitActive]" title="退出系统" ng-click="openQuitConfirm()"></i>
				</span>
			</span>
			<div id="tools">
			<span class="toolBtn">
				<span id="message" ng-click = "clickBell($event)" style="padding-left: 90px;"></span>
				<!-- <span ng-show="searchInput">
					<i ng-class="{true: 'icon-search-on', false: 'icon-search'}[isSearchActive]" title="字体设置"
					   ng-mouseenter="isSearchActive = true" ng-mouseleave="isSearchActive = false" ng-click="openSearch()"></i>
					<div class="search-bar">
						<div class="input-block">
							<input type="text" class="search-txt">
							<input type="button" class="search-btn">
							<div class="select-box">
								<span class="select-txt">人员</span>
								<span class="select-btn"></span>
								<select name="" id="">
									<option value="人员" selected="selected">人员</option>
									<option value="部门">部门</option>
								</select>
							</div>
						</div>
					</div>
				</span> -->

				<!-- <span ng-mouseenter="isFontActive = true" ng-mouseleave="isFontActive = false"
					  ng-class="{true:'span-font-on', false: 'span-font'}[isFontActive]">
					<i ng-class="{true: 'icon-font-on', false: 'icon-font'}[isFontActive]" title="字体设置"></i>
					<div class="outerBox" ng-show="isFontActive">
						<div class="fontDiv">
							<p><span style="font-size: 15px" ng-click="chooseFont('big',$event)">大</span></p>
							<p><span style="font-size: 14px" class="on" ng-click="chooseFont('default',$event)">中</span></p>
							<p><span style="font-size: 12px" ng-click="chooseFont('small',$event)">小</span></p>
						</div>
					</div>
				</span> -->

				 <%-- <span ng-mouseenter="isSkinActive = true" ng-mouseleave="isSkinActive = false"
					  ng-class="{true: 'span-skin-on', false: 'span-skin'}[isSkinActive]">
					<i ng-class="{true: 'icon-skin-on', false: 'icon-skin'}[isSkinActive]" title="换肤"></i>
					<div class="outerBox" ng-show="isSkinActive">
						<div class="skinDiv">
							<p ng-repeat="item in allThemes">

								<span class="skinItem" data-value="{{item.value}}" ng-click="chooseSkin($event)">{{item.name}}</span>
							</p>
							<p><span class="skinItem" data-value="default" ng-click="chooseSkin('default',$event)">蓝色</span></p>
							<p><span class="skinItem" data-value="red" ng-click="chooseSkin('red',$event)">红色</span></p>
							<p><span ng-click="chooseSkin('',$event)">黑色</span></p>
						</div>
					</div>
				</span> --%>

				<span ng-show="false" ng-mouseenter="isSetActive = true" ng-mouseleave="isSetActive = false">
					<i
					   ng-class="{true: 'icon-set-on', false: 'icon-set'}[isSetActive]"  title="设置个人信息">

					</i>
				</span>
			</span>
			</div>
		</div>
	</div>
	<div class="row wrapper clear" ng-model="changeCss">
		<div class="menuContent">
			<div class="menuBig" ng-show="isShowBigMenuBox">
				<div class="bigMenuBox">
					<div class="sliderBox">
						<p class="icon-big-menu-0" ng-click="changeMenuBox()"></p>
						<%--<p class="icon-big-menu-1" ng-click="backToIndex()">--%>
						<%--<i class="home-icon"></i>--%>
						<%--系统首页--%>
						<%--</p>--%>
						<div class="big-menu-box">
							<div class="hide parent_{{item.parentbh}}" ng-repeat="item in allMenuItem.menuSecond" on-finish-render-filters>
								<div class="menu-title" id="{{item.CDBH}}" style="text-align:left">
									<img ng-src="<common:webRoot />{{item.TPLJ}}">
									<span ng-click="openWinLink(item,$event)">
										{{item.CDMC}}
									</span>
									<i class="sidebar-title-icon show-up" ng-class="item.showicon"  ng-click="changeMenuUpDown(item,$event)" ng-if="item.children.length"></i>
								</div>
								<ul class="menu-item" ng-if="item.sign">
									<li ng-repeat="children in item.children" id="{{children.CDBH}}"
										ng-click="openWinLink(children,$event)">{{children.CDMC}}</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="menuSmall"  ng-show="!isShowBigMenuBox">
				<ul>
					<li id="openMenuBig" class="icon-nav-0" data-text="展开菜单" ng-click="changeMenuBox()" ng-mouseenter="showTips($event)"
						ng-mouseleave="hideTips($event)"></li>
					<li ng-repeat="item in allMenuItem.menuSecond"  id="min-icon-{{item.CDBH}}" on-finish-render-filters data-text="{{item.CDMC}}" class="hide iconMenu parent_{{item.parentbh}}"
						ng-click="clickMenuSmall(item,$event)" ng-mouseenter="showTips($event)" ng-mouseleave="hideTips($event)">
						<img ng-src="<common:webRoot />{{item.TPLJ}}">
					</li>
				</ul>
			</div>
		</div>
		<div class="content">
			<div class="history"></div>
			<div class="mainWindow">
				<iframe id="boandaContent" name="boandaContent" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
						style="width: 100%;height: 100%;" src="">
				</iframe>

				<input id="defaultIframeURL" type="hidden" value="<common:webRoot /><common:configValue key='bd.sys.platform.config.systemConfig.base.index.system' defaultValue='/platform/home/homecontroller/defaulthomepage' />">
				<input id="isShowHomePage" type="hidden" value="<common:configValue key='bd.sys.platform.config.systemConfig.base.index.isShowHomePage' defaultValue='true' />">
				
			</div>
		</div>
	</div>
	<footer ng-if="<common:configValue key='bd.sys.platform.config.systemConfig.base.company.isShowFooter' defaultValue='true' />" class="row footer">
				技术支持：<common:configValue key='bd.sys.platform.config.systemConfig.base.company.name' defaultValue="深圳市博安达信息技术股份有限公司" />
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系电话：<common:configValue key='bd.sys.platform.config.systemConfig.base.company.phone' defaultValue="400-880-2673" />
</div>
</body>
<script type="text/javascript" src="<common:webRoot/>/resources/platform/index/index.js?v=${sysversion}"></script>
<%@include file="/platform/common/footer.jsp" %>