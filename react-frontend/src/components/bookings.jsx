import React, { Component } from "react";
import AuthContext from "../context/authContext";
import Spinner from "./Spinner/spinner";
import BookingList from "./Booking/bookingList";

class Bookings extends Component {
  state = {
    isLoading: false,
    bookings: [],
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  handleCancelBooking = async (bookingId) => {
    this.setState({ isLoading: true });

    const requestBody = {
      query: `
        mutation{
          cancelBooking(bookingId: "${bookingId}"){
            _id
            title
          }
        }
      `,
    };

    try {
      const res = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.context.token,
        },
      });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed");
      }
      const { data } = await res.json();
      this.setState((prevState) => {
        const bookings = prevState.bookings.filter(
          (booking) => booking._id !== bookingId
        );
        return { bookings, isLoading: false };
      });
      // console.log(events);
    } catch (error) {
      this.setState({ isLoading: false });
      throw error;
    }
  };

  fetchBookings = async () => {
    this.setState({ isLoading: true });

    const requestBody = {
      query: `
        {
          bookings{
            _id
            createdAt
            event{
              _id
              title
              date
            }
          }
        }
      `,
    };

    try {
      const res = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.context.token,
        },
      });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed");
      }
      const {
        data: { bookings },
      } = await res.json();
      this.setState({ bookings, isLoading: false });
      // console.log(events);
    } catch (error) {
      this.setState({ isLoading: false });
      throw error;
    }
  };

  render() {
    return (
      <>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <BookingList
            bookings={this.state.bookings}
            onCancelBooking={this.handleCancelBooking}
          />
        )}
      </>
    );
  }
}

export default Bookings;
