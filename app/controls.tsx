import React, { useState } from 'react';
import Select from 'react-select';

interface ControlsProps {
  onSortChange: (field: string, direction: string) => void;
}

const Controls: React.FC<ControlsProps> = ({ onSortChange }) => {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<string>('ascending');

  const fieldOptions = [
    { label: 'Name', value: 'name' },
    { label: 'Company', value: 'company' },
    { label: 'Email', value: 'email' },
  ];

  const directionOptions = [
    { label: 'Ascending', value: 'ascending' },
    { label: 'Descending', value: 'descending' },
  ];

  const handleSortFieldChange = (selectedOption: any) => {
    const field = selectedOption?.value;
    setSelectedField(field); // Update state with selected field
    if (field && selectedDirection) {
      onSortChange(field, selectedDirection); // Trigger sort with new field and current direction
    }
  };

  const handleSortDirectionChange = (selectedOption: any) => {
    const direction = selectedOption?.value;
    setSelectedDirection(direction); // Update state with selected direction
    if (selectedField && direction) {
      onSortChange(selectedField, direction); // Trigger sort with current field and new direction
    }
  };

  return (
    <div className="gallery-controls controls">
      <div className="form-group group">
        <label htmlFor="sort-field" className="label">
          Sort Field
        </label>
        <Select
          options={fieldOptions}
          inputId="sort-field"
          className="input"
          onChange={handleSortFieldChange}
          value={fieldOptions.find(option => option.value === selectedField)}
        />
      </div>
      <div className="form-group group">
        <label htmlFor="sort-direction" className="label">
          Sort Direction
        </label>
        <Select
          options={directionOptions}
          inputId="sort-direction"
          className="input"
          onChange={handleSortDirectionChange}
          value={directionOptions.find(option => option.value === selectedDirection)}
        />
      </div>
    </div>
  );
};

export default Controls;
