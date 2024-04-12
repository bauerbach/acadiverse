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

namespace AcadiverseCourseCreator.Dialogs;
/// <summary>
/// Interaction logic for QuizPreviewDialog.xaml
/// </summary>
public partial class QuizPreviewDialog : Window
{
    public QuizPreviewDialog()
    {
        InitializeComponent();
    }

    private string[] multipleChoiceAnswers = { "A", "B", "C", "D" };
    private int questionIndex = -1;
    private int score = 0;
    private Quiz? currentQuiz = null;

    public Quiz? CurrentQuiz
    {
        get => currentQuiz;
        set => currentQuiz = value;
    }

    private void DisplayNextQuestion()
    {
        questionIndex++;
        txtQuestionNumber.Text = (questionIndex + 1).ToString() + currentQuiz.Questions.Count.ToString();
        QuizQuestion question = currentQuiz.Questions[questionIndex];
        txtQuestion.Text = question.QuestionText;
    }

    private void AnswerQuestion(int answer)
    {
        var correctAnswer = false;
        var correctAnswerText = "";
        if (currentQuiz is not null)
        {
            QuizQuestion question = currentQuiz.Questions[questionIndex];
            if (question is not null && question.CorrectAnswer is not null)
            {
                switch (question.QuestionType)
                {
                    case QuizQuestion.QuizQuestionType.MultipleChoice:
                        correctAnswer = (int)(question.CorrectAnswer) == answer;
                        correctAnswerText = multipleChoiceAnswers[answer];
                        break;
                    case QuizQuestion.QuizQuestionType.ShortAnswer:
                        if (answer == 3)
                        {
                            correctAnswer = question.CorrectAnswer.ToString() == txtAnswer.Text;
                            correctAnswerText = question.CorrectAnswer.ToString();
                        }
                        break;
                    case QuizQuestion.QuizQuestionType.TrueOrFalse:
                        if (answer == 0)
                        {
                            correctAnswer = (bool)(question.CorrectAnswer) == true;
                        }
                        else
                        {
                            correctAnswer = (bool)(question.CorrectAnswer) == false;
                        }
                        correctAnswerText = question.CorrectAnswer.ToString().ToUpper();
                        break;
                    default:
                        throw new InvalidOperationException();
                }
                if (correctAnswer)
                {
                    score++;
                    MessageBox.Show("Your answer was correct!", "Quiz Preview", MessageBoxButton.OK, MessageBoxImage.Information);
                }
                else
                {
                    MessageBox.Show("Incorrect Answer. The correct answer was " + correctAnswerText + ".", "Quiz Preview", MessageBoxButton.OK, MessageBoxImage.Information);
                }
                DisplayNextQuestion();
            }
        }
    }

    private void BtnClose_Click(object sender, RoutedEventArgs e)
    {
        Close();
    }

    private void btnAnswer1_Click(object sender, RoutedEventArgs e)
    {
        AnswerQuestion(0);
    }

    private void btnAnswer2_Click(object sender, RoutedEventArgs e)
    {
        AnswerQuestion(1);
    }

    private void btnAnswer3_Click(object sender, RoutedEventArgs e)
    {
        AnswerQuestion(2);
    }

    private void btnAnswer4_Click(object sender, RoutedEventArgs e)
    {
        AnswerQuestion(3);
    }

    private void QuizPreviewDialog_Loaded(object sender, RoutedEventArgs e)
    {
        DisplayNextQuestion();
    }
}
