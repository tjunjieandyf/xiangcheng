/******************************************************************************
* Copyright (C) 2020 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.dqxt.rwzx.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.solr.common.util.Hash;
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
            initDataHepler(pageNum, pageSize, param);
            // 根据查询条件查询任务列表
            List<Map<String, Object>> list = null;
            Map<String, Object> result = new HashMap<String, Object>();
            // starttime,endtime字符串转时间
            if (StringUtils.isNotEmpty(MapUtils.getString(param, "search"))) {
                SQLUtils.fillLike(param, "search", true, true);
            }
            UserVO user = getCurrUser();
//            if(user!=null&&"1".equals(user.getSfyx())){
//                if(dao.queryUsersRole("预警查看角色", user.getXtzh())==0){
//                    param.put("YHID", user.getXtzh());
//                }
//                list = dao.queryTasks(param);
//            }
            list = dao.queryTasks(param);
            if (CollectionUtils.isNotEmpty(list)) {
                //预警任务
                if(MapUtils.getBoolean(param, "TYPE")){
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
                }
                //TODO 加一个YWLXMC字段
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
//            String ywlx = MapUtils.getString(dataMap, "YWLX");
//            CommonCodeCache cache = Toolkit.getBean("CommonCodeCache", CommonCodeCache.class);
//            List<Map<String, Object>> commoncodeList = cache.getCommonCodeByTypeId("YJRWLX");
//            for (Map<String, Object> map : commoncodeList) {
//                String dm = MapUtils.getString(map, "DM");
//                String dmmc = MapUtils.getString(map, "DMMC");
//                if (ywlx.equals(dm)) {
//                    dataMap.put("YWLXMC", dmmc);
//                    break;
//                }
////            }
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
            } 
            result.put("lzList", lzxxResult);

            // 删除无用属性
            dataMap.remove("FKNR");
            dataMap.remove("FKSJ");
            dataMap.remove("SFBJ");

            // 空气质量
            Map<String, Object> kqMap = getShowData(dataMap);
            result.put("dataMap", kqMap);
            // getShowData方法中有涉及时间处理的部分，所以在该方法调用之后调用parseDate方法
            String[] fields = { "SJKSSJ", "YQBJSJ" };
            parseDate(dataMap, PATRRN, fields);
            result.put("detail", dataMap);

            if (user != null) {
                result.put("currentUser", user.getYhmc());
                result.put("currentXtzh", user.getXtzh());
            } else {
                result.put("currentUser", "");
                result.put("currentXtzh", "");
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
    public Map<String, Object> getNoticeById(String xh) {
        return null;
    }
    
    @Override
    public List<Map<String, Object>> getYwlx(boolean flag) {
        CommonCodeCache cache = Toolkit.getBean("CommonCodeCache", CommonCodeCache.class);
        List<Map<String, Object>> list = new ArrayList<>();
        List<Map<String, Object>> typeList = null;
        if(flag){
            typeList = cache.getCommonCodeByTypeId("YJTYPE");
        }else{
            typeList = cache.getCommonCodeByTypeId("NOTICETYPE");
        }
        for (Map<String, Object> map : typeList) {
            String dm = MapUtils.getString(map, "DM");
            String dmmc = MapUtils.getString(map, "DMMC");
            Map<String, Object> temp = new HashMap<String, Object>();
            temp.put("VALUE", dm);
            temp.put("NAME", dmmc);
            list.add(temp);
        }
        return list;
    }
    
    @Override
    public List<Map<String, Object>> getYjRwDepartments() throws TaskCenterException {
        try {
            CommonCodeCache cache = Toolkit.getBean("CommonCodeCache", CommonCodeCache.class);
            List<Map<String, Object>> yjRwDepList = cache.getCommonCodeByTypeId("YJRWBM");
            List<Map<String, Object>> list = new ArrayList<>();
            for(Map<String, Object> dept:yjRwDepList){
                Map<String, Object> tempMap = new HashMap<>();
                tempMap.put("ZZBH", MapUtils.getString(dept, "DM"));
                tempMap.put("ZZJC", MapUtils.getString(dept, "DMMC"));
                list.add(tempMap);
            }
            return list;
        } catch (Exception e) {
            LoggerUtil.error(this.getClass(), "查询预警任务部门科室出错！", e);
            throw new TaskCenterException("查询预警任务部门科室出错", e);
        }
    }

    @Override
    public int taskFeedback(Map<String, Object> param) {
        /*
         * fkzt字段办结状态
         */
        final String FKZT_BJ = "1";
        /*
         * fkzt字段流转状态
         */
        final String FKZT_LZ = "0";
        /*
         * lzzt字段流转中状态
         */
        final String LZZT_LZZ = "1";
        /*
         * lzzt字段流转之后办结状态
         */
        final String LZZT_LZBJ = "2";
        try {
            String fksj = MapUtils.getString(param, "FKSJ");
            if (!StringUtils.isEmpty(fksj)) {
                param.put("FKSJ", DateUtils.parseDate(fksj));
            }
            param.put("BJQK", MapUtils.getString(param, "SFBJ"));
            String xh = MapUtils.getString(param, "XH");
            
            Map<String, Object> fkMap = new HashMap<>();
            fkMap.put("XH",MapUtils.getString(param, "FKXH"));
            fkMap.put("FKNR", MapUtils.getString(param, "FKNR"));
            fkMap.put("FKSJ", DateUtils.parseDate(fksj));
            String blr = MapUtils.getString(param, "FKR");
            Map<String, Object> blrMap = dao.queryUesrInfo(blr);
            fkMap.put("BLR",blr);
            fkMap.put("BLRMC",MapUtils.getString(blrMap, "YHMC"));
            fkMap.put("BLRBMBH",MapUtils.getString(blrMap, "BMBH"));
            fkMap.put("BLRBMMC",MapUtils.getString(blrMap, "BMMC"));
            String sfbj = MapUtils.getString(param, "SFBJ");
            if("0".equals(sfbj)){
                param.put("LZZT", LZZT_LZZ);
                //流转
                fkMap.put("FKZT", FKZT_LZ);
                String xbblr = MapUtils.getString(param, "XBBLR");
                if(StringUtils.isNotEmpty(xbblr)){
                    Map<String, Object> xbblrMap = dao.queryUesrInfo(xbblr);
                    fkMap.put("XBBLR",xbblr);
                    fkMap.put("XBBLRMC",MapUtils.getString(xbblrMap, "YHMC"));
                    fkMap.put("XBBLRBMBH",MapUtils.getString(xbblrMap, "BMBH"));
                    fkMap.put("XBBLRBMMC",MapUtils.getString(xbblrMap, "BMMC"));
                }
            }else{
                //办结
                fkMap.put("FKZT", FKZT_BJ);
                if(LZZT_LZZ.equals(dao.queryLzzt(xh))){
                    //状态改为2
                    param.put("LZZT", LZZT_LZBJ);
                }
                Map<String, Object> task = dao.getTaskById(xh);
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
            }
            
            if(dao.taskFeedback(param)>0){
                return dao.updateLzxx(fkMap);
            }
            return 0;
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
        // 业务类型
        String ywlx = MapUtils.getString(dataMap, "YWLX");
        String ywzlx = MapUtils.getString(dataMap, "YWZLX");
        // 数据类型
        String type = MapUtils.getString(dataMap, "TYPE");
        String endTime = null;
        String rwbh = MapUtils.getString(dataMap, "RWBH");
        Map<String, Object> result = new HashMap<>();
        
        List<Map<String, Object>> dbsList = null;
        // 大气质量
        if ("DQYJ".equals(ywlx)) {
            if ("HOUR".equals(type)) {
                result = dataDao.queryAirStationHourData(rwbh);
                String [] filter = {"TIME"};
                parseDate(result, "yyyy-MM-dd HH:mm:ss", filter);
            } 
        } else if ("DBSYJ".equals(ywlx)) {
            // 地表水预警
            dbsList = dataDao.queryDBSStationHourData(rwbh);
            if(CollectionUtils.isNotEmpty(dbsList)){
                result = dbsList.get(0);
                String [] filter = {"JCSJ"};
                parseDate(result, "yyyy-MM-dd HH:mm:ss", filter);
            }
        } else if ("WRYZXYJ".equals(ywlx)) {
            // 污染源在线
            //日数据，小时超标累计三次
            //当天小时数据，超标因子
            endTime = DateUtil.format(MapUtils.getTimestamp(dataMap, "SJKSSJ"), "yyyy-MM-dd");
            if(ywzlx.indexOf("CBBJ")>-1){
                if(ywzlx.indexOf("_FQ")>-1){
                    dbsList = dataDao.queryXscbFqZdxx(rwbh,endTime);
                }else{
                    dbsList = dataDao.queryXScbFsZdxx(rwbh,endTime);
                }
                result.put("dataList", dbsList);
                result.put("cbyzList", strToList(MapUtils.getString(dataMap, "YJGLNR")));
            }else{
                rwbh = MapUtils.getString(dataMap, "ZDBH");
                endTime = DateUtil.format(MapUtils.getTimestamp(dataMap, "SJKSSJ"), "yyyy-MM-dd HH:mm:ss");
                DateTime startDate = null;
                if(ywzlx.indexOf("LXHZ")>-1){
                    //往前推5小时
                   startDate = DateUtil.offset(DateUtil.parse(endTime), DateField.HOUR, -5);
                }else{
                    startDate = DateUtil.offset(DateUtil.parse(endTime), DateField.MINUTE, -150);
                }
                if(ywzlx.indexOf("_FQ")>-1){
                    dbsList = dataDao.queryXSHZFqZdxx(rwbh,DateUtil.format(startDate,"yyyy-MM-dd HH:mm:ss"),endTime);
                }else{
                    dbsList = dataDao.queryXSHZFsZdxx(rwbh,DateUtil.format(startDate,"yyyy-MM-dd HH:mm:ss"),endTime);
                }
                result.put("dataList", dbsList);
                result.put("cbyzList", strToList(MapUtils.getString(dataMap, "YJGLNR")));
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

    /**
     * 判断是否需要插入流转信息，并对lzList进行修改
     * @param list
     * @return
     */
    private Map<String, Object> needInsertLzxx(List<Map<String, Object>> list) {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> tempList = new ArrayList<>();
        if (CollectionUtils.isEmpty(list)) {
            //当下没有相关流转信息
            result.put("NEED", true);
            result.put("XH", Toolkit.getUUID());
        } else {
            result.put("NEED", true);
            result.put("XH", Toolkit.getUUID());
            for (int i = 0, len = list.size(); i < len; i++) {
                Map<String, Object> map = list.get(i);
                if (StringUtils.isEmpty(MapUtils.getString(map, "FKNR"))) {
                    //有新建lzxx记录，且该记录为初始状态
                    result.clear();
                    result.put("NEED", false);
                    result.put("DATA", map);
                }else{
                    tempList.add(map);
                }
            }
            list.clear();
        }
        for(Map<String, Object> tempMap:tempList){
            list.add(tempMap);
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
    
    /**
     * 判断该用户对应该任务是有有权限办理
     * @param cbblr 初步办理人账号
     * @param list 流转信息list
     * @param xtzh 该用户系统账号
     * @return 该用户有权限则返回true 否则返回false
     */
    private boolean hasAuth(String cbblr,List<Map<String, Object>> list,String xtzh){
        if(StringUtils.isEmpty(xtzh)){
            return false;
        }
        if(xtzh.equals(cbblr)){
            return true;
        }
        for(Map<String, Object> map:list){
            if(xtzh.equals(MapUtils.getString(map, "XBBLR"))){
                return true;
            }
        }
        return false;
    }
    
    private void initDataHepler(int pageNum, int pageSize, Map<String, Object> param){
        DataHelper.startPage(pageNum, pageSize);
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
    }

}
