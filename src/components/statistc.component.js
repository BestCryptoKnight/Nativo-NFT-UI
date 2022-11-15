import React, { Fragment, useEffect, useState }  from "react";
import PropTypes from "prop-types";
import nativoLogo from '../assets/img/logo_nativo_ntv.png'
import arteNativo from '../assets/img/arte nativo.png'
import { useTranslation } from "react-i18next";
import { useWalletSelector } from "../utils/walletSelector";
import Moneda_1 from '../assets/img/landing/sponsorsSection/Moneda_1.png';
import Moneda_2 from '../assets/img/landing/sponsorsSection/Moneda_2.png';
import Moneda_nativotkn from '../assets/img/landing/sponsorsSection/Moneda_nativotkn.png';
function LightStatisicC(props) {
  const { selector, modal, accounts, accountId } = useWalletSelector();
  const [t, i18n] = useTranslation("global");
  const [stateLogin, setStateLogin] = useState(false);

  const handleNativoDaoButton = () =>{
    window.location.href= "https://app.astrodao.com/dao/nativo-dao.sputnik-dao.near"
  }

  useEffect(() => {
    (async () => {
      setStateLogin(accountId !=null ? true : false);
    })();
  }, [selector]);

  return (
    <section className="open-sans  h-[290px] lg:h-[350px] overflow-hidden bg-Light/Light flex " >
      <div className="w-full md:pt-4 dark:flex flex-row flex-wrap justify-center" >

        <div className=" w-2/6 flex m-auto justify-center ">
          <img
            className="h-[100px] lg:h-[240px] bg-center w-[100px] lg:w-[240px] "
            src={Moneda_nativotkn}

            alt={Moneda_nativotkn}
          />

        </div>
        <div className="w-4/6  pt-6 pb-8 mx-auto flex flex-col m-auto">
          <h2 className="text-dark-blue text-left lg:text-center w-[250px]   lg:w-full lg:mx-auto text-3xl  md:px-6
                    lg:px-8 mb-4  font-clash-grotesk  font-semibold leading-9  lg:text-4xl">{t("Landing.gobernance")}</h2>
          <button className="flex inline-flex rounded-xlarge w-[250px] lg:w-[267px] h-[50px]   mt-0 lg:mx-auto" onClick={handleNativoDaoButton} >
            <div className="flex flex-col font-bold h-full text-white  text-center  justify-center shadow-s w-full bg-yellow4 hover:bg-yellowHover active:bg-yellowPressed rounded-md">
              <span className="title-font  text-white font-open-sans font-extrabold lg:font-semibold text-base  uppercase leading-6">{t("Landing.gobernance-button")}</span>

            </div>
          </button>

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
