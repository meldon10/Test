sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","adminconfiguration/adminconfiguration/model/models"],function(i,e,t){"use strict";return i.extend("adminconfiguration.adminconfiguration.Component",{metadata:{manifest:"json"},init:function(){i.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device");this.setModel(t.createSecurityModel(),"security")}})});