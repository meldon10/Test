using sap.acs.servicemanagement as acs from '../../db/';


// Service for fetching Customer data
service CustomerServiceOrder {
    @readonly
    entity ServiceOrder    as
        select from acs.ServiceOrder {
            *
        };
    //@readonly entity BusinessPartner as select from acs.BusinessPartner{*};

    @readonly
    entity BusinessPartner as
        select
            bp.BUSINESSPARTNER     as BUSINESSPARTNER,
            bp.businesspartnertype as businesspartnertype,
            bp.fullname            as fullname,
            bp.geocode             as geocode,
            bp.region              as region,
            bp.city                as city,
            bp.postalcode          as postalCode,
            bp.country             as country,
            bp.industry            as industry,
            bp.emailaddress        as emailaddress,
            bp.phonenumber         as phonenumber,
            bp.service_orders      as service_orders
        from acs.BusinessPartner as bp

        actions {
            action getGeolocation(cust : BusinessPartner);
        };
    
    @readOnly entity Country as select from acs.Country;
}
