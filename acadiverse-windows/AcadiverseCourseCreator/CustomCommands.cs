using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace AcadiverseCourseCreator;

public class CustomCommands
{
    public static readonly RoutedUICommand SaveAsCommand = new (
        "SaveAs",
        "Save As...",
        typeof(CustomCommands),
        new InputGestureCollection()
        {
            new KeyGesture(Key.S, ModifierKeys.Control | ModifierKeys.Shift)
        }
    );

    public static readonly RoutedUICommand BackUpNowCommand = new (
        "BackUpNow",
        "Back Up Now",
        typeof(CustomCommands),
        new InputGestureCollection()
        {
            new KeyGesture(Key.S, ModifierKeys.Control | ModifierKeys.Alt)
        }
    );

    public static readonly RoutedUICommand AddWorksheetCommand = new (
        "AddWorksheet",
        "Add Worksheet",
        typeof(CustomCommands),
        new InputGestureCollection()
        {
            new KeyGesture(Key.N, ModifierKeys.Control | ModifierKeys.Alt)
        }
    );

    public static readonly RoutedUICommand AddScenarioCommand = new (
        "AddScenario",
        "Add Scenario",
        typeof(CustomCommands),
        new InputGestureCollection()
        {
            new KeyGesture(Key.N, ModifierKeys.Alt)
        }
    );

    public static readonly RoutedUICommand AddQuizCommand = new (
        "AddQuiz",
        "Add Quiz",
        typeof(CustomCommands),
        new InputGestureCollection()
        {
            new KeyGesture(Key.N, ModifierKeys.Control | ModifierKeys.Shift)
        }
    );

    public static readonly RoutedUICommand CloseCurrentTabCommand = new (
        "CloseTab",
        "CloseTab",
        typeof(CustomCommands),
        new InputGestureCollection()
        {
            new KeyGesture(Key.W, ModifierKeys.Control)
        }
    );
}
