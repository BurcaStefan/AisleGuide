using Application.DTOs;
using Application.Use_Cases.Commands;
using Application.Use_Cases.Commands.FavoriteCommands;
using Application.Use_Cases.Commands.HistoryListCommands;
using Application.Use_Cases.Commands.ProductCommands;
using Application.Use_Cases.Commands.ReviewCommands;
using AutoMapper;
using Domain.Entities;

namespace Application.Utils
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
        {
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<CreateUserCommand, User>().ReverseMap();
            CreateMap<UpdateUserCommand, User>().ReverseMap();
            CreateMap<DeleteUserCommand, User>().ReverseMap();

            CreateMap<Product, ProductDto>().ReverseMap();
            CreateMap<CreateProductCommand, Product>().ReverseMap();
            CreateMap<UpdateProductCommand, Product>().ReverseMap();
            CreateMap<DeleteProductCommand, Product>().ReverseMap();

            CreateMap<Favorite, FavoriteDto>().ReverseMap();
            CreateMap<CreateFavoriteCommand, Favorite>().ReverseMap();
            CreateMap<DeleteFavoriteCommand, Favorite>().ReverseMap();

            CreateMap<HistoryList, HistoryListDto>().ReverseMap();
            CreateMap<CreateHistoryListCommand, HistoryList>().ReverseMap();
            CreateMap<UpdateHistoryListCommand, HistoryList>().ReverseMap();
            CreateMap<DeleteHistoryListCommand, HistoryList>().ReverseMap();

            CreateMap<Review, ReviewDto>().ReverseMap();
            CreateMap<CreateReviewCommand, Review>().ReverseMap();
        }
    }
}
