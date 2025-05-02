using Crave.API.DTOS.User;

namespace Crave.API.Services.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserResponse>> GetAllUsersAsync();
        Task<UserResponse?> GetUserByIdAsync(int userId);
        Task<UserResponse?> GetUserByEmailAsync(string email);
        Task<UserResponse> CreateUserAsync(CreateUserRequest request);
        Task<UserResponse?> UpdateUserAsync(int userId, UpdateUserRequest request);
        Task<bool> DeleteUserAsync(int userId);
        Task<UserResponse?> AuthenticateAsync(LoginRequest request);
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordRequest request);
    }
}