import React from "react";
import  'font-awesome/css/font-awesome.min.css';

const Footer = () => {
    return (
      <>
        <footer
          style={{
            background: "rgb(0,5,24)",
            background: "-moz-linear-gradient(167deg, rgba(0,5,24,1) 0%, rgba(13,12,12,1) 100%)",
            background: "-webkit-linear-gradient(167deg, rgba(0,5,24,1) 0%, rgba(13,12,12,1) 100%)",
            background: "linear-gradient(167deg, rgba(0,5,24,1) 0%, rgba(13,12,12,1) 100%)",
            filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr='#000518',endColorstr='#0d0c0c',GradientType=1)",
          }}
        >
          <div className="text-white flex justify-end p-1 space-x-2">
            <p>&copy; Rodrigo Barenco 2023 - build with react.js</p>
            <a href="https://github.com/RodBarenco">
              <i className="fa fa-solid fa-github fa-1x"></i>
            </a>
            <a href="https://www.linkedin.com/in/rodrigobarenco">
              <i className="fa fa-solid fa-linkedin fa-1x"></i>
            </a>
          </div>
        </footer>
      </>
    );
  };
  
export default Footer;
