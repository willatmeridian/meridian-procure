import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { submitToHubSpot, transformFormData } from '../lib/hubspot.js';

const HubSpotQuoteForm = ({ formId = null }) => {
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
  const formRef = useRef(null);

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
      // Use main form ID
      const mainFormId = formId || import.meta.env.PUBLIC_HUBSPOT_FORM_ID;
      
      // Transform form data for HubSpot
      const transformedData = transformFormData(formData);
      
      // Submit to HubSpot
      const result = await submitToHubSpot(transformedData, mainFormId);
      
      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your message has been submitted. We\'ll contact you within 24 hours.'
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
        
        // Scroll to top of form to show success message
        if (formRef.current) {
          formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Sorry, there was an error submitting your message. Please try again or contact us directly.'
      });
      
      // Scroll to top of form to show error message
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={formRef} className="flex-1 border border-[#080c2433] overflow-hidden">
      <div className="pt-7 pb-2">
        <h3 className="text-center text-[28.5px] font-bold text-[#080c24] tracking-[-0.28px] leading-[29.6px] font-['Instrument_Sans',Helvetica]">
          Tell us your Pallet Needs
        </h3>
      </div>
      
      <div className="p-10 overflow-y-auto">
        {submitStatus && (
          <div className={`mb-6 p-4 rounded-lg ${
            submitStatus.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {submitStatus.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row gap-[30px]">
            <div className="flex-1 flex flex-col gap-2.5">
              <Label htmlFor="firstName" className="flex">
                <span className="text-[#212d3a] font-buy-meridianprocure-com-semantic-label">
                  First Name
                </span>
                <span className="text-[#e51520] font-buy-meridianprocure-com-semantic-label">
                  *
                </span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="h-[40.5px] bg-[#f5f8fa] border-[#959494]"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-2.5">
              <Label
                htmlFor="lastName"
                className="text-[#212d3a] font-buy-meridianprocure-com-semantic-label"
              >
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="h-[40.5px] bg-[#f5f8fa] border-[#959494]"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-[30px]">
            <div className="flex-1 flex flex-col gap-2.5">
              <Label htmlFor="email" className="flex">
                <span className="text-[#212d3a] font-buy-meridianprocure-com-semantic-label">
                  Email
                </span>
                <span className="text-[#e51520] font-buy-meridianprocure-com-semantic-label">
                  *
                </span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="h-[40.5px] bg-[#f5f8fa] border-[#959494]"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-2.5">
              <Label htmlFor="phone" className="flex">
                <span className="text-[#212d3a] font-buy-meridianprocure-com-semantic-label">
                  Phone Number
                </span>
                <span className="text-[#e51520] font-buy-meridianprocure-com-semantic-label">
                  *
                </span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="h-[40.5px] bg-[#f5f8fa] border-[#959494]"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <Label
              htmlFor="company"
              className="text-[#212d3a] font-buy-meridianprocure-com-semantic-label"
            >
              Company name
            </Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="h-[40.5px] bg-[#f5f8fa] border-[#959494]"
            />
          </div>

          <div className="flex flex-col gap-2.5 pb-[3.5px]">
            <Label
              htmlFor="message"
              className="text-[#212d3a] font-buy-meridianprocure-com-semantic-label"
            >
              Description of Needs
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="p-[11px] bg-[#f5f8fa] border-[#959494] text-[#516383a3] font-buy-meridianprocure-com-helvetica-regular"
              placeholder="Please describe your pallet requirements- including quantities, dimensions, frequency, and any specific needs..."
            />
          </div>

          <div className="flex justify-end pt-5">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-3 h-auto bg-[#1e308e] hover:bg-[#0f1a4d] rounded-[3px] font-buy-meridianprocure-com-helvetica-bold text-white disabled:opacity-50 transition-colors duration-200"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HubSpotQuoteForm;