import React from "react";
import ApiContext from "../ApiContext";
import config from "../config";
import ValidationError from "../ValidationError/ValidationError";

export default class EditNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: { value: "", touched: false },
      content: { value: "", touched: false },
      folder: { value: "", touched: false },
      id: null
    };
  }

  static contextType = ApiContext;

  componentDidMount() {
    const noteId = this.props.match.params.noteId;
    fetch(`${config.API_ENDPOINT}/notes/${noteId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Something went wrong");
        }
        return res.json();
      })
      .then(data => {
        this.setState({
          title: { value: data.title },
          content: { value: data.content },
          folder: { value: data.folder },
          id: data.id
        });
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    let date = new Date();
    this.setState({ modified: date });
    const note = {
      title: this.state.title.value,
      content: this.state.content.value,
      folder: this.state.folder.value
    };

    const noteId = this.props.match.params.noteId;
    const url = `${config.API_ENDPOINT}/notes/${noteId}`;
    const options = {
      method: "PATCH",
      body: JSON.stringify(note),
      headers: {
        "Content-Type": "application/json"
      }
    };
    this.context.editNote(options.body, this.state.id);
    fetch(url, options)
      .then(res => {
        if (!res.ok) {
          throw new Error("Something went wrong");
        }
      })
      .then(data => {
        this.setState({
          title: { value: "", touched: false },
          content: { value: "", touched: false },
          folder: { value: "", touched: false }
        });
        this.props.history.push("/");
      });
  }

  updateName(name) {
    this.setState({ title: { value: name, touched: true } });
  }

  updateContent(content) {
    this.setState({ content: { value: content, touched: true } });
  }

  updateFolder(folder) {
    this.setState({ folder: { value: folder, touched: true } });
  }

  validateName() {
    const name = this.state.title.value.trim();
    if (name.length === 0) {
      return "Name is required";
    }
  }

  render() {
    const { folders } = this.context;
    const folderNames = folders.map(name => {
      return <option key={name.id}>{name.id}</option>;
    });
    return (
      <form>
        <h2>Edit Note</h2>
        <label>Note Name:</label>
        <input
          type="text"
          value={this.state.title.value}
          onChange={e => this.updateName(e.target.value)}
        />
        {this.state.title.touched && (
          <ValidationError message={this.validateName()} />
        )}
        <label>Content:</label>
        <input
          type="textarea"
          value={this.state.content.value}
          onChange={e => this.updateContent(e.target.value)}
        />
        <label>Folder:</label>
        <select
          value={this.state.folder.value}
          onChange={e => this.updateFolder(e.target.value)}
        >
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
