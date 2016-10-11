/*
 * 画像追加 Ver2.0.0
 * Author:Nishisonic,Nekopanda
 * LastUpdate:2016/10/11
 * 
 * 所有艦娘一覧に画像を追加します。
 */

load("script/utils.js");
load("script/ScriptData.js");

Display            = Java.type("org.eclipse.swt.widgets.Display");
GC                 = Java.type("org.eclipse.swt.graphics.GC");
Image              = Java.type("org.eclipse.swt.graphics.Image");
SWT                = Java.type("org.eclipse.swt.SWT");
SWTResourceManager = Java.type("org.eclipse.wb.swt.SWTResourceManager");
TableItem          = Java.type("org.eclipse.swt.widgets.TableItem");

ArrayList          = Java.type("java.util.ArrayList");
Arrays             = Java.type("java.util.Arrays");
File               = Java.type("java.io.File");
FilenameFilter     = Java.type("java.io.FilenameFilter");
Files              = Java.type("java.nio.file.Files");
HashMap            = Java.type("java.util.HashMap");
HashSet            = Java.type("java.util.HashSet");
HttpURLConnection  = Java.type("java.net.HttpURLConnection");
LinkedHashSet      = Java.type("java.util.LinkedHashSet"); 
List               = Java.type("java.util.List");
Map                = Java.type("java.util.Map");
Paths              = Java.type("java.nio.file.Paths");
System             = Java.type("java.lang.System");
URL                = Java.type("java.net.URL");

AppConstants       = Java.type("logbook.constants.AppConstants");
ApplicationMain    = Java.type("logbook.gui.ApplicationMain");
GlobalContext      = Java.type("logbook.data.context.GlobalContext");
ItemDto            = Java.type("logbook.dto.ItemDto");
ReportUtils        = Java.type("logbook.util.ReportUtils");
ShipDto            = Java.type("logbook.dto.ShipDto");
ShipTable          = Java.type("logbook.gui.ShipTable");

data_prefix = "ShipStyleImageVer2_";

//var startTime;

//定数
var IMAGE_SIZE            = { WIDTH:80,HEIGHT:20 };
var SHIP_LAYER_IMAGE_DIR  = "./script/Image/Layer/";
var SHIP_NORMAL_IMAGE_DIR = "./script/Image/Ship/Normal/";
var SHIP_DAMAGE_IMAGE_DIR = "./script/Image/Ship/Damage/";
var ITEM_ICON_IMAGE_DIR   = "./script/Image/Item/Icon/";
var SUNK_IMAGE_URL        = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Sunk.png";
var RED_COND_IMAGE_URL    = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Red.png";
var ORANGE_COND_IMAGE_URL = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Orange.png";
var KIRA_COND_IMAGE_URL   = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Kira.png";
var WEDDING_IMAGE_URL     = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Wedding.png";
var MISSION_IMAGE_URL     = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Mission.png";
var REPAIR_IMAGE_URL      = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Repair.png";
var SHIP_NORMAL_IMAGE_URL = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Ship/Normal/";
var SHIP_DAMAGE_IMAGE_URL = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Ship/Damage/";
var ITEM_ICON_IMAGE_URL   = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Item/Icon/";
//列番号
var condIndex   = 12;
var picIndex    = -1;
var columnIndex = -1;
var itemType1Index  = -1;
var itemType2Index  = -1;
var itemType3Index  = -1;
var itemType4Index  = -1;
var itemTypeExIndex = -1;
//変数
var shipTable      = null;
var oldImageDtoMap = null;
var imageDtoMap    = null;

var missionShips;
var ndockShips;

var startTime;

function begin(header) {
	startTime = System.currentTimeMillis();
	missionShips = GlobalContext.getMissionShipSet();
	ndockShips = GlobalContext.getNDockShipSet();
	System.out.print("Image Loading...");
	if(!getData("isLoaded")){ //nullはfalse
		System.out.println("Start.");
		var shipLayerImageDir  = new File(SHIP_LAYER_IMAGE_DIR);
		var shipNormalImageDir = new File(SHIP_NORMAL_IMAGE_DIR);
		var shipDamageImageDir = new File(SHIP_DAMAGE_IMAGE_DIR);
		var itemIconImageDir   = new File(ITEM_ICON_IMAGE_DIR);
		System.out.print("Layer Loading...");
		
		if(shipLayerImageDir.exists()){
			System.out.println("Complete.");
			//レイヤー
			Arrays.stream(shipLayerImageDir.listFiles(ImageFilter)).forEach(function(file){
				setTmpData("LAYER_" + file.getName(),new Image(Display.getDefault(), file.toString()));
			});
		} else {
			System.out.println("Failed.");
			shipLayerImageDir.mkdirs();
		}
		System.out.print("Ship(Normal) Loading...");
		if(shipNormalImageDir.exists()){
			System.out.println("Complete.");
			//通常
			Arrays.stream(shipNormalImageDir.listFiles(ImageFilter)).forEach(function(file){
				setTmpData("NORMAL_" + file.getName(),new Image(Display.getDefault(), file.toString()));
			});
		} else {
			System.out.println("Failed.");
			shipNormalImageDir.mkdirs();
		}
		System.out.print("Ship(Damage) Loading...");
		if(shipDamageImageDir.exists()){
			System.out.println("Complete.");
			//損傷
			Arrays.stream(shipDamageImageDir.listFiles(ImageFilter)).forEach(function(file){
				setTmpData("DAMAGE_" + file.getName(),new Image(Display.getDefault(), file.toString()));
			});
		} else {
			System.out.println("Failed.");
			shipDamageImageDir.mkdirs();
		}
		System.out.print("ItemIcon Loading...");
		if(itemIconImageDir.exists()){
			System.out.println("Complete.");
			//アイコン
			Arrays.stream(itemIconImageDir.listFiles(ImageFilter)).forEach(function(file){
				setTmpData("ITEM_ICON_" + file.getName(),new Image(Display.getDefault(), file.toString()));
			});
		} else {
			System.out.println("Failed.");
			itemIconImageDir.mkdirs();
		}
		setTmpData("isLoaded",true);
		System.out.println("Image Loading...Complete.");
	} else {
		System.out.println("Already.");
	}
	for (var i = 0; i < header.length; ++i) {
		if (header[i].equals("疲労")) {
			condIndex = i;
		}
		if (header[i].equals("画像")) {
			picIndex = i;
		}
		if (header[i].equals("種別画像1")) {
			itemType1Index = i;
		}
		if (header[i].equals("種別画像2")) {
			itemType2Index = i;
		}
		if (header[i].equals("種別画像3")) {
			itemType3Index = i;
		}
		if (header[i].equals("種別画像4")) {
			itemType4Index = i;
		}
		if (header[i].equals("種別画像Ex")) {
			itemTypeExIndex = i;
		}
	}
}

function getTableCondColor(cond) {
	for (var i = 0; i < AppConstants.COND_TABLE_COLOR.length; ++i) {
		if (cond >= AppConstants.COND_TABLE[i]) {
			return SWTResourceManager.getColor(AppConstants.COND_TABLE_COLOR[i]);
		}
	}
	// 0より小さいってあり得ないけど
	return SWTResourceManager.getColor(AppConstants.COND_RED_COLOR);
}

function create(table, data, index) {
	// 艦娘
	var ship = data[0].get();
	
	var item = new TableItem(table, SWT.NONE);

	item.setData(ship);

	// 偶数行に背景色を付ける
	if ((index % 2) != 0) {
		item.setBackground(SWTResourceManager.getColor(AppConstants.ROW_BACKGROUND));
	}

	// 疲労
	item.setBackground(condIndex, getTableCondColor(ship.cond));

	// 遠征
	if (missionShips.contains(ship.id)) {
		item.setForeground(SWTResourceManager.getColor(AppConstants.MISSION_COLOR));
	}
	// 入渠
	if (ndockShips.contains(ship.id)) {
		item.setForeground(SWTResourceManager.getColor(AppConstants.NDOCK_COLOR));
	}
	// Lv1の艦娘をグレー色にする
	/* ちょっとこれをやる意味がよく分からないのでコメントアウト
	if (ship.getLv() == 1) {
		item.setForeground(SWTResourceManager.getColor(SWT.COLOR_DARK_GRAY));
	}
	*/
	item.setText(ReportUtils.toStringArray(data));

	/* ここから画像処理 */
	/*
	 * ※注意点
	 * 生成したImageをそのままにしていると、その内メモリ不足を引き起こして落ちるので、
	 * どこかでdispose()してメモリを解放する必要がある
	 */
	if(index == 0){
		//メモリをキー代わりにしてみる(基本的にdispose()しないはずなので、SWTExceptionは起きないはず)
		Arrays.stream(ApplicationMain.main.getShipTables()).filter(function(shiptable){
			return shiptable.shell == table.shell;
		}).forEach(function(shiptable){
			shipTable = shiptable;
		});
		//お風呂に入りたい艦娘
		var bathWaterTableDialog = ApplicationMain.main.getBathwaterTableDialog();
		if(bathWaterTableDialog.shell == table.shell){
			shipTable = bathWaterTableDialog;
		}
		oldImageDtoMap = getData(shipTable + "_ImageDtoMap");
		imageDtoMap = new HashMap(); //HashMap<id,ImageDto>
	}

	//ディープコピー
	var shipDto = new ShipDto(ship.getJson());
	var shipImage = getShipImage(ship);
	var itemList = new ArrayList(shipDto.item2);
	itemList.add(shipDto.slotExItem);
	var itemIconImageList = new ArrayList();
	itemList.forEach(function(item){
		if(item instanceof ItemDto){
			itemIconImageList.add(getItemIconImage(item.type3));
		} else {
			itemIconImageList.add(null);
		}
	});

	var id = ship.id;
	var imageDto;
	if(oldImageDtoMap instanceof Map && oldImageDtoMap.containsKey(id) && oldImageDtoMap.get(id).ShipDto.equals(shipDto)){
		imageDto = oldImageDtoMap.get(id);
		oldImageDtoMap.remove(id);
	} else {
		imageDto = new ImageDto(shipDto,shipImage,itemIconImageList);
	}
	imageDtoMap.put(id,imageDto);

	//画像を貼り付ける
	item.setImage(picIndex, imageDto.ShipImage);
	item.setImage(itemType1Index, imageDto.ItemIconList.get(0));
	item.setImage(itemType2Index, imageDto.ItemIconList.get(1));
	item.setImage(itemType3Index, imageDto.ItemIconList.get(2));
	item.setImage(itemType4Index, imageDto.ItemIconList.get(3));
	//item.setImage(itemTypeExIndex, imageDto.ItemIconList.get(4)); 5スロ目対応分
	item.setImage(itemTypeExIndex, imageDto.ItemIconList.get(5));

	return item;
}

function end() {
	//残った分を廃棄 (こうしないとメモリ不足になって落ちる)
	System.out.print("Image Dispose...");
	try{
		if(shipTable instanceof ShipTable) setTmpData(shipTable + "_ImageDtoMap",imageDtoMap);
		if(oldImageDtoMap instanceof Map){
			oldImageDtoMap.forEach(function(id,imageDto){
				imageDto.dispose();
			});
		}
		System.out.println("Complete.");
	} catch(e) {
		System.out.println("Failed.");
		e.printStackTrace();
	}
	System.out.println("Loading Time ->" + (System.currentTimeMillis() - startTime) + "ms.");
}

function getShipImage(ship){
	var shipImage = _getShipImage(ship);
	var imageSet = new LinkedHashSet();
	//撃沈
	if(ship.isSunk()){
		imageSet.add(new Image(Display.getDefault(), shipImage, SWT.IMAGE_GRAY));
		imageSet.add(getSunkImage());
	} else {
	    imageSet.add(shipImage);
		imageSet.add(getStateImage(ship));
		imageSet.add(getCondImage(ship.cond));
		imageSet.add(getWeddingImage(ship.lv));
	}
	return resize(imageSet,IMAGE_SIZE.WIDTH,IMAGE_SIZE.HEIGHT);
}

/**
 * 画像をリサイズして返します。
 * 
 * @param imageSet java.util.Set<org.eclipse.swt.graphics.Image>
 * @param width int
 * @param height int
 * @return scaled org.eclipse.swt.graphics.Image
 */
function resize(imageSet,width,height){
	var scaled = new Image(Display.getDefault(), width, height);
	var gc = new GC(scaled);
	gc.setAntialias(SWT.ON);
	gc.setInterpolation(SWT.HIGH);
	imageSet.stream().filter(function(image){
		return image instanceof Image;
	}).forEach(function(image){
		gc.drawImage(image, 0, 0, image.getBounds().width, image.getBounds().height, 0, 0, width, height);
	});
	gc.dispose();
	return scaled;
}

var ImageFilter = new FilenameFilter(function(dir,name){
	var index = name.lastIndexOf(".");
	var ext = name.substring(index+1).toLowerCase();
	//画像
	return ext.equals("jpg") || name.equals("jpeg") || name.endsWith("png");
});

function getWebImage(uri,path){
	try{
		var url = new URL(uri);
		System.out.println("Connect -> " + url.toString());
		var urlConnection = HttpURLConnection.class.cast(url.openConnection());
		urlConnection.connect();
		System.out.println("HTTP Status Code:" + urlConnection.getResponseCode());
		System.out.print("Data Acquisition...");
		if(urlConnection.getResponseCode() == HttpURLConnection.HTTP_OK){
			var file = Paths.get(path);
			//元からファイルが無い前提なので上書き設定は無し
			Files.copy(urlConnection.getInputStream(), file);
			System.out.println("Complete.");
			System.out.println("Save location ->" + file.toString());
			return new Image(Display.getDefault(),file.toString());
		} else {
			System.out.print("Failed:");
			System.out.println(urlConnection.getResponseMessage() + "(" + urlConnection.getResponseCode() + ").");
		}
	} catch(e) {
		e.printStackTrace();
	}
	return null;
}

function getCondImage(cond){
    if (cond < 20) return getRedCondImage();    //赤疲労
	if (cond < 30) return getOrangeCondImage(); //橙疲労
	if (cond > 49) return getKiraCondImage();   //キラ
	return null;
}

function getSunkImage(){
    return getLayerImage("Sunk", SUNK_IMAGE_URL);
}

function getRedCondImage(){
    return getLayerImage("Red", RED_COND_IMAGE_URL);
}

function getOrangeCondImage() {
    return getLayerImage("Orange", ORANGE_COND_IMAGE_URL);
}

function getKiraCondImage(){
    return getLayerImage("Kira", KIRA_COND_IMAGE_URL);
}

function getWeddingImage(lv) {
    if (lv > 99) return _getWeddingImage();
    return null;
}

function _getWeddingImage() {
    return getLayerImage("Wedding", WEDDING_IMAGE_URL);
}

function getStateImage(ship) {
	if (ndockShips.contains(ship.id))   return getRepairImage();  //入渠
	if (missionShips.contains(ship.id)) return getMissionImage(); //遠征
    if (ship.isBadlyDamage())           return getBadlyImage();   //大破
    if (ship.isHalfDamage())            return getHalfImage();    //中破
    if (ship.isSlightDamage())          return getSlightImage();  //小破
    return null;
}

function getRepairImage() {
    return getLayerImage("Repair", REPAIR_IMAGE_URL);
}

function getMissionImage() {
    return getLayerImage("Mission", MISSION_IMAGE_URL);
}

function getBadlyImage() {
	var imageSet = new LinkedHashSet();
    imageSet.add(getLayerImage("Badly", BADLY_IMAGE_URL));
	imageSet.add(getLayerImage("BadlySmoke", BADLY_SMOKE_IMAGE_URL));
	return resize(imageSet,IMAGE_SIZE.WIDTH,IMAGE_SIZE.HEIGHT);
}

function getHalfImage() {
	var imageSet = new LinkedHashSet();
    imageSet.add(getLayerImage("Half", HALF_IMAGE_URL));
	imageSet.add(getLayerImage("HalfSmoke", HALF_SMOKE_IMAGE_URL));
	return resize(imageSet,IMAGE_SIZE.WIDTH,IMAGE_SIZE.HEIGHT);
}

function getSlightImage() {
	var imageSet = new LinkedHashSet();
    imageSet.add(getLayerImage("Slight", SLIGHT_IMAGE_URL));
	imageSet.add(getLayerImage("SlightSmoke", SLIGHT_SMOKE_IMAGE_URL));
	return resize(imageSet,IMAGE_SIZE.WIDTH,IMAGE_SIZE.HEIGHT);
}

function getLayerImage(name, url) {
    var image = getData("LAYER_" + name + ".png");
    if (!(image instanceof Image)) {
        image = getWebImage(url, (SHIP_LAYER_IMAGE_DIR + name + ".png"));
        setTmpData("LAYER_" + name + ".png", image);
    }
    return image;
}

function _getShipImage(ship) {
	var shipId = ship.shipId;
	var prefix;
	var url;
	var dir;
	if(!ship.isHalfDamage()){
		prefix = "NORMAL_";
		url = SHIP_NORMAL_IMAGE_URL + shipId + ".jpg";
		dir = SHIP_NORMAL_IMAGE_DIR + shipId + ".jpg";
	} else {
		prefix = "DAMAGE_";
		url = SHIP_DAMAGE_IMAGE_URL + shipId + ".jpg";
		dir = SHIP_DAMAGE_IMAGE_DIR + shipId + ".jpg";
	}
    var image  = getData(prefix + shipId + ".jpg");
    if (!(image instanceof Image)) {
        image = getWebImage(url, dir);
        setTmpData(prefix + shipId + ".jpg", image);
    }
    return image;
}

function getItemIconImage(type3){
	var imageSet = new HashSet();
    var image  = getData("ITEM_ICON_" + type3 + ".png");
    if (!(image instanceof Image)) {
        image = getWebImage(ITEM_ICON_IMAGE_URL + type3 + ".png", (ITEM_ICON_IMAGE_DIR + type3 + ".png"));
        setTmpData("ITEM_ICON_" + type3 + ".png", image);
    }
	imageSet.add(image);
    return resize(imageSet,IMAGE_SIZE.WIDTH,IMAGE_SIZE.HEIGHT);
}

/**
 * @param shipDto logbook.dto.ShipDto
 * @param shipImage org.eclipse.swt.graphics.Image
 * @param itemIconList java.util.List<org.eclipse.swt.graphics.Image>(5)
 */
var ImageDto = function(shipDto,shipImage,itemIconList){
	this.ShipDto      = shipDto;
	this.ShipImage    = shipImage;
	this.ItemIconList = itemIconList;
};

ImageDto.prototype.dispose = function(){
	if(!this.ShipImage.isDisposed()) this.ShipImage.dispose();
	this.ItemIconList.stream().filter(function(itemIcon){
		return itemIcon instanceof Image && !itemIcon.isDisposed();
	}).forEach(function(itemIcon){
		print(itemIcon);
		itemIcon.dispose();
	});
	this.ShipDto = this.ShipImage = this.ItemIconList = null;
};