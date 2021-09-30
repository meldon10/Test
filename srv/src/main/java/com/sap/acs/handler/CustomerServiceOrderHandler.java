package com.sap.acs.handler;

import cds.gen.customerserviceorder.BusinessPartner;
import cds.gen.customerserviceorder.CustomerServiceOrder_;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
@ServiceName(CustomerServiceOrder_.CDS_NAME)
public class CustomerServiceOrderHandler implements EventHandler {

    private static final Logger LOGGER = LogManager.getLogger(CustomerServiceOrderHandler.class.getName());
    
    @Value("${constants.GEOCODE_API_URI}")    
    private String geocode_URI;

    @Value("${constants.GEOCODEAPI_KEY}")
    private String geocode_API_key;

    private List<BusinessPartner> bussinessPartner;

    @After(entity = "CustomerServiceOrder.BusinessPartner", event = CdsService.EVENT_READ)
    public List<BusinessPartner> onGetGeolocation(Stream<BusinessPartner> customerAdd) {

        /**
         * Filter the required customer data
         */
        bussinessPartner = customerAdd.collect(Collectors.toList());

        List<BusinessPartner> customerAddressList = new ArrayList<BusinessPartner>();
        for (BusinessPartner customerAddress : bussinessPartner) {
            
            StringBuilder sb = new StringBuilder();

            /**
             * Fetch geocodes
             */
            sb.append(geocode_URI);
            if (customerAddress.getCity() != null)
                sb.append(customerAddress.getCity() + "+");

            if (customerAddress.getRegion() != null)
                sb.append(customerAddress.getRegion() + "+");

            if (customerAddress.getPostalCode() != null)
                sb.append(customerAddress.getPostalCode() + "+");

            if (customerAddress.getCountry() != null)
                sb.append(customerAddress.getCountry());
            sb.append(geocode_API_key);

            String uri = sb.toString().replace(' ', '+');
            
            LOGGER.debug("uri::" + uri);
            RestTemplate restTemplate = new RestTemplate();
            sb = new StringBuilder();
            sb.append("[");
            sb.append(restTemplate.getForObject(uri, String.class));
            sb.append("]");
            String result = sb.toString();

            JSONArray array = new JSONArray(result);
            JSONObject object = array.getJSONObject(0);
            JSONArray items = object.getJSONArray("items");
            JSONObject item = (JSONObject) items.get(0);
            JSONObject pos = item.getJSONObject("position");
            String lat = pos.get("lat").toString();
            String lng = pos.get("lng").toString();

            /**
             * set the result back to entity
             */
            BusinessPartner customerAddressObj = BusinessPartner.create();
            sb = new StringBuilder();
            sb.append(lng + ";");
            sb.append(lat + ";0");
            LOGGER.debug("formatted lat & long for UI:: "+ sb.toString());
            customerAddressObj.setGeocode(sb.toString());
            customerAddressObj.setFullname(customerAddress.getFullname());
            customerAddressObj.setRegion(customerAddress.getRegion());
            customerAddressObj.setCountry(customerAddress.getCountry());
            customerAddressObj.setCity(customerAddress.getCity());
            customerAddressObj.setBusinesspartner(customerAddress.getBusinesspartner());
            customerAddressObj.setEmailaddress(customerAddress.getEmailaddress());
            customerAddressObj.setServiceOrders(customerAddress.getServiceOrders());
            customerAddressObj.setPhonenumber(customerAddress.getPhonenumber());
            customerAddressObj.setBusinesspartnertype(customerAddress.getBusinesspartnertype());
            customerAddressObj.setIndustry(customerAddress.getIndustry());
            customerAddressObj.setPostalCode(customerAddress.getPostalCode());
            customerAddressList.add(customerAddressObj);
        }

        /**
         * Return the updated entity with geocodes
         */

        return customerAddressList;
    }
}