import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import loginBg from "../assets/login.jpg";
import { useAuthStore } from "../store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const success = await login(email.trim(), password);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] p-4 sm:p-6">
      <div className="w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden bg-white flex flex-col md:flex-row min-h-[560px] md:min-h-[620px]">
        <div
          className="hidden md:flex md:w-[45%] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${loginBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-purple-900/50 to-purple-800/30" />

          <div className="relative z-10 p-10 lg:p-12 text-white flex flex-col justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Clock size={22} />
              </div>
              <span className="text-xl font-bold tracking-tight">TimeSwift</span>
            </div>

            <div>
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
                Track time.
                <br />
                Ship faster.
              </h1>
              <p className="text-purple-100/90 text-base leading-relaxed max-w-sm">
                Manage projects, tasks, and timesheets in one clean workspace built
                for modern teams.
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm text-purple-100/80">
              <div>
                <p className="text-2xl font-bold text-white">2.4k+</p>
                <p>Active users</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <p className="text-2xl font-bold text-white">98%</p>
                <p>Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center text-white">
              <Clock size={20} />
            </div>
            <span className="text-lg font-bold text-gray-900">TimeSwift</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-gray-500 mt-2">
              Sign in to continue to your dashboard
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm animate-slideDown">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-600">Remember me for 30 days</span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3.5 rounded-xl font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-purple-200 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don&apos;t have an account?{" "}
            <button type="button" className="font-semibold text-purple-600 hover:text-purple-700">
              Create account
            </button>
          </p>

          <p className="text-center text-xs text-gray-400 mt-6">
            Demo: admin@test.com / 123456
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
