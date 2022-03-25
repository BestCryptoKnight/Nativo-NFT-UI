import React, { useState } from "react";
import { sliderData } from "../assets/landingSlider/sliderData";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
export default function ImageSlider() {
  const [state, setState] = useState(0);
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
  };

  return (
    <>
      <Slider {...settings} className="sliderr">
        {sliderData.map((item, key) => {
          return (
            <img
              className="object-cover object-center rounded h-60 "
              src={item.img}
              key={key}
              alt={item.alt}
            />
          );
        })}
      </Slider>
    </>
  );
}
