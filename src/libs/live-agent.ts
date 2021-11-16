export function injectScript (src, cb) {
  const s = document.createElement('script');
  s.setAttribute(
    'src',
    src
  );

  if (cb) s.onload = () => {
    cb()
  }

  document.body.appendChild(s);
  console.log('injected', src);
}


interface initESWConfig {
  baseSalesforceUrl: string;
  liveAgentSetupUrl: string;
  orgId: string;
  name: string;
  liveAgentBaseUrl: string;
  deploymentId: string;
  buttonId: string;
}

export function initESW (config: initESWConfig) {
  delete window.liveAgent;
  delete window.liveAgentDeployment;

  embedded_svc.settings.displayHelpButton = true; //Or false
  embedded_svc.settings.language = ''; //For example, enter 'en' or 'en-US'

  //embedded_svc.settings.defaultMinimizedText = '...'; //(Defaults to Chat with an Expert)
  //embedded_svc.settings.disabledMinimizedText = '...'; //(Defaults to Agent Offline)

  //embedded_svc.settings.loadingText = ''; //(Defaults to Loading)
  //embedded_svc.settings.storageDomain = 'yourdomain.com'; //(Sets the domain for your deployment so that visitors can navigate subdomains during a chat session)

  // Settings for Chat
  //embedded_svc.settings.directToButtonRouting = function(prechatFormData) {
  // Dynamically changes the button ID based on what the visitor enters in the pre-chat form.
  // Returns a valid button ID.
  //};
  //embedded_svc.settings.prepopulatedPrechatFields = {}; //Sets the auto-population of pre-chat form fields
  //embedded_svc.settings.fallbackRouting = []; //An array of button IDs, user IDs, or userId_buttonId
  //embedded_svc.settings.offlineSupportMinimizedText = '...'; //(Defaults to Contact Us)

  embedded_svc.settings.enabledFeatures = ['LiveAgent'];
  embedded_svc.settings.entryFeature = 'LiveAgent';

  embedded_svc.settings.directToButtonRouting = function(prechatFormData) {
    const buttonIdObj = prechatFormData.find(item => item.label === 'ButtonId')

    if (!buttonIdObj) console.log('buttonid not found')


    return buttonIdObj.value
  }

  embedded_svc.init(
    config.baseSalesforceUrl,
    config.liveAgentSetupUrl,
    'https://service.force.com',
    config.orgId,
    config.name,
    {
      baseLiveAgentContentURL: `${config.liveAgentBaseUrl}/content`,
      deploymentId: config.deploymentId,
      buttonId: config.buttonId,
      baseLiveAgentURL: `${config.liveAgentBaseUrl}/chat`,
      eswLiveAgentDevName: 'testChat2x',
      isOfflineSupportEnabled: false
    }
  );
};


export function openSFChat({buttonId, subject}) {
  //overwrite prechat rules
  /*embedded_svc.settings.extraPrechatFormDetails = [{
    "label": "First Name",
    "value": "Missing",
    "transcriptFields": [],
    "displayToAgent": true
  }, {
    "label": "Last Name",
    "value": "Missing",
    "transcriptFields": [],
    "displayToAgent": true
  }, {
    "label": "Email",
    "value": "vsevolodts@gmail.com",
    "transcriptFields": [],
    "displayToAgent": true
  }, {
    "label": "Description",
    "value": subject,
    "transcriptFields": [],
    "displayToAgent": true
  }, {
    "label": "Subject",
    "value": "Chat Case - Seva Tsurikov",
    "transcriptFields": [],
    "displayToAgent": true
  },{
    "label": "Message",
    "value": subject,
    "transcriptFields": ["Message__c"],
    "displayToAgent": true
  },
    {
      "label": "Honey_User_ID__c",
      "value": "6111a7076a53770156411d79",
      "transcriptFields": ["Honey_User_ID__c"],
      "displayToAgent": true
    }, {
      "label": "Honey_Company_ID__c",
      "value": "610455d2328cbb457eba245a",
      "transcriptFields": ["Honey_Company_ID__c",],
      "displayToAgent": true
    }];

  //create custom mapping
  embedded_svc.settings.extraPrechatInfo = [{
    "entityName": "Contact",
    "showOnCreate": true,
    "linkToEntityName": "Case",
    "linkToEntityField": "ContactId",
    "saveToTranscript": "Contact",
    "entityFieldMaps": [{
      "isExactMatch": true,
      "fieldName": "Honey_User_ID__c",
      "doCreate": true,
      "doFind": true,
      "label": "Honey_User_ID__c"
    }, {
      "isExactMatch": true,
      "fieldName": "Honey_Company_ID__c",
      "doCreate": true,
      "doFind": true,
      "label": "Honey_Company_ID__c"
    }, {
      "isExactMatch": false,
      "fieldName": "Email",
      "doCreate": true,
      "doFind": false,
      "label": "Email"
    }, {
      "isExactMatch": false,
      "fieldName": "LastName",
      "doCreate": true,
      "doFind": false,
      "label": "Last Name"
    }, {
      "isExactMatch": false,
      "fieldName": "FirstName",
      "doCreate": true,
      "doFind": false,
      "label": "First Name"
    }]
  },
    { // this is to add new chat to an existing Case
      "entityName": "Case",
      "showOnCreate": true,
      "saveToTranscript": "Case",
      "entityFieldMaps": [{
        "isExactMatch": false,
        "fieldName": "Subject",
        "doCreate": true,
        "doFind": false,
        "label": "Subject"
      }, {
        "isExactMatch": false,
        "fieldName": "Description",
        "doCreate": true,
        "doFind": false,
        "label": "Description"
      }, {
        "isExactMatch": false,
        "fieldName": "Status",
        "doCreate": true,
        "doFind": false,
        "label": "Status"
      }, {
        "isExactMatch": false,
        "fieldName": "Origin",
        "doCreate": true,
        "doFind": false,
        "label": "Origin"
      }]
    }];*/
  // console.log("values populated");

  //embedded_svc.bootstrapEmbeddedService();
  embedded_svc.liveAgentAPI.startChat({
    directToAgentRouting: {
      buttonId,
      fallback: true
    },
    extraPrechatInfo: [],
    extraPrechatFormDetails: [
      {
        "label": "First Name",
        "value": "Missing",
        "transcriptFields": [],
        "displayToAgent": true
      },
      {
        "label": "ButtonId",
        "value": buttonId,
        "transcriptFields": [],
        "displayToAgent": false
      }
    ]
  })
};
