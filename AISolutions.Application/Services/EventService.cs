using AISolutions.Application.DTOs;
using AISolutions.Application.Interfaces;
using AISolutions.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AISolutions.Application.Services
{
    public class EventService : IEventService
    {
        private readonly IGenericRepository<Event> _eventRepository;
        private readonly IGenericRepository<EventRegistration> _eventRegistrationRepository;
        private readonly ICustomerService _customerService;
        private readonly IUnitOfWork _unitOfWork;

        public EventService(
            IGenericRepository<Event> eventRepository,
            IGenericRepository<EventRegistration> eventRegistrationRepository,
            ICustomerService customerService,
            IUnitOfWork unitOfWork)
        {
            _eventRepository = eventRepository;
            _eventRegistrationRepository = eventRegistrationRepository;
            _customerService = customerService;
            _unitOfWork = unitOfWork;
        }

        public async Task<EventDto> CreateEventAsync(CreateEventDto dto)
        {
            var newEvent = new Event
            {
                Title = dto.Title,
                Description = dto.Description,
                EventDate = dto.EventDate
            };

            await _eventRepository.AddAsync(newEvent);
            await _unitOfWork.SaveChangesAsync();

            return new EventDto
            {
                Id = newEvent.Id,
                Title = newEvent.Title,
                Description = newEvent.Description,
                EventDate = newEvent.EventDate
            };
        }

        public async Task<IEnumerable<EventDto>> GetAllEventsAsync()
        {
            var events = await _eventRepository.GetAllAsync();
            return events.Select(e => new EventDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                EventDate = e.EventDate
            });
        }

        public async Task<bool> RegisterForEventAsync(int customerId, int eventId)
        {
            var existingReg = _eventRegistrationRepository.Query()
                .FirstOrDefault(er => er.CustomerId == customerId && er.EventId == eventId);
            if (existingReg != null)
                throw new InvalidOperationException("Customer is already registered for this event.");

            var reg = new EventRegistration
            {
                CustomerId = customerId,
                EventId = eventId
            };

            await _eventRegistrationRepository.AddAsync(reg);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RegisterPublicForEventAsync(PublicEventJoinDto dto)
        {
            var customer = await _customerService.GetOrCreateCustomerAsync(dto.Email, dto.Name, dto.Phone, dto.CompanyName, dto.Country);
            return await RegisterForEventAsync(customer.Id, dto.EventId);
        }
    }
}