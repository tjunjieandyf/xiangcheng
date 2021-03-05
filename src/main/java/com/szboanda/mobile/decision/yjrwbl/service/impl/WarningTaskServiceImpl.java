/******************************************************************************
 * Copyright (C) ShenZhen Powerdata Information Technology Co.,Ltd
 * All Rights Reserved.
 * 本软件为深圳市博安达信息技术股份有限公司开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
 * 复制、修改或发布本软件.
 *****************************************************************************/

package com.szboanda.mobile.decision.yjrwbl.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.szboanda.business.BaseBusinessService;
import com.szboanda.dqxt.rwzx.dao.TaskCenterDataDAO;
import com.szboanda.mobile.decision.yjrwbl.dao.WarningTaskDAO;
import com.szboanda.mobile.decision.yjrwbl.exception.WarningTaskException;
import com.szboanda.mobile.decision.yjrwbl.service.IWarningTaskService;
import com.szboanda.platform.common.component.datahelper.DataHelper;
import com.szboanda.platform.common.framext.mybatits.PlatformPageInfo;
import com.szboanda.platform.common.utils.CollectionUtils;
import com.szboanda.platform.common.utils.DateFormatUtils;
import com.szboanda.platform.common.utils.LoggerUtil;
import com.szboanda.platform.common.utils.MapUtils;
import com.szboanda.platform.common.utils.SQLUtils;
import com.szboanda.platform.common.utils.StringUtils;
import com.szboanda.platform.common.utils.Toolkit;
import com.szboanda.platform.system.commoncode.cache.CommonCodeCache;
import com.szboanda.platform.v3.util.DateUtils;

import cn.hutool.core.date.DateField;
import cn.hutool.core.date.DateTime;
import cn.hutool.core.date.DateUtil;

/**
 * 钉钉端:预警任务办理
 * 
 * @copyright: PowerData Software Co.,Ltd. Rights Reserved.
 * @company: 深圳市博安达信息技术股份有限公司
 * @author 朱传露
 * @date 2020年10月17日
 * @version: V1.0
 */
@Service("WarningTaskService")
public class WarningTaskServiceImpl extends BaseBusinessService implements IWarningTaskService {

    @Autowired
    private WarningTaskDAO warningTaskDao;// 注入业务处理DAO

    @Autowired
    private TaskCenterDataDAO dataDao;
    
    /**
     * 查询【预警任务】业务集合
     *
     * @param pageNum
     *            分页数
     * @param pageSize
     *            分页长度
     * @param modelInfo
     *            业务Map集合
     * @return 返回业务集合
     * @throws WarningTaskException
     */
    @Override
    public PlatformPageInfo<Map<String, Object>> queryTasks(int pageNum, int pageSize, Map<String, Object> modelInfo) throws WarningTaskException {
        try {
            modelInfo = modelHandel(modelInfo);
            DataHelper.startPage(pageNum, pageSize);
            // 排序处理
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> orders = (List<Map<String, Object>>) modelInfo.get("order");
            StringBuffer orderByStr = new StringBuffer();
            if (CollectionUtils.isNotEmpty(orders)) {
                for (Map<String, Object> order : orders) {
                    String field = MapUtils.getString(order, "field");
                    String direction = MapUtils.getString(order, "direction");
                    orderByStr.append(field).append(" ").append(direction);
                }
            }
            DataHelper.startPage(pageNum, pageSize, orderByStr.toString());

            modelInfo.put("RWMC", MapUtils.getString(modelInfo, "Filter"));
            if (!StringUtils.isEmpty(MapUtils.getString(modelInfo, "RWMC"))) {
                SQLUtils.fillLike(modelInfo, "RWMC", true, true);
            }
            List<Map<String, Object>> results = warningTaskDao.queryTasks(modelInfo);

            if (CollectionUtils.isNotEmpty(results)) {
                String[] fields = { "SJKSSJ", "YQBJSJ", "SJJSSJ" };
                for (Map<String, Object> temp : results) {
                    temp = parseDate(temp, "yyyy年MM月dd HH:mm:ss", fields);
                    //设置办结状态
                    if("0".equals(MapUtils.getString(temp, "BJQK"))){
                        if("0".equals(MapUtils.getString(temp, "LZZT"))){
                            temp.put("sfbj", "0");
                        }else if("1".equals(MapUtils.getString(temp, "LZZT"))){
                            Map<String, Object> param = new HashMap<>();
                            param.put("RWBH", MapUtils.getString(temp, "XH"));
                            param.put("BLR", MapUtils.getString(modelInfo, "YHID"));
                            //发生流转
                            if(warningTaskDao.queryLzxx(param)>0){
                                temp.put("sfbj", "1");
                            }else{ 
                                //未发生流转
                                temp.put("sfbj", "0");
                            }
                        }
                    }else{
                        temp.put("sfbj", "1");
                    }
                }
                
            }

            return new PlatformPageInfo<Map<String, Object>>(results);

        } catch (Exception e) {
            LoggerUtil.error(this.getClass(), "查询预警任务列表异常", e);
            throw new WarningTaskException("查询预警任务列表异常", e);
        }
    }

    /**
     * 查询【移动决策-综合看板】某个业务信息
     *
     * @param modelInfo
     *            业务Map集合
     * @return 某个业务map对象
     * @throws WarningTaskException
     */
    public Map<String, Object> getTaskById(String xh,String xtzh) throws WarningTaskException {
        try {
            Map<String, Object> result = new HashMap<>();
            Map<String, Object> map = warningTaskDao.getTaskById(xh);
            
            if (CollectionUtils.isNotEmpty(map)) {
                Map<String, Object> commonMap = getCommonCode(MapUtils.getString(map, "YWLX"), MapUtils.getString(map, "YWZLX"));
                if (CollectionUtils.isNotEmpty(commonMap)) {
                    String dmmc = MapUtils.getString(commonMap, "DMMC");
                    map.put("GZ", dmmc);
                }
            }
            final String PATRRN = "yyyy年MM月dd日 HH:mm:ss";
            // 秸秆焚烧单独返回站点信息
            if ("JGFSYJ".equals(MapUtils.getString(map, "YWLX"))) {
                Map<String, Object> jgMap = dataDao.queryJGData(map);
                if (CollectionUtils.isNotEmpty(jgMap)) {
                    parseDate(jgMap, PATRRN, new String[] { "BJSJ" });
                    for (Entry<String, Object> entry : jgMap.entrySet()) {
                        if ("IMG".equalsIgnoreCase(entry.getKey())) {
                            // 替换图片访问路径
                            // http://analysis.zhhb.schb.com:8680/pictrue/SCX0020/20201123/SCX0020_20201123141859.jpeg
                            String url = (String) entry.getValue();
                            int start = url.indexOf(":");
                            int end = url.indexOf(":", start + 1) + 5;
                            StringBuilder stringBuilder = new StringBuilder();
                            stringBuilder.append(url.substring(0, start) + "://app.scxzhhb.com:8384" + url.substring(end));
                            entry.setValue(stringBuilder.toString());
                        }
                    }
                }
                result.put("jgMap", jgMap);
            }
            // 查询流转信息
            List<Map<String, Object>> lzxxList = warningTaskDao.listLzxx(xh);
            //查询是否有权限
            boolean hashAuth = hasAuth(MapUtils.getString(map, "CBBLR"), lzxxList, xtzh);
            //未办结任务，浏览时先给lzxx表中插入一条记录
            if (CollectionUtils.isNotEmpty(map)) {
                if("0".equals(MapUtils.getString(map, "BJQK"))){
                    //此段代码中有删除list中无用map操作，不要变动顺序
                    Map<String, Object> needMap = needInsertLzxx(lzxxList);
                    String lzxh = "";
                    if(MapUtils.getBoolean(needMap, "NEED")){
                         lzxh = MapUtils.getString(needMap, "XH");
                        Map<String, Object> lzxxParam = new HashMap<>();
                        lzxxParam.put("XH", lzxh);
                        lzxxParam.put("RWBH", xh);
                        lzxxParam.put("FKSJ", new Date());
                        warningTaskDao.insertLzxx(lzxxParam);
                        result.put("fkxh",lzxh);
                    }else if(CollectionUtils.isNotEmpty(needMap)&&!MapUtils.getBoolean(needMap, "NEED")){
                          @SuppressWarnings("unchecked")
                          Map<String, Object> oldLzMap = (Map<String, Object>) needMap.get("DATA");
                          lzxh = MapUtils.getString(oldLzMap, "XH");
                          result.put("fkxh",lzxh);
                    }
                    if(StringUtils.isNotEmpty(lzxh)){
                        // 查询附件信息
                        List<Map<String, Object>> fjList = warningTaskDao.queryFjxx(lzxh);
                        result.put("fjxx", fjList);
                    }
                 }
            }
            //反馈记录插入
            List<Map<String, Object>> lzxxResult = new ArrayList<>();
            if (CollectionUtils.isNotEmpty(lzxxList)) {
                for (Map<String, Object> lzxxMap : lzxxList) {
                    parseDate(lzxxMap, PATRRN, new String[] { "FKSJ" });
                    // 查询附件信息
                    List<Map<String, Object>> attachmentArray = warningTaskDao.queryFjxx(MapUtils.getString(lzxxMap, "XH"));
                    lzxxMap.put("fjxx", attachmentArray);
                    lzxxResult.add(lzxxMap);
                }
            } else {
                if("1".equals(MapUtils.getString(map, "SFBJ"))){
                    parseDate(map, PATRRN, new String[] { "FKSJ" });
                    // 对于之前没有流转但是已经完成反馈的信息做兼容
                    Map<String, Object> tempMap = new HashMap<>();
                    List<Map<String, Object>> attachmentArray = warningTaskDao.queryFjxx(xh);
                    tempMap.put("fjxx", attachmentArray);
                    tempMap.put("BLR", MapUtils.getString(map, "BLR"));
                    tempMap.put("FKNR", MapUtils.getString(map, "FKNR"));
                    tempMap.put("FKSJ", MapUtils.getString(map, "FKSJ"));
                    lzxxResult.add(tempMap);
                }
            }
            result.put("lzList", lzxxResult);
                
            //反馈给前端有权限标记
            result.put("hasAuth", hashAuth);

            // 删除无用属性
            map.remove("FKNR");
            map.remove("FKSJ");
            map.remove("SFBJ");

            // 空气质量
            Map<String, Object> kqMap = getShowData(map);
            result.put("list", kqMap);
            // getShowData方法中有涉及时间处理的部分，所以在该方法调用之后调用parseDate方法
            String[] fields = { "YQBJSJ", "SJKSSJ" };
            map = parseDate(map, "yyyy年MM月dd日 HH:mm:ss", fields);
            if ("WRYZXYJ".equals(MapUtils.getString(map, "YWLX"))) {
                if (kqMap.containsKey("FQ")) {
                    // 废气标记
                    map.put("YWTYPE", true);
                } else {
                    // 废水标记
                    map.put("YWTYPE", false);
                }
            }
            // 添加状态
            result.put("detail", map);
            
            //兼容之前没有流转功能之前已经反馈的记录
            if(StringUtils.isEmpty(MapUtils.getString(result, "fkxh"))){
                result.put("fkxh", xh);
            }
     
            return result;
        } catch (Exception e) {
            LoggerUtil.error(this.getClass(), "查询【预警任务】业务信息异常", e);
            throw new WarningTaskException("查询【预警任务】业务信息异常", e);
        }
    }

    @Override
    public int saveTaskFeedBack(Map<String, Object> params,boolean flag) throws WarningTaskException {
//        int udpateMark = 0, insertMark = 0;
//        String fkr = MapUtil.getStr(params, "FKR");
//        if(flag){
//            //钉钉返回的是加密系统账号
//            fkr = PasswordHelper.dencryptString(fkr, "DES_NET");
//        }else{
//            //pc端返回的是用户名称
//            List<UserVO> list = dao.getUserByName(fkr);
//            if(CollectionUtils.isEmpty(list)){
//                return 0;
//            }else{
//                fkr = list.get(0).getXtzh();
//            }
//        }
//        try {
//            String fksj = MapUtil.getStr(params, "FKSJ");
//            if (!StringUtils.isEmpty(fksj)) {
//                params.put("FKSJ", DateUtils.parseDate(fksj));
//            }
//            // 获取当前的流转状态
//            String lzzt = warningTaskDao.queryLzzt(MapUtil.getStr(params, "XH"));
//
//            // jbxx更新参数
//            Map<String, Object> saveParam = new HashMap<>();
//            saveParam.put("XH", MapUtil.getStr(params, "XH"));
//
//            // 流转表参数
//            Map<String, Object> lzxxParam = new HashMap<>();
//            lzxxParam.put("XH", MapUtil.getStr(params, "FKXH"));
//            lzxxParam.put("RWBH", MapUtil.getStr(params, "XH"));
//            lzxxParam.put("BLR", fkr);
//            lzxxParam.put("FKNR", MapUtil.getStr(params, "FKNR"));
//            lzxxParam.put("FKSJ", MapUtil.getDate(params, "FKSJ"));
//            // 直接办结
//            if ("1".equals(MapUtil.getStr(params, "SFBJ"))) {
//                saveParam.put("BJQK", "1");
//                // 已经在流转过程中
//                if ("1".equals(lzzt)) {
//                    saveParam.put("LZZT", "2");
//                }
//                // 办结
//                lzxxParam.put("FKZT", "1");
//            } else { // 发生流转
//                // 初始状态，未发生流转时，进行流转
//                if ("0".equals(lzzt)) {
//                    saveParam.put("LZZT", "1");
//                    // 1、jbxx表中添加一些必要信息
//                    udpateMark = warningTaskDao.saveTaskFeedBack(saveParam);
//                }
//
//                lzxxParam.put("XBBLR", MapUtil.getStr(params, "XBBLR"));
//                // 未办结
//                lzxxParam.put("FKZT", "0");
//
//            }
//            Map<String, Object> task = warningTaskDao.getTaskById(MapUtils.getString(params, "XH"));
//            Date kssj = MapUtils.getUtilDate(task, "SJKSSJ");
//            Date jssj = MapUtils.getUtilDate(task, "YQBJSJ");
//            int jg = DateUtils.getDateDiff(kssj, new Date(), Calendar.HOUR);
//            int total = DateUtils.getDateDiff(kssj, jssj, Calendar.HOUR);
//            double result = (double)jg/total;
//            if(result>=1.0){
//                saveParam.put("MARKTYPE", 2);
//            }else if(result>0.5){
//                saveParam.put("MARKTYPE", 1);
//            }else{
//                saveParam.put("MARKTYPE", 0);
//            }
//            // 1、jbxx表中添加一些必要信息
//            udpateMark = warningTaskDao.saveTaskFeedBack(saveParam);
//            if (udpateMark > 0) {
//                // 2、流转表中加入反馈信息和流转信息
//                insertMark = warningTaskDao.updateLzxx(lzxxParam);
//            }
//            return udpateMark * insertMark;
//        } catch (Exception e) {
//            LoggerUtil.error(this.getClass(), "保存反馈信息异常", e);
//            throw new TaskCenterException("保存反馈信息异常", e);
//        }
        return 0;
    }

    @Override
    public List<Map<String, Object>> listUsers() throws WarningTaskException {
        return warningTaskDao.listUsers();
    }

    /**
     * 【预警任务】业务日期类型处理
     *
     * @param model
     *            业务Map集合
     * @return model 业务Map集合
     * @throws WarningTaskException
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
     * 格式化时间字段
     * @param map 返回业务map
     * @param pattern 日期格式
     * @param fields 指定的为时间类型的字段数组
     * @return
     */
    private Map<String, Object> parseDate(Map<String, Object> map, final String pattern, String[] fields) {
        if (CollectionUtils.isNotEmpty(map) && fields != null && fields.length > 0) {
            for (String field : fields) {
                Timestamp temp = MapUtils.getTimestamp(map, field);
                if (temp != null) {
                    map.put(field, DateFormatUtils.format(temp, pattern));
                }
            }
        }
        return map;
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
        String endTime = DateUtil.format(MapUtils.getTimestamp(dataMap, "SJKSSJ"), "yyyy-MM-dd HH:mm:ss");
        String ywglxh = MapUtils.getString(dataMap, "YWGLXH");
        List<Map<String, Object>> dataList = null;
        Map<String, Object> result = new HashMap<>();
        // 站点编号
        param.put("CDBH", ywglxh);
        // 小时数据, 最近24小时
        DateTime endDate = null;
        if ("HOUR".equals(type)) {
            endDate = DateUtil.offset(DateUtil.parse(endTime), DateField.HOUR, -24);
        } else {
            endDate = DateUtil.offset(DateUtil.parse(endTime), DateField.MINUTE, -15);
        }
        String startTime = DateUtil.format(endDate, "yyyy-MM-dd HH:mm:ss");
        param.put("STARTTIME", startTime);
        param.put("ENDTIME", endTime);
        // 大气质量
        if ("DQYJ".equals(ywlx)) {
            if ("HOUR".equals(type)) {
                dataList = dataDao.queryAirStationHourData(param);
            } else if ("MINUTE".equals(type)) {
                boolean sz = true;
                dataList = dataDao.queryAirStationMinuteData(param);
                if (CollectionUtils.isEmpty(dataList)) {
                    dataList = dataDao.queryAirStationXZMinuteData(param);
                    sz = false;
                }
                // 省站空气分钟数据需要乘以一千，除了co
                if (sz && CollectionUtils.isNotEmpty(dataList)) {
                    for (Map<String, Object> data : dataList) {
                        for (String key : data.keySet()) {
                            try {
                                if (!"co".equalsIgnoreCase(key)) {
                                    double tempData = MapUtils.getBigDecimal(data, key, 6).doubleValue();
                                    int size = 1000;
                                    tempData *= size;
                                    data.put(key, tempData);
                                }
                            } catch (Exception e) {
                                continue;
                            }
                        }
                    }
                }

            }
            // 处理数据
            String[] filters = { "CDMC", "CDBH" };
            result = initData(dataList, filters);
        } else if ("DBSYJ".equals(ywlx)) {// 地表水预警
            dataList = dataDao.queryWaterStationHourData(param);
            if (CollectionUtils.isEmpty(dataList)) {
                dataList = dataDao.queryKeyPointWaterStationHourData(param);
            }
            // 处理数据
            String[] filters = { "CDMC", "CDBH" };
            result = initData(dataList, filters);
        } else if ("WRYZXYJ".equals(ywlx)) {// 污染源在线
            String wrybh = MapUtils.getString(param, "CDBH");
            String[] arr = wrybh.split("-");
            param.put("WRYBH", arr[1]);
            param.put("PKXH", arr[0]);
            if (ywzlx.indexOf("FQ") >= 0) {// 废气
                dataList = dataDao.queryFQStationHourData(param);
                // 处理数据
                String[] filters = { "WRYBH" };
                result.put("FQ", initData(dataList, filters));
            } else {// 废水
                dataList = dataDao.queryFSStationHourData(param);
                String[] filters = { "WRYBH" };
                result.put("FS", initData(dataList, filters));
            }
        } else if ("CLGJGZYJ".equals(ywlx)) {
            // 车辆预警,解析任务内容中的车牌和时间
            String rwnr = MapUtils.getString(dataMap, "RWNR");
            int clStart = rwnr.indexOf("系统识别到");
            int clEnd = rwnr.indexOf("用车记录异常");
            String cp = rwnr.substring(clStart + 5, clEnd);
            clStart = rwnr.indexOf("申请单时间：");
            clEnd = rwnr.indexOf("驾驶员");
            String subRwnr = rwnr.substring(clStart + 6, clEnd);
            clStart = subRwnr.indexOf("到");
            String kssj = subRwnr.substring(0, clStart);
            String jssj = subRwnr.substring(clStart + 1, subRwnr.length());
            Map<String, Object> clMap = new HashMap<>();
            clMap.put("CP", cp);
            clMap.put("KSSJ", kssj);
            clMap.put("JSSJ", jssj);
            result.put("CLXX", clMap);
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
     * 根据rwbh获取的list情况判断是否需要新增流转信息
     * @param list
     * @return need true需要新建，false不需要新建
     */
    private Map<String,Object> needInsertLzxx(List<Map<String, Object>> list){
        Map<String,Object> result = new HashMap<>();
        if(CollectionUtils.isEmpty(list)){
            result.put("NEED", true);
            result.put("XH", Toolkit.getUUID());
        }else{
            result.put("NEED", true);
            result.put("XH", Toolkit.getUUID());
            for(int i=0,len=list.size();i<len;i++){
                Map<String, Object> map = list.get(i);
                if(StringUtils.isEmpty(MapUtils.getString(map, "FKNR"))){
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
     * 根据jbxx中的办理人账号和流转信息中的下步办理人判断该用户是否有任务反馈权限
     * @param blr jbxx中的初始办理人
     * @param list 流转信息
     * @param xtzh 用户账号
     * @return
     */
    private boolean hasAuth(String blr,List<Map<String, Object>> list,String xtzh){
        if(StringUtils.isEmpty(blr)||StringUtils.isEmpty(xtzh)){
            return false;
        }
        if(blr.equalsIgnoreCase(xtzh)){
            return true;
        }
        if(CollectionUtils.isEmpty(list)){
            return false;
        }else{
            for(Map<String, Object> map:list){
                if(xtzh.equals(MapUtils.getString(map, "XBBLR"))){
                    return true;
                }
            }
        }
        return false;
    }
}
