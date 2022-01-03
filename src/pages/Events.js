import React, { Component } from "react";
import "./events.css";
import Modals from "../components/Modals/Modals";
import Backdrop from "../components/backdrop/backdrop";
import AuthContext from "../context/auth-context";
class EventsPage extends Component {
  state = {
    createEvent: false,
    events: [],
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  createEventHandler = () => {
    this.setState({ createEvent: true });
  };

  submitEventHandler = () => {
    this.setState({ createEvent: false });
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }
    const requestBody = {
      query: `
      mutation {
        createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
          _id
          title
          description
          date
          price
          creator {
            _id
            email
          }
        }
      }
    `,
    };
    const token = this.context.token;

    fetch(process.env.REACT_APP_BASE_URL, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        this.fetchEvents();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  cancelEventHandler = () => {
    this.setState({ createEvent: false });
  };
  fetchEvents() {
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `,
    };

    fetch(process.env.REACT_APP_BASE_URL, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const events = resData.data.events;
        this.setState({ events: events });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const eventList = this.state.events.map((event) => {
      return (
        <li className="events-listitem" key={event._id}>
          {event.title}
        </li>
      );
    });
    return (
      <React.Fragment>
        {this.state.createEvent && <Backdrop />}
        {this.state.createEvent && (
          <Modals
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.cancelEventHandler}
            onConfirm={this.submitEventHandler}
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  step="any"
                  ref={this.priceElRef}
                />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  ref={this.descriptionElRef}
                />
              </div>
            </form>
          </Modals>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events</p>
            <button className="btn" onClick={this.createEventHandler}>
              Create Event
            </button>
          </div>
        )}
        <ul className="events-list">{eventList}</ul>
      </React.Fragment>
    );
  }
}

export default EventsPage;
