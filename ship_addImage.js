/*
 * 画像追加 Ver2.0.3.5
 * Author:Nishisonic
 * LastUpdate:2016/10/18
 * 
 * 所有艦娘一覧に画像を追加します。
 */

load("script/utils.js");
HpString = Java.type("logbook.gui.logic.HpString");
SeikuString= Java.type("logbook.gui.logic.SeikuString");
SakutekiString = Java.type("logbook.gui.logic.SakutekiString");

function header() {
	return ["画像","種別画像1","種別画像2","種別画像3","種別画像4","種別画像Ex"];
}

function begin(specdiff) {}

function body(ship) {
	 // 艦載機数
	var slotItems = ship.item2;
	var slotNames = new Array(4);
	var onSlotString = new Array(4);
	var slotExName = (ship.slotExItem != null) ? ship.slotExItem.friendlyName : null
	var onSlot = ship.onSlot;
	var maxEq = ship.shipInfo.maxeq;
	var slotNum = ship.slotNum;
	for (var i = 0; i < slotNum; ++i) {
		var item = slotItems.get(i);
		if (ship.canEquipPlane()) { // 飛行機を装備できる場合だけ
			var cur = (((item != null) && item.isPlane()) ? onSlot[i] : 0);
			var max = (maxEq != null ? maxEq[i] : 0);
			onSlotString[i] = new HpString(cur, max);
		}
		if (item != null) {
			slotNames[i] = item.friendlyName;
		}
	}
	return toComparable([ null ]);
}

function end() {}
