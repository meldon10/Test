package com.sap.acs.handler;

import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.mt.MtGetDependenciesEventContext;
import com.sap.cds.services.mt.MtSubscribeEventContext;
import com.sap.cds.services.mt.MtSubscriptionService;
import com.sap.cds.services.mt.MtUnsubscribeEventContext;
import com.sap.cloud.mt.subscription.json.ApplicationDependency;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

import com.sap.acs.common.utils.VcapServices;

/**
 * @author I524733(Harshit Maheshwari) on 15/09/21
 * @project service-management
 */
/**
 * Handler that implements subscription logic
 * of the multiple tenants when they on-board &
 * off board from the application.
 */
@Component
@Profile("cloud")
@ServiceName(MtSubscriptionService.DEFAULT_NAME)
class MultitenantSubscriptionHandler implements EventHandler {

    Logger logger = LoggerFactory.getLogger(MultitenantSubscriptionHandler.class);
    
    @Autowired
    VcapServices vcapServices;

	@Autowired
	TenantRouteHandler tenantRouteHandler = new TenantRouteHandler();

	/**
	 * This event will be fired when the customer starts
	 * subscribing the application
	 */
	@Before(event = MtSubscriptionService.EVENT_SUBSCRIBE)
	public void beforeSubscribe(MtSubscribeEventContext context) {
		String tenantId = context.getTenantId();
		logger.info("Starting on-boarding the tenant --> " + tenantId);
	}

	/**
	 * This event will be fired when the customer starts
	 * subscribing the application
	 */
	@On(event = MtSubscriptionService.EVENT_SUBSCRIBE)
	public void onSubscribe(MtSubscribeEventContext context) {
		String tenantId = context.getTenantId();
		logger.info("Started creating route for tenant: " + tenantId);
		String tenantSubdomain = context.getSubscriptionPayload().subscribedSubdomain;
		tenantRouteHandler.createTenantRoute(tenantSubdomain);
		logger.info("finished creating route");
	}

	/**
	 * This event will be fired when the subscription is
	 * successful & we want to fire side effects for logging
	 */

	/**
	 *
	 * @param context
	 */
	@After(event = MtSubscriptionService.EVENT_SUBSCRIBE)
	public void afterSubscribe(MtSubscribeEventContext context) {
		String tenantId = context.getTenantId();
		logger.info("Finished on-boarding the tenant --> " + tenantId);

	}

	/**
	 * This event will be fired when the SaaS Provisioning
	 * calls the getDependencies callback
	 */
	@On(event = MtSubscriptionService.EVENT_GET_DEPENDENCIES)
	public void onGetDependencies(MtGetDependenciesEventContext context) {
        ApplicationDependency dependency = new ApplicationDependency();;
        List<ApplicationDependency> dependencies = new ArrayList<>();

        // Adding destination & Connectivity dependencies
        try {
            dependency.xsappname = vcapServices.getXsAppNameDestination();
            dependencies.add(dependency);

            dependency = new ApplicationDependency();
            dependency.xsappname =  vcapServices.getXsAppNameConnectivity();
            dependencies.add(dependency);

			dependency = new ApplicationDependency();
            dependency.xsappname =  vcapServices.getPortalAppName();
            dependencies.add(dependency);

			dependency = new ApplicationDependency();
            dependency.xsappname =  vcapServices.getHtmlAppName();
            dependencies.add(dependency);

        } catch (Exception e) {
            logger.error("Exception occured while getting application dependencies::  ", e);
        }
        context.setResult(dependencies);
	}

	/**
	 * This event will be fired when the customer starts
	 * unsubscribing the application
	*/
	@Before(event = MtSubscriptionService.EVENT_UNSUBSCRIBE)
	public void beforeUnsubscribe(MtUnsubscribeEventContext context) {
		String tenantId = context.getTenantId();
        logger.info("Starting off-boarding the tenant --> " + tenantId);
		
		// deleting the subscription & but preserving the tenant hdi container
		context.setDelete(false);
      }

	/**
	 * This event will be fired when the customer starts
	 * unsubscribing the application
	 */
	@On(event = MtSubscriptionService.EVENT_UNSUBSCRIBE)
	public void onUnsubscribe(MtUnsubscribeEventContext context) {
		String tenantId = context.getTenantId();
		logger.info("Starting deleting routes of the tenant: " + tenantId);
		String tenantSubdomain = context.getDeletePayload().subscribedSubdomain;
		tenantRouteHandler.deleteTenantRoute(tenantSubdomain);
		logger.info("finished deleting route");
	}
	/**
	 * This event will be fired when the unsubscription is
	 * successful & we want to fire side effects for logging
	 */
    @After(event = MtSubscriptionService.EVENT_UNSUBSCRIBE)
	public void afterUnsubscribe(MtUnsubscribeEventContext context) {
		String tenantId = context.getTenantId();
		logger.info("Finished off-boarding the tenant --> " + tenantId);
		
		// deleting the subscription & but preserving the tenant hdi container
		context.setDelete(false);
	}
}
