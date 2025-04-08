import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Typography,
  Divider,
  CircularProgress,
  InputAdornment,
  IconButton,
  Alert,
  Button
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';

// Sample business data for autocomplete - provides a reliable fallback with nationwide coverage
const SAMPLE_BUSINESSES = [
  // Los Angeles Businesses
  {
    id: 'la-business-1',
    name: 'LA Dental Studio',
    description: 'Dentist in Los Angeles, CA',
    address: '2500 Wilshire Blvd, Los Angeles, CA 90057',
    phone: '(213) 555-1234',
    website: 'https://ladentalstudio.com',
    businessType: 'dentist',
    location: { lat: 34.0610, lng: -118.2765 }
  },
  {
    id: 'la-business-2',
    name: 'Silicon Beach Tech Solutions',
    description: 'IT Services in Los Angeles, CA',
    address: '12777 W Jefferson Blvd, Los Angeles, CA 90066',
    phone: '(310) 555-7890',
    website: 'https://siliconbeachtech.com',
    businessType: 'tech_services',
    location: { lat: 33.9801, lng: -118.4169 }
  },
  {
    id: 'la-business-3',
    name: 'Beverly Hills Medical Center',
    description: 'Medical Clinic in Beverly Hills, CA',
    address: '8500 Wilshire Blvd, Beverly Hills, CA 90211',
    phone: '(310) 555-2345',
    website: 'https://bhmedicalcenter.com',
    businessType: 'medical',
    location: { lat: 34.0667, lng: -118.3783 }
  },
  {
    id: 'la-business-4',
    name: 'Hollywood Fitness Club',
    description: 'Gym in Hollywood, CA',
    address: '1755 N Highland Ave, Hollywood, CA 90028',
    phone: '(323) 555-6789',
    website: 'https://hollywoodfitness.com',
    businessType: 'fitness',
    location: { lat: 34.1016, lng: -118.3387 }
  },
  {
    id: 'la-business-5',
    name: 'Echo Park Cafe',
    description: 'Cafe in Los Angeles, CA',
    address: '1500 Echo Park Ave, Los Angeles, CA 90026',
    phone: '(323) 555-9876',
    website: 'https://echoparkcafe.com',
    businessType: 'restaurant',
    location: { lat: 34.0781, lng: -118.2598 }
  },
  {
    id: 'la-business-6',
    name: 'Santa Monica Salon & Spa',
    description: 'Beauty Salon in Santa Monica, CA',
    address: '1318 2nd Street, Santa Monica, CA 90401',
    phone: '(310) 555-8765',
    website: 'https://santamonicasalon.com',
    businessType: 'salon',
    location: { lat: 34.0163, lng: -118.4978 }
  },
  
  // New York Businesses
  {
    id: 'ny-business-1',
    name: 'Manhattan Dental Center',
    description: 'Dentist in New York, NY',
    address: '500 5th Avenue, New York, NY 10110',
    phone: '(212) 555-1234',
    website: 'https://manhattandentalcenter.com',
    businessType: 'dentist',
    location: { lat: 40.7547, lng: -73.9803 }
  },
  {
    id: 'ny-business-2',
    name: 'Midtown Medical Group',
    description: 'Medical Practice in New York, NY',
    address: '280 Madison Ave, New York, NY 10016',
    phone: '(212) 555-4567',
    website: 'https://midtownmedical.com',
    businessType: 'medical',
    location: { lat: 40.7508, lng: -73.9792 }
  },
  {
    id: 'ny-business-3',
    name: 'Brooklyn Heights Fitness',
    description: 'Gym in Brooklyn, NY',
    address: '185 Montague St, Brooklyn, NY 11201',
    phone: '(718) 555-1234',
    website: 'https://brooklynheightsfitness.com',
    businessType: 'fitness',
    location: { lat: 40.6944, lng: -73.9906 }
  },
  {
    id: 'ny-business-4',
    name: 'Greenwich Village IT Consultants',
    description: 'IT Services in New York, NY',
    address: '35 W 8th St, New York, NY 10011',
    phone: '(212) 555-7890',
    website: 'https://gvitconsultants.com',
    businessType: 'tech_services',
    location: { lat: 40.7322, lng: -73.9987 }
  },
  
  // Chicago Businesses
  {
    id: 'ch-business-1',
    name: 'Chicago Tech Solutions',
    description: 'IT Services in Chicago, IL',
    address: '222 W Merchandise Mart Plaza, Chicago, IL 60654',
    phone: '(312) 555-7890',
    website: 'https://chicagotech.com',
    businessType: 'tech_services',
    location: { lat: 41.8881, lng: -87.6357 }
  },
  {
    id: 'ch-business-2',
    name: 'Millennium Park Dental',
    description: 'Dentist in Chicago, IL',
    address: '180 N Michigan Ave, Chicago, IL 60601',
    phone: '(312) 555-2345',
    website: 'https://millenniumdental.com',
    businessType: 'dentist',
    location: { lat: 41.8858, lng: -87.6244 }
  },
  {
    id: 'ch-business-3',
    name: 'Wicker Park Medical',
    description: 'Medical Practice in Chicago, IL',
    address: '1520 N Damen Ave, Chicago, IL 60622',
    phone: '(773) 555-2345',
    website: 'https://wickerparkmedical.com',
    businessType: 'medical',
    location: { lat: 41.9084, lng: -87.6774 }
  },
  
  // Seattle Businesses
  {
    id: 'sea-business-1',
    name: 'Seattle Coffee Roasters',
    description: 'Coffee Shop in Seattle, WA',
    address: '1218 5th Ave, Seattle, WA 98101',
    phone: '(206) 555-1234',
    website: 'https://seattlecoffeeroasters.com',
    businessType: 'restaurant',
    location: { lat: 47.6078, lng: -122.3341 }
  },
  {
    id: 'sea-business-2',
    name: 'Emerald City Dental',
    description: 'Dentist in Seattle, WA',
    address: '600 Pine St, Seattle, WA 98101',
    phone: '(206) 555-5678',
    website: 'https://emeraldcitydental.com',
    businessType: 'dentist',
    location: { lat: 47.6131, lng: -122.3367 }
  },
  
  // Miami Businesses
  {
    id: 'mia-business-1',
    name: 'South Beach Fitness',
    description: 'Gym in Miami Beach, FL',
    address: '1234 Collins Ave, Miami Beach, FL 33139',
    phone: '(305) 555-1234',
    website: 'https://southbeachfitness.com',
    businessType: 'fitness',
    location: { lat: 25.7857, lng: -80.1314 }
  },
  {
    id: 'mia-business-2',
    name: 'Miami Tech Hub',
    description: 'IT Services in Miami, FL',
    address: '2 S Biscayne Blvd, Miami, FL 33131',
    phone: '(305) 555-7890',
    website: 'https://miamitechhub.com',
    businessType: 'tech_services',
    location: { lat: 25.7743, lng: -80.1895 }
  },
  
  // Dallas Businesses
  {
    id: 'dal-business-1',
    name: 'Dallas Medical Center',
    description: 'Medical Practice in Dallas, TX',
    address: '1935 Medical District Dr, Dallas, TX 75235',
    phone: '(214) 555-1234',
    website: 'https://dallasmedcenter.com',
    businessType: 'medical',
    location: { lat: 32.8094, lng: -96.8479 }
  },
  {
    id: 'dal-business-2',
    name: 'Uptown Dallas Dental',
    description: 'Dentist in Dallas, TX',
    address: '2500 McKinney Ave, Dallas, TX 75201',
    phone: '(214) 555-6789',
    website: 'https://uptowndallas-dental.com',
    businessType: 'dentist',
    location: { lat: 32.8016, lng: -96.8008 }
  },
  
  // Boston Businesses
  {
    id: 'bos-business-1',
    name: 'Beacon Hill Bistro',
    description: 'Restaurant in Boston, MA',
    address: '25 Charles St, Boston, MA 02114',
    phone: '(617) 555-1234',
    website: 'https://beaconhillbistro.com',
    businessType: 'restaurant',
    location: { lat: 42.3567, lng: -71.0696 }
  },
  {
    id: 'bos-business-2',
    name: 'Boston Digital Solutions',
    description: 'IT Services in Boston, MA',
    address: '101 Federal St, Boston, MA 02110',
    phone: '(617) 555-7890',
    website: 'https://bostondigitalsolutions.com',
    businessType: 'tech_services',
    location: { lat: 42.3551, lng: -71.0566 }
  },
  
  // Denver Businesses
  {
    id: 'den-business-1',
    name: 'Denver Mountain Fitness',
    description: 'Gym in Denver, CO',
    address: '1600 17th St, Denver, CO 80202',
    phone: '(303) 555-1234',
    website: 'https://denvermountainfitness.com',
    businessType: 'fitness',
    location: { lat: 39.7517, lng: -104.9994 }
  },
  {
    id: 'den-business-2',
    name: 'Cherry Creek Dental',
    description: 'Dentist in Denver, CO',
    address: '3000 E 1st Ave, Denver, CO 80206',
    phone: '(303) 555-5678',
    website: 'https://cherrycreekdental.com',
    businessType: 'dentist',
    location: { lat: 39.7177, lng: -104.9554 }
  },
  
  // Atlanta Businesses
  {
    id: 'atl-business-1',
    name: 'Peachtree Tech Consulting',
    description: 'IT Services in Atlanta, GA',
    address: '1100 Peachtree St NE, Atlanta, GA 30309',
    phone: '(404) 555-7890',
    website: 'https://peachtreetech.com',
    businessType: 'tech_services',
    location: { lat: 33.7863, lng: -84.3828 }
  },
  {
    id: 'atl-business-2',
    name: 'Buckhead Medical Associates',
    description: 'Medical Practice in Atlanta, GA',
    address: '3200 Peachtree Rd NE, Atlanta, GA 30305',
    phone: '(404) 555-2345',
    website: 'https://buckheadmedical.com',
    businessType: 'medical',
    location: { lat: 33.8399, lng: -84.3723 }
  },
  
  // Phoenix Businesses
  {
    id: 'phx-business-1',
    name: 'Desert Bloom Spa',
    description: 'Salon & Spa in Phoenix, AZ',
    address: '2502 E Camelback Rd, Phoenix, AZ 85016',
    phone: '(602) 555-8765',
    website: 'https://desertbloomspa.com',
    businessType: 'salon',
    location: { lat: 33.5090, lng: -112.0261 }
  },
  {
    id: 'phx-business-2',
    name: 'Phoenix Family Dental',
    description: 'Dentist in Phoenix, AZ',
    address: '4131 N 24th St, Phoenix, AZ 85016',
    phone: '(602) 555-1234',
    website: 'https://phoenixfamilydental.com',
    businessType: 'dentist',
    location: { lat: 33.4986, lng: -112.0304 }
  },
  
  // Generic sample businesses that can be "found" anywhere
  {
    id: 'generic-business-1',
    name: 'Amy\'s Hair Salon',
    description: 'Hair Salon',
    address: '123 Main St',
    phone: '(555) 123-4567',
    website: 'https://amyshairsalon.com',
    businessType: 'salon'
  },
  {
    id: 'generic-business-2',
    name: 'Perfect Smile Dental',
    description: 'Dentist Office',
    address: '456 Oak Avenue',
    phone: '(555) 234-5678',
    website: 'https://perfectsmiledental.com',
    businessType: 'dentist'
  },
  {
    id: 'generic-business-3',
    name: 'City Fitness Center',
    description: 'Gym and Fitness',
    address: '789 Elm Street',
    phone: '(555) 345-6789',
    website: 'https://cityfitness.com',
    businessType: 'fitness'
  },
  {
    id: 'generic-business-4',
    name: 'Hometown Cafe',
    description: 'Coffee Shop & Cafe',
    address: '321 Pine Road',
    phone: '(555) 456-7890',
    website: 'https://hometowncafe.com',
    businessType: 'restaurant'
  },
  {
    id: 'generic-business-5',
    name: 'Tech Solutions Inc',
    description: 'IT Services',
    address: '654 Maple Drive',
    phone: '(555) 567-8901',
    website: 'https://techsolutionsinc.com',
    businessType: 'tech_services'
  }
];

const GooglePlacesAutocomplete = ({ onBusinessSelect }) => {
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // State for location loading & error
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Try to get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationLoading(false);
          setLocationError(null);
        },
        (error) => {
          console.log('Geolocation error or permission denied:', error);
          setLocationLoading(false);
          
          // Set a user-friendly error message based on the error code
          switch(error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Location access denied. Using nationwide business search.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information unavailable. Using nationwide business search.");
              break;
            case error.TIMEOUT:
              setLocationError("Location request timed out. Using nationwide business search.");
              break;
            default:
              setLocationError("An unknown error occurred. Using nationwide business search.");
          }
          
          // Provide a default location in the center of US if geolocation fails
          setUserLocation({
            lat: 39.8283, // Approximate center of the United States
            lng: -98.5795
          });
        },
        { 
          timeout: 10000, // 10 second timeout
          maximumAge: 600000 // 10 minutes cache
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser. Using nationwide business search.");
      
      // Provide a default location in the center of US if geolocation is not supported
      setUserLocation({
        lat: 39.8283, // Approximate center of the United States
        lng: -98.5795
      });
    }
  }, []);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  };

  // Filter businesses based on search term and location
  const filterBusinesses = (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const lowercaseSearch = searchTerm.toLowerCase();
    
    // First find all matches based on name or description
    const exactMatches = SAMPLE_BUSINESSES.filter(business => 
      business.name.toLowerCase() === lowercaseSearch
    );
    
    const startsWithMatches = SAMPLE_BUSINESSES.filter(business => 
      business.name.toLowerCase().startsWith(lowercaseSearch) &&
      !exactMatches.includes(business)
    );
    
    const containsMatches = SAMPLE_BUSINESSES.filter(business => 
      (business.name.toLowerCase().includes(lowercaseSearch) || 
       business.description.toLowerCase().includes(lowercaseSearch)) &&
      !exactMatches.includes(business) &&
      !startsWithMatches.includes(business)
    );
    
    // Combine matches with precedence: exact > starts with > contains
    let allMatches = [...exactMatches, ...startsWithMatches, ...containsMatches];
    
    // If user has shared location, apply proximity sorting within each match category
    if (userLocation) {
      // Helper function to sort by distance
      const sortByDistance = (businesses) => {
        return businesses.sort((a, b) => {
          const distanceA = a.location ? 
            calculateDistance(userLocation.lat, userLocation.lng, a.location.lat, a.location.lng) : 
            Infinity;
          
          const distanceB = b.location ? 
            calculateDistance(userLocation.lat, userLocation.lng, b.location.lat, b.location.lng) : 
            Infinity;
          
          return distanceA - distanceB;
        });
      };
      
      // Sort each category by distance and combine
      const sortedExact = sortByDistance([...exactMatches]);
      const sortedStartsWith = sortByDistance([...startsWithMatches]);
      const sortedContains = sortByDistance([...containsMatches]);
      
      // Only return businesses within 50km of user for containsMatches
      // This will prioritize local results over distant ones that happen to match
      const localContainsMatches = sortedContains.filter(business => {
        if (!business.location) return true; // Keep businesses without location data
        
        const distance = calculateDistance(
          userLocation.lat, userLocation.lng, 
          business.location.lat, business.location.lng
        );
        
        return distance <= 50; // Only include businesses within 50km for partial matches
      });
      
      allMatches = [...sortedExact, ...sortedStartsWith, ...localContainsMatches];
    }
    
    return allMatches;
  };

  // Handle input change and update predictions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length >= 2) {
      setLoading(true);
      
      // Simulate network delay for realistic feeling
      setTimeout(() => {
        const matches = filterBusinesses(value);
        setPredictions(matches);
        setLoading(false);
        
        if (matches.length === 0 && value.length > 2) {
          setError(
            `No matches found for "${value}". Try a different search term or create a custom business below.`
          );
        } else {
          // Check if there's an exact match
          const exactMatch = matches.find(b => b.name.toLowerCase() === value.toLowerCase());
          
          if (!exactMatch && matches.length > 0) {
            // Show a "no exact match" message but still display similar results
            setError(
              `No exact match found for "${value}". Showing similar businesses or create a custom one below.`
            );
          } else {
            setError(null);
          }
        }
      }, 500);
    } else {
      setPredictions([]);
    }
  };

  // Handle manual search button click
  const handleSearch = () => {
    if (inputValue.trim().length >= 2) {
      setLoading(true);
      
      // Simulate network delay
      setTimeout(() => {
        const matches = filterBusinesses(inputValue);
        setPredictions(matches);
        setLoading(false);
        
        if (matches.length === 0) {
          setError(
            `No matches found for "${inputValue}". Try a different search term or create a custom business below.`
          );
        } else {
          // Check if there's an exact match
          const exactMatch = matches.find(b => b.name.toLowerCase() === inputValue.toLowerCase());
          
          if (!exactMatch && matches.length > 0) {
            // Show a "no exact match" message but still display similar results
            setError(
              `No exact match found for "${inputValue}". Showing similar businesses or create a custom one below.`
            );
          } else {
            setError(null);
          }
        }
      }, 500);
    }
  };

  // Handle selection of a business from the predictions
  const handleSelectBusiness = (business) => {
    setInputValue(business.name);
    setPredictions([]);
    
    // Format business data
    const formattedBusiness = {
      id: business.id,
      name: business.name,
      address: business.address,
      phone: business.phone,
      website: business.website,
      hours: getBusinessHours(business.businessType),
      services: getBusinessServices(business.businessType),
      faqs: getBusinessFAQs(business.businessType)
    };
    
    // Pass formatted business data to parent component
    if (onBusinessSelect) {
      onBusinessSelect(formattedBusiness);
    }
  };

  // Handle key press events (mainly for Enter key)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Get business hours based on business type
  const getBusinessHours = (businessType) => {
    // Default hours (9-5 weekdays)
    const defaultHours = {
      monday: { isOpen: true, openTime: '9:00 AM', closeTime: '5:00 PM' },
      tuesday: { isOpen: true, openTime: '9:00 AM', closeTime: '5:00 PM' },
      wednesday: { isOpen: true, openTime: '9:00 AM', closeTime: '5:00 PM' },
      thursday: { isOpen: true, openTime: '9:00 AM', closeTime: '5:00 PM' },
      friday: { isOpen: true, openTime: '9:00 AM', closeTime: '5:00 PM' },
      saturday: { isOpen: false, openTime: '', closeTime: '' },
      sunday: { isOpen: false, openTime: '', closeTime: '' }
    };
    
    // Type-specific hours
    switch (businessType) {
      case 'restaurant':
        return {
          monday: { isOpen: true, openTime: '7:00 AM', closeTime: '10:00 PM' },
          tuesday: { isOpen: true, openTime: '7:00 AM', closeTime: '10:00 PM' },
          wednesday: { isOpen: true, openTime: '7:00 AM', closeTime: '10:00 PM' },
          thursday: { isOpen: true, openTime: '7:00 AM', closeTime: '10:00 PM' },
          friday: { isOpen: true, openTime: '7:00 AM', closeTime: '11:00 PM' },
          saturday: { isOpen: true, openTime: '8:00 AM', closeTime: '11:00 PM' },
          sunday: { isOpen: true, openTime: '8:00 AM', closeTime: '9:00 PM' }
        };
      case 'fitness':
        return {
          monday: { isOpen: true, openTime: '6:00 AM', closeTime: '10:00 PM' },
          tuesday: { isOpen: true, openTime: '6:00 AM', closeTime: '10:00 PM' },
          wednesday: { isOpen: true, openTime: '6:00 AM', closeTime: '10:00 PM' },
          thursday: { isOpen: true, openTime: '6:00 AM', closeTime: '10:00 PM' },
          friday: { isOpen: true, openTime: '6:00 AM', closeTime: '10:00 PM' },
          saturday: { isOpen: true, openTime: '7:00 AM', closeTime: '8:00 PM' },
          sunday: { isOpen: true, openTime: '8:00 AM', closeTime: '6:00 PM' }
        };
      case 'dentist':
      case 'medical':
        return {
          monday: { isOpen: true, openTime: '8:00 AM', closeTime: '5:00 PM' },
          tuesday: { isOpen: true, openTime: '8:00 AM', closeTime: '5:00 PM' },
          wednesday: { isOpen: true, openTime: '8:00 AM', closeTime: '5:00 PM' },
          thursday: { isOpen: true, openTime: '8:00 AM', closeTime: '5:00 PM' },
          friday: { isOpen: true, openTime: '8:00 AM', closeTime: '5:00 PM' },
          saturday: { isOpen: true, openTime: '9:00 AM', closeTime: '1:00 PM' },
          sunday: { isOpen: false, openTime: '', closeTime: '' }
        };
      default:
        return defaultHours;
    }
  };

  // Get business services based on business type
  const getBusinessServices = (businessType) => {
    // For custom businesses, try to guess appropriate services based on name
    if (businessType === 'custom') {
      const businessName = inputValue.toLowerCase();
      
      // Check for different business types in the name
      if (businessName.includes('dental') || businessName.includes('dentist') || businessName.includes('smile')) {
        return [
          { name: 'Teeth Cleaning', description: 'Professional dental cleaning', price: '$120' },
          { name: 'Dental Checkup', description: 'Comprehensive dental examination', price: '$85' },
          { name: 'Teeth Whitening', description: 'Professional whitening treatment', price: '$250' },
          { name: 'Dental Filling', description: 'Tooth restoration', price: '$175' }
        ];
      } else if (businessName.includes('tech') || businessName.includes('IT') || businessName.includes('computer') || businessName.includes('digital')) {
        return [
          { name: 'IT Consulting', description: 'Technology strategy and planning', price: '$150/hr' },
          { name: 'Network Setup', description: 'Business network installation', price: '$1,200' },
          { name: 'Cloud Migration', description: 'Migrate systems to cloud platforms', price: '$3,500' },
          { name: 'Cybersecurity', description: 'Security assessment and implementation', price: '$2,000' }
        ];
      } else if (businessName.includes('fitness') || businessName.includes('gym') || businessName.includes('workout') || businessName.includes('health')) {
        return [
          { name: 'Personal Training', description: 'One-on-one fitness coaching', price: '$80/session' },
          { name: 'Group Classes', description: 'Various fitness classes', price: '$25/class' },
          { name: 'Membership', description: 'Monthly gym access', price: '$89/month' },
          { name: 'Nutrition Consultation', description: 'Personalized nutrition plan', price: '$120' }
        ];
      } else if (businessName.includes('restaurant') || businessName.includes('cafe') || businessName.includes('bistro') || businessName.includes('kitchen')) {
        return [
          { name: 'Lunch Special', description: 'Weekday lunch menu', price: '$15' },
          { name: 'Dinner Menu', description: 'Full dinner service', price: '$25-45' },
          { name: 'Catering', description: 'Group and event catering', price: 'Varies' },
          { name: 'Private Dining', description: 'Reserved dining areas', price: 'Minimum spend $500' }
        ];
      } else if (businessName.includes('salon') || businessName.includes('hair') || businessName.includes('beauty') || businessName.includes('spa')) {
        return [
          { name: 'Haircut', description: 'Professional styling', price: '$45-65' },
          { name: 'Color Treatment', description: 'Hair coloring services', price: '$80-120' },
          { name: 'Manicure', description: 'Nail care service', price: '$35' },
          { name: 'Facial', description: 'Skin treatment', price: '$75' }
        ];
      } else if (businessName.includes('medical') || businessName.includes('clinic') || businessName.includes('health') || businessName.includes('doctor')) {
        return [
          { name: 'General Consultation', description: 'Initial medical consultation', price: '$150' },
          { name: 'Physical Examination', description: 'Comprehensive health checkup', price: '$200' },
          { name: 'Follow-up Visit', description: 'Post-treatment check', price: '$100' },
          { name: 'Specialized Testing', description: 'Medical diagnostic tests', price: '$75-400' }
        ];
      }
      
      // Default custom business services
      return [
        { name: `${inputValue} Standard Service`, description: 'Our most popular service', price: '$99' },
        { name: `${inputValue} Premium Package`, description: 'Enhanced service offering', price: '$149' },
        { name: 'Consultation', description: 'Professional consultation', price: '$75' },
        { name: 'Custom Solutions', description: 'Tailored to your specific needs', price: 'Varies' }
      ];
    }
    
    // For predefined business types
    switch (businessType) {
      case 'dentist':
        return [
          { name: 'Teeth Cleaning', description: 'Professional dental cleaning', price: '$120' },
          { name: 'Dental Checkup', description: 'Comprehensive dental examination', price: '$85' },
          { name: 'Teeth Whitening', description: 'Professional whitening treatment', price: '$250' },
          { name: 'Dental Filling', description: 'Tooth restoration', price: '$175' }
        ];
      case 'tech_services':
        return [
          { name: 'IT Consulting', description: 'Technology strategy and planning', price: '$150/hr' },
          { name: 'Network Setup', description: 'Business network installation', price: '$1,200' },
          { name: 'Cloud Migration', description: 'Migrate systems to cloud platforms', price: '$3,500' },
          { name: 'Cybersecurity', description: 'Security assessment and implementation', price: '$2,000' }
        ];
      case 'fitness':
        return [
          { name: 'Personal Training', description: 'One-on-one fitness coaching', price: '$80/session' },
          { name: 'Group Classes', description: 'Various fitness classes', price: '$25/class' },
          { name: 'Membership', description: 'Monthly gym access', price: '$89/month' },
          { name: 'Nutrition Consultation', description: 'Personalized nutrition plan', price: '$120' }
        ];
      case 'restaurant':
        return [
          { name: 'Lunch Special', description: 'Weekday lunch menu', price: '$15' },
          { name: 'Dinner Menu', description: 'Full dinner service', price: '$25-45' },
          { name: 'Catering', description: 'Group and event catering', price: 'Varies' },
          { name: 'Private Dining', description: 'Reserved dining areas', price: 'Minimum spend $500' }
        ];
      case 'salon':
        return [
          { name: 'Haircut', description: 'Professional styling', price: '$45-65' },
          { name: 'Color Treatment', description: 'Hair coloring services', price: '$80-120' },
          { name: 'Manicure', description: 'Nail care service', price: '$35' },
          { name: 'Facial', description: 'Skin treatment', price: '$75' }
        ];
      case 'medical':
        return [
          { name: 'General Consultation', description: 'Initial medical consultation', price: '$150' },
          { name: 'Physical Examination', description: 'Comprehensive health checkup', price: '$200' },
          { name: 'Follow-up Visit', description: 'Post-treatment check', price: '$100' },
          { name: 'Specialized Testing', description: 'Medical diagnostic tests', price: '$75-400' }
        ];
      default:
        return [
          { name: 'Standard Service', description: 'Our most popular service', price: '$99' },
          { name: 'Premium Package', description: 'Enhanced service offering', price: '$149' },
          { name: 'Consultation', description: 'Professional consultation', price: '$75' }
        ];
    }
  };

  // Get business FAQs based on business type
  const getBusinessFAQs = (businessType) => {
    const generalFAQs = [
      { 
        question: 'What are your hours of operation?', 
        answer: 'Please check our business profile for up-to-date hours of operation.'
      },
      { 
        question: 'Do you accept credit cards?', 
        answer: 'Yes, we accept all major credit cards including Visa, MasterCard, American Express, and Discover.'
      }
    ];
    
    // For custom businesses, create FAQs based on the name
    if (businessType === 'custom') {
      const businessName = inputValue.toLowerCase();
      
      // Default custom business FAQs
      let customFAQs = [
        { question: `How long has ${inputValue} been in business?`, answer: 'We have been proudly serving our customers for over 5 years.' },
        { question: `What makes ${inputValue} different from competitors?`, answer: 'We pride ourselves on exceptional customer service and personalized solutions for each client.' }
      ];
      
      // Add industry-specific FAQs based on business name keywords
      if (businessName.includes('dental') || businessName.includes('dentist') || businessName.includes('smile')) {
        customFAQs = [
          { question: 'Do you accept insurance?', answer: 'Yes, we accept most major dental insurance plans. Please call our office to verify your coverage.' },
          { question: 'How often should I have a dental checkup?', answer: 'We recommend visiting for a checkup and cleaning every 6 months.' },
          { question: 'Do you offer emergency dental services?', answer: 'Yes, we provide emergency dental care. Please call our office as early as possible.' }
        ];
      } else if (businessName.includes('tech') || businessName.includes('IT') || businessName.includes('computer')) {
        customFAQs = [
          { question: 'Do you offer support for small businesses?', answer: 'Yes, we specialize in supporting small to medium businesses with all their IT needs.' },
          { question: 'What areas do you service?', answer: 'We service the entire local area and surrounding regions.' },
          { question: 'Do you offer managed IT services?', answer: 'Yes, we offer comprehensive managed IT services with 24/7 monitoring and support.' }
        ];
      } else if (businessName.includes('fitness') || businessName.includes('gym') || businessName.includes('workout')) {
        customFAQs = [
          { question: 'Do you offer free trials?', answer: 'Yes, we offer a 3-day free trial for new members.' },
          { question: 'What types of classes do you offer?', answer: 'We offer yoga, spin, HIIT, pilates, and strength training classes.' },
          { question: 'Is there a joining fee?', answer: 'There is a one-time $50 joining fee for new memberships.' }
        ];
      } else if (businessName.includes('restaurant') || businessName.includes('cafe') || businessName.includes('bistro')) {
        customFAQs = [
          { question: 'Do you take reservations?', answer: 'Yes, we accept reservations for parties of any size. We recommend booking in advance for weekends.' },
          { question: 'Do you have vegetarian/vegan options?', answer: 'Yes, we offer several vegetarian and vegan options on our menu.' },
          { question: 'Do you offer takeout or delivery?', answer: 'Yes, we offer both takeout and delivery through our website and popular delivery apps.' }
        ];
      }
      
      return [...customFAQs, ...generalFAQs];
    }
    
    // For predefined business types
    let specificFAQs = [];
    
    switch (businessType) {
      case 'dentist':
        specificFAQs = [
          { question: 'Do you accept insurance?', answer: 'Yes, we accept most major dental insurance plans. Please call our office to verify your coverage.' },
          { question: 'How often should I have a dental checkup?', answer: 'We recommend visiting for a checkup and cleaning every 6 months.' },
          { question: 'Do you offer emergency dental services?', answer: 'Yes, we provide emergency dental care. Please call our office as early as possible.' }
        ];
        break;
      case 'tech_services':
        specificFAQs = [
          { question: 'Do you offer support for small businesses?', answer: 'Yes, we specialize in supporting small to medium businesses with all their IT needs.' },
          { question: 'What areas do you service?', answer: 'We service the entire local area and surrounding regions.' },
          { question: 'Do you offer managed IT services?', answer: 'Yes, we offer comprehensive managed IT services with 24/7 monitoring and support.' }
        ];
        break;
      case 'fitness':
        specificFAQs = [
          { question: 'Do you offer free trials?', answer: 'Yes, we offer a 3-day free trial for new members.' },
          { question: 'What types of classes do you offer?', answer: 'We offer yoga, spin, HIIT, pilates, and strength training classes.' },
          { question: 'Is there a joining fee?', answer: 'There is a one-time $50 joining fee for new memberships.' }
        ];
        break;
      case 'restaurant':
        specificFAQs = [
          { question: 'Do you take reservations?', answer: 'Yes, we accept reservations for parties of any size. We recommend booking in advance for weekends.' },
          { question: 'Do you have vegetarian/vegan options?', answer: 'Yes, we offer several vegetarian and vegan options on our menu.' },
          { question: 'Do you offer takeout or delivery?', answer: 'Yes, we offer both takeout and delivery through our website and popular delivery apps.' }
        ];
        break;
      case 'salon':
        specificFAQs = [
          { question: 'Do I need to make an appointment?', answer: 'Yes, appointments are recommended, but we do accept walk-ins based on availability.' },
          { question: 'What services do you offer?', answer: 'We offer a full range of salon services including haircuts, coloring, styling, manicures, pedicures, and facials.' },
          { question: 'Do you offer gift certificates?', answer: 'Yes, gift certificates are available for purchase in-store or on our website.' }
        ];
        break;
      case 'medical':
        specificFAQs = [
          { question: 'Do you accept insurance?', answer: 'Yes, we accept most major health insurance plans. Please contact our office to verify your coverage.' },
          { question: 'How do I schedule an appointment?', answer: 'You can schedule an appointment by calling our office or using our online booking system on our website.' },
          { question: 'What should I bring to my first appointment?', answer: 'Please bring your insurance card, ID, medical history, and a list of current medications.' }
        ];
        break;
      default:
        specificFAQs = [
          { question: 'How can I contact customer service?', answer: 'You can reach our customer service team by phone, email, or through the contact form on our website.' },
          { question: 'Do you offer any discounts?', answer: 'We offer seasonal promotions and discounts. Sign up for our newsletter to be notified of upcoming offers.' }
        ];
    }
    
    return [...specificFAQs, ...generalFAQs];
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        fullWidth
        placeholder="Start typing a business name..."
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <IconButton 
                  edge="end" 
                  onClick={handleSearch}
                  disabled={inputValue.trim().length < 2}
                >
                  <SearchIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
        sx={{ mb: 1 }}
      />
      
      {/* Location status message */}
      {locationLoading ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CircularProgress size={12} sx={{ mr: 1 }} />
          Detecting your location for better search results...
        </Typography>
      ) : locationError ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          {locationError}
        </Typography>
      ) : userLocation && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon fontSize="small" sx={{ fontSize: '14px', mr: 0.5 }} />
          Using your current location for better local search results
        </Typography>
      )}
      
      {error && (
        <Alert severity="info" sx={{ mt: 1, mb: 1 }}>
          {error}
          {inputValue.length > 2 && predictions.length === 0 && (
            <Box sx={{ mt: 1 }}>
              <Button 
                variant="outlined" 
                size="small" 
                color="primary"
                onClick={() => {
                  // Create a custom business based on user input
                  const customBusiness = {
                    id: `custom-${Date.now()}`,
                    name: inputValue,
                    description: `Custom business created from search`,
                    address: userLocation ? 'Near your location' : '123 Main St',
                    phone: '(555) 123-4567',
                    website: `https://${inputValue.toLowerCase().replace(/\s+/g, '')}.example.com`,
                    businessType: 'custom',
                    location: userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : null
                  };
                  handleSelectBusiness(customBusiness);
                }}
                sx={{ mt: 1 }}
              >
                Use "{inputValue}" for my business
              </Button>
            </Box>
          )}
        </Alert>
      )}
      
      {/* Predictions dropdown */}
      {predictions.length > 0 && (
        <Paper 
          elevation={3} 
          sx={{ 
            position: 'absolute',
            width: '100%', 
            mt: 0.5, 
            zIndex: 10,
            maxHeight: 350,
            overflow: 'auto'
          }}
        >
          <List dense>
            {predictions.map((business) => (
              <React.Fragment key={business.id}>
                <ListItem 
                  button 
                  onClick={() => handleSelectBusiness(business)}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <StorefrontIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="medium">
                        {business.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 0.5 }}>
                          <LocationOnIcon fontSize="small" sx={{ mr: 0.5, mt: 0.3, fontSize: '0.9rem', color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {business.address}
                          </Typography>
                        </Box>
                        {userLocation && business.location && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            {(calculateDistance(
                              userLocation.lat, 
                              userLocation.lng, 
                              business.location.lat, 
                              business.location.lng
                            ) * 0.621371).toFixed(1)} miles from your location
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default GooglePlacesAutocomplete;