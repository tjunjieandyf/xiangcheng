/******************************************************************************
* Copyright (C) 2020 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.dqxt.rwzx.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.szboanda.platform.common.annotation.AutoLoadDAO;
import com.szboanda.platform.common.base.BaseDAO;

@AutoLoadDAO
public interface TaskCenterDataDAO extends BaseDAO {

	/**
	 * 国控站和乡镇站小时数据
	 * @param param
	 * @return
	 */
	Map<String, Object> queryAirStationHourData(@Param("XH")String XH);
	
	/**
	 * 地表水小时数据
	 * @param XH
	 * @return
	 */
	List<Map<String, Object>> queryDBSStationHourData(@Param("XH")String XH);
	
	/**
	 * @param XH
	 * @return
	 */
	List<Map<String, Object>> queryXScbFsZdxx(@Param("XH")String XH);
}
