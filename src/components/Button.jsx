import React from 'react';

function Button({
  label, onClick, disabled, id,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      id={id}
    >
      { label }
    </button>
  );
}

export default Button;
