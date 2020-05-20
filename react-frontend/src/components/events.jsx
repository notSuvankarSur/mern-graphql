import React, { Component, createRef } from "react";
import "./events.css";
import Modal from "./Modal/modal";
import Backdrop from "./Backdrop/backdrop";
import AuthContext from "../context/authContext";
import EventList from "./EventList/eventList";
import Spinner from "./Spinner/spinner";

class Events extends Component {
  constructor(props) {
    super(props);
    this.titleRef = createRef();
    this.priceRef = createRef();
    this.dateRef = createRef();
    this.descriptionRef = createRef();
  }

  static contextType = AuthContext;

  state = {
    createClicked: false,
    events: [],
    isLoading: false,
    selectedEvent: null,
  };

  isActive = true;

  componentDidMount() {
    this.fetchEvents();
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  handleCreateClicked = () => {
    this.setState({ createClicked: true });
  };

  handleConfirm = async () => {
    this.setState({ createClicked: false });

    const title = this.titleRef.current.value;
    const price = +this.priceRef.current.value;
    const date = this.dateRef.current.value;
    const description = this.descriptionRef.current.value;

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
          mutation{
            createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}){
              _id
              title
              description
              price
              date
            }
          }
        `,
    };

    const token = this.context.token;

    try {
      const res = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const { data } = await res.json();
      // console.log(data);
      this.setState((prevState) => {
        const events = [...prevState.events];
        events.push({
          _id: data.createEvent._id,
          title: data.createEvent.title,
          description: data.createEvent.description,
          price: data.createEvent.price,
          date: data.createEvent.date,
          createdBy: {
            _id: this.context.userId,
          },
        });
        return { events: events };
      });
    } catch (error) {
      throw error;
    }
  };
  handleOnViewDetails = (eventId) => {
    this.setState((prevState) => {
      const event = prevState.events.find((e) => e._id === eventId);
      return { selectedEvent: event };
    });
  };

  handleCancel = () => {
    this.setState({ createClicked: false, selectedEvent: null });
  };

  handleBookEvent = async () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }

    const requestBody = {
      query: `
      mutation{
        createBooking(eventId: "${this.state.selectedEvent._id}"){
          _id
          createdAt
          updatedAt
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
      const result = await res.json();
      // this.setState({ events, isLoading: false });
      console.log(result);
      this.setState({ selectedEvent: null });
    } catch (error) {
      // this.setState({ isLoading: false });
      throw error;
    }
  };

  fetchEvents = async () => {
    this.setState({ isLoading: true });

    const requestBody = {
      query: `
          {
            events{
              _id
              title
              description
              price
              date
              createdBy{
                _id
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
        },
      });
      const {
        data: { events },
      } = await res.json();
      if (this.isActive) this.setState({ events, isLoading: false });
      // console.log(events);
    } catch (error) {
      if (this.isActive) this.setState({ isLoading: false });
      throw error;
    }
  };

  render() {
    return (
      <>
        {(this.state.createClicked || this.state.selectedEvent) && <Backdrop />}
        {this.state.createClicked && (
          <Modal
            title="Add event"
            canConfirm
            canCancel
            onConfirm={this.handleConfirm}
            onCancel={this.handleCancel}
            confirmText="Confirm"
          >
            <form action="">
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="date" id="date" ref={this.dateRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea id="description" rows="4" ref={this.descriptionRef} />
              </div>
            </form>
          </Modal>
        )}
        {this.state.selectedEvent && (
          <Modal
            title={this.state.selectedEvent.title}
            canConfirm
            canCancel
            onConfirm={() => this.handleBookEvent()}
            onCancel={this.handleCancel}
            confirmText={this.context.token ? "Book" : "Confirm"}
          >
            <h1>{this.state.selectedEvent.description}</h1>
            <h3>
              ${this.state.selectedEvent.price} -{" "}
              {new Date(this.state.selectedEvent.date).toLocaleDateString()}
            </h3>
          </Modal>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own events here!</p>
            <button className="btn" onClick={this.handleCreateClicked}>
              Create Event
            </button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            events={this.state.events}
            userId={this.context.userId}
            onViewDetails={this.handleOnViewDetails}
          />
        )}
      </>
    );
  }
}

export default Events;
