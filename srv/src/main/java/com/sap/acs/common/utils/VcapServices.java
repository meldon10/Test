package com.sap.acs.common.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * @author I524733(Harshit Maheshwari) on 15/09/21
 * @project service-management
 */
@Component
public class VcapServices {
    @Value("${vcap.services.acs-credential-store.credentials.encryption.client_private_key}")
    private String credStorePrivateKey;

    @Value("${vcap.services.acs-credential-store.credentials.username}")
    private String credStoreUsername;

    @Value("${vcap.services.acs-credential-store.credentials.password}")
    private String credStorePassword;

    @Value("${vcap.services.acs-credential-store.credentials.url}")
    private String credStoreBaseUrl;

    @Value("${APPROUTER_MODULE_NAME}")
    private String appName;

    @Value("${vcap.services.acs-destination.credentials.xsappname}")
    private String xsAppNameDestination;

    @Value("${vcap.services.acs-connectivity.credentials.xsappname}")
    private String xsAppNameConnectivity;

    @Value("${vcap.services.acs-portal.credentials.uaa.xsappname}")
    private String portalAppName;

    @Value("${vcap.services.acs-html5-repo-runtime.credentials.uaa.xsappname}")
    private String htmlAppName;


    public String getXsAppNameDestination(){
        return xsAppNameDestination;
    }

     public String getXsAppNameConnectivity(){
        return xsAppNameConnectivity;
    }

    public String getCredStoreBaseUrl() {
        return credStoreBaseUrl;
    }

    public String getAppName() {
        return appName;
    }

    public String getCredStorePrivateKey() {
        return credStorePrivateKey;
    }

    public String getCredStoreUsername() {
        return credStoreUsername;
    }

    public String getCredStorePassword() {
        return credStorePassword;
    }
    
    public String getPortalAppName() {
        return portalAppName;
    }

    public String getHtmlAppName() {
        return htmlAppName;
    }
}
