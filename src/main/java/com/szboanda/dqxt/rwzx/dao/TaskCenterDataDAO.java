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

/**
 * 查询业务数据DAO:从一期数据库获取业务数据
 * 
 * @copyright: PowerData Software Co.,Ltd. Rights Reserved.
 * @company: 深圳市博安达信息技术股份有限公司
 * @author 朱传露
 * @date 2020年10月23日
 * @version: V1.0
 */
@AutoLoadDAO
public interface TaskCenterDataDAO extends BaseDAO {

	/**
	 * 查询空气站小时数据
	 * 
	 * @Title: queryAirStationHourData
	 * @Description: TODO
	 * @param @param
	 *            param
	 * @param @return
	 * @return List<Map<String,Object>>
	 * @throws @author
	 *             朱传露
	 */
	List<Map<String, Object>> queryAirStationMinuteData(Map<String, Object> param);
	
	/**
	 * 查询乡镇站分钟数据
	 * @param param
	 * @return
	 */
	List<Map<String, Object>> queryAirStationXZMinuteData(Map<String, Object> param);

	/**
	 * 查询空气站小时数据
	 * 
	 * @Title: queryAirStationHourData
	 * @Description: TODO
	 * @param @param
	 *            param
	 * @param @return
	 * @return List<Map<String,Object>>
	 * @throws @author
	 *             朱传露
	 */
	List<Map<String, Object>> queryAirStationHourData(Map<String, Object> param);
	
	/**
	 * 查询自动水站小时数据
	 * @param param
	 * @return
	 */
	List<Map<String, Object>> queryWaterStationHourData(Map<String, Object> param);
	
	/**
	 * 重点水域
	 * @param param
	 * @return
	 */
	List<Map<String, Object>> queryKeyPointWaterStationHourData(Map<String, Object> param);
	
	/**
	 * 查询污染源在线废气数据
	 * @param param
	 * @return
	 */
	List<Map<String, Object>> queryFQStationHourData(Map<String, Object> param);
	
	/**
	 * 查询污染源在线废水数据
	 * @param param
	 * @return
	 */
	List<Map<String, Object>> queryFSStationHourData(Map<String, Object> param);
	
	/**
	 * 查询秸秆焚烧数据
	 * @param param
	 * @return
	 */
	Map<String, Object> queryJGData(Map<String, Object> param);
	
	/**
	 * 更新秸秆任务标记
	 * @param param
	 * @return
	 */
	int updateMark(Map<String, Object> param);
	
	/**
	 * pc端五水共治-入河排污口点位列表动态表单删除功能
	 * @param xh
	 * @return
	 */
	int delete(@Param("XH")String xh);
	
	/**
	 * pc端五水共治-入河排污口-子排口点位列表动态表单删除功能
	 * @param pwkxh
	 * @return
	 */
	int deleteSubRecord(@Param("PWKXH")String pwkxh);
	/**
	 * 查询五水共治-入河排污口-子排口点位列表中的记录
	 * @param pwkxh
	 * @return
	 */
	int querySubRecord(@Param("PWKXH")String pwkxh);
}
