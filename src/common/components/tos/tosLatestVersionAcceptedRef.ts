import { ref, Ref } from 'vue';
import { TosHandler } from '../../../options/tos/TosHandler';

export async function createTosLatestVersionAcceptedRef(
  tosHandler: TosHandler,
): Promise<Ref<boolean>> {
  const latestTosVersion = tosHandler.getLatestTosVersion();
  const latestTosVersionAccepted = ref(await tosHandler.isAccepted(latestTosVersion));

  tosHandler.onTosAccepted(async (tosVersion) => {
    if (tosVersion.name === latestTosVersion.name) {
      latestTosVersionAccepted.value = true;
    }
  });

  return latestTosVersionAccepted;
}
