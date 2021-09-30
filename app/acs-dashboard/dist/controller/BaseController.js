sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/UIComponent","com/sap/acs/ui/dashboard/util/Constants"],function(e,t,o){"use strict";return e.extend("com.sap.acs.ui.dashboard.controller.BaseController",{getComponentModel:function(e){return this.getOwnerComponent().getModel(e)},getModel:function(e){return this.getView().getModel(e)},getI18nModel:function(){return this.getOwnerComponent().getModel("i18n")},setModel:function(e,t){return this.getView().setModel(e,t)},getRouter:function(){return t.getRouterFor(this)},getControl:function(e){return this.byId(e)},getFragmentControl:function(e){return sap.ui.getCore().byId(e)},getLoggedUser:function(){var e=this.getComponentModel("user");sap.ushell.Container.getServiceAsync("UserInfo").then(function(t){e.setProperty("/userId",t.getId())})},fnsetZoomGeocode:function(e){var t={};var n=o.ZoomMaps.valueMapslats;var r=o.ZoomMaps.valueMapslons;t.alons=[];t.alats=[];for(var s=0;s<e.length;s++){if(e[s]){var u=e[s].geocode.split(";");t.alons.push(u[r]);t.alats.push(u[n])}}return t}})});