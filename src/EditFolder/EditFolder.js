import React from "react";
import ValidationError from "../ValidationError/ValidationError";
import config from "../config.js";
import ApiContext from "../ApiContext";

export default class EditFolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      id: null,
      touched: false
    };
  }

  static contextType = ApiContext;

  componentDidMount() {
    const folderId = this.props.match.params.folderId;
    fetch(`${config.API_ENDPOINT}/folders/${folderId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Something went wrong");
        }
        return res.json();
      })
      .then(data => {
        this.setState({
          title: data.title,
          id: data.id
        });
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    const folderId = this.props.match.params.folderId;
    const folder = { title: this.state.title, id: this.state.id };
    const url = `${config.API_ENDPOINT}/folders/${folderId}`;
    const options = {
      method: "PATCH",
      body: JSON.stringify(folder),
      headers: {
        "Content-Type": "application/json"
      }
    };

    fetch(url, options)
      .then(res => {
        if (!res.ok) {
          throw new Error("Something went wrong");
        }
      })
      .then(data => {
        this.context.editFolder(folder);
        this.setState({ title: "", id: null, touched: false });
        this.props.history.push("/");
      });
  }

  updateName(name) {
    this.setState({ title: name, touched: true });
  }

  validateName() {
    const folderName = this.state.title.trim();
    if (folderName.length === 0) {
      return "Folder name cannot be empty";
    } else {
      return null;
    }
  }

  render() {
    return (
      <form>
        <h2>Edit Folder</h2>
        <label>Folder name:</label>
        <input
          type="text"
          name="name"
          value={this.state.title}
          onChange={e => this.updateName(e.target.value)}
        />
        {this.state.touched && (
          <ValidationError message={this.validateName()} />
        )}
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
