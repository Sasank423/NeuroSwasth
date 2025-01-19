import React from "react";
import { DNA } from 'react-loader-spinner';

import { ToastContainer } from "react-toastify";


export default function Spinner()  {
  return (
    <div className="sl_cont" style={{'backgroundColor':'transparent','display':'flex','width':'100vw','height':'100vh','alignItems':'center','justifyContent':'center'}}>
      <DNA
        visible={true}
        height="150"
        width="200"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
        />
        <ToastContainer />
    </div>
    
  );
};