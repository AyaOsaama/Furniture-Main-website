import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../searchContext/SearchContext.jsx";
import Carousel from "../components/carousel/carousel.jsx";
import Chair from "../assets/images/chair.png";
import Table from "../assets/images/table.png";
import Contemporarylamps from "../assets/images/contemporary_lamps.png";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import coverOne from "../assets/images/c1.png";
import coverTwo from "../assets/images/c2.jpg";
import coverThree from "../assets/images/c3.jpg";
import coverFour from "../assets/images/c4.jpg";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import i18n from "../i18n.js";
import { api } from "../axios/axios";
import TagsButtons from "../components/TageButton/TagesButton.jsx";
import Diff from "../components/diff/diff.jsx";

function Home() {
  const { t } = useTranslation("home");
  const currentLang = i18n.language;
  const { searchQuery } = useContext(SearchContext);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data.posts);
        setFilteredPosts(response.data.posts);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch posts");
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  const sections = [
    {
      title: t("stylishChairs"),
      image: Chair,
      description: t("stylishChairsDesc"),
      tag: "chair" 
    },
    {
      title: t("table"),
      image: Table,
      description: t("tableDesc"),
      tag: "table" 

    },
    {
      title: t("contemporaryLamps"),
      image: Contemporarylamps,
      description: t("contemporaryLampsDesc"),
      tag: "decor" 

    },
  ];

  const bannerSlides = [
    {
      id: 1,
      type: "banner",
      image: coverOne,
      title: t("banner1Title"),
      description: t("banner1Desc"),
      button: t("viewMore"),
    },
    {
      id: 2,
      type: "banner",
      image: coverTwo,
      title: t("banner2Title"),
      description: t("banner2Desc"),
      button: t("viewMore"),
    },
    {
      id: 3,
      image: coverThree,
      title: t("banner3Title"),
      description: t("banner3Desc"),
      button: t("viewMore"),
    },
    {
      id: 4,
      image: coverFour,
      title: t("banner4Title"),
      description: t("banner4Desc"),
      button: t("viewMore"),
    },
  ];

  const serviceItems = [
    {
      icon: <AccessTimeIcon />,
      title: t("shopOnline"),
      description: t("shopOnlineDesc"),
    },
    {
      icon: <ShoppingBagOutlinedIcon />,
      title: t("freeShipping"),
      description: t("freeShippingDesc"),
    },
    {
      icon: <PaymentOutlinedIcon />,
      title: t("returnPolicy"),
      description: t("returnPolicyDesc"),
    },
    {
      icon: <MonetizationOnOutlinedIcon />,
      title: t("payment"),
      description: t("paymentDesc"),
    },
  ];

  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = serviceItems.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Carousel slides={bannerSlides} variant="banner" idPrefix="banner" />


      {/* Sections */}
    {filteredSections.length > 0 ? (
  filteredSections.map((section, index) => (
    <div
      key={index}
      className={`flex flex-col lg:flex-row ${
        index % 2 === 0 ? "lg:flex-row-reverse" : ""
      } items-center gap-6 sm:gap-10 lg:gap-16 my-12 sm:my-16 px-4`}
    >
      <div className="w-full lg:w-1/2">
        <img
          src={section.image}
          alt={section.title}
          className="w-full max-w-[280px] sm:max-w-[350px] mx-auto"
        />
      </div>
      <div className="w-full lg:w-1/2 text-center">
        <h1 className="text-[#373737] text-2xl sm:text-3xl lg:text-4xl font-bold font-['PTSans'] uppercase mb-4">
          {section.title}
        </h1>
        <p className="text-[#ABABAB] text-sm sm:text-base lg:text-lg font-['PTSans'] max-w-md mx-auto mb-6">
          {section.description}
        </p>
        {section.tag ? (
          <TagsButtons tag={section.tag} />
        ) : (
          <button className="btn btn-outline btn-sm">{t("viewMore")}</button>
        )}
      </div>
    </div>
  ))
) : (
  <p className="text-center text-gray-500 mt-8">
    {t("noSectionsFound") || "No sections found."}
  </p>
)}
{/* Diff */}
<Diff></Diff>

      {/* Services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 my-12 px-4 text-center sm:text-left justify-items-center">
        {filteredServices.length > 0 ? (
          filteredServices.map((item, index) => (
            <div key={index} className="max-w-[250px]">
              <div className="flex justify-center sm:justify-start items-center mb-2">
                {item.icon}
                <p className="ml-2 font-bold text-[#353535]">{item.title}</p>
              </div>
              <p className="text-[#ABABAB]">{item.description}</p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            {t("noServicesFound") || "No services found."}
          </p>
        )}
      </div>

      {/* Blog Cards */}
      <div className="my-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#373737] uppercase font-['PTSans']">
            {t("Recent Posts") || "Latest Blog Posts"}
          </h2>
          <div className="w-20 h-1 bg-[#373737] mx-auto mt-4"></div>
        </div>

        {loading ? (
          <div className="text-center">Loading posts...</div>
        ) : filteredPosts.length > 0 ? (
          <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 max-w-6xl mx-auto">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow w-full max-w-md mx-auto"
              >
                <figure className="h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title?.[currentLang]}
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <p className="text-sm text-[#777777] font-[PTSans]">
                    {post.createdAt}
                  </p>
                  <h3 className="card-title text-lg sm:text-xl text-[#2D2D2D] font-bold font-[PTSans] mt-2">
                    {post.title?.[currentLang]}
                  </h3>
                  <p className="text-[#ABABAB] mt-2 mb-4">
                    {post.description?.[currentLang]}
                  </p>
                  <div className="card-actions">
                    <Link to={`/blog/${post._id}`}>
                      <button className="btn btn-outline btn-sm sm:btn-md">
                        {t("readMore")} ❯
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            {t("noPostsFound") || "No blog posts found."}
          </p>
        )}

        <div className="text-center mt-12">
          <Link to="/blog">
            <button className="btn btn-outline">
              {t("viewAllPosts") || "View All Blog Posts"} ❯
            </button>
          </Link>
        </div>
      </div>

      {/* Quotes Carousel */}
      <div className="mt-20">
        <Carousel slides={[]} variant="quoutes" idPrefix="quoutes" />
      </div>
    </>
  );
}

export default Home;
