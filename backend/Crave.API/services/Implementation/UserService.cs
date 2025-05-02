using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Crave.API.Data;
using Crave.API.Data.Entities;
using Crave.API.DTOS.User;
using Microsoft.EntityFrameworkCore;
using Crave.API.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Crave.API.Services.Implementation;

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

                var user = new User
                {
                    Name = request.Name,
                    Email = request.Email,
                    Password = HashPasswordSecure(request.Password),
                    Role = request.Role,
                    Phone = request.Phone,
                    Address = request.Address,
                    ZipCode = request.ZipCode,
                    // CardId = request.CardId
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation("User created successfully: {Email}", user.Email);
                return MapUserToResponse(user);
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
                    user.Password = HashPasswordSecure(request.Password);

                if (!string.IsNullOrWhiteSpace(request.Role))
                    user.Role = request.Role;

                // if (request.CardId.HasValue)
                //     user.CardId = request.CardId;

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

                if (!VerifyPassword(request.Password, user.Password))
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

        private static string HashPasswordSecure(string password)
        {
            // Generate a random salt
            byte[] salt = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            // Hash the password with the salt
            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
            byte[] hash = pbkdf2.GetBytes(32);

            // Combine the salt and hash
            byte[] hashBytes = new byte[48];
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 32);

            return Convert.ToBase64String(hashBytes);
        }

        private static bool VerifyPassword(string password, string storedHash)
        {
            // Convert the stored hash from base64 string to byte array
            byte[] hashBytes = Convert.FromBase64String(storedHash);

            // Extract the salt (first 16 bytes)
            byte[] salt = new byte[16];
            Array.Copy(hashBytes, 0, salt, 0, 16);

            // Compute the hash on the password the user entered
            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
            byte[] hash = pbkdf2.GetBytes(32);

            // Compare the computed hash with the stored hash
            for (int i = 0; i < 32; i++)
            {
                if (hashBytes[i + 16] != hash[i])
                    return false;
            }
            return true;
        }
    }
}