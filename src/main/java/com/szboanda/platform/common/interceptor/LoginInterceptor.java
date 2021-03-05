package com.szboanda.platform.common.interceptor;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.szboanda.platform.common.constants.BaseConstants;
import com.szboanda.platform.common.constants.CommonConstants;
import com.szboanda.platform.common.utils.StringUtils;
import com.szboanda.platform.common.utils.Toolkit;
import com.szboanda.platform.tenant.service.ITenantService;

/**
 * 登录拦截器
 * @author Administrator
 *
 */
@Component("LoginInterceptor")
public class LoginInterceptor implements HandlerInterceptor {
    /**
     * 简单登陆页面
     */
    public static final String SIMPLE_LOGIN_PAGE = "/simplelogin.jsp";
    /**
     * 检查是否简单单点登录
     */
    @Resource(name = "SsoInterceptor")
    private HandlerInterceptor ssoInterceptor = null;
    /**
     * 租户服务实现
     */
    @Autowired(required = false)
    private ITenantService tenantService;
    
    /**
     * preHandle
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
    	
        if (request.getSession().getAttribute(CommonConstants.SESSION_USER) == null) {
            String loginPageConfig = Toolkit.getConfigValue("bd.sys.platform.config.systemConfig.base.login.loginpage",
                    "/index.jsp");
            // 登录页面
            String page = request.getContextPath() + loginPageConfig;
            // 如果访问的是登录页面，不需要拦截，直接通过，防止死循环
            if (page.equals(request.getRequestURI())) {
                return true;
            }
            // 记录用户登录前想访问的url，不记录登录URL和退出URL

            /* 没有解决session超时而退出的问题，暂不开启该功能 */
            //String xtzh = request.getParameter("user_code");

            if (!request.getRequestURI().contains(page) && !request.getRequestURI().contains("/loginout")
                    && null == request.getHeader("Referer") // 标识是用户从浏览器直接输入地址的
            ) {
                request.getSession().setAttribute(CommonConstants.SESSION_LOGIN_BEFORE_URI,
                        request.getRequestURL().toString());
            }

            // 如果登录验证失败检查是否sso请求,如果是创建会话信息
            if (ssoInterceptor.preHandle(request, response, handler)) {
                return true;
            }
            // 如果是多租户平台源地址则转到多租户登录页
            if (tenantService != null && tenantService.getTenantType() == BaseConstants.TENANT_TYPE_PHYSICS) {
                String multiTenancyOriginalUrl = tenantService.getMultiTenancyOriginalUrl();
                if (StringUtils.isNotEmpty(multiTenancyOriginalUrl)) {
                	StringBuffer sb = new StringBuffer();
                	sb.append(multiTenancyOriginalUrl);
                	sb.append(loginPageConfig);
                    page = sb.toString();
                }
            }
            String isSimpleLogin = Toolkit
                    .getConfigValue("bd.sys.platform.config.systemConfig.base.login.isSimpleLogin",
                            "false");
            if (Boolean.parseBoolean(isSimpleLogin)) {
                page = request.getContextPath() + LoginInterceptor.SIMPLE_LOGIN_PAGE;
            }
            response.sendRedirect(page);

            return false;
        }
        return true;
    }

    /**
     * postHandle
     */
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
                           ModelAndView modelAndView) throws Exception {

    }

    /**
     * afterCompletion
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
            throws Exception {

    }

}
