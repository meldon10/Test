sap.ui.define([
    "com/sap/acs/ui/dashboard/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "com/sap/acs/ui/dashboard/util/Constants",
    "com/sap/acs/ui/dashboard/util/formatter",
    "com/sap/acs/ui/dashboard/util/MapConfig",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "com/sap/acs/ui/dashboard/util/Utils"
],
	/**
	 * @param {typeof com.sap.acs.ui.dashboard.controller.BaseController} BaseController
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof com.sap.acs.ui.dashboard.util.Constants} Constants
     * @param {typeof com.sap.acs.ui.dashboard.util.formatter} formatter
     * @param {typeof com.sap.acs.ui.dashboard.util.MapConfig} MapConfig
     * @param {typeof sap.ui.core.Fragment} Fragment
     * @param {typeof com.sap.acs.ui.dashboard.util.Utils} Utils
	 */
    function (BaseController, JSONModel, Constants, formatter, MapConfig, Fragment, MessageBox, Utils) {
        return BaseController.extend("com.sap.acs.ui.dashboard.controller.DashboardACS", {
            formatter: formatter,
            onInit: function () {
                this.aMessage = [];
                var oMessageModel = this.getComponentModel("message");
                var oAdminConfig = this.getAdminConfiguration();
                var oSharedModel = this.getComponentModel("shared");
                var oButton = this.getControl("idMessagePopoverButton");
                var oAdminConfigModel = this.getComponentModel("shared");
                var oVisibilityModel = this.getComponentModel("visibility");
                var oI18nModel = this.getI18nModel();
                var oResourceBundle = oI18nModel.getResourceBundle();
                oAdminConfig.then(function (oData) {
                    if (oData.length === Constants.ErrorMessage.valueMessageLen) {
                        this.setError(oResourceBundle.getText("noadmin"));
                    }
                    this.setFooterVisibleError(this.aMessage);
                    oSharedModel.setProperty("/admin", oData);
                }.bind(this));

                var createEditTask = {
                    taskName: "",
                    valueStateTaskName: "None",
                    valueStateTextTaskName: "",
                    taskDesc: "",
                    valueStateTaskNameDesc: "None",
                    valueStateTextTaskNameDesc: "",
                    highPriority: false,
                    mediumPriority: true,
                    lowPriority: false,
                    status: "1",
                    dueDate: new Date(),
                    minDate: new Date(),
                    valueStateDueDate: "None",
                    valueStateTextDueDate: "",
                    createUpdateToDoFormTitle: "",
                    checked: false
                };
                oSharedModel.setProperty("/createEditTask", createEditTask);
                oSharedModel.setProperty("/oSelectedTask", {});

                var createQuickLinks = {
                    quickLinkName: "",
                    quickLinkUrl: "",
                    valueStateNameQuickLinks: "None",
                    valueStateTextNameQuickLinks: "",
                    valueStateUrlQuickLinks: "None",
                    valueStateTextUrlQuickLinks: ""
                };
                oSharedModel.setProperty("/createQuickLinks", createQuickLinks);
                oSharedModel.setProperty("/oSelectedQuickLink", {});
                oSharedModel.setProperty("/oMapHeight", "auto");
                oMessageModel.setProperty("/item", []);
                oMessageModel.setProperty("/messageSize", "");

                this.setCountry();
                this.setMapData();
                this.setMyToDoList();
                this.setQuickLinks();
                this.setWorkList();

                // calling the csrf token util to update the csrf token
                var csrfToken = Utils.fetchCsrfToken("/odata/v4/TodoService/task");
                var oSecurityModel = this.getComponentModel("security");
                csrfToken.then(function (token) {
                    oSecurityModel.setProperty('/csrf_token', token)
                }.bind(this));
            },

            /**
             * Convenience method for getting the admin configurations.
             * @returns {Promise} promise instance. 
             */
            getAdminConfiguration: function () {
                var oVisibilityModel = this.getComponentModel("visibility"),
                    oI18nModel = this.getI18nModel(),
                    oResourceBundle = oI18nModel.getResourceBundle();
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: "/odata/v4/sap/opu/odata/sap/IssueConfiguration",
                        async: true,
                        success: function (oData, oResponse) {
                            resolve(oData.value);
                        }.bind(this),
                        error: function (error) {
                            this.setError(oResourceBundle.getText("noadmin"));
                            reject();
                        }.bind(this)
                    });
                }.bind(this));
            },

            /**
             * Region/Country filter binding method.
             */
            setCountry: function () {
                var oVisibilityModel = this.getComponentModel("visibility"),
                    oI18nModel = this.getI18nModel(),
                    oResourceBundle = oI18nModel.getResourceBundle();
                $.get({
                    url: "/odata/v4/CustomerServiceOrder/Country",
                    success: function (data) {
                        if (data.value.length === Constants.ErrorMessage.valueMessageLen) {
                            this.setError(oResourceBundle.getText("nocountry"));
                        }
                        else {
                            var oSharedModel = this.getComponentModel("shared");
                            oSharedModel.setProperty("/country", data.value);
                        }
                        this.setFooterVisibleError(this.aMessage);
                    }.bind(this),
                    error: function (error) {
                        this.setError(oResourceBundle.getText("nocountry"));
                    }.bind(this)
                });
            },

            /**
             * It is called when "Go" button is pressed in filter bar.
             */
            onSearchFilterBar: function () {
                var oFilterBar = this.getControl("idACSDashFilterBar"),
                    aFilterItem = oFilterBar.getFilterItems(),
                    oControl = null,
                    noFilterValue = true,
                    oVisibilityModel = this.getComponentModel("visibility"),
                    oSharedModel = this.getComponentModel("shared"),
                    oButton = this.getControl("idMessagePopoverButton"),
                    oI18nModel = this.getI18nModel(),
                    oResourceBundle = oI18nModel.getResourceBundle(),
                    aPlainFilter = [],
                    oMessageModel = this.getComponentModel("message"),
                    oGeoMapZoom = this.getControl("idmap"),
                    sMinZoomLevel = Constants.ZoomMaps.valueMinLenZoom,
                    sMapLat = Constants.ZoomMaps.valueMapslats,
                    sMapLon = Constants.ZoomMaps.valueMapslons,
                    aFilter = [];
                this.aMessage = [];
                oMessageModel.setProperty("/item", this.aMessage);
                oMessageModel.updateBindings(true);
                aFilterItem.map(function (oFilterItem) {
                    oControl = oFilterItem.getControl();
                    switch (oControl.getMetadata().getName()) {
                        case "sap.m.Input":
                            if (oControl.getValue()) {
                                aPlainFilter.push(oFilterItem.getName() + " eq " + "'" + oControl.getValue() + "'");
                                noFilterValue = false;
                            }
                            break;
                        case "sap.m.MultiComboBox":
                            if (oControl.getSelectedKeys().length) {
                                var aUnique = [...new Set(oControl.getSelectedKeys())]
                                aUnique.map(function (sKey) {
                                    aFilter.push(oFilterItem.getName() + " eq " + "'" + sKey + "'");
                                });
                                noFilterValue = false;
                            }
                            break;
                    }
                }.bind(this));

                if (noFilterValue) {
                    this.setError(oResourceBundle.getText("nofilterEntered"));
                    oSharedModel.setProperty("/mapSpots", {});
                } else {
                    var oAdminConfigMap = oSharedModel.getProperty("/admin"),
                        oBusinessPatrner = this.getBusinessPatrner(aPlainFilter, aFilter);
                    oBusinessPatrner.then(function (oData) {
                        if (oData.length) {
                            var azoomlatlong = this.fnsetZoomGeocode(oData);
                            if (azoomlatlong.alons.length && azoomlatlong.alats.length) {
                                if (azoomlatlong.alons.length == sMapLat && azoomlatlong.alats.length == sMapLat) {
                                    oGeoMapZoom.zoomToGeoPosition(azoomlatlong.alons, azoomlatlong.alats, sMinZoomLevel);
                                } else {
                                    oGeoMapZoom.zoomToGeoPosition(azoomlatlong.alons, azoomlatlong.alats);
                                }
                            }

                            var Aspot = this.setMapSpotsColor(oData, oAdminConfigMap);
                            oSharedModel.setProperty("/mapSpots", Aspot);
                            this.setFooterVisibleError(this.aMessage);
                        } else {
                            oSharedModel.setProperty("/mapSpots", {});
                            this.setError(oResourceBundle.getText("noDataText"));
                        }
                        oVisibilityModel.setProperty("/BusyAppView", false);
                    }.bind(this));
                }
                oVisibilityModel.updateBindings();
            },

            /**
            * It is used to make a call with filter parameters to backend.
            * @param {Array} aPlainFilter - filter parameters
            * @param {Array} aFilter - filter parameters
            * @returns {object} Promise object
            */
            getBusinessPatrner: function (aPlainFilter, aFilter) {
                var sURL = "/odata/v4/CustomerServiceOrder/BusinessPartner?$filter=",
                    oI18nModel = this.getI18nModel(),
                    oResourceBundle = oI18nModel.getResourceBundle(),
                    sPlainFilter = aPlainFilter.join(" and "),
                    sFilter = aFilter.join(" or "),
                    sFilterURL = "",
                    oVisibilityModel = this.getComponentModel("visibility");
                if (sPlainFilter.length) {
                    if (sFilter.length) {
                        sFilterURL = sPlainFilter.concat(" and ", sFilter);
                    } else {
                        sFilterURL = sPlainFilter;
                    }
                } else {
                    sFilterURL = sFilter;
                }
                oVisibilityModel.setProperty("/BusyAppView", true);
                sFinalURL = sURL + sFilterURL + "&$expand=service_orders";

                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: sFinalURL,
                        type: "GET",
                        async: true,
                        contentType: "application/json",
                        success: function (oData, oResponse) {
                            resolve(oData.value);
                        }.bind(this),
                        error: function (error) {
                            oVisibilityModel.setProperty("/BusyAppView", false);
                            if (error.responseText) {
                                var errroResponse = JSON.parse(error.responseText)
                                this.setError(errroResponse.error.message);
                            }
                            reject();
                        }.bind(this)
                    });
                }.bind(this));
            },

            /**
            * Convenience method for setting the map color spots based on logic.
            * @param {Object} oData - Object containing the customer details
            * @param {Object} oAdminConfigMap - Object containing the admin configurations
            * @returns {Object} Object with color property added.
            */
            setMapSpotsColor: function (oData, oAdminConfigMap) {
                var sAddressLatLong,
                    sAdminValue = Constants.MaxValue.Max,
                    sDefault = Constants.SpotsColor.Default;
                for (var i = 0; i < oData.length; i++) {
                    var serviceOrderOpen = Constants.MaxValue.InitializationServiceOrder;
                    serviceOrderOpen = oData[i].service_orders.length;
                    for (var m = 0; m < oAdminConfigMap.length; m++) {
                        if (oAdminConfigMap[m].maximumValue === sAdminValue && serviceOrderOpen >= parseInt(oAdminConfigMap[m].minimumValue)) {
                            oData[i].colorSpots = oAdminConfigMap[m].color;
                        }
                        else if (serviceOrderOpen >= parseInt(oAdminConfigMap[m].minimumValue) && serviceOrderOpen <= parseInt(oAdminConfigMap[m].maximumValue)) {
                            oData[i].colorSpots = oAdminConfigMap[m].color;
                        }
                        else if (oAdminConfigMap[m].minimumValue === Constants.MaxValue.DefaultValue || oAdminConfigMap[m].maximumValue === Constants.MaxValue.DefaultValue) {
                            oData[i].colorSpots = sDefault;
                        }
                    }
                }
                return oData;
            },

            /**
            * It binds data to Map card.
            */
            setMapData: function () {
                var oGeoMap = this.getControl("idmap");
                this.oMapConfig = MapConfig;
                //set the Map configuration for the base tile map used
                if (oGeoMap) {
                    oGeoMap.setMapConfiguration(this.oMapConfig);
                    oGeoMap.setRefMapLayerStack("Default");
                }
            },

            /**
            * It is used to handle event on click of spots on map.
            * @param {sap.ui.base.Event} oEvent - Event object
            */
            onClickSpot: function (oEvent) {
                oSource = oEvent.getSource();
                var spot = oSource.getBindingContext("shared").getPath();
                var oGeoMap = this.getControl("idmap");
                var oGeoMapContainer = this.getControl("idMapContainer");
                oGeoMapContainer.setFullScreen(false);
                this.getRouter().navTo("customerDetail",
                    {
                        details: window.encodeURIComponent(spot)
                    });
            },

            /**
             * It is used to handle segmented button event of maps and list.
             * @param {sap.ui.base.Event} oEvent - Event object
             */
            onSelectionChangeSegmentedButtonMaps: function (oEvent) {
                var oSource = oEvent.getSource(),
                    sKey = oSource.getSelectedKey(),
                    oSharedModel = this.getComponentModel("shared");
                oVisibilityModel = this.getComponentModel("visibility");
                if (sKey === Constants.SegmentedItem.Maps) {
                    oVisibilityModel.setProperty("/mapVisibility", true);
                    oVisibilityModel.setProperty("/listVisibility", false);
                    oSharedModel.setProperty("/oMapHeight", "auto");
                }
                else if (sKey === Constants.SegmentedItem.List) {
                    oVisibilityModel.setProperty("/mapVisibility", false);
                    oVisibilityModel.setProperty("/listVisibility", true);
                    oSharedModel.setProperty("/oMapHeight", "100%");
                }
                oVisibilityModel.updateBindings();
                oSharedModel.updateBindings();
            },

            /**
             * It binds data to "My To Do List" card.
             */
            setMyToDoList: function () {
                var oSharedModel = this.getComponentModel("shared"),
                    oI18nModel = this.getI18nModel(),
                    oResourceBundle = oI18nModel.getResourceBundle(),
                    oVisibilityModel = this.getComponentModel("visibility"),
                    oUserModel = this.getComponentModel('user');
                oVisibilityModel.setProperty("/BusyAppView", true);

                $.ajax({
                    url: "/odata/v4/TodoService/task?$filter=status eq '" + Constants.Status.OPen + "'",
                    type: Constants.Operation.GET,
                    async: true,
                    contentType: "application/json",
                    success: function (oData, oResponse) {
                        var oData = oData.value,
                            aResult = this.getDisplayToList(oData);
                        oSharedModel.setProperty("/myToDoList", aResult);
                        oVisibilityModel.setProperty("/BusyAppView", false);
                        this.setFooterVisibleError(this.aMessage);
                    }.bind(this),
                    error: function (oError) {
                        oVisibilityModel.setProperty("/BusyAppView", false);
                        this.setError(oResourceBundle.getText("notodolist"));
                    }.bind(this)
                })
            },

            /**
             * It converts and returns formatted data for "My To Do List" card.
             * @param {Array} aResult 
             * @returns {Array} aResult
             */
            getDisplayToList: function (aResult) {
                aResult.map(function (oTask, index) {
                    aResult[index].due_by = new Date(oTask.due_by);
                });

                return aResult;
            },

            /**
             * It opens create/update task fragment.
             */
            getMyToDoCreateUpdateFragment: function () {
                var oView = this.getView();
                if (!this._oCreateMyToDoTask) {
                    this._oCreateMyToDoTask = Fragment.load({
                        id: oView.getId(),
                        name: "com.sap.acs.ui.dashboard.view.fragments.CreateEditTask",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._oCreateMyToDoTask.then(function (oDialog) {
                    oDialog.open();
                });
            },

            /**
             * It sends request to open create task fragment.
             */
            onPressCreateMyToDoTask: function () {
                var oVisibilityModel = this.getComponentModel("visibility"),
                    oSharedModel = this.getComponentModel("shared"),
                    oI18nModel = this.getI18nModel(),
                    oResourceBundle = oI18nModel.getResourceBundle();
                oVisibilityModel.setProperty("/SaveButton", false);
                oVisibilityModel.setProperty("/AddButton", true);
                oVisibilityModel.setProperty("/MarkASComplete", false);
                oSharedModel.setProperty("/createEditTask/createUpdateToDoFormTitle", oResourceBundle.getText("addTasks"));
                this.getMyToDoCreateUpdateFragment();
            },

            /**
             * It sends request to open create quick link fragment.
             */
            onPressCreateQuickLinksAdd: function () {
                var oVisibilityModel = this.getComponentModel("visibility"),
                    oSharedModel = this.getComponentModel("shared"),
                    oI18nModel = this.getI18nModel(),
                    oResourceBundle = oI18nModel.getResourceBundle();
                oVisibilityModel.setProperty("/SaveQuickLinkButton", false);
                oVisibilityModel.setProperty("/AddQuickLinkButton", true);
                oSharedModel.setProperty("/createQuickLinks/createUpdateQuickLinkTitle", oResourceBundle.getText("addQuickLinks"));
                this.onPressCreateUpdateQuickLinks();
            },

            /**
             * It opens "Create Quick Links" fragment.
             */
            onPressCreateUpdateQuickLinks: function () {
                var oView = this.getView();
                if (!this._oCreateQuickLinks) {
                    this._oCreateQuickLinks = Fragment.load({
                        id: oView.getId(),
                        name: "com.sap.acs.ui.dashboard.view.fragments.CreateQuickLink",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._oCreateQuickLinks.then(function (oDialog) {
                    oDialog.open();
                });
            },

            /**
             * It calls before open "My To Do Task" fargment.
             * It sets data to fragment.
             */
            onBeforeOpenCreateEditTaskDialog: function () {
                var oSharedModel = this.getComponentModel("shared");
                if (Object.keys(oSharedModel.getProperty("/oSelectedTask")).length) {
                    oSharedModel.setProperty("/createEditTask/taskName", oSharedModel.getProperty("/oSelectedTask/task_name"));
                    oSharedModel.setProperty("/createEditTask/taskDesc", oSharedModel.getProperty("/oSelectedTask/task_description"));
                    oSharedModel.setProperty("/createEditTask/dueDate", oSharedModel.getProperty("/oSelectedTask/due_by"));
                    if (Number(oSharedModel.getProperty("/oSelectedTask/priority")) === Constants.Priority.One) {
                        oSharedModel.setProperty("/createEditTask/lowPriority", true);
                    } else if (Number(oSharedModel.getProperty("/oSelectedTask/priority")) === Constants.Priority.Two) {
                        oSharedModel.setProperty("/createEditTask/mediumPriority", true);
                    } else if (Number(oSharedModel.getProperty("/oSelectedTask/priority")) === Constants.Priority.Three) {
                        oSharedModel.setProperty("/createEditTask/highPriority", true);
                    }
                }
            },

            /**
             * It calls before open "Quick links" fargment.
             * It sets data to fragment.
             */
            onBeforeOpenCreateQuickLinkDialog: function () {
                var oSharedModel = this.getComponentModel("shared");
                if (Object.keys(oSharedModel.getProperty("/oSelectedQuickLink")).length) {
                    oSharedModel.setProperty("/createQuickLinks/quickLinkName", oSharedModel.getProperty("/oSelectedQuickLink/quickLink_name"));
                    oSharedModel.setProperty("/createQuickLinks/quickLinkUrl", oSharedModel.getProperty("/oSelectedQuickLink/quickLink_URL"));
                }
            },

            /**
            * It resets the model data.
            */
            onBeforeCloseCreateEditTaskDialog: function () {
                var oSharedModel = this.getComponentModel("shared");
                oSharedModel.setProperty("/createEditTask/taskName", "");
                oSharedModel.setProperty("/createEditTask/valueStateTaskName", Constants.SpotsType.None);
                oSharedModel.setProperty("/createEditTask/valueStateTextTaskName", "");
                oSharedModel.setProperty("/createEditTask/taskDesc", "");
                oSharedModel.setProperty("/createEditTask/valueStateTaskNameDesc", Constants.SpotsType.None);
                oSharedModel.setProperty("/createEditTask/valueStateTextTaskNameDesc", "");
                oSharedModel.setProperty("/createEditTask/highPriority", false);
                oSharedModel.setProperty("/createEditTask/mediumPriority", true);
                oSharedModel.setProperty("/createEditTask/lowPriority", false);
                oSharedModel.setProperty("/createEditTask/status", Constants.Priority.One.toString());
                oSharedModel.setProperty("/createEditTask/dueDate", new Date());
                oSharedModel.setProperty("/createEditTask/valueStateDueDate", Constants.SpotsType.None);
                oSharedModel.setProperty("/createEditTask/valueStateTextDueDate", "");
                oSharedModel.setProperty("/createEditTask/checked", false);
                oSharedModel.setProperty("/oSelectedTask", {});
            },

            /**
             * It resets the model data for create quick links.
             */
            onBeforeCloseCreateQuickLinkDialog: function () {
                var oSharedModel = this.getComponentModel("shared");
                oSharedModel.setProperty("/createQuickLinks/quickLinkName", "");
                oSharedModel.setProperty("/createQuickLinks/quickLinkUrl", "");
                oSharedModel.setProperty("/createQuickLinks/valueStateNameQuickLinks", Constants.SpotsType.None);
                oSharedModel.setProperty("/createQuickLinks/valueStateTextNameQuickLinks", "");
                oSharedModel.setProperty("/createQuickLinks/valueStateUrlQuickLinks", Constants.SpotsType.None);
                oSharedModel.setProperty("/createQuickLinks/valueStateTextUrlQuickLinks", "");
                oSharedModel.setProperty("/oSelectedQuickLink", {});
            },

            /**
             * It closes "My To Do Task" fragment.
             */
            onPressClose: function () {
                this._oCreateMyToDoTask.then(function (oDialog) {
                    oDialog.close();
                });
            },

            /**
             * It closes "Quick links" fragment.
             */
            onPressCloseQuickLink: function () {
                this._oCreateQuickLinks.then(function (oDialog) {
                    oDialog.close();
                });
            },

            /**
             * It creates/updates record in database table.
             * @param {object} oPayload - Paylod to create/update record
             * @param {string} sType - call type
             * @param {string} sURL - API url
             */
            createUpdateToDoTask: function (sType, sURL) {
                var oVisibilityModel = this.getComponentModel("visibility"),
                    sMessage = "",
                    sMessageTodo = "",
                    oI18nModel = this.getI18nModel(),
                    oMessageModel = this.getComponentModel("message"),
                    oResourceBundle = oI18nModel.getResourceBundle(),
                    oSharedModel = this.getComponentModel("shared"),
                    oProperty = oSharedModel.getProperty("/createEditTask"),
                    oSecurityModel = this.getComponentModel("security"),
                    priority = "",
                    status = "";

                if (!this.getValidationCheck(oResourceBundle)) {
                    priority = this.getPriority(oProperty),
                        status = this.getStatus(oProperty);
                    jsonString = JSON.stringify(this.getPayloadPUTPOST(oProperty, priority, status));
                    this.aMessage = [];
                    oMessageModel.setProperty("/item", this.aMessage);
                    oMessageModel.updateBindings(true);
                    oVisibilityModel.setProperty("/BusyAppView", true);
                    $.ajax({
                        url: sURL,
                        type: sType,
                        async: true,
                        headers: {
                            'X-CSRF-Token': oSecurityModel.getProperty("/csrf_token")
                        },
                        contentType: "application/json",
                        data: jsonString,
                        success: function (oData, oResponse) {
                            this.onPressClose();
                            oVisibilityModel.setProperty("/BusyAppView", false);
                            oVisibilityModel.setProperty("/FooterVisibility", false);
                            sMessage = sType === Constants.Operation.PUT ? oResourceBundle.getText("successUpdateToDoTaskMessage") : oResourceBundle.getText("successCreateToDoTaskMessage");
                            MessageBox.success(sMessage, {
                                title: oResourceBundle.getText("success"),
                                actions: MessageBox.Action.OK,
                                onClose: function (sAction) {
                                    this.setMyToDoList();
                                }.bind(this)
                            });
                        }.bind(this),
                        error: function (oError) {
                            oVisibilityModel.setProperty("/BusyAppView", false);
                            sMessageTodo = sType === Constants.Operation.POST ? oResourceBundle.getText("taskcreationfailed") : oResourceBundle.getText("taskupdatingfailed");
                            this.setError(sMessageTodo);
                        }.bind(this)
                    });
                }
            },

            /**
             * It creates/updates record in database table for links.
             * @param {string} sType - call type
             * @param {string} sURL - API url
             */
            createUpdateLinks: function (sType, sURL) {
                var oSharedModel = this.getComponentModel("shared"),
                    oPropertyQuickLink = oSharedModel.getProperty("/createQuickLinks"),
                    oVisibilityModel = this.getComponentModel("visibility"),
                    sMessageLinks = "",
                    sErrorLinks = "",
                    oMessageModel = this.getComponentModel("message"),
                    oI18nModel = this.getI18nModel(),
                    jsonStringLinks,
                    oSecurityModel = this.getComponentModel("security"),
                    oResourceBundle = oI18nModel.getResourceBundle();

                if (!this.getValidationCheckLinks(oResourceBundle)) {
                    jsonStringLinks = JSON.stringify(this.getPayloadPUTPOSTLinks(oPropertyQuickLink));
                    this.aMessage = [];
                    oMessageModel.setProperty("/item", this.aMessage);
                    oMessageModel.updateBindings(true);
                    oVisibilityModel.setProperty("/BusyAppView", true);
                    $.ajax({
                        url: sURL,
                        type: sType,
                        async: true,
                        headers: {
                            'X-CSRF-Token': oSecurityModel.getProperty("/csrf_token")
                        },
                        contentType: "application/json",
                        data: jsonStringLinks,
                        success: function (oData, oResponse) {
                            this.onPressCloseQuickLink();
                            oVisibilityModel.setProperty("/BusyAppView", false);
                            oVisibilityModel.setProperty("/FooterVisibility", false);
                            sMessageLinks = sType === Constants.Operation.POST ? oResourceBundle.getText("quicklinkcreatedsuccess") : oResourceBundle.getText("quicklinkupdatedsuccess");
                            MessageBox.success(sMessageLinks, {
                                title: oResourceBundle.getText("success"),
                                actions: MessageBox.Action.OK,
                                onClose: function (sAction) {
                                    this.setQuickLinks();
                                }.bind(this)
                            });
                        }.bind(this),
                        error: function (oError) {
                            oVisibilityModel.setProperty("/BusyAppView", false);
                            sErrorLinks = sType === Constants.Operation.POST ? oResourceBundle.getText("quicklinkcreationfailed") : oResourceBundle.getText("quicklinkupdatingfailed");
                            this.setError(sErrorLinks);
                        }.bind(this)
                    });
                }
            },

            /**
             * It checks mandatory fields validations.
             * @param {sap.ui.Object} oResourceBundle
             * @returns {Boolean} bFlag
             */
            getValidationCheck: function (oResourceBundle) {
                var bFlag = false,
                    oTaskName = this.getControl("idTaskNameInput"),
                    oTaskDesc = this.getControl("idTaskDescriptionTextArea"),
                    oDueDate = this.getControl("idDatePickerCreateEditTask"),
                    oSharedModel = this.getComponentModel("shared"),
                    oProperty = oSharedModel.getProperty("/createEditTask");
                if (!oProperty.taskName) {
                    oSharedModel.setProperty("/createEditTask/valueStateTaskName", Constants.SpotsType.Error);
                    oSharedModel.setProperty("/createEditTask/valueStateTextTaskName", oResourceBundle.getText("validationTaskName"));
                    oTaskName.openValueStateMessage();
                    bFlag = true;
                }
                if (!oProperty.taskDesc) {
                    oSharedModel.setProperty("/createEditTask/valueStateTaskNameDesc", Constants.SpotsType.Error);
                    oSharedModel.setProperty("/createEditTask/valueStateTextTaskNameDesc", oResourceBundle.getText("validationTaskDesc"));
                    oTaskDesc.openValueStateMessage();
                    bFlag = true;
                }
                if (!oProperty.dueDate) {
                    oSharedModel.setProperty("/createEditTask/valueStateDueDate", Constants.SpotsType.Error);
                    oSharedModel.setProperty("/createEditTask/valueStateTextDueDate", oResourceBundle.getText("validationDueDate"));
                    oDueDate.openValueStateMessage();
                    bFlag = true;
                }

                return bFlag;
            },

            /**
             * It checks mandatory fields validations for quick links.
             * @param {sap.ui.Object} oResourceBundle
             * @returns {Boolean} bFlag
             */
            getValidationCheckLinks: function (oResourceBundle) {
                var qFlag = false,
                    oQuickLinkName = this.getControl("idQuickLinksNameInput"),
                    oQuickLinkUrl = this.getControl("idQuickLinksUrlInput"),
                    oSharedModel = this.getComponentModel("shared"),
                    regexMatch = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);
                oPropertyQuickLink = oSharedModel.getProperty("/createQuickLinks");
                //UI validations
                if (!oPropertyQuickLink.quickLinkName) {
                    oSharedModel.setProperty("/createQuickLinks/valueStateNameQuickLinks", Constants.SpotsType.Error);
                    oSharedModel.setProperty("/createQuickLinks/valueStateTextNameQuickLinks", oResourceBundle.getText("valueStateTextNameQuickLinks"));
                    oQuickLinkName.openValueStateMessage();
                    qFlag = true;
                }
                if ((!oPropertyQuickLink.quickLinkUrl)) {

                    oSharedModel.setProperty("/createQuickLinks/valueStateUrlQuickLinks", Constants.SpotsType.Error);
                    oSharedModel.setProperty("/createQuickLinks/valueStateTextUrlQuickLinks", oResourceBundle.getText("valueStateTextUrlQuickLinks"));
                    oQuickLinkUrl.openValueStateMessage();
                    qFlag = true;

                }
                if (oPropertyQuickLink.quickLinkUrl) {
                    if (!(regexMatch.test(oPropertyQuickLink.quickLinkUrl))) {
                        oSharedModel.setProperty("/createQuickLinks/valueStateUrlQuickLinks", Constants.SpotsType.Error);
                        oSharedModel.setProperty("/createQuickLinks/valueStateTextUrlQuickLinks", oResourceBundle.getText("valueStateTextValidUrlQuickLinks"));
                        oQuickLinkUrl.openValueStateMessage();
                        qFlag = true;
                    }
                }

                return qFlag;
            },

            /**
             * It opens confirmation dialog for deletion.
             * @param {sap.ui.base.Event} oEvent
             */
            onPressDeleteMyToDoTask: function (oEvent) {
                var oView = this.getView(),
                    oI18nModel = this.getI18nModel(),
                    oResourceBundle = oI18nModel.getResourceBundle(),
                    oText = null,
                    sMessage = "";

                this._oBindingContext = oEvent.getSource().getBindingContext("shared");
                if (!this._oDeleteMyToDoTask) {
                    this._oDeleteMyToDoTask = Fragment.load({
                        id: oView.getId(),
                        name: "com.sap.acs.ui.dashboard.view.fragments.ConfirmDialog",
                        controller: this
                    }).then(function (oConfirmationDialog) {
                        oView.addDependent(oConfirmationDialog);
                        return oConfirmationDialog;
                    });
                }

                this._oDeleteMyToDoTask.then(function (oConfirmationDialog) {
                    oConfirmationDialog.open();
                    oText = this.getControl("idDeleteTaskPanelText");
                    sMessage = oResourceBundle.getText("confirmationDeleteToDoTaskMessage") + ' \n "' + this._oBindingContext.getProperty("task_name") + '"' + "?";
                    oText.setText(sMessage);
                }.bind(this));
            },

            /**
             * It deletes created task from "My To Do List" card.
             */
            onPressDeleteTask: function () {
                var staksId = this._oBindingContext.getProperty("TASK_ID"),
                    oI18nModel = this.getI18nModel(),
                    oResourceBundle = oI18nModel.getResourceBundle(),
                    oMessageModel = this.getComponentModel("message"),
                    oVisibilityModel = this.getComponentModel("visibility");
                this.aMessage = [];
                oMessageModel.setProperty("/item", this.aMessage);
                oMessageModel.updateBindings(true);

                var oSecurityModel = this.getComponentModel("security");
                oVisibilityModel.setProperty("/BusyAppView", true);
                $.ajax({
                    url: "/odata/v4/TodoService/task(" + staksId + ")",
                    type: Constants.Operation.DELETE,
                    async: true,
                    headers: {
                        'X-CSRF-Token': oSecurityModel.getProperty("/csrf_token")
                    },
                    contentType: "application/json",
                    success: function (oData, oResponse) {
                        this.onPressCancel();
                        oMessageModel = this.getComponentModel("message");
                        oVisibilityModel.setProperty("/BusyAppView", false);
                        oVisibilityModel.setProperty("/FooterVisibility", false);
                        MessageBox.success(oResourceBundle.getText("successDeleteToDoTaskMessage"), {
                            title: oResourceBundle.getText("success"),
                            actions: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                this.setMyToDoList();
                            }.bind(this)
                        });
                    }.bind(this),
                    error: function (oError) {
                        this.setError(oResourceBundle.getText("taskdeletionfailed"));
                        oVisibilityModel.setProperty("/BusyAppView", false);
                    }.bind(this)
                })
            },

            /**
            * It opens confirmation dialog for deletion.
            * @param {sap.ui.base.Event} oEvent
            */
            onPressDeleteQuickLinkDialog: function (oEvent) {
                var oView = this.getView(),
                    oI18nModel = this.getI18nModel(),
                    oResourceBundle = oI18nModel.getResourceBundle(),
                    oTextQuickLink = null,
                    sMessageQuickLinks = "";
                this._oBindingContextQuickLink = oEvent.getSource().getBindingContext("shared");
                if (!this._oDeleteQuickLink) {
                    this._oDeleteQuickLink = Fragment.load({
                        id: oView.getId(),
                        name: "com.sap.acs.ui.dashboard.view.fragments.DeleteQuickLink",
                        controller: this
                    }).then(function (oConfirmationDialog) {
                        oView.addDependent(oConfirmationDialog);
                        return oConfirmationDialog;
                    });
                }

                this._oDeleteQuickLink.then(function (oConfirmationDialog) {
                    oConfirmationDialog.open();
                    oTextQuickLink = this.getControl("idDeleteQuickLinkPanelText");
                    sMessageQuickLinks = oResourceBundle.getText("confirmationDeleteQuickLinkMessage") + ' \n "' + this._oBindingContextQuickLink.getProperty("quickLink_name") + '"' + "?";
                    oTextQuickLink.setText(sMessageQuickLinks);
                }.bind(this));
            },

            /**
             * It deletes created task from "My To Do List" card.
             */
            onPressDeleteQuickLink: function (oEvent) {
                var sQId = this._oBindingContextQuickLink.getProperty("QUICKLINK_ID");
                var oI18nModel = this.getI18nModel(),
                    oList = this.getControl("idQuickLinkList"),
                    oSharedModel = this.getComponentModel("shared"),
                    oVisibilityModel = this.getComponentModel("visibility");
                oResourceBundle = oI18nModel.getResourceBundle(),
                    oMessageModel = this.getComponentModel("message");
                this.aMessage = [];
                oMessageModel.setProperty("/item", this.aMessage);
                oMessageModel.updateBindings(true);
                var oSecurityModel = this.getComponentModel("security");
                oVisibilityModel.setProperty("/BusyAppView", true);
                $.ajax({
                    url: "/odata/v4/QuickLinksService/quickLink(" + sQId + ")",
                    type: Constants.Operation.DELETE,
                    async: true,
                    headers: {
                        'X-CSRF-Token': oSecurityModel.getProperty("/csrf_token")
                    },
                    contentType: "application/json",
                    success: function (oData, oResponse) {
                        this.onPressCancelQuickLink();
                        oMessageModel = this.getComponentModel("message");
                        oVisibilityModel.setProperty("/BusyAppView", false);
                        oVisibilityModel.setProperty("/FooterVisibility", false);
                        MessageBox.success(oResourceBundle.getText("quicklinkdeletedsuccess"), {
                            title: oResourceBundle.getText("success"),
                            actions: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                this.setQuickLinks();
                            }.bind(this)
                        });
                    }.bind(this),
                    error: function (oError) {
                        this.setError(oResourceBundle.getText("quicklinkdeletionfailed"));
                        oVisibilityModel.setProperty("/BusyAppView", false);
                    }.bind(this)
                });

            },

            /**
             * It removes validation errors from input fields.
             * @param {sap.ui.base.Event} oEvent 
             */
            onLiveChangeCreateEditTask: function (oEvent) {
                var src = oEvent.getSource();
                src.setValueState(Constants.SpotsType.None);
                src.setValueStateText("");
            },

            /**
             * It removes validation errors from input fields.
             * @param {sap.ui.base.Event} oEvent 
             */
            onLiveChangeCreateQuickLinks: function (oEvent) {
                var src = oEvent.getSource();
                src.setValueState(Constants.SpotsType.None);
                src.setValueStateText("");
            },

            /**
             * It closes confirmation dialog.
             */
            onPressCancel: function () {
                this._oDeleteMyToDoTask.then(function (oConfirmationDialog) {
                    oConfirmationDialog.close();
                });
            },

            /**
             * It closes confirmation dialog.
             */
            onPressCancelQuickLink: function () {
                this._oDeleteQuickLink.then(function (oConfirmationDialog) {
                    oConfirmationDialog.close();
                });
            },

            /**
             * It sends request to display entered data in edit task fragment.
             * @param {sap.ui.base.Event} oEvent
             */
            onPressChangeMyToDoList: function (oEvent) {
                var oVisibilityModel = this.getComponentModel("visibility"),
                    oSharedModel = this.getComponentModel("shared"),
                    oI18nModel = this.getI18nModel(),
                    oResourceBundle = oI18nModel.getResourceBundle();
                oVisibilityModel.setProperty("/SaveButton", true);
                oVisibilityModel.setProperty("/AddButton", false);
                oVisibilityModel.setProperty("/MarkASComplete", true);
                oSharedModel.setProperty("/createEditTask/createUpdateToDoFormTitle", oResourceBundle.getText("editTasks"));
                oSharedModel.setProperty("/oSelectedTask", oEvent.getSource().getBindingContext("shared").getObject());
                this.getMyToDoCreateUpdateFragment();
            },

            /**
             * It returns priority.
             * @param {sap.ui.Object} oProperty 
             * @returns {string} priority
             */
            getPriority: function (oProperty) {
                var priority = "";
                if (oProperty.lowPriority) {
                    priority = Constants.Priority.One.toString();
                } else if (oProperty.mediumPriority) {
                    priority = Constants.Priority.Two.toString();
                } else if (oProperty.highPriority) {
                    priority = Constants.Priority.Three.toString();
                }
                return priority;
            },

            /** 
             * It returns status.
             * @param {sap.ui.Object} oProperty 
             * @returns {string} status
             */
            getStatus: function (oProperty) {
                var status = "";
                if (oProperty.checked) {
                    status = Constants.Priority.Three.toString();
                } else {
                    status = oProperty.status;
                }
                return status;
            },

            /**
             * It returns payload for Post and Update method.
             * @param {sap.ui.Object} oProperty
             * @param {string} priority 
             * @param {string} status  
             * @returns {sap.ui.Object} oPayload - Payload for POST and UPDATE
             */
            getPayloadPUTPOST: function (oProperty, priority, status) {
                return oPayload = {
                    task_name: oProperty.taskName,
                    task_description: oProperty.taskDesc,
                    status: status,
                    due_by: formatter.getFormattedDate(oProperty.dueDate),
                    priority: priority
                };
            },

            /**
             * It returns payload for Post and Update method.
             * @param {sap.ui.Object} oProperty
             * @returns {sap.ui.Object} oPayload - Payload for POST and UPDATE
             */
            getPayloadPUTPOSTLinks: function (oPropertyQuickLink) {
                return oPayloadQuickLinks = {
                    quickLink_name: oPropertyQuickLink.quickLinkName,
                    quickLink_URL: oPropertyQuickLink.quickLinkUrl

                };
            },

            /**
             * It sends request to create new task for "My To Do List" card.
             */
            onPressCreateEditTaskAdd: function () {
                var sType = Constants.Operation.POST,
                    sURL = "/odata/v4/TodoService/task";
                this.createUpdateToDoTask(sType, sURL);
            },

            /**
             * It sends request to update selected task for "My To do List" card.
             */
            onPressUpdateEditTaskAdd: function () {
                var oSharedModel = this.getComponentModel("shared"),
                    sType = Constants.Operation.PUT,
                    sURL = "/odata/v4/TodoService/task(" + oSharedModel.getProperty("/oSelectedTask/TASK_ID") + ")";
                this.createUpdateToDoTask(sType, sURL);
            },

            /**
             * It sends request to create new links for "Quick Links" card.
             */
            onPressCreateQuickLinksModifyAdd: function () {
                var sType = Constants.Operation.POST,
                    sURL = "/odata/v4/QuickLinksService/quickLink";
                this.createUpdateLinks(sType, sURL);
            },

            /**
             * It sends request to update selected links for "Quick Links" card.
             */
            onPressEditQuickLinkModify: function () {
                var oSharedModel = this.getComponentModel("shared"),
                    sType = Constants.Operation.PUT,
                    sURL = "/odata/v4/QuickLinksService/quickLink(" + oSharedModel.getProperty("/oSelectedQuickLink/QUICKLINK_ID") + ")";
                this.createUpdateLinks(sType, sURL);
            },

            /**
            * It is used to display quick links.
            * @param {sap.ui.base.Event} oEvent 
            */
            setQuickLinks: function () {
                var oSharedModel = this.getComponentModel("shared"),
                    oI18nModel = this.getI18nModel(),
                    oResourceBundle = oI18nModel.getResourceBundle(),
                    oVisibilityModel = this.getComponentModel("visibility");
                oVisibilityModel.setProperty("/BusyAppView", true);
                $.ajax({
                    url: "/odata/v4/QuickLinksService/quickLink",
                    type: "GET",
                    async: true,
                    contentType: "application/json",
                    success: function (oData, oResponse) {
                        var aResultQuickLinks = oData.value;
                        oSharedModel.setProperty("/quickLink", aResultQuickLinks);
                        oSharedModel.updateBindings(true);
                        oVisibilityModel.setProperty("/BusyAppView", false);
                        this.setFooterVisibleError(this.aMessage);
                    }.bind(this),
                    error: function (oError) {
                        oVisibilityModel.setProperty("/BusyAppView", false);
                        this.setError(oResourceBundle.getText("noquicklinks"));
                    }.bind(this)
                })
            },

            /**
             * It is used to open target URL in new tab.
             * @param {sap.ui.base.Event} oEvent 
             */
            onPressLink: function (oEvent) {
                var oLink = oEvent.getSource().getBindingContext("shared").getProperty("quickLink_URL");
                sap.m.URLHelper.redirect(oLink, true);
            },

            /**
             * It is used to edit existing links.
             * @param {sap.ui.base.Event} oEvent 
             */
            onPressEditQuickLink: function (oEvent) {
                var oVisibilityModel = this.getComponentModel("visibility"),
                    oContext = oEvent.getSource().getBindingContext("shared"),
                    oSharedModel = this.getComponentModel("shared"),
                    oI18nModel = this.getI18nModel(),
                    oLinkQuickList = this.getControl("idQuickLinkList"),
                    oResourceBundle = oI18nModel.getResourceBundle();
                oVisibilityModel.setProperty("/SaveQuickLinkButton", true);
                oVisibilityModel.setProperty("/AddQuickLinkButton", false);
                oSharedModel.setProperty("/createQuickLinks/createUpdateQuickLinkTitle", oResourceBundle.getText("editQuickLinks"));
                this._oSelectedQuickLinkItem = oEvent.getSource();
                oSharedModel.setProperty("/oSelectedQuickLink", this._oSelectedQuickLinkItem.getBindingContext("shared").getObject());
                if (oSharedModel.getProperty("/oSelectedQuickLink/quickLink_name")) {
                    this.onPressCreateUpdateQuickLinks();
                }
            },

            /**
             * It binds data to Worklist card.
             */
            setWorkList: function () {
                var aOpenServiceOrder = [
                    {
                        ServiceOrderID: "1001",
                        Description: "Description1",
                        Status: "Open",
                        Priority: 02,
                        PriorityText: "High",
                        DueBy: new Date()
                    }, {
                        ServiceOrderID: "1010",
                        Description: "Description2",
                        Status: "In progress",
                        Priority: 01,
                        PriorityText: "Low",
                        DueBy: new Date(2021, 04, 19)
                    }, {
                        ServiceOrderID: "1011",
                        Description: "Description3",
                        Status: "In progress",
                        Priority: 01,
                        PriorityText: "Low",
                        DueBy: new Date(2020, 01, 12)
                    }, {
                        ServiceOrderID: "1100",
                        Description: "Description4",
                        Status: "Open",
                        Priority: 02,
                        PriorityText: "High",
                        DueBy: new Date(2021, 06, 23)
                    }, {
                        ServiceOrderID: "1101",
                        Description: "Description5",
                        Status: "In progress",
                        Priority: 02,
                        PriorityText: "High",
                        DueBy: new Date()
                    }
                ];
                var aOpenTask = [
                    {
                        TaskID: "1110",
                        Description: "Description1",
                        Status: "In progress",
                        Priority: 01,
                        PriorityText: "Low",
                        DueBy: new Date(2021, 00, 21)
                    }, {
                        TaskID: "1111",
                        Description: "Description2",
                        Status: "In progress",
                        Priority: 01,
                        PriorityText: "Low",
                        DueBy: new Date(2021, 01, 22)
                    }, {
                        TaskID: "1000",
                        Description: "Description3",
                        Status: "Open",
                        Priority: 02,
                        PriorityText: "High",
                        DueBy: new Date(2021, 03, 21)
                    }, {
                        TaskID: "1001",
                        Description: "Description4",
                        Status: "In progress",
                        Priority: 01,
                        PriorityText: "Low",
                        DueBy: new Date(2021, 04, 19)
                    }, {
                        TaskID: "1011",
                        Description: "Description5",
                        Status: "Open",
                        Priority: 02,
                        PriorityText: "High",
                        DueBy: new Date(2021, 05, 21)
                    }
                ];
                var oSharedModel = this.getComponentModel("shared");
                oSharedModel.setProperty("/openServiceOrder", aOpenServiceOrder);
                oSharedModel.setProperty("/openTask", aOpenTask);
            },

            /**
             * It is used to handle segmented button event.
             * @param {sap.ui.base.Event} oEvent - Event object
             */
            onSelectionChangeSegmentedButton: function (oEvent) {
                var oSource = oEvent.getSource(),
                    sKey = oSource.getSelectedKey(),
                    oVisibilityModel = this.getComponentModel("visibility");
                if (sKey === Constants.SegmentedItem.OpenServiceOrder) {
                    oVisibilityModel.setProperty("/OpenServiceOrderTableVisibility", true);
                    oVisibilityModel.setProperty("/OpenTaskTableVisibility", false);
                }
                else if (sKey === Constants.SegmentedItem.OpenTask) {
                    oVisibilityModel.setProperty("/OpenServiceOrderTableVisibility", false);
                    oVisibilityModel.setProperty("/OpenTaskTableVisibility", true);
                }
                oVisibilityModel.updateBindings();
            },

            /**
             * 
             * @param {Event} oEvent 
             */
            handlePopoverPress: function (oEvent) {
                var oSource = oEvent.getSource(),
                    oView = this.getView();
                this.listPath = oSource.getBindingContext("shared").getPath();
                var listFrag = this.getComponentModel("shared").getProperty(this.listPath);
                var listPopData = new JSONModel({
                    data: listFrag
                });
                if (!this.oPopoverDialog) {
                    this.oPopoverDialog = Fragment.load({
                        id: oView.getId(),
                        name: "com.sap.acs.ui.dashboard.view.fragments.Popover",
                        controller: this
                    }).then(function (MessagePopover) {
                        oView.addDependent(MessagePopover);
                        return MessagePopover;
                    });
                }
                this.oPopoverDialog.then(function (MessagePopover) {
                    MessagePopover.setModel(listPopData, "popOverData");
                    MessagePopover.openBy(oSource);
                })
            },

            /**
             * It is used to open "Message Popover" to display messages.
             * @param {sap.ui.base.Event} oEvent 
             */
            onPressMessagePopoverButton: function (oEvent) {
                var oSource = oEvent.getSource(),
                    oView = this.getView();
                if (!this.oMessagePopoverDialog) {
                    this.oMessagePopoverDialog = Fragment.load({
                        id: oView.getId(),
                        name: "com.sap.acs.ui.dashboard.view.fragments.MessagePopover",
                        controller: this
                    }).then(function (MessagePopover) {
                        oView.addDependent(MessagePopover);
                        return MessagePopover;
                    });
                }
                this.oMessagePopoverDialog.then(function (MessagePopover) {
                    MessagePopover.openBy(oSource);

                })
            },

            /**
            * Convenience method for creating error messages on error scenario
            * @param {String} messageError - String containing error message
            */
            setError: function (messageError) {
                var oVisibilityModel = this.getComponentModel("visibility");
                var oButton = this.getControl("idMessagePopoverButton");
                oVisibilityModel.setProperty("/FooterVisibility", true);
                this.setDataMessagePopover(messageError);
                oButton.firePress();
            },

            /**
            * Convenience method for creating error messages on error scenario
            * @param {Array} amessageError - Array containing error message
            */
            setFooterVisibleError: function (amessageError) {
                var oVisibilityModel = this.getComponentModel("visibility");
                if (!amessageError.length) {
                    oVisibilityModel.setProperty("/FooterVisibility", false);
                }
            },

            /**
             * It is used to bind model data to Message Popover.
             */
            setDataMessagePopover: function (message) {
                var oMessagePopover = this.getControl("idMessagePopover");
                var oMessageModel = this.getComponentModel("message");
                this.aMessage.push(
                    {
                        title: message,
                        description: message,
                        type: Constants.SpotsType.Error
                    }
                );
                oMessageModel.setProperty("/item", this.aMessage);
                oMessageModel.setProperty("/messageSize", this.aMessage.length);
                oMessageModel.updateBindings(true);
            },

            /**
             * It is used to destroy defined "Message Popover".
             */
            onBeforeCloseMessagePopover: function () {
                this.oMessagePopoverDialog.then(function (MessagePopover) {
                    MessagePopover.destroy();
                });
                this.oMessagePopoverDialog = undefined;
            }
        });
    });

