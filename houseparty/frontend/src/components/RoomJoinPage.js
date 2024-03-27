import { React, useState } from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function RoomJoinPage() {
    const navigate = useNavigate();
    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");
    const [hasError, setHasError] = useState(false);

    function handleTextFieldChange(e) {
        setRoomCode(e.target.value);
    }

    function handleButtonPressed() {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                code: roomCode,
            }),
        };
        fetch("/api/join-room", requestOptions)
            .then((response) => {
            if (response.ok) {
                navigate("/room/" + roomCode);
            } else {
                setHasError(true);
                setError("Room not found.");
            }})
            .catch((error) => {
                console.log(error);
            });
    }
    
    return (
        <Grid container spacing={1} alignItems="center">

            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Join a Room
                </Typography>
            </Grid>

            <Grid item xs={12} align="center">
                <TextField 
                    error= { hasError }
                    label="Code"
                    placeholder="Enter a Room Code"
                    helperText={ error }
                    variant="outlined"
                    onChange={ handleTextFieldChange }
                />
            </Grid>

            <Grid item xs={12} align="center">
                <Button 
                    variant="contained"
                    color="primary"
                    onClick = { handleButtonPressed }
                    component = { Link }
                    >
                    Enter Room
                </Button>
            </Grid>

            <Grid item xs={12} align="center">
                <Button 
                    variant="contained"
                    color="secondary"
                    to="/"
                    component = { Link }>
                    Back
                </Button>
            </Grid>

        </Grid>
    )

}