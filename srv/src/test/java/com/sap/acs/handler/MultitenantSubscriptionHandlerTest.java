package com.sap.acs.handler;

import com.sap.cds.services.mt.MtGetDependenciesEventContext;
import com.sap.cds.services.mt.MtSubscribeEventContext;
import com.sap.cds.services.mt.MtUnsubscribeEventContext;
import com.sap.cloud.mt.subscription.json.DeletePayload;
import com.sap.cloud.mt.subscription.json.SubscriptionPayload;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;

/**
 * @author I524733(Harshit Maheshwari) on 15/09/21
 * @project service-management
 */
@RunWith(MockitoJUnitRunner.class)
public class MultitenantSubscriptionHandlerTest {

    private final String mockTenantId = "82ac2-dh28d-cb283-pi8b2-93828-2902";

    @InjectMocks
    MultitenantSubscriptionHandler subscriptionHandler;

    @Mock
    TenantRouteHandler tenantRouteHandler;

    MtSubscribeEventContext mtSubscribeEventContext = MtSubscribeEventContext.create();
    MtUnsubscribeEventContext mtUnsubscribeEventContext = MtUnsubscribeEventContext.create();

    SubscriptionPayload subscriptionPayload = new SubscriptionPayload();
    DeletePayload deletePayload = new DeletePayload();

    @Before
    public void setUp() {
        mtSubscribeEventContext.setTenantId(mockTenantId);
        mtUnsubscribeEventContext.setTenantId(mockTenantId);
    }


    @Test
    public void beforeSubscribeTest() {
        subscriptionHandler.beforeSubscribe(mtSubscribeEventContext);
    }

    @Test
    public void onSubscribeTest() {
        Mockito.when(tenantRouteHandler.createTenantRoute(ArgumentMatchers.anyString()))
                .thenReturn(true);
        subscriptionPayload.subscribedSubdomain = "test-customer-domain";
        mtSubscribeEventContext.setSubscriptionPayload(subscriptionPayload);
        subscriptionHandler.onSubscribe(mtSubscribeEventContext);
    }

    @Test
    public void afterSubscribeTest() {
        subscriptionHandler.afterSubscribe(mtSubscribeEventContext);
    }

    @Test
    public void onGetDependenciesTest() {
        MtGetDependenciesEventContext mtGetDependenciesEventContext = MtGetDependenciesEventContext.create();
        subscriptionHandler.onGetDependencies(mtGetDependenciesEventContext);
    }

    @Test
    public void beforeUnsubscribeTest() {
        subscriptionHandler.beforeUnsubscribe(mtUnsubscribeEventContext);
    }

    @Test
    public void onUnSubscribeTest() {
        deletePayload.subscribedSubdomain = "test-customer-domain";
        mtUnsubscribeEventContext.setDeletePayload(deletePayload);
        Mockito.when(tenantRouteHandler.deleteTenantRoute(ArgumentMatchers.anyString()))
                .thenReturn(true);
        subscriptionHandler.onUnsubscribe(mtUnsubscribeEventContext);
    }

    @Test
    public void afterUnsubscribeTest() {
        subscriptionHandler.afterUnsubscribe(mtUnsubscribeEventContext);
    }

    
}