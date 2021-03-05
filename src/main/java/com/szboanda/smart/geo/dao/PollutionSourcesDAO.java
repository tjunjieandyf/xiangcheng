package com.szboanda.smart.geo.dao;

import com.szboanda.platform.common.annotation.AutoLoadDAO;
import com.szboanda.platform.common.base.BaseDAO;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 污染源DAO
 */
@AutoLoadDAO
public interface PollutionSourcesDAO extends BaseDAO {

    /**
     * 数据源
     */
    final String dataSource ="jdbc/sjzx";
    
    /**
     * 根据指定的时间和污染源企业编号查找污染源信息
     * @param time
     * @param ids
     * @return
     */
    public List<Map<String,Object>> findByIDsInTime(@Param("time") String time, @Param("ids") List<Object> ids);

    /**
     * @param queryParams
     * @return
     */
    List<Map<String,Object>> getEnterpriseBaseInfo(Map<String,Object> queryParams);

    /**
     * @return
     */
    Date getEnterpriseBaseInfoMaxTime();
    
    
    /**
     * 获取企业的所有排口
     * @Title: getEnterpriseLayoutInfo
     * @param @return   
     * @return Map<String,List<Map<String,Object>>>   
     * @throws
     * @author 朱传露
     */
    List<Map<String,Object>> getEnterpriseLayoutInfo(Map<String,Object> queryParams);
}
