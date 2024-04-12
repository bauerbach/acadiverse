using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadiverseLib.Models;

public class Comment
{
    private string commenter;
    private DateTime date;
    private string context;
    private int likes;
    private bool edited;
    private string[] replies;
    private string text;

    public string Commenter
    {
        get => commenter; set => commenter = value;
    }
    public DateTime Date
    {
        get => date; set => date = value;
    }
    public string Context
    {
        get => context; set => context = value;
    }
    public int Likes
    {
        get => likes; set => likes = value;
    }
    public bool Edited
    {
        get => edited; set => edited = value;
    }
    public string[] Replies
    {
        get => replies; set => replies = value;
    }
    public string Text
    {
        get => text; set => text = value;
    }
}
