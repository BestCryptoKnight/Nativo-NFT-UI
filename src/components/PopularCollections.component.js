import React, { useCallback } from "react";
import { providers, utils } from "near-api-js";
import { useTranslation } from "react-i18next";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sliderData } from "../assets/landingSlider/sliderData";
import Slider from "react-slick";
import { getNearContract, fromYoctoToNear, getNearAccount } from "../utils/near_interaction";
import verifyImage from '../assets/img/Check.png';
import { useWalletSelector } from "../utils/walletSelector";
import { Button } from "@mui/material";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'


function PopularCollections() {
  let [collections, setCollections] = React.useState({
    items: [],
    hasMore: true
  });
  const APIURL = process.env.REACT_APP_API_TG

  let colData;
  const { selector, modal, accounts, accountId } = useWalletSelector();
  const [loadMsg, setLoadMsg] = React.useState(true)
  const [firstID, setFirstID] = React.useState(-1);
  const [lastID, setLastID] = React.useState(-1);
  const [hasData, setHasData] = React.useState(true);
  const [totalCol, setTotalCol] = React.useState(0);
  const [trigger, settrigger] = React.useState(true);

  const [t, i18n] = useTranslation("global")
  const [tokens, setTokens] = React.useState({ items: [], totalTokens: 6 })
  
  const settings = {
    // className: "center",
    // centerMode: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: true,
    focusOnSelect: true,
    arrows: true,
    autoplaySpeed: 3500,
    autoplay: false,
    useTransform: true,
    useCSS: true,
    adaptiveHeight: false,
    pauseOnHover: true,
   
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          swipeToSlide: true,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1 ,
          swipeToSlide: true,
        }
      }
      
    ]
  };
  const [load, setload] = React.useState(true);

  React.useEffect(() => {
     

    setload(c => true);
    (async () => {
      let toks, onSaleToks;
      let arr = [];

       
        window.contr = await getNearContract();

        //instanciar contracto
        let contract = await getNearContract();
        let account = await getNearAccount();


        


    const queryData = `
          query($first: Int){
              collections(first: $first,  orderBy: collectionID, orderDirection: desc, where:{visibility:true, tokenCount_gt:0}){
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
          first: 10,//Landing.tokensPerPage,
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
        //setpage(page + 1)
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
    console.table("col",col);
        // await setLanding({
        //   ...Landing,
        //   tokens: col,
        //   nPages: 0,
        // });
        setCollections({
          ...collections,
          items: collections.items.concat(col)
        });
    
      } else {
        setTotalCol(0);
        setHasData(false);
      }
  
     


    })();
  }, [trigger]);

  return (
    <section className="text-gray-600  open-sans  h-[580px] lg:h-[670px] overflow-hidden " >
      <div className="w-full md:pt-4 pb-8 dark:flex flex-row flex-wrap justify-center" >
        <div className="w-full bg-white pt-6 pb-8 ">
          <h2 className="dark:text-black  text-left px-4  w-full lg:w-1/2  text-3xl  md:px-6
                        lg:px-8 mb-4  font-clash-grotesk  font-semibold leading-9  lg:text-4xl">{t("Landing.popular_col-title")}⭐</h2>
           
        </div>
        <div className=" w-full    ">
        
        <Slider {...settings} className="mt-3">
            {collections.items.map((item, key) => {
              return (
                <div className="">
             
                      <a href={"/collection/" + item.collectionID}
                      >
                          <div className="flex flex-row drop-shadow-md justify-items-center px-4 mb-4 md:px-6 lg:px-8 " key={key}>
                          
                              <div className="rounded-md drop-shadow-md   w-full  bg-white hover:scale-105 ">
                              <div className=" best-seller font-open-sans  font-bold text-xlg ">{t("Landing.popular_col-best-seller")}</div>  
                                      <div className="  overflow-hidden rounded-t-md w-full md:w-full  lg:w-full  bg-white   ">
                                        
                                           <img className="  h-[190px] mx-auto  object-cover object-center scale-150	 " alt={item.description}  src={`https://nativonft.mypinata.cloud/ipfs/${item.mediaBanner}`}/>   
                                             
                                      </div>  
                                        <div className="flex flex-row  mb-4   " name="card_detail">
                                          <div className=" z-10 -mt-8 ml-4        ">
                                                <img    className="  object-cover  rounded-md bg-white  border-2 border-white min-w-[90px] max-w-[90px] min-h-[90px] max-h-[90px]  "src={`https://nativonft.mypinata.cloud/ipfs/${item.mediaIcon}`} alt={item.description}/>
                                          </div> 

                                          <div class="flex flex-col  mx-2 mt-2  ">
                                                <div className="   w-full uppercase tracking-tighter text-black text-base	   font-open-sans  font-extrabold    collection-description h-[50px] justify-center items-center">{item.title}</div>
                                                <div className="   w-full uppercase tracking-tighter text-xs text-left font-bold justify-center font-open-sans leading-4 text-black  text-ellipsis overflow-hidden whitespace-pre">{t("Landing.popular_col-by")  +" " +item.owner}</div>
                                                <div className="   w-full   text-xs  text-black text-left justify-center font-normal font-open-sans  text-ellipsis overflow-hidden whitespace-nowrap">{item.tokenCount>999 ? "+"+item.tokenCount +"k " :  item.tokenCount+" "} <a className="w-full   text-xs text-black font-open-sans font-normal tracking-wide leading-4  text-left justify-center "> {t("Landing.popular_col-tokens_on")}</a></div>
                                          </div>
                                      </div>  
                              </div>
                          </div>
                      </a>
                </div>
                
              );
            })}
          </Slider>
          
        </div>

        <a href='/collections' className="lg:w-full lg:text-right lg:mr-7 lg:mt-[55px]">
          <button    class="w-[163px]  rounded border-2  text-gray-400  border-slate-400 lg:bg-white lg:border-2 lg:border-[#F79336]  lg:w-[339px] lg:h-[48px] lg:text-[#F79336] px-4 py-1 capitalize text-darkgray-100 font-bold sm:text-xs md:text-xl lg:text-xl hover:scale-105 font-open-sans text-base  mt-5 lg:mt-0">{t("Landing.popular_col-see_all")}</button>
        </a>
         
      </div>
    </section>
  );
}


export default PopularCollections;
