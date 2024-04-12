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

namespace AcadiverseCourseCreator.Dialogs;
/// <summary>
/// Interaction logic for PasswordWindow.xaml
/// </summary>
public partial class PasswordWindow : Window
{
    public enum PasswordWindowMode
    {
        EnterPassword, SetPassword, ChangePassword
    }

    private PasswordWindowMode mode;
    private string acceptButtonText;
    private string cancelButtonText;
    private string header;
    private string windowText;
    private int maxAttempts;
    private string correctPassword;
    private string enteredPassword;

    public event EventHandler? PasswordAttemptsDepleted;
    public event EventHandler? PasswordEntryCancelled;

    public PasswordWindowMode Mode
    {
        get => mode;
        set
        {
            mode = value;
            switch (value)
            {
                case PasswordWindowMode.EnterPassword:
                    lblNewPassword.Visibility = Visibility.Collapsed;
                    txtNewPassword.Visibility = Visibility.Collapsed;
                    lblConfirmPassword.Visibility = Visibility.Collapsed;
                    txtConfirmPassword.Visibility = Visibility.Collapsed;
                    lblPassword.Visibility = Visibility.Visible;
                    txtPassword.Visibility = Visibility.Visible;
                    break;
                case PasswordWindowMode.SetPassword:
                    lblNewPassword.Visibility = Visibility.Visible;
                    txtNewPassword.Visibility = Visibility.Visible;
                    lblConfirmPassword.Visibility = Visibility.Visible;
                    txtConfirmPassword.Visibility = Visibility.Visible;
                    lblPassword.Visibility = Visibility.Collapsed;
                    txtPassword.Visibility = Visibility.Collapsed;
                    break;
                case PasswordWindowMode.ChangePassword:
                    lblNewPassword.Visibility = Visibility.Visible;
                    txtNewPassword.Visibility = Visibility.Visible;
                    lblConfirmPassword.Visibility = Visibility.Visible;
                    txtConfirmPassword.Visibility = Visibility.Visible;
                    lblPassword.Visibility = Visibility.Visible;
                    txtPassword.Visibility = Visibility.Visible;
                  break;
                default:
                    throw new Exception();
            }
        }
    }
    public string AcceptButtonText
    {
        get => acceptButtonText is not null ? acceptButtonText : "OK";
        set
        {
            if (value is not null)
            {
                acceptButtonText = value;
            }
        }
    }
    public string CancelButtonText
    {
        get => cancelButtonText is not null ? cancelButtonText : "Cancel";
        set
        {
            if (value is not null)
            {
                cancelButtonText = value;
            }
        }
    }
    public string Header
    {
        get => header is not null ? header : "Please enter your password.";
        set
        {
            if (value is not null)
            {
                header = value;
            }
        }
    }
    public string WindowText
    {
        get => windowText is not null ? windowText : "Enter Password";
        set
        {
            if (value is not null)
            {
                windowText = value;
            }
        }
    }
    public int MaxAttempts
    {
        get => maxAttempts;
        set
        {
            maxAttempts = value;
            txtAttemptsRemaining.Text = "Attempts remaining: " + maxAttempts.ToString();
            if (value > 0)
            {
                txtAttemptsRemaining.Visibility = Visibility.Visible;
            }
            else
            {
                txtAttemptsRemaining.Visibility = Visibility.Collapsed;
            }
        }
    }
    public string CorrectPassword
    {
        get => correctPassword is not null? correctPassword : "";
        set => correctPassword = value;
    }
    public string EnteredPassword
    {
        get => enteredPassword is not null? enteredPassword : "";
        set => enteredPassword = value;
    }

    public PasswordWindow()
    {
        InitializeComponent();
        acceptButtonText = "OK";
        cancelButtonText = "Cancel";
        header = "Please enter your password.";
        windowText = "Enter Password";
        btnOK.Content = acceptButtonText;
        btnCancel.Content = cancelButtonText;
        txtHeader.Text = header;
        Header = windowText;
        correctPassword = "";
        enteredPassword = "";
    }

    private void BtnOK_Click(object sender, RoutedEventArgs e)
    {
        switch (Mode)
        {
            case PasswordWindowMode.EnterPassword:
                if (BCrypt.Net.BCrypt.HashPassword(txtPassword.Password) == correctPassword)
                {
                    DialogResult = true;
                    Close();
                }
                else
                {
                    MessageBox.Show("Your password was incorrect.", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                    if (MaxAttempts > 0)
                    {
                        MaxAttempts--;
                        if (MaxAttempts <= 0)
                        {
                            PasswordAttemptsDepleted?.Invoke(this, new EventArgs());
                            Close();
                        }
                    }
                }
                break;
            case PasswordWindowMode.SetPassword:
                if (txtPassword.Password == txtConfirmPassword.Password)
                {
                    DialogResult = true;
                    Close();
                }
                else
                {
                    MessageBox.Show("Passwords did not match.", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                }
                break;
            case PasswordWindowMode.ChangePassword:
                if (txtPassword.Password == correctPassword)
                {
                    if (txtPassword.Password == txtConfirmPassword.Password)
                    {
                        DialogResult = true;
                        Close();
                    }
                }
                else
                {
                    MessageBox.Show("Passwords did not match.", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                }
                break;
            default:
                throw (new Exception());
        }
    }

    private void BtnCancel_Click(object sender, RoutedEventArgs e)
    {
        PasswordEntryCancelled?.Invoke(this, new EventArgs());
        DialogResult = false;
        Close();
    }
}
