IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Cards] (
    [CardId] int NOT NULL IDENTITY,
    [CardNumber] nvarchar(max) NOT NULL,
    [CVV] nvarchar(max) NOT NULL,
    [CardHolderName] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Cards] PRIMARY KEY ([CardId])
);

CREATE TABLE [Restaurants] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Category] nvarchar(max) NOT NULL,
    [Rating] real NOT NULL,
    [AvgDeliveryTime] int NOT NULL,
    [ContactInfo] nvarchar(max) NOT NULL,
    [OperatingHours] nvarchar(max) NOT NULL,
    [Location] nvarchar(max) NOT NULL,
    [ImageUrl] nvarchar(max) NOT NULL,
    [managerId] int NOT NULL,
    CONSTRAINT [PK_Restaurants] PRIMARY KEY ([Id])
);

CREATE TABLE [Users] (
    [UserId] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [Email] nvarchar(max) NOT NULL,
    [Role] nvarchar(max) NOT NULL,
    [Phone] nvarchar(max) NOT NULL,
    [Address] nvarchar(max) NOT NULL,
    [Password] nvarchar(max) NOT NULL,
    [ZipCode] nvarchar(max) NOT NULL,
    [CardId] int NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([UserId]),
    CONSTRAINT [FK_Users_Cards_CardId] FOREIGN KEY ([CardId]) REFERENCES [Cards] ([CardId]) ON DELETE SET NULL
);

CREATE TABLE [FoodItems] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Rating] float NOT NULL,
    [RestaurantId] int NOT NULL,
    [UserId] int NULL,
    CONSTRAINT [PK_FoodItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_FoodItems_Restaurants_RestaurantId] FOREIGN KEY ([RestaurantId]) REFERENCES [Restaurants] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Orders] (
    [Id] int NOT NULL IDENTITY,
    [Notes] nvarchar(max) NOT NULL,
    [Rating] float NOT NULL,
    [PaymentMethod] nvarchar(max) NOT NULL,
    [UserId] int NOT NULL,
    [RestaurantId] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Orders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Orders_Restaurants_RestaurantId] FOREIGN KEY ([RestaurantId]) REFERENCES [Restaurants] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Orders_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE
);

CREATE TABLE [Reviews] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [RestaurantId] int NOT NULL,
    [Rating] int NOT NULL,
    [Comments] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Reviews] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Reviews_Restaurants_RestaurantId] FOREIGN KEY ([RestaurantId]) REFERENCES [Restaurants] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Reviews_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE
);

CREATE TABLE [OrderItems] (
    [Id] int NOT NULL IDENTITY,
    [FoodItemId] int NOT NULL,
    [Quantity] int NOT NULL,
    [OrderId] int NOT NULL,
    CONSTRAINT [PK_OrderItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_OrderItems_FoodItems_FoodItemId] FOREIGN KEY ([FoodItemId]) REFERENCES [FoodItems] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_OrderItems_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_FoodItems_RestaurantId] ON [FoodItems] ([RestaurantId]);

CREATE INDEX [IX_OrderItems_FoodItemId] ON [OrderItems] ([FoodItemId]);

CREATE INDEX [IX_OrderItems_OrderId] ON [OrderItems] ([OrderId]);

CREATE INDEX [IX_Orders_RestaurantId] ON [Orders] ([RestaurantId]);

CREATE INDEX [IX_Orders_UserId] ON [Orders] ([UserId]);

CREATE INDEX [IX_Reviews_RestaurantId] ON [Reviews] ([RestaurantId]);

CREATE INDEX [IX_Reviews_UserId] ON [Reviews] ([UserId]);

CREATE INDEX [IX_Users_CardId] ON [Users] ([CardId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250505151340_AddMissingRestaurantColumns', N'9.0.4');

COMMIT;
GO

