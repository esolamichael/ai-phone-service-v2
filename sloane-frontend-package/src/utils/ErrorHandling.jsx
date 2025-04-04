// src/utils/ErrorHandling.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Alert,
  AlertTitle,
  Button,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Error boundary component for catching and displaying errors
export const ErrorBoundary = ({ children }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Function to handle API errors
  const handleApiError = (error) => {
    setError(error);
    setIsLoading(false);
  };

  // Function to retry the operation
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Simulate retry operation
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  // Function to go back to dashboard
  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (error) {
    // Determine error type and show appropriate message
    let errorTitle = 'An error occurred';
    let errorMessage = 'Something went wrong. Please try again.';
    let showRetry = true;

    if (error.name === 'NetworkError' || error.message.includes('network')) {
      errorTitle = 'Network Error';
      errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
    } else if (error.status === 401 || error.status === 403) {
      errorTitle = 'Authentication Error';
      errorMessage = 'Your session has expired or you do not have permission to access this resource.';
      showRetry = false;
    } else if (error.status === 404) {
      errorTitle = 'Resource Not Found';
      errorMessage = 'The requested resource could not be found.';
    } else if (error.status >= 500) {
      errorTitle = 'Server Error';
      errorMessage = 'The server encountered an error. Please try again later.';
    }

    return (
      <Container maxWidth="md"
