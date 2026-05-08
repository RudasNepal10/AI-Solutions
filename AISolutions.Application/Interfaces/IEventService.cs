using AISolutions.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AISolutions.Application.Interfaces
{
    public interface IEventService
    {
        Task<IEnumerable<EventDto>> GetAllEventsAsync();
        Task<EventDto> CreateEventAsync(CreateEventDto dto);
        Task<bool> RegisterForEventAsync(int customerId, int eventId);
        Task<bool> RegisterPublicForEventAsync(PublicEventJoinDto dto);
    }
}
