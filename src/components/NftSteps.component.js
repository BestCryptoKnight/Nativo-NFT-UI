import React from "react";
import PropTypes from "prop-types";
import wallet from '../assets/img/Wallet.png';
import pincel from '../assets/img/Pincel.png';
import colecciones from '../assets/img/Colecciones.png';
import label from '../assets/img/Label.png';
import { useTranslation } from "react-i18next";
import { nearSignIn } from "../utils/near_interaction";
import Collection_Icon from "../assets/img/landing/thirdSection/Collection_Icon.png";
import Ellipse_7 from "../assets/img/landing/thirdSection/Ellipse_7.png";
import Money_Icon from "../assets/img/landing/thirdSection/Money_Icon.png";
import NFTImage_Icon from "../assets/img/landing/thirdSection/NFTImage_Icon.png";
import Wallet_Icon from "../assets/img/landing/thirdSection/Wallet_Icon.png";
import NftStepsCard from "./NftStepsCard.component";
import { render } from "@testing-library/react";


function NftSteps(props) {
  const [t, i18n] = useTranslation("global")
  const steps = [
    {
      imgSrc: Wallet_Icon,
      bgSrc: Ellipse_7,
      text: t("Landing.steps-connect"),
    },
    {
      imgSrc: Collection_Icon,
      bgSrc: Ellipse_7,
      text: t("Landing.steps-create")
    },
    {
      imgSrc: NFTImage_Icon,
      bgSrc: Ellipse_7,
      text: t("Landing.steps-add")
    },
    {
      imgSrc: Money_Icon,
      bgSrc: Ellipse_7,
      text: t("Landing.steps-sell")
    }
  ];

  function createCollectionRoute() {
    window.location.href = '/collectionData/create';
  }

  function createNFTRoute() {
    window.location.href = '/create';
  }

  function sellNFTRoute() {
    window.location.href = '/mynfts';
  }

  
  return (
    <section className="text-gray-600 body-font bg-gray-100 dark:bg-darkgray">
      <div className="container w-full px-5 pt-[72px] pb-28 dark:bg-darkgray mx-auto flex flex-row flex-wrap justify-center h-[758px] bg-steps-background bg-no-repeat bg-cover">
        <div className="w-full flex flex-col lg:flex-row text-left" data-aos="fade-down" data-aos-delay="200">
          <h2 className="dark:text-white   font-clash-grotesk font-semibold text-4xl  lg:text-5xl text-left">{t("Landing.steps-title")}</h2>
          <h2 className="dark:text-white   font-clash-grotesk font-semibold text-4xl  lg:text-5xl text-left">{t("Landing.steps-title2")}</h2>
        </div>
        <div className="w-full flex flex-row flex-wrap mt-[12px]">
        {steps.map((card, i) => {
            return (
            <NftStepsCard card={card} key={i}/>
            )
          })}
        </div>
      </div>
    </section>
  );
}


export default NftSteps;
