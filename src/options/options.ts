import { createApp } from 'vue';
import { getErrorPageUrl, getOptionPageTabs } from '../common/tabs';
import { getRecorder } from './components/recorder';
import OptionsPage from './OptionsPage/OptionsPage.vue';
import '../index.css';
import { observeTabs } from './tabObserver';

initialize();

async function initialize(): Promise<void> {
  if ((await getOptionPageTabs()).length > 1) {
    window.location.href = getErrorPageUrl();
  } else {
    createApp(OptionsPage).mount('body');
    observeTabs(getRecorder());
  }
}
