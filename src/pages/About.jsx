import Hero from "../components/hero/hero.jsx";
import Layout from "../components/layout/layout.jsx";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import bannerAbout from "../assets/images/Rectangle 48.png";
import Functionality from "../components/functionality/functionality.jsx";
import ProgressBar from "../components/progressbar/progressbar.jsx";
import Card from "../components/card/card.jsx";
import cardOne from "../assets/images/card-one.png";
import cardTwo from "../assets/images/card-two.png";
import cardThree from "../assets/images/card-three.png";
import { useTranslation } from "react-i18next";
import { SearchContext } from "../searchContext/SearchContext.jsx";
import { React,useContext,Fragment } from "react";
import TagsButtons from "../components/TageButton/TagesButton.jsx";

function About() {
  const { t } = useTranslation("about");
  const { searchQuery } = useContext(SearchContext);
  const sections = [
    {
      title: t("Sofas"),
      image: cardOne,
      description: t("stylishSofasDesc"),
      tag: "sofa" 
    },
    {
      title: t("chairs"),
      image: cardTwo,
      description: t("chairsDesc"),
      tag: "chair" 

    },
    {
      title: t("decores"),
      image: cardThree,
      description: t("decorsDesc"),
      tag: "decor"

    },
  ];
  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // بيانات المميزات مع localization
  const features = [
    {
      icon: <AccessTimeIcon />,
      title: t("shopOnlineTitle"),
      description: t("shopOnlineDesc"),
    },
    {
      icon: <ShoppingBagOutlinedIcon />,
      title: t("freeShippingTitle"),
      description: t("freeShippingDesc"),
    },
    {
      icon: <PaymentOutlinedIcon />,
      title: t("returnPolicyTitle"),
      description: t("returnPolicyDesc"),
    },
    {
      icon: <MonetizationOnOutlinedIcon />,
      title: t("paymentTitle"),
      description: t("paymentDesc"),
    },
  ];



  // فلترة حسب البحث
  const filteredFeatures = features.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <Hero />

      {/* FEATURES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 my-8 px-2 justify-items-center">
        {filteredFeatures.length > 0 ? (
          filteredFeatures.map((item, index) => (
            <div key={index}>
              <div className="flex items-center mb-2">
                {item.icon}
                <p className="ml-2 font-bold text-[#353535]">{item.title}</p>
              </div>
              <p className="text-[#ABABAB] max-w-[200px]">{item.description}</p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            {t("noFeaturesFound") || "No features found."}
          </p>
        )}
      </div>

      {/* BANNER */}
      <img
        src={bannerAbout}
        alt={t("bannerAlt")}
        className="w-full h-[350px] object-cover my-8"
      />

      {/* FUNCTIONALITY + PROGRESS */}
      <div className="flex flex-col lg:flex-row justify-between gap-8 px-4">
        <Functionality />
        <ProgressBar />
      </div>

      {/* BLOG POSTS */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 my-12">
  {filteredSections.length > 0 ? (
    filteredSections.map((section, index) => (
      <div
        key={index}
        className="flex flex-col items-center bg-white rounded-lg shadow-md p-6"
      >
        <img
          src={section.image}
          alt={section.title}
          className="w-full max-w-[280px] sm:max-w-[350px] mb-4"
        />
        <h1 className="text-[#373737] text-2xl sm:text-3xl font-bold font-['PTSans'] uppercase mb-3 text-center">
          {section.title}
        </h1>
        <p className="text-[#ABABAB] text-sm sm:text-base font-['PTSans'] max-w-md text-center mb-6">
          {section.description}
        </p>
        {section.tag ? (
          <TagsButtons tag={section.tag} />
        ) : (
          <button className="btn btn-outline btn-sm w-full max-w-xs">
            {t("viewMore")}
          </button>
        )}
      </div>
    ))
  ) : (
    <p className="col-span-full text-center text-gray-500 mt-8">
      {t("noSectionsFound") || "No sections found."}
    </p>
  )}
</div>
    </Layout>
  );
}

export default About;
