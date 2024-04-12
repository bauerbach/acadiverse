using System;

namespace AcadiverseCourseCreator;

struct ProjectHierarchyItem
{
    string type = "";
    int index = 0;

    public ProjectHierarchyItem(string type, int index)
    {
        if (type == null)
        {
            throw new ArgumentException();
        }

        this.Type = type;
        this.Index = index;
    }

    public string Type
    {
        get => type;
        set => type = value;
    }

    public int Index
    {
        get => index;
        set => index = value;
    }
}
