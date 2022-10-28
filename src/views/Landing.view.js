import React, { useEffect } from "react";

//components
import Hero from "../components/Hero.component";
import Steps from "../components/steps.component";
import NftSteps from "../components/NftSteps.component";
import Statisct from "../components/statistc.component";
import Trendings from "../components/Trendings.component";
import Aos from "aos";
import "aos/dist/aos.css";
import { Helmet } from 'react-helmet-async';


export default function Landing() {
  const [Landing, setLanding] = React.useState({ theme: "yellow" });
  window.localStorage.setItem("page",0);
  window.localStorage.setItem("auctionpage",0);
  window.localStorage.setItem("tokenspage",30);
  useEffect(() => {
    Aos.init({
      duration:2000,
      once: true
    });
  });
  return (
    <>
      <Helmet>
        <meta property="og:title" content="Nativo NFT" />
        <meta property="og:description" content="Marketplace de NFT creado por y para la comunidad latina e hispano hablante creado sobre NEAR Protocol." />
        <meta property="og:image" content="https://www.talent-network.org/comunidades/wp-content/uploads/2022/09/tn-comunidades-22-nativo.png" />
        <meta property="og:url" content="https://deletejsfiles-metatags.dphj3ja30lftx.amplifyapp.com/" />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Marketplace de NFT creado por y para la comunidad latina e hispano hablante creado sobre NEAR Protocol" />
        <title>Nativo NFT</title>
      </Helmet>
      <Hero />
      <NftSteps/>
      <Trendings/>
      <Statisct theme={Landing.theme} />
    </>
  );
}
