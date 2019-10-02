import React from "react";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CircleButton from "../CircleButton/CircleButton";
import ApiContext from "../ApiContext";
import { countNotesForFolder } from "../notes-helpers";
import "./NoteListNav.css";
import config from "../config";

export default class NoteListNav extends React.Component {
  static contextType = ApiContext;

  handleEditFolder(id) {
    this.props.history.push(`/edit-folder/${id}`);
  }

  handleDeleteFolder(id) {
    const folderId = id;
    fetch(`${config.API_ENDPOINT}/folders/${folderId}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) return res.json();
      })
      .then(res => this.context.handleDeteleFolder);
  }

  render() {
    const { folders = [], notes = [] } = this.context;
    return (
      <div className="NoteListNav">
        <ul className="NoteListNav__list">
          {folders.map(folder => (
            <li key={folder.id}>
              <NavLink
                className="NoteListNav__folder-link"
                to={`/folder/${folder.id}`}
              >
                <span className="NoteListNav__num-notes">
                  {countNotesForFolder(notes, folder.id)}
                </span>
                {folder.title}
              </NavLink>
              <div className="NavButtonWrapper">
                <button
                  className="NoteListNav_button"
                  onClick={() => this.handleEditFolder(folder.id)}
                >
                  edit
                </button>
                <button
                  className="NoteListNav_button"
                  onClick={() => this.handleDeleteFolder(folder.id)}
                >
                  delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="NoteListNav__button-wrapper">
          <CircleButton
            tag={Link}
            to="/add-folder"
            type="button"
            className="NoteListNav__add-folder-button"
          >
            <FontAwesomeIcon icon="plus" />
            <br />
            Folder
          </CircleButton>
        </div>
      </div>
    );
  }
}
