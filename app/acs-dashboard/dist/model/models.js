sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,i){"use strict";return{createDeviceModel:function(){var t=new e(i);t.setDefaultBindingMode("OneWay");return t},createVisibilityModel:function(){var i=new e({OpenServiceOrderTableVisibility:true,OpenTaskTableVisibility:false,FooterVisibility:false,mapVisibility:true,listVisibility:false,AddLinkPanelVisibility:false,AddLinkButtonVisibility:false,UpdateLinkButtonVisibility:false,BusyAppView:false,SaveButton:false,AddButton:false,MarkASComplete:false});i.setDefaultBindingMode("OneWay");return i},createMessageModel:function(){var i=new e;i.setDefaultBindingMode("OneWay");return i},createSharedModel:function(){var i=new e;return i},createSecurityModel:function(){var i=new e;return i},createUserModel:function(){var i=new e;i.setDefaultBindingMode("OneWay");return i}}});