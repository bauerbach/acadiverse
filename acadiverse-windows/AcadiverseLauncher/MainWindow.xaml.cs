using AcadiverseLib.Models;
using MahApps.Metro.Controls;
using MahApps.Metro.Controls.Dialogs;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
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
using System.Windows.Navigation;
using System.Windows.Shapes;
using Path = System.IO.Path;

namespace AcadiverseLauncher;

/// <summary>
/// Interaction logic for MainWindow.xaml
/// </summary>
public partial class MainWindow : MetroWindow
{

    private readonly string username = "";
    private readonly string password = "";
    System.Windows.Forms.NotifyIcon nicTrayIcon = null;

    public MainWindow()
    {
        InitializeComponent();

        System.Windows.Forms.ToolStripMenuItem mnuOpenAcadiverseLauncher = new System.Windows.Forms.ToolStripMenuItem
        {
            Text = "&Open Acadiverse Launcher"
        };
        mnuOpenAcadiverseLauncher.Click += (sender, args) =>
        {
            Show();
        };

        System.Windows.Forms.ToolStripSeparator sep1 = new System.Windows.Forms.ToolStripSeparator();

        System.Windows.Forms.ToolStripMenuItem mnuCheckForUpdates = new System.Windows.Forms.ToolStripMenuItem
        {
            Text = "&Open Acadiverse Launcher"
        };
        mnuCheckForUpdates.Click += (sender, args) =>
        {
            CheckForUpdates("Acadiverse Launcher");
        };

        System.Windows.Forms.ContextMenuStrip cmuTrayIcon = new System.Windows.Forms.ContextMenuStrip();
        nicTrayIcon = new System.Windows.Forms.NotifyIcon
        {


        };
    }

    /// <summary>
    /// Attempts to install the Acadiverse game.
    /// </summary>
    /// <param name="updating">Whether or not this is an update vs. an initial installation.</param>
    private async void InstallAcadiverse(bool updating)
    {

        var filename = "C:/Users/" + System.Security.Principal.WindowsIdentity.GetCurrent().Name[(Environment.MachineName.Length + 1)..] + "/AppData/Roaming/Acadiverse/AcadiverseLauncher/Temp/Acadiverse.zip";
        try
        {
            var httpClient = new HttpClient();

            //TODO: Add actual download path to GetAsync method.
            var httpResult = await httpClient.GetAsync("");
            using var resultStream = await httpResult.Content.ReadAsStreamAsync();
            using var fileStream = File.Create(filename);
            resultStream.CopyTo(fileStream);

            //TODO: Add different messages for updating vs. installing.
            if (updating)
            {

            }
            else
            {

            }
        }
        catch (Exception ex)
        {

            if (File.Exists(filename))
            {
                File.Delete(filename);
            }
            await this.ShowMessageAsync("Installation Error", "An error occurred while installing Acadiverse: " + ex.Message + " Please try to install again later. If the problem persists, please contact Acadiverse Support.");
        }
    }

    /// <summary>
    /// Attempts to download the changelog for the specified Acadiverse program to the user's Temp folder.
    /// </summary>
    /// <param name="programName">The name of the program to download the changelog for.</param>
    /// <returns>A FileInfo object for the changelog.</returns>
    private async Task<FileInfo>? DownloadChangelog(string programName)
    {
        var httpClient = new HttpClient();

        //TODO: Add actual download path to GetAsync method.
        var httpResult = await httpClient.GetAsync("https://www.acadiverse.com/changelogs/" + programName + "_changelog.txt");
        using var resultStream = await httpResult.Content.ReadAsStreamAsync();

        using var fileStream = File.Create(Path.GetTempPath() + "/Acadiverse/" + programName + "_changelog.txt");
        resultStream.CopyTo(fileStream);
        fileStream.Flush();
        fileStream.Dispose();

        return new FileInfo(Path.GetTempPath() + "/Acadiverse/" + programName + "_changelog.txt");
    }

    /// <summary>
    /// Checks for updates for the specified Acadiverse program and notifies the user if they are available.
    /// </summary>
    /// <param name="programName">The name of the program to check for updates for; this is used to download the changelog.</param>
    private void CheckForUpdates(string programName)
    {
        Task<FileInfo>? fileInfo = DownloadChangelog(programName);
        if (fileInfo is not null)
        {
            
        }
    }

    private async void StartAcadiverseButton_Click(object sender, RoutedEventArgs e)
    {
        try
        {
            if (!Directory.Exists("/Acadiverse"))
            {
                InstallAcadiverse(false);
            }
            else
            {
                CheckForUpdates("Acadiverse");
                Process.Start("/Acadiverse/Acadiverse.exe", "-username " + username + "-password " + password);
            }
        }
        catch (System.ComponentModel.Win32Exception ex)
        {
            await this.ShowMessageAsync("Error", "Acadiverse could not start due to the following error: " + ex.Message);
        }
    }

    private async void StartAcadiverseCourseCreatorButton_Click(object sender, RoutedEventArgs e)
    {
        try
        {
            Process.Start("/Acadiverse Course Creator/AcadiverseCourseCreator.exe", "-username " + username + "-password " + password);
        }
        catch (System.ComponentModel.Win32Exception ex)
        {
            await this.ShowMessageAsync("Error", "Acadiverse Course Creator could not start due to the following error: " + ex.Message);
        }
    }

    private async void MainWindow_Loaded(object sender, EventArgs e)
    {
        try
        {
            AuthToken authToken = AuthToken.GetTokenFromFile();
            if (authToken is not null)
            {
                HttpClient client = new()
                {
                    BaseAddress = new Uri("http://localhost:4000/api")
                };
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
                var response = await client.GetAsync(client.BaseAddress + "/blog/posts/list");
                if (response.IsSuccessStatusCode)
                {
                    var json = JsonConvert.DeserializeObject<BlogPost[]>(await response.Content.ReadAsStringAsync());
                    if (json is not null)
                    {
                        foreach (var post in json)
                        {
                            StackPanel stackPanel = new()
                            {
                                Orientation = Orientation.Vertical
                            };
                            stackPanel.Children.Add(new Label
                            {
                                Content = post.Name,
                                FontSize = 18
                            });
                            stackPanel.Children.Add(new Label
                            {
                                Content = post.Date_Created.ToShortDateString()
                            });
                            stackPanel.Children.Add(new TextBlock
                            {
                                Text = post.Post_Contents.Remove(200) + "..."
                            });
                            lstBlogPosts.Items.Add(new ListBoxItem
                            {
                                Content = stackPanel
                            });
                        }
                    }
                    else
                    {
                        MessageBox.Show(
                            "Error fetching blog posts.",
                            "Acadiverse Launcher",
                            MessageBoxButton.OK,
                            MessageBoxImage.Error
                        );
                    }
                }
            }
            else
            {
                Hide();
                new LoginWindow().ShowDialog();
            }

        }
        catch (HttpRequestException)
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