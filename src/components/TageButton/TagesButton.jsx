import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from '../../axios/axios';
import { useTranslation } from "react-i18next";

const TagsButtons = ({ tag }) => {
  const { t } = useTranslation("home");

  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleNavigate = (tag) => {
    navigate(`/products/tag/${tag}`);
  };

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const res = await api.get(`/products/tag/${tag}`);
        setRelatedProducts(res.data.products || []);       
      } catch (err) {
        console.error("Failed to load related products:", err);
      } finally {
        setLoading(false);
      }
    };

    if (tag) {
      fetchRelatedProducts();
    }
  }, [tag]);

  

  return (
    <button
      className="btn btn-outline btn-sm"
      onClick={() => navigate(`/products/tag/${tag}`)}
    >
    {t("readMore")} ❯
    </button>
  );
};

export default TagsButtons;
