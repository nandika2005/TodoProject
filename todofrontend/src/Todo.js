import { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "https://todoproject-427l.onrender.com/todos";

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      setError("Failed to load todos");
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!title.trim() || !description.trim()) {
      return setError("Title and description required");
    }
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error("Failed to add todo");
      const newTodo = await res.json();
      setTodos([...todos, newTodo]);
      setTitle("");
      setDescription("");
      setMessage("Todo added successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setError("Failed to add todo");
    }
  };

  const handleEdit = (todo) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  const handleUpdate = async () => {
    setError("");
    if (!editTitle.trim() || !editDescription.trim()) {
      return setError("Title and description required");
    }
    try {
      const res = await fetch(`${apiUrl}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      });
      if (!res.ok) throw new Error("Failed to update todo");
      const updatedTodo = await res.json();
      setTodos(todos.map((t) => (t._id === editId ? updatedTodo : t)));
      setEditId(null);
      setMessage("Todo updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setError("Failed to update todo");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch {
      setError("Failed to delete todo");
    }
  };

  return (
    <div style={{ margin: "0 auto", maxWidth: "600px", padding: "20px" }}>
      <h1 className="text-center">TODO APP</h1>
      {message && <p className="text-success">{message}</p>}
      {error && <p className="text-danger">{error}</p>}

      <div className="d-flex gap-2 mb-3">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control"
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control"
        />
        <button className="btn btn-primary" onClick={handleSubmit}>
          Add
        </button>
      </div>

      <ul className="list-group">
        {todos.map((todo) => (
          <li key={todo._id} className="list-group-item d-flex justify-content-between">
            {editId === todo._id ? (
              <div className="d-flex gap-2">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="form-control"
                />
                <input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="form-control"
                />
                <button className="btn btn-success" onClick={handleUpdate}>
                  Save
                </button>
                <button className="btn btn-secondary" onClick={() => setEditId(null)}>
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span>{todo.title}: {todo.description}</span>
                <div>
                  <button className="btn btn-warning" onClick={() => handleEdit(todo)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(todo._id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
