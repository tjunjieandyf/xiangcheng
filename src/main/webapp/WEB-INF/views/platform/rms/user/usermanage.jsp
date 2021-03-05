<%@ include file="/platform/common/header.jsp" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<style type="text/css">
	.userGrid {
		height : 380px;
	}
	.ui-grid-contents-wrapper .ui-grid-render-container .ui-grid-viewport{
		-ms-overflow-x: auto !important;
	}
	.pagination-sm>li>a, .pagination-sm>li>span{
		padding: 6px 8px;
	}
	.panel-body{
		padding-left: 0px;
	}
	.oneline{
		white-space:nowrap;
	}
	.treeSelect{
		width: 60%;
		height: 320px;
		z-index:5;
		top:20px;
		left:75px;
		padding-top: 35px;
	}
	.deptIcon{
		float: left;
		margin-top: 8px;
		margin-left: 8px;
		width: 33%;
	}
	.hiddenOverflow{
		white-space:nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.icon-sjlh{
		line-height: 35px;
		vertical-align: top;
		padding: 0 15px;
		color: darkgray		
	}
	.tdButtonNoSelected {
		color: #337AB7;
	}
	.tdButtonSelected {
		color: #FF6600;
	}
	.searchInputAdd{
		text-align: left;
		background-color: rgb(245,245,245);
	}
	.checkLabel{
		font-size: 1.1rem;
		font-weight: normal;
		color: rgb(169,169,169);
	}

	
	/*编辑页面label字顶在左侧边界附近*/
	.control-label{padding-left: 0;padding-right: 0}
	.form-group>div{padding-left: 0}
	.deptSelect > .input-group{padding-right: 0}
	
	.form-group .input-group{padding-right: 0;padding-left: 0;}
	
	.glyphicon-pt-organization{
    	right: 6px;
    }


	.autoRowHeight .ui-grid-row{
		height: auto!important;
		min-height: 34px;
	}

	.autoRowHeight .ui-grid-row   > div {
		display: table-row;

	}

	.autoRowHeight .ui-grid-row > div .ui-grid-cell {
		display: table-cell;
		float: none;
		vertical-align: middle;
		height: auto!important;
	}

	.autoRowHeight .ui-grid-cell-contents{
		white-space: normal;
		text-overflow: inherit;
		word-break: break-word;
	}
	.autoRowHeight .ui-grid-cell-contents{
		line-height: 35px;
	}
	.autoRowHeight .grid-col-left{text-align: left;}
	.autoRowHeight .grid-col-left > div{line-height: 25px !important}
	
	.popup-select{margin-left: -4%;}

	/* 密码强度颜色 */
	.container-fluid .rightContain #password-strength .btn-danger{
		background-color: #d9534f;
		border-color: #d43f3a;
	}
	.container-fluid .rightContain #password-strength .btn-warning{
		background-color: #ec971f;
		border-color: #eea236;
	}
	.container-fluid .rightContain #password-strength .btn-success{
		background-color: #5cb85c;
		border-color: #4cae4c;
	}
	.disable{
         background-color:#c8c8c8;
         cursor:not-allowed;
     }
</style>
<body ng-init="pageTitle='人员管理';">
<div class="container-fluid" ng-controller="UserController">
	<div class="row" id="detail">
		<div class="col-md-6 leftContain" style="position: relative;">
			<div class="edit-header row">
				<div class="col-xs-4 edit-title">
					<i class="icon"></i>人员管理
				</div>
				<div class="col-xs-8 edit-btn-box" style="padding-right: 10px;">
					<button type="button" class="btn btn-default add btn-sm disable">新&nbsp;增</button>
					<!-- <button type="button" class="btn btn-default btn-sm" ng-click="remove()">删&nbsp;除</button> -->
					<input id="fileSelect" type="file" nv-file-select uploader="uploader" style="display:none;" multiple/>
					<div class="btn-group" uib-dropdown uib-dropdown-toggle is-open="importDept.isopen" ng-mouseenter="importDept.isopen = true" ng-mouseleave="importDept.isopen = false">
						<button type="button" class="btn btn-default handle btn-sm">操&nbsp;作<span class="caret"></span></button>
						<ul class="dropdown-menu">
							<li ng-click="exportExcel()"><a href="javascript: void(0);">导出用户</a></li>
							<li ng-click="downloadTemplate()"><a href="javascript: void(0);">下载模板</a></li>
							<li ng-click="importExcel()"><a href="javascript: void(0);">导入用户</a></li>
						</ul>
					</div>
				</div>
			</div>

			<div class="edit-body row userGrid-grid-content">
				<div class="col-md-12 grid-serachbar" style="padding-left: 10px; text-align: right;">
					<div class="form-group pt-border-line" style="margin-top: 5px;">
						<div class="col-md-10">
							<div popup-select ng-model="DEPTXH" ng-model-name="DEPTNAME" ng-type="dept" placeholder="按用户所属部门查找"
								 ng-callback="selectDEPTXH()" ng-class-name="popup-select" style="width: 100%;margin-left:4%;padding-bottom: 5px;">
							</div>
						</div>
						<div class="col-md-2" style="margin-left: -2%;">
							<input class="magic-checkbox" type="checkbox" id="invalidId" ng-click="selectInvalid()" ng-model="invalidState"/>
	                        <label for="invalidId">无效</label>
						</div>
						<div class="col-md-10">
							<div class="searchContent">
								<input class="searchInput pt-border-line" type="text" ng-model="filterValue" ng-keyup="myKeyup($event)"
									   placeholder="按用户账号/名称/拼音简写查找,按回车键搜索" style="float: left;"/>
								<i class="glyphicon glyphicon-search platform-search-icon"></i>
							</div>
						</div>
						<div class="col-md-2" style="margin-left: -2%;">
							<input class="magic-checkbox" type="checkbox" id="lockId" ng-click="selectLock()" ng-model="lockState"/>
	                        <label for="lockId">被锁</label>
						</div>
					</div>
				</div>
				<div class="col-md-12" style="padding-left: 0;padding-right: 0;padding-top: 5px;">
					<div data-id="userGrid" data-classname="userGrid" grid-directive></div>
				</div>
			</div>
		</div>

		<div class="col-md-6 rightContain"  ng-show = "isShowUserDetail">
			<div class="edit-header row">
				<div class="col-xs-4 edit-title"><i class="icon"></i>用户详情</div>
				<div class="col-xs-8 edit-btn-box">
				<!-- ng-click="resetPassword(user)" -->
				<button type="button" title="重置用户密码为初始密码" class="btn btn-default refresh btn-sm disable" ng-show = "user.YHID" 
					>重&nbsp;置
				<button type="button" title="该用户登录错误次数超出系统限制被锁，点击进行解锁" class="btn btn-default unlock btn-sm" ng-show = "showUnlock" 
					ng-click="unlock(user.YHID)">解&nbsp;锁
				<!-- ng-click="save()" -->
				<button type="button" class="btn btn-default save btn-sm disable" >保&nbsp;存</button>
				</div>
			</div>
			<div class="edit-body row">
				<form id="myVaildate" class="pt-border-line form-horizontal" name="validateForm">
					<div ng-show="false">
						<input ng-model="user.YHID" style="display: none;" />
					</div>
					<div class="form-group">
						<div class="col-md-6">
							<label class="col-md-4 control-label oneline" ><i class="pd-required">*</i>用户账号：</label>
							<div class="col-md-8">
								<input id="XTZH" ng-model="user.XTZH" type="text" class="form-control easyui-validatebox" 
								       data-options="validType:'accountValidate',required:true,tipPosition:'bottom'"/>
							</div>
						</div>
						<div class="col-md-6">						
							<label class="col-md-4 control-label oneline"><i class="pd-required">*</i>用户名称：</label>
							<div class="col-md-8"><input ng-focus="getYHMC()" ng-blur="setPYJX()" ng-model="user.YHMC" type="text" class="form-control easyui-validatebox"
														 data-options="validType:'length[1,25]',required:true,tipPosition:'bottom'" /></div>
						</div>
					</div>
					<div class="form-group">
						<div class="col-md-6">
                            <label class="col-md-4 control-label oneline">&nbsp;&nbsp;&nbsp;<i class="pd-required">*</i>排序号：</label>
                            <div class="col-md-8"><input ng-model="user.PXH" type="text" class="form-control easyui-validatebox" data-options="validType:['integer','minNum[1]','length[1,6]'], required:true, tipPosition:'bottom'"/></div>
                        </div>
						<div class="col-md-6">
							<label class="col-md-4 control-label oneline">拼音简写：</label>
							<div class="col-md-8"><input ng-model="user.PYJX" type="text" class="form-control easyui-validatebox" data-options="validType:['nonChinese','length[0,25]']"/></div>
						</div>
					</div>
					
					<div class="form-group">
						<div class="col-md-6">
							<label class="col-md-4 control-label oneline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;性&nbsp;&nbsp;&nbsp;别：</label>
								<span style="padding-left: 12px"><input class="magic-radio" type="radio" name="XB" id="XB_1" ng-model="user.XB" value="1">
								<label for="XB_1">男&nbsp;&nbsp;&nbsp;</label></span>
								<span><input class="magic-radio" type="radio" name="XB" id="XB_0" ng-model="user.XB" value="0">
								<label for="XB_0">女</label></span>
						</div>
						<div class="col-md-6">
							<label class="col-md-4 control-label oneline">是否有效：</label>
								<span style="padding-left: 12px"><input class="magic-radio" type="radio" name="SFYX" id="SFYX_1" ng-model="user.SFYX" value="1">
								<label for="SFYX_1">是</label></span>
								<span><input class="magic-radio" type="radio" name="SFYX" id="SFYX_0" ng-model="user.SFYX" value="0">
								<label for="SFYX_0">否</label></span>
						</div>
					</div>
					<div class="form-group">
					   <div class="col-md-6">
                            <label class="col-md-4 control-label oneline">是否在岗：</label>
                                <span style="padding-left: 12px"><input class="magic-radio" type="radio" name="SFZG" id="SFZG_1" ng-model="user.SFZG" value="1">
                                <label for="SFZG_1">是</label></span>
                                <span><input class="magic-radio" type="radio" name="SFZG" id="SFZG_0" ng-model="user.SFZG" value="0">
                                <label for="SFZG_0">否</label></span>
                        </div>
                        <div class="col-md-6">
							<label class="col-md-4 control-label oneline">组织机构编号：</label>
							<div class="col-md-8"><input ng-model="user.ORGID" type="text"  class="form-control easyui-validatebox" data-options="validType:'length[1,25]',tipPosition:'bottom'"/></div>
						</div>
					</div>
					<div class="form-group">
						<div class="col-md-6">
							<label class="col-md-4 control-label oneline">办公电话：</label>
							<div class="col-md-8"><input ng-model="user.BGDH" type="text"  class="form-control easyui-validatebox" data-options="validType:'phone',tipPosition:'bottom'"/></div>
						</div>
						<div class="col-md-6">
							<label class="col-md-4 control-label oneline">手机号码：</label>
							<div class="col-md-8"><input ng-model="user.YHSJ" type="text"  class="form-control easyui-validatebox" data-options="validType:'mobile',tipPosition:'bottom'"/></div>
						</div>
					</div>
<%--					<div class="form-group">--%>
<%--						<div class="col-md-12">--%>
<%--							<label class="col-md-2 control-label oneline">身份证号码：</label>--%>
<%--							<div class="col-md-10"><input ng-model="user.SFZHM" type="text" class="form-control easyui-validatebox" data-options="validType:['length[0,50]','idcard'],tipPosition:'top'"/></div>--%>
<%--						</div>--%>
<%--					</div>--%>
					<div class="form-group">
						<div class="col-md-12">
							<label class="col-md-2 control-label oneline">用户职位：</label>
							<div class="col-md-10"><input ng-model="user.YHZW" type="text" class="form-control easyui-validatebox" data-options="validType:'length[0,25]',tipPosition:'top'"/></div>
						</div>
					</div>
					<div class="form-group">
						<div class="col-md-12">
							<label class="col-md-2 control-label oneline" ><i class="pd-required">*</i>所属部门：</label>
							<div class="col-md-10 deptSelect">
								<!--<open-select id="BMBH" options="{modelName: 'user.BMMC', selectType: 'dept', placeholder : '请选择部门' , modelBH: 'user.BMBH',onClick:'selectDataCallback'}"></open-select>-->
								<!--人员等选择组件使用-->
								<div popup-select ng-model="user.BMBH" ng-model-name="user.BMMC" ng-type="dept" style="width: 100%;"></div>
							</div>
						</div>
					</div>
					<div class="form-group">
						<div class="col-md-12">
							<label class="col-md-2 control-label oneline">&nbsp;&nbsp;部门角色：</label>
							<div class="col-md-10">
								<div pt-select multiple="true"  style="width: 100%;" ng-disabled="AutoViewPage" ng-model-value="user.SFLD"  ng-model="deptRoles.selected" ng-model-select="deptRoles"></div>
							</div>
						</div>
					</div>
				</form>
			</div>
			
		</div>
		<div class="col-md-6 rightContain" ng-show = "isShowUserMenuTree">
			<div class="edit-header row">
				<div class="col-xs-4 edit-title"><i class="icon"></i>用户菜单</div>
			</div>
			<div class="edit-body row clear">
				<div class="col-xs-12" style="height: 90%">
					<div class="treeContent" style="height: 100%;overflow: auto; border: 0px;">
						<ul id="userMenuTree" class="ztree"></ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- 文件上传依赖 -->
<%-- <script type="text/javascript" src="<common:webRoot />/resources/platform/common/component/file/file.js?v=${sysversion}"></script> --%>
<script type="text/javascript" src="<common:webRoot/>/resources/platform/rms/user/usermanage.js?v=${sysversion}"></script>

</body>
<%@ include file="/platform/common/footer.jsp" %>