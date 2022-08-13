/* global BigInt */
import React, {  useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from 'sweetalert2'
//importamos metodos para interactuar con el smart contract, la red de aurora y el account
import {
  syncNets,
  getContract,
  getSelectedAccount,
  fromETHtoWei,
} from "../utils/blockchain_interaction";

import { getNearContract, fromNearToYocto } from "../utils/near_interaction";
import { useTranslation } from "react-i18next";

//import { useHistory } from "react-router";

export default function ApprovalModal(props) {
  //const history = useHistory();
  const [state, setState] = useState({ disabled: false});
  const [t, i18n] = useTranslation("global")
  const [highestbidder, setHighestbidder] = useState(0);
  
  useEffect(() => {
    if (props.tokens) {
      setHighestbidder(props.tokens.highestbidder);
    }
  });
  
  //Configuramos el formulario para ofertar por un token
  const formik = useFormik({
    initialValues: {
      terms: false,
      price: 0
    },
    validationSchema: Yup.object({
      price: Yup.number()
        .required("Requerido")
        .positive("El precio debe ser positivo")
        .moreThan(0.09999999999999, "El precio minimo para el NFT es de 0.1")
        .min(0.1, "El precio no debe de ser menor 0.1"),
      terms: Yup.bool()
        .required("Requerido")
    }),
    //Metodo para el boton ofertar del formulario
    onSubmit: async (values) => {
      let ofertar;
        let contract = await getNearContract();
        let amount = fromNearToYocto(0.01);
        let price = fromNearToYocto(values.price)
        let msgData = JSON.stringify({market_type:"on_sale", price: price, title: props.title, media: props.media, creator_id: props.creator, description: props.description})
        let payload = {
          token_id: props.tokenID,
          account_id: process.env.REACT_APP_CONTRACT_MARKET,
          msg: msgData
        }
        console.log(payload)
        if(!values.terms){
          Swal.fire({
            title: t("Modal.transAlert2"),
            text: t("Modal.transAlert2Txt"),
            icon: 'error',
            confirmButtonColor: '#E79211'
          })
          return
        }
        let approval = contract.nft_approve(
          payload,
          300000000000000,
          amount
        )
        

   
        
      // if (highestbidder != 'notienealtos') {
      //   if (bigAmount <= BigInt(highestbidder)) {
      //     Swal.fire({
      //       title: 'El Precio es menor a la ultima oferta',
      //       text: 'Para poder ofertar por este NFT es necesario que el precio mayor a la ultima oferta',
      //       icon: 'error',
      //       confirmButtonColor: '#E79211'
      //     })
      //     return
      //   }
      // }
        

        
      //   ofertar = await contract.market_bid_generic(
      //     payload,
      //     300000000000000, // attached GAS (optional)
      //     bigAmount.toString()//amount
      //   ).
      //   catch(e=>{
      //     console.log('error',e);
      //   });
      

      // setState({ disabled: false });
    },
  });

  return (
    props.show && (
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none  rounded-xlarge">
          <div className="w-9/12 md:w-6/12 my-6  rounded-xlarge ">
            {/*content*/}
            <div className="rounded-xlarge shadow-lg  flex flex-col  bg-white outline-none focus:outline-none font-raleway">
              {/*header*/}

              <div
                className={`flex flex-row justify-between bg-yellow2 flex items-start justify-center font-bold uppercase p-5 border-b border-solid border-yellowGray-200  text-white rounded-t-xlarge font-raleway`}>
                <div className="font-raleway">{props.title} </div>
                <div><button
                  className={`  text-white  font-bold uppercase px-[20px]  text-sm font-raleway`}
                  type="button"
                  disabled={props.disabled}
                  onClick={() => {
                    props.change({ show: false });
                  }}
                >
                  <span className="font-raleway">{props.buttonName}</span>
                </button>
                </div>
              </div>

              <div className="relative p-6 flex flex-col ">
                <div className="flex justify-center">
                  <p className=" my-4 text-center  leading-relaxed text-darkgray text-xl font-raleway">
                    {props.message}
                  </p>
                </div>

                {/* Formulario para ofertar */}
                <form
                  onSubmit={formik.handleSubmit}
                  className="grid grid-cols-1 divide-y flex px-5 py-15 md:flex-row flex-col items-center text-sm font-raleway"
                >
                  <div>
                    <div className="flex justify-between ">
                      <label
                        htmlFor="price"
                        className="leading-7  text-darkgray text-sm font-raleway"
                      >
                        {t("Modal.price")}
                      </label>
                      {formik.touched.price && formik.errors.price ? (
                        <div className="leading-7 text-sm text-red-600 font-open-sans">
                          {formik.errors.price}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-row">
                      <input
                        type="number"
                        id="price"
                        name="price"
                        min="0.1"
                        max="100000000000000"
                        step="0.1"
                        className={`text-sm font-raleway border-none w-full bg-gray-100 bg-opacity-50 rounded   focus:bg-transparent  text-base outline-none text-darkgray py-1 px-3 leading-8 transition-colors duration-200 ease-in-out-${props.theme}-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
                        {...formik.getFieldProps("price")}
                      />
                    </div>
                    <div className="mt-3">
                      <input type="checkbox" className="" name="terms" id="terms" {...formik.getFieldProps("terms")}/> <label className="text-sm text-darkgray">{t("Modal.accept")}</label>
                    </div>
                    {/* Ofertar */}
                    {props.tokenId && (
                      <div className="w-full flex justify-end font-raleway">
                        <button
                          className={`bg-yellow2 w- mt-3  text-white active:bg-brown font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none  ease-linear transition-all duration-150 font-raleway`}
                          type="submit"
                          disabled={state.disabled}
                        >
                          <span className="font-raleway">{t("Modal.putSale")}</span>
                          
                        </button>
                      </div>
                    )}
                  </div>



                </form>
                {/* Boton de cancelar en la ventana modal */}
                <div className="flex justify-end">

                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    )
  );
}
