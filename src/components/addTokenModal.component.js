/* global BigInt */
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from 'sweetalert2'
//importamos metodos para interactuar con el smart contract, la red de aurora y el account

import { getNearContract, fromNearToYocto, ext_call, getNearAccount } from "../utils/near_interaction";
import { useTranslation } from "react-i18next";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { useWalletSelector } from "../utils/walletSelector";
//import { useHistory } from "react-router";

export default function AddTokenModal(props) {
  //const history = useHistory();
  const { selector, modalWallet, accounts, accountId } = useWalletSelector();
  const [state, setState] = useState({ disabled: false });
  const [t, i18n] = useTranslation("global")
  const [highestbidder, setHighestbidder] = useState(0);
  const APIURL = process.env.REACT_APP_API_TG
  const [noCollections, setNoCollections] = useState(false)
  const [collectionData, setCollectionData] = useState([])
  const [colID, setColID] = useState(-1)

  useEffect(() => {
    (async () => {
      if (props.show) {
        console.log(props)
        let userData
        let account = accountId
        const query = `
          query($account: String){
            collections (where : {owner_id : $account}){
              id
              title
            }
          }
        `
        const client = new ApolloClient({
          uri: APIURL,
          cache: new InMemoryCache(),
        })

        await client.query({
          query: gql(query),
          variables: {
            account: account
          }
        })
          .then((data) => {
            console.log('collections: ', data.data.collections)
            if (data.data.collections.length <= 0) {
              setNoCollections(false)
            }
            else {
              userData = data.data.collections
              setCollectionData(userData)
              setNoCollections(true)
            }
          })
          .catch((err) => {
            console.log('error: ', err)
          })
      }
    })()
  }, [props]);

  async function handleAddToken() {
    console.log("Hola este es el handle")
    console.log(colID)
    if (colID <= -1) {
      Swal.fire({
        title: t('addToken.alert1-title'),
        text: t('addToken.alert1-msg'),
        icon: 'error',
        confirmButtonColor: '#E79211'
      })
      return
    }
    Swal.fire({
      title: t('addToken.alert2-title'),
      text: t('addToken.alert2-msg'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E79211',
      cancelButtonColor: '#d33',
      confirmButtonText: "Agregar NFT"
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log("Agregando NFT a una coleccion")
        let payload = {
          contract_id: process.env.REACT_APP_CONTRACT,
          owner_id: props.tokens.owner,
          token_id: props.tokens.tokenID,
          title: props.jdata.title,
          description: props.jdata.description,
          media: props.jdata.image,
          creator: props.jdata.creator,
          price: 10,
          collection_id: parseInt(colID)
        }
        console.log(payload)
        // ext_call(process.env.REACT_APP_CONTRACT_MARKET, 'add_token_to_collection', payload, 300000000000000, 1)
        const wallet = await selector.wallet();
        wallet.signAndSendTransaction({
          signerId: accountId,
          receiverId: process.env.REACT_APP_CONTRACT_MARKET,
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "add_token_to_collection",
                args: payload,
                gas: 300000000000000,
                deposit: 1,
              }
            }
          ]
        })
      }
    })
  }
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
      let payload = {
        nft_contract_id: process.env.REACT_APP_CONTRACT,
        token_id: props.tokens.tokenID,
        owner_id: props.tokens.owner
      };
      console.log(props.tokens)

      let amountVal = values.price;
      let amount = fromNearToYocto(amountVal);
      let bigAmount = BigInt(amount);
      if (!values.terms) {
        Swal.fire({
          title: t("Modal.transAlert2"),
          text: t("Modal.offerAlert1Txt"),
          icon: 'error',
          confirmButtonColor: '#E79211'
        })
        return
      }
      if (props.tokens.bidPrice != "" && values.price <= props.tokens.bidPrice) {
        Swal.fire({
          title: t("Modal.offerAlert2"),
          text: t("Modal.offerAlert2Txt-1"),
          icon: 'error',
          confirmButtonColor: '#E79211'
        })
        return
      }
      ext_call(process.env.REACT_APP_CONTRACT_MARKET, 'add_offer', payload, 300000000000000, amount)


    


      setState({ disabled: false });
    },
  });

  return (
    props.show && (
      <>
        <div className="  justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
          <div className="w-9/12 md:w-6/12 my-6  rounded ">
            {/*content*/}
            <div className=" shadow-lg  flex flex-col  bg-white outline-none focus:outline-none rounded-xlarge">
              {/*header*/}

              <div
                className={`flex flex-row justify-between bg-yellow2 flex items-start justify-center font-bold uppercase p-5 border-b border-solid border-yellowGray-200 rounded text-white rounded-t-xlarge`}>
                <div className="font-raleway">{props.title} </div>
                <div><button
                  className={`  text-white  font-bold uppercase px-[20px]  `}
                  type="button"
                  disabled={props.disabled}
                  onClick={() => {
                    props.change({ show: false })
                  }}
                >
                  {props.buttonName}
                </button>
                </div>
              </div>

              <div className="relative p-6 flex flex-col ">
                

                {/* Formulario para ofertar */}
                {noCollections ?
                  <>
                    <div className="flex justify-center">
                      <p className=" my-4 text-center text-2xl leading-relaxed text-darkgray font-raleway">
                        {props.message}
                      </p>
                    </div>
                    <select
                      className="text-darkgray font-raleway"
                      onChange={e => { setColID(e.target.value) }}
                    >
                      <option key={0} value={-1}>{t('addToken.comboOpc')}</option>
                      {collectionData.length > 0 ?
                        collectionData.map((data) =>
                          <option key={data.id} value={data.id}>{data.title} - ID:{data.id}</option>
                        )
                        :
                        null}
                    </select>

                    <div className="w-full flex justify-end">
                      <div className="relative group mt-3 rounded-full">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#f2b159] to-[#ca7e16] rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt group-hover:-inset-1"></div>
                        <button
                          className={`relative bg-yellow2 text-white font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none  ease-linear transition-all duration-150`}
                          onClick={handleAddToken}
                          disabled={state.disabled}
                        >
                          {t('addToken.btnAdd')}
                        </button>
                      </div>
                    </div>
                  </>
                  :
                  <>
                    <div className="flex flex-col justify-center">
                      <h1 className="text-darkgray text-xl text-center font-raleway mb-4">{t('addToken.msgNoCol')}</h1>
                      <a className="relative bg-yellow2 text-white text-center font-bold uppercase text-sm px-6 py-3 rounded-full shadow outline-none focus:outline-none  ease-linear transition-all duration-150 hover:shadow-yellow1 hover:scale-105" href="/createCollection">{t('addToken.btnCol')}</a>
                    </div>
                  </>
                }

                {/* <form
                  onSubmit={formik.handleSubmit}
                  className="grid grid-cols-1 divide-y flex px-5 py-15 md:flex-row flex-col items-center"
                >
                  <div>
                    <div className="flex justify-between ">
                      <label
                        htmlFor="price"
                        className="leading-7 text-sm  text-darkgray"
                      >
                        Precio {props.currency}
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
                        className={`border-none w-full bg-gray-100 bg-opacity-50 rounded   focus:bg-transparent  text-base outline-none text-darkgray py-1 px-3 leading-8 transition-colors duration-200 ease-in-out-${props.theme}-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out font-raleway`}
                        {...formik.getFieldProps("price")}
                      />
                      <div className="p-4 font-open-sans">
                        NEAR
                      </div>
                    </div>
                    <div className="mt-3">
                      <input type="checkbox" className="" name="terms" id="terms" {...formik.getFieldProps("terms")} /> <label className="text-sm text-darkgray font-raleway">{t("Modal.accept")}</label>
                    </div>
                    {/* Ofertar */}
                {/* {props.tokenId && (
                      <div className="w-full flex justify-end">
                        <button
                          className={`bg-yellow2 w- mt-3  text-white active:bg-brown font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none  ease-linear transition-all duration-150 `}
                          type="submit"
                          disabled={state.disabled}
                        >
                          Ofertar
                        </button>
                      </div>
                    )}
                  </div>



                </form> */}
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
