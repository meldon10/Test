package com.sap.acs.servicemanagement.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.jwt.Jwt;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
    


    @Override
     protected void configure(HttpSecurity http) throws Exception {
         http
            .requestMatchers().antMatchers("/api/**").and()
            .csrf().disable() 
            .authorizeRequests()
            .anyRequest().permitAll();
      
    }

     /**
     * Yet to be implemented
     */
    Converter<Jwt, AbstractAuthenticationToken> getJwtAuthenticationConverter() {
      return null;
    }
}
