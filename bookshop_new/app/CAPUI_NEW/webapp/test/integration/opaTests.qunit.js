/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"captest/CAPUI_NEW/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
