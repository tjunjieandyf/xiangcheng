package com.szboanda.smart.geo.dao;

import java.util.List;
import java.util.Map;

import com.szboanda.platform.common.annotation.AutoLoadDAO;
import com.szboanda.platform.common.base.BaseDAO;

/**
 * @author LENOVO
 *
 */
@AutoLoadDAO
public interface CommonDAO extends BaseDAO {
 
    /**
     * 获取一段时间内工业源污染源的报警信息
     * @Title: getBjxxList
     * @param param
     * @return List<Map<String,Object>>   
     * @author 朱传露
     */
    List<Map<String, Object>> getBjxxList(Map<String, Object> param);
}