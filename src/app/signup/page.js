
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Sparkles, UserPlus, Check } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "candidate",
    languages: [],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [fetchingLanguages, setFetchingLanguages] = useState(true);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const router = useRouter();

  // Fetch languages on component mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("/api/language");
        const data = await response.json();
        if (response.ok) {
          setLanguages(data.languages || []);
        }
      } catch (error) {
        console.error("Error fetching languages:", error);
        toast.error("Failed to load languages");
      } finally {
        setFetchingLanguages(false);
      }
    };

    fetchLanguages();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const toggleLanguage = (langId) => {
    setFormData((prev) => {
      const isSelected = prev.languages.includes(langId);
      if (isSelected) {
        return {
          ...prev,
          languages: prev.languages.filter((id) => id !== langId),
        };
      } else {
        return {
          ...prev,
          languages: [...prev.languages, langId],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      setLoading(false);
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (!formData.languages || formData.languages.length === 0) {
      toast.error("Please select at least one language");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        toast.success("Account created successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toast.error(data.message || "Failed to create account");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/login-bg.png"
        alt="Background"
        fill
        priority
        className="object-cover z-0"
      />

      {/* Toast */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Signup Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-green-200"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/teja (6).png"
            alt="teja-logo"
            width={140}
            height={50}
            className="object-contain rounded-3xl"
          />
        </div>

        <h1 className="text-3xl font-bold text-center text-green-600 mb-2">
          <UserPlus className="inline-block w-8 h-8 mr-2 mb-1" />
          Create Account
        </h1>
        <p className="text-center text-sm text-gray-600 mb-6">
          <b>Sign up to get started</b>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Input */}
          <div className="relative">
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="peer w-full border border-gray-300 rounded-md px-4 pt-6 pb-2 text-base text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Full Name"
              disabled={loading}
            />
            <label
              htmlFor="fullName"
              className="absolute left-5 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600"
            >
              Full Name*
            </label>
          </div>

          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="peer w-full border border-gray-300 rounded-md px-4 pt-6 pb-2 text-base text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Email"
              disabled={loading}
            />
            <label
              htmlFor="email"
              className="absolute left-5 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600"
            >
              Email address*
            </label>
          </div>

          {/* Password field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="peer w-full border border-gray-300 rounded-md py-4 px-5 text-lg bg-transparent placeholder-transparent pr-12 focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className="absolute left-5 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600"
            >
              Password*
            </label>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Role Selection - Radio Buttons */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 font-medium">Select Role</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange("candidate")}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                  formData.role === "candidate"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-green-300"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  formData.role === "candidate" ? "border-green-500" : "border-gray-400"
                }`}>
                  {formData.role === "candidate" && (
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  )}
                </div>
                Candidate
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("quality-assurance")}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                  formData.role === "quality-assurance"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-green-300"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  formData.role === "quality-assurance" ? "border-green-500" : "border-gray-400"
                }`}>
                  {formData.role === "quality-assurance" && (
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  )}
                </div>
                QA
              </button>
            </div>
          </div>

          {/* Language Selection - Dropdown */}
          <div className="relative space-y-2">
            <label className="text-sm text-gray-600 font-medium">
              Select Languages ({formData.languages.length} selected)
            </label>
            <button
              type="button"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              disabled={fetchingLanguages || loading}
              className="w-full py-3 px-4 rounded-lg border-2 border-gray-200 bg-white text-left flex items-center justify-between hover:border-green-300 transition-colors"
            >
              <span className={formData.languages.length > 0 ? "text-gray-800" : "text-gray-400"}>
                {formData.languages.length > 0
                  ? `${formData.languages.length} language(s) selected`
                  : "Choose languages..."}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${showLanguageDropdown ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Options */}
            {showLanguageDropdown && (
              <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {fetchingLanguages ? (
                  <div className="py-3 px-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-green-500 mx-auto"></div>
                  </div>
                ) : languages.length > 0 ? (
                  languages.map((lang) => (
                    <button
                      key={lang._id}
                      type="button"
                      onClick={() => toggleLanguage(lang._id)}
                      className={`w-full py-2 px-4 text-left flex items-center justify-between hover:bg-green-50 transition-colors ${
                        formData.languages.includes(lang._id)
                          ? "bg-green-50 text-green-700"
                          : "text-gray-700"
                      }`}
                    >
                      <span>{lang.language}</span>
                      {formData.languages.includes(lang._id) && (
                        <Check className="w-4 h-4 text-green-500" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="py-3 px-4 text-center text-gray-500">
                    No languages available
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit button */}
          {loading ? (
            <div className="flex flex-col items-center py-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-green-500 mb-2"></div>
              <span className="text-green-600 font-medium">Creating account...</span>
            </div>
          ) : (
            <button
              type="submit"
              className="hover:cursor-pointer w-full bg-green-600 text-white font-semibold text-lg py-3 rounded-md hover:bg-green-700 transition duration-300 shadow-md"
            >
              Sign Up
            </button>
          )}
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-green-600 font-semibold hover:underline cursor-pointer"
            >
              Log in
            </span>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 italic flex items-center justify-center gap-1">
            <Sparkles className="h-4 w-4 text-green-500 animate-pulse" />
            Powered by{" "}
            <span className="text-green-600 font-semibold not-italic hover:underline transition">
              Solvimate
            </span>
            <Sparkles className="h-4 w-4 text-green-500 animate-pulse" />
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;

