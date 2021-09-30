package com.sap.acs.handler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sap.acs.common.utils.VcapApplication;
import com.sap.acs.common.utils.VcapServices;
import com.sap.acs.constant.Endpoint;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.StringJoiner;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * @author I524733(Harshit Maheshwari) on 15/09/21
 * @project service-management
 */
@Component
public class TenantRouteHandler {

    @Autowired
    VcapApplication vcapApplication;

    @Autowired
    VcapServices vcapServices;

    @Autowired
    CredentialStoreHandler credentialStoreHandler;

    RestTemplate restTemplate = new RestTemplate();
    private String accessToken;

    private static final String HEADERS_PARAM = "parameters";
    private static final String RESOURCES_PARAM = "resources";
    private static final String APP_ID_KEY = "appId";

    Logger logger = LoggerFactory.getLogger(TenantRouteHandler.class);


    /** Builds the tenant host using domain, org, space etc.
     * @param tenantSubdomain customer subscribed subdomain
     * @return final tenant host
     */
    private String getTenantHost(String tenantSubdomain) {
        return new StringJoiner(Endpoint.TENANT_HOST_SEPARATOR)
                .add(tenantSubdomain)
                .add(vcapApplication.getCfOrgName())
                .add(vcapApplication.getSpaceName())
                .add(vcapServices.getAppName())
                .toString();
    }


    /**
     * Tests if the tenant subdomain is valid or not
     * because route of more than 63 characters(included) cannot be created
     * @param tenantHost tenant host which will be used to create route
     * @return true if tenantHost is less than or equal to 63 characters else false
     */
    private boolean isTenantHostValid(String tenantHost) {
        return tenantHost.length() <= 63;
    }


    /** Gets authentication url from the info endpoint
     * @return authorization endpoint using which we can obtain access token
     * @throws JsonProcessingException gets thrown in object mapper
     */
    private String getAuthenticationUrl() throws JsonProcessingException {

        String url = UriComponentsBuilder.fromHttpUrl(vcapApplication.getCfApiUrl())
                .path(Endpoint.INFO_ENDPOINT)
                .toUriString();

        ResponseEntity<String> responseEntity = restTemplate.getForEntity(url, String.class);
        assert responseEntity.getStatusCode() == HttpStatus.OK;

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode root = objectMapper.readTree(responseEntity.getBody());

        return root.path("authorization_endpoint").asText();
    }


    /** Fetches the access token using the credentials fetched from the
     * credential store manager
     * @param authEndpointUrl auth endpoint url
     * @return Bearer Auth Token for authentication & authorization with the cf apis
     * @throws JsonProcessingException
     */
    private String getAccessToken(String authEndpointUrl) throws JsonProcessingException {

        String url = UriComponentsBuilder.fromHttpUrl(authEndpointUrl)
                .path(Endpoint.OAUTH_ENDPOINT)
                .toUriString();

        logger.debug(url);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBasicAuth(Base64.getEncoder().encodeToString("cf:".getBytes(StandardCharsets.UTF_8)));

        MultiValueMap<String, String> multiValueMap = new LinkedMultiValueMap<>();
        JSONObject credentials = credentialStoreHandler.readCredentials(Endpoint.CF_TECHNICAL_USER,
                Endpoint.CREDENTIAL_STORE_NAMESPACE);

        multiValueMap.add("username", credentials.getString("username"));
        multiValueMap.add("password", credentials.getString("value"));

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(multiValueMap, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        assert response.getStatusCode() == HttpStatus.OK;
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(response.getBody());
        return root.path("access_token").asText();
    }


    /** Fetches the app id to whom the route has to be bounded
     * @return guid of the app
     */
    private String getAppId() {

        String url = UriComponentsBuilder.fromHttpUrl(vcapApplication.getCfApiUrl())
                .path(Endpoint.APP_ENDPOINT)
                .queryParam("organization_guids", vcapApplication.getCfOrgId())
                .queryParam("space_guids", vcapApplication.getSpaceId())
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(this.accessToken);

        HttpEntity<String> httpEntity = new HttpEntity<>(HEADERS_PARAM, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, httpEntity, String.class);
        assert response.getStatusCode() == HttpStatus.OK;

        JSONObject jsonObject = new JSONObject(response.getBody());
        JSONArray listData = jsonObject.getJSONArray(RESOURCES_PARAM);

        if (listData.length() == 0) {
            // need to handle if app not found
            return null;
        }

        return filterAppName(listData);
    }

    /**
     * This filters the app from available apps & returns the app guid
     * since we do blue-green deployment, exact appname is not predictable, 
     * therefore we are doing this manual filtering keeping all scenarios in mind
     * @param apps JSONArray of all apps
     * @return app guid
     */
    private String filterAppName(JSONArray apps) {
        List<JSONObject> filteredApp = StreamSupport.stream(apps.spliterator(), false)
                .map(JSONObject.class::cast)
                .filter(v -> v.getString("name").contains(vcapServices.getAppName())
                || v.getString("name").contains(vcapServices.getAppName() + "-blue")
                || v.getString("name").contains(vcapServices.getAppName() + "-green"))
                .collect(Collectors.toList());

        if (filteredApp.isEmpty()) {
            return null;
        }
        return filteredApp.get(0).getString("guid");
    }



    /** fetches the domain guid of the Domain which will be used to create a route
     * @return guid of the domain
     */
    private String getDomainId() {
        String[] cfDomain = vcapApplication.getApplicationUri().split(Pattern.quote("."), 2);


        String api = UriComponentsBuilder.fromHttpUrl(vcapApplication.getCfApiUrl())
                .path(Endpoint.DOMAIN_ENDPOINT)
                .queryParam("names", cfDomain[1])
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(this.accessToken);

        HttpEntity<String> httpEntity = new HttpEntity<>(HEADERS_PARAM, headers);

        ResponseEntity<String> response = restTemplate.exchange(api, HttpMethod.GET, httpEntity, String.class);
        assert response.getStatusCode() == HttpStatus.OK;

        JSONObject jsonObject = new JSONObject(response.getBody());
        JSONArray listData = jsonObject.getJSONArray(RESOURCES_PARAM);

        if (listData.length() == 0) {
            // need to handle if domain not found
            return null;
        }

        return listData.getJSONObject(0).getString("guid");
    }


    /** Handler function to fetch the access token, app & domain guid
     * @return payload containing the app & domain guid
     */
    private JSONObject getCloudFoundryInfo() {
        JSONObject cfInfo = new JSONObject();
        try {
            // get authentication url
            String authUrl = this.getAuthenticationUrl();

            // setting access token to be used in every HTTP cal
            this.accessToken = this.getAccessToken(authUrl);

            String appId = this.getAppId();
            String domainId = this.getDomainId();
            cfInfo.put(APP_ID_KEY, appId);
            cfInfo.put("domainId", domainId);
        } catch (Exception e) {
            logger.error(e.getMessage());
            cfInfo.put("message", e.getMessage());
        }
        return cfInfo;
    }


    /** creates route using the cf api
     * @param host tenant host
     * @param domainId domain guid
     * @return guid of the newly created route
     */
    private String createRoute(String host, String domainId) {
        String url = UriComponentsBuilder.fromHttpUrl(vcapApplication.getCfApiUrl())
                .path(Endpoint.ROUTE_ENDPOINT)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(this.accessToken);

        JSONObject requestBody = new JSONObject();
        requestBody.put("host", host);

        JSONObject guid = new JSONObject();
        guid.put("guid", domainId);
        JSONObject data = new JSONObject();
        data.put("data", guid);

        JSONObject cfGuid = new JSONObject();
        cfGuid.put("guid", vcapApplication.getSpaceId());
        JSONObject cfData = new JSONObject();
        cfData.put("data", cfGuid);

        JSONObject relationships = new JSONObject();
        relationships.put("domain", data);
        relationships.put("space", cfData);
        requestBody.put("relationships", relationships);

        HttpEntity<String> request = new HttpEntity<>(
                requestBody.toString(), headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    url, request, String.class);

            assert response.getStatusCode() == HttpStatus.CREATED;
            return new JSONObject(response.getBody()).getString("guid");

        } catch (HttpStatusCodeException e) {

            // checking if route already exist, if yes then we will return null
            // and try to bind the application for routing
            if (e.getStatusCode() == HttpStatus.UNPROCESSABLE_ENTITY) {
                e.getResponseBodyAsString().contains("Route already exists");
                logger.debug("Route Already Exists with host: " + host);
                return null;
            }

            return e.getMessage();
        }
    }


    /** Binds route with the application
     * @param routeId guid of route
     * @param appId guid of the app
     * @return status whether the binding is successful or not
     */
    private boolean mapRoute(String routeId, String appId) {
        String url = UriComponentsBuilder.fromHttpUrl(vcapApplication.getCfApiUrl())
                .path(Endpoint.ROUTE_ENDPOINT)
                .path("/" + routeId)
                .path("/destinations")
                .toUriString();

        JSONObject requestBody = new JSONObject();
        JSONArray destinations = new JSONArray();
        JSONObject app = new JSONObject();
        JSONObject guid = new JSONObject();
        guid.put("guid", appId);
        app.put("app", guid);
        destinations.put(0, app);
        requestBody.put("destinations", destinations);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(this.accessToken);
        HttpEntity<String> httpEntity = new HttpEntity<>(requestBody.toString(), headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    url, httpEntity, String.class);
            assert response.getStatusCode() == HttpStatus.OK;
            return true;
        } catch (RestClientException e) {
            logger.error(e.getMessage());
            return false;
        }

    }


    /** Fetches the route guid using the appId & tenant host
     * @param appId guid of the app to which route is bounded
     * @param tenantHost tenant host of the customer
     * @return guid of the route
     */
    private String getRouteId(String appId, String tenantHost) {

        String url = UriComponentsBuilder.fromHttpUrl(vcapApplication.getCfApiUrl())
                .path(Endpoint.APP_ENDPOINT)
                .path("/" + appId)
                .path("/routes")
                .queryParam("hosts", tenantHost)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();

        headers.setBearerAuth(this.accessToken);
        HttpEntity<String> httpEntity = new HttpEntity<>(HEADERS_PARAM, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET,
                    httpEntity, String.class);

            assert response.getStatusCode() == HttpStatus.OK;

            JSONObject jsonObject = new JSONObject(response.getBody());
            JSONArray listData = jsonObject.getJSONArray(RESOURCES_PARAM);

            if (listData.length() == 0) {
                return null;
                // need to handle if app not found
            }
            return listData.getJSONObject(0).getString("guid");

        } catch (Exception e) {

            logger.error(e.getMessage());
            return null;
        }
    }


    /** Deletes the route using cf route delete api
     * @param routeId guid of route
     * @return status whether the route has been deleted or not
     */
    private boolean deleteRoute(String routeId) {
        String url = UriComponentsBuilder.fromHttpUrl(vcapApplication.getCfApiUrl())
                .path(Endpoint.ROUTE_ENDPOINT + "/")
                .path(routeId)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(this.accessToken);

        HttpEntity<String> httpEntity = new HttpEntity<>(HEADERS_PARAM, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.DELETE,
                    httpEntity, String.class);
            assert response.getStatusCode() == HttpStatus.ACCEPTED;
            return true;
        } catch (RestClientException e) {
            logger.info(e.getMessage());
            return false;
        }
    }


    /** Gives the  guid of route using the tenant host
     * @param host tenant host
     * @return guid of route
     */
    private String getRouteIdByHost(String host) {

        if (host.isEmpty()) {
            throw new IllegalArgumentException("Host is mandatory.");
        }

        String url = UriComponentsBuilder.fromHttpUrl(vcapApplication.getCfApiUrl())
                .path(Endpoint.ROUTE_ENDPOINT)
                .queryParam("hosts", host)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(this.accessToken);

        HttpEntity<String> httpEntity = new HttpEntity<>(HEADERS_PARAM, headers);

        ResponseEntity<String> response = restTemplate.exchange(url,
                HttpMethod.GET, httpEntity, String.class);

        JSONObject responseObj = new JSONObject(response.getBody());

        if (responseObj.getJSONArray(RESOURCES_PARAM).length() == 0) {
            logger.debug("No route exist with the host: " + host);
            return null;
        }
        return responseObj.getJSONArray(RESOURCES_PARAM).getJSONObject(0).getString("guid");
    }


    /**
     * Public method to create the tenant route during the on-boarding
     * @param tenantSubdomain subdomain of the subscribed customer
     * @return  boolean value if the route is created or not
     */
    public boolean createTenantRoute(String tenantSubdomain) {

        if (tenantSubdomain.isEmpty()) {
            throw new IllegalArgumentException("Tenant Subdomain should not be null.");
        }

        // checking if the tenantSubdomain is valid or not
        String tenantHost = this.getTenantHost(tenantSubdomain);
        logger.info("Tenant Host: " + tenantHost);
        boolean isValid = isTenantHostValid(tenantHost);
        if (!isValid) {
            throw new IllegalArgumentException("Host is too long (maximum is 63 characters)");
        }

        try {
            JSONObject cfInfo = this.getCloudFoundryInfo();
            logger.info("cf info" + cfInfo);
            String routeId = this.createRoute(tenantHost, cfInfo.getString("domainId"));
            logger.info("Route Id: " + routeId);

            if (routeId == null) {
                // this case will occur if we already have a route created but not bounded
                logger.debug("Trying to find existing Route Id");
                routeId = this.getRouteIdByHost(tenantHost);
            }
            return this.mapRoute(routeId, cfInfo.getString(APP_ID_KEY));

        } catch (Exception e) {
            logger.error(e.getMessage());
            return false;
        }
    }


    /**
     * Public method to delete the tenant route during the off-boarding
     * @param tenantSubdomain subdomain of the subscribed customer
     * @return boolean value if the route is deleted or not
     */
    public boolean deleteTenantRoute(String tenantSubdomain) {
        logger.info("tenant subdomain" + tenantSubdomain);
        if (tenantSubdomain.isEmpty()) {
            throw new IllegalArgumentException("subdomain is mandatory");
        }
        String tenantHost = this.getTenantHost(tenantSubdomain);
        logger.info("tenant host" + tenantHost);
        JSONObject cfInfo = this.getCloudFoundryInfo();
        String routeId = this.getRouteId(cfInfo.getString(APP_ID_KEY), tenantHost);
        logger.info("route id "+routeId);
        assert routeId != null;
        return this.deleteRoute(routeId);
    }
}