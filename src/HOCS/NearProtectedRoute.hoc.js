import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { isNearReady } from "../utils/near_interaction";
import GoNear from "../views/goNear";

const NearProtectedRoute = ({ component: Component, ...rest }) => {
  const [state, setState] = useState(false);
  useEffect(() => {
    (async () => {
      setState(await isNearReady());
    })();
  }, []);
  return (
    <>
      <Route
        {...rest}
        render={(props) => {
          return state ? <Component {...props} /> : <GoNear />;
        }}
      />
    </>
  );
};

export default NearProtectedRoute;
