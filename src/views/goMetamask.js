import React from "react";
import metamasklogo from "../icons/metamasklogo.png";

/**
 *
 * se muestra cuando el usuario no cuenta con emtamask
 */
export default function goMetamask() {
  return (
    <div className="container mx-auto flex  my- md:flex-row flex-col  justify-center h-96 items-center text-3xl">
      <div className="flex flex-col justify-center">
        <h1 className="text-center">Haz click e instala metamask</h1>
        <a href="https://metamask.io/download.html">
          <img
            src={metamasklogo}
            alt="logo de metamask"
            className="h-32 mx-auto "
          />
        </a>
      </div>
    </div>
  );
}
