import React from "react";
import "./modals.css";
const modal = (props) => (
  <div className="modal">
    <header className="modal-header">{props.title}</header>
    <section className="modal-content">{props.children}</section>
    <section className="modal-actions">
      {props.canConfirm && (
        <button className="btn" onClick={props.onConfirm}>
          Confirm
        </button>
      )}
      {props.canCancel && (
        <button className="btn" onClick={props.onCancel}>
          Cancel
        </button>
      )}
    </section>
  </div>
);

export default modal;
