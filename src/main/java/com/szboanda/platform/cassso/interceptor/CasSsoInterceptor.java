/******************************************************************************
 * Copyright (C) 2017 ShenZhen Powerdata Information Technology Co.,Ltd All Rights Reserved.
 * 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、 复制、修改或发布本软件.
 *****************************************************************************/

package com.szboanda.platform.cassso.interceptor;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jasig.cas.client.constants.CasConstants;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.szboanda.platform.common.constants.CommonConstants;
import com.szboanda.platform.common.utils.StringUtils;
import com.szboanda.platform.common.utils.Toolkit;
import com.szboanda.platform.login.controller.LoginController;

import sun.misc.BASE64Encoder;

/**
 * @Title: CAS 单点登录拦截器
 * @author 蔡楚涛
 * @since JDK1.6
 * @history 2017年9月12日 蔡楚涛 新建
 */
@Component("CasSsoInterceptor")
public class CasSsoInterceptor implements HandlerInterceptor {

    /**
     * 请求处理之前拦截
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        String dlzh = request.getRemoteUser();
        if (StringUtils.hasText(dlzh)) {
            if (request.getSession().getAttribute(CommonConstants.SESSION_USER) == null) {
                String userAccount = (String) request.getSession().getAttribute(CasConstants.SESSION_USER_ACCOUNT);
                userAccount = StringUtils.hasText(userAccount) ?  userAccount : dlzh;
                
                String isSimpleLogin = Toolkit.getConfigValue("bd.sys.platform.config.systemConfig.base.login.isSimpleLogin", "false");// 是否启用简单登录
                if (!Boolean.parseBoolean(isSimpleLogin)) {
                    // Base64位加密
                    userAccount = new BASE64Encoder().encode(userAccount.getBytes("UTF-8"));
                }
                
                Map<String, Object> param = new HashMap<String, Object>();
                param.put("XTZH", userAccount);
                // 设置单点登录验证实现
                param.put("class", "com.szboanda.platform.cassso.service.impl.CasSsoValidateServiceImpl");
                // 获取登录Controller
                LoginController loginController = Toolkit.getBean(LoginController.class);
                // 调用登录方法
                loginController.loginCas(param);
            }
            return true;
        }
        return false;
    }

    /**
     * 请求处理之后拦截
     */
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    /**
     * 整个请求结束之后拦截
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }

}
