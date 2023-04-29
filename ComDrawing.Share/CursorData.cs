using Newtonsoft.Json;

namespace ComDrawing.Share
{
    public class CursorData
    {
        [JsonProperty("x")]
        public int X { get; set; }

        [JsonProperty("y")]
        public int Y { get; set; }
    }
}
