import React, { useState } from "react";
import Navbar from "../components/Navbar/Index";
import { useOutletContext } from "react-router-dom";
import { faLeaf, faFloppyDisk, faFolderPlus, faLink, faPhone,faSquareXmark, faSquarePlus ,faAnchorCircleXmark} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DeleteFields from "../components/DeleteFieldsComponent";
import DeleteFarms from "../components/DeleteFarmComponent";
import DeleteSeasons from "../components/DeleteSeasonComponent";
import icon from "./icon.png";
function Trash() {
 
  return (
    <>
       <main className="h-full">
        {/* Main Content */}
        <div className="mainCard">
          <div className="border w-full border-gray-200 bg-white py-4 px-6 rounded-md">
                
              
                {/* <div className="font-semibold text-3xl items-center text-green-700 px-4 py-6">
                    <FontAwesomeIcon icon={faLeaf}></FontAwesomeIcon> Harvesting Change 
                </div> */}
                   <div className="font-semibold text-3xl flex items-center text-green-700 px-2 py-4">
                 <div className="flex items-center space-x-2">
                  <img
                    src={icon}
                    alt="Your Icon Alt Text"
                    className="h-30 w-20"
                  />
                  <span className="whitespace-nowrap">DeleteHub</span>
                </div>
              </div>

                <text className="font-extrabold text-2xl items-center text-black px-6 py-6">Remove Fields</text>
                <br></br>
                <text className='font-lighter text-sm items-center text-black px-6 py-4'>Effortlessly remove farms and fields, cultivating a digital landscape tailored to your needs</text>
                
                <div className="mt-6 flex flex-row gap-4 px-4 "></div>
            </div>
            
            <DeleteFarms/>
            <DeleteFields/>
            <DeleteSeasons/>
            </div>
         
            </main>
    </>
  );
}

export default Trash;
