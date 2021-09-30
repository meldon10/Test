/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/DashboardACS"
], function (opaTest) {
	"use strict";

	QUnit.module("Navigation Journey");

	opaTest("Should see the initial page of the app", function (Given, When, Then) {
	// Arrangements
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "com.sap.acs.ui.dashboard"
            }
        });

		//Cleanup
		Then.onTheAppPage.iShouldSeeTheApp().iTeardownMyApp();
    });

   
});
