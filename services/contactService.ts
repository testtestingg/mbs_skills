// services/contactService.ts
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  contactMethod: 'whatsapp' | 'email';
}

export const sendContactMessage = async (data: ContactFormData): Promise<void> => {
  // For demonstration, we'll simulate the API call
  // In a real implementation, this would make actual API calls
  
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // Simulate random success/failure
      if (Math.random() > 0.3) {
        resolve();
      } else {
        reject(new Error('Network error'));
      }
    }, 1500);
  });
};

// In a real implementation, you would have functions like:

export const sendWhatsAppMessage = async (data: ContactFormData): Promise<void> => {
  const message = `New contact request from TechyTak website:\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not provided'}\nService: ${data.service}\nMessage: ${data.message}`;
  
  const businessPhone = '21620497239'; // Your business WhatsApp number with country code
  const apiKey = '9633088'; // Replace with your actual CallMeBot API key
  
  const encodedMessage = encodeURIComponent(message);
  
  try {
    // Using a CORS proxy for development
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const response = await fetch(proxyUrl + `https://api.callmebot.com/whatsapp.php?phone=21620497239&text=This+is+a+test&apikey=9633088`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
  } catch (error) {
    console.error('WhatsApp error:', error);
    throw error;
  }
};

export const sendEmailMessage = async (data: ContactFormData): Promise<void> => {
  // In a real implementation, you would use an email service like:
  // - SendGrid
  // - Mailgun
  // - AWS SES
  // - Or a serverless function
  
  // For demonstration, we'll just simulate it
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve();
      } else {
        reject(new Error('Email service error'));
      }
    }, 1500);
  });
};