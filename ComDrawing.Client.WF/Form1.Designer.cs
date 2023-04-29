namespace ComDrawing.Client.WF
{
    partial class Form1
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
            connectBtn = new Button();
            disconectBtn = new Button();
            drawPanel = new Panel();
            widthBar = new TrackBar();
            selectColorBtn = new Button();
            colorPictureBox = new PictureBox();
            label1 = new Label();
            label2 = new Label();
            label3 = new Label();
            groupBox1 = new GroupBox();
            hostTextBox = new TextBox();
            nameTextBox = new TextBox();
            label4 = new Label();
            label5 = new Label();
            isShareCursor = new CheckBox();
            isShareDaw = new CheckBox();
            label7 = new Label();
            loadingPanel = new Panel();
            ((System.ComponentModel.ISupportInitialize)widthBar).BeginInit();
            ((System.ComponentModel.ISupportInitialize)colorPictureBox).BeginInit();
            groupBox1.SuspendLayout();
            SuspendLayout();
            // 
            // connectBtn
            // 
            connectBtn.Location = new Point(12, 241);
            connectBtn.Name = "connectBtn";
            connectBtn.Size = new Size(110, 23);
            connectBtn.TabIndex = 0;
            connectBtn.Text = "Подключиться";
            connectBtn.UseVisualStyleBackColor = true;
            connectBtn.Click += connectBtn_Click;
            // 
            // disconectBtn
            // 
            disconectBtn.Location = new Point(128, 241);
            disconectBtn.Name = "disconectBtn";
            disconectBtn.Size = new Size(110, 23);
            disconectBtn.TabIndex = 1;
            disconectBtn.Text = "Отключиться";
            disconectBtn.UseVisualStyleBackColor = true;
            disconectBtn.Click += disconectBtn_Click;
            // 
            // drawPanel
            // 
            drawPanel.BackColor = Color.White;
            drawPanel.Location = new Point(245, 12);
            drawPanel.Name = "drawPanel";
            drawPanel.Size = new Size(500, 400);
            drawPanel.TabIndex = 2;
            drawPanel.MouseDown += panel1_MouseDown;
            drawPanel.MouseMove += panel1_MouseMove;
            drawPanel.MouseUp += panel1_MouseUp;
            // 
            // widthBar
            // 
            widthBar.LargeChange = 1;
            widthBar.Location = new Point(6, 72);
            widthBar.Minimum = 1;
            widthBar.Name = "widthBar";
            widthBar.Size = new Size(122, 45);
            widthBar.TabIndex = 3;
            widthBar.Value = 1;
            widthBar.ValueChanged += widthBar_ValueChanged;
            // 
            // selectColorBtn
            // 
            selectColorBtn.Location = new Point(6, 22);
            selectColorBtn.Name = "selectColorBtn";
            selectColorBtn.Size = new Size(75, 23);
            selectColorBtn.TabIndex = 4;
            selectColorBtn.Text = "Палитра";
            selectColorBtn.UseVisualStyleBackColor = true;
            selectColorBtn.Click += selectColorBtn_Click;
            // 
            // colorPictureBox
            // 
            colorPictureBox.BackColor = Color.Black;
            colorPictureBox.Location = new Point(87, 22);
            colorPictureBox.Name = "colorPictureBox";
            colorPictureBox.Size = new Size(23, 23);
            colorPictureBox.TabIndex = 5;
            colorPictureBox.TabStop = false;
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Location = new Point(6, 52);
            label1.Name = "label1";
            label1.Size = new Size(58, 15);
            label1.TabIndex = 6;
            label1.Text = "Толщина";
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Location = new Point(6, 114);
            label2.Name = "label2";
            label2.Size = new Size(13, 15);
            label2.TabIndex = 7;
            label2.Text = "1";
            // 
            // label3
            // 
            label3.AutoSize = true;
            label3.Location = new Point(109, 114);
            label3.Name = "label3";
            label3.Size = new Size(19, 15);
            label3.TabIndex = 8;
            label3.Text = "10";
            // 
            // groupBox1
            // 
            groupBox1.Controls.Add(selectColorBtn);
            groupBox1.Controls.Add(label3);
            groupBox1.Controls.Add(widthBar);
            groupBox1.Controls.Add(label2);
            groupBox1.Controls.Add(colorPictureBox);
            groupBox1.Controls.Add(label1);
            groupBox1.Location = new Point(12, 270);
            groupBox1.Name = "groupBox1";
            groupBox1.Size = new Size(134, 142);
            groupBox1.TabIndex = 9;
            groupBox1.TabStop = false;
            groupBox1.Text = "Рисование";
            // 
            // hostTextBox
            // 
            hostTextBox.Location = new Point(13, 25);
            hostTextBox.Name = "hostTextBox";
            hostTextBox.Size = new Size(225, 23);
            hostTextBox.TabIndex = 10;
            // 
            // nameTextBox
            // 
            nameTextBox.Location = new Point(13, 69);
            nameTextBox.Name = "nameTextBox";
            nameTextBox.Size = new Size(225, 23);
            nameTextBox.TabIndex = 11;
            // 
            // label4
            // 
            label4.AutoSize = true;
            label4.Location = new Point(18, 51);
            label4.Name = "label4";
            label4.Size = new Size(31, 15);
            label4.TabIndex = 12;
            label4.Text = "Имя";
            // 
            // label5
            // 
            label5.AutoSize = true;
            label5.Location = new Point(13, 7);
            label5.Name = "label5";
            label5.Size = new Size(32, 15);
            label5.TabIndex = 13;
            label5.Text = "Хост";
            // 
            // isShareCursor
            // 
            isShareCursor.AutoSize = true;
            isShareCursor.Location = new Point(13, 102);
            isShareCursor.Name = "isShareCursor";
            isShareCursor.Size = new Size(131, 19);
            isShareCursor.TabIndex = 16;
            isShareCursor.Text = "Передавать курсор";
            isShareCursor.UseVisualStyleBackColor = true;
            // 
            // isShareDaw
            // 
            isShareDaw.AutoSize = true;
            isShareDaw.Location = new Point(13, 127);
            isShareDaw.Name = "isShareDaw";
            isShareDaw.Size = new Size(138, 19);
            isShareDaw.TabIndex = 17;
            isShareDaw.Text = "Передавать рисунок";
            isShareDaw.UseVisualStyleBackColor = true;
            // 
            // label7
            // 
            label7.AllowDrop = true;
            label7.AutoEllipsis = true;
            label7.AutoSize = true;
            label7.BackColor = SystemColors.ActiveCaption;
            label7.Location = new Point(169, 397);
            label7.Name = "label7";
            label7.Size = new Size(38, 15);
            label7.TabIndex = 18;
            label7.Text = "label7";
            // 
            // loadingPanel
            // 
            loadingPanel.Location = new Point(13, 150);
            loadingPanel.Name = "loadingPanel";
            loadingPanel.Size = new Size(226, 85);
            loadingPanel.TabIndex = 19;
            // 
            // Form1
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(768, 426);
            Controls.Add(loadingPanel);
            Controls.Add(label7);
            Controls.Add(isShareDaw);
            Controls.Add(isShareCursor);
            Controls.Add(label5);
            Controls.Add(label4);
            Controls.Add(nameTextBox);
            Controls.Add(hostTextBox);
            Controls.Add(groupBox1);
            Controls.Add(drawPanel);
            Controls.Add(disconectBtn);
            Controls.Add(connectBtn);
            Name = "Form1";
            Text = "Form1";
            ((System.ComponentModel.ISupportInitialize)widthBar).EndInit();
            ((System.ComponentModel.ISupportInitialize)colorPictureBox).EndInit();
            groupBox1.ResumeLayout(false);
            groupBox1.PerformLayout();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Button connectBtn;
        private Button disconectBtn;
        private Panel drawPanel;
        private TrackBar widthBar;
        private Button selectColorBtn;
        private PictureBox colorPictureBox;
        private Label label1;
        private Label label2;
        private Label label3;
        private GroupBox groupBox1;
        private TextBox hostTextBox;
        private TextBox nameTextBox;
        private Label label4;
        private Label label5;
        private CheckBox isShareCursor;
        private CheckBox isShareDaw;
        private Label label7;
        private Panel loadingPanel;
    }
}