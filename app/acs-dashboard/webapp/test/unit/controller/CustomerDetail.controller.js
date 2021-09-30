/*global QUnit*/

sap.ui.define([
    "com/sap/acs/ui/dashboard/controller/CustomerDetail.controller"
], function (Controller) {
    "use strict";

    var oAppController = new Controller();
    QUnit.module("CustomerDetail Controller");

    QUnit.test("Test selectedSpot function", function (assert) {
        assert.deepEqual(oAppController.selectedSpot([{ "ID": 1, "BUSINESSPARTNER": "Red" }], { "ID": 1, "BUSINESSPARTNER": "Red" }), [{ "ID": 1, "BUSINESSPARTNER": "Red", "selectedSpot": true }]);
    });

});