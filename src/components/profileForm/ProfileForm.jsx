import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contextAuth/AuthContext";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import background from "../SignUp/assets/background.png";
import { api } from "../../axios/axios"; // ✅ axios instance

const ProfileForm = () => {
  const { t } = useTranslation("profileuser");
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  const fetchUserById = async (id) => {
    try {
      const { data } = await api.get(`/users/${id}`);
      setUser(data.user);
      setPreview(data.user.image);
    } catch (err) {
      toast.error(t("failedFetchUser"));

      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!localUser?.id) {
      navigate("/login");
    } else {
      fetchUserById(localUser.id);
    }
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (user.userName) formData.append("userName", JSON.stringify(user.userName));
    if (user.address) formData.append("address", JSON.stringify(user.address));
    if (user.phone) formData.append("phone", user.phone);
    if (imageFile) formData.append("image", imageFile);

    try {
      const { data } = await api.patch(`/users/me`, formData);

      toast.success(data.message);
      await fetchUserById(user._id || user.id);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error(t("unauthorizedLoginAgain"));
        logout();
        navigate("/login");
      } else {
        toast.error(t("somethingWentWrong"));
      }
    }
  };

  if (!user) return <span className="loading loading-dots loading-lg"></span>;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* الخلفية */}
      <div className="absolute inset-0 z-0">
        <img
          src={background}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* المحتوى */}
      <div className="relative z-10 flex items-center justify-center px-4 py-10">
        <form
          className="w-full max-w-3xl bg-white bg-opacity-90 p-6 rounded-lg shadow-lg space-y-6"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold text-center">
            {t("profileOverviewTitle")}
          </h2>

          {/* صورة المستخدم */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={preview || "/default-avatar.png"} alt="User Avatar" />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full md:w-auto"
            />
          </div>

          {/* الفورم */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="userName.en"
              type="text"
              placeholder={t("userName.en")}
              className="input input-bordered w-full"
              value={user.userName?.en || ""}
              onChange={(e) =>
                setUser((prev) => ({
                  ...prev,
                  userName: { ...prev.userName, en: e.target.value },
                }))
              }
            />
            <input
              name="userName.ar"
              type="text"
              placeholder={t("userName.ar")}
              className="input input-bordered w-full"
              value={user.userName?.ar || ""}
              onChange={(e) =>
                setUser((prev) => ({
                  ...prev,
                  userName: { ...prev.userName, ar: e.target.value },
                }))
              }
            />
            <input
              name="address.en"
              type="text"
              placeholder={t("address.en")}
              className="input input-bordered w-full"
              value={user.address?.en || ""}
              onChange={(e) =>
                setUser((prev) => ({
                  ...prev,
                  address: { ...prev.address, en: e.target.value },
                }))
              }
            />
            <input
              name="address.ar"
              type="text"
              placeholder={t("address.ar")}
              className="input input-bordered w-full"
              value={user.address?.ar || ""}
              onChange={(e) =>
                setUser((prev) => ({
                  ...prev,
                  address: { ...prev.address, ar: e.target.value },
                }))
              }
            />
            <input
              name="phone"
              type="text"
              placeholder={t("phone")}
              className="input input-bordered w-full"
              value={user.phone || ""}
              onChange={handleChange}
            />
            <input
              type="email"
              value={user.email}
              className="input input-bordered w-full bg-gray-100"
              disabled
              placeholder={t("email")}
            />
          </div>

          {/* الأزرار */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
            <button
              type="submit"
              className="btn bg-gray-500 text-white hover:bg-gray-600 w-full md:w-auto"
            >
              {t("updateProfile")}
            </button>
            <button
              type="button"
              onClick={() => navigate("/changePassword")}
              className="btn bg-gray-500 text-white hover:bg-gray-600 w-full md:w-auto"
            >
              {t("changePassword")}
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="btn bg-red-500 text-white hover:bg-red-600 w-full md:w-auto"
            >
              {t("logout")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
