import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ImageSlider from "./imageSlider.component";
import { useTranslation } from "react-i18next";
import verifyImage from '../assets/img/Check.png'
function LightHeroE(props) {
  const [t, i18n] = useTranslation("global")
  return (
    <section className="text-gray-600 body-font dark:bg-darkgray">
      <div className="container mx-auto flex px-5 pt-10 pb-24 md:flex-row flex-col items-center md:items-start">
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0 flex flex-row md:flex-row-reverse justify-center">

          <div class="max-w-xs bg-white rounded-xlarge border border-gray-200 shadow-md  dark:border-gray-700">
            <div className="w-full m-5 mb-0 flex relative ">
              <div className="w-[50px] h-[50px]  bg-circle rounded-full bg-pink-2 relative">
                <img className="w-[25px] h-[25px] fixed bg-white rounded-full top-0 -right-3 absolute " src={verifyImage}></img>
              </div>

            </div>
            <div className="p-6 pt-3 ">
              <a href="#" >
                <ImageSlider />
              </a>
            </div>
            <div class="p-5">

            </div>
          </div>
        </div>
        <div className="lg:flex-grow md:w-1/2  flex flex-col md:items-start md:text-left items-center text-center ">
          <div className="w-full">
            <h2 className="dark:text-white md:text-4xl text-2xl text-center font-semibold uppercase text-left">{t("Landing.title")}</h2>
            <div className="h-[30px]  bg-brown2 mt-[-10px] mx-auto " />
            <h2 className="dark:text-white md:text-4xl text-2xl text-center font-semibold uppercase text-left">{t("Landing.title-2")}</h2>
            <div className="h-[30px]  bg-brown2 mt-[-10px] mx-auto " />
          </div>
          <p className="m-8 leading-relaxed dark:text-white">
            {t("Landing.subtitle")}
          </p>

          <div className="flex  justify-between ">
            <Link to="/collections">
              <button className="bg-white inline-flex py-3 px-5 rounded-lg items-center justify-end hover:bg-gray-200 focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                >
                  <g>
                    <g>
                      <path d="m6.25 19.5c-1.601 0-3.025-1.025-3.542-2.551l-.035-.115c-.122-.404-.173-.744-.173-1.084v-6.818l-2.426 8.098c-.312 1.191.399 2.426 1.592 2.755l15.463 4.141c.193.05.386.074.576.074.996 0 1.906-.661 2.161-1.635l.901-2.865z" />
                    </g>
                    <path d="m9 9c1.103 0 2-.897 2-2s-.897-2-2-2-2 .897-2 2 .897 2 2 2z" />
                  </g>
                  <path d="m21.5 2h-15c-1.378 0-2.5 1.122-2.5 2.5v11c0 1.378 1.122 2.5 2.5 2.5h15c1.378 0 2.5-1.122 2.5-2.5v-11c0-1.378-1.122-2.5-2.5-2.5zm-15 2h15c.276 0 .5.224.5.5v7.099l-3.159-3.686c-.335-.393-.82-.603-1.341-.615-.518.003-1.004.233-1.336.631l-3.714 4.458-1.21-1.207c-.684-.684-1.797-.684-2.48 0l-2.76 2.759v-9.439c0-.276.224-.5.5-.5z" />
                </svg>
                <span className="ml-4 flex items-start flex-col leading-none">
                  <span className="title-font font-medium">{t("Landing.gallery")}</span>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

LightHeroE.defaultProps = {
  theme: "indigo",
};

LightHeroE.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default LightHeroE;
