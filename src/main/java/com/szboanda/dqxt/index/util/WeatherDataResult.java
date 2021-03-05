package com.szboanda.dqxt.index.util;

import java.util.HashMap;
import java.util.Map;

/**
 * @version v1.0
 * @author: 彭志群
 * @date: 2020/10/28
 * @copyright: PowerData Software Co.,Ltd. Rights Reserved.
 * @company: 深圳博沃智慧科技有限公司
 */
public class WeatherDataResult {

    /**
     * data
     */
    private Map<String, Object> data = new HashMap<String, Object>();
    /**
     * msg success
     */
    private String msg;
    /**
     * code 0
     */
    private String code;
    
    /**
     * @return
     */
    public Map<String, Object> getData() {
        return data;
    }

    /**
     * @param data
     */
    public void setData(Map<String, Object> data) {
        this.data = data;
    }

	/**
	 * @return
	 */
	public String getMsg() {
		return msg;
	}

	/**
	 * @param msg
	 */
	public void setMsg(String msg) {
		this.msg = msg;
	}

	/**
	 * @return
	 */
	public String getCode() {
		return code;
	}

	/**
	 * @param code
	 */
	public void setCode(String code) {
		this.code = code;
	}   
}
