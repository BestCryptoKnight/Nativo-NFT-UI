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
import load from "../assets/landingSlider/img/loader.gif";
import Pagination from '@mui/material/Pagination';
import { currencys } from "../utils/constraint";
import {
  getNearAccount,
  getNearContract,
  fromYoctoToNear,
  fromNearToYocto,
} from "../utils/near_interaction";
import Swal from 'sweetalert2';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { useTranslation } from "react-i18next";

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
    tokensPerPage: 9,
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
  // const [imgs, setImgs] = useState([]);
  let imgs = [];

  const APIURL = process.env.REACT_APP_API_TG

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
        //console.log(account);
        let payload = {
          account: account,
          //from_index: nfts.page , 
          //limit: nfts.tokensPerPageNear,
        };
        let toks
        if (statePage) {
          const queryData = `
          query($owner: String, $first: Int, $tokenID: Int){
            tokens(first: $first, orderBy: tokenId, orderDirection: asc, where: {owner_id: $owner, tokenId_gt: $tokenID}) {
              id
              collection
              collectionID
              contract
              tokenId
              owner_id
              title
              description
              media
              creator
              price
              status
              adressbidder
              highestbidder
              lowestbidder
              expires_at
              starts_at
              extra
            }
          }
        `
          //Declaramos el cliente
          const client = new ApolloClient({
            uri: APIURL,
            cache: new InMemoryCache(),
          })

          await client
            .query({
              query: gql(queryData),
              variables: {
                owner: account,
                first: nfts.tokensPerPageNear,
                tokenID: lastID
              },
            })
            .then((data) => {
              // console.log("collections data: ",data.data.collections)
              console.log("tokens data: ", data.data.tokens)
              toks = data.data.tokens
              if(data.data.tokens.length <= 0){
                setLoadMsg(false)
              }
              setFirstID(parseInt(data.data.tokens[0].tokenId))
              setLastID(parseInt(data.data.tokens[data.data.tokens.length - 1].tokenId))
              setpage(page+1)
              // colData = data.data.collections[0]
            })
            .catch((err) => {
              //console.log('Error ferching data: ', err)
              toks = 0
            })
        }
        else {
          const queryData = `
          query($owner: String, $first: Int, $tokenID: Int){
            tokens(first: $first, orderBy: tokenId, orderDirection: desc, where: {owner_id: $owner, tokenId_lt: $tokenID}) {
              id
              collection
              collectionID
              contract
              tokenId
              owner_id
              title
              description
              media
              creator
              price
              status
              adressbidder
              highestbidder
              lowestbidder
              expires_at
              starts_at
              extra
            }
          }
        `
          //Declaramos el cliente
          const client = new ApolloClient({
            uri: APIURL,
            cache: new InMemoryCache(),
          })

          await client
            .query({
              query: gql(queryData),
              variables: {
                owner: account,
                first: nfts.tokensPerPageNear,
                tokenID: firstID
              },
            })
            .then((data) => {
              // console.log("collections data: ",data.data.collections)
              console.log("tokens data: ", data.data.tokens)
              toks = data.data.tokens
              setFirstID(parseInt(data.data.tokens[data.data.tokens.length - 1].tokenId))
              setLastID(parseInt(data.data.tokens[0].tokenId))
              setpage(page-1)
              // colData = data.data.collections[0]
            })
            .catch((err) => {
              //console.log('Error ferching data: ', err)
              toks = 0
            })
        }
        if (toks == 0) {
          return
        }
        if(firstLoad){
          setpage(1)
          setFirstLoad(false)
        }

        
        // let nftsArr = await contract.obtener_pagina_by_owner(payload);
        

        // var pag = await contract.get_pagination_owner_filters({
        //   account: account,
        //   tokens: nfts.tokensPerPageNear,
        //   //_start_index: Landing.page,
        //   _start_index: pagsale,
        //   _minprice: 0,
        //   _maxprice: 0,
        //   _mindate: 0,
        //   _maxdate: 0,
        // })
        // let pagNumArr = pag
        // let pagi = pag.toString()
        // console.log(pagi)
        // setpagCount(pagi)
        // console.log(pagCount)
        // console.log(chunksale)
        // console.log(pagsale)
        // window.localStorage.setItem("pagPerf",parseInt(pagi.split(",")[0].split("-")[1]))
        // window.localStorage.setItem("pagCPerf",parseInt(pagi.split(",")[0].split("-")[0]))
        // let toks = await contract.obtener_pagina_owner({
        //   account: account,
        //   chunk: (ini ? parseInt(window.localStorage.getItem("pagCPerf")): chunksale),
        //   tokens: nfts.tokensPerPageNear,
        //   //_start_index: Landing.page,
        //   _start_index: (ini ? parseInt(window.localStorage.getItem("pagPerf")): pagsale),
        //   _minprice: 0,
        //   _maxprice: 0,
        //   _mindate: 0,
        //   _maxdate: 0,
        // });
        // if(ini){
        //   window.localStorage.removeItem("pagCPerf")
        //   window.localStorage.removeItem("pagPPerf")
        //   setini(!ini)
        // }
        // //console.log("extras:",nftsArr  );
        // //console.log("balance",balance);

        // //convertir los datos al formato esperado por la vista
        let nftsArr = toks.map((tok, i) => {
          //console.log("X->",  tok  )
          imgs.push(false);
          fetch("https://ipfs.io/ipfs/" + tok.media).then(request => request.blob()).then(() => {
            console.log("entro " + imgs.length);
            imgs[i] = true;
          });
          return {
            tokenID: tok.tokenId,
            price: fromYoctoToNear(tok.price),
            status: tok.status,
            collection: tok.collection,
            contract: tok.contract,
            collectionID: tok.collectionID,
            // onSale: tok.on_sale,// tok.metadata.on_sale,
            // onAuction: tok.on_auction,
            data: JSON.stringify({
              title: tok.title,//"2sdfeds",// tok.metadata.title,
              image: tok.media,//"vvvvvvvvvvvvvv",//tok.metadata.media,
              description: tok.description,
              creator: tok.creator,
              titleCol: tok.collection,
              collectionID: tok.collectionID,
            }),
          };
        });
        if (!statePage) {
          nftsArr = nftsArr.reverse()
        }

        // console.log(nftsArr);
        //Actualizamos el estado el componente con una propiedad que almacena los tokens nft
        let nftsToSend = nftsArr//.slice(nfts.tokensPerPageNear*(page - 1),nfts.tokensPerPageNear*page)
        setNfts({
          ...nfts,
          nfts: nftsToSend,
          nPages: 0,
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
        <div className="container px-5 pt-5 mx-auto">
          <div className="bg-white px-4 py-3 flex items-center justify-center border-b border-gray-200 sm:px-6 mt-1">
            <button className="bg-transparent hover:bg-slate-200 text-slate-500 hover:text-slate-700 font-extrabold text-center items-center rounded-full py-2 px-4 mx-4"
              onClick={() => handleBackPage()}
            >{"<"}</button>
            <p>{page}</p>
            <button className="bg-transparent hover:bg-slate-200 text-slate-500 hover:text-slate-700 font-extrabold text-center items-center rounded-full py-2 px-4 mx-4"
              onClick={() => handleForwardPage()}
            >{">"}</button>
            {/* <Pagination count={nfts.nPages} page={page} onChange={handleChangePage} color="warning" theme="light" /> */}
          </div>
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900 mt-8">
              {t("MyNFTs.title")}
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
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
          <div className="flex flex-wrap -m-9 mb-6">
            {/* Hacemos un map del array de nft dentro del state */}
            {nfts?.nfts &&
              nfts.nfts.map((nft, key) => {
                //obtenemos la data del token nft
                const nftData = JSON.parse(nft.data);
                //console.log("Aquiiii",nft);
                return (
                  //devolvemos un card por cada token nft del usuario
                  <div className="lg:w-1/3 md:w-1/2 sm:w-1/2 ssmw-1  px-6 my-5 border-gray-200" key={key}>
                    {console.log(nft.status)}
                    <div className="flex relative ">
                      <img
                        alt="gallery"
                        className="ring ring-gray-200 absolute inset-0 z-0 w-full h-full object-cover object-center "
                        src={imgs[key] ? load : "https://ipfs.io/ipfs/" + nftData.image}
                      />
                      <h1 className="absolute justify-center px-2 py-1 text-sm font-bold leading-none text-white bg-yellow-500 rounded-full top-4 left-3 ">{nftData.title}</h1>
                      <div className="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100 ">
                        <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                          {nftData.title}
                        </h1>

                        {/* Etiqueta de token en venta */}
                        <div
                          className={`flex border-l-4 border-${props.theme}-500 py-2 px-2 my-2 bg-gray-50 `}
                        >
                          <span className="text-gray-500">{t("MyNFTs.sale")}</span>
                          <span className="ml-auto text-gray-900">
                            <span
                              className={`inline-flex items-center justify-center px-2 py-1  text-xs font-bold leading-none ${nft.status == "S"
                                ? "text-green-100 bg-green-500"
                                : "text-red-100 bg-red-500"
                                } rounded-full`}
                            >
                              {nft.status == "S" ? t("MyNFTs.available-1") : t("MyNFTs.available-2")}
                            </span>
                          </span>
                        </div>

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
                        <br></br>
                        <h2
                          className={`tracking-widest text-sm title-font font-medium text-${props.theme}-500 mb-1`}
                        >{`Token id: ${nft.tokenID}  `}</h2>
                        <h2
                          className={`tracking-widest text-sm title-font font-medium text-${props.theme}-500 mb-6`}
                        >{`${t("MyNFTs.cost")}: ${nft.price} ${nfts.currency}`}</h2>
                        <div className="text-center">
                          <a
                            href={"/detail/" + nft.tokenID + ":" + nftData.collectionID}
                            className={`mt-12 w-full text-white bg-${props.theme}-500 border-0 py-2 px-4 focus:outline-none hover:bg-${props.theme}-600 rounded text-lg`}
                          >{t("MyNFTs.detail")}</a>
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
                            {nft.status != "S" && <>  <button
                              className={` mt-12 w-full text-white bg-${props.theme}-500 border-0 py-2 px-6 focus:outline-none hover:bg-${props.theme}-600 rounded text-lg`}
                              onClick={() => {
                                setModal({
                                  ...modal,
                                  show: true,
                                  tokenId: nft.tokenID,
                                  contract: nft.contract,
                                  collection: nft.collection,
                                  collectionID: nft.collectionID,
                                  title: t("MyNFTs.titleModal"),
                                  currency: nfts.currency,
                                  blockchain: nfts.blockchain,
                                  message: t("MyNFTs.txtModal"),
                                  buttonName: t("MyNFTs.btnCancel"),
                                  change: setModal,
                                });

                              }}
                            >
                              {t("MyNFTs.putSale")}
                            </button>
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

          <div className="bg-white px-4 py-3 flex items-center justify-center border-t border-gray-200 sm:px-6 mt-1">
            <button className="bg-transparent hover:bg-slate-200 text-slate-500 hover:text-slate-700 font-extrabold text-center items-center rounded-full py-2 px-4 mx-4"
              onClick={() => handleBackPage()}
            >{"<"}</button>
            <p>{page}</p>
            <button className="bg-transparent hover:bg-slate-200 text-slate-500 hover:text-slate-700 font-extrabold text-center items-center rounded-full py-2 px-4 mx-4"
              onClick={() => handleForwardPage()}
            >{">"}</button>
            {/* <Pagination count={nfts.nPages} page={page} onChange={handleChangePage} color="warning" theme="light" /> */}
            {/* <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              {[...Array(nfts?.nPages)].map((page, index) => {
                return (
                  <a
                    href="#"
                    className={`bg-white ${nfts.page == index
                        ? "bg-yellow-100 border-yellow-500 text-yellow-600 hover:bg-yellow-200"
                        : "border-gray-300 text-gray-500 hover:bg-gray-50"
                      }  relative inline-flex items-center px-4 py-2 text-sm font-medium`}
                    key={index}
                    onClick={async () => {
                      window.localStorage.setItem("Mypage", index);
                      window.location.reload();
                    }}
                  >
                    {index + 1}
                  </a>
                );
              })}
            </nav> */}
          </div>
        </div>

        {/* Mandamos a llamar al modal con el state como props*/}
        <ModalSubasta {...modalSub} />
        <Modal {...modal} />
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
