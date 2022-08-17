import React from "react";
import PropTypes from "prop-types";
import nativoLogo from '../assets/img/logo_nativo_ntv.png'
import arteNativo from '../assets/img/arte nativo.png'
import { useTranslation } from "react-i18next";
function LightStatisicC(props) {
  const [t, i18n] = useTranslation("global")
  return (
      <section className="text-gray-600 body-font dark:bg-darkgray">
        <div className="w-full">
          <h2 className="dark:text-white  text-center  uppercase font-raleway font-bold text-3xl  lg:text-5xl">{t("Landing.dao")}</h2>
          <div className="h-[30px] w-2/3 bg-brown2 mt-[-10px] mx-auto " />
        </div>
        <div className="w-full mt-10 flex flex-row flex-wrap place-items-center text-center place-content-around pb-28">
          <div className="w-full lg:w-1/3 mt-10  flex justify-center lg:justify-end">
            <div class="w-60 h-60 bg-circle rounded-full flex justify-center items-center">
              <img
                className="h-9/10"
                src={nativoLogo}
              />            
            </div>
          </div>
          <div className="w-full lg:w-2/3 lg:px-0 lg:pr-52 lg:pl-24 px-14">
            <h1 className="text-gray-900 w-full mb-4 mt-10 lg:mt-2 dark:text-white font-raleway font-bold text-3xl  lg:text-4xl ">{t("Landing.dao-txt-2")}</h1>
            <p className="w-full text-justify dark:text-white font-raleway font-normal text-lg ">{t("Landing.dao-txt-1")}
            </p>
          </div>
        </div>
      </section>
  );
}

LightStatisicC.defaultProps = {
  theme: "indigo",
};

LightStatisicC.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default LightStatisicC;
