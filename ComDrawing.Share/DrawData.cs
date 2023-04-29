using Newtonsoft.Json;

namespace ComDrawing.Share
{
    public class DrawData
    {
        [JsonProperty("startX")]
        public int StartX { get; set; }

        [JsonProperty("startY")]
        public int StartY { get; set; }

        [JsonProperty("endX")]
        public int EndX { get; set; }

        [JsonProperty("endY")]
        public int EndY { get; set; }

        [JsonProperty("width")]
        public int Width { get; set; }

        [JsonProperty("colorHex")]
        public string ColorHex { get; set; }
    }
}
