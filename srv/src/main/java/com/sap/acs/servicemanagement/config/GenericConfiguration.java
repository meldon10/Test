package com.sap.acs.servicemanagement.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration class for rest API calls
 */

@Configuration
public class GenericConfiguration {

    @Bean
    RestTemplate xsuaaRestOperations() {
        return new RestTemplate();
    }

}