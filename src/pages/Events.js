import React, { Component } from "react";
import "./events.css";
import Loader from "react-loader-spinner";
import Modals from "../components/Modals/Modals";
import Backdrop from "../components/backdrop/backdrop";
import AuthContext from "../context/auth-context";
import EventList from "../components/Events/EventsList/EventList";
class EventsPage extends Component {
  state = {
    createEvent: false,
    events: [],
    isLoading: false,
    selectedEvent: null,
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
        this.setState((prevState) => {
          const updatedEvents = [...prevState.events];
          updatedEvents.push({
            _id: resData.data.createEvent._id,
            title: resData.data.createEvent.title,
            description: resData.data.createEvent.description,
            date: resData.data.createEvent.date,
            price: resData.data.createEvent.price,
            creator: {
              _id: this.context.userId,
            },
          });
          return { events: updatedEvents };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  cancelEventHandler = () => {
    this.setState({ createEvent: false, selectedEvent: null });
  };
  showDetailHandler = (eventId) => {
    this.setState((prevState) => {
      const selectedEvent = prevState.events.find((e) => e._id === eventId);
      return { selectedEvent: selectedEvent };
    });
  };

  bookEventHandler = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }
    const requestBody = {
      query: `
          mutation {
            createBooking(eventId:"${this.state.selectedEvent._id}") {
              _id
              createdAt
              updatedAt
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
        this.setState({ selectedEvent: null });
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  fetchEvents() {
    this.setState({ isLoading: true });
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
        this.setState({ events: events, isLoading: false });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  }

  render() {
    console.log(this.context);
    return (
      <React.Fragment>
        {(this.state.createEvent || this.state.selectedEvent) && <Backdrop />}
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
        {this.state.selectedEvent && (
          <Modals
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm
            onCancel={this.cancelEventHandler}
            onConfirm={this.bookEventHandler}
            confirmText={this.context.token ? "Book" : "Confirm"}
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>
              ${this.state.selectedEvent.price} -{" "}
              {new Date(this.state.selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{this.state.selectedEvent.description}</p>
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
        {this.state.isLoading ? (
          <div className="spinner">
            <Loader type="Rings" color="#00BFFF" height={100} width={100} />,
          </div>
        ) : (
          <EventList
            events={this.state.events}
            authUserId={this.context.userid}
            onViewDetail={this.showDetailHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

export default EventsPage;
