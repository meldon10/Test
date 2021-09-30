sap.ui.define([],
    function () {
        'use strict';
        return Object.freeze({
            SpotsColor: {
                Green: "Green",
                Amber: "Amber",
                Red: "Red",
                Default: "Default"
            },
            ZoomMaps: {
                valueMinLenZoom: 15,
                valueMapslats: 1,
                valueMapslons: 0,
            },            
            ErrorMessage: {
                valueMessageLen: 0,
            },
            QuickLinks: {
                value: 0,
                baseUrl: "BaseURL",
                prevUrl: "http://",
                newUrl: "https://"
            },
            SpotsType: {
                Success: "Success",
                Error: "Error",
                Warning: "Warning",
                Default: "Default",
                None: "None",
                Inactive: "Inactive"
            },
            SpotsTypeAnaytic: {
                Success: "rgb(0, 255, 0)",
                Error: "rgb(255, 100, 120)",
                Warning: "rgb(255, 165, 0)",
                Default: "rgb(0, 255, 0)"
            },
            Images: {
                Success: jQuery.sap.getModulePath("com.sap.acs.ui.dashboard") + "/images/green.png",
                Error: jQuery.sap.getModulePath("com.sap.acs.ui.dashboard") + "/images/red.png",
                Warning: jQuery.sap.getModulePath("com.sap.acs.ui.dashboard") + "/images/amber.png",
                Default: jQuery.sap.getModulePath("com.sap.acs.ui.dashboard") + "/images/green.png",
                companyLogo: jQuery.sap.getModulePath("com.sap.acs.ui.dashboard") + "/images/companyLogo.png"
            },
            ImagesQucikLink: {
                Info: jQuery.sap.getModulePath("com.sap.acs.ui.dashboard") + "/images/info.png"
            },
            MaxValue: {
                Max: "Max",
                InitializationServiceOrder: 0,
                DefaultValue: ""
            },
            SegmentedItem: {
                Maps: "maps",
                List: "list",
                OpenServiceOrder: "openServiceOrder",
                OpenTask: "myopenTask"
            },
            Priority: {
                Zero: 0,
                One: 1,
                Two: 2,
                Three: 3,
                Four: 4,
                Five: 5,
                Six: 6
            },
            Operation: {
                GET: "GET",
                POST: "POST",
                PUT: "PUT",
                DELETE: "DELETE"
            },
            Status: {
                OPen: "OPEN"
            }


        });
    });
