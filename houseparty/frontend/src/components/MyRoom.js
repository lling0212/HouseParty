import { Grid, Typography, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import CreateRoom from './CreateRoom.js';


const MyRoom = ({ leaveRoomCallBack }) => {
  
  const[roominfo, setRoomInfo] = useState({});
  const[showSetting, setShowSetting] = useState(false);
  const navigate = useNavigate();

  function handleLeaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
    };
    fetch('/api/leave-room', requestOptions)
      .then((response) => {
        console.log("leaving");
        leaveRoomCallBack();
        navigate('/');
      })
  }

  function getRoomDetails(myRoomCode) {
    fetch('/api/get-room' + '?code=' + myRoomCode)
        .then((response) => {
          if (!response.ok){
            leaveRoomCallBack();
            navigate('/');
          } else {
            return response.json()
          }
        })
        .then((data) => {
              setRoomInfo(data);
          });
  }
  
  useEffect(() => {
    getRoomDetails(roomCode);
  }, []);
  

  let { roomCode } = useParams();
  return (
    <>
    {showSetting ? (
      
        <Grid container spacing={1}>

          <Grid item xs={12} align="center">
            <CreateRoom 
              isUpdate={true} 
              currentVotesToSkip={roominfo.votes_to_skip}
              currentGuestCanPause={roominfo.guest_can_pause}
              currentRoomCode={roomCode}
              updateCallBack={getRoomDetails}
              />
          </Grid>

          <Grid item xs={12} align="center">
            <Button variant="contained" color="secondary" onClick={()=>setShowSetting(false)}>
              Close
            </Button>
          </Grid>
      
        </Grid>
    ) : ( 
      <Grid container spacing={1}>

        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {roomCode}
          </Typography>
        </Grid>

        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Votes to Skip: {roominfo.votes_to_skip}
          </Typography>
        </Grid>

        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Guest Can Pause: { roominfo.guest_can_pause ? 'Yes' : 'No' }
          </Typography>
        </Grid>

        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Host: { roominfo.is_host ? 'Yes' : 'No' }
          </Typography>
        </Grid>

        { roominfo.is_host && (
          <Grid item xs={12} align="center">
            <Button variant="contained" color="primary" onClick={()=>setShowSetting(true)}>
            Settings
            </Button>
          </Grid>
        ) }

        <Grid item xs={12} align="center">
          <Button variant="contained" color="secondary" onClick = { handleLeaveButtonPressed }>
            Leave Room
          </Button>
        </Grid>

      </Grid>
    )}
    </>
    
    )

}



export default MyRoom