using AcadiverseCourseCreator.CourseContent.Scenarios.Scripts;
using AcadiverseLib.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadiverseCourseCreator.CourseContent.Scenarios
{
    public class NPC
    {
        private string? name;
        private Avatar? avatar;

        private ScenarioScript? npcSpawned;
        private ScenarioScript? npcKilled;
        private ScenarioScript? npcAttacked;
        private ScenarioScript? npcInteractedWith;

#pragma warning disable CS8603 // Possible null reference return.
        public string Name
        {
            get => name; set => name = value;
        }
        public Avatar Avatar
        {
            get => avatar; set => avatar = value;
        }
        public ScenarioScript NPCSpawned
        {
            get => npcSpawned; set => npcSpawned = value;
        }
        public ScenarioScript NPCKilled
        {
            get => npcKilled; set => npcKilled = value;
        }
        public ScenarioScript NPCAttacked
        {
            get => npcAttacked; set => npcAttacked = value;
        }
        public ScenarioScript NPCInteractedWith
        {
            get => npcInteractedWith; set => npcInteractedWith = value;
        }
#pragma warning restore CS8603 // Possible null reference return.
    }
}
