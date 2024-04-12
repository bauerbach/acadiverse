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
using AcadiverseCourseCreator.CourseContent;

namespace AcadiverseCourseCreator
{
    /// <summary>
    /// Interaction logic for WorksheetPanel.xaml
    /// </summary>
    public partial class WorksheetPanel : UserControl
    {
        private Worksheet currentComponent = new Worksheet();
        public event EventHandler<ComponentModifiedEventArgs>? WorksheetModified;

        public WorksheetPanel()
        {
            InitializeComponent();
        }

        public Worksheet CurrentComponent
        {
            get => currentComponent;
            set
            {
                currentComponent = value;
                var worksheet = new FlowDocument
                {
                    PageHeight = 1056,
                    PageWidth = 816
                };
                rtbWorksheet.Document = worksheet;
            }
        }

        private void RtbWorksheet_TextChanged(object sender, EventArgs e)
        {
            WorksheetModified?.Invoke(this, new ComponentModifiedEventArgs(currentComponent));
        }
    }
}
