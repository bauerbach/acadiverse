using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadiverseCourseCreator;

public class UndoBuffer
{
    private readonly string filePath = "";
    private int maxUndos = 10;
    private int undoIndex = 0;
    public List<string[]> objectStates = new();
    public List<object> programObjects = new();

    public int MaxUndos { get => maxUndos; set => maxUndos = value; }

    /// <summary>
    /// Initializes a new UndoBuffer object.
    /// </summary>
    /// <param name="maxUndos">The maximum number of allowed undos.</param>
    /// <param name="programObjects">The list of object states.</param>
    public UndoBuffer(List<object> programObjects, int maxUndos)
    {
        MaxUndos = maxUndos;
        this.programObjects = programObjects;
    }

    public delegate void UndoRedoEventHandler(object sender, UndoRedoEventArgs e);

    /// <summary>
    /// Deletes the temporary file associated with the current UndoBuffer object.
    /// </summary>
    ~UndoBuffer()
    {
        if (filePath != "")
        {
            File.Delete(filePath);
        }
        
    }

    /// <summary>
    /// Occurs when the Undo method is invoked.
    /// </summary>
    public event UndoRedoEventHandler? OnUndo;

    /// <summary>
    /// Occurs when the Redo method is invoked.
    /// </summary>
    public event UndoRedoEventHandler? OnRedo;

    /// <summary>
    /// Reverts the state of all objects in the object list to the previous state.
    /// </summary>
    public void Undo()
    {
        if (programObjects is not null && objectStates is not null)
        {
            undoIndex--;
            OnUndo?.Invoke(this, new UndoRedoEventArgs(undoIndex));
            var objects = new string[programObjects.Count]; //Used for saving the current state of the objects to the objectStates list.
            for (var i = 0; i < objects.Length; i++)
            {
                objects[i] = programObjects[i].ToString()!;
            }
            objectStates.Add(objects);
        }
        
    }

    /// <summary>
    /// Reverts the objects in the object list to the state before the Undo method was invoked.
    /// </summary>
    public void Redo()
    {
        if (programObjects is not null && objectStates is not null)
        {
            undoIndex++;
            OnRedo?.Invoke(this, new UndoRedoEventArgs(undoIndex));
            var objects = new string[programObjects.Count]; //Used for saving the current state of the objects to the objectStates list.
            for (var i = 0; i < objects.Length; i++)
            {
                objects[i] = programObjects[i].ToString()!;
            }
            var j = undoIndex;
            while (j < objectStates.Count) //Remove the arrays after the current undo index.
            {
                objectStates.RemoveAt(j);
            }
            objectStates.Add(objects);
        }
    }
}
