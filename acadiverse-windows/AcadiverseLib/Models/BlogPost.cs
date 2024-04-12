using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadiverseLib.Models;

public class BlogPost
{
    private string id;
    private string name;
    private string author;
    private DateTime date_created;
    private string[] comments;
    private string post_contents;
    private string image;
    private bool isLocked;
    public string Id
    {
        get => id; set => id = value;
    }
    public string Name
    {
        get => name; set => name = value;
    }
    public string Author
    {
        get => author; set => author = value;
    }
    public DateTime Date_Created
    {
        get => date_created; set => date_created = value;
    }
    public string[] Comments
    {
        get => comments; set => comments = value;
    }
    public string Post_Contents
    {
        get => post_contents; set => post_contents = value;
    }
    public string Image
    {
        get => image; set => image = value;
    }
    public bool IsLocked
    {
        get => isLocked; set => isLocked = value;
    }
}
