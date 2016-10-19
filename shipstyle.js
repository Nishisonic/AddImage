/*
 * 画像追加 Ver2.0.5
 * Author:Nishisonic,Nekopanda
 * LastUpdate:2016/10/18
 * 
 * 所有艦娘一覧に画像を追加します。
 */

load("script/ScriptData.js");

Color              = Java.type("org.eclipse.swt.graphics.Color");
Display            = Java.type("org.eclipse.swt.widgets.Display");
Event              = Java.type("org.eclipse.swt.widgets.Event");
FillLayout         = Java.type("org.eclipse.swt.layout.FillLayout");
GC                 = Java.type("org.eclipse.swt.graphics.GC");
Image              = Java.type("org.eclipse.swt.graphics.Image");
Label              = Java.type("org.eclipse.swt.widgets.Label");
Listener           = Java.type("org.eclipse.swt.widgets.Listener");
Point              = Java.type("org.eclipse.swt.graphics.Point");
RGB                = Java.type("org.eclipse.swt.graphics.RGB");
Shell              = Java.type("org.eclipse.swt.widgets.Shell");
SWT                = Java.type("org.eclipse.swt.SWT");
SWTResourceManager = Java.type("org.eclipse.wb.swt.SWTResourceManager");
TableItem          = Java.type("org.eclipse.swt.widgets.TableItem");

ArrayList          = Java.type("java.util.ArrayList");
Arrays             = Java.type("java.util.Arrays");
Collections        = Java.type("java.util.Collections");
DecimalFormat      = Java.type("java.text.DecimalFormat");
File               = Java.type("java.io.File");
FilenameFilter     = Java.type("java.io.FilenameFilter");
Files              = Java.type("java.nio.file.Files");
HashMap            = Java.type("java.util.HashMap");
HttpURLConnection  = Java.type("java.net.HttpURLConnection");
IntStream          = Java.type("java.util.stream.IntStream");
LinkedHashSet      = Java.type("java.util.LinkedHashSet"); 
Map                = Java.type("java.util.Map");
Paths              = Java.type("java.nio.file.Paths");
Runtime            = Java.type("java.lang.Runtime");
System             = Java.type("java.lang.System");
URL                = Java.type("java.net.URL");

JsonObject         = Java.type("javax.json.JsonObject");

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
var IMAGE_SIZE             = { WIDTH:80,HEIGHT:20 };
var SHIP_LAYER_IMAGE_DIR   = "./script/Image/Layer/";
var SHIP_NORMAL_IMAGE_DIR  = "./script/Image/Ship/Normal/";
var SHIP_DAMAGE_IMAGE_DIR  = "./script/Image/Ship/Damage/";
var ITEM_ICON_IMAGE_DIR    = "./script/Image/Item/Icon/";
var SUNK_IMAGE_URL         = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Sunk.png";
var RED_COND_IMAGE_URL     = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Red.png";
var ORANGE_COND_IMAGE_URL  = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Orange.png";
var KIRA_COND_IMAGE_URL    = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Kira.png";
var WEDDING_IMAGE_URL      = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Wedding.png";
var MISSION_IMAGE_URL      = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Mission.png";
var REPAIR_IMAGE_URL       = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Repair.png";
var SHIP_NORMAL_IMAGE_URL  = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Ship/Normal/";
var SHIP_DAMAGE_IMAGE_URL  = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Ship/Damage/";
var ITEM_ICON_IMAGE_URL    = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Item/Icon/";
var BADLY_IMAGE_URL        = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Badly.png";
var BADLY_SMOKE_IMAGE_URL  = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/BadlySmoke.png";
var BADLY_IMAGE_URL        = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Badly.png";
var BADLY_SMOKE_IMAGE_URL  = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/BadlySmoke.png";
var HALF_IMAGE_URL         = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Half.png";
var HALF_SMOKE_IMAGE_URL   = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/HalfSmoke.png";
var SLIGHT_IMAGE_URL       = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Slight.png";
var SLIGHT_SMOKE_IMAGE_URL = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/SlightSmoke.png";
var ALV_COLOR              = [new RGB(255,255,255),
							  new RGB(152,180,205),
							  new RGB(152,180,205),
							  new RGB(152,180,205),
							  new RGB(213,161, 55),
							  new RGB(213,161, 55),
							  new RGB(213,161, 55),
							  new RGB(213,161, 55),
							];
var LV_COLOR               = [new RGB(255,255,255),
							  new RGB( 69,169,165),
							  new RGB( 69,169,165),
							  new RGB( 69,169,165),
							  new RGB( 69,169,165),
							  new RGB( 69,169,165),
							  new RGB( 69,169,165),
							  new RGB( 69,169,165),
							  new RGB( 69,169,165),
							  new RGB( 69,169,165),
							  new RGB( 69,169,165),
							];
var HP_PROGRESS_COLOR     = {GAUGE_EMPTY:new RGB(0xff, 0, 0),
							 GAUGE_HALF:new RGB(0xff, 0xd7, 0),
							 GAUGE_FULL:new RGB(0, 0xd7, 0),
							};
var FUEL_PROGRESS_COLOR   = new RGB(0x00, 0x60, 0x00);
var AMMO_PROGRESS_COLOR   = new RGB(0x56, 0x23, 0x00);
//var LV_PROGRESS_COLOR     = new RGB(0, 0x80, 0xff);
var NEXT_PROGRESS_COLOR   = new RGB(0, 0x80, 0xff);
var EXP_PROGRESS_COLOR    = {MARRIED:new RGB(0xff, 0x80, 0),
							 NOT_MARRIED:new RGB(0, 0x80, 0xff)};
//列番号
var condIndex       = 12;
var picIndex        = -1;
var columnIndex     = -1;
var itemType1Index  = -1;
var itemType2Index  = -1;
var itemType3Index  = -1;
var itemType4Index  = -1;
var itemTypeExIndex = -1;
var hpIndex         = -1;
var fuelIndex       = -1;
var ammoIndex       = -1;
//var lvIndex         = -1;
var nextIndex       = -1;
var expIndex        = -1;
//変数
var shipTable       = null;
var oldPaintDtoMap  = null;
var paintDtoMap     = null;
var tip             = null;
var label           = null;

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
				setTmpData("LAYER_" + file.getName(),SWTResourceManager.getImage(file.toString()));
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
				setTmpData("NORMAL_" + file.getName(),SWTResourceManager.getImage(file.toString()));
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
				setTmpData("DAMAGE_" + file.getName(),SWTResourceManager.getImage(file.toString()));
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
				setTmpData("ITEM_ICON_" + file.getName(),SWTResourceManager.getImage(file.toString()));
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
		if (header[i].equals("疲労"))            condIndex = i;
		if (header[i].equals("画像"))            picIndex = i;
		if (header[i].equals("種別画像1"))       itemType1Index = i;
		if (header[i].equals("種別画像2"))       itemType2Index = i;
		if (header[i].equals("種別画像3"))       itemType3Index = i;
		if (header[i].equals("種別画像4"))       itemType4Index = i;
		//if (header[i].equals("種別画像5"))     itemType5Index = i;
		if (header[i].equals("種別画像Ex"))      itemTypeExIndex = i;
		if (header[i].equals("HP"))              hpIndex = i;
		if (header[i].equals("燃料#現在の燃料")) fuelIndex = i;
		if (header[i].equals("弾薬#現在の弾薬")) ammoIndex = i;
		//if (header[i].equals("Lv"))              lvIndex = i;
		if (header[i].equals("Next"))            nextIndex = i;
		if (header[i].equals("経験値"))          expIndex = i;
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
	if(index == 0) setTableListener(table);
	// 艦娘
	var ship = data[0].get();
	
	var item = new TableItem(table, SWT.NONE);

	// 偶数行に背景色を付ける
	//if ((index % 2) != 0) {
	//	item.setBackground(SWTResourceManager.getColor(AppConstants.ROW_BACKGROUND));
	//}

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
		oldPaintDtoMap = getData(shipTable + "_PaintDtoMap");
		paintDtoMap = new HashMap(); //HashMap<id,PaintDto>
	}

	var id = ship.id;
	var json = ship.json;
	var shipDtoEx;
	if(json instanceof JsonObject){
		shipDtoEx = new ShipDtoEx(new ShipDto(json),missionShips.contains(id),ndockShips.contains(id));
	} else {
		shipDtoEx = new ShipDtoEx(null,missionShips.contains(id),ndockShips.contains(id));
	}
	var paintDto;
	if(oldPaintDtoMap instanceof Map && oldPaintDtoMap.containsKey(id) && oldPaintDtoMap.get(id).ShipDtoEx.equals(shipDtoEx)){
		paintDto = oldPaintDtoMap.get(id);
		oldPaintDtoMap.remove(id);
	} else if(shipDtoEx.ShipDto instanceof ShipDto) {
		var shipImage = getSynthesisShipImage(ship);
		var item2List = new ArrayList(shipDtoEx.ShipDto.item2);
		item2List.add(shipDtoEx.ShipDto.slotExItem);
		var itemIconImageList = new ArrayList();
		item2List.forEach(function(item2){
			if(item2 instanceof ItemDto){
				itemIconImageList.add(getSynthesisItemIconImage(item2));
			} else {
				itemIconImageList.add(null);
			}
		});
		paintDto = new PaintDto(shipDtoEx,shipImage,itemIconImageList);
	} else { //新規艦取得時限定…多分
		var shipImage = getSynthesisShipImage(ship);
		var itemIconImageList = new ArrayList(); //取得しているか曖昧なので空で作成
		Collections.addAll(itemIconImageList, null, null, null, null, null, null); //1~5スロ目+補強増設分
		paintDto = new PaintDto(shipDtoEx,shipImage,itemIconImageList,null,null,null,null,null,null); 
	}
	if(paintDtoMap instanceof Map) paintDtoMap.put(id,paintDto);

	//画像を貼り付ける
	item.setImage(picIndex, paintDto.ShipImage);
	item.setImage(itemType1Index, paintDto.ItemIconList.get(0));
	item.setImage(itemType2Index, paintDto.ItemIconList.get(1));
	item.setImage(itemType3Index, paintDto.ItemIconList.get(2));
	item.setImage(itemType4Index, paintDto.ItemIconList.get(3));
	//item.setImage(itemType5Index, paintDto.ItemIconList.get(4)); 5スロ目対応分
	item.setImage(itemTypeExIndex, paintDto.ItemIconList.get(5));

	//ツールチップ処理

	var TableListener = new Listener(function(event) {
		switch (event.type) {
			case SWT.Dispose:
			case SWT.KeyDown:
			case SWT.MouseMove: {
				if (tip == null) break;
				tip.dispose();
				tip = null;
				label = null;
				break;
			}
			case SWT.MouseHover: {
				var point = new Point(event.x, event.y);
				var item = table.getItem(point);
				var columnIndex = getColumnIndex(point,item);
				var itemName = getItemName(columnIndex,item);
				if (item != null && itemName != null) {
					if (tip != null && !tip.isDisposed()) tip.dispose();
					tip = new Shell(table.getShell(), SWT.ON_TOP | SWT.TOOL);
					tip.setLayout(new FillLayout());
					label = new Label (tip, SWT.NONE);
					label.setData ("_TABLEITEM", item);
					var itemName = getItemName(columnIndex,item);
					label.setText (getItemName(columnIndex,item));
					label.addListener (SWT.MouseExit, LabelListener);
					label.addListener (SWT.MouseDown, LabelListener);
					var size = tip.computeSize (SWT.DEFAULT, SWT.DEFAULT);
					var pt = table.toDisplay (event.x, event.y);
					tip.setBounds (pt.x + 15, pt.y + 5, size.x, size.y);
					tip.setVisible (true);
				}
			}
        }
	});
	
	var LabelListener = new Listener(function(event){
		var shell = label.getShell();
		switch (event.type){
			case SWT.MouseDown:
				var e = new Event();
				e.item = TableItem.class.cast(label.getData("_TABLEITEM"));
				table.notifyListeners(SWT.Selection, e);
				table.setFocus();
			case SWT.MouseExit:
				shell.dispose();
		}
	});

	item.setData(ship);

	if(typeof getData(shipTable + "_set") !== 'boolean'){
		table.setToolTipText("");
		table.addListener(SWT.Dispose, TableListener);
    	table.addListener(SWT.KeyDown, TableListener);
    	table.addListener(SWT.MouseMove, TableListener);
    	table.addListener(SWT.MouseHover, TableListener);
		//table.addListener(SWT.EraseItem, PaintHandler);
		setTmpData(shipTable + "_set",true);
	}

	return item;
}

function end() {
	System.out.print("Image Dispose...");
	try{
		//次回読み込み短縮のために一時保存
		if(shipTable instanceof ShipTable) setTmpData(shipTable + "_PaintDtoMap",paintDtoMap);
		//残った分を廃棄 (こうしないとメモリ不足になって落ちる)
		if(oldPaintDtoMap instanceof Map){
			oldPaintDtoMap.forEach(function(id,paintDto){
				paintDto.dispose();
				paintDto = null;
			});
		}
		oldPaintDtoMap = null;
		System.out.println("Complete.");
	} catch(e) {
		System.out.println("Failed.");
		e.printStackTrace();
	}
	System.out.println("Loading Time ->" + (System.currentTimeMillis() - startTime) + "ms.");
	dispMemoryInfo();
}

function getSynthesisShipImage(ship,width,height){
	var width = typeof width !== 'undefined' ?  width : IMAGE_SIZE.WIDTH;
	var height = typeof height !== 'undefined' ?  height : IMAGE_SIZE.HEIGHT;
	var shipImage = getShipImage(ship);
	var imageSet = new LinkedHashSet();
	//撃沈
	if(ship.isSunk()){
		imageSet.add(new Image(Display.getDefault(), shipImage, SWT.IMAGE_GRAY));
		imageSet.add(getSunkImage());
	} else {
	    imageSet.add(shipImage);
		imageSet.add(getStateImage(ship));
		imageSet.add(getSmokeImage(ship));
		imageSet.add(getCondImage(ship.cond));
		imageSet.add(getWeddingImage(ship.lv));
	}
	return resize(imageSet,width,height);
}

function getSynthesisItemIconImage(item2,width,height){
	var width = typeof width !== 'undefined' ?  width : IMAGE_SIZE.WIDTH;
	var height = typeof height !== 'undefined' ?  height : IMAGE_SIZE.HEIGHT;
	var itemIconImage = getItemIconImage(item2.type3);
	var alv = item2.alv; //熟練度
	var alvText = function(alv){ //即時関数
		switch(alv){
			case 0: return "";
			case 1: return "|";
			case 2: return "||";
			case 3: return "|||";
			case 4: return "\\";
			case 5: return "\\\\";
			case 6: return "\\\\\\";
			case 7: return ">>";
    	}
	}(alv);
	var alvFont = SWTResourceManager.getFont("Arial", 7, SWT.BOLD);
	var alvColor = SWTResourceManager.getColor(ALV_COLOR[alv]);
	var lv = item2.level; //改修値
	var lvText = function(lv){ //即時関数
		switch(lv){
			case 0: return "";
			case 1: return "★+1";
			case 2: return "★+2";
			case 3: return "★+3";
			case 4: return "★+4";
			case 5: return "★+5";
			case 6: return "★+6";
			case 7: return "★+7";
			case 8: return "★+8";
			case 9: return "★+9";
			case 10:return "★ma x";
    	}
	}(lv);
	var lvFont = SWTResourceManager.getFont("Arial", 7, SWT.NORMAL);
	var lvColor = SWTResourceManager.getColor(LV_COLOR[lv]);
	//合成処理
	var scaled = new Image(Display.getDefault(), width, height);
	var gc = new GC(scaled);
	gc.setAntialias(SWT.ON);
	gc.setInterpolation(SWT.HIGH);
	gc.drawImage(itemIconImage, 0, 0, itemIconImage.getBounds().width, itemIconImage.getBounds().height, 0, 0, width, height);
    gc.setFont(alvFont);
	gc.setForeground(alvColor);
	gc.drawString(alvText, 23, 0);
    gc.setFont(lvFont);
	gc.setForeground(lvColor);
	gc.drawString(lvText, 21, 10);
	gc.dispose();
	//font.dispose();
	//alvColor.dispose();
	//lvColor.dispose();
	return scaled;
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
			return SWTResourceManager.getImage(file.toString());
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
    if (lv > 99) return getLayerImage("Wedding", WEDDING_IMAGE_URL);
    return null;
}

function getStateImage(ship) {
	if (ndockShips.contains(ship.id))   return getRepairImage();  //入渠
	if (missionShips.contains(ship.id)) return getMissionImage(); //遠征
    if (ship.isBadlyDamage())           return getBadlyImage();   //大破
    if (ship.isHalfDamage())            return getHalfImage();    //中破
    if (ship.isSlightDamage())          return getSlightImage();  //小破
    return null;
}

//一時対処
function getSmokeImage(ship) {
	if(!(ndockShips.contains(ship.id) || missionShips.contains(ship.id))){
    	if (ship.isBadlyDamage())  return getBadlySmokeImage();   //大破
    	if (ship.isHalfDamage())   return getHalfSmokeImage();    //中破
	    if (ship.isSlightDamage()) return getSlightSmokeImage();  //小破
	}
    return null;
}

function getRepairImage() {
    return getLayerImage("Repair", REPAIR_IMAGE_URL);
}

function getMissionImage() {
    return getLayerImage("Mission", MISSION_IMAGE_URL);
}

function getBadlyImage() {
	return getLayerImage("Badly", BADLY_IMAGE_URL);
}

function getBadlySmokeImage() {
	return getLayerImage("BadlySmoke", BADLY_SMOKE_IMAGE_URL);
}

function getHalfImage() {
	return getLayerImage("Half", HALF_IMAGE_URL);
}

function getHalfSmokeImage() {
	return getLayerImage("HalfSmoke", HALF_SMOKE_IMAGE_URL);
}

function getSlightImage() {
	return getLayerImage("Slight", SLIGHT_IMAGE_URL);
}

function getSlightSmokeImage() {
	return getLayerImage("SlightSmoke", SLIGHT_SMOKE_IMAGE_URL);
}

function getLayerImage(name, url) {
    var image = getData("LAYER_" + name + ".png");
    if (!(image instanceof Image)) {
        image = getWebImage(url, (SHIP_LAYER_IMAGE_DIR + name + ".png"));
        setTmpData("LAYER_" + name + ".png", image);
    }
    return image;
}

function getShipImage(ship) {
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
    var image  = getData("ITEM_ICON_" + type3 + ".png");
    if (!(image instanceof Image)) {
        image = getWebImage(ITEM_ICON_IMAGE_URL + type3 + ".png", (ITEM_ICON_IMAGE_DIR + type3 + ".png"));
        setTmpData("ITEM_ICON_" + type3 + ".png", image);
    }
    return image;
}

/**
 * @param shipDtoEx 
 * @param shipImage org.eclipse.swt.graphics.Image
 * @param itemIconList java.util.List<org.eclipse.swt.graphics.Image>(5)
 */
var PaintDto = function(shipDtoEx,shipImage,itemIconList,hpProgress,fuelProgress,ammoProgress,lvProgress,nextProgress,expProgress){
	this.ShipDtoEx    = shipDtoEx;
	this.ShipImage    = shipImage;
	this.ItemIconList = itemIconList;
	this.HpProgress   = hpProgress;
	this.FuelProgress = fuelProgress;
	this.AmmoProgress = ammoProgress;
	this.LvProgress   = lvProgress;
	this.NextProgress = nextProgress;
	this.ExpProgress  = expProgress;
};

PaintDto.prototype.dispose = function(){
	if(!this.ShipImage.isDisposed()) this.ShipImage.dispose();
	this.ItemIconList.stream().filter(function(itemIcon){
		return itemIcon instanceof Image && !itemIcon.isDisposed();
	}).forEach(function(itemIcon){
		itemIcon.dispose();
	});
	this.ShipDtoEx = this.ShipImage = this.ItemIconList = this.HpProgress = this.FuelProgress = this.AmmoProgress = this.LvProgress = this.NextProgress = this.ExpProgress = null;
};

function ShipDtoEx(shipDto,isMission,isNdock){
	this.ShipDto = shipDto;
	this.isMission = isMission;
	this.isNdock = isNdock;
}

ShipDtoEx.prototype.equals = function(shipDtoEx){
	return this.ShipDto instanceof ShipDto && this.ShipDto.equals(shipDtoEx.ShipDto) && this.isMission == shipDtoEx.isMission && this.isNdock == shipDtoEx.isNdock;
};

function dispMemoryInfo(){
    var f1 = new DecimalFormat("#,###KB");
    var f2 = new DecimalFormat("##.#");
    var free = Runtime.getRuntime().freeMemory() / 1024;
    var total = Runtime.getRuntime().totalMemory() / 1024;
    var max = Runtime.getRuntime().maxMemory() / 1024;
    var used = total - free;
    var ratio = used * 100 / total;
    System.out.println("Java Memory Info : " + 
		"Total=" + f1.format(total) + "," +
    	"Used Memory=" + f1.format(used) + " (" + f2.format(ratio) + "%)," +
    	"Max Can Use Memory="+f1.format(max));
}

function getColumnIndex(pt,item){
	if(item instanceof TableItem){
		var columns = item.getParent().getColumnCount();
		return IntStream.range(0,columns).filter(function(index){
			var rect = item.getBounds(index);
			return pt.x >= rect.x && pt.x < rect.x + rect.width;
		}).findFirst().orElse(-1);
	}
	return -1;
}

function getItemName(index,ship){
	var itemDto;
	switch(index){
		case itemType1Index:
			itemDto = ship.data.item2.get(0);
			break;
		case itemType2Index: 
			itemDto = ship.data.item2.get(1);
			break;
		case itemType3Index: 
			itemDto = ship.data.item2.get(2);
			break;
		case itemType4Index: 
			itemDto = ship.data.item2.get(3);
			break;
		//case itemType5Index: 
		//	itemDto = ship.data.item2.get(4);
		//	break;
		case itemTypeExIndex: 
			itemDto = ship.data.slotExItem;
			break;
		default: return null;
	}
	return itemDto instanceof ItemDto ? itemDto.name : null;
}


var PaintHandler = new Listener(function(event) {
	var ship = event.item.data;
	var gc = event.gc;
	var old = gc.background;
	var rate = function(index){
		switch(index){
			case hpIndex:   return ship.nowhp / ship.maxhp;
			case fuelIndex: return ship.fuel / ship.fuelMax;
			case ammoIndex: return ship.bull / ship.bullMax;
			//case lvIndex:   return ship.lv > 99 ? ship.lv / 155 : ship.lv / 99;
			case nextIndex: return ship.expraito;
			case expIndex:  return ship.lv > 99 ? ship.exp / 4470000 : ship.exp / 1000000;
			default:        return null;
		}
	}(event.index);
	// 背景を描く
	// 進捗バーを消す場合、下のcase文を消すことで非表示に出来る
	var bgColor = function(index){
		switch(index){
			case hpIndex:   return SWTResourceManager.getColor(gradation(rate,[HP_PROGRESS_COLOR.GAUGE_EMPTY,HP_PROGRESS_COLOR.GAUGE_HALF,HP_PROGRESS_COLOR.GAUGE_FULL]));
			case fuelIndex: return SWTResourceManager.getColor(FUEL_PROGRESS_COLOR);
			case ammoIndex: return SWTResourceManager.getColor(AMMO_PROGRESS_COLOR);
			//case lvIndex:   return SWTResourceManager.getColor(LV_PROGRESS_COLOR);
			case nextIndex: return SWTResourceManager.getColor(NEXT_PROGRESS_COLOR);
			case expIndex:  return ship.lv > 99 ? SWTResourceManager.getColor(EXP_PROGRESS_COLOR.MARRIED) : SWTResourceManager.getColor(EXP_PROGRESS_COLOR.NOT_MARRIED);
			default:        return null;
		}
	}(event.index);

	if(bgColor instanceof Color){
		// 進捗を描く
		// バーを下 1/5 に表示する
		gc.setBackground(bgColor);
		var y = event.y + event.height * 4 / 5;
		// はみ出した部分はクリッピングされるので高さはそのままでいい
		gc.fillRectangle(event.x, y, event.width * rate, event.height);
	}
	gc.setBackground(old);
	event.detail &= ~SWT.BACKGROUND;
});

/**
 * 複数の色の中間色を取得する(nashorn用に改造)
 */
function gradation(raito, start, end) {
	if(end === undefined){
		var rgbs = start;
		if (raito <= 0.0) {
			return rgbs[0];
		}
		if (raito >= 1.0) {
			return rgbs[rgbs.length - 1];
		}
		var length = rgbs.length - 1;

		// 開始色
		var start = Math.floor(length * raito);
		// 終了色
		var end = start + 1;
		// 開始色と終了色の割合を算出
		var startPer = start / length;
		var endPer =  end / length;
		var subPer = (raito - startPer) / (endPer - startPer);
		return gradation(subPer, rgbs[start], rgbs[end]);
	} else {
		var r = Math.floor(start.red + ((end.red - start.red) * raito));
		var g = Math.floor(start.green + ((end.green - start.green) * raito));
		var b = Math.floor(start.blue + ((end.blue - start.blue) * raito));
		return new RGB(r|0, g|0, b|0);
	}
}

function setTableListener(table){
	listener = getData("phandler");
	if(listener instanceof Listener) {
		table.removeListener(SWT.EraseItem, listener);
	}
	table.addListener(SWT.EraseItem, PaintHandler);
	setTmpData("phandler", PaintHandler);
}