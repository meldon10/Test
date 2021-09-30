package com.sap.acs.handler;

import com.sap.acs.common.utils.VcapServices;
import com.sap.acs.constant.Endpoint;
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
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import static org.junit.Assert.assertEquals;

/**
 * @author I524733(Harshit Maheshwari) on 15/09/21
 * @project service-management
 */
@RunWith(MockitoJUnitRunner.class)
public class CredentialStoreHandlerTest {

    @Mock
    VcapServices vcapServices;

    @Mock
    RestTemplate restTemplate;

    @InjectMocks
    CredentialStoreHandler credentialStoreHandler = new CredentialStoreHandler();

    @Before
    public void setUp() {
        Mockito.when(vcapServices.getCredStoreBaseUrl()).thenReturn(
                "https://credstore.cfapps.sap.hana.ondemand.com/api/v1/credentials");
        Mockito.when(vcapServices.getCredStoreUsername()).thenReturn(
                "b063c0a5-54f1-492f-9688-cf3b4b341620.0.Xy8HzsYwEXrHHOpv2ZQPSVWOjrwh7MAqcGaT1Ckl+Os=");
        Mockito.when(vcapServices.getCredStorePassword()).thenReturn("uCgkNTtYpYeqixdrhwKxUgFa18gUYcL0vVghJm4RVfJXefGDdromiW81MyJfGo6e.0.pfBMHExnBNAqlG4zTioYMQeXiBb3UA7mMjgPf7ExAKM=");
        Mockito.when(vcapServices.getCredStorePrivateKey()).thenReturn("MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQChWp+gQnwbp5yISy7iQ5WWlrC6Z1Wtm19nhtyLAzMhISua03Et7w4jfdl0D9dAPIk5OwgH2uhEJRJR84rrzo9abVSP7Qt2PoFBPxP7p5IO75xIupH7t6qvdU7gFnZu3GZgf5bGkspqfg/MwaG9/CT5H12WGPgHRxAYNdWoALFIbJ3GkaUJeB7cArq3qHeIdMX3Nnd+h+yovRWJ+jTFs0ENg2hREyfk5o63bHtf9koYJm8wYBXLSE4sOgAVYqo72Ywt3KKq64P/pnKgejW31enV/wGWdo0JSHBZO2PHQn8qvU+cun/0pmQPODx5XaYF+QS1h+bZwAEIORhyjn/eRhhnAgMBAAECggEBAJxXX+X7pZ9yJ7TUDGiGjdHszu6+o4Dk1GtOfDFh90+5gTOyfq7APBXdoi7YDnwaa+f9L8nUrUsiFH89mLTlX3eCCfau+3UmGT2sLeOgOWCpgOfjhwG8s/DwnG16tmSyv6vu1JwxrVnELfD7CYo5X2XXo2mFZgY/L/QVbaEskpqVwAYmbbNaWB2B1PHDvqjtU955i2gbPLBwPkT7UZEWHk5G/epl0+EMmeSDfNElAa2FJn7vwDXcR7Xxnm+cH3ZJE1YNEYcf+pm3ghjKjPnIFa5OISQKLFJZ1aYVT+EEmj6j0o+d/MoNKn+lPYAcp8A2TDqrvxoaCX83+sYqqLI+VkECgYEA4CsSZxcXosa2WjjSB4cQ0vSarYCINsQOGCHMJYNOv2lLYNP5cbEizzrvRQ9cP7QVKmgBfQULMx9h71dkQbqWfLVwCXXDsdb0DplCUkjDY5txbg5JZNdaH9U6jHJIIB8gf+fX0s1OIPj3jzT7DoAn+vSgC4A2GSQM4l5dfy/ATUcCgYEAuEQjWqjW37d0cpLzo7bCtoLjFuSmkXyatXszrmYFB0YYhuBX3wuOpnVsrISXf1pLw8OwIszS9rvvlEdg88f9xAJxVUPfTPQfW2ls6Sc0Ki51ob7/ovt4O93x2Cg0/sxHSajgrNbOFBXQdAgN2gq5gT3FdzGGssvaadumGace6+ECgYEAuuwvlDb1Ro5cUC9BM3W02bONp0+eRcyF1CmaiU1MxN+QM1WOkvcaB6MlEXkVeyk23P2NACrMg/yPNXyx5P0pryO8IKdKX2jWabXyT5rNEqnzk8nl+Wh5hkHPaH2DFwXdm8o/dVAs7eGszIVpM1Y6AFErg2uNsLkW5Uu6uuuedtECgYB0W1KX5RYKnyYBU5pWPwolhfEwe6JTLIPlJa806WczeKf0Q6Y5SmsB4hSFvBSObs55CBEpaH2vIG3hDFHEnv030PMQDJPtXBqQ9rm3YPIn0L6nLJzwpir+YuBcxsbwPr6lXObDPcFUHZJMMunMTgll+0O+SJ/uN5vsTK9Oc6GrAQKBgHuBLUoE+C/6jrxY5Vrqrf4I7RFOFucbxW+4XDV1I3zmQE3cBrzl7c499EwIXt46O4BwOtq0uuoX8tzS3K921od1z2PP5jpEgB2u3D9wbKtwIMFD9a/y778zkKT2Y4DvuKTlhYXMnLhiOSrjgIHUwfyQq3cqUmJs3XL7Ntaleb4V");

    }

    @Test
    public void testFetchCredentials_ValidKeyAndNamespace_ShouldPass() {
        ResponseEntity<String> responseEntity = new ResponseEntity<>(
                "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIiwiaWF0IjoxNjMxNDQyNjE2fQ.XlQ2Bw3r3fEXYeTkdhGGjoh-7F9OhxH1jX1Ox1lcB4vni_VD2TpsId7N9Pk4r3VV3xq5YrEvGVMgGFwr7lZNSPGwFUVnOVa8Lq9VuzsVN8SN89JFf7gsJKIgxIKoofxA3IOaDzrZgma9yBowMhdDuwsf9KiIOWkCvnU4WEr9vlBoDxizt3dmAvX_iY1aDizmKMT6-PZu3hQY9FxDHgwyWc20VebXdMpXTTajS6pfalggkSsBTI3eP8LskR6L7UupGAjhhnhqZ8Dy3DQzKsOdkq8XdpIzK_7T0KpKdvuN_I_CStt6KAx_UFDJIGHGKKeOcn7rGQLrCZuNYiIQb2X9Gg.ueWYSVRnqWzpazFW.DP6NnVtb1R9TXw2dkE23scZuv767JB_O9mjh5WO3XvM5N1np4F7SKJHTjwrlpaWQTjt7MCWqDFSf-haVlXLkW4ra5HY-zTcF0ieeLJmCeiDnlxaRBr_xy6u2Z4F_C8DIDfATr_HpVuWmNZzuC5PKDNqLVK3M5f47Mu4ECcVZ6wG98Cpt5M_b-jdldynTRYDohG0vNhs_1PWbV4P70gqfoEY-5PjP_8AQ-rsECo63DiuP4d8Epuu4MgjMinS3.Yd3fXmRDZlTNf3dNnzjbJQ",
                HttpStatus.OK);
        Mockito.when(restTemplate.exchange(ArgumentMatchers.contains("api/v1/credentials"),
                        ArgumentMatchers.eq(HttpMethod.GET),
                        ArgumentMatchers.<HttpEntity<?>> any(),
                        ArgumentMatchers.<Class<String>> any()))
                .thenReturn(responseEntity);
        String expectedPayload = "{\"modifiedAt\":\"2021-09-12T10:18:55.971Z\",\"name\":\"cf-technical-user\",\"id\":\"33d75be4-f881-4320-9e52-6dc59726b0a2\",\"type\":\"password\",\"value\":\"Test@123\",\"status\":\"enabled\",\"username\":\"i524733\"}";
        JSONObject actualPayload = credentialStoreHandler.readCredentials(Endpoint.CF_TECHNICAL_USER,
                Endpoint.CREDENTIAL_STORE_NAMESPACE);
        assertEquals(expectedPayload, actualPayload.toString());
    }

    @Test(expected = IllegalArgumentException.class)
    public void testFetchCredentials_NullNameSpace_ShouldThrowException() {
        credentialStoreHandler.readCredentials(Endpoint.CF_TECHNICAL_USER, "");
    }

    @Test(expected = IllegalArgumentException.class)
    public void testFetchCredentials_NullKey_ShouldThrowException() {
        credentialStoreHandler.readCredentials("", Endpoint.CREDENTIAL_STORE_NAMESPACE);
    }

    @Test(expected = HttpClientErrorException.Unauthorized.class)
    public void testFetchCredentials_WrongUsernameOrWrongPassword_ShouldThrowUnauthorizedException() {
        Mockito.reset(vcapServices, restTemplate);
        Mockito.when(vcapServices.getCredStoreBaseUrl()).thenReturn(
                "https://credstore.cfapps.sap.hana.ondemand.com/api/v1/credentials");
        Mockito.when(vcapServices.getCredStoreUsername()).thenReturn("wrong-username");
        Mockito.when(vcapServices.getCredStorePassword()).thenReturn("uC0.pfBMHExnBNAqlG4zTioYMQeXiBb3UA7mMjgPf7ExAKM=");

        HttpClientErrorException exception = HttpClientErrorException.Unauthorized.create(HttpStatus.UNAUTHORIZED,
                null, null, null, null);

        Mockito.when(restTemplate.exchange(ArgumentMatchers.contains("api/v1/credentials"),
                        ArgumentMatchers.eq(HttpMethod.GET),
                        ArgumentMatchers.<HttpEntity<?>> any(),
                        ArgumentMatchers.<Class<String>> any()))
                .thenThrow(exception);

        credentialStoreHandler.readCredentials(Endpoint.CF_TECHNICAL_USER,
                Endpoint.CREDENTIAL_STORE_NAMESPACE);
    }


    @Test(expected = HttpClientErrorException.NotFound.class)
    public void testFetchCredentials_WrongNamespace_ShouldThrowNotFoundException() {
        Mockito.reset(restTemplate);
        HttpClientErrorException exception = HttpClientErrorException.NotFound.create(HttpStatus.NOT_FOUND,
                null, null, null, null);
        Mockito.when(restTemplate.exchange(ArgumentMatchers.contains("api/v1/credentials"),
                        ArgumentMatchers.eq(HttpMethod.GET),
                        ArgumentMatchers.<HttpEntity<?>> any(),
                        ArgumentMatchers.<Class<String>> any()))
                .thenThrow(exception);
        credentialStoreHandler.readCredentials(Endpoint.CF_TECHNICAL_USER, "wrong-namespace");
    }

    @Test(expected = HttpClientErrorException.NotFound.class)
    public void testFetchCredentials_WrongKey_ShouldThrowNotFoundException() {
        Mockito.reset(restTemplate);
        HttpClientErrorException exception = HttpClientErrorException.NotFound.create(HttpStatus.NOT_FOUND,
                null, null, null, null);
        Mockito.when(restTemplate.exchange(ArgumentMatchers.contains("api/v1/credentials"),
                        ArgumentMatchers.eq(HttpMethod.GET),
                        ArgumentMatchers.<HttpEntity<?>> any(),
                        ArgumentMatchers.<Class<String>> any()))
                .thenThrow(exception);
        credentialStoreHandler.readCredentials("this-key-does-not-exist", Endpoint.CREDENTIAL_STORE_NAMESPACE);
    }
}

