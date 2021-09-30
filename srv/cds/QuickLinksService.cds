using  {sap.acs.servicemanagement as acs}  from '../../db/';
service QuickLinksService {

     entity quickLink as projection on acs.QuickLinks;
     
      entity destinationURL as projection on acs.QuickLinks{
          null as destinationURL : String
     };

}