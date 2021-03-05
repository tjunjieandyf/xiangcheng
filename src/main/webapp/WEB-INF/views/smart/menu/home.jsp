    <%@include file="/platform/common/header.jsp" %>
        <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
        <%--<body class="home-page" ng-init="yhmc='${SESSION_USER.yhmc }';">--%>
        <body>
        <%--<link rel="stylesheet" type="text/css" href="<common:webRoot />/resources/platform/index/css/index-default.css" />--%>
        <%--<link rel="stylesheet" type="text/css" href="<common:webRoot /><common:configValue key="bd.sys.platform.config.systemConfig.base.index.cssPath" defaultValue="#"/>" />--%>
        <%--<script>--%>
        <%--    var userSet = <common:configValue key='bd.sys.platform.config.systemConfig.base.index.YHZX' defaultValue='false' />;--%>

        <%--    //跳转首页--%>
        <%--    window.location="<common:webRoot/>/frontal/index.jsp#/bgAir/airFireMap";--%>
        <%--</script>--%>

        <iframe src="<common:webRoot/>/frontal/index.html#/bgAir/airFireMap" style="width: 100%;height: 100%;border: none;"></iframe>
        </body>
        <%--<script type="text/javascript" src="<common:webRoot/>/resources/platform/index/index.js?v=${sysversion}"></script>--%>
        <%@include file="/platform/common/footer.jsp" %>
