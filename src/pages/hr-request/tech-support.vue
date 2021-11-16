<script setup lang="ts">
import { ref } from 'vue'
import { injectScript, openSFChat, initESW } from "~/libs/live-agent";

const buttonId = '5735e000000I0Ta';
const deploymentId = '5725e000000HzhD';

const chatText = ref("")

injectScript('https://c.la4-c2-ia5.salesforceliveagent.com/content/g/js/53.0/deployment.js', () => {
  if (!window._laq) { window._laq = []; }
  window._laq.push(function(){
    // liveagent.showWhenOnline('5736e000000sXtg', document.getElementById('liveagent_button_online_5736e000000sXtg'));
    // liveagent.showWhenOffline('5736e000000sXtg', document.getElementById('liveagent_button_offline_5736e000000sXtg'));
  });

  /*
  2nd: id of deployment ID
  3rd: id of baseUrl
   */
  liveagent.init('https://d.la4-c2-ia5.salesforceliveagent.com/chat', deploymentId, '00D3i000000sBeJ');
})

injectScript('https://service.force.com/embeddedservice/5.0/esw.min.js', () => initESW({
  buttonId,
  deploymentId,
  baseSalesforceUrl: 'https://mindful-wolf-4reh1u-dev-ed.my.salesforce.com',
  liveAgentSetupUrl: 'https://chattestbambee-developer-edition.na162.force.com/liveAgentSetupFlow',
  orgId: '00D5e000002EpPD',
  name: 'tech_support',
  liveAgentBaseUrl: 'https://c.la4-c1-ia4.salesforceliveagent.com',
}))
</script>

<template>
  <h1 class="text-lg">Tech Support</h1>
  <div>
    <form @submit.prevent="openSFChat({buttonId, subject: chatText})">
      <textarea v-model="chatText" class="border-black border-4 p-4" placeholder="What Billing Issue are you having?"/>
      <br />
      <button class="border-black border-1">Submit</button>
    </form>
  </div>
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
