import { useForm } from "react-hook-form";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import api from "../services/api";

import toast from "react-hot-toast";

import { Toaster } from "react-hot-toast";

import { useState } from "react";

function LoginPage() {

  // ======================================
  // FORM
  // ======================================

  const {
    register,
    handleSubmit,
  } = useForm();

  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(false);


  // ======================================
  // LOGIN SUBMIT
  // ======================================

  const onSubmit =
    async (data) => {

      try {

        setLoading(true);

        const response =
          await api.post(

            "/auth/login",

            data
          );

        // ======================================
        // SAVE JWT TOKEN
        // ======================================

        localStorage.setItem(

          "token",

          response.data.token
        );

        // ======================================
        // SUCCESS TOAST
        // ======================================

        toast.success(
          "Login successful"
        );

        // ======================================
        // REDIRECT
        // ======================================

        setTimeout(() => {

          navigate(
            "/documents"
          );

        }, 1000);

      } catch (error) {

        console.error(
          "Login error:",
          error
        );

        toast.error(

          error.response?.data?.message ||

          "Login failed"
        );

      } finally {

        setLoading(false);
      }
    };


  // ======================================
  // COMPONENT
  // ======================================

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <Toaster position="top-right" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-white">

            Welcome Back

          </h1>

          <p className="text-slate-400 mt-2">

            Sign in to continue to LexDraft

          </p>

        </div>


        {/* Form */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >

          {/* Email */}

          <div>

            <label className="block text-sm text-slate-400 mb-2">

              Email

            </label>

            <input
              type="email"

              placeholder="Enter your email"

              {...register("email")}

              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-blue-500 transition"
            />

          </div>


          {/* Password */}

          <div>

            <label className="block text-sm text-slate-400 mb-2">

              Password

            </label>

            <input
              type="password"

              placeholder="Enter your password"

              {...register("password")}

              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-blue-500 transition"
            />

          </div>


          {/* Login Button */}

          <button

            type="submit"

            disabled={loading}

            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition p-3 rounded-xl text-white font-semibold"
          >

            {loading
              ? "Signing in..."
              : "Login"}

          </button>

        </form>


        {/* Footer */}

        <p className="text-slate-400 mt-6 text-center">

          Don’t have an account?{" "}

          <Link
            to="/register"
            className="text-blue-400 hover:text-blue-300 transition"
          >

            Register

          </Link>

        </p>

      </div>

    </div>
  );
}

export default LoginPage;