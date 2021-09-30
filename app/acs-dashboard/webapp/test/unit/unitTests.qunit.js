/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/sap/acs/ui/dashboard/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
