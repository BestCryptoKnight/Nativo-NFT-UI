import React from "react";
import PropTypes from "prop-types";
import nativoLogo from "../assets/img/nativologocrop.png"
import arteNativo from '../assets/img/arte nativo.png'
import { useTranslation } from "react-i18next";
function LightStatisicC(props) {
  const [t, i18n] = useTranslation("global")
  return (
    <div>
      <section className="text-gray-600 body-font bg-gray-100">
        <div className="grid lg:grid-cols-2 grid-cols-1 w-full place-items-center text-center place-content-around">
          <div className="w-full grid-cols-1 lg:px-10 px-4 ">
            <h1 className="lg:text-3xl text-2xl font-medium text-gray-900 w-full mb-4 mt-10 lg:mt-2">{t("Landing.dao")}</h1>
            <p className="lg:text-xl text-base w-full text-justify">{t("Landing.dao-txt-1")}
            </p>
          </div>
          <div className="w-full">
            <img className="p-[50px] lg:px-32 w-[300px] lg:w-[560px] h-[300px]  lg:h-[450px]  m-auto" src={arteNativo} />
          </div>
        </div>
      </section>
      </div>
  );
}

LightStatisicC.defaultProps = {
  theme: "indigo",
};

LightStatisicC.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default LightStatisicC;
