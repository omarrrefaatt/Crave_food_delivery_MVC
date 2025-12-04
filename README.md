# 🍔 Crave Food Delivery Platform

<img width="1200" height="675" alt="Red and White Simple Delivery Logo 2" src="https://github.com/user-attachments/assets/c838ef98-4140-49bc-88a6-ea4cf20d3d7e" />

<div align="center">
  
  ### Delivering Delicious Meals Right to Your Doorstep
  
  [![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?style=for-the-badge&logo=dotnet)](https://dotnet.microsoft.com/)
  [![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [Architecture](#️-architecture)
- [Getting Started](#-getting-started)
- [User Roles](#-user-roles)
- [API Documentation](#-api-documentation)
- [Security Features](#-security-features)
- [Key Highlights](#-key-highlights)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Crave** is a comprehensive full-stack food delivery platform that connects customers with their favorite restaurants. Built with modern web technologies, it offers a seamless experience for ordering food, managing restaurants, and tracking deliveries in real-time.

The platform implements a **Model-View-Controller (MVC)** architecture with a RESTful API backend and a responsive React frontend, providing role-based access control for customers, restaurant owners, and administrators.

---

## ✨ Features

### 🛍️ Customer Features

- **Browse Restaurants**: Explore a wide variety of restaurants with advanced filtering and sorting
- **Menu Navigation**: View detailed food items with images, descriptions, pricing, and ratings
- **Shopping Cart**: Add/remove items with real-time price calculation
- **Order Management**: Place orders, track status (Pending, Confirmed, Delivered, Cancelled)
- **Payment Integration**: Secure payment processing with Stripe
- **Review System**: Rate and review restaurants and food items
- **Profile Management**: Update personal information, view order history
- **Search & Filter**: Find restaurants by name, category, rating, delivery time

### 🏪 Restaurant Owner Features

- **Dashboard Analytics**:
  - Total revenue tracking
  - Order statistics (success/cancelled/pending)
  - Success rate calculations
  - Performance metrics
- **Food Item Management**: CRUD operations for menu items with image uploads
- **Order Management**:
  - View incoming orders
  - Update order status
  - Track order history
  - Filter by status
- **Review Management**: Monitor customer feedback and ratings
- **Restaurant Profile**: Update restaurant information, operating hours, contact details

### 👨‍💼 Admin Features

- **Comprehensive Dashboard**:
  - System-wide statistics
  - Revenue analytics with charts
  - User and restaurant metrics
  - Order distribution visualization
- **Restaurant Management**: Approve, edit, or remove restaurants
- **Manager Management**: Create and manage restaurant managers
- **User Oversight**: Monitor all platform users
- **Data Visualization**: Interactive charts using Recharts

---

## 🛠️ Technology Stack

### Frontend

| Technology         | Purpose                                                |
| ------------------ | ------------------------------------------------------ |
| **React 18.3**     | UI library for building interactive interfaces         |
| **TypeScript**     | Type-safe JavaScript for better development experience |
| **Vite**           | Next-generation frontend build tool                    |
| **TailwindCSS**    | Utility-first CSS framework for styling                |
| **React Router**   | Client-side routing                                    |
| **Axios**          | HTTP client for API requests                           |
| **Recharts**       | Data visualization library                             |
| **React Icons**    | Icon library (Lucide React)                            |
| **Stripe**         | Payment processing integration                         |
| **React Paginate** | Pagination component                                   |

### Backend

| Technology                | Purpose                           |
| ------------------------- | --------------------------------- |
| **.NET 9.0**              | Backend framework                 |
| **ASP.NET Core Web API**  | RESTful API development           |
| **Entity Framework Core** | ORM for database operations       |
| **SQL Server**            | Relational database               |
| **JWT Authentication**    | Secure token-based authentication |
| **Swagger/OpenAPI**       | API documentation                 |
| **BCrypt**                | Password hashing                  |

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Git** - Version control

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                       │
│  ┌──────────┬──────────┬──────────┬──────────┬───────────┐ │
│  │  Pages   │Components│ Services │ Contexts │   Routes  │ │
│  └──────────┴──────────┴──────────┴──────────┴───────────┘ │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/HTTPS (Axios)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend (.NET Web API)                     │
│  ┌──────────┬──────────┬──────────┬──────────┬───────────┐ │
│  │Controllers│ Services │  DTOs    │ Helpers  │   Auth    │ │
│  └──────────┴──────────┴──────────┴──────────┴───────────┘ │
└───────────────────────┬─────────────────────────────────────┘
                        │ Entity Framework Core
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database (SQL Server)                    │
│  ┌──────────┬──────────┬──────────┬──────────┬───────────┐ │
│  │  Users   │Restaurants│FoodItems │  Orders  │  Reviews  │ │
│  └──────────┴──────────┴──────────┴──────────┴───────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema

```
Users ──┬── Orders ──── OrderItems ──── FoodItems
        │                                   │
        └── Reviews ──── Restaurants ───────┘
                             │
                             └── FoodItems
```

### Key Entities

- **User**: Authentication, profile management, role-based access
- **Restaurant**: Business information, operating hours, ratings
- **FoodItem**: Menu items with pricing and availability
- **Order**: Customer orders with status tracking
- **Review**: Customer feedback and ratings
- **Card**: Secure payment information storage

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- .NET 9.0 SDK
- SQL Server
- npm or yarn

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/omarrrefaatt/Crave_food_delivery_MVC.git
   cd Crave_food_delivery_MVC/backend
   ```

2. **Configure Database Connection**

   Update `appsettings.json`:

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=your_server;Database=CraveDB;Trusted_Connection=True;"
     },
     "Jwt": {
       "Key": "your-secret-key-here",
       "Issuer": "CraveAPI",
       "Audience": "CraveClient"
     }
   }
   ```

3. **Run Migrations**

   ```bash
   dotnet ef database update
   ```

4. **Start the API**

   ```bash
   cd Crave.API
   dotnet run
   ```

   The API will be available at `http://localhost:5231`

   Swagger documentation: `http://localhost:5231/swagger`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd ../frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file:

   ```env
   VITE_LOGIN_API=http://localhost:5231/api/Users/login
   VITE_REGISTER_API=http://localhost:5231/api/Users/register
   VITE_GET_ALL_RESTAURANTS_API=http://localhost:5231/api/Restaurant
   VITE_USER_ORDERS_API=http://localhost:5231/api/Order
   VITE_USER_API=http://localhost:5231/api/Users
   VITE_ADMIN_STATISTICS_API=http://localhost:5231/api/Admin/statistics
   VITE_REVIEWS_API=http://localhost:5231/api/Review
   VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

---

## 👥 User Roles

### Customer

- Browse and search restaurants
- Place and track orders
- Write reviews
- Manage profile and payment methods

### Restaurant Owner (Manager)

- Manage food items and menu
- Process orders
- View analytics and reports
- Update restaurant information

### Administrator

- Manage all restaurants and users
- Create manager accounts
- View system-wide analytics
- Monitor platform performance

---

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/Users/register        # Register new user
POST /api/Users/login           # Login user
PUT  /api/Users/{id}            # Update user profile
POST /api/Users/change-password # Change password
```

### Restaurant Endpoints

```http
GET    /api/Restaurant                    # Get all restaurants
GET    /api/Restaurant/{id}               # Get restaurant by ID
GET    /api/Restaurant/getMyRestaurant    # Get authenticated manager's restaurant
POST   /api/Restaurant                    # Create restaurant
PUT    /api/Restaurant/{id}               # Update restaurant
DELETE /api/Restaurant/{id}               # Delete restaurant
```

### Food Item Endpoints

```http
GET    /api/FoodItems                     # Get all food items
GET    /api/FoodItems/{id}                # Get food item by ID
GET    /api/FoodItems/restaurant/{id}     # Get items by restaurant
POST   /api/FoodItems                     # Create food item
PUT    /api/FoodItems/{id}                # Update food item
DELETE /api/FoodItems/{id}                # Delete food item
```

### Order Endpoints

```http
GET    /api/Order                         # Get all orders
GET    /api/Order/{id}                    # Get order by ID
GET    /api/Order/user/{userId}           # Get user's orders
POST   /api/Order                         # Create order
PUT    /api/Order/{id}                    # Update order
PUT    /api/Order/{id}/status             # Update order status
DELETE /api/Order/{id}                    # Cancel order
```

### Review Endpoints

```http
GET    /api/Review/restaurant/{id}        # Get restaurant reviews
POST   /api/Review                        # Create review
PUT    /api/Review/{id}                   # Update review
DELETE /api/Review/{id}                   # Delete review
```

### Admin Endpoints

```http
GET    /api/Admin/statistics              # Get system-wide statistics
```

---

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: BCrypt with salt for password storage
- **Role-Based Access Control**: Granular permissions for different user types
- **Input Validation**: DTOs with data annotations
- **SQL Injection Prevention**: Entity Framework parameterized queries
- **CORS Configuration**: Controlled cross-origin resource sharing
- **HTTPS Enforcement**: Secure data transmission

---

## 🎯 Key Highlights

### Performance

- **Lazy Loading**: Optimized image loading
- **Pagination**: Efficient data retrieval
- **Caching**: Context-based state management
- **Code Splitting**: Route-based chunking

### User Experience

- **Responsive Design**: Mobile-first approach with Tailwind
- **Toast Notifications**: Real-time feedback
- **Loading States**: Smooth user feedback
- **Error Handling**: Comprehensive error messages

### Code Quality

- **TypeScript**: Type safety and better IDE support
- **ESLint**: Code quality enforcement
- **Clean Architecture**: Separation of concerns
- **Reusable Components**: DRY principles

---

## 📝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Authors

- **Omar Refaat** - [@omarrrefaatt](https://github.com/omarrrefaatt)

---

## 🙏 Acknowledgments

- Restaurant images from Unsplash
- Icons from Lucide React
- UI inspiration from modern food delivery platforms
- Community support from Stack Overflow and GitHub

---

<div align="center">
  
  ### 🌟 Star this repository if you find it helpful!
  
</div>
