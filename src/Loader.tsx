import React from 'react';

function Button({ isOpen, onClick }: { isOpen?: boolean; onClick?: React.MouseEventHandler<HTMLButtonElement>; }) {
  return <button className='close-open-btn' onClick={onClick}>{isOpen ? "-" : "+"}</button>;
}

const flexStyle = {
  display: "flex", 
  alignItems: "center", 
  justifyContent: "center"
}



function Loader({children}: {children: string}) {
  return <div style={flexStyle}><p style={{fontSize: "25px", marginTop: "40px"}}>{children}</p></div>
}
function GreetingMessage(){
  return <div style={flexStyle}><p style={{fontSize: "25px", marginTop: "40px", color: "lightblue"}}>Search for the movies you want!</p></div>
}
function ErrorMessage({ children }: { children?: string | boolean }) {
  return <div style={flexStyle}><p style={{ color: "#fc0000" , fontSize: "25px", marginTop: "40px"}}>{children && children}</p></div>
}


export {Button, Loader, ErrorMessage, GreetingMessage};