import React from "react";
import ValidationError from "../ValidationError/ValidationError";
import config from "../config.js";
import ApiContext from "../ApiContext";

export default class AddFolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      folderName: "",
      touched: false
    };
  }

  static contextType = ApiContext;

  handleSubmit(event) {
    event.preventDefault();
    const folder = { name: this.state.folderName };

    const url = `${config.API_ENDPOINT}/folders`;
    const options = {
      method: "POST",
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
        return res.json();
      })
      .then(data => {
        this.context.addFolder(data);
        this.setState({ folderName: "", touched: false });
      });

    this.props.history.push("/");
  }

  updateName(name) {
    this.setState({ folderName: name, touched: true });
  }

  validateName() {
    const folderName = this.state.folderName.trim();
    if (folderName.length === 0) {
      return "Folder name cannot be empty";
    } else {
      return null;
    }
  }

  render() {
    return (
      <form>
        <h2>Add Folder</h2>
        <label>Folder name:</label>
        <input
          type="text"
          name="name"
          placeholder="Name your folder"
          defaultValue="New folder"
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
