using BlazorStreamSaver.Services;
using Microsoft.AspNetCore.Components;

namespace BlazorStreamSaver.Demo.Pages;

public partial class Index : ComponentBase
{
    [Inject]
    protected IBlazorStreamSaverService _blazorStreamSaver { get; set; }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await _blazorStreamSaver.InitializeAsync();
            await Task.Delay(5000);

            byte[] buffer = "test"u8.ToArray();
            MemoryStream memoryStream = new MemoryStream();
            memoryStream.Write(buffer);
            memoryStream.Position = 0;

            await _blazorStreamSaver.SaveFileAsync(memoryStream);
        }
    }
}