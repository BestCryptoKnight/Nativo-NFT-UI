import React from "react";
import {
  fromWEItoEth,
  getContract,
  getSelectedAccount,
  syncNets,
} from "../utils/blockchain_interaction";
import { currencys } from "../utils/constraint";
import { getNearContract, fromYoctoToNear, getNearAccount } from "../utils/near_interaction";
import { useParams, useHistory } from "react-router-dom";


import filtroimg from '../assets/landingSlider/img/filtro.png'
import countrys from '../utils/countrysList'
import loading from '../assets/landingSlider/img/loader.gif'
import Pagination from '@mui/material/Pagination';
import { Account } from "near-api-js";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { useTranslation } from "react-i18next";

import InfiniteScroll from "react-infinite-scroll-component";
import verifyImage from '../assets/img/Check.png';

function LightEcommerceA() {
  const [Landing, setLanding] = React.useState({
    theme: "yellow",
    currency: currencys[parseInt(localStorage.getItem("blockchain"))],
    tokens: [],
    page: parseInt(window.localStorage.getItem("page")),
    pag: window.localStorage.getItem("pagSale"),
    blockchain: localStorage.getItem("blockchain"),
    tokensPerPage: 9,
    tokensPerPageNear: 9,
  });
  const [t, i18n] = useTranslation("global")
  const [esconder, setesconder] = React.useState(true);
  const [counter, setcounter] = React.useState();
  const [load, setload] = React.useState(true);
  const [pagsale, setpagsale] = React.useState(0);
  const [hasData, setHasData] = React.useState(true);
  const [pageCreations, setpageCreations] = React.useState(1);
  const [pagCount, setpagCount] = React.useState("");
  const [chunksale, setchunksale] = React.useState(0);
  const [totalCol, setTotalCol] = React.useState(0);
  const [page, setpage] = React.useState(1);
  const [ini, setini] = React.useState(true);
  const [firstID, setFirstID] = React.useState(-1);
  const [lastID, setLastID] = React.useState(-1);
  const [statePage, setStatePage] = React.useState(true)
  const [firstLoad, setFirstLoad] = React.useState(true)
  const [loadMsg, setLoadMsg] = React.useState(true)
  const [trigger, settrigger] = React.useState(true);
  const [search, setSearch] = React.useState({
    isSearch: false,
    skipSearch: 0,
    searchWord: "",
    hasMore: true
  });
  const [skipSearch, setSkipSearch] = React.useState(0);
  const [filtro, setfiltro] = React.useState({
    culture: "null",
    country: "null",
    type: "null",
    date: "null",
    price: "null",
  });
  let [collections, setCollections] = React.useState({
    items: [],
    hasMore: true
  });

  const APIURL = process.env.REACT_APP_API_TG

  const handleChangePage = (e, value) => {
    // console.log(value)
    setpage(value)
    window.scroll(0, 0)
    settrigger(!trigger)
  }

  const handleBackPage = () => {
    console.log("Back")
    window.scroll(0, 0)
    setStatePage(false)
    settrigger(!trigger)
  }

  const handleForwardPage = () => {
    console.log("Forward")
    window.scroll(0, 0)
    setStatePage(true)
    settrigger(!trigger)
  }

  const modificarFiltro = (v) => {
    setfiltro(c => ({ ...c, ...v }))
  }

  let fetchMoreData = async () => {
    setpageCreations(pageCreations + 1);
    //instanciar contracto
    let contract = await getNearContract();
    let account = await getNearAccount();
    let colData;
    const queryData = `
          query($first: Int, $lastTokenID: Int){
              collections(first: $first,  orderBy: collectionID, orderDirection: desc, where: { collectionID_lt: $lastTokenID}){
                id
                collectionID
                owner_id
                title
                timestamp
                mediaIcon
                mediaBanner,
                description,
                tokenCount
            }
          }
        `

    //Declaramos el cliente
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    })

    await client
      .query({
        query: gql(queryData),
        variables: {
          first: Landing.tokensPerPage,
          lastTokenID: lastID
        },
      })
      .then((data) => {
        colData = data.data.collections;
        if (data.data.collections.length <= Landing.tokensPerPage) {
          setCollections({...collections, hasMore: false });
          setLastID(parseInt(data.data.collections[data.data.collections.length - 1].collectionID))
          return;
        }

        if (data.data.collections.length > Landing.tokensPerPage) {
          setCollections({...collections, hasMore: true });
           setLastID(parseInt(data.data.collections[data.data.collections.length - 1].collectionID))
        }
       
        setpage(page + 1)
      })
      .catch((err) => {
        colData = 0
      })


      if(colData != 0 ) {
        let col = colData.map((collection) => {
          return {
            title: collection.title,
            owner: collection.owner_id,
            tokenCount: collection.tokenCount,
            description: collection.description,
            mediaIcon: collection.mediaIcon,
            mediaBanner: collection.mediaBanner,
            collectionID: collection.collectionID
          };
        });
    
        await setLanding({
          ...Landing,
          tokens: col,
          nPages: 0,
        });
        setCollections({
          ...collections,
          items: collections.items.concat(col)
        });
      }
      

  }
  var colData;
  const { tokenid: owner } = useParams();
  React.useEffect(() => {
    // console.log("esto ---> ",owner);

    setload(c => true);
    (async () => {
      let toks, onSaleToks;
      let arr = [];

      if (Landing.blockchain == "0") {
        //primero nos aseguramos de que la red de nuestro combo sea igual a la que esta en metamask
        await syncNets();
        //obtener cuantos tokens tiene el contrato
        let totalSupply = await getContract().methods.totalSupply().call();
        //obtener el numero de tokens a la venta
        onSaleToks = await getContract().methods.nTokenOnSale.call().call();

        //indices del arreglo para la paginacion :::0*10=0 1*10=10  1*10=10 2*10=20
        for (let i = Landing.page * 10; i < (parseInt(Landing.page) + 1) * Landing.tokensPerPage; i++) {
          //console.log("ini",Landing.page*10,"actual",i,"fin",(parseInt(Landing.page)+1)*Landing.tokensPerPage)
          //obtiene la informacion de x token
          let infoe = await getContract().methods.getItemInfo(i).call();
          //Valida si está a la venta
          if (infoe[0].onSale) {
            //agrega el token al arreglo para mostrar
            arr.push(infoe[0]);
          }

          //Concadena el token encontrado con los tokens que ya se mostraron
          setLanding({
            ...Landing,
            tokens: arr,
            nPages: Math.ceil(arr.length / Landing.tokensPerPage),
          });

        }


      } else {
        window.contr = await getNearContract();

        //instanciar contracto
        let contract = await getNearContract();
        let account = await getNearAccount();


        


    const queryData = `
          query($first: Int){
              collections(first: $first,  orderBy: collectionID, orderDirection: desc){
                id
                collectionID
                owner_id
                title
                timestamp
                mediaIcon
                mediaBanner,
                description,
                tokenCount
            }
            profiles (where : {id : $account}){
              id
              media
              biography
              socialMedia
            }
          }
        `

    //Declaramos el cliente
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    })

    await client
      .query({
        query: gql(queryData),
        variables: {
          first: Landing.tokensPerPage,
        },
      })
      .then((data) => {
        //console.log("tokens data: ", data.data.tokens)
        colData = data.data.collections
        console.log(data.data.collections)
        if (data.data.collections.length <= 0) {
          setLoadMsg(false)
        }
        setFirstID(parseInt(data.data.collections[0].collectionID))
        setLastID(parseInt(data.data.collections[data.data.collections.length - 1].collectionID))
        setpage(page + 1)
        // colData = data.data.collections[0]
      })
      .catch((err) => {
        //console.log('Error ferching data: ', err)
        colData = 0
      })

      if(colData != 0){


      let col = colData.map((collection) => {
          return {
            title: collection.title,
            owner: collection.owner_id,
            tokenCount: collection.tokenCount,
            description: collection.description,
            mediaIcon: collection.mediaIcon,
            mediaBanner: collection.mediaBanner,
            collectionID: collection.collectionID
          };
        });
    
        await setLanding({
          ...Landing,
          tokens: col,
          nPages: 0,
        });
        setCollections({
          ...collections,
          items: collections.items.concat(col)
        });
    
      } else {
        setTotalCol(0);
        setHasData(false);
      }
  }

    })();
  }, []);

  const _handleKeyUp = async(e) => {
    let colData;
    console.log('enter first time on search',e);

    let searchWord = e.target.value;
    
    if (e.key === 'Enter' || e.keyCode == 13) {
      console.log('search on first fime', search);

    
      const queryData2 = `
         query($first: String!) 
            {
              collectionSearch(text: $first, skip: 0, first: 3) {
                id
                title
                description
                owner_id
                tokenCount
                mediaBanner
                mediaIcon
                collectionID
                timestamp

            }
          }
        `

    //Declaramos el cliente
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    })

    await client
    .query({
      query: gql(queryData2),
      variables: {
        first: searchWord,
      },
    })
      .then((data) => {
        console.log('data',data);
        colData = data.data.collectionSearch;
      })
      .catch((err) => {
        console.log('err',err);
      })

      let col = colData.map((collection) => {
        return {
          title: collection.title,
          owner: collection.owner_id,
          tokenCount: collection.tokenCount,
          description: collection.description,
          mediaIcon: collection.mediaIcon,
          mediaBanner: collection.mediaBanner,
          collectionID: collection.collectionID
        };
      });

      setCollections({
        ...collections,
        items: col
      });

      setSearch({ ...search, searchWord: searchWord, isSearch: true, skipSearch : 3, hasMore: col.length == 3 ? true : false});
    }   
  }

  let fetchMoreSearch = async() => {
    let colData;
    console.log('fetchMoreSearch');
    
      const queryData2 = `
         query($first: String!) 
            {
              collectionSearch(text: $first, skip: ${search.skipSearch}, first: 3) {
                id
                title
                description
                owner_id
                tokenCount
                mediaBanner
                mediaIcon
                collectionID
                timestamp

            }
          }
        `

    //Declaramos el cliente
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    })

    await client
    .query({
      query: gql(queryData2),
      variables: {
        first: search.searchWord,
      },
    })
      .then((data) => {
        console.log('data',data);
        colData = data.data.collectionSearch;
      })
      .catch((err) => {
        console.log('err',err);
      })

      let col = colData.map((collection) => {
        return {
          title: collection.title,
          owner: collection.owner_id,
          tokenCount: collection.tokenCount,
          description: collection.description,
          mediaIcon: collection.mediaIcon,
          mediaBanner: collection.mediaBanner,
          collectionID: collection.collectionID
        };
      });

      setCollections({
        ...collections,
        items: collections.items.concat(col)
      });

      console.log('collection', col.length);
      setSearch({...search, skipSearch : search.skipSearch + 3, hasMore: col.length == 3 ? true : false});

      console.log('search', search);
      
  }

return (
  <section className={"text-gray-600 body-font " + (ini && hasData ? "" : "py-64 dark:bg-darkgray")}>
    
    <div className={"pt-3 mx-auto dark:bg-darkgray "}>


    <div className="flex  rounded-xlarge  w-full  h-[45px] mx-0   mb-2 bg-gradient-to-b p-[2px] from-yellow  to-brown ">
          <input className={` font-open-sans  flex flex-col  h-full dark:bg-white dark:text-darkgray   text-left rounded-xlarge justify-center focus-visible:outline-none focus-visible:shadow-s focus-visible:shadow-s focus-visible:shadow-brown-s w-full `}
            onKeyUp={_handleKeyUp}>
          </input>
        </div>

    
      {hasData ?
        <div>
          <InfiniteScroll
            dataLength={collections.items.length}
            next={!search.isSearch ? fetchMoreData : fetchMoreSearch}
            hasMore={!search.isSearch ? collections.hasMore : search.hasMore}
            loader={<h1 className="text-center w-full py-10 text-xl font-bold text-yellow2">{t("tokCollection.loading")}</h1>}
            endMessage={
              <p className="text-center w-full py-10 text-xl text-yellow2">
                <b>{t("Collections.end")}</b>
              </p>
            }
            className={"flex flex-wrap px-[40px]"}
          >
            {collections.items.map((i, index) => {
              return (
                <div className="w-full md:w-1/2 lg:w-1/3 p-4  " key={index}>
                  <a
                    href={"/collection/" + i.collectionID}
                  >
                    <div className="flex flex-row  mb-10 md:mb-0  justify-center " >
                      <div className="trending-token w-64 md:w-80 rounded-20 hover:shadow-yellow1   hover:scale-105 ">
                        <div className=" bg-white rounded-20 h-[365px] md:h-[450px]">
                          <div className="p-6 pt-3 pb-3">
                            <img
                              className="object-cover object-center rounded-xlarge h-[8rem] md:h-48  w-full bg-center"
                              src={`https://ipfs.io/ipfs/${i.mediaBanner}`}

                              alt={i.description}
                            />
                          </div>

                          <div className="w-[70px] h-[70px]  bg-circle bg-center rounded-full border-4 border-white relative bg-cover mx-auto -mt-[45px]" style={{ backgroundImage: `url(https://ipfs.io/ipfs/${i.mediaIcon})` }} >
                          </div>
                          <div className=" pb-3 p-6 pt-3">

                            <div className="capitalize text-black text-sm  text-ellipsis overflow-hidden whitespace-nowrap  font-raleway font-bold text-center">{i.title}</div>
                            <div className="h-[3.4em] text-sm  stroke-gray-700 collection-description font-raleway py-2 ">{i.description}</div>

                            <div className="flex justify-around pt-2">
                              <div className="text-black text-sm font-raleway font-normal   "><span className="font-bold">Id:</span> {i.collectionID}</div>
                              <div className="text-black text-sm font-raleway font-normal   "><span className="font-bold"># Tokens:</span> {i.tokenCount}</div>



                            </div>
                            <div className="rounded-xlarge  text-white  bg-yellow2 border-0 mx-auto justify-center  px-6 w-[130px] flex mx-auto my-2 p-2  text-xs font-semibold font-raleway uppercase hover:bg-brown width" >{t("tokCollection.seeDetails")}</div>
                          </div>
                          <div className=" px-6 font-raleway text-xs text-right mx-auto justify-center">{t("tokCollection.createdBy")} <a href={`profile/${i.owner}`} className="font-raleway text-xs font-bold text-blue2">{i.owner}</a></div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              )
            })}
          </InfiniteScroll>
        </div>
        :
        <div className="container mx-auto flex  my- md:flex-row flex-col text-yellow2 justify-center h-96 items-center text-4xl font-bold">
          <div className="flex flex-col justify-center">
            <h1 className="text-center">{t("Collections.load-2")}</h1>
          </div>
        </div>
      }



    </div>
  </section>
);
    }

export default LightEcommerceA;
