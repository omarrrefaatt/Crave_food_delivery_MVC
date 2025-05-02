using System.Text.RegularExpressions;

namespace Crave.API.Helpers{
public static class PasswordValidator
{
    public static bool IsPasswordValid(string password, out string errorMessage)
    {
        errorMessage = "";

        if (string.IsNullOrWhiteSpace(password))
        {
            errorMessage = "Password cannot be empty.";
            return false;
        }

        if (password.Length < 8)
        {
            errorMessage = "Password must be at least 8 characters long.";
            return false;
        }

        if (!Regex.IsMatch(password, @"[A-Z]"))
        {
            errorMessage = "Password must contain at least one uppercase letter.";
            return false;
        }

        if (!Regex.IsMatch(password, @"[a-z]"))
        {
            errorMessage = "Password must contain at least one lowercase letter.";
            return false;
        }

        if (!Regex.IsMatch(password, @"[0-9]"))
        {
            errorMessage = "Password must contain at least one digit.";
            return false;
        }

        if (!Regex.IsMatch(password, @"[\W_]"))
        {
            errorMessage = "Password must contain at least one special character.";
            return false;
        }

        return true;
    }
}
}