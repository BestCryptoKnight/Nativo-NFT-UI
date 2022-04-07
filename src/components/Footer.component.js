import React from "react";
import PropTypes from "prop-types";
import nearicon from "../icons/near.svg";
import nativoLogo from '../assets/img/nativologocrop.png'
import { useTranslation } from "react-i18next";

function LightFooterB(props) {
  const [t, i18n] = useTranslation("global")

  const handleLanguage = () =>{
    if(window.localStorage.getItem("LanguageState")=="en"){
      i18n.changeLanguage("es")
      window.localStorage.setItem("LanguageState","es")
    }
    else{
      i18n.changeLanguage("en")
      window.localStorage.setItem("LanguageState","en")
    }
  }
  return (
    <footer className="pb-12 text-gray-600 body-font bg-gray-100 border-t border-grey-darkest  dark:bg-gradient-to-t dark:from-[#5e3b13] dark:to-[#1d1d1b]">
      <div className="container px-10 pt-20 pb-12 mx-auto mt-8 flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col border border-[#f9650b] rounded-[35px] dark:bg-gradient-to-t dark:from-[#5e3b13] dark:to-[#1d1d1b] dark:shadow-s">
        <div className="w-64 flex-shrink-0 mx-auto text-center md:text-left   self-center ">
          <a
            href="./"
            className="flex title-font font-medium items-center  justify-center text-gray-900"
          >
            <img  src={nativoLogo} className="d-inline-block align-top " alt="logo"   width="300px"/>
             
          </a>
        </div>
        <div className="flex-grow flex flex-wrap md:pr-20 -mb-10 md:text-left text-center order-first">
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-bold text-gray-900 tracking-widest text-sm mb-3 dark:text-white capitalize">
              {t("Footer.community")}
            </h2>
            <nav className="list-none mb-10">
              <li className="pt-4">
                <a href="https://twitter.com/nativonft" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize">
                  {t("Footer.twitter")}
                </a>
              </li>
              <li className="">
                <a href="/" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize">
                  {t("Footer.telegram")}
                </a>
              </li>
              <li className="">
                <a href="https://discord.com/invite/7usKw4Dk" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize">
                  {t("Footer.discord")}
                </a>
              </li>
              <li className="">
                <a href="https://nativonft.medium.com/" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize">
                  {t("Footer.medium")}
                </a>
              </li>
              <li className="pb-4">
                <a href="https://github.com/cloudmex/Nativo-NFT" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize">
                  {t("Footer.github")}
                </a>
              </li>

              
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full px-4 items-center">
            <h2 className="title-font font-bold text-gray-900 tracking-widest text-sm mb-3 dark:text-white capitalize">
              {t("Footer.resources")}
            </h2>
            <nav className="list-none mb-10">
            <li className="pt-4">
                <a href="" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize">
                  {t("Footer.whitepaper")}
                </a>
              </li>
              <li className="">
              <a href="" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize">
                  {t("Footer.tokenomics")}
                </a>
              </li>
              <li className="">
                <a href="" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize">
                  {t("Footer.docs")}
                </a>
              </li>
              <li className="pb-4">
                <a href="" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize">
                  {t("Footer.terms")}
                </a>
              </li>
            </nav>
          </div>
          

          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-bold text-gray-900 tracking-widest text-sm mb-3 dark:text-white capitalize">
              {t("Footer.aboutUs")}  
            </h2>
            <nav className="list-none mb-10">
            <li className="pt-4">
                <a href="https://cloudmex.io/" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize">
                {t("Footer.aboutNativo")}  
                </a>
              </li>
              <li className="pb-4">
                <a href="https://cloudmex.io/" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize">
                {t("Footer.theTeam")}  
                </a>
              </li>
            </nav>
          </div>
          <div className="bg-transparent ">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col md:flex-row justify-center md:justify-between">
          <p className="text-gray-500 text-sm text-center md:text-left dark:text-white">
          {t("Footer.tribu")}
          </p>

        </div>
      </div>
        </div>
      </div>
    </footer>
  );
}

LightFooterB.defaultProps = {
  theme: "indigo",
};

LightFooterB.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default LightFooterB;
