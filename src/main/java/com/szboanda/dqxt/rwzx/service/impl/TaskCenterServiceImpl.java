/******************************************************************************
* Copyright (C) 2020 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.dqxt.rwzx.service.impl;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageInfo;
import com.szboanda.business.BaseBusinessService;
import com.szboanda.dqxt.rwzx.dao.TaskCenterDAO;
import com.szboanda.dqxt.rwzx.dao.TaskCenterDataDAO;
import com.szboanda.dqxt.rwzx.exception.TaskCenterException;
import com.szboanda.dqxt.rwzx.service.ITaskCenterService;
import com.szboanda.platform.common.component.datahelper.DataHelper;
import com.szboanda.platform.common.utils.CollectionUtils;
import com.szboanda.platform.common.utils.DateFormatUtils;
import com.szboanda.platform.common.utils.LoggerUtil;
import com.szboanda.platform.common.utils.MapUtils;
import com.szboanda.platform.common.utils.StringUtils;
import com.szboanda.platform.common.utils.Toolkit;
import com.szboanda.platform.rms.user.mode.UserVO;
import com.szboanda.platform.system.commoncode.cache.CommonCodeCache;
import com.szboanda.platform.v3.util.DateUtils;
import com.szboanda.platform.wordreport.common.utils.SQLUtils;

import cn.hutool.core.date.DateField;
import cn.hutool.core.date.DateTime;
import cn.hutool.core.date.DateUtil;

/**
* @Title: 任务中心服务接口实现类
* @author  唐俊杰
* @since   JDK1.8
* @history 2020年10月22日 唐俊杰 新建
*/
@Service
public class TaskCenterServiceImpl extends BaseBusinessService implements ITaskCenterService {
    @Autowired
    private TaskCenterDAO dao;

    @Autowired
    private TaskCenterDataDAO dataDao;

    @Override
    public Map<String, Object> queryTasks(int pageNum, int pageSize, Map<String, Object> param) throws TaskCenterException {
        try {
            param = modelHandel(param);
            DataHelper.startPage(pageNum, pageSize);
            // 根据查询条件查询任务列表
            List<Map<String, Object>> list = null;
            Map<String, Object> result = new HashMap<String, Object>();
            // 排序处理
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> orders = (List<Map<String, Object>>) param.get("order");
            StringBuffer orderByStr = new StringBuffer();
            if (CollectionUtils.isNotEmpty(orders)) {
                for (Map<String, Object> order : orders) {
                    String field = MapUtils.getString(order, "field");
                    String direction = MapUtils.getString(order, "direction");
                    orderByStr.append(field).append(" ").append(direction);
                }
            }
            DataHelper.startPage(pageNum, pageSize, orderByStr.toString());
            // starttime,endtime字符串转时间
            if (StringUtils.isNotEmpty(MapUtils.getString(param, "search"))) {
                SQLUtils.fillLike(param, "search", true, true);
            }

            list = dao.queryTasks(param);
            if (CollectionUtils.isNotEmpty(list)) {
                // 同样的条件查询出超时任务列表
                List<Map<String, Object>> overtimeList = dao.queryOvertimeTasks(param);
                // 0-绿色，1-黄色，2-红色
                for (Map<String, Object> map : list) {
                    map.put("MARKTYPE", 0);
                }

                // 合并列表,超时任务列表如果不为空，任务列表肯定不为空
                if (CollectionUtils.isNotEmpty(overtimeList)) {
                    for (Map<String, Object> map : list) {
                        for (Map<String, Object> overtimeMap : overtimeList) {
                            if (MapUtils.getString(overtimeMap, "XH").equals(MapUtils.getString(map, "XH"))) {
                                overtimeMap.remove("XH");
                                parseDate(overtimeMap, "yyyy年MM月dd HH:mm:ss", new String[] { "YQBJSJ" });
                                map.put("OVERTIME", overtimeMap);
                                map.put("MARKTYPE", 2);
                            } else {
                                Date kssj = MapUtils.getUtilDate(map, "SJKSSJ");
                                Date jssj = MapUtils.getUtilDate(map, "YQBJSJ");
                                int jg = DateUtils.getDateDiff(kssj, new Date(), Calendar.HOUR);
                                int total = DateUtils.getDateDiff(kssj, jssj, Calendar.HOUR);
                                double resultRate = (double) jg / total;
                                if (resultRate > 0.5 && resultRate <= 1.0) {
                                    map.put("MARKTYPE", 1);
                                }
                            }
                        }
                    }
                }

                if (CollectionUtils.isNotEmpty(list)) {
                    String[] fields = { "SJKSSJ", "YQBJSJ" };
                    for (Map<String, Object> temp : list) {
                        temp = parseDate(temp, "yyyy年MM月dd HH:mm:ss", fields);
                    }
                }
                result.put("data", new PageInfo<>(list));
            } else {
                result.put("data", null);
            }

            result.put("errcode", "ok");
            return result;
        } catch (Exception e) {
            LoggerUtil.error(this.getClass(), "任务中心获取预警任务列表异常", e);
            throw new TaskCenterException("任务中心获取预警任务列表异常", e);
        }
    }

    @Override
    public Map<String, Object> getTaskById(String xh) throws TaskCenterException {
        try {
            // 获取当前用户信息
            UserVO user = this.getCurrUser();
            Map<String, Object> result = new HashMap<>();
            Map<String, Object> dataMap = dao.getTaskById(xh);
            String ywlx = MapUtils.getString(dataMap, "YWLX");
            CommonCodeCache cache = Toolkit.getBean("CommonCodeCache", CommonCodeCache.class);
            List<Map<String, Object>> commoncodeList = cache.getCommonCodeByTypeId("YJRWLX");
            for (Map<String, Object> map : commoncodeList) {
                String dm = MapUtils.getString(map, "DM");
                String dmmc = MapUtils.getString(map, "DMMC");
                if (ywlx.equals(dm)) {
                    dataMap.put("YWLXMC", dmmc);
                    break;
                }
            }
            Map<String, Object> commonMap = getCommonCode(MapUtils.getString(dataMap, "YWLX"), MapUtils.getString(dataMap, "YWZLX"));
            if (CollectionUtils.isNotEmpty(commonMap)) {
                String dmmc = MapUtils.getString(commonMap, "DMMC");
                dataMap.put("GZ", dmmc);
            }
            final String PATRRN = "yyyy年MM月dd日 HH:mm:ss";

            // 查询流转信息
            List<Map<String, Object>> lzxxList = dao.listLzxx(xh);
            // 未办结任务，浏览时先给lzxx表中插入一条记录
            if (CollectionUtils.isNotEmpty(dataMap)) {
                if ("0".equals(MapUtils.getString(dataMap, "BJQK"))) {
                    // 此段代码中有删除list中无用map操作，不要变动顺序
                    Map<String, Object> needMap = needInsertLzxx(lzxxList);
                    String lzxh = "";
                    if (MapUtils.getBoolean(needMap, "NEED")) {
                        lzxh = MapUtils.getString(needMap, "XH");
                        Map<String, Object> lzxxParam = new HashMap<>();
                        lzxxParam.put("XH", lzxh);
                        lzxxParam.put("RWBH", xh);
                        lzxxParam.put("FKSJ", new Date());
                        dao.insertLzxx(lzxxParam);
                        result.put("fkxh", lzxh);
                    } else if (CollectionUtils.isNotEmpty(needMap) && !MapUtils.getBoolean(needMap, "NEED")) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> oldLzMap = (Map<String, Object>) needMap.get("DATA");
                        lzxh = MapUtils.getString(oldLzMap, "XH");
                        result.put("fkxh", lzxh);
                    }
                    if (StringUtils.isNotEmpty(lzxh)) {
                        // 查询附件信息
                        List<Map<String, Object>> fjList = dao.queryFjxx(lzxh);
                        result.put("fjxx", fjList);
                    }
                }
            }
            // 反馈记录插入
            List<Map<String, Object>> lzxxResult = new ArrayList<>();
            if (CollectionUtils.isNotEmpty(lzxxList)) {
                for (Map<String, Object> lzxxMap : lzxxList) {
                    parseDate(lzxxMap, PATRRN, new String[] { "FKSJ" });
                    // 查询附件信息
                    List<Map<String, Object>> attachmentArray = dao.queryFjxx(MapUtils.getString(lzxxMap, "XH"));
                    lzxxMap.put("fjxx", attachmentArray);
                    lzxxResult.add(lzxxMap);
                }
            } else {
                // if("1".equals(MapUtils.getString(dataMap, "SFBJ"))){
                // parseDate(dataMap, PATRRN, new String[] { "FKSJ" });
                // // 对于之前没有流转但是已经完成反馈的信息做兼容
                // Map<String, Object> tempMap = new HashMap<>();
                // List<Map<String, Object>> attachmentArray =
                // warningTaskDao.queryFjxx(xh);
                // tempMap.put("fjxx", attachmentArray);
                // tempMap.put("BLR", MapUtils.getString(dataMap, "BLR"));
                // tempMap.put("FKNR", MapUtils.getString(dataMap, "FKNR"));
                // tempMap.put("FKSJ", MapUtils.getString(dataMap, "FKSJ"));
                // lzxxResult.add(tempMap);
                // }
            }
            result.put("lzList", lzxxResult);

            // 删除无用属性
            dataMap.remove("FKNR");
            dataMap.remove("FKSJ");
            dataMap.remove("SFBJ");

            // 空气质量
            Map<String, Object> kqMap = getShowData(dataMap);
            result.put("list", kqMap);
            // getShowData方法中有涉及时间处理的部分，所以在该方法调用之后调用parseDate方法
            String[] fields = { "SJKSSJ", "YQBJSJ" };
            parseDate(dataMap, PATRRN, fields);
            if ("WRYZXYJ".equals(MapUtils.getString(dataMap, "YWLX"))) {
                if (kqMap.containsKey("FQ")) {
                    // 废气标记
                    result.put("YWTYPE", true);
                } else {
                    // 废水标记
                    result.put("YWTYPE", false);
                }
            }
            result.put("detail", dataMap);

            if (user != null) {
                result.put("currentUser", user.getYhmc());
            } else {
                result.put("currentUser", "");
            }
            return result;
        } catch (Exception e) {
            LoggerUtil.error(this.getClass(), "获取任务详情出错", e);
            throw new TaskCenterException("获取任务详情出错", e);
        }
    }

    @Override
    public List<Map<String, Object>> getAllDepartments() throws TaskCenterException {
        try {
            return dao.getAllDepartments();
        } catch (Exception e) {
            LoggerUtil.error(this.getClass(), "查询所有的部门科室出错！", e);
            throw new TaskCenterException("查询所有的部门科室出错", e);
        }
    }

    @Override
    public List<Map<String, Object>> getYjRwDepartments() throws TaskCenterException {
        try {
            CommonCodeCache cache = Toolkit.getBean("CommonCodeCache", CommonCodeCache.class);
            List<Map<String, Object>> yjRwDepList = cache.getCommonCodeByTypeId("YJRWBM");
            return yjRwDepList;
        } catch (Exception e) {
            LoggerUtil.error(this.getClass(), "查询预警任务部门科室出错！", e);
            throw new TaskCenterException("查询预警任务部门科室出错", e);
        }
    }

    @Override
    public int taskFeedback(Map<String, Object> param) {
        try {
            String fksj = MapUtils.getString(param, "FKSJ");
            if (!StringUtils.isEmpty(fksj)) {
                param.put("FKSJ", DateUtils.parseDate(fksj));
            }
            Map<String, Object> task = dao.getTaskById(MapUtils.getString(param, "XH"));
            Date kssj = MapUtils.getUtilDate(task, "SJKSSJ");
            Date jssj = MapUtils.getUtilDate(task, "YQBJSJ");
            int jg = DateUtils.getDateDiff(kssj, new Date(), Calendar.HOUR);
            int total = DateUtils.getDateDiff(kssj, jssj, Calendar.HOUR);
            double result = (double) jg / total;
            if (result >= 1.0) {
                param.put("MARKTYPE", 2);
            } else if (result > 0.5) {
                param.put("MARKTYPE", 1);
            } else {
                param.put("MARKTYPE", 0);
            }
            return dao.taskFeedback(param);
        } catch (Exception e) {
            LoggerUtil.error(this.getClass(), "查询所有的部门科室出错！", e);
            throw new TaskCenterException("查询所有的部门科室出错", e);
        }
    }

    /**
     * 格式化时间字段
     * @param map 返回业务map
     * @param pattern 日期格式
     * @param fields 指定的为时间类型的字段数组
     * @return
     */
    private Map<String, Object> parseDate(Map<String, Object> map, final String pattern, String[] fields) {
        if (CollectionUtils.isNotEmpty(map) && fields != null && fields.length > 0) {
            for (String field : fields) {
                if (MapUtils.getTimestamp(map, field) != null) {
                    map.put(field, DateFormatUtils.format(MapUtils.getTimestamp(map, field), pattern));
                }
            }
        }
        return map;
    }

    /**
     * 【pc端任务中心】业务日期类型处理
     *
     * @param   model 业务Map集合
     * @return  model 业务Map集合
     * @throws WryException
     */
    private Map<String, Object> modelHandel(Map<String, Object> model) {
        List<String> columns = new ArrayList<String>();
        for (String columnName : columns) {
            try {
                if (model.get(columnName) instanceof Long) {
                    Date date = new Date((Long) model.get(columnName));
                    model.put(columnName, date);
                } else if (!"".equals(MapUtils.getString(model, columnName))) {

                    Date parseDate = DateUtils.parseDate(MapUtils.getString(model, columnName));
                    Date date = new Date(parseDate.getTime());
                    model.put(columnName, date);
                } else {
                    model.put(columnName, null);
                }
            } catch (Exception e) {
                LoggerUtil.error(this.getClass(), "日期类型处理异常！", e);
            }
        }
        return model;
    }

    /**
     * 获取空气质量列表
     * @param param
     * @return
     */
    private Map<String, Object> getShowData(Map<String, Object> dataMap) {
        Map<String, Object> param = new HashMap<>();
        // 业务类型
        String ywlx = MapUtils.getString(dataMap, "YWLX");
        String ywzlx = MapUtils.getString(dataMap, "YWZLX");
        // 数据类型
        String type = MapUtils.getString(dataMap, "TYPE");
//        String endTime = DateUtil.format(MapUtils.getTimestamp(dataMap, "SJKSSJ"), "yyyy-MM-dd HH:mm:ss");
        String rwbh = null;
        Map<String, Object> result = new HashMap<>();
//        // 站点编号
//        DateTime endDate = null;
//        // 小时数据, 最近24小时
//        if ("HOUR".equals(type)) {
//            endDate = DateUtil.offset(DateUtil.parse(endTime), DateField.HOUR, -24);
//        } else {
//            endDate = DateUtil.offset(DateUtil.parse(endTime), DateField.MINUTE, -15);
//        }
//        String startTime = DateUtil.format(endDate, "yyyy-MM-dd HH:mm:ss");
//        param.put("STARTTIME", startTime);
//        param.put("ENDTIME", endTime);
        
        List<Map<String, Object>> dbsList = null;
        // 大气质量
        if ("DQYJ".equals(ywlx)) {
            rwbh = MapUtils.getString(dataMap, "RWBH");
            if ("HOUR".equals(type)) {
                result = dataDao.queryAirStationHourData(rwbh);
                String [] filter = {"TIME"};
                parseDate(result, "yyyy-MM-dd HH:mm:ss", filter);
            } 
        } else if ("DBSYJ".equals(ywlx)) {// 地表水预警
            rwbh = MapUtils.getString(dataMap, "RWBH");
            dbsList = dataDao.queryDBSStationHourData(rwbh);
            if(CollectionUtils.isNotEmpty(dbsList)){
                result = dbsList.get(0);
                String [] filter = {"JCSJ"};
                parseDate(result, "yyyy-MM-dd HH:mm:ss", filter);
            }
        } else if ("WRYZXYJ".equals(ywlx)) {// 污染源在线
            rwbh = MapUtils.getString(dataMap, "RWBH");
            //日数据，小时超标累计三次
            //当天小时数据，超标因子
            if(ywzlx.indexOf("CBBJ")>-1){
                if(ywzlx.indexOf("_FQ")>-1){
                    
                }else{
                    dbsList = dataDao.queryXScbFsZdxx(rwbh);
                    result.put("dataList", dbsList);
                    result.put("cbyzList", strToList(MapUtils.getString(dataMap, "YJGLNR")));
                }
            }else if(ywzlx.indexOf("LXHZ")>-1){
                if(ywzlx.indexOf("_FQ")>-1){
                    
                }else{
                    
                }
            }else{
                if(ywzlx.indexOf("_FQ")>-1){
                    
                }else{
                    
                }
            }
        }
        return result;
    }

    /**
     * 统一构造返回列表方法
     * @param dataList
     * @param filters
     * @return
     */
    private Map<String, Object> initData(List<Map<String, Object>> dataList, String[] filters) {
        Map<String, Object> result = new HashMap<>();
        List<String> timeList = new ArrayList<>();

        if (CollectionUtils.isNotEmpty(dataList)) {
            for (String key : dataList.get(0).keySet()) {
                List<Double> tempList = new ArrayList<>();
                for (Map<String, Object> map : dataList) {
                    if (arrContains(filters, key)) {
                        continue;
                    } else {
                        if ("JCSJ".equals(key)) {
                            timeList.add(DateFormatUtils.format(MapUtils.getTimestamp(map, key), "yyyy-MM-dd HH:mm:ss"));
                        } else {
                            tempList.add(MapUtils.getBigDecimal(map, key, 4).doubleValue());
                        }
                    }
                }

                if ("JCSJ".equals(key)) {
                    result.put("timeList", timeList);
                } else {
                    String listName = key.toLowerCase() + "List";
                    result.put(listName, tempList);
                }
            }
        }

        return result;
    }

    /**
     * 判断数组包含某个字符串
     * @param arr 指定字符串数组
     * @param field 字符串
     * @return
     */
    private boolean arrContains(String[] arr, String field) {
        boolean result = false;
        if (arr != null && arr.length > 0) {
            for (String indexValue : arr) {
                if (field.equalsIgnoreCase(indexValue)) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }

    /**
     * 根据lx，zlx获取公共代码值
     * @param lx 类型
     * @param zlx 子类型
     * @return
     */
    private Map<String, Object> getCommonCode(String lx, String zlx) {
        CommonCodeCache cache = Toolkit.getBean("CommonCodeCache", CommonCodeCache.class);
        List<Map<String, Object>> commoncodeList = cache.getCommonCodeByTypeId(lx);
        Map<String, Object> result = null;
        for (Map<String, Object> map : commoncodeList) {
            if (StringUtils.isNotEmpty(zlx) && zlx.equals(MapUtils.getString(map, "DM"))) {
                result = map;
            }
        }
        return result;
    }

    private Map<String, Object> needInsertLzxx(List<Map<String, Object>> list) {
        Map<String, Object> result = new HashMap<>();
        if (CollectionUtils.isEmpty(list)) {
            result.put("NEED", true);
            result.put("XH", Toolkit.getUUID());
        } else {
            result.put("NEED", true);
            result.put("XH", Toolkit.getUUID());
            for (int i = 0, len = list.size(); i < len; i++) {
                Map<String, Object> map = list.get(i);
                if (StringUtils.isEmpty(MapUtils.getString(map, "FKNR"))) {
                    result.clear();
                    result.put("NEED", false);
                    result.put("DATA", map);
                    list.remove(i);
                }
            }
        }
        return result;
    }
    
    /**
     * 超标因子转list
     * @param str
     * @return
     */
    private List<String> strToList(String str) {
        if(StringUtils.isEmpty(str)){
            return null;
        }
        str = str.substring(1, str.length()-1);
        String [] arr = str.split(";");
        return Arrays.asList(arr);
        
    }
}
