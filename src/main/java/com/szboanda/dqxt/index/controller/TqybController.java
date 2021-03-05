package com.szboanda.dqxt.index.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.szboanda.business.BaseBusinessController;
import com.szboanda.dqxt.index.service.ITqybService;

/**
* @Title: 天气预报接口
* @since   JDK1.8
* @history 2020年10月28日
*/
@RestController
@RequestMapping("/tqybcontroller")
public class TqybController extends BaseBusinessController {

    @Autowired
    private ITqybService tqybService;

    /**
     * 获取天气预报数据
     * @return
     */
    @RequestMapping(value = "/gettqybdata", method = RequestMethod.GET)
    public Map<String, Object> gettqybdata() {
    	Map<String, Object> data = super.getSuccessMap();
    	data.put("data", tqybService.getTqybData());
        return data;
    }
    
    /**
     * asyntest
     * @return
     */
    @RequestMapping(value = "/asyntest", method = RequestMethod.GET)
    public Map<String, Object> testAsyn() {
    	Map<String, Object> data = super.getSuccessMap();
    	tqybService.asynTqybData();
//    	data.put("data", tqybService.getTqybData());
        return data;
    }
    
}