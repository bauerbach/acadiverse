using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadiverseLib.Models;

public class Avatar
{
    private int skinColor;
    private string hat;
    private string hairStyle;
    private string facialHair;
    private string eyewear;
    private string top;
    private string bottom;
    private string footwear;
    public int SkinColor
    {
        get => skinColor; set => skinColor = value;
    }
    public string Hat
    {
        get => hat; set => hat = value;
    }
    public string HairStyle
    {
        get => hairStyle; set => hairStyle = value;
    }
    public string FacialHair
    {
        get => facialHair; set => facialHair = value;
    }
    public string Eyewear
    {
        get => eyewear; set => eyewear = value;
    }
    public string Top
    {
        get => top; set => top = value;
    }
    public string Bottom
    {
        get => bottom; set => bottom = value;
    }
    public string Footwear
    {
        get => footwear; set => footwear = value;
    }
}
