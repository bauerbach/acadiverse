using System;
using System.Collections.Generic;

namespace AcadiverseCourseCreator.CourseContent
{
    public class QuizQuestion
    {
        public enum QuizQuestionType
        {
            MultipleChoice = 0,
            ShortAnswer = 1,
            TrueOrFalse = 2
        }

        private string questionText = "";
        private QuizQuestionType questionType = QuizQuestionType.MultipleChoice;
        private object correctAnswer = new();
        private List<string> possibleAnswers = new();

        public string QuestionText
        {
            get => questionText; set => questionText = value;
        }
        public QuizQuestionType QuestionType
        {
            get => questionType; set => questionType = value;
        }
        public object CorrectAnswer
        {
            get => QuestionType switch
            {
                QuizQuestionType.MultipleChoice => (int)correctAnswer,
                QuizQuestionType.ShortAnswer => (string)correctAnswer,
                QuizQuestionType.TrueOrFalse => (bool)correctAnswer,
                _ => throw new ArgumentException("Invalid value for QuestionType."),
            };
            set => correctAnswer = QuestionType switch
            {
                QuizQuestionType.MultipleChoice => (int)value,
                QuizQuestionType.ShortAnswer => (string)value,
                QuizQuestionType.TrueOrFalse => (bool)value,
                _ => throw new ArgumentException("Invalid value for QuestionType."),
            };
        }

        public List<string> PossibleAnswers
        {
            get => possibleAnswers; set => possibleAnswers = value;
        }
    }
}