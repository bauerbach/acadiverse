using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadiverseLib.Models;

public class CourseProject
{
    private string name;
    private string description;
    private string[] tags;
    private CourseProjectCollaborator[] collaborators;
    private string url;

    public string Name
    {
        get => name; set => name = value;
    }
    public string Description
    {
        get => description; set => description = value;
    }
    public string[] Tags
    {
        get => tags; set => tags = value;
    }
    public CourseProjectCollaborator[] Collaborators
    {
        get => collaborators; set => collaborators = value;
    }
    public string Url
    {
        get => url; set => url = value;
    }
}
