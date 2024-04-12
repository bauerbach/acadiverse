using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using AcadiverseLib.Models;

namespace AcadiverseLib.API;
public static class Accounts
{
    public static async Task<Account> AccountInfoFromId(string id)
    {
        Models.Account result = null;
        HttpClient client = new()
        {
            BaseAddress = new Uri(Resources.APIUrl)
        };
        client.DefaultRequestHeaders.Accept.Clear();
        client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        var response = await client.GetAsync(client.BaseAddress + "/account/infoFromId?id=" + id);
        if (response.IsSuccessStatusCode)
        {
            result = JsonConvert.DeserializeObject<Account>(await response.Content.ReadAsStringAsync());
        }
        else
        {

        }
        return result;
    }

    public static async Task<Models.Account> AccountInfo(string username)
    {
        Models.Account result = null;
        HttpClient client = new()
        {
            BaseAddress = new Uri(Resources.APIUrl),
            Timeout = TimeSpan.FromSeconds(10)
        };
        client.DefaultRequestHeaders.Accept.Clear();
        client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        var response = await client.GetAsync(client.BaseAddress + "/account/info?username=" + username);
        if (response.IsSuccessStatusCode)
        {
            result = JsonConvert.DeserializeObject<Models.Account>(await response.Content.ReadAsStringAsync());
        }
        return result;
    }
}
