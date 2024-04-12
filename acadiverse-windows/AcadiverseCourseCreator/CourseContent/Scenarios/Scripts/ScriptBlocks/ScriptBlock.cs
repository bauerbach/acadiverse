using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadiverseCourseCreator.CourseContent.Scenarios.Scripts.ScriptBlocks;
public abstract class ScriptBlock
{
    private List<ScriptBlock>? content;
    private string text = "";

    public ScriptBlock()
    {
        Content = new List<ScriptBlock>();
    }

    public List<ScriptBlock> Content
    {
        get => content is not null ? content : new List<ScriptBlock>();
        set => content = value;
    }
    public string Text
    {
        get => text;
        set => text = value;
    }

    public abstract string GetLuaCode();
}
