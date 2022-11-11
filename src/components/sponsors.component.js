import React from "react";
import croppedCA from '../assets/img/landing/sponsorsSection/cropped-CA.png';
import Union from '../assets/img/landing/sponsorsSection/Union.png';
import CloudMex from '../assets/img/landing/sponsorsSection/cropped-CA.png';


import { useTranslation } from "react-i18next";

function Sponsors() {
  const [t, i18n] = useTranslation("global");
  

  return (
    <section className="open-sans  h-[290px] lg:h-[350px] overflow-hidden bg-grayColor " >
      <div className="w-full md:pt-4 dark:flex flex-row flex-wrap justify-center" >
        <div className="w-full  pt-6 pb-8 mx-auto ">
          <h2 className="text-dark-blue pt-5 px-4  w-[250px]  mx-auto text-center lg:w-1/2  text-3xl  md:px-6
                        lg:px-8 mb-4  font-clash-grotesk  font-semibold leading-9  lg:text-4xl">{t("Landing.supporting-title")}</h2>

        </div>
        <div className=" w-full flex justify-around  ">
          <div className="h-[65px] lg:h-20 w-[150px] lg:w-[280px] bg-center mt-4">
            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 342 90" >
        <path d="M171.21,18.75v52.5a.76.76,0,0,1-.75.75H165a7.49,7.49,0,0,1-6.3-3.43l-24.78-38.3.85,19.13V71.25A.76.76,0,0,1,134,72h-7.22a.76.76,0,0,1-.75-.75V18.75a.76.76,0,0,1,.75-.75h5.43a7.52,7.52,0,0,1,6.3,3.42l24.78,38.24-.77-19.06V18.75a.75.75,0,0,1,.75-.75h7.22A.76.76,0,0,1,171.21,18.75Z"></path>
        <path d="M245,72h-7.64a.75.75,0,0,1-.7-1L256.9,18.72A1.14,1.14,0,0,1,258,18h9.57a1.14,1.14,0,0,1,1.05.72L288.8,71a.75.75,0,0,1-.7,1h-7.64a.76.76,0,0,1-.71-.48l-16.31-43a.75.75,0,0,0-1.41,0l-16.31,43A.76.76,0,0,1,245,72Z"></path>
        <path d="M341.84,70.79,326.66,51.4c8.57-1.62,13.58-7.4,13.58-16.27,0-10.19-6.63-17.13-18.36-17.13H300.71a1.12,1.12,0,0,0-1.12,1.13h0a7.2,7.2,0,0,0,7.2,7.2H321c7.09,0,10.49,3.63,10.49,8.87s-3.32,8.95-10.49,8.95H300.71a1.13,1.13,0,0,0-1.12,1.13v26a.75.75,0,0,0,.75.75h7.22a.76.76,0,0,0,.75-.75V51.87h8.33l13.17,17.19a7.51,7.51,0,0,0,6,2.94h5.48A.75.75,0,0,0,341.84,70.79Z"></path>
        <path d="M222.17,18h-33.5a1,1,0,0,0-1,1h0A7.33,7.33,0,0,0,195,26.33h27.17a.74.74,0,0,0,.75-.75V18.75A.75.75,0,0,0,222.17,18Zm0,45.67h-25a.76.76,0,0,1-.75-.75V49.38a.75.75,0,0,1,.75-.75h23.11a.75.75,0,0,0,.75-.75V41a.75.75,0,0,0-.75-.75H188.79a1.13,1.13,0,0,0-1.12,1.13V70.88A1.12,1.12,0,0,0,188.79,72h33.38a.75.75,0,0,0,.75-.75V64.42A.74.74,0,0,0,222.17,63.67Z"></path>
        <path d="M72.24,4.57,53.42,32.5a2,2,0,0,0,3,2.63L74.91,19.08a.74.74,0,0,1,1.24.56V69.93a.75.75,0,0,1-1.32.48l-56-67A9.59,9.59,0,0,0,11.54,0H9.59A9.59,9.59,0,0,0,0,9.59V80.41A9.59,9.59,0,0,0,9.59,90h0a9.59,9.59,0,0,0,8.17-4.57L36.58,57.5a2,2,0,0,0-3-2.63L15.09,70.92a.74.74,0,0,1-1.24-.56V20.07a.75.75,0,0,1,1.32-.48l56,67A9.59,9.59,0,0,0,78.46,90h2A9.59,9.59,0,0,0,90,80.41V9.59A9.59,9.59,0,0,0,80.41,0h0A9.59,9.59,0,0,0,72.24,4.57Z"></path>
      </svg>
      </div>
          <img
            className="h-[65px] lg:h-20 w-[150px] lg:w-[280px] bg-center"
            src={CloudMex}
            fill="#000"
            alt={CloudMex} 
          />

        </div>
      </div>
    </section>
  );
}


export default Sponsors;
