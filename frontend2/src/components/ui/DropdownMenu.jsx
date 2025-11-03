import React, { useState, useEffect, useRef } from 'react';
import './DropdownMenu.css';

const DropdownMenu = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div className="dropdown__trigger" onClick={toggleDropdown}>
        {trigger}
      </div>
      {isOpen && (
        <div className="dropdown__menu">
          {React.Children.map(children, child =>
            React.isValidElement(child)
              ? React.cloneElement(child, { onClick: () => {
                  if (child.props.onClick) {
                    child.props.onClick();
                  }
                  setIsOpen(false);
                }})
              : null
          )}
        </div>
      )}
    </div>
  );
};

export const DropdownMenuItem = ({ children, onClick }) => {
  return (
    <div className="dropdown__item" onClick={onClick}>
      {children}
    </div>
  );
};

export default DropdownMenu;
