import fleekStorage from '@fleekhq/fleek-storage-js';
// import { Console } from 'console';
import fs from 'fs';



const apiKey =  'lFDwSNp377Ka9xqPXhpMAA==';
const apiSecret = 'hn5Hw/720WA0f9I7v1UjDqXOhqHYhWCy/g9cKJkKYMk=';


// getFile es para obtener archivos individuales, 
// ya sea el contenido o los datos relacionados, como la clave, el hash y publicUrl
export const getFile = async(key, getOptions = ['data','bucket','key','hash','publicUrl']) => await fleekStorage.get({
    apiKey,
    apiSecret,
    key,
    getOptions
  });

// uploadFile carga un archivo, identificado por una clave, 
// en un depósito. La función devuelve el hash del archivo, publicUrl, la clave y el depósito.
export const uploadFile = async(key, data, httpUploadProgressCallback = (event) =>  {console.log(Math.round(event.loaded/event.total*100)+ '% done');}) =>   await fleekStorage.upload({
    apiKey,
    apiSecret,
    key,
    data,
    httpUploadProgressCallback
  });

// Carga archivos pesados Ej. mp4, mp3
export const streamUpload = async(key, bigFile = './') => {
  const stream  = fs.createReadStream(bigFile);
  return await fleekStorage.streamUpload({
    apiKey,
    apiSecret,
    key,
    stream,
  });
}

// Elimina un archivo por la key
export const deleteFile = async(key) => await fleekStorage.deleteFile({
  apiKey,
  apiSecret,
  key,
  // bucket: 'my-bucket',
});

// El listFiles es para obtener información sobre todos los archivos en un depósito,
// como la clave, el hash y publicUrl.
export const listFiles = async(getOptions = ['bucket','key','hash','publicUrl']) => await fleekStorage.listFiles({
  apiKey,
  apiSecret,
  getOptions,
});

// El getListBuckets devuelve una matriz de nombres de depósito asociados con la cuenta de la clave api.
export const getListBuckets = async() =>  await fleekStorage.listBuckets({
  apiKey,
  apiSecret,
});

// getFileByHash una función de utilidad que descarga los datos de un 
// archivo desde la puerta de enlace IPFS de Fleek utilizando el hash. 
// La clave y el secreto no son necesarios ya que la puerta de enlace está disponible públicamente.
export const getFileByHash = async(hash) => await fleekStorage.getFileFromHash({
  hash
});

export const Reader = (e) => {
  //console.log(e.target.files);
  const file = e.target.files[0];
  //console.log(file);
  //console.log(e.target.value);
  const reader = new window.FileReader();
  reader.readAsArrayBuffer(file);
  return {
    file,
    reader
  };
}


