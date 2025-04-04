import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  Button,
  CircularProgress,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import LanguageIcon from '@mui/icons-material/Language';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import EventIcon from '@mui/icons-material/Event';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

// Mock API function for demonstration
const mockApiCall = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data });
    }, 1500);
  });
};

const EnhancedOnboardingPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    dataSource: '',
    businessUrl: '',
    businessName: '',
    phoneNumber: '',
    forwardCalls: false,
    callHandlingPreference: 'answer_all',
    calendarIntegration: ''
  });
  const [loading, setLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  const steps = [
    'Connect Your Business',
    'Verify Information',
    'Phone Setup',
    'Calendar Integration',
    'Ready to Go'
  ];

  const handleDataSourceSelect = (source) => {
    setFormData({
      ...formData,
      dataSource: source
    });
  };

  const handleUrlSubmit = async () => {
    if (!formData.businessUrl) {
      setSnackbarMessage('Please enter a valid URL');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    setProcessingStatus('Connecting to your business data...');

    try {
      // Simulate API call to fetch business data
      await mockApiCall({ url: formData.businessUrl });
      setProcessingStatus('Analyzing your business information...');
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProcessingStatus('Extracting services and FAQ data...');
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProcessingStatus('Training Sloane AI with your business data...');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, we would use the fetched data
      // For demo, we'll set mock data
      setFormData(prev => ({
        ...prev,
        businessName: formData.dataSource === 'google' ? 'ABC Dental Care' : 'Your Business Name',
        businessHours: {
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
          { name: 'Teeth Cleaning', description: 'Professional dental cleaning', price: '$120' }
        ],
        faqs: [
          { 
            question: 'Do you accept insurance?', 
            answer: 'Yes, we accept most major insurance plans. Please call our office to verify your specific coverage.' 
          },
          { 
            question: 'How often should I have a dental checkup?', 
            answer: 'We recommend visiting for a checkup and cleaning every 6 months.' 
          }
        ]
      }));
      
      setActiveStep(1);
    } catch (error) {
      console.error('Error fetching business data:', error);
      setSnackbarMessage('Failed to fetch business data. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      setProcessingStatus('');
    }
  };

  const handleNext = async () => {
    if (activeStep === 0 && formData.dataSource) {
      if (formData.businessUrl) {
        await handleUrlSubmit();
      } else {
        setSnackbarMessage('Please enter your business URL');
        setSnackbarOpen(true);
      }
      return;
    }
    
    if (activeStep === steps.length - 1) {
      handleComplete();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    
    try {
      // Simulate API call to save all data
      await mockApiCall(formData);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setSnackbarMessage('Failed to complete setup. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Connect Your Business
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Let's get started by connecting your business data. Choose one of the options below to help Sloane learn about your business.
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card 
                  sx={{ 
                    height: '100%',
                    border: formData.dataSource === 'google' ? '2px solid' : '1px solid',
                    borderColor: formData.dataSource === 'google' ? 'primary.main' : 'divider',
                    transition: 'all 0.3s'
                  }}
                >
                  <CardActionArea 
                    onClick={() => handleDataSourceSelect('google')}
                    sx={{ height: '100%', p: 2 }}
                  >
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <GoogleIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
                      <Typography variant="h6" component="div" gutterBottom>
                        Connect Google Business Profile
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pull in your business details automatically from your Google Business Profile for the fastest setup.
                      </Typography>
                      
                      {formData.dataSource === 'google' && (
                        <CheckCircleIcon color="primary" sx={{ mt: 2, fontSize: 30 }} />
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card 
                  sx={{ 
                    height: '100%',
                    border: formData.dataSource === 'website' ? '2px solid' : '1px solid',
                    borderColor: formData.dataSource === 'website' ? 'primary.main' : 'divider',
                    transition: 'all 0.3s'
                  }}
                >
                  <CardActionArea 
                    onClick={() => handleDataSourceSelect('website')}
                    sx={{ height: '100%', p: 2 }}
                  >
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <LanguageIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                      <Typography variant="h6" component="div" gutterBottom>
                        Connect Your Website
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        We'll extract information from your website to help train Sloane about your business.
                      </Typography>
                      
                      {formData.dataSource === 'website' && (
                        <CheckCircleIcon color="primary" sx={{ mt: 2, fontSize: 30 }} />
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
            
            {formData.dataSource && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Enter your {formData.dataSource === 'google' ? 'Google Business Profile URL' : 'website URL'}:
                </Typography>
                <TextField
                  fullWidth
                  name="businessUrl"
                  value={formData.businessUrl}
                  onChange={handleInputChange}
                  placeholder={formData.dataSource === 'google' 
                    ? "e.g., https://business.google.com/your-business" 
                    : "e.g., https://yourbusiness.com"}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                
                {loading && (
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CircularProgress size={24} sx={{ mr: 2 }} />
                      <Typography variant="body1">{processingStatus}</Typography>
                    </Box>
                    <Alert severity="info">
                      This may take a moment as we analyze your business information to help Sloane better answer your calls.
                    </Alert>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        );
        
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Verify Your Business Information
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We've extracted the following information. Please verify it's correct or make any necessary changes.
            </Typography>
            
            <Alert severity="success" sx={{ mb: 3 }}>
              Sloane has successfully trained on your business data and is ready to answer calls about your services, 
              hours, and frequently asked questions.
            </Alert>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Business Name"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Business Hours (Automatically Detected)
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2">Monday: 9:00 AM - 5:00 PM</Typography>
                  <Typography variant="body2">Tuesday: 9:00 AM - 5:00 PM</Typography>
                  <Typography variant="body2">Wednesday: 9:00 AM - 5:00 PM</Typography>
                  <Typography variant="body2">Thursday: 9:00 AM - 5:00 PM</Typography>
                  <Typography variant="body2">Friday: 9:00 AM - 5:00 PM</Typography>
                  <Typography variant="body2">Saturday: Closed</Typography>
                  <Typography variant="body2">Sunday: Closed</Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Services (Automatically Detected)
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  {formData.services && formData.services.map((service, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="body1" fontWeight="medium">{service.name} - {service.price}</Typography>
                      <Typography variant="body2" color="text.secondary">{service.description}</Typography>
                      {index < formData.services.length - 1 && <Divider sx={{ my: 1 }} />}
                    </Box>
                  ))}
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  FAQs (Automatically Detected)
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  {formData.faqs && formData.faqs.map((faq, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="body1" fontWeight="medium">{faq.question}</Typography>
                      <Typography variant="body2" color="text.secondary">{faq.answer}</Typography>
                      {index < formData.faqs.length - 1 && <Divider sx={{ my: 1 }} />}
                    </Box>
                  ))}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
        
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Phone Setup
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Configure how Sloane will handle your business calls.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., (555) 123-4567"
                  variant="outlined"
                  sx={{ mb: 3 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Call Handling Preferences
                </Typography>
                <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
                  <CardActionArea 
                    onClick={() => setFormData(prev => ({...prev, callHandlingPreference: 'answer_all'}))}
                    sx={{ p: 1 }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      borderRadius: 1,
                      borderLeft: '4px solid',
                      borderColor: formData.callHandlingPreference === 'answer_all' ? 'primary.main' : 'divider',
                      bgcolor: formData.callHandlingPreference === 'answer_all' ? 'primary.light' : 'background.paper',
                      p: 1
                    }}>
                      <PhoneIcon sx={{ mr: 2, color: formData.callHandlingPreference === 'answer_all' ? 'primary.main' : 'text.secondary' }} />
                      <Box>
                        <Typography variant="subtitle1">Sloane answers all calls</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Sloane will answer every call to your business number
                        </Typography>
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>
                
                <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
                  <CardActionArea 
                    onClick={() => setFormData(prev => ({...prev, callHandlingPreference: 'after_hours'}))}
                    sx={{ p: 1 }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      borderRadius: 1,
                      borderLeft: '4px solid',
                      borderColor: formData.callHandlingPreference === 'after_hours' ? 'primary.main' : 'divider',
                      bgcolor: formData.callHandlingPreference === 'after_hours' ? 'primary.light' : 'background.paper',
                      p: 1
                    }}>
                      <PhoneIcon sx={{ mr: 2, color: formData.callHandlingPreference === 'after_hours' ? 'primary.main' : 'text.secondary' }} />
                      <Box>
                        <Typography variant="subtitle1">Sloane answers after hours</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Sloane only answers calls outside your business hours
                        </Typography>
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>
                
                <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
                  <CardActionArea 
                    onClick={() => setFormData(prev => ({...prev, callHandlingPreference: 'overflow'}))}
                    sx={{ p: 1 }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      borderRadius: 1,
                      borderLeft: '4px solid',
                      borderColor: formData.callHandlingPreference === 'overflow' ? 'primary.main' : 'divider',
                      bgcolor: formData.callHandlingPreference === 'overflow' ? 'primary.light' : 'background.paper',
                      p: 1
                    }}>
                      <PhoneIcon sx={{ mr: 2, color: formData.callHandlingPreference === 'overflow' ? 'primary.main' : 'text.secondary' }} />
                      <Box>
                        <Typography variant="subtitle1">Sloane answers when you don't pick up</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Sloane answers calls after 3-4 rings if you don't pick up
                        </Typography>
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
        
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Calendar Integration (Optional)
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Connect your calendar so Sloane can schedule appointments for you.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{ 
                    height: '100%',
                    border: formData.calendarIntegration === 'google' ? '2px solid' : '1px solid',
                    borderColor: formData.calendarIntegration === 'google' ? 'primary.main' : 'divider',
                    transition: 'all 0.3s'
                  }}
                >
                  <CardActionArea 
                    onClick={() => setFormData(prev => ({...prev, calendarIntegration: 'google'}))}
                    sx={{ height: '100%', p: 2 }}
                  >
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <GoogleIcon color="error" sx={{ fontSize: 40, mb: 2 }} />
                      <Typography variant="subtitle1" component="div" gutterBottom>
                        Google Calendar
                      </Typography>
                      
                      {formData.calendarIntegration === 'google' && (
                        <CheckCircleIcon color="primary" sx={{ mt: 2, fontSize: 24 }} />
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{ 
                    height: '100%',
                    border: formData.calendarIntegration === 'outlook' ? '2px solid' : '1px solid',
                    borderColor: formData.calendarIntegration === 'outlook' ? 'primary.main' : 'divider',
                    transition: 'all 0.3s'
                  }}
                >
                  <CardActionArea 
                    onClick={() => setFormData(prev => ({...prev, calendarIntegration: 'outlook'}))}
                    sx={{ height: '100%', p: 2 }}
                  >
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <PhoneIcon color="info" sx={{ fontSize: 40, mb: 2 }} />
                      <Typography variant="subtitle1" component="div" gutterBottom>
                        Outlook Calendar
                      </Typography>
                      
                      {formData.calendarIntegration === 'outlook' && (
                        <CheckCircleIcon color="primary" sx={{ mt: 2, fontSize: 24 }} />
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{ 
                    height: '100%',
                    border: formData.calendarIntegration === 'none' ? '2px solid' : '1px solid',
                    borderColor: formData.calendarIntegration === 'none' ? 'primary.main' : 'divider',
                    transition: 'all 0.3s'
                  }}
                >
                  <CardActionArea 
                    onClick={() => setFormData(prev => ({...prev, calendarIntegration: 'none'}))}
                    sx={{ height: '100%', p: 2 }}
                  >
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <EventIcon sx={{ fontSize: 40, mb: 2 }} />
                      <Typography variant="subtitle1" component="div" gutterBottom>
                        Skip for now
                      </Typography>
                      
                      {formData.calendarIntegration === 'none' && (
                        <CheckCircleIcon color="primary" sx={{ mt: 2, fontSize: 24 }} />
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
            
            {formData.calendarIntegration && formData.calendarIntegration !== 'none' && (
              <Alert severity="info" sx={{ mt: 3 }}>
                You'll be prompted to connect your {formData.calendarIntegration} calendar after completing setup.
              </Alert>
            )}
          </Box>
        );
        
      case 4:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 80 }} />
            </Box>
            
            <Typography variant="h4" gutterBottom>
              Sloane is Ready to Answer Your Calls!
            </Typography>
            
            <Typography variant="body1" paragraph>
              You've successfully set up your AI phone answering service. Sloane now understands your business 
              and is ready to answer calls, take messages, and schedule appointments for you.
            </Typography>
            
            <Alert severity="success" sx={{ mt: 2, mb: 4, textAlign: 'left' }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Here's what happens next:
              </Typography>
              <ul>
                <li>Sloane will begin answering calls according to your preferences</li>
                <li>You'll receive notifications for new calls and messages</li>
                <li>You can always adjust your settings from the dashboard</li>
              </ul>
            </Alert>
            
            <Typography variant="body1" sx={{ mt: 4 }}>
              Click "Complete Setup" to go to your dashboard and see your new AI receptionist in action!
            </Typography>
          </Box>
        );
        
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Set Up Your Sloane AI Phone Service
          </Typography>
          
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Complete these steps to get your AI phone answering service up and running in minutes
          </Typography>
          
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {renderStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
              sx={{ py: 1.5, px: 4 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={
                loading || 
                (activeStep === 0 && (!formData.dataSource || !formData.businessUrl)) ||
                (activeStep === 2 && !formData.phoneNumber) ||
                (activeStep === 3 && !formData.calendarIntegration)
              }
              sx={{ py: 1.5, px: 4 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : activeStep === steps.length - 1 ? (
                'Complete Setup'
              ) : (
                'Continue'
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default EnhancedOnboardingPage;
