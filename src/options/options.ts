import { createApp } from 'vue';
import { getErrorPageUrl, getOptionPageTabs } from '../common/tabs';
import OptionsPage from './OptionsPage/OptionsPage.vue';
import '../index.css';

initialize();

async function initialize(): Promise<void> {
  if ((await getOptionPageTabs()).length > 1) {
    window.location.href = getErrorPageUrl();
  } else {
    createApp(OptionsPage).mount('body');
  }
}
