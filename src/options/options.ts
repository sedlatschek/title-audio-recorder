import { createApp } from 'vue';
import OptionsPage from './OptionsPage.vue';
import '../index.css';
import { Recorder } from './Recorder';
import { TabCaptureRecordingStream } from './TabCaptureRecordingStream';

createApp(OptionsPage).mount('body');

new Recorder(TabCaptureRecordingStream);
