import React from "react";
import "./EventList.css";
import EventItem from "./EventItem/EventItem";
const EventList = (props) => {
  const eventList = props.events.map((event) => {
    return (
      <EventItem
        key={event._id}
        eventId={event._id}
        title={event.title}
        description={event.description}
        price={event.price}
        eventDate={event.date}
        userId={event.authUserId}
        creatorId={event.creator._id}
        onDetail={props.onViewDetail}
      />
    );
  });
  return <ul className="events-list">{eventList}</ul>;
};

export default EventList;
