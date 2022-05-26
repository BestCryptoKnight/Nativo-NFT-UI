import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { config, signOut } from "../utils/near_interaction";
import * as nearAPI from "near-api-js";
import { blockchains } from "../utils/constraint";
import nativoLogo from '../assets/img/nativologocrop.png'
import nativoLogoWhite from '../assets/img/LogoBlanco.png'
import lupa from '../assets/landingSlider/img/lupa1.png'
import menu from '../assets/landingSlider/img/menu.png'
import { useTranslation } from "react-i18next";
import { isNearReady } from "../utils/near_interaction";
import { nearSignIn } from "../utils/near_interaction";
import verifyImage from '../assets/img/Check.png';
function LightHeaderB(props) {
const [state, setState] = useState({
  owner: "",
  dropdown:
    blockchains[parseInt(localStorage.getItem("blockchain"))] || "Blockchain",
});
const [buscar, setbuscar] = useState("");
const [menu, setmenu] = useState(true);
const [Beta, setBeta] = useState(true);
const [t, i18n] = useTranslation("global")
const [stateLogin, setStateLogin] = useState(false);

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}


const handleLanguage = () => {
  if (window.localStorage.getItem("LanguageState") == "en") {
    i18n.changeLanguage("es")
    window.localStorage.setItem("LanguageState", "es")
  }
  else {
    i18n.changeLanguage("en")
    window.localStorage.setItem("LanguageState", "en")
  }
}

const closeBeta = () => {
  window.localStorage.setItem("beta", "beta");
  setBeta(false);
}

useEffect(() => {
  (async () => {
    setStateLogin(await isNearReady());
  })();

  
  let loggedAccount2 = window.localStorage.getItem('undefined_wallet_auth_key');
  if(loggedAccount2) {
    let json2 = JSON.parse(loggedAccount2);
    setState({ ...state, owner: json2.accountId })
  }
  if (state.dropdown == 'Blockchain') {
    changeBlockchain(2);
    if (!window.localStorage.getItem("beta")) {
      setBeta(true);
    }

  }
  /*  (async () => {
    const { keyStores, connect, WalletConnection } = nearAPI;
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();

    console.log({ ...config.testnet, keyStore });
    const near = await connect({ ...config.testnet, keyStore });

    const wallet = new WalletConnection(near);
    console.log(wallet.isSignedIn());

    if (!wallet.isSignedIn()) {
      wallet.requestSignIn(
        "dev-1626280160013-8252228", // contract requesting access
        "Latin-Art" // optional
      );
    }

    console.log(wallet.getAccountId());
    console.log(wallet.account());

    const account = await near.account(wallet.getAccountId());
    console.log(await account.getAccountBalance());
    console.log(account);
    console.log(await account.getAccountDetails());
    console.log(await account.state());
  })();*/
}, []);

/**
 * esta funcion nos permite cambiar de blockchain
 * @param {int} index representa la posicion dentro del arreglo blockchains
 */

async function changeBlockchain(index) {
  setState({ dropdown: blockchains[index] });
  localStorage.setItem("blockchain", index);
  window.localStorage.setItem("page", 0)
  await signOut();
  window.location.reload();
}

async function goNativoV1() {
  window.location.href = 'https://v1.nativonft.app/';
}

return (
  <>

    <header className="text-gray-600 body-font shadow-sm sticky top-0 z-50 bg-[#ffffff]">
      <div className=" flex  px-5 py-2  flex-row items-center movil-header dark:bg-[#1d1d1b]">
        <div className="w-full flex flex-row justify-between md:w-auto">
          <a
            href="/"
            className="flex flex-row"
          >
            <img src={nativoLogoWhite} className="d-inline-block align-top w-[85px] md:w-[120px]" alt="logo" width="120px" />
            <div className="w-[2px] h-[50px] ml-[25px] self-center bg-[#f6c930]"></div>

          </a>
        </div>
        <nav className={" md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center " + (menu ? "esconder-nav" : "")}>
          {/* <a href="/galeria" className="mr-5 hover:text-gray-900">
            Galeria
          </a> */}

          <a href="/gallery" className="mr-5 hover:text-[#ec8b01] hover:text-lg hover:font-bold dark:text-white font-raleway font-normal">
            {t("Navbar.gallery")}
          </a>

          <a href="/market" className="mr-5 hover:text-[#ec8b01] hover:text-lg hover:font-bold dark:text-white font-raleway font-normal">
            {t("Navbar.onSale")}
          </a>

          {/* <a href="https://v1.nativonft.app/galeria" className="mr-5 hover:text-gray-900">
            Galeria V1
          </a> */}
          <a href="/create" className="mr-5 hover:text-[#ec8b01] hover:text-lg hover:font-bold dark:text-white font-raleway font-normal">
            {t("Navbar.create")}
          </a>
        </nav>


        <form className={"flex flex-wrap mr-7 hidden"}
          onSubmit={e => {
            e.preventDefault();
            window.location.href = "/perfil/" + buscar;
          }}
        >
          <input type="text" value={buscar} maxLength={64} className="p-2 lg:w-12/12 px-3 buscar" placeholder={(process.env.REACT_APP_NEAR_ENV == "mainnet" ? "usuario.near" : "usuario.testnet")}
            onChange={e => {

              const not = "abcdefghijklmnopqrstuvwxyzñ1234567890_-.";
              const tex = e.target.value.toString().toLowerCase();
              if (not.includes(tex[tex.length - 1]) || tex == "") {
                setbuscar(tex);
              }
            }}
          />
          <button type="submit" className="p-2 lg:w-1/12 px-3 ml-2 bg-s">
            <img src={lupa} />
          </button>
        </form>

        {
          stateLogin ?
          <Menu as="div" className="relative inline-block text-left w-full md:w-auto md:ml-4">
        
          {({ open }) => (
            <>
            
              <div className="flex flex-nowrap flex-row-reverse">
               
                <Menu.Button className="w-[75px] md:w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm  text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-yellow-500 font-raleway font-normal">

                      <div className="w-full  flex relative ">
                                <div className="w-[35px] h-[35px]  bg-circle rounded-full bg-pink-2 relative">
                                  <img className="w-[20px] h-[20px]  bg-transparent rounded-full top-0 -right-3 absolute" src={verifyImage}></img>
                                </div>
                                <div className="font-raleway font-bold text-black text-sm  items-center ml-3 hidden md:flex">
                                {state.owner}
                                </div>

                              </div>
                  <ChevronDownIcon
                    className="-mr-1 ml-2  w-5"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              
              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >

                
                    <Menu.Items
                      static
                      className="w-[145px]  md:w-full origin-top-right absolute right-0 mt-2 divide-y rounded-md shadow-lg bg-white outline-none"
                    >
                      <div className="py-1">
                      <Menu.Item
                        >
                          {({ active }) => (
                          <a href="/profile" className={classNames(
                              active
                                ? "bg-yellow text-darkgray "
                                : "text-darkgray ml-2 ",
                              "block px-2 py-2 text-sm text-center font-raleway font-normal "
                            )}>
                          <div className="flex justify-start">
                            <span className=" m-2">
                          <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="15" height="15"><path d="M16.043,14H7.957A4.963,4.963,0,0,0,3,18.957V24H21V18.957A4.963,4.963,0,0,0,16.043,14Z"/><circle cx="12" cy="6" r="6"/></svg>                              
                          </span>
                              <p className=" items-start flex flex-col md:flex-row md:items-center"> {t("Navbar.profile")} 
                              <span className="text-[9px] -mt-[7px] md:hidden">{state.owner}</span>
                              </p>                          
                              </div>
                              </a>
                          )}
                        </Menu.Item>

                        <Menu.Item>
                          {({ active }) => (
                            <a href="/gallery" className={classNames(
                              active
                                ? "bg-yellow text-darkgray "
                                : "text-darkgray ml-2 ",
                              "block px-2 py-2 text-sm text-center font-raleway font-normal md:hidden "
                            )}>
                              <div className="flex justify-start">
                                <span className=" m-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="15" height="15"><path d="M18.5,0h-5A5.5,5.5,0,0,0,8.015,5.21a5.5,5.5,0,0,0-4,5A5.506,5.506,0,0,0,0,15.5v3A5.507,5.507,0,0,0,5.5,24h5A5.507,5.507,0,0,0,16,18.5v-.213a5.512,5.512,0,0,0,3.919-4.38A5.162,5.162,0,0,0,24,8.5v-3A5.507,5.507,0,0,0,18.5,0ZM3,15.5A2.5,2.5,0,0,1,5.5,13h5A2.5,2.5,0,0,1,13,15.5v.2l-2.115,2.115a1,1,0,0,1-1.415,0L9,17.335a1,1,0,0,0-1.347-.061l-3.7,3.176A2.488,2.488,0,0,1,3,18.5ZM17,13a2.492,2.492,0,0,1-1.025,2.008A5.506,5.506,0,0,0,10.5,10H7.051A2.5,2.5,0,0,1,9.5,8h5A2.5,2.5,0,0,1,17,10.5Zm4-4.5a2.719,2.719,0,0,1-1,2.226V10.5A5.507,5.507,0,0,0,14.5,5H11.051A2.5,2.5,0,0,1,13.5,3h5A2.5,2.5,0,0,1,21,5.5Zm-17,7A1.5,1.5,0,1,1,5.5,17,1.5,1.5,0,0,1,4,15.5Z" /></svg>                              </span>
                                <p className=" self-center">{t("Navbar.gallery")}</p>
                              </div>
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item
                        >
                           {({ active }) => (
                          <a href="/market" className={classNames(
                              active
                                ? "bg-yellow text-darkgray "
                                : "text-darkgray ml-2 ",
                              "block px-2 py-2 text-sm text-center font-raleway font-normal md:hidden "
                            )}>
                          <div className="flex justify-start">
                              <span className=" m-2"><svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="15" height="15"><path d="M19,17a5.994,5.994,0,0,1-3-.806A5.994,5.994,0,0,1,13,17H11a5.938,5.938,0,0,1-3-.818A5.936,5.936,0,0,1,5,17H4a5.949,5.949,0,0,1-3-.813V21a3,3,0,0,0,3,3H20a3,3,0,0,0,3-3V16.188A5.958,5.958,0,0,1,20,17Z"/><path d="M17,0V6H15V0H9V6H7V0H2.2L.024,9.783,0,11a4,4,0,0,0,4,4H5a3.975,3.975,0,0,0,3-1.382A3.975,3.975,0,0,0,11,15h2a3.99,3.99,0,0,0,3-1.357A3.99,3.99,0,0,0,19,15h1a4,4,0,0,0,4-4V10L21.8,0Z"/></svg>
                            </span>
                            <p className=" self-center">{t("Navbar.onSale")}</p>
                            </div> 
                          </a>
                          )}
                        </Menu.Item>
                        <Menu.Item
                        >
                          {({ active }) => (
                          <a href="/create" className={classNames(
                              active
                                ? "bg-yellow text-darkgray "
                                : "text-darkgray ml-2 ",
                              "block px-2 py-2 text-sm text-center font-raleway font-normal md:hidden "
                            )}>
                            <div className="flex justify-start">
                              <span className=" m-2">
                                <svg id="Layer_1"  viewBox="0 0 24 24" width="15" height="15" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m.024 23.976.076-1.05c.076-1.1.545-6.688 2.307-8.451a5.036 5.036 0 0 1 7.118 7.125c-1.762 1.762-7.349 2.23-8.452 2.306zm23.076-23.108a3.137 3.137 0 0 0 -4.333 0l-10.515 10.519a6.967 6.967 0 0 1 4.342 4.324l10.506-10.511a3.067 3.067 0 0 0 0-4.332z" /></svg>
                              </span>
                              <p className=" self-center"> {t("Navbar.create")}</p>
                            </div>

                          </a>
                          )}
                        </Menu.Item>
                        <Menu.Item
                        >
                          {({ active }) => (
                              <a  href="/mynfts" className={classNames(
                              active
                                ? "bg-yellow text-darkgray "
                                : "text-darkgray ml-2 ",
                              "block px-2 py-2 text-sm text-center font-raleway font-normal "
                            )}>
                              <div className="flex justify-start">
                            <span className=" m-2">
                            <svg xmlns="http://www.w3.org/2000/svg" id="Filled" viewBox="0 0 24 24" width="15" height="15"><path d="M20.057,16.8l.1.1a1.912,1.912,0,0,0,1.769.521,1.888,1.888,0,0,0,1.377-1.177A11.924,11.924,0,0,0,24.08,11.7,12.155,12.155,0,0,0,12.5.007,12,12,0,0,0,.083,12a12.014,12.014,0,0,0,12,12c.338,0,.67-.022,1-.05a1,1,0,0,0,.916-1l-.032-3.588A3.567,3.567,0,0,1,20.057,16.8ZM17.115,8.05A1.5,1.5,0,1,1,16.05,9.885,1.5,1.5,0,0,1,17.115,8.05Zm-9.23,8.9A1.5,1.5,0,1,1,8.95,15.115,1.5,1.5,0,0,1,7.885,16.95Zm0-6A1.5,1.5,0,1,1,8.95,9.115,1.5,1.5,0,0,1,7.885,10.95Zm5-3A1.5,1.5,0,1,1,13.95,6.115,1.5,1.5,0,0,1,12.885,7.95Z"/></svg>
                          </span>
                              <p className=" self-center"> {t("Navbar.myNFTs")}</p>                          
                              </div>
                              
                          </a>
                          )}
                        </Menu.Item>
                        
                        <Menu.Item
                          onClick={async () => {
                            signOut(window.location.href);
                          }}
                        >
                          {({ active }) => (
                          <a  href="/logout" className={classNames(
                              active
                                ? "bg-yellow text-darkgray "
                                : "text-darkgray ml-2 ",
                              "block px-2 py-2 text-sm text-center font-raleway font-normal  "
                            )}>
                          <div className="flex justify-start">
                              <span className=" m-2">
                              <svg xmlns="http://www.w3.org/2000/svg" id="Isolation_Mode" data-name="Isolation Mode" viewBox="0 0 24 24" width="15" height="15"><path d="M3,3H8V0H3A3,3,0,0,0,0,3V21a3,3,0,0,0,3,3H8V21H3Z"/><path d="M22.948,9.525,18.362,4.939,16.241,7.061l3.413,3.412L5,10.5,5,13.5l14.7-.027-3.466,3.466,2.121,2.122,4.587-4.586A3.506,3.506,0,0,0,22.948,9.525Z"/></svg>
                              </span>
                              <p className=" self-center"> {t("Navbar.logout")}</p>
                            </div>
                          
                          </a>
                          )}
                        </Menu.Item>




                      </div>
                    </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
            :
            <>
              <button
                className={`flex ml-auto mt-2 text-white bg-yellow2 border-0 py-2 px-6 focus:outline-none  rounded-xlarge font-raleway font-medium`}
                style={{ justifyContent: "center" }}
                // disabled={state?.tokens.onSale}
                onClick={async () => {
                  nearSignIn(window.location.href);
                }}
              >
                {t("Navbar.login")}
              </button>
            </>
        }



      </div>

    </header>
    <div className={`beta ${Beta ? "h-auto" : ""}`}>
      <p>{t("Navbar.warning")}</p>
      <img src="x.png" title="Cerrar" onClick={e => closeBeta()} />
    </div>
  </>
);
      }

LightHeaderB.defaultProps = {
  theme: "indigo",
};

LightHeaderB.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default LightHeaderB;
