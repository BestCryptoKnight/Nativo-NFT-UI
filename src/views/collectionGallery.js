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

function LightEcommerceA() {
  const [Landing, setLanding] = React.useState({
    theme: "yellow",
    currency: currencys[parseInt(localStorage.getItem("blockchain"))],
    tokens: [],
    page: parseInt(window.localStorage.getItem("page")),
    pag: window.localStorage.getItem("pagSale"),
    blockchain: localStorage.getItem("blockchain"),
    tokensPerPage: 10,
    tokensPerPageNear: 9,
  });
  const [t, i18n] = useTranslation("global")
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
  const [loadMsg,setLoadMsg] = React.useState(true)
  const [trigger, settrigger] = React.useState(true);
  const [filtro, setfiltro] = React.useState({
    culture: "null",
    country: "null",
    type: "null",
    date: "null",
    price: "null",
  });

  const APIURL = process.env.REACT_APP_API_TG

  const handleChangePage = (e, value) => {
    // console.log(value)
    setpage(value)
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

  const modificarFiltro = (v) => {
    setfiltro(c => ({ ...c, ...v }))
  }

  var colData
  const { tokenid: owner } = useParams();
  React.useEffect(() => {
    // console.log("esto ---> ",owner);

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
        if (statePage) {
          const queryData = `
          query($first: Int, $collectionID: Int){
            collections (first: $first, orderBy: collectionID, orderDirection: asc, where: {tokenCount_gt: 0,collectionID_gt: $collectionID}) {
              id
              owner
              title
              tokenCount
              description
              contract
              mediaIcon
              saleCount
              saleVolume
              collectionID
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
                first: Landing.tokensPerPageNear,
                collectionID: lastID
              },
            })
            .then((data) => {
              console.log("collections data: ",data.data.collections)
              //console.log("tokens data: ", data.data.tokens)
              colData = data.data.collections
              console.log(data.data.collections)
              if(data.data.collections.length <= 0){
                setLoadMsg(false)
              }
              setFirstID(parseInt(data.data.collections[0].collectionID))
              setLastID(parseInt(data.data.collections[data.data.collections.length - 1].collectionID))
              setpage(page+1)
              // colData = data.data.collections[0]
            })
            .catch((err) => {
              //console.log('Error ferching data: ', err)
              colData = 0
            })
        }
        else {
          const queryData = `
          query($first: Int, $collectionID: Int){
            collections (first: $first, orderBy: collectionID, orderDirection: desc, where: {tokenCount_gt: 0,collectionID_lt: $collectionID}) {
              id
              owner
              title
              tokenCount
              description
              contract
              mediaIcon
              saleCount
              saleVolume
              collectionID
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
                first: Landing.tokensPerPageNear,
                collectionID: firstID
              },
            })
            .then((data) => {
              // console.log("collections data: ",data.data.collections)
              colData = data.data.collections
              setFirstID(parseInt(data.data.collections[data.data.collections.length - 1].collectionID))
              setLastID(parseInt(data.data.collections[0].collectionID))
              setpage(page-1)
              // colData = data.data.collections[0]
            })
            .catch((err) => {
              //console.log('Error ferching data: ', err)
              colData = 0
            })
        }
        if (colData == 0) {
          return
        }
        if(firstLoad){
          setpage(1)
          setFirstLoad(false)
        }
        // console.log(colData)

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
        //console.log(collectionCount)
        let col = colData.map((collection) => {
          return {
            title: collection.title,
            owner: collection.owner,
            tokenCount: collection.tokenCount,
            description: collection.description,
            contract: collection.contract,
            media: collection.mediaIcon,
            saleCount: collection.saleCount,
            saleVolume: fromYoctoToNear(collection.saleVolume),
            collectionID: collection.collectionID
          };
        });

        if (!statePage) {
          col = col.reverse()
        }
        //console.log(col)

        //console.log("toks",toks);
        //console.log("onsale",onSaleToks);
        //console.log(Math.ceil(onSaleToks /Landing.tokensPerPageNear))
        // let numpage = parseInt(collectionCount / Landing.tokensPerPageNear)
        // if (collectionCount % Landing.tokensPerPageNear > 0) {
        //   numpage++
        // }
        await setLanding({
          ...Landing,
          tokens: col,
          nPages: 0,
        });
      }

    })();
  }, [trigger]);

  return (
    <section className="text-gray-600 body-font bg-[#f3f4f6]">

      <div className="bg-white px-4 py-3 flex items-center justify-center border-b border-gray-200 sm:px-6 mt-1">
        <button className="bg-transparent hover:bg-slate-200 text-slate-500 hover:text-slate-700 font-extrabold text-center items-center rounded-full py-2 px-4 mx-4"
          onClick={() => handleBackPage()}
        >{"<"}</button>
        <p>{page}</p>
        <button className="bg-transparent hover:bg-slate-200 text-slate-500 hover:text-slate-700 font-extrabold text-center items-center rounded-full py-2 px-4 mx-4"
          onClick={() => handleForwardPage()}
        >{">"}</button>
        {/* <Pagination count={Landing.nPages} page={page} onChange={handleChangePage} color="warning" theme="light"/> */}
      </div>
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
      <div className="container px-5 py-3 mx-auto ">

        {/* Arroja un mensaje si no hay tokens disponibles en venta*/}

        <div className={"flex flex-wrap" + (load ? " justify-center" : "")}>

          {/* 
          {
            load ?
            <img src={loading} style={{width:"50px"}}/>
            : */}
          {
            Landing.tokens.length > 0 ?
              Landing.tokens.map((element, key) => {
                //a nuestro datos le aplicamos al funcion stringify por lo cual necesitamos pasarlo
                //const tokenData = JSON.parse(token.data);
                return (
                  <div className="w-full md:w-1/2 xl:w-1/3 p-4" key={key}>
                    <a href={"/collection/" + element.collectionID}>
                      <div className="c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden">
                          <img
                            alt="Icono de la coleccion"
                            className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-4"
                            src={`https://ipfs.io/ipfs/${element.media}`}
                          />
                        <div className="p-4">
                          <h3 className="tracking-widest text-[#fa9301] text-xs font-medium title-font whitespace-nowrap truncate ...">
                            {element.title}
                          </h3>
                          <h2 className="text-lg text-gray-900 font-medium title-font mb-4 whitespace-nowrap truncate ...">
                            {element.description == "" ? t("Collections.descrip") : element.description}
                          </h2>
                          <p className="text-gray-600 font-light text-md whitespace-nowrap truncate ...">
                          </p>
                          <div>
                            {/* {Landing.blockchain==0 &&
                            fromWEItoEth(token.price) + " " + Landing.currency}

                        {Landing.blockchain!=0 &&
                              fromYoctoToNear(token.price) + " " + Landing.currency} */}
                            <div class="py-4 border-t border-b text-xs text-gray-700">
                              <div class="grid grid-cols-6 gap-1">
                                <div class="col-span-4">
                                  {t("Collections.contract")}
                                  <span
                                    class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-[#fbbf24] rounded-full
                                  "
                                  >{element.contract}</span>
                                </div>

                                <div class="col-span-2">
                                  {t("Collections.noTokens")}
                                  <span
                                    class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-[#fbbf24] rounded-full"
                                  >{element.tokenCount}</span>
                                </div>
                                <div class="col-span-4">
                                  {t("Collections.volSale")}
                                  <span
                                    class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-[#fbbf24] rounded-full"
                                  >{element.saleVolume} NEAR</span>
                                </div>
                                <div class="col-span-2">
                                  {t("Collections.noSale")}
                                  <span
                                    class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-[#fbbf24] rounded-full"
                                  >{element.saleCount}</span>
                                </div>
                              </div>
                            </div>
                            <div class="flex flex-end items-center mt-2">
                              <div class="pl-3">
                                <div class="font-medium">{element.owner}</div>
                                <div class="text-gray-600 text-sm">{t("Collections.creator")}</div>
                              </div>
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
                  <h1 className="text-center">{loadMsg ? t("Collections.load-1") : t("Collections.load-2")}</h1>
                </div>
              </div>
          }
        </div>
      </div>
      <div className="bg-white px-4 py-3 flex items-center justify-center border-t border-gray-200 sm:px-6 mt-16">
          <button className="bg-transparent hover:bg-slate-200 text-slate-500 hover:text-slate-700 font-extrabold text-center items-center rounded-full py-2 px-4 mx-4"
            onClick={() => handleBackPage()}
          >{"<"}</button>
          <p>{page}</p>
          <button className="bg-transparent hover:bg-slate-200 text-slate-500 hover:text-slate-700 font-extrabold text-center items-center rounded-full py-2 px-4 mx-4"
            onClick={() => handleForwardPage()}
          >{">"}</button>
          {/* <Pagination count={Landing.nPages} page={page} onChange={handleChangePage} color="warning" theme="light" /> */}
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
        </div>
    </section>
  );
}

export default LightEcommerceA;
