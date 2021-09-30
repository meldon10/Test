sap.ui.define([
    "com/sap/acs/ui/dashboard/util/Constants",
    "sap/ui/core/format/DateFormat"
], function (Constants, DateFormat) {
        'use strict'  
        return {      

            /**
             * Formatter function returns color for the spots on maps
             * @param {string} sColor
             * @returns {color} sMapSpots
             */
            getColor: function (sColor) {
                if (sColor) {
                    var sMapSpots;
                    if (sColor.toLowerCase() === Constants.SpotsColor.Red.toLowerCase()) {
                        sMapSpots = Constants.SpotsType.Error;
                    }
                    else if (sColor.toLowerCase() === Constants.SpotsColor.Green.toLowerCase()) {
                        sMapSpots = Constants.SpotsType.Success;
                    }
                    else if (sColor.toLowerCase() === Constants.SpotsColor.Amber.toLowerCase()) {
                        sMapSpots = Constants.SpotsType.Warning;
                    }
                    else if (sColor.toLowerCase() === Constants.SpotsColor.Default.toLowerCase()) {
                        sMapSpots = Constants.SpotsType.Success;
                    }
                    return sMapSpots;
                }
            },

            /**
             * Formatter function returns color for the circles on maps
             * @param {string} sColor
             * @returns {color} sMapSpotsAnaytic
             */
            getColorAnalytic: function (sColor) {
                if (sColor) {
                    var sMapSpotsAnaytic;
                    if (sColor.toLowerCase() === Constants.SpotsColor.Red.toLowerCase()) {
                        sMapSpotsAnaytic = Constants.SpotsTypeAnaytic.Error;
                    }
                    else if (sColor.toLowerCase() === Constants.SpotsColor.Green.toLowerCase()) {
                        sMapSpotsAnaytic = Constants.SpotsTypeAnaytic.Success;
                    }
                    else if (sColor.toLowerCase() === Constants.SpotsColor.Amber.toLowerCase()) {
                        sMapSpotsAnaytic = Constants.SpotsTypeAnaytic.Warning;
                    }
                    else if (sColor.toLowerCase() === Constants.SpotsColor.Default.toLowerCase()) {
                        sMapSpotsAnaytic = Constants.SpotsTypeAnaytic.Success;
                    }
                    return sMapSpotsAnaytic;
                }
            },

            /**
            * Formatter function returns image for the priority on list
            * @param {string} sColor
            * @returns {image} sListImage
            */
            getImage: function (sColor) {
                if (sColor) {
                    var sListImage;
                    if (sColor.toLowerCase() === Constants.SpotsColor.Red.toLowerCase()) {
                        sListImage = Constants.Images.Error;
                    }
                    else if (sColor.toLowerCase() === Constants.SpotsColor.Green.toLowerCase()) {
                        sListImage = Constants.Images.Success;
                    }
                    else if (sColor.toLowerCase() === Constants.SpotsColor.Amber.toLowerCase()) {
                        sListImage = Constants.Images.Warning;
                    }
                    else if (sColor.toLowerCase() === Constants.SpotsColor.Default.toLowerCase()) {
                        sListImage = Constants.Images.Success;
                    }
                    return sListImage;
                }
            },

            /**
             * Formatter function returns highlighter for CustomListItem
             * @param {string} sPriority
             * @returns {sap.ui.core.MessageType} MessageType
             */
            getHighlighter: function (sPriority) {
                if(Number(sPriority) === Constants.Priority.One) {
                    return Constants.SpotsType.Success;
                }
                else if(Number(sPriority) === Constants.Priority.Two){
                    return Constants.SpotsType.Warning;
                }
                else if(Number(sPriority) === Constants.Priority.Three){
                    return Constants.SpotsType.Error;
                }
                else {
                   return Constants.SpotsType.None; 
                }                

            },

            /**
             * Formatter function returns complete due date text
             * @param {string} sDate 
             * @returns {string} date string
             */
            getDateText: function (sDate) {
                var oI18nModel = this.getI18nModel(),
                    oResourceBundle = oI18nModel.getResourceBundle();
                if (sDate) {
                    return oResourceBundle.getText("dueBy") + sDate;
                }
            },

            /* Formatter function returns image for the priority on list
            * @param {string} sSpot
            * @returns {spot} sMapSpot
            */
            getCustomerDetailSpot: function (sSpot) {
                var sMapSpot;
                if (sSpot == true) {
                    sMapSpot = Constants.SpotsType.Error;
                } else {
                    sMapSpot = Constants.SpotsType.Inactive;
                }
                return sMapSpot;
            },

            /**
             * Formatter function returns image for qui link info icon
             * @param {string} sImage
             * @returns {image} sImageQuickLink
             */
            getImageQuickLink: function (sImage) {
                if (sImage) {
                    var sImageQuickLink;
                    sImageQuickLink = Constants.ImagesQucikLink.Info;
                    return sImageQuickLink;
                }
            },

            /**
             * Formatter function returns formatted date for creating "My To Do Task List"
             * @param {sap.ui.base.Object} oDate - Selected date object
             * @returns {string} oDateInstance - Formatted date string
             */            
            getFormattedDate: function (oDate) {
                var oDateInstance = DateFormat.getDateTimeInstance({
                    pattern: "YYYY-MM-ddT00:00:00.00",
                    UTC: false
                });

                return oDateInstance.format(oDate);
            }
        }
    });