namespace Acadiverse_Course_Creator_Bug_Reporter;

internal static class Program
{
    /// <summary>
    ///  The main entry point for the application.
    /// </summary>
    [STAThread]
    public static void Main(string[] args)
    {
        // To customize application configuration such as set high DPI settings or default font,
        // see https://aka.ms/applicationconfiguration.
        ApplicationConfiguration.Initialize();
        string? logFile = null, problem = null;

        if (args.Length == 2)
        {
            logFile = args[0];
            problem = args[1];
        }

        if (logFile is not null && problem is not null)
        {
            FrmMain frmMain = new FrmMain
            {
                logPath = logFile,
                problem = problem
            };
            Application.Run(frmMain);
        }
        else
        {
            Application.Run(new FrmMain());
        }
    }
}