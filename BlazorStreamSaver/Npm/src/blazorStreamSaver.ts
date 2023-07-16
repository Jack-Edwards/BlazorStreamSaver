import { FileMetaData, initializeServiceWorker, openDownloadStream } from "./download";

class BlazorStreamSaver {
    
    private static _instance: BlazorStreamSaver;
    
    constructor() {
        console.log("initializing service worker from main");
        initializeServiceWorker().catch((error): void => {
            console.warn('Not supported on this browser', error.message);
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

export async function saveFile(stream: ReadableStream<Uint8Array>, metaData: FileMetaData): Promise<void> {
    let thisInstance: BlazorStreamSaver = BlazorStreamSaver.getInstance();
    await delay(5000);
    await thisInstance.saveFile(stream, metaData);
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
