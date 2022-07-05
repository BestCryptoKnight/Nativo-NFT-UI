import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import { useParams, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { acceptedFormats, currencys } from "../utils/constraint";
import load from "../assets/landingSlider/img/loader.gif";
import uploadImg from "../assets/img/UPLOAD.png";
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
  ext_call
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
  const [t, i18n] = useTranslation("global")
  const [loading, setLoading] = useState(false);
  const [actualDate, setactualDate] = useState("");
  const [formFields, setFormFields] = useState([])
  const [type, setType] = useState(false)
  const [data, setData] = useState()

  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  }

  const submit = (e) => {
    e.preventDefault();
    console.log(formFields)
  }

  const { state } = useParams();

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
        .max(1000, t("MintNFT.maxDesc"))
        .required(t("MintNFT.required"))
        .min(5, t("Profile.minBio")),

      description: Yup.string()
        .max(15, t("Profile.maxSocial"))
        .min(4, t("Profile.minSocial")),

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
        let account = await getNearAccount()
        let action = "create"
        if (type){
          action = "edit"
        }
        let payload = {
          username: account,
          media: values.image,
          biography: values.title,
          social_media: values.description,
          _type: action
        }
        console.log(payload)
        ext_call(process.env.REACT_APP_CONTRACT_MARKET,'add_new_profile',payload,300000000000000,0)
        
      }
      //if de error

    },
  });


  React.useEffect(() => {
    (async () => {
      let type = state
      if(type=="edit"){
        let account = await getNearAccount()
        console.log("Entro a editar")
        setType(true)
        let userData
        const query = `
          query ($account: String){
            profiles (where : {id : $account}){
              id
              media
              biography
              socialMedia
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
        .then((data)=> {
          console.log('profile: ',data.data.profiles[0])
          userData = data.data.profiles[0]
        })
        .catch((err) =>{
          console.log('error: ',err)
        })
        formik.setFieldValue('title',userData.biography)
        formik.setFieldValue('description',userData.socialMedia)
        formik.setFieldValue("image", userData.media);
        setmint({ ...mint, file: `https://nativonft.mypinata.cloud/ipfs/${userData.media}` });
      }
    })()
  },[])
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
    <section className="text-gray-600 body-font bg-darkgray bg-cover bg-no-repeat">
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
          <div className="font-raleway font-bold text-center py-10 text-3xl md:text-6xl text-white uppercase">{type?t("Profile.title2"):t("Profile.title")}</div>
            <form
              onSubmit={formik.handleSubmit}
              className="container mx-auto flex px-5 py-10 md:pt-0 lg:pt-5 lg:pb-24 md:flex-row flex-col items-center"
            >
              <div className=" md:w-1/2 lg:w-3/4 w-5/6 mb-10 md:mb-0 items-center relative pt-10 md:pt-0">
                {mint?.file && (
                  <img
                    className="rounded m-auto "
                    width="50%"
                    alt="hero"
                    src={mint?.file}
                  />
                )}
                <label
                  className={` title-font sm:text-4xl text-3xl  font-medium absolute inset-0  w-full lg:w-3/4 mx-auto flex flex-col items-center   rounded-lg  tracking-wide uppercase  cursor-pointer justify-center`}
                >
                  <div
                    className={`flex  rounded-xlarge  w-full   mx-0     mb-2 bg-gradient-to-b p-[2px] from-yellow  to-brown font-open-sans  flex-col leading-7 "
                      }
              `}
                  >
                    {mint?.file ? 
                    <div className="flex flex-col leading-7 text-sm h-[45px] dark:bg-white dark:text-darkgray   rounded-xlarge justify-center focus-visible:outline-none text-center  shadow-brown-s w-full font-semibold font-raleway">{t("MintNFT.changeImg")}</div> : 
                    <div className="flex flex-col leading-7 text-sm h-[170px] lg:h-[300px] dark:bg-white dark:text-darkgray   rounded-xlarge justify-center focus-visible:outline-none text-center  shadow-brown-s w-full font-semibold font-raleway">
                    <img src={uploadImg} className="h-[150px] lg:h-[250px] object-contain"></img><span className="text-sm">{t("Profile.upImg")}</span></div>}
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
                  <div className="flex leading-7 text-sm text-red-600 text-center mb-10 justify-center  font-open-sans">
                    {formik.errors.image}
                  </div>
                ) : null}
              </div>
              <div className=" lg:w-full md:w-1/2 w-full lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center pb-4 mt-12 md:mt-0">
                <div className="flex flex-row w-full md:justify-start justify-center items-end">
                  <div className="relative mr-4  w-3/4">
                    <div className="flex justify-between ">
                      <label
                        htmlFor="title"
                        className=" leading-7 text-sm  dark:text-white  uppercase font-semibold font-raleway"
                      >
                        {t("Profile.biography")}
                      </label>
                      {formik.touched.title && formik.errors.title ? (
                        <div className="leading-7 text-sm text-red-600 font-open-sans">
                          {formik.errors.title}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex  rounded-xlarge  w-full  h-[45px] mx-0   mb-2 bg-gradient-to-b p-[2px] from-yellow  to-brown ">
                      <input
                        type="text"
                        id="title"
                        name="title"
                        {...formik.getFieldProps("title")}
                        className={`font-open-sans  flex flex-col  h-full dark:bg-white dark:text-darkgray   text-left rounded-xlarge justify-center focus-visible:outline-none focus-visible:shadow-s focus-visible:shadow-s focus-visible:shadow-brown-s w-full`}
                      />
                    </div>

                    <div className="flex justify-between ">
                      <label
                        htmlFor="description"
                        className="leading-7 text-sm dark:text-white  uppercase font-semibold font-raleway"
                      >
                        {t("Profile.twitter")} 
                      </label>
                      {formik.touched.description && formik.errors.description ? (
                        <div className="leading-7 text-sm text-red-600 font-open-sans">
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

                    <button
                      type="submit"
                      className={` mt-12 w-full rounded-xlarge  dark:text-darkgray  bg-yellow2 border-0 py-2 px-6 focus:outline-none hover:bg-brown  text-lg font-open-sans uppercase `}
                      disabled={mint?.onSubmitDisabled}
                    >
                      {type?t("Profile.title2"):t("Profile.createProfile")}
                    </button>
                  </div>
                </div>
              </div>
            </form>
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
