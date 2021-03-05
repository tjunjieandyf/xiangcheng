package com.szboanda.dqxt.index.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.szboanda.dqxt.index.entity.Tqyb;
import com.szboanda.platform.common.annotation.AutoLoadDAO;
import com.szboanda.platform.common.base.BaseDAO;

@AutoLoadDAO
public interface TqybDAO extends BaseDAO{
	    
	/**
	 * 批量插入天气预报数据
	 * @author 彭志群
	 * @return
	 */
	int insertBatchTqybData(@Param("tqybs") List<Tqyb> Tqyb);
	
	/**
     * 获取天气预报数据 
     * @return
     */
    List<Map<String, Object>> getTqybData();
}
