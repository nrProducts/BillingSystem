import React, { useEffect } from "react";
import Bill from "./BillPerview";

const BillContainer = (props) =>{

    return <Bill  selectedItems = {props?.selectedItems} total = {props?.total} handleRemove = {props?.handleRemove}/>
}

export default BillContainer