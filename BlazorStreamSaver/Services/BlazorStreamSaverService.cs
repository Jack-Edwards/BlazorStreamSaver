using System;
using System.IO;
using System.Runtime.InteropServices.JavaScript;
using System.Threading.Tasks;
using Microsoft.JSInterop;

namespace BlazorStreamSaver.Services;

public interface IBlazorStreamSaverService
{
    Task SaveFileAsync();
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
            _moduleReference = await _jsRuntime.InvokeAsync<IJSInProcessObjectReference>("import", "../_content/blazorStreamSaver/blazorStreamSaver.bundle.js");
        }
    }

    public async Task SaveFileAsync(Stream stream)
    {
        var streamReference = new DotNetStreamReference(stream, false);
        await _moduleReference.InvokeVoidAsync("saveFile", streamReference);
    }
}
