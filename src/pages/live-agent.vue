<script setup lang="ts">
import { ref } from 'vue'


function injectScript (src, cb) {
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

function initESW (gslbBaseURL) {
  embedded_svc.settings.displayHelpButton = true; //Or false
  embedded_svc.settings.language = ''; //For example, enter 'en' or 'en-US'
  embedded_svc.settings.avatarImgURL = "https://bambee--c.documentforce.com/profilephoto/7293i000000kOeC/T";


  embedded_svc.settings.enabledFeatures = ['LiveAgent'];
  embedded_svc.settings.entryFeature = 'LiveAgent';

  embedded_svc.init(
      'https://bambee.my.salesforce.com',
      'https://codepen.secure.force.com/liveAgentSetupFlow',
      gslbBaseURL,
      '00D3i000000sBeJ',
      'Customer_Support_Chat',
      {
        baseLiveAgentContentURL: 'https://c.la4-c2-ia5.salesforceliveagent.com/content',
        deploymentId: '5726e000000sXtR',
        buttonId: '5736e000000sXtg',
        baseLiveAgentURL: 'https://d.la4-c2-ia5.salesforceliveagent.com/chat',
        eswLiveAgentDevName: 'Customer_Support_Chat',
        isOfflineSupportEnabled: false
      }
  );
}

function _injectLiveAgentScript() {
  injectScript('https://c.la4-c2-ia5.salesforceliveagent.com/content/g/js/53.0/deployment.js', () => {
    if (!window._laq) { window._laq = []; }
    window._laq.push(function(){
      // liveagent.showWhenOnline('5736e000000sXtg', document.getElementById('liveagent_button_online_5736e000000sXtg'));
      // liveagent.showWhenOffline('5736e000000sXtg', document.getElementById('liveagent_button_offline_5736e000000sXtg'));
    });
    liveagent.init('https://d.la4-c2-ia5.salesforceliveagent.com/chat', '5726e000000sXtR', '00D3i000000sBeJ');
  })
}

function injectEmbedded() {
  injectScript('https://service.force.com/embeddedservice/5.0/esw.min.js', () => initESW('https://service.force.com'))
}

function openSFChat(subject) {
  //overwrite prechat rules
  embedded_svc.settings.extraPrechatFormDetails = [{
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
  }, {
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
  }];
  //console.log("values populated");
  embedded_svc.bootstrapEmbeddedService();
};

onMounted(() => {
  console.log('mounted')
  _injectLiveAgentScript()
  injectEmbedded()
})

const chatText = ref('')

</script>

<template>
  <h1>Lets chatx</h1>
  <h2>Agent Status</h2>
  <div id="liveagent_button_online_5736e000000sXtg" style="">
    Agent is available
    <br>
    <label for="inquiry">Describe your inquiry</label><br>
    <textarea v-model="chatText" id="inquiry" maxlength="255" required></textarea>
    <br>
    <button title="Open SF Chat" id="open-chat" @click="openSFChat(chatText);">Open SF Chat</button>
    <hr>
  </div>
  <div id="liveagent_button_offline_5736e000000sXtg" style="display: none;">Chat is currently unavailable</div>
</template>

<style>
.embeddedServiceHelpButton, .prechatUI {opacity: 0; display:none !important}
.embeddedServiceHelpButton .helpButton .uiButton {
  background-color: #120764;
  font-family: "Arial", sans-serif;
}
.embeddedServiceHelpButton .helpButton .uiButton:focus {
  outline: 1px solid #120764;
}
</style>
