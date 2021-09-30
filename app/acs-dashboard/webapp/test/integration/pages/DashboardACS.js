sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press"
], function (Opa5, Press) {
    "use strict";
    var sViewName = "com.sap.acs.ui.dashboard.view.DashboardACS";
    Opa5.createPageObjects({
        onTheAppPage: {

            actions: {},

            assertions: {

                iShouldSeeTheApp: function () {
                    return this.waitFor({
                        id: "idMapContainer",
                        viewName: sViewName,
                        success: function () {
                            Opa5.assert.ok(true, "The " + sViewName + " view is displayed");
                        },
                        errorMessage: "Did not find the " + sViewName + " view"
                    });
                }

            }
        }
    });

});
