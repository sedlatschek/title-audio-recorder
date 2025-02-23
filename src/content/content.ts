import browser from "webextension-polyfill";

import { TitleChangeDetector } from "./TitleChangeDetector";
import { HtmlTitleChangeDetector } from "./HtmlTitleChangeDetector";
import { Message } from "../common/Message";

const titleChangeDetector: TitleChangeDetector = new HtmlTitleChangeDetector();
titleChangeDetector.onTitleChanged((title: string) => {
  console.log("Title changed to " + title);
});

browser.runtime.onMessage.addListener((message: Message) => {
  console.log(`content <<`, message);
});

