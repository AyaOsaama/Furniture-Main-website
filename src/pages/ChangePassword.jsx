import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contextAuth/AuthContext";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import background from "../components/SignUp/assets/background.png";
import { api } from "../axios/axios";

const ChangePassword = () => {
  const { t } = useTranslation("changepassword");

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error(t("errorPasswordMismatch"));
      return;
    }

    try {
      const { data } = await api.patch("/users/changePassword", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      toast.success(data.message);
      navigate("/profile");
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error(t("errorSessionExpired"));
        logout();
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || t("errorUpdateFailed"));
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen overflow-hidden"
    >
      {/* الخلفية */}
      <div className="absolute inset-0">
        <img
          src={background}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* محتوى الفورم */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800">
            {t("title")}
          </h2>

          <input
            type="password"
            name="oldPassword"
            placeholder={t("oldPasswordPlaceholder")}
            className="input input-bordered w-full"
            value={form.oldPassword}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="newPassword"
            placeholder={t("newPasswordPlaceholder")}
            className="input input-bordered w-full"
            value={form.newPassword}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder={t("confirmPasswordPlaceholder")}
            className="input input-bordered w-full"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="btn bg-[#3A5B22] text-white w-full hover:bg-[#2f4c1b]"
          >
            {t("updateButton")}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ChangePassword;
