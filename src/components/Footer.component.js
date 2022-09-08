import React from "react";
import PropTypes from "prop-types";
import nearicon from "../icons/near.svg";
import nativoLogo from '../assets/img/nativologocrop.png'
import { useTranslation } from "react-i18next";
import { ext_call, getNearAccount } from "../utils/near_interaction";
import { useWalletSelector } from "../utils/walletSelector";
import Swal from 'sweetalert2'
function LightFooterB(props) {
  const [t, i18n] = useTranslation("global")
  const { selector, modal, accounts, accountId } = useWalletSelector();
  async function addNTVToken() {
    let account = await getNearAccount()
    let payload = {
      receiver_id: account,
      amount: "0",
      memo: ":"
    }
    Swal.fire({
      title: t("Footer.msg-ntv-title"),
      text: t("Footer.msg-ntv-desc"),
      icon: 'warning',
      confirmButtonColor: '#E79211',
      confirmButtonText: t("Footer.msg-ntv-btn")
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log("Transfer NTV")
        // ext_call(process.env.REACT_APP_CONTRACT_TOKEN,'ft_transfer', payload, 300000000000000,1)
        const wallet = await selector.wallet();
        wallet.signAndSendTransaction({
          signerId: accountId,
          receiverId: process.env.REACT_APP_CONTRACT_TOKEN,
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "ft_transfer",
                args: payload,
                gas: 300000000000000,
                deposit: 1,
              }
            }
          ]
        })
      }
    })
  }

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
    <footer className="p-3 pb-12 pt-12 text-gray-600 body-font dark:bg-darkgray border-grey-darkest  dark:bg-gradient-to-t dark:from-[#5e3b13] dark:to-[#1d1d1b]">
      <div className="container px-10 pt-20 pb-12 mx-auto pt-8 flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col border border-[#f9650b] rounded-[35px] dark:bg-gradient-to-t dark:from-[#5e3b13] dark:to-[#1d1d1b] dark:shadow-s">
        <div className="w-64 flex-shrink-0 mx-auto text-center md:text-left   self-center ">
          <a
            href="./"
            className="flex title-font font-medium items-center  justify-center text-gray-900 pt-8 lg:pt-0"
          >
            <img  src={nativoLogo} className="d-inline-block align-top " alt="logo"   width="300px"/>
             
          </a>
        </div>
        <div className="flex-grow flex flex-wrap md:pr-20 -mb-10 md:text-left text-center order-first">
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font  text-gray-900 tracking-widest text-sm mb-3 dark:text-white capitalize font-raleway font-bold">
              {t("Footer.community")}
            </h2>
            <nav className="list-none mb-10">
              <li className="pt-4">
                <a href="https://twitter.com/nativonft" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm">
                  {t("Footer.twitter")}
                </a>
              </li>
              <li className="">
                <a href="https://t.me/+TFdhJmJzwmkwNDQx" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm">
                  {t("Footer.telegram")}
                </a>
              </li>
              <li className="">
                <a href="https://discord.gg/q2R6rtY4ks" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm">
                  {t("Footer.discord")}
                </a>
              </li>
              <li className="">
                <a href="https://nativonft.medium.com/" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm">
                  {t("Footer.medium")}
                </a>
              </li>
              <li className="">
                <a href="https://github.com/cloudmex/Nativo-NFT-UI" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm">
                  {t("Footer.github")}
                </a>
              </li>
              <li className="pb-4">
                <button 
                  className="bg-yellow2 text-white py-1 px-2 text-sm rounded-xlarge"
                  onClick={async () => {addNTVToken()}}>{t("Footer.btn-NTV")}</button>
              </li>

              
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full px-4 items-center">
            <h2 className="title-font  text-gray-900 tracking-widest text-sm mb-3 dark:text-white capitalize font-raleway font-bold">
              {t("Footer.resources")}
            </h2>
            <nav className="list-none mb-10">
            <li className="pt-4">
                <a href="" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm">
                  {t("Footer.whitepaper")}
                </a>
              </li>
              <li className="">
              <a href="https://docs.google.com/document/d/1PP5FHzvaFQUiimJlgPyRkxLqyFAi6WCauccN9sgdcas/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm">
                  {t("Footer.tokenomics")}
                </a>
              </li>
              <li className="">
                <a href="" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm">
                  {t("Footer.docs")}
                </a>
              </li>
              <li className="pb-4">
                <a href="" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm">
                  {t("Footer.terms")}
                </a>
              </li>
            </nav>
          </div>
          

          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font  text-gray-900 tracking-widest text-sm mb-3 dark:text-white capitalize font-raleway font-bold">
              {t("Footer.aboutUs")}  
            </h2>
            <nav className="list-none mb-10">
            <li className="pt-4">
                <a href="https://cloudmex.io/" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm">
                {t("Footer.aboutNativo")}  
                </a>
              </li>
              <li className="pb-4">
                <a href="https://cloudmex.io/" target="_blank" rel="noopener noreferrer" className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm">
                {t("Footer.theTeam")}  
                </a>
              </li>
            </nav>
          </div>
          <div className="bg-transparent ">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col md:flex-row justify-center md:justify-between">
          <p className="text-gray-500 text-xs text-center md:text-left dark:text-white font-open-sans font-semibold">
          {t("Footer.tribu")} <a href="https://cloudmex.io/"> {t("Footer.cloudMx")}</a>
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
