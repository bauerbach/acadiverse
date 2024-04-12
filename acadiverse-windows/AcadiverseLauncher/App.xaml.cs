using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;

namespace AcadiverseLauncher
{ 
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        string missingAssembly = "";

        bool CheckDependecies(string[] dependecies)
        {
            foreach (var str in dependecies)
            {
                if (!File.Exists(str))
                {
                    missingAssembly = str;
                    return false;
                }
            }
            return true;
        }

        private void Application_Startup(object sender, StartupEventArgs e)
        {
            if (CheckDependecies(new string[] {
                @"de\MahApps.Metro.resources.dll",
                "AcadiverseLauncher.dll",
                "BCrypt.Net-Next.dll",
                "ControlzEx.dll",
                "LottieSharp.dll",
                "MahApps.Metro.dll",
                "MahApps.Metro.IconPacks.Core.dll",
                "MahApps.Metro.IconPacks.FontAwesome.dll",
                "Microsoft.Xaml.Behaviors.dll",
                "Ookii.Dialogs.Wpf.dll",
                "AcadiverseLib.dll"
            }))
            {
                MessageBox.Show(
                    "Acadiverse Course Creator could not start because the following DLL was missing: " + missingAssembly + ". Please reinstall the application from the Acadiverse Launcher.",
                    "Acadiverse Course Creator",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error
                );
                Application.Current.Shutdown(1);
            }
        }
    }
}
