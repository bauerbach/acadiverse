using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace AcadiverseCourseCreator.CourseContent;

public class Quiz : CourseItem
{
    private readonly List<QuizQuestion> questions = new();

    public List<QuizQuestion> Questions => questions;

    public static Quiz Load()
    {
        Quiz? quiz = new();
        XmlReader? xmlReader = null;
        try
        {

        }
        catch (Exception)
        {
            if (xmlReader != null)
            {
                xmlReader.Close();
                xmlReader.Dispose();
            }
            throw;
        }

        return quiz;
    }

    public override void Save(string path)
    {
        var xmlWriter = XmlWriter.Create(path); //Create a new file for the quiz in a subdirectory. 
        xmlWriter.WriteStartDocument(); //Write the starting element for the document.

        //<quiz name="name">
        xmlWriter.WriteStartElement("quiz");
        xmlWriter.WriteAttributeString("name", Name);

        foreach (var question in Questions)
        {

            xmlWriter.WriteStartElement("question");
            xmlWriter.WriteAttributeString("type", question.QuestionType.ToString());
            xmlWriter.WriteAttributeString("text", question.QuestionText);

            switch (question.QuestionType)
            {
                case QuizQuestion.QuizQuestionType.MultipleChoice:

                    //<question type="[type]" text="[text]" correctAnswer="[correctAnswer]">
                    xmlWriter.WriteAttributeString("correctAnswer", question.CorrectAnswer.ToString());

                    //<possibleAnswers>
                    xmlWriter.WriteStartElement("possibleAnswers");

                    foreach (var answer in question.PossibleAnswers)
                    {

                        //<answer text="[text]" />
                        xmlWriter.WriteStartElement("answer");
                        xmlWriter.WriteAttributeString("text", answer);
                        xmlWriter.WriteEndElement();
                    }

                    xmlWriter.WriteEndElement(); //</possibleAnswers>
                    break;
                case QuizQuestion.QuizQuestionType.ShortAnswer:
                    xmlWriter.WriteAttributeString("correctAnswer", (string)question.CorrectAnswer);
                    break;
                case QuizQuestion.QuizQuestionType.TrueOrFalse:
                    xmlWriter.WriteAttributeString("correctAnswer", ((bool)question.CorrectAnswer).ToString());
                    break;
                default:
                    throw new InvalidOperationException();
            }
            xmlWriter.WriteEndElement(); //</question>
        }
        xmlWriter.WriteEndElement(); //</quiz>

        xmlWriter.WriteEndDocument();
        xmlWriter.Close();
        xmlWriter.Dispose();
    }
}
