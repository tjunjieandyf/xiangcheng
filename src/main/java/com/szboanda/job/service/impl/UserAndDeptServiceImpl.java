/******************************************************************************
* Copyright (C) 2021 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.job.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.szboanda.job.dao.OtherDataSourceDAO;
import com.szboanda.job.dao.UserAndDeptDAO;
import com.szboanda.job.service.IUserAndDeptService;
import com.szboanda.platform.common.base.BaseService;
import com.szboanda.platform.common.utils.MapUtils;
import com.szboanda.platform.common.utils.Toolkit;

/**
* @Title:
* @author  唐俊杰
* @since   JDK1.8
* @history 2021年3月31日 唐俊杰 新建
*/
@Service
public class UserAndDeptServiceImpl extends BaseService implements IUserAndDeptService {
    @Autowired
    private UserAndDeptDAO dao;
    @Autowired
    private OtherDataSourceDAO otherDao;
    
    @Override
    public void syncUser() {
        List<Map<String, Object>> userDeleteList = new ArrayList<Map<String,Object>>();
        List<Map<String, Object>> userUpdateList = new ArrayList<Map<String,Object>>();
        List<Map<String, Object>> userAddList = new ArrayList<Map<String,Object>>();
        List<Map<String, Object>> sjzxUserList = dao.queryUsers();
        List<Map<String, Object>> originUserList = otherDao.queryUsers();
        for(Map<String, Object> origin:originUserList){
            boolean flag = false;
            for(Map<String, Object> sjzx:sjzxUserList){
                if(MapUtils.getString(origin, "YHID").equals(MapUtils.getString(sjzx, "XTZH"))){
                    flag = true;
                    userUpdateList.add(origin);
                    break;
                }
            }
            if(!flag){
                Map<String, Object> tempUser = new HashMap<String, Object>();
                tempUser.put("YHID", Toolkit.getUUID());
                tempUser.put("XTZH", MapUtils.getString(origin, "YHID"));
                tempUser.put("BMBH", MapUtils.getString(origin, "BMBH"));
                tempUser.put("SFYX", MapUtils.getString(origin, "SFYX"));
                tempUser.put("YHMC", MapUtils.getString(origin, "YHMC"));
                tempUser.put("YHMM", "29B31C9706983D5E");
                userAddList.add(tempUser);
            }
        }
        
        if(originUserList.size()<sjzxUserList.size()){
            for(Map<String, Object> user:sjzxUserList){
                boolean flag = false;
                for(Map<String, Object> originUser:originUserList){
                    if(MapUtils.getString(user, "XTZH").equals(MapUtils.getString(originUser, "YHID"))){
                        flag = true;
                        break;
                    }
                }
                if(!flag){
                    userDeleteList.add(user);
                }
            }
        }
        
        for(Map<String, Object> user:userAddList){
            dao.insertUser(user);
        }
        
        for(Map<String, Object> user:userUpdateList){
            dao.updateUser(user);
        }
        
        for(Map<String, Object> user:userDeleteList){
            dao.deleteUser(user);
        }
    }
    
    @Override
    public void syncDept() {
        List<Map<String, Object>> deptDeleteList = new ArrayList<Map<String,Object>>();
        List<Map<String, Object>> deptUpdateList = new ArrayList<Map<String,Object>>();
        List<Map<String, Object>> deptAddList = new ArrayList<Map<String,Object>>();
        List<Map<String, Object>> sjzxDeptList = dao.queryDepts();
        List<Map<String, Object>> originDeptList = otherDao.queryDepts();
        for(Map<String, Object> originDept:originDeptList){
            boolean flag = false;
            for(Map<String, Object> sjzxDept:sjzxDeptList){
                if(MapUtils.getString(originDept, "XH").equals(MapUtils.getString(sjzxDept, "XH"))){
                    flag = true;
                    deptUpdateList.add(originDept);
                    break;
                }
            }
            if(!flag){
                deptAddList.add(originDept);
            }
        }
        
        if(originDeptList.size()<sjzxDeptList.size()){
            for(Map<String, Object> dept:sjzxDeptList){
                boolean flag = false;
                for(Map<String, Object> orDept:originDeptList){
                    if(MapUtils.getString(dept, "XH").equals(MapUtils.getString(orDept, "XH"))){
                        flag = true;
                        break;
                    }
                }
                if(!flag){
                    deptDeleteList.add(dept);
                }
            }
        }
        
        for(Map<String, Object> dept:deptAddList){
            dao.insertUser(dept);
        }
        
        for(Map<String, Object> dept:deptUpdateList){
            dao.updateDept(dept);
        }
        
        for(Map<String, Object> dept:deptDeleteList){
            dao.deletDept(dept);
        }
    }

}
