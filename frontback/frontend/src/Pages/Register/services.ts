import { Dispatch } from "react";
import { AuthAction } from "../../Common/Contexts/Auth/AuthProvider";

const registerAPI = import.meta.env.VITE_REGISTER_API;

export const handleRegister = async (
  event: React.FormEvent,
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  phone: string,
  address: string,
  zipCode: string,
  cardId: number,
  setIsErrorVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorText: React.Dispatch<React.SetStateAction<string>>,
  navigate: (path: string) => void,
  dispatch: Dispatch<AuthAction>
) => {
  event.preventDefault();

  try {
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const response = await fetch(`${registerAPI}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email: email.toLowerCase(),
        password,
        confirmPassword,
        role: "Customer",
        phone,
        address,
        zipCode,
        cardId,
      }),
    });

    if (!response.ok) {
      throw new Error("Could not register you, please try again later");
    }

    const data = await response.json();

    localStorage.setItem("user", JSON.stringify(data.role));
    localStorage.setItem("token", JSON.stringify(data.token));
    console.log("Registration successful:", data.role);

    dispatch({ type: "LOGIN", payload: data });

    navigate(`/${data.role}-profile`);
  } catch (error) {
    if (error instanceof Error) {
      setErrorText(error.message);
    } else {
      setErrorText("Could not register you, please try again later");
    }
    setIsErrorVisible(true);
  }
};
