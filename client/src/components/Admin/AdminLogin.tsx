import {
  Box, Button, FormControl, InputAdornment, IconButton, FilledInput, InputLabel, FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";
import { AdminLoginProps } from "../types";

function AdminLogin({ setAuthenticated }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(0);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: "password" | "username") => {
    switch (type) {
      case "username":
        setUsername(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
      default:
        console.error("wrong input");
    }
  };

  const handleLogin = () => {
    if (username && password) {
      setAuthenticated(true);
      console.log(username, password);
    } else {
      if (!username) setError(1);
      if (!password) setError(2);
      if (!username && !password) setError(3);
    }
  };

  return (
    <Box sx={{
      width: 1, height: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}
    >
      <FormControl variant="filled" sx={{ width: "15rem", marginY: 2 }}>
        <InputLabel htmlFor="username">Username</InputLabel>
        <FilledInput
          id="username"
          value={username}
          autoFocus
          onChange={(e) => handleInput(e, "username")}
          error={error === 1 || error === 3}
        />
        {(error === 1 || error === 3) && <FormHelperText>Username is required</FormHelperText>}
      </FormControl>
      <FormControl variant="filled" sx={{ width: "15rem" }}>
        <InputLabel htmlFor="password">Password</InputLabel>
        <FilledInput
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => handleInput(e, "password")}
          endAdornment={(
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => (showPassword ? setShowPassword(false) : setShowPassword(true))}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )}
          error={error === 2 || error === 3}
        />
        {(error === 2 || error === 3) && <FormHelperText>Password is required</FormHelperText>}
      </FormControl>
      <Button variant="contained" onClick={handleLogin} sx={{ marginY: 2 }}>Log in</Button>
    </Box>
  );
}

export default AdminLogin;
