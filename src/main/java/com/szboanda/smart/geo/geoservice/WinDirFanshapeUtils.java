//package com.szboanda.smart.geo.geoservice;
//
//
//import java.io.File;
//import java.io.Serializable;
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//import org.geotools.data.DataUtilities;
//import org.geotools.data.DefaultTransaction;
//import org.geotools.data.Transaction;
//import org.geotools.data.collection.ListFeatureCollection;
//import org.geotools.data.shapefile.ShapefileDataStore;
//import org.geotools.data.shapefile.ShapefileDataStoreFactory;
//import org.geotools.data.simple.SimpleFeatureCollection;
//import org.geotools.data.simple.SimpleFeatureSource;
//import org.geotools.data.simple.SimpleFeatureStore;
//import org.geotools.feature.simple.SimpleFeatureBuilder;
//import org.geotools.geometry.jts.JTSFactoryFinder;
//import org.geotools.referencing.crs.DefaultGeographicCRS;
//import org.opengis.feature.simple.SimpleFeature;
//import org.opengis.feature.simple.SimpleFeatureType;
//
//import com.vividsolutions.jts.geom.Coordinate;
//import com.vividsolutions.jts.geom.GeometryFactory;
//import com.vividsolutions.jts.geom.LinearRing;
//import com.vividsolutions.jts.geom.Polygon;
///**
// * 风向扇形
// *
// * @author CHENS
// *
// */
//public class WinDirFanshapeUtils {
//
//	private static GeometryFactory geometryFactory = JTSFactoryFinder.getGeometryFactory( null );
//
//
//	public static void main(String[] args) {
//
//		try{
//	        //定义属性
//	        final SimpleFeatureType TYPE = DataUtilities.createType("Location",
//	            "location:Polygon," + // <- the geometry attribute: Point type
//	            "POIID:String," + // <- a String attribute
//	            "MESHID:String," + // a number attribute
//	            "OWNER:String"
//	        );
//	        //"the_geom:Polygon:srid=3857,DN:String,Aera:Double"
//	        List<SimpleFeature> features = new ArrayList<SimpleFeature>();
//	        SimpleFeatureCollection collection = new ListFeatureCollection(TYPE, features);
//	        GeometryFactory geometryFactory = new GeometryFactory();
//	        SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(TYPE);
//	        String POIID = "2050003092";
//	        String MESHID = "0";
//	        String OWNER = "340881";
//	        Object[] obj = {getShape(new Coordinate(114.016944d, 36.016944d), 0.05f, -30, 45, 60), POIID, MESHID, OWNER};
//	        SimpleFeature feature = featureBuilder.buildFeature(null, obj);
//	        features.add(feature);
////	        feature = featureBuilder.buildFeature(null, obj);
////	        collection.add(feature);
//	        File newFile = new File("D:\\data\\shapefiles\\demo\\newPoi2.shp");
//	        ShapefileDataStoreFactory dataStoreFactory = new ShapefileDataStoreFactory();
//	        Map<String, Serializable> params = new HashMap<String, Serializable>();
//	        params.put("url", newFile.toURI().toURL());
//	        params.put("create spatial index", Boolean.TRUE);
//	        ShapefileDataStore newDataStore = (ShapefileDataStore) dataStoreFactory.createNewDataStore(params);
//	        newDataStore.createSchema(TYPE);
//	        newDataStore.forceSchemaCRS(DefaultGeographicCRS.WGS84);
//	        Transaction transaction = new DefaultTransaction("create");
//	        String typeName = newDataStore.getTypeNames()[0];
//	        SimpleFeatureSource featureSource = newDataStore.getFeatureSource(typeName);
//
//	        if (featureSource instanceof SimpleFeatureStore) {
//	            SimpleFeatureStore featureStore = (SimpleFeatureStore) featureSource;
//	            featureStore.setTransaction(transaction);
//	            try {
//
//	                featureStore.addFeatures(collection);
//	                transaction.commit();
//	            } catch (Exception problem) {
//	                problem.printStackTrace();
//	            transaction.rollback();
//	            } finally {
//	                transaction.close();
//	            }
//	        } else {
//	            System.out.println(typeName + " does not support read/write access");
//	        }
//	    } catch (Exception e) {
//	        e.printStackTrace();
//	    }
//	}
//
//
//
//	public static Polygon getShape(Coordinate center, float radius, float startAngle, float endAngle,
//			int pointNum) {
//		float sin;
//		float cos;
//		float x;
//		float y;
//		float angle;
//
//		List<Coordinate> coords=new ArrayList<Coordinate>();
////		List<Coordinate> points = new ArrayList<Coordinate>();
////		points.add(center);
//		coords.add(center);
//		for (int i = 0; i <= pointNum; i++) {
//			angle = startAngle + (endAngle - startAngle) * i / pointNum;
//			sin = (float) Math.sin(angle * Math.PI / 180);
//			cos = (float) Math.cos(angle * Math.PI / 180);
//			x = (float) (center.x + radius * sin);
//			y = (float) (center.y + radius * cos);
//			Coordinate c1 = new Coordinate(x, y);
//			coords.add(c1);
//		}
//		coords.add(center);
//		Coordinate[] coordinates = new Coordinate[coords.size()];
//		coords.toArray(coordinates);
//		for (Coordinate coordinate : coordinates) {
//			System.out.println(coordinate.x+","+coordinate.y);
//		}
//		LinearRing ring = geometryFactory.createLinearRing( coordinates );
//        Polygon polygon = geometryFactory.createPolygon( ring, null );
//		return  polygon;
//	}
//}
