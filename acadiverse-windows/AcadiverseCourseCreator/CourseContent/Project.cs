using MahApps.Metro.Controls;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Xml;
using System.Security.Cryptography;
using System.Runtime.InteropServices;
using AcadiverseCourseCreator.CourseContent.Scenarios;
using AcadiverseCourseCreator.Dialogs;
using AcadiverseCourseCreator.Panels;
using Ookii.Dialogs.Wpf;
using System.Diagnostics;

namespace AcadiverseCourseCreator.CourseContent;

/// <summary>
/// Represents an Acadiverse Course Creator project.
/// </summary>
public class Project : IEquatable<Project?>
{
    private string name = "";
    private string description = "";
    private string tags = "";
    private byte targetedGroup = 1;
    private bool matureContent = false;
    private byte minGrade = 0;
    private byte maxGrade = 11;
    private string password = "";
    private List<CourseChapter> chapters = new();
    private Dictionary<string, MetroTabItem> openTabs = new();

    /// <summary>
    /// The name of the project as shown in the Project Hierarchy as well as on the submission details page when the project is published.
    /// </summary>
    public string Name
    {
        get => name; set => name = value;
    }

    /// <summary>
    /// The project description as shown in the Project Properties Panel and the submission details page of a published project.
    /// </summary>
    public string Description
    {
        get => description; set => description = value;
    }

    /// <summary>
    /// The tags used to refer to the project when it is published; this also shows up under Project Properties.
    /// </summary>
    public string Tags
    {
        get => tags; set => tags = value;
    }

    /// <summary>
    /// The targeted group for the project.
    /// </summary>
    public byte TargetedGroup
    {
        get => targetedGroup; set
        {
            if (value >= 0 && value <= 3)
            {
                targetedGroup = value;
            }
            else
            {
                throw new InvalidDataException("The value \"" + value + "\" is not a valid ID for the Targeted Group.");
            }
        }
    }

    /// <summary>
    /// Whether or not the project has been marked as having mature content.
    /// </summary>
    public bool MatureContent
    {
        get => matureContent; set => matureContent = value;
    }

    /// <summary>
    /// The hash of the project password; an ampty string means that there is no password for the project.
    /// </summary>
    public string Password
    {
        get => password; set => password = value;
    }

    /// <summary>
    /// A list of chapters (collections of worksheets, scenarios, and quizzes) for the project.
    /// </summary>
    public List<CourseChapter> Chapters
    {
        get => chapters; set => chapters = value;
    }

    /// <summary>
    /// The minimum recommended grade for the course; a value of 0 is used to represent kindergarten and values over 12 represent college.
    /// </summary>
    public byte MinGrade
    {
        get => minGrade; set => minGrade = value;
    }

    /// <summary>
    /// The maximum recommended grade for the course; a value of 0 is used to represent kindergarten and values over 12 represent college.
    /// </summary>
    public byte MaxGrade
    {
        get => maxGrade; set => maxGrade = value;
    }

    public override bool Equals(object? obj)
    {
        return Equals(obj as Project);
    }

    public bool Equals(Project? other)
    {
        return other != null &&
               name == other.name &&
               description == other.description &&
               tags == other.tags &&
               password == other.password &&
               EqualityComparer<List<CourseChapter>>.Default.Equals(chapters, other.chapters) &&
               Name == other.Name &&
               Description == other.Description &&
               Tags == other.Tags &&
               Password == other.Password &&
               EqualityComparer<List<CourseChapter>>.Default.Equals(Chapters, other.Chapters);
    }

    public override int GetHashCode()
    {
        HashCode hash = new();
        hash.Add(name);
        hash.Add(description);
        hash.Add(tags);
        hash.Add(password);
        hash.Add(chapters);
        hash.Add(Name);
        hash.Add(Description);
        hash.Add(Tags);
        hash.Add(Password);
        hash.Add(Chapters);
        return hash.ToHashCode();
    }

    public static bool operator ==(Project? left, Project? right)
    {
        return EqualityComparer<Project>.Default.Equals(left, right);
    }

    public static bool operator !=(Project? left, Project? right)
    {
        return !(left == right);
    }


    public static Project? Load(string path)
    {
        Project? project = null;
        var projectRestored = false;
        var dir = "";
        XmlReader? xmlReader1 = null, xmlReader2 = null, xmlReader3 = null;
        try
        {

            dir = Path.GetTempPath() + @"\AcadiverseCourseCreator\" + Path.GetFileNameWithoutExtension(path); //Get the path for the temporary folder used by Acadiverse Course Creator and append the project name to it.
            Directory.CreateDirectory(dir); //Create a temporary directory for the project files using the path.
            ZipFile.ExtractToDirectory(path, dir);

            if (File.Exists(dir + @"\HASH"))
            {
                var projectPasswordWindow = new PasswordWindow
                {
                    CorrectPassword = File.ReadAllText(dir + @"\HASH"),
                    Header = "A password has been set for this project. Please enter this password to continue.",
                    WindowText = "Enter Project Password",
                    Mode = PasswordWindow.PasswordWindowMode.EnterPassword
                };
                if (projectPasswordWindow.ShowDialog() == true)
                {
                    Globals.ZeroMemoryFileDecrypt(dir + @"\project.aes", dir + @"\project.acavcp", projectPasswordWindow.EnteredPassword);
                    Globals.ZeroMemoryFileDecrypt(dir + @"\chapters.aes", dir + @"\chapters.zip", projectPasswordWindow.EnteredPassword);
                }
                else
                {
                    project = null;
                }
                ZipFile.ExtractToDirectory(dir + @"\chapters.zip", dir + @"\chapters");

                xmlReader1 = XmlReader.Create(dir + @"\project.acavcp");
                while (!xmlReader1.EOF) //While the XmlReader instance for the project is not at EOF...
                {
                    if (!xmlReader1.EOF)
                    {
                        xmlReader1.Read(); //Read the next tag or content in the file.
                        switch (xmlReader1.Name) //Switch for the tag the XmlReader is currently on.
                        {
                            case "project": //<project> tag.
                                var name = xmlReader1.GetAttribute("name");
                                var description = xmlReader1.GetAttribute("description");
                                var tags = xmlReader1.GetAttribute("tags");

                                if (name is not null && description is not null && tags is not null) //If the attributes for the "project" tag are not null...
                                {
                                    project = new Project //Create a new Project instance based on the attributes.
                                    {
                                        Name = name,
                                        Description = description,
                                        Tags = tags,
                                        MinGrade = Convert.ToByte(xmlReader1.GetAttribute("minGrade")),
                                        MaxGrade = Convert.ToByte(xmlReader1.GetAttribute("maxGrade")),
                                        MatureContent = Convert.ToBoolean(xmlReader1.GetAttribute("matureContent")),
                                        TargetedGroup = Convert.ToByte(xmlReader1.GetAttribute("targetedGroup")),
                                        openTabs = new Dictionary<string, MetroTabItem>()
                                    };
                                }
                                break;
                            case "chapter": //<chapter> tag.
                                var title = xmlReader1.GetAttribute("title");
                                CourseChapter chapter = new CourseChapter(); //Create a new CourseChapter instance.
                                if (title is not null) //If the title attribute is not null...
                                {
                                    xmlReader2 = XmlReader.Create(dir + @"\chapters\" + chapter.Title + @"\chapter.acavch"); //Create a new XmlReader instance for the chapter.
                                    while (!xmlReader2.EOF)
                                    {
                                        if (!xmlReader2.EOF)
                                        {


                                        }
                                    }
                                    if (project is not null && chapter is not null) //If the project and chapter is not null...
                                    {
                                        project.Chapters.Add(chapter); //Add the CourseChapter to the project.
                                    }
                                }
                                break;
                            case "tab": //<tab> tag.
                                
                                var tabName = xmlReader1.GetAttribute("name");
                                var tab = new MetroTabItem();
                                var type = xmlReader1.GetAttribute("content");

                                if (type is not null) //If the type attribute is not null...
                                {
                                    tab.Content = type switch //Switch for type attribute.
                                    {
                                        "ProjectPropertiesPanel" => new ProjectPropertiesPanel(),
                                        "WorksheetPanel" => new WorksheetPanel(),
                                        "QuizPanel" => new QuizPanel(),
                                        "ScenarioPanel" => new ScenarioPanel(),
                                        _ => throw new InvalidOperationException(),
                                    };
                                }
                                break;
                            default: //Any other tag.
                                if (xmlReader1.Name != "chapters" && xmlReader1.Name != "openTabs") //If the tag is not the start of the chapters or openTabs collection.
                                {
                                    throw (new InvalidOperationException()); //Throw an exception due to invalid tags.
                                }
                                break;
                        }
                    }
                }
            }
        }
        catch
        {
            TaskDialog taskDialog = new TaskDialog //Create a new TaskDialog for the "corrupted project" message.
            {
                MainInstruction = "The project could not be loaded.",
                Content = "Acadiverse Course Creator was unable to load this project. It may have been corrupted or damaged.",
                ButtonStyle = TaskDialogButtonStyle.CommandLinks,
                MainIcon = TaskDialogIcon.Error,
                WindowTitle = "Acadiverse Course Creator"
            };
            TaskDialogButton repairProjectButton = new TaskDialogButton { Text = "Repair Project", CommandLinkNote = "Attempt to repair the project." }; //"Repair Project" button.
            TaskDialogButton restoreProjectButton = new TaskDialogButton { Text = "Restore Project", CommandLinkNote = "Attempt to restore the project from a synced version or local backup." }; //"Restore Project" button.
            TaskDialogButton cancelLoadButton = new TaskDialogButton { Text = "Cancel Load", CommandLinkNote = "Cancel loading this project." }; //"Cancel Load" button.
            taskDialog.Buttons.Add(repairProjectButton);
            taskDialog.Buttons.Add(restoreProjectButton);
            taskDialog.Buttons.Add(cancelLoadButton);
            taskDialog.ButtonClicked += (sender, args) =>
            {
                switch (args.Item.Text) //Text of button that was clicked.
                {
                    case "Repair Project":
                        //TODO: Insert code to attempt to repair the project.
                        break;
                    case "Restore Project":
                        try
                        {
                            //TODO: Insert code for attempting to restore from synced backups.
                            if (MessageBox.Show("Successfully restored from backup. Do you want to try loading the project again?", "Acadiverse Course Creator", MessageBoxButton.YesNo, MessageBoxImage.Question) == MessageBoxResult.Yes)
                            {
                                projectRestored = true;
                            }
                        }
                        catch
                        {
                            if (MessageBox.Show("Restoring synced backup failed. Do you want to try restoring a local backup?", "Acadiverse Course Creator", MessageBoxButton.YesNo, MessageBoxImage.Error) == MessageBoxResult.Yes)
                            {
                                try
                                {
                                    var backupDirectory = path.Replace("Projects", "Backups/ProjectBackups");
                                    File.Copy(backupDirectory, path);
                                    if (MessageBox.Show("Successfully restored from backup. Do you want to try loading the project again?", "Acadiverse Course Creator", MessageBoxButton.YesNo, MessageBoxImage.Question) == MessageBoxResult.Yes)
                                    {
                                        projectRestored = true;
                                    }
                                }
                                catch
                                {
                                    MessageBox.Show("Restoring from local backup failed.", "Acadiverse Course Creator", MessageBoxButton.OK, MessageBoxImage.Error);
                                }
                            }
                        }
                        break;
                }
            };
            taskDialog.ShowDialog();
        }
        finally
        {
            if (xmlReader1 is not null)
            {
                xmlReader1.Close();
                xmlReader1.Dispose();
            }
            if (xmlReader2 is not null)
            {
                xmlReader2.Close();
                xmlReader2.Dispose();
            }
            if (xmlReader3 is not null)
            {
                xmlReader3.Close();
                xmlReader3.Dispose();
            }
            if (Directory.Exists(dir))
            {
                Directory.Delete(dir);
            }
            if (projectRestored)
            {
                Load(path);
            }
        }
        return project;
    }

    public void Save(string path)
    {
        XmlWriter? xmlWriter1 = null;
        XmlWriter? xmlWriter2 = null;
        try
        {
            var savePath = path;
            var dir = Path.GetTempPath() + @"\AcadiverseCourseCreator\" + Name; //Get the path for the temporary folder used by Acadiverse Course Creator and append the project name to it.
            Directory.CreateDirectory(dir); //Create a temporary directory for the project files using the path.

            xmlWriter1 = XmlWriter.Create(dir + @"\project.acavcp"); //Create a new XML document for the project.

            xmlWriter1.WriteStartDocument();

            if (Password != "")
            {
                File.WriteAllText("HASH", BCrypt.Net.BCrypt.HashPassword(Password));
            }

            //<project name="[name]" description="[description]" tags="[tags]" minGrade="[minGrade]" maxGrade="[maxGrade]">
            xmlWriter1.WriteStartElement("project");
            xmlWriter1.WriteAttributeString("name", Name);
            xmlWriter1.WriteAttributeString("description", Description);
            xmlWriter1.WriteAttributeString("tags", Tags);
            xmlWriter1.WriteAttributeString("minGrade", minGrade.ToString());
            xmlWriter1.WriteAttributeString("maxGrade", maxGrade.ToString());
            xmlWriter1.WriteAttributeString("matureContent", matureContent.ToString());
            xmlWriter1.WriteAttributeString("targetedGroup", targetedGroup.ToString());

            xmlWriter1.WriteStartElement("openTabs"); //<openTabs>

            foreach (var key in openTabs.Keys)
            {

                //<tab name="[name]" content="[content]"/>
                xmlWriter1.WriteStartElement("tab");
                xmlWriter1.WriteAttributeString("name", key);
                xmlWriter1.WriteAttributeString("content", openTabs[key].GetType().Name);

            }

            xmlWriter1.WriteEndElement(); //</openTabs>

            xmlWriter1.WriteStartElement("chapters"); //<chapters>

            Directory.CreateDirectory(dir + @"\chapters"); //Create a subdirectory for project chapters with the temporary path.
            foreach (var chapter in Chapters) //For each chapter in the project...
            {
                //<chapter title="[title]"/>
                xmlWriter1.WriteStartElement("chapter");
                xmlWriter1.WriteAttributeString("title", chapter.Title);
                xmlWriter1.WriteEndElement();

                Directory.CreateDirectory(dir + @"\chapters\" + chapter.Title); //Create a directory with the chapter title.
                xmlWriter2 = XmlWriter.Create(dir + @"\chapters\" + chapter.Title + @"\chapter.acavch"); //Create a new XmlWriter object for the metadata file for the chapter.
                xmlWriter2.WriteStartDocument(); //Write the starting element for the document.

                //<chapter>
                xmlWriter2.WriteStartElement("chapter");

                foreach (var item in chapter.Contents)
                {
                    //<item name="[name]" type="[type]" />
                    xmlWriter2.WriteStartElement("item");
                    xmlWriter2.WriteAttributeString("name", item.Name);
                    xmlWriter2.WriteAttributeString("type", item.GetType().Name);
                    xmlWriter2.WriteEndElement();

                    if (item.GetType() == typeof(Worksheet)) //If the chapter item is a worksheet...
                    {
                        var worksheet = (Worksheet)item;
                        var worksheetPath = dir + @"\chapters\" + chapter.Title + @"\";
                        worksheet.Save(worksheetPath + worksheet.Name + @"\.acavw");
                    }
                    if (item.GetType() == typeof(Quiz)) //If the course item is a quiz...
                    {
                        var quiz = (Quiz)item;
                        var quizPath = dir + @"\chapters\" + chapter.Title + @"\";
                        quiz.Save(quizPath + quiz.Name + @"\.acavq");
                    }
                    if (item.GetType() == typeof(Scenario))
                    {
                        var scenario = (Scenario)item;
                        var scenarioPath = dir + @"\chapters" + chapter.Title + @"\";
                        scenario.Save(scenarioPath + @"\.acavs");
                    }
                }

                xmlWriter2.WriteEndElement(); //</chapter>                  
                xmlWriter2.WriteEndDocument();
                xmlWriter2.Close();
                xmlWriter2.Dispose();
            }
            xmlWriter1.WriteEndElement(); //</chapters>
            xmlWriter1.WriteEndElement(); //</project>
            xmlWriter1.WriteEndDocument();
            xmlWriter1.Close();
            xmlWriter1.Dispose();

            File.Delete(savePath);
            if (Password != "")
            {
                ZipFile.CreateFromDirectory(dir + @"\chapters", dir + @"\chapters.zip");
                Directory.Delete(dir + @"\chapters", true);
                Globals.ZeroMemoryFileEncrypt(dir + @"\chapters.zip", Password);
                File.Delete(dir + @"\chapters.zip");
                Globals.ZeroMemoryFileEncrypt(dir + @"\project.acavcp", Password);
                File.Delete(dir + @"\project.acavcp");
            }
            ZipFile.CreateFromDirectory(dir, savePath);
        }
        catch (Exception ex)
        {
            Globals.WriteToLog(ex.ToString());
            MessageBox.Show(
                "The project could not be saved due to the following error: " + ex.Message + " Please try saving again. If the problem persists, please contact Acadiverse support.",
                "Acadiverse Course Creator",
                MessageBoxButton.OK,
                MessageBoxImage.Error
           );
        }
        finally
        {
            if (xmlWriter1 != null)
            {
                xmlWriter1.Close();
                xmlWriter1.Dispose();
            }
            if (xmlWriter2 != null)
            {
                xmlWriter2.Close();
                xmlWriter2.Dispose();
            }
            if (Directory.Exists(Path.GetTempPath() + @"\AcadiverseCourseCreator\" + Name))
            {
                Directory.Delete(Path.GetTempPath() + @"\AcadiverseCourseCreator\" + Name, true);
            }
        }
    }
}