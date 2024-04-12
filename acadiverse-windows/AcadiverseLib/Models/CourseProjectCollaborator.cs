using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadiverseLib.Models;

public class CourseProjectCollaborator
{
    private string collaborator;
    private bool is_owner;

    public string Collaborator
    {
        get => collaborator; set => collaborator = value;
    }
    public bool Is_Owner
    {
        get => is_owner; set => is_owner = value;
    }
}
