using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using AcadiverseCourseCreator.CourseContent.Scenarios.Scripts;

namespace AcadiverseCourseCreator.CourseContent.Scenarios
{
    public class Scenario : CourseItem
    {

        private List<NPC>? npcs;

        private ScenarioScript? scenarioStarted;
        private ScenarioScript? scenarioWin;
        private ScenarioScript? scenarioLoss;

        private ScenarioCondition[]? winConditions;
        private ScenarioCondition[]? loseConditions;

#pragma warning disable CS8603 // Possible null reference return.
        public List<NPC> NPCs
        {
            get => npcs; set => npcs = value;
        }

        public ScenarioScript ScenarioStarted
        {
            get => scenarioStarted; set => scenarioStarted = value;
        }
        public ScenarioScript ScenarioWin
        {
            get => scenarioWin; set => scenarioWin = value;
        }
        public ScenarioScript ScenarioLoss
        {
            get => scenarioLoss; set => scenarioLoss = value;
        }
        public ScenarioCondition[] WinConditions
        {
            get => winConditions; set => winConditions = value;
        }
        public ScenarioCondition[] LoseConditions
        {
            get => loseConditions; set => loseConditions = value;
        }
#pragma warning restore CS8603 // Possible null reference return.

        public static Scenario Load()
        {
            Scenario? scenario = null;
            XmlReader? xmlReader = null;

            try
            {

            }
            catch (Exception)
            {
                if (xmlReader != null)
                {
                    xmlReader.Close();
                    xmlReader.Dispose();
                }
                throw;
            }
#pragma warning disable CS8603 // Possible null reference return.
            return scenario;
#pragma warning restore CS8603 // Possible null reference return.
        }

        public override void Save(string path)
        {
            var xmlWriter = XmlWriter.Create(path);
            xmlWriter.WriteStartDocument();
            xmlWriter.WriteStartElement("scenario");
            xmlWriter.WriteAttributeString("name", Name);



            xmlWriter.WriteEndElement();
            xmlWriter.WriteEndDocument();
            xmlWriter.Close();
            xmlWriter.Dispose();
        }
    }
}
