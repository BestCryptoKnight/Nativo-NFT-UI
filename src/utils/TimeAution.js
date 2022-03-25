


export default async (contract, tokenid) => {

    const data = await contract.account.connection.provider.block({
        finality: "final",
    });

   // const dateActual = data.header.timestamp;

   // const ownerid = await contract.nft_token({ token_id: tokenid});
  //      const toks = await contract.get_token({ token_id: tokenid ,owner_id: ownerid});
        ////console.log("Token");
        ////console.log(toks);
    
        
    //timpo restante en segundos
    // let TRS = (expiracion - dateActual) <= 0 ? 0 : (expiracion - dateActual)/1000000;

    // const getTRS  = ()=> TRS;
    // const d = () => parseInt(TRS / 86400);
    // const h = () => parseInt((TRS / 3600) % 24);
    // const m = () => parseInt((TRS / 60) % 60);
    // const s = () => parseInt(TRS % 60);

    // const iniciarCronometro = () => {
    //     const timer = setInterval(() => {
    //         if(getTRS() > 0){
    //             TRS--;
    //         }else{
    //             clearInterval(timer);
    //         }
    //     }, 1000);
    // }
    
    // return {
    //     d,
    //     h,
    //     m,
    //     s,
    //     iniciarCronometro
    // }



}