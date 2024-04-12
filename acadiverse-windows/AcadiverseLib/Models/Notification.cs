using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadiverseLib.Models;

public class Notification
{
    private DateTime date;
    private bool read;
    private string text;

    public DateTime Date
    {
        get => date; set => date = value;
    }
    public bool Read
    {
        get => read; set => read = value;
    }
    public string Text
    {
        get => text; set => text = value;
    }
}