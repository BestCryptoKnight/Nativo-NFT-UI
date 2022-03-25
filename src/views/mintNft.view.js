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
  const [collTitle,setcollTitle] = useState("")
  const [colID, setColID] = useState("")
  const [t, i18n] = useTranslation("global")
  const [loading,setLoading] = useState(true);
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
  const APIURL = process.env.REACT_APP_API_TG
  useEffect(() => {
    const valores = window.location.search;
    const values = new URLSearchParams(valores)
    if(values.has('transactionHashes')){
      window.location.href ="/mynfts"
    }
    fechaActual();
    let ownerAccount
    async function getOwner() {

    }

    getOwner()
    const queryData = `
          query($owner: String){
            collections(where: {owner: $owner}) {
              id
              contract
              owner
              title
              description
              tokenCount
              collectionID
            }
          }
        `

    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    })
    async function obtenerColecciones() {
      ownerAccount = await getNearAccount()
      let contract = await getNearContract();
      // console.log(ownerAccount)
      // console.log(contract.contractId)
      await client
        .query({
          query: gql(queryData),
          variables: {
            owner: ownerAccount
          }
        })
        .then((data) => {
          console.log("collection data: ", data.data.collections)
          if (data.data.collections.length > 0) {
            // console.log('hay colecciones')
            setcollection(true)
            setCollecData(collecData.concat(data.data.collections))
            setLoading(false)
          }
          else {
            // console.log('no hay colecciones')
            setcollection(false)
            setLoading(false)
          }
        })
        .catch((err) => {
          console.log('Error ferching data: ', err)
        })
    }
    obtenerColecciones()
    
  }, [])
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

      price: Yup.number()
        .required(t("MintNFT.required"))
        .positive(t("MintNFT.posPrice"))
        .moreThan(0.09999999999999, t("MintNFT.morePrice"))
        .min(0.1, t("MintNFT.minPrice")),

      culture: Yup.string()
        .required(t("MintNFT.required"))
        .max(60, t("MintNFT.maxTags")),
        //.matches("(([A-Za-z0-9]+)\s?)((([A-Za-z0-9]+)\s){1,3})?(([A-Za-z0-9]+))?",'Minimo un tag maximo 5'),
      


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
        let contract = await getNearContract();
        const data = await contract.account.connection.provider.block({
          finality: "final",
        });
        const dateActual = (data.header.timestamp) / 1000000;
        const owner = await getNearAccount()
        console.log(fromNearToYocto(values.price))
        let newPayload = {
          address_contract: process.env.REACT_APP_MINTER_CONTRACT,//(comboCol? values.contractCol : contData),
          token_owner_id: owner,
          collection_id: colID,
          collection: collTitle,
          token_metadata: {
            title: values.title,
            description: values.description,
            media: values.image,
            media_hash: "hashhashhashhashhashhashhashhash",
            extra: "{'tags':'" + values.culture  + "','creator':'" + owner + "','price':'" + (fromNearToYocto(values.price))+ "','status': 'S" + "','on_sale':" + combo + ",'on_auction':" + (!combo) + ",'adressbidder':'accountbidder','highestbidder':'" + (!combo ? 0 : "notienealtos") + "','lowestbidder':'" + (!combo ? fromNearToYocto(values.price) : "notienebajos") + "','expires_at':'" + date.getTime() + "','starts_at':'" + dateActual + "'}"
            //extra: "{'culture':'Azteca','country':'Mexico','creator':'joehank.testnet','price':'10','on_sale':true,'on_auction':false,'adressbidder':'accountbidder','highestbidder':'notienealtos','lowestbidder':'notienebajos','expires_at':'noexpira','starts_at':'noinicia'}"
          },
        }
        // console.log(newPayload)
        // let payload = {
        //   token_owner_id: owner,
        //   token_metadata: {
        //     title: values.title,
        //     description: values.description,
        //     media: values.image,
        //     media_hash: "hashhashhashhashhashhashhashhash",
        //     extra: "{'culture':'" + values.culture + "','country':'" + values.country + "','creator':'" + owner + "','price':'" + (fromNearToYocto(values.price)) + "','on_sale':" + combo + ",'on_auction':" + (!combo) + ",'adressbidder':'accountbidder','highestbidder':'" + (!combo ? 0 : "notienealtos") + "','lowestbidder':'" + (!combo ? fromNearToYocto(values.price) : "notienebajos") + "','expires_at':'" + date.getTime() + "','starts_at':'" + dateActual + "'}"
        //     //extra: "{'culture':'Azteca','country':'Mexico','creator':'joehank.testnet','price':'10','on_sale':true,'on_auction':false,'adressbidder':'accountbidder','highestbidder':'notienealtos','lowestbidder':'notienebajos','expires_at':'noexpira','starts_at':'noinicia'}"
        //   },
        // };
        let amount = fromNearToYocto(process.env.REACT_APP_FEE_CREATE_NFT);
        console.log(newPayload)
        if(collTitle == ""){
          Swal.fire({
            title: t("MintNFT.sweetTitle"),
            text: t("MintNFT.sweetTxt"),
            icon: 'error',
            confirmButtonColor: '#E79211'
          }).then(function() {
            setmint({ ...mint, onSubmitDisabled: false });
            //window.location.href = "/minar"
          })
          return
        }
        // if(comboCol){
        //   let colResult = contract.Add_user_collection(
        //     payloadCol,
        //     300000000000000,
        //     amount,  
        //   )
        // }
        let tokenresult = await contract.market_mint_generic(
          newPayload,
          300000000000000,
          amount,
        )

        // Swal.fire({
        //   title: 'Colección creada',
        //   text: 'Tu colección ha sido creada',
        //   icon: 'success',
        // }).then(function() {
        //   window.location.href = "/"
        // })
        //console.log(contract);
        //console.log(payload);
        //console.log(fromYoctoToNear("5700000000000000000000"));
        
        // alert(payload);
        // let tokenresult = contract.minar(
        //   payload,
        //   300000000000000, // attached GAS (optional)
        //   amount
        // );


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
          // //console.log(result);
          //console.log(`https://ipfs.fleek.co/ipfs/${hash}`);
          formik.setFieldValue("image", hash);
          console.log(hash)
        })

      };
    }
    /*  //si selecciono un archivo, evita que nos de error si el usuario decide cancelar la carga
     if (e.target.files[0]) {
       //asignar imagen de preview
       setmint({ ...mint, file: URL.createObjectURL(e.target.files[0]) });
 
       //una vez que cargue el arhcivo lo mandamos a ipfs
       const reader = new FileReader();
       reader.readAsArrayBuffer(e.target.files[0]);
 
       //una vez que cargue
       reader.onloadend = async function () {
         //subimos la imagen a ipfs
         window.ipfs.add(reader.result).then(async (result) => {
           console.log(result);
           console.log(`https://ipfs.io/ipfs/${result.path}`);
 
           //agregamos el cid de ipfs  en el campo image
           formik.setFieldValue("image", result.path);
         });
       };
     } */
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
      {collection ?
      <>
        <form
        onSubmit={formik.handleSubmit}
        className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center"
      >
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0 items-center relative ">
          {mint?.file && (
            <img
              className="   bg-cover bg-center rounded "
              alt="hero"
              src={mint?.file}
            />
          )}
          <label
            className={` title-font sm:text-4xl text-3xl  font-medium absolute inset-0  w-full flex flex-col items-center   rounded-lg  tracking-wide uppercase  cursor-pointer justify-center`}
          >
            <div
              className={`my-4 title-font sm:text-4xl text-3xl w-full text-center ${mint?.file ? "text-white" : "bg-white border-solid border-4 py-20"
                }
              `}
            >
              {mint?.file ? t("MintNFT.changeImg") : t("MintNFT.upImg")}
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
            <div className="flex leading-7 text-sm text-red-600 text-center mt-20 justify-center">
              {formik.errors.image}
            </div>
          ) : null}
        </div>
        <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center pb-4">
          <h1 className=" w-full title-font sm:text-4xl text-3xl mb-12 font-medium text-gray-900">
            {t("MintNFT.title")}
          </h1>
          <div className="flex w-full md:justify-start justify-center items-end">
            <div className="relative mr-4 lg:w-full xl:w-1/2 w-3/4">
              {/* <select onChange={e=>{
                setcombo(e.target.value == "A la venta");
              }}>
                <option>A la venta</option>
                <option>En subasta</option>
              </select> */}

              {/* <select onChange={e => { setcomboCol(e.target.value == "Crear Nueva coleccion") }}>
                <option>Crear Nueva coleccion</option>
                {collection ? <option>Seleccionar coleccion</option> : ''}
              </select>

              {comboCol ?
                <>
                  <div className="flex justify-between ">
                    <label
                      htmlFor="titleCol"
                      className="leading-7 text-sm text-gray-600"
                    >
                      Título de la coleccion
                    </label>
                    {formik.touched.titleCol && formik.errors.titleCol ? (
                      <div className="leading-7 text-sm text-red-600">
                        {formik.errors.titleCol}
                      </div>
                    ) : null}
                  </div>

                  <input
                    type="text"
                    id="titleCol"
                    name="titleCol"
                    {...formik.getFieldProps("titleCol")}
                    className={`  w-full bg-gray-100 bg-opacity-50 rounded   focus:bg-transparent  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out `}
                  />

                  <div className="flex justify-between ">
                    <label
                      htmlFor="descriptionCol"
                      className="leading-7 text-sm text-gray-600"
                    >
                      Descripción de la coleccion
                    </label>
                    {formik.touched.descriptionCol && formik.errors.descriptionCol ? (
                      <div className="leading-7 text-sm text-red-600">
                        {formik.errors.descriptionCol}
                      </div>
                    ) : null}
                  </div>
                  <textarea
                    type="textarea"
                    id="descriptionCol"
                    name="descriptionCol"
                    rows="2"
                    {...formik.getFieldProps("descriptionCol")}
                    className={` resize-none border-none w-full bg-gray-100 bg-opacity-50 rounded   focus:bg-transparent  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out${props.theme}-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
                  />

                  <div className="flex justify-between ">
                    <label
                      htmlFor="contractCol"
                      className="leading-7 text-sm text-gray-600"
                    >
                      Contrato de la coleccion
                    </label>
                    {formik.touched.contractCol && formik.errors.contractCol ? (
                      <div className="leading-7 text-sm text-red-600">
                        {formik.errors.contractCol}
                      </div>
                    ) : null}
                  </div>

                  <input
                    type="text"
                    id="contractCol"
                    name="contractCol"
                    {...formik.getFieldProps("contractCol")}
                    className={`  w-full bg-gray-100 bg-opacity-50 rounded   focus:bg-transparent  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out `}
                  />
                </> */}
                {/* :
                <> */}
                <div className="pb-4">
                <a 
                className={`mt-12 w-full text-white bg-${props.theme}-500 border-0 py-2 px-6 focus:outline-none hover:bg-${props.theme}-600 rounded text-lg`}
                href="/createcollection">
                  {t("MintNFT.addColBtn")}
                </a>
                
                </div>
                  <label
                    htmlFor="title"
                    className="leading-7 text-sm text-gray-600"
                  >
                    {t("MintNFT.colName")}
                  </label>
                  <select onChange={e => {
                    // console.log(collecData.find(element => element.title == e.target.value).contract)
                    if(e.target.value=="Tus colecciones"){
                      setcollTitle("")
                    }
                    else{
                      setcontData(collecData.find(element => element.id == e.target.value).contract)
                      setColID(collecData.find(element => element.id == e.target.value).collectionID)
                      setcollTitle(collecData.find(element => element.id == e.target.value).title)
                    }
                  }
                  }>
                    <option>{t("MintNFT.userCol")}</option>
                    {
                      collecData.length > 0 ?
                        collecData.map((element) =>
                          <option key={element.id} value={element.id}>{element.title}</option>

                        ) : null
                    }</select>
                {/* </>} */}
              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-200"></div>

                <div className="flex-grow border-t border-gray-200"></div>
              </div>
              <div className="flex justify-between ">
                <label
                  htmlFor="title"
                  className="leading-7 text-sm text-gray-600"
                >
                  {t("MintNFT.titleTxt")}
                </label>
                {formik.touched.title && formik.errors.title ? (
                  <div className="leading-7 text-sm text-red-600">
                    {formik.errors.title}
                  </div>
                ) : null}
              </div>

              <input
                type="text"
                id="title"
                name="title"
                {...formik.getFieldProps("title")}
                className={`  w-full bg-gray-100 bg-opacity-50 rounded   focus:bg-transparent  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out `}
              />

              <div className="flex justify-between ">
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
              />

              {/* /SE AGREGAN LOS CAMPOS CULTURA Y PAIS/ */}
              <div className="flex justify-between ">
                <label
                  htmlFor="culture"
                  className="leading-7 text-sm text-gray-600"
                >
                  {t("MintNFT.tagsTxt")}
                </label>{" "}
                {formik.touched.culture && formik.errors.culture ? (
                  <div className="leading-7 text-sm text-red-600">
                    {formik.errors.culture}
                  </div>
                ) : null}
              </div>

              <input
                type="text"
                id="culture"
                name="culture"
                placeholder={t("MintNFT.placeTags")}
                {...formik.getFieldProps("culture")}
                
                className={`  w-full bg-gray-100 bg-opacity-50 rounded   focus:bg-transparent  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out `}
              />

              <div className="flex justify-between ">
                <label
                  htmlFor="description"
                  className="leading-7 text-sm text-gray-600"
                >
                  {t("MintNFT.descTxt")}
                </label>
                {formik.touched.description && formik.errors.description ? (
                  <div className="leading-7 text-sm text-red-600">
                    {formik.errors.description}
                  </div>
                ) : null}
              </div>

              <textarea
                type="textarea"
                id="description"
                name="description"
                rows="2"
                {...formik.getFieldProps("description")}
                className={` resize-none border-none w-full bg-gray-100 bg-opacity-50 rounded   focus:bg-transparent  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out${props.theme}-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
              />
              {!combo ? (
                <>
                  <div className="flex justify-between ">
                    <label
                      htmlFor="description"
                      className="leading-7 text-sm text-gray-600"
                    >
                      Fecha de expiracion
                    </label>
                    {formik.touched.description && formik.errors.description ? (
                      <div className="leading-7 text-sm text-red-600">
                        {formik.errors.description}
                      </div>
                    ) : null}
                  </div>
                  <input className="date" id="date" name="date" {...formik.getFieldProps("date")} type="date" min={`${actualDate}`} />
                  <input className="date-hm" id="hrs" name="hrs" {...formik.getFieldProps("hrs")} type="number" min="0" max="23" placeholder="Hrs" />
                  <input className="date-hm" id="min" name="min" {...formik.getFieldProps("min")} type="number" min="0" max="59" placeholder="Min" />

                </>

              ) : ""
              }
              <button
                type="submit"
                className={` mt-12 w-full text-white bg-${props.theme}-500 border-0 py-2 px-6 focus:outline-none hover:bg-${props.theme}-600 rounded text-lg`}
                disabled={mint?.onSubmitDisabled}
              >
                {t("MintNFT.createNFT")}
              </button>
            </div>
          </div>
        </div>
      </form>
      <Modal {...modal} />
      </> :
      <>
        <div className="item-center py-10">
          <p className="text-5xl font-semibold pt-20 text-center">No tienes colecciones</p>
          <p className="pt-10 pb-5 text-center text-2xl">Para poder minar un token en necesario crear una colección antes</p>
          <div className="width-100 py-10 text-center">
            <a className="bg-s hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-xl" href="./createcollection">Crear colección</a>
          </div>
          
        </div>
      </>}
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
