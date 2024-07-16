import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../ApiPhongService';
import { Dropdown } from 'primereact/dropdown';

function UpdateComponent() {
    const [data, setData] = useState({});
    const { id } = useParams();
    const [typeOptions, setTypeOptions] = useState([]);


    useEffect(() => {
        fetchFormData(id);
        fetchTypeOptions();

    }, [id]);

    const fetchFormData = async (id) => {
        try {
            const fetchedData = await ApiService.viewUpdateData(id);
            setData(fetchedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    const fetchTypeOptions = async () => {
        try {
            const types = await ApiService.getTypeOptions();
            setTypeOptions(types);
        } catch (error) {
            console.error('Error fetching type options:', error);
        }
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ApiService.updateData(data.id, data);
            window.location.href = 'http://localhost:3000/table';
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };


    return (
        <div>
            <h2>Detail View</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    ID:
                    <input type="text" name="id" value={data.id || ''} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Name:
                    <input type="text" name="name" value={data.name || ''} onChange={handleChange} />
                </label>
                <br />
                <label>
                        Type:
                        <Dropdown
                            name="typeId"
                            value={data.typeId || null}
                            options={typeOptions.map(option => ({ label: option.name, value: option.id }))}
                            onChange={handleChange}
                            placeholder="Select a Type"
                        />
                    </label>
                <br />
                    
                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default UpdateComponent;
