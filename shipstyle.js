/**
 * 画像追加 Ver2.1.7
 * Author:Nishisonic,Nekopanda
 * LastUpdate:2017/05/31
 * 
 * 所有艦娘一覧に画像を追加します。
 */

load("script/ScriptData.js");
load("script/utils.js");

IOUtils             = Java.type("org.apache.commons.io.IOUtils");

SWT                 = Java.type("org.eclipse.swt.SWT");
Color               = Java.type("org.eclipse.swt.graphics.Color");
GC                  = Java.type("org.eclipse.swt.graphics.GC");
Image               = Java.type("org.eclipse.swt.graphics.Image");
Point               = Java.type("org.eclipse.swt.graphics.Point");
RGB                 = Java.type("org.eclipse.swt.graphics.RGB");
FillLayout          = Java.type("org.eclipse.swt.layout.FillLayout");
Label               = Java.type("org.eclipse.swt.widgets.Label");
Listener            = Java.type("org.eclipse.swt.widgets.Listener");
Shell               = Java.type("org.eclipse.swt.widgets.Shell");
Display             = Java.type("org.eclipse.swt.widgets.Display");
Event               = Java.type("org.eclipse.swt.widgets.Event");
TableItem           = Java.type("org.eclipse.swt.widgets.TableItem");
SWTResourceManager  = Java.type("org.eclipse.wb.swt.SWTResourceManager");

File                = Java.type("java.io.File");
FilenameFilter      = Java.type("java.io.FilenameFilter");
HttpURLConnection   = Java.type("java.net.HttpURLConnection");
URI                 = Java.type("java.net.URI");
URL                 = Java.type("java.net.URL");
Charset             = Java.type("java.nio.charset.Charset");
Files               = Java.type("java.nio.file.Files");
Paths               = Java.type("java.nio.file.Paths");
ArrayList           = Java.type("java.util.ArrayList");
Arrays              = Java.type("java.util.Arrays");
Collections         = Java.type("java.util.Collections");
HashMap             = Java.type("java.util.HashMap");
LinkedHashSet       = Java.type("java.util.LinkedHashSet");
LinkedList          = Java.type("java.util.LinkedList");
Map                 = Java.type("java.util.Map");
Collectors          = Java.type("java.util.stream.Collectors");
IntStream           = Java.type("java.util.stream.IntStream");

JsonObject          = Java.type("javax.json.JsonObject");

AppConstants        = Java.type("logbook.constants.AppConstants");
GlobalContext       = Java.type("logbook.data.context.GlobalContext");
ItemDto             = Java.type("logbook.dto.ItemDto");
ShipDto             = Java.type("logbook.dto.ShipDto");
ShipParameters      = Java.type("logbook.dto.ShipParameters");
ApplicationMain     = Java.type("logbook.gui.ApplicationMain");
AbstractTableDialog = Java.type("logbook.gui.AbstractTableDialog");
ShipTable           = Java.type("logbook.gui.ShipTable");
CalcTaiku           = Java.type("logbook.gui.logic.CalcTaiku");
SeikuString         = Java.type("logbook.gui.logic.SeikuString");
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
var WEDDING_IMAGE_URL      = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Wedding_Layer.png";
var MISSION_IMAGE_URL      = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Mission.png";
var REPAIR_IMAGE_URL       = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Repair.png";
var NORMAL_SHIP_IMAGE_URL  = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Ship/Normal/";
var DAMAGED_SHIP_IMAGE_URL = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Ship/Damaged/";
var ITEM_ICON_IMAGE_URL    = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Item/Icon/";
var BADLY_IMAGE_URL        = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Badly.png";
var BADLY_SMOKE_IMAGE_URL  = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/BadlySmoke.png";
var HALF_IMAGE_URL         = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Half.png";
var HALF_SMOKE_IMAGE_URL   = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/HalfSmoke.png";
var SLIGHT_IMAGE_URL       = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Slight.png";
var SLIGHT_SMOKE_IMAGE_URL = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/SlightSmoke.png";
var BILL_IMAGE_URL         = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/Image/Layer/Bill";
var BILL_UPDATE_CHECK_URL  = "https://raw.githubusercontent.com/Nishisonic/AddImage/master/BillUpdateCheck.txt";
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
var PROGRESS_COLOR        = {GAUGE_EMPTY:new RGB(0xff, 0, 0),
                             GAUGE_HALF:new RGB(0xff, 0xd7, 0),
                             GAUGE_FULL:new RGB(0, 0xd7, 0),
                            };
var FUEL_PROGRESS_COLOR   = new RGB(0x00, 0x60, 0x00);
var AMMO_PROGRESS_COLOR   = new RGB(0x56, 0x23, 0x00);
//var LV_PROGRESS_COLOR   = new RGB(0, 0x80, 0xff);
var NEXT_PROGRESS_COLOR   = new RGB(0, 0x80, 0xff);
var EXP_PROGRESS_COLOR    = {MARRIED:new RGB(0xff, 0x80, 0),
                             NOT_MARRIED:new RGB(0, 0x80, 0xff)};
var ON_SLOT_COLOR         = [new RGB(  0,  0,  0), // 最大搭載時
                             new RGB(255,  0,  0), // 減少時
                             new RGB(255,  0,255), // 全滅時
                             new RGB(170,170,170), // 搭載なし
                            ];
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
var nameIndex       = -1;
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
        setTmpData("BillVersion",IOUtils.toString(URI.create(BILL_UPDATE_CHECK_URL), Charset.forName("UTF-8")));
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
        if (header[i].equals("名前"))            nameIndex = i;
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
    //    item.setBackground(SWTResourceManager.getColor(AppConstants.ROW_BACKGROUND));
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
        var slotNum = ship.getSlotNum();
        var itemIconImageList = new LinkedList();
        var item2List = new LinkedList(shipDtoEx.ShipDto.item2);
        for(var i in item2List){
            itemIconImageList.add(getSynthesisItemIconImage(item2List.get(i),ship.getMaxeq()[i],ship.getOnSlot()[i],(slotNum > i),false));
        }
        // 補強増設
        item2List.add(shipDtoEx.ShipDto.slotExItem);
        itemIconImageList.add(getSynthesisItemIconImage(shipDtoEx.ShipDto.slotExItem,0,0,shipDtoEx.ShipDto.hasSlotEx(),true));
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
                var itemData = toItemData(columnIndex,item);
                var status = toStatus(columnIndex,item);
                var hpDetail = toHpDetail(columnIndex,item);
                var expedition = toExpeditionString(columnIndex,item);
                if (item != null && (itemData != null || status != null || hpDetail != null || expedition != null)) {
                    if (tip != null && !tip.isDisposed()) tip.dispose();
                    tip = new Shell(table.getShell(), SWT.ON_TOP | SWT.TOOL);
                    tip.setLayout(new FillLayout());
                    label = new Label (tip, SWT.NONE);
                    label.setData ("_TABLEITEM", item);
                    if(itemData != null){
                        label.setText(itemData);
                    } else if(status != null){
                        label.setText(status);
                    } else if(hpDetail != null){
                        label.setText(hpDetail);
                    } else if(expedition != null){
                        label.setText(expedition);
                    }
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
    var totalMemory =  java.lang.Runtime.getRuntime().totalMemory() / 1024 / 1024;
    var freeMemory = java.lang.Runtime.getRuntime().freeMemory() / 1024 / 1024;
    print(Math.round(totalMemory - freeMemory) + " / " + Math.round(totalMemory) + "MB")
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
        imageSet.add([new Image(Display.getDefault(), shipImage, SWT.IMAGE_GRAY),0,0]);
        imageSet.add([getSunkImage(),0,0]);
    } else {
        imageSet.add([shipImage,0,0]);
        imageSet.add([getStateImage(ship),0,0]);
        imageSet.add([getSmokeImage(ship),0,0]);
        imageSet.add([getCondImage(ship.cond),0,0]);
        imageSet.add([getWeddingImage(ship.lv),139,18]);
        imageSet.add([getBillImage(ship),34,-3]);
    }
    // 160x40を取り敢えず基準に
    var tmpImage = compose(imageSet,160,40);
    var resultImage = resize(tmpImage,width,height);
    tmpImage.dispose();
    return resultImage;
}

/**
 * 合成した装備アイコンの画像を返します。
 * 
 * @param {logbook.dto.ItemDto} item2 装備のデータ
 * @param {Number} maxEq 最大搭載機数
 * @param {Number} onSlot 現在の搭載機数
 * @param {Number} canPutItem 装備を載せられるか
 * @param {Number} isExItem 補助増設か
 * @param {Number} width 画像の横幅(指定しない場合は80)
 * @param {Number} height 画像の縦幅(指定しない場合は20)
 * @return {org.eclipse.swt.graphics.Image} 合成した画像
 */
function getSynthesisItemIconImage(item2,maxEq,onSlot,canPutItem,isExItem,width,height){
    var width = typeof width !== 'undefined' ?  width : IMAGE_SIZE.WIDTH;
    var height = typeof height !== 'undefined' ?  height : IMAGE_SIZE.HEIGHT;
    // var scaled = getTransparentImage(width,height);
    var scaled = new Image(Display.getDefault(), width, height);
    var gc = new GC(scaled);
    gc.setAntialias(SWT.ON);
    gc.setInterpolation(SWT.HIGH);
    var onSlotFont = SWTResourceManager.getFont("Arial", 7, SWT.NORMAL);
    var onSlotColor = function(){
        if(item2 != null && item2.isPlane() && maxEq > 0){
            if(maxEq == onSlot){
                return SWTResourceManager.getColor(ON_SLOT_COLOR[0]);
            }
            if(onSlot == 0){
                return SWTResourceManager.getColor(ON_SLOT_COLOR[2]);
            }
            return SWTResourceManager.getColor(ON_SLOT_COLOR[1]);
        }
        return SWTResourceManager.getColor(ON_SLOT_COLOR[3]);
    }();
    if(canPutItem){
        gc.setFont(onSlotFont);
        gc.setForeground(onSlotColor);
        gc.drawString((isExItem ? "-" : onSlot), 40, 0,true);
    }
    if(item2 instanceof ItemDto){
        var itemIconImage = function(type3){
            var result = getItemIconImage(type3);
            if(result != null) return result;
            // 新アイコン対策
            result = getItemIconImage(0);
            return result;
        }(item2.type3);
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
                case 1: return " ★+1";
                case 2: return " ★+2";
                case 3: return " ★+3";
                case 4: return " ★+4";
                case 5: return " ★+5";
                case 6: return " ★+6";
                case 7: return " ★+7";
                case 8: return " ★+8";
                case 9: return " ★+9";
                case 10:return "★ma x";
            }
        }(lv);
        var lvFont = SWTResourceManager.getFont("Arial", 7, SWT.NORMAL);
        var lvColor = SWTResourceManager.getColor(LV_COLOR[lv]);
        //合成処理
        // 落ちる対策
        if(itemIconImage != null){
            //var iconImage = trimming(itemIconImage,30,30);
            var trimImage = trimming(itemIconImage,30,30);
            var iconImage = resize(trimImage, 18, 18);
            gc.drawImage(iconImage, 3, 1);
            trimImage.dispose(); // しておかないと落ちる
            iconImage.dispose(); // しておかないと落ちる
        }
        gc.setFont(alvFont);
        gc.setForeground(alvColor);
        gc.drawString(alvText, 25, 0,true);
        gc.setFont(lvFont);
        gc.setForeground(lvColor);
        gc.drawString(lvText, 22, 10,true);
    }
    gc.dispose();
    //font.dispose();
    //alvColor.dispose();
    //lvColor.dispose();
    return scaled;
}

function trimming(image,width,height){
    var scaled = getTransparentImage(width, height);
    var gc = new GC(scaled);
    gc.setAntialias(SWT.ON);
    gc.setInterpolation(SWT.HIGH);
    gc.drawImage(image,-1 * (image.getBounds().width - width) / 2,-1 * (image.getBounds().height - height) / 2);
    gc.dispose();
    return scaled;
}

/**
 * 画像をリサイズして返します。
 * 
 * @param {Image} image 画像
 * @param {Number} width リサイズ後の横幅
 * @param {Number} height リサイズ後の縦幅
 * @return {org.eclipse.swt.graphics.Image} リサイズした画像
 */
function resize(image,width,height){
    if(image == null) return null;
    var scaled = getTransparentImage(width,height);
    var gc = new GC(scaled);
    gc.setAntialias(SWT.ON);
    gc.setInterpolation(SWT.HIGH);
    gc.drawImage(image, 0, 0, image.getBounds().width, image.getBounds().height, 0, 0, width, height);
    gc.dispose();
    return scaled;
}

/**
 * 画像のSetを合成して一つの画像にして返します。
 * 
 * @param {java.util.Set<[Image,x,y]>} imageSet 画像のSet
 * @param {Number} width 画像の横幅
 * @param {Number} height 画像の縦幅
 * @return {org.eclipse.swt.graphics.Image} 合成した画像
 */
function compose(imageSet,width,height){
    var scaled = getTransparentImage(width,height);
    var gc = new GC(scaled);
    gc.setAntialias(SWT.ON);
    gc.setInterpolation(SWT.HIGH);
    imageSet.stream().filter(function(imageData){
        return imageData[0] instanceof Image;
    }).forEach(function(imageData){
        gc.drawImage(imageData[0], imageData[1], imageData[2]);
    });
    gc.dispose();
    return scaled;
}

/**
 * 透明の画像を返します。
 * 
 * @param {Number} width  画像の横幅
 * @param {Number} height 画像の縦幅
 */
function getTransparentImage(width,height){
    var src = new Image(Display.getDefault(), width, height);        
    var imageData = src.getImageData();
    imageData.transparentPixel = imageData.getPixel(0, 0);
    src.dispose();
    // ここまで
    return new Image(Display.getDefault(), imageData);
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
    if (lv > 99) return getLayerImage("Wedding_Layer", WEDDING_IMAGE_URL);
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
 * 札のレイヤー画像を取得します
 * 
 * @return {org.eclipse.swt.graphics.Image} 札のレイヤー画像(札がない場合はnull)
 */
function getBillImage(ship){
    if(ship.json == null || isJsonNull(ship.json.api_sally_area) || ship.json.api_sally_area.intValue() == 0) return null;
    var ver = getData("BillVersion");
    var area = ship.json.api_sally_area.intValue();
    return getLayerImage("Bill" + ver + area, BILL_IMAGE_URL + ver + area + ".png");
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
    this.HP = shipDto.nowhp;
    this.Item2 = shipDto.item2;
    this.isMission = isMission;
    this.isNdock = isNdock;
}

ShipDtoEx.prototype.equals = function(shipDtoEx){
    return this.ShipDto.equals(shipDtoEx.ShipDto) && this.HP == shipDtoEx.HP && this.Item2.equals(shipDtoEx.Item2) && this.isMission == shipDtoEx.isMission && this.isNdock == shipDtoEx.isNdock;
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
 * テーブルの列でデータを取得するか判断、取得する場合は装備データを加工したものを返します。しない場合はnullを返す。
 * 
 * @param {Number} index 列番号
 * @param {org.eclipse.swt.widgets.TableItem} _ship テーブルの行
 * @return {String} データ
 */
function toItemData(index,_ship){
    if(_ship == null) return null;
    var ship = _ship.data;
    var result = " ";
    switch(index){
        case itemType1Index:
        case itemType2Index:
        case itemType3Index:
        case itemType4Index:
        case itemTypeExIndex:
        //case itemType5Index:
            var onslots = ship.getOnSlot();
            var maxeqs  = ship.getMaxeq();
            var item2  = ship.item2;
            for(var i = 0;i < item2.size();i++){
                var itemdto = item2.get(i);
                if(itemdto == null) break;
                var onslot = onslots[i];
                var maxeq = maxeqs[i];
                var name = itemdto.name;
                var alv = itemdto.alv;
                var lv = itemdto.level;
                result += "[" + onslot + "/" + maxeq + "] " + name + (lv > 0 ? "+" + lv : "") + (alv > 0 ? " Lv." + alv : "") + " \n ";
            }
            var itemdto = ship.slotExItem;
            if(itemdto == null) break;
            var name = itemdto.name;
            var lv = itemdto.level;
            result += "補強: " + name + (lv > 0 ? "+" + lv : "") + " \n ";
            break;
        default: return null;
    }
    result += " \n ";
    result += "昼戦: " + ((ship.stype == 13 || ship.stype == 14) ? "雷撃" : (getHougekiKindString(getHougekiKind(ship)) + " - 威力: " + getHougekiPower(ship))) + " \n ";
    result += "夜戦: " + getYasenKindString(getYasenKind(ship)) + " - 威力: " + getYasenPower(ship) + " \n ";
    if((canKaimakuRaigeki(ship) || canRaigeki(ship)) && getTaisenKind(ship) > 0){
        result += "雷撃: " + getRaigekiPower(ship) + " / 対潜: " + getTaisenPower(ship) + " \n ";
    } else if(canKaimakuRaigeki(ship) || canRaigeki(ship)){
        result += "雷撃: " + getRaigekiPower(ship) + " \n ";
    } else if(getTaisenKind(ship) > 0){
        result += "対潜: " + getTaisenPower(ship) + " \n ";
    }
    var taikuCutinID = getTaikuCutinID(ship);
    if(taikuCutinID > 0){
        result += "対空: " + toTaikuCutinString(taikuCutinID) + " \n ";
    }
    var calcTaiku = new CalcTaiku();
    result += "加重対空: " + calcTaiku.getFriendKajuuValue(ship) + " (割合撃墜: " + Number(calcTaiku.getFriendProportionalShootDown(ship) * 100).toFixed(2) + "%) ";
    var seiku = new SeikuString(ship);
    if(seiku.getValue() > 0 && getKoukuPower(ship) != 0){
        result += "\n 制空戦力: " + seiku.getValue() + " / 航空威力: " + getKoukuPower(ship) + " ";
    } else if(seiku.getValue() > 0){
        result += "\n 制空戦力: " + seiku.getValue() + " ";
    } else if(getKoukuPower(ship) != 0){
        result += "\n 航空威力: " + getKoukuPower(ship) + " ";
    }
    return result;
}

/**
 * テーブルの列でデータを取得するか判断、取得する場合は艦娘のステータスを加工したものを返します。しない場合はnullを返す。
 * 
 * @param {Number} index 列番号
 * @param {org.eclipse.swt.widgets.TableItem} ship 艦娘のデータ
 * @return {String} データ
 */
function toStatus(index,ship){
    if(index == nameIndex && ship != null){
        var param = new ShipParameters();
        param.add(ship.data.param);
        param.subtract(ship.data.slotParam);
        return " " + ship.data.getType() + " " + ship.data.getName() + " Lv." + ship.data.getLv() + " \n "
            + "火力: " + param.getKaryoku()  + "/" + ship.data.getKaryoku()  + " \n "
            + "雷装: " + param.getRaisou()   + "/" + ship.data.getRaisou()   + " \n "
            + "対空: " + param.getTaiku()    + "/" + ship.data.getTaiku()    + " \n "
            + "装甲: " + param.getSoukou()   + "/" + ship.data.getSoukou()   + " \n "
            + "回避: " + param.getKaihi()    + "/" + ship.data.getKaihi()    + " \n "
            + "対潜: " + param.getTaisen()   + "/" + ship.data.getTaisen()   + " \n "
            + "索敵: " + param.getSakuteki() + "/" + ship.data.getSakuteki() + " \n "
            + "運: "   + param.getLucky()    + " \n "
            + "射程: " + ship.data.param.getLengString() + " / 速力: "+ ship.data.param.getSokuString() + " ";
    }
    return null;
}

/**
 * テーブルの列でデータを取得するか判断、取得する場合は艦娘のHPを加工したものを返します。しない場合はnullを返す。
 * 
 * @param {Number} index 列番号
 * @param {org.eclipse.swt.widgets.TableItem} _ship テーブルの行
 * @return {String} データ
 */
function toHpDetail(index,_ship){
    if(index == hpIndex && _ship != null){
        var ship = _ship.data;
        var hpRate = ship.getNowhp() / ship.getMaxhp();
        var hpState = function(_ship){
            var _hpRate = ship.getNowhp() / ship.getMaxhp();
            var result = "";
            var untilBadlyDamage = ship.getNowhp() - Math.floor(_ship.getMaxhp() * 0.25);
            var untilHalfDamage = ship.getNowhp() - Math.floor(_ship.getMaxhp() * 0.5);
            if(_ship.isSunk()){
                result += " 轟沈しました... ";
            } else {
                if(_ship.isBadlyDamage()){
                    result += " 大破しています！ ";
                } else if(_ship.isHalfDamage()){
                    result += " 大破まで: " + untilBadlyDamage + " ";
                } else {
                    result += " 中破まで: " + untilHalfDamage + " / 大破まで: " + untilBadlyDamage + " ";
                }
                if(_hpRate != 1){
                    result += "\n 入渠時間: " + toDateRestString(_ship.getDocktime()) + " @ " + toDateRestString(_ship.getDocktime() / (_ship.getMaxhp() - _ship.getNowhp())) + " ";
                }
            }
            return result;
        }(ship);
        var hpStateString = function(_ship){
            var _hpRate = ship.getNowhp() / ship.getMaxhp();
            if(_ship.isSunk())         return "轟沈";
            if(_ship.isBadlyDamage())  return "大破";
            if(_ship.isHalfDamage())   return "中破";
            if(_ship.isSlightDamage()) return "小破";
            if(_hpRate == 1)           return "無傷";
            return "健在";
        }(ship);
        return " HP:" + Number(hpRate * 100).toFixed(1) + "% [" + hpStateString + "] \n" + hpState;
    }
    return null;
}

/**
 * テーブルの列でデータを取得するか判断、取得する場合は遠征数を返します。しない場合はnullを返す。
 * 
 * @param {Number} index 列番号
 * @param {org.eclipse.swt.widgets.TableItem} ship テーブルの行
 * @return {String} データ
 */
function toExpeditionString(index,ship){
    if(index == condIndex && ship != null){
        return ship.data.cond >= 49 ? " あと " + Math.max(Math.ceil((ship.data.cond - 49) / 3),0) + " 回遠征可能 " : " 完全回復まで 約 " + ("00" + (Math.ceil((49 - ship.data.cond) / 3) * 3)).slice(-2) + ":00 ";
    }
    return null;
}

/**
 * Event
 */
var PaintHandler = new Listener(function(event) {
    var ship = event.item.data;
    var gc = event.gc;
    var old = gc.background;
    var rate = function(index){
        if(ship == null) return 0;
        switch(index){
            case hpIndex:   return ship.nowhp / ship.maxhp;
            case fuelIndex: return ship.fuel / ship.fuelMax;
            case ammoIndex: return ship.bull / ship.bullMax;
            //case lvIndex: return s.lv > 99 ? s.lv / 155 : s.lv / 99;
            case nextIndex: return ship.expraito;
            case expIndex:  return ship.lv > 99 ? ship.exp / 4470000 : ship.exp / 1000000;
            default:        return null;
        }
    }(event.index);
    // 背景を描く
    // 進捗バーを消す場合、下のcase文を消すことで非表示に出来る
    var bgColor = function(index){
        switch(index){
            case hpIndex:
            case fuelIndex:
            case ammoIndex: return SWTResourceManager.getColor(gradation(rate,[PROGRESS_COLOR.GAUGE_EMPTY,PROGRESS_COLOR.GAUGE_HALF,PROGRESS_COLOR.GAUGE_FULL]));
            //case lvIndex: return SWTResourceManager.getColor(LV_PROGRESS_COLOR);
            case nextIndex: return SWTResourceManager.getColor(NEXT_PROGRESS_COLOR);
            case expIndex:  return ship.lv > 99 ? SWTResourceManager.getColor(EXP_PROGRESS_COLOR.MARRIED) : SWTResourceManager.getColor(EXP_PROGRESS_COLOR.NOT_MARRIED);
            case itemTypeExIndex: return Display.getDefault().getSystemColor(SWT.COLOR_DARK_GRAY);
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

/**
 * 砲撃戦火力を返します。
 * 
 * @param {logbook.dto.ShipDto} ship 艦娘のデータ
 * @return {Number} 砲撃戦火力
 */
function getHougekiPower(ship){
    var hougekiPower;
    var item2 = new ArrayList(ship.item2);
    item2.add(ship.slotExItem);
    switch(getHougekiKind(ship)){
        case 7:
            var rai = ship.slotParam.raig;
            var baku = ship.slotParam.baku;
            hougekiPower = Math.floor((ship.karyoku + rai + getHougekiKaishuPower(item2) + Math.floor(baku * 1.3)) * 1.5) + 55;
            break;
        default:
            hougekiPower = (ship.karyoku + getHougekiKaishuPower(item2) + 5);
            break;
    }
    hougekiPower *= getHPPowerBonus(ship,false);
    hougekiPower += getCLLightGunPowerBonus(ship);
    hougekiPower += getZaraGunFitPowerBonus(ship);
    return ammoCorrection(ship,softcap(hougekiPower,180) * getDanchakuDamageMagnification(getHougekiKind(ship)));
}

/**
 * 対潜火力を返します。
 * 
 * @param {logbook.dto.ShipDto} ship 艦娘のデータ
 * @return {Number} 対潜火力
 */
function getTaisenPower(ship){
    var item2 = new ArrayList(ship.item2);
    item2.add(ship.slotExItem);
    // 対潜 = √素対潜 × 2 + 装備対潜 × 1.5 + 装備改修補正(対潜) + 攻撃別定数
    var taisenItem = item2.stream().filter(function(item){
        return item != null;
    }).filter(function(item){
        switch(item.type2){
            case  7: // 艦上爆撃機
            case  8: // 艦上攻撃機
            case 11: // 水上爆撃機
            case 14: // ソナー
            case 15: // 爆雷
            case 25: // オートジャイロ
            case 26: // 対潜哨戒機
            case 40: // 大型ソナー
            //case 41: // 大型飛行艇
                return true;
            default:
                return false;
        }
    }).mapToInt(function(item){
        return item.param.taisen;
    }).sum();
    var taisenShip = ship.taisen - ship.slotParam.taisen;
    var taisenBasicPower;

    switch(getTaisenKind(ship)){
        case 7:
            // 艦載機運用艦＝対潜基本値8
            taisenBasicPower = 8;
            break;
        case 8:
            // 爆雷攻撃艦＝対潜基本値13
            taisenBasicPower = 13;
            break;
        default:
            return 0;
    }
    
    var taisenPower = (Math.sqrt(taisenShip) * 2 + taisenItem * 1.5 + getTaisenKaishuPower(item2) + taisenBasicPower) * getHPPowerBonus(ship,false) * (hasTaisenSynergy(item2) ? 1.15 : 1.0) * (1 + (hasNewTaisenSynergy(item2) ? 0.15 : 0) + (hasBakuraiSynergy(item2) ? 0.1 : 0));
    return ammoCorrection(ship,softcap(taisenPower,100));
}

/**
 * 夜戦火力を返します。
 * 
 * @param {logbook.dto.ShipDto} ship 艦娘のデータ
 * @return {Number} 夜戦火力
 */
function getYasenPower(ship){
    var item2 = new ArrayList(ship.item2);
    item2.add(ship.slotExItem);
    var yasenPower = (ship.karyoku + ship.raisou + getYasenKaishuPower(item2)) * getYasenCutinDamageMagnification(getYasenKind(ship)) * getHPPowerBonus(ship,false) + getCLLightGunPowerBonus(ship) + getZaraGunFitPowerBonus(ship);
    return ammoCorrection(ship,softcap(yasenPower,300));
}

/**
 * 雷撃戦火力を返します。
 * 
 * @param {logbook.dto.ShipDto} ship 艦娘のデータ
 * @return {String} 雷撃戦火力
 */
function getRaigekiPower(ship){
    var item2 = new ArrayList(ship.item2);
    item2.add(ship.slotExItem);
    var kRaigekiPower = (ship.raisou + getRaigekiKaishuPower(item2) + 5) * getHPPowerBonus(ship,true);
    var raigekiPower = (ship.raisou + getRaigekiKaishuPower(item2) + 5) * getHPPowerBonus(ship,false);
    if(canKaimakuRaigeki(ship) && canRaigeki(ship)){
        return ammoCorrection(ship,softcap(kRaigekiPower,150)) + " - " + ammoCorrection(ship,softcap(raigekiPower,150));
    } else if(canKaimakuRaigeki(ship)){
        return ammoCorrection(ship,softcap(kRaigekiPower,150));
    } else if(canRaigeki(ship)){
        return ammoCorrection(ship,softcap(raigekiPower,150));
    }
    return 0;
}

/**
 * 航空威力を返します。
 * 
 * @param {logbook.dto.ShipDto} ship 艦娘のデータ
 * @return {String} 航空威力
 */
function getKoukuPower(ship){
    var item2 = new ArrayList(ship.item2);
    // item2.add(ship.slotExItem);
    var onslots = ship.getOnSlot();
    // 運営式
    var injectionPower = IntStream.range(0,item2.size()).filter(function(i){
        return item2.get(i) != null && onslots[i] > 0;
    }).mapToDouble(function(i){
        switch(item2.get(i).type2){
            case 57: // 噴式戦闘爆撃機
                return item2.get(i).param.baku * Math.sqrt(onslots[i]) + 25;
            default:
                return 0;
        }
    }).max().orElse(0) * getHPPowerBonus(ship,false);
    var airPower = IntStream.range(0,item2.size()).filter(function(i){
        return item2.get(i) != null && onslots[i] > 0;
    }).mapToDouble(function(i){
        switch(item2.get(i).type2){
            case 7:  // 艦上爆撃機
            case 11: // 水上爆撃機
                return item2.get(i).param.baku * Math.sqrt(onslots[i]) + 25;
            case 8:  // 艦上攻撃機
                return (item2.get(i).param.raig * Math.sqrt(onslots[i]) + 25) * 1.5;
            case 57: // 噴式戦闘爆撃機
                return (item2.get(i).param.baku * Math.sqrt(onslots[i]) + 25) / Math.sqrt(2);
            default:
                return 0;
        }
    }).max().orElse(0) * getHPPowerBonus(ship,false);
    if(injectionPower > 0){
        return ammoCorrection(ship,softcap(injectionPower,150)) + " - " + ammoCorrection(ship,softcap(airPower,150));
    } else if(airPower > 0){
        return ammoCorrection(ship,softcap(airPower,150));
    } else {
        return 0;
    }
}

/**
 * 雷撃攻撃が出来るか判断します。
 * 
 * @param {logbook.dto.ShipDto} ship 艦娘のデータ
 * @return {boolean}
 */
function canRaigeki(ship){
    var raisouItem = ship.slotParam.raisou;
    var raisouShip = ship.raisou - raisouItem;
    return raisouShip > 0;
}

/**
 * 開幕雷撃攻撃が出来るか判断します。
 * 
 * @param {logbook.dto.ShipDto} ship 艦娘のデータ
 * @return {boolean}
 */
function canKaimakuRaigeki(ship){
    switch(ship.stype){
        case 13: // 潜水艦
        case 14: // 潜水空母
            if(ship.lv >= 10) return true;
        default:
            var item2 = new ArrayList(ship.item2);
            item2.add(ship.slotExItem);
            return item2.stream().filter(function(item){
                return item != null;
            }).anyMatch(function(item){
                return item.type2 == 22; // 特殊潜航艇
            });
    }
}

/**
 * 対潜攻撃の種別を返します。
 * 
 * @param {logbook.dto.ShipDto} ship 艦娘のデータ
 * @return {Number} -1なら攻撃なし、7なら空撃、8なら爆雷攻撃
 */
function getTaisenKind(ship){
    var item2 = new ArrayList(ship.item2);
    item2.add(ship.slotExItem);
    switch (ship.stype) {
        case 7: // 軽空母
            return item2.stream().filter(function(item){
                return item != null && item.param.taisen > 0;
            }).map(function(item){
                return item.type2;
            }).anyMatch(function(type2){
                switch(type2){
                    case 7:  // 艦上爆撃機
                    case 8:  // 艦上攻撃機
                        return true;
                    default:
                        return false;
                }
            }) ? 7 : -1;
        case  6: // 航空巡洋艦
        case 10: // 航空戦艦
        case 16: // 水上機母艦
        case 17: // 揚陸艦
            return item2.stream().filter(function(item){
                return item != null && item.param.taisen > 0;
            }).map(function(item){
                return item.type2;
            }).anyMatch(function(type2){
                switch(type2){
                    case 11: // 水上爆撃機
                    case 25: // オートジャイロ
                    case 26: // 対潜哨戒機
                    case 41: // 大型飛行艇
                        return true;
                    default:
                        return false;
                }
            }) ? 7 : -1; // 空撃or攻撃なし
        default:
            var taisenItem = ship.slotParam.taisen;
            var taisenShip = ship.taisen - taisenItem;
            if(taisenShip > 0){
                // 速吸改
                if(ship.shipId == 352){
                    return item2.stream().filter(function(item){
                        return item != null && item.param.taisen > 0;
                    }).map(function(item){
                        return item.type2;
                    }).anyMatch(function(type2){
                        switch(type2){
                            case 8:  // 艦上攻撃機
                            case 11: // 水上爆撃機
                            case 25: // オートジャイロ
                                return true;
                            default:
                                return false;
                        }
                    }) ? 7 : 8; // 空撃or爆雷攻撃
                }
                return 8; // 爆雷攻撃
            }
            return -1; // 攻撃なし
    }
}

/**
 * (従来)対潜シナジー
 * ソナー + 爆雷"投射機"
 * 1.15倍補正
 */
function hasTaisenSynergy(item2){
    // 爆雷投射機=17,ソナー=18 両方必要なので、処理を変えないこと
    return item2.stream().filter(function(item){ return item != null; }).anyMatch(function(item){ return !isBakurai(item) && item.type3 === 17; })
        && item2.stream().filter(function(item){ return item != null; }).anyMatch(function(item){ return item.type3 === 18; });
}

/**
 * (新)対潜シナジー
 * ソナー + 爆雷
 * 1.15倍補正
 */
function hasNewTaisenSynergy(item2){
    // 爆雷,ソナー=18 両方必要なので、処理を変えないこと
    return item2.stream().filter(function(item){ return item != null; }).anyMatch(function(item){ return isBakurai(item); })
        && item2.stream().filter(function(item){ return item != null; }).anyMatch(function(item){ return item.type3 === 18; });
}

/**
 * 新爆雷シナジー
 * 爆雷"投射機" + 爆雷
 * 1.1倍補正
 */
function hasBakuraiSynergy(item2){
    var bakuraiNum = get95BakuraiNum(item2) + get2BakuraiNum(item2);
    var hasBakurai = bakuraiNum > 0;
    return (item2.stream().filter(function(item){ return item != null && item.type3 === 17; }).count() - bakuraiNum > 0) && hasBakurai;
}

/**
 * 九五式爆雷の数
 */
function get95BakuraiNum(item2){
    return item2.stream().filter(function(item){ return item != null; }).map(function(item){ return item.slotitemId; }).filter(function(id){ return id === 226; }).count();
}

/**
 * 二式爆雷の数
 */
function get2BakuraiNum(item2){
    return item2.stream().filter(function(item){ return item != null; }).map(function(item){ return item.slotitemId; }).filter(function(id){ return id === 227; }).count();
}

/**
 * 爆雷かどうか
 * ※爆雷投射機ではないことに注意
 */
function isBakurai(item){
    return item.slotitemId === 226 || item.slotitemId === 227;
}

/**
 * 対潜改修補正火力を返します。
 * 
 * @param {logbook.dto.ItemDto} item2 装備データ
 * @return {Number} 改修補正火力
 */
function getTaisenKaishuPower(item2){
     return item2.stream().filter(function(item){ return item != null && (item.type3 === 17 || item.type3 === 18); }).mapToDouble(function(item){ return Math.sqrt(item.level); }).sum();
}

/**
 * 砲撃戦改修補正火力を返します。
 * 
 * @param {logbook.dto.ItemDto} item2 装備データ
 * @return {Number} 改修補正火力
 */
function getHougekiKaishuPower(item2){
    var kaishuBonus = function(type3){
        switch(type3){
            case 1: return 1;    // 小口径主砲
            case 2: return 1;    // 中口径主砲
            case 3: return 1.5;  // 大口径主砲
            case 4: return 1;    // 副砲
            case 13:return 1;    // 対艦徹甲弾
            case 30:return 1;    // 高射装置
            case 24:return 1;    // 探照灯
            case 15:return 1;    // 機銃
            case 17:return 0.75; // 爆雷
            case 18:return 0.75; // ソナー
            case 20:return 1;    // 上陸用舟艇
            case 36:return 1;    // 特二式内火艇
            default:return 0;
        }
    };
    return item2.stream().filter(function(item){
        return item != null;
    }).mapToDouble(function(item){
        return kaishuBonus(item.type3) * Math.sqrt(item.level);
    }).sum();
}

/**
 * 夜戦改修補正火力を返します。
 * 
 * @param {logbook.dto.ItemDto} item2 装備データ
 * @return {Number} 改修補正火力
 */
function getYasenKaishuPower(item2){
    var kaishuBonus = function(type3){
        switch(type3){
            case 1: return 1;    // 小口径主砲
            case 2: return 1;    // 中口径主砲
            case 3: return 1;    // 大口径主砲
            case 4: return 1;    // 副砲
            case 13:return 1;    // 対艦徹甲弾
            case 30:return 1;    // 高射装置
            case 24:return 1;    // 探照灯
            case  5:return 1;    // 魚雷
            case 20:return 1;    // 上陸用舟艇
            case 36:return 1;    // 特二式内火艇
            default:return 0;
        }
    };
    return item2.stream().filter(function(item){
        return item != null;
    }).mapToDouble(function(item){
        return kaishuBonus(item.type3) * Math.sqrt(item.level);
    }).sum();
}

/**
 * 雷撃戦改修補正火力を返します。
 * 
 * @param {logbook.dto.ItemDto} item2 装備データ
 * @return {Number} 改修補正火力
 */
function getRaigekiKaishuPower(item2){
    return item2.stream().filter(function(item){ return item != null && (item.type3 === 5 || item.type3 === 15); }).mapToDouble(function(item){ return 1.2 * Math.sqrt(item.level); }).sum();
}

/**
 * ソフトキャップ
 * 
 * @param {Number} 火力
 * @param {Number} キャップ値
 * @return {Number} 補正後火力
 */
function softcap(power,cap){
    return Math.floor(power > cap ? cap + Math.sqrt(power - cap) : power);
}

/**
 * 砲撃戦種別を返します。
 * 
 * @param {logbook.dto.ShipDto} ship 艦娘のデータ
 * @return {Number} 種別
 */
function getHougekiKind(ship){
    // 弾着処理
    var item2 = new ArrayList(ship.item2);
    item2.add(ship.slotExItem);
    var onslots = ship.getOnSlot();
    // 主砲
    var mainGun = item2.stream().filter(function(item){ return item != null && item.type1 === 1; }).count();
    // 副砲
    var subGun = item2.stream().filter(function(item){ return item != null && item.type1 === 2; }).count();
    // 水上機 (補強増設対処)
    var recAircraft = IntStream.range(0,item2.size() - 1).filter(function(i){ return item2.get(i) != null && onslots[i] > 0 && item2.get(i).type1 == 7; }).count();
    // 徹甲弾
    var apAmmunition = item2.stream().filter(function(item){ return item != null && item.type1 === 25; }).count();
    // 電探
    var radar = item2.stream().filter(function(item){ return item != null && item.type1 === 8; }).count();
    if(recAircraft > 0 && mainGun > 0){
        // カットイン(主砲/主砲)
        if(mainGun == 2 && apAmmunition == 1) return 6;
        // カットイン(主砲/徹甲弾)
        if(mainGun == 1 && subGun == 1 && apAmmunition == 1) return 5;
        // カットイン(主砲/電探)
        if(mainGun == 1 && subGun == 1 && radar == 1) return 4;
        // カットイン(主砲/副砲)
        if(mainGun >= 1 && subGun >= 1) return 3;
        // 連続射撃
        if(mainGun >= 2) return 2;
    }
    // それ以外の処理
    // 速吸改
    if(ship.shipId == 352){
        // 艦上攻撃機が存在するか
        var hasTorpedoBomber = item2.stream().filter(function(item){ return item != null; }).map(function(item){ return item.type3; }).anyMatch(function(type3){ return type3 == 8; });
        return hasTorpedoBomber ? 7 : 0; // 空撃or砲撃
    } else {
        switch(ship.stype){
            case 7:  // 軽空母
            case 11: // 正規空母
            case 18: // 装甲空母
                return 7; // 空撃
            default:
                return 0; // それ以外
        }
    }
}

/**
 * 夜戦種別を返します。
 * 
 * @param {logbook.dto.ShipDto} ship 艦娘のデータ
 * @return {Number} 種別
 */
function getYasenKind(ship){
    var item2 = new ArrayList(ship.item2);
    item2.add(ship.slotExItem);
    var onslots = ship.getOnSlot();
    // 主砲
    var mainGun = item2.stream().filter(function(item){ return item != null && item.type1 === 1; }).count();
    // 副砲
    var subGun = item2.stream().filter(function(item){ return item != null && item.type1 === 2; }).count();
    // 魚雷
    var torpedo = item2.stream().filter(function(item){ return item != null && item.type1 === 3; }).count();
    // 夜戦CI処理
    if(mainGun >= 3) return 5;
    if(mainGun == 2 && subGun >= 1) return 4;
    if(torpedo >= 2){
        var lateTorpedo = item2.stream().filter(function(item){ return item != null }).mapToInt(function(item){ return item.getSlotitemId(); }).filter(function(id){ return id == 213 || id == 214; }).count();
        var radiolocator = item2.stream().filter(function(item){ return item != null }).mapToInt(function(item){ return item.type1; }).filter(function(type1){ return type1 == 42; }).count();
        if(lateTorpedo >= 1 && radiolocator >= 1) return 3.1; // 後電CI
        if(lateTorpedo >= 2) return 3.2; // 後魚CI
        return 3; // 魚雷CI
    } 
    if((mainGun == 2 || mainGun == 1) && torpedo == 1) return 2;
    if(mainGun == 2 || (mainGun == 1 && subGun >= 1) || (subGun >= 2 && (torpedo == 0 || torpedo == 1))) return 1;
    // それ以外の処理
    switch(ship.stype){
        case 7:  // 軽空母
        case 11: // 正規空母
        case 18: // 装甲空母
            switch(ship.shipId){
                case 353: // Graf Zeppelin改
                case 432: // Graf Zeppelin
                case 433: // Saratoga
                    return 0; // 砲撃
                default:
                    return 7; // 空撃
            }
        case 13: // 潜水艦
        case 14: // 潜水空母
            return 9; // 雷撃
        default:
            if(torpedo >= 1) return 9; // 雷撃
            return 0; // 砲撃
    }
}

/**
 * 弾着ダメージ倍率を返します。
 * 
 * @param {Number} kind 種別
 * @return {Number} 補正倍率
 */
function getDanchakuDamageMagnification(kind){
    switch(kind){
        case 2: return 1.2; // 連続
        case 3: return 1.1; // 主砲+副砲
        case 4: return 1.2; // 主砲+電探
        case 5: return 1.3; // 主砲+徹甲弾
        case 6: return 1.5; // 主砲+主砲
        default:return 1.0; // 1回攻撃
    }
}

/**
 * 夜戦CIダメージ倍率を返します。
 * 
 * @param {Number} kind 種別
 * @return {Number} 補正倍率
 */
function getYasenCutinDamageMagnification(kind){
    switch(kind){
        case 1: return 1.2;   // 連撃
        case 2: return 1.3;   // 主魚CI
        case 3: return 1.5;   // 魚雷CI
        case 3.1: return 1.75;// 後電CI
        case 3.2: return 1.6; // 後魚CI
        case 4: return 1.75;  // 主主副CI
        case 5: return 2.0;   // 主砲CI
        default:return 1.0;   // 1回攻撃
    }
}

/**
 * 砲撃戦の種類を返します。
 * 
 * @param {Number} kind 種別
 * @return {Number} 種類
 */
function getHougekiKindString(kind){
    switch(kind){
        case 0: return "砲撃";
        case 1: return "レーザー攻撃"
        case 2: return "連続射撃";
        case 3: return "カットイン(主砲/副砲)";
        case 4: return "カットイン(主砲/電探)";
        case 5: return "カットイン(主砲/徹甲弾)";
        case 6: return "カットイン(主砲/主砲)";
        case 7: return "空撃";
        case 8: return "爆雷攻撃";
        case 9: return "雷撃";
        default:return "砲撃";
    }
}

/**
 * 夜戦砲撃の種類を返します。
 * 
 * @param {Number} kind 種別
 * @return {Number} 種類
 */
function getYasenKindString(kind){
    switch(kind){
        case 0: return "砲撃";
        case 1: return "連続射撃";
        case 2: return "カットイン(主砲/魚雷)";
        case 3: return "カットイン(魚雷x2)";
        case 3.1: return "カットイン(魚雷/逆探)";
        case 3.2: return "カットイン(後魚x2)";
        case 4: return "カットイン(主砲x2/副砲)";
        case 5: return "カットイン(主砲x3)";
        case 6: return "不明";
        case 7: return "空撃";
        case 8: return "爆雷攻撃";
        case 9: return "雷撃";
        default:return "砲撃";
    }
}

/**
 * 弾薬補正(キャップ後最終計算)
 * 
 * @param {logbook.dto.ShipDto} ship 艦娘のデータ
 * @param {Number} 火力
 * @return {Number} 補正火力
 */
function ammoCorrection(ship,power){
    return Math.floor(Math.min(Math.floor(ship.bull / ship.bullMax * 100) / 50,1) * power);
}

/**
 * 耐久補正
 * 
 * @param {logbook.dto.ShipDto} ship 艦娘のデータ
 * @param {Number} 火力
 * @return {Number} 補正火力
 */
function getHPPowerBonus(ship,isKaimakuRaigeki){
    if(ship.isBadlyDamage()){
        return isKaimakuRaigeki ? 0 : 0.4;
    } else if(ship.isHalfDamage()){
        return isKaimakuRaigeki ? 0.8 : 0.7;
    }
    return 1.0;
}

/**
 * 軽巡軽量砲補正を返します。
 * 
 * @param {logbook.dto.ShipDto} ship 艦娘のデータ
 * @return {Number} 補正火力
 */
function getCLLightGunPowerBonus(ship){
    switch(ship.stype){
        case 3:  // 軽巡
        case 4:  // 雷巡
        case 21: // 練巡
            var item2 = new ArrayList(ship.item2);
            item2.add(ship.slotExItem);
            var single = item2.stream().filter(function(item){
                return item != null;
            }).filter(function(item){
                switch(item.slotitemId){
                    case 4:  // 14cm単装砲
                    case 11: // 15.2cm単装砲
                        return true;
                    default:
                        return false;
                }
            }).count();
            var twin = item2.stream().filter(function(item){
                return item != null;
            }).filter(function(item){
                switch(item.slotitemId){
                    case 65:  // 15.2cm連装砲
                    case 119: // 14cm連装砲
                    case 139: // 15.2cm連装砲改
                        return true;
                    default:
                        return false;
                }
            }).count();
            return Math.sqrt(twin) * 2 + Math.sqrt(single);
        default:
            return 0;
    } 
}

function toDateRestString(rest){
    var ONE_MINUTES = 60;
    var ONE_HOUR = 60 * 60;
    var restSeconds = Math.floor(rest / 1000); // milli -> seconds
    //var ONE_DAY = 60 * 60 * 24;
    return ("0" + Math.floor(restSeconds / ONE_HOUR)).slice(-2) + ":" + ("0" + Math.floor(restSeconds % ONE_HOUR / ONE_MINUTES)).slice(-2) + ":" + ("0" + Math.floor(restSeconds % ONE_MINUTES)).slice(-2);
}

// 七四式から大体コピー
function getTaikuCutinID(ship){
    var item2 = new ArrayList(ship.item2);
    item2.add(ship.slotExItem);
    var highangle = 0;
    var highangle_director = 0;
    var director = 0;
    var radar = 0;
    var aaradar = 0;
    var maingunl = 0;
    var aashell = 0;
    var aagun = 0;
    var aagun_concentrated = 0;

    for(var i in item2){
        var item = item2.get(i);
        if(item == null) continue;

        // 高角砲
        if(item.type3 == 16){
            if(item.param.taiku >= 8){
                highangle_director++;
            }
        }
        // 高射装置
        else if(item.type2 == 36){
            director++;
        }
        // 電探
        else if(item.type1 == 8){
            if(item.param.taiku >= 2){
                aaradar++;
            }
            radar++;
        }
        // 大口径主砲
        else if(item.type2 == 3){
            maingunl++;
        }
        // 対空強化弾
        else if(item.type2 == 18){
            aashell++;
        }
        // 対空機銃
        else if(item.type2 == 21){
            if(item.param.taiku >= 9){
                aagun_concentrated++;
            }
            aagun++;
        }
    }

    // 固有カットイン
    switch ( ship.shipId ) {
        case 421: //秋月
        case 330: //秋月改
        case 422: //照月
        case 346: //照月改
        case 423: //初月
        case 357: //初月改
            if ( highangle >= 2 && radar >= 1 ) {
                return 1;
            }
            if ( highangle >= 1 && radar >= 1 ) {
                return 2;
            }
            if ( highangle >= 2 ) {
                return 3;
            }
            break;

        case 428: //摩耶改二
            if ( highangle >= 1 && aagun_concentrated >= 1 ) {
                if ( aaradar >= 1 )
                    return 10;

                return 11;
            }
            break;

        case 141: //五十鈴改二
            if ( highangle >= 1 && aagun >= 1 ) {
                if ( aaradar >= 1 )
                    return 14;
                else
                    return 15;
            }
            break;

        case 470: //霞改二乙
            if ( highangle >= 1 && aagun >= 1 ) {
                if ( aaradar >= 1 )
                    return 16;
                else
                    return 17;
            }
            break;

        case 418: //皐月改二
            if ( aagun_concentrated >= 1 )
                return 18;
            break;

        case 487: //鬼怒改二
            if ( aagun_concentrated >= 1 ) {
                if ( highangle - highangle_director >= 1 )
                    return 19;
                return 20;
            }
            break;
    }



    if ( maingunl >= 1 && aashell >= 1 && director >= 1 && aaradar >= 1 ) {
        return 4;
    }
    if ( highangle_director >= 2 && aaradar >= 1 ) {
        return 5;
    }
    if ( maingunl >= 1 && aashell >= 1 && director >= 1 ) {
        return 6;
    }
    if ( highangle >= 1 && director >= 1 && aaradar >= 1 ) {
        return 7;
    }
    if ( highangle_director >= 1 && aaradar >= 1 ) {
        return 8;
    }
    if ( highangle >= 1 && director >= 1 ) {
        return 9;
    }

    if ( aagun_concentrated >= 1 && aagun >= 2 && aaradar >= 1 ) {	//注: 機銃2なのは集中機銃がダブるため
        return 12;
    }

    return 0;
}

function toTaikuCutinString(id){
    switch(id){
        case 1: return "高角砲x2/電探";
        case 2: return "高角砲/電探";
        case 3: return "高角砲x2";
        case 4: return "大口径主砲/三式弾/高射装置/電探";
        case 5: return "高角砲+高射装置x2/電探";
        case 6: return "大口径主砲/三式弾/高射装置";
        case 7: return "高角砲/高射装置/電探";
        case 8: return "高角砲+高射装置/電探";
        case 9: return "高角砲/高射装置";
        case 10:return "高角砲/集中機銃/電探";
        case 11:return "高角砲/集中機銃";
        case 12:return "集中機銃/機銃/電探";
        case 14:return "高角砲/対空機銃/電探";
        case 15:return "高角砲/対空機銃";
        case 16:return "高角砲/対空機銃/電探";
        case 17:return "高角砲/対空機銃";
        case 18:return "集中機銃";
        case 19:return "高角砲/集中機銃";
        case 20:return "集中機銃";
        default:return "不明("+id+")";
    }
}

function getZaraGunFitPowerBonus(ship){
    switch(ship.getShipId()){
        case 448: // Zara
        case 358: // Zara改
        case 496: // Zara due
        case 449: // Pola
        case 361: // Pola改
            var item2 = new LinkedList(ship.item2);
            if(ship instanceof ShipDto) item2.add(ship.slotExItem);
            return Math.sqrt(item2.stream().filter(function(item){
                // 203mm／53 連装砲
                return item != null && item.slotitemId == 162;
            }).count());
        default:
            return 0;
    }
}