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
/// Interaction logic for PromptDialog.xaml
/// </summary>
public partial class PromptDialog : Window
{
    public PromptDialog()
    {
        InitializeComponent();
    }

    private string enteredText = "";

    public string EnteredText
    {
        get => enteredText;
        set => enteredText = value;
    }

    public void ShowPrompt(string prompt, string acceptButtonText, string cancelButtonText)
    {
        txtPrompt.Text = prompt;
        btnOK.Content = acceptButtonText;
        btnCancel.Content = cancelButtonText;
        ShowDialog();
        if (DialogResult == true)
        {
            EnteredText = txtInput.Text; 
        }
    }

    private void btnOK_Click(object sender, RoutedEventArgs e)
    {
        DialogResult = true;
        Close();
    }

    private void btnCancel_Click(object sender, RoutedEventArgs e)
    {
        DialogResult= false;
        Close();
    }
}
