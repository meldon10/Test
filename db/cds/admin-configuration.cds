namespace sap.acs.servicemanagement;

// This entity will be used to store the configuration specific to tool tip and spot color information.
//Currently this is being used to store only Spot color information. Will be extended later to other configurations.
entity IssueConfiguration
{
    key ID : Integer;
    color : String;
    minimumValue : String;
    maximumValue : String;
    //This is a additional custom field to store the admin configuration functionalities to make it generic
    customConfiguration : String;
}
