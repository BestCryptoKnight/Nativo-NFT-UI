import React from "react";
import PropTypes from "prop-types";
import wallet from '../assets/img/Wallet.png';
import pincel from '../assets/img/Pincel.png';
import colecciones from '../assets/img/Colecciones.png';
import label from '../assets/img/Label.png';
import { useTranslation } from "react-i18next";
import { nearSignIn } from "../utils/near_interaction";

function NftSteps(props) {
  function createCollectionRoute() {
    window.location.href = '/collectionData/create';
  }

  function createNFTRoute() {
    window.location.href = '/create';
  }

  function sellNFTRoute() {
    window.location.href = '/mynfts';
  }

  const [t, i18n] = useTranslation("global")
  return (
    <section className="text-gray-600 body-font bg-gray-100 dark:bg-darkgray">
      <div className="container w-full px-5 pt-14 pb-28 dark:bg-darkgray mx-auto flex flex-row flex-wrap justify-center  ">
        <div className="w-full">
          <h2 className="dark:text-white  text-center  uppercase font-raleway font-bold text-3xl  lg:text-5xl">{t("Landing.steps-title")}</h2>
          <div className="h-[30px] w-1/2 bg-brown2 mt-[-10px] mx-auto " />
        </div>
        <div className="w-full flex flex-row flex-wrap mt-[50px]">
          <div className="w-full flex flex-row flex-wrap mt-10 pt-12 pb-8 lg:mt-0 justify-center md:w-1/2 lg:w-1/4 cardsNFTSection p-2" onClick={async () => {nearSignIn(window.location.href);}}>
            <img
              className="h-[100px] w-[100px] mx-auto"
              src={wallet}
            />
            <div className="rounded-3xl w-full h-[45px]  mx-4   mt-6 bg-gradient-to-r p-[3px] from-brown2  to-yellow2 shadow-s">
              <div className="flex flex-col h-full bg-darkgray text-white  text-center rounded-3xl justify-center shadow-s font-raleway font-bold text-base buttonsNFTSection">
              {t("Landing.steps-connect")}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-row flex-wrap mt-10 pt-12 pb-8 lg:mt-0 justify-center md:w-1/2 lg:w-1/4 cardsNFTSection p-2" onClick={async () => {createCollectionRoute();}}>
            <img
              className="h-[100px] w-[100px] mx-auto"
              src={colecciones}
            />
             <div className="rounded-3xl w-full h-[45px]  mx-4   mt-6 bg-gradient-to-r p-[3px] from-brown2  to-yellow shadow-s ">
              <div className="flex flex-col  h-full bg-darkgray text-white  text-center rounded-3xl justify-center shadow-s font-raleway font-bold text-base buttonsNFTSection">
              {t("Landing.steps-create")}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-row flex-wrap mt-10 pt-12 pb-8 lg:mt-0 justify-center md:w-1/2 lg:w-1/4 cardsNFTSection p-2" onClick={async () => {createNFTRoute();}}>
            <img
              className="h-[100px] w-[100px] mx-auto"
              src={pincel}
            />
            <div className="rounded-3xl w-full h-[45px]  mx-4   mt-6 bg-gradient-to-r p-[3px] from-hotpink  to-pink shadow-s">
              <div className="flex flex-col  h-full bg-darkgray text-white  text-center rounded-3xl justify-center shadow-s font-raleway font-bold text-lg buttonsNFTSection">
              {t("Landing.steps-createn")}
              </div>
            </div>
          </div>
          
          <div className="w-full flex flex-row flex-wrap mt-10 pt-12 pb-8 lg:mt-0 justify-center md:w-1/2 lg:w-1/4 cardsNFTSection p-2" onClick={async () => {sellNFTRoute();}}>
            <img
              className="h-[100px] w-[100px] mx-auto"
              src={label}
            />
            <div className="rounded-3xl w-full h-[45px] mx-4  mt-6 bg-gradient-to-r p-[3px] from-pink  to-yellow3 shadow-s">
              <div className="flex flex-col  h-full bg-darkgray text-white  text-center rounded-3xl justify-center shadow-s font-raleway font-bold text-lg buttonsNFTSection">
              {t("Landing.steps-sell")}
              </div>
            </div>
              
          </div>
        </div>
      </div>
    </section>
  );
}


export default NftSteps;
