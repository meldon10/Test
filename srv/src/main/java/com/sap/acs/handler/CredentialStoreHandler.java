package com.sap.acs.handler;

import com.sap.acs.common.utils.VcapServices;
import com.sap.acs.constant.Endpoint;
import org.jose4j.jwa.AlgorithmConstraints;
import org.jose4j.jwe.ContentEncryptionAlgorithmIdentifiers;
import org.jose4j.jwe.JsonWebEncryption;
import org.jose4j.jwe.KeyManagementAlgorithmIdentifiers;
import org.jose4j.lang.JoseException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Arrays;
import java.util.Base64;

/**
 * @author I524733(Harshit Maheshwari) on 15/09/21
 * @project service-management
 */
/**
 * Helper class to interact with the credential store to
 * fetch the credentials from store using REST call & decrypting them
 * into human-readable form.
 * Later, if required the same class can be scaled to encrypt & upload any credentials
 */
@Component
public class CredentialStoreHandler {

    private static final AlgorithmConstraints CONTENT_ENCRYPTION_ALGORITHM_CONSTRAINTS =
            new AlgorithmConstraints(AlgorithmConstraints.ConstraintType.PERMIT,
                    ContentEncryptionAlgorithmIdentifiers.AES_256_GCM);

    private static final AlgorithmConstraints KEY_ENCRYPTION_ALGORITHM_CONSTRAINTS =
            new AlgorithmConstraints(AlgorithmConstraints.ConstraintType.PERMIT,
                    KeyManagementAlgorithmIdentifiers.RSA_OAEP_256);

    @Autowired
    VcapServices vcapServices;

    RestTemplate restTemplate = new RestTemplate();

    Logger logger = LoggerFactory.getLogger(CredentialStoreHandler.class);

    /**
    * Decrypts the payload which has been received from credential store
    * it uses RSA algorithm and PRIVATE_KEY to decrypt the payload
    * @param payload the payload which has been received from the api response
    * @return decrypted payload in JSONObject format
    */
    private JSONObject decryptPayload(String payload) throws NoSuchAlgorithmException,
            InvalidKeySpecException, JoseException {
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        byte[] binaryKey = Base64.getDecoder().decode(vcapServices.getCredStorePrivateKey());
        RSAPrivateKey privateKey = (RSAPrivateKey) keyFactory.generatePrivate(new PKCS8EncodedKeySpec(binaryKey));
        JsonWebEncryption jwe = new JsonWebEncryption();
        jwe.setAlgorithmConstraints(KEY_ENCRYPTION_ALGORITHM_CONSTRAINTS);
        jwe.setContentEncryptionAlgorithmConstraints(CONTENT_ENCRYPTION_ALGORITHM_CONSTRAINTS);
        jwe.setKey(privateKey);
        jwe.setCompactSerialization(payload);
        String decryptedPayload = jwe.getPayload();
        return new JSONObject(decryptedPayload);
    }


    /**
    * Returns the base64 encoded string
    * @param plainString raw string which needs to be decoded
    * @return base64 encoded string
    */
    private String getBase64EncodedString(String plainString) {
        return Base64.getEncoder().encodeToString(plainString.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * fetches the credentials in encrypted form from credential store using REST CALL
     * @param key unique id under which the credentials are stored
     * @param namespace namespace under which key is defined
     * @return encrypted payload fetched from the credential store
     */
    private String fetchCredentials(String key, String namespace) {
        String url = UriComponentsBuilder.fromHttpUrl(vcapServices.getCredStoreBaseUrl())
                .path(Endpoint.FETCH_CREDENTIAL)
                .queryParam("name", key)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(getBase64EncodedString(vcapServices.getCredStoreUsername()
                + ":" + vcapServices.getCredStorePassword()));
        headers.add(Endpoint.CREDENTIAL_NAMESPACE_HANDLER, namespace);

        HttpEntity<String> httpEntity = new HttpEntity<>("parameters", headers);
        ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET, httpEntity, String.class);

        
        headers = null;
        httpEntity = null;
        System.gc();

        assert response.getStatusCode() == HttpStatus.OK;
        return response.getBody();
    }

    /**
     * public method which fetches, decrypts and returns the payload based
     * on the key & namespace provided
     * @param key unique id under which the credentials are stored
     * @param namespace namespace under which key is defined
     * @return returns the final decrypted containing credentials
     */
    public JSONObject readCredentials(String key, String namespace) {

        if (key.isEmpty() || namespace.isEmpty()) {
            throw new IllegalArgumentException("Key and namespace cannot be null.");
        }

        String payload = fetchCredentials(key, namespace);

        try {
            return decryptPayload(payload);
        } catch (Exception e) {
            logger.error(Arrays.toString(e.getStackTrace()));
            return new JSONObject();
        }
    }
}
