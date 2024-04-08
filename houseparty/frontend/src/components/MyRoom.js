import { Grid, Typography, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import CreateRoom from './CreateRoom.js';
import MusicPlayer from "./MusicPlayer.js";


const MyRoom = ({ leaveRoomCallBack }) => {
  
  const[roominfo, setRoomInfo] = useState({});
  const[showSetting, setShowSetting] = useState(false);
  const[spotifyAuth, setSpotifyAuth] = useState(false);
  const[song, setSong] = useState({});

  const navigate = useNavigate();

  function handleLeaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
    };
    fetch('/api/leave-room', requestOptions)
      .then((response) => {
        leaveRoomCallBack();
        navigate('/');
      })
  }

  function authenticateSpotify() {
    fetch('/spotify/is-authenticated')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setSpotifyAuth(data.status);
        if (!data.status) {
          console.log("Need authorization")
          fetch('/spotify/get-auth-url')
            .then((response) => response.json())
            .then((data) => {
              // console.log(data);
              window.location.replace(data.url);
            })
        }
      })
  }

  function getRoomDetails(myRoomCode) {
    fetch('/api/get-room' + '?code=' + myRoomCode)
        .then((response) => {
          if (!response.ok){
            leaveRoomCallBack();
            navigate('/');
          } else {
            return response.json();
          }
        })
        .then((data) => {
          setRoomInfo(data);
          if (data.is_host) {
            authenticateSpotify();
          }
        });
  }

  useEffect(() => {
    getRoomDetails(roomCode);

    function getCurrentSong() {
      fetch('/spotify/current-song')
        .then((response) => {
          if (!response.ok) {
            return {};
          } else {
            return response.json();
          }
        })
        .then((data) => {
          console.log(data);
          setSong(data)})
    }

    const interval = setInterval(getCurrentSong, 1500);
    return () => clearInterval(interval);
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

        <Grid item xs align="center"></Grid>
        <Grid item xs={5} align="center">
          <MusicPlayer currentSong={song}/>
        </Grid>
        <Grid item xs align="center"></Grid>

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