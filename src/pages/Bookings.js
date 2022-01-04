import React, { Component } from "react";
import BookingList from "../components/Bookings/BookingList/BookingList";
import AuthContext from "../context/auth-context";

class BookingsPage extends Component {
  state = {
    isLoding: false,
    bookings: [],
    selectedEvent: null,
  };
  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBooking();
  }

  fetchBooking = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query{
            bookings{
              createdAt
              updatedAt
              _id
              event{
                _id  
                title
                price
                date
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
        Authorization: "Bearer " + this.context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const bookings = resData.data.bookings;
        this.setState({ bookings: bookings, isLoading: false });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  };
  showDeletelHandler = (bookingId) => {
    this.setState({ isLoading: true });
    console.log(bookingId);
    const requestBody = {
      query: `
          mutation {
            cancelBooking(bookingId: "${bookingId}") {
            _id
             title
            }
          }
        `,
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.context.token,
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
          const updatedBookings = prevState.bookings.filter((booking) => {
            return booking._id !== bookingId;
          });
          return { bookings: updatedBookings, isLoading: false };
        });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
      });
  };
  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <p>This is Loading ...</p>
        ) : (
          <BookingList
            events={this.state.bookings}
            authUserId={this.context.userid}
            onViewDelete={this.showDeletelHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

export default BookingsPage;
