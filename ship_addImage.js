/*
 * 画像追加 Ver2.1.7.1
 * Author:Nishisonic
 * LastUpdate:2017/05/31
 * 
 * 所有艦娘一覧に画像を追加します。
 */

load("script/utils.js");

function header() {
    return ["画像","種別画像1","種別画像2","種別画像3","種別画像4","種別画像Ex"];
}

function begin(specdiff) {}

function body(ship) {
    return toComparable([ null ]);
}

function end() {}
