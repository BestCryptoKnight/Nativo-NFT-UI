import React from "react";
import PropTypes from "prop-types";
function Modal(props) {
  function changeBlockchain(index) {
    localStorage.setItem("blockchain", index);
    window.location.reload();
  }
  return (
    props.show && (
      <>
        <div className="  justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
          <div className="w-full md:w-6/12 my-6  rounded ">
            {/*content*/}
            <div className=" rounded-lg shadow-lg  flex flex-col  bg-white outline-none focus:outline-none">
              {/*header*/}

              <div
                className={`shadow-inner bg-${props.theme}-500 flex items-start justify-center font-bold uppercase p-5 border-b border-solid border-yellow-200 rounded text-yellow-500`}
              >
                {props.title}
              </div>
              <div className="relative p-6 flex  justify-center ">
                <div className="flex flex-col   w-full">
                  <div
                    className="flex justify-around md:justify-evenly items-center  hover:bg-gray-50"
                    onClick={() => {
                      changeBlockchain(0);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 120 100"
                      width="50"
                      height="50"
                      className="my-2"
                    >
                      <path
                        d="M56 4c-3.22 0-6.3.91-8.937 2.538a16.984 16.984 0 00-6.268 6.856l-34.998 70A17.001 17.001 0 0021.002 108h69.996a17 17 0 0015.206-24.606l-35-70a16.984 16.984 0 00-6.267-6.856A16.99 16.99 0 0056 4z"
                        stroke="#71D34B"
                        stroke-width="8"
                        fill="none"
                        fill-rule="evenodd"
                      />
                    </svg>
                    <p className=" font-serif text-3xl">Aurora</p>
                  </div>
                  <div
                    className="flex justify-around md:justify-evenly items-center hover:bg-gray-50"
                    onClick={() => {
                      changeBlockchain(1);
                    }}
                  >
                    <svg
                      width="50"
                      height="50"
                      xmlns="http://www.w3.org/2000/svg"
                      className="my-2 "
                      fill="black"
                      viewBox="1 0 36 30"
                    >
                      <g>
                        <path
                          id="svg_1"
                          fill="black"
                          d="m25.9391,1.62495l-6.6274,9.93065c-0.1074,0.1433 -0.157,0.3224 -0.139,0.5012c0.0181,0.1788 0.1026,0.3441 0.2364,0.4625c0.1339,0.1185 0.3072,0.1814 0.4851,0.1761c0.1779,-0.0053 0.3473,-0.0784 0.4739,-0.2047l6.5218,-5.68887c0.0376,-0.03482 0.0845,-0.05772 0.1349,-0.06588c0.0503,-0.00815 0.102,-0.0012 0.1485,0.02001c0.0465,0.0212 0.0858,0.05571 0.113,0.09926c0.0273,0.04355 0.0413,0.09422 0.0403,0.14572l0,17.88086c-0.0006,0.0543 -0.0175,0.1071 -0.0486,0.1514c-0.031,0.0443 -0.0748,0.078 -0.1253,0.0966c-0.0505,0.0185 -0.1055,0.0211 -0.1575,0.0072c-0.052,-0.0138 -0.0985,-0.0433 -0.1335,-0.0845l-19.72016,-23.82221c-0.31482,-0.38245 -0.70868,-0.69073 -1.15397,-0.90325c-0.44529,-0.21251 -0.93122,-0.32411 -1.42374,-0.32697l-0.68669,0c-0.89565,0 -1.75463,0.35924 -2.38795,0.9987c-0.63333,0.63945 -0.98913,1.50674 -0.98913,2.41107l0,25.18036c0,0.9044 0.3558,1.7716 0.98913,2.4111c0.63332,0.6395 1.4923,0.9987 2.38795,0.9987c0.57711,-0.0001 1.14456,-0.1495 1.64822,-0.4339c0.50366,-0.2845 0.92673,-0.6945 1.22882,-1.191l6.62742,-9.9306c0.1074,-0.1434 0.157,-0.3224 0.1389,-0.5012c-0.018,-0.1788 -0.1025,-0.3441 -0.2363,-0.4626c-0.1339,-0.1185 -0.3072,-0.1814 -0.4851,-0.1761c-0.178,0.0054 -0.3473,0.0785 -0.474,0.2048l-6.52172,5.6888c-0.0376,0.0349 -0.08449,0.0578 -0.13487,0.0659c-0.05037,0.0082 -0.10201,0.0012 -0.14851,-0.02c-0.04649,-0.0212 -0.0858,-0.0557 -0.11305,-0.0993c-0.02725,-0.0435 -0.04124,-0.0942 -0.04023,-0.1457l0,-17.86305c0.00053,-0.05429 0.01746,-0.10712 0.04853,-0.15143c0.03106,-0.04431 0.07478,-0.078 0.12531,-0.09655c0.05053,-0.01855 0.10547,-0.02109 0.15747,-0.00728c0.052,0.01382 0.09858,0.04333 0.13352,0.08459l19.72015,23.82222c0.3173,0.379 0.7126,0.6835 1.1584,0.8923c0.4458,0.2088 0.9314,0.3168 1.4229,0.3165l0.7043,0c0.4434,0 0.8826,-0.0882 1.2923,-0.2595c0.4097,-0.1714 0.782,-0.4225 1.0956,-0.7392c0.3136,-0.3166 0.5624,-0.6925 0.7321,-1.1062c0.1697,-0.4137 0.257,-0.857 0.257,-1.3048l0,-25.17686c0.0001,-0.44958 -0.088,-0.89472 -0.259,-1.30981c-0.1711,-0.41509 -0.4217,-0.79193 -0.7375,-1.10884c-0.3159,-0.31691 -0.6907,-0.56762 -1.1028,-0.73772c-0.4122,-0.1701 -0.8536,-0.25622 -1.2989,-0.2534c-0.5771,0.00007 -1.1445,0.14946 -1.6482,0.43392c-0.5036,0.28445 -0.9267,0.69448 -1.2288,1.19096z"
                        />
                      </g>
                    </svg>
                    <p className="font-serif text-3xl ">Near</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    )
  );
}

Modal.propTypes = {
  theme: PropTypes.string,
};

Modal.defaultProps = {
  theme: "white",
};

export default Modal;
