import { createApp } from 'vue';
import { getErrorPageUrl, getOptionPageTabs } from '../common/tabs';
import { initializeOptionsComponents } from './components/optionsComponents';
import OptionsPage from './OptionsPage/OptionsPage.vue';
import '../index.css';

initialize();

async function initialize(): Promise<void> {
  if ((await getOptionPageTabs()).length > 1) {
    window.location.href = getErrorPageUrl();
  } else {
    await initializeOptionsComponents();
    createApp(OptionsPage).mount('body');
  }
}
