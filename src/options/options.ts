import { createApp } from 'vue';
import OptionsPage from './OptionsPage.vue';
import '../index.css';
import { Recorder } from './Recorder';
import { TabCaptureRecordingSession } from './TabCaptureRecordingSession';

createApp(OptionsPage).mount('body');

new Recorder(TabCaptureRecordingSession);
