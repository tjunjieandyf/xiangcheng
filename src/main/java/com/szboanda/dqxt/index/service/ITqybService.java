package com.szboanda.dqxt.index.service;

import java.util.List;
import java.util.Map;

public interface ITqybService {
	
	/**
	 * 同步天气预报数据
	 * @return
	 */
	void asynTqybData();
	
	/**
     * 获取天气预报数据 
     * @return
     */
    List<Map<String, Object>> getTqybData();
}
