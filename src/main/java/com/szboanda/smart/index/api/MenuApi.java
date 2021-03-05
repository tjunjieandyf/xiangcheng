/******************************************************************************
 * Copyright (C) ShenZhen Powerdata Information Technology Co.,Ltd All Rights Reserved.
 * 本软件为深圳市博安达信息技术股份有限公司开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、 复制、修改或发布本软件.
 *****************************************************************************/
package com.szboanda.smart.index.api;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.szboanda.business.BaseBusinessController;
import com.szboanda.dynamicform.viewresolver.model.AjaxJson;
import com.szboanda.platform.common.utils.LoggerUtil;
import com.szboanda.platform.common.utils.StringUtils;
import com.szboanda.platform.common.utils.Toolkit;
import com.szboanda.platform.login.exception.LoginException;
import com.szboanda.platform.rms.user.mode.UserVO;
import com.szboanda.platform.rms.user.service.IUserService;
import com.szboanda.platform.rms.user.utils.UserUtil;

import cn.hutool.core.map.MapUtil;

/**
 * @title: 菜单服务接口
 * @description: 菜单服务接口
 * @copyright: PowerData Software Co.,Ltd. Rights Reserved.
 * @company: 深圳市博安达信息技术股份有限公司
 * @author： 谢维龙 @date： 2019/10/24 10:55
 * @version： V1.0
 */
@Controller
@RequestMapping("/smart/index/api/menu")
public class MenuApi extends BaseBusinessController {

    /**
     * JCSJ_KEY
     */
    public static final String JCSJ_KEY = "bd.sys.menu.JCSJ";

    /**
     * ROOT_KEY
     */
    public static final String ROOT_KEY = "bd.sys.menu.";

    /**
     * JCSJPT_KEY
     */
    public static final String JCSJPT_KEY = "bd.sys.menu.JCSJ";
    /**
     * 用户service
     */
    @Autowired
    private IUserService userService;

    /**
     * @return
     * @throws LoginException
     */
    @RequestMapping("/home")
    public String home() throws LoginException {
        return "redirect:/smart/menu/home";
    }


    /**
     * 查询用户菜单
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value="/findusermenu",method= RequestMethod.GET, produces = "application/json; charset=utf-8")
    @ResponseBody
    public AjaxJson findUserMenu(@RequestParam Map<String ,Object> model) {
        String key = MapUtil.getStr(model,"key");
        if(StringUtils.isNotEmpty(key)){
        	StringBuffer sb = new StringBuffer();
        	sb.append(ROOT_KEY);
        	sb.append(key);
            return queryCdByKey(sb.toString());
        }else {
            return queryCdByKey(JCSJPT_KEY);
        }
    }


    /**
     * 查询用户菜单
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value="/findMhMenu",method= RequestMethod.GET, produces = "application/json; charset=utf-8")
    @ResponseBody
    public AjaxJson findMhMenu(HttpServletRequest request) {
        String key = request.getParameter("key");
        if(StringUtils.isNotEmpty(key)){
            return queryCdByKey(key);
        }else {
            return queryCdByKey(JCSJPT_KEY);
        }

    }

    /**
     * 根据key值获取菜单
     * @param key
     * @return
     */
    private AjaxJson queryCdByKey(String key){
        AjaxJson j = new AjaxJson();
        try {
            // 获取当前用户信息
            UserVO user = this.getCurrUser();
            String yhid="SYSTEM";;
            if(user!=null){
                yhid=user.getYhid();
            }
            List<Map<String, Object>> userMenuMapDatas = userService.findUserMenu(yhid);
            String yqMenuId = "";
            for (Map<String, Object> menu : userMenuMapDatas) {
                //System.out.println(menu.get("CDKEY"));
                if (key.equals(menu.get("CDKEY"))) {
                    yqMenuId = (String) menu.get("id");
                    break;
                }
            }
            List<Map<String, Object>> userMenuMap = new ArrayList<>();
            //
            for (Map<String, Object> menu : userMenuMapDatas) {
                // 获取一级菜单
                String oneLevelMenuPid = (String) menu.get("pId");
                if (yqMenuId.equals(oneLevelMenuPid)) {
                    userMenuMap.add(menu);
                    List<Map<String, Object>> children = new ArrayList<>();
                    // 获取二级菜单
                    String oneLevelMenuXH = (String) menu.get("XH");
                    for (Map<String, Object> menu2 : userMenuMapDatas) {
                        String twoLevelMenuPid = (String) menu2.get("pId");
                        if (oneLevelMenuXH.equals(twoLevelMenuPid)) {
                            // 获取三级菜单
                            List<Map<String, Object>> children2 = new ArrayList<>();
                            String twoLevelMenuXH = (String) menu2.get("XH");
                            for (Map<String, Object> menu3: userMenuMapDatas) {
                                String treeLevelMenuPid = (String) menu3.get("pId");
                                if (twoLevelMenuXH.equals(treeLevelMenuPid)) {
                                    children2.add(menu3);
                                }
                            }
                            menu2.put("children",children2);
                            children.add(menu2);
                        }
                    }
                    menu.put("children", children);
                }
            }
            j.setResult(userMenuMap);
        }catch (RuntimeException e) {
            LoggerUtil.error(this.getClass(),e.getMessage(),e);
            j.setCode(-1);
            LoggerUtil.error(this.getClass(), "查询菜单失败", e);
        }
        return j;
    }


    /**
     * 获取当前用户
     * @param request
     * @return
     */
    @RequestMapping(value="/getCurrUser",method= RequestMethod.GET, produces = "application/json; charset=utf-8")
    @ResponseBody
    public AjaxJson getCurrUser(HttpServletRequest request){
        AjaxJson j = new AjaxJson();
        UserVO user = this.getCurrUser();
        j.setResult(user);
        return j;
    }


    /**
     * 首页
     *
     * @return
     */
    @RequestMapping("/home1")
    public String home1() {
        //设置模拟登录环境开始
        Map<String, Object> user =userService.findUserById("SYSTEM");
        this.getSession().setAttribute("SESSION_USER",(new UserUtil()).map2UserVO(user));
        this.getSession().setAttribute("SESSION_USER_ID", user.get("YHID"));
        this.getSession().setAttribute("SESSION_USER_NAME", user.get("YHMC"));
        this.getSession().setAttribute("SESSION_USER_DEPT_ID", user.get("BMBH"));
        this.getSession().setAttribute("SESSION_USER_DEPT_NAME", user.get("BMMC"));
        //设置模拟登录环境结束

        //UserVO user1=this.getCurrUser();
        String indexUrl= Toolkit.getConfigValue("bd.sys.config.shjdsj.login.indexUrl","http://localhost:8081/hfshj/findusermenu");
        //String tokenTimeOut=Toolkit.getConfigValue(
//            "bd.sys.config.shjdsj.login.tokenTimeOut","1000000000");
        //double timeOut= CalculateUtil.eval(tokenTimeOut);
        //String token=JwtUtil.createJWT((long) timeOut,user1);
        //return  "redirect:"+indexUrl+"?jwt-token="+ token;
        return  "redirect:"+indexUrl+"?jwt-token=";
    }

}
