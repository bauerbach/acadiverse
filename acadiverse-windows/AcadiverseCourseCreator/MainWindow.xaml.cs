using AcadiverseCourseCreator.CourseContent;
using AcadiverseCourseCreator.CourseContent.Scenarios;
using AcadiverseCourseCreator.Dialogs;
using AcadiverseCourseCreator.Panels;
using AcadiverseLib.Models;
using MahApps.Metro.Controls;
using MahApps.Metro.Controls.Dialogs;
using MahApps.Metro.IconPacks;
using Ookii.Dialogs.Wpf;
using System;
using System.CodeDom;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Forms;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Xml;
using Application = System.Windows.Application;
using MessageBox = System.Windows.MessageBox;
using Path = System.IO.Path;
using TaskDialog = Ookii.Dialogs.Wpf.TaskDialog;
using TaskDialogButton = Ookii.Dialogs.Wpf.TaskDialogButton;
using TaskDialogIcon = Ookii.Dialogs.Wpf.TaskDialogIcon;
using UserControl = System.Windows.Controls.UserControl;

namespace AcadiverseCourseCreator;

/// <summary>
/// Interaction logic for MainWindow.xaml
/// </summary>
public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
        undoBuffer.programObjects = new List<object>();
        tmrAutoSave.Tick += (sender, args) =>
        {
            SaveProject();
        };
        Settings.Default.PropertyChanged += (sender, args) =>
        {
            tmrAutoSave.Interval = Settings.Default.AutoSaveInterval * 60 * 1000;
            if (Settings.Default.AutoSave)
            {
                tmrAutoSave.Start();
            }
            else
            {
                tmrAutoSave.Stop();
            }
        };
    }

    private readonly StartPage startPage = new();
    private readonly ProjectPropertiesPanel projectPropertiesPanel = new();
    private Project? currentProject = null;
    private bool projectModified = false;
    private string savePath = "";
    private double normalWidth = 0;
    private UndoBuffer undoBuffer = new(new List<object>(), Settings.Default.MaxUndos);
    private string selectedItemType = "";
    private int chapterIndex = -1;
    private int itemIndex = -1;
    private List<Submission> avatarItems = new List<Submission>();
    private List<Submission> placeableObjects = new List<Submission>();
    
    private readonly Timer tmrAutoSave = new()
    {
        Interval = Settings.Default.AutoSaveInterval * 60 * 1000
    };

    #region Functions

    private void AddTab(string header, UserControl content)
    {
        content.Resources = Application.Current.Resources;
        var tabItem = new TabItem
        {
            Content = content,
            Tag = tabMain.Items.Count
        };
        var tabHeader = new StackPanel { Orientation = System.Windows.Controls.Orientation.Horizontal };
        tabHeader.Children.Add(new System.Windows.Controls.Label { Content = header });
        var closeButton = new System.Windows.Controls.Button { Content = "X" };
        closeButton.Click += (sender, args) =>
        {
            tabMain.Items.RemoveAt((int)(tabItem.Tag));
            for (var i = 0; i < tabMain.Items.Count; i++) 
            {
                ((TabItem)tabMain.Items[i]).Tag = i;
            }
        };
        tabHeader.Children.Add(closeButton);
        tabItem.Header = tabHeader;
        tabMain.Items.Add(tabItem);
    }

    private void CloseCurrentTab(object sender, RoutedEventArgs e)
    {
        Debug.WriteLine(e.OriginalSource);
    }

    private void AddComponentToProject(CourseItem component)
    {
        PromptDialog PromptDialog = new();
        PromptDialog.ShowPrompt("Please enter name for new " + component.GetType().Name.ToLower() + ".", "Create", "Cancel");
        var name = PromptDialog.EnteredText;
        _ = new UserControl();
        if (!ComponentNameIsValid(name))
        {
            throw new ArgumentException("The component name is invalid.", nameof(component));
        }

        UserControl? panel;
        if (component.GetType() == typeof(Scenario))
        {
            panel = new ScenarioPanel();
        }
        else if (component.GetType() == typeof(Worksheet))
        {
            panel = new WorksheetPanel{ CurrentComponent = (Worksheet)component };
        }
        else if (component.GetType() == typeof(Quiz))
        {
            panel = new QuizPanel { CurrentComponent = (Quiz)component };
        }
        else
        {
            throw (new ArgumentException("The component type is invalid.", nameof(component)));
        }

        if (panel is not null) { AddTab(name, panel); }
        if (currentProject is not null && chapterIndex > -1) 
        {
            currentProject.Chapters[chapterIndex].Contents.Add(component);
            TreeViewItem projectRoot = (TreeViewItem)(tvwProjectHierarchy.Items[0]);
            var selection = (TreeViewItem)(projectRoot.Items[chapterIndex]);
            selection.Items.Add(new TreeViewItem { Header = component.Name + " (" + typeof(ComponentCommands).ToString() + ")", Tag = new ProjectHierarchyItem(component.Name, itemIndex + 1) });
        };
        projectModified = true;
    }

    private static bool ComponentNameIsValid(string name)
    {
        foreach (var c in Path.GetInvalidFileNameChars())
        {
            if (name.Contains(c))
            {
                return false;
            }
        }
        return true;
    }

    private static void LaunchTutorial(string name)
    {
        Process.Start(new ProcessStartInfo(Settings.Default.Domain + "/tutorials?category=AcadiverseCourseCreator&name=" + name) { UseShellExecute = true });
    }

    private void BackUpProject()
    {
        if (!Directory.Exists(Settings.Default.BackupDirectory + @"\"))
        {
            Directory.CreateDirectory(Settings.Default.BackupDirectory);
        }
        File.Copy(savePath, Settings.Default.BackupDirectory + @"\" + System.IO.Path.GetFileNameWithoutExtension(savePath)
            + DateTime.Now.Month + "_" + DateTime.Now.Day + "_" + DateTime.Now.Year + "_"
            + DateTime.Now.Hour + "_" + DateTime.Now.Minute + "_" + DateTime.Now.Second + "_" + DateTime.Now.Millisecond + ".acavc.bak", true);
        var backups = Directory.GetFiles(Settings.Default.BackupDirectory, "*.acavc.bak").Select(fileName => new FileInfo(fileName)).OrderBy(fileInfo => fileInfo.Name);
        for (var i = 0; i < backups.Count(); i++)
        {
            Debug.WriteLine(backups.ToArray()[i]);
        }
    }

    private void CloseAllTabs()
    {
        tabMain.Items.Clear();
    }

    private void CreateNewProject()
    {
        PromptDialog promptDialog = new();
        promptDialog.ShowPrompt("Please enter name for new project.", "Create Project", "Cancel");
        if (promptDialog.EnteredText is not null)
        {
            CloseAllTabs();
            tvwProjectHierarchy.Items.Clear();
            currentProject = new Project
            {
                Name = promptDialog.EnteredText,
                Description = "An Acadiverse Course Creator project.",
            };
            currentProject.Chapters.Add(new CourseChapter
            {
                Title = "Untitled Chapter"
            });
            savePath = Settings.Default.SaveDirectory + @"\" + currentProject.Name + ".acavc";
            AddTab("Project Properties", projectPropertiesPanel);
            var projectRoot = new TreeViewItem
            {
                Header = "New Project",
                Tag = new ProjectHierarchyItem("ProjectRoot", 0)
            };
            projectRoot.Items.Add(new TreeViewItem
            {
                Header = "Untitled Chapter",
                Tag = new ProjectHierarchyItem("CourseChapter", 0)
            });
            tvwProjectHierarchy.Items.Add(projectRoot);
            var objects = new List<object>();
            undoBuffer = new UndoBuffer(objects, Settings.Default.MaxUndos);
            projectModified = true;
            if (Settings.Default.AutoSave)
            {
                SaveProject();
                tmrAutoSave.Stop();
                tmrAutoSave.Start();
            }
        }
        
    }

    private void SaveProject()
    {
        if (currentProject is not null)
        {
            currentProject.Save(savePath);
            projectModified = false;
            if (Settings.Default.AutoBackup)
            {
                BackUpProject();
            }
        }
    }

    private void FinishInitialization()
    {
        if (Settings.Default.BackupDirectory == "" && Settings.Default.SaveDirectory == "")
        {
            Settings.Default.BackupDirectory = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments) + "/Acadiverse Course Creator/Backups";
            Settings.Default.SaveDirectory = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments) + "/Acadiverse Course Creator/Projects";
            Settings.Default.Save();
        }
        if (!Directory.Exists(Settings.Default.SaveDirectory))
        {
            Directory.CreateDirectory(Settings.Default.SaveDirectory);
        }
        foreach (var fontFamily in Fonts.SystemFontFamilies)
        {
            cboFontFamily.Items.Add(new ComboBoxItem
            {
                Content = fontFamily.Source,
                FontFamily = fontFamily,
                FontSize = 16
            });
        }
        if (Settings.Default.ShowStartPage)
        {
            AddTab("Start Page", startPage);
        }
    }

    #endregion

    #region WindowEvents

    private void MainWindow_Loaded(object? sender, RoutedEventArgs e)
    {
        try
        {
            if (Settings.Default.LockedOut)
            {
                if (Settings.Default.LockoutExpireDate.CompareTo(DateTime.Now) == -1)
                {
                    Settings.Default.LockoutExpireDate = new DateTime(1970, 1, 1);
                    Settings.Default.LockedOut = false;
                    Settings.Default.Save();
                }
                else
                {
                    MessageBox.Show(
                        "Acadiverse Course Creator is locked until " + Settings.Default.LockoutExpireDate.ToString("mm/dd/yyyy hh:mm") + " due to too many failed password attempts.",
                        "Acadiverse Course Creator",
                        MessageBoxButton.OK,
                        MessageBoxImage.Error
                    );
                    Application.Current.Shutdown();
                }
            }
            else
            {
                if (Settings.Default.PasswordEnabled)
                {
                    PasswordWindow passwordWindow = new()
                    {
                        Header = "A password has been set for Acadiverse Course Creator. Please enter the password to continue.",
                        CorrectPassword = Settings.Default.PasswordHash,
                        Mode = PasswordWindow.PasswordWindowMode.EnterPassword,
                        MaxAttempts = (Settings.Default.QuitAfterFail) ? Settings.Default.MaxPasswordAttempts : 0
                    };
                    passwordWindow.PasswordAttemptsDepleted += (sender, args) =>
                    {
                        if (Settings.Default.QuitAfterFail)
                        {
                            if (Settings.Default.LockoutEnabled)
                            {
                                Settings.Default.LockoutExpireDate = Settings.Default.LockoutExpireDate.AddHours(Settings.Default.LockoutDurationHours);
                                Settings.Default.LockedOut = true;
                                Settings.Default.Save();
                            }
                            Application.Current.Shutdown();
                        }
                    };
                    passwordWindow.PasswordEntryCancelled += (sender, args) =>
                    {
                        Application.Current.Shutdown();
                    };
                }
                FinishInitialization();
#if DEBUG
            var taskDialog = new TaskDialog
            {
                MainInstruction = "You are using a development version of Acadiverse Course Creator.",
                Content = "If you are not an Acadiverse developer, please remove this version from your system immediately and report wherever you got it from to Acadiverse Support (support@acadiverse.com).",
                ExpandedInformation = "This is a development build not intended for public release."
                    + "\n\nNormally, you would be prompted to log in through the Acadiverse Launcher if you are not logged in already.",
                MainIcon = TaskDialogIcon.Warning,
                WindowTitle = "Acadiverse Course Creator"
            };
            taskDialog.Buttons.Add(new TaskDialogButton { Text = "OK" });
            taskDialog.ShowDialog();
#else
                var authToken = AuthToken.GetTokenFromFile();
                if (authToken is not null)
                {
                    FinishInitialization();
                }
                else
                {
                    var taskDialog = new TaskDialog
                    {
                        MainInstruction = "You are not logged in.",
                        Content = "Please log in from the Acadiverse Launcher to use Acadiverse Course Creator.",
                        MainIcon = TaskDialogIcon.Error
                    };
                    var openLauncherButton = new TaskDialogButton { Text = "Open Acadiverse Launcher" };
                    taskDialog.Buttons.Add(openLauncherButton);
                    taskDialog.ButtonClicked += (sender, args) =>
                    {
                        var launcherDirectory = Assembly.GetExecutingAssembly().Location.Replace("/Acadiverse Course Creator", "");
                        if (launcherDirectory is not null)
                        {
                            Process.Start(launcherDirectory);
                            Application.Current.Shutdown();
                        }
                    };
                    taskDialog.ShowDialog();
                }
#endif
            }
        }
        catch (System.Configuration.ConfigurationErrorsException)
        {
            var taskDialog = new TaskDialog
            {
                MainInstruction = "Your settings have failed to load.",
                Content = "Acadiverse Course Creator could not load your user settings. This can be caused by a crash or a misconfiguration.",
                MainIcon = TaskDialogIcon.Error,
                ButtonStyle = TaskDialogButtonStyle.CommandLinks
            };
            var button1 = new TaskDialogButton
            {
                Text = "Attempt to repair settings.",
                CommandLinkNote = "Attempt to repair your user config file."
            };
            var button2 = new TaskDialogButton
            {
                Text = "Restore settings from synced version.",
                CommandLinkNote = "Restore your user config file from the version synced to your Acadiverse account."
            };
            var button3 = new TaskDialogButton
            {
                Text = "Reset settings.",
                CommandLinkNote = "Reset all settings for Acadiverse Course Creator."
            };
            taskDialog.ButtonClicked += (sender, args) =>
            {
                switch (args.Item.Text)
                {
                    case "Attempt to repair settings.":

                        break;
                    case "Restore settings from synced version.":

                        break;
                    default:
                        Directory.Delete(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData) + "/AcadiverseCourseCreator/", true);
                        break;
                }
            };
            taskDialog.Buttons.Add(button1);
            taskDialog.Buttons.Add(button2);
            taskDialog.Buttons.Add(button3);
            taskDialog.ShowDialog();
        }
    }

    private void MainWindow_IsVisibleChanged(object? sender, DependencyPropertyChangedEventArgs e)
    {

    }

    private void MainWindow_SizeChanged(object? sender, SizeChangedEventArgs e)
    {
        cctTabs.Width = Width - fohObjectProperties.Width - tvwProjectHierarchy.Width;
        if (WindowState != WindowState.Maximized)
        {
            normalWidth = Width;
        }
    }

    private void MainWindow_StateChanged(object? sender, EventArgs e)
    {
        if (WindowState == WindowState.Maximized)
        {
            Width = System.Windows.Forms.Screen.PrimaryScreen.WorkingArea.Width;
        }
        else
        {
            Width = normalWidth;
        }
    }

    private void MainWindow_Closing(object sender, System.ComponentModel.CancelEventArgs e)
    {
        if (projectModified && currentProject is not null)
        {
            var confirmSave = MessageBox.Show("Save project before closing?", "Acadiverse Course Creator", MessageBoxButton.YesNoCancel, MessageBoxImage.Warning, MessageBoxResult.Yes);
            if (confirmSave == MessageBoxResult.Yes)
            {
                SaveProject();
            }
            else if (confirmSave == MessageBoxResult.Cancel)
            {
                e.Cancel = true;
            }
        }
    }

    #endregion

    #region MenuItemEvents

    private void OptionsMenuItem_Click(object? sende, EventArgs e)
    {
        new OptionsWindow().ShowDialog();
    }

    private void MnuAddScenario_Click(object? sender, RoutedEventArgs e)
    {
        AddComponentToProject(new Scenario());
    }

    private void MnuAddQuiz_Click(object sender, RoutedEventArgs e)
    {
        AddComponentToProject(new Quiz());
    }

    private void MnuRemoveQuiz_Click(object sender, RoutedEventArgs e)
    {

    }

    private void MnuAddWorksheet_Click(object sender, RoutedEventArgs e)
    {
        
    }

    private void MnuRemoveWorksheet_Click(object sender, RoutedEventArgs e)
    {

    }

    private void MnuPublish_Click(object sender, RoutedEventArgs e)
    {

    }

    private void MnuPublishProject_Click(object sender, RoutedEventArgs e)
    {

    }

    private void MenuItem_Click(object sender, RoutedEventArgs e)
    {

    }

    private void MnuProjectProperties_Click(object sender, RoutedEventArgs e)
    {

    }

    private void MnuRemoveScenario_Click(object sender, RoutedEventArgs e)
    {

    }

    private void MnuGetMoreComponents_Click(object sender, RoutedEventArgs e)
    {

    }

    private void MnuManageAddOns_Click(object sender, RoutedEventArgs e)
    {

    }

    private void MnuCloseAllTabs_Click(object sender, RoutedEventArgs e)
    {
        foreach (MetroTabItem tab in tabMain.Items)
        {
            tab.CloseTabCommand.Execute(null);
        }
    }

    private void MnuCloseSelectedTab_Click(object sender, RoutedEventArgs e)
    {

    }

    private void MnuSaveLayout_Click(object sender, RoutedEventArgs e)
    {

    }

    private void MnuLoadLayout_Click(object sender, RoutedEventArgs e)
    {

    }

    private void MnuResetLayout_Click(object sender, RoutedEventArgs e)
    {

    }

    private void MnuViewDocumentation_Click(object sender, RoutedEventArgs e)
    {
        Process.Start(new ProcessStartInfo("http://acadiverse-course-creator.readthedocs.io") { UseShellExecute = true });
    }

    private void MnuTutorialGettingStarted_Click(object sender, RoutedEventArgs e)
    {
        LaunchTutorial("GettingStarted");
    }

    private void MnuTutorialWorksheets_Click(object sender, RoutedEventArgs e)
    {
        LaunchTutorial("Worksheets");
    }

    private void MnuTutorialScenarios_Click(object sender, RoutedEventArgs e)
    {
        LaunchTutorial("Scenarios");
    }

    private void MnuTutorialQuizzes_Click(object sender, RoutedEventArgs e)
    {
        LaunchTutorial("Quizzes");
    }

    #endregion

    #region OtherEvents

    private void TvwProjectHierarchy_SelectedItemChanged(object sender, RoutedPropertyChangedEventArgs<object> e)
    {
        ProjectHierarchyItem item = (ProjectHierarchyItem)((TreeViewItem)(e.NewValue)).Tag;
        selectedItemType = item.Type;
        if (selectedItemType == "ProjectRoot")
        {
            chapterIndex = -1;
            itemIndex = -1;
        }
        else if (selectedItemType == "CourseChapter")
        {
            chapterIndex = item.Index;
        }
        else
        {
            itemIndex = item.Index;
        }
    }

    #endregion

    #region Commands

    private void NewCommand_Executed(object? sender, ExecutedRoutedEventArgs e)
    {

        if (projectModified && currentProject is not null)
        {
            var confirmSave = MessageBox.Show("Save project before creating a new one?", "Acadiverse Course Creator", MessageBoxButton.YesNoCancel, MessageBoxImage.Warning, MessageBoxResult.Yes);
            if (confirmSave == MessageBoxResult.Yes)
            {
                SaveProject();
                CreateNewProject();
            }
            else if (confirmSave == MessageBoxResult.No)
            {
                CreateNewProject();
            }
        }
        else
        {
            CreateNewProject();
        }
    }

    private void OpenCommand_Executed(object? sender, ExecutedRoutedEventArgs e)
    {
        var ofd = new Ookii.Dialogs.Wpf.VistaOpenFileDialog();
        if (ofd.ShowDialog() == true)
        {
            currentProject = null;

            tabMain.Items.Clear();
            currentProject = Project.Load(ofd.FileName);
        }
    }

    private void SaveCommand_Executed(object? sender, ExecutedRoutedEventArgs e)
    {
        if (currentProject is not null)
        {
            savePath = Settings.Default.SaveDirectory + @"\" + currentProject.Name + ".acavc";
            currentProject.Save(savePath);
        }

    }

    private void SaveCommand_CanExecute(object? sender, CanExecuteRoutedEventArgs e)
    {
        e.CanExecute = currentProject != null;
    }

    private void SaveAsCommand_Executed(object? sender, ExecutedRoutedEventArgs e)
    {

    }

    private void SaveAsCommand_CanExecute(object? sender, CanExecuteRoutedEventArgs e)
    {
        e.CanExecute = currentProject != null;
    }

    private void BackUpNowCommand_Executed(object? sender, ExecutedRoutedEventArgs e)
    {
        BackUpProject();
    }

    private void BackUpNowCommand_CanExecute(object? sender, CanExecuteRoutedEventArgs e)
    {
        e.CanExecute = currentProject != null && savePath != "";
    }

    #endregion

}