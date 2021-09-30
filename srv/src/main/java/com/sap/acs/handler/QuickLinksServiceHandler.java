package com.sap.acs.handler;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.sql.*; 
import com.sap.cds.services.ServiceException; 


import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cloud.sdk.cloudplatform.connectivity.HttpDestination;

import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.acs.common.utils.DestinationHelper;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cds.gen.quicklinksservice.*;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import com.sap.cds.services.persistence.PersistenceService;

import org.springframework.beans.factory.annotation.Value;


@Component
@ServiceName(QuickLinksService_.CDS_NAME)
public class QuickLinksServiceHandler implements EventHandler {

    @Autowired
    PersistenceService db;
    @Value("${constants.DEFAULT_URI}")
    String destinationURL;
    @Value("${constants.SERVICE_CONTRACT_CREATE}")
    private String serviceContractCreate;
    @Value("${constants.SERVICE_ORDER_CREATE}")
    private String serviceOrderCreate;
    @Value("${constants.SERVICE_ORDER_SEARCH}")
    private String serviceOrderSearch;

    private final static Logger logger = LoggerFactory.getLogger(QuickLinksServiceHandler.class);

    Map<String, Object> serviceOrderSearchLink =new HashMap<>(); ;
    Map<String, Object> serviceContractCreateLink =new HashMap<>(); ;
    Map<String, Object> serviceOrderCreateLink = new HashMap<>();;

    private String defaultUser;

    List<Map<String, Object>> listToInsert = new ArrayList<>();

    private boolean  noLinkPersist=false;

    /**
     * This method will check if there are links for teh user in db table , if not
     * it will insert 3 default links to DB table and return same to user.
     * 
     * @param context
     * @param links
     * @return
     */
    @After(event = CdsService.EVENT_READ, entity = "QuickLinksService.quickLink")
    public List<QuickLink> afterReadLink(CdsReadEventContext context, List<QuickLink> links) {
         // Getting the user information from context
        String user = context.getUserInfo().getName();
      if (!(links.isEmpty())) {
            List<QuickLink> filteredLinks = links.stream().filter(b -> b.getCreatedBy().equalsIgnoreCase(user))
                    .collect(Collectors.toList());

            return filteredLinks;
        } else if ((links.isEmpty()) && (!noLinkPersist)) {
           String baseDestinationURL="";
            try{
            HttpDestination httpDestination=DestinationHelper.getSubscriberHttpDestination(destinationURL);
            baseDestinationURL = httpDestination.getUri().toString();
            }
            catch(ServiceException e)
            {
               logger.error("Exception occured during fetching destination for quicklinks  ",e);
          
    
            }
            if ((null != baseDestinationURL) && (!baseDestinationURL.isEmpty())) {
               
               //fetch hostname from Destination
              baseDestinationURL= fetchHostname(baseDestinationURL);
              
               // Setting up the default links with static URLs
               setDefaultLinks(context,baseDestinationURL);

               // insert the data to Database Table
               List<QuickLink> linksInserted =insertDefaultLinks(context);
               return linksInserted;      
                
            }

        }
        return links;

    }

    /**
     * This method inserts the data to Database Table and returns the inserted data
     */
    public List<QuickLink> insertDefaultLinks(CdsReadEventContext context)
    {
	 // Getting the user information from context
        String user = context.getUserInfo().getName();
    List<QuickLink> linksInserted=new ArrayList<QuickLink>();
    
   CqnInsert linkInsert = Insert.into(QuickLink_.CDS_NAME).entries(listToInsert);    
    try{
    
    db.run(linkInsert);
     
    }
   catch(ServiceException e)
    {
        logger.error("Exception occured during insert operation : Quick Links ",e);
       
    }
    // If insert operation is successfull then do the select call from table and
    // returns the list to user
     if (linkInsert.isInsert()) {
         try{
        CqnSelect selectLinksQuery = Select.from(QuickLinksService_.QUICK_LINK).where(r -> r.createdBy().eq(user));
        linksInserted = db.run(selectLinksQuery).streamOf(QuickLink.class).collect(Collectors.toList());
         }
         catch(ServiceException e)
        {
        logger.error("Exception occured during Select operation : Quick Links ",e);
       
        }
   
       }
    
   
    return linksInserted; 
    }

   

    /**
     * 
     * @return
     */
    public void setDefaultLinks(CdsReadEventContext context,String baseDestinationURL)
    {
				 // Getting the user information from context
					String user = context.getUserInfo().getName();
               // default link service order search
               
                serviceOrderSearchLink.put(QuickLink.CREATED_BY, user);
                serviceOrderSearchLink.put(QuickLink.QUICK_LINK_NAME, new String("Manage Service Orders"));
                serviceOrderSearchLink.put(QuickLink.QUICK_LINK_URL, baseDestinationURL + serviceOrderSearch);

                // default link service contract create
               
                 serviceContractCreateLink.put(QuickLink.CREATED_BY, user);
                serviceContractCreateLink.put(QuickLink.QUICK_LINK_NAME, new String("Manage Service Contracts"));
                serviceContractCreateLink.put(QuickLink.QUICK_LINK_URL, baseDestinationURL + serviceContractCreate);

                // default link service order create
               
                serviceOrderCreateLink.put(QuickLink.CREATED_BY, user);
                serviceOrderCreateLink.put(QuickLink.QUICK_LINK_NAME, new String("Create Service Order"));
                serviceOrderCreateLink.put(QuickLink.QUICK_LINK_URL, baseDestinationURL + serviceOrderCreate);

                // Adding map to list
                listToInsert.add(serviceOrderSearchLink);
                listToInsert.add(serviceContractCreateLink);
                listToInsert.add(serviceOrderCreateLink);

    }
   
    /**
     * This method fetches the hostName from the Destination
     * @param baseDestinationURL
     * @return
     */
    public String fetchHostname(String baseDestinationURL)
    {
        int hostNameEndPosition = StringUtils.indexOf(baseDestinationURL, '/', 8);
            if (hostNameEndPosition != -1) {
                    baseDestinationURL = baseDestinationURL.substring(0, hostNameEndPosition);          
            }
        return baseDestinationURL;
                
    }

    /**
     * This Method checks if user has deleted all links and sets the flag to true, so that 
     * during Get call no default links get inserted.
     */
    @After(event = CdsService.EVENT_DELETE, entity = "QuickLinksService.quickLink")
    public void afterDeleteLink(CdsDeleteEventContext context) {
        // Getting the user information from context
        String user = context.getUserInfo().getName();
       try{
         CqnSelect query = Select.from(QuickLinksService_.QUICK_LINK).where(r -> r.createdBy().eq(user));
         List<QuickLink> linksFetched = db.run(query).streamOf(QuickLink.class).collect(Collectors.toList());
        
         if(linksFetched.isEmpty())
         {
            noLinkPersist=true;
         }          
        }
        catch(ServiceException e)
    {
        logger.error("Exception occured during select operation post deleting links : Quick links ",e);
       
    }
                  
       
    }

     @On(event = CdsService.EVENT_READ, entity = "QuickLinksService.quickLink")
    public void onReadLink(CdsReadEventContext context) {
     Map<String, String> queryParams=  context.getParameterInfo().getQueryParams();
       Collection<String> s= queryParams.values();
       for(String userId:s)
       {
          userId= userId.substring(userId.indexOf("'"));
          userId= userId.replace("'", "");
          defaultUser=userId;
          
       }     
       
       
    }
 @On(event = CdsService.EVENT_READ, entity = DestinationURL_.CDS_NAME)
    public DestinationURL onReadDestinationURL() {
        DestinationURL base = DestinationURL.create();
        String baseURL="";
        try{
         baseURL = DestinationHelper.getSubscriberHttpDestination(destinationURL).getUri().toString();
          if ((null != baseURL) && (!baseURL.isEmpty())) {
               
               //fetch hostname from Destination
              baseURL= fetchHostname(baseURL);
          }
           base.setDestinationURL(baseURL);
        }
         catch(ServiceException e)
         {
                         
        logger.error("Exception occured during destination Fetch for Destination API  ",e);
         } 
        
        return base;
    }
}

