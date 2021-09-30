/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"adminconfiguration/admin_configuration/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
