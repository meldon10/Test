sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/sap/acs/ui/dashboard/model/models"
], 
    /** 
     * @param {typeof sap.ui.core.UIComponent} UIComponent 
     * @param {typeof sap.ui.Device} Device 
     * @param {typeof com.sap.acs.ui.dashboard.model.models} models 
     */    
    function (UIComponent, Device, models) {
        "use strict";        
        return UIComponent.extend("com.sap.acs.ui.dashboard.Component", {
        
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);
                // Enable routing
                this.getRouter().initialize();
                // Set the device model
                this.setModel(models.createDeviceModel(), "device");
                // Set the visibility model
                this.setModel(models.createVisibilityModel(), "visibility");
                 // Set the map selection model
                this.setModel(models.createVisibilityModel(), "mapselection");
                // Set the message model
                this.setModel(models.createMessageModel(), "message");
                // Set the shared model
                this.setModel(models.createSharedModel(), "shared"); 
                // Set the security model
                this.setModel(models.createSecurityModel(), "security"); 
                // Set the user model
                this.setModel(models.createUserModel(), "user");    
            }
    });
});
