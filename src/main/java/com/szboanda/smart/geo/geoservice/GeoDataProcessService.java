package com.szboanda.smart.geo.geoservice;

/**
 * @author LENOVO
 *
 */
public class GeoDataProcessService {

	//private  GeometryFactory geometryFactory = new GeometryFactory();



//	@Test
//	public  void findPoints() throws MalformedURLException, IOException, 
//        SchemaException {
//		FeatureJSON fjson = new FeatureJSON();
//		float winDir = 350f;
//		float start = winDir - 30;
//		float end = winDir +30;
//		Coordinate center = new Coordinate(114.693094d, 37.011347d);
//		String[] paths = new String[]{WRY_SHP_PATH,YCY_SHP_PATH,JDC_YG_SHP_PATH};
//		//114.567297,y=>37.387372
//		Polygon pg = getShape(center, 0.5f, start, end, 60);
////		contain(pg,"D:\\\\data\\\\shapefiles\\\\demo\\\\工业污染源.shp");
//		Map<String, FeatureCollection>  resultMap =  
//                getFeaturesFromShapeFileInGeometry(paths,pg);
//		for (String key : resultMap.keySet()) {
//			StringWriter writer = new StringWriter();
//			//System.out.println(key+ "个数=>"+resultMap.get(key).size());
//			//fjson.writeFeatureCollection(resultMap.get(key), writer);
//		}
//		Point p1 =geometryFactory.createPoint(center);
//		SimpleFeature feature = getNearestFeature(p1, KQJCD_SHP_PATH);
//		Point p2= (Point) feature.getDefaultGeometry();
//	 	double d1 =  p2.distance(p1);
//		pg = getShape(new Coordinate(p2.getX(), p2.getY()), 
//            (float)d1, start, end, 60);
//		Map<String, FeatureCollection>  resultMap2 =  
//                getFeaturesFromShapeFileInGeometry(paths,pg);
//		System.out.println("最近影响的站点=>"+feature.getAttribute(2)
//                +";距离=>"+p2.distance(p1));
//		for (String key : resultMap2.keySet()) {
//			SimpleFeatureIterator itertor = (SimpleFeatureIterator) 
//                resultMap2.get(key).features();
//		}
//	}
//
//	private SimpleFeature getNearestFeature(Geometry p2,String path)
//	{
//		ShapefileDataStore shpDataStore = null;
//		double nearestDistinct = -1;
//	    SimpleFeature nearestFeature = null;
//	    try{
//	        shpDataStore = new ShapefileDataStore(new File(path).toURI().toURL());
//	        shpDataStore.setCharset(Charset.forName("UTF-8"));
//	        String typeName = shpDataStore.getTypeNames()[0];
//	        FeatureSource<SimpleFeatureType, SimpleFeature> featureSource = null;
//	        featureSource = (FeatureSource<SimpleFeatureType, SimpleFeature>)
//                shpDataStore.getFeatureSource(typeName);
//	        FeatureCollection<SimpleFeatureType, SimpleFeature> result 
//                = featureSource.getFeatures();
//	        FeatureIterator<SimpleFeature> itertor = result.features();
//	        while(itertor.hasNext()){
//	            SimpleFeature feature = itertor.next();
//	            Geometry geo = (Geometry) feature.getDefaultGeometry();
//	            if(geo!=null && !geo.equals(p2))
//	            {
//	            	double distinct = geo.distance(p2);
//	 	            if(nearestDistinct==-1)
//	 	            {
//	 	            	nearestDistinct = distinct;
//	 	            	nearestFeature = feature;
//	 	            	continue;
//	 	            }
//	 	            if(distinct<nearestDistinct)
//	 	            {
//	 	            	nearestDistinct = distinct;
//	 	            	nearestFeature = feature;
//	 	            }
//	            }
//
//	        }//org.geotools.data.shapefile.ShapefileDataStore
//                .ShapefileDataStore(URL url)
//	        //itertor.close();
//	    } catch (MalformedURLException e) {
//	        e.printStackTrace();
//	    } catch(IOException e) { e.printStackTrace(); }
//	    return nearestFeature;
//	}
//
//	public Map<String,FeatureCollection> getFeaturesFromShapeFileInGeometry(
//                Geometry geometry) throws IOException
//	{
//		return getFeaturesFromShapeFileInGeometry(this.getDataPaths(),geometry);
//	}
//
//
//	public Map<String,FeatureCollection> getFeaturesFromShapeFileInGeometry(
//                String[] paths,Geometry geometry) throws IOException
//	{
//		Map<String, FeatureCollection> resultMap = 
//            new HashMap<String, FeatureCollection>();
//		for (String path : paths) {
//			File file = new File(path);
//			String key =  file.getName().replace(".shp", "");
//			resultMap.put(key, getFeaturesFromShapeFileInGeometry(path,geometry));
//		}
//		return resultMap;
//	}
//
//	 private static FilterFactory2  ff = CommonFactoryFinder.getFilterFactory2(
//            GeoTools.getDefaultHints());
	 
//	/**
//	 *
//	 * @param path
//	 * @param geometry
//	 * @return
//	 * @throws IOException
//	 */
//	public FeatureCollection getFeaturesFromShapeFileInGeometry(String path,
//            Geometry geometry) throws IOException
//	{
//		List<SimpleFeature> features = new ArrayList<SimpleFeature>();
//		ShapefileDataStore shpDataStore = null;
//		SimpleFeatureCollection collection = null;
//
//	        shpDataStore = new ShapefileDataStore(new File(path).toURI().toURL());
//	        shpDataStore.setCharset(Charset.forName("UTF-8"));
//	        String typeName = shpDataStore.getTypeNames()[0];
//	        FeatureSource<SimpleFeatureType, SimpleFeature> featureSource = 
//            (FeatureSource<SimpleFeatureType, SimpleFeature>)shpDataStore
//                .getFeatureSource(typeName);
//	        FeatureCollection<SimpleFeatureType, SimpleFeature> result 
//                = featureSource.getFeatures();
//	        collection = new ListFeatureCollection(featureSource.getSchema(),
//                features);
//	        FeatureIterator<SimpleFeature> itertor = result.features();
//	        while(itertor.hasNext()){
//	            SimpleFeature feature = itertor.next();
//	            Geometry geo = (Geometry) feature.getDefaultGeometry();
//	            if(geo!=null && geometry.contains(geo))
//	            {
//	            	features.add(feature);
//	            }
//	        }
//	        itertor.close();
//	    return collection;
//	}
//
//
//
//
//


//	public  void contain(Geometry geo1,String path) throws MalformedURLException,
//                IOException, SchemaException {
//
//		File file = new File(path);
//        FileDataStore store = FileDataStoreFinder.getDataStore(file);
//        ((ShapefileDataStore) store).setCharset(Charset.forName("UTF-8"));
//        SimpleFeatureSource featureSource = store.getFeatureSource();
//        SimpleFeatureCollection simpleFeatureCollection=featureSource
//                .getFeatures();
//        SimpleFeatureIterator itertor = simpleFeatureCollection.features();
//        FeatureJSON fjson = new FeatureJSON();
//
//
//
//        String typeName =store.getTypeNames()[0];
////        FeatureSource<SimpleFeatureType, SimpleFeature> featureSource = null;
////        featureSource = (FeatureSource<SimpleFeatureType, SimpleFeature>)
//                shpDataStore.getFeatureSource(typeName);
//        ShapefileDataStore shapefileDataStore = (ShapefileDataStore)store;
//        List<SimpleFeature> features = new ArrayList<SimpleFeature>();
//        while (itertor.hasNext())
//        {
//            SimpleFeature feature = itertor.next();
//            Point geo = (Point) feature.getDefaultGeometry();
//            if(geo1.contains(geo))
//            {
//            	features.add(feature);
//            }
//        }
//        itertor.close();
//        //FeatureCollection collection= FeatureCollections.newCollection();
//
//        final SimpleFeatureType TYPE = DataUtilities.createType("Location",
//	            "location:Point," + // <- the geometry attribute: Point type
//	            "id:String," + // <- a String attribute
//	            "name:String," + // a number attribute
//	            "lng:Double,"+
//	            "lat:Double"
//	        );
//        SimpleFeatureCollection collection = new ListFeatureCollection(
//                TYPE, features);
//        StringWriter writer = new StringWriter();
//        fjson.writeFeatureCollection(collection, writer);
//        String json=writer.toString();
//        System.out.print(json);
//
//        final SimpleFeatureType TYPE2 = DataUtilities.createType("Location",
//	            "location:Polygon," + // <- the geometry attribute: Point type
//	            "id:String"
//	        );
//        SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(TYPE2);
//        Object[] obj = {geo1, "扇形"};
//        System.out.println();
//        System.out.println();
//        List<SimpleFeature> features2 = new ArrayList<SimpleFeature>();
//        SimpleFeature feature = featureBuilder.buildFeature(null, obj);
//        features2.add(feature);
//        SimpleFeatureCollection collection2 = new ListFeatureCollection(
//                TYPE2, features2);
//        writer = new StringWriter();
//        fjson.writeFeatureCollection(collection2, writer);
//        json=writer.toString();
//        System.out.print(json);
//        System.out.println();
//	}


}
