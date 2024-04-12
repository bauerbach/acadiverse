using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace AcadiverseLib.Models;

public class AuthToken
{
    private string token;
    private string username;

    public string Token
    {
        get => token; set => token = value;
    }
    public string Username
    {
        get => username; set => username = value;
    }

    public override string ToString() => token + "- Username: " + username;

    public static AuthToken GetTokenFromFile()
    {
        StreamReader sr = null;
        AuthToken result = null;
        try
        {
            File.Decrypt(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + "/Acadiverse/token.dat");
            sr = new StreamReader(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + "/Acadiverse/token.dat");
            var tokenString = sr.ReadToEnd();
            var authToken = tokenString.Split(" ");
            result = new AuthToken { Token = authToken[0], Username = authToken[1] };
        }
        catch
        {
            return null;
        }
        finally
        {
            if (sr is not null)
            {
                sr.Close();
                sr.Dispose();
            }
        }
        return result;
    }
}
