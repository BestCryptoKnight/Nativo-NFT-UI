import React from "react";
import PropTypes from "prop-types";
function Modal(props) {
  return (
    props.show && (
      <>
        <div className="  justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
          <div className="w-full md:w-6/12 my-6  rounded ">
            {/*content*/}
            <div className=" rounded-lg shadow-lg  flex flex-col  bg-white outline-none focus:outline-none">
              {/*header*/}

              <div
                className={` bg-${props.theme}-500 flex items-start justify-center font-bold uppercase p-5 border-b border-solid border-${props.theme}-200 rounded text-white`}
              >
                {props.title}
              </div>
              <div className="relative p-6 flex flex-col ">
                <div className="flex justify-center">
                  {props.loading ? (
                    <svg
                      className="animate-spin  h-10 w-10 text-gray 500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <p className=" my-4 text-center text-2xl leading-relaxed">
                      {props.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    className={`bg-${props.theme}-500 w-min mt-3  text-white active:bg-${props.theme}-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none  ease-linear transition-all duration-150 `}
                    type="button"
                    disabled={props.disabled}
                    onClick={() => {
                      props.change({ show: false });
                    }}
                  >
                    continuar
                  </button>
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
  theme: "yellow",
};

export default Modal;
