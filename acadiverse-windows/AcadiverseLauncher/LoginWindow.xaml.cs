using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using AcadiverseLib.API;
using AcadiverseLib.Models;

namespace AcadiverseLauncher;
/// <summary>
/// Interaction logic for LoginWindow.xaml
/// </summary>
public partial class LoginWindow : Window
{
    public LoginWindow()
    {
        InitializeComponent();
    }

    private void btnLogin_Click(object sender, RoutedEventArgs e)
    {
        try
        {
            Task<AuthToken> signin = Auth.Signin(txtUsername.Text, txtPassword.Password);
            AuthToken authToken = signin.Result;
            Debug.WriteLine(authToken);
            if (authToken is not null)
            {
                var tokenData = authToken.Token + " " + authToken.Username;
                if (Directory.Exists(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + "/Acadiverse") == false)
                {
                    Directory.CreateDirectory(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + "/Acadiverse");
                }
                try
                {
                    byte[] salt = new byte[8];
                    Random random = new Random();
                    random.NextBytes(salt);

                    Rfc2898DeriveBytes token = new Rfc2898DeriveBytes(tokenData.ToString(), salt, 1000);
                    var encryptedToken = token.GetBytes(32);

                    
                    using (File.OpenWrite(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + "/Acadiverse/token.dat"))
                    {
                        File.WriteAllBytes(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + "/Acadiverse/token.dat", encryptedToken);
                    }
                }
                catch
                {
                    //TODO: Create a better encryption system for auth tokens.
                }
            }
            System.Windows.Forms.Application.Restart();
        }
        catch
        {
            MessageBox.Show(
                "Unable to connect to Acadiverse. Please check your internet connection and try again. If the problem persists, the Acadiverse servers may be down.",
                "Acadiverse Launcher",
                MessageBoxButton.OK,
                MessageBoxImage.Error
            );
            Application.Current.Shutdown();
        }
    }
}
