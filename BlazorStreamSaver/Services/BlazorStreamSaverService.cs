using System;
using System.IO;
using System.Runtime.InteropServices.JavaScript;
using System.Threading.Tasks;
using Microsoft.JSInterop;

namespace BlazorStreamSaver.Services;

public interface IBlazorStreamSaverService
{
    Task InitializeAsync();
    Task SaveFileAsync(Stream stream);
}

public partial class BlazorStreamSaverService : IBlazorStreamSaverService
{
    private readonly IJSRuntime _jsRuntime;
    private IJSInProcessObjectReference _moduleReference;
    
    public BlazorStreamSaverService(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }
    
    public async Task InitializeAsync()
    {
        if (OperatingSystem.IsBrowser())
        {
            await JSHost.ImportAsync("blazorStreamSaver", "../_content/BlazorStreamSaver/blazorStreamSaver.bundle.js");
            //await PrivateInitializeServiceWorkerAsync();
            await PrivateInitializeAsync();
            _moduleReference = await _jsRuntime.InvokeAsync<IJSInProcessObjectReference>("import", "../_content/BlazorStreamSaver/blazorStreamSaver.bundle.js");
        }
    }

    public async Task SaveFileAsync(Stream stream)
    {
        DotNetStreamReference streamReference = new DotNetStreamReference(stream, false);
        await _moduleReference.InvokeVoidAsync("saveFile", streamReference);
        //await PrivateSaveFileAsync(streamReference);
    }

    [JSImport("init", "blazorStreamSaver")]
    private static partial Task PrivateInitializeAsync();

    [JSImport("initializeServiceWorker", "blazorStreamSaver")]
    private static partial Task PrivateInitializeServiceWorkerAsync();

    //[JSImport("saveFile", "blazorStreamSaver")]
    //private static partial Task PrivateSaveFileAsync(DotNetStreamReference stream);
}
