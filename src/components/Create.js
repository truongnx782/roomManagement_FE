import React, { useState, useEffect } from 'react';
import ApiService from '../ApiPhongService';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

function CreateComponent() {
  const [formData, setFormData] = useState({});
  const [typeOptions, setTypeOptions] = useState([]);

  useEffect(() => {
    fetchTypeOptions();
  }, []);

  const fetchTypeOptions = async () => {
    try {
      const types = await ApiService.getTypeOptions();
      setTypeOptions(types);
    } catch (error) {
      console.error('Error fetching type options:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ApiService.createData(formData);
      setFormData({});
      window.location.href = 'http://localhost:3000/table';
    } catch (error) {
      console.error('Error creating data:', error);
    }
  };

  return (
    <div>
      <h2>Create New Data</h2>
      <form onSubmit={handleSubmit}>
        <label>
          ID:
          <InputText type="text" name="id" value={formData.id || ''} onChange={handleChange} />
        </label>
        <br />
        <label>
          Name:
          <InputText type="text" name="name" value={formData.name || ''} onChange={handleChange} />
        </label>
        <br />
        <label>
          Type:
          <Dropdown 
            name="typeId" 
            value={formData.typeId || null} 
            options={typeOptions.map(option => ({label: option.name, value: option.id}))} 
            onChange={handleChange} 
            placeholder="Select a Type" 
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreateComponent;
