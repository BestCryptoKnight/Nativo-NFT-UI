import React from "react";
import croppedCA from '../assets/img/landing/sponsorsSection/cropped-CA.png';
import Union from '../assets/img/landing/sponsorsSection/Union.png';
import { useTranslation } from "react-i18next";

function Sponsors() {
  const [t, i18n] = useTranslation("global");
  

  return (
    <section className="open-sans  h-[290px] lg:h-[350px] overflow-hidden bg-grayColor " >
      <div className="w-full md:pt-4 pb-8 dark:flex flex-row flex-wrap justify-center" >
        <div className="w-full  pt-6 pb-8 mx-auto ">
          <h2 className="text-dark-blue pt-5 px-4  w-[250px]  mx-auto text-center lg:w-1/2  text-3xl  md:px-6
                        lg:px-8 mb-4  font-clash-grotesk  font-semibold leading-9  lg:text-4xl">{t("Landing.supporting-title")}</h2>

        </div>
        <div className=" w-full flex justify-around  ">
          <img
            className="h-[30px] lg:h-24   bg-center w-[120px] lg:w-[300px] "
            src={Union}

            alt={Union}
          />
          <img
            className="h-[50px] lg:h-20 w-[120px] lg:w-[300px] bg-center"
            src={croppedCA}

            alt={croppedCA}
          />

        </div>
      </div>
    </section>
  );
}


export default Sponsors;
