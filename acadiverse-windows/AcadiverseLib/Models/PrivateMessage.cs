using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadiverseLib.Models;

public class PrivateMessage
{
    private string contents;
    private bool read;
    private DateTime date;

    public string Contents
    {
        get => contents; set => contents = value;
    }
    public bool Read
    {
        get => read; set => read = value;
    }
    public DateTime Date
    {
        get => date; set => date = value;
    }
}
