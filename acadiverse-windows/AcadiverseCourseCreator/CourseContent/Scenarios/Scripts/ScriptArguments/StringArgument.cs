using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadiverseCourseCreator.CourseContent.Scenarios.Scripts.ScriptArguments;
public class StringArgument : ScriptArgument
{
    private string value = "";

    public string Value
    {
        get => value is not null ? value : "";
        set => this.value = value;
    }

    public StringArgument(string name) : base(name)
    {

    }

    

    public override object ValidateArgument()
    {
        return Value is not null ? Value : "";
    }
}
