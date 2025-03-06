const readFromBlobOrFile = (blob: Blob | File): Promise<Uint8Array> =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (): void => {
      const { result } = fileReader;
      if (result instanceof ArrayBuffer) {
        resolve(new Uint8Array(result));
      } else {
        resolve(new Uint8Array());
      }
    };
    fileReader.onerror = (event): void => {
      reject(Error(`File could not be read! Code=${event?.target?.error?.code || -1}`));
    };
    fileReader.readAsArrayBuffer(blob);
  });

export const fetchFile = async (file?: string | File | Blob): Promise<Uint8Array> => {
  let data: Uint8Array | ArrayBuffer | number[];

  if (typeof file === 'string') {
    if (/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(file)) {
      data = atob(file.split(',')[1])
        .split('')
        .map((c) => c.charCodeAt(0));
    } else {
      data = await (await fetch(file)).arrayBuffer();
    }
  } else if (file instanceof URL) {
    data = await (await fetch(file)).arrayBuffer();
  } else if (file instanceof File || file instanceof Blob) {
    data = await readFromBlobOrFile(file);
  } else {
    return new Uint8Array();
  }

  return new Uint8Array(data);
};
