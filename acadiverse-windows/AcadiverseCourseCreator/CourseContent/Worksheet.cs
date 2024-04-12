using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace AcadiverseCourseCreator.CourseContent;

public class Worksheet : CourseItem
{
    private List<string> worksheetPages = new();

    public List<string> WorksheetPages
    {
        get => worksheetPages; set => worksheetPages = value;
    }

    public static Worksheet Load()
    {
        Worksheet? worksheet;
        XmlReader? xmlReader = null;

        try
        {
            if (xmlReader is not null)
            {
                xmlReader.Read();

                xmlReader.Read();

                worksheet = new Worksheet();
                xmlReader.ReadAttributeValue();
                worksheet.Name = xmlReader.GetAttribute("name")!;

                xmlReader.Read();
            }
            else
            {
                throw new Exception("Could not load worksheet.");
            }

        }
        catch
        {
            if (xmlReader is not null)
            {
                xmlReader.Close();
                xmlReader.Dispose();
            }
            throw;
        }

        return worksheet;
    }

    public override void Save(string path)
    {
        var xmlWriter = XmlWriter.Create(path); //Create an XML document for the worksheet in a subfolder.
        xmlWriter.WriteStartDocument();

        //<worksheet name="[name]">
        xmlWriter.WriteStartElement("worksheet");
        xmlWriter.WriteAttributeString("name", Name);

        //<pages>
        xmlWriter.WriteStartElement("pages");

        foreach (var str in WorksheetPages) //For each page in the worksheet (pages are represented by a string representing their contents)...
        {

            xmlWriter.WriteStartElement("page"); //<page>

            xmlWriter.WriteString(str); //Write the contents of the page.

            xmlWriter.WriteEndElement(); //</page>

        }

        xmlWriter.WriteEndElement(); //</pages>
        xmlWriter.WriteEndElement(); //</worksheet>

        xmlWriter.WriteEndDocument();
        xmlWriter.Close();
        xmlWriter.Dispose();
    }
}
