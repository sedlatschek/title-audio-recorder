import { createApp } from 'vue';
import OptionsPage from './OptionsPage.vue';
import '../index.css';
import { Recorder } from './recorder/Recorder';
import { TabCaptureRecordingSession } from './recorder/TabCaptureRecordingSession';

createApp(OptionsPage).mount('body');

new Recorder(TabCaptureRecordingSession);
