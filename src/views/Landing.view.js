import React, { useEffect } from "react";

//components
import Hero from "../components/Hero.component";
import Steps from "../components/steps.component";
import NftSteps from "../components/NftSteps.component";
import Statisct from "../components/statistc.component";
import Trendings from "../components/Trendings.component";
import Aos from "aos";
import "aos/dist/aos.css";

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
      <Hero />
      <NftSteps/>
      <Trendings/>
      <Statisct theme={Landing.theme} />
    </>
  );
}
