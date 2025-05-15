import Footer from "../../Common/Components/Footer/footer";
import ReusableCard from "../../Common/Components/Reusable-Card/reusableCard";
import craveLogo from "../../assets/Red and White Simple Delivery Logo.svg";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "../../Common/Components/Error-Message/errorMessage";
import { useState } from "react";
import { handleLogin } from "./services";
import { useAuthContext } from "../../Common/Contexts/Auth/AuthHook";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const { dispatch } = useAuthContext();

  return (
    <div className="min-h-screen flex flex-col justify-between items-center">
      <div className="flex flex-row items-center justify-start space-x-4 mt-20">
        <div className="flex flex-row items-center justify-start space-x-8 mt-24 px-6 md:px-16">
          <img
            src={craveLogo}
            alt="Crave logo"
            className="w-200 h-200 object-contain drop-shadow-xl"
          />
          <div className="flex flex-col justify-center items-start space-y-2">
            <p className="text-2xl text-gray-800 font-semibold font-sans">
              Welcome back to
            </p>
            <h1 className="text-4xl font-bold text-crimson-500 font-serif tracking-wide">
              Crave
            </h1>
            <p className="text-md text-gray-500 font-light italic">
              Ready to order your favorites?
            </p>
          </div>
        </div>

        <ReusableCard backgroundColor="white">
          <form
            className="w-[400px]"
            onSubmit={(e) =>
              handleLogin(
                e,
                email,
                password,
                setIsErrorVisible,
                navigate,
                dispatch
              )
            }
            id="loginForm"
            encType="application/x-www-form-urlencoded"
          >
            <div className="flex flex-col space-y-4 p-4 font-serif items-center">
              <input
                type="email"
                id="loginEmail"
                className="text-gray-400 rounded-md border-2 p-2 w-full"
                placeholder="Email Address"
                required={true}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex flex-row justify-between py-2 font-serif items-center text-gray-400 w-full space-x-2">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  id="loginPassword"
                  placeholder="Password"
                  required={true}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border-2 p-2"
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
              <ErrorMessage
                text="Invalid email or password"
                isVisible={isErrorVisible}
              />
              <button
                className="bg-crimson text-white w-full p-2 rounded-md hover:bg-black transition-colors duration-300 ease-in-out"
                type="submit"
              >
                Log in
              </button>
              <Link
                to="/forgot-password"
                className="text-sm text-customBlue hover:underline hover:underline-offset-2"
              >
                Forgotten Password ?
              </Link>
              <hr className="bg-gray-500 my-4 w-full" />
              <button
                className="bg-gray-700 text-white w-2/3 p-2 rounded-md hover:bg-customBlue transition-colors duration-300 ease-in-out"
                onClick={() => navigate("/register")}
                type="button"
              >
                Register
              </button>
            </div>
          </form>
        </ReusableCard>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
