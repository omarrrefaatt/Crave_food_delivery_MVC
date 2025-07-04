using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Crave.API.Services.Interfaces;
using Crave.API.DTOS;
using System.Security.Claims;

namespace Crave.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        /// <summary>
        /// Get website statistics for admin dashboard
        /// </summary>
        /// <returns>Website statistics including user counts, restaurant data, order metrics, etc.</returns>
        [HttpGet("statistics")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]  
        [ProducesResponseType(StatusCodes.Status403Forbidden)]  
        [Authorize]
        public async Task<ActionResult<IEnumerable<AdminStatisticsResponse>>> GetStatistics()
        {
            var userRole =  User.FindFirst(ClaimTypes.Role)?.Value;
            if (userRole != "admin")
                return Forbid("User is not authorized to view statistics.");
            try
            {
                var statistics = await _adminService.GetWebsiteStatistics();
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving statistics", error = ex.Message });
            }
        }
    }
}