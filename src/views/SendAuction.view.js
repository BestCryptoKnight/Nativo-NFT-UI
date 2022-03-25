import React from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";

import { acceptedFormats, currencys } from "../utils/constraint";
import Modal from "../components/modal.component";
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
import {Reader, uploadFile} from '../utils/fleek';
import nt from '../assets/img/nativologo.png'

function LightHeroE(props) {
  //este estado contiene toda la info de el componente
  const [mint, setmint] = React.useState({
    file: undefined,
    blockchain: localStorage.getItem("blockchain"),
  });
  //guarda el estado de el modal
  const [modal, setModal] = React.useState({
    show: false,
    title: "cargando",
    message: "hola como estas",
    loading: true,
    disabled: true,
  });
  //guardara todos los valores del formulario
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: 0,
      culture: "",
      country: "",
      image: "",
    },
    //validaciones
    validationSchema: Yup.object({
      title: Yup.string()
        .max(30, "Menos de 30 caracteres")
        .required("Requerido")
        .min(5, "el titulo debe longitud mayor a 5"),

      description: Yup.string()
        .max(300, "Menos de 50 caracteres")
        .required("Requerido")
        .min(30, "la descripción minimo es de 30 caracteres"),

      price: Yup.number()
        .required("Requerido")
        .positive("el precio debe ser positivo")
        .moreThan(0, "no existen nft gratis")
        .min(0.000000000000000001, "el precio minimo es un wei"),

      culture: Yup.string().required(
        "Escribe el nombre de la cultura pertenenciente "
      ),

      country: Yup.string().required(
        "Escribe el nombre del pais pertenenciente "
      ),

      image: Yup.string().required("Requerido"),
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
      setModal({
        ...modal,
        show: true,
        title: "cargando",
        loading: true,
        disabled: true,
      });

      //console.log(JSON.stringify(values));

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
        let payload = {
          token_owner_id: await getNearAccount(),
          token_metadata: {
            title: values.title,
            description: values.description,
            media: values.image,
            media_hash: "hashhashhashhashhashhashhashhash",
            price: fromNearToYocto(values.price),
            culture:values.culture,
            country:values.country,
            creator:await getNearAccount(),
            on_sale: true,
          },
        };
        //console.log(payload);
        //console.log(fromYoctoToNear("5700000000000000000000"));
        let amount = fromNearToYocto(0.1);
       // alert(payload);
      let tokenresult=  contract.minar(
          payload,
          300000000000000, // attached GAS (optional)
          amount
        );

        //console.log(tokenresult);
      }
      //if de error
      if (!token.status)
        setModal({
          ...modal,
          show: true,
          loading: false,
          title: "error",
          message: "intentalo de nuevo",
          change: setModal,
          disabled: false,
        });
      //else de exito
      else
        setModal({
          ...modal,
          show: true,
          title: "Exito",
          message: "el nuevo token se ha minado correctamente",
          loading: false,
          change: setModal,
          disabled: false,
        });

      setmint({ ...mint, onSubmitDisabled: false });
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
    const {file, reader} = Reader(e);

    if (file) {
      //asignar imagen de preview
      setmint({ ...mint, file: URL.createObjectURL(e.target.files[0]) });

    //una vez que cargue el arhcivo lo mandamos a ipfs
      //una vez que cargue el arhcivo lo mandamos a ipfs
     
    //una vez que cargue
    reader.onloadend = function () {
      //subimos la imagen a ipfs
      uploadFile(file.name,reader.result).then(({hash}) =>{
        // console.log(result);
        //console.log(`https://ipfs.fleek.co/ipfs/${hash}`);
        formik.setFieldValue("image", hash);
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

  const format = (v)=> {
    return v < 10 ? "0"+v : v;
  }
  const fechaActual = () => {
    const d = new Date();
    const f = format(d.getFullYear())+"-"+(format(d.getMonth()+1))+"-"+format(d.getDate());
    //console.log(f);
    return f;
    
  }

  return (
    <section className="text-gray-600 body-font">
      <form
        onSubmit={formik.handleSubmit}
        className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center"
      >
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0 items-center relative">
            <img
              className="   bg-cover bg-center rounded  "
              alt="hero"
              // style={{height:"200px",width:"200px"}}
              // src={mint?.file}
              src={nt}
            />
          <label
            className={` title-font sm:text-4xl text-3xl  font-medium absolute inset-0  w-full flex flex-col items-center   rounded-lg  tracking-wide uppercase  cursor-pointer justify-center`}
          >
           
          </label>
          {formik.touched.image && formik.errors.image ? (
            <div className="flex leading-7 text-sm text-red-600 text-center mt-20 justify-center">
              {formik.errors.image}
            </div>
          ) : null}
        </div>
        <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
          <h1 className=" w-full title-font sm:text-4xl text-3xl mb-12 font-medium text-gray-900 text-center">
            Subastar
          </h1>
          <div className="flex w-full md:justify-start justify-center items-end">
            <div className="relative mr-4 lg:w-full xl:w-1/2 w-3/4">
              <div className="flex justify-between ">
                <label
                  htmlFor="title"
                  className="leading-7 text-sm text-gray-600"
                >
                  Título
                </label>
                {formik.touched.title && formik.errors.title ? (
                  <div className="leading-7 text-sm text-red-600">
                    {formik.errors.title}
                  </div>
                ) : null}
              </div>

              <div
                
                id="title"
                name="title"
                {...formik.getFieldProps("title")}
                className={`  w-full bg-gray-100 bg-opacity-50 rounded   focus:bg-transparent  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out `}
              >
                En construccion
              </div>

              {/* /SE AGREGAN LOS CAMPOS CULTURA Y PAIS/ */}
              <div className="flex justify-between ">
                <label
                  htmlFor="culture"
                  className="leading-7 text-sm text-gray-600"
                >
                  Cultura
                </label>{" "}
                {formik.touched.culture && formik.errors.culture ? (
                  <div className="leading-7 text-sm text-red-600">
                    {formik.errors.culture}
                  </div>
                ) : null}
              </div>

              <div
                // type="text"
                id="culture"
                name="culture"
                {...formik.getFieldProps("culture")}
                className={`  w-full bg-gray-100 bg-opacity-50 rounded   focus:bg-transparent  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out `}
              >
                mixteca
              </div>

              <div className="flex justify-between ">
                <label
                  htmlFor="country"
                  className="leading-7 text-sm text-gray-600"
                >
                  País{" "}
                </label>
                {formik.touched.country && formik.errors.country ? (
                  <div className="leading-7 text-sm text-red-600">
                    {" "}
                    {formik.errors.country}{" "}
                  </div>
                ) : null}{" "}
              </div>

              <div
                // type="text"
                id="country"
                name="country"
                {...formik.getFieldProps("country")}
                className={`  w-full bg-gray-100 bg-opacity-50 rounded   focus:bg-transparent  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out `}
              >
                Minecraft
              </div>

              <div className="flex justify-between ">
                <label
                  htmlFor="description"
                  className="leading-7 text-sm text-gray-600"
                >
                  Descripción
                </label>
                {formik.touched.description && formik.errors.description ? (
                  <div className="leading-7 text-sm text-red-600">
                    {formik.errors.description}
                  </div>
                ) : null}
              </div>

              <div
                // type="textarea"
                id="description"
                name="description"
                rows="2"
                {...formik.getFieldProps("description")}
                className={`desc resize-none border-none w-full bg-gray-100 bg-opacity-50 rounded   focus:bg-transparent  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out${props.theme}-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
              >
                En un país donde la currupción es lo del dia, tenemos que inovar 
                y evolucionar.
              </div>

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

              <div
                // type="textarea"
                id="description"
                name="description"
                rows="2"
                {...formik.getFieldProps("description")}
                className={`date desc resize-none border-none w-full bg-gray-100 bg-opacity-50 rounded   focus:bg-transparent  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out${props.theme}-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
              >
                <input type="date" min={`${fechaActual().toString()}`}/>
              </div>

              <div className="flex justify-between ">
                <label
                  htmlFor="price"
                  className="leading-7 text-sm text-gray-600"
                >
                  Precio inicial en 
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
                className={`border-none w-full bg-gray-100 bg-opacity-50 rounded   focus:bg-transparent  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out-${props.theme}-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
                {...formik.getFieldProps("price")}
              />

              <button
                type="submit"
                className={` mt-12 w-full text-white bg-${props.theme}-500 border-0 py-2 px-6 focus:outline-none hover:bg-${props.theme}-600 rounded text-lg`}
                disabled={mint?.onSubmitDisabled}
              >
                Subastar
              </button>
            </div>
          </div>
        </div>
      </form>
      <Modal {...modal} />
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
