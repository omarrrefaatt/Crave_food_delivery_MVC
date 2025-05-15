import ReusableCard from "../../Common/Components/Reusable-Card/reusableCard";
import Cravelogo from "../../assets/navbar_logo.png";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "../../Common/Components/Error-Message/errorMessage";
import { useState } from "react";
import { useAuthContext } from "../../Common/Contexts/Auth/AuthHook";
import { handleRegister as handleRegisterService } from "./services";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [errorText, setErrorText] = useState("");
  const { dispatch } = useAuthContext();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [cardId, setCardId] = useState("");

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const cardIdValue = cardId ? parseInt(cardId) : 0;

      // Call the imported service function instead of direct fetch
      await handleRegisterService(
        event,
        name,
        email,
        password,
        confirmPassword,
        phone,
        address,
        zipCode,
        cardIdValue,
        setIsErrorVisible,
        setErrorText,
        navigate,
        dispatch
      );
    } catch (error) {
      if (error instanceof Error) {
        setErrorText(error.message);
      } else {
        setErrorText("Could not register you, please try again later");
      }
      setIsErrorVisible(true);
    }
  };

  return (
    <div className="h-fit flex flex-col justify-between items-center">
      <div className="flex flex-row justify-start items-center space-x-4 my-4">
        <img src={Cravelogo} alt="clinic logo" className="size-20" />
        <p className="text-4xl text-black font-thin font-serif">
          <span className="text-crimson">Crave</span>
          delivery
        </p>
      </div>

      <ReusableCard backgroundColor="white">
        <div className="flex flex-col items-center font-serif p-4">
          <p className="font-bold text-xl text-center">
            Welcome to Crave delivery registration form!
          </p>
          <p className="text-gray-600 text-md">
            It's quick and easy to register with us
          </p>
        </div>
        <hr className="bg-gray-500 my-2 w-full" />
        <form
          className="w-full"
          onSubmit={handleRegister}
          id="registerForm"
          encType="application/x-www-form-urlencoded"
        >
          <div className="flex p-2">
            <input
              type="text"
              id="name"
              className="text-gray-400 rounded-md border-2 p-2 w-full"
              placeholder="Full Name"
              required={true}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex p-2">
            <input
              type="email"
              id="email"
              className="text-gray-400 rounded-md border-2 p-2 w-full font-serif"
              placeholder="Email Address"
              required={true}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex p-2">
            <input
              type="tel"
              id="phone"
              className="text-gray-400 rounded-md border-2 p-2 w-full font-sans"
              placeholder="Phone Number"
              required={true}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="flex p-2">
            <input
              type="text"
              id="address"
              className="text-gray-400 rounded-md border-2 p-2 w-full"
              placeholder="Address"
              required={true}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="flex p-2">
            <input
              type="text"
              id="zipCode"
              className="text-gray-400 rounded-md border-2 p-2 w-full"
              placeholder="Zip Code"
              required={true}
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
          <div className="flex p-2">
            <input
              type="number"
              id="cardId"
              className="text-gray-400 rounded-md border-2 p-2 w-full"
              placeholder="Card ID (Optional)"
              value={cardId}
              onChange={(e) => setCardId(e.target.value)}
            />
          </div>

          <div className="flex flex-row space-x-4 p-2 font-serif items-center">
            <div className="flex flex-row justify-between py-2 font-serif items-center text-gray-400 w-full space-x-2">
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="registerPassword"
                placeholder="Password"
                required={true}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border-2 p-2"
                pattern="(?=.*\d)(?=.*[A-Z])(?=.*\W).{8,}"
                title="Password must be at least 8 characters long and include at least one number, one capital letter, and one special character."
              />
              {isPasswordVisible ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 cursor-pointer"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 cursor-pointer"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              )}
            </div>
            <div className="flex flex-row justify-between py-2 font-serif items-center text-gray-400 w-full space-x-2">
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                id="registerConfirmPassword"
                placeholder="Confirm Password"
                required={true}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border-2 p-2"
                pattern="(?=.*\d)(?=.*[A-Z])(?=.*\W).{8,}"
                title="Password must be at least 8 characters long and include at least one number, one capital letter, and one special character."
              />
              {isConfirmPasswordVisible ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 cursor-pointer"
                  onClick={() =>
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 cursor-pointer"
                  onClick={() =>
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              )}
            </div>
          </div>

          <hr className="bg-gray-500 my-2 w-full" />
          <div className="flex flex-col justify-center items-center p-4 space-y-2">
            <ErrorMessage text={errorText} isVisible={isErrorVisible} />
            <button
              className="bg-crimson text-white w-full p-2 rounded-md hover:bg-black transition-colors duration-300 ease-in-out"
              type="submit"
            >
              Register
            </button>
            <Link
              to="/login"
              className="text-sm text-crimson hover:underline hover:underline-offset-2"
            >
              Already registered before?
            </Link>
          </div>
        </form>
      </ReusableCard>
    </div>
  );
};

export default RegisterPage;
