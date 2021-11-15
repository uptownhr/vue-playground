<script setup lang="ts">
import { ref, nextTick } from 'vue'

const isOnline = ref(false)

const deploymentId = '5725e000000HzhD'
const buttonId = '5735e000000I0Tb'

const chatOpen = ref(false)

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

function _injectLiveAgentScript() {
  if (window.liveagent) return;

  injectScript('https://c.la4-c1-ia4.salesforceliveagent.com/content/g/js/53.0/deployment.js', () => {

    console.log('injected', 1)
    if (!window._laq) { window._laq = []; }
    window._laq.push(function(){
      liveagent.showWhenOnline(buttonId, document.getElementById('liveagent_button_online_5735e000000I0Tb'));
      liveagent.showWhenOffline(buttonId, document.getElementById('liveagent_button_offline_5735e000000I0Tb'));
      /*liveagent.showWhenOnline(deploymentId);
      liveagent.showWhenOffline(deploymentId);*/
      console.log('pushed queue cb')
    });

    liveagent.addButtonEventHandler(buttonId, (e) => {
      if(e == liveagent.BUTTON_EVENT.BUTTON_AVAILABLE){
        isOnline.value = true
      }else if(e == liveagent.BUTTON_EVENT.BUTTON_UNAVAILABLE){
        isOnline.value = false
      }

      console.log('e', e)
    });
    console.log('injected', 2)
    /*
    2nd: id of deployment ID
    3rd: id of baseUrl?
     */
    liveagent.init(
        'https://c.la4-c1-ia4.salesforceliveagent.com/chat',
        deploymentId, //this was a shared ID between both billing and tech support
        '00D5e000002EpPD' // what is this?
    );
    console.log('injected', 3, deploymentId)
  })
}

/*function openSFChat(subject) {
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
    }];
  // console.log("values populated");

  let loading = true

  embedded_svc.bootstrapEmbeddedService( () => {
    loading = false
  });
};*/

function openChat(buttonId){
  chatOpen.value = true
  nextTick(() => {
    liveagent.setChatWindowHeight(400)
    liveagent.setChatWindowWidth(400)
    const test = liveagent.startChatWithWindow(buttonId, 'mywindowid');
    console.log('test', test)
  })


}

onMounted(() => {
  console.log('mounted')
  _injectLiveAgentScript()
})

const chatText = ref('')

</script>

<template>
  <div id="liveagent_button_online_5735e000000I0Tb">Available through element id</div>
  <div id="liveagent_button_offline_5735e000000I0Tb">Not available through element id</div>
  <h1>Lets chat</h1>
  <h2>Agent Status - {{isOnline}}</h2>
  <div :class="{ hide: !isOnline }">
    Agent is available
    <br>
    <label for="inquiry">Describe your inquiry</label><br>
    <textarea v-model="chatText" id="inquiry" maxlength="255" required></textarea>
    <br>
    <button title="Open SF Chat" id="open-chat" @click="openChat(buttonId);">Open SF Chat</button>
    <hr>
  </div>
  <div :class="{ hide: isOnline}">Chat is currently unavailable</div>

  <iframe v-if="chatOpen" name="mywindowid" />
</template>

<style>
.hide {
  display: none;
}

.embeddedServiceHelpButton, .prechatUI {opacity: 0; display:none !important}
.embeddedServiceHelpButton .helpButton .uiButton {
  background-color: #120764;
  font-family: "Arial", sans-serif;
}
.embeddedServiceHelpButton .helpButton .uiButton:focus {
  outline: 1px solid #120764;
}

iframe {
  height: 400px;
  width: 400px;
  background-color: white;
}
</style>
