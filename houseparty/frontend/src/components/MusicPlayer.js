import { React, useState, useEffect } from "react";
import { Box, Typography, Card, IconButton, LinearProgress, CardContent, CardMedia } from "@mui/material";
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
        <Card sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>

                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="h5" variant="h5">
                        {JSON.stringify(currentSong) === '{}' ? "There is no song currently playing..." : currentSong.title}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                        {JSON.stringify(currentSong) === '{}' ? "" : currentSong.artist}
                    </Typography>
                </CardContent>
                    
                { JSON.stringify(currentSong) !== '{}' &&
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                        <IconButton onClick={()=>{
                            currentSong.is_playing ? pauseSong() : playSong()
                        }}>
                            {currentSong.is_playing ? <Pause/> : <PlayArrow/>}
                        </IconButton>

                        <IconButton onClick={()=>{ skipSong() }}>
                            {`${currentSong.votes} / ${currentSong.votes_required}`} <SkipNext />
                        </IconButton>
                    </Box>
                }
                <LinearProgress variant="determinate" value={ songProgress }/>
            </Box>
            <CardMedia
                component="img"
                sx={{ width: 200 }}
                image={JSON.stringify(currentSong) === '{}' ?
                    "../static/default.jpg"
                    : currentSong.image_url
            }/>

        </Card>
    );

}

export default MusicPlayer;
