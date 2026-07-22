import React, { useState } from "react";
import loginBg from "../assets/login.jpg";

const Login: React.FC = () => {
  const [email, setEmail] = useState("example@gmail.com");
  const [password, setPassword] = useState("*****");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

   

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#50004A] ">
      <div className="flex w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">

        <div
          className="hidden md:flex w-1/2 bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${loginBg})`,
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>

          <div className="relative z-10 p-10 text-white flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-3">
              Welcome to TaskFlow
            </h1>

            <p className="text-gray-200">
              Manage your projects and tasks easily with our platform.
            </p>
          </div>
        </div>


        
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Sign In
            </h2>

            <p className="text-gray-500 mt-2">
              Login to your account
            </p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter email"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter password"
              />
            </div>


            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>


            <p className="text-center text-sm text-gray-500 mt-5">
              Don't have an account?
              <span className="text-indigo-600 cursor-pointer ml-1">
                Create Account
              </span>
            </p>

          </form>

        </div>

      </div>
    </div>
  );
};

export default Login;