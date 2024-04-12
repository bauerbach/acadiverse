using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using AcadiverseLib.Models;
using Newtonsoft.Json;

namespace AcadiverseLib.API;
public static class Auth
{
    public static async Task<AuthToken> Signin(string username, string password)
    {
        AuthToken result = null;
        try
        {
            HttpClient client = new()
            {
                BaseAddress = new Uri(Resources.APIUrl),
                Timeout = TimeSpan.FromSeconds(10)
            };

            HttpContent httpContent = new FormUrlEncodedContent(new Dictionary<string, string> { { "username", username }, { "password", password } });
            var uri = client.BaseAddress + "/auth/signin";
            var response = await client.PostAsync(uri, httpContent).ConfigureAwait(false);
            if (response.IsSuccessStatusCode)
            {
                result = JsonConvert.DeserializeObject<AuthToken>(await response.Content.ReadAsStringAsync());
            }

        }
        catch
        {
            throw;
        }
        return result;
    }
}
