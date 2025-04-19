import { createApp } from 'vue';
import { getCurrentTabId } from '../common/tabs';
import { initializePopupComponents } from './popupComponents';

import PopupPage from './PopupPage.vue';
import '../index.css';
import { PopupPageProps } from './PopupPageProps';

async function initialize(): Promise<void> {
  await initializePopupComponents();

  const tabId = await getCurrentTabId();

  const props: PopupPageProps = {
    tabId,
  };
  createApp(PopupPage, props).mount('body');
}

initialize();
