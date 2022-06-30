import React, {useState,useEffect} from "react";
import {
  fromWEItoEth,
  getContract,
  getSelectedAccount,
  syncNets,
} from "../utils/blockchain_interaction";
import { currencys } from "../utils/constraint";
import { getNearContract, fromYoctoToNear } from "../utils/near_interaction";
import TimeAution from '../utils/TimeAution';
import { nearSignIn } from "../utils/near_interaction";
import { isNearReady } from "../utils/near_interaction";
function LightEcommerceA() {
  const [Landing, setLanding] = React.useState({
    theme: "yellow",
    currency: currencys[parseInt(localStorage.getItem("blockchain"))],
    tokens: [],
    page: parseInt( window.localStorage.getItem("auctionpage")),
    pag: window.localStorage.getItem("pagAuction"),
    blockchain: localStorage.getItem("blockchain"),
    tokensPerPage: 15,
    tokensPerPageNear: 15,
  });
  async function getPage(pag) {
    let toks;
    let datatokens;
    if (Landing.blockchain == "0") {
      toks = await getContract()
        .methods.obtenerPaginav2(Landing.tokensPerPage, 2)
        .call();
      // datatokens = await getContract()
      // .methods.get_token(Landing.tokensPerPage, 2)
      // .call();
      //filtrar tokens
      let copytoks = toks.filter((tok) => tok.onSale);
      //console.log(toks);
      //console.log(datatokens);
      //convertir los precios de wei a eth
      copytoks = copytoks.map((tok) => {
        return { ...tok, price: fromWEItoEth(tok.price) };
      });
      setLanding({
        ...Landing,
        tokens: copytoks,
        page: pag,
      });
    } else {
      //instanciar contracto
      let contract = await getNearContract();
      
      let numberOfToks = pag * Landing.tokensPerPageNear;
      //obtener cuantos tokens estan a la venta
      let onSaleToks = await contract.get_on_sale_toks();
      let onAuctionToks = await contract.get_on_auction_toksV2();
      //obtener tokens a la venta
      toks = await contract.obtener_pagina_v2_auction({
        from_index: pag,
        limit: Landing.tokensPerPageNear,
      });
    //console.log("57 get toks from getpage",toks);
      toks = toks.map((tok) => {
        return {
          tokenID: tok.token_id,
          price: fromYoctoToNear(tok.price),
          data: JSON.stringify({
            title: tok.title,
            image: tok.media,
            time: TimeAution(contract, tok.token_id) 
          }),
        };
      });
      //console.log(toks);
      setLanding({
        ...Landing,
        tokens: toks,
        page: pag,
      });
    }
  }
  let ttt = 0;
  React.useEffect(() => {
    (async () => {
      let toks, onSaleToks;
      let arr=[];
      window.localStorage.setItem("auctionpage",0);

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
              nPages: Math.ceil(onSaleToks / Landing.tokensPerPage),
            });  
          }
           
     
      } else {
        //instanciar contracto
        let contract = await getNearContract();
        window.contr = contract;
        //console.log("Page",Landing.page,"PerNEar",Landing.tokensPerPageNear)
        let pag = await contract.get_pagination_onauction({
          tokens: Landing.tokensPerPageNear})
        //console.log(pag)
        window.localStorage.setItem('pagAuction',pag)
        let pagNumArr = pag
        //obtener tokens a la venta
        toks = await contract.obtener_pagina_on_auction_V2({
          tokens: Landing.tokensPerPageNear,
          _start_index: Landing.page,
          _minprice:0,
          _maxprice:0,
          _mindate:0,
          _maxdate:0,
        });
        //obtener cuantos tokens estan a la venta
        onSaleToks = await contract.get_on_sale_toks();
        let onAuctionToks = await contract.get_on_auction_toksV2();
        const data = await contract.account.connection.provider.block({
          finality: "final",
      });
      //convertir los datos al formato esperado por la vista
        //convertir los datos al formato esperado por la vista
        toks = toks.map((tok) => {
          // const [state, setstate] = useState("");
          
          const dateActual = (data.header.timestamp)/1000000;
          return {
            tokenID: tok.token_id,
            price: fromYoctoToNear(tok.price),
            data: JSON.stringify({
              title: tok.title,
              image: tok.media,
              on_sale: tok.on_sale, // sale status
              on_auction: tok.on_auction, //auction status
              highestbidder: tok.highestbidder,
              lowestbidder: tok.lowestbidder
            }),
            time: (tok.expires_at - dateActual <= 0 ? 0 : (tok.expires_at - dateActual) / 1000)
            
          };
        });
        //console.log("toks",toks);
        //console.log("onsale",onSaleToks);
        //console.log("onauction",onAuctionToks);
        //console.log(Math.ceil(onSaleToks /Landing.tokensPerPageNear))
         
        setLanding({
          ...Landing,
          tokens: toks,
          nPages: pagNumArr.length,
        });
      }
    })();
    
  }, []);
  
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        {/* Arroja un mensaje si no hay tokens disponibles en venta*/}
        {!Landing.tokens.length > 0 ? (
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
            Actualmente no hay tokens NFT disponibles.
          </p>
        ) : null}
        <div className="flex flex-wrap -m-4">
          {Landing.tokens &&
            Landing.tokens.map((token, key) => {
              //a nuestro datos le aplicamos al funcion stringify por lo cual necesitamos pasarlo
              const tokenData = JSON.parse(token.data);
              return (
                <TokenCart Landing={Landing} tokenData={tokenData} token={token} key={key}/>
              );
            })}
        </div>
        <div className="bg-white px-4 py-3 flex items-center justify-center border-t border-gray-200 sm:px-6 mt-16">
          <nav
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
                   // await getPage(index);
                   if(index == 0){
                    window.localStorage.setItem("auctionpage",0)
                  }
                  else{
                    window.localStorage.setItem("auctionpage",parseInt(Landing.pag.split(",")[index])+1);  
                  }
                    window.location.reload();
                  }}
                >
                  {index + 1}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </section>
  );
}
const TokenCart = ({tokenData, token, Landing ,key}) => {
  const [time, settime] = useState(token.time);
  //Esta logeado
  const [stateLogin, setStateLogin] = useState(false);
  const finalizarSubasta = async (tokenID) =>{
    setStateLogin(await isNearReady());
    let contract = await getNearContract();
    let payload = {
      token_id: tokenID,
    }
    //console.log(stateLogin)
    if(await isNearReady()){
      await contract.finalizar_subasta(
        payload,
        300000000000000, // attached GAS (optional)
      );
      window.location.reload();
    }
    
    
    
  }
  useEffect(async () => {
        
    const id = setInterval(() => {
      if(time > 0){
        settime(time => time -1);
      }else{
        clearInterval(id);

            
          finalizarSubasta(token.tokenID);
        
      }
    }, 1000);
  }, [])
  const timeFormat = () => {
     const s = parseInt(time % 60);
     const m = parseInt(time / 60 % 60);
     const h = parseInt(time / 3600 % 24);
     const d = parseInt(time / 86400);
     if(s<= 0){
       return "Subasta finalizada"
     }
    return (d == 0 ? "" : d+"d")+" "+h+":"+m+":"+s;
  }

  
  return(
    <div className="lg:w-1/4 md:w-1/2 px-2 w-full my-3" key={key}>
                 {tokenData.image ?
                  <a href={"/auction/" + token.tokenID}>
                    <div className="token token-h">
                    <div className="block relative h-48 rounded overflow-hidden">
                    
                       <img
                            alt="ecommerce"
                            className="imgaa object-cover object-center w-full h-full block"
                            src={`https://ipfs.fleek.co/ipfs/${tokenData.image}`}
                            //src="https://cdn.pixabay.com/photo/2021/08/25/20/42/field-6574455__340.jpg"
                          /> 
               
                   
                           
                    </div>
                    <div className="mt-4">
                      <h2 className="ml-1 text-gray-900 title-font text-lg font-medium">
                        {tokenData.title}
                      </h2>
                      <p className="mt-1 ml-2">
                        Tiempo restante: <b>{timeFormat()}</b> 
                      </p>
                      <p className="mt-1 ml-2">
                        {Landing.blockchain==0 &&
                            fromWEItoEth(token.price) + " " + Landing.currency}
                            Precio base:  <b>{token.price+" "+ Landing.currency}</b>
                        {/* {"Ultima puja 0.0001 " + Landing.currency} */}
                      </p>
                      <p className="mt-1 mb-4 ml-2">
                        {Landing.blockchain==0 &&
                            fromWEItoEth(token.price) + " " + Landing.currency}
                            Ultima puja:  <b>{fromYoctoToNear(tokenData.highestbidder)+" "+ Landing.currency}</b>
                        {/* {"Ultima puja 0.0001 " + Landing.currency} */}
                      </p>
                      {/* <a href={"/detail/" + token.tokenID}
                        className="btn-1"
                        // disabled={state?.btnDisabled}
                        onClick={async () => {
                          // comprar();
                        }}
                        >
                        Ver 
                      </a> */}
                    </div>
                    </div>
                  </a>
                  :
                  <img 
                     src={"https://media.giphy.com/media/tA4R6biK5nlBVXeR7w/giphy.gif"} 
                     className="object-cover object-center w-full h-full block" />
                  }
                </div>
  )
}
export default LightEcommerceA;