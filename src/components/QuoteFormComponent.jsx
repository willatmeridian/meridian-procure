import React, { useState, useRef } from 'react';
import { submitToHubSpot, transformFormData } from '../lib/hubspot.js';

const QuoteFormComponent = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    deliveryPostalCode: '',
    palletDimensions: '',
    quantity: '',
    palletType: '',
    entryType: '',
    lumberType: '',
    palletGrade: '',
    heatTreated: false,
    additionalDetails: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const formRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Get HubSpot tracking cookie for better analytics
      const getCookieValue = (name) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : '';
      };

      // Prepare form data with tracking information
      const submissionData = {
        ...formData,
        hutk: getCookieValue('hubspotutk'),
        pageUri: window.location.href,
        pageName: document.title
      };

      // Use server-side HubSpot CRM API for full custom field support
      const response = await fetch('/api/submit-hubspot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your quote request has been submitted. We\'ll get back to you within 24 hours.'
        });
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          deliveryPostalCode: '',
          palletDimensions: '',
          quantity: '',
          palletType: '',
          entryType: '',
          lumberType: '',
          palletGrade: '',
          heatTreated: false,
          additionalDetails: ''
        });
        
        // Scroll to top of form to show success message, accounting for fixed navigation
        if (formRef.current) {
          const yOffset = -100; // Offset for fixed navigation bar
          const y = formRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Sorry, there was an error submitting your quote request. Please try again or contact us directly.'
      });
      
      // Scroll to top of form to show error message, accounting for fixed navigation
      if (formRef.current) {
        const yOffset = -100; // Offset for fixed navigation bar
        const y = formRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {submitStatus && (
        <div className={`mb-6 p-4 rounded-lg ${
          submitStatus.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {submitStatus.message}
        </div>
      )}

      {/* Row 1: First Name, Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2 [font-family:'Instrument_Sans',Helvetica]">
            First Name<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [font-family:'Instrument_Sans',Helvetica]"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2 [font-family:'Instrument_Sans',Helvetica]">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [font-family:'Instrument_Sans',Helvetica]"
          />
        </div>
      </div>

      {/* Row 2: Email, Phone Number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2 [font-family:'Instrument_Sans',Helvetica]">
            Email<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [font-family:'Instrument_Sans',Helvetica]"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2 [font-family:'Instrument_Sans',Helvetica]">
            Phone Number<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex">
            <div className="flex items-center bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg px-3">
              <span className="text-sm">🇺🇸</span>
              <span className="ml-2 text-gray-700">+1</span>
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [font-family:'Instrument_Sans',Helvetica]"
            />
          </div>
        </div>
      </div>

      {/* Row 3: Company name, Delivery Postal Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2 [font-family:'Instrument_Sans',Helvetica]">
            Company name
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [font-family:'Instrument_Sans',Helvetica]"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2 [font-family:'Instrument_Sans',Helvetica]">
            Delivery Postal Code<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="deliveryPostalCode"
            value={formData.deliveryPostalCode}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [font-family:'Instrument_Sans',Helvetica]"
          />
        </div>
      </div>

      {/* Row 4: Pallet Dimensions, Quantity, Pallet Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2 [font-family:'Instrument_Sans',Helvetica]">
            Pallet Dimensions<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="palletDimensions"
            value={formData.palletDimensions}
            onChange={handleInputChange}
            placeholder='##" x ##"'
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [font-family:'Instrument_Sans',Helvetica]"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2 [font-family:'Instrument_Sans',Helvetica]">
            Quantity
          </label>
          <input
            type="text"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="Estimated Annual Quantity"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [font-family:'Instrument_Sans',Helvetica]"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2 [font-family:'Instrument_Sans',Helvetica]">
            Pallet Type
          </label>
          <select
            name="palletType"
            value={formData.palletType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [font-family:'Instrument_Sans',Helvetica] appearance-none bg-white"
          >
            <option value="">Select Type</option>
            <option value="Stringer Pallet">Stringer Pallet</option>
            <option value="Block Pallet">Block Pallet</option>
            <option value="Skid Pallet">Skid Pallet</option>
            <option value="Top Frame">Top Frame</option>
          </select>
        </div>
      </div>

      {/* Row 5: 2-way or 4-way, Lumber Type, Pallet Grade */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2 [font-family:'Instrument_Sans',Helvetica]">
            Entry Type
          </label>
          <select
            name="entryType"
            value={formData.entryType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [font-family:'Instrument_Sans',Helvetica] appearance-none bg-white"
          >
            <option value="">Select Entry</option>
            <option value="2-Way">2-Way</option>
            <option value="4-Way">4-Way</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2 [font-family:'Instrument_Sans',Helvetica]">
            Lumber Type
          </label>
          <select
            name="lumberType"
            value={formData.lumberType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [font-family:'Instrument_Sans',Helvetica] appearance-none bg-white"
          >
            <option value="">Select Lumber</option>
            <option value="New Green Pine">New Green Pine</option>
            <option value="New KDHT SYP">New KDHT SYP</option>
            <option value="New Hardwood">New Hardwood</option>
            <option value="New KDHT Hardwood">New KDHT Hardwood</option>
            <option value="Combo">Combo</option>
            <option value="Recycled">Recycled</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2 [font-family:'Instrument_Sans',Helvetica]">
            Pallet Grade
          </label>
          <select
            name="palletGrade"
            value={formData.palletGrade}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [font-family:'Instrument_Sans',Helvetica] appearance-none bg-white"
          >
            <option value="">Select Grade</option>
            <option value="Grade A">Grade A</option>
            <option value="Grade B">Grade B</option>
            <option value="AAA / Premium">AAA / Premium</option>
            <option value="New">New</option>
            <option value="Combo">Combo</option>
          </select>
        </div>
      </div>

      {/* Heat Treated Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="heatTreated"
          checked={formData.heatTreated}
          onChange={handleInputChange}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="ml-3 text-gray-700 font-medium [font-family:'Instrument_Sans',Helvetica]">
          Heat Treated?
        </label>
      </div>

      {/* Additional Details */}
      <div>
        <label className="block text-gray-700 font-medium mb-2 [font-family:'Instrument_Sans',Helvetica]">
          Additional Details
        </label>
        <textarea
          name="additionalDetails"
          value={formData.additionalDetails}
          onChange={handleInputChange}
          rows="4"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [font-family:'Instrument_Sans',Helvetica]"
          placeholder="Please provide any additional details about your pallet requirements..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#1e308e] hover:bg-[#0f1a4d] text-white font-semibold py-3 px-8 rounded-lg [font-family:'Instrument_Sans',Helvetica] disabled:opacity-50 transition-colors duration-200"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default QuoteFormComponent;