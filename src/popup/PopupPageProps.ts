import { Ref } from 'vue';
import { MessageBus } from '../common/MessageBus';
import { RecordingMetadata } from '../common/RecordingMetadata';

export type PopupPageProps = {
  messageBus: MessageBus;
  tosLatestVersionAccepted: Ref<boolean>;
  recordings: Ref<RecordingMetadata[]>;
  tabId: number;
};
