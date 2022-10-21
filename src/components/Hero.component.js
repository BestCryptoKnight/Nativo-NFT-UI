import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ImageSlider from "./imageSlider.component";
import { useWalletSelector } from "../utils/walletSelector";
import { useTranslation } from "react-i18next";
import verifyImage from '../assets/img/Check.png';
import rocket from '../assets/img/Rocket.png';
import arrowRight from '../assets/img/landing/firstSection/ARROW.png';
import plus from '../assets/img/landing/firstSection/plus.png';

function LightHeroE(props) {
  const { selector, modal, accounts, accountId } = useWalletSelector();
  const [t, i18n] = useTranslation("global");
  const [stateLogin, setStateLogin] = useState(false);

  useEffect(() => {
    (async () => {
      setStateLogin(accountId !=null ? true : false);
    })();
  }, []);

  const handleSignIn = () =>{
    modal.show()
  }

  return (
    <section className="text-gray-600 body-font dark:bg-darkgray h-[823px] ">
      <div className="container mx-auto lg:mx-[129px] flex px-5 lg:px-0 pb-10 flex-col items-center  lg:items-start  justify-center ">
        <div className=" h-[823px] lg:h-[594px] lg:flex-grow  flex flex-col md:text-left items-center lg:items-start" >
          <div className="w-full z-20 mt-[90px] lg:mt-[100px] ">
            <h2 className="dark:text-white text-[36px]  lg:text-6xl md:text-6xl font-clash-grotesk font-semibold leading-9 tracking-wider text-left w-[343px] lg:w-[672px]">{t("Landing.title") + " " +t("Landing.title-2")}</h2>
          </div>
          <p className="mt-[18px] lg:mt-[23px] lg:text-1xl text-base dark:text-white z-20 font-open-sans font-normal text-left leading-6 tracking-wider w-[343px] lg:w-[630px]">
            {t("Landing.subtitle")} <span className="italic"> {" " +t("Landing.subtitle2")}</span>
          </p>
          <div className="flex flex-col lg:flex-row justify-between z-20">
           {
            stateLogin ? "" : 
            <Link>
            <button className="flex inline-flex rounded-xlarge w-full lg:w-[267px] h-[50px] lg:mr-11  mt-0 " onClick={handleSignIn} >
                <div className="flex flex-col font-bold h-full text-white  text-center  justify-center shadow-s w-full bg-yellow4 hover:bg-yellowHover active:bg-yellowPressed rounded-md">
                <svg className="fill-current w-[342px] h-[48px] mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                  <span className="title-font  text-white font-open-sans font-normal lg:font-semibold text-base p-5 uppercase leading-6">{t("Landing.connect")}</span>
                </div>
            </button>
            </Link> 
          }
            <Link to="/market">
              <button className="flex inline-flex rounded-xlarge w-full h-[50px]  mt-0  lg:w-[158px]" >
                  <div className="flex flex-col font-bold h-full text-white  text-center  justify-center shadow-s w-full border-solid border-2 rounded-md border-white2 hover:bg-outlineHover active:bg-outlinePressed ">
                  <svg className="fill-current w-[342px] h-[48px] mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                  <span className="title-font  text-white font-open-sans font-normal lg:font-semibold text-base p-5 uppercase leading-6 flex justify-center hover:text-textOutlineHover active:text-textOutlinePressed  "> <img className="w-[20px] h-[20px] self-center mr-[4px] hidden lg:inline" src={plus}></img>{t("Landing.gallery")} <img className="manImg w-[12px] h-[12px] self-center ml-[6px] lg:hidden" src={arrowRight}></img><img className=" w-[20px] h-[20px] self-center ml-[4px] hidden lg:inline" src={plus}></img></span>
                  </div>
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
