using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadiverseCourseCreator.CourseContent.Scenarios.Scripts
{
    public class ScenarioCondition
    {
        public enum ConditionType
        {
            PlayerDeath,
            NPCDeath,
            EntitiesDestroyed,
            ValueReachesNumber
        }

        private ConditionType type;
        private object[]? parameters;

        public ConditionType Type
        {
            get => type; set => type = value;
        }
#pragma warning disable CS8603 // Possible null reference return.
        public object[] Parameters
        {
            get => parameters; set => parameters = value;
        }
#pragma warning restore CS8603 // Possible null reference return.
    }
}
