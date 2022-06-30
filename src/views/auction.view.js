import React, { useState } from "react";
import PropTypes from "prop-types";
import { useParams, useHistory } from "react-router-dom";
import { isNearReady } from "../utils/near_interaction";
import { nearSignIn } from "../utils/near_interaction";
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

function LightEcommerceB(props) {
  //guarda el estado de  toda la vista
  const [state, setstate] = useState();
  //guarda el estado de el modal
  const [modal, setModal] = React.useState({
    show: false,
  });
  //Esta logeado
  const [stateLogin, setStateLogin] = useState(false);
  //Precio minimo subasta
  const [bidderMin, setStateBidderMin] = useState(0.0);
  //Puja
  const [puja, setpuja] = useState(0.0);
  // Tiempo de conclucion de la subasta
  let finalTime = 0;
  const setFinalTime = (c) => { finalTime = c };
  const [Time, setTime] = useState(0);
  const [hilow, setHilow] = useState({
    highestbidder: "",
    lowestbidder: "",
  });
  // setea una fecha dada y retorna un TimeStamp


  const getFecha = () => {
    if (finalTime > 0) {
      // const time = parseInt((finalTime - new Date().getTime()) / 1000);
      const s = parseInt(finalTime % 60);
      const m = parseInt((finalTime / 60) % 60);
      const h = parseInt((finalTime / 3600) % 24);
      const d = parseInt((finalTime / 86400));
      finalTime--;
      return `${d}d ${h + ":" + m + ":" + s}`;
    }
    return false;
  }



  //es el parametro de tokenid
  const { tokenid } = useParams();
  //es el historial de busqueda
  let history = useHistory();

  React.useEffect(() => {
    (async () => {
      setStateLogin(await isNearReady());      
      let totalSupply;

      if (localStorage.getItem("blockchain") == "0") {
        //primero nos aseguramos de que la red de nuestro combo sea igual a la que esta en metamask
        await syncNets();

        //obtener cuantos tokens tiene el contrato
        totalSupply = await getContract().methods.totalSupply().call();

        //si es mayor que el total de tokens
        if (parseInt(tokenid) >= parseInt(totalSupply)) {
          window.location.href = "/galeria";
        } else {
          //obtener los datos del token que se queire
          let toks = await getContract().methods.tokensData(tokenid).call();
          toks.price = fromWEItoEth(toks.price);
          //obtener el dueño del contrato
          let owner = await getContract().methods.ownerOf(tokenid).call();
          //agregar el dueño y los datos del token
          //console.log(JSON.parse(toks.data));
          setstate({
            ...state,
            tokens: toks,
            jdata: JSON.parse(toks.data),
            owner,
          });
            //console.log(toks.data)
        }
      } else {
        //instanciar contracto
        let contract = await getNearContract();
        window.cont= contract;
        totalSupply = await contract.nft_total_supply();
        //console.log(totalSupply);

        //si es mayor que el total de tokens
        if (parseInt(tokenid) >= parseInt(totalSupply)) {
          window.location.href = "/galeria";
        } else {
          let toksnft = await contract.nft_token({ token_id: tokenid });
          let toks = await contract.get_token({ token_id: tokenid, owner_id: "dev-1636751893359-19496702378959" });

          if(!toks.on_auction){
            window.location.href = "/detail/"+tokenid;
          }

          if(fromYoctoToNear(toks.highestbidder) == 0){
            setStateBidderMin((parseFloat(fromYoctoToNear(toks.lowestbidder))+0.1).toFixed(1));
            setpuja((parseFloat(fromYoctoToNear(toks.lowestbidder))+0.1).toFixed(1));
          } else {
            setStateBidderMin((parseFloat(fromYoctoToNear(toks.highestbidder))+0.1).toFixed(1));
            setpuja((parseFloat(fromYoctoToNear(toks.highestbidder))+0.1).toFixed(1));
            //console.log((parseFloat(fromYoctoToNear(toks.highestbidder))+0.1).toFixed(1));
          }
          
          // console.log({
          //   tokenID: toks.token_id,
          //   onSale: toks.metadata.on_sale,
          //   price: toks.metadata.price,
          //   culture:toks.metadata.culture,
          //   country:toks.metadata.country,
          //   creator:toks.metadata.creator,
          // });

          setstate(state => ({
            ...state,
            tokens: {
              tokenID: toksnft.token_id,
              onSale: toks.on_sale,
              price: fromYoctoToNear(toks.price),
              // culture:toks.culture,
              // country:toks.country,
              // creator:toks.metadata.creator,
            },
            jdata: {
              image: toks.media,
              title: toks.title,
              description: toks.description,
              postor: toks.adressbidder,
              culture: toks.culture,
              country: toks.country,
              creator: toks.creator,
              // highestbidder: fromYoctoToNear(toks.highestbidder),
              // lowestbidder: fromYoctoToNear(toks.lowestbidder),
              expires_at: new Date(toks.expires_at * 1).toString(),
              starts_at: new Date(toks.starts_at * 1).toLocaleTimeString(),
            },
            owner: toksnft.owner_id,
          }));

          setHilow(s => ({
            ...s,
            highestbidder: fromYoctoToNear(toks.highestbidder),
            lowestbidder: fromYoctoToNear(toks.lowestbidder),
          }));

          const data = await contract.account.connection.provider.block({
            finality: "final",
          });

          const dateActual = (data.header.timestamp) / 1000000;
          finalTime = ((parseInt(toks.expires_at) - dateActual) / 1000);
          //console.log(finalTime);
          
          

          const timer = setInterval(() => {
            const v = getFecha();
            if (v) {
              setTime(v);
            } else {
              clearInterval(timer);
              
            }
            // console.log(pun().length);   
          }, 1000);
        }


      }
    })();


  }, []);

  function validatePuja(newPuja){
    if(newPuja < bidderMin){
      setpuja(bidderMin)
    }
  }

  async function sendOfert() {
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

      let amount = puja;//parseFloat(state.tokens.price);
      //console.log("amount", amount)

      //instanciar contracto
      let contract = await getNearContract();
      //obtener tokens a la venta
      toks = await contract.ofertar_subasta(
        {
          token_id: state.tokens.tokenID,
        },
        300000000000000,
        fromNearToYocto(amount)
      );

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
        message: "Oferta realizada",
        loading: false,
        disabled: false,
        change: setModal,
      });
      //desbloquear el boton
      setstate({ ...state, btnDisabled: false });
    }
  }

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <img
            alt="ecommerce"
            className="lg:w-1/2 w-full lg:h-auto h-64 object-fill  object-fill md:object-scale-down  rounded"
            src={`https://ipfs.fleek.co/ipfs/${state?.jdata.image}`}
          />
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1 mb-6">
              {state?.jdata.title}
            </h1>
            <p className="leading-relaxed mt-2 mb-6 font-mono ">
              {state?.jdata.description}
            </p>
            <div
              className={`flex border-l-4 border-${props.theme}-500 py-2 px-2 my-2 bg-gray-50`}
            >
              <span className="text-gray-500">TokenId</span>
              <span className="ml-auto text-gray-900">
                {state?.tokens.tokenID}
              </span>
            </div>

            <div
              className={`flex border-l-4 border-${props.theme}-500 py-2 px-2 my-2 bg-gray-50`}
            >
              <span className="text-gray-500">Cultura</span>
              <span className="ml-auto text-gray-900">
                <span
                  className={`inline-flex items-center justify-center px-2 py-1  text-xs font-bold leading-none ${state?.jdata.culture
                      ? "text-green-100 bg-green-500"
                      : "text-red-100 bg-red-500"
                    } rounded-full`}
                >
                  {state?.jdata.culture}
                </span>
              </span>
            </div>

            <div
              className={`flex border-l-4 border-${props.theme}-500 py-2 px-2 my-2 bg-gray-50`}
            >
              <span className="text-gray-500">País de origen</span>
              <span className="ml-auto text-gray-900">
                <span
                  className={`inline-flex items-center justify-center px-2 py-1  text-xs font-bold leading-none ${state?.jdata.country
                      ? "text-green-100 bg-green-500"
                      : "text-red-100 bg-red-500"
                    } rounded-full`}
                >
                  {state?.jdata.country}
                </span>
              </span>
            </div>

            <div
              className={`flex border-l-4 border-${props.theme}-500 py-2 px-2 bg-gray-50`}
            >
              <span className="text-gray-500">Propietario</span>
              <span className="ml-auto text-gray-900 text-xs self-center">
                {state?.owner}
              </span>
            </div>

            <div
              className={`flex border-l-4 border-${props.theme}-500 py-2 px-2 my-2 bg-gray-50`}
            >
              <span className="text-gray-500">Creador</span>
              <span className="ml-auto text-gray-900 text-xs self-center">
                {state?.jdata.creator}
              </span>
            </div>

            <div
              className={`flex border-l-4 border-${props.theme}-500 py-2 px-2 my-2 bg-gray-50`}
            >
              <span className="text-gray-500">Postor</span>
              <span className="ml-auto text-gray-900 text-xs self-center">
                {state?.jdata.postor}
              </span>
            </div>

            <div
              className={`flex border-l-4 border-${props.theme}-500 py-2 px-2 my-2 bg-gray-50`}
            >
              <span className="text-gray-500">Precio inicial</span>
              <span className="ml-auto text-gray-900">

                {hilow?.lowestbidder} Near

              </span>
            </div>

            <div
              className={`flex border-l-4 border-${props.theme}-500 py-2 px-2 my-2 bg-gray-50`}
            >
              <span className="text-gray-500">Ultima puja</span>
              <span className="ml-auto text-gray-900">

                {hilow?.highestbidder} Near

              </span>
            </div>

            <div
              className={`flex border-l-4 border-${props.theme}-500 py-2 px-2 my-2 bg-gray-50`}
            >
              <span className="text-gray-500">Tiempo restante</span>
              <span className="ml-auto text-gray-900">

                {Time}

              </span>
            </div>

            <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5"></div>
            {stateLogin ? 
                          <div className="puja">
                            {/* <span className=""> */}
                            <input type="number" 
                              min={bidderMin} 
                              value={puja}
                              step="0.1"
                              className="title-font font-medium text-2xl text-gray-900" 
                              onChange={e=>{
                                setpuja(e.target.value);
                                validatePuja(e.target.value);
                              }}
                              />
                            <p className="title-font font-medium text-2xl text-gray-900">{" " + currencys[parseInt(localStorage.getItem("blockchain"))]}</p>
                            {/* </span> */}
                            <button
                              className={`flex text-white bg-${props.theme}-500 border-0 py-2 px-6 focus:outline-none hover:bg-${props.theme}-600 rounded`}
                              disabled={state?.btnDisabled}
                              onClick={async () => {
                                sendOfert();
                              }}
                            >
                              Puja
                            </button>
                          </div>
                          : 
                          <button
                          className={`flex ml-auto text-white bg-${props.theme}-500 border-0 py-2 px-6 focus:outline-none hover:bg-${props.theme}-600 rounded`}
                          // disabled={state?.btnDisabled}
                          onClick={async () => {
                            nearSignIn(window.location.href);
                          }}
                          >
                            Iniciar Sesión para Ofertar
                          </button>
              }
          </div>
        </div>
      </div>
      <Modal {...modal} />
    </section>
  );
}

LightEcommerceB.defaultProps = {
  theme: "yellow",
};

LightEcommerceB.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default LightEcommerceB;
