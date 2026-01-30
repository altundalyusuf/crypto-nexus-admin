"use client"; // Essential for using hooks

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, clearError } from "@/store/slices/authSlice";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import CustomButton from "@/components/common/CustomButton";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Select specific parts of the state
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Effect: Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Effect: Clear errors when user types (UX improvement)
  useEffect(() => {
    if (error) dispatch(clearError());
  }, [email, password, dispatch, error]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) return;

    // Dispatch the async thunk
    const resultAction = await dispatch(loginUser({ email, password }));

    // Check if the login was successful
    if (loginUser.fulfilled.match(resultAction)) {
      router.push("/dashboard");
    } else {
      // Error handling is managed by the extraReducers in slice,
      // but we could do local UI logic here if needed.
      console.error("Login failed");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography component="h1" variant="h5">
            Crypto Nexus Admin
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, mb: 3 }}
          >
            Sign in to access the backoffice
          </Typography>

          {/* Error Feedback */}
          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />

            <CustomButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, height: "48px" }}
              isLoading={isLoading}
            >
              Sign In
            </CustomButton>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
