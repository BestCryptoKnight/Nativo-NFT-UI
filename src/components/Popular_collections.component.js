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


function Trendings() {
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
    <section className="text-gray-600   body-font   " >
      <div className="w-full md:pt-4 pb-24 dark:flex flex-row flex-wrap justify-center" >
        <div className="w-full bg-white pt-6 pb-2 ">
          <h2 className="dark:text-black  text-left px-4  w-1/3    text-3xl  
                        lg:  px-8 mb-4">{t("Landing.popular_col-title")}</h2>
           
        </div>
        <div className=" w-full    ">
        
        <Slider {...settings} >
            {collections.items.map((item, key) => {
              return (
                <div className="">
             
                      <a href={"/collection/" + item.collectionID}
                      >
                          <div className="flex flex-row justify-items-center p-4  " key={key}>
                              <div className="rounded-20 drop-shadow-md   w-full   bg-green-200  
                                                     md:bg-red-100    
                                                     lg:bg-red-900    
                                                     hover:scale-105 ">
                               
                                      <div className=" object-cover object-center w-full md:w-full  lg:w-1/3  bg-white   ">
                                           <img className=" rounded-t-20 h-[190px] w-full " alt={item.description}  src={`https://nativonft.mypinata.cloud/ipfs/${item.mediaBanner}`}/>        
                                      </div>  
                                        <div className="flex flex-row  mb-4   " name="card_detail">
                                          <div className=" -mt-8 ml-4 mr-4 object-left-bottom      mb-4">
                                                <img    className="bg-white  border-2 border-white sm:w-[90px] h-[90px] md:w-[100px] h-[100px]f "src={`https://nativonft.mypinata.cloud/ipfs/${item.mediaIcon}`} alt={item.description}/>
                                          </div> 

                                          <div class="flex flex-col  mt-2 md:mb-8">
                                                <div className="   w-full uppercase tracking-tighter text-black text-xs	    font-semibold">{item.title}</div>
                                                <div className="   w-full uppercase tracking-tighter text-xs text-left font-semibold justify-center  ">{t("Landing.popular_col-by")  +" " +item.owner}</div>
                                                <div className="   w-full   text-xs leading-3 text-left justify-center  ">{item.tokenCount>999 ? "+"+item.tokenCount +"k " :  item.tokenCount+" " + t("Landing.popular_col-tokens_on")  } </div>
                                          </div>
                                      </div>  
                              </div>
                          </div>
                      </a>
                </div>
                
              );
            })}
          </Slider>
          {/* <Slider {...settings} >
            {collections.items.map((item, key) => {
              return (
                <div className="">
             
                      <a href={"/collection/" + item.collectionID}
                      >
                          <div className="flex flex-row justify-center w-full md:w-1/2 p-4 lg:w-1/3 xl:w-1/4  " key={key}>
                          <div className="   
                                          md:  rounded-20 drop-shadow-md
                                          hover:scale-105 ">
                            <div className=" bg-green-200  rounded-xl md:bg-red-100 lg:bg-red-900">
                              <div className="h-2/3 object-cover object-center">
                                  <img
                                    className=" rounded-t-xl  h-48 
                                               md:h-72 w-full "
                                    src={`https://nativonft.mypinata.cloud/ipfs/${item.mediaBanner}`}

                                    alt={item.description}
                                  /> 
                              </div>
                              <div className="flex flex-row  mb-8  h-1/3  " name="card_detail">
                                  <div className=" -mt-8 ml-4 mr-4 object-left-bottom    w-1/3 h-[80px] border-2 border-white 
                                                     mb-4">
                                    <img    className="bg-white w-full h-full flex-1 "src={`https://nativonft.mypinata.cloud/ipfs/${item.mediaIcon}`}
                                      alt={item.description}
                                    />
                                
                                  </div> 

                                <div class="flex flex-col w-2/3">
                                  
                                    <div className="  w-full uppercase tracking-tighter text-black text-xs	    font-semibold">{item.title}</div>

                                    <div className="   w-full uppercase tracking-tighter text-xs text-left font-semibold justify-center  ">{t("Landing.popular_col-by")  +" " +item.owner}</div>
                                    <div className="   w-full   text-xs leading-3 text-left justify-center  ">{item.tokenCount>999 ? "+"+item.tokenCount +"k " :  item.tokenCount+" " + t("Landing.popular_col-tokens_on")  } </div>


                                 
                                </div>
                              </div>
                              
                             
                            </div>
                          </div>
                        </div>  
                      </a>
                </div>
                
              );
            })}
          </Slider> */}
          
        </div>
        
          <button class=" rounded border-2 border-slate-400 px-4 capitalize text-darkgray-100 font-bold font-sans">{t("Landing.popular_col-see_all")}</button>
         
      </div>
    </section>
  );
}


export default Trendings;
