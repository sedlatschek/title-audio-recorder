import { ref, Ref } from 'vue';
import { TosHandler } from '../tos/TosHandler';

export type TosAcceptedRef = Ref<boolean>;

export async function createTosAcceptedRef(tosHandler: TosHandler): Promise<TosAcceptedRef> {
  const latestTosVersion = tosHandler.getLatestTosVersion();
  const latestTosVersionAccepted = ref(await tosHandler.isAccepted(latestTosVersion));

  tosHandler.onTosAccepted(async (tosVersion) => {
    if (tosVersion.name === latestTosVersion.name) {
      latestTosVersionAccepted.value = true;
    }
  });

  return latestTosVersionAccepted;
}
