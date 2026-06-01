import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";

function RegisterPage() {
  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post("/auth/register", data);

      toast.success("Account created");

      navigate("/login");
    } catch (error) {
      console.error(error);

      toast.error("Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          Create Account
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Name"
            {...register("name")}
            className="w-full p-3 rounded-xl bg-slate-800 text-white"
          />

          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full p-3 rounded-xl bg-slate-800 text-white"
          />

          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full p-3 rounded-xl bg-slate-800 text-white"
          />

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-xl text-white font-semibold"
          >
            Register
          </button>
        </form>

        <p className="text-slate-400 mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;    