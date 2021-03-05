    <%@include file="/platform/common/header.jsp" %>
        <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
        <%--<body class="home-page" ng-init="yhmc='${SESSION_USER.yhmc }';">--%>
        <body>
            <style>
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
            </style>
            <link rel="stylesheet" href="<common:webRoot/>/resources/smart/menu/css/gkbj.css" />
        <%--<link rel="stylesheet" type="text/css" href="<common:webRoot />/resources/platform/index/css/index-default.css" />--%>
        <%--<link rel="stylesheet" type="text/css" href="<common:webRoot /><common:configValue key="bd.sys.platform.config.systemConfig.base.index.cssPath" defaultValue="#"/>" />--%>
        <%--<script>--%>
        <%--    var userSet = <common:configValue key='bd.sys.platform.config.systemConfig.base.index.YHZX' defaultValue='false' />;--%>

        <%--    //跳转首页--%>
        <%--    window.location="<common:webRoot/>/frontal/index.jsp#/bgAir/airFireMap";--%>
        <%--</script>--%>
        <%--<div style="position:fixed;font-size:18px;right: 70px;top: 32px;z-index: 10;color:white"></div>--%>
        <iframe src="<common:webRoot/>/scdp/index.html#/index" style="width: 100%;height: 100%;border: none;"></iframe>
            <script>
            loginName = '${SESSION_USER.yhmc }';
            function loginout() {
       /*              layer.confirm('是否确认退出？', {
                            btn: ['确认','取消'] //按钮
                            }, function(){
                            localStorage.removeItem("userInfo");
                            window.location.href = '<common:webRoot/>/loginout?token=' + sessionStorage.getItem('token');
                            }, function(){

                    }); */
                    localStorage.removeItem("userInfo");
                    window.location.href = '<common:webRoot/>/loginout?token=' + sessionStorage.getItem('token');
            }
         
            </script>
			<%--<script type="module" src="<common:webRoot/>/resources/smart/menu/js/transcode.worker.js"></script>--%>
			<script  src="<common:webRoot/>/resources/smart/menu/js/crypto-js.js"></script>
			<script  src="<common:webRoot/>/resources/smart/menu/js/base64.min.js"></script>
			<script src="<common:webRoot/>/resources/smart/menu/js/ttsrecorder.js"></script>
        </body>
        <%--<script type="text/javascript" src="<common:webRoot/>/resources/platform/index/index.js?v=${sysversion}"></script>--%>
        <%@include file="/platform/common/footer.jsp" %>
