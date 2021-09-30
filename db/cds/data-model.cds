namespace sap.acs.servicemanagement;

entity ServiceOrder {
    key SERVICEORDER      : String;
        serviceordertype  : String;
        salesorganization : String;
        soldtoparty       : String;
}

entity BusinessPartner {
    key BUSINESSPARTNER     : String;
        fullname            : String;
        businesspartnertype : String;
        service_orders      : Association to many ServiceOrder
                                  on service_orders.soldtoparty = BUSINESSPARTNER;
        country             : String;
        region              : String;
        city                : String;
        postalcode          : String;
        phonenumber         : String;
        emailaddress        : String;
        industry            : String;
        virtual latitude    : String;
        virtual longitude   : String;
        virtual geocode     : String;
}

entity Country {
    code    : String;
    country : String;
}

entity Address {
    key ID         : Integer;
        region     : String;
        postalCode : String;
        city       : String;
        country    : String;
}

entity Todo {
    key TASK_ID          : UUID;
        task_name        : String(25) not null;
        task_description : String(250) not null;
        priority         : String(50);
        status           : String(50) not null;
        due_by           : Timestamp not null;
       createdBy             : String(255)@cds.on.insert : $user;
        createdAt        : Timestamp  @cds.on.insert : $now;
        modifiedAt       : Timestamp  @cds.on.insert : $now  @cds.on.update : $now;


}

entity QuickLinks {
    key QUICKLINK_ID          : UUID;
        quickLink_name        : String(25) not null;
        quickLink_URL         : String(250) not null;
        createdBy             : String(255)@cds.on.insert : $user;
        createdAt             : Timestamp  @cds.on.insert : $now;
        modifiedAt            : Timestamp  @cds.on.insert : $now  @cds.on.update : $now;


}
