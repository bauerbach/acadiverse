using System;

namespace AcadiverseCourseCreator
{
    public class UndoRedoEventArgs : EventArgs
    {
        public UndoRedoEventArgs(int data)
        {
            NewUndoIndex = data;
        }

        public int NewUndoIndex { get; } = 0;
    }
}