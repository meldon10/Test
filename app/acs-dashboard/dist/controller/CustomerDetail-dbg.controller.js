sap.ui.define([
    "com/sap/acs/ui/dashboard/controller/DashboardACS.controller",
    "sap/ui/model/json/JSONModel",
    "com/sap/acs/ui/dashboard/util/Constants",
    "com/sap/acs/ui/dashboard/util/formatter",
    "com/sap/acs/ui/dashboard/util/MapConfig",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof com.sap.acs.ui.dashboard.controller.DashboardACSController} DashboardController
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof com.sap.acs.ui.dashboard.util.Constants} Constants
     * @param {typeof com.sap.acs.ui.dashboard.util.formatter} formatter
     * @param {typeof com.sap.acs.ui.dashboard.util.MapConfig} MapConfig
     * @param {typeof sap.ui.core.Fragment} Fragment
     */
    function (DashboardACS, JSONModel, Constants, formatter, MapConfig, Fragment) {
        "use strict";
        return DashboardACS.extend("com.sap.acs.ui.dashboard.controller.CustomerDetail", {
            formatter: formatter,
            onInit: function () {
                var oVisibilityModel = this.getComponentModel("visibility");
                oVisibilityModel.setProperty("/mapSelectionCustomerDetails", false);
                oVisibilityModel.updateBindings();
                this.getRouter().getRoute("customerDetail").attachPatternMatched(this._onObjectMatched, this);
                this.setCountry();
                this.setMapData();
            },

            /**
             * update the bindings
             * @param {sap.ui.base.Event} oEvent 
             */
            _onObjectMatched: function (oEvent) {
                var sSpotPath = window.decodeURIComponent(oEvent.getParameter("arguments").details);
                this.headerDataBinding(sSpotPath);
                var oSharedModel = this.getComponentModel("shared");
                var oSharedModelMapSpots = this.getComponentModel("shared").getProperty("/mapSpots");
                if (!oSharedModelMapSpots) {
                    this.getRouter().navTo("RouteDashboardACS");
                }
                oSharedModel.setProperty("/mapSpotsCustomerDetails", oSharedModelMapSpots);
                oSharedModel.setProperty("/imagesCustomerDetails", Constants.Images);
                oSharedModel.updateBindings(true);
            },

            /**
             * In future we would be having a requirement to change the binding based on the Object Number click
             */
            onPressServiceOrder: function () {

            },

            /**
             * bind the header data
             * @param sSpotPath position of the spot
             */
            headerDataBinding: function (sSpotPath) {
                var oSharedModel = this.getComponentModel("shared");
                var oContext = this.getComponentModel("shared").getProperty(sSpotPath);
                if (oContext) {
                    oContext.service_order_length = oContext.service_orders.length;
                }
                oSharedModel.setProperty("/situationTableCustomerDetails", oContext);
                oSharedModel.updateBindings(true);
            },

            /**
            * It is used to handle event on change of map content.
            * @param {sap.ui.base.Event} oEvent - Event object
            */
            onMapContentChange: function (oEvent) {
                var oVisibilityModel = this.getComponentModel("visibility");
                var sMapSelectedId = oEvent.getParameter("selectedItemId").includes("idmap");
                if (sMapSelectedId) {
                    oVisibilityModel.setProperty("/mapSelectionCustomerDetails", false);
                }
                else {
                    oVisibilityModel.setProperty("/mapSelectionCustomerDetails", true);
                }
                oVisibilityModel.updateBindings();
            },

            /**
             * update the data binding on click of spots
             * @param {sap.ui.base.Event} oEvent 
             */
            onClickCustomerDetailSpot: function (oEvent) {
                oSource = oEvent.getSource();
                var sSpotPath = oSource.getBindingContext("shared").getPath();
                this.headerDataBinding(sSpotPath)
            }
        });
    });
