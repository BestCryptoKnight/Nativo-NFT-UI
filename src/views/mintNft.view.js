import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { acceptedFormats, currencys } from "../utils/constraint";
import Modal from "../components/modal.component";
import load from "../assets/landingSlider/img/loader.gif";
import {
  addNetwork,
  fromETHtoWei,
  getContract,
  getSelectedAccount,
  syncNets,
  syncNetworks,
} from "../utils/blockchain_interaction";
import {
  estimateGas,
  fromNearToEth,
  fromNearToYocto,
  fromYoctoToNear,
  getNearAccount,
  getNearContract,
  storage_byte_cost,
} from "../utils/near_interaction";
import { Reader, uploadFile } from '../utils/fleek';
import Swal from 'sweetalert2'
import { useTranslation } from "react-i18next";
import trashIcon from '../assets/img/bin.png';
function LightHeroE(props) {
  //este estado contiene toda la info de el componente
  const [mint, setmint] = React.useState({
    file: undefined,
    blockchain: localStorage.getItem("blockchain"),
  });
  const [collecData, setCollecData] = useState([])
  const [combo, setcombo] = useState(true);
  const [collection, setcollection] = useState(false);
  const [comboCol, setcomboCol] = useState(true);
  const [contData, setcontData] = useState("")
  const [collTitle, setcollTitle] = useState("")
  const [colID, setColID] = useState("")
  const [t, i18n] = useTranslation("global")
  const [loading, setLoading] = useState(false);
  //guarda el estado de el modal
  const [modal, setModal] = React.useState({
    show: false,
    title: "cargando",
    message: "hola como estas",
    loading: true,
    disabled: true,
  });

  const [actualDate, setactualDate] = useState("");
  let collectionData

  const [formFields, setFormFields] = useState([])

  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  }

  const submit = (e) => {
    e.preventDefault();
    console.log(formFields)
  }

  const addFields = () => {
    let object = {
      account: '',
      percent: ''
    }
    if (formFields.length == 6) {
      return
    }
    setFormFields([...formFields, object])
  }

  const removeFields = (index) => {
    let data = [...formFields];
    data.splice(index, 1)
    setFormFields(data)
  }

  const APIURL = process.env.REACT_APP_API_TG
  //guardara todos los valores del formulario
  const pru = (parseInt(Math.random() * 100000) + 1);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: 0,
      culture: "",
      country: "",
      image: "",
      date: "",
      hrs: "",
      min: "",
      titleCol: "",
      descriptionCol: "",
      contractCol: "",
    },
    //validaciones
    validationSchema: Yup.object({
      title: Yup.string()
        .max(30, t("MintNFT.maxTitle"))
        .required(t("MintNFT.required"))
        .min(5, t("MintNFT.minTitle")),

      description: Yup.string()
        .max(1000, t("MintNFT.maxDesc"))
        .required(t("MintNFT.required"))
        .min(5, t("MintNFT.minDesc")),

      // price: Yup.number()
      //   .required(t("MintNFT.required"))
      //   .positive(t("MintNFT.posPrice"))
      //   .moreThan(0.09999999999999, t("MintNFT.morePrice"))
      //   .min(0.1, t("MintNFT.minPrice")),


      image: Yup.string().required(t("MintNFT.required")),
    }),
    onSubmit: async (values) => {
      //evitar que el usuario pueda volver a hacer click hasta que termine el minado
      setmint({ ...mint, onSubmitDisabled: true });
      let account;
      if (mint.blockchain == "0") {
        //primero nos aseguramos de que la red de nuestro combo sea igual a la que esta en metamask
        await syncNets();

        //la cuenta a la cual mandaremos el token
        account = await getSelectedAccount();
        //console.log(account);
      }

      //cargamos el modal
      // console.log(JSON.stringify(values))
      const fecha = values.date.split('-')
      let dateSTR = fecha[1] + '-' + fecha[2] + '-' + fecha[0]
      // console.log(dateSTR)
      const date = new Date(dateSTR)
      date.setDate(date.getDate())
      date.setHours(values.hrs)
      date.setMinutes(values.min)
      if (date < Date.now()) {
        alert("La fecha y hora para la subasta debe de ser mayor a la fecha y hora actual")
        window.location.reload();
        return
      }
      let token;
      if (mint.blockchain == "0") {
        //los datos de la transacccion
        token = await getContract()
          .methods.minar(
            account,
            JSON.stringify(values),
            fromETHtoWei(values.price)
          )
          .send({ from: account })
          .catch((err) => {
            return err;
          });
      } else {
        let percentage = 0
        let royalties = {}
        let success = true
        let royalText = ""
        console.log(formFields)
        if (formFields.length > 0) {
          formFields.map(async (data, index) => {
            if (data.account == "" || data.percent == "") {
              Swal.fire({
                title: t("MintNFT.swVoid"),
                text: t("MintNFT.swVoidTxt"),
                icon: 'error',
                confirmButtonColor: '#E79211'
              })
              setmint({ ...mint, onSubmitDisabled: false });
              success = false
              return
            }
            if (!data.account.includes(process.env.REACT_APP_NEAR_ENV == "mainnet" ? ".near" : ".testnet")) {
              Swal.fire({
                title: t("MintNFT.swNet"),
                text: t("MintNFT.swNetTxt") + (process.env.REACT_APP_NEAR_ENV == "mainnet" ? ".near" : ".testnet"),
                icon: 'error',
                confirmButtonColor: '#E79211'
              })
              setmint({ ...mint, onSubmitDisabled: false });
              success = false
              return
            }
            let account = data.account
            let percent = data.percent
            percentage = percentage + parseFloat(percent)
            console.log(index)
            let info = JSON.parse('{"' + account + '" : ' + (percent * 100) + '}')
            royalText = royalText + account + " : " + percent + "%<br>"
            royalties = { ...royalties, ...info }
          })
          console.log(royalties)
          console.log(percentage)
          if (percentage > 50) {
            Swal.fire({
              title: t("MintNFT.swPer"),
              text: t("MintNFT.swPerTxt"),
              icon: 'error',
              confirmButtonColor: '#E79211'
            })
            success = false
            setmint({ ...mint, onSubmitDisabled: false });
            return
          }
        }

        let contract = await getNearContract();
        const data = await contract.account.connection.provider.block({
          finality: "final",
        });
        const dateActual = (data.header.timestamp) / 1000000;
        const owner = await getNearAccount()
        console.log(fromNearToYocto(values.price))
        let payload = {
          metadata: {
            title: values.title,
            description: values.description,
            media: values.image,
          },
          receiver_id: owner
        }
        let amount = fromNearToYocto(process.env.REACT_APP_FEE_CREATE_NFT);
        console.log(royalText)
        if (success) {
          if (Object.keys(royalties) != 0) {
            payload = { ...payload, ...{ perpetual_royalties: royalties } }
            Swal.fire({
              title: t("MintNFT.swVer"),
              html: royalText,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#E79211',
              cancelButtonColor: '#d33',
              confirmButtonText: "Crear NFT"
            }).then(async (result) => {
              if (result.isConfirmed) {
                console.log("Creando NFT")
                let tokenres = await contract.nft_mint(
                  payload,
                  300000000000000,
                  amount,
                )
              }
              else if (result.isDismissed) {
                setmint({ ...mint, onSubmitDisabled: false });
              }
            })
          }
          else {
            let tokenres = await contract.nft_mint(
              payload,
              300000000000000,
              amount,
            )
          }
          console.log(payload)
        }
        // let tokenres = await contract.nft_mint(
        //   payload,
        //   300000000000000,
        //   amount,
        // )
      }
      //if de error

    },
  });

  /**
   * hace que cuando se toque la imagen se cambien el valor de touch de formik
   */
  function imageClick() {
    formik.setFieldTouched("image");
  }
  /**
   * cada vez que el usuario cambia de archivo se ejecuta esta funcion
   *
   */
  function imageChange(e) {
    const { file, reader } = Reader(e);

    if (file) {
      //asignar imagen de preview
      setmint({ ...mint, file: URL.createObjectURL(e.target.files[0]) });

      //una vez que cargue el arhcivo lo mandamos a ipfs
      //una vez que cargue el arhcivo lo mandamos a ipfs

      //una vez que cargue
      reader.onloadend = function () {
        //subimos la imagen a ipfs
        uploadFile(file.name, reader.result).then(({ hash }) => {
          formik.setFieldValue("image", hash);
          console.log(hash)
        })

      };
    }
  }
  const format = (v) => {
    return v < 10 ? "0" + v : v;
  }
  const fechaActual = async () => {
    let contract = await getNearContract();
    const data = await contract.account.connection.provider.block({
      finality: "final",
    });
    const dateActual = new Date((data.header.timestamp) / 1000000);
    const fs = format(dateActual.getFullYear()) + "-" + (format(dateActual.getMonth() + 1)) + "-" + format(dateActual.getDate());
    setactualDate(fs)
  }

  return (
    <section className="text-gray-600 body-font">
      {loading ?
        <>
          <div className="grid grid-cols-1 gap-4 place-content-center items-center">
            <h1 className="text-5xl font-semibold pt-60 text-center ">{t("MintNFT.load")}</h1>
            <h1 className="text-5xl font-semibold pt-10 text-center ">{t("MintNFT.loadMsg")}</h1>
          </div>

        </>
        :
        <>
          {/* {collection ? */}
          <>
            <form
              onSubmit={formik.handleSubmit}
              className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center"
            >
              <div className=" md:w-1/2 lg:w-3/4 w-5/6 mb-10 md:mb-0 items-center relative ">
                {mint?.file && (
                  <img
                    className="bg-cover bg-center rounded "
                    alt="hero"
                    src={mint?.file}
                  />
                )}
                <label
                  className={` title-font sm:text-4xl text-3xl  font-medium absolute inset-0  w-full flex flex-col items-center   rounded-lg  tracking-wide uppercase  cursor-pointer justify-center`}
                >
                  <div
                    className={`flex  rounded-xlarge  w-full md:3/4  mx-0     mb-2 bg-gradient-to-b p-[2px] from-yellow  to-brown "
                      }
              `}
                  >
                    {mint?.file ? 
                    <div className="font-open-sans flex flex-col leading-7 text-sm h-[45px] dark:bg-white dark:text-darkgray   rounded-xlarge justify-center focus-visible:outline-none text-center  shadow-brown-s w-full font-bold">{t("MintNFT.changeImg")}</div> : 
                    <div className="font-open-sans flex flex-col leading-7 text-sm h-[45px] dark:bg-white dark:text-darkgray   rounded-xlarge justify-center focus-visible:outline-none text-center  shadow-brown-s w-full font-bold">
                    {t("MintNFT.upImg")}</div>}
                  </div>
                  <input
                    onChange={imageChange}
                    onClick={imageClick}
                    type="file"
                    id="image"
                    name="image"
                    className={`  hidden `}
                    accept={acceptedFormats}
                  />
                </label>
                {formik.touched.image && formik.errors.image ? (
                  <div className="flex leading-7 text-sm text-red-600 text-center mb-20 justify-center">
                    {formik.errors.image}
                  </div>
                ) : null}
              </div>
              <div className=" lg:w-full md:w-1/2 w-full lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center pb-4">
                <div className="flex flex-row w-full md:justify-start justify-center items-end">
                  <div className="relative mr-4  w-3/4">
                    <div className="flex justify-between ">
                      <label
                        htmlFor="title"
                        className=" font-open-sans leading-7 text-sm font-bold dark:text-darkgray  uppercase"
                      >
                        {t("MintNFT.titleTxt")}
                      </label>
                      {formik.touched.title && formik.errors.title ? (
                        <div className="leading-7 text-sm text-red-600">
                          {formik.errors.title}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex  rounded-xlarge  w-full h-[45px] mx-0     mb-2 bg-gradient-to-b p-[2px] from-yellow  to-brown ">
                      <input
                        type="text"
                        id="title"
                        name="title"
                        {...formik.getFieldProps("title")}
                        className={`font-open-sans  flex flex-col  h-full dark:bg-white dark:text-darkgray   text-left rounded-xlarge justify-center focus-visible:outline-none focus-visible:shadow-s focus-visible:shadow-s focus-visible:shadow-brown-s w-full`}
                      />
                    </div>

                    {/* <div className="flex justify-between ">
                <label
                  htmlFor="price"
                  className="leading-7 text-sm text-gray-600"
                >

                  {t("MintNFT.priceTxt")}
                  {" " +
                    currencys[parseInt(localStorage.getItem("blockchain"))]}
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
              /> */}
                    <div className="flex justify-between ">
                      <label
                        htmlFor="description"
                        className="leading-7 text-sm dark:text-darkgray font-bold  font-open-sans uppercase "
                      >
                        {t("MintNFT.descTxt")}
                      </label>
                      {formik.touched.description && formik.errors.description ? (
                        <div className="leading-7 text-sm text-red-600">
                          {formik.errors.description}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex  rounded-xlarge  w-full h-[45px] mx-0     mb-2 bg-gradient-to-b p-[2px] from-yellow  to-brown ">
                      <textarea
                        type="textarea"
                        id="description"
                        name="description"
                        rows="5"
                        {...formik.getFieldProps("description")}
                        className={`font-open-sans flex flex-col  h-full dark:bg-white dark:text-darkgray   text-left rounded-xlarge justify-center focus-visible:outline-none focus-visible:shadow-brown-s w-full`}
                      />
                    </div>


                    <div className="flex justify-between ">
                      <label
                        htmlFor="royalties"
                        className="leading-7 text-sm font-bold dark:text-darkgray  font-open-sans uppercase"
                      >
                        {t("MintNFT.lblRoyalties")}
                      </label>
                    </div>

                    <div>
                      <div>
                        {formFields.map((form, index) => {
                          return (
                            <div key={index} className="w-full flex  gap-4 mt-1">
                              <div className="flex  rounded-xlarge  w-7/12 h-[45px] mx-0     mb-2 bg-gradient-to-b p-[2px] from-yellow  to-brown ">
                                <input
                                name='account'
                                placeholder={t("MintNFT.placeAccount")}
                                className="font-open-sans flex flex-col  h-full dark:bg-white dark:text-darkgray  text-left rounded-xlarge justify-center focus-visible:outline-none  focus-visible:shadow-brown-s w-full"
                                onChange={event => handleFormChange(event, index)}
                                value={form.name}
                              />
                              </div>
                              
                              <div className="flex  rounded-xlarge  w-3/12 h-[45px] mx-0    mb-2 bg-gradient-to-b p-[2px] from-yellow  to-brown ">
                                <input
                                  type="number"
                                  min="0.1"
                                  step="0.1"
                                  name='percent'
                                  placeholder={t("MintNFT.placePercent")}
                                  className="font-open-sans flex flex-col  h-full dark:bg-white dark:text-darkgray   text-left rounded-xlarge justify-center focus-visible:outline-none  focus-visible:shadow-brown-s w-full "
                                  onChange={event => handleFormChange(event, index)}
                                  value={form.age}
                                />
                              </div>
                              <button type="button" onClick={() => removeFields(index)} className="w-2/12 rounded-xlarge mb-2 content-fit font-bold dark:text-darkgray  bg-red-600 border-0 py-2 focus:outline-none hover:bg-brown  text-sm uppercase font-open-sans">
                                      <svg fill="#000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="20px" height="24px"><path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"/></svg>                             
                              </button>
                            </div>
                          )
                        })}
                      </div>

                      <button type="button" onClick={addFields} className="mt-2 w-7/12  rounded-xlarge dark:text-darkgray  bg-lime-600 border-0 py-2 px-6 focus:outline-none hover:bg-brown  text-base uppercase font-open-sans">{t("MintNFT.btnRoyalties")}</button>
                    </div>



                    <button
                      type="submit"
                      className={` mt-12 w-full rounded-xlarge  dark:text-darkgray  bg-yellow2 border-0 py-2 px-6 focus:outline-none hover:bg-brown  text-lg font-open-sans uppercase `}
                      disabled={mint?.onSubmitDisabled}
                    >
                      {t("MintNFT.createNFT")}
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <Modal {...modal} />
          </>
        </>}


    </section>
  );
}

LightHeroE.defaultProps = {
  theme: "yellow",
};

LightHeroE.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default LightHeroE;
