sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], function (JSONModel, Device) {
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
        * It creates security model.
        * @returns {sap.ui.model.Model} model instance
        */
        createSecurityModel: function () {
            var oModel = new JSONModel();
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

    };
});