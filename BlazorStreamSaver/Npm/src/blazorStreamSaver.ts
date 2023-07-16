import { FileMetaData, initializeServiceWorker, openDownloadStream } from "./download";

class BlazorStreamSaver {
    constructor() {
        initializeServiceWorker().catch((error): void => {
            console.warn('Not supported on this browser', error.message);
        });
    }
    
    async saveFile(stream: ReadableStream<Uint8Array>, metaData: FileMetaData) {
        const saveStream: WritableStream<Uint8Array> = await openDownloadStream(metaData);
        await new Promise((resolve, reject): void => {
            stream.pipeTo(saveStream, { preventCancel: true })
                .then(resolve)
                .catch(reject);
        });
    }
}

let instance: BlazorStreamSaver;

function getInstance(): BlazorStreamSaver {
    if (!instance) {
        instance = new BlazorStreamSaver();
    }
    
    return instance;
}

export async function saveFile(stream: ReadableStream<Uint8Array>, metaData: FileMetaData): Promise<void> {
    let thisInstance: BlazorStreamSaver = getInstance();
    await thisInstance.saveFile(stream, metaData);
}
