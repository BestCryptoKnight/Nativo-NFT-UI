import React from "react";
import PropTypes from "prop-types";
import wallet from '../assets/img/Wallet.png';
import pincel from '../assets/img/Pincel.png';
import colecciones from '../assets/img/Colecciones.png';
import label from '../assets/img/Label.png';
import { useTranslation } from "react-i18next";
import { nearSignIn } from "../utils/near_interaction";

function NftStepsCard({card}) {

  const [t, i18n] = useTranslation("global")
  return (
    <div className="w-full h-[107px] flex flex-row mt-6 pt-6 pb-8 lg:mt-0 justify-center md:w-1/2 lg:w-1/4  p-2 bg-white2 rounded-[12px] shadow-md"  data-aos="fade-down" data-aos-delay="1000">
      <div className="mx-auto w-1/3">
      <img
        className="h-[60px] w-[60px] mx-auto absolute z-20 ml-[25px]"
        src={card.imgSrc}
      />
      <img
        className="h-[100px] w-[100px] mx-auto absolute z-10  -mt-[17px]"
        src={card.bgSrc}
      />
      </div>
      
      <div className="rounded-3xl w-2/3 h-[45px] mx-4  mt-2 text-left">
        <div className="flex flex-col text-left h-full text-black leading-6 rounded-3xl justify-center shadow-s font-open-sans font-semibold text-xl leading buttonsNFTSection">
        {card.text}
        </div>
      </div>
    </div>
  );
}


export default NftStepsCard;
