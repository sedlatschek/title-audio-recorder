import { UUID } from "./types";

export interface RecordingMetadata {
  readonly id: UUID;
  readonly title: string;
  startedAtTs?: number;
  stoppedAtTs?: number;
}
