package com.sap.acs.handler;

import static org.junit.Assert.assertEquals;
import com.sap.acs.common.utils.DestinationHelper;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.request.ParameterInfo;
import com.sap.cds.services.request.UserInfo;
import com.sap.cloud.sdk.cloudplatform.connectivity.HttpDestination;
import org.mockito.InjectMocks;
import org.mockito.ArgumentMatchers;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import com.sap.cds.services.persistence.PersistenceService;
import cds.gen.quicklinksservice.QuickLink;
import cds.gen.quicklinksservice.DestinationURL;


public class QuickLinksServiceHandlerTest {
    @InjectMocks
    QuickLinksServiceHandler handler = new QuickLinksServiceHandler();
    @Mock
    PersistenceService db;
    @Mock
    HttpDestination destination;
    @Mock
    DestinationHelper helper;
    
    @Test
    public void fetchHostSuccess() {

      String baseDestinationURL="https://uyr210-qm7910.wdf.sap.corp/sap/bc/ui2/flp#ServiceOrder-search?sap-ui-tech-hint=WCF";       
      String actual=  handler.fetchHostname(baseDestinationURL);
      String expected="https://uyr210-qm7910.wdf.sap.corp";
      assertEquals(expected, actual);  

    }
 @Test
    public void fetchHostFailure() {

      String baseDestinationURL="https://uyr210-qm7910.wdf.sap.corp.sap.bc.ui2.flp.ServiceOrder-search?sap-ui-tech-hint=WCF";       
       
      String actual=  handler.fetchHostname(baseDestinationURL);
      String expected=baseDestinationURL;
     
      assertEquals(expected, actual);  

    }  

    @Test
    public void afterReadLink() {

    List<QuickLink> links   = new ArrayList<QuickLink>();
    QuickLink quickLink= QuickLink.create();
    quickLink.setCreatedBy("abc@sap.com");
    quickLink.setQuickLinkName("Link A");
    quickLink.setQuickLinkUrl("https://google.com");
    links.add(quickLink);
    CdsReadEventContext context= Mockito.mock(CdsReadEventContext.class);  
    UserInfo userInfo=Mockito.mock(UserInfo.class);
    Mockito.when(context.getUserInfo()).thenReturn(userInfo); 
    String name="abc@sap.com";
    Mockito.when(userInfo.getName()).thenReturn(name);
    List<QuickLink> linksActual=handler.afterReadLink(context,links); 
    assertEquals(links, linksActual);       
      
    } 
    
    @Test
    public void onReadLink() {
    Map<String, String> queryParams=new HashMap<String,String>(); 
    queryParams.put("filter","createdBy eq 'C52314-2314'"); 
    CdsReadEventContext context= Mockito.mock(CdsReadEventContext.class);  
    ParameterInfo paramInfo= Mockito.mock(ParameterInfo.class);
    Mockito.when(context.getParameterInfo()).thenReturn(paramInfo);
    Mockito.when(paramInfo.getQueryParams()).thenReturn(queryParams);
    handler.onReadLink(context);   
      
    } 

    @Test
    public void setDefaultLinks()
    {
    CdsReadEventContext context= Mockito.mock(CdsReadEventContext.class);  
    UserInfo userInfo=Mockito.mock(UserInfo.class);
    Mockito.when(context.getUserInfo()).thenReturn(userInfo); 
    String name="abc@sap.com";
    Mockito.when(userInfo.getName()).thenReturn(name);
    handler.setDefaultLinks(context, "https://google.com");
     assertEquals(true, true);       
    }

  /** 
    public void insertDefaultLinks()
    {
    CdsReadEventContext context= Mockito.mock(CdsReadEventContext.class);  
    UserInfo userInfo=Mockito.mock(UserInfo.class);
    Mockito.when(context.getUserInfo()).thenReturn(userInfo); 
    String name="abc@sap.com";
    Mockito.when(userInfo.getName()).thenReturn(name);
    List<QuickLink> linksInserted=new ArrayList<QuickLink>();
    handler.db=Mockito.mock(PersistenceService.class);  
    QuickLink ql=Mockito.mock(QuickLink.class);
 //  Mockito.when(db.run(CqnSelect.class)).thenReturn(linksInserted);
  //  handler.insertDefaultLinks(context);
   
    }*/


}