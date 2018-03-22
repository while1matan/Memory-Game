import React from 'react';
import "./CenterLayout.css"

export default function CenterLayout(props){
    return (
        <div className="center_layout ">
            <div className={"content " + props.className}>
                {props.children}
            </div>
        </div>
    );
}