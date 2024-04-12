using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AcadiverseCourseCreator.CourseContent;

namespace AcadiverseCourseCreator
{
    public class ComponentModifiedEventArgs : EventArgs
    {
        private CourseItem? component;

        public CourseItem Component
        {
            get => component;
            set => component = value;
        }

        public ComponentModifiedEventArgs(CourseItem component)
        {
            Component = component;
        }
    }
}
