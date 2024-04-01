import { React, useState, useEffect } from "react";
import { Grid, Typography, Card, IconButton, LinearProgress } from "@mui/material";
import { PlayArrow, SkipNext, Pause } from "@mui/icons-material";


function MusicPlayer({ currentSong }) {

    const songProgress = (currentSong.time / currentSong.duration) * 100;

    function pauseSong() {
        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        };
        fetch("/spotify/pause", requestOptions);
    }
    
    function playSong() {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/spotify/play", requestOptions);
    }

    function skipSong() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/spotify/skip", requestOptions);
    }

    return (
        <Card>
            <Grid container alignItems="center">
                <Grid item align="center" xs={4}>
                    <img src={currentSong.image_url} height="100%" width="100%"/>
                </Grid>

                <Grid item align="center" xs={8}>
                    <Typography component="h5" variant="h5">
                        {currentSong.title}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                        {currentSong.artist}
                    </Typography>
                </Grid>

                <div>
                    <IconButton onClick={()=>{
                        currentSong.is_playing ? pauseSong() : playSong()
                    }}>
                        {currentSong.is_playing ? <Pause/> : <PlayArrow/>}
                    </IconButton>

                    <IconButton onClick={()=>{ skipSong() }}>
                        {`${currentSong.votes} / ${currentSong.votes_required}`} <SkipNext />
                    </IconButton>
                </div>
            </Grid>
            
            <LinearProgress variant="determinate" value={ songProgress }/>

        </Card>
    );

}

export default MusicPlayer;
