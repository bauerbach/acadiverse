using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace AcadiverseCourseCreator;

public static class Globals
{

    public static string StripPunctuation(string text)
    {
        return text.Replace(".", "").Replace(",", "").Replace("?", "").Replace("!", "")
            .Replace(":", "").Replace(";", "").Replace("'", "").Replace("\"", "")
            .Replace(@"\", "").Replace("@", "").Replace("#", "").Replace("$", "")
            .Replace("%", "").Replace("^", "").Replace("&", "").Replace("*", "")
            .Replace("(", "").Replace(")", "").Replace("[", "").Replace("]", "")
            .Replace("{", "").Replace("}", "").Replace("/", "").Replace("<", "")
            .Replace(">", "").Replace("|", "").Replace("~", "").Replace("~", "");
    }

    [DllImport("KERNEL32.DLL", EntryPoint = "RtlZeroMemory")]
    private static extern bool ZeroMemory(IntPtr Destination, int Length);

    
    public static byte[] GenerateRandomSalt()
    {
        var data = new byte[32];

        using (var rng = RandomNumberGenerator.Create())
        {
            for (var i = 0; i < 10; i++)
            {
                rng.GetBytes(data);
            }
        }

        return data;
    }

    private static void FileEncrypt(string inputFile, string password)
    {
        var salt = GenerateRandomSalt();

        var fsCrypt = new FileStream(inputFile + ".aes", FileMode.Create);

        var passwordBytes = System.Text.Encoding.UTF8.GetBytes(password);

        var AES = Aes.Create();
        AES.KeySize = 256;
        AES.BlockSize = 128;
        AES.Padding = PaddingMode.PKCS7;

        var key = new Rfc2898DeriveBytes(passwordBytes, salt, 50000);
        AES.Key = key.GetBytes(AES.KeySize / 8);
        AES.IV = key.GetBytes(AES.BlockSize / 8);

        AES.Mode = CipherMode.CFB;

        fsCrypt.Write(salt, 0, salt.Length);

        var cs = new CryptoStream(fsCrypt, AES.CreateEncryptor(), CryptoStreamMode.Write);

        var fsIn = new FileStream(inputFile, FileMode.Open);

        var buffer = new byte[1048576];
        int read;

        try
        {
            while ((read = fsIn.Read(buffer, 0, buffer.Length)) > 0)
            {
                cs.Write(buffer, 0, read);
            }

            fsIn.Close();
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error: " + ex.Message);
        }
        finally
        {
            cs.Close();
            fsCrypt.Close();
        }
    }

    private static void FileDecrypt(string inputFile, string outputFile, string password)
    {
        var passwordBytes = System.Text.Encoding.UTF8.GetBytes(password);
        var salt = new byte[32];

        var fsCrypt = new FileStream(inputFile, FileMode.Open);
        fsCrypt.Read(salt, 0, salt.Length);

        var AES = Aes.Create();
        AES.KeySize = 256;
        AES.BlockSize = 128;
        var key = new Rfc2898DeriveBytes(passwordBytes, salt, 50000);
        AES.Key = key.GetBytes(AES.KeySize / 8);
        AES.IV = key.GetBytes(AES.BlockSize / 8);
        AES.Padding = PaddingMode.PKCS7;
        AES.Mode = CipherMode.CFB;

        var cs = new CryptoStream(fsCrypt, AES.CreateDecryptor(), CryptoStreamMode.Read);

        var fsOut = new FileStream(outputFile, FileMode.Create);

        int read;
        var buffer = new byte[1048576];

        try
        {
            while ((read = cs.Read(buffer, 0, buffer.Length)) > 0)
            {
                fsOut.Write(buffer, 0, read);
            }
        }
        catch (CryptographicException ex_CryptographicException)
        {
            Debug.WriteLine("CryptographicException error: " + ex_CryptographicException.Message);
        }
        catch (Exception ex)
        {
            Debug.WriteLine("Error: " + ex.Message);
        }

        try
        {
            cs.Close();
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error by closing CryptoStream: " + ex.Message);
        }
        finally
        {
            fsOut.Close();
            fsCrypt.Close();
        }
    }

    public static string CheckDependecies(string[] dependecies)
    {
        foreach (var str in dependecies)
        {
            if (!File.Exists(str))
            {
                return str;
            }
        }
        return "";
    }

    public static void ZeroMemoryFileEncrypt(string inputFile, string password)
    {
        var gch = GCHandle.Alloc(password, GCHandleType.Pinned);
        FileEncrypt(inputFile, password);
        ZeroMemory(gch.AddrOfPinnedObject(), password.Length * 2);
        gch.Free();
    }

    public static void ZeroMemoryFileDecrypt(string inputFile, string outputFile, string password)
    {
        var gch = GCHandle.Alloc(password, GCHandleType.Pinned);

        FileDecrypt(inputFile, outputFile, password);

        ZeroMemory(gch.AddrOfPinnedObject(), password.Length * 2);
        gch.Free();
    }

    public static void WriteToLog(string text)
    {
        if (!Directory.Exists("logs"))
        {
            Directory.CreateDirectory("logs");
        }
        if (!File.Exists("logs/log_" + DateTime.Now.Month + "_" + DateTime.Now.Day + "_" + DateTime.Now.Year + ".txt"))
        {
            var objNewFile = new StreamWriter("logs/log_" + DateTime.Now.Month + "_" + DateTime.Now.Day + "_" + DateTime.Now.Year + ".txt");
            objNewFile.Write("");
            objNewFile.Close();
            objNewFile.Dispose();
        }
        var objLog = new StreamWriter("logs/log_" + DateTime.Now.Month + "_" + DateTime.Now.Day + "_" + DateTime.Now.Year + ".txt", true);
        objLog.WriteLine(DateTime.Now.ToLongDateString() + " " + DateTime.Now.ToLongTimeString() + ": " + text);
        objLog.Close();
        objLog.Dispose();
    }

    public static List<int> Find(string text, string word, bool matchCase, bool wholeWordsOnly)
    {
        var usedText = text.ToLower();
        if (matchCase)
        {
            usedText = text;
        }
        var positions = new List<int>();
        for (var i = 0; i < usedText.Length - word.Length - 1; i += word.Length)
        {
            if (usedText.Substring(i, i + word.Length - 1) == word)
            {
                if (wholeWordsOnly)
                {
                    if (i - 1 > 0 && i < usedText.Length)
                    {

                    }
                    if (usedText.Substring(i - 1, i + word.Length).StartsWith(" ") && usedText.Substring(i - 1, i + word.Length).EndsWith(" "))
                    {
                        positions.Add(i);
                    }
                    else
                    {
                        continue;
                    }
                }
                positions.Add(i);
            }
        }
        return positions;
    }

    public static string Replace(string text, string word, string replacement, int pos)
    {
        return string.Concat(text.AsSpan(0, pos), replacement, word.AsSpan(pos + word.Length, word.Length));
    }
}
