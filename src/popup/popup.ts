import { createApp } from 'vue';
import { getTosHandler } from '../common/components/tos/tosHandler';
import { createTosLatestVersionAcceptedRef } from '../common/components/tos/tosLatestVersionAcceptedRef';
import { createRecordingsRef } from '../common/recordingsRef';
import { getCurrentTabId } from '../common/tabs';
import { getMessageBus } from './components/messageBus';
import PopupPage from './PopupPage.vue';
import '../index.css';
import { PopupPageProps } from './PopupPageProps';

const messageBus = new MessageBus('Popup');
const tosHandler = getTosHandler();

async function initialize(): Promise<void> {
  const tabId = await getCurrentTabId();
  const tosLatestVersionAccepted = await createTosLatestVersionAcceptedRef(tosHandler);
  const recordings = createRecordingsRef(messageBus, true);

  const props: PopupPageProps = {
    messageBus,
    tosLatestVersionAccepted,
    recordings,
    tabId,
  };
  createApp(PopupPage, props).mount('body');
}

initialize();
