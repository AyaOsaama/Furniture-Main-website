// PostComments.jsx
import React, { useState, useEffect } from "react";
import { FaRegUser } from "react-icons/fa";
import MessageIcon from "../../../../assets/icons/message.svg";
import { api } from "../../../../axios/axios";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n";

const PostComments = ({ post }) => {
  const { t } = useTranslation("postdetails");
  const currentLanguage = i18n.language;
  const [showComments, setShowComments] = useState(true);
  const [comments, setComments] = useState(post.comments || []);
  const [commentData, setCommentData] = useState({
    comment: "",
    name: "",
    saveInfo: false,
  });
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/posts/${post._id}`);
        setComments(res.data.comments || []);
      } catch (err) {
        setComments([]);
      }
    };
    fetchComments();
  }, [post._id]);

  useEffect(() => {
    const savedInfo = localStorage.getItem("commentUserInfo");
    if (savedInfo) {
      const parsed = JSON.parse(savedInfo);
      setCommentData((prev) => ({
        ...prev,
        name: parsed.name || "",
        saveInfo: false,
      }));
    }
  }, []);

  useEffect(() => {
    if (commentData.saveInfo) {
      localStorage.setItem(
        "commentUserInfo",
        JSON.stringify({
          name: commentData.name,
        })
      );
    }
  }, [commentData.saveInfo, commentData.name]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCommentData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, success: false, error: null });

    const user = localStorage.getItem("user");
    let userId = null;
    let userName = null;
    let userImage = null;
    let userEmail = null;

    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        userId = parsedUser.id;
        userName = parsedUser.userName;
        userImage = parsedUser.image;
        userEmail = parsedUser.email;
      } catch (err) {
        console.error("Invalid JSON in localStorage user:", err);
      }
    }

    if (!userId) {
      setSubmitStatus({
        loading: false,
        success: false,
        error: "User ID not found. Please login.",
      });
      return;
    }

    try {
      const res = await api.post(`/posts/comment/${post._id}`, {
        userId,
        comment: commentData.comment,
      });

      setSubmitStatus({ loading: false, success: true, error: null });
      setCommentData((prev) => ({
        ...prev,
        comment: "",
        ...(!prev.saveInfo && { name: "" }),
      }));

      setComments((prev) => [
        ...prev,
        {
          ...res.data.comment,
          user: res.data.user || {
            userName: userName,
            image: userImage,
            email: userEmail,
          },
        },
      ]);

      setTimeout(() => {
        setSubmitStatus((prev) => ({ ...prev, success: false }));
      }, 2000);
    } catch (err) {
      setSubmitStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || err.message || t("error"),
      });
    }
  };

  useEffect(() => {
    setComments(post.comments || []);
  }, [post]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8 bg-white rounded-2xl shadow-lg mt-10">
      <button
        onClick={() => setShowComments((prev) => !prev)}
        className="mb-6 px-5 py-2 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition font-semibold text-sm"
      >
        {showComments ? t("hideComments") : t("showComments")}
      </button>

      {showComments && (
        <>
          {/* Comments List */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <img src={MessageIcon} alt="comments" className="w-6 h-6" />
              {t("comments")}
            </h3>
            {comments.length === 0 ? (
              <p className="text-gray-500">{t("noComments")}</p>
            ) : (
              <ul className="space-y-4">
                {comments.map((c, idx) => {
                  const name =
                    c.user?.userName?.[currentLanguage] ||
                    c.user?.userName?.en ||
                    c.user?.userName?.ar ||
                    c.username ||
                    c.user?.email?.split("@")[0] ||
                    t("anonymous");

                  const image =
                    c.user?.image ||
                    c.user?.avatar ||
                    "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(name);

                  return (
                    <li
                      key={c._id || idx}
                      className="flex items-start gap-4 bg-gray-100 rounded-xl p-4"
                    >
                      <img
                        src={image}
                        alt={name}
                        className="w-12 h-12 rounded-full border object-cover"
                      />
                      <div>
                        <div className="font-semibold text-sm text-gray-800">
                          {name}
                        </div>
                        <div className="text-gray-700 text-sm">
                          {c.comment}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Add Comment Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-gray-50 p-6 rounded-xl border"
          >
            <div>
              <label
                htmlFor="comment"
                className="block font-medium mb-2 text-sm text-gray-700"
              >
                {t("comment.yourComment")}
              </label>
              <textarea
                id="comment"
                name="comment"
                value={commentData.comment}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                id="saveInfo"
                name="saveInfo"
                checked={commentData.saveInfo}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <label htmlFor="saveInfo">{t("comment.savingInfo")}</label>
            </div>
            <button
              type="submit"
              disabled={submitStatus.loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {submitStatus.loading
                ? t("comment.loading")
                : t("comment.submit")}
            </button>

            {submitStatus.success && (
              <p className="text-green-600 text-sm">
                {t("comment.success") || "Comment submitted successfully!"}
              </p>
            )}
            {submitStatus.error && (
              <p className="text-red-500 text-sm">{submitStatus.error}</p>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default PostComments;
