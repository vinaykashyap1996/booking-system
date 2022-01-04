import React from "react";
import "./BookItem.css";

const BookItem = (props) => {
  return (
    <li className="book-listitem" key={props.bookingId}>
      <div>
        <h1>
          {props.title} - {new Date(props.eventDate).toLocaleDateString()}
        </h1>
      </div>
      <div>
        <button
          className="btn"
          onClick={props.onDelete.bind(this, props.bookingId)}
        >
          Cancel Booking
        </button>
      </div>
    </li>
  );
};

export default BookItem;
