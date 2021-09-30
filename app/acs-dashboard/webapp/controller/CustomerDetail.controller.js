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
                oVisibilityModel.updateBindings();
                this.getRouter().getRoute("customerDetail").attachPatternMatched(this._onObjectMatched, this);
                this.setMapData();
                this._oView = this.getView();
                this._oView.addEventDelegate({
                    onBeforeHide: function (oEvent) {
                        this.getControl("idCustomerDetailMapContainer").setFullScreen(false);
                    },
                    onAfterHide: function (oEvent) {
                        //we might need this function in future
                    }
                }, this)
            },

            /**
             * update the bindings
             * @param {sap.ui.base.Event} oEvent 
             */
            _onObjectMatched: function (oEvent) {
                var sSpotPath = window.decodeURIComponent(oEvent.getParameter("arguments").details),
                    oGeoMapZoom = this.getControl("idmap"),
                    sMinZoomLevel = Constants.ZoomMaps.valueMinLenZoom,
                    sMapLat = Constants.ZoomMaps.valueMapslats,
                    sMapLon = Constants.ZoomMaps.valueMapslons,
                    oSharedModel = this.getComponentModel("shared"),
                    oSharedModelMapSpots = this.getComponentModel("shared").getProperty("/mapSpots");
                this.headerDataBinding(sSpotPath);
                if (!oSharedModelMapSpots) {
                    this.getRouter().navTo("RouteDashboardACS");
                }
                oSharedModel.setProperty("/mapSpotsCustomerDetails", oSharedModelMapSpots);
                oSharedModel.setProperty("/imagesCustomerDetails", Constants.Images);
                oSharedModel.updateBindings(true);
                var aZoomLatLong = this.fnsetZoomGeocode(oSharedModelMapSpots);
                if (aZoomLatLong.alons.length && aZoomLatLong.alats.length) {
                    if (aZoomLatLong.alons.length == sMapLat && aZoomLatLong.alats.length == sMapLat) {
                        oGeoMapZoom.zoomToGeoPosition(aZoomLatLong.alons, aZoomLatLong.alats, sMinZoomLevel);
                    } else {
                        oGeoMapZoom.zoomToGeoPosition(aZoomLatLong.alons, aZoomLatLong.alats);
                    }
                }
            },

            /**
             * On press of Service Order, below function is called which navigates to s4 Hana app
             */
            onPressServiceOrder: function () {
                var sServiceOrderId = oEvent.getSource().getBindingContext("shared").getObject().SO_ID,
                    oSecurityModel = this.getComponentModel("security"),
                    sDestinationURL;
                $.ajax({
                    url: "/odata/v4/QuickLinksService/destinationURL",
                    type: Constants.Operation.GET,
                    async: true,
                    headers: {
                        'X-CSRF-Token': oSecurityModel.getProperty("/csrf_token")
                    },
                    contentType: "application/json",
                    success: function (oData, oResponse) {
                        sDestinationURL = oData.value[0].destinationURL;
                        var sLink = sDestinationURL + "#ServiceOrder-display?ServiceOrder=" + sServiceOrderId;
                        sap.m.URLHelper.redirect(sLink, true);
                    }.bind(this),
                    error: function (oError) {
                        this.setError(oResourceBundle.getText("noDestinationFound"));
                    }.bind(this)
                });
            },

            /**
             * bind the header data
             * @param sSpotPath position of the spot
             */
            headerDataBinding: function (sSpotPath) {
                var oI18nModel = this.getI18nModel(),
                    oResourceBundle = oI18nModel.getResourceBundle(),
                    oSecurityModel = this.getComponentModel("security"),
                    oVisibilityModel = this.getComponentModel("visibility"),
                    oSharedModel = this.getComponentModel("shared"),
                    oContext = this.getComponentModel("shared").getProperty(sSpotPath);
                this.aMessage = [];
                if (oContext) {
                    oVisibilityModel.setProperty("/BusyAppView", true);
                    $.ajax({
                        url: "/odata/v4/CustomerServiceOrder/ServiceOrderV2?filter=sold_to eq " + oContext.BUSINESSPARTNER,
                        type: Constants.Operation.GET,
                        async: true,
                        headers: {
                            'X-CSRF-Token': oSecurityModel.getProperty("/csrf_token")
                        },
                        contentType: "application/json",
                        success: function (oData, oResponse) {
                            oVisibilityModel.setProperty("/BusyAppView", false);
                            this.convertDateTimeLocal(oData.value);
                            oContext.service_orders = oData.value;
                            oContext.service_order_length = oData.value.length;
                            oSharedModel.setProperty("/situationTableCustomerDetails", oContext);
                        }.bind(this),
                        error: function (oError) {
                            oVisibilityModel.setProperty("/BusyAppView", false);
                            this.setError(oResourceBundle.getText("noServiceOrderData"));
                        }.bind(this)
                    });
                }
                oSharedModel.updateBindings(true);
            },

            /**
            * It is used to convert GMT date to local
            * @param {sap.ui.base.Event} oData - Service Order object
            */
            convertDateTimeLocal: function (oData) {
                for (var i = 0; i < oData.length; i++) {
                    //to fetch the fiori date format settings
                    var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance();
                    var sDueDate = oDateFormat.format(new Date(oData[i].due_date));
                    oData[i].due_date = sDueDate;
                    var sStartDate = oDateFormat.format(new Date(oData[i].start_date));
                    oData[i].start_date = sStartDate;
                }
            },

            /**
            * It is used to convert GMT date to local
            * @param {sap.ui.base.Event} oEvent - Filter Criteria
            */
            filterGlobally: function (oEvent) {
                var sQuery = oEvent.getParameter("query");
                this._oGlobalFilter = null;
                var aFilter = [];
                if (sQuery) {
                    this._oGlobalFilter = new Filter([
                        new Filter("SO_ID", FilterOperator.Contains, sQuery),
                        new Filter("description", FilterOperator.Contains, sQuery),
                        new Filter("service_order_type", FilterOperator.Contains, sQuery),
                        new Filter("service_priority", FilterOperator.Contains, sQuery),
                        new Filter("contact_person_name", FilterOperator.Contains, sQuery),
                        new Filter("start_date", FilterOperator.Contains, sQuery),
                        new Filter("due_date", FilterOperator.Contains, sQuery)
                    ], false);
                }
                var oFilter = null;
                if (this._oGlobalFilter) {
                    oFilter = this._oGlobalFilter;
                }
                this.getControl("idSituationTableFragment--situationTable").getBinding("rows").filter(oFilter)
            },

            /**
             * update the data binding on click of spots
             * @param {sap.ui.base.Event} oEvent 
             */
            onClickCustomerDetailSpot: function (oEvent) {
                this.getRouter().getRoute("customerDetail").attachPatternMatched(this._onObjectMatched, this);
                oSource = oEvent.getSource();
                var sSpotPath = oSource.getBindingContext("shared").getPath();
                this.headerDataBinding(sSpotPath)
            }
        });
    });