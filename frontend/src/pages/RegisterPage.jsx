import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { Mail, Lock, User, Eye, EyeOff, Scale, ArrowRight, Loader2 } from "lucide-react";

function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await api.post("/auth/register", data);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "var(--bg-primary)",
        backgroundImage:
          "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(79,140,255,0.12), transparent), radial-gradient(ellipse 50% 40% at 80% 100%, rgba(79,140,255,0.05), transparent)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(79,140,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,140,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <div className="fade-in" style={{ width: "100%", maxWidth: "440px", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #4f8cff 0%, #3b73e8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 28px rgba(79,140,255,0.45)",
            }}
          >
            <Scale size={24} color="#fff" />
          </div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "800",
              color: "#f1f5f9",
              letterSpacing: "-0.04em",
            }}
          >
            Create your account
          </h1>
          <p style={{ color: "#8b9ab3", marginTop: "8px", fontSize: "14px" }}>
            Start your enterprise legal AI workspace
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "rgba(13,17,23,0.95)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            padding: "36px 32px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Name */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#8b9ab3",
                  marginBottom: "8px",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                Full name
              </label>
              <div style={{ position: "relative" }}>
                <User
                  size={15}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#4b5a72",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  placeholder="Your full name"
                  {...register("name", { required: true })}
                  style={{
                    width: "100%",
                    height: "48px",
                    paddingLeft: "42px",
                    paddingRight: "16px",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#8b9ab3",
                  marginBottom: "8px",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                Email address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={15}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#4b5a72",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="email"
                  placeholder="you@company.com"
                  {...register("email", { required: true })}
                  style={{
                    width: "100%",
                    height: "48px",
                    paddingLeft: "42px",
                    paddingRight: "16px",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#8b9ab3",
                  marginBottom: "8px",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={15}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#4b5a72",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Create a strong password"
                  {...register("password", { required: true })}
                  style={{
                    width: "100%",
                    height: "48px",
                    paddingLeft: "42px",
                    paddingRight: "48px",
                    fontSize: "14px",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#4b5a72",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                  }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Terms note */}
            <p style={{ fontSize: "12px", color: "#4b5a72", textAlign: "center" }}>
              By registering you agree to our{" "}
              <span style={{ color: "#4f8cff" }}>Terms of Service</span>
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                height: "48px",
                fontSize: "14px",
                justifyContent: "center",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p
            style={{
              textAlign: "center",
              marginTop: "24px",
              fontSize: "13.5px",
              color: "#8b9ab3",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#4f8cff",
                fontWeight: "600",
              }}
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;