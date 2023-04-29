using ComDrawing.Share;
using Microsoft.AspNetCore.SignalR.Client;
using Syncfusion.WinForms.Core.Utils;

namespace ComDrawing.Client.WF
{
    public partial class Form1 : Form
    {
        HubConnection connection;

        Graphics g;

        int X = -1;
        int Y = -1;

        bool isMoving = false;

        Pen Pen;
        Color Color;
        string ColorHex;

        BusyIndicator busyIndicator;

        public Form1()
        {
            InitializeComponent();

            busyIndicator = new();

            hostTextBox.Text = "https://localhost:7034/DrawHub";
            SetupSignal();

            g = drawPanel.CreateGraphics();
            g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
            Color = Color.Black;
            ColorHex = HexConverter(Color);
            colorPictureBox.BackColor = Color;
            Pen = new Pen(Color, 1);
            Pen.StartCap = Pen.EndCap = System.Drawing.Drawing2D.LineCap.Round;
        }

        private void SetupSignal()
        {
            connection = new HubConnectionBuilder()
                .WithUrl(hostTextBox.Text)
                .Build();

            connection.Closed += async (error) =>
            {
                await Task.Delay(new Random().Next(0, 5) * 1000);
                await connection.StartAsync();
            };
        }

        private void panel1_MouseDown(object sender, MouseEventArgs e)
        {
            if (connection.State != HubConnectionState.Connected)
            {
                ShowError("Требуется наличие подключения");
                return;
            }

            isMoving = true;
            X = e.X;
            Y = e.Y;
            drawPanel.Cursor = Cursors.Cross;
        }

        private void panel1_MouseMove(object sender, MouseEventArgs e)
        {
            Point cursor = new(e.X, e.Y);

            if (isMoving && X != -1 && Y != -1)
            {
                Point start = new(X, Y);

                g.DrawLine(Pen, start, cursor);
                X = e.X;
                Y = e.Y;

                if (isShareDaw.Checked && connection.State == HubConnectionState.Connected)
                {
                    SendDrawing(start, cursor);
                }
            }

            if (isShareCursor.Checked && connection.State == HubConnectionState.Connected)
            {
                SendCursor(cursor);
            }

            //cursor.X += drawPanel.Location.X + 10;
            //cursor.Y += drawPanel.Location.Y + 10;

            //label7.Text = "adasd";
            ////label7.Enabled = false;
            //label7.Left = cursor.X;
            //label7.Top = cursor.Y;
            ////label7.Location = new Point(cursor.X, cursor.Y);

        }

        private void panel1_MouseUp(object sender, MouseEventArgs e)
        {
            isMoving = false;
            X = -1;
            Y = -1;
            drawPanel.Cursor = Cursors.Default;
        }

        private void widthBar_ValueChanged(object sender, EventArgs e)
        {
            Pen = new Pen(Color, widthBar.Value);
        }

        private void selectColorBtn_Click(object sender, EventArgs e)
        {
            ColorDialog MyDialog = new();
            MyDialog.AllowFullOpen = false;
            MyDialog.ShowHelp = true;
            MyDialog.Color = Color;

            if (MyDialog.ShowDialog() == DialogResult.OK)
            {
                Color = MyDialog.Color;
                ColorHex = HexConverter(Color);
                colorPictureBox.BackColor = Color;
                Pen = new Pen(Color, widthBar.Value);
            }
        }

        private async void SendDrawing(Point start, Point end)
        {
            try
            {
                var g = Pen.Color.ToArgb();
                DrawData drawData = new()
                {
                    StartX = start.X,
                    StartY = start.Y,
                    EndX = end.X,
                    EndY = end.Y,
                    Width = (int)Pen.Width,
                    ColorHex = ColorHex
                };
                await connection.InvokeAsync("Drawing", drawData, nameTextBox.Text);
            }
            catch (Exception ex)
            {

            }
        }
        private async void SendCursor(Point point)
        {
            try
            {
                CursorData cursorData = new()
                {
                    X = point.X,
                    Y = point.Y,
                };
                await connection.InvokeAsync("MoveCursor", cursorData, nameTextBox.Text);
            }
            catch (Exception ex)
            {
            }
        }

        private async void connectBtn_Click(object sender, EventArgs e)
        {
            try
            {
                if (string.IsNullOrEmpty(hostTextBox.Text))
                    throw new Exception("Нужно указать хост подключения");

                if (string.IsNullOrEmpty(nameTextBox.Text))
                    throw new Exception("Нужно указать имя пользователя");

                if (connection.State == HubConnectionState.Disconnected)
                {
                    connectBtn.Enabled = false;
                    busyIndicator.Show(loadingPanel);

                    connection.On<DrawData, string>("DrawReceived", (data, userName) =>
                    {
                        Point start = new(data.StartX, data.StartY);
                        Point end = new(data.EndX, data.EndY);
                        Color color = ColorTranslator.FromHtml(data.ColorHex);
                        Pen Pen = new(color, data.Width);
                        g.DrawLine(Pen, start, end);
                    });

                    connection.On<CursorData, string>("MoveCursorReceived", (data, userName) =>
                    {
                        //label7.BeginInvoke(() =>
                        //{
                        //    data.X += drawPanel.Location.X;
                        //    data.Y += drawPanel.Location.Y;

                        //    label7.Text = userName;
                        //    label7.Enabled = false;
                        //    label7.Location = new Point(data.X, data.Y);
                        //});
                    });

                    await connection.StartAsync();
                }
            }
            catch (Exception ex)
            {
                ShowError(ex.Message);
            }
            finally
            {
                connectBtn.Enabled = true;
                busyIndicator.Hide();
            }
        }

        private async void disconectBtn_Click(object sender, EventArgs e)
        {
            try
            {
                await connection.StopAsync();
            }
            catch (Exception ex)
            {
                ShowError(ex.Message);
            }
            finally
            {
                connectBtn.Enabled = true;
            }
        }

        private string HexConverter(Color color)
            => "#" + color.R.ToString("X2") + color.G.ToString("X2") + color.B.ToString("X2");

        private void ShowError(string errorText)
            => MessageBox.Show($"{errorText}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
    }
}