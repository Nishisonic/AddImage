/**
 * 画像追加 Ver2.1.0
 * Author:Nishisonic,Nekopanda
 * LastUpdate:2016/10/27
 * 
 * 所有艦娘一覧に画像を追加します。
 */

load("script/ScriptData.js");

Color               = Java.type("org.eclipse.swt.graphics.Color");
Display             = Java.type("org.eclipse.swt.widgets.Display");
Event               = Java.type("org.eclipse.swt.widgets.Event");
FillLayout          = Java.type("org.eclipse.swt.layout.FillLayout");
GC                  = Java.type("org.eclipse.swt.graphics.GC");
Image               = Java.type("org.eclipse.swt.graphics.Image");
Label               = Java.type("org.eclipse.swt.widgets.Label");
Listener            = Java.type("org.eclipse.swt.widgets.Listener");
Point               = Java.type("org.eclipse.swt.graphics.Point");
RGB                 = Java.type("org.eclipse.swt.graphics.RGB");
Shell               = Java.type("org.eclipse.swt.widgets.Shell");
SWT                 = Java.type("org.eclipse.swt.SWT");
TableItem           = Java.type("org.eclipse.swt.widgets.TableItem");
SWTResourceManager  = Java.type("org.eclipse.wb.swt.SWTResourceManager");

File                = Java.type("java.io.File");
FilenameFilter      = Java.type("java.io.FilenameFilter");
HttpURLConnection   = Java.type("java.net.HttpURLConnection");
URL                 = Java.type("java.net.URL");
Files               = Java.type("java.nio.file.Files");
Paths               = Java.type("java.nio.file.Paths");
ArrayList           = Java.type("java.util.ArrayList");
Arrays              = Java.type("java.util.Arrays");
Collections         = Java.type("java.util.Collections");
HashMap             = Java.type("java.util.HashMap");
IntStream           = Java.type("java.util.stream.IntStream");
LinkedHashSet       = Java.type("java.util.LinkedHashSet"); 
Map                 = Java.type("java.util.Map");

JsonObject          = Java.type("javax.json.JsonObject");

AppConstants        = Java.type("logbook.constants.AppConstants");
GlobalContext       = Java.type("logbook.data.context.GlobalContext");
ItemDto             = Java.type("logbook.dto.ItemDto");
ShipDto             = Java.type("logbook.dto.ShipDto");
ApplicationMain     = Java.type("logbook.gui.ApplicationMain");
AbstractTableDialog = Java.type("logbook.gui.AbstractTableDialog");
ShipTable           = Java.type("logbook.gui.ShipTable");
ReportUtils         = Java.type("logbook.util.ReportUtils");

data_prefix = "ShipStyleImageVer2_";

//定数
var IMAGE_SIZE             = { WIDTH:80,HEIGHT:20 };
var SHIP_LAYER_IMAGE_DIR   = "./script/Image/Layer/";
var NORMAL_SHIP_IMAGE_DIR  = "./script/Image/Ship/Normal/";
var DAMAGED_SHIP_IMAGE_DIR = "./script/Image/Ship/Damaged/";
var ITEM_ICON_IMAGE_DIR    = "./script/Image/Item/Icon/";
var SUNK_IMAGE_URL         = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Sunk.png";
var RED_COND_IMAGE_URL     = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Red.png";
var ORANGE_COND_IMAGE_URL  = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Orange.png";
var KIRA_COND_IMAGE_URL    = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Kira.png";
var WEDDING_IMAGE_URL      = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Wedding.png";
var MISSION_IMAGE_URL      = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Mission.png";
var REPAIR_IMAGE_URL       = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Repair.png";
var NORMAL_SHIP_IMAGE_URL  = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Ship/Normal/";
var DAMAGED_SHIP_IMAGE_URL = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Ship/Damaged/";
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
//var lvIndex       = -1;
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

/**
 * テーブルリロード時に行作成前に呼び出されます。
 * 
 * @param {java.lang.String[]} header テーブルのヘッダ
 */
function begin(header) {
	missionShips = GlobalContext.getMissionShipSet();
	ndockShips = GlobalContext.getNDockShipSet();
	if(!getData("isLoaded")){ //nullはfalse
		loadImage();
		setTmpData("isLoaded",true);
	}
	IntStream.range(0,header.length).forEach(function(i){
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
		//if (header[i].equals("Lv"))            lvIndex = i;
		if (header[i].equals("Next"))            nextIndex = i;
		if (header[i].equals("経験値"))          expIndex = i;
	});
}

/**
 * 艦娘のcond値からcond色を取得します。
 * 
 * @param {Number} cond 艦娘のcond値
 * @return {org.eclipse.swt.graphics.Color} cond色
 */
function getTableCondColor(cond) {
	return IntStream.range(0,AppConstants.COND_TABLE_COLOR.length).filter(function(i){
		return cond >= AppConstants.COND_TABLE[i];
	}).boxed().map(function(i){
		return SWTResourceManager.getColor(AppConstants.COND_TABLE_COLOR[i]);
	}).findFirst().orElse(SWTResourceManager.getColor(AppConstants.COND_RED_COLOR));
}

/**
 * 行作成時に呼び出されます
 * 
 * @param {org.eclipse.swt.widgets.Table} table テーブル
 * @param {java.lang.Comparable[]} data 該当行の項目データ
 * @param {int} index 行番号（上から0始まり）
 * @return {org.eclipse.swt.widgets.TableItem} 作成したTableItem
 */
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
		shipTable = Arrays.stream(ApplicationMain.main.getShipTables()).filter(function(shiptable){
			return shiptable.shell == table.shell;
		}).findFirst().orElse(ApplicationMain.main.getBathwaterTableDialog());
		oldPaintDtoMap = getData(shipTable + "_PaintDtoMap");
		paintDtoMap = new HashMap(); //HashMap<id,PaintDto>
	}

	var id = ship.id;
	var shipDtoEx = new ShipDtoEx(ship,missionShips.contains(id),ndockShips.contains(id));
	var paintDto;
	if(oldPaintDtoMap instanceof Map && oldPaintDtoMap.containsKey(id) && oldPaintDtoMap.get(id).ShipDtoEx.equals(shipDtoEx)){
		paintDto = oldPaintDtoMap.get(id);
		oldPaintDtoMap.remove(id);
	} else {
		var shipImage = getSynthesisShipImage(ship);
		var itemIconImageList = new ArrayList();
		var item2List = new ArrayList(shipDtoEx.ShipDto.item2);
		item2List.add(shipDtoEx.ShipDto.slotExItem);
		item2List.forEach(function(item2){
			itemIconImageList.add(getSynthesisItemIconImage(item2));
		});
		paintDto = new PaintDto(shipDtoEx,shipImage,itemIconImageList);
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

/**
 * テーブルリロード時に行作成が終了したときに呼び出されます。
 */
function end() {
	//次回読み込み短縮のために一時保存
	if(shipTable instanceof AbstractTableDialog) setTmpData(shipTable + "_PaintDtoMap",paintDtoMap);
	if(oldPaintDtoMap instanceof Map){
		oldPaintDtoMap.forEach(function(id,paintDto){
			paintDto.dispose();
			paintDto = null;
		});
	}
	oldPaintDtoMap = null;
}

/**
 * 合成した艦娘の画像を返します。
 * 
 * @param {logbook.dto.ShipDto} ship 艦娘のデータ
 * @param {Number} width 画像の横幅(指定しない場合は80)
 * @param {Number} height 画像の縦幅(指定しない場合は20)
 * @return {org.eclipse.swt.graphics.Image} 合成した画像
 */
function getSynthesisShipImage(ship,width,height){
	if(!(ship instanceof ShipDto)) return null;
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

/**
 * 合成した装備アイコンの画像を返します。
 * 
 * @param {logbook.dto.ItemDto} item2 装備のデータ
 * @param {Number} width 画像の横幅(指定しない場合は80)
 * @param {Number} height 画像の縦幅(指定しない場合は20)
 * @return {org.eclipse.swt.graphics.Image} 合成した画像
 */
function getSynthesisItemIconImage(item2,width,height){
	if(!(item2 instanceof ItemDto)) return null;
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
 * 画像のSetをリサイズ、合成して一つの画像にして返します。
 * 
 * @param {java.util.Set<Image>} imageSet 画像のSet
 * @param {Number} width 画像の横幅
 * @param {Number} height 画像の縦幅
 * @return {org.eclipse.swt.graphics.Image} 合成した画像
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

/**
 * Filter
 */
var ImageFilter = new FilenameFilter(function(dir,name){
	var index = name.lastIndexOf(".");
	var ext = name.substring(index+1).toLowerCase();
	//画像
	return ext.equals("jpg") || name.equals("jpeg") || name.endsWith("png");
});

/**
 * インターネット上から画像を取得します。
 * 
 * @param {String} uri 画像のURL
 * @param {String} path ファイルパス
 * @return {org.eclipse.swt.graphics.Image} 取得した画像
 */
function getWebImage(uri,path){
	var url = new URL(uri);
	var urlConnection = HttpURLConnection.class.cast(url.openConnection());
	urlConnection.connect();
	if(urlConnection.getResponseCode() == HttpURLConnection.HTTP_OK){
		var file = Paths.get(path);
		//元からファイルが無い前提なので上書き設定は無し
		Files.copy(urlConnection.getInputStream(), file);
		return SWTResourceManager.getImage(file.toString());
	}
	return null;
}

/**
 * 艦娘のcond値から疲労の画像を取得します。
 * 
 * @param {logbook.dto.ShipDto} cond 艦娘のcond値
 * @return {org.eclipse.swt.graphics.Image} 疲労の画像(該当しなかった場合はnullを返す)
 */
function getCondImage(cond){
    if (cond < 20) return getRedCondImage();    //赤疲労
	if (cond < 30) return getOrangeCondImage(); //橙疲労
	if (cond > 49) return getKiraCondImage();   //キラ
	return null;
}

/**
 * 撃沈のレイヤー画像を取得します
 * 
 * @return {org.eclipse.swt.graphics.Image} 撃沈のレイヤー画像
 */
function getSunkImage(){
    return getLayerImage("Sunk", SUNK_IMAGE_URL);
}

/**
 * 赤疲労のレイヤー画像を取得します
 * 
 * @return {org.eclipse.swt.graphics.Image} 赤疲労のレイヤー画像
 */
function getRedCondImage(){
    return getLayerImage("Red", RED_COND_IMAGE_URL);
}

/**
 * 橙疲労のレイヤー画像を取得します
 * 
 * @return {org.eclipse.swt.graphics.Image} 橙疲労のレイヤー画像
 */
function getOrangeCondImage() {
    return getLayerImage("Orange", ORANGE_COND_IMAGE_URL);
}

/**
 * キラキラのレイヤー画像を取得します
 * 
 * @return {org.eclipse.swt.graphics.Image} キラのレイヤー画像
 */
function getKiraCondImage(){
    return getLayerImage("Kira", KIRA_COND_IMAGE_URL);
}

/**
 * 指輪のレイヤー画像を取得します
 * 
 * @param {Number} lv 艦娘のレベル
 * @return {org.eclipse.swt.graphics.Image} 指輪のレイヤー画像(満たしていない場合はnull)
 */
function getWeddingImage(lv) {
    if (lv > 99) return getLayerImage("Wedding", WEDDING_IMAGE_URL);
    return null;
}

/**
 * 艦娘の状態から今の状況の画像を取得します(入渠、遠征、大破、中破、小破)。
 * 
 * @param {logbook.dto.ShipDto} ship 艦娘のデータ
 * @return {org.eclipse.swt.graphics.Image} 状態の画像(該当しなかった場合はnullを返す)
 */
function getStateImage(ship) {
	if (ndockShips.contains(ship.id))   return getRepairImage();  //入渠
	if (missionShips.contains(ship.id)) return getMissionImage(); //遠征
    if (ship.isBadlyDamage())           return getBadlyImage();   //大破
    if (ship.isHalfDamage())            return getHalfImage();    //中破
    if (ship.isSlightDamage())          return getSlightImage();  //小破
    return null;
}

/**
 * 艦娘の状態から煙の画像を取得します。
 * 
 * @param {logbook.dto.ShipDto} ship 艦娘のデータ
 * @return {org.eclipse.swt.graphics.Image} 煙の画像(該当しなかった場合はnullを返す)
 */
function getSmokeImage(ship) {
	if(!(ndockShips.contains(ship.id) || missionShips.contains(ship.id))){
    	if (ship.isBadlyDamage())  return getBadlySmokeImage();   //大破
    	if (ship.isHalfDamage())   return getHalfSmokeImage();    //中破
	    if (ship.isSlightDamage()) return getSlightSmokeImage();  //小破
	}
    return null;
}

/**
 * 修復のレイヤー画像を取得します。
 * 
 * @return {org.eclipse.swt.graphics.Image} 修復のレイヤー画像
 */
function getRepairImage() {
    return getLayerImage("Repair", REPAIR_IMAGE_URL);
}

/**
 * 遠征のレイヤー画像を取得します。
 * 
 * @return {org.eclipse.swt.graphics.Image} 遠征のレイヤー画像
 */
function getMissionImage() {
    return getLayerImage("Mission", MISSION_IMAGE_URL);
}

/**
 * 大破のレイヤー画像を取得します。
 * 
 * @return {org.eclipse.swt.graphics.Image} 大破のレイヤー画像
 */
function getBadlyImage() {
	return getLayerImage("Badly", BADLY_IMAGE_URL);
}

/**
 * 大破(煙)のレイヤー画像を取得します。
 * 
 * @return {org.eclipse.swt.graphics.Image} 大破(煙)のレイヤー画像
 */
function getBadlySmokeImage() {
	return getLayerImage("BadlySmoke", BADLY_SMOKE_IMAGE_URL);
}

/**
 * 中破のレイヤー画像を取得します。
 * 
 * @return {org.eclipse.swt.graphics.Image} 中破のレイヤー画像
 */
function getHalfImage() {
	return getLayerImage("Half", HALF_IMAGE_URL);
}

/**
 * 中破(煙)のレイヤー画像を取得します。
 * 
 * @return {org.eclipse.swt.graphics.Image} 中破(煙)のレイヤー画像
 */
function getHalfSmokeImage() {
	return getLayerImage("HalfSmoke", HALF_SMOKE_IMAGE_URL);
}

/**
 * 小破のレイヤー画像を取得します。
 * 
 * @return {org.eclipse.swt.graphics.Image} 小破のレイヤー画像
 */
function getSlightImage() {
	return getLayerImage("Slight", SLIGHT_IMAGE_URL);
}

/**
 * 小破(煙)のレイヤー画像を取得します。
 * 
 * @return {org.eclipse.swt.graphics.Image} 小破(煙)のレイヤー画像
 */
function getSlightSmokeImage() {
	return getLayerImage("SlightSmoke", SLIGHT_SMOKE_IMAGE_URL);
}

/**
 * レイヤー画像を取得します。
 * 
 * @param {String} name 名前
 * @param {String} url 取得できなかった場合のURL
 * @return {org.eclipse.swt.graphics.Image} レイヤー画像
 */
function getLayerImage(name, url) {
    var image = getData("LAYER_" + name + ".png");
    if (!(image instanceof Image)) {
        image = getWebImage(url, (SHIP_LAYER_IMAGE_DIR + name + ".png"));
        setTmpData("LAYER_" + name + ".png", image);
    }
    return image;
}

/**
 * 艦娘の状態から、通常または損傷状態の画像を取得します。
 * 
 * @param {logbook.dto.ShipDto} ship 艦娘のデータ
 * @return {org.eclipse.swt.graphics.Image} 艦娘の画像
 */
function getShipImage(ship) {
	var shipId = ship.shipId;
	var prefix;
	var url;
	var dir;
	if(!ship.isHalfDamage()){
		prefix = "NORMAL_";
		url = NORMAL_SHIP_IMAGE_URL + shipId + ".jpg";
		dir = NORMAL_SHIP_IMAGE_DIR + shipId + ".jpg";
	} else {
		prefix = "DAMAGED_";
		url = DAMAGED_SHIP_IMAGE_URL + shipId + ".jpg";
		dir = DAMAGED_SHIP_IMAGE_DIR + shipId + ".jpg";
	}
    var image  = getData(prefix + shipId + ".jpg");
    if (!(image instanceof Image)) {
        image = getWebImage(url, dir);
        setTmpData(prefix + shipId + ".jpg", image);
    }
    return image;
}

/**
 * 装備アイコンの画像を取得します。
 * 
 * @param {Number} type3 表示分類
 * @return {org.eclipse.swt.graphics.Image} 装備アイコンの画像
 */
function getItemIconImage(type3){
    var image  = getData("ITEM_ICON_" + type3 + ".png");
    if (!(image instanceof Image)) {
        image = getWebImage(ITEM_ICON_IMAGE_URL + type3 + ".png", (ITEM_ICON_IMAGE_DIR + type3 + ".png"));
        setTmpData("ITEM_ICON_" + type3 + ".png", image);
    }
    return image;
}

/**
 * @param {ShipDtoEx} shipDtoEx
 * @param {org.eclipse.swt.graphics.Image} shipImage
 * @param {java.util.List<org.eclipse.swt.graphics.Image>} itemIconList
 */
var PaintDto = function(shipDtoEx,shipImage,itemIconList){
	this.ShipDtoEx    = shipDtoEx;
	this.ShipImage    = shipImage;
	this.ItemIconList = itemIconList;
};

PaintDto.prototype.dispose = function(){
	if(!this.ShipImage.isDisposed()) this.ShipImage.dispose();
	this.ItemIconList.stream().filter(function(itemIcon){
		return itemIcon instanceof Image && !itemIcon.isDisposed();
	}).forEach(function(itemIcon){
		itemIcon.dispose();
	});
	this.ShipDtoEx = this.ShipImage = this.ItemIconList = null;
};

/**
 * @param {ShipDto} shipDto
 * @param {boolean} isMission
 * @param {boolean} isNdock
 */
function ShipDtoEx(shipDto,isMission,isNdock){
	this.ShipDto = shipDto;
	this.isMission = isMission;
	this.isNdock = isNdock;
}

ShipDtoEx.prototype.equals = function(shipDtoEx){
	return this.ShipDto.equals(shipDtoEx.ShipDto) && this.isMission == shipDtoEx.isMission && this.isNdock == shipDtoEx.isNdock;
};

/**
 * Pointから列番号を取得します。
 * 
 * @param {org.eclipse.swt.graphics.Point} pt 座標
 * @param {org.eclipse.swt.widgets.TableItem} item TableItem
 * @return {Number} 列番号(見つからない場合は-1を返す)
 */
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

/**
 * テーブルの列から装備データを取得します。
 * 
 * @param {Number} index 列番号
 * @param {logbook.dto.ShipDto} ship 艦娘のデータ
 * @return {logbook.dto.ItemDto} 装備データ
 */
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

/**
 * Event
 */
var PaintHandler = new Listener(function(event) {
	var ship = event.item.data;
	var gc = event.gc;
	var old = gc.background;
	var rate = function(index){
		switch(index){
			case hpIndex:   return ship.nowhp / ship.maxhp;
			case fuelIndex: return ship.fuel / ship.fuelMax;
			case ammoIndex: return ship.bull / ship.bullMax;
			//case lvIndex: return ship.lv > 99 ? ship.lv / 155 : ship.lv / 99;
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
			//case lvIndex: return SWTResourceManager.getColor(LV_PROGRESS_COLOR);
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
 * 
 * @param {Float32Array} raito 割合
 * @param {org.eclipse.swt.graphics.Color} start 開始色
 * @param {org.eclipse.swt.graphics.Color} end 終了色
 * @return {org.eclipse.swt.graphics.Color} 中間色
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

/**
 * 進捗バーを描画するイベントを設定します。
 * 
 * @param {org.eclipse.swt.widgets.Table} table テーブル
 */
function setTableListener(table){
	var listener = getData("phandler");
	if(listener instanceof Listener) {
		table.removeListener(SWT.EraseItem, listener);
	}
	table.addListener(SWT.EraseItem, PaintHandler);
	setTmpData("phandler", PaintHandler);
}

/**
 * フォルダ内にある画像をメモリ上に展開します。
 */
function loadImage(){
	loadLayerImage();
	loadShipImage();
	loadItemIconImage();
}

/**
 * レイヤーをメモリ上に展開します。
 */
function loadLayerImage(){
	var shipLayerImageDir  = new File(SHIP_LAYER_IMAGE_DIR);
	if(shipLayerImageDir.exists()){
		Arrays.stream(shipLayerImageDir.listFiles(ImageFilter)).forEach(function(file){
			setTmpData("LAYER_" + file.getName(),SWTResourceManager.getImage(file.toString()));
		});
	} else {
		shipLayerImageDir.mkdirs();
	}
}

/**
 * 艦娘の画像をメモリ上に展開します。
 */
function loadShipImage(){
	loadNormalShipImage();
	loadDamagedShipImage();
}

/**
 * 艦娘(通常)の画像をメモリ上に展開します。
 */
function loadNormalShipImage(){
	var normalShipImageDir = new File(NORMAL_SHIP_IMAGE_DIR);
	if(normalShipImageDir.exists()){
		Arrays.stream(normalShipImageDir.listFiles(ImageFilter)).forEach(function(file){
			setTmpData("NORMAL_" + file.getName(),SWTResourceManager.getImage(file.toString()));
		});
	} else {
		normalShipImageDir.mkdirs();
	}
}

/**
 * 艦娘(中破)の画像をメモリ上に展開します。
 */
function loadDamagedShipImage(){
	var damagedShipImageDir = new File(DAMAGED_SHIP_IMAGE_DIR);
	if(damagedShipImageDir.exists()){
		Arrays.stream(damagedShipImageDir.listFiles(ImageFilter)).forEach(function(file){
			setTmpData("DAMAGED_" + file.getName(),SWTResourceManager.getImage(file.toString()));
		});
	} else {
		damagedShipImageDir.mkdirs();
	}
}

/**
 * 装備のアイコンの画像をメモリ上に展開します。
 */
function loadItemIconImage(){
	var itemIconImageDir = new File(ITEM_ICON_IMAGE_DIR);
	if(itemIconImageDir.exists()){
		Arrays.stream(itemIconImageDir.listFiles(ImageFilter)).forEach(function(file){
			setTmpData("ITEM_ICON_" + file.getName(),SWTResourceManager.getImage(file.toString()));
		});
	} else {
		itemIconImageDir.mkdirs();
	}
}
