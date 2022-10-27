import React, { useState } from "react";
import { Route } from "react-router-dom";

import NearProtectedRoute from "./NearProtectedRoute.hoc";

// comprueba que hay una red seleccionada y manda una ruta
const BlockchainProtectedRoute = ({ component: Component, ...rest }) => {
  const [state, setState] = useState({
    show: true,
    title: "Selecciona una wallet",
  });

  return (
    <>
      <Route
        {...rest}
        render={(props) => {
          return localStorage.getItem("blockchain") ? (
            localStorage.getItem("blockchain") == "0" ? (
              ""
            ) : (
              <NearProtectedRoute component={Component} {...props} />
            )
          ) : (
            ""
          );
        }}
      />
    </>
  );
};

export default BlockchainProtectedRoute;
