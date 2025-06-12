import { useState,useEffect} from "react";
// const API_End = "http://weizproject.ddns.net:5000"
const API_End = "http://localhost:5000"
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

  const handleDelete = async (idx,id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    console.log("Delete:", editData);

    const updatedRows = [...rows];
    updatedRows.splice(idx, 1);  // ⬅️ remove the row
    const token = localStorage.getItem('track_job_token');

    const requestOptions = {
      method: 'Delete',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ "job_id": id }),
    };
    await fetch(`${API_End}/user/job/delete`, requestOptions);
    setRows(updatedRows);
  };
  
  const handleHide = async (idx,id) => {
    console.log("Hide:", editData);
    // Simulate API call

    const updatedRows = [...rows];
    updatedRows.splice(idx, 1);  // ⬅️ remove the row
    const token = localStorage.getItem('track_job_token');

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ "job_id": id }),
    };
    await fetch(`${API_End}/user/job/hide`, requestOptions);

    setRows(updatedRows);
  };


const handlePdf = async (id) => {
  const token = localStorage.getItem('track_job_token');
  console.log("id: ",id);
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({"id":id }),
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

useEffect(() => {
  setRows(data); // when props.data changes, update internal state
}, [data]);


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
                  <button onClick={() => handlePdf(row.id)}
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
                <button onClick={() => handleDelete(idx,row.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
                <button onClick={() => handleHide(idx,row.id)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                  Hide
                </button>

            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EditableTable;
