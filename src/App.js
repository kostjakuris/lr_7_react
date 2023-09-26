import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(list);
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState ({show: false, msg: "", type: ""});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, "danger", "please enter values");
    } else if (name  && isEditing) {
      const editItem = list.map((item) => {
        if (item.id === editID) {
          item.title = name;
        }
        return item;
      });
      setList(editItem);
      setEditID(null);
      setIsEditing(false);
      showAlert(true, "success", "item edited")
    } else {
      showAlert(true, "success", "task added to the list");
      const newItem = {
        id: new Date().getTime().toString(),
        title: name
      };
      setList([...list, newItem]) ;
      setName("");
    }
  }

  const showAlert = (show = false, type = "", msg = "") => {
    setTimeout(() => {
      setAlert({show, type, msg});
    }, 3000);
  }

  const clearList = () => {
    showAlert(true, "danger", "empty list");
    setList([]);
  }

  const removeItem = (id) => {
    setList(list.filter((task) => task.id !== id));
    showAlert(true, "danger", "item removed");
  }

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  }

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert}/>}
        <h3>TODO list</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g. pass the exam"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
      <div className="grocery-container">
        <List items={list} removeItem={removeItem} editItem={editItem}/>
        <button className="clear-btn" onClick={clearList}>Clear items</button>
      </div>
      )}
    </section>
  );
}

export default App;
