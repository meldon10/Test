package com.sap.acs.constant;

/**
 * @author I524733(Harshit Maheshwari) on 15/09/21
 * @project service-management
 */
public class Endpoint {
    private Endpoint() {

    }

    public static final String FETCH_CREDENTIAL = "/password";
    public static final String CREDENTIAL_NAMESPACE_HANDLER = "sapcp-credstore-namespace";
    public static final String TENANT_HOST_SEPARATOR = "-";
    public static final String CREDENTIAL_STORE_NAMESPACE = "acs-service-management";
    public static final String CF_TECHNICAL_USER = "cf-technical-user";
    public static final String OAUTH_ENDPOINT = "/oauth/token?grant_type=password";
    public static final String ROUTE_ENDPOINT = "/v3/routes";
    public static final String INFO_ENDPOINT = "/info";
    public static final String APP_ENDPOINT = "/v3/apps";
    public static final String DOMAIN_ENDPOINT = "/v3/domains";
}
