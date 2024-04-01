import { React, useState, useEffect } from "react";
import { Grid, Button, Typography, IconButton } from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { Link } from "react-router-dom";

const pages = {
    JOIN: "pages.join",
    CREATE: "pages.create",
}

export default function Info() {

    const [page, setPage] = useState(pages.CREATE);
    
    function joinInfo() {
        return "Join";
    }

    function createInfo() {
        return "Create";
    }

    return (
        <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    What is House Party?
                </Typography>
            </Grid>

            <Grid item xs={12} align="center">
                <Typography variant="body1">
                    { page === pages.JOIN ? joinInfo() : createInfo() }
                </Typography>
            </Grid>

            <Grid item xs={12} align="center">
                <IconButton onClick={()=>{
                    page === pages.CREATE ? setPage(pages.JOIN): setPage(pages.CREATE)
                    }}>
                    {page === pages.CREATE ? <NavigateBefore/> : <NavigateNext/>}
                </IconButton>
            </Grid>

            <Grid item xs={12} align="center">
                <Button color='secondary' variant='contained' to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>

    )
}
