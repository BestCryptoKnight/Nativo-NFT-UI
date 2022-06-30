import React from "react";
import {
  fromWEItoEth,
  getContract,
  getSelectedAccount,
  syncNets,
} from "../utils/blockchain_interaction";
import { currencys } from "../utils/constraint";
import { getNearContract, fromYoctoToNear, fromNearToYocto } from "../utils/near_interaction";
import filtroimg from '../assets/landingSlider/img/filtro.png'
import Pagination from '@mui/material/Pagination';
import countrys from '../utils/countrysList'


function LightEcommerceA() {
  const [Landing, setLanding] = React.useState({
    theme: "yellow",
    currency: currencys[parseInt(localStorage.getItem("blockchain"))],
    tokens: [],
    page: parseInt(window.localStorage.getItem("page")),
    pag: window.localStorage.getItem("pagSale"),
    minPrice: window.localStorage.getItem("minPriceS"),
    maxPrice: window.localStorage.getItem("maxPriceS"),
    minDate: window.localStorage.getItem("minDateS"),
    maxDate: window.localStorage.getItem("maxDateS"),
    minPrice: window.localStorage.getItem("minPriceS"),
    filter: window.localStorage.getItem("filterS"),
    blockchain: localStorage.getItem("blockchain"),
    tokensPerPage: 10,
    tokensPerPageNear: 24,
  });
  const [counter, setcounter] = React.useState();
  const [esconder, setesconder] = React.useState(false);
  const [minprice, setminprice] = React.useState(0);
  const [maxprice, setmaxprice] = React.useState(0);
  const [mindate, setmindate] = React.useState(0);
  const [maxdate, setmaxdate] = React.useState(0);
  const [pagsale, setpagsale] = React.useState(0);
  const [pagCount, setpagCount] = React.useState("");
  const [chunksale, setchunksale] = React.useState(0);
  const [page, setpage] = React.useState(1);
  const [trigger, settrigger] = React.useState(true);
  window.localStorage.setItem('filterS', false)
  const [filtro, setfiltro] = React.useState({
    culture: "null",
    country: "null",
    type: "null",
    date: "null",
    price: "null",
  });
  const [combo, setcombo] = React.useState("max");
  const [cmbOpc, setcmbOpc] = React.useState(true);

  const handleChangePage = (e, value) => {
    console.log(value)
    setpage(value)
    setpagsale(parseInt(pagCount.split(",")[value-1].split("-")[1]))
    setchunksale(parseInt(pagCount.split(",")[value-1].split("-")[0]))
    window.scroll(0, 0)
    settrigger(!trigger)
  }

  const handleTrigger = () => {
    setpagsale(0)
    setchunksale(0)
    setpage(1)
    settrigger(!trigger)
  }

  const modificarFiltro = (v) => {
    setfiltro(c => ({ ...c, ...v }))
  }

  React.useEffect(() => {
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
        //console.log("Page",Landing.page)
        //obtener tokens a la venta
        // console.log("Paasdsadfsdfdge",Landing.page*30,"edfew" ,Landing.tokensPerPageNear*(Landing.page+1))

        console.log("Tokens por pagina: ", Landing.tokensPerPageNear)
        console.log("ID de donde inicia: ", pagsale)
        if (!esconder) {
          var pag = await contract.get_pagination_onsale_filters_v2({
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
          console.log(pagCount)
          toks = await contract.obtener_pagina_on_sale_V2({
            chunk: chunksale,
            tokens: Landing.tokensPerPageNear,
            //_start_index: Landing.page,
            _start_index: pagsale,
            _minprice: 0,
            _maxprice: 0,
            _mindate: 0,
            _maxdate: 0,
          });
          window.localStorage.setItem('pagSale', pag)
          
        }
        else {
          var pag = await contract.get_pagination_onsale_filters_v2({
            tokens: Landing.tokensPerPageNear,
            //_start_index: Landing.page,
            _start_index: pagsale,
            _minprice: minprice,
            _maxprice: maxprice,
            _mindate: mindate,
            _maxdate: maxdate,
          })
          let pagi= pag.toString()
          setpagCount(pagi)
          console.log(pagCount)
          toks = await contract.obtener_pagina_on_sale_V2({
            chunk: chunksale,
            tokens: Landing.tokensPerPageNear,
            //_start_index: Landing.page,
            _start_index: pagsale,
            _minprice: minprice,
            _maxprice: maxprice,
            _mindate: mindate,
            _maxdate: maxdate,
          });
          window.localStorage.setItem('pagSale', pag)
        }
        //obtener cuantos tokens estan a la venta
        let pagNumArr = pag
        onSaleToks = await contract.get_on_sale_toks();
        console.log(toks)

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
    })();
  }, [trigger]);



  return (
    <section className="text-gray-600 body-font">
      <div className={"container px-5 py-4 mx-auto flex flex-wrap items-center " + (
        esconder ? "" : "py-2"
      )}>
        <div className="fs-1 flex items-center" onClick={e => {
          setesconder(v => !v);
          window.localStorage.setItem('filterS', !Landing.filter)
          setmaxdate(0)
          setmindate(0)
          setmaxprice(0)
          setminprice(0)
          setpagsale(0)
          setchunksale(0)
          setpage(1)
          if (cmbOpc) {
            if (combo == "max") {
              let max = document.getElementById("max")
              max.value = ""
            }
            else if (combo == "min") {
              let min = document.getElementById("min")
              min.value = ""
            }
            else if (combo == "ran") {
              let max = document.getElementById("max")
              max.value = ""
              let min = document.getElementById("min")
              min.value = ""
            }
          }

          handleTrigger()
          //settrigger(!trigger);
        }}>
          <img src={filtroimg} className="logg mr-1" />
          <b>Filtro</b>
        </div>
      </div>
      <div className={"container py-5 px-5  mx-auto flex flex-wrap items-center " + (
        esconder ? "" : "esconder"
      )} >
        <select className="p-2 lg:w-1/12 ml-2 bg-s1" onChange={e => {
          if (e.target.value == "Fecha") {
            setcmbOpc(true)
            setminprice(0)
            setmaxprice(0)
            setpagsale(0)
            setchunksale(0)
            setpage(1)
          }
          else {
            setcmbOpc(false)
            setmindate(0)
            setmaxdate(0)
            setpagsale(0)
            setchunksale(0)
            setpage(1)
          }
        }}>
          <option>Fecha</option>
          <option>Precio</option>
        </select>
        {cmbOpc ?
          <>
            <select className="p-2 lg:w-1/12 ml-2 bg-s1" onChange={e => {
              if (e.target.value == "A partir de") {
                setcombo("max")
              }
              else if (e.target.value == "Antes de") {
                setcombo("min")
              }
              else if (e.target.value == "Rango") {
                setcombo("ran")
              }
            }}>
              <option>A partir de</option>
              <option>Antes de</option>
              <option>Rango</option>
            </select>
            {combo == "max" ? (
              <>
                <b className="ml-2" >Desde:</b>
                <input type="date" id="max" className="p-2 lg:w-1/18 ml-2 bg-s1" onChange={e => {
                  if (e.target.value != "") {
                    const fecha = e.target.value.split('-')
                    let dateSTR = fecha[1] + '-' + fecha[2] + '-' + fecha[0]
                    const date = new Date(dateSTR)
                    setmaxdate(parseInt(date.getTime()))
                    setmindate(0)
                  }
                  else {
                    setmaxdate(0)
                    setmindate(0)
                  }
                }} />
              </>
            ) : (combo == "min" ? (
              <>
                <b className="ml-2" >Antes:</b>
                <input type="date" id="min" className="p-2 lg:w-1/18 ml-2 bg-s1" onChange={e => {
                  if (e.target.value != "") {
                    const fecha = e.target.value.split('-')
                    let dateSTR = fecha[1] + '-' + fecha[2] + '-' + fecha[0]
                    const date = new Date(dateSTR)
                    setmindate(parseInt(date.getTime()))
                    setmaxdate(0)
                  }
                  else {
                    setmindate(0)
                    setmaxdate(0)
                  }
                }} />
              </>
            )
              : (
                <>
                  <b className="ml-2" >Fecha inicial:</b>
                  <input type="date" id="min" className="p-2 lg:w-1/18 ml-2 bg-s1" onChange={e => {
                    if (e.target.value != "") {
                      const fecha = e.target.value.split('-')
                      let dateSTR = fecha[1] + '-' + fecha[2] + '-' + fecha[0]
                      const date = new Date(dateSTR)
                      setmindate(parseInt(date.getTime()))
                    }
                    else {
                      setmindate(0)
                    }
                  }} />
                  <b className="ml-2" >Fecha final:</b>
                  <input type="date" id="max" className="p-2 lg:w-1/18 ml-2 bg-s1" onChange={e => {
                    if (e.target.value != "") {
                      const fecha = e.target.value.split('-')
                      let dateSTR = fecha[1] + '-' + fecha[2] + '-' + fecha[0]
                      const date = new Date(dateSTR)
                      setmaxdate(parseInt(date.getTime()))
                    }
                    else {
                      setmaxdate(0)
                    }
                  }} />
                </>))}
          </> :
          <>
            <b className="ml-2" >Precio Minimo:</b>
            <input type="number" className="p-2 lg:w-1/12 ml-2 bg-s1" min="0" step="0.1" onChange={e => { setminprice(parseFloat(e.target.value)) }} value={minprice} />
            <b className="ml-2" >Precio Maximo:</b>
            <input type="number" className="p-2 lg:w-1/12 ml-2 bg-s1" min="0" step="0.1" onChange={e => { setmaxprice(parseFloat(e.target.value)) }} value={maxprice} />
          </>
        }


        <button className="ml-20 p-2 lg:w-1/12 ml-2 bg-s1" onClick={handleTrigger}><b>Aplicar</b></button>


      </div>
      <div className="bg-white px-4 py-3 flex items-center justify-center border-b border-gray-200 sm:px-6 mt-1">
        <Pagination count={Landing.nPages} page={page} onChange={handleChangePage} color="warning" theme="light"/>
      </div>
      <div className="container px-5 py-8 mx-auto">
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
                <div className="lg:w-1/3 md:w-1/2 sm:w-1/2 ssmw-1  px-3" key={key}>
                  {tokenData.image ?
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
                            {"Tokenid: " + token.tokenID}
                            <br />
                            {"Owner: " + token.ownerId + "\n"}
                            <br />
                            {Landing.blockchain == 0 &&
                              fromWEItoEth(token.price) + " " + Landing.currency}

                            {Landing.blockchain != 0 &&
                              fromYoctoToNear(token.price) + " " + Landing.currency}
                          </p>
                        </div>
                      </div>
                    </a>
                    :
                    <>
                    <div className="token">
                        <div className="block relative h-48 rounded overflow-hidden">

                        <img
                      src={"https://media.giphy.com/media/tA4R6biK5nlBVXeR7w/giphy.gif"}
                      className="object-cover object-center w-full h-full block" />



                        </div>
                        <div className="mt-4">
                          <h2 className="ml-1 text-gray-900 title-font text-lg font-medium">
                            Cargando Informacion
                          </h2>
                          <p className="mt-1 mb-4 ml-2">
                            Espere un momento por favor<br />
                            Se esta recuperando la Informacion<br/>
                            del NFT
                          </p>
                        </div>
                      </div>
                    </>
                    

                  }
                </div>
              );
            })}
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

                  className={`bg-white ${pagsale / Landing.tokensPerPageNear == index
                    ? "bg-yellow-100 border-yellow-500 text-yellow-600 hover:bg-yellow-200"
                    : "border-gray-300 text-gray-500 hover:bg-gray-50"
                    }  relative inline-flex items-center px-4 py-2 text-sm font-medium`}
                  key={index}
                  onClick={async () => {
                    //  await getPage(index);
                    if (index == 0) {
                      window.localStorage.setItem("page", 0)
                      setpagsale(0)
                    }
                    else {
                      window.localStorage.setItem("page", parseInt(Landing.pag.split(",")[index]));
                      setpagsale(parseInt(Landing.pag.split(",")[index]))
                    }
                    window.scroll(0, 0)
                    settrigger(!trigger)
                    //setcounter(Landing.tokens[Landing.tokens.length-1].tokenID +1)

                    //window.location.reload();
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
