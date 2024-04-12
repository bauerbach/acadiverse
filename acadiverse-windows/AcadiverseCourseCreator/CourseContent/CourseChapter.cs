using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadiverseCourseCreator.CourseContent;

/// <summary>
/// Represents a collection of different types of Acadiverse course content.
/// </summary>
public class CourseChapter
{
    private string title = "";
    private List<CourseItem> contents = new();

    /// <summary>
    /// The title of this chapter.
    /// </summary>
    public string Title
    {
        get => title; set => title = value;
    }

    /// <summary>
    /// A list of the contents of this chapter.
    /// </summary>
    public List<CourseItem> Contents
    {
        get => contents; set => contents = value;
    }
}