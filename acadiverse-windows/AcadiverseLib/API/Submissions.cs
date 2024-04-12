using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using AcadiverseLib.Models;
using Newtonsoft.Json;

namespace AcadiverseLib.API;
public static class Submissions
{
    public static async Task<List<Submission>> ListSubmissions(string category, string filterByType)
    {
        List<Submission> result = new();
        HttpClient client = new()
        {
            BaseAddress = new Uri(Resources.APIUrl),
            Timeout = TimeSpan.FromSeconds(10)
        };
        client.DefaultRequestHeaders.Accept.Clear();
        client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        var response = await client.GetAsync(client.BaseAddress + "/submissions/list?category=" + category + "&filterByType=" + filterByType);
        if (response.IsSuccessStatusCode)
        {
            result = JsonConvert.DeserializeObject<List<Submission>>(await response.Content.ReadAsStringAsync());
        }
        return result;
    }
}
