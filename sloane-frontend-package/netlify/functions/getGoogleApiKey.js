exports.handler = async function(event, context) {
  console.log('API Key function called');
  
  // Set CORS headers to allow all origins in development
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }
  
  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return { 
      statusCode: 405, 
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method Not Allowed" }) 
    };
  }

  // Get the API key from environment variables
  // Make sure to set this in your Netlify environment variables
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
  console.log('API Key exists:', !!apiKey);
  
  if (!apiKey) {
    return { 
      statusCode: 500, 
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      },
      body: JSON.stringify({ error: "API key is not configured in environment variables" }) 
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    },
    body: JSON.stringify({ apiKey })
  };
};