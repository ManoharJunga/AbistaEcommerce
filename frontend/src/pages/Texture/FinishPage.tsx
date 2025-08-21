import React, { useState, useEffect } from "react";
import axios from "axios";

interface Finish {
  _id: string;
  name: string;
}

const FinishPage: React.FC = () => {
  const [finishes, setFinishes] = useState<Finish[]>([]);
  const [newFinish, setNewFinish] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch finishes
  const fetchFinishes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/finishes");
      setFinishes(res.data);
    } catch (error) {
      console.error("Error fetching finishes:", error);
    }
  };

  useEffect(() => {
    fetchFinishes();
  }, []);

  // Add finish
  const addFinish = async () => {
    if (!newFinish.trim()) return;
    try {
      if (editId) {
        await axios.put(`http://localhost:8000/api/finishes/${editId}`, { name: newFinish });
        setEditId(null);
      } else {
        await axios.post("http://localhost:8000/api/finishes", { name: newFinish });
      }
      setNewFinish("");
      fetchFinishes();
    } catch (error) {
      console.error("Error saving finish:", error);
    }
  };

  // Edit finish
  const editFinish = (finish: Finish) => {
    setNewFinish(finish.name);
    setEditId(finish._id);
  };

  // Delete finish
  const deleteFinish = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/finishes/${id}`);
      fetchFinishes();
    } catch (error) {
      console.error("Error deleting finish:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Finishes</h2>
      <div>
        <input
          type="text"
          value={newFinish}
          onChange={(e) => setNewFinish(e.target.value)}
          placeholder="Enter finish name"
        />
        <button onClick={addFinish}>{editId ? "Update" : "Add"}</button>
      </div>

      <ul>
        {finishes.map((finish) => (
          <li key={finish._id}>
            {finish.name}
            <button onClick={() => editFinish(finish)}>Edit</button>
            <button onClick={() => deleteFinish(finish._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FinishPage;
