import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  title: string;
  description: string;
  formula?: string;
  goodRange?: string;
  children?: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  title, 
  description, 
  formula, 
  goodRange, 
  children 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        className="inline-flex items-center cursor-help"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        {children || <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 ml-1" />}
      </div>
      
      {isVisible && (
        <div className="absolute z-50 w-80 p-4 bg-white rounded-lg shadow-lg border border-gray-200 -translate-x-1/2 left-1/2 mt-2">
          {/* Arrow */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            
            <p className="text-sm text-gray-700 leading-relaxed">
              {description}
            </p>
            
            {formula && (
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs font-medium text-gray-600 mb-1">Formula:</p>
                <p className="text-sm font-mono text-gray-800">{formula}</p>
              </div>
            )}
            
            {goodRange && (
              <div className="border-t border-gray-200 pt-2">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Good Range:</span> {goodRange}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
