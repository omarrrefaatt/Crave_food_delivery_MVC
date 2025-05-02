using AutoMapper;
using Crave.API.Data;
using Crave.API.Data.Entities;
using Crave.API.Dtos;
using Crave.API.services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Crave.API.services.Implementation
{
    public class RestaurantService : IRestaurantService
    {
        private readonly CraveDbContext _context;
        private readonly IMapper _mapper;

        public RestaurantService(CraveDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<RestaurantReadDto>> GetAllAsync()
        {
            var restaurants = await _context.Restaurants.ToListAsync();
            return _mapper.Map<IEnumerable<RestaurantReadDto>>(restaurants);
        }

        public async Task<RestaurantReadDto?> GetByIdAsync(int id)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);
            return restaurant == null ? null : _mapper.Map<RestaurantReadDto>(restaurant);
        }

        public async Task<RestaurantReadDto> CreateAsync(RestaurantCreateDto dto, int userId)
        {
            var restaurant = _mapper.Map<Restaurant>(dto);
            restaurant.UserId = userId;
            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();

            return _mapper.Map<RestaurantReadDto>(restaurant);
        }

        public async Task<bool> UpdateAsync(int id, RestaurantCreateDto dto, int userId)
        {
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
            if (restaurant == null)
                return false;

            _mapper.Map(dto, restaurant);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id, int userId)
        {
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
            if (restaurant == null)
                return false;

            _context.Restaurants.Remove(restaurant);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<RestaurantReadDto>> GetRestaurantsByUserIdAsync(int userId)
        {
            var restaurants = await _context.Restaurants
                .Where(r => r.UserId == userId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<RestaurantReadDto>>(restaurants);
        }
    }
}
