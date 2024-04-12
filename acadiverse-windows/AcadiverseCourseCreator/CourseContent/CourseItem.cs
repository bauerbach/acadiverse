using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadiverseCourseCreator.CourseContent
{
    /// <summary>
    /// Base class for Acadiverse course content.
    /// </summary>
    public abstract class CourseItem
    {
        private string name = "";

        public string Name
        {
            get => name; set => name = value;
        }

        public abstract void Save(string path);
    }
}
