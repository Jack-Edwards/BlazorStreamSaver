using System;
using System.Runtime.InteropServices.JavaScript;
using System.Threading.Tasks;

namespace BlazorStreamSaver.Services;

public interface IBlazorStreamSaverService
{
    Task InitializeAsync();
}

public partial class BlazorStreamSaverService : IBlazorStreamSaverService
{
    public BlazorStreamSaverService()
    {
        
    }
    
    public async Task InitializeAsync()
    {
        if (OperatingSystem.IsBrowser())
        {
            await JSHost.ImportAsync("blazorStreamSaver", "../_content/blazorStreamSaver/blazorStreamSaver.bundle.js");
            await PrivateInitializeAsync();
        }
    }

    [JSImport("init", "blazorStreamSaver")]
    private static partial Task PrivateInitializeAsync();
}
