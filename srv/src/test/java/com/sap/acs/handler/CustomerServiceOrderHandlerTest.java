package com.sap.acs.handler;

import static org.junit.Assert.assertEquals;

import java.util.List;
import java.util.stream.Stream;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Before;

import cds.gen.customerserviceorder.BusinessPartner;

public class CustomerServiceOrderHandlerTest {

    // TODO placeholder for testing lat/long

    /*
     * private CustomerServiceOrderHandler handler = new
     * CustomerServiceOrderHandler(); private BusinessPartner bp =
     * BusinessPartner.create();
     * 
     * @Before public void createBusinessPartnerName() { bp.setFirstname("Alex"); }
     * 
     * @Test public void testName() { handler.updateName(Stream.of(bp));
     * assertEquals("Nitesh", bp.getFirstname()); }
     */
    private static final Logger LOGGER = LogManager.getLogger(CustomerServiceOrderHandlerTest.class.getName());
    private CustomerServiceOrderHandler handler = new CustomerServiceOrderHandler();
    private BusinessPartner custAddress = BusinessPartner.create();

    public void testCoordinates_geocodeFetch() {

        List<BusinessPartner> customerAddress = handler.onGetGeolocation(Stream.of(custAddress));
        LOGGER.debug("testCoordinates_geocodeFetch:: "+customerAddress.get(0).getCity() + " " + customerAddress.get(0).getGeocode());
        assertEquals("28.11516;-26.00636;0", customerAddress.get(0).getGeocode());
    }

    public void testCoordinates_spacesCheck() {

        List<BusinessPartner> customerAddress = handler.onGetGeolocation(Stream.of(custAddress));
        LOGGER.debug("testCoordinates_spacesCheck:: "+customerAddress.get(0).getCountry() + " " + customerAddress.get(0).getGeocode());
        assertEquals("28.11516;-26.00636;0", customerAddress.get(0).getGeocode());
    }

    public void testCoordinates_nullCheck(){
        this.custAddress.setCity("New Gregory");
        this.custAddress.setCountry("South Africa");
        this.custAddress.setRegion("Bilzen");
        this.custAddress.setPostalCode(null);

        List<BusinessPartner> customerAddress = handler.onGetGeolocation(Stream.of(custAddress));
        LOGGER.debug("testCoordinates_nullCheck:: "+customerAddress.get(0).getPostalCode() + " " + customerAddress.get(0).getGeocode());
        assertEquals("28.11516;-26.00636;0", customerAddress.get(0).getGeocode());
    }

    @Before
    public void createCustomerAddress() {
        this.custAddress.setCity("New Gregory");
        this.custAddress.setCountry("South Africa");
        this.custAddress.setRegion("Bilzen");
        this.custAddress.setBusinesspartner("105");
    }

}
