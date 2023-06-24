import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const RecordsPage = ({isLoggedIn, handleLogout }) => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [pageNumber, setPageNumber] = useState(0); 
  const [pageSize] = useState(10); 
  const [totalElements, setPageTotalElements] = useState(1); 
  const [filters, setFilters] = useState({}); 
  const navigate = useNavigate();


  useEffect(() => {
    fetchData(pageNumber, pageSize);
  }, [pageNumber, pageSize]);

  const handleNextPage = () => {
    setPageNumber(pageNumber + 1);
  };

  const handlePreviousPage = () => {
    if (pageNumber > 0) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleJumpToPage = (page) => {
    setPageNumber(page);
  };

  const headers = [
    { field: 'operationId', label: 'Operation ID' },
    { field: 'userId', label: 'User ID' },
    { field: 'amount', label: 'Amount' },
    { field: 'userBalance', label: 'User Balance' },
    { field: 'operationResponse', label: 'Operation Response' },
    { field: 'operationDate', label: 'Operation Date' },
  ];

  const getToken = () => {
    const token =sessionStorage.getItem('token');
    console.log(token);
    if (!token) {
      navigate('/'); 
    }
    return token;
  };

  const fetchData = async (pageNumber, pageSize) => {
    const url = `http://localhost:8080/api/v1/record?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    const token = getToken();

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecords(data.result.content);
        setPageTotalElements(data.result.totalElements);
      } else {
        if(response.status == 403){
          console.log('Error fetching records');
          navigate('/'); 
        }else{ console.log('else');
    }
      }
    } catch (error) {
      console.log('Error fetching records in catch:', error);
    }
  };


  
 const handleSort = (column) => {
  if (column === sortColumn) {
    setSortDirection((prevSortDirection) =>
      prevSortDirection === 'asc' ? 'desc' : 'asc'
    );
  } else {
    setSortColumn(column);
    setSortDirection('asc');
  }
};

  const handleSearch = (e, column) => {
    const value = e.target.value;
  
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column]: value,
    }));
  };

  const handleDelete = async (recordId) => {
    try {
      const token = getToken();
      const url = `http://localhost:8080/api/v1/record/?recordId=${recordId}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Record deleted successfully');
        fetchData(pageNumber, pageSize);
      } else {
        console.log('Error deleting record');
      }
    } catch (error) {
      console.log('Error deleting record:', error);
    }
  };

  const filteredRecords = records.filter((record) =>
  Object.entries(filters).every(([column, searchTerm]) =>
    record[column]
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )
);

  const sortedRecords = filteredRecords.sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
  
      // Check if the values are numbers
      const isNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);
  
      if (isNumeric(aValue) && isNumeric(bValue)) {
        if (sortDirection === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      } else {
        // String comparison
        if (sortDirection === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }
    }
    return 0;
  });
  const handleGoToCalculator = () => {
    navigate('/calculator');
  };
  const handleLogoutClick = () => {
    handleLogout(); 
    navigate('/'); 
  };

  return (
    <div>
      <h2>Records</h2>
      <button onClick={handleGoToCalculator}>Go to Calculator</button>
      <button onClick={handleLogoutClick}>Logout</button>
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
          <th key={header.field}>
          <div>
            <span>{header.label}</span>
            {sortColumn === header.field && sortDirection === 'asc' && '▲'}
            {sortColumn === header.field && sortDirection === 'desc' && '▼'}
          </div>
          <div>
            <button onClick={() => handleSort(header.field)}>Sort Asc</button>
            <button onClick={() => handleSort(header.field)}>Sort Desc</button>
          </div>
          <input
    type="text"
    value={filters[header.field] || ''}
    onChange={(e) => handleSearch(e, header.field)}
  />
        </th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedRecords.map((record) => (
            <tr key={record.id}>
              {headers.map((header) => (
                <td key={header.field}>{record[header.field]}</td>
              ))}
              <td>
                <button onClick={() => handleDelete(record.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={handlePreviousPage}>Previous Page</button>
        {/* Render Next Page button only if there are more records */}
        {sortedRecords.length > (pageNumber + 1) * pageSize && (
          <button onClick={handleNextPage}>Next Page</button>
        )}
        {/* Render buttons for page navigation */}
        {Array.from(
          { length: Math.ceil(totalElements / pageSize) },
          (_, index) => (
            <button key={index} onClick={() => handleJumpToPage(index)}>
              Page {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default RecordsPage;
