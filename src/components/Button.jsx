import React from 'react';

function Button({ label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      { label }
    </button>
  );
}

export default Button;