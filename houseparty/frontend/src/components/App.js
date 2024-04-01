import React, { Component } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import HomePage from "./HomePage.js";

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
        <div className="center" 
            style={{ 
                height: "100vh", // Set height to full viewport height
                width: "100vw",
                backgroundImage: "url(../static/background.jpg)",
                backgroundSize: "cover", 
                backgroundPosition: "center", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center"
                }}>
            <HomePage />
        </div>
        </ThemeProvider>
    );

}

export default App