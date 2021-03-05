package com.szboanda.dqxt.index.service.impl;

import com.szboanda.dqxt.index.dao.TqybDAO;
import com.szboanda.dqxt.index.entity.Tqyb;
import com.szboanda.dqxt.index.exception.TqybException;
import com.szboanda.dqxt.index.service.ITqybService;
import com.szboanda.dqxt.index.util.WeatherDataResult;
import java.util.*;

import com.szboanda.platform.common.utils.LoggerUtil;
import com.szboanda.platform.common.utils.Toolkit;
import com.szboanda.platform.v3.util.BeanUtils;
import cn.hutool.core.date.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * 同步天气预报数据服务
 *
 */
@Service
public class TqybServiceImpl implements ITqybService {

	@Autowired
    private TqybDAO dao;
	
	
	/**
	 * 同步天气预报数据
	 */
	@Override
	public void asynTqybData() {
		try {
			HashMap<String, Object> predicData = getPredictWeatherData();
			if (predicData != null) {
				List<HashMap<String, Object>> predataList = (List<HashMap<String, Object>>) predicData.get("detail");
				String ptTime = (String) predicData.get("publish_time");
				
				List<Tqyb> tqyblist = new ArrayList<Tqyb>();
				
				// 把读取的天气预报转为实体类
				convertVoFromObject(predataList, ptTime, tqyblist);
//				
				if (!BeanUtils.emptyCollection(tqyblist)) {
					dao.insertBatchTqybData(tqyblist);
				}
			}
			
        } catch (Exception e) {
            LoggerUtil.error(this.getClass(), "同步天气预报数据异常", e);
            throw new TqybException("同步天气预报数据异常", e);
        }

	}
	
	/**
	 * 天气预报数据转变为实体
	 * @Title: convertVoFromObject
	 * @param dataList
	 * @param tqyblist   
	 */
	public void convertVoFromObject(List<HashMap<String,Object>> predataList, String ptTime, List<Tqyb> tqyblist) {
		if (!BeanUtils.emptyCollection(predataList)) {
			for (HashMap<String,Object> obj : predataList) {
				Tqyb voDay = new Tqyb();
				Tqyb voNight = new Tqyb();
				
//	"XH","TYPE","YCSJ","WD","TQ","FX","FS","PUBLISHTIME"
//	test1,day,2020-10-28 00:00:00,"25",多云,东北风,"3~4级",2020-10-28 08:00:00

				voDay.setXh(Toolkit.getUUID());
				voDay.setType("白天");
				voDay.setYcsj(DateUtil.parse(obj.get("date").toString()));
				voDay.setPublishtime((DateUtil.parse(ptTime)));
				HashMap<String, Object> dayObj = (HashMap<String, Object>) obj.get("day");
				voDay.setWd(((HashMap<String,Object>) dayObj.get("weather")).get("temperature").toString());
				voDay.setTq(((HashMap<String,Object>) dayObj.get("weather")).get("info").toString());
				voDay.setFx(((HashMap<String,Object>) dayObj.get("wind")).get("direct").toString());
				voDay.setFs(((HashMap<String,Object>) dayObj.get("wind")).get("power").toString());
//				
				voNight.setXh(Toolkit.getUUID());
				voNight.setType("夜间");
				voNight.setYcsj(DateUtil.parse(obj.get("date").toString()));
				voNight.setPublishtime((DateUtil.parse(ptTime)));
				HashMap<String, Object> nightObj = (HashMap<String, Object>) obj.get("night");
				voNight.setWd(((HashMap<String,Object>) nightObj.get("weather")).get("temperature").toString());
				voNight.setTq(((HashMap<String,Object>) nightObj.get("weather")).get("info").toString());
				voNight.setFx(((HashMap<String,Object>) nightObj.get("wind")).get("direct").toString());
				voNight.setFs(((HashMap<String,Object>) nightObj.get("wind")).get("power").toString());
//				
				tqyblist.add(voDay);
				tqyblist.add(voNight);
			}
		}
	}
	
	/**
     * @param date
     * @return
     * @throws Exception
     */
    public HashMap<String, Object> getPredictWeatherData() throws  Exception {
        long time = System.currentTimeMillis();
        
//        HttpHeaders headers = new HttpHeaders();
//        HttpHeaders headers = new HttpHeaders();
//        headers.add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36");
//        HttpEntity<String> entity = new HttpEntity<>(postBody, headers);
        
        RestTemplate restTemplate = new RestTemplate();
        String url = Toolkit.getConfigValue("bd.sys.platform.config.dqxt.tqybUrl", "http://www.nmc.cn/rest/weather?stationid=58644") + "&_=" + time;
        
        ResponseEntity<WeatherDataResult> responseEntity = restTemplate.getForEntity(url, WeatherDataResult.class);
        WeatherDataResult weatherDataResult = responseEntity.getBody();
        HashMap<String, Object> predicData = null;
        if ("success".equals(weatherDataResult.getMsg())) {
        	predicData = (HashMap<String, Object>) weatherDataResult.getData().get("predict");
        }
        
		return predicData;
    }

	@Override
	public List<Map<String, Object>> getTqybData() {
		List<Map<String, Object>> tqybbData = dao.getTqybData();
		return tqybbData;
	}
    
//    public static void main(String[] args) {
//    	try {
//			getWindData();
//		} catch (Exception e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//    }

}