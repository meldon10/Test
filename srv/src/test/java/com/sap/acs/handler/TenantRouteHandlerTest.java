package com.sap.acs.handler;

import com.sap.acs.common.utils.VcapApplication;
import com.sap.acs.common.utils.VcapServices;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import static org.junit.Assert.assertTrue;

/**
 * @author I524733(Harshit Maheshwari) on 15/09/21
 * @project service-management
 */
@RunWith(MockitoJUnitRunner.class)
public class TenantRouteHandlerTest {

    @InjectMocks
    TenantRouteHandler tenantRouteHandler;

    @Mock
    VcapServices vcapServices;

    @Mock
    VcapApplication vcapApplication;

    @Mock
    CredentialStoreHandler credentialStoreHandler;

    @Mock
    RestTemplate restTemplate;

    private final String tenantSubscribedSubdomain = "acs-customer-3";

    @Test
    public void testCreateTenantRoute_ValidSubdomain_ShouldPass() {

        // mocking createRoute() rest call
        Mockito.when(restTemplate.postForEntity(ArgumentMatchers.contains("/v3/routes"),
                        ArgumentMatchers.<HttpEntity<String>>any(),
                        ArgumentMatchers.eq(String.class)))
                .thenReturn(generateResponse(MockedAPIResponse.createRouteApiResponse, HttpStatus.CREATED));

        // mocking mapRoute() rest call
        Mockito.when(restTemplate.postForEntity(ArgumentMatchers.contains("destinations"),
                        ArgumentMatchers.<HttpEntity<String>>any(),
                        ArgumentMatchers.eq(String.class)))
                .thenReturn(generateResponse(MockedAPIResponse.mapRouteApiAuthApiResponse, HttpStatus.OK));


        boolean isCreated = tenantRouteHandler.createTenantRoute(tenantSubscribedSubdomain);
        assertTrue(isCreated);
    }

    @Test
    public void testCreateTenantRoute_ExistingHost_ShouldPass() {

        HttpClientErrorException exception = HttpClientErrorException.UnprocessableEntity.create(
                HttpStatus.UNPROCESSABLE_ENTITY, null, null, null, null);

        Mockito.when(restTemplate.postForEntity(ArgumentMatchers.contains("/v3/routes"),
                        ArgumentMatchers.<HttpEntity<String>>any(),
                        ArgumentMatchers.eq(String.class)))
                        .thenThrow(exception);

        Mockito.when(restTemplate.exchange(ArgumentMatchers.contains("hosts"),
                        ArgumentMatchers.eq(HttpMethod.GET),
                        ArgumentMatchers.<HttpEntity<String>>any(),
                        ArgumentMatchers.eq(String.class)))
                .thenReturn(generateResponse(MockedAPIResponse.getRouteIdByHostApiResponse, HttpStatus.OK));

        // mocking mapRoute() rest call
        Mockito.when(restTemplate.postForEntity(ArgumentMatchers.contains("destinations"),
                        ArgumentMatchers.<HttpEntity<String>>any(),
                        ArgumentMatchers.eq(String.class)))
                .thenReturn(generateResponse(MockedAPIResponse.mapRouteApiAuthApiResponse, HttpStatus.OK));

        boolean isCreated = tenantRouteHandler.createTenantRoute(tenantSubscribedSubdomain);
        assertTrue(isCreated);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testCreateTenantRoute_BlankSubdomain_ShouldThrowException() {
        tenantRouteHandler.createTenantRoute("");
    }

    @Test(expected = NullPointerException.class)
    public void testCreateTenantRoute_NullSubdomain_ShouldThrowException() {
        tenantRouteHandler.createTenantRoute(null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testCreateTenantRoute_InvalidSubdomain_ShouldThrowException() {
        tenantRouteHandler.createTenantRoute("domain-more-than-63-characters-in-cloud-foundry");
    }

    @Before
    public void setUp() {

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("value", "Test@123");
        jsonObject.put("username", "i524733");

        Mockito.when(credentialStoreHandler.readCredentials(
                ArgumentMatchers.anyString(),
                ArgumentMatchers.anyString()
        )).thenReturn(jsonObject);

        // Mocking vcap services and applications
        Mockito.when(vcapServices.getAppName()).thenReturn("acs-ar");
        Mockito.when(vcapApplication.getCfApiUrl()).thenReturn("https://api.cf.sap.hana.ondemand.com");
        Mockito.when(vcapApplication.getSpaceId()).thenReturn("5b01be08-edf4-442b-975c-5750d1e2d992");
        Mockito.when(vcapApplication.getSpaceName()).thenReturn("development");
        Mockito.when(vcapApplication.getCfOrgId()).thenReturn("bfeda962-39ed-4d8a-af50-3dc700719ae1");
        Mockito.when(vcapApplication.getCfOrgName()).thenReturn("acs-mt");
        Mockito.when(vcapApplication.getApplicationUri()).thenReturn(
                "acs-mt-development-acs-service-management.cfapps.sap.hana.ondemand.com");

        // mocking getAuthenticationUrl() rest call
        Mockito.when(restTemplate.getForEntity(ArgumentMatchers.anyString(),
                        ArgumentMatchers.<Class<String>>any()))
                .thenReturn(this.generateResponse(MockedAPIResponse.authApiResponse, HttpStatus.OK));

        // mocking getAccessToken() rest call
        Mockito.when(restTemplate.postForEntity(ArgumentMatchers.contains("grant_type"
                ), ArgumentMatchers.<MultiValueMap<String, String>>any(), ArgumentMatchers.eq(String.class)))
                .thenReturn(generateResponse(MockedAPIResponse.accessTokenApiResponse, HttpStatus.OK));

        // mocking getAppId() rest call
        Mockito.when(restTemplate.exchange(ArgumentMatchers.contains("/v3/apps"),
                ArgumentMatchers.eq(HttpMethod.GET),
                ArgumentMatchers.<HttpEntity<String>>any(),
                ArgumentMatchers.eq(String.class)))
                .thenReturn(generateResponse(MockedAPIResponse.getAppIdApiResponse, HttpStatus.OK));

        // mocking getDomainId() rest call()
        Mockito.when(restTemplate.exchange(ArgumentMatchers.contains("/v3/domains"),
                        ArgumentMatchers.eq(HttpMethod.GET),
                        ArgumentMatchers.<HttpEntity<String>>any(),
                        ArgumentMatchers.eq(String.class)))
                .thenReturn(generateResponse(MockedAPIResponse.getDomainIdApiResponse, HttpStatus.OK));
    }


    @Test(expected = IllegalArgumentException.class)
    public void testDeleteTenantRoute_NullSubdomain_ShouldThrowException() {
        tenantRouteHandler.deleteTenantRoute("");
    }

    @Test(expected = AssertionError.class)
    public void testDeleteTenantRoute_InvalidSubdomain_ShouldThrowException() {
        Mockito.when(restTemplate.exchange(ArgumentMatchers.contains("routes"),
                        ArgumentMatchers.eq(HttpMethod.GET),
                        ArgumentMatchers.<HttpEntity<String>>any(),
                        ArgumentMatchers.eq(String.class)))
                .thenReturn(generateResponse(MockedAPIResponse.routeDoesNotExistAuthApiResponse, HttpStatus.OK));

        tenantRouteHandler.deleteTenantRoute("this-subdomain-does-not-exist");
    }

    @Test
    public void testDeleteTenantRoute_ValidSubdomain_ShouldPass() {
        // mocking findRouteId() rest call
        Mockito.when(restTemplate.exchange(ArgumentMatchers.contains("routes"),
                        ArgumentMatchers.eq(HttpMethod.GET),
                        ArgumentMatchers.<HttpEntity<String>>any(),
                        ArgumentMatchers.eq(String.class)))
                .thenReturn(generateResponse(MockedAPIResponse.getRouteIdAuthApiResponse, HttpStatus.OK));

        // mocking deleteRoute() rest call
        Mockito.when(restTemplate.exchange(ArgumentMatchers.contains("/v3/routes/"),
                        ArgumentMatchers.eq(HttpMethod.DELETE),
                        ArgumentMatchers.<HttpEntity<String>>any(),
                        ArgumentMatchers.eq(String.class)))
                .thenReturn(generateResponse(MockedAPIResponse.deleteRouteApiResponse, HttpStatus.ACCEPTED));
        boolean isDeleted = tenantRouteHandler.deleteTenantRoute(tenantSubscribedSubdomain);
        assertTrue(isDeleted);
    }

    private ResponseEntity<String> generateResponse(String body, HttpStatus http) {
        return new ResponseEntity<>(body, http);
    }

}


interface MockedAPIResponse  {
    String authApiResponse = "{\"name\":\"\",\"build\":\"\",\"support\":\"\",\"version\":0,\"description\":\"SAP BTP Cloud Foundry environment\",\"authorization_endpoint\":\"https://login.cf.sap.hana.ondemand.com\",\"token_endpoint\":\"https://uaa.cf.sap.hana.ondemand.com\",\"allow_debug\":true}";
    String accessTokenApiResponse = "{\"access_token\": \"dummy_token\" }";
    String getAppIdApiResponse = "{\"pagination\":{\"next\":null,\"last\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/apps?names=acs-service-management-ui&organization_guids=bfeda962-39ed-4d8a-af50-3dc700719ae1&page=1&per_page=50&space_guids=5b01be08-edf4-442b-975c-5750d1e2d992\"},\"previous\":null,\"total_pages\":1,\"first\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/apps?names=acs-service-management-ui&organization_guids=bfeda962-39ed-4d8a-af50-3dc700719ae1&page=1&per_page=50&space_guids=5b01be08-edf4-442b-975c-5750d1e2d992\"},\"total_results\":1},\"resources\":[{\"lifecycle\":{\"data\":{\"buildpacks\":[],\"stack\":\"cflinuxfs3\"},\"type\":\"buildpack\"},\"relationships\":{\"space\":{\"data\":{\"guid\":\"5b01be08-edf4-442b-975c-5750d1e2d992\"}}},\"metadata\":{\"annotations\":{\"mta_id\":\"acs-service-management\",\"mta_module\":\"{\\\"name\\\":\\\"acs-service-management-ui\\\"}\",\"mta_version\":\"1.0.0\",\"mta_module_provided_dependencies\":\"[]\",\"mta_bound_services\":\"[\\\"acs-uaa\\\"]\"},\"labels\":{\"mta_id\":\"9ec2dfeec5a2f09fb1648286d0da8ed3\"}},\"updated_at\":\"2021-09-14T06:35:55Z\",\"name\":\"acs-ar\",\"guid\":\"e8c380d5-fddd-4738-9b45-999c94a97c37\",\"created_at\":\"2021-09-14T06:34:08Z\",\"links\":{\"processes\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/apps/e8c380d5-fddd-4738-9b45-999c94a97c37/processes\"},\"droplets\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/apps/e8c380d5-fddd-4738-9b45-999c94a97c37/droplets\"},\"start\":{\"method\":\"POST\",\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/apps/e8c380d5-fddd-4738-9b45-999c94a97c37/actions/start\"},\"current_droplet\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/apps/e8c380d5-fddd-4738-9b45-999c94a97c37/droplets/current\"},\"packages\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/apps/e8c380d5-fddd-4738-9b45-999c94a97c37/packages\"},\"space\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/spaces/5b01be08-edf4-442b-975c-5750d1e2d992\"},\"environment_variables\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/apps/e8c380d5-fddd-4738-9b45-999c94a97c37/environment_variables\"},\"features\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/apps/e8c380d5-fddd-4738-9b45-999c94a97c37/features\"},\"stop\":{\"method\":\"POST\",\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/apps/e8c380d5-fddd-4738-9b45-999c94a97c37/actions/stop\"},\"deployed_revisions\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/apps/e8c380d5-fddd-4738-9b45-999c94a97c37/revisions/deployed\"},\"self\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/apps/e8c380d5-fddd-4738-9b45-999c94a97c37\"},\"revisions\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/apps/e8c380d5-fddd-4738-9b45-999c94a97c37/revisions\"},\"tasks\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/apps/e8c380d5-fddd-4738-9b45-999c94a97c37/tasks\"}},\"state\":\"STARTED\"}]}";
    String getDomainIdApiResponse = "{\"pagination\":{\"next\":null,\"last\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/domains?names=cfapps.sap.hana.ondemand.com&page=1&per_page=50\"},\"previous\":null,\"total_pages\":1,\"first\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/domains?names=cfapps.sap.hana.ondemand.com&page=1&per_page=50\"},\"total_results\":1},\"resources\":[{\"relationships\":{\"organization\":{\"data\":null},\"shared_organizations\":{\"data\":[]}},\"internal\":false,\"metadata\":{\"annotations\":{},\"labels\":{}},\"updated_at\":\"2019-03-04T11:12:14Z\",\"name\":\"cfapps.sap.hana.ondemand.com\",\"supported_protocols\":[\"http\"],\"guid\":\"9aa474f9-3f82-4967-a2e1-dfe0cd155064\",\"created_at\":\"2016-10-06T08:30:16Z\",\"links\":{\"self\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/domains/9aa474f9-3f82-4967-a2e1-dfe0cd155064\"},\"route_reservations\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/domains/9aa474f9-3f82-4967-a2e1-dfe0cd155064/route_reservations\"}},\"router_group\":null}]}";
    String createRouteApiResponse = "{\"protocol\": \"http\", \"links\": {\"self\": {\"href\": \"https://api.cf.sap.hana.ondemand.com/v3/routes/08643213-a149-4128-8cd7-b4cd901a2893\"}, \"destinations\": {\"href\": \"https://api.cf.sap.hana.ondemand.com/v3/routes/08643213-a149-4128-8cd7-b4cd901a2893/destinations\"}, \"domain\": {\"href\": \"https://api.cf.sap.hana.ondemand.com/v3/domains/9aa474f9-3f82-4967-a2e1-dfe0cd155064\"}, \"space\": {\"href\": \"https://api.cf.sap.hana.ondemand.com/v3/spaces/5b01be08-edf4-442b-975c-5750d1e2d992\"}}, \"updated_at\": \"2021-09-14T11:29:07Z\", \"host\": \"acs-harshit-3-acs-mt-development-acs-service-management-ui\", \"path\": \"\", \"guid\": \"08643213-a149-4128-8cd7-b4cd901a2893\", \"port\": null, \"destinations\": [], \"relationships\": {\"domain\": {\"data\": {\"guid\": \"9aa474f9-3f82-4967-a2e1-dfe0cd155064\"}}, \"space\": {\"data\": {\"guid\": \"5b01be08-edf4-442b-975c-5750d1e2d992\"}}}, \"url\": \"acs-harshit-3-acs-mt-development-acs-service-management-ui.cfapps.sap.hana.ondemand.com\", \"created_at\": \"2021-09-14T11:29:07Z\", \"metadata\": {\"labels\": {}, \"annotations\": {}}}";
    String mapRouteApiAuthApiResponse = "{\"destinations\":[{\"app\":{\"process\":{\"type\":\"web\"},\"guid\":\"e8c380d5-fddd-4738-9b45-999c94a97c37\"},\"port\":8080,\"guid\":\"0e8534d9-2736-4d00-9323-3709ae0d3caa\",\"weight\":null}],\"links\":{\"route\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/routes/578282d5-9c54-4279-94c4-967b1d2c6d45\"},\"self\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/routes/578282d5-9c54-4279-94c4-967b1d2c6d45/destinations\"}}}";
    String getRouteIdAuthApiResponse = "{\"pagination\": {\"last\": {\"href\": \"https://api.cf.sap.hana.ondemand.com/v3/apps/e8c380d5-fddd-4738-9b45-999c94a97c37/routes?app_guids=e8c380d5-fddd-4738-9b45-999c94a97c37&hosts=acs-harshit-3-acs-mt-development-acs-service-management-ui&page=1&per_page=50\"}, \"total_results\": 1, \"total_pages\": 1, \"next\": null, \"first\": {\"href\": \"https://api.cf.sap.hana.ondemand.com/v3/apps/e8c380d5-fddd-4738-9b45-999c94a97c37/routes?app_guids=e8c380d5-fddd-4738-9b45-999c94a97c37&hosts=acs-harshit-3-acs-mt-development-acs-service-management-ui&page=1&per_page=50\"}, \"previous\": null}, \"resources\": [{\"protocol\": \"http\", \"links\": {\"self\": {\"href\": \"https://api.cf.sap.hana.ondemand.com/v3/routes/578282d5-9c54-4279-94c4-967b1d2c6d45\"}, \"destinations\": {\"href\": \"https://api.cf.sap.hana.ondemand.com/v3/routes/578282d5-9c54-4279-94c4-967b1d2c6d45/destinations\"}, \"domain\": {\"href\": \"https://api.cf.sap.hana.ondemand.com/v3/domains/9aa474f9-3f82-4967-a2e1-dfe0cd155064\"}, \"space\": {\"href\": \"https://api.cf.sap.hana.ondemand.com/v3/spaces/5b01be08-edf4-442b-975c-5750d1e2d992\"}}, \"updated_at\": \"2021-09-14T10:47:54Z\", \"host\": \"acs-harshit-3-acs-mt-development-acs-service-management-ui\", \"path\": \"\", \"guid\": \"578282d5-9c54-4279-94c4-967b1d2c6d45\", \"port\": null, \"destinations\": [{\"app\": {\"process\": {\"type\": \"web\"}, \"guid\": \"e8c380d5-fddd-4738-9b45-999c94a97c37\"}, \"guid\": \"0e8534d9-2736-4d00-9323-3709ae0d3caa\", \"port\": 8080, \"weight\": null}], \"relationships\": {\"domain\": {\"data\": {\"guid\": \"9aa474f9-3f82-4967-a2e1-dfe0cd155064\"}}, \"space\": {\"data\": {\"guid\": \"5b01be08-edf4-442b-975c-5750d1e2d992\"}}}, \"url\": \"acs-harshit-3-acs-mt-development-acs-service-management-ui.cfapps.sap.hana.ondemand.com\", \"created_at\": \"2021-09-14T10:47:54Z\", \"metadata\": {\"labels\": {}, \"annotations\": {}}}]}";
    String getRouteIdByHostApiResponse = "{\"pagination\":{\"next\":null,\"last\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/routes?hosts=acs-harshit-3-acs-mt-development-acs-service-management-ui&page=1&per_page=50\"},\"previous\":null,\"total_pages\":1,\"first\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/routes?hosts=acs-harshit-3-acs-mt-development-acs-service-management-ui&page=1&per_page=50\"},\"total_results\":1},\"resources\":[{\"path\":\"\",\"relationships\":{\"domain\":{\"data\":{\"guid\":\"9aa474f9-3f82-4967-a2e1-dfe0cd155064\"}},\"space\":{\"data\":{\"guid\":\"5b01be08-edf4-442b-975c-5750d1e2d992\"}}},\"protocol\":\"http\",\"metadata\":{\"annotations\":{},\"labels\":{}},\"updated_at\":\"2021-09-14T10:47:54Z\",\"port\":null,\"destinations\":[{\"app\":{\"process\":{\"type\":\"web\"},\"guid\":\"e8c380d5-fddd-4738-9b45-999c94a97c37\"},\"port\":8080,\"guid\":\"0e8534d9-2736-4d00-9323-3709ae0d3caa\",\"weight\":null}],\"host\":\"acs-harshit-3-acs-mt-development-acs-service-management-ui\",\"guid\":\"578282d5-9c54-4279-94c4-967b1d2c6d45\",\"created_at\":\"2021-09-14T10:47:54Z\",\"links\":{\"destinations\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/routes/578282d5-9c54-4279-94c4-967b1d2c6d45/destinations\"},\"domain\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/domains/9aa474f9-3f82-4967-a2e1-dfe0cd155064\"},\"self\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/routes/578282d5-9c54-4279-94c4-967b1d2c6d45\"},\"space\":{\"href\":\"https://api.cf.sap.hana.ondemand.com/v3/spaces/5b01be08-edf4-442b-975c-5750d1e2d992\"}},\"url\":\"acs-harshit-3-acs-mt-development-acs-service-management-ui.cfapps.sap.hana.ondemand.com\"}]}";
    String deleteRouteApiResponse = null;
    String routeDoesNotExistAuthApiResponse = "{\"pagination\": {\"last\": {\"href\": \"https://api.cf.sap.hana.ondemand.com/v3/apps/e8c380d5-fddd-4738-9b45-999c94a97c37/routes?app_guids=e8c380d5-fddd-4738-9b45-999c94a97c37&hosts=acs-bnb-2-acs-mt-development-acs-service-management-ui&page=1&per_page=50\"}, \"total_results\": 0, \"total_pages\": 1, \"next\": null, \"first\": {\"href\": \"https://api.cf.sap.hana.ondemand.com/v3/apps/e8c380d5-fddd-4738-9b45-999c94a97c37/routes?app_guids=e8c380d5-fddd-4738-9b45-999c94a97c37&hosts=acs-bnb-2-acs-mt-development-acs-service-management-ui&page=1&per_page=50\"}, \"previous\": null}, \"resources\": []}";
}