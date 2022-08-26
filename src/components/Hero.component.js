import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ImageSlider from "./imageSlider.component";
import { useWalletSelector } from "../utils/walletSelector";
import { useTranslation } from "react-i18next";
import verifyImage from '../assets/img/Check.png';
import rocket from '../assets/img/Rocket.png';

const { selector, modal, accounts, accountId } = useWalletSelector();

const handleSignIn = () => {
  modal.show();
};
function LightHeroE(props) {
  const [t, i18n] = useTranslation("global")
  return (
    <section className="text-gray-600 body-font dark:bg-darkgray h-screen">
      <div className="container mx-auto flex px-5 pb-10 flex-col items-center justify-center h-screen">
        <div className=" h-72 lg:h-96 lg:flex-grow  flex flex-col md:text-left items-center justify-center" >
          <div className="w-full z-20 pt-10">
            <h2 className="dark:text-white text-3xl mt-20  lg:text-7xl md:text-6xl sm:text-4xl uppercase text-center font-raleway font-bold ">{t("Landing.title")}</h2>
            <h2 className="dark:text-white text-3xl lg:text-7xl md:text-6xl sm:text-4xl uppercase text-center font-raleway font-bold">{t("Landing.title-2")}</h2>
            <div className="h-[4px]  bg-brown2 mt-[-11px] mx-auto " />
          </div>
          <p className="mt-8 leading-relaxed lg:text-1xl md:text-xl dark:text-white z-20 font-raleway font-normal text-center">
            {t("Landing.subtitle")}
          </p>
          <div className="flex justify-between z-20">
            <Link to="/collections">
              <button className="flex inline-flex rounded-xlarge w-full h-[50px]  mt-0 bg-gradient-to-b p-[7px] from-yellow  to-brown hover:shadow-brown-s customHover" >
                <div className="flex inline-flex  w-full h-full text-white  text-center rounded-xlarge justify-center shadow-s">
                  <div className="flex flex-col font-bold h-full text-white  text-center rounded-xlarge justify-center shadow-s w-full">
                  <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                    <span className="title-font  text-white font-open-sans font-normal text-base md:text-2xl p-5">{t("Landing.gallery")}</span>
                  </div>
                </div>
              </button>
            </Link>
            <button onClick={handleSignIn} className="flex inline-flex rounded-xlarge w-full h-[50px]  mt-0 bg-gradient-to-b p-[7px] from-yellow  to-brown hover:shadow-brown-s customHover" >
              <div className="flex inline-flex  w-full h-full text-white  text-center rounded-xlarge justify-center shadow-s">
                <div className="flex flex-col font-bold h-full text-white  text-center rounded-xlarge justify-center shadow-s w-full">
                <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                  <span className="title-font  text-white font-open-sans font-normal text-base md:text-2xl p-5">{t("Landing.gallery")}</span>
                </div>
              </div>
            </button>
          </div>
          <div className="bg-background-landing landingBackground absolute z-10"></div>
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
