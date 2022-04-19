import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tooltip from '@mui/material/Tooltip';
//Importamos metodos de interacción con el smartcontract
import {
  fromWEItoEth,
  getContract,
  getSelectedAccount,
  syncNets,
} from "../utils/blockchain_interaction";

import { useHistory } from "react-router";
import ModalSubasta from '../components/modalSubasta.component'
import Modal from "../components/modalRevender.component";
import TransferModal from "../components/transferModal.component"
import ApprovalModal from "../components/approvalModal.component"
import PriceModal from "../components/priceModal.component"
import load from "../assets/landingSlider/img/loader.gif";
import Pagination from '@mui/material/Pagination';
import { currencys } from "../utils/constraint";
import {
  getNearAccount,
  getNearContract,
  fromYoctoToNear,
  fromNearToYocto,
  ext_call
} from "../utils/near_interaction";
import Swal from 'sweetalert2';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { useTranslation } from "react-i18next";
import InfiniteScroll from 'react-infinite-scroll-component';

function MisTokens(props) {
  //Hooks para el manejo de estados
  const [pagsale, setpagsale] = React.useState(0);
  const [pagCount, setpagCount] = React.useState("");
  const [chunksale, setchunksale] = React.useState(0);
  const [page, setpage] = React.useState(1);
  const [trigger, settrigger] = React.useState(true);
  const [ini, setini] = React.useState(true);
  const [firstID, setFirstID] = React.useState(-1);
  const [lastID, setLastID] = React.useState(-1);
  const [statePage, setStatePage] = React.useState(true)
  const [firstLoad, setFirstLoad] = React.useState(true)
  const [loadMsg,setLoadMsg] = React.useState(true)
  const [t, i18n] = useTranslation("global")
  const [nfts, setNfts] = useState({
    nfts: [],
    page: parseInt(window.localStorage.getItem("Mypage")),
    tokensPerPage: 3,
    tokensPerPageNear: 6,

    blockchain: localStorage.getItem("blockchain"),
    currency: currencys[parseInt(localStorage.getItem("blockchain"))],
  }); //state de los token nft
  const [modal, setModal] = useState({
    //state para la ventana modal
    show: false,
  });

  const [modalSub, setModalSub] = useState({
    //state para la ventana modal
    show: false,
  });

  const [transferModal, setTransferModal] = useState({
    show: false,
  });

  const [approvalModal, setApprovalModal] = useState({
    show: false,
  });

  const [priceModal, setPriceModal] = useState({
    show: false,
  });
  // const [imgs, setImgs] = useState([]);
  let imgs = [];

  const APIURL = process.env.REACT_APP_API_TG

  async function makeATransfer(tokenID) {
    setTransferModal({
      ...state,
      show: true,
      title: t("MyNFTs.modalTransTitle"),
      message: t("MyNFTs.modalTransMsg"),
      loading: false,
      disabled: false,
      tokenID: tokenID,
      change: setTransferModal,
      buttonName: 'X',
      tokenId: 'hardcoded'
    })
  }

  async function makeAApproval(tokenID) {
    setApprovalModal({
      ...state,
      show: true,
      title: t("MyNFTs.modalAppTitle"),
      message: t("MyNFTs.modalAppMsg"),
      loading: false,
      disabled: false,
      tokenID: tokenID,
      change: setTransferModal,
      buttonName: 'X',
      tokenId: 'hardcoded'
    })
  }

  async function makeChangePrice(tokenID) {
    setPriceModal({
      ...state,
      show: true,
      title: t("MyNFTs.modalPriTitle"),
      message: t("MyNFTs.modalPriMsg"),
      loading: false,
      disabled: false,
      tokenID: tokenID,
      change: setTransferModal,
      buttonName: 'X',
      tokenId: 'hardcoded'
    })
  }

  const handleChangePage = (e, value) => {
    console.log(value)
    setpage(value)
    // setpagsale(parseInt(pagCount.split(",")[value - 1].split("-")[1]))
    // setchunksale(parseInt(pagCount.split(",")[value - 1].split("-")[0]))
    // console.log(parseInt(pagCount.split(",")[value - 1].split("-")[1]))
    // console.log(parseInt(pagCount.split(",")[value - 1].split("-")[0]))
    window.scroll(0, 0)
    settrigger(!trigger)
  }

  const handleBackPage = () => {
    console.log("Back")
    window.scroll(0, 0)
    setStatePage(false)
    settrigger(!trigger)
  }

  const handleForwardPage = () => {
    console.log("Forward")
    window.scroll(0, 0)
    setStatePage(true)
    settrigger(!trigger)
  }


  const [state, setState] = React.useState({
    items: Array.from({ length: 400 }),
    hasMore: true
  });

  
  const fetchMoreData = async () => {
    setpage(page+1);

    let contract = await getNearContract();
    let account = await getNearAccount();
    let paramsSupplyForOwner = {
      account_id: account
    };
    let totalTokensByOwner = await contract.nft_supply_for_owner(paramsSupplyForOwner);
    

    if (nfts.nfts.length >= totalTokensByOwner) {
      setState({ hasMore: false });
      return;
    }

    
    

    let payload = {
      account_id: account,
      from_index: (page*3).toString(),
      limit: nfts.tokensPerPage,
    };
    
    let nftsPerOwnerArr = await contract.nft_tokens_for_owner(payload);



    // //convertir los datos al formato esperado por la vista
    let nftsArr = nftsPerOwnerArr.map((tok, i) => {
      let onSale=false
      imgs.push(false);
      let data = Object.entries(tok.approved_account_ids)
      data.map((approval,i) => {
        if(approval.includes(process.env.REACT_APP_CONTRACT_MARKET)){
          onSale=true
          console.log("Esta a la venta en nativo")
        }
      })
      fetch("https://ipfs.io/ipfs/" + tok.media).then(request => request.blob()).then(() => {

        imgs[i] = true;
      });
      return {
        tokenID: tok.token_id,
        approval: tok.approved_account_ids,
        onSale: onSale,
        // onSale: tok.on_sale,// tok.metadata.on_sale,
        // onAuction: tok.on_auction,
        data: JSON.stringify({
          title: tok.metadata.title,//"2sdfeds",// tok.metadata.title,
          image: tok.metadata.media,//"vvvvvvvvvvvvvv",//tok.metadata.media,
          description: tok.metadata.description,
          creator: tok.creator_id
        }),
      };

    });


    let newValue = nfts.nfts.concat(nftsArr);
    setNfts({nfts: newValue });
    
  };


  const history = useHistory();

  const sendtonearwallet = async (e) => {
    Swal.fire({
      title: `¡ATENCIÓN!`,
      icon: 'info',
      text: 'Esta acción creará una transferencia nula que generará un error, pero los tokens serán agregados al Near Wallet una vez finalizada. (Solo se debe realizar una vez)',
      showDenyButton: true,
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#f89c0c',
      denyButtonText: `Cancelar`,
      iconColor: '#f89c0c',
      backdrop: 'rgba(0, 0, 0,0.5)'
    }).then(async (result) => {
      if (result.isConfirmed) {
        //console.log(e);
        let contract = await getNearContract();
        let account = await getNearAccount();


        try {
          let res = await contract.nft_transfer_call(
            { "receiver_id": "" + account, "token_id": "" + e, "approval_id": null, "memo": "", "msg": "" },
            300000000000000,
            1,
          );
        } catch (error) {
          //console.error();
        }
      } else if (result.isDenied) {

      }
    })
  }

  async function getPage(pag) {
    if (nfts.blockchain == "0") {
      //esta funcion nos regresa todos los tokens por que solidity no permite arreglos
      //dinamicos en memory
      let toks = await getContract()
        .methods.tokensOfPaginav1(nfts.owner, nfts.tokensPerPage, pag)
        .call();

      //asignamos y filtramos todos los tokens que estan a  la venta

      setNfts({
        ...nfts,
        nfts: toks.filter((tok) => tok.onSale),
        page: pag,
      });
    } else {
      let contract = await getNearContract();
      let account = await getNearAccount();
      //console.log("pag",pag,"nfts.tokensPerPageNear",nfts.tokensPerPageNear)
      let payload = {
        account_id: account.toString(),
        from_index: "" + pag.toString(),
        limit: nfts.tokensPerPageNear.toString(),
      };

      let nftsArr = await contract.nft_tokens_for_owner(payload);

      //convertir los datos al formato esperado por la vista
      nftsArr = nftsArr.map((tok) => {
        return {
          tokenID: tok.token_id,
          price: fromYoctoToNear(tok.metadata.price),
          onSale: tok.metadata.on_sale,
          data: JSON.stringify({
            title: tok.metadata.title,
            image: tok.metadata.media,
          }),
        };
      });

      setNfts({
        ...nfts,
        nfts: nftsArr,
        page: pag,
      });
    }
  }

  //Hook para el manejo de efectos
  useEffect(() => {
    (async () => {
      window.localStorage.setItem("Mypage", 0);

 

      if (nfts.blockchain == "0") {
        //Comparamos la red en el combo de metamask con la red de aurora
        await syncNets();
        let account = await getSelectedAccount();
        //obtenemos el listado de nfts
        let nftsArr = await getContract()
          .methods.tokensOfPaginav1(account, nfts.tokensPerPage, nfts.page)
          .call();
        let balance = await getContract().methods.balanceOf(account).call();
        //console.log(nftsArr);

        //filtrar tokens
        let copytoks = nftsArr.filter((tok) => tok.price > 0);

        //convertir los precios de wei a eth
        copytoks = copytoks.map((tok) => {
          return { ...tok, price: fromWEItoEth(tok.price) };
        });

        //Actualizamos el estado el componente con una propiedad que almacena los tokens nft
        setNfts({
          ...nfts,
          nfts: copytoks,
          nPages: Math.ceil(balance / nfts.tokensPerPage) + 1,
          owner: account,
        });
      } else {
        let contract = await getNearContract();
        let account = await getNearAccount();
        let numNFT = await contract.nft_supply_for_owner({account_id: account})
        console.log(numNFT)
        if(numNFT==0){
          setLoadMsg(false)
        }
        let payload = {
          account_id: account,
          from_index: "0", 
          limit: nfts.tokensPerPage,
        };
        let nftsPerOwnerArr = await contract.nft_tokens_for_owner(payload);

        let toks;
  
        // //convertir los datos al formato esperado por la vista
        let nftsArr = nftsPerOwnerArr.map((tok, i) => {
          console.log(tok)
          let onSale=false
          //console.log("X->",  tok  )
          imgs.push(false);
          let data = Object.entries(tok.approved_account_ids)
          data.map((approval,i) => {
            if(approval.includes(process.env.REACT_APP_CONTRACT_MARKET)){
              onSale=true
              console.log("Esta a la venta en nativo")
            }
          })
          fetch("https://ipfs.io/ipfs/" + tok.media).then(request => request.blob()).then(() => {

            imgs[i] = true;
          });
          return {
            tokenID: tok.token_id,
            approval: tok.approved_account_ids,
            onSale: onSale,
            // onSale: tok.on_sale,// tok.metadata.on_sale,
            // onAuction: tok.on_auction,
            data: JSON.stringify({
              title: tok.metadata.title,//"2sdfeds",// tok.metadata.title,
              image: tok.metadata.media,//"vvvvvvvvvvvvvv",//tok.metadata.media,
              description: tok.metadata.description,
              creator: tok.creator_id
            }),
          };
        });



        setNfts({
          ...nfts,
          nfts: nftsArr,
          owner: account,
        });

        
      }

      
    })();
  }, [trigger]);

  /**
   * Función que cambia a "no disponible" un token nft que esta a la venta siempre que se sea el owner
   * @param tokenId representa el token id del nft a quitar del marketplace
   * @return void
   */

  async function removeSale(tokenID){
    let contract = await getNearContract();
    let payload = {
      token_id: tokenID,
      account_id: process.env.REACT_APP_CONTRACT_MARKET 
    }
    let revoke = contract.nft_revoke(
      payload,
      300000000000000, // attached GAS (optional)
      1
    )
  }

  async function quitarDelMarketplace(tokenId, collectionTit, contractSend, collectionId) {
    setNfts({ ...nfts, disabled: true });
    let quitar;
    if (nfts.blockchain == "0") {
      await syncNets();

      let account = await getSelectedAccount();
      quitar = await getContract()
        .methods.quitarDelMarketPlace(tokenId)
        .send({
          from: account,
        })
        .catch((err) => {
          return err;
        });
    } else {
      let contract = await getNearContract();
      let payload = {
        address_contract: contractSend,
        token_id: tokenId,
        collection: collectionTit,
        collection_id: collectionId
      };
      let amount = fromNearToYocto(0.05);
      //console.log(amount);
      //console.log(payload);
      quitar = await contract.market_remove_generic(
        payload,
        300000000000000, // attached GAS (optional)
        0
      );
      Swal.fire({
        title: 'NFT quitado de la venta',
        text: 'Se ha quitado un NFT de la venta con exito',
        icon: 'success',
        confirmButtonColor: '#E79211'
      }).then(function () {
        window.location.href = "/mynfts"
      })
    }

    //console.log(quitar);
    //recargar la pantalla si la transacción se ejecuto correctamente
    if (quitar.title || quitar.status) {
      history.go(0);
    }

    setNfts({ ...nfts, disabled: false });
  }




  return (
    <>
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-5 mx-auto asda">

          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900 mt-8">
              {t("MyNFTs.title")}
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base ">
              {t("MyNFTs.subtitle")}
            </p>
            <div className="">
              {/* <button
                className={`sp-4 mt-5 text-white bg-${props.theme}-500 border-0 py-2 font-bold px-7 focus:outline-none hover:bg-${props.theme}-600 rounded text-md `}
                onClick={() => {
                  sendtonearwallet(nfts.tokenID)
                }}

              >
                Mostrar tokens en NEAR Wallet
              </button> */}
            </div>
            {/* Arroj un mensaje si no hay tokens en mi pertenencia*/}
            {nfts.nfts.length > 0 ? null : (
              <div className="container mx-auto flex  my- md:flex-row flex-col  justify-center h-96 items-center text-3xl">
                <div className="flex flex-col justify-center">
                  <h1 className="text-center">{loadMsg ? t("MyNFTs.load-1") : t("MyNFTs.load-2")}</h1>
                </div>
              </div>
            )}
          </div>
          {loadMsg? 
            <InfiniteScroll
            dataLength={nfts.nfts.length}
            next={fetchMoreData}
            hasMore={state.hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            <div className="flex flex-wrap m-9 mb-6">
              {nfts.nfts.map((nft, key) => {
                //obtenemos la data del token nft
                console.log(nft)
                const nftData = JSON.parse(nft.data);
                return (
                  <div className="lg:w-1/3 md:w-1/2 sm:w-1/2 ssmw-1  px-6 my-5 border-gray-200" key={key}>
                    <div className="flex relative ">
                      <img
                        alt="gallery"
                        className="ring ring-gray-200 absolute inset-0 z-0 w-full h-full object-cover object-center "
                        src={imgs[key] ? load : "https://ipfs.io/ipfs/" + nftData.image}
                      />
                      <h1 className="absolute justify-center px-2 py-1 text-sm font-bold leading-none text-white dark:bg-yellow rounded-full top-4 left-3 ">{nftData.title}</h1>
                      <div className="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100 ">
                        <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                          {nftData.title}
                        </h1>
  
  
                        <p className="leading-relaxed"><b>{t("MyNFTs.creator")}</b> {nftData.creator}</p>
                        {/* Etiqueta de token en subasta */}
                        {/* <div
                    className={`flex border-l-4 border-${props.theme}-500 py-2 px-2 my-2 bg-gray-50`}
                  >
                    <span className="text-gray-500">OnAuction</span>
                    <span className="ml-auto text-gray-900">
                      <span
                        className={`inline-flex items-center justify-center px-2 py-1  text-xs font-bold leading-none ${
                          nft.onAuction
                            ? "text-green-100 bg-green-500"
                            : "text-red-100 bg-red-500"
                        } rounded-full`}
                      >
                        {nft.onAuction ? "Disponible" : "No disponible"}
                      </span>
                    </span>
                  </div> */}
                        <div
                          className={`flex border-l-4 border-${props.theme}-500 py-2 px-2 my-2 dark:bg-gray-50`}
                        >
                          <span className="text-gray-500">{t("MyNFTs.sale")}</span>
                          <span className="ml-auto text-gray-900">
                            <span
                              className={`inline-flex items-center justify-center px-2 py-1  text-xs font-bold leading-none ${
                                nft.onSale
                                  ? "text-green-100 bg-green-500"
                                  : "text-red-100 bg-red-500"
                              } rounded-full`}
                            >
                              {nft.onSale ? t("MyNFTs.available-1") : t("MyNFTs.available-2")}
                            </span>
                          </span>
                        </div>
                        <br></br>
                        <h2
                          className={`tracking-widest text-sm title-font font-medium text-darkgray mb-1`}
                        >{`Token id: ${nft.tokenID}  `}</h2>
                        <h2
                          className={`tracking-widest text-sm title-font font-medium text-darkgray mb-6 invisible`}
                        >{`${t("MyNFTs.cost")}: ${nft.price} ${nfts.currency}`}</h2>
                        <div className="text-center">
                          <a
                            href={"/detail/" + nft.tokenID}
                            className={`mt-12 w-full text-white bg-yellow2 border-0 py-2 px-4 focus:outline-none hover:bg-brown rounded text-lg`}
                          >{t("MyNFTs.detail")}</a>
                          <button
                            className={`mt-6 w-full text-white bg-yellow2 border-0 py-2 px-4 focus:outline-none hover:bg-brown rounded text-lg`}
                            onClick={async () =>{
                              makeATransfer(nft.tokenID);
                            }}
                          >
                            {t("MyNFTs.transferButton")}
                          </button>
                          {nft.onSale? 
                            <>
                              <button
                                className={` mt-12 w-full text-white bg-yellow2 border-0 py-2 px-6 focus:outline-none hover:bg-brown rounded text-lg`}
                                onClick={() => {
                                  makeChangePrice(nft.tokenID);
                                }}
                              >
                                {t("MyNFTs.btnPrice")}
                              </button>
                              <button
                                className={` mt-6 w-full text-white bg-yellow2 border-0 py-2 px-6 focus:outline-none hover:bg-brown rounded text-lg`}
                                onClick={() => {
                                  removeSale(nft.tokenID)
                                }}
                              >
                                {t("MyNFTs.remove")}
                              </button>
                            </>
                          : 
                            <button
                              className={` mt-12 w-full text-white bg-yellow2 border-0 py-2 px-6 focus:outline-none hover:bg-brown rounded text-lg`}
                              onClick={() => {
                                makeAApproval(nft.tokenID);
                              }}
                            >
                              {t("MyNFTs.putSale")}
                            </button>
                          }
                          
                        </div>
                        
                        {/* Mostramos la opción de revender o quitar del marketplace */}
                        {nft.status == "S" ? (<>      <button
                          className={` mt-6 w-full text-white bg-${props.theme}-500 border-0 py-2 px-6 focus:outline-none hover:bg-${props.theme}-600 rounded text-lg`}
                          disabled={nfts.disabled}
                          onClick={async () => {
                            await quitarDelMarketplace(nft.tokenID, nft.collection, nft.contract, nft.collectionID);
                          }}
                        >
                          {t("MyNFTs.remove")}
                        </button>
                        </>
  
                        ) : (
                          <>
                            {nft.status != "S" && <>  
                              {/* <button
                      className={` mt-2 w-full text-white bg-${props.theme}-500 border-0 py-2 px-6 focus:outline-none hover:bg-${props.theme}-600 rounded text-lg`}
                      onClick={() => {
                        setModalSub({
                          ...modalSub,
                          show: true,
                          tokenId: nft.tokenID,
                          title: "Subastar NFT",
                          currency: nfts.currency,
                          blockchain: nfts.blockchain,
                          message:
                            "Ingresa el monto base al que quieres subastar este NFT junto a su fecha y hora de finalizacion.",
                          buttonName: "Cancelar",
                          change: setModalSub,
                        });
                       
                      }}
                    >
                      Poner en subasta
                    </button> */}
  
  
                            </>}
  
                          </>
  
  
                        )}
                      </div>
                    </div>
  
                  </div>
                );
              })}
            </div>
            </InfiniteScroll>
          : 
            ""}
              

        </div>

        

        {/* Mandamos a llamar al modal con el state como props*/}
        <ModalSubasta {...modalSub} />
        <Modal {...modal} />
        <TransferModal {...transferModal}/>
        <ApprovalModal {...approvalModal}/>
        <PriceModal  {...priceModal}/>
      </section>
    </>
  );
}

MisTokens.propTypes = {
  theme: PropTypes.string,
};

MisTokens.defaultProps = {
  theme: "yellow",
};

export default MisTokens;
