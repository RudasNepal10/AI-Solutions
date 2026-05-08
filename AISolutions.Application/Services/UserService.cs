using AISolutions.Application.DTOs;
using AISolutions.Application.Interfaces;
using AISolutions.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AISolutions.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IGenericRepository<User> _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UserService(IGenericRepository<User> userRepository, IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return users.Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Role = u.Role,
                CreatedAt = u.CreatedAt
            });
        }

        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
        {
            var username = createUserDto.Username.Trim();
            var role = NormalizeRole(createUserDto.Role);

            ValidateUserInput(username, createUserDto.Password);

            if (_userRepository.Query().Any(u => u.Username == username))
            {
                throw new System.InvalidOperationException("Username already exists.");
            }

            var user = new User
            {
                Username = username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password),
                Role = role,
                CreatedAt = System.DateTime.UtcNow
            };

            await _userRepository.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }

        private static void ValidateUserInput(string username, string password)
        {
            if (string.IsNullOrWhiteSpace(username) || username.Length > 100)
            {
                throw new InvalidOperationException("Username is required and must be 100 characters or less.");
            }

            if (string.IsNullOrWhiteSpace(password) || password.Length < 8)
            {
                throw new InvalidOperationException("Password must be at least 8 characters.");
            }
        }

        private static string NormalizeRole(string role)
        {
            var normalizedRole = string.IsNullOrWhiteSpace(role) ? "User" : role.Trim();
            var allowedRoles = new[] { "Admin", "Manager", "Editor", "User" };

            if (!allowedRoles.Contains(normalizedRole))
            {
                throw new InvalidOperationException("Invalid role.");
            }

            return normalizedRole;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return false;

            _userRepository.Delete(user);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
