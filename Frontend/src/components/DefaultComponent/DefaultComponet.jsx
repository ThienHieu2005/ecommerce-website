import React from "react";
import HeaderComponet from '../HeaderComponet/HeaderComponet'
import FooterComponent from '../FooterComponent/FooterComponent'
const DefaultComponet = ({ children }) => {
  return (
    <div>
      <HeaderComponet />
      {children}
      <FooterComponent />
    </div>
  );
};

export default DefaultComponet;