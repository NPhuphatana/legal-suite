using Backend.Services.Timeline;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("timeline")]
public class TimelineController : ControllerBase
{
    private readonly TimelineService _service;
    public TimelineController(TimelineService service) => _service = service;

    [HttpPost]
    public IActionResult Post(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");
        using var stream = file.OpenReadStream();
        var events = _service.ExtractEvents(stream, file.FileName).ToList();
        var png = _service.RenderTimeline(events);
        var payload = new
        {
            image = Convert.ToBase64String(png),
            events = events.Select(e => new { date = e.Date.ToString("yyyy-MM-dd"), e.Description })
        };
        return Ok(payload);
    }
}
