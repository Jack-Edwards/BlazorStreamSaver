import { FileMetaData, initializeServiceWorker, openDownloadStream } from "./download";

class BlazorStreamSaver {
    
    private static _instance: BlazorStreamSaver;
    
    public async init() {
        console.log("initializing service worker from main");
        await initializeServiceWorker().catch((error): void => {
            console.warn('Not supported on this browser', error.message);
            console.error(error);
        }).finally(() => {
            console.log("service worker initialization finished from main");
        });
    }
    
    public static getInstance(): BlazorStreamSaver
    {
        return this._instance || (this._instance = new this());
    }
    
    public async saveFile(stream: ReadableStream<Uint8Array>, metaData: FileMetaData) {
        console.log("opening stream from main");
        const saveStream: WritableStream<Uint8Array> = await openDownloadStream(metaData);
        await new Promise((resolve, reject): void => {
            stream.pipeTo(saveStream, { preventCancel: true })
                .then(resolve)
                .catch(reject);
        });
    }
}

export async function init(): Promise<void> {
    let thisInstance: BlazorStreamSaver = BlazorStreamSaver.getInstance();
    await thisInstance.init();
}

export async function saveFile(stream: ReadableStream<Uint8Array>, metaData: FileMetaData): Promise<void> {
    let thisInstance: BlazorStreamSaver = BlazorStreamSaver.getInstance();
    await thisInstance.saveFile(stream, metaData);
}
