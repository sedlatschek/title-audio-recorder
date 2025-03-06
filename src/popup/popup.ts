import { createApp } from 'vue';
import { MessageBus } from '../common/MessageBus';
import { getCurrentTabId } from '../common/tabs';
import PopupPage from './PopupPage.vue';
import '../index.css';

const messageBus = new MessageBus('Popup');

async function initialize(): Promise<void> {
  const tabId = await getCurrentTabId();
  createApp(PopupPage, {
    messageBus,
    tabId,
  }).mount('body');
}

initialize();
