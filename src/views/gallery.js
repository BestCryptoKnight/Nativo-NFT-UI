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
import { inputUnstyledClasses } from "@mui/material";
import verifyImage from '../assets/img/Check.png';

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
  });
  const [esconder, setesconder] = React.useState(true);
  const [counter, setcounter] = React.useState();
  const [load, setload] = React.useState(false);
  const [pagsale, setpagsale] = React.useState(0);
  const [pagCount, setpagCount] = React.useState(0);
  const [chunksale, setchunksale] = React.useState(0);
  const [page, setpage] = React.useState(1);
  const [ini, setini] = React.useState(false);
  const [firstID, setFirstID] = React.useState(-1);
  const [lastID, setLastID] = React.useState(-1);
  const [statePage, setStatePage] = React.useState(true)
  const [firstLoad, setFirstLoad] = React.useState(true)
  const [loadMsg,setLoadMsg] = React.useState(true)
  const [trigger, settrigger] = React.useState(true);
  const [hasData,setHasData] = React.useState(false)
  const [index,setIndex] = React.useState(0)
  const [firstIndex, setFirstIndex] = React.useState(true)
  const [t, i18n] = useTranslation("global")
  let [tokens,setTokens] = React.useState({
    items:[],
    hasMore: true
})
  const [filtro, setfiltro] = React.useState({
    culture: "null",
    country: "null",
    type: "null",
    date: "null",
    price: "null",
  });

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

  var totalTokens=0

  function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
  }

  let fetchMoreData = async () => {
    await delay(.75)
    let limit=true
    let contract = await getNearContract();
    let indexQuery
    let lastLimit
    if(index>Landing.tokensPerPageNear){
      indexQuery = index-Landing.tokensPerPageNear
      setIndex(index-Landing.tokensPerPageNear)
    }
    else{
      indexQuery=0
      lastLimit=parseInt(index)
      limit=false
      setIndex(0)
    }
    if (index<=0) {
      setTokens({...tokens, hasMore: false });
      return;
    }
    let payload = {
      from_index: indexQuery.toString(),
      limit: (limit ? Landing.tokensPerPageNear : lastLimit),
    }
    console.log(payload)
    let toks = await contract.nft_tokens(
      payload,
    )
    setTokens({...tokens,
      items: tokens.items.concat(toks.reverse())
    });
  };

  const modificarFiltro = (v) => {
    setfiltro(c => ({ ...c, ...v }))
  }

  const { data } = useParams();
  
  const { tokenid: owner } = useParams();


  // const getTokens = async () =>{
  //   console.log("entro getTokens")
  //   let contract = await getNearContract();
  //   nft_total_supply = await contract.nft_total_supply()
  //   console.log(nft_total_supply)
  //   if(tokens.length>=nft_total_supply){
  //     //setHasMore(false)
  //     console.log("ya estan todos los tokens")
  //     return
  //   }
  //   let payload = {
  //     from_index: (pagCount*Landing.tokensPerPageNear).toString(),
  //     limit: Landing.tokensPerPageNear,
  //   }
  //   let toks = await contract.nft_tokens(
  //     payload,
  //   )
  //   setpagCount(pagCount+1)
  //   setTokens(tokens.concat(toks))
  //   console.log((tokens.length+toks.length))
    
  // }
  

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
        let nft_total_supply = await contract.nft_total_supply()
        setIndex(nft_total_supply)
        if(nft_total_supply>0){
          setini(true)
          setHasData(true)
          if(nft_total_supply<=Landing.tokensPerPageNear){
            let payload = {
              from_index: (0).toString(),
              limit: parseInt(nft_total_supply),
            }
            setIndex(0)
            let toks = await contract.nft_tokens(
              payload,
            )
            setTokens({...tokens,
              items: tokens.items.concat(toks.reverse())
            });
          }
          else{
            let payload = {
              from_index: (nft_total_supply-Landing.tokensPerPageNear).toString(),
              limit: Landing.tokensPerPageNear,
            }
            setIndex(nft_total_supply-Landing.tokensPerPageNear)
            let toks = await contract.nft_tokens(
              payload,
            )
            setTokens({...tokens,
              items: tokens.items.concat(toks.reverse())
            });
          }
        }
        
        //console.log("Page",Landing.page)
        //obtener tokens a la venta
        // //console.log("Paasdsadfsdfdge",Landing.page*30,"edfew" ,Landing.tokensPerPageNear*(Landing.page+1))
        // let pag = await contract.get_ids_onsale({
        //    tokens: Landing.tokensPerPageNear})
        //  window.localStorage.setItem('pagSale',pag)

        // let payload = {
        //   account : (owner.toString().toLowerCase()+".testnet").toString(),
        //   //from_index: nfts.page, 
        //   //limit: nfts.tokensPerPageNear,
        // };
        // console.log("payload ",payload);
        // toks = await contract.obtener_pagina_by_creator(payload);
        //let info = data.split(":")
        if (statePage) {
          const queryData = `
          query($collectionID: String, $first: Int, $tokenID: Int){
            collections(where: {collectionID: $collectionID}) {
              id
              owner
              title
              tokenCount
              description
              contract
              mediaIcon
              mediaBanner
              saleCount
              saleVolume
              collectionID
            }
            tokens(first: $first, orderBy: tokenId, orderDirection: asc, where: {collectionID: $collectionID , tokenId_gt: $tokenID}) {
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
                collectionID: data,
                first: Landing.tokensPerPageNear,
                tokenID: lastID
              },
            })
            .then((data) => {
              //console.log("collections data: ", data.data.collections)
              //console.log("tokens data: ",data.data.tokens)
              tokData = data.data.tokens
              colData = data.data.collections[0]
              if(data.data.collections.length <= 0){
                setLoadMsg(false)
              }
              setFirstID(parseInt(data.data.tokens[0].tokenId))
              setLastID(parseInt(data.data.tokens[data.data.tokens.length - 1].tokenId))
              setpage(page+1)
            })
            .catch((err) => {
              tokData=0
              //console.log('Error ferching data: ', err)
            })
        }
        else {
          const queryData = `
          query($collectionID: String,$first: Int, $tokenID: Int){
            collections(where: {collectionID: $collectionID}) {
              id
              owner
              title
              tokenCount
              description
              contract
              mediaIcon
              mediaBanner
              saleCount
              saleVolume
              collectionID
            }
            tokens(first: $first, orderBy: tokenId, orderDirection: desc, where: {collectionID: $collectionID , tokenId_lt: $tokenID}) {
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
                collectionID: data,
                first: Landing.tokensPerPageNear,
                tokenID: firstID
              },
            })
            .then((data) => {
              console.log("collections data: ", data.data.collections)
              // console.log("tokens data: ",data.data.tokens)
              tokData = data.data.tokens
              colData = data.data.collections[0]
              setFirstID(parseInt(data.data.tokens[data.data.tokens.length - 1].tokenId))
              setLastID(parseInt(data.data.tokens[0].tokenId))
              setpage(page-1)
            })
            .catch((err) => {
              tokData=0
              //console.log('Error ferching data: ', err)
            })
        }
        if(tokData==0){
          return
        }
        if(firstLoad){
          setpage(1)
          setFirstLoad(false)
        }
        // if (firstLoad) {
        //   setInitID(tokData[0].tokenId)
        //   // console.log("Se añade init ID")
        //   setFirstLoad(false)
        // }
        // setCountTok(countTok + tokData.length)
        // if (countTok + tokData.length == colData.tokenCount) {
        //   setFinalID(tokData[tokData.length - 1].tokenId)
        // }

        // console.log(tokData)

        // var pag = await contract.get_pagination_creator_filters({
        //   account : (owner.toString().toLowerCase()).toString(),
        //   tokens: Landing.tokensPerPageNear,
        //   //_start_index: Landing.page,
        //   _start_index: pagsale,
        //   _minprice: 0,
        //   _maxprice: 0,
        //   _mindate: 0,
        //   _maxdate: 0,
        // })
        // let pagi= pag.toString()
        // setpagCount(pagi)
        // console.log(pagi)
        // console.log(pagCount)
        // window.localStorage.setItem("pagPerf",parseInt(pagi.split(",")[0].split("-")[1]))
        // window.localStorage.setItem("pagCPerf",parseInt(pagi.split(",")[0].split("-")[0]))
        // console.log(chunksale)
        // console.log(pagsale)
        // console.log(page)
        // toks = await contract.obtener_pagina_creator({
        //   account : (owner.toString().toLowerCase()).toString(),
        //   chunk: (ini ? parseInt(window.localStorage.getItem("pagCPerf")): chunksale),
        //   tokens: Landing.tokensPerPageNear,
        //   //_start_index: Landing.page,
        //   _start_index: (ini ? parseInt(window.localStorage.getItem("pagPerf")): pagsale),
        //   _minprice: 0,
        //   _maxprice: 0,
        //   _mindate: 0,
        //   _maxdate: 0,
        // });
        // console.log("toks ",toks);
        // let pagNumArr = pag
        // //obtener cuantos tokens estan a la venta
        // if(ini){
        //   window.localStorage.removeItem("pagCPerf")
        //   window.localStorage.removeItem("pagPPerf")
        //   setini(!ini)
        // }

        //convertir los datos al formato esperado por la vista
        let tok = tokData.map((tok) => {
          return {
            title: tok.title,
            tokenId: tok.tokenId,
            media: tok.media,
            price: tok.price,
            owner: tok.owner_id
          };
        });
        //console.log(tok)
        if (!statePage) {
          tok = tok.reverse()
        }
        //console.log("toks",toks);
        //console.log("onsale",onSaleToks);
        //console.log(Math.ceil(onSaleToks /Landing.tokensPerPageNear))
        let numpage = parseInt(colData.tokenCount / Landing.tokensPerPageNear)
        if (colData.tokenCount % Landing.tokensPerPageNear > 0) {
          numpage++
        }
        await setLanding({
          ...Landing,
          tokens: tok,
          nPages: numpage,
          titleCol: colData.title,
          ownerCol: colData.owner,
          mediaCol: colData.mediaIcon,
          bannerCol: colData.mediaBanner,
          descriptionCol: colData.description,
          contract: colData.contract,
          tokenCount: colData.tokenCount,
          saleCount: colData.saleCount,
          saleVolume: fromYoctoToNear(colData.saleVolume),
          colID: colData.collectionID
        });
      }

    })();
  }, [trigger]);

  return (
    <section className={"text-gray-600 body-font "+(ini&&hasData ? "" : "py-64 dark:bg-darkgray")}>
      
      {/* <div className="bg-white px-4 py-3 flex items-center justify-center border-b border-gray-200 sm:px-6 mt-1">
        <button className="bg-transparent hover:bg-slate-200 text-slate-500 hover:text-slate-700 font-extrabold text-center items-center rounded-full py-2 px-4 mx-4"
          onClick={() => handleBackPage()}
        >{"<"}</button>
        <p>{page}</p>
        <button className="bg-transparent hover:bg-slate-200 text-slate-500 hover:text-slate-700 font-extrabold text-center items-center rounded-full py-2 px-4 mx-4"
          onClick={() => handleForwardPage()}
        >{">"}</button>
      </div> */}
      {/* <div className={"container px-5 mx-auto flex flex-wrap items-center "+(
        esconder? "" : "py-2"
      )}>
        <div className="fs-1 flex items-center" onClick={e=>{
            setesconder(v=> !v);
          }}>
          <img src={filtroimg} className="logg mr-1"/>
          <b>Filtro</b>
        </div>
      </div>
      <div className={"container py-5 px-5  mx-auto flex flex-wrap items-center "+(
        esconder ? "" : "esconder"
      )} >
        <b>Tipo: </b>
      <select className="ml-2 p-2 lg:w-2/12 bg-s1 ">
          <option >
            Todos los tokens
          </option>
          <option >
            Tokens en venta
          </option>
          <option >
            Tokens en subasta
          </option>
        </select>
        <b className="ml-2" >Fecha:</b>
        <select className="p-2 lg:w-2/12 ml-2 bg-s1">
          <option >
            Todos los tokens
          </option>
          <option >
            Nuevos tokens
          </option>
          <option >
            Tokens Antiguos
          </option>
        </select>
        <b className="ml-2" >Precio:</b>
        <select className="p-2 lg:w-2/12 ml-2 bg-s1">
          <option >
            Todos los tokens
          </option>
          <option >
            Asendente
          </option>
          <option >
            Desendente
          </option>
        </select>
        <b className="ml-2" >País:</b>
        <select className="p-2 lg:w-2/12 ml-2 bg-s1" onChange={e=>{
            modificarFiltro({country: (e.target.value == "Todos los tokens" ? "null" : e.target.value)});
          }}>
          <option >
            Todos los tokens
          </option>
          {
            countrys.map(c=>(
              <option >
                {c}
              </option>
            ))
          }
        </select>
      </div> */}
      <div className={"pt-3 mx-auto dark:bg-darkgray" }>

     

          {/* 
          {
            load ?
            <img src={loading} style={{width:"50px"}}/>
            : */}
            {hasData ? 
            <div>
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
                  return(
                    <div className="w-full md:w-1/2 lg:w-1/3 p-4 " key={index}>
                      <a
                        href={"/detail/" + i.token_id}
                      >
                        <div className="flex flex-row  mb-10 md:mb-0  justify-center " >
                          <div className="trending-token w-64 md:w-80 rounded-20 hover:shadow-yellow1   hover:scale-105 ">
                            <div className=" bg-white rounded-20">
                              <div className="w-full p-6 pb-0 flex relative ">
                                <div className="w-[40px] h-[40px]  bg-circle rounded-full bg-pink-2 relative">
                                  <img className="w-[25px] h-[25px]  bg-transparent rounded-full top-0 -right-3 absolute" src={verifyImage}></img>
                                </div>
                                <div className="font-raleway font-bold text-black text-sm flex items-center ml-3 text-ellipsis overflow-hidden">
                                  {i.owner_id}
                                </div>

                              </div>
                              <div className="p-6 pt-3 pb-3">
                                <img
                                  className="object-cover object-center rounded-xlarge h-48 md:h-72 w-full "
                                  src={`https://ipfs.fleek.co/ipfs/${i.metadata.media}`}

                                  alt={i.description}
                                />
                              </div>
                              <div className="p-6 pt-3">

                                <div className="capitalize text-black text-sm  text-ellipsis overflow-hidden whitespace-nowrap  font-raleway font-bold">{i.metadata.title}</div>
                                <div className="flex justify-between">
                                  <div className="text-black text-sm font-raleway font-normal w-1/2">token id: {i.token_id}</div>



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
            </div> 
            :
            <div className="container mx-auto flex  my- md:flex-row flex-col text-yellow2 justify-center h-96 items-center text-4xl font-bold">
              <div className="flex flex-col justify-center">
                <h1 className="text-center">{t("tokCollection.noData")}</h1>
              </div>
            </div>
            }
            
          
          {/* {
            Landing.tokens.length > 0 ?
            
              Landing.tokens.map((element, key) => {
                //a nuestro datos le aplicamos al funcion stringify por lo cual necesitamos pasarlo
                //const tokenData = JSON.parse(token.data);
                return (
                  <div className="w-full md:w-1/2 lg:w-1/3 p-4" key={key}>
                    <a
                      href={"/detail/" + element.tokenId + ":" + Landing.colID}
                    >
                      <div className="c-card
                                      block
                                      bg-white
                                      shadow-md
                                      hover:shadow-xl
                                      rounded-lg
                                      overflow-hidden">
                        <img
                          alt="ecommerce"
                          className="lg:h-60
                            xl:h-56
                            md:h-64
                            sm:h-72
                            xs:h-72
                            h-72
                            rounded
                            w-full
                            object-cover object-center
                            mb-4"
                          src={`https://ipfs.fleek.co/ipfs/${element.media}`}
                        />



                        <div className="p-4">
                          <h2 className="text-lg text-gray-900
                                        font-medium
                                        title-font
                                        mb-4
                                        whitespace-nowrap
                                        truncate
                                        ...">
                            {element.title}
                          </h2>
                          <div className="py-4 border-t border-b text-xs text-gray-700">
                            <div className="grid grid-cols-6 gap-1">


                              <div className="col-span-2">
                                Token ID:
                                <span
                                  className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-[#fbbf24] rounded-full"
                                >{element.tokenId}</span>
                              </div>

                              <div className="col-span-4 flex mx-auto">
                                <span
                                  className="inline-flex items-center justify-center px-2 py-1 text-lg font-bold leading-none text-white bg-[#fbbf24] rounded-full"
                                >                            {Landing.blockchain != 0 &&
                                  fromYoctoToNear(element.price) + " " + Landing.currency}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center mt-2">
                                <div className="pl-3">
                                  <div className="font-medium">{element.owner}  </div>
                                  <div className="text-gray-600 text-sm">{t("tokCollection.owner")}</div>
                                </div>
                              </div>
                        </div>
                      </div>
                    </a>
                  </div>
                );
              })
              :
              <div className="container mx-auto flex  my- md:flex-row flex-col  justify-center h-96 items-center text-3xl">
                <div className="flex flex-col justify-center">
                  <h1 className="text-center">{loadMsg ? t("tokCollection.load-1") : t("tokCollection.load-2")}</h1>
                </div>
              </div>
          } */}
        </div>
        {/* <div className={"dark:bg-darkgray flex items-center justify-center mt-16"+(ini&&hasData ? "" : "hidden")}> */}
          {/* <Pagination count={Landing.nPages} page={page} onChange={handleChangePage} color="warning" theme="light" /> */}
          {/* <button className="bg-transparent hover:bg-slate-200 text-slate-500 hover:text-slate-700 font-extrabold text-center items-center rounded-full py-2 px-4 mx-4"
          onClick={() => handleBackPage()}
          >{"<"}</button>
          <p>{page}</p>
          <button className="bg-transparent hover:bg-slate-200 text-slate-500 hover:text-slate-700 font-extrabold text-center items-center rounded-full py-2 px-4 mx-4"
            onClick={() => handleForwardPage()}
          >{">"}</button> */}
          {/* <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          > 
            {Landing?.page != 0 && (
              <a
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md  border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            )}
            {[...Array(Landing?.nPages)].map((page, index) => {
              return (
                <a
                  
                  className={`bg-white ${
                    Landing.page == index
                      ? "bg-yellow-100 border-yellow-500 text-yellow-600 hover:bg-yellow-200"
                      : "border-gray-300 text-gray-500 hover:bg-gray-50"
                  }  relative inline-flex items-center px-4 py-2 text-sm font-medium`}
                  key={index}
                  onClick={async () => {
                  //  await getPage(index);
                    if(index == 0){
                      window.localStorage.setItem("page",0)
                    }
                    else{
                      window.localStorage.setItem("page",parseInt(Landing.pag.split(",")[index])+1);  
                    }
                    setcounter(Landing.tokens[Landing.tokens.length-1].tokenID +1)

                    window.location.reload();
                  }}
                >
                  {index + 1}
                </a>
              );
            })}
          </nav> */}
        {/* </div> */}
    </section>
  );
}

export default LightEcommerceA;
