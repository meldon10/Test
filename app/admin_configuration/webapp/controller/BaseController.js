sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], 
    /** 
     * @param {typeof sap.ui.core.Controller} Controller 
     * @param {typeof sap.ui.core.UIComponent} UIComponent 
     */
    function(Controller, UIComponent) {
        'use strict'; 
        return Controller.extend("adminconfiguration.adminconfiguration.controller.BaseController", {

            /**
             * Convenience method for getting the component model by name.
             * @param {string} sName - model name 
             * @returns {sap.ui.model.Model} model instance
             */
            getComponentModel: function (sName) {
                return this.getOwnerComponent().getModel(sName);
            },

            /**
             * Convenience method for getting the view model by name.
             * @param {string} sName - model name
             * @returns {sap.ui.model.Model} model instance 
             */
            getModel: function (sName) {
                return this.getView().getModel(sName);
            },

            /**
             * Convenience method for getting i18n.
             * @returns {sap.ui.model.Model} model instance
             */
            getI18nModel: function () {
                return this.getOwnerComponent().getModel("i18n");
            },

            /**
             * Convenience method for setting the view model.
             * @param {sap.ui.model.Model} oModel the model instance
             * @param {string} sName- model name
             * @returns {sap.ui.core.mvc.View} the view instance
             */
            setModel: function (oModel, sName) {
                return this.getView().setModel(oModel, sName);
            },
            
            /**
             * Convenience method for accessing the router.
             * @returns {sap.ui.core.routing.Router} the router for this component
             */
            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },
            
            /**
             * convenience method for accessing the control.
             * @param {string} controlId - control id
             * @returns {sap.ui.core.Control} control instance
             */
            getControl: function (controlId) {
                return this.byId(controlId);
            },

            /**
             * convenience method for accessing the framents's control.
             * @param {string} controlId - control id
             * @returns {sap.ui.core.Control} control instance
             */
            getFragmentControl: function (controlId) {
                return sap.ui.getCore().byId(controlId);
            }        
    });
});