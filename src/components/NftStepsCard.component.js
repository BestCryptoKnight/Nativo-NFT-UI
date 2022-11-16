import React, {  useEffect, useState } from "react";
import PropTypes from "prop-types";
import wallet from '../assets/img/Wallet.png';
import pincel from '../assets/img/Pincel.png';
import colecciones from '../assets/img/Colecciones.png';
import label from '../assets/img/Label.png';
import { useTranslation } from "react-i18next";
import { nearSignIn } from "../utils/near_interaction";
import { Redirect } from "react-router-dom";
import { useWalletSelector } from "../utils/walletSelector";

function NftStepsCard({card}) {

  const { selector, modal, accounts, accountId } = useWalletSelector();
  const [t, i18n] = useTranslation("global");
  const [stateLogin, setStateLogin] = useState(false);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    (async () => {
      setStateLogin(accountId !=null ? true : false);
    })();
  }, [selector]);

  const handleSignIn = () =>{
    modal.show()
  }

  const handleRedirect = (route) =>{
    window.location.href = route
  }

  return (
    <div className="w-full lg:w-1/4 mt-6 h-[107px] hover:lg:h-[132px] transition-[height] duration-100 flex flex-col pt-6 pb-8 lg:mt-2 justify-center lg:justify-start  mx-auto lg:mx-2 p-2 bg-white2 rounded-[12px] shadow-md" data-aos="fade-down" data-aos-delay="250"
    onMouseEnter={() => setIsShown(true)}
    onMouseLeave={() => setIsShown(false)}
    onClick={stateLogin ? () => handleRedirect(card.redirect) : () => handleSignIn() }
     >
      <div className="flex flex-row   ">
        <div className="mx-auto  w-1/3 mt-2 lg:mt-1">
        <img
          className="h-[60px] w-[60px] mx-auto absolute z-20 ml-[25px]"
          src={card.imgSrc}
        />
        <img
          className="h-[100px] w-[100px] mx-auto absolute z-10  -mt-[17px]"
          src={card.bgSrc}
        />
      </div>

        <div className="rounded-3xl w-2/3 h-[45px] mx-4  text-left mt-2 ">
          <div className="flex flex-col text-left h-full text-black leading-6 rounded-3xl justify-center shadow-s font-open-sans font-semibold text-xl leading buttonsNFTSection">
            {card.text}
          </div>
        </div>
      </div>
      {isShown && (
            <button className="flex flex-row text-left h-full text-[#F79336] leading-6 rounded-3xl justify-center shadow-s font-open-sans font-semibold text-base mt-4 leading buttonsNFTSection mx-auto duration-100"
            >
              {card.sub}
              <img
            className="h-[24px] w-[24px] mx-auto ml-[5px]"
            src={card.arrow}
          />
            </button>
          )}
    </div>
  );
}


export default NftStepsCard;
