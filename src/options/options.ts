import Options from "./Options.vue";
import { createApp } from "vue";
import '../index.css';
import { TabCaptureRecorder } from "./TabCaptureRecorder";

createApp(Options).mount("body");

new TabCaptureRecorder();
