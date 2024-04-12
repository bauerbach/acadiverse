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
using System.Windows.Navigation;
using System.Windows.Shapes;
using AcadiverseCourseCreator.CourseContent;
using AcadiverseCourseCreator.Dialogs;

namespace AcadiverseCourseCreator
{
    /// <summary>
    /// Interaction logic for QuizPanel.xaml
    /// </summary>
    public partial class QuizPanel : UserControl
    {
        public event EventHandler<ComponentModifiedEventArgs>? QuizModified;

        private Quiz currentComponent;
        private int currentQuestionIndex;

        public Quiz CurrentComponent
        {
            get => currentComponent;
            set
            {
                currentComponent = value;
            }
        }

        public QuizPanel()
        {
            InitializeComponent();
        }

        private void UpdateAnswerControlVisibility(QuizQuestion.QuizQuestionType questionType)
        {
            switch (questionType)
            {
                case QuizQuestion.QuizQuestionType.MultipleChoice:
                    objMultipleChoice.Visibility = Visibility.Visible;
                    stkTrueOrFalse.Visibility = Visibility.Collapsed;
                    txtShortAnswer.Visibility = Visibility.Collapsed;
                    break;
                case QuizQuestion.QuizQuestionType.ShortAnswer:
                    objMultipleChoice.Visibility = Visibility.Collapsed;
                    stkTrueOrFalse.Visibility = Visibility.Collapsed;
                    txtShortAnswer.Visibility = Visibility.Visible;
                    break;
                case QuizQuestion.QuizQuestionType.TrueOrFalse:
                    objMultipleChoice.Visibility = Visibility.Collapsed;
                    stkTrueOrFalse.Visibility = Visibility.Visible;
                    txtShortAnswer.Visibility = Visibility.Collapsed;
                    break;
                default:
                    return;
            }
        }

        private void AddQuestion(QuizQuestion.QuizQuestionType questionType)
        {
            currentComponent.Questions.Add(new QuizQuestion { QuestionType = questionType });
            lstQuestions.Items.Add(new ListBoxItem { Content = "Question " + currentComponent.Questions.Count, Tag = currentComponent.Questions.Count - 1 });
            lblQuestion.Visibility = Visibility.Visible;
            txtQuestion.Visibility = Visibility.Visible;
            UpdateAnswerControlVisibility(questionType);
            QuizModified?.Invoke(this, new ComponentModifiedEventArgs(CurrentComponent));
        }

        private void JumpToQuestion(int index)
        {
            txtQuestion.Text = currentComponent.Questions[index].QuestionText;
            UpdateAnswerControlVisibility(currentComponent.Questions[index].QuestionType);
            currentQuestionIndex = index;
            switch (currentComponent.Questions[index].QuestionType)
            {
                case QuizQuestion.QuizQuestionType.MultipleChoice:
                    break;
                case QuizQuestion.QuizQuestionType.ShortAnswer:
                    txtShortAnswer.Text = (string)(currentComponent.Questions[index].CorrectAnswer);
                    break;
                case QuizQuestion.QuizQuestionType.TrueOrFalse:
                    var correctAnswer = (bool)(currentComponent.Questions[index].CorrectAnswer);
                    if (correctAnswer)
                    {
                        rbtAnswerTrue.IsChecked = true;
                        rbtAnswerFalse.IsChecked = false;
                    }
                    else
                    {
                        rbtAnswerTrue.IsChecked = false;
                        rbtAnswerFalse.IsChecked = true;
                    }
                    break;
                default:
                    return;
            }
        }

        private void MnuMultipleChoice_Click(object sender, RoutedEventArgs e)
        {
            AddQuestion(QuizQuestion.QuizQuestionType.MultipleChoice);
        }

        private void MnuShortAnswer_Click(object sender, RoutedEventArgs e)
        {
            AddQuestion(QuizQuestion.QuizQuestionType.ShortAnswer);
        }

        private void MnuTrueOrFalse_Click(object sender, RoutedEventArgs e)
        {
            AddQuestion(QuizQuestion.QuizQuestionType.TrueOrFalse);
        }

        private void BtnPreviewQuiz_Click(object sender, RoutedEventArgs e)
        {
            new QuizPreviewDialog { CurrentQuiz = CurrentComponent }.ShowDialog();
        }
    }
}
