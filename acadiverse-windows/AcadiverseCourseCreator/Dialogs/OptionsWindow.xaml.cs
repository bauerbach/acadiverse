using AcadiverseCourseCreator.Dialogs;
using MahApps.Metro.Controls;
using MahApps.Metro.Controls.Dialogs;
using Microsoft.Win32;
using Ookii.Dialogs.Wpf;
using System;
using System.Collections.Generic;
using System.Linq;
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

namespace AcadiverseCourseCreator;

/// <summary>
/// Interaction logic for OptionsWindow.xaml
/// </summary>
public partial class OptionsWindow : Window
{
    public OptionsWindow()
    {
        InitializeComponent();
    }

    private string passwordHash = "";

    private void OptionsWindow_Loaded(object sender, EventArgs e)
    {
        System.Windows.Forms.Application.EnableVisualStyles();
        passwordHash = Settings.Default.PasswordHash;
        chkPasswordEnabled.IsChecked = Settings.Default.PasswordEnabled;
        chkLockoutEnabled.IsChecked = Settings.Default.LockoutEnabled;
        chkAdvancedScripting.IsChecked = Settings.Default.AdvancedScripting;
        chkAutoBackup.IsChecked = Settings.Default.AutoBackup;
        chkAutoSave.IsChecked = Settings.Default.AutoSave;
        chkCheckForUpdates.IsChecked = Settings.Default.CheckForUpdates;
        chkDeleteOldBackups.IsChecked = Settings.Default.DeleteOldBackups;          
        chkShowStartPage.IsChecked = Settings.Default.ShowStartPage;
        chkSyncBackups.IsChecked = Settings.Default.SyncBackups;
        chkSyncProjects.IsChecked = Settings.Default.SyncProjects;
        chkSyncSettings.IsChecked = Settings.Default.SyncSettings;
        numAutosaveInterval.Value = Convert.ToDecimal(Settings.Default.AutoSaveInterval);
        numDaysToBackupDeletion.Value = Convert.ToDecimal(Settings.Default.DaysToBackupDeletion);
        numLockoutDuration.Value = Convert.ToDecimal(Settings.Default.LockoutDurationHours);
        numMaxBackups.Value = Convert.ToDecimal(Settings.Default.MaxBackups);
        numMaxUndos.Value = Convert.ToDecimal(Settings.Default.MaxUndos);
        numMaxPasswordAttempts.Value = Convert.ToDecimal(Settings.Default.MaxPasswordAttempts);
        txtBackupDirectory.Text = Settings.Default.BackupDirectory;
        txtSaveDirectory.Text = Settings.Default.SaveDirectory;
    }

    private void ChangePasswordButton_Click(object sender, RoutedEventArgs e)
    {
        var passwordWindow = new PasswordWindow
        {
            Mode = PasswordWindow.PasswordWindowMode.ChangePassword,
            CorrectPassword = Settings.Default.PasswordHash,
            Header = "",
            WindowText = "Change Password"
        };
        if (passwordWindow.ShowDialog() == true)
        {
            Settings.Default.PasswordHash = BCrypt.Net.BCrypt.HashPassword(passwordWindow.EnteredPassword);
        }
    }

    private void SaveButton_Click(object sender, RoutedEventArgs e)
    {
        if (chkAdvancedScripting.IsChecked is not null
                && chkAutoBackup.IsChecked is not null
                && chkAutoSave.IsChecked is not null
                && chkCheckForUpdates.IsChecked is not null
                && chkDeleteOldBackups.IsChecked is not null
                && chkLockoutEnabled.IsChecked is not null
                && chkPasswordEnabled.IsChecked is not null
                && chkShowStartPage.IsChecked is not null
                && chkSyncBackups.IsChecked is not null
                && chkSyncProjects.IsChecked is not null
                && chkSyncSettings.IsChecked is not null
            )
        {
            Settings.Default.AdvancedScripting = (bool)chkAdvancedScripting.IsChecked;
            Settings.Default.AutoBackup = (bool)chkAutoBackup.IsChecked;
            Settings.Default.AutoSave = (bool)chkAutoSave.IsChecked;
            Settings.Default.AutoSaveInterval = Convert.ToInt32(numAutosaveInterval.Value);
            Settings.Default.BackupDirectory = txtBackupDirectory.Text;
            Settings.Default.CheckForUpdates = (bool)chkCheckForUpdates.IsChecked;
            Settings.Default.DaysToBackupDeletion = Convert.ToInt32(numDaysToBackupDeletion.Value);
            Settings.Default.DeleteOldBackups = (bool)chkDeleteOldBackups.IsChecked;
            Settings.Default.LockoutDurationHours = Convert.ToInt32(numLockoutDuration.Value);
            Settings.Default.LockoutEnabled = (bool)chkLockoutEnabled.IsChecked;
            Settings.Default.MaxBackups = Convert.ToInt32(numMaxBackups.Value);
            Settings.Default.MaxUndos = Convert.ToInt32(numMaxUndos.Value);
            Settings.Default.MaxPasswordAttempts = Convert.ToInt32(numMaxPasswordAttempts.Value);
            if (Settings.Default.MaxPasswordAttempts == 0)
            {
                Settings.Default.QuitAfterFail = false;
            }
            else
            {
                Settings.Default.QuitAfterFail = true;
            }
            if (passwordHash == "")
            {
                Settings.Default.PasswordEnabled = false;
            }
            else
            {
                Settings.Default.PasswordEnabled = true;
            }
            Settings.Default.PasswordHash = passwordHash;
            Settings.Default.SaveDirectory = txtSaveDirectory.Text;
            Settings.Default.ShowStartPage = (bool)chkShowStartPage.IsChecked;
            Settings.Default.SyncBackups = (bool)chkSyncBackups.IsChecked;
            Settings.Default.SyncProjects = (bool)chkSyncProjects.IsChecked;
            Settings.Default.SyncSettings = (bool)chkSyncSettings.IsChecked;
            Settings.Default.Save();
            Close();
        }
        
    }

    private void CancelButton_Click(object sender, RoutedEventArgs e)
    {
        Close();
    }

    private void BrowseForBackupDirectoryButton_Click(object sender, RoutedEventArgs e)
    {
        var fbd = new VistaFolderBrowserDialog()
        {
            Description = "Select folder for backups.",
            ShowNewFolderButton = true
        };
        fbd.ShowDialog();
        if (fbd.SelectedPath != "")
        {
            txtBackupDirectory.Text = fbd.SelectedPath;
        }
    }

    private void BrowseForSaveDirectoryButton_Click(object sender, RoutedEventArgs e)
    {
        var fbd = new VistaFolderBrowserDialog()
        {
            Description = "Select folder for saving projects.",
            ShowNewFolderButton = true
        };
        fbd.ShowDialog();
        if (fbd.SelectedPath != "")
        {
            txtSaveDirectory.Text = fbd.SelectedPath;
        }
    }

    private void ChkPasswordEnabled_Checked(object sender, RoutedEventArgs e)
    {
        if (!Settings.Default.PasswordEnabled && Settings.Default.PasswordHash is not null && Settings.Default.PasswordHash == "")
        {
            var passwordWindow = new PasswordWindow
            {
                Mode = PasswordWindow.PasswordWindowMode.SetPassword,
                Header = "Please enter a password for Acadiverse Course Creator. NOTE: If you forget this password, it can NOT be recovered!",
                WindowText = "Set Password"
            };
            passwordWindow.PasswordEntryCancelled += (sender, args) =>
            {
                chkPasswordEnabled.IsChecked = false;
            };
        }
    }

    private void ResetSettingsButton_Click(object sender, RoutedEventArgs e)
    {
        if(MessageBox.Show("Reset all settings?", "Acadiverse Course Creator", MessageBoxButton.YesNo, MessageBoxImage.Question, MessageBoxResult.No) == MessageBoxResult.Yes) 
        {
            Settings.Default.Reset();
            Settings.Default.Save();
            Close();
        }
    }
}
