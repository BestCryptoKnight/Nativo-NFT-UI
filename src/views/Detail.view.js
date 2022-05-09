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
import ReactHashtag from "react-hashtag";
import OfferModal from "../components/offerModal.component";
import { useTranslation } from "react-i18next";
import Swal from 'sweetalert2'

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
  const [hasBids, setHasBids] = useState(false)
  //es el parametro de tokenid
  const { data } = useParams();
  //es el historial de busqueda
  //let history = useHistory();
  const APIURL= process.env.REACT_APP_API_TG

  React.useEffect(() => {
    (async () => {
      setStateLogin(await isNearReady());
      let ownerAccount = await getNearAccount();
 

      let totalSupply;

      if (localStorage.getItem("blockchain") == "0") {
        //primero nos aseguramos de que la red de nuestro combo sea igual a la que esta en metamask
        // await syncNets();

        // //obtener cuantos tokens tiene el contrato
        // totalSupply = await getContract().methods.totalSupply().call();

        // //si es mayor que el total de tokens
        // if (parseInt(tokenid) >= parseInt(totalSupply)) {
        //   window.location.href = "/galeria";
        // } else {
        //   //obtener los datos del token que se queire
        //   let toks = await getContract().methods.tokensData(tokenid).call();
        //   toks.price = fromWEItoEth(toks.price);
        //   //obtener el dueño del contrato
        //   let owner = await getContract().methods.ownerOf(tokenid).call();
        //   //agregar el dueño y los datos del token
        //   //console.log(JSON.parse(toks.data));
        //   setstate({
        //     ...state,
        //     tokens: toks,
        //     jdata: JSON.parse(toks.data),
        //     owner,
        //   });
        //   //console.log(toks.data);
        // }
      } else {

        
        let contract = await getNearContract();
        let account = await getNearAccount();
        let tokenId = data;


        let payload = {
          account_id: account,
          token_id: tokenId, 
        };
        let onSale = false
        let priceData = ""
        let bids = []
        let bidder = ""
        let bidPrice = ""
        let nft = await contract.nft_token(payload);
        let bidsData = await getBids(tokenId)
          console.log(bidsData)
        if(Object.keys(nft.royalty).length!=0){
          setHasRoyalty(true)
        }        
        if(nft.approved_account_ids.length!=0){
          Object.entries(nft.approved_account_ids).map((approval,i) => {
            if(approval.includes(process.env.REACT_APP_CONTRACT_MARKET)){
              onSale=true
            }
          })
        }
        if(onSale){
          let data = await getSaleData(tokenId)
          priceData = fromYoctoToNear(data.price)
        }
        console.log(bidsData.buyer_id)
        if(bidsData.buyer_id != "null"){
          console.log("Hay oferta :D")
          setHasBids(true)
          bidder = bidsData.buyer_id
          bidPrice = fromYoctoToNear(bidsData.price)
        }
        setstate({
          ...state,
          tokens: {
            tokenID: nft.token_id,
            sale: onSale,
            price: priceData,
            bidder: bidder,
            bidPrice: bidPrice,
            account: account,
            owner: nft.owner_id,
            //chunk: parseInt(toks.token_id/2400),
          },
          jdata: {
            image: nft.metadata.media,
            title: nft.metadata.title,
            description: nft.metadata.description,
            royalty: Object.entries(nft.royalty),
            creator: nft.creator_id
          },
          owner: nft.owner_id,
          ownerAccount: ownerAccount,
        });


      }
    })();
  }, []);

  async function getSaleData(tokenID){
    let extPayload={
      nft_contract_token : process.env.REACT_APP_CONTRACT+"."+tokenID
    }
    let extData = await ext_view(process.env.REACT_APP_CONTRACT_MARKET,"get_sale",extPayload)
    return extData
  }
  async function getBids(tokenID){
    let extPayload={
      nft_contract_id : process.env.REACT_APP_CONTRACT,
      token_id : tokenID
    }
    let extData = await ext_view(process.env.REACT_APP_CONTRACT_MARKET,"get_offer",extPayload)
    return extData
  }

  async function manageOffer(option){

    
      //get contract
      let contract = await getNearContract();
      //construct payload
      let payload = {
        address_contract: state.tokens.contract,
        token_id: state.tokens.tokenID,
        collection_id: state.tokens.collectionID,
        collection: state.tokens.collection,
        status: Boolean(option) //true or false to  decline offer 
      }

      let amount = BigInt(state.tokens.highestbidder);
      let bigAmount = BigInt(amount);

      //accept the offer
      let toks = await contract.market_close_bid_generic(
        payload,
        300000000000000,
        0
      );
        Swal.fire({
          title: (option ? t("Detail.swTitOffer-1") : t("Detail.swTitOffer-2")),
          text: (option ? t("Detail.swTxtOffer-1") : t("Detail.swTxtOffer-2")),
          icon: 'success',
        }).then(function () {
          window.location.reload();
        })
  }

  async function comprar() {
    //evitar doble compra
    setstate({ ...state, btnDisabled: true });
    let account, toks;
    if (localStorage.getItem("blockchain") == "0") {
      //primero nos aseguramos de que la red de nuestro combo sea igual a la que esta en metamask
      await syncNets();
      //la cuenta a la cual mandaremos el token
      account = await getSelectedAccount();
    } else {
      account = await getNearAccount();
    }

    //si el dueño intenta comprar un token le decimos que no lo puede comprar
    if (state.owner.toUpperCase() === account.toUpperCase()) {
      setModal({
        show: true,
        title: "Error",
        message: "El dueño del token no puede recomparlo",
        loading: false,
        disabled: false,
        change: setModal,
      });
      //desbloquear el boton
      setstate({ ...state, btnDisabled: false });
      return;
    }

    //modal de espera
    setModal({
      show: true,
      title: "cargando",
      message: "hola como estas",
      loading: true,
      disabled: true,
      change: setModal,
    });

    if (localStorage.getItem("blockchain") == "0") {
      //llamar el metodo de comprar
      toks = await getContract()
        .methods.comprarNft(state.tokens.tokenID)
        .send({
          from: account,
          value: fromETHtoWei(Number(state.tokens.price)),
        })
        .catch((err) => {
          return err;
        });
    } else {

      let amount = parseFloat(state.tokens.price);
      //console.log("amount", amount)

      //instanciar contracto
      let payload = {
        nft_contract_id: process.env.REACT_APP_CONTRACT,
        token_id: state.tokens.tokenID
      }
      let toks = await ext_call(process.env.REACT_APP_CONTRACT_MARKET,"offer",payload,300000000000000,fromNearToYocto(amount))
      // let contract = await getNearContract();
      //obtener tokens a la venta
      // toks = await contract.market_buy_generic(
      //   {
      //     address_contract: state.tokens.contract,
      //     token_id: state.tokens.tokenID,
      //     collection: state.tokens.collection,
      //     collection_id: state.tokens.collectionID
      //   },
      //   300000000000000,
      //   fromNearToYocto(amount)
      // );

      //console.log(toks);
    }

    //si status esta undefined o falso le mandamos el modal de error
    if (!toks.status) {
      setModal({
        show: true,
        title: "Error",
        message: "intentalo de nuevo",
        loading: false,
        disabled: false,
        change: setModal,
      });
      //desbloquear el boton
      setstate({ ...state, btnDisabled: false });
    } else {
      setModal({
        show: true,
        title: "exito",
        message: "token comprado con exito",
        loading: false,
        disabled: false,
        change: setModal,
      });
      //desbloquear el boton
      setstate({ ...state, btnDisabled: false });
    }
  }

  async function processCancelOffer(tokenID){
    let payload = {
      nft_contract_id: process.env.REACT_APP_CONTRACT,
      token_id: tokenID,
    }
    ext_call(process.env.REACT_APP_CONTRACT_MARKET,"delete_offer",payload,300000000000000,1)
  }

  async function processAcceptOffer(listed,tokenID){
    if(listed){
      let payload = {
        nft_contract_id: process.env.REACT_APP_CONTRACT,
        token_id: tokenID,
      }
      ext_call(process.env.REACT_APP_CONTRACT_MARKET,"accept_offer",payload,300000000000000,1)
    }
    else{
      let contract = await getNearContract();
      let amount = fromNearToYocto(0.01);
      let price = "1000000000000000000000000"
      console.log(state)
      let msgData = JSON.stringify({market_type:"accept_offer", price: price, title: state.jdata.title, media: state.jdata.image, creator_id: state.jdata.creator, description: state.jdata.description})
      let payload = {
        token_id: state.tokens.tokenID,
        account_id: process.env.REACT_APP_CONTRACT_MARKET,
        msg: msgData
      }
      console.log(payload)
      let acceptOffer = contract.nft_approve(
        payload,
        300000000000000,
        amount
      )
    }
  }

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
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-8 mx-auto">
          <div
            className="regresar"
          >
            <a href={'/mynfts'} >
              <img
                className="hover:cursor-pointer h-[50px] "
                src={flechaiz}
              />
            </a>
          </div>
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full lg:h-auto h-64 object-fill  object-fill md:object-scale-down  rounded"
              src={`https://ipfs.io/ipfs/${state?.jdata.image}`}
            />
            <div className="lg:w-1/2 w-full lg:pl-10 lg:mt-0">

              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1 mb-6">
                {state?.jdata.title}
              </h1>
              <p className="leading-relaxed mt-2 mb-6 font-mono ">
                {state?.jdata.description}
              </p>



              {state?.tokens.sale?
                <>
                  <div
                    className={`flex border-l-4 border-${props.theme}-500 py-2 px-2 my-2 bg-gray-50`}
                  >
                    <span className="text-gray-500">Token Id</span>
                    <span className="ml-auto text-gray-900">
                      {state?.tokens.tokenID}
                    </span>
                  </div>

                  <div
                    className={`flex border-l-4 border-${props.theme}-500 py-2 px-2 my-2 bg-gray-50`}
                  >
                      <span className="text-gray-500">{t("Detail.sale")}</span>
                      <span className="ml-auto text-gray-900">
                        <span
                          className={`inline-flex items-center justify-center px-2 py-1  text-xs font-bold leading-none ${state?.tokens.sale
                            ? "text-green-100 bg-green-500"
                            : "text-red-100 bg-red-500"
                            } rounded-full`}
                        >
                          {state?.tokens.sale ? t("Detail.available-1") : t("Detail.available-2")}
                        </span>
                      </span>
                    </div>
                </>
              :
                ""}
              {/*<div
                className={`flex border-l-4 border-${props.theme}-500 py-2 px-2 my-2 bg-gray-50`}
              >
                <span className="text-gray-500">Tags</span>
                <span className="ml-auto text-gray-900">
                  {
                    state?.jdata.tags.length > 0 ?
                      state?.jdata.tags.map((element) =>
                        <span
                          key={element}
                          className={`inline-flex items-center justify-center px-2 py-1 ml-2 text-xs font-bold leading-none ${state?.jdata.tags
                            ? "text-green-100 bg-green-500"
                            : "text-red-100 bg-red-500"
                            } rounded-full`}
                        >
                          {element}
                        </span>
                      ) : null
                  }

                </span>
              </div>*/}



              <div
                className={`flex border-l-4 border-${props.theme}-500 py-2 px-2 my-2 bg-gray-50`}
              >
                <span className="text-gray-500">{t("Detail.owner")}</span>
                <span className="ml-auto text-gray-900 text-xs self-center">
                  {state?.owner}
                </span>
              </div>

              <div
                className={`flex border-l-4 border-${props.theme}-500 py-2 px-2 my-2 bg-gray-50`}
              >
                <span className="text-gray-500">{t("Detail.creator")}</span>
                <span className="ml-auto text-gray-900 text-xs self-center">
                  {state?.jdata.creator}
                </span>
              </div>

              {(hasRoyalty ?
                <div
                  className={`flex border-l-4 border-${props.theme}-500 py-2 px-2 my-2 bg-gray-50`}
                >
                  <span className="text-gray-500">{t("Detail.royalty")}</span>
                  <span className="ml-auto text-gray-900 text-xs self-center text-right">
                    <ol>
                      {state?.jdata.royalty.map((data,i) => {
                        return(
                          <li key={i}><b>{data[0]}</b> : {(data[1]/100)}%</li>
                        )
                      })}
                    </ol>
                  </span>
                </div>
                : "")
              }
              {(hasBids ?
                <>
                <div className="grid grid-rows-2 bg-gray-50 border-l-4 py-2 px-2">
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Oferta actual: <b>{state?.tokens.bidPrice} NEAR</b></span>
                    <span className="ml-auto text-gray-900 text-xs">{state?.tokens.bidder}</span>
                  </div>
                  {(state?.tokens.bidder == state?.tokens.account ? 
                    <div className="w-full pt-2">
                      <button 
                        className="w-full content-center justify-center text-center font-bold text-white bg-yellow2 border-0 py-1 px-6 focus:outline-none hover:bg-yellow rounded ml-auto"
                        onClick={async () => {processCancelOffer(state?.tokens.tokenID)}}>
                          Cancelar oferta
                      </button>
                    </div>
                    : state?.tokens.account == state?.owner ?
                      <>
                        <div className="grid grid-cols-2 gap-4 place-items-center ">
                          <button 
                            className="w-full  content-center justify-center text-center font-bold text-white bg-green-500 border-0 py-1 px-6 focus:outline-none hover:bg-green-300 rounded"
                            onClick={async () => {processAcceptOffer(state?.tokens.sale,state?.tokens.tokenID)}}>
                            Aceptar
                          </button>
                          <button 
                            className="w-full  content-center justify-center text-center font-bold text-white bg-red-500 border-0 py-1 px-6 focus:outline-none hover:bg-red-300 rounded"
                            onClick={async () => {processCancelOffer(state?.tokens.tokenID)}}>
                            Rechazar
                          </button>
                        </div>
                      </>
                    : "")
                    }
                </div>
                </> 
                : "")
              }
              

   
              {/* <div
                className={`flex border-l-4 border-${props.theme}-500 py-2 px-2 my-2 bg-gray-50 invisible`}
              >
                <span className="text-gray-500">Contrato</span>
                <span className="ml-auto text-gray-900 text-xs">
                  {state?.jdata.contract}
                </span>
              </div> */}




              

              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5"></div>

              <div className="flex flex-col">
                <span className="title-font font-medium text-2xl text-gray-900 text-center w-full">
                  { 
                    !state?.tokens.sale ?
                      ""
                      :
                      "$ " + state?.tokens.price + " " + currencys[parseInt(localStorage.getItem("blockchain"))]
                  }
                </span>
                <div className="flex flex-row flex-wrap justify-around mt-3 text-center">
                  {
                    stateLogin? 
                    state?.owner != state?.ownerAccount? 
                      <>
                        <button
                          className={`w-full m-2 lg:w-40 content-center justify-center text-center font-bold text-white bg-yellow2 border-0 py-2 px-6 focus:outline-none hover:bg-yellow rounded`}
                          onClick={async () => {
                            makeAnOffer();
                          }}
                        >
                          {t("Detail.bid")}
                        </button>
                        {state?.tokens.sale ? 
                        <>
                        <button
                          className={`w-full m-2 lg:w-40 content-center justify-center text-center font-bold text-white bg-yellow2 border-0 py-2 px-6 focus:outline-none hover:bg-yellow rounded`}
                          onClick={async () => {
                            comprar();
                          }}
                        >
                          {t("Detail.buy")}
                        </button>
                        </> : ""}
                      </>
                      : "" 
                      : 
                      <button
                        className={`flex ml-auto mt-2 text-white bg-yellow2 border-0 py-2 px-6 focus:outline-none font-bold rounded`}
                        style={
                          btn
                            ?
                            { width: "100%", justifyContent: "center" }
                            :
                            {}
                        }
                        // disabled={state?.tokens.onSale}
                        onClick={async () => {
                          nearSignIn(window.location.href);
                        }}
                      >
                        {t("Detail.login")}
                      </button>
                  }

                
                </div>
              </div>
            </div>

            {/*//CURRENT OFFER TO i 
            state  && state.tokens && state.tokens.addressbidder != 'accountbidder' &&  state.tokens.highestbidder != "notienealtos" ?
            <div className="w-full">
              <div className="w-full border-4 rounded-lg border-[#eab308] border-white-500 mt-10">
                <div className="text-center p-2 bg-[#eab308] text-white font-bold text-xl">{t("Detail.curBid")}</div>
                <div className="w-full flex flex-row py-1 justify-between text-gray-500 bg-gray-50">
                  <div className="w-6/12 md:w-4/12 text-center  text-lg font-bold text-gray-500">{t("Detail.bidder")}</div>
                  <div className="w-6/12 md:w-4/12 text-center  text-lg font-bold text-gray-500">{t("Detail.price")}</div>
                  <div className="w-0 md:w-4/12 text-center  text-lg font-bold text-gray-500"></div>
                </div>
                  <div className=" w-full h-[75px] md:h-[50px] overscroll-none">
                    <div className={`w-full flex flex-row  flex-wrap justify-around md:justify-between py-2 border-b-4 border-gray-50`}>
                      <div className="w-4/12 text-center text-gray-500">{state?.tokens.addressbidder}</div>
                      <div className="w-4/12 text-center text-gray-500">{state?.tokens.highestbidder ? fromYoctoToNear(state?.tokens.highestbidder) : ""} NEAR</div>
                      <div className="w-full md:w-4/12 text-center text-gray-500 flex justify-around">
                        { state.owner == state.ownerAccount ? 
                        <button
                          onClick={async () => {
                            manageOffer(true);
                          }}
                        >
                          <span
                            className={`inline-flex items-center justify-center px-6 py-2  text-xs font-bold leading-none  text-green-100 bg-green-500 rounded-full`}
                          >
                            {t("Detail.accept")}
                          </span>
                        </button> : ""
                        }
                        { state.owner == state.ownerAccount || state.ownerAccount == state.tokens.addressbidder ? 
                        <button
                          onClick={async () => {
                            manageOffer(false);
                          }}
                        >
                          <span
                            className={`inline-flex items-center justify-center px-6 py-2  text-xs font-bold leading-none text-red-100 bg-red-500 rounded-full` } 
                          >
                            {t("Detail.decline")}
                          </span>
                        </button> : ""
                          }
                      </div>
                    </div>
                  </div>
              </div>
            </div>
            : ""
            */}
            {/*state && state.toknOffersData != 0 ?
              <div className="w-full border-4 rounded-lg border-[#eab308] border-white-500 mt-10">
                <div className="text-center p-2 bg-[#eab308] text-white font-bold text-xl">{t("Detail.bidsMade")}</div>
                <div className="w-full flex flex-row py-1 justify-between text-gray-500 bg-gray-50">
                  <div className="w-4/12 text-center  text-lg font-bold text-gray-500">{t("Detail.bidder")}</div>
                  <div className="w-4/12 text-center  text-lg font-bold text-gray-500">{t("Detail.price")}</div>
                </div>
                <div className="h-[250px] overflow-scroll">
                  {state?.toknOffersData.map((offer, i) => {
                    return (
                      <div key={i} className={`w-full flex flex-row justify-between py-2 border-b-4 border-gray-50`}>
                        <div className="w-4/12 text-center text-gray-500">{offer.owner_id}</div>
                        <div className="w-4/12 text-center text-gray-500">{fromYoctoToNear(offer.price)} NEAR</div>
                      </div>
                    );
                  })
                  }
                </div>
              </div>
              : ""
                */}
          </div>


        </div>
        <Modal {...modal} />
        <OfferModal {...offerModal}  />
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
