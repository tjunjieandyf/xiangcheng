package com.szboanda.smart.geo.geoservice;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.szboanda.smart.geo.domain.Feature;
import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.LinearRing;
import com.vividsolutions.jts.geom.Polygon;

/**
 * @author 地图产品部 - 陈晓鹏
 * @date 2020-08-19
 * @description 图形工具类，用于坐标转换、生成扇形、
 */
public class GeometryUtil {


    /**
     * 以分号分割经纬度坐标
     * @param ringString
     * @return
     */
    public static Geometry fromRingString(String ringString){
        GeometryFactory geometryFactory = new GeometryFactory();
        String[] arrCoords = ringString.split(";");
        Coordinate[] coordinates = new Coordinate[arrCoords.length];
        if (coordinates.length < 5) {
        	throw new IllegalArgumentException("多边形坐标必须至少要5个坐标");
        }
        for (int i = 0; i < arrCoords.length; i++) {
            String[] latLng = arrCoords[i].split(",");
            double x = Double.parseDouble(latLng[0]);
            double y = Double.parseDouble(latLng[1]);
            coordinates[i] = new Coordinate(x, y);
        }
        LinearRing ring = geometryFactory.createLinearRing(coordinates);
        Polygon polygon = geometryFactory.createPolygon(ring, null);
        return polygon;
    }

    /**
     * 创建扇形
     * @param center 中心点
     * @param radius  半径
     * @param startAngle 开始角度
     * @param endAngle 结束角度
     * @param pointNum 生成扇形时需要一共生成多少个点位
     * @return
     */
    public  static Polygon createSector(Coordinate center, float radius, float startAngle, float endAngle, int pointNum) {
        float sin;
        float cos;
        float x;
        float y;
        float angle;
        GeometryFactory geometryFactory = new GeometryFactory();
        List<Coordinate> coords = new ArrayList<Coordinate>();
        coords.add(center);
        for (int i = 0; i <= pointNum; i++) {
            angle = startAngle + (endAngle - startAngle) * i / pointNum;
            sin = (float) Math.sin(angle * Math.PI / 180);
            cos = (float) Math.cos(angle * Math.PI / 180);
            x = (float) (center.x + radius * sin);
            y = (float) (center.y + radius * cos);
            Coordinate c1 = new Coordinate(x, y);
            coords.add(c1);
        }
        coords.add(center);
        Coordinate[] coordinates = new Coordinate[coords.size()];
        coords.toArray(coordinates);
        LinearRing ring = geometryFactory.createLinearRing(coordinates);
        Polygon polygon = geometryFactory.createPolygon(ring, null);
        return polygon;
    }

    /**
     * 根据传入的经度、维度直接俄转换为 jst Feature
     * @param dataList 数据集合
     * @param xField 经度
     * @param yField 维度
     * @return
     */
    public static List<Feature> getPointFeatures(List<Map<String,Object>> dataList, String xField, String yField) {
        GeometryFactory geometryFactory = new GeometryFactory();
        List<Feature> features = new ArrayList<>();
        for (Map<String, Object> dataItem : dataList) {
            Feature fe = new Feature();
            if (dataItem.containsKey(xField) && dataItem.containsKey(yField)) {
                fe.setAttributes(dataItem);
                Object xValue = dataItem.get(xField);
                Object yValue = dataItem.get(yField);
                Coordinate coordinate = new Coordinate(Double.parseDouble(xValue.toString()), Double.parseDouble(yValue.toString()));
                com.vividsolutions.jts.geom.Point point = geometryFactory.createPoint(coordinate);
                fe.setGeometry(point);
                features.add(fe);
            }
        }

        return features;
    }


}
