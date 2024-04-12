using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadiverseCourseCreator.CourseContent.Scenarios.Scripts.ScriptBlocks;
public class SayBlock: ScriptBlock
{
    public SayBlock() : base()
    {
        this.Text = "Say ";
    }

    public override string GetLuaCode()
    {
        string luaCode = "";

        return luaCode;
    }
}
