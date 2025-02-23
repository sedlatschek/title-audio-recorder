import OptionsPage from "./OptionsPage.vue";
import { createApp } from "vue";
import '../index.css';
import { TabCaptureRecorder } from "./TabCaptureRecorder";

createApp(OptionsPage).mount("body");

new TabCaptureRecorder();
