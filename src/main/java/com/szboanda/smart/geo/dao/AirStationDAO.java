package com.szboanda.smart.geo.dao;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.szboanda.platform.common.annotation.AutoLoadDAO;
import com.szboanda.platform.common.base.BaseDAO;

/**
 * @author LENOVO
 *
 */
@AutoLoadDAO
public interface AirStationDAO extends BaseDAO {

    /**
     * 数据源
     */
    final String dataSource = "jdbc/sjzx";

    /**
     * @param params
     * @return
     */
    List<Map<String,Object>> list(Map<String,Object> params);

    /**
     * @return
     */
    Date getPointHourMaxDate();


    /**
     * 获取风速风向
     * @param params
     * @return
     */
    Map<String,Object> getWindBySSQX(Map<String,Object> params);
}
