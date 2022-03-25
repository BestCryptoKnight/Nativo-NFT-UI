import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
//importamos metodos para interactuar con el smart contract, la red de aurora y el account
import {
  syncNets,
  getContract,
  getSelectedAccount,
  fromETHtoWei,
} from "../utils/blockchain_interaction";

import { getNearContract, fromNearToYocto } from "../utils/near_interaction";

import { useHistory } from "react-router";

export default function ModalRevender(props) {
//  const history = useHistory();
  const [state, setstate] = useState({ disabled: false });
  //Configuramos el formulario para revender un token
  const formik = useFormik({
    initialValues: {
      price: 0,
    },
    validationSchema: Yup.object({
      price: Yup.number()
        .required("Requerido")
        .positive("El precio debe ser mayor a 0")
        .moreThan(0, "No hay tokens gratis")
        .min(0.000000000000000001, "el precio minimo es un wei"),
    }),
    //Metodo para el boton revender del formulario
    onSubmit: async (values) => {
      setstate({ disabled: true });
      let revender;
      if (props.blockchain == "0") {
        //nos aseguramos que sigamos en la red de aurora
        await syncNets();
        let account = await getSelectedAccount();
        revender = await getContract()
          .methods.revender(props.tokenId, fromETHtoWei(values.price))
          .send({ from: account })
          .catch((err) => {
            return err;
          });
      } else {
        let contract = await getNearContract();
        let payload = {
          token_id: props.tokenId,
          price: fromNearToYocto(values.price),
        };
        let amount = fromNearToYocto(0);
        //console.log(amount);
        //console.log(payload);
        revender = await contract.revender(
          payload,
          300000000000000, // attached GAS (optional)
          amount
        );
        revender.status = revender.on_sale;
      }

      setstate({ disabled: false });
      //recargar la pantalla si la transacción se ejecuto correctamente
      if (revender.status) {
        history.go(0);
      }
    },
  });

  return (
    props.show && (
      <>
        <div   className=" justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
          <div   className="w-full md:w-6/12 my-6  rounded ">
            {/*content*/}
            <div  className=" rounded-lg shadow-lg  flex flex-col  bg-white outline-none focus:outline-none">
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
                  className="container mx-auto flex px-5"
                  style={{flexWrap:"wrap"}}
                >
                  
                  <div className="flex justify-between md:w-11/12">
                    <label
                      htmlFor="price"
                      className="leading-7 text-sm text-gray-600  "
                    >
                      Fecha de expiración
                    </label>
                    
                  </div>
                  <br/>
                  <input
                    type="date"
                    
                    className={`mb-1 date-modal border-none w-full bg-gray-100 bg-opacity-50 rounded   focus:bg-transparent  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out-${props.theme}-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
                    // {...formik.getFieldProps("price")}
                  />

                  <input
                    type="number"
                    placeholder="Hrs"
                    min="0"
                    max="24"
                    className={`mb-1 hm-modal border-none w-full bg-gray-100 bg-opacity-50 rounded   focus:bg-transparent  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out-${props.theme}-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
                  />

                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    max="59"
                    className={`mb-1 hm-modal border-none w-full bg-gray-100 bg-opacity-50 rounded   focus:bg-transparent  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out-${props.theme}-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
                    
                  />

                  <div className="flex justify-between ">
                    <label
                      htmlFor="price"
                      className="leading-7 text-sm text-gray-600  "
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
                    placeholder={"Precio en " +props.currency+" "}
                    className={`mb-1 price border-none w-full bg-gray-100 bg-opacity-50 rounded   focus:bg-transparent  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out-${props.theme}-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
                    {...formik.getFieldProps("price")}
                  />

                  {/* Mostramos el boton de revender si se mando la propiedadd del token id del nft */}
                  {props.tokenId && (
                    <button
                      className={`bg-yellow-500 w-min mt-3  text-white active:bg-yellow-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none  ease-linear transition-all duration-150 `}
                      type="submit"
                      style={{width:"100%"}}
                      disabled={state.disabled}
                    >
                      Subastar
                    </button>
                  )}
                  <button
                    className={`bg-yellow-500 w-min mt-3  text-white active:bg-yellow-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none  ease-linear transition-all duration-150 `}
                    type="button"
                    style={{width:"100%"}}
                    disabled={props.disabled}
                    onClick={() => {
                      props.change({ show: false });
                    }}
                  >
                    {props.buttonName}
                  </button>
                </form>
               
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    )
  );
}
