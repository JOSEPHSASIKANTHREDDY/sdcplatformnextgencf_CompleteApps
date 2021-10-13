/*global QUnit*/

sap.ui.define([
	"captest/CAPUI_NEW/controller/CAPUI.controller"
], function (Controller) {
	"use strict";

	QUnit.module("CAPUI Controller");

	QUnit.test("I should test the CAPUI controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
