import com.sap.icd.jenkins.Utils
import com.sap.piper.internal.Deprecate
import com.sap.piper.internal.ConfigurationHelper
import com.sap.piper.internal.Notify

import groovy.text.SimpleTemplateEngine
import groovy.transform.Field

import static com.sap.piper.internal.Prerequisites.checkScript

void call(Map params) {
    echo "Start - Extension for stage: ${params.stageName}"

    
    echo "Executing original stage ${params.stageName}"
    
    downloadArtifactsFromNexus script: this, artifactType: 'mta', buildTool: 'mta', fromStaging: true
    cloudFoundryDeploy script: this, useGoStep: true, cfCredentialsId: 'hyperspace-scpcf-p200414277', deployTool: 'mtaDeployPlugin', deployType: 'blue-green', mtaDeployParameters: '--strategy blue-green -f --version-rule ALL --abort-on-error', cfApiEndpoint: 'https://api.cf.sap.hana.ondemand.com', cfOrg: 'acs', cfSpace: 'integration'

	stage("Automation Tests"){

	git branch: 'master', credentialsId: 'hyperspace-github-tools-sap-i035634', url: 'https://github.tools.sap/AssetCentricService/acs-ui-automation.git'

	sh "cd ACSAutomation"
       sh "ls -ltra"
       sh "mvn -f ACSAutomation/ clean install"
	
	
	}
	
      		
    echo "Original stage ${params.stageName} executed successfully"
    
    echo "End - Extension for stage: ${params.stageName}"
	
    	
}
return this
