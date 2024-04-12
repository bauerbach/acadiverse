using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadiverseCourseCreator.CourseContent.Scenarios.Scripts.ScriptArguments;
public abstract class ScriptArgument
{
    private string name = "";

    public string Name
    {
        get => name;
        set => name = value;
    }

    public ScriptArgument(string name)
    {
        Name = name;
    }

    public abstract object ValidateArgument();
}
