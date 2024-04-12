using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace AcadiverseCourseCreator.CustomControls;
/// <summary>
/// Interaction logic for AvatarItemSelection.xaml
/// </summary>
public partial class AvatarItemSelection : UserControl
{
    public enum AvatarItemType
    {
        SkinColor, 
        Hat, 
        Hair, 
        Eyewear, 
        FacialHair, 
        Top, 
        Bottom, 
        Footwear
    }

    private AvatarItemType itemType = AvatarItemType.SkinColor;
    private string itemName = "NONE";

    public AvatarItemType ItemType
    {
        get => itemType;
        set 
        { 
            itemType = value;
            txtItemType.Text = itemType.ToString();
            if (itemType.ToString() == "SkinColor")
            {
                txtItemType.Text = "Skin Color";
            }
            if (itemType.ToString() == "FacialHair")
            {
                txtItemType.Text = "Facial Hair";
            }
        }
    }
    public string ItemName
    {
        get => itemName;
        set 
        { 
            itemName = value;
            txtItemName.Text = itemName;
        }
    }

    public AvatarItemSelection()
    {
        InitializeComponent();
    }

    private void AvatarItemSelection_Loaded(object sender, RoutedEventArgs e)
    {
        txtItemName.Text = itemName;
        txtItemType.Text = itemType.ToString();
        if (itemType.ToString() == "SkinColor")
        {
            txtItemType.Text = "Skin Color";
        }
        if (itemType.ToString() == "FacialHair")
        {
            txtItemType.Text = "Facial Hair";
        }
    }
}