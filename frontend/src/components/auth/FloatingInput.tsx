import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  value?: string; // Optionnel car géré par register()
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, type, value = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Correction : Ajout d'une sécurité sur value.length
    const isActive = isFocused || (value && value.length > 0);
    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
      <div className="relative w-full mb-4">
        <label
          className={`absolute left-4 transition-all duration-200 pointer-events-none ${
            isActive 
              ? '-top-2 text-xs text-coral bg-cream px-1' 
              : 'top-4 text-slate'
          }`}
        >
          {label}
        </label>
        
        <input
          {...props}
          ref={ref}
          type={inputType}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`w-full p-4 bg-transparent border-b-2 outline-none transition-colors ${
            error ? 'border-red-500' : 'border-slate/20 focus:border-coral'
          } ${isActive ? 'pt-6 pb-2' : 'p-4'}`}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-4 text-slate hover:text-navy"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}

        {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';
export default FloatingInput;