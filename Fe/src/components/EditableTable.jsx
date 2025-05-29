import { useState } from "react";
const API_End = "http://weizproject.ddns.net:5000"
const EditableTable = ({ data }) => {
  const [rows, setRows] = useState(data);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});

const cols = [
  "company_name",
  "job_title",
  "location",
  "application_date",
  "status",
  "notes",
  "salary",
  "job_posting_url",
  "file_location",
];

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditData({ ...rows[index] });
  };

  const handleChange = (e, key) => {
    setEditData({ ...editData, [key]: e.target.value });
  };

    const handleSave = async () => {
    console.log("Saving:", editData);
    // Simulate API call

    const updatedRows = [...rows];
    updatedRows[editIndex] = editData;
    const token = localStorage.getItem('track_job_token');

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ "editData": editData }),
    };
    await fetch(`${API_End}/user/save`, requestOptions);

    setRows(updatedRows);
    setEditIndex(null);
  };


const handlePdf = async (file_path) => {
  const token = localStorage.getItem('track_job_token');

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({file_path }),
  };

  try {
    const response = await fetch(`${API_End}/user/pdf`, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url);

    // Optionally clean up the blob URL later
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (error) {
    console.error('Error fetching PDF:', error);
    alert('Unable to open PDF. See console for details.');
  }
  
};

  return (
    <table className="w-full table-auto border">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">Id</th>
          {cols.map((col) => (
            <th key={col} className="p-2 border">
              {col.replaceAll("_", " ")}
            </th>
          ))}
          <th className="p-2 border">Action</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={row.id} className="border-t">
            <td className="p-2 border">{row.id}</td>
            {cols.map((col) => (
              <td key={col} className="p-2 border">
                {col === "file_location" ? (
                  <button onClick={() => handlePdf(row.file_location)}
                    className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                    PDF
                  </button>

                ) : editIndex === idx ? (
                  <input
                    className="border px-2 py-1 w-full"
                    value={editData[col] !== undefined ? editData[col] : row[col]}
                    onChange={(e) => handleChange(e, col)}
                  />
                ) : col === "job_posting_url" ? (
                  <a href={row.job_posting_url} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                ) : col === "application_date" ? (
                row[col].slice(0, 10)
                ) : (
                  row[col]
                )}
              </td>
            ))}
            <td className="p-2 border">
              {editIndex === idx ? (
                <button onClick={handleSave} className="bg-green-500 text-white px-3 py-1 rounded">
                  Save
                </button>
              ) : (
                <button onClick={() => handleEdit(idx)} className="bg-blue-500 text-white px-3 py-1 rounded">
                  Modify
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EditableTable;
