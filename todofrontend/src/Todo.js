import { useEffect, useState } from "react";
export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const apiUrl = "https://todoproject-427l.onrender.com";

  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos([...todos, { title, description }]);
            setMessage("Item added successfully");
            setTimeout(() => {
              setMessage("");
            }, 4000);
          } else {
            setError("Unable to create Todo item");
          }
        })
        .catch(() => {
          setError("Unable to create Todo item");
        });
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
      });
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = () => {
    setError("");
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiUrl + "/todos/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then((res) => {
          if (res.ok) {
            const updatedTodos = todos.map((item) => {
              if (item._id === editId) {
                item.title = editTitle;
                item.description = editDescription;
              }
              return item;
            });
            setTodos(updatedTodos);
            setMessage("Item updated successfully");
            setTimeout(() => {
              setMessage("");
            }, 4000);
            setEditId(-1);
          } else {
            setError("Unable to update Todo item");
          }
        })
        .catch(() => {
          setError("Unable to update Todo item");
        });
    }
  };

  const handleEditCancel = () => {
    setEditId(-1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure want to delete")) {
      fetch(apiUrl + "/todos/" + id, {
        method: "DELETE",
      }).then(() => {
        const updatedTodos = todos.filter((item) => item._id !== id);
        setTodos(updatedTodos);
      });
    }
  };

  return (
    <div style={{ margin: "0 auto", maxWidth: "800px", padding: "20px" }}>
      <div className="bg-success text-light p-3 mb-4 text-center rounded">
        <h1>TODO APP</h1>
      </div>
      <div className="mb-4">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2 mb-3">
          <input
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="form-control"
            type="text"
          />
          <input
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="form-control"
            type="text"
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>
      <div>
        <h3>Tasks</h3>
        <ul className="list-group">
          {todos.map((item) => (
            <li
              key={item._id}
              className="list-group-item bg-info d-flex justify-content-between align-items-center mb-3 rounded"
              style={{ padding: "15px" }}
            >
              <div className="d-flex flex-column">
                {editId === -1 || editId !== item._id ? (
                  <>
                    <span className="fw-bold">{item.title}</span>
                    <span>{item.description}</span>
                  </>
                ) : (
                  <div className="form-group d-flex gap-2">
                    <input
                      placeholder="Title"
                      onChange={(e) => setEditTitle(e.target.value)}
                      value={editTitle}
                      className="form-control"
                      type="text"
                    />
                    <input
                      placeholder="Description"
                      onChange={(e) => setEditDescription(e.target.value)}
                      value={editDescription}
                      className="form-control"
                      type="text"
                    />
                  </div>
                )}
              </div>
              <div className="d-flex gap-2">
                {editId === -1 || editId !== item._id ? (
                  <>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-success" onClick={handleUpdate}>
                      Update
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
