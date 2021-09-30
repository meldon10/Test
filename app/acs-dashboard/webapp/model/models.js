sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], 
    /**
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
     * @param {typeof sap.ui.Device} Device 
     */
    function (JSONModel, Device) {
        "use strict";
        return {

            /**
             * It creates global model for device.
             * @returns {sap.ui.model.Model} model instance
             */
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },
            
            /**
             * It creates global model to control visibility.
             * @returns {sap.ui.model.Model} model instance
             */
            createVisibilityModel: function () {
                var oModel = new JSONModel(
                    {
                        OpenServiceOrderTableVisibility: true,
                        OpenTaskTableVisibility: false,
                        FooterVisibility: false,
                        mapVisibility: true,
                        listVisibility: false,
                        AddLinkPanelVisibility: false,
                        AddLinkButtonVisibility: false,
                        UpdateLinkButtonVisibility: false,
                        BusyAppView: false,
                        SaveButton: false,
                        AddButton: false,
                        MarkASComplete: false                                                
                    }
                );
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            /**
             * It creates global message model.
             * @returns {sap.ui.model.Model} model instance
             */
            createMessageModel: function () {
                var oModel = new JSONModel();
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            /**
             * It creates global shared model.
             * @returns {sap.ui.model.Model} model instance
             */
            createSharedModel: function () {
                var oModel = new JSONModel();
                return oModel;
            },

            /**
             * It creates security model.
             * @returns {sap.ui.model.Model} model instance
             */
            createSecurityModel: function () {
                var oModel = new JSONModel();
                return oModel;
            },

            /**
             * It creates user model.
             * @returns {sap.ui.model.Model} model instance
             */
            createUserModel: function () {
                var oModel = new JSONModel();
                oModel.setDefaultBindingMode("OneWay");                
                return oModel;
            }
        };
});