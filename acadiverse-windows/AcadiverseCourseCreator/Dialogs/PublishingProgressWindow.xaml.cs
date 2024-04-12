using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
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
using AcadiverseCourseCreator.CourseContent.Scenarios;

namespace AcadiverseCourseCreator;
/// <summary>
/// Interaction logic for PublishingProgressWindow.xaml
/// </summary>
public partial class PublishingProgressWindow : Window
{
#pragma warning disable IDE0044 // Add readonly modifier
    public Project project = new();
    private string newSubmissionID = "";
    private BackgroundWorker bgw = new();
    private List<CourseItem> components = new();
    private List<QuizQuestion> quizQuestions = new();
    private List<string> worksheetPages = new();
#pragma warning restore IDE0044 // Add readonly modifier

    public class ProjectReviewFailedException : Exception
    {
        private readonly string failureReason = "";
        public override string Message => "Project publishing failed for the following reason:\n" + failureReason;

        public ProjectReviewFailedException(string message, string failureReason) : base(message)
        {
            this.failureReason = failureReason;
        }
    }

    public PublishingProgressWindow()
    {
        InitializeComponent();
        bgw.WorkerReportsProgress = true;
        bgw.WorkerSupportsCancellation = true;
        bgw.ProgressChanged += new ProgressChangedEventHandler(ProgressChanged);
        bgw.RunWorkerCompleted += new RunWorkerCompletedEventHandler(RunWorkerCompleted);
        bgw.DoWork += new DoWorkEventHandler(DoWork);
    }

    private void ProgressChanged(object? sender, ProgressChangedEventArgs e)
    {
        if (e.UserState is not null)
        {
            if (e.UserState.ToString() == "preparing")
            {
                if (e.ProgressPercentage == 0)
                {
                    lblCurrentTask.Content = "Preparing for review...";
                    prgProgress.IsIndeterminate = true;
                }
                else
                {
                    prgProgress.IsIndeterminate = false;
                    lblCurrentTask.Content = "Reviewing project...";
                }
            }
            else if (e.UserState.ToString() == "reviewing")
            {

            }
        }
    }

    private void RunWorkerCompleted(object? sender, RunWorkerCompletedEventArgs e)
    {
        if (e.Cancelled)
        {
            MessageBox.Show("Publishing has been cancelled.", "Acadiverse Course Creator", MessageBoxButton.OK, MessageBoxImage.Information);
            Close();
        }
        else
        {
            if (e.Error == null)
            {
                Process.Start(Settings.Default.Domain + "/submissions/view?id=" + newSubmissionID);
            }
            else
            {

            }
        }
    }

    private void DoWork(object? sender, DoWorkEventArgs e)
    {
        //Prepare for review by getting a list of chapters and components.

        bgw.ReportProgress(0, "preparing");

        foreach (var chapter in project.Chapters)
        {
            foreach (var courseItem in chapter.Contents)
            {
                components.Add(courseItem);
            }
        }

        foreach (var component in components)
        {
            if (component.GetType() == typeof(Worksheet))
            {
                foreach (var page in ((Worksheet)component).WorksheetPages)
                {
                    worksheetPages.Add(page);
                }
            }
            else if (component.GetType() == typeof(Scenario))
            {

            }
            else
            {
                foreach (var question in ((Quiz)component).Questions)
                {
                    quizQuestions.Add(question);
                }
            }
        }

        bgw.ReportProgress(1, "preparing");
    }

    private void PublishingProgressWindow_Loaded(object sender, RoutedEventArgs e)
    {
        bgw.RunWorkerAsync();
    }

    private void btnCancel_Click(object sender, RoutedEventArgs e)
    {
        Close();
    }
}
