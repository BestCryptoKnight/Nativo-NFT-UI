import MarketPlace from "../contracts/MarketPlace.json";
import Web3 from "web3";
const { create } = require("ipfs-http-client");

/**
 * contiene todas las redes que podemos agregar
 */
var nets = [
    {
      chainId: 5777,
      data: [
        {
          chainId: "0x1691",
          chainName: "Truffle Develop",
          rpcUrls: ["http://127.0.0.1:9545/"],
          nativeCurrency: {
            name: "TRUFFLE COIN",
            symbol: "T-ETH",
            decimals: 18,
          },
          blockExplorerUrls: ["https://bscscan.com/"],
        },
      ],
    },
    {
      chainId: 1313161555,
      data: [
        {
          chainId: "0x4E454153",
          chainName: "AURORATESTNET",
          rpcUrls: ["https://testnet.aurora.dev"],
          nativeCurrency: {
            name: "AURORA COIN",
            symbol: "A-ETH",
            decimals: 18,
          },
          blockExplorerUrls: ["https://testnet.bscscan.com/"],
        },
      ],
    },
    {
      chainId: 1313161554,
      data: [
        {
          chainId: "0x4e454152",
          chainName: "AURORAMAINNET",
          rpcUrls: ["https://mainnet.aurora.dev"],
          nativeCurrency: {
            name: "AURORA COIN",
            symbol: "A-ETH",
            decimals: 18,
          },
          blockExplorerUrls: ["https://testnet.bscscan.com/"],
        },
      ],
    },
  ],
  nets = Object.assign(
    ...nets.map(({ chainId, data }) => ({ [chainId]: data }))
  );

export var nets;
/**
 * inicializar una instancia de ipfs
 */
export function init() {
  if (window.ethereum && !window.web3x) {
    //instancia de web3
    window.web3x = new Web3(window.ethereum);
    //red por default
    localStorage.setItem("network", 1313161555);

    //instancia de ipfs
    window.ipfs = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
    });
  }
}

/**
 *nos permite saber si podemos usar alguna blockchain
 * @return bool falso si no cuenta con metamask
 */
export function isMetamaskInstalled() {
  return window.ethereum ? true : false;
}

/**
 * nos agrega y cambia de red
 * @param {int} id es el chainid a agregar o cambiar
 * @returns el resultado de la interaccion del usuario
 */
export async function addNetwork(id) {
  //obtener el arreglo con los datos de la red
  let networkData = nets[id];
  if (!networkData) return "no existe esa red";
  // agregar red o cambiar red
  return window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: networkData,
  });
}

/**
 * nos regresa una instancia del contrato de la red actualmente seleccionada
 * @returns instancia del contrato
 */
export function getContract() {
  // sm address
  let smartContractAddress =
    MarketPlace.networks[localStorage.getItem("network")].address;
  //instancia del contrato
  return new window.web3x.eth.Contract(MarketPlace.abi, smartContractAddress);
}
/**
 *obtiene la cuenta selecionada por el usuario en metamask
 * @returns adddres regresa la primera cuenta
 */
export async function getSelectedAccount() {
  //get the useraccounts
  let useraccounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return useraccounts[0];
}
/**
 * convierte ethers a weis
 * @param {float} eth
 * @returns
 */
export function fromETHtoWei(eth) {
  //convertimos el numero a notación cientifica
  eth = eth.toExponential();
  //lo convertimos a Number y le quitamos la notactión cientifica
  eth = Number(eth).toFixed(eth.split(/-|\+/)[1]);

  //le mandamos el numero como string
  return Web3.utils.toWei(eth.toString(), "ether");
}

/**
 * convierte de weis a eth
 * @param {float} wei
 * @returns
 */
export function fromWEItoEth(wei) {
  return Web3.utils.fromWei(wei.toString(), "ether");
}

/**
 * nos dice si la red de metamask es la misma que tenemos en localstorage
 * @returns bool
 */
export async function sameNetwork() {
  //obtener el networkid de la red acutalmente seleccionada en metamask
  let ActualnetworkId = await window.ethereum.request({
    method: "net_version",
  });

  //comprobar que la red en local storage y la red de metamask son iguales
  return ActualnetworkId == parseInt(localStorage.getItem("network"));
}

/**
 * pausas los milisegundos que gustes con esta funcion
 * @param {int} miliseconds es el numero de milisegundos a esperar
 */
export function wait(miliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > miliseconds) {
      break;
    }
  }
}
/**
 * cambia la red de metamask a la que esta almacenada en localstorage
 */
export async function syncNets() {
  //mientras la redes no coincidan trata de cambiar la red
  while (!(await sameNetwork())) {
    //espera 200 milisegundo para volver a llamar addNetwork evita que no se muestre el modal de metamask
    wait(200);
    await addNetwork(parseInt(localStorage.getItem("network"))).catch();
  }
}
