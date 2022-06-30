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


function LightEcommerceA() {
  const [Landing, setLanding] = React.useState({
    theme: "yellow",
    currency: currencys[parseInt(localStorage.getItem("blockchain"))],
    tokens: [],
    page: parseInt( window.localStorage.getItem("page")),
    pag: window.localStorage.getItem("pagSale"),
    blockchain: localStorage.getItem("blockchain"),
    tokensPerPage: 10,
    tokensPerPageNear: 24,
  });
  const [esconder, setesconder] = React.useState(true);
  const [counter, setcounter] = React.useState();
  const [load, setload] = React.useState(true);
  const [pagsale, setpagsale] = React.useState(0);
  const [pagCount, setpagCount] = React.useState("");
  const [chunksale, setchunksale] = React.useState(0);
  const [page, setpage] = React.useState(1);
  const [ini, setini] = React.useState(true);
  const [trigger, settrigger] = React.useState(true);
  const [filtro, setfiltro] = React.useState({
    culture: "null",
    country: "null",
    type: "null",
    date: "null",
    price: "null",
  });

  const handleChangePage = (e, value) => {
    console.log(value)
    setpage(value)
    setpagsale(parseInt(pagCount.split(",")[value-1].split("-")[1]))
    setchunksale(parseInt(pagCount.split(",")[value-1].split("-")[0]))
    window.scroll(0, 0)
    settrigger(!trigger)
  }

  const modificarFiltro = (v) => {
    setfiltro(c=>({...c, ...v}))
  }

   
  const { tokenid:owner } = useParams();
  React.useEffect(() => {
  // console.log("esto ---> ",owner);
  
    setload(c => true);
    (async () => {
      let toks, onSaleToks;
      let arr=[];
      
      if (Landing.blockchain == "0") {
        //primero nos aseguramos de que la red de nuestro combo sea igual a la que esta en metamask
          await syncNets();
          //obtener cuantos tokens tiene el contrato
          let totalSupply = await getContract().methods.totalSupply().call();
          //obtener el numero de tokens a la venta
          onSaleToks = await getContract().methods.nTokenOnSale.call().call();

            //indices del arreglo para la paginacion :::0*10=0 1*10=10  1*10=10 2*10=20
          for(let i =Landing.page*10; i<(parseInt(Landing.page)+1)*Landing.tokensPerPage ; i++) {
            //console.log("ini",Landing.page*10,"actual",i,"fin",(parseInt(Landing.page)+1)*Landing.tokensPerPage)
            //obtiene la informacion de x token
            let infoe  = await getContract().methods.getItemInfo(i).call();
            //Valida si está a la venta
             if(infoe[0].onSale){
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
        var pag = await contract.get_pagination_creator_filters({
          account : (owner.toString().toLowerCase()).toString(),
          tokens: Landing.tokensPerPageNear,
          //_start_index: Landing.page,
          _start_index: pagsale,
          _minprice: 0,
          _maxprice: 0,
          _mindate: 0,
          _maxdate: 0,
        })
        let pagi= pag.toString()
        setpagCount(pagi)
        console.log(pagi)
        console.log(pagCount)
        window.localStorage.setItem("pagPerf",parseInt(pagi.split(",")[0].split("-")[1]))
        window.localStorage.setItem("pagCPerf",parseInt(pagi.split(",")[0].split("-")[0]))
        console.log(chunksale)
        console.log(pagsale)
        console.log(page)
        toks = await contract.obtener_pagina_creator({
          account : (owner.toString().toLowerCase()).toString(),
          chunk: (ini ? parseInt(window.localStorage.getItem("pagCPerf")): chunksale),
          tokens: Landing.tokensPerPageNear,
          //_start_index: Landing.page,
          _start_index: (ini ? parseInt(window.localStorage.getItem("pagPerf")): pagsale),
          _minprice: 0,
          _maxprice: 0,
          _mindate: 0,
          _maxdate: 0,
        });
        console.log("toks ",toks);
        let pagNumArr = pag
        //obtener cuantos tokens estan a la venta
        if(ini){
          window.localStorage.removeItem("pagCPerf")
          window.localStorage.removeItem("pagPPerf")
          setini(!ini)
        }

        //convertir los datos al formato esperado por la vista
        toks = toks.map((tok) => {
          return {
            tokenID: tok.token_id,
            ownerId: tok.owner_id,
            price: tok.price,
            data: JSON.stringify({
              title: tok.title,
              image: tok.media,
              on_sale: tok.on_sale, // sale status
              on_auction: tok.on_auction, //auction status
              highestbidder: tok.highestbidder,
            }),
          };
        });

        //console.log("toks",toks);
        //console.log("onsale",onSaleToks);
        //console.log(Math.ceil(onSaleToks /Landing.tokensPerPageNear))
        setLanding({
          ...Landing,
          tokens: toks,
          nPages: pagNumArr.length,
        });
      }
      setload(c => false);
    })();
  }, [trigger]);
  
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 pt-6 mx-auto flex flex-wrap flex-col">
        <b className="text-xl">{owner.toString().toLowerCase()}</b>
        {/* <p>kublaikollection.eth 0x8486...527e</p> */}
        
      </div>
      <div className="bg-white px-4 py-3 flex items-center justify-center border-b border-gray-200 sm:px-6 mt-1">
        <Pagination count={Landing.nPages} page={page} onChange={handleChangePage} color="warning" theme="light"/>
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
        
        <div className={"flex flex-wrap"+(load ? " justify-center" : "")}>
          

          {
            load ?
            <img src={loading} style={{width:"50px"}}/>
            :
            Landing.tokens.length  > 0 ?
            Landing.tokens.map((token, key) => {
              //a nuestro datos le aplicamos al funcion stringify por lo cual necesitamos pasarlo
              const tokenData = JSON.parse(token.data);
              return (
                <div className="lg:w-1/3 md:w-1/2 px-3 w my-" key={key}>
                  <a href={"/detail/" + token.tokenID}>
                    <div className="token">
                    <div className="block relative h-48 rounded overflow-hidden">
                    
                       <img
                            alt="ecommerce"
                            className="imgaa object-cover object-center w-full h-full block"
                            src={`https://ipfs.fleek.co/ipfs/${tokenData.image}`}
                          /> 
               
                   
                           
                    </div>
                    <div className="mt-4">
                      <h2 className="ml-1 text-gray-900 title-font text-lg font-medium">
                        {tokenData.title}
                      </h2>
                      <p className="mt-1 mb-4 ml-2">
                        {"Tokenid: "+ token.tokenID }
                        <br/>
                        { "Owner: "+token.ownerId+"\n"}
                        <br/>
                        {Landing.blockchain==0 &&
                            fromWEItoEth(token.price) + " " + Landing.currency}

                        {Landing.blockchain!=0 &&
                              fromYoctoToNear(token.price) + " " + Landing.currency}
                      </p>
                    </div>
                    </div>
                  </a>
                </div>
              );
            })
            :
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                    Actualmente no hay tokens NFT disponibles.
                  </p>
          }
        </div>
        <div className="bg-white px-4 py-3 flex items-center justify-center border-t border-gray-200 sm:px-6 mt-16">
        <Pagination count={Landing.nPages} page={page} onChange={handleChangePage} color="warning" theme="light"/>
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
      </div>
    </section>
  );
}

export default LightEcommerceA;
