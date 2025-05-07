
using System.Security.Cryptography;
using Crave.API.Data;
using Crave.API.Data.Entities;
using Crave.API.DTOS.User;
using Microsoft.EntityFrameworkCore;
using Crave.API.Services.Interfaces;
using Crave.API.Helpers;


namespace Crave.API.Services.Implementation
{
    public class UserService : IUserService
    {
        private readonly CraveDbContext _context;
        private readonly ILogger<UserService> _logger;
        private readonly JwtService _jwtService;

        public UserService(CraveDbContext context, ILogger<UserService> logger, JwtService jwtService)
        {
            _context = context;
            _logger = logger;
            _jwtService = jwtService;
        }

        public async Task<IEnumerable<UserResponse>> GetAllUsersAsync()
        {
            var users = await _context.Users.ToListAsync();
            return users.Select(MapUserToResponse);
        }

        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordRequest request)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null) return false;

                // Verify old password
                if (!PasswordHasher.VerifyPassword(request.OldPassword, user.Password))
                {
                    throw new InvalidOperationException("Old password is incorrect");
                }

                // Validate new password
                if (!PasswordValidator.IsPasswordValid(request.NewPassword, out string error))
                {
                    throw new InvalidOperationException("Invalid new password: " + error);
                }

                user.Password = PasswordHasher.HashPassword(request.NewPassword);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password for user {UserId}: {Message}", userId, ex.Message);
                throw new InvalidOperationException("Could not change password. Please try again later.");
            }
        }


        public async Task<UserResponse?> GetUserByIdAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            return user != null ? MapUserToResponse(user) : null;
        }

        public async Task<UserResponse?> GetUserByEmailAsync(string email)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
            return user != null ? MapUserToResponse(user) : null;
        }

        public async Task<UserResponse> CreateUserAsync(CreateUserRequest request)
        {
            try
            {
                // Check if user already exists
                if (await _context.Users.AnyAsync(u => u.Email.ToLower() == request.Email.ToLower()))
                {
                    throw new InvalidOperationException("Email is already registered");
                }

                if (await _context.Users.AnyAsync(u => u.Phone.ToLower() == request.Phone.ToLower()))
                {
                    throw new InvalidOperationException("Phone number is already registered");
                }
                if (request.Password != request.confirmPassword)
                {
                    throw new InvalidOperationException("Passwords do not match");
                }
                if (string.IsNullOrWhiteSpace(request.Role))
                {
                    request.Role = "Customer"; // Default role
                }
                if (!PasswordValidator.IsPasswordValid(request.Password, out string error))
                {
                    throw new InvalidOperationException("Invalid password: " + error);
                }

                var user = new User
                {
                    Name = request.Name,
                    Email = request.Email,
                    Password = PasswordHasher.HashPassword(request.Password),
                    Role = request.Role,
                    Phone = request.Phone,
                    Address = request.Address,
                    ZipCode = request.ZipCode,
                };
                

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                var token = _jwtService.GenerateToken(user);
                _logger.LogInformation("User created successfully: {Email}", user.UserId);
                
                var response = MapUserToResponse(user);
                response.Token = token;
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user: {Message}", ex.Message);
                throw new InvalidOperationException($"Could not create user. Please try again later. {ex.Message}");
            }
        }

        public async Task<UserResponse?> UpdateUserAsync(int userId, UpdateUserRequest request)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null) return null;

                // Update only provided fields
                if (!string.IsNullOrWhiteSpace(request.Name))
                    user.Name = request.Name;

                if (!string.IsNullOrWhiteSpace(request.Email))
                {
                    // Check if email is already taken by another user
                    if (await _context.Users.AnyAsync(u => u.Email.ToLower() == request.Email.ToLower() && u.UserId != userId))
                    {
                        throw new InvalidOperationException("Email is already registered to another user");
                    }
                    user.Email = request.Email;
                }

                if (!string.IsNullOrWhiteSpace(request.Phone))
                    user.Phone = request.Phone;

                if (!string.IsNullOrWhiteSpace(request.Address))
                    user.Address = request.Address;

                if (!string.IsNullOrWhiteSpace(request.ZipCode))
                    user.ZipCode = request.ZipCode;

                if (!string.IsNullOrWhiteSpace(request.Password))

                    user.Password = PasswordHasher.HashPassword(request.Password);


                if (!string.IsNullOrWhiteSpace(request.Role))
                    user.Role = request.Role;


                await _context.SaveChangesAsync();
                _logger.LogInformation("User updated successfully: {UserId}", userId);
                return MapUserToResponse(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user {UserId}: {Message}", userId, ex.Message);
                throw new InvalidOperationException("Could not update user. Please try again later.");
            }
        }

        public async Task<bool> DeleteUserAsync(int userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null) return false;

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                _logger.LogInformation("User deleted successfully: {UserId}", userId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user {UserId}: {Message}", userId, ex.Message);
                throw new InvalidOperationException("Could not delete user. Please try again later.");
            }
        }

        public async Task<UserResponse?> AuthenticateAsync(LoginRequest request)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

                if (user == null)
                {
                    _logger.LogWarning("Authentication failed: User not found {Email}", request.Email);
                    return null;
                }


                if (!PasswordHasher.VerifyPassword(request.Password, user.Password))

                {
                    _logger.LogWarning("Authentication failed: Invalid password for {Email}", request.Email);
                    return null;
                }


                // Generate JWT token
                var token = _jwtService.GenerateToken(user);

                _logger.LogInformation("User authenticated successfully: {Email}", request.Email);
                
                // Return user with token
                var response = MapUserToResponse(user);
                response.Token = token;
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during authentication: {Message}", ex.Message);
                throw new InvalidOperationException("Authentication failed. Please try again later.");
            }
        }


        private static UserResponse MapUserToResponse(User user)
        {
            return new UserResponse
            {
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                Phone = user.Phone,
                Address = user.Address,
                ZipCode = user.ZipCode,
                CardId = (int)(user.CardId ?? 0)
                // Token will be set in AuthenticateAsync
            };
        }


    }
}