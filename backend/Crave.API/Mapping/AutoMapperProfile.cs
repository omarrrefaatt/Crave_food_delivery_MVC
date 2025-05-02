using AutoMapper;
using Crave.API.Data.Entities;
using Crave.API.Dtos;

namespace Crave.API.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Restaurant, RestaurantReadDto>();
            CreateMap<RestaurantCreateDto, Restaurant>();
            CreateMap<RestaurantCreateDto, RestaurantReadDto>();
            CreateMap<Review, ReviewReadDto>();
            CreateMap<ReviewCreateDto, Review>();


        }
    }
}
