import React from "react";
import {
  fromWEItoEth,
  getContract,
  getSelectedAccount,
  syncNets,
} from "../utils/blockchain_interaction";
import { currencys } from "../utils/constraint";
import { getNearContract, fromYoctoToNear, getNearAccount } from "../utils/near_interaction";
import { useParams, useHistory } from "react-router-dom";

import filtroimg from '../assets/landingSlider/img/filtro.png'
import countrys from '../utils/countrysList'
import loading from '../assets/landingSlider/img/loader.gif'
import Pagination from '@mui/material/Pagination';
import { Account } from "near-api-js";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import verifyImage from '../assets/img/Check.png';
import { textAlign } from "@mui/system";

function LightEcommerceA() {
  const [Landing, setLanding] = React.useState({
    theme: "yellow",
    currency: currencys[parseInt(localStorage.getItem("blockchain"))],
    tokens: [],
    page: parseInt(window.localStorage.getItem("page")),
    pag: window.localStorage.getItem("pagSale"),
    blockchain: localStorage.getItem("blockchain"),
    tokensPerPage: 10,
    tokensPerPageNear: 15,
    titleCol: "",
    descriptionCol: ""
  });
  const [esconder, setesconder] = React.useState(true);
  const [counter, setcounter] = React.useState();
  const [load, setload] = React.useState(false);
  const [pagsale, setpagsale] = React.useState(0);
  const [pagCount, setpagCount] = React.useState("");
  const [chunksale, setchunksale] = React.useState(0);
  const [page, setpage] = React.useState(1);
  const [ini, setini] = React.useState(true);
  const [firstID, setFirstID] = React.useState(-1);
  const [lastID, setLastID] = React.useState(-1);
  const [statePage, setStatePage] = React.useState(true)
  const [firstLoad, setFirstLoad] = React.useState(true)
  const [loadMsg, setLoadMsg] = React.useState(true)
  const [trigger, settrigger] = React.useState(true);
  const [t, i18n] = useTranslation("global")
  const [hasTok, setHasTok] = React.useState(true)
  const [filtro, setfiltro] = React.useState({
    culture: "null",
    country: "null",
    type: "null",
    date: "null",
    price: "null",
  });
  let [tokens, setTokens] = React.useState({
    items: [],
    hasMore: true
  });
  const [showMoreTitle,setShowMoreTitle] = React.useState(false);
  const [showMoreDescription,setShowMoreDescription] = React.useState(false);

  const APIURL = process.env.REACT_APP_API_TG

  const handleChangePage = (e, value) => {
    //console.log(value)
    setpage(value)
    window.scroll(0, 0)
    settrigger(!trigger)
  }

  const handleBackPage = () => {
    // console.log("Back")
    window.scroll(0, 0)
    setStatePage(false)
    settrigger(!trigger)
  }

  const handleForwardPage = () => {
    // console.log("Forward")
    window.scroll(0, 0)
    setStatePage(true)
    settrigger(!trigger)
  }

  const modificarFiltro = (v) => {
    setfiltro(c => ({ ...c, ...v }))
  }

  const { data } = useParams();


  const { tokenid: owner } = useParams();
  React.useEffect(() => {
    // console.log("esto ---> ",owner);
    let tokData
    let colData
    setload(c => true);
    (async () => {
      let toks, onSaleToks;
      let arr = [];

      if (Landing.blockchain == "0") {
        //primero nos aseguramos de que la red de nuestro combo sea igual a la que esta en metamask
        await syncNets();
        //obtener cuantos tokens tiene el contrato
        let totalSupply = await getContract().methods.totalSupply().call();
        //obtener el numero de tokens a la venta
        onSaleToks = await getContract().methods.nTokenOnSale.call().call();

        //indices del arreglo para la paginacion :::0*10=0 1*10=10  1*10=10 2*10=20
        for (let i = Landing.page * 10; i < (parseInt(Landing.page) + 1) * Landing.tokensPerPage; i++) {
          //console.log("ini",Landing.page*10,"actual",i,"fin",(parseInt(Landing.page)+1)*Landing.tokensPerPage)
          //obtiene la informacion de x token
          let infoe = await getContract().methods.getItemInfo(i).call();
          //Valida si está a la venta
          if (infoe[0].onSale) {
            //agrega el token al arreglo para mostrar
            arr.push(infoe[0]);
          }

          //Concadena el token encontrado con los tokens que ya se mostraron
          setLanding({
            ...Landing,
            tokens: arr,
            nPages: Math.ceil(arr.length / Landing.tokensPerPage),
          });

        }


      } else {
        window.contr = await getNearContract();

        //instanciar contracto
        let contract = await getNearContract();
        let account = await getNearAccount();
        const queryData = `
          query($collectionID: String, $first: Int, $tokenID: Int){
            collections(where: {collectionID: $collectionID}) {
              id
              owner_id
              title
              tokenCount
              description
              mediaIcon
              mediaBanner
              salesCount
              saleVolume
              collectionID
              timestamp
            }
            tokens(first: $first, orderBy: tokenId, orderDirection: desc, where: {collectionID: $collectionID}) {
              id
              collectionID
              contract
              tokenId
              owner_id
              title
              description
              media
              creator
              price
              onSale
              approvalID
              extra
              timestamp
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
              collectionID: data,
              first: Landing.tokensPerPageNear,
            },
          })
          .then((data) => {
            console.log("collections data: ", data.data.collections)
            console.log("tokens data: ", data.data.tokens)
            if (data.data.tokens.length <= 0) {
              setHasTok(false)
            }
            else {
              setTokens({
                ...tokens,
                items: tokens.items.concat(data.data.tokens)
              });
              setLastID(parseInt(data.data.tokens[data.data.tokens.length - 1].tokenId))
            }
            colData = data.data.collections[0]
          })
          .catch((err) => {
            tokData = 0
            console.log('Error ferching data: ', err)
          })

        //convertir los datos al formato esperado por la vista
        await setLanding({
          ...Landing,
          titleCol: colData.title,
          ownerCol: colData.owner_id,
          mediaCol: colData.mediaIcon,
          bannerCol: colData.mediaBanner,
          descriptionCol: colData.description,
          tokenCount: colData.tokenCount,
          saleCount: colData.salesCount,
          saleVolume: fromYoctoToNear(colData.saleVolume),
          colID: colData.collectionID
        });
      }

    })();
  }, []);

  function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
  }

  let fetchMoreData = async () => {
    await delay(.75)
    if (tokens.items.length >= Landing.tokenCount) {
      setTokens({ ...tokens, hasMore: false })
      return
    }
    const queryData = `
      query($collectionID: String, $first: Int, $tokenID: Int){
        tokens(first: $first, orderBy: tokenId, orderDirection: desc, where: {collectionID: $collectionID, tokenId_lt:$tokenID}) {
          id
          collectionID
          contract
          tokenId
          owner_id
          title
          description
          media
          creator
          price
          onSale
          approvalID
          extra
          timestamp
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
          collectionID: data,
          first: Landing.tokensPerPageNear,
          tokenID: lastID
        },
      })
      .then((data) => {
        console.log("tokens data: ", data.data.tokens)
        setTokens({
          ...tokens,
          items: tokens.items.concat(data.data.tokens)
        });
        setLastID(parseInt(data.data.tokens[data.data.tokens.length - 1].tokenId))
      })
      .catch((err) => {
        console.log('Error ferching data: ', err)
      })
  };

  return (
    <section className="text-gray-600 body-font bg-darkgray">
      <div className={`flex flex-row  mb-10 md:mb-0  justify-center `}>
        <div className="trending-token w-full p-5 rounded-20  ">
          <div className=" bg-white rounded-20 ">
            <div className="p-6 pt-3 pb-3">
              <img
                className="object-cover object-center rounded-xlarge h-[8rem] md:h-48  w-full bg-center"
                src={`https://nativonft.mypinata.cloud/ipfs/${Landing.bannerCol}`}
              />
            </div>
            <div className="z-10 -mt-120 w-full text-white font-raleway">

              <div className="bg-white lg:mx-20 mx-5 text-black mt-4 pt-2 md:mt-0 md:pt-0 pb-3 rounded-t-2xl bg-opacity-80">
                <div className="flex flex-col md:flex-row">
                  <div className="w-[120px] md:w-[200px] h-[120px] md:h-[200px]  bg-circle bg-center rounded-full border-4 border-white relative bg-cover mx-auto md:mx-0  -mt-[95px] md:-mt-[45px]" style={{ backgroundImage: `url(https://nativonft.mypinata.cloud/ipfs/${Landing.mediaCol})` }} />
                  
                  <div className="px-2 mx-auto w-full md:w-3/4">
                    {Landing.titleCol.length > 130 ?
                      <h1 className="text-sm md:text-xl font-bold pb-4 opacity-100 text-darkgray break-words break-all">{showMoreTitle ? Landing.titleCol : `${Landing.titleCol.substring(0, 130)}`} <button className="btn font-raleway text-xs font-bold text-blue2" onClick={() => setShowMoreTitle(!showMoreTitle)}>
                        {showMoreTitle ? `${t("tokCollection.seeLess")}` : `${t("tokCollection.seeMore")}`}</button></h1>
                      :
                      <h1 className="text-sm md:text-xl font-bold pb-4 opacity-100 stext-darkgray break-words break-all">{Landing.titleCol}</h1>
                    }
                    {Landing.descriptionCol.length > 150 ?
                      <p className="text-xs md:text-lg  pb-3 text-darkgray break-words">{showMoreDescription ? Landing.descriptionCol : `${Landing.descriptionCol.substring(0, 150)}`} <button className="btn font-raleway text-xs font-bold text-blue2" onClick={() => setShowMoreDescription(!showMoreDescription)}>
                        {showMoreDescription ? `${t("tokCollection.seeLess")}` : `${t("tokCollection.seeMore")}`}</button></p>
                      :
                      <p className="text-xs md:text-lg  pb-3 text-darkgray break-words">{Landing.descriptionCol == "" ? t("tokCollection.descrip") : Landing.descriptionCol}</p>
                    }
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 divide-x gap-1 bg-yellow-400 rounded-b-2xl text-darkgray lg:mx-20  mx-auto text-center bg-white bg-opacity-80">
                  <div className="flex flex-col justify-center">
                    <p className="lg:text-lg text-sm pb-1 text-darkgray"><b>{t("tokCollection.noTokens")}</b></p>
                    <p className="lg:text-base text-xs pb-1 text-darkgray">{Landing.tokenCount}</p>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="lg:text-lg text-sm pb-1 text-darkgray"><b>{t("tokCollection.collectionID")}</b></p>
                    <p className="lg:text-base text-xs pb-1 text-darkgray">{Landing.colID}</p>
                  </div>
                  <div className="flex flex-col justify-center col-span-2 md:col-span-1">
                    <p className="lg:text-lg text-sm pb-1 text-darkgray"><b>{t("tokCollection.creator")}</b></p>
                    <a href={`../profile/${Landing.ownerCol}`} className="lg:text-base text-xs pb-1 font-bold text-blue2 break-words">{Landing.ownerCol}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="pt-3 mx-auto">

        <div>
          {hasTok ?
            <InfiniteScroll
              dataLength={tokens.items.length}
              next={fetchMoreData}
              hasMore={tokens.hasMore}
              loader={<h1 className="text-center w-full py-10 text-xl font-bold text-yellow2">{t("tokCollection.loading")}</h1>}
              endMessage={
                <p className="text-center w-full py-10 text-xl text-yellow2">
                  <b>{t("tokCollection.end")}</b>
                </p>
              }
              className={"flex flex-wrap px-[40px]"}
            >
              {tokens.items.map((i, index) => {
                return (
                  <div className="w-full md:w-1/2 lg:w-1/3 p-4 " key={index}>
                    <a
                      href={"/detail/" + i.tokenId}
                    >
                      <div className="flex flex-row  mb-10 md:mb-0  justify-center " >
                        <div className="trending-token w-64 md:w-80 rounded-20 hover:shadow-yellow1   hover:scale-105 ">
                          <div className=" bg-white rounded-20">
                            <div className="w-full p-6 pb-0 flex relative ">
                              <div className="w-[40px] h-[40px]  bg-circle rounded-full bg-pink-2 relative">
                                <img className="w-[25px] h-[25px]  bg-transparent rounded-full top-0 -right-3 absolute" src={verifyImage}></img>
                              </div>
                              <div className="font-raleway font-bold text-black text-sm flex items-center ml-3">
                                {i.owner_id}
                              </div>

                            </div>
                            <div className="p-6 pt-3 pb-3">
                              <img
                                className="object-cover object-center rounded-xlarge h-48 md:h-72 w-full "
                                src={`https://nativonft.mypinata.cloud/ipfs/${i.media}`}

                                alt={i.description}
                              />
                            </div>
                            <div className="p-6 pt-3">

                              <div className="capitalize text-black text-sm  text-ellipsis overflow-hidden whitespace-nowrap  font-raleway font-bold">{i.title}</div>
                              <div className="flex justify-between">
                                <div className="text-black text-sm font-raleway font-normal w-1/2">token id: {i.tokenId}</div>



                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                )
              })}
            </InfiniteScroll>
            :
            <div className="text-yellow2 text-2xl w-full text-center mt-6 font-bold">
              <p>{t("tokCollection.hasTok")}</p>
            </div>
          }

        </div>
      </div>
    </section>
  );
}

export default LightEcommerceA;
