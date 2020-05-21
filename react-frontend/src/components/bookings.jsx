import React, { Component } from "react";
import AuthContext from "../context/authContext";
import Spinner from "./Spinner/spinner";
import BookingList from "./Booking/bookingList";
import BookingChart from "./Booking/bookingChart";
import "./bookings.css";

class Bookings extends Component {
  state = {
    isLoading: false,
    bookings: [],
    outputType: "list",
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  handleOutputType = (outputType) => {
    this.setState({ outputType });
  };

  handleCancelBooking = async (bookingId) => {
    this.setState({ isLoading: true });

    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!){
          cancelBooking(bookingId: $id){
            _id
            title
          }
        }
      `,
      variables: {
        id: bookingId,
      },
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
              price
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
          <>
            <div className="bookings-control">
              <button
                className={this.state.outputType === "list" ? "active" : ""}
                onClick={() => this.handleOutputType("list")}
              >
                List
              </button>
              <button
                className={this.state.outputType === "chart" ? "active" : ""}
                onClick={() => this.handleOutputType("chart")}
              >
                Chart
              </button>
            </div>
            <div>
              {this.state.outputType === "list" ? (
                <BookingList
                  bookings={this.state.bookings}
                  onCancelBooking={this.handleCancelBooking}
                />
              ) : (
                <BookingChart bookings={this.state.bookings} />
              )}
            </div>
          </>
        )}
      </>
    );
  }
}

export default Bookings;
