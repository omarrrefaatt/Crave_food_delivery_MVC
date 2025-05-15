using System.ComponentModel.DataAnnotations;

namespace Crave.API.Data.Entities
{
    public class Card
    {
        [Key]
        public int CardId { get; set; }

        public string CardNumber { get; set; } = string.Empty;
        public string CVV { get; set; } = string.Empty;
        public string CardHolderName { get; set; } = string.Empty;

        public ICollection<User>? Users { get; set; }
    }
}
