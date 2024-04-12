using System;
using System.Collections.Generic;
using System.IO;
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
using System.Windows.Shapes;

namespace AcadiverseCourseCreator;
/// <summary>
/// Interaction logic for SelectMusicTrackWindow.xaml
/// </summary>
public partial class SelectMusicTrackWindow : Window
{
    public SelectMusicTrackWindow()
    {
        InitializeComponent();
    }

    private void lstMusicTracks_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        mdePreview.Source = new Uri("file://" + AppDomain.CurrentDomain.BaseDirectory + @"\data\music\" + lstMusicTracks.SelectedItem + @"\.mp3");
    }

    private void SelectMusicTrackWindow_Loaded(object sender, RoutedEventArgs e)
    {
        foreach (string filename in Directory.GetFiles(AppDomain.CurrentDomain.BaseDirectory + @"\data\music\"))
        {
            if (System.IO.Path.GetExtension(filename) == ".mp3")
            {
                lstMusicTracks.Items.Add(System.IO.Path.GetFileNameWithoutExtension(filename));
            }
        }
    }
}
