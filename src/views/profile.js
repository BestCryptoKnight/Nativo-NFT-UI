/* global BigInt */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useParams, useHistory } from "react-router-dom";
// import { Helmet } from "react-helmet";
import { isNearReady } from "../utils/near_interaction";
import { nearSignIn, ext_view, ext_call } from "../utils/near_interaction";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import {
  syncNets,
  getSelectedAccount,
  getContract,
  fromWEItoEth,
  fromETHtoWei,
} from "../utils/blockchain_interaction";
import { currencys } from "../utils/constraint";
import {
  fromNearToYocto,
  fromYoctoToNear,
  getNearAccount,
  getNearContract,
} from "../utils/near_interaction";
import Modal from "../components/modal.component";
import flechaiz from '../assets/landingSlider/img/flechaIz.png'
import defaultUser from '../assets/img/defaultUser.png'
import ReactHashtag from "react-hashtag";
import OfferModal from "../components/offerModal.component";
import { useTranslation } from "react-i18next";
import Swal from 'sweetalert2'
import { date } from "yup";

function LightEcommerceB(props) {
  //guarda el estado de  toda la vista
  const [state, setstate] = useState();
  const [btn, setbtn] = useState(true);
  const [t, i18n] = useTranslation("global")
  //guarda el estado de el modal
  const [modal, setModal] = React.useState({
    show: false,
  });
  //Esta logeado
  const [stateLogin, setStateLogin] = useState(false);
  const [hasRoyalty, setHasRoyalty] = useState(false)
  const [myProfile, setMyProfile] = useState(false)
  const [hasBids, setHasBids] = useState(false)
  //es el parametro de tokenid
  const { user } = useParams();

  const handleLanguage = () => {
    if (window.localStorage.getItem("LanguageState") == "en") {
      i18n.changeLanguage("es")
      window.localStorage.setItem("LanguageState", "es")
    }
    else {
      i18n.changeLanguage("en")
      window.localStorage.setItem("LanguageState", "en")
    }
  }

  const handleEditProfile = () => {
    console.log('editProfile')
    window.location.href='/profileData/edit'
  }

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
        ext_call(process.env.REACT_APP_CONTRACT_TOKEN, 'ft_transfer', payload, 300000000000000, 1)
      }
    })
  }
  //es el historial de busqueda
  //let history = useHistory();
  const APIURL = process.env.REACT_APP_API_TG

  React.useEffect(() => {
    (async () => {
      setStateLogin(await isNearReady());
      let ownerAccount = await getNearAccount();

      let contract = await getNearContract();
      let account = await getNearAccount();
      let paramsSupplyForOwner = {
        account_id: account
      };
      let totalTokensByOwner = await contract.nft_supply_for_owner(paramsSupplyForOwner);
      let totalTokensByCreator = await contract.nft_supply_for_creator(paramsSupplyForOwner);

      if (localStorage.getItem("blockchain") == "0") {
        
      } else {
        let userData
        let account
        if(process.env.REACT_APP_NEAR_ENV == 'mainnet'){
          account=user+'.near'
        }
        else{
          account=user+'.testnet'
        }
        console.log(account)
        if(account == await getNearAccount()){
          setMyProfile(true)
        }
        const query = `
          query ($account: String){
            profiles (where : {id : $account}){
              id
              username
              media
              biography
              socialMedia
              tokCreated
              tokBought
              timestamp
            }
          }
        `
        const client = new ApolloClient({
          uri: APIURL,
          cache: new InMemoryCache(),
        })

        await client.query({
          query: gql(query),
          variables: {
            account: account
          }
        })
          .then((data) => {
            console.log('profile: ', data.data.profiles.length)
            if(data.data.profiles.length <= 0){
              if(account == ownerAccount){
                window.location.href = '/profileData/create'
              }
              else{
                let date = new Date().getTime()
                userData={
                  username: account,
                  media: "",
                  biography: "El usuario no ha guardado la informacion de su perfil",
                  socialMedia: "No ha registrado su Twitter",
                  tokCreated: 0,
                  tokBought: 0,
                  timestamp: date.toString()
                }
              }
            }
            else{
              userData = data.data.profiles[0]
            }
          })
          .catch((err) => {
            console.log('error: ', err)
          })
        let date = new Date(0)
        date.setUTCSeconds(userData.timestamp.substr(0, 10))
        setstate({
          ...state,
          data: {
            account: userData.username,
            media: userData.media,
            biography: userData.biography,
            socialMedia: userData.socialMedia,
            tokCreated: totalTokensByCreator,
            tokBought: totalTokensByOwner,
            timestamp: date,
          },
        });


      }
    })();
  }, []);



  async function makeAnOffer() {
    console.log("Make a offer")
    setOfferModal({
      ...state,
      show: true,
      title: t("Detail.modalMakeBid"),
      message: t("Detail.modalMsg"),
      loading: false,
      disabled: false,
      change: setOfferModal,
      buttonName: 'X',
      tokenId: 'hardcoded'
    })
  }


  //setting state for the offer modal
  const [offerModal, setOfferModal] = useState({
    show: false,
  });
  return (
    <>
      <section className="text-white body-font overflow-hidden dark:bg-darkgray font-open-sans">
        <div className="container px-5 py-8 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap p-6">
            <div className="lg:w-1/2 w-full lg:h-auto h-64 flex">
              <img
                alt="ecommerce"
                className=" object-contain md:object-scale-down rounded-xlarge shadow-yellow2 lg:h-auto h-64 w-auto m-auto"
                src={state?.data.media == "" ? defaultUser :`https://nativonft.mypinata.cloud/ipfs/${state?.data.media}`}
              />
            </div>

            <div className="lg:w-1/2 w-full lg:pl-10 lg:mt-0">

              <h1 className="text-white text-3xl text-center title-font font-bold mb-3 font-raleway text-ellipsis overflow-hidden">
                {state?.data.account}
              </h1>

              <div
                className={`flex-col py-2 px-2 my-2 bg-gray-50 rounded-xlarge`}
              >
                <div><span className="text-black pl-3 font-bold text-sm uppercase font-raleway ">{t("Profile.biography")}</span></div>
                <div>
                  <span className="pl-3 text-gray-900  text-sm pr-3 font-raleway font-medium">
                    {state?.data.biography}
                  </span>
                </div>
              </div>

              <div
                className={`flex py-2 px-2 my-2 bg-gray-50 rounded-xlarge`}
              >
                <span className="text-black pl-3 font-bold uppercase font-raleway text-sm">{t("Profile.tokCreated")}</span>
                <span className="ml-auto text-gray-900 font-semibold pr-3 font-raleway text-sm">
                  {state?.data.tokCreated}
                </span>
              </div>

              <div
                className={`flex py-2 px-2 my-2 bg-gray-50 rounded-xlarge`}
              >
                <span className="text-black pl-3 font-bold uppercase font-raleway text-sm">{t("Profile.tokOwned")}</span>
                <span className="ml-auto text-gray-900 font-semibold pr-3 font-raleway text-sm">
                  {state?.data.tokBought}
                </span>
              </div>
              <div
                className={`flex py-2 px-2 my-2 bg-gray-50 rounded-xlarge`}
              >
                <span className="text-black pl-3 font-bold uppercase font-raleway text-sm">{t("Profile.twitter")}</span>
                <span className="ml-auto text-gray-900 font-semibold pr-3 font-raleway text-sm">
                  <a href={`https://twitter.com/${state?.data.socialMedia}`}>{state?.data.socialMedia}</a>
                </span>
              </div>
              <div
                className={`flex py-2 px-2 my-2 bg-gray-50 rounded-xlarge`}
              >
                <span className="text-black pl-3 font-bold uppercase font-raleway text-sm">{t("Profile.since")}</span>
                <span className="ml-auto text-gray-900 font-semibold pr-3 font-raleway text-sm">
                  {state?.data.timestamp.getDate() + '/' + (state?.data.timestamp.getMonth() + 1) + '/' + state?.data.timestamp.getFullYear()}
                </span>
              </div>
            </div>
          </div>
          {myProfile ? 
          <div className="w-full border-2 rounded-lg border-[#eab308] border-white-500 mt-10">
            <div className="text-center p-2 bg-[#eab308] text-white font-bold text-xl">{t("Profile.prefUsr")}</div>
            <div className="w-full flex flex-col lg:flex-row py-1 justify-between text-darkgray bg-gray-50 rounded-b">
              <div className="w-full lg:w-4/12 text-center text-base font-bold flex flex-col">
                <div className="py-2 text-lg">{t("Profile.language")}</div>
                <button
                  className="mx-4 my-2 py-2 bg-yellow2 rounded-2xl px-4 text-white text-base font-raleway font-semibold"
                  onClick={handleLanguage}
                >{t("Navbar.language")}
                </button>
              </div>
              <div className="w-full lg:w-4/12 text-center text-base font-bold flex flex-col">
                <div className="py-2 text-lg"></div>
                <button
                  className="mx-4 my-2 py-2 bg-yellow2 rounded-2xl px-4 text-white text-base font-raleway font-semibold"
                  onClick={async () => { addNTVToken() }}>{t("Profile.addNTV")}
                </button>
              </div>
              <div className="w-full lg:w-4/12 text-center text-base font-bold flex flex-col">
                <div className="py-2 text-lg"></div>
                <button
                  className="mx-4 my-2 py-2 bg-yellow2 rounded-2xl px-4 text-white text-base font-raleway font-semibold"
                  onClick={handleEditProfile}>{t("Profile.editProfile")}
                </button>
              </div>
            </div>
          </div> 
          : 
          ""
          }
          

        </div>
        <Modal {...modal} />
        <OfferModal {...offerModal} />
      </section>
    </>
  );
}

LightEcommerceB.defaultProps = {
  theme: "yellow",
};

LightEcommerceB.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default LightEcommerceB;
