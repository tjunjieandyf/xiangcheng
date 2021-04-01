<%@ include file="/platform/common/header.jsp" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<style>
.readonly{
	border-bottom: solid 1px rgb(232,232,232);
}
.col{
	float: left;
	padding: 0 15px;
}
.hiddenOverflow{
	white-space:nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.searchContent{
	padding-left: 10px;
}
.disable{
    background-color:#c8c8c8!important;
    cursor:not-allowed!important;
}
/* .form-label-left {
	margin-left: -35px !important;
} */

</style>
<body ng-init="pageTitle='部门管理'">
	<div class="container-full" ng-controller="DeptController">
		<div id="detail">
			<div class="col-md-5 leftContain" style="padding:0px">
				<div class="edit-header">
					<div class="col-xs-3 edit-title">
						<i class="icon"></i>部门管理
					</div>
					<div class="col-xs-9 edit-btn-box" style="padding-right: 10px;">
						<div class="btn-group">
							<button type="button" class="btn btn-default refresh btn-sm" ng-click="refresh()">刷&nbsp;新</button>
						</div>
						<div class="btn-group" uib-dropdown uib-dropdown-toggle is-open="newMenu.isopen" ng-mouseenter="newMenu.isopen = true" ng-mouseleave="newMenu.isopen = false">
							<!-- <button type="button" class="btn btn-default add btn-sm">新增<span class="caret"></span></button> -->
							<!-- <ul class="dropdown-menu">
								<li ng-click="addBrother()"><a href="javascript: void(0);">同层部门</a></li>
								<li ng-click="addChild()"><a href="javascript: void(0);">下层部门</a></li>
							</ul> -->
							<button type="button" class="btn btn-default add btn-sm disable">新增</button>
						</div>
						<!-- <button type="button" class="btn btn-default btn-sm" ng-click="remove()">删&nbsp;除</button> -->
						<!-- <input id="fileSelect" type="file" nv-file-select uploader="uploader" style="display:none;" multiple/> -->
						<!-- <div class="btn-group" uib-dropdown uib-dropdown-toggle is-open="importDept.isopen" ng-mouseenter="importDept.isopen = true" ng-mouseleave="importDept.isopen = false">
							<button type="button" class="btn btn-default btn-sm">操作<span class="caret"></span></button>
							<ul class="dropdown-menu">
								<li ng-click="exportExcel()"><a href="javascript: void(0);">导出部门</a></li>
								<li ng-click="downloadTemplate()"><a href="javascript: void(0);">下载模板</a></li>
								<li ng-click="importExcel()"><a href="javascript: void(0);">导入部门</a></li>
							</ul>
						</div> -->
						<div class="btn-group">
							<button type="button" class="btn btn-default export btn-sm" ng-click="exportExcel()">导&nbsp;出</button>
						</div>
					</div>
				</div>
				<div class="edit-body clear" style="margin-right: 0">
			        <div class="col-xs-12 pt-border-line" ng-cloak style="padding: 0px; text-align: right;">
				        <div class="form-group">
							<div class="col-xs-9">
					            <div class="searchContent">
					                <input class="searchInput " type="text" ng-model="searchInput"
					                       ng-model-options="{updateOn:'default blur'}" placeholder="按部门名称/全称/拼音简写查找,按回车键搜索"
					                       ng-keypress="findDepts(event)" style="text-align: left;"/>
					                <i class="glyphicon glyphicon-search platform-search-icon"></i>
					            </div>
					        </div>
					        <div class="col-xs-3" style="text-align: left;">
					        	<input class="magic-checkbox" type="checkbox" id="new" ng-click="selectInvalid()" ng-model="invalidState"/>
	                            <label for="new">无效</label>
					        </div>
					    </div>
			            
			            	<!--正常显示的列表-->
			            <div class="treeContent col-xs-12" ng-show="isShowTree" style="border: 0px;">
			                <ul id="leftTree" class="ztree"></ul>
			            </div>
			            <div class="searchDetail col-xs-12" ng-show="isShowSearch" style="height: 100%; overflow: auto">
			                <div class="list-group">
								<div class="noData" ng-show="isEmpty">没有查询到数据</div>
								<!--搜索显示的列表-->
			                    <a title="{{item.ZZQC}}" ng-class="{true: 'active', false: 'inactive'}[item.active]" data="{{item}}"
			                       ng-click="selectItems(item)" class="list-group-item hiddenOverflow"
			                       ng-repeat="item in items">{{item.ZZQC}}</a>
			                </div>
			            </div>
			        </div>
			     </div>
			</div>
			
			<div class="col-md-7 rightContain" style="padding: 0px;">	
				<div class="edit-header">
					<div class="col-xs-4 edit-title">
						<i class="icon"></i>部门详情
					</div>
					<div class="col-xs-8 edit-btn-box">
					<!-- ng-click="save()" -->
						<button id="savedept" type="button" class="btn btn-default save btn-sm disable" >保&nbsp;存</button>
					</div>
				</div>
				<div class="edit-body" style="margin: 0;padding-right: 0" >
					<form id="myVaildate" class="pt-border-line form-horizontal" name="validateForm">
						<div ng-show="false"><input type="text" ng-model="dept.XH" style="display: none;" /></div>
						<div class="form-group" style="margin-top: 10px;">
							<label class="col-md-3"><i class="pd-required">*</i>部门名称：</label>
							<div class="col-md-9">
								<input ng-focus="getBMJC()" ng-blur="setPYJX()" ng-model="dept.ZZJC" type="text"
									   class="form-control easyui-validatebox" data-options="validType:'length[1,25]',required:true,tipPosition:'bottom'" /></div>
						</div>
						<div class="form-group form-label-left">
							<label class="col-md-3"><i class="pd-required">*</i>部门代号：</label>
							<div class="col-md-9">
								<span id="ZZDHPrefix" class="edit-font-float">{{dept.ZZDHPrefix}}</span>
								<input id="ZZDHEnd" style="border-bottom: solid 1px rgb(232,232,232);" ng-readonly="readOnlyDeptCode" ng-model="dept.ZZDHEnd" type="text" class="form-control easyui-validatebox" data-options="validType:['integer','minNum[0]'],required:true,tipPosition:'bottom'" />
							</div>
							<input ng-model="dept.ZZDHPrefix" ng-show="false" />
							<!-- 
							<div class="col-md-4" style="padding-right: 0px;">
								<input style="border-bottom: solid 1px rgb(232,232,232); text-align: left;"
								 	ng-model="dept.ZZDHPrefix" ng-readonly="true" class="form-control readonly" /></div>
							<div class="col-md-5"><input ng-model="dept.ZZDH" type="text" class="form-control easyui-validatebox" data-options="validType:['integer','length[2,2]'],required:true,tipPosition:'bottom'" /></div>
							 -->
						</div>
						<div class="form-group form-label-left">
							<label class="col-md-3"><i class="pd-required">*</i>部门级别：</label>
							<div class="col-md-9">
								<div ng-validate="true" pt-select ng-disabled="readOnlyDeptLevel" 
								ng-model="dept.BMJB" ng-model-select="develData"></div>
							</div>
						</div>
						<div class="form-group form-label-left">
							<label class="col-md-3">外协单位：</label>
							<span><input class="magic-radio" type="radio" name="SFWXDW" id="SFWXDW_1" ng-model="dept.SFWXDW" value="1">
                            <label for="SFWXDW_1">是</label></span>
                            <span><input class="magic-radio" type="radio" name="SFWXDW" id="SFWXDW_0" ng-model="dept.SFWXDW" value="0">
                            <label for="SFWXDW_0">否</label></span>
						</div>
						<div class="form-group form-label-left">
							<label class="col-md-3"><i class="pd-required">*</i>排序号：</label>
							<div class="col-md-9"><input ng-model="dept.PXH" type="text" class="form-control easyui-validatebox" data-options="validType:['integer','minNum[1]','length[1,8]'], required:true, tipPosition:'bottom'"/></div>
						</div>
						<div class="form-group form-label-left">
							<label class="col-md-3">部门全称：</label>
							<div class="col-md-9"><input style="border-bottom: solid 1px rgb(232,232,232);"
								ng-readonly="true" ng-model="dept.ZZQC" type="text" class="form-control easyui-validatebox" data-options="validType:'length[1,250]',tipPosition:'bottom'" /></div>
						</div>
						<div class="form-group form-label-left">
							<label class="col-md-3">拼音简写：</label>
							<div class="col-md-9"><input ng-model="dept.PYJX" type="text" class="form-control easyui-validatebox" data-options="validType:['nonChinese','length[1,25]'],tipPosition:'bottom'"/></div>
						</div>
						<div class="form-group form-label-left">
							<label class="col-md-3">是否有效：</label>

							<span><input class="magic-radio" type="radio" name="SFYX" id="SFYX_1" ng-model="dept.SFYX" value="1">
                                    <label for="SFYX_1">有效</label></span>
                                    <span><input class="magic-radio" type="radio" name="SFYX" id="SFYX_0" ng-model="dept.SFYX" value="0">
                                    <label for="SFYX_0">无效</label></span>

						</div>
						<div class="form-group" ng-show="false">
							<input ng-model="dept.SJZZXH" type="text" style="display: none;" />
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
	<script type="text/javascript" src="<common:webRoot/>/resources/platform/rms/dept/deptmanage.js?v=${sysversion}"></script>
</body>
<%@ include file="/platform/common/footer.jsp" %>