namespace Crave.API.DTOS.User
{
    public class UpdateUserRequest
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? ZipCode { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }
        public int? CardId { get; set; }
    }
}