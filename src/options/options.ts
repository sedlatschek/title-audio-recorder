import { createApp } from 'vue';
import OptionsPage from './OptionsPage.vue';
import '../index.css';
import { Recorder } from './Recorder';
import { TabCaptureRecording } from './TabCaptureRecording';

createApp(OptionsPage).mount('body');

new Recorder(TabCaptureRecording);
