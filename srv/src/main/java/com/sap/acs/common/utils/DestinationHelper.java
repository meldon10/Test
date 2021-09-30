package com.sap.acs.common.utils;

import com.sap.cloud.sdk.cloudplatform.connectivity.Destination;
import com.sap.cloud.sdk.cloudplatform.connectivity.DestinationAccessor;
import com.sap.cloud.sdk.cloudplatform.connectivity.DestinationOptions;
import com.sap.cloud.sdk.cloudplatform.connectivity.HttpDestination;
import com.sap.cloud.sdk.cloudplatform.connectivity.ScpCfDestinationOptionsAugmenter;
import com.sap.cloud.sdk.cloudplatform.connectivity.ScpCfDestinationRetrievalStrategy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import io.vavr.control.Try;

/**
 * 
 * Helper class to provide convenience method to retrieve destination based on specific protocol
 *  and configuration stores (Subscriber or Provider subaccounts)
 */

public class DestinationHelper {
    
    private final static Logger logger = LoggerFactory.getLogger(DestinationHelper.class);
    
    /**
	 * Option pointing to subscriber defined destinations (Destinations in subscriber subaccount)
	 */
	private static final DestinationOptions alwaysSubscriber = DestinationOptions.builder()
			.augmentBuilder(ScpCfDestinationOptionsAugmenter.augmenter()
					.retrievalStrategy(ScpCfDestinationRetrievalStrategy.ALWAYS_SUBSCRIBER))
            .build();
    
    /**
	 * Retrieve generic destination from subscriber account
	 * @param destinationName
	 * @return Destination
	 */
	public static Destination getSubscriberDestination(String destinationName) {
		Try<Destination> tryDestination = DestinationAccessor.getLoader()
												.tryGetDestination(destinationName,
													alwaysSubscriber);
		return tryDestination.get();
    }
    
    /**
	 * Retrieve HTTP destination from subscriber account
	 * @param destinationName
	 * @return HttpDestination
	 */
	public static HttpDestination getSubscriberHttpDestination(String destinationName) {
		return getSubscriberDestination(destinationName).asHttp();
    }
   
}
