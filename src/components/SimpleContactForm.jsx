import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

const SimpleContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

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
      // Simple form submission using Netlify Forms as fallback
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'contact',
          ...formData
        }).toString()
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.'
        });
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          message: ''
        });
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Sorry, there was an error sending your message. Please try again or contact us directly at info@meridianprocure.com'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-8">
      {/* Hidden Netlify form for form detection */}
      <form name="contact" netlify="true" hidden>
        <input type="text" name="firstName" />
        <input type="text" name="lastName" />
        <input type="email" name="email" />
        <input type="tel" name="phone" />
        <input type="text" name="company" />
        <textarea name="message"></textarea>
      </form>

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
            className="bg-meridian-blue hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-xl [font-family:'Instrument_Sans',Helvetica] disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SimpleContactForm;