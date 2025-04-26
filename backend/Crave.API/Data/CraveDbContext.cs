using Microsoft.EntityFrameworkCore;
using Crave.API.Data.Entities;

namespace Crave.API.Data
{
    public class CraveDbContext : DbContext
    {
        public CraveDbContext(DbContextOptions<CraveDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<FoodItem> FoodItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // One-to-Many: Restaurant -> FoodItems
            modelBuilder.Entity<Restaurant>()
                .HasMany(r => r.FoodItems)
                .WithOne(f => f.Restaurant)
                .HasForeignKey(f => f.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Restaurant -> Orders
            modelBuilder.Entity<Restaurant>()
                .HasMany(r => r.Orders)
                .WithOne(o => o.Restaurant)
                .HasForeignKey(o => o.RestaurantId)
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-Many: User -> Orders
            modelBuilder.Entity<User>()
                .HasMany(u => u.Orders)
                .WithOne(o => o.User)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: FoodItem -> OrderItems
            modelBuilder.Entity<FoodItem>()
                .HasMany(f => f.OrderItems)
                .WithOne(oi => oi.FoodItem)
                .HasForeignKey(oi => oi.FoodItemId)
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-Many: Order -> OrderItems
            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: User -> Reviewss
            modelBuilder.Entity<User>()
                .HasMany(u => u.Reviews)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Restaurant -> Reviews
            modelBuilder.Entity<Restaurant>()
                .HasMany(r => r.Reviews)
                .WithOne(rv => rv.Restaurant)
                .HasForeignKey(rv => rv.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Card -> Users
            modelBuilder.Entity<Card>()
                .HasMany(c => c.Users)
                .WithOne(u => u.Card)
                .HasForeignKey(u => u.CardId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
