/******************************************************************************
* Copyright (C) 2018 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制，
* 未经深圳博安达正式书面同意，其他任何个人、团体不得使用，复制、修改或发布本软件.
*****************************************************************************/
package com.szboanda.yjya.qdyj.dao;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

public class ConnectJDBC {
	public Connection conn(String type){
		Connection conn =null;
		InputStream is = null;
		try {
			Properties p = new Properties();
			String path = this.getClass().getClassLoader().getResource("").getPath();
			is = new FileInputStream(path+"conf/jdbc.properties");
			p.load(is);
			String jdbc = "jdbc."+type+".";
			String url = p.getProperty(jdbc+"url").trim();
			String username = p.getProperty(jdbc+"username").trim();
			String password = p.getProperty(jdbc+"password").trim();
			String driver = p.getProperty(jdbc+"driver").trim();
			Class.forName(driver);
			conn = DriverManager.getConnection(url, username,password);
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			try {
				if(is!=null) {
					is.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return conn;
		
	}
}
