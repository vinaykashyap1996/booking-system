import React from "react";
import "./EventItem.css";

const EventItem = (props) => {
  return (
    <li className="events-listitem" key={props.eventId}>
      <div>
        <h1>{props.title}</h1>
        <h2>
          ${props.price} - {new Date(props.eventDate).toLocaleDateString()}
        </h2>
      </div>
      <div>
        {props.userId === props.creatorId ? (
          <p>Your the owner of this Event</p>
        ) : (
          <button
            className="btn"
            onClick={props.onDetail.bind(this, props.eventId)}
          >
            View details
          </button>
        )}
      </div>
    </li>
  );
};

export default EventItem;
