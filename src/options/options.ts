import { createApp } from 'vue';
import { getErrorPageUrl, getOptionPageTabs } from '../common/tabs';
import { getComponents, initializeComponents } from './components';
import OptionsPage from './views/OptionsPage.vue';
import '../index.css';

initialize();

async function initialize(): Promise<void> {
  if ((await getOptionPageTabs()).length > 1) {
    window.location.href = getErrorPageUrl();
  } else {
    await initializeComponents();

    createApp(OptionsPage).mount('body');

    const { appearanceModeChangeDetector } = getComponents();
    return appearanceModeChangeDetector.fire();
  }
}
