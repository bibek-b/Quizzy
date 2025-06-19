import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApiCall from "../ApiCallHooks/ApiCall";
import { UserContext } from "../Context/UserContext";

const Login = () => {
  const [error, setError] = useState("");

  const { login } = useContext(UserContext);  

  const nav = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 3000);
  }, [error]);
  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
     const res =  await ApiCall.post("/auth/login", {
        email,
        password,
      });
      login(res.data.token);
      nav("/");
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
  };

  return (
    <div className="flex items-center justify-center w-[100vw] h-[100vh] flex-col gap-4 shadow-lg bg-purple-200">
      <form
        className="flex flex-col gap-3 bg-white p-5 w-[25vw] rounded shadow-lg text-xl"
        onSubmit={handleLogin}
      >
        <caption className="font-bold text-4xl">Sign In</caption>

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          required
          name="email"
          placeholder="abc@gmail.com"
          className="border border-gray-400 outline-0 rounded p-2 "
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          minLength={8}
          required
          placeholder="testings"
          className="border border-gray-400 outline-0 rounded p-2"
        />

        {error?.length > 0 && <p className="text-red-600">{error}</p>}

        <div className="flex flex-col items-center justify-center gap-3 mt-2">
          <button
            className="bg-blue-500 text-xl text-white p-1 rounded cursor-pointer hover:bg-blue-600 transition-all duration-300 hover:scale-105 w-[100px]"
            type="submit"
          >
            Login
          </button>
          <span className="text-xl">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500">
              Sign Up
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
