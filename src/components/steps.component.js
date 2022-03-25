import React from "react";
import PropTypes from "prop-types";
import "../styles/landing.css";
import { useTranslation } from "react-i18next";
function LightStepC(props) {
  const [t, i18n] = useTranslation("global")
  return (
    <section className="text-gray-600 body-font bg-gray-100">
      <div className="container px-5 py-20 mx-auto flex flex-wrap">
        <div className="grid grid-cols-1 gap-4 w-screen	justify-center">
          {/* CONFIGURACIÓN */}
          <div className="text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              {t("Landing.useNear")}
            </h1>
            <div className="flex relative pb-20 sm:items-center md:w-2/3 mx-auto">
              <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                <p className="leading-relaxed">
                {t("Landing.useNear-sub")}
                </p>
                <div className="flex justify-center">
                  <div className={`sp-4 flex-shrink-0 w-24 h-24 bg-${props.theme}-100 text-${props.theme}-500 rounded-full inline-flex items-center justify-center z-10 absolute mt-5`}>
                    <img src="https://img.icons8.com/color/48/000000/settings--v1.png" alt ="..." />
                  </div>
                  <div className="h-full w-6 absolute flex items-center justify-center">
                    <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* SELECCIONA */}
          <div className="text-center mt-8">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
            {t("Landing.artist")}
            </h1>
            <div className="flex relative pb-20 sm:items-center md:w-2/3 mx-auto">
              <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                <p className="leading-relaxed">
                  {t("Landing.artist-sub-1")} <span className="tooltip">{t("Landing.artist-sub-2")}<span className="tooltiptext">{t("Landing.artist-sub-21")}</span></span> {t("Landing.artist-sub-3")} <span className="tooltip">{t("Landing.artist-sub-4")}<span className="tooltiptext">{t("Landing.artist-sub-41")}</span></span> {t("Landing.artist-sub-5")}
                </p>
                <div className="flex justify-center">
                  <div className={`sp-4 flex-shrink-0 w-24 h-24 bg-${props.theme}-100 text-${props.theme}-500 rounded-full inline-flex items-center justify-center z-10 absolute mt-5`}>
                    <img src="https://img.icons8.com/color/96/000000/artist-skin-type-3.png" alt ="..." style={{width: 80+'%'}}/>
                  </div>
                  <div className="h-full w-6 absolute flex items-center justify-center">
                    <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 w-screen	justify-center">
          {/* COMPRA/VENTA */}
          <div className="text-center mt-10">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              {t("Landing.resell")}
            </h1>
            <div className="flex relative pb-20 sm:items-center md:w-2/3 mx-auto">
              <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                <p className="leading-relaxed">
                {t("Landing.resell-sub")}
                </p>
                <div className="flex justify-center">
                  <div className={`sp-4 flex-shrink-0 w-24 h-24 bg-${props.theme}-100 text-${props.theme}-500 rounded-full inline-flex items-center justify-center z-10 absolute mt-5`}>
                    <img src="https://img.icons8.com/color/96/000000/shopping-basket.png" alt ="..." />
                  </div>
                  <div className="h-full w-6 absolute flex items-center justify-center">
                    <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* SUBASTA */}
          {/* <div className="text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              Subasta
            </h1>
            <div className="flex relative pb-20 sm:items-center md:w-2/3 mx-auto">
              <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                <p className="leading-relaxed">
                  ¿Quieres ver cuanto ofrecen por tu NFT? puedes subastarlo y ver a cuanto asciende el precio
                </p>
                <div className="flex justify-center">
                  <div className={`sp-4 flex-shrink-0 w-24 h-24 bg-${props.theme}-100 text-${props.theme}-500 rounded-full inline-flex items-center justify-center z-10 absolute mt-5`}>
                    <img src="https://img.icons8.com/plasticine/100/000000/auction.png" alt ="..." />
                  </div>
                  <div className="h-full w-6 absolute flex items-center justify-center">
                    <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}

LightStepC.defaultProps = {
  theme: "indigo",
};

LightStepC.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default LightStepC;
