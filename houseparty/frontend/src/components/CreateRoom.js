import React, { useState } from "react";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { Link, useNavigate } from "react-router-dom";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Collapse } from "@mui/material";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material';


export default function CreateRoom(
    { isUpdate, currentVotesToSkip, currentGuestCanPause, currentRoomCode, updateCallBack }
    ) {
    const defaultVotes = 2;
    const navigate = useNavigate();
    const [title, setTitle] = useState(() => isUpdate ? `Update Room: ${currentRoomCode}` : "Create A Room");
    const [guestCanPause, setGuestCanPause] = useState(() => isUpdate? currentGuestCanPause : true);
    const [votesToSkip, setVotesToSkip] = useState(() => isUpdate? currentVotesToSkip : defaultVotes);
    const [msg, setMsg] = useState("");
    const [success, setSuccess] = useState(true);

    function handleVotesChange(e) {
        setVotesToSkip(e.target.value);
    }

    function handleGuestCanPauseChange(e) {
        setGuestCanPause(e.target.value === "true" ? true : false);
    }

    function handleRoomButtonPressed() {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause
            }),
        };
        fetch("/api/create-room", requestOptions)
            .then((response) => response.json())
            .then((data => {
                console.log(data);
                navigate('/room/' +  data.code);
            })
        );
    }

    function handleUpdateButtonPressed() {
        const requestOptions = {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
                code: currentRoomCode
            }),
        };
        fetch("/api/update-room", requestOptions)
            .then((response) => {
            if (response.ok) {
                setMsg("Room updated successfully!");
            } else {
                setSuccess(false);
                setMsg("Error updating room...");
            }
            updateCallBack(currentRoomCode);
        });
    }

    return (
    <Grid container spacing={1}>
        <Grid item xs={12} align="center">
            <Collapse in={msg != ""}>
                {success ? (
                    <Alert severity="success"
                        onClose={() => {setMsg("");}}>
                        {msg}
                    </Alert>
                ) : (
                    <Alert severity="error"
                        onClose={() => {setMsg("");}}>
                        {msg}
                    </Alert>
                )};
            </Collapse>
        </Grid>

        <Grid item xs={12} align="center">
            <Typography component='h4' variant='h4'>
                { title } 
            </Typography>
        </Grid>

        <Grid item xs={12} align="center">
            <FormControl component="fieldset">
                <FormHelperText align='center'>
                    Guest Control of Playback State
                </FormHelperText>

                <RadioGroup row 
                defaultValue="true"
                onChange={handleGuestCanPauseChange}>
                    <FormControlLabel 
                        value={isUpdate ? (currentGuestCanPause ? "true" : "false") : "true" }
                        control={<Radio color="primary"/>}
                        label="Play/Pause"
                        labelPlacement="bottom"
                        />
                    <FormControlLabel 
                        value={isUpdate ? (currentGuestCanPause ? "false" : "true") : "false" }
                        control={<Radio color="secondary"/>}
                        label="No Control"
                        labelPlacement="bottom"
                        />
                </RadioGroup>

            </FormControl>

            <Grid item align="center">
                <TextField 
                    required={true}
                    type="number"
                    onChange={handleVotesChange}
                    defaultValue={isUpdate ? currentVotesToSkip : defaultVotes}
                    inputProps={{
                        min: 1,
                        style: {textAlign: "center" },
                    }}/>

                <FormHelperText style={{ textAlign: "center" }}>
                    Votes Required to Skip Song
                </FormHelperText>
            </Grid>
            
        </Grid>
        
        { isUpdate ? (
            <Grid item xs={12} align="center">
                <Button color='primary' variant='contained'
                    onClick={handleUpdateButtonPressed}>
                    Update
                </Button>
            </Grid>
        ) : (
            <Grid item xs={12} align="center">
                <Button color='primary' variant='contained'
                    onClick={handleRoomButtonPressed}>
                    Create A Room
                </Button>
            </Grid>
        ) }
        
        { !isUpdate && (
            <Grid item xs={12} align="center">
                <Button color='secondary' variant='contained' to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        )}

    </Grid>
    )

}