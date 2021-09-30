/*global QUnit*/

sap.ui.define([
	"adminconfiguration/admin_configuration/controller/Admin.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Admin Controller");

	QUnit.test("I should test the Admin controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
