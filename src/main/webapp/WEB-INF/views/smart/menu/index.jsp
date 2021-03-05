<%@ page import="com.szboanda.platform.common.utils.Toolkit" %>
<%@ page import="com.szboanda.platform.rms.user.mode.UserVO" %>
<%@include file="/platform/common/header.jsp" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><!DOCTYPE html>
<%
	UserVO currUser = Toolkit.getCurrUser();
	if (currUser != null) {
		request.setAttribute("currUserId", currUser.getYhid());
	}
%>
<html>
	<head>
		<meta charset="UTF-8">
		<title>水环境保护监督管理子系统</title>
		<link rel="icon" href="<common:webRoot/>/resources/smart/menu/images/logo_g.png" type="image/x-icon">
		<link rel="stylesheet" href="<common:webRoot/>/resources/smart/menu/css/reset.css" />
		<link rel="stylesheet" href="<common:webRoot/>/resources/smart/menu/css/style.css" />
		<link rel="stylesheet" href="<common:webRoot/>/resources/smart/menu/css/gkbj.css" />
		<style>
			.main {
				width: 100%;
				position: absolute;
				top: 85px;
				bottom: 0;

			}
	.header-nav-list li {
	display: inline-block;
	padding: 0 11px;
	}
	.layui-layer-dialog .layui-layer-content {
	position: relative;
	padding: 20px 20px 84px;
	line-height: 20px;
	word-break: break-all;
	overflow: hidden;
	font-size: 14px;
	overflow-x: hidden;
	overflow-y: auto;
	}
	div.layui-layer-btn {
	position: absolute;
	width: 100%;
	bottom: 0;
	height: 30%;
	}

	.content {
	    top: 0px;
	    left: 0px;
		background-color: #033953;
	}
	</style>
	</head>

	<body class="wrap-bg">
		<!--头部-->
		<header class="header" style="z-index:1000;padding-right: 40px">
			<div class="fl" style="margin-right: 12px;margin-top:0px;height:85px;width:540px;">
				<a style="cursor:pointer;width:500px;" href="<common:webRoot/>/frontal/index.html#/home/AirMap"> <img style="margin-top:-14px;padding-top: 7px;" src="<common:webRoot/>/resources/smart/menu/images/logo.png" alt="" /></a>
			</div>
			<div class="title fl"></div>
			<div class="fr">
				<span  id="userRegion">
					${SESSION_USER.yhmc}
					<a target="contentIframe" onclick="clickMsg(event)"
						href="<common:webRoot/>/platform/message/messagecontroller/usermessage" id="messageIcon" class="icon-message" title="消息">
						<span class="icon-message-text" id="message-number">0</span>
					</a>
				</span>
				<span id="logoutRegion" class="show signout" data-show="logOutBox" style="display: inline-block!important;"></span>
			</div>
			<ul id="headerNavList" class="fl header-nav-list" style="/* margin-right:30px; */"></ul>
		</header>
		<div id="mainBox" class="main on-gis">
			<!--侧边导航-->
			<div class="left-menu">
				<div style="text-align:center;height: 39px;">
					<img id="shrinkMenu" style="cursor: pointer;margin-top:13px;width: 15px;" src="<common:webRoot/>/resources/smart/menu/images/m2.png"/>
				</div>
				<ul class="menu-list-1"></ul>
			</div>

			<!--内容区-->
			<div class="content-box">
				<div class="content">
					<iframe name="contentIframe" src="<common:webRoot/>/frontal/index.html#/bgAir/airFireMap" width="100%" height="100%" style="border: none;"></iframe>
				</div>
			</div>

		</div>
		<script type="text/javascript">
		$(function(){
			//退出
			$('#logoutRegion').click(function() {
				layer.confirm('是否确认退出？', {
					btn: ['确认','取消'] //按钮
				}, function(){
                    localStorage.removeItem("userInfo");
					window.location.href = '<common:webRoot/>/loginout?token=' + sessionStorage.getItem('token');
				}, function(){

				});
			})

			$('#userRegion').click(function() {
				layer.open({
					type: 2,
					title: '个人信息设置',
					shadeClose: true,
					shade: 0.8,
					area: ['900px', '480px'],
					content: '<common:webRoot/>/platform/rms/usercontroller/userset',
				});

			})


					// var rows = [{"cdxh":"000","childLoadParam":"","childLoadWay":"","children":[{"cdxh":"1","childLoadParam":"","childLoadWay":"","children":[{"cdxh":"000","childLoadParam":"","childLoadWay":"","children":[],"deletePower":true,"exportPower":true,"functions":[],"level":4,"ljxt":"1","menuId":"20180408161549ff743b4b8bd34308a74c459d5c88986d","CDMC":"地表水","otherPower":true,"parentId":"ROOT","printPower":true,"remark":"","savePower":true,"serialno":0,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"wdsa/indexNew/home.jsp","valid":"1"},{"cdxh":"000","childLoadParam":"","childLoadWay":"","children":[],"deletePower":true,"exportPower":true,"functions":[],"level":4,"ljxt":"1","menuId":"20180408161549ff743b4b8bd34308a74c459d5c88986d","CDMC":"饮用水","otherPower":true,"parentId":"ROOT","printPower":true,"remark":"","savePower":true,"serialno":0,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"/wdsa/indexNew/home.jsp","valid":"1"},{"cdxh":"000","childLoadParam":"","childLoadWay":"","children":[],"deletePower":true,"exportPower":true,"functions":[],"level":4,"ljxt":"1","menuId":"20180408161549ff743b4b8bd34308a74c459d5c88986d","CDMC":"近岸海域","otherPower":true,"parentId":"ROOT","printPower":true,"remark":"","savePower":true,"serialno":0,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"/wdsa/index/Home.jsp","valid":"1"},{"cdxh":"000","childLoadParam":"","childLoadWay":"","children":[],"deletePower":true,"exportPower":true,"functions":[],"level":4,"ljxt":"1","menuId":"20180408161549ff743b4b8bd34308a74c459d5c88986d","CDMC":"首页","otherPower":true,"parentId":"ROOT","printPower":true,"remark":"","savePower":true,"serialno":0,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"/wdsa/index/Home.jsp","valid":"1"},{"cdxh":"000","childLoadParam":"","childLoadWay":"","children":[],"deletePower":true,"exportPower":true,"functions":[],"level":4,"ljxt":"1","menuId":"20180408161549ff743b4b8bd34308a74c459d5c88986d","CDMC":"首页","otherPower":true,"parentId":"ROOT","printPower":true,"remark":"","savePower":true,"serialno":0,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"/wdsa/index/Home.jsp","valid":"1"}],"deletePower":true,"exportPower":true,"functions":[],"level":3,"ljxt":"1","menuId":"20170227173923dd324ea0367b4961a12f006cfbaaeb90","CDMC":"水环境地图分析","otherPower":true,"parentId":"201702271737309c08196002c24d30abddc95e1d0675a1","printPower":true,"remark":"","savePower":true,"serialno":1,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"
					// ","valid":"1"},{"cdxh":"3","childLoadParam":"","childLoadWay":"","children":[{"cdxh":"000","childLoadParam":"","childLoadWay":"","children":[],"deletePower":true,"exportPower":true,"functions":[],"level":4,"ljxt":"1","menuId":"20180408161549ff743b4b8bd34308a74c459d5c88986d","CDMC":"首页","otherPower":true,"parentId":"ROOT","printPower":true,"remark":"","savePower":true,"serialno":0,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"/wdsa/index/Home.jsp","valid":"1"},{"cdxh":"000","childLoadParam":"","childLoadWay":"","children":[],"deletePower":true,"exportPower":true,"functions":[],"level":4,"ljxt":"1","menuId":"20180408161549ff743b4b8bd34308a74c459d5c88986d","CDMC":"三级1","otherPower":true,"parentId":"ROOT","printPower":true,"remark":"","savePower":true,"serialno":0,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"/wdsa/index/Home.jsp","valid":"1"},{"cdxh":"000","childLoadParam":"","childLoadWay":"","children":[],"deletePower":true,"exportPower":true,"functions":[],"level":4,"ljxt":"1","menuId":"20180408161549ff743b4b8bd34308a74c459d5c88986d","CDMC":"三级2","otherPower":true,"parentId":"ROOT","printPower":true,"remark":"","savePower":true,"serialno":0,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"/wdsa/index/Home.jsp","valid":"1"},{"cdxh":"000","childLoadParam":"","childLoadWay":"","children":[],"deletePower":true,"exportPower":true,"functions":[],"level":4,"ljxt":"1","menuId":"20180408161549ff743b4b8bd34308a74c459d5c88986d","CDMC":"首页","otherPower":true,"parentId":"ROOT","printPower":true,"remark":"","savePower":true,"serialno":0,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"/wdsa/index/Home.jsp","valid":"1"},{"cdxh":"000","childLoadParam":"","childLoadWay":"","children":[],"deletePower":true,"exportPower":true,"functions":[],"level":4,"ljxt":"1","menuId":"20180408161549ff743b4b8bd34308a74c459d5c88986d","CDMC":"首页","otherPower":true,"parentId":"ROOT","printPower":true,"remark":"","savePower":true,"serialno":0,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"/wdsa/index/Home.jsp","valid":"1"}],"deletePower":true,"exportPower":true,"functions":[],"level":3,"ljxt":"1","menuId":"20170322093003fffe0734cd95443ca4ae9fd2818d696a","CDMC":"外部气象数据","otherPower":true,"parentId":"201702271737309c08196002c24d30abddc95e1d0675a1","printPower":true,"remark":"","savePower":true,"serialno":3,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"#","valid":"1"}],"deletePower":true,"exportPower":true,"functions":[],"level":2,"ljxt":"1","menuId":"201702271737309c08196002c24d30abddc95e1d0675a1","CDMC":"首页","otherPower":true,"parentId":"ROOT","printPower":true,"remark":"","savePower":true,"serialno":8,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"#","valid":"1"},{"cdxh":"20180528","childLoadParam":"","childLoadWay":"","children":[],"deletePower":true,"exportPower":true,"functions":[],"level":2,"ljxt":"1","menuId":"201805281421234fb3796df5f14bcf868bb917bc269ed9","CDMC":"水质预警分析","otherPower":true,"parentId":"ROOT","printPower":true,"remark":"","savePower":true,"serialno":1,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"/wdsa/waterQualityWarming/Index.jsp","valid":"1"},{"cdxh":"1","childLoadParam":"","childLoadWay":"","children":[{"cdxh":"11","childLoadParam":"","childLoadWay":"","children":[],"deletePower":true,"exportPower":true,"functions":[],"level":3,"ljxt":"1","menuId":"2018040816110527e1df5ed7854bbeae9e6e7e1bb1a674","CDMC":"河流水质分析","otherPower":true,"parentId":"201804081609221f4600ed42ad4fd3a78258e2b8faf20a","printPower":true,"remark":"","savePower":true,"serialno":1,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"wdsa/shjyzt/lakerRiverDrinkingWarter/zlfx.jsp?jcflbs=HL","valid":"1"},{"cdxh":"22","childLoadParam":"","childLoadWay":"","children":[],"deletePower":true,"exportPower":true,"functions":[],"level":3,"ljxt":"1","menuId":"2018040816103773bebb560aba4ad1a155305c86b0c139","CDMC":"湖库水质分析","otherPower":true,"parentId":"201804081609221f4600ed42ad4fd3a78258e2b8faf20a","printPower":true,"remark":"","savePower":true,"serialno":2,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"wdsa/shjyzt/lakerRiverDrinkingWarter/zlfx.jsp?jcflbs=HK","valid":"1"},{"cdxh":"33","childLoadParam":"","childLoadWay":"","children":[],"deletePower":true,"exportPower":true,"functions":[],"level":3,"ljxt":"1","menuId":"20180408161130dc167577818744bcb06d0efbec61455e","CDMC":"饮用水水质分析","otherPower":true,"parentId":"201804081609221f4600ed42ad4fd3a78258e2b8faf20a","printPower":true,"remark":"","savePower":true,"serialno":3,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"wdsa/shjyzt/lakerRiverDrinkingWarter/zlfx.jsp?jcflbs=HKHLYYS","valid":"1"}],"deletePower":true,"exportPower":true,"functions":[],"level":2,"ljxt":"1","menuId":"201804081609221f4600ed42ad4fd3a78258e2b8faf20a","CDMC":"水质数据分析","otherPower":true,"parentId":"ROOT","printPower":true,"remark":"","savePower":true,"serialno":1,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"nav_01.png","updatePower":true,"uploadPower":true,"url":"/ycszfx/ycszfx.jsp","valid":"1"},{"cdxh":"5","childLoadParam":"","childLoadWay":"","children":[],"deletePower":true,"exportPower":true,"functions":[],"level":2,"ljxt":"1","menuId":"20180515154100ef4a76ece1a548bea4a9e0aab12f9ed4","CDMC":"异常水质分析","otherPower":true,"parentId":"ROOT","printPower":true,"remark":"","savePower":true,"serialno":3,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"/ycszfx/ycszfx.jsp","valid":"1"},{"cdxh":"20180524","childLoadParam":"","childLoadWay":"","children":[{"cdxh":"1018052401","childLoadParam":"","childLoadWay":"","children":[],"deletePower":true,"exportPower":true,"functions":[],"level":3,"ljxt":"1","menuId":"20180524194103c116bb939aeb414aadc2f6bb68dcc660","CDMC":"污染源在线监测分析","otherPower":true,"parentId":"2018052419284918b787050b2c47a4866c0175dcdc150e","printPower":true,"remark":"","savePower":true,"serialno":1,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"/wdsa/shjyzt/wrypfsjfx/wrypfsjfx.jsp","valid":"1"},{"cdxh":"2018052402","childLoadParam":"","childLoadWay":"","children":[],"deletePower":true,"exportPower":true,"functions":[],"level":3,"ljxt":"1","menuId":"201805241944418a90aef43e8d4feb8a4533e98b8094e2","CDMC":"污染源排放分析","otherPower":true,"parentId":"2018052419284918b787050b2c47a4866c0175dcdc150e","printPower":true,"remark":"","savePower":true,"serialno":4,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"/wdsa/wryfx/wryfx/wryfx.jsp","valid":"1"}],"deletePower":true,"exportPower":true,"functions":[],"level":2,"ljxt":"1","menuId":"2018052419284918b787050b2c47a4866c0175dcdc150e","CDMC":"污染源分析","otherPower":true,"parentId":"ROOT","printPower":true,"remark":"","savePower":true,"serialno":3,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"/wdsa/shjyzt/wrypfsjfx/wrypfsjfx.jsp","valid":"1"},{"cdxh":"2","childLoadParam":"","childLoadWay":"","children":[{"cdxh":"1","childLoadParam":"","childLoadWay":"","children":[],"deletePower":true,"exportPower":true,"functions":[],"level":3,"ljxt":"1","menuId":"20170227173923dd324ea0367b4961a12f006cfbaaeb90","CDMC":"系统配置","otherPower":true,"parentId":"201702271737309c08196002c24d30abddc95e1d0675a1","printPower":true,"remark":"","savePower":true,"serialno":1,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"gas/xtgl/xtcspzmanager/xtcspzTree.jsp","valid":"1"},{"cdxh":"2","childLoadParam":"","childLoadWay":"","children":[],"deletePower":true,"exportPower":true,"functions":[],"level":3,"ljxt":"1","menuId":"20170321175358daf91e95a268481fa788e5ea41d3c233","CDMC":"文档展示","otherPower":true,"parentId":"201702271737309c08196002c24d30abddc95e1d0675a1","printPower":true,"remark":"","savePower":true,"serialno":2,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"gas/onlinepreview/showDoc/showDoc.jsp?DM=CPPT","valid":"1"},{"cdxh":"3","childLoadParam":"","childLoadWay":"","children":[],"deletePower":true,"exportPower":true,"functions":[],"level":3,"ljxt":"1","menuId":"20170322093003fffe0734cd95443ca4ae9fd2818d696a","CDMC":"外部气象数据","otherPower":true,"parentId":"201702271737309c08196002c24d30abddc95e1d0675a1","printPower":true,"remark":"","savePower":true,"serialno":3,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"/gas/wbqxsj/showImg/qxsjShow.jsp","valid":"1"}],"deletePower":true,"exportPower":true,"functions":[],"level":2,"ljxt":"1","menuId":"201702271737309c08196002c24d30abddc95e1d0675a1","CDMC":"系统配置","otherPower":true,"parentId":"ROOT","printPower":true,"remark":"","savePower":true,"serialno":8,"systemId":"201702271735418653aaef5f784bcfa9cab6cdeac2de88","tpwz":"","updatePower":true,"uploadPower":true,"url":"#","valid":"1"}];



			//rows = [{"PXH":1,"SFXSZCCD":0,"isParent":"false","SFXCKDK":0,"CDMC":"作战地图","pId":"1588065589336096329728","CDKEY":"bd.sys.menu.JCSJ.ZZYZT","FCDXH":"1588065589336096329728","XH":"1588065640265096481280","SFSQCD":1,"PYJX":"ZZYZT","SFYZ":"1","SFYX":1,"LJDZ":"http://localhost:8080/#/bgAir/airFireMap","TPWZ":null,"BZ":null,"name":"作战地图","true":"trueopen","SSXT":"8","SFWBCD":0,"id":"1588065640265096481280","children":[]},{"PXH":2,"SFXSZCCD":null,"isParent":"false","SFXCKDK":0,"CDMC":"数据协同","pId":"1588065589336096329728","CDKEY":"bd.sys.menu.JCSJ.SJXT","FCDXH":"1588065589336096329728","XH":"1588074677156121892864","SFSQCD":1,"PYJX":"SJXT","SFYZ":"1","SFYX":1,"LJDZ":"/bgAir/airDataCollaboration","TPWZ":null,"BZ":null,"name":"数据协同","true":"trueopen","SSXT":"8","SFWBCD":0,"id":"1588074677156121892864","children":[]},{"PXH":3,"SFXSZCCD":1,"isParent":"true","SFXCKDK":0,"CDMC":"业务协同","pId":"1588065589336096329728","CDKEY":"bd.sys.menu.JCSJ.YWXT","FCDXH":"1588065589336096329728","XH":"1588065688942092057600","SFSQCD":1,"PYJX":"YWXT","SFYZ":"0","SFYX":1,"LJDZ":"","TPWZ":null,"BZ":null,"name":"业务协同","true":"trueopen","SSXT":"8","SFWBCD":0,"id":"1588065688942092057600","children":[{"PXH":2,"SFXSZCCD":null,"isParent":"false","SFXCKDK":0,"CDMC":"报警记录","pId":"1588065688942092057600","CDKEY":"bd.sys.menu.JCSJ.YWXT.BJJL","FCDXH":"1588065688942092057600","XH":"1588073141132088653824","SFSQCD":1,"PYJX":"BJJL","SFYZ":"1","SFYX":1,"LJDZ":"http://www.baidu.com","TPWZ":null,"BZ":null,"name":"报警记录","true":"trueopen","SSXT":"8","SFWBCD":0,"id":"1588073141132088653824","children":[]},{"PXH":4,"SFXSZCCD":0,"isParent":"false","SFXCKDK":0,"CDMC":"气象日志","pId":"1588065688942092057600","CDKEY":"bd.sys.menu.JCSJ.YWXT.QXRZ","FCDXH":"1588065688942092057600","XH":"1588065714246073924608","SFSQCD":1,"PYJX":"QXRZ","SFYZ":"1","SFYX":1,"LJDZ":"http://www.baidu.com","TPWZ":null,"BZ":null,"name":"气象日志","true":"trueopen","SSXT":"8","SFWBCD":0,"id":"1588065714246073924608","children":[]}]},{"PXH":4,"SFXSZCCD":null,"isParent":"false","SFXCKDK":0,"CDMC":"预测预报","pId":"1588065589336096329728","CDKEY":"bd.sys.menu.JCSJ.YCYB","FCDXH":"1588065589336096329728","XH":"1588074764233072056832","SFSQCD":1,"PYJX":"YCYB","SFYZ":"1","SFYX":1,"LJDZ":"","TPWZ":null,"BZ":null,"name":"预测预报","true":"trueopen","SSXT":"8","SFWBCD":0,"id":"1588074764233072056832","children":[]},{"PXH":5,"SFXSZCCD":0,"isParent":"false","SFXCKDK":0,"CDMC":"视频监控","pId":"1588065589336096329728","CDKEY":"bd.sys.menu.JCSJ.SPJK","FCDXH":"1588065589336096329728","XH":"1589337974829055537664","SFSQCD":1,"PYJX":"SPJK","SFYZ":"1","SFYX":1,"LJDZ":"http://www.baidu.com","TPWZ":null,"BZ":null,"name":"视频监控","true":"trueopen","SSXT":"8","SFWBCD":0,"id":"1589337974829055537664","children":[]},{"PXH":6,"SFXSZCCD":0,"isParent":"false","SFXCKDK":1,"CDMC":"PM2.5退倒10","pId":"1588065589336096329728","CDKEY":"bd.sys.menu.JCSJ.PM2.5D10","FCDXH":"1588065589336096329728","XH":"1589337310991030715904","SFSQCD":1,"PYJX":"PM25TD10","SFYZ":"1","SFYX":1,"LJDZ":"http://www.baidu.com","TPWZ":null,"BZ":null,"name":"PM2.5退倒10","true":"trueopen","SSXT":"8","SFWBCD":1,"id":"1589337310991030715904","children":[]},{"PXH":100,"SFXSZCCD":1,"isParent":"true","SFXCKDK":0,"CDMC":"系统管理","pId":"1588065589336096329728","CDKEY":"bd.sys.menu.JCSJ.XTGL","FCDXH":"1588065589336096329728","XH":"1589270428682030294016","SFSQCD":1,"PYJX":"XTGL","SFYZ":"0","SFYX":1,"LJDZ":"/platform/rms/deptcontroller/deptmanage","TPWZ":null,"BZ":null,"name":"系统管理","true":"trueopen","SSXT":"8","SFWBCD":0,"id":"1589270428682030294016","children":[{"PXH":3,"SFXSZCCD":0,"isParent":"false","SFXCKDK":0,"CDMC":"模块开发","pId":"1589270428682030294016","CDKEY":"bd.sys.menu.JCSJ.XTGL.MKKF","FCDXH":"1589270428682030294016","XH":"1589270478836031010816","SFSQCD":1,"PYJX":"MKKF","SFYZ":"1","SFYX":1,"LJDZ":"/pacp/appmodule/controller/appmodulecontroller/applistpage","TPWZ":null,"BZ":null,"name":"模块开发","true":"trueopen","SSXT":"8","SFWBCD":0,"id":"1589270478836031010816","children":[]},{"PXH":10,"SFXSZCCD":1,"isParent":"true","SFXCKDK":0,"CDMC":"组织架构管理","pId":"1589270428682030294016","CDKEY":"bd.sys.menu.JCSJ.XTGL.ZZJGGL","FCDXH":"1589270428682030294016","XH":"1589270568477031010816","SFSQCD":1,"PYJX":"ZZJGGL","SFYZ":"0","SFYX":1,"LJDZ":null,"TPWZ":null,"BZ":null,"name":"组织架构管理","true":"trueopen","SSXT":"8","SFWBCD":0,"id":"1589270568477031010816","children":[{"PXH":101,"SFXSZCCD":0,"isParent":"false","SFXCKDK":0,"CDMC":"部门管理","pId":"1589270568477031010816","CDKEY":"bd.sys.menu.JCSJ.XTGL.ZZJGGL.BMGL","FCDXH":"1589270568477031010816","XH":"1589270598456032317440","SFSQCD":1,"PYJX":"BMGL","SFYZ":"1","SFYX":1,"LJDZ":"/platform/rms/deptcontroller/deptmanage","TPWZ":null,"BZ":null,"name":"部门管理","true":"trueopen","SSXT":"8","SFWBCD":0,"id":"1589270598456032317440"},{"PXH":102,"SFXSZCCD":0,"isParent":"false","SFXCKDK":0,"CDMC":"人员管理","pId":"1589270568477031010816","CDKEY":"bd.sys.menu.JCSJ.XTGL.ZZJGGL.RYGL","FCDXH":"1589270568477031010816","XH":"1589270634562029704192","SFSQCD":1,"PYJX":"RYGL","SFYZ":"1","SFYX":1,"LJDZ":"/platform/rms/usercontroller/usermanage","TPWZ":null,"BZ":null,"name":"人员管理","true":"trueopen","SSXT":"8","SFWBCD":0,"id":"1589270634562029704192"}]},{"PXH":11,"SFXSZCCD":1,"isParent":"true","SFXCKDK":0,"CDMC":"系统管理","pId":"1589270428682030294016","CDKEY":"bd.sys.menu.JCSJ.XTGL.XTGL","FCDXH":"1589270428682030294016","XH":"1589270680944030703616","SFSQCD":1,"PYJX":"XTGL","SFYZ":"0","SFYX":1,"LJDZ":null,"TPWZ":null,"BZ":null,"name":"系统管理","true":"trueopen","SSXT":"8","SFWBCD":0,"id":"1589270680944030703616","children":[{"PXH":111,"SFXSZCCD":0,"isParent":"false","SFXCKDK":0,"CDMC":"菜单管理","pId":"1589270680944030703616","CDKEY":"bd.sys.menu.JCSJ.XTGL.XTGL.CDGL","FCDXH":"1589270680944030703616","XH":"1589270708976031641600","SFSQCD":1,"PYJX":"CDGL","SFYZ":"1","SFYX":1,"LJDZ":"/platform/rms/menucontroller/menumanagement","TPWZ":null,"BZ":null,"name":"菜单管理","true":"trueopen","SSXT":"8","SFWBCD":0,"id":"1589270708976031641600"},{"PXH":112,"SFXSZCCD":0,"isParent":"false","SFXCKDK":0,"CDMC":"任务管理","pId":"1589270680944030703616","CDKEY":"bd.sys.menu.JCSJ.XTGL.XTGL.RWGL","FCDXH":"1589270680944030703616","XH":"1589270752497029982720","SFSQCD":1,"PYJX":"RWGL","SFYZ":"1","SFYX":1,"LJDZ":"/platform/system/jobcontroller/tojobmanage","TPWZ":null,"BZ":null,"name":"任务管理","true":"trueopen","SSXT":"8","SFWBCD":0,"id":"1589270752497029982720"}]}]}]
			//生成菜单


			var MenuObj = {
				init: function(){
					var self = this;
					var rows = [];
					var param = {};
					var menuKey = '${param.key}';
					if (menuKey) {
						param.key = menuKey;
					}
					$.ajax({
						url: '<common:webRoot/>/smart/index/api/menu/findusermenu',
						dataType: 'json',
						data: param,
						async: false,
						success: function(data){
							rows = data.result
							//生成菜单
							self.initMenu(rows);
							$("#headerNavList li>a").eq(0).click();
						}
					});
					$("#headerNavList li>a").eq(0).click();
				},
				// 是否为外链
				getFullUrl: function(url, val){
					// 是否为外链
					var isOpenNew =  val.SFWBCD;
					if(isOpenNew == "0"){
						url = "<common:webRoot/>/"+url;
					}
					return url;
				},
				isOpenNewWindow: function(val){
					var isOpenNew =  val.SFXCKDK;
					if(isOpenNew == "1"){
						return '_blank';
					}else{
						return 'contentIframe';
					}
				},
				initMenu(rows){
					var self = this;
					//生成头部一级菜单
					var str = "";
					$.each(rows,function(idx, val){
						if(val.children &&  val.children.length > 0){
							str += '<li><a data-idx="'+ idx +'">' + val.CDMC + '</a></li>';
						}else{
							// 是否为外链
							var fUrl = self.getFullUrl( val.LJDZ, val);
							var openWin = self.isOpenNewWindow(val);
							str += '<li><a target="'+openWin+'" href="' +  fUrl+ '">' + val.CDMC + '</a></li>';
						}
					});
					$("#headerNavList").html(str);

					//头部一级菜单点击事件
					$("#headerNavList").on("click","a",function(e){
						if($(e.target).attr('target') === '_blank'){//点击打开新窗口的菜单不做下列操作
							return;
						}

					$(e.target).parent().addClass("on").siblings().removeClass("on");
					var idx = $(e.target).data("idx");
					var firstUrl = "";
					var isOpenNewWin = 'contentIframe';
					if(idx == undefined){
						$("#mainBox").addClass("on-gis");
						firstUrl = $(e.target).attr("href");
						isOpenNewWin = $(e.target).attr("target")
					}else{
						$("#mainBox").removeClass("on-gis");
						$("ul.menu-list-1").html("");
						var rows2 = rows[idx].children;
						firstUrl = rows2[0].children.length > 0 ? rows2[0].children[0].LJDZ : rows2[0].LJDZ;
						// 是否为外链
						firstUrl = self.getFullUrl(firstUrl, rows[idx]);
						isOpenNewWin = self.isOpenNewWindow(rows[idx])
						//生成左侧菜单
						var str = "";
						$.each(rows2, function(i,v){
								var className = "menu-item-1";
								var url = v.LJDZ;
								var str3 = "";
								if(v.children &&  v.children.length > 0){
									className += " has-chidren on";
									url = "";
									var rows3 = v.children;
									//左侧下级菜单
									str3 = '<ul class="munu3">';
									$.each(rows3,function(j,obj){
									// 是否为外链
									objUrl = self.getFullUrl(obj.LJDZ, obj);
									var openWin1 = self.isOpenNewWindow(obj);
									str3 += '<li class="menu-item-2">\
													<a target="'+openWin1+'" href="'+objUrl+'"><i class="icon"></i><span class="menu-item-name">'+obj.CDMC+'</span></a>\
												</li>';
									});
									str3 += '</ul>';
								}
								// 是否为外链
								url = url ? self.getFullUrl(url, v) : '';

								var openUrl1 = self.isOpenNewWindow(v);
								//左侧上级菜单
								str += '<li data-idx="'+idx+'" class="'+className+'">\
											<a target="'+openUrl1+'" ' + (url ? 'href="'+url+'" ' : '') + '><i class="icon menu-icon-s"></i><span class="menu-item-name">' + v.CDMC + '</span></a>\
											<label class="hover-title">'+v.CDMC+'</label>' + str3 +
										'</li>';
						});
						$("ul.menu-list-1").html(str);
						$("li.menu-item-1:first-child").addClass("on").find("li.menu-item-2:first-child").addClass("on");
					}

					if(isOpenNewWin == 'contentIframe'){
						$("[name=contentIframe]").attr("src",firstUrl);
					}

					});
					//左侧上级菜单点击事件
					$("ul.menu-list-1").on("click","li.menu-item-1",function(e){
						if(!$(this).hasClass("has-chidren")){
							$("li.menu-item-1:not(has-chidren), li.menu-item-2").removeClass("on");
							$(this).addClass("on");
							$("li.has-chidren").addClass("on");
						}else{
							$(this).toggleClass('on');
						}
					});

					//左侧下级菜单点击事件
					$("ul.menu-list-1").on("click","li.menu-item-2",function(e){
						e.stopPropagation();
						$("li.menu-item-2, li.li.menu-item-1:not(has-children)").removeClass("on");
						$(this).parent().parent().siblings('li.menu-item-1:not(has-chidren)').removeClass('on');
						$("li.has-chidren").addClass("on");
						$(this).addClass('on');
					});

					//收缩侧边栏
				$("#shrinkMenu").on("click", function(e){
					if($(".left-menu").hasClass("shrink")){
						$(this).attr('src', '<common:webRoot/>/resources/smart/menu/images/m2.png');
					}else{
						$(this).attr('src', '<common:webRoot/>/resources/smart/menu/images/m1.png');
					}
					$(".left-menu, .content-box").toggleClass("shrink");
				});
				}
			}
			MenuObj.init();
		});

		var wsUrl = '${applicationScope.wsUrl }';
		var ctx = '<common:webRoot/>';
		</script>
	<script src="<common:webRoot/>/resources/smart/menu/js/index.js"></script>
	<script  src="<common:webRoot/>/resources/smart/menu/js/crypto-js.js"></script>
	<script  src="<common:webRoot/>/resources/smart/menu/js/base64.min.js"></script>
	<script src="<common:webRoot/>/resources/smart/menu/js/ttsrecorder.js"></script>
	</body>

</html>
