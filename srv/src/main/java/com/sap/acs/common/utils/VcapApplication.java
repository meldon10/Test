package com.sap.acs.common.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * @author I524733(Harshit Maheshwari) on 15/09/21
 * @project service-management
 */
@Component
public class VcapApplication {

    //@Value("${vcap.application.application_uris[0]}")
    private String applicationUri;

    //@Value("${vcap.application.cf_api}")
    private String cfApiUrl;

    //@Value("${vcap.application.organization_name}")
    private String cfOrgName;

    //@Value("${vcap.application.organization_id}")
    private String cfOrgId;

    //@Value("${vcap.application.space_name}")
    private String spaceName;

    //@Value("${vcap.application.space_id}")
    private String spaceId;

    public String getApplicationUri() {
        return applicationUri;
    }

    public String getCfApiUrl() {
        return cfApiUrl;
    }

    public String getCfOrgName() {
        return cfOrgName;
    }

    public String getCfOrgId() {
        return cfOrgId;
    }

    public String getSpaceName() {
        return spaceName;
    }

    public String getSpaceId() {
        return spaceId;
    }
}
