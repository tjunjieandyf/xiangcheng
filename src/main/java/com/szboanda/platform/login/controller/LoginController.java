/******************************************************************************
 * Copyright (C) 2017 ShenZhen Powerdata Information Technology Co.,Ltd All Rights Reserved.
 * 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、 复制、修改或发布本软件.
 *****************************************************************************/

package com.szboanda.platform.login.controller;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;

import org.jasig.cas.client.util.CasUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.support.BeanDefinitionBuilder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.szboanda.platform.common.base.BaseController;
import com.szboanda.platform.common.constants.BaseConstants;
import com.szboanda.platform.common.constants.CommonConstants;
import com.szboanda.platform.common.interceptor.LoginInterceptor;
import com.szboanda.platform.common.utils.CollectionUtils;
import com.szboanda.platform.common.utils.LoggerUtil;
import com.szboanda.platform.common.utils.MapUtils;
import com.szboanda.platform.common.utils.StringUtils;
import com.szboanda.platform.common.utils.Toolkit;
import com.szboanda.platform.login.exception.LoginException;
import com.szboanda.platform.login.service.ILoginService;
import com.szboanda.platform.login.service.IValidateCodeService;
import com.szboanda.platform.rms.dept.service.IDeptService;
import com.szboanda.platform.rms.user.mode.UserVO;
import com.szboanda.platform.rms.user.utils.UserUtil;
import com.szboanda.platform.tenant.service.ITenantService;

/**
 * @Title: 登录Controller
 * @author 蔡楚涛
 * @date 2016年4月12日
 * @version V1.0
 */
@Controller
public class LoginController extends BaseController {

    /**
     * 登录Service服务实现
     */
    @Autowired
    private ILoginService loginService;
    /**
     * 租户服务实现
     */
    @Autowired(required = false)
    private ITenantService tenantService;

    /**
     * 租
     */
    @Autowired
    private IDeptService deptService;

    /**
     * 跳转到首页
     *
     * @return
     * @throws Exception
     */
    @RequestMapping("/index")
    public String index() throws LoginException {
    	
        this.setToken();
        // 登录成功后，跳转到登录前计划访问的页面。
        if (null != this.getSession().getAttribute(CommonConstants.SESSION_LOGIN_BEFORE_URI)) {
            String loginBeforeUrl = (String) this.getSession().getAttribute(CommonConstants.SESSION_LOGIN_BEFORE_URI);
            this.getSession().removeAttribute(CommonConstants.SESSION_LOGIN_BEFORE_URI);
            return "redirect:" + loginBeforeUrl;
        }
        String isValidatePasswordStrength = Toolkit
                .getConfigValue("bd.sys.platform.config.systemConfig.savecheck.password.sfkqmmqdjy", "true");

        // 是否使用单点登录
        String isUsedSSO = Toolkit.getConfigValue("bd.sys.platform.config.systemConfig.sso.isused", "false");

        UserVO user = (UserVO) this.getSession().getAttribute(CommonConstants.SESSION_USER);

        /** 初始密码校验 */
        String isValidateInitialPassword = Toolkit
                .getConfigValue("bd.sys.platform.config.systemConfig.savecheck.password.scdlmmjc", "false");
        if ("false".equals(isUsedSSO) && "true".equals(isValidateInitialPassword)) {
            int result = loginService.validateInitialPassword(user);
            if (result == 1) {// 初始密码
                this.getSession().setAttribute("msg", "您的密码为初始密码，请修改密码！");
                return "/platform/rms/user/userpasswordset";
            }
        }

        /** 密码过期校验 */
        String isValidatePasswordExpiration = Toolkit
                .getConfigValue("bd.sys.platform.config.systemConfig.savecheck.password.sfkqmmgqjc", "false");
        if ("false".equals(isUsedSSO) && "true".equals(isValidatePasswordExpiration)) {
            int result = loginService.validatePasswordExpiration(user);
            if (result == 1) {// 密码过期
                this.getSession().setAttribute("msg", "密码过期，请修改密码！");
                return "/platform/rms/user/userpasswordset";
            }
        }

        /** 密码校验 */
        if ("false".equals(isUsedSSO) && "true".equals(isValidatePasswordStrength)) {
            String yhmm = user.getYhpd();
            /** 密码规则校验 */
            int result = loginService.validatePasswordRule(yhmm);
            if (result == 0) {// 不符合规则密码
                this.getSession().setAttribute("msg", "密码不符合规则，请修改密码！");
                return "/platform/rms/user/userpasswordset";
            }
            /** 密码强度校验 */
            result = loginService.validatePasswordStrength(yhmm);
            if (result == 1) {// 弱密码
                this.getSession().setAttribute("msg", "密码强度过低，请修改密码！");
                return "/platform/rms/user/userpasswordset";
            }
        }

        // 登录成功后，跳转到首页
        String indexPage = Toolkit.getConfigValue("bd.sys.platform.config.systemConfig.base.index.logon",
                "/platform/index");

        // 判断用户是否是超级管理员,判断依据：用户的系统账号是否是SUPERADMIN
        if ("SuperAdmin".equals(user.getXtzh())) {
            indexPage = "/platform/index_admin";
        }else if ("SYSTEM".equals(user.getXtzh())) {
            indexPage = "/platform/index";
        }
        
        return indexPage;
    }

    /**
     * 退出登录
     *
     * @return
     * @throws Exception
     */
    @RequestMapping("/loginout")
    public String loginOut() throws LoginException {
        this.getSession().invalidate();
        String loginOutPage = Toolkit.getConfigValue("bd.sys.platform.config.systemConfig.base.login.loginoutpage",
                "index.jsp");
        String isUseSso = Toolkit.getConfigValue("bd.sys.platform.config.systemConfig.sso.isused", "false");
        if (Boolean.valueOf(isUseSso)) {
             try {
               Properties prop = CasUtils.getProperties("/conf/cassso/cas-config.properties");
                String casServerLoginUrl = prop.getProperty("cas.casServerLoginUrl", null);
                String serverName = prop.getProperty("cas.serverName", null);
                String currentUserIP = CasUtils.getIpAddr(this.getRequest());
                String otherUserIP = prop.getProperty("cas.otherUserIP", null);
                if (StringUtils.hasText(otherUserIP) && StringUtils.hasText(currentUserIP)) {
                    List<String> otherUserIPList = Arrays.asList(otherUserIP.split(","));
                    for (String ip : otherUserIPList) {
                        if (currentUserIP.startsWith(ip)) {
                            casServerLoginUrl = prop.getProperty("cas.otherCasServerLoginUrl", null);
                            serverName = prop.getProperty("cas.otherServerName", null);
                            break;
                        }
                    }
                }
                loginOutPage = casServerLoginUrl + "/logout?service=" + 
                    serverName + this.getRequest().getContextPath()
                        + "/index";

            } catch (IOException e) {
                LoggerUtil.error(LoginController.class, "加载cas-config.properties文件异常");
            }
        }

        // 如果是多租户平台源地址则转到多租户登录页
        if (tenantService != null && tenantService.getTenantType() == BaseConstants.TENANT_TYPE_PHYSICS) {
            String multiTenancyOriginalUrl = tenantService.getMultiTenancyOriginalUrl();
            if (StringUtils.isNotEmpty(multiTenancyOriginalUrl)) {
                loginOutPage = multiTenancyOriginalUrl;
            }
        }
        String isSimpleLogin = Toolkit.getConfigValue("bd.sys.platform.config.systemConfig.base.login.isSimpleLogin",
                "false");
        if (Boolean.parseBoolean(isSimpleLogin)) {
            loginOutPage = LoginInterceptor.SIMPLE_LOGIN_PAGE;
        }
        return "redirect:" + loginOutPage;
    }

    /**
     * 生成验证码
     * @return
     * @throws Exception
     * @author 蔡楚涛
     * @date 2016-3-30
     */
    @RequestMapping("/code")
    @ResponseBody
    public void code() throws LoginException {
        try {
            String validateCodeClass = Toolkit.getConfigValue(
                    "bd.sys.platform.config.systemConfig.savecheck.login.validateCodeClass",
                    "com.szboanda.platform.login.service.impl.NumberValidateCodeService");

            IValidateCodeService validateCodeService = (IValidateCodeService) Toolkit
                    .getSpringBean(Class.forName(validateCodeClass));
            if (validateCodeService == null) {
                BeanDefinitionBuilder bdb = BeanDefinitionBuilder.rootBeanDefinition(validateCodeClass);
                validateCodeService = (IValidateCodeService) Toolkit.registSpringBean("validateCodeServiceImpl", bdb,
                        true);
            }

            validateCodeService.createValidateCode(this.getRequest(), this.getResponse());
        } catch (LoginException e) {
            LoggerUtil.error(LoginController.class, "生成验证码异常", e);
            throw new LoginException("生成验证码异常", e);
        } catch (ClassNotFoundException e) {
        	LoggerUtil.error(LoginController.class, "生成验证码异常", e);
		}
    }

    /**
     * 验证用户
     * @param validateCode
     * @param YHID
     * @param YHMM
     * @author 蔡楚涛
     * @date 2016-3-31
     */
    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public @ResponseBody Map<String, Object> login(@RequestBody Map<String, Object> userMap) throws LoginException {
        String sessionVCode = (String) this.getSession().getAttribute(CommonConstants.VALIDATE_CODE);
        userMap.put("sessionVCode", sessionVCode);
        HttpServletRequest request = this.getRequest();

        // 处于安全问题，登录之前改变会话标识
        Object token = request.getSession().getAttribute(CommonConstants.SESSION_TOKEN);
        request.getSession().invalidate();
        request.getSession().setAttribute(CommonConstants.SESSION_TOKEN, token);
        // 记录用户客户端信息
        userMap.put("sessionId", request.getSession().getId());
        userMap.put("user-agent", request.getHeader("user-agent"));
        userMap.put("user-ip", request.getRemoteAddr());

        Map<String, Object> resultMap = loginService.getLoginInfo(userMap);

        Map<String, Object> user = (Map<String, Object>) resultMap.get("userMap");

        if (user != null) {
            user.put("YHPD", userMap.get("YHMM"));
            // 记录登录时间
            user.put("ZHDLSJ", new Date());
            //判断部门编号是否正确
            if(StringUtils.isEmpty(MapUtils.getString(user,"BMBH"))){
                resultMap.put("errormsg", "用户未设置所属部门,部分功能会受影响，请联系管理员设置");
            }else{
                Map<String, Object> dept = deptService.getDeptByXh(MapUtils.getString(user, "BMBH"));
                if(CollectionUtils.isEmpty(dept) || "0".equals(MapUtils.getString(dept,"SFYX"))){
                    resultMap.put("errormsg", "用户所属部门不存在或失效,部分功能会受影响，请联系管理员设置");
                }
            }
            this.getSession().setAttribute(CommonConstants.SESSION_USER, new UserUtil().map2UserVO(user));
            this.getSession().setAttribute(CommonConstants.SESSION_USER_ID, user.get("YHID"));
            this.getSession().setAttribute(CommonConstants.SESSION_USER_NAME, user.get("YHMC"));
            this.getSession().setAttribute(CommonConstants.SESSION_USER_DEPT_ID, user.get("BMBH"));
            this.getSession().setAttribute(CommonConstants.SESSION_USER_DEPT_NAME, user.get("BMMC"));
            resultMap.remove("userMap");
        }
        return resultMap;
    }
    
    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/loginCas", method = RequestMethod.POST)
    public @ResponseBody Map<String, Object> loginCas(@RequestBody Map<String, Object> userMap) throws LoginException {
        String sessionVCode = (String) this.getSession().getAttribute(CommonConstants.VALIDATE_CODE);
        userMap.put("sessionVCode", sessionVCode);
        HttpServletRequest request = this.getRequest();

        // 处于安全问题，登录之前改变会话标识
        Object token = request.getSession().getAttribute(CommonConstants.SESSION_TOKEN);
        request.getSession().setAttribute(CommonConstants.SESSION_TOKEN, token);
        // 记录用户客户端信息
        userMap.put("sessionId", request.getSession().getId());
        userMap.put("user-agent", request.getHeader("user-agent"));
        userMap.put("user-ip", request.getRemoteAddr());

        Map<String, Object> resultMap = loginService.getLoginInfo(userMap);

        Map<String, Object> user = (Map<String, Object>) resultMap.get("userMap");

        if (user != null) {
            user.put("YHPD", userMap.get("YHMM"));
            // 记录登录时间
            user.put("ZHDLSJ", new Date());
            //判断部门编号是否正确
            if(StringUtils.isEmpty(MapUtils.getString(user,"BMBH"))){
                resultMap.put("errormsg", "用户未设置所属部门,部分功能会受影响，请联系管理员设置");
            }else{
                Map<String, Object> dept = deptService.getDeptByXh(MapUtils.getString(user, "BMBH"));
                if(CollectionUtils.isEmpty(dept) || "0".equals(MapUtils.getString(dept,"SFYX"))){
                    resultMap.put("errormsg", "用户所属部门不存在或失效,部分功能会受影响，请联系管理员设置");
                }
            }
            this.getSession().setAttribute(CommonConstants.SESSION_USER, new UserUtil().map2UserVO(user));
            this.getSession().setAttribute(CommonConstants.SESSION_USER_ID, user.get("YHID"));
            this.getSession().setAttribute(CommonConstants.SESSION_USER_NAME, user.get("YHMC"));
            this.getSession().setAttribute(CommonConstants.SESSION_USER_DEPT_ID, user.get("BMBH"));
            this.getSession().setAttribute(CommonConstants.SESSION_USER_DEPT_NAME, user.get("BMMC"));
            resultMap.remove("userMap");
        }
        return resultMap;
    }

    /**
     * 单点登录
     *
     * @param userMap
     * @return
     * @throws LoginException
     */
    @RequestMapping(value = "/sso/ssologin", method = RequestMethod.POST)
    public @ResponseBody Map<String, Object> ssoLogin(@RequestBody Map<String, Object> userMap) throws LoginException {
        this.getResponse().addHeader("Access-Control-Allow-Origin", "*");
        return this.login(userMap);
    }
    
    
    /**
     * 跳转到大屏
     * @return
     * @throws LoginException
     */
    @RequestMapping(value = "/smart/main", method = RequestMethod.GET)
    public  String gotoSmartIndex() throws LoginException {
        return "/smart/menu/main";
    }
}
