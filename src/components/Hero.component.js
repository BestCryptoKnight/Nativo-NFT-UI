import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ImageSlider from "./imageSlider.component";
import { useTranslation } from "react-i18next";
import verifyImage from '../assets/img/Check.png';
import rocket from '../assets/img/Rocket.png';
function LightHeroE(props) {
  const [t, i18n] = useTranslation("global")
  return (
    <section className="text-gray-600 body-font dark:bg-darkgray">
      <div className="container mx-auto flex px-5 pt-10 pb-10 md:flex-row flex-col items-center md:items-start ">

        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0 flex flex-row md:flex-row-reverse justify-center">

          <div class="max-w-xs bg-white rounded-xlarge border border-gray-200 shadow-md  dark:border-gray-700">
            <div className="w-full m-5 mb-0 flex relative ">
              <div className="w-[50px] h-[50px]  bg-circle rounded-full bg-pink-2 relative">
                <img className="w-[25px] h-[25px] fixed bg-transparent rounded-full top-0 -right-3 absolute" src={verifyImage}></img>
              </div>

            </div>
            <div className="p-6 pt-3 ">
              <a href="#" >
                <ImageSlider />
              </a>
            </div>
            <div className="p-5">
            </div>
          </div>
        </div>
        <div className=" h-72 lg:h-96 lg:flex-grow md:w-1/2  flex flex-col md:items-start md:text-left items-center" >
          <div className="w-full lg:w-10/12 z-20">
            <h2 className="dark:text-white text-3xl  lg:text-5xl  md:pl-5 uppercase text-center md:text-left font-raleway font-bold ">{t("Landing.title")}</h2>
            <div className="h-[30px]  bg-brown2 mt-[-10px] mx-auto " />
            <h2 className="dark:text-white text-3xl  lg:text-5xl  md:pl-5 uppercase text-center md:text-left font-raleway font-bold">{t("Landing.title-2")}</h2>
            <div className="h-[30px]  bg-brown2 mt-[-10px] mx-auto " />
          </div>
          <p className="m-8 leading-relaxed dark:text-white z-20 font-raleway font-normal text-base">
            {t("Landing.subtitle")}
          </p>
          <div className="flex  justify-between z-20">
            <Link to="/gallery">
              <button className="flex inline-flex rounded-xlarge  w-full h-[45px] mx-0  lg:mx-8   mt-10 bg-gradient-to-b p-[3px] from-yellow  to-brown shadow-brown-s">
                <div className="flex inline-flex  w-full h-full text-white  text-center rounded-xlarge justify-center shadow-s">
                  <div className="flex flex-col font-bold h-full dark:bg-white text-white  text-center rounded-xlarge justify-center shadow-s w-full">
                    <span className="title-font  dark:text-black font-open-sans font-normal text-base md:text-2xl p-5">{t("Landing.gallery")}</span>
                  </div>
                </div>
              </button>
            </Link>
          </div>
          <div className="bg-hero-rocket w-2/4 lg:w-1/2 h-60 md:h-96 bg-bottom lg:bg-right-bottom bg-no-repeat blur-sm bg-40 absolute z-10" style={{backgroundImage: rocket}}>
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
