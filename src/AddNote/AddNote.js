import React from "react";
import ApiContext from "../ApiContext";
import config from "../config";

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
    const note = ({ name, content, folder }) =>
      ({ name, content, folder }(this.state));
    console.log(note);
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
        this.setState({
          name: { value: "", touched: false },
          content: { value: "", touched: false },
          folder: { value: "", touched: false }
        });
        this.context.handleNote(note);
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

  render() {
    const { folders } = this.context;
    console.log(folders);
    const folderNames = folders.map(name => {
      return <option id={name.id}>{name.name}</option>;
    });
    console.log(folderNames);
    return (
      <form>
        <h2>Add Note</h2>
        <label>Note Name:</label>
        <input type="text" onChange={e => this.updateName(e.target.value)} />
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
        <button type="submit" onClick={this.handleSubmit} disabled="">
          Save
        </button>
      </form>
    );
  }
}
