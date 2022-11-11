import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from 'sweetalert2'
//importamos metodos para interactuar con el smart contract, la red de aurora y el account

import { useTranslation } from "react-i18next";
import { getNearContract, fromNearToYocto } from "../utils/near_interaction";

//import { useHistory } from "react-router";

export default function ModalRevender(props) {
  //const history = useHistory();
  const [state, setstate] = useState({ disabled: false });
  const [t, i18n] = useTranslation("global")
  //Configuramos el formulario para revender un token
  const formik = useFormik({
    initialValues: {
      terms: false,
      price: 0,
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
    //Metodo para el boton revender del formulario
    onSubmit: async (values) => {
      //setstate({ disabled: true });
      let revender;
      if (props.blockchain == "0") {
        console.log('hola')
      } else {
        let contract = await getNearContract();
        let payload = {
          address_contract: props.contract,
          token_id: props.tokenId,
          price: fromNearToYocto(values.price),
          collection: props.collection,
          collection_id: props.collectionID,
        };
        let amount = fromNearToYocto(0.05);
        //console.log(amount);
        console.log(payload);
        console.log(values.terms)
        if(!values.terms){
          Swal.fire({
            title: 'Terminos y condiciones no aceptados',
            text: 'Para poder revender tu NFT es necesario que aceptes los terminos y condiciones',
            icon: 'error',
            confirmButtonColor: '#E79211'
          })
          return
        }
        
        revender = await contract.market_sell_generic(
          payload,
          300000000000000, // attached GAS (optional)
          0
        );
        /*  revender.status = revender.on_sale; */
      }

      setstate({ disabled: false });
      //recargar la pantalla si la transacción se ejecuto correctamente
      if (revender.status) {
        window.location.reload();
      }
      window.location.reload();
    },
  });

  return (
    props.show && (
      <>
        <div className="  justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
          <div className="w-full md:w-6/12 my-6  rounded ">
            {/*content*/}
            <div className=" rounded-lg shadow-lg  flex flex-col  bg-white outline-none focus:outline-none">
              {/*header*/}

              <div
                className={`bg-yellow-500 flex items-start justify-center font-bold uppercase p-5 border-b border-solid border-yellowGray-200 rounded text-white`}
              >
                {props.title}
              </div>

              <div className="relative p-6 flex flex-col ">
                <div className="flex justify-center">
                  <p className=" my-4 text-center text-2xl leading-relaxed">
                    {props.message}
                  </p>
                </div>

                {/* Formulario para revender */}
                <form
                  onSubmit={formik.handleSubmit}
                  className="grid grid-cols-1 divide-y flex px-5 py-24 md:flex-row flex-col items-center"
                >
                  <div>
                    <div className="flex justify-between ">
                      <label
                        htmlFor="price"
                        className="leading-7 text-sm text-gray-600"
                      >
                        Precio en {props.currency}
                      </label>
                      {formik.touched.price && formik.errors.price ? (
                        <div className="leading-7 text-sm text-red-600">
                          {formik.errors.price}
                        </div>
                      ) : null}
                    </div>

                    <input
                      type="number"
                      id="price"
                      name="price"
                      min="0.1"
                      step="0.1"
                      className={`border-none w-full bg-gray-100 bg-opacity-50 rounded   focus:bg-transparent  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out-${props.theme}-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
                      {...formik.getFieldProps("price")}
                    />
                    <div className="mt-3">
                      <input type="checkbox" className="" name="terms" id="terms" {...formik.getFieldProps("terms")}/> <label className="text-sm text-gray-600">{t("Modal.accept")}</label>
                    </div>
                    {/* Mostramos el boton de revender si se mando la propiedadd del token id del nft */}
                    {props.tokenId && (
                      <button
                        className={`bg-yellow-500 w-min mt-3  text-white active:bg-yellow-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none  ease-linear transition-all duration-150 `}
                        type="submit"
                        disabled={state.disabled}
                      >
                        Revender
                      </button>
                    )}
                  </div>



                </form>
                {/* Boton de cancelar en la ventana modal */}
                <div className="flex justify-end">
                  <button
                    className={`bg-yellow-500 w-min mt-3  text-white active:bg-yellow-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none  ease-linear transition-all duration-150 `}
                    type="button"
                    disabled={props.disabled}
                    onClick={() => {
                      props.change({ show: false });
                    }}
                  >
                    {props.buttonName}
                  </button>
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
