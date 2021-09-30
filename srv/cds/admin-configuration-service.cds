using {sap.acs.servicemanagement as admin} from '../../db/cds/admin-configuration';

//This service is exposed to store the issue configuration details
//Currently this is only exposing the spot color details
@path: '/sap/opu/odata/sap'
service AdminConfiguration{
    entity IssueConfiguration as projection on admin.IssueConfiguration;
}