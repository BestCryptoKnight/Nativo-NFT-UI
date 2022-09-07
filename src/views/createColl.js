import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { useParams, useHistory } from "react-router-dom";
import { acceptedFormats, currencys } from "../utils/constraint";
import icon from "../assets/img/iconoColeccion.png"
import banner from "../assets/img/portadaColeccion.jpg"
import ImageUploader from 'react-images-upload';
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
import { Reader2, uploadFile2 } from '../utils/fleek2';
import { uploadFileAPI } from '../utils/pinata'
import Swal from 'sweetalert2'
import { useTranslation } from "react-i18next";
import { useWalletSelector } from "../utils/walletSelector";

function LightHeroE(props) {
  //este estado contiene toda la info de el componente
  const { selector, modal, accounts, accountId } = useWalletSelector();
  const [mint, setmint] = React.useState({
    fileIcon: undefined,
    fileBanner: undefined,
    blockchain: localStorage.getItem("blockchain"),
  });

  function onDrop(picture) {
    console.log(picture[0])
    imageChangeIcon(picture)
  }

  const [t, i18n] = useTranslation("global")
  const [combo, setcombo] = useState(true);
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [mediaIcon, setMediaIcon] = useState("")
  const [mediaBanner, setMediaBanner] = useState("")
  const [txtBttnIcon, setTxtBttnIcon] = useState(t("CreateCol.btnImg-1"))
  const [txtBttnBanner, setTxtBttnBanner] = useState(t("CreateCol.btnImg-1"))
  const [colId, setColId] = useState()
  const [visibility, setVisibility] = useState(false)
  const [type, setType] = useState(false)
  
  
  

  const [actualDate, setactualDate] = useState("");
  let collectionData
  const APIURL = process.env.REACT_APP_API_TG


  function handleVisibility(){
    let state = document.getElementById('visibility')
    console.log(state.checked)
    setVisibility(state.checked)
  }

  const { state } = useParams();
  //guardara todos los valores del formulario
  const pru = (parseInt(Math.random() * 100000) + 1);

  useEffect(() => {
    (async () => {
      let urlParams = new URLSearchParams(window.location.search);
      let execTrans = urlParams.has('transactionHashes')
      let type = state.split(',')
      if(type[0]=="edit"){
        if (execTrans){
          Swal.fire({
            title: t("CreateCol.swEditedTit"),
            text: t('CreateCol.swEditedDesc'),
            icon: 'success',
            confirmButtonColor: '#E79211'
          }).then(function () {
            window.location.href = "/collection/"+type[1]
          })
        }
        let id = await getNearAccount()
        console.log("Entro a editar coleccion")
        setType(true)
        let userData
        const query = `
          query ($id: String){
            collections (where : {id : $id}){
              id
              owner_id
              collectionID
              title
              description
              mediaIcon
              mediaBanner
              visibility
            }
          }
        `
        const client = new ApolloClient({
          uri: APIURL,
          cache: new InMemoryCache(),
        })
        console.log(type)
        await client.query({
            query: gql(query),
            variables: {
              id: type[1]
            }
        })
        .then((data)=> {
          console.log('profile: ',data.data.collections[0])
          collectionData = data.data.collections[0]
        })
        .catch((err) =>{
          console.log('error: ',err)
        })
        if(collectionData.owner_id == await getNearAccount()){
          setColId(collectionData.collectionID)
          setTitle(collectionData.title)
          setDesc(collectionData.description)
          setMediaBanner(collectionData.mediaBanner)
          setMediaIcon(collectionData.mediaIcon)
          setVisibility(collectionData.visibility)
          document.getElementById('visibility').checked = collectionData.visibility
          setTxtBttnIcon(t("CreateCol.btnImg-3"))
          setTxtBttnBanner(t("CreateCol.btnImg-3"))
        }
        else{
          window.location.href('/collectionData/create')
        }
      }
      else{
        if (execTrans){
          Swal.fire({
            title: t("CreateCol.swCreatedTit"),
            text: t('CreateCol.swCreatedDesc'),
            icon: 'success',
            confirmButtonColor: '#E79211'
          }).then(function () {
            window.location.href = "/mynfts"
          })
        }
      }
    })()
  },[])

  const formik = useFormik({
    initialValues: {
      titleCol: "",
      descriptionCol: "",
    },
    //validaciones
    validationSchema: Yup.object({
     
    }),
    
  });

  async function saveCollection() {
    // console.log("Hola");
    let contract = await getNearContract();
    const owner = await getNearAccount()
    let payloadCol
    if(type){
      payloadCol = {
        title: title,
        description: desc,
        media_icon: mediaIcon,
        media_banner: mediaBanner,
        visibility: visibility,
        _id: colId,
        _type: "edit"
      }
    }
    else{
      payloadCol = {
        title: title,
        description: desc,
        media_icon: mediaIcon,
        media_banner: mediaBanner,
        visibility: visibility,
        _id: "0",
        _type: "create"
      }
    }
    console.log(payloadCol);
    // console.log(desc);
    if (title == "" || desc == "" || mediaIcon == "" || mediaBanner == "") {
      Swal.fire({
        icon: 'error',
        html:
                '<div>'+
                '<div class="font-open-sans dark:text-darkgray text-xl font-bold">' +  t("CreateCol.err1-title") + '</div>'+ 
                '<div class="font-open-sans dark:text-darkgray  text-sm">' + t("CreateCol.err1-msg")+ '</div>'+
                '</div>',
        confirmButtonColor: '#E79211'
      })
      return
    } else if (title.length < 1) {
      Swal.fire({
        icon: 'error',
        html:
                '<div>'+
                '<div class="font-open-sans dark:text-darkgray text-xl font-bold">' +  t("CreateCol.err2-title") + '</div>'+ 
                '<div class="font-open-sans dark:text-darkgray  text-sm">' + t("CreateCol.err2-msg")+ '</div>'+
                '</div>',
        confirmButtonColor: '#E79211'
      })
      return
    } else if (desc.length < 30) {
      Swal.fire({
        html:
        '<div>'+
        '<div class="font-open-sans dark:text-darkgray text-xl font-bold">' +  t("CreateCol.err3-title") + '</div>'+ 
        '<div class="font-open-sans dark:text-darkgray  text-sm">' + t("CreateCol.err3-msg")+ '</div>'+
        '</div>',
        icon: 'error',
        confirmButtonColor: '#E79211'
      })
      return
    }
    const wallet = await selector.wallet();
    wallet.signAndSendTransaction({
      signerId: accountId,
      receiverId: process.env.REACT_APP_CONTRACT_MARKET,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "add_new_user_collection",
            args: payloadCol,
            gas: 300000000000000,
            deposit: 1,
          }
        }
      ]
    })
    // Swal.fire({
    //   html:
    //   '<div>'+
    //   '<div class="font-open-sans dark:text-darkgray text-xl font-bold">' +  t("CreateCol.succ-title") + '</div>'+ 
    //   '<div class="font-open-sans dark:text-darkgray  text-sm">' + t("CreateCol.succ-msg")+ '</div>'+
    //   '</div>',
    //   icon: 'success',
    // }).then(function () {
    //   window.location.href = "/create"
    // })
  }

  /**
   * hace que cuando se toque la imagen se cambien el valor de touch de formik
   */
  function imageClickIcon() {
    formik.setFieldTouched("imageIcon");
  }
  function imageClickBanner() {
    formik.setFieldTouched("imageBanner");
  }
  /**
   * cada vez que el usuario cambia de archivo se ejecuta esta funcion
   *
   */

  async function uploadIconPinata(picture){
    setTxtBttnIcon(t("CreateCol.btnImg-2"))
    let file = picture.pop()
    let cid = await uploadFileAPI(file)
    setmint({ ...mint, fileIcon: URL.createObjectURL(file) });
    formik.setFieldValue("image", cid);
    setMediaIcon(cid)
    setTxtBttnIcon(t("CreateCol.btnImg-3"))
    console.log(cid)
  }

  async function uploadBannerPinata(picture){
    setTxtBttnBanner(t("CreateCol.btnImg-2"))
    let file = picture.pop()
    let cid = await uploadFileAPI(file)
    setmint({ ...mint, fileBanner: URL.createObjectURL(file) });
    formik.setFieldValue("image", cid);
    setMediaBanner(cid)
    setTxtBttnBanner(t("CreateCol.btnImg-3"))
    console.log(cid)
  }

  function imageChangeIcon(picture) {
    setTxtBttnIcon(t("CreateCol.btnImg-2"))
    let data = picture.pop()
    const { file, reader } = Reader2(data);
    console.log(data)
    if (file) {
      //asignar imagen de preview

      setmint({ ...mint, fileIcon: URL.createObjectURL(data) });

      //una vez que cargue el arhcivo lo mandamos a ipfs
      //una vez que cargue el arhcivo lo mandamos a ipfs

      //una vez que cargue
      reader.onloadend = function () {
        //subimos la imagen a ipfs
        uploadFile2(file.name, reader.result).then(({ hash }) => {
          // //console.log(result);
          //console.log(`https://nativonft.mypinata.cloud/ipfs/${hash}`);
          formik.setFieldValue("image", hash);
          setMediaIcon(hash)
          setTxtBttnIcon(t("CreateCol.btnImg-3"))
        })

      };
    }
  }



  function imageChangeBanner(picture) {
    setTxtBttnBanner(t("CreateCol.btnImg-2"))
    let data = picture.pop()
    const { file, reader } = Reader2(data);
    if (file) {
      //asignar imagen de preview
      setmint({ ...mint, fileBanner: URL.createObjectURL(data) });

      //una vez que cargue el arhcivo lo mandamos a ipfs
      //una vez que cargue el arhcivo lo mandamos a ipfs
      //una vez que cargue
      reader.onloadend = function () {
        //subimos la imagen a ipfs
        console.log(this)
        uploadFile2(file.name, reader.result).then(({ hash }) => {
          // //console.log(result);
          //console.log(`https://nativonft.mypinata.cloud/ipfs/${hash}`);
          formik.setFieldValue("image", hash);
          setMediaBanner(hash)
          setTxtBttnBanner(t("CreateCol.btnImg-3"))
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
    //console.log(fs)
    setactualDate(fs)
  }

  return (
    <>
      <div className=" mx-auto text-gray-600 body-font flex flex-col bg-crear-background bg-contain bg-no-repeat">
        <div className="">
          <h1 className=" w-full font-raleway font-bold text-center py-10 text-3xl md:text-6xl text-darkgray uppercase">
            {type ? t("CreateCol.title2")+" "+colId : t("CreateCol.title")}
          </h1>
          <div className="items-center px-6 ">
            <div className="flex flex-col lg:flex-row lg:flex-nowrap items-center  bg-white   mb-4 rounded-xlarge">
              <div className="w-full lg:w-1/2 px-6 mb-6">
                <div className="flex justify-between">
                  <label
                    htmlFor="titleCol"
                    className="leading-7 text-sm dark:text-darkgray uppercase font-semibold font-raleway"
                  >
                    {t("CreateCol.titleCol")}
                  </label>
                  {formik.touched.titleCol && formik.errors.titleCol ? (
                    <div className="leading-7 text-sm text-red-600">
                      {formik.errors.titleCol}
                    </div>
                  ) : null}
                </div>

                <div className="flex  rounded-xlarge  w-full  h-[45px] mx-0   mb-2 bg-gradient-to-b p-[2px] from-yellow  to-brown ">
                <input
                  type="text"
                  id="titleCol"
                  name="titleCol"
                  {...formik.getFieldProps("titleCol")}
                  value={title}
                  placeholder={t("CreateCol.placeTitle")}
                  onChange={e => { setTitle(e.target.value) }}
                  className={` font-open-sans  flex flex-col  h-full dark:bg-white dark:text-darkgray   text-left rounded-xlarge justify-center focus-visible:outline-none focus-visible:shadow-s focus-visible:shadow-s focus-visible:shadow-brown-s w-full `}
                />
                </div>

                <div className="flex justify-between ">
                  <label
                    htmlFor="descriptionCol"
                    className="leading-7 text-sm  dark:text-darkgray  uppercase font-semibold font-raleway"
                  >
                    {t("CreateCol.descripCol")}
                  </label>
                  {formik.touched.descriptionCol && formik.errors.descriptionCol ? (
                    <div className="leading-7 text-sm text-red-600">
                      {formik.errors.descriptionCol}
                    </div>
                  ) : null}
                </div>
                <div className="flex  rounded-xlarge  w-full  h-[45px] mx-0   mb-2 bg-gradient-to-b p-[2px] from-yellow  to-brown ">
                <input
                  type="text"
                  id="titleCol"
                  name="titleCol"
                  {...formik.getFieldProps("titleCol")}
                  placeholder={t("CreateCol.placeDesc")}
                  value={desc}
                  onChange={e => { setDesc(e.target.value) }}
                  className={` font-open-sans  flex flex-col  h-full dark:bg-white dark:text-darkgray   text-left rounded-xlarge justify-center focus-visible:outline-none focus-visible:shadow-s focus-visible:shadow-s focus-visible:shadow-brown-s w-full `}
                />
                </div>
                <div className="flex">
                  <div className="flex items-center h-5">
                      <input id="visibility" onClick={handleVisibility} type="checkbox" value="" className="w-5 h-5 text-yellow appearance-none checked:bg-yellow2 bg-gray-300 rounded border-gray-300 focus:ring-yellow3 focus:ring-2 ring-inset"/>
                  </div>
                  <div className="ml-2 text-sm">
                      <label htmlFor="visibility" className="text-sm dark:text-darkgray uppercase font-semibold font-raleway">{t("CreateCol.visibility")}</label>
                      <p id="helper-checkbox-text" className="text-xs  dark:text-darkgray uppercase font-semibold font-raleway">{t("CreateCol.vis-msg")}</p>
                  </div>
                </div>
                

              </div>
              <div className="w-full lg:w-1/2 px-6 mb-6">
                <div className="flex flex-col lg:flex-row items-center text-center">
                  <div className="lg:w-2/5 w-full">
                    <label className="leading-7 text-sm  dark:text-darkgray  uppercase font-semibold font-raleway">{t("CreateCol.iconCol")}</label>
                  </div>
                  <div className="lg:w-3/5 w-full">
                    <ImageUploader
                      withIcon={false}
                      buttonText={txtBttnIcon}
                      buttonClassName="yellow-button"
                      onChange={uploadIconPinata}
                      imgExtension={['.jpg', '.gif', '.png', '.gif', '.jpeg', '.webp']}
                      maxFileSize={5242880}
                      singleImage={true}
                      withLabel={true}
                      label={t("CreateCol.lblIcon-1")}
                      fileSizeError={t("CreateCol.errSize-1")}
                      fileTypeError={t("CreateCol.errFile")}
                    />
                  </div>

                </div>
                <div className="flex flex-col lg:flex-row items-center text-center">
                  <div className="lg:w-2/5 w-full">
                    <label className="leading-7 text-sm  dark:text-darkgray  uppercase font-semibold font-raleway">{t("CreateCol.bannerCol")}</label>
                  </div>
                  <div className="lg:w-3/5 w-full">
                    <ImageUploader
                      withIcon={false}
                      buttonText={txtBttnBanner}
                      buttonClassName="yellow-button"
                      onChange={uploadBannerPinata}
                      imgExtension={['.jpg', '.gif', '.png', '.gif', '.jpeg', '.webp']}
                      maxFileSize={10485760}
                      singleImage={true}
                      withLabel={true}
                      label={t("CreateCol.lblIcon-2")}
                      fileSizeError={t("CreateCol.errSize-2")}
                      fileTypeError={t("CreateCol.errFile")}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className=" w-full px-6 mb-6 lg:mb-0 text-center place-items-center flex flex-col">
            <p className="font-semibold font-raleway text-darkgray">{t("CreateCol.msg-1")}</p>
            <div className="mt-4 mb-4 lg:w-1/6 relative group rounded-xlarge ">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#f2b159] to-[#ca7e16] rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt group-hover:-inset-1"></div>
              <button
                onClick={() => saveCollection()}
                className={`relative lg:w-full text-white bg-yellow2 py-2 lg:px-6 px-2 uppercase rounded-xlarge lg:text-lg text-base font-raleway font-bold`}
              >
                {type ? t("CreateCol.editBtn") : t("CreateCol.createBtn")}
              </button>
            </div>
            
            <p className="font-semibold font-raleway text-darkgray">{t("CreateCol.msg-2")}</p>
          </div>
        </div>
        <div className="">
          <div className={`container px-5 py-6 pt-6 mx-auto flex flex-wrap flex-col text-center items-center `}>
            <img
              className="object-cover h-96 w-full rounded-3xl  z-0 opacity-80 brightness-[.75] blur-sm"
              src={mediaBanner == "" ? icon : `https://nativonft.mypinata.cloud/ipfs/${mediaBanner}`}
            />
            <img
              className="object-cover h-48 w-48 rounded-3xl border-solid border-4 border-slate-700 z-10 -mt-96"
              src={mediaIcon == "" ? banner : `https://nativonft.mypinata.cloud/ipfs/${mediaIcon}`}
            />
            <div className="z-10 -mt-120 w-full text-white">
              <div className="bg-white lg:mx-20 mx-5 text-black mt-4 pt-2 rounded-t-2xl bg-opacity-80 rounded-xlarge">
                <h1 className="lg:text-5xl text-3xl font-bold pb-4 opacity-100 font-raleway text-darkgray">{title == "" ? t("CreateCol.demoTitle") : title}</h1>
                <p className="lg:text-xl text-base px-2 pb-3 font-raleway text-darkgray">{desc == "" ? t("CreateCol.demoDescrip") : desc}</p>
                <div className="grid grid-cols-2 divide-x pb-3 mx-auto stroke-gray-700">
                  <div>
                    <p className="lg:text-xl text-base pb-1 lg:text-right text-center lg:mr-5 ml-1 font-raleway text-darkgray"><b>{t("CreateCol.creator")}</b><br/>{t("CreateCol.userAcc")}</p>
                  </div>
                  <div>
                    <p className="lg:text-xl text-base pb-1 lg:text-left text-center lg:ml-5 mr-1 font-raleway text-darkgray"><b>{t("CreateCol.contract")}</b><br/>{t("CreateCol.userCont")}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 divide-x gap-1 bg-yellow-400 rounded-b-2xl text-white lg:mx-20 mx-5 mx-auto text-center">
                <div className="pl-5">
                  <p className="lg:text-lg text-base pb-1 font-raleway text-darkgray"><b>{t("CreateCol.noTokens")}</b></p>
                  <p className="lg:text-base text-sm pb-1 font-raleway text-darkgray">0</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

LightHeroE.defaultProps = {
  theme: "yellow",
};

LightHeroE.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default LightHeroE;
