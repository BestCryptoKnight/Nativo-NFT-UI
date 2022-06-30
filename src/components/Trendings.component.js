import React from "react";
import { useTranslation } from "react-i18next";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sliderData } from "../assets/landingSlider/sliderData";
import Slider from "react-slick";
import { getNearContract, fromYoctoToNear, getNearAccount } from "../utils/near_interaction";
import verifyImage from '../assets/img/Check.png';

function Trendings() {
  const [t, i18n] = useTranslation("global")
  const [tokens, setTokens] = React.useState({ items: [], totalTokens: 6 })
  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    focusOnSelect: true,
    arrows: false,
    autoplaySpeed: 3000,
    autoplay: true,
    useTransform: true,
    useCSS: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  React.useEffect(() => {
    (async () => {
      window.contr = await getNearContract();

      //instanciar contracto
      let contract = await getNearContract();
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

      
      let toks = await contract.nft_tokens(
        payload,
      )
      setTokens({
        ...tokens,
        items: tokens.items.concat(toks.reverse())
      });
      console.log('tokens', tokens)
    })();

  }, []);

  return (
    <section className="text-gray-600 body-font bg-gray-100 dark:bg-darkgray" >
      <div className="bg-trendings-background bg-contain bg-no-repeat bg-top container w-full mx-auto pt-0 md:pt-4 md:pb-24 dark:bg-darkgray  flex flex-row flex-wrap justify-center" >
        <div className="w-full pb-10 pt-0">
          <h2 className="dark:text-white  text-center  uppercase  font-raleway font-bold text-3xl  lg:text-6xl">{t("Landing.trending-title")}</h2>
          <div className="h-[30px] w-2/3 bg-yellow3 mt-[-10px] mx-auto " />
        </div>
        <div className="w-full trending lg:px-20">
          <Slider {...settings} >
            {tokens.items.map((item, key) => {
              return (
                <div className="flex flex-row md:w-1/3 w-5/6 mb-10 md:mb-0  justify-center" key={key}>
                  <div className="trending-token rounded-xlarge">
                  <div className="max-w-xs w-72 bg-white rounded-xlarge border">
                    <div className="w-full m-5 mb-0 flex relative ">
                      <div className="w-[50px] h-[50px]  bg-circle rounded-full bg-pink-2 relative">
                        <img className="w-[25px] h-[25px] bg-transparent rounded-full top-0 -right-3 absolute  " src={verifyImage}></img>
                      </div>

                    </div>
                    <div className="p-6 pt-3 pb-3">
                      <a href="#" >
                        <img
                          className="object-cover object-center rounded-xlarge h-60 w-full "
                          src={`https://ipfs.fleek.co/ipfs/${item.metadata.media}`}
                          key={key}
                          alt={item.description}
                        />
                      </a>
                    </div>
                    <div className="p-6 pt-3">
                      <div className="text-black text-sm font-raleway font-bold">#{item.token_id}</div>
                      <div className="capitalize text-black text-ellipsis overflow-hidden whitespace-nowrap font-raleway font-normal">{item.metadata.title}</div>
                      <a href={'detail/'+item.token_id} >
                        <div >
                          <p className="text-orange text-sm font-raleway font-bold">{t("Landing.trending-buy")}</p>
                          </div>
                      </a>
                    </div>
                  </div>
                  </div>
                </div>
              );
            })}
          </Slider>
          
        </div>
      </div>
    </section>
  );
}


export default Trendings;
