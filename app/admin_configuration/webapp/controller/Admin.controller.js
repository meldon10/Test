 
    sap.ui.define(["adminconfiguration/adminconfiguration/controller/BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageToast", "adminconfiguration/adminconfiguration/util/Constants", "sap/ui/model/resource/ResourceModel", "adminconfiguration/adminconfiguration/util/Utils"],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel, MessageToast, Constants, ResourceModel, Utils) {
        "use strict";
        return BaseController.extend("adminconfiguration.adminconfiguration.controller.Admin", {

            /**
            * Calling the backend service to bind the data
            */
            onInit: function () {
                $.ajax({
                    async: false,
                    type: "GET",
                    url: "/odata/v4/sap/opu/odata/sap/IssueConfiguration",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        this.setValue(data.value);
                    }.bind(this)
                });

                // calling the csrf token util to update the csrf token
                var csrfToken = Utils.fetchCsrfToken("/odata/v4/sap/opu/odata/sap/IssueConfiguration", BaseController);
                var oSecurityModel = this.getComponentModel("security");
                csrfToken.then(token => {
                    oSecurityModel.setProperty('/csrf_token', token)
                })
            },

            /**
             * Updates the user entered values at the backend
             */
            onPressUpdate: function () {
                var oModel = this.getModel("businessConfigurationData").getData().colorConfiguration;
                var oI18nModel = this.getI18nModel();
                var oBundle = oI18nModel.getResourceBundle();
                var oSecurityModel = this.getComponentModel("security");
                var sMsgSuccess = oBundle.getText("updatedSuccessfully");
                var sMsgError = oBundle.getText("updationFailed");
                for (var i in oModel) {
                    var oModelConfig = this.deleteMinMaxEnabled(oModel[i], i);

                    OData.request({
                        requestUri: "/odata/v4/sap/opu/odata/sap/IssueConfiguration(" + oModelConfig.ID + ")",
                        method: "PUT",
                        headers: {
                            'X-CSRF-Token': oSecurityModel.getProperty("/csrf_token")
                        },
                        data: oModelConfig,
                    }, function (error) {
                        console.log(error);
                    }, function (data) {
                        if (data.response.statusCode == 200){
                            MessageToast.show(sMsgSuccess);
                        }
                        else {
                            console.log(data.message)
                            MessageToast.show(data.message)
                        }
                    });
                }
                this.setValue(oModel);
            },

            /**
             * bind the data
             * @param {oModel} data 
             */
            deleteMinMaxEnabled: function (oModel) {
                delete oModel.minimumValueEnabled;
                delete oModel.maximumValueEnabled;
                delete oModel.valueState;
                delete oModel.valueStateText;
                var oI18nModel = this.getI18nModel();
                var oBundle = oI18nModel.getResourceBundle();
                var sMaxValue = oBundle.getText("maxValue");
                var sMinValue = oBundle.getText("minValue");
                if (oModel.maximumValue == sMaxValue) {
                    oModel.maximumValue = Constants.Values.Max;
                }
                else if (oModel.minimumValue == sMinValue) {
                    oModel.minimumValue = "0";
                }
                return oModel;
            },

            /**
             * bind the data
             * @param {matedata} data 
             */
            setValue: function (data) {
                var rData = this.getMinimumMaximumEnabling(data);
                var oData = {};
                oData.colorConfiguration = rData;
                oData.btnEnable = true;
                var oModel = new JSONModel(oData); //set the json
                if (this.getView() != undefined) {
                    this.setModel(oModel, "businessConfigurationData");
                }
            },

            /**
            * bind the data
            * @param {data} metadata 
            */
            getMinimumMaximumEnabling: function (aEnablingData) {
                for (var i = 0; i < aEnablingData.length; i++) {
                    var oI18nModel = this.getI18nModel();
                    var oBundle = oI18nModel.getResourceBundle();
                    var sMaxValue = oBundle.getText("maxValue");
                    var sMinValue = oBundle.getText("minValue");
                    if (aEnablingData[i].color.toLowerCase() == Constants.SpotsColor.Red.toLowerCase()) {
                        aEnablingData[i].maximumValue = sMaxValue;
                        aEnablingData[i].minimumValueEnabled = true;
                        aEnablingData[i].maximumValueEnabled = false;
                        aEnablingData[i].valueState = Constants.Values.None;
                        aEnablingData[i].valueStateText = "";
                    } else if (aEnablingData[i].color.toLowerCase() == Constants.SpotsColor.Amber.toLowerCase()) {
                        aEnablingData[i].minimumValueEnabled = true;
                        aEnablingData[i].maximumValueEnabled = false;
                        aEnablingData[i].valueState = Constants.Values.None;
                        aEnablingData[i].valueStateText = "";
                    } else if (aEnablingData[i].color.toLowerCase() == Constants.SpotsColor.Green.toLowerCase()) {
                        aEnablingData[i].minimumValue = sMinValue;
                        aEnablingData[i].minimumValueEnabled = false;
                        aEnablingData[i].maximumValueEnabled = false;
                    }
                }
                return aEnablingData;
            },

            /**
               * To autofill the values
               * @param {sap.ui.base.Event} oEvent 
               */
            onMinValueChange: function (oEvent) {
                var oI18nModel = this.getI18nModel();
                var oBundle = oI18nModel.getResourceBundle();
                var sMsg = oBundle.getText("greaterThanMsg");
                var sMsgCannotBeZero = oBundle.getText("cannotBeZero");
                var sMsgLesserOrEqual = oBundle.getText("lesserOrEqual");
                var sMsgValidNumber = oBundle.getText("validNumber");
                var sMsgCorrectionOfRed = oBundle.getText("correctionOfRed");
                var sNewValue = oEvent.getParameter("newValue");
                var oModelBtn = this.getModel("businessConfigurationData");
                var oModel = this.getModel("businessConfigurationData").getData().colorConfiguration;
                var oPath = oEvent.getSource().getBindingContext("businessConfigurationData").getPath();
                var sTableDetails = this.byId("idAdminTable")
                var nPathNumber = sTableDetails.indexOfRow(oEvent.getSource().getParent());
                oModel[nPathNumber].minimumValue = sNewValue;
                var nCalculatedValue = this.calculateTheValue(sNewValue);
                oModel[nPathNumber].valueState = Constants.Values.None;
                oModelBtn.setProperty("/btnEnable", true);
                if (!Number(sNewValue)) {
                    oModel[nPathNumber].valueState = Constants.SpotsType.Error;
                    oModel[nPathNumber].valueStateText = sMsgValidNumber;
                    oModelBtn.setProperty("/btnEnable", false);
                }
                if (nPathNumber == 0) {
                    if (oModel[1].minimumValue != "" && parseInt(sNewValue) <= parseInt(oModel[1].minimumValue)) {
                        oModel[nPathNumber].valueState = Constants.SpotsType.Error;
                        oModel[nPathNumber].valueStateText = sMsg + " " + (parseInt(oModel[1].minimumValue));
                        oModelBtn.setProperty("/btnEnable", false);
                    }
                }
                if (nPathNumber == 1) {
                    var nCalculatedValueAmber = oModel[1].maximumValue;
                    if (parseInt(sNewValue) > parseInt(nCalculatedValueAmber) || parseInt(sNewValue) == 0) {
                        oModel[nPathNumber].valueState = Constants.SpotsType.Error;
                        oModelBtn.setProperty("/btnEnable", false);
                        if (parseInt(sNewValue) == 0) {
                            oModel[nPathNumber].valueStateText = sMsgCannotBeZero;
                        } else if (parseInt(nCalculatedValueAmber) < 0) {
                            oModel[nPathNumber].valueStateText = sMsgCorrectionOfRed;
                        } else {
                            oModel[nPathNumber].valueStateText = sMsgLesserOrEqual + " " + nCalculatedValueAmber;
                        }
                    }
                }
                if (parseInt(sNewValue) < 0) {
                    oModel[nPathNumber].valueState = Constants.SpotsType.Error;
                    oModel[nPathNumber].valueStateText = sMsgValidNumber;
                    oModelBtn.setProperty("/btnEnable", false);
                }
                if (parseInt(sNewValue) == 0) {
                    oModel[nPathNumber].valueState = Constants.SpotsType.Error;
                    oModel[nPathNumber].valueStateText = sMsgCannotBeZero;
                    oModelBtn.setProperty("/btnEnable", false);
                }
                oModel[nPathNumber + 1].maximumValue = nCalculatedValue;
                this.checkTheValidations(nPathNumber);
                this.getModel("businessConfigurationData").updateBindings();
            },

            /**
            * check the validation
            * @param {nPathNumber} InputField 
            */
            checkTheValidations: function (nPathNumber) {
                var oModel = this.getModel("businessConfigurationData").getData().colorConfiguration;
                if (nPathNumber == 1 && parseInt(oModel[0].minimumValue) != "0" && !(parseInt(oModel[0].minimumValue) < 0) && oModel[0].minimumValue > oModel[1].minimumValue) {
                    oModel[0].valueState = Constants.Values.None;
                } else if (parseInt(oModel[1].minimumValue) <= parseInt(oModel[1].maximumValue) && parseInt(oModel[1].minimumValue) != "0" && !(parseInt(oModel[1].minimumValue) < 0)) {
                    oModel[1].valueState = Constants.Values.None;
                }
            },

            /**
             * function for computing
             * @param {sNewValue} EnteredValue 
             */
            calculateTheValue: function (sNewValue) {
                var nCalculatedValue = (parseInt(sNewValue) - 1).toString();
                if (nCalculatedValue == Constants.Values.NaN) {
                    nCalculatedValue = "";
                }
                return nCalculatedValue;
            }
        });
    });


