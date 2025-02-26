<script lang="ts" setup>
import browser from 'webextension-polyfill';

import {
 type RecordMessage, MessageType,
} from '../common/Message';

async function getCurrentTabId(): Promise<number> {
  const [tab] = await browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (!tab?.id) {
    throw new Error('Could not retrieve currently active tab');
  }
  return tab.id;
}

async function start(): Promise<void> {
  const message: RecordMessage = {
    messageType: MessageType.RECORD,
    tabId: await getCurrentTabId(),
  };
  console.debug('>> [PopupPage]', message);
  browser.runtime.sendMessage(message);
}

</script>

<template>
  <div>
    <button @click="start">
      Start
    </button>
  </div>
</template>
