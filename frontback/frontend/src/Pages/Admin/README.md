# Admin Module Setup

## Environment Variables

Add the following environment variables to your `.env` file:

```
VITE_API_URL="http://localhost:5231/api"
```

The existing variables should already include:
```
VITE_LOGIN_API="http://localhost:5231/api/Users/login"
VITE_REGISTER_API="http://localhost:5231/api/Users/register"
VITE_PROFILE_API="http://localhost:5231/api/Users/profile"
VITE_USER_ORDERS_API="http://localhost:5231/api/Order/user"
VITE_GET_ALL_RESTAURANTS_API="http://localhost:5231/api/Restaurant"
```

## API Endpoints Used

The Admin module uses the following API endpoints:

1. **Restaurants**
   - GET `/api/Restaurant` - Get all restaurants
   - POST `/api/Restaurant` - Add a new restaurant
   - DELETE `/api/Restaurant/{id}` - Delete a restaurant

2. **Managers**
   - GET `/api/Users/managers` - Get all managers
   - POST `/api/Users/managers` - Add a new manager

## Dependencies

No additional dependencies are required for this module as it uses the existing project setup.

## Best Practices

1. Always check for user authentication before rendering admin components
2. Handle loading states and errors appropriately
3. Use proper validation for form inputs
4. Provide clear feedback to users after actions (success/error messages)
5. Implement confirmation dialogs for destructive actions like deletion
