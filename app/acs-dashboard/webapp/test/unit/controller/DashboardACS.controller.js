/*global QUnit*/

sap.ui.define([
    "com/sap/acs/ui/dashboard/controller/DashboardACS.controller"
], function (Controller) {
    "use strict";


    var oAppController = new Controller();

    QUnit.module("DashboardACS Controller");


    QUnit.test("I should test the event click for getting spots on maps", function (assert) {

        var oAdmin = [{
            "ID": 1,
            "color": "Red",
            "minimumValue": "4",
            "maximumValue": "Max",
            "customConfiguration": "1"
        },
        {
            "ID": 2,
            "color": "Amber",
            "minimumValue": "2",
            "maximumValue": "3",
            "customConfiguration": "1"
        },
        {
            "ID": 3,
            "color": "Green",
            "minimumValue": "0",
            "maximumValue": "1",
            "customConfiguration": "0"
        }];

        var oData = [

            {
                "BUSINESSPARTNER": "101",
                "businesspartnertype": "xx",
                "fullname": "Toni Johns",
                "geocode": "-117.97094;34.14623;0",
                "region": "Bilzen",
                "city": "Braunbury",
                "postalCode": "6230",
                "country": "USA",
                "industry": "Nicolas Cronin and D'Amore",
                "emailaddress": "ilene.hessel@yahoo.com",
                "phonenumber": "460-864-9098",
                "service_orders": [
                    {
                        "SERVICEORDER": "400000",
                        "serviceordertype": "RPO1",
                        "salesorganization": "TCS",
                        "soldtoparty": "101"
                    },
                    {
                        "SERVICEORDER": "400001",
                        "serviceordertype": "RPO2",
                        "salesorganization": "TCS",
                        "soldtoparty": "101"
                    }
                ],

            }
        ];

        var oResult = [

            {
                "BUSINESSPARTNER": "101",
                "businesspartnertype": "xx",
                "fullname": "Toni Johns",
                "geocode": "-117.97094;34.14623;0",
                "region": "Bilzen",
                "city": "Braunbury",
                "colorSpots": "Amber",
                "postalCode": "6230",
                "country": "USA",
                "industry": "Nicolas Cronin and D'Amore",
                "emailaddress": "ilene.hessel@yahoo.com",
                "phonenumber": "460-864-9098",
                "service_orders": [
                    {
                        "SERVICEORDER": "400000",
                        "serviceordertype": "RPO1",
                        "salesorganization": "TCS",
                        "soldtoparty": "101"
                    },
                    {
                        "SERVICEORDER": "400001",
                        "serviceordertype": "RPO2",
                        "salesorganization": "TCS",
                        "soldtoparty": "101"
                    }
                ]

            }
        ];
        assert.deepEqual(oAppController.setMapSpotsColor(oData, oAdmin), oResult);
    });

    QUnit.test("It should test the map spots on zoom", function (assert) {

        var oData = [
            {
                "BUSINESSPARTNER": "101",
                "businesspartnertype": "xx",
                "fullname": "Toni Johns",
                "geocode": "-117.97094;34.14623;0",
                "region": "Bilzen",
                "city": "Braunbury",
                "colorSpots": "Amber",
                "postalCode": "6230",
                "country": "USA",
                "industry": "Nicolas Cronin and D'Amore",
                "emailaddress": "ilene.hessel@yahoo.com",
                "phonenumber": "460-864-9098",
                "service_orders": [
                    {
                        "SERVICEORDER": "400000",
                        "serviceordertype": "RPO1",
                        "salesorganization": "TCS",
                        "soldtoparty": "101"
                    },
                    {
                        "SERVICEORDER": "400001",
                        "serviceordertype": "RPO2",
                        "salesorganization": "TCS",
                        "soldtoparty": "101"
                    }
                ]

            }
        ],
            oResult =
            {
                "alons": ["-117.97094"],
                "alats": ["34.14623"]

            };

        assert.deepEqual(oAppController.fnsetZoomGeocode(oData), oResult);
    });




    // "My To Do List" qunit test cases begin.
    QUnit.test("It should test the formatted data for My To Do List display", function (assert) {

        var oData = [
            {
                "TASK_ID": "bbc3f827-b0a1-4ab5-b932-09852db7b1bb",
                "task_name": "Purchase Task Creation",
                "task_description": "Purchase Task Creation Description",
                "priority": "3",
                "status": "1",
                "due_by": "2021-09-06T00:00:00Z",
                "createdAt": "2021-09-06T06:14:29.898806Z",
                "createdBy": "anonymous",
                "modifiedAt": "2021-09-06T06:18:33.427109Z"
            }
        ],
            oResult = [
                {
                    "TASK_ID": "bbc3f827-b0a1-4ab5-b932-09852db7b1bb",
                    "task_name": "Purchase Task Creation",
                    "task_description": "Purchase Task Creation Description",
                    "priority": "3",
                    "status": "1",
                    "createdAt": "2021-09-06T06:14:29.898806Z",
                    "createdBy": "anonymous",
                    "modifiedAt": "2021-09-06T06:18:33.427109Z"
                }

            ];

        oResult[0].due_by = new Date("2021-09-06T00:00:00.000Z");
        assert.deepEqual(oAppController.getDisplayToList(oData), oResult);
    });

    QUnit.test("It should test the priority based on type(HIGH,MEDIUM,LOW)", function (assert) {

        var oDataLow = {
            "taskName": "Create purchase contract",
            "valueStateTaskName": "None",
            "valueStateTextTaskName": "",
            "taskDesc": "Create purchase Contract Description-Test",
            "valueStateTaskNameDesc": "None",
            "valueStateTextTaskNameDesc": "",
            "highPriority": false,
            "mediumPriority": false,
            "lowPriority": true,
            "status": "1",
            "dueDate": "2021-09-06T00:00:00.000Z",
            "valueStateDueDate": "None",
            "valueStateTextDueDate": "",
            "createUpdateToDoFormTitle": "Edit Tasks",
            "checked": false
        },
            oDataMedium = {
                "taskName": "Create purchase contract",
                "valueStateTaskName": "None",
                "valueStateTextTaskName": "",
                "taskDesc": "Create purchase Contract Description-Test",
                "valueStateTaskNameDesc": "None",
                "valueStateTextTaskNameDesc": "",
                "highPriority": false,
                "mediumPriority": true,
                "lowPriority": false,
                "status": "1",
                "dueDate": "2021-09-06T00:00:00.000Z",
                "valueStateDueDate": "None",
                "valueStateTextDueDate": "",
                "createUpdateToDoFormTitle": "Edit Tasks",
                "checked": false
            },
            oDataHigh = {
                "taskName": "Create purchase contract",
                "valueStateTaskName": "None",
                "valueStateTextTaskName": "",
                "taskDesc": "Create purchase Contract Description-Test",
                "valueStateTaskNameDesc": "None",
                "valueStateTextTaskNameDesc": "",
                "highPriority": true,
                "mediumPriority": false,
                "lowPriority": false,
                "status": "1",
                "dueDate": "2021-09-06T00:00:00.000Z",
                "valueStateDueDate": "None",
                "valueStateTextDueDate": "",
                "createUpdateToDoFormTitle": "Edit Tasks",
                "checked": false
            };

        assert.deepEqual(oAppController.getPriority(oDataLow), "1");
        assert.deepEqual(oAppController.getPriority(oDataMedium), "2");
        assert.deepEqual(oAppController.getPriority(oDataHigh), "3");

    });

    QUnit.test("It should test the status based on type (OPEN, CLOSE)", function (assert) {

        var oDataLow = {
            "taskName": "Create purchase contract",
            "valueStateTaskName": "None",
            "valueStateTextTaskName": "",
            "taskDesc": "Create purchase Contract Description-Test",
            "valueStateTaskNameDesc": "None",
            "valueStateTextTaskNameDesc": "",
            "highPriority": false,
            "mediumPriority": false,
            "lowPriority": true,
            "status": "1",
            "dueDate": "2021-09-06T00:00:00.000Z",
            "valueStateDueDate": "None",
            "valueStateTextDueDate": "",
            "createUpdateToDoFormTitle": "Edit Tasks",
            "checked": false
        },
            oDataHigh = {
                "taskName": "Create purchase contract",
                "valueStateTaskName": "None",
                "valueStateTextTaskName": "",
                "taskDesc": "Create purchase Contract Description-Test",
                "valueStateTaskNameDesc": "None",
                "valueStateTextTaskNameDesc": "",
                "highPriority": false,
                "mediumPriority": false,
                "lowPriority": true,
                "status": "3",
                "dueDate": "2021-09-06T00:00:00.000Z",
                "valueStateDueDate": "None",
                "valueStateTextDueDate": "",
                "createUpdateToDoFormTitle": "Edit Tasks",
                "checked": true
            };

        assert.deepEqual(oAppController.getStatus(oDataLow), "1");
        assert.deepEqual(oAppController.getStatus(oDataHigh), "3");
    });

    QUnit.test("It should test the payload for POST and UPDATE methods", function (assert) {

        var oData = {
            "taskName": "Create purchase contract",
            "valueStateTaskName": "None",
            "valueStateTextTaskName": "",
            "taskDesc": "Create purchase Contract Description-Test",
            "valueStateTaskNameDesc": "None",
            "valueStateTextTaskNameDesc": "",
            "highPriority": false,
            "mediumPriority": false,
            "lowPriority": true,
            "status": "1",
            "valueStateDueDate": "None",
            "valueStateTextDueDate": "",
            "createUpdateToDoFormTitle": "Edit Tasks",
            "checked": false
        },
            priorityLow = "1",
            priorityMedium = "2",
            priorityHigh = "3",
            statusOpen = "1",
            statusClose = "3",
            oResultLow = {
                "task_name": "Create purchase contract",
                "task_description": "Create purchase Contract Description-Test",
                "status": "1",
                "due_by": "2021-09-07T00:00:00.00",
                "priority": "1"
            },
            oResultMedium = {
                "task_name": "Create purchase contract",
                "task_description": "Create purchase Contract Description-Test",
                "status": "1",
                "due_by": "2021-09-07T00:00:00.00",
                "priority": "2"
            },
            oResultHigh = {
                "task_name": "Create purchase contract",
                "task_description": "Create purchase Contract Description-Test",
                "status": "3",
                "due_by": "2021-09-07T00:00:00.00",
                "priority": "3"
            };

        oData.dueDate = new Date("2021-09-07T00:00:00.000Z");

        assert.deepEqual(oAppController.getPayloadPUTPOST(oData, priorityLow, statusOpen), oResultLow);
        assert.deepEqual(oAppController.getPayloadPUTPOST(oData, priorityMedium, statusOpen), oResultMedium);
        assert.deepEqual(oAppController.getPayloadPUTPOST(oData, priorityHigh, statusClose), oResultHigh);

    });
    // "My To Do List" qunit test cases end. 

    //Quick links qunit test case

    QUnit.test("It should test the payload for POST and UPDATE methods for quick links", function (assert) {

        var oDataLinks = {
            "quickLinkName": "Create Service Order",
            "quickLinkUrl": "https://workspaces-ws-tbtdx-app1.cry10.int.applicationstudio.cloud.sap/#acs-dashboard",
            "valueStateNameQuickLinks": "None",
            "valueStateTextNameQuickLinks": "",
            "valueStateUrlQuickLinks": "None",
            "valueStateTextUrlQuickLinks": "",
            "createUpdateQuickLinkTitle": "Add Quick Link"
        },

        oResultLinks = {
                "quickLink_name": "Create Service Order",
                "quickLink_URL": "https://workspaces-ws-tbtdx-app1.cry10.int.applicationstudio.cloud.sap/#acs-dashboard"
            };

        assert.deepEqual(oAppController.getPayloadPUTPOSTLinks(oDataLinks), oResultLinks);
        
    });

});
