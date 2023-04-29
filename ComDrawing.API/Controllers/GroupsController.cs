using Microsoft.AspNetCore.Mvc;

namespace ComDrawing.API.Controllers
{
    [Route("api/groups")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        public static List<string> TotalGroups = new();

        private readonly ILogger<GroupsController> _logger;

        public GroupsController(ILogger<GroupsController> logger)
        {
            _logger = logger;
        }

        [HttpGet("all")]
        [ProducesResponseType(typeof(IEnumerable<string>), 200)]
        public IActionResult GetGroups()
        {
            return Ok(TotalGroups);
        }
    }
}
