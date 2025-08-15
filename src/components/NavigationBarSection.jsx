import React, { useState } from "react";
import { Button } from "./ui/button";

const NavigationBarSection = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  // Navigation menu items data
  const navItems = [
    { id: 1, label: "Locations", href: "/locations" },
    { id: 2, label: "Pallets", href: "/pallets" },
  ];

  // Solutions dropdown items
  const solutionsItems = [
    { label: "National Procurement Solutions", href: "/national" },
    { label: "Buy Pallets Now", href: "/buy-now" },
  ];

  // Company dropdown items
  const companyItems = [
    { label: "About", href: "/about" },
    { label: "Blogs & Tips", href: "/blogs-tips" },
    { label: "Contact", href: "/contact" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm pb-3 sm:pb-5">
      <header className="w-full max-w-[1329px] h-12 sm:h-16 mx-auto mt-4 sm:mt-[34px] flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="flex-shrink-0">
        <a href="/">
          <img
            className="w-[180px] sm:w-[220px] lg:w-[255px] h-[42px] sm:h-[51px] lg:h-[59px] object-cover cursor-pointer"
            alt="Meridian logo one"
            src="/img/meridian-logo-one-01-tb-1-1.png"
          />
        </a>
      </div>

      {/* Desktop Navigation Menu and Buy Now Button - Right Aligned */}
      <div className="hidden lg:flex items-center space-x-8">
        <div className="flex items-center space-x-6">
          {/* Solutions Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <button
              className="font-['Instrument_Sans',Helvetica] font-semibold text-black text-base text-center leading-4 tracking-[0] py-2 px-2 hover:text-[#e1c16e] transition-colors duration-200 flex items-center gap-1"
            >
              Solutions
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {solutionsOpen && (
              <div className="absolute top-full left-0 pt-1 w-64 z-50">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  {solutionsItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="block px-4 py-3 text-black hover:bg-gray-50 hover:text-[#e1c16e] transition-colors duration-200 font-['Instrument_Sans',Helvetica] font-medium"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {navItems.map((item) => (
            <a 
              key={item.id}
              href={item.href}
              className="font-['Instrument_Sans',Helvetica] font-semibold text-black text-base text-center leading-4 tracking-[0] py-2 px-2 hover:text-[#e1c16e] transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
          
          {/* Company Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setCompanyOpen(true)}
            onMouseLeave={() => setCompanyOpen(false)}
          >
            <button
              className="font-['Instrument_Sans',Helvetica] font-semibold text-black text-base text-center leading-4 tracking-[0] py-2 px-2 hover:text-[#e1c16e] transition-colors duration-200 flex items-center gap-1"
            >
              Company
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {companyOpen && (
              <div className="absolute top-full left-0 pt-1 w-48 z-50">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  {companyItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="block px-4 py-3 text-black hover:bg-gray-50 hover:text-[#e1c16e] transition-colors duration-200 font-['Instrument_Sans',Helvetica] font-medium"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Buy Now Button */}
        <a href="/buy-now">
          <Button className="bg-[#1e308e] hover:bg-[#0f1a4d] h-14 text-white text-xl leading-[19.2px] tracking-[0] px-6 rounded-xl font-['Instrument_Sans',Helvetica] font-normal transition-colors duration-200">
            Buy Now
          </Button>
        </a>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center space-x-4">
        {/* Mobile Buy Now Button */}
        <a href="/buy-now">
          <Button className="bg-[#1e308e] hover:bg-[#0f1a4d] h-12 text-white text-sm leading-[19.2px] tracking-[0] px-4 rounded-xl font-['Instrument_Sans',Helvetica] font-normal transition-colors duration-200">
            Buy Now
          </Button>
        </a>
        
        {/* Hamburger Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="flex flex-col justify-center items-center w-8 h-8 space-y-1 focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          <div className={`w-6 h-0.5 bg-black transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-black transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-black transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
        </button>
      </div>
      </header>

      {/* Mobile Menu Panel */}
      <div className={`lg:hidden bg-white border-t border-gray-200 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-6 space-y-4">
          {/* Solutions Section */}
          <div>
            <h3 className="font-['Instrument_Sans',Helvetica] font-semibold text-gray-900 text-lg mb-3">
              Solutions
            </h3>
            <div className="space-y-2 pl-4">
              {solutionsItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="block py-2 font-['Instrument_Sans',Helvetica] font-medium text-gray-700 hover:text-[#e1c16e] transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Main Navigation Items */}
          <div className="space-y-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="block py-3 font-['Instrument_Sans',Helvetica] font-semibold text-black text-lg hover:text-[#e1c16e] transition-colors duration-200 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Company Section */}
          <div>
            <h3 className="font-['Instrument_Sans',Helvetica] font-semibold text-gray-900 text-lg mb-3">
              Company
            </h3>
            <div className="space-y-2 pl-4">
              {companyItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="block py-2 font-['Instrument_Sans',Helvetica] font-medium text-gray-700 hover:text-[#e1c16e] transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBarSection;
