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
    let date = new Date();
    console.log(date);
    this.setState({ modified: date });
    const note = {
      title: this.state.name.value,
      content: this.state.content.value,
      folder: this.state.folder.value
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
        return res.json();
      })
      .then(data => {
        this.context.addNote(data);
        this.setState({
          name: { value: "", touched: false },
          content: { value: "", touched: false },
          folder: { value: "", touched: false }
        });
        this.props.history.push("/");
      });
  }

  updateName(name) {
    this.setState({ name: { value: name, touched: true } });
  }

  updateContent(content) {
    this.setState({ content: { value: content, touched: true } });
  }

  updateFolder(folder) {
    const folderId = this.context.folders.find(fold => fold.title === folder);
    console.log(folderId);
    this.setState({ folder: { value: folderId.id, touched: true } });
  }

  validateName() {
    const name = this.state.name.value.trim();
    if (name.length === 0) {
      return "Name is required";
    }
  }

  validateFolder() {
    if (!this.state.folder.touched) {
      return "Choose a folder";
    }
  }

  render() {
    const { folders } = this.context;
    const folderNames = folders.map(name => {
      return <option key={name.id}>{name.title}</option>;
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
        <select
          disabled={this.validateName()}
          onChange={e => this.updateFolder(e.target.value)}
        >
          <option>Select a folder</option>
          {folderNames}
        </select>
        <button type="reset">Reset</button>
        <button
          type="submit"
          onClick={e => this.handleSubmit(e)}
          disabled={this.validateFolder()}
        >
          Save
        </button>
      </form>
    );
  }
}
