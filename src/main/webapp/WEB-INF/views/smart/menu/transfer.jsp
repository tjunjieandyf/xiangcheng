<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>中转页面</title>
<script type="text/javascript">
(function(){
    var locationObj = window.location;
    alert(locationObj.host)
    var url = locationObj.protocol+"//"+locationObj.host+"/suichang/smart/menu/main.jsp";
    alert(url);
    window.open("http://www.baidu.com");
})();
</script>
</head>
<body>
</body>
</html>