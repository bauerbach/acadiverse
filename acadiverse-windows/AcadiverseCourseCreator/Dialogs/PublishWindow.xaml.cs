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
using AcadiverseCourseCreator.CourseContent;

namespace AcadiverseCourseCreator;
/// <summary>
/// Interaction logic for PublishWindow.xaml
/// </summary>
public partial class PublishWindow : Window
{
    public PublishWindow()
    {
        InitializeComponent();
    }

    public Project project = new();
    public string filePath = "";

    private void BtnPublish_Click(object sender, RoutedEventArgs e)
    {
        if (txtTitle.Text == "")
        {
            if (txtDescription.Text == "")
            {
                if (txtTags.Text == "")
                {
                    if (chkMatureContent.IsChecked is not null && chkMatureContent.IsChecked == true)
                    {
                        if (sldMinGrade.Value < 7)
                        {

                        }
                        else
                        {

                        }
                    }
                    else
                    {


                    }
                }
                else
                {


                }
            }
        }
        _ = new PublishingProgressWindow { project = project };
    }
}
