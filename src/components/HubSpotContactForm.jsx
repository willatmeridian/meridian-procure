import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { submitToHubSpot, transformFormData } from '../lib/hubspot.js';

const HubSpotContactForm = ({ formId = null }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    gclid: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Capture GCLID from URL on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const gclid = urlParams.get('gclid');
      console.log('HubSpot Contact Form - GCLID captured:', gclid);
      if (gclid) {
        setFormData(prev => ({ ...prev, gclid }));
        console.log('HubSpot Contact Form - GCLID set in form state');
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Use main form ID if no specific form ID provided
      const mainFormId = formId || import.meta.env.PUBLIC_HUBSPOT_FORM_ID;
      
      // Transform form data for HubSpot
      console.log('HubSpot Contact Form - Form data before transform:', formData);
      const transformedData = transformFormData(formData);
      console.log('HubSpot Contact Form - Transformed data:', transformedData);
      
      // Submit to HubSpot
      const result = await submitToHubSpot(transformedData, mainFormId);
      
      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.'
        });
        
        // Reset form but keep gclid
        setFormData(prev => ({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          message: '',
          gclid: prev.gclid
        }));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Sorry, there was an error sending your message. Please try again or contact us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-8">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6 [font-family:'Instrument_Sans',Helvetica]">
        Send Us a Message
      </h3>
      
      {submitStatus && (
        <div className={`mb-6 p-4 rounded-lg ${
          submitStatus.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {submitStatus.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="flex">
              <span className="text-gray-700 [font-family:'Instrument_Sans',Helvetica]">
                First Name
              </span>
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="bg-white border-gray-300 [font-family:'Instrument_Sans',Helvetica]"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-gray-700 [font-family:'Instrument_Sans',Helvetica]">
              Last Name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="bg-white border-gray-300 [font-family:'Instrument_Sans',Helvetica]"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex">
              <span className="text-gray-700 [font-family:'Instrument_Sans',Helvetica]">
                Email
              </span>
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-white border-gray-300 [font-family:'Instrument_Sans',Helvetica]"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700 [font-family:'Instrument_Sans',Helvetica]">
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className="bg-white border-gray-300 [font-family:'Instrument_Sans',Helvetica]"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company" className="text-gray-700 [font-family:'Instrument_Sans',Helvetica]">
            Company Name
          </Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="bg-white border-gray-300 [font-family:'Instrument_Sans',Helvetica]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message" className="flex">
            <span className="text-gray-700 [font-family:'Instrument_Sans',Helvetica]">
              Message
            </span>
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="bg-white border-gray-300 [font-family:'Instrument_Sans',Helvetica] min-h-[120px]"
            placeholder="Please describe your pallet requirements, including quantities, dimensions, and any specific needs..."
            required
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-[#1e308e] hover:bg-[#0f1a4d] text-white font-semibold py-3 px-8 rounded-xl [font-family:'Instrument_Sans',Helvetica] disabled:opacity-50 transition-colors duration-200"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HubSpotContactForm;