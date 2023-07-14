export interface FileMetaData {
    name: string;
    mimeType: string;
    size: number;
}

export async function initializeServiceWorker() {
    await navigator.serviceWorker.register(
        /* webpackChunkName: "downloadServiceWorker" */
        new URL('./downloadServiceWorker', import.meta.url),
        {
            scope: `/${document.location.origin}`,
        }
    );
    serviceWorkerKeepAlive();
}

export async function openDownloadStream(metaData: FileMetaData) {
    const channel = new MessageChannel();
    const stream = new WritableStream({
        write(block: Uint8Array) {
            channel.port1.postMessage({ action: 'download_chunk', payload: block });
        },
        close() {
            channel.port1.postMessage({ action: 'end' });
        },
        abort(reason) {
            channel.port1.postMessage({ action: 'abort', reason: String(reason) });
        },
    });

    const worker = await wakeUpServiceWorker();
    
    channel.port1.onmessage = ({ data }) => {
        if (data?.action === 'download_started') {
            createDownloadIframe(data.payload);
        } else {
            console.warn("Unknown data received over port1");
        }
    };
    
    worker.postMessage({ action: 'start_download', payload: metaData }, [channel.port2]);
    
    return stream;
}

function serviceWorkerKeepAlive() {
    const interval = setInterval(() => {
        wakeUpServiceWorker().catch(() => clearInterval(interval));
    }, 10000);
}

async function wakeUpServiceWorker() {
    const worker = navigator.serviceWorker.controller;

    if (worker) {
        worker.postMessage({ action: 'ping' });
    } else {
        const workerUrl = `${document.location.origin}/serviceWorker/ping`;
        const response = await fetch(workerUrl);
        const body = await response.text();
        if (!response.ok || body !== 'pong') {
            throw new Error('Download worker is dead');
        }
    }
    return worker as ServiceWorker;
}

function createDownloadIframe(src: string) {
    const iframe = document.createElement('iframe');
    iframe.hidden = true;
    iframe.src = src;
    iframe.name = 'iframe';
    document.body.appendChild(iframe);
    return iframe;
}