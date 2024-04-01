import { React, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoom from "./CreateRoom";
import MyRoom from "./MyRoom";
import Info from "./Info";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";


function HomePageChild() {

    return (
        <Grid container spacing={3}>

            <Grid item xs={12} align="center">
                <Typography variant="h3" component="h3">
                    House Party
                </Typography>
            </Grid>

            <Grid item xs={12} align="center">
                <ButtonGroup disableElevation variant="contained" color="primary">
                    <Button color="primary" to="/join" component={ Link }>
                        Join a Room
                    </Button>
                    <Button color="success" to="/info" component={ Link }>
                        Info
                    </Button>
                    <Button color="secondary" to="/create" component={ Link }>
                        Create a Room
                    </Button>
                </ButtonGroup>
            </Grid>

        </Grid>
    );

}

function HomePage() {

    const [roomCode, setRoomCode] = useState(null);

    function clearRoomCode() {
        setRoomCode(null);
    }

    useEffect(()=> {
        fetch("/api/user-in-room")
            .then((response) => response.json())
            .then((data) => {
                setRoomCode(data.code)
            });

    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={ 
                    roomCode ? ( <Navigate replace to={`/room/${roomCode}`} /> ) :
                    <HomePageChild />
                    }/>
                <Route path="/join" element={<RoomJoinPage />}/>
                <Route path="/create" element={<CreateRoom />}/>
                <Route path="/info" element={<Info />}/>
                <Route path="/room/:roomCode" element={ 
                    <MyRoom leaveRoomCallBack={clearRoomCode}/>
                    }/>
            </Routes>
        </Router>
    )

}

export default HomePage