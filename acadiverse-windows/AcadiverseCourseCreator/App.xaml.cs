using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.NetworkInformation;
using System.Reflection;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Interop;
using System.Xml;
using AcadiverseLib.Models;
using Ookii.Dialogs.Wpf;

namespace AcadiverseCourseCreator;

/// <summary>
/// Interaction logic for App.xaml
/// </summary>
public partial class App : Application
{
    public static List<Submission> storeItems = new List<Submission>();
    public static List<Submission> placeableObjects = new List<Submission>();

    public static List<Submission> hats = new List<Submission>();
    public static List<Submission> hairStyles = new List<Submission>();
    public static List<Submission> facialHair = new List<Submission>();
    public static List<Submission> tops = new List<Submission>();
    public static List<Submission> bottoms = new List<Submission>();
    public static List<Submission> footwear = new List<Submission>();

    private void SetupUnhandledExceptionHandling()
    {
        // Catch exceptions from all threads in the AppDomain.
        AppDomain.CurrentDomain.UnhandledException += (sender, args) =>
            ShowUnhandledException((Exception)args.ExceptionObject);

        // Catch exceptions from each AppDomain that uses a task scheduler for async operations.
        TaskScheduler.UnobservedTaskException += (sender, args) =>
            ShowUnhandledException(args.Exception);

        // Catch exceptions from a single specific UI dispatcher thread.
        Dispatcher.UnhandledException += (sender, args) =>
        {
            // If we are debugging, let Visual Studio handle the exception and take us to the code that threw it.
            if (!Debugger.IsAttached)
            {
                args.Handled = true;
                ShowUnhandledException(args.Exception);
            }
        };

        // Catch exceptions from the main UI dispatcher thread.
        // Typically we only need to catch this OR the Dispatcher.UnhandledException.
        // Handling both can result in the exception getting handled twice.
        //Application.Current.DispatcherUnhandledException += (sender, args) =>
        //{
        //	// If we are debugging, let Visual Studio handle the exception and take us to the code that threw it.
        //	if (!Debugger.IsAttached)
        //	{
        //		args.Handled = true;
        //		ShowUnhandledException(args.Exception, "Application.Current.DispatcherUnhandledException", true);
        //	}
        //};
    }

    private static void ShowUnhandledException(Exception e)
    {
        var exceptionDetails = "";
        if (e is not null)
        {
            exceptionDetails = e.ToString() + "- " + e.Message + "\n" + e.StackTrace;
        }
        else
        {
            exceptionDetails = (string)Application.Current.FindResource("msg.crash.unknownError");
        }
        var log = "";
        Globals.WriteToLog(exceptionDetails);
        var viewLog = new TaskDialogButton 
        { 
            Text = (string)Application.Current.FindResource("msg.taskDialog.crash.button.viewLog"), 
            CommandLinkNote = (string)Application.Current.FindResource("msg.taskDialog.crash.button.viewLog.note") 
        };
        var reportBug = new TaskDialogButton 
        { 
            Text = (string)Application.Current.FindResource("msg.taskDialog.crash.button.reportBug"), 
            CommandLinkNote = (string)Application.Current.FindResource("msg.taskDialog.crash.button.reportBug.note") 
        };
        
        var taskDialog = new TaskDialog
        {
            MainInstruction = (string)Application.Current.FindResource("msg.taskDialog.crash.mainInstruction"),
            Content = (string)Application.Current.FindResource("msg.taskDialog.crash.content"),
            WindowTitle = (string)Application.Current.FindResource("msg.taskDialog.crash.windowTitle"),
            ExpandedInformation = exceptionDetails,
            ButtonStyle = TaskDialogButtonStyle.CommandLinks
        };
        taskDialog.Buttons.Add(viewLog);
        taskDialog.Buttons.Add(reportBug);
        taskDialog.ButtonClicked += (sender, args) =>
        {
            if (args.Item.Text == (string)Application.Current.FindResource("msg.taskDialog.crash.button.viewLog"))
            {
                Process.Start("notepad.exe", log);
            }
            else if (args.Item.Text == (string)Application.Current.FindResource("msg.taskDialog.crash.button.reportBug"))
            {
                try
                {
                    Process.Start("AcadiverseCourseCreator_ReportBug.exe", log + " Acadiverse Course Creator crashed.");
                }
                catch
                {
                    if (MessageBox.Show((string)Application.Current.FindResource("msg.crash.bugReporterIssue"), (string)Application.Current.FindResource("msg.error.caption"), MessageBoxButton.YesNo, MessageBoxImage.Question) == MessageBoxResult.Yes)
                    {
                        Process.Start(Settings.Default.Domain + "/contact");
                    }
                }
            }
            Application.Current.Shutdown(-1);
        };
        taskDialog.ShowDialog();
    }

    private void Application_Startup(object sender, StartupEventArgs e)
    {
        SetupUnhandledExceptionHandling();
        var missingAssembly = Globals.CheckDependecies(new string[] {
            @"de\MahApps.Metro.resources.dll",
            "AcadiverseCourseCreator.dll",
            "BCrypt.Net-Next.dll",
            "ControlzEx.dll",
            "LottieSharp.dll",
            "MahApps.Metro.dll",
            "MahApps.Metro.IconPacks.Core.dll",
            "MahApps.Metro.IconPacks.FontAwesome.dll",
            "Microsoft.Xaml.Behaviors.dll",
            "Ookii.Dialogs.Wpf.dll",
            "AcadiverseLib.dll"
        });
        if (missingAssembly is not null && missingAssembly != "")
        {
            MessageBox.Show(
                ((string)Current.FindResource("msg.missingAssemblies")).Replace("$", missingAssembly),
                "Acadiverse Course Creator",
                MessageBoxButton.OK,
                MessageBoxImage.Error
            );
            Current.Shutdown(1);
        }
    }
}