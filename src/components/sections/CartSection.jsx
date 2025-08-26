import React, { useState } from 'react';
import { getCityPalletPricing } from '../../lib/sanity/client.js';
import { loadStripe } from '@stripe/stripe-js';

// City data sorted alphabetically
const cities = [
  { name: "Atlanta", state: "GA", slug: "atlanta" },
  { name: "Birmingham", state: "AL", slug: "birmingham" },
  { name: "Charlotte", state: "NC", slug: "charlotte" },
  { name: "Chicago", state: "IL", slug: "chicago" },
  { name: "Columbus", state: "OH", slug: "columbus" },
  { name: "Dallas", state: "TX", slug: "dallas" },
  { name: "Denver", state: "CO", slug: "denver" },
  { name: "Detroit", state: "MI", slug: "detroit" },
  { name: "Houston", state: "TX", slug: "houston" },
  { name: "Indianapolis", state: "IN", slug: "indianapolis" },
  { name: "Kansas City", state: "MO", slug: "kansas-city" },
  { name: "Los Angeles", state: "CA", slug: "los-angeles" },
  { name: "Louisville", state: "KY", slug: "louisville" },
  { name: "Miami", state: "FL", slug: "miami" },
  { name: "Milwaukee", state: "WI", slug: "milwaukee" },
  { name: "Nashville", state: "TN", slug: "nashville" },
  { name: "Norfolk", state: "VA", slug: "norfolk" },
  { name: "Phoenix", state: "AZ", slug: "phoenix" },
  { name: "Salt Lake City", state: "UT", slug: "salt-lake-city" },
  { name: "Seattle", state: "WA", slug: "seattle" }
];

// No static pallet data - all data comes from CMS

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CartSection() {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [palletData, setPalletData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleLocationSelect = async (locationSlug) => {
    setSelectedLocation(locationSlug);
    setCart([]); // Clear cart when location changes
    setQuantities({}); // Clear quantities
    
    if (locationSlug) {
      setLoading(true);
      try {
        const cmsData = await getCityPalletPricing(locationSlug);
        console.log('Raw CMS data:', cmsData);
        
        // Filter out pallets without pricing for this location and sort by category
        const availableCMSPallets = cmsData
          .filter(pallet => pallet.cityPricing && pallet.cityPricing.price)
          .map(pallet => ({
            id: pallet.slug,
            name: pallet.name,
            image: pallet.imageUrl || "/img/48x40-grade-a-stringer-wooden-pallet.png",
            description: pallet.shortDescription || pallet.description || "Premium pallet solution",
            category: pallet.category,
            locationPricing: {
              [locationSlug]: {
                price: pallet.cityPricing.price,
                inStock: pallet.cityPricing.inStock || 500
              }
            }
          }))
          .sort((a, b) => {
            // Sort AAA -> Grade A -> Grade B
            const order = { 'aaa-grade': 0, 'grade-a': 1, 'grade-b': 2 };
            return (order[a.category] || 3) - (order[b.category] || 3);
          });
        
        console.log('Processed pallets for', locationSlug, ':', availableCMSPallets);
        
        setPalletData(availableCMSPallets);
      } catch (error) {
        console.error('Error fetching pallet data:', error);
        // No fallback - show empty state if CMS fails
        setPalletData([]);
      } finally {
        setLoading(false);
      }
    } else {
      setPalletData([]);
    }
  };

  const getAvailablePallets = () => {
    return palletData;
  };

  const addToCart = (pallet, quantity) => {
    const qty = parseInt(quantity);
    
    // Validate quantity before adding to cart
    if (isNaN(qty) || qty === 0 || quantity === '') {
      alert('Please enter a valid quantity');
      return;
    }
    if (qty < 100) {
      alert('Minimum quantity is 100 pallets');
      return;
    }
    if (qty > 615) {
      alert('Maximum quantity is 615 pallets');
      return;
    }
    
    const locationData = pallet.locationPricing[selectedLocation];
    const cartItem = {
      id: pallet.id,
      name: pallet.name,
      price: locationData.price,
      quantity: qty,
      image: pallet.image
    };
    
    const existingItemIndex = cart.findIndex(item => item.id === pallet.id);
    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += cartItem.quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, cartItem]);
    }
  };

  const removeFromCart = (palletId) => {
    setCart(cart.filter(item => item.id !== palletId));
  };

  const updateQuantity = (palletId, newQuantity) => {
    const qty = parseInt(newQuantity);
    
    // Allow any input while typing, but validate on blur/enter
    const updatedCart = cart.map(item => {
      if (item.id === palletId) {
        // If quantity is valid, update it
        if (!isNaN(qty) && qty >= 100 && qty <= 615) {
          return { ...item, quantity: qty };
        }
        // If invalid but user is still typing (empty or partial), keep the string value temporarily
        if (newQuantity === '' || newQuantity === '0') {
          return { ...item, quantity: newQuantity };
        }
        // If invalid number, revert to minimum
        return { ...item, quantity: 100 };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const qty = parseInt(item.quantity) || 0;
      return total + (item.price * qty);
    }, 0);
  };

  const calculateShipping = () => {
    const totalPallets = cart.reduce((total, item) => {
      const qty = parseInt(item.quantity) || 0;
      return total + qty;
    }, 0);
    return totalPallets >= 550 ? 0 : 300;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsCheckingOut(true);
    
    try {
      const selectedCity = cities.find(city => city.slug === selectedLocation);
      
      // Prepare cart items for Stripe
      const checkoutItems = cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: parseInt(item.quantity),
        image: item.image,
        category: item.category || 'standard'
      }));

      const customerInfo = {
        location: selectedCity ? `${selectedCity.name}, ${selectedCity.state}` : selectedLocation,
        email: '', // This will be collected by Stripe Checkout
      };

      // Call your API to create checkout session
      console.log('Creating checkout session with:', { items: checkoutItems, customerInfo });
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: checkoutItems,
          customerInfo
        }),
      });

      console.log('Checkout API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Checkout API error:', errorText);
        throw new Error(`Checkout failed: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Checkout API response data:', responseData);
      
      const { sessionId, url, error } = responseData;

      if (error) {
        console.error('Checkout session error:', error);
        throw new Error(error);
      }

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        // Fallback: use Stripe.js to redirect
        const stripe = await stripePromise;
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId,
        });

        if (stripeError) {
          console.error('Stripe redirect error:', stripeError);
          alert('There was an error processing your checkout. Please try again.');
        }
      }
    } catch (error) {
      console.error('Checkout error details:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      alert(`Checkout Error: ${errorMessage}\n\nPlease check the browser console for more details and try again.`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const selectedCity = cities.find(city => city.slug === selectedLocation);
  const availableProducts = getAvailablePallets();

  return (
    <section className="w-full py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 [font-family:'Instrument_Sans',Helvetica]">
            Buy Pallets Online
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto [font-family:'Instrument_Sans',Helvetica]">
            Select your location first, then choose from available products and checkout securely
          </p>
        </div>

        {/* Step 1: Location Selection */}
        <div className="mb-8 sm:mb-12">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 [font-family:'Instrument_Sans',Helvetica]">
              Step 1: Select Your Location
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label 
                htmlFor="location"
                className="text-gray-700 font-semibold [font-family:'Instrument_Sans',Helvetica]"
              >
                Choose your delivery location:
              </label>
              <select
                id="location"
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white min-w-64 [font-family:'Instrument_Sans',Helvetica]"
                value={selectedLocation}
                onChange={(e) => handleLocationSelect(e.target.value)}
              >
                <option value="">Select a location...</option>
                {cities.map(city => (
                  <option key={city.slug} value={city.slug}>
                    {city.name}, {city.state}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Products and Cart (only show if location selected) */}
        {selectedLocation && (
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 [font-family:'Instrument_Sans',Helvetica]">
                Step 2: Choose from Available Products
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 [font-family:'Instrument_Sans',Helvetica]">
                Available products for delivery to {selectedCity?.name}, {selectedCity?.state}
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
              {/* Available Pallets - Left Column */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 [font-family:'Instrument_Sans',Helvetica]">
                    Available Products
                  </h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-xs sm:text-sm font-medium text-green-800 [font-family:'Instrument_Sans',Helvetica]">
                        Free Shipping for Orders Greater than 550 Pallets
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500 [font-family:'Instrument_Sans',Helvetica]">
                      Loading available products...
                    </div>
                  ) : availableProducts.length > 0 ? availableProducts.map(pallet => {
                    const locationData = pallet.locationPricing[selectedLocation];
                    const currentQty = quantities[pallet.id] !== undefined ? quantities[pallet.id] : 100;
                    
                    return (
                      <div key={pallet.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Product Image */}
                          <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                            <img
                              src={pallet.image}
                              alt={pallet.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Product Details */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-semibold text-gray-900 [font-family:'Instrument_Sans',Helvetica]">
                                {pallet.name}
                              </h4>
                            </div>
                            
                            <p className="text-gray-600 mb-4 [font-family:'Instrument_Sans',Helvetica]">
                              {pallet.description}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="flex items-baseline">
                                  <span className="text-2xl font-bold text-meridian-blue [font-family:'Instrument_Sans',Helvetica]">
                                    ${locationData.price.toFixed(2)}
                                  </span>
                                  <span className="text-gray-600 ml-1">/pallet</span>
                                </div>
                                <div className="text-sm text-gray-500 [font-family:'Instrument_Sans',Helvetica]">
                                  Min: 100 | Max: 615
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <label 
                                  htmlFor={`qty-${pallet.id}`}
                                  className="text-sm text-gray-700 [font-family:'Instrument_Sans',Helvetica]"
                                >
                                  Qty:
                                </label>
                                <input
                                  id={`qty-${pallet.id}`}
                                  type="number"
                                  value={currentQty}
                                  className="w-20 text-center px-2 py-1 border border-gray-300 rounded [font-family:'Instrument_Sans',Helvetica]"
                                  onChange={(e) => setQuantities({...quantities, [pallet.id]: e.target.value})}
                                  onBlur={(e) => {
                                    // If field is empty on blur, set to default minimum
                                    if (e.target.value === '' || e.target.value === '0') {
                                      setQuantities({...quantities, [pallet.id]: 100});
                                    }
                                  }}
                                  placeholder="100"
                                />
                                <button
                                  className="px-4 py-2 rounded-lg transition-colors text-white cursor-pointer [font-family:'Instrument_Sans',Helvetica]"
                                  style={{ backgroundColor: '#1e308e' }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0f1a4d'}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = '#1e308e'}
                                  onClick={() => addToCart(pallet, currentQty)}
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="text-center py-8 text-gray-500 [font-family:'Instrument_Sans',Helvetica]">
                      No products available for this location.
                    </div>
                  )}
                </div>
              </div>
              
              {/* Shopping Cart - Right Column */}
              <div className="w-full lg:w-96">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:sticky lg:top-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 [font-family:'Instrument_Sans',Helvetica]">
                    Shopping Cart
                  </h3>
                  
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {cart.length > 0 ? cart.map(item => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1">
                          <h5 className="font-semibold text-sm [font-family:'Instrument_Sans',Helvetica]">
                            {item.name}
                          </h5>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="number"
                              value={item.quantity}
                              className="w-16 text-xs text-center px-1 py-1 border rounded"
                              onChange={(e) => updateQuantity(item.id, e.target.value)}
                              placeholder="100"
                            />
                            <span className="text-xs text-gray-600 [font-family:'Instrument_Sans',Helvetica]">
                              × ${item.price.toFixed(2)}
                            </span>
                            <button
                              className="text-red-600 text-xs ml-2"
                              onClick={() => removeFromCart(item.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-gray-500 [font-family:'Instrument_Sans',Helvetica]">
                        Your cart is empty
                      </div>
                    )}
                  </div>
                  
                  {/* Cart Summary */}
                  <div className="border-t pt-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-gray-600 [font-family:'Instrument_Sans',Helvetica]">
                        <span>Subtotal:</span>
                        <span>${calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 [font-family:'Instrument_Sans',Helvetica]">
                        <span>Delivery Fee:</span>
                        <span>${calculateShipping().toFixed(2)}</span>
                      </div>
                      {calculateShipping() === 0 && (
                        <div className="text-xs text-green-600 [font-family:'Instrument_Sans',Helvetica]">
                          ✓ Free delivery (550+ pallets)
                        </div>
                      )}
                      <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900 [font-family:'Instrument_Sans',Helvetica]">
                        <span>Total:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Checkout Button */}
                    <button
                      className={`w-full font-semibold py-3 px-6 rounded-xl transition-colors [font-family:'Instrument_Sans',Helvetica] ${
                        cart.length > 0 && !isCheckingOut
                          ? 'text-white cursor-pointer' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      style={cart.length > 0 && !isCheckingOut ? { backgroundColor: '#1e308e' } : {}}
                      onMouseEnter={(e) => {
                        if (cart.length > 0 && !isCheckingOut) {
                          e.target.style.backgroundColor = '#0f1a4d';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (cart.length > 0 && !isCheckingOut) {
                          e.target.style.backgroundColor = '#1e308e';
                        }
                      }}
                      disabled={cart.length === 0 || isCheckingOut}
                      onClick={handleCheckout}
                    >
                      {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                    </button>
                    
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                      </svg>
                      <span className="[font-family:'Instrument_Sans',Helvetica]">
                        Secure checkout with Stripe
                      </span>
                    </div>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-3 [font-family:'Instrument_Sans',Helvetica]">
                      Need Help?
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                        <span className="[font-family:'Instrument_Sans',Helvetica]">1-800-PALLETS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        <span className="[font-family:'Instrument_Sans',Helvetica]">info@meridianprocure.com</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}