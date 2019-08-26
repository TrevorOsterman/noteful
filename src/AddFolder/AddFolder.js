import React from "react";
import ValidationError from "../ValidationError/ValidationError";

export default class AddFolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      folderName: "",
      touched: false
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    const name = this.state.folderName;
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
          onClick={this.handleSubmit}
          disabled={this.validateName()}
        >
          Save
        </button>
      </form>
    );
  }
}
