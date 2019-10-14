import React, { useState } from "react";
import { axiosWithAuth } from "./axiosWithAuth";
import { props } from "bluebird";

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [addColor, setAddColor] = useState(initialColor);

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const renewColors = () => {
    axiosWithAuth()
      .get("colors")
      .then(res => {
        updateColors(res.data);
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  };

  const saveEdit = e => {
    e.preventDefault();
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?
    axiosWithAuth()
      .put(`colors/${colorToEdit.id}`, colorToEdit)
      .then(res => {
        const newColors = colors.map(cv => {
          if (cv.id == colorToEdit.id) {
            return colorToEdit;
          } else {
            return cv;
          }
        });
        updateColors(newColors);
        setEditing(false);
        setColorToEdit({ initialColor });
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  };

  const deleteColor = color => {
    // make a delete request to delete this color
    axiosWithAuth()
      .delete(`colors/${color.id}`)
      .then(res => {
        setColorToEdit(initialColor);
        setEditing(false);
        renewColors();
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  };

  const handleAddColor = e => {
    e.preventDefault();
    const newColor = {
      ...addColor,
      id: Date.now()
    };
    axiosWithAuth()
      .post("colors", newColor)
      .then(res => {
        renewColors();
        setAddColor(initialColor);
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  };

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={() => deleteColor(color)}>
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />
      <h1>Add a new color!</h1>
      <form onSubmit={handleAddColor}>
        <label htmlFor="color">Color Name:</label>
        <input
          type="text"
          name="color"
          value={addColor.color}
          onChange={e => setAddColor({ ...addColor, color: e.target.value })}
        />
        <label htmlFor="code">Color Code:</label>
        <input
          type="text"
          name="code"
          value={addColor.code.hex}
          onChange={e =>
            setAddColor({ ...addColor, code: { hex: e.target.value } })
          }
        />
        <button type="submit">Add Color!</button>
      </form>
    </div>
  );
};

export default ColorList;