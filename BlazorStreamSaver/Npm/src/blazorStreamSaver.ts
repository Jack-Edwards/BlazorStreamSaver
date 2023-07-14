import FileMetaData from "./models/FileMetaData";
import { initializeServiceWorker, openDownloadStream } from "./download";

class BlazorStreamSaver {
    constructor() {
        initializeServiceWorker().catch((error) => {
            console.warn('Not supported on this browser', error.message);
        });
    }
    
    async saveFile(stream: ReadableStream<Uint8Array>, metaData: FileMetaData) {
        const saveStream = await openDownloadStream(metaData);
        await new Promise((resolve, reject) => {
            stream.pipeTo(saveStream, { preventCancel: true })
                .then(resolve)
                .catch(reject);
        });
    }
}

export default new BlazorStreamSaver();