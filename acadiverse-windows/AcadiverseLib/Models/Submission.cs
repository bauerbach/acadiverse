using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadiverseLib.Models;

public class Submission
{
    private string id;
    private string title;
    private string description;
    private string[] tags;
    private string author;
    private string submission_type;
    private DateTime date_created;
    private DateTime last_updated;
    private string[] comments;
    private int upvotes;
    private int favorites;
    private int downvotes;
    private int min_grade;
    private int max_grade;
    private int category_id;
    private bool mature_content;
    private bool is_hidden;
    private bool is_featured;
    private bool is_exclusive;
    private bool is_discontinued;
    private bool is_seasonal;
    private DateTime season_begin;
    private DateTime season_end;
    private string set_name;
    private int price;
    private string url;

    public string Id
    {
        get => id; set => id = value;
    }
    public string Title
    {
        get => title; set => title = value;
    }
    public string Description
    {
        get => description; set => description = value;
    }
    public string[] Tags
    {
        get => tags; set => tags = value;
    }
    public string Author
    {
        get => author; set => author = value;
    }
    public string Submission_Type
    {
        get => submission_type; set => submission_type = value;
    }
    public DateTime Date_Created
    {
        get => date_created; set => date_created = value;
    }
    public DateTime Last_Updated
    {
        get => last_updated; set => last_updated = value;
    }
    public string[] Comments
    {
        get => comments; set => comments = value;
    }
    public int Upvotes
    {
        get => upvotes; set => upvotes = value;
    }
    public int Favorites
    {
        get => favorites; set => favorites = value;
    }
    public int Downvotes
    {
        get => downvotes; set => downvotes = value;
    }
    public int Min_Grade
    {
        get => min_grade; set => min_grade = value;
    }
    public int Max_Grade
    {
        get => max_grade; set => max_grade = value;
    }
    public int Category_Id
    {
        get => category_id; set => category_id = value;
    }
    public bool Mature_Content
    {
        get => mature_content; set => mature_content = value;
    }
    public bool Is_Hidden
    {
        get => is_hidden; set => is_hidden = value;
    }
    public bool Is_Featured
    {
        get => is_featured; set => is_featured = value;
    }
    public bool Is_Exclusive
    {
        get => is_exclusive; set => is_exclusive = value;
    }
    public bool Is_Discontinued
    {
        get => is_discontinued; set => is_discontinued = value;
    }
    public bool Is_Seasonal
    {
        get => is_seasonal; set => is_seasonal = value;
    }
    public DateTime Season_Begin
    {
        get => season_begin; set => season_begin = value;
    }
    public DateTime Season_End
    {
        get => season_end; set => season_end = value;
    }
    public string Set_Name
    {
        get => set_name; set => set_name = value;
    }
    public int Price
    {
        get => price; set => price = value;
    }
    public string Url
    {
        get => url; set => url = value;
    }

}