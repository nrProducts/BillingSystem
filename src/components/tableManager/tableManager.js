import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TableManager = () => {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  const addTable = () => {
    const tableName = prompt('Enter table name:');
    if (tableName && tableName.trim() !== '') {
      const newTable = {
        id: Date.now().toString(),
        name: tableName.trim(),
      };
      setTables([...tables, newTable]);
    }
  };

  const removeTable = (id) => {
    setTables(tables.filter((table) => table.id !== id));
  };

  const goToBilling = (id) => {
    navigate(`/itemBilling/${id}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Restaurant Table Management</h2>
      <button onClick={addTable}>Add Table</button>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
        {tables.map((table) => (
          <div
            key={table.id}
            style={{
              margin: '10px',
              padding: '20px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              minWidth: '120px',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <div
              onClick={() => goToBilling(table.id)}
              style={{ cursor: 'pointer', fontWeight: 'bold' }}
            >
              {table.name}
            </div>
            <button
              onClick={() => removeTable(table.id)}
              style={{
                marginTop: '10px',
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableManager;
