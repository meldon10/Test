using  {sap.acs.servicemanagement as acs}  from '../../db/';
service TodoService {

     entity task as projection on acs.Todo;

     
   

}