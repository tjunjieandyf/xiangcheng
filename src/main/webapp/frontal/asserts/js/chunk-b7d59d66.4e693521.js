(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-b7d59d66"],{"6b03":function(t,n,e){"use strict";var i=e("deca");e.n(i).a},b6c6:function(t,n,e){"use strict";e.r(n);var i={data:function(){return{menuList:[{title:"首页",selected:!0,url:"/index"},{title:"demo",selected:!0,url:"/app"}]}},methods:{logout:function(){this.$confirm("是否确认退出?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){window.location.href=ServerGlobalConstant.ctx+"/loginout?token="+sessionStorage.getItem("token")})).catch((function(){}))},getMenuList:function(){}}};e("6b03"),e=e("2877"),i=Object(e.a)(i,(function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"zy-wrap"},[e("div",{staticClass:"top",staticStyle:{position:"relative","z-index":"1000"}},[e("div",{staticClass:"logo",staticStyle:{cursor:"pointer"},on:{click:function(n){return t.$router.push("/home")}}}),e("div",{staticClass:"nav"},[e("ul",t._l(t.menuList,(function(n,i){return e("router-link",{key:i,attrs:{tag:"li","active-class":"cur",to:n.url}},[t._v("\n                    "+t._s(n.title)+"\n                ")])})),1)]),e("div",{staticClass:"user"},[e("i",{staticClass:"signout",staticStyle:{cursor:"pointer"},on:{click:function(n){return t.logout()}}})])]),e("router-view")],1)}),[],!1,null,"d03fabfc",null);n.default=i.exports},deca:function(t,n,e){}}]);