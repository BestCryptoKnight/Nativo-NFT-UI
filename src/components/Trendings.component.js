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
import { Tab  } from "@headlessui/react";
import nearImage from '../assets/img/landing/trendingSection/Vector.png';


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
          swipeToSlide: true
        }
      }
      
    ]
  };

  const settingsTokens = {
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
          slidesToShow: 4,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
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
          swipeToSlide: true
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
  
      /*window.contr = await getNearContract();

      //instanciar contracto
      let nft_total_supply = await contract.nft_total_supply()

      let payload = {};

      if(nft_total_supply < tokens.totalTokens ) {
         payload = {
          from_index: "0",
          limit: parseInt(tokens.totalTokens),
        }
      } else {
         payload = {
          from_index: (nft_total_supply - (tokens.totalTokens)).toString(),
          limit: parseInt(tokens.totalTokens),
        }
      }
      const args_b64 = btoa(JSON.stringify(payload))
      console.log(args_b64)
    // console.log(args_b64)
      const { network } = selector.options;
      const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

      const res = await provider.query({
          request_type: "call_function",
          account_id: process.env.REACT_APP_CONTRACT,
          method_name: "nft_tokens",
          args_base64: args_b64,
          finality: "optimistic",
        })
        console.log(res)
      console.log(JSON.parse(Buffer.from(res.result).toString()))
      let toks2 = JSON.parse(Buffer.from(res.result).toString())
      
      // let toks = await contract.nft_tokens(
      //   payload,
      // )
      console.log(toks2)
      setTokens({
        ...tokens,
        items: tokens.items.concat(toks2.reverse())
      });
      console.log('tokens', tokens) */
     
      const { network } = selector.options;
      const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

      

      //getting total nfts

      let payloadTotalTokens = {
        nft_contract_id: process.env.REACT_APP_CONTRACT
      }
      
      const args_toks2 = btoa(JSON.stringify(payloadTotalTokens));

      const totalTokens = await provider.query({
        request_type: "call_function",
        account_id: process.env.REACT_APP_CONTRACT_MARKET,
        method_name: "get_supply_by_nft_contract_id",
        args_base64: args_toks2,
        finality: "optimistic",
      });
      let totalTokensParsed = JSON.parse(Buffer.from(totalTokens.result).toString())
      console.log('totalTokensParsed',totalTokensParsed);
      
      //NUEVA COSUlTA
      let payload = {
        nft_contract_id: process.env.REACT_APP_CONTRACT,
        from_index: (parseInt(totalTokensParsed)-5).toString(),
        limit: 5,
      }
      
      const args_toks = btoa(JSON.stringify(payload))

      const owner = await provider.query({
        request_type: "call_function",
        account_id: process.env.REACT_APP_CONTRACT_MARKET,
        method_name: "get_sales_by_nft_contract_id",
        args_base64: args_toks,
        finality: "optimistic",
      })
      
      let toks2 = JSON.parse(Buffer.from(owner.result).toString())
      console.log('toks2',toks2 )
      setTokens({...tokens,
        items: tokens.items.concat(toks2.reverse())
      });
      console.log('tokens', tokens) 


    })();
  }, [trigger]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <section className="text-gray-600  open-sans  h-[580px] lg:h-[800px] overflow-hidden " >
      <div className="w-full md:pt-4 pb-8 dark:flex flex-row flex-wrap justify-center" >
        <div className="w-full bg-white pt-6 pb-8 ">
          <h2 className="dark:text-black  text-left px-4  w-full lg:w-1/2  text-3xl  md:px-6
                        lg:px-8 mb-4  font-clash-grotesk  font-semibold leading-9  lg:text-4xl">{t("Landing.trending-title")}🔥</h2>
           
        </div>
        <div className=" w-full    ">
          <Tab.Group>
            <Tab.List className="flex space-x-1 px-4 bg-blue-900/20 p-1">
              <Tab
                key={"tokens"}
                className={({ selected }) =>
                  classNames(
                    'w-1/3 lg:w-1/6 py-2.5 text-base lg:text-2xl font-normal leading-6  lg:font-bold ',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 font-open-sans font-semibold ',
                    selected
                    ? 'border-b-2 border-b-[#F79336]  text-darkgray font-bold  lg:font-bold '
                    : 'font-open-sans text-[#616161] '
                  )
                }
              >
                {t("Landing.tokens")}
              </Tab>
              <Tab
                key={"collections"}
                className={({ selected }) =>
                  classNames(
                    'w-1/3 lg:w-1/6 py-2.5 text-base lg:text-2xl font-normal lg:font-bold leading-6 ',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 font-open-sans   font-normal ',
                    selected
                      ? 'border-b-2 border-b-[#F79336]  text-darkgray font-bold  lg:font-bold '
                      : 'font-open-sans text-[#616161] '
                  )
                }
              >
                {t("Landing.collections")}

              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2 bg-white">
              <Tab.Panel
                key={"tokens"}
                className={classNames(
                  'rounded-xl  bg-white trending-tokens '
                )}
              >
                                <Slider {...settingsTokens} >
                  {tokens.items.map((item, key) => {
                    return (
                      <>
                        <a
                          href={"/detail/" + item.token_id}
                        >
                          <div className="flex flex-row  mb-10 md:mb-0  justify-center " key={key}>
                            <div className="trending-token w-64 md:w-[300px] rounded-20 shadow-lg   hover:scale-105 ">
                              <div className=" bg-white rounded-xl">
                                <div className="pb-3">
                                  <img
                                    className="object-cover object-center rounded-t-xl h-48 md:h-56 w-full "
                                    src={`https://nativonft.mypinata.cloud/ipfs/${item.media}`}
                                    alt={item.description}
                                  />
                                </div>
                                <div className="px-3 py-1">
                                  <div className=" text-black text-base leading-6 text-ellipsis overflow-hidden whitespace-nowrap  font-open-sans font-extrabold uppercase">{item.title}</div>
                                 <div className="flex justify-start">
                                  <div className=" text-base font-open-sans font-semibold py-2 text-yellow4 flex">  <img
                                    className="w-[16px] h-[16px] my-auto mr-2"
                                    src={nearImage}
                                    alt={item.description}
                                    width={15}
                                    height={15}
                                  /> {fromYoctoToNear(item.price)} NEAR</div>
                                </div> 
                                </div>
                                <div className="text-black px-3 font-open-sans text-xs font-semibold leading-4 uppercase mx-auto justify-center text-ellipsis overflow-hidden py-3">                                  
                                 {t("tokCollection.createdBy") +":"} <a href={`profile/${item.creator_id.split('.')[0]}`} className=" text-ellipsis overflow-hidden">{item.creator_id}</a></div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </>

                    );
                  })}
                </Slider>

                <a href='/market' className="lg:w-full lg:text-right lg:mt-[55px] flex flex-row-reverse justify-center lg:justify-start lg:mr-7" >
                  <button class="w-full mx-2 rounded border-2  text-gray-400  border-slate-400 lg:bg-white lg:border-2 lg:border-[#F79336]  lg:w-[339px] lg:h-[48px] lg:text-[#F79336] px-4 lg:py-1 capitalize text-darkgray-100 font-bold sm:text-xs md:text-xl lg:text-xl hover:scale-105 font-open-sans text-base  lg:mt-5   lg:mr-7 ">{t("Landing.popular_col-see_all")}</button>
                </a>
              </Tab.Panel>
              <Tab.Panel
                key={"collections"}
                className={classNames(
                  'rounded-xl  bg-white'
                )}
              >
                <Slider {...settings} className="mt-3">
                  {collections.items.map((item, key) => {
                    return (
                      <div className="">
                        <a href={"/collection/" + item.collectionID}
                        >
                          <div className="flex flex-row justify-items-center px-4 mb-4 md:px-6 lg:px-8 " key={key}>

                            <div className="rounded-md shadow-lg  w-full  bg-white hover:scale-105 ">
                              <div className="  overflow-hidden rounded-t-md w-full md:w-full  lg:w-full  bg-white   ">

                                <img className="  h-[190px] mx-auto  object-cover object-center scale-150	w-full " alt={item.description} src={`https://nativonft.mypinata.cloud/ipfs/${item.mediaBanner}`} />

                              </div>
                              <div className="flex flex-row  mb-4" name="card_detail">
                                <div className=" z-10 -mt-8 ml-4        ">
                                  <img className="  object-cover  rounded-md bg-white  border-2 border-white min-w-[90px] max-w-[90px] min-h-[90px] max-h-[90px]  " src={`https://nativonft.mypinata.cloud/ipfs/${item.mediaIcon}`} alt={item.description} />
                                </div>

                                <div class="flex flex-col  mx-2 mt-2  ">
                                  <div className="   w-full uppercase tracking-tighter text-black text-base	   font-open-sans  font-extrabold    collection-description h-[50px] justify-center items-center">{item.title}</div>
                                  <div className="   w-full uppercase tracking-tighter text-xs text-left font-bold justify-center font-open-sans leading-4 text-black  text-ellipsis overflow-hidden whitespace-pre">{t("Landing.popular_col-by") + " " + item.owner}</div>
                                  <div className="   w-full   text-xs  text-black text-left justify-center font-normal font-open-sans  text-ellipsis overflow-hidden whitespace-nowrap">{item.tokenCount > 999 ? "+" + item.tokenCount + "k " : item.tokenCount + " "} <a className="w-full   text-xs text-black font-open-sans font-normal tracking-wide leading-4  text-left justify-center "> {t("Landing.popular_col-tokens_on")}</a></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>

                    );
                  })}
                </Slider>
                <a href='/collections' className="lg:w-full lg:text-right lg:mt-[55px] flex flex-row-reverse justify-center lg:justify-start lg:mr-7" >
                  <button class="w-full lg:w-[163px] mx-2 rounded border-2  text-gray-400  border-slate-400 lg:bg-white lg:border-2 lg:border-[#F79336]   lg:h-[48px] lg:text-[#F79336] px-4 py-1 capitalize text-darkgray-100 font-bold sm:text-xs md:text-xl lg:text-xl hover:scale-105 font-open-sans text-base  mt-5 lg:mt-0  lg:mr-7 ">{t("Landing.popular_col-see_all")}</button>
                </a>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        

          
        </div>


         
      </div>
    </section>
  );
}


export default Trendings;
