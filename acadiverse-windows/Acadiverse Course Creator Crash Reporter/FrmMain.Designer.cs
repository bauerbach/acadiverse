namespace Acadiverse_Course_Creator_Bug_Reporter;

partial class FrmMain
{
    /// <summary>
    ///  Required designer variable.
    /// </summary>
    private System.ComponentModel.IContainer components = null;

    /// <summary>
    ///  Clean up any resources being used.
    /// </summary>
    /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
    protected override void Dispose(bool disposing)
    {
        if (disposing && (components != null))
        {
            components.Dispose();
        }
        base.Dispose(disposing);
    }

    #region Windows Form Designer generated code

    /// <summary>
    ///  Required method for Designer support - do not modify
    ///  the contents of this method with the code editor.
    /// </summary>
    private void InitializeComponent()
    {
        lblHeader = new Label();
        lblDescription = new Label();
        txtDCescription = new TextBox();
        lblEmail = new Label();
        txtEmail = new TextBox();
        button1 = new Button();
        button2 = new Button();
        lblReproduceProblem = new Label();
        txtReproduceProblem = new TextBox();
        SuspendLayout();
        // 
        // lblHeader
        // 
        lblHeader.AutoSize = true;
        lblHeader.Location = new Point(12, 9);
        lblHeader.Name = "lblHeader";
        lblHeader.Size = new Size(404, 15);
        lblHeader.TabIndex = 0;
        lblHeader.Text = "We're sorry to hear that you had a problem with Acadiverse Course Creator!";
        // 
        // lblDescription
        // 
        lblDescription.AutoSize = true;
        lblDescription.Location = new Point(12, 37);
        lblDescription.Name = "lblDescription";
        lblDescription.Size = new Size(269, 15);
        lblDescription.TabIndex = 1;
        lblDescription.Text = "Please provide a short description of the problem:";
        // 
        // txtDCescription
        // 
        txtDCescription.Location = new Point(12, 55);
        txtDCescription.Multiline = true;
        txtDCescription.Name = "txtDCescription";
        txtDCescription.Size = new Size(404, 102);
        txtDCescription.TabIndex = 2;
        // 
        // lblEmail
        // 
        lblEmail.AutoSize = true;
        lblEmail.Location = new Point(12, 308);
        lblEmail.Name = "lblEmail";
        lblEmail.Size = new Size(66, 15);
        lblEmail.TabIndex = 3;
        lblEmail.Text = "Your Email:";
        // 
        // txtEmail
        // 
        txtEmail.Location = new Point(12, 326);
        txtEmail.Name = "txtEmail";
        txtEmail.Size = new Size(275, 23);
        txtEmail.TabIndex = 4;
        // 
        // button1
        // 
        button1.Location = new Point(252, 361);
        button1.Name = "button1";
        button1.Size = new Size(75, 23);
        button1.TabIndex = 5;
        button1.Text = "Submit";
        button1.UseVisualStyleBackColor = true;
        // 
        // button2
        // 
        button2.Location = new Point(333, 361);
        button2.Name = "button2";
        button2.Size = new Size(75, 23);
        button2.TabIndex = 5;
        button2.Text = "Cancel";
        button2.UseVisualStyleBackColor = true;
        // 
        // lblReproduceProblem
        // 
        lblReproduceProblem.AutoSize = true;
        lblReproduceProblem.Location = new Point(12, 174);
        lblReproduceProblem.Name = "lblReproduceProblem";
        lblReproduceProblem.Size = new Size(260, 15);
        lblReproduceProblem.TabIndex = 1;
        lblReproduceProblem.Text = "Please describe the steps to reproduce the issue:";
        // 
        // txtReproduceProblem
        // 
        txtReproduceProblem.Location = new Point(12, 192);
        txtReproduceProblem.Multiline = true;
        txtReproduceProblem.Name = "txtReproduceProblem";
        txtReproduceProblem.Size = new Size(404, 102);
        txtReproduceProblem.TabIndex = 2;
        // 
        // Form1
        // 
        AutoScaleDimensions = new SizeF(7F, 15F);
        AutoScaleMode = AutoScaleMode.Font;
        ClientSize = new Size(420, 392);
        Controls.Add(button2);
        Controls.Add(button1);
        Controls.Add(txtEmail);
        Controls.Add(lblEmail);
        Controls.Add(txtReproduceProblem);
        Controls.Add(txtDCescription);
        Controls.Add(lblReproduceProblem);
        Controls.Add(lblDescription);
        Controls.Add(lblHeader);
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;
        Name = "Form1";
        Text = "Acadiverse Course Creator Bug Reporter";
        ResumeLayout(false);
        PerformLayout();
    }

    #endregion

    private Label lblHeader;
    private Label lblDescription;
    private TextBox txtDCescription;
    private Label lblEmail;
    private TextBox txtEmail;
    private Button button1;
    private Button button2;
    private Label lblReproduceProblem;
    private TextBox txtReproduceProblem;
}
