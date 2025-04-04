import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  LinearProgress, 
  Paper, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Divider
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LanguageIcon from '@mui/icons-material/Language';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PsychologyIcon from '@mui/icons-material/Psychology';

// Mock data extraction API
const mockDataExtraction = async (url, source) => {
  // Simulate different data extraction durations
  const steps = [
    { id: 'connect', time: 1000, success: true },
    { id: 'metadata', time: 1500, success: true },
    { id: 'hours', time: 1200, success: true },
    { id: 'services', time: 2000, success: true },
    { id: 'faqs', time: 1800, success: true },
    { id: 'training', time: 2500, success: true }
  ];

  const results = {};

  for (const step of steps) {
    await new Promise(resolve => setTimeout(resolve, step.time));
    results[step.id] = { 
      success: step.success,
      timestamp: new Date().toISOString()
    };
  }

  // Simulate extracted business data
  return {
    steps: results,
    business: {
      name: source === 'google' ? 'ABC Dental Care' : 'Your Business Name',
      address: '123 Main Street, Anytown, USA',
      phone: '(555) 123-4567',
      website: url,
      hours: {
        monday: { isOpen: true, openTime: '9:00 AM', closeTime: '5:00 PM' },
        tuesday: { isOpen: true, openTime: '9:00 AM', closeTime: '5:00 PM' },
        wednesday: { isOpen: true, openTime: '9:00 AM', closeTime: '5:00 PM' },
        thursday: { isOpen: true, openTime: '9:00 AM', closeTime: '5:00 PM' },
        friday: { isOpen: true, openTime: '9:00 AM', closeTime: '5:00 PM' },
        saturday: { isOpen: false, openTime: '', closeTime: '' },
        sunday: { isOpen: false, openTime: '', closeTime: '' }
      },
      services: [
        { name: 'Regular Checkup', description: 'Comprehensive dental examination', price: '$75' },
        { name: 'Teeth Cleaning', description: 'Professional dental cleaning', price: '$120' },
        { name: 'Tooth Filling', description: 'Dental filling procedure', price: '$150-$300' },
        { name: 'Root Canal', description: 'Root canal treatment', price: '$700-$1,500' }
      ],
      faqs: [
        { 
          question: 'Do you accept insurance?', 
          answer: 'Yes, we accept most major insurance plans. Please call our office to verify your specific coverage.' 
        },
        { 
          question: 'How often should I have a dental checkup?', 
          answer: 'We recommend visiting for a checkup and cleaning every 6 months.' 
        },
        { 
          question: 'Do you offer emergency dental services?', 
          answer: 'Yes, we provide emergency dental care. Please call our office immediately if you have a dental emergency.' 
        }
      ]
    }
  };
};

const BusinessDataExtraction = ({ url, source, onComplete, onError }) => {
  const [currentStep, setCurrentStep] = useState('connect');
  const [completedSteps, setCompletedSteps] = useState({});
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  
  const steps = [
    { 
      id: 'connect', 
      label: 'Connecting to your business data', 
      icon: <LanguageIcon />,
      description: 'Establishing connection to your business information'
    },
    { 
      id: 'metadata', 
      label: 'Extracting business details', 
      icon: <StorefrontIcon />,
      description: 'Getting your business name, address, and contact information'
    },
    { 
      id: 'hours', 
      label: 'Analyzing business hours', 
      icon: <AccessTimeIcon />,
      description: 'Determining when your business is open'
    },
    { 
      id: 'services', 
      label: 'Identifying services', 
      icon: <LocalOfferIcon />,
      description: 'Finding services you offer and their descriptions'
    },
    { 
      id: 'faqs', 
      label: 'Extracting FAQs', 
      icon: <QuestionAnswerIcon />,
      description: 'Collecting frequently asked questions and answers'
    },
    { 
      id: 'training', 
      label: 'Training Sloane AI', 
      icon: <PsychologyIcon />,
      description: 'Teaching Sloane how to answer calls for your specific business'
    }
  ];

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const result = await mockDataExtraction(url, source);
        
        // Process each step with a delay to show progress
        for (const step of steps) {
          setCurrentStep(step.id);
          setProgress((steps.indexOf(step) / steps.length) * 100);
          
          // Wait for the mock API response for this step
          await new Promise(resolve => {
            const checkStepComplete = () => {
              if (result.steps[step.id]) {
                setCompletedSteps(prev => ({
                  ...prev,
                  [step.id]: result.steps[step.id]
                }));
                resolve();
              } else {
                setTimeout(checkStepComplete, 500);
              }
            };
            checkStepComplete();
          });
        }
        
        setProgress(100);
        // Call the completion callback with the extracted data
        onComplete(result.business);
        
      } catch (err) {
        console.error('Error extracting business data:', err);
        setError('Failed to extract business data. Please try again or enter your information manually.');
        onError(err);
      }
    };

    fetchBusinessData();
  }, [url, source]);

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Analyzing Your Business Data
      </Typography>
      
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ height: 10, borderRadius: 5, mb: 3 }} 
      />
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <List>
        {steps.map((step) => {
          const isCompleted = completedSteps[step.id]?.success;
          const isInProgress = currentStep === step.id && !isCompleted;
          const isFuture = !isCompleted && !isInProgress;
          
          return (
            <React.Fragment key={step.id}>
              <ListItem>
                <ListItemIcon>
                  {isCompleted ? (
                    <CheckCircleOutlineIcon color="success" />
                  ) : isInProgress ? (
                    <ScheduleIcon color="primary" />
                  ) : isFuture ? (
                    <ScheduleIcon color="disabled" />
                  ) : (
                    <ErrorOutlineIcon color="error" />
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={step.label} 
                  secondary={step.description}
                  primaryTypographyProps={{
                    fontWeight: isInProgress ? 'bold' : 'normal',
                    color: isInProgress ? 'primary.main' : 'text.primary'
                  }}
                />
              </ListItem>
              {step.id !== steps[steps.length - 1].id && <Divider variant="inset" component="li" />}
            </React.Fragment>
          );
        })}
      </List>
      
      {progress === 100 && (
        <Alert severity="success" sx={{ mt: 3 }}>
          Analysis complete! Sloane has successfully learned about your business and is ready to answer calls.
        </Alert>
      )}
    </Paper>
  );
};

export default BusinessDataExtraction;
