import React from "react";
import ApiContext from "../ApiContext";
import config from "../config";
import ValidationError from "../ValidationError/ValidationError";

export default class AddNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: { value: "", touched: false },
      content: { value: "", touched: false },
      folder: { value: "", touched: false }
    };
  }

  static contextType = ApiContext;

  handleSubmit(event) {
    event.preventDefault();
    const note = {
      name: this.state.name.value,
      content: this.state.content.value,
      folderId: this.state.folder.value
    };
    const url = `${config.API_ENDPOINT}/notes`;
    const options = {
      method: "POST",
      body: JSON.stringify(note),
      headers: {
        "Content-Type": "application/json"
      }
    };

    fetch(url, options)
      .then(res => {
        if (!res.ok) {
          throw new Error("Something went wrong");
        }
        console.log(res.json());
      })
      .then(data => {
        this.context.addNote(note);
        this.setState({
          name: { value: "", touched: false },
          content: { value: "", touched: false },
          folder: { value: "", touched: false }
        });
      });
  }

  updateName(name) {
    this.setState({ name: name, touched: false });
  }

  updateContent(content) {
    this.setState({ content: content, touched: false });
  }

  updateFolder(folder) {
    this.setState({ folder: folder, touched: false });
  }

  validateName() {
    console.log(this.state.name.value);
    // const name = this.state.name.value.trim();
    // if (name.length === 0) {
    //   return "Name is required";
    // }
  }

  render() {
    const { folders } = this.context;
    const folderNames = folders.map(name => {
      return <option id={name.id}>{name.id}</option>;
    });
    return (
      <form>
        <h2>Add Note</h2>
        <label>Note Name:</label>
        <input type="text" onChange={e => this.updateName(e.target.value)} />
        {this.state.name.touched && (
          <ValidationError message={this.validateName()} />
        )}
        <label>Content:</label>
        <input
          type="textarea"
          onChange={e => this.updateContent(e.target.value)}
        />
        <label>Folder:</label>
        <select onChange={e => this.updateFolder(e.target.value)}>
          <option>Select a folder</option>
          {folderNames}
        </select>
        <button type="reset">Reset</button>
        <button
          type="submit"
          onClick={e => this.handleSubmit(e)}
          disabled={this.validateName()}
        >
          Save
        </button>
      </form>
    );
  }
}
