sap.ui.define([
	"com/sap/acs/ui/dashboard/controller/BaseController"
], 
    /**
     * @param {typeof com.sap.acs.ui.dashboard.controller.BaseController} BaseController 
     */
    function (BaseController) {
        "use strict";
        return BaseController.extend("com.sap.acs.ui.dashboard.controller.App", {
            onInit: function () {
                /* We will use this method in future to store logged in user id*/
                //this.getLoggedUser();
            }
    });
});