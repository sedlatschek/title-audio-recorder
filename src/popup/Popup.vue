<script lang="ts" setup>
import browser, { Tabs } from "webextension-polyfill";

import { type RecordMessage, MessageType } from "../common/Message";

async function getCurrentTab(): Promise<Tabs.Tab> {
  const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab) {
    throw new Error("Could not retrieve currently active tab");
  }
  return tab;
}

async function getCurrentTitle(): Promise<string> {
  const { title } = await getCurrentTab();
  if (!title) {
    throw new Error("Currently active tab has no title");
  }
  return title;
}

async function start(): Promise<void> {
  const message: RecordMessage = {
    messageType: MessageType.RECORD,
    title: await getCurrentTitle(),
  };
  browser.runtime.sendMessage(message);
}

</script>

<template>
  <div>
    <img src="/icon-with-shadow.svg" style="width: 100px"/>
    <button @click="start">Start</button>
  </div>
</template>
