import React, { Component, createRef } from "react";
import "./events.css";
import Modal from "./Modal/modal";
import Backdrop from "./Backdrop/backdrop";
import AuthContext from "../context/authContext";

class Events extends Component {
  constructor(props) {
    super(props);
    this.titleRef = createRef();
    this.priceRef = createRef();
    this.dateRef = createRef();
    this.descriptionRef = createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  static contextType = AuthContext;

  state = {
    createClicked: false,
    events: [],
  };

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

    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
          mutation{
            createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}){
              _id
              title
              description
              price
              date
              createdBy{
                _id
                email
              }
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
      this.fetchEvents();
      console.log(data);
    } catch (error) {
      throw error;
    }
  };

  handleCancel = () => {
    this.setState({ createClicked: false });
  };

  fetchEvents = async () => {
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
                email
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
      this.setState({ events });
      console.log(events);
    } catch (error) {
      throw error;
    }
  };

  render() {
    return (
      <>
        {this.state.createClicked && <Backdrop />}
        {this.state.createClicked && (
          <Modal
            title="Add event"
            canConfirm
            canCancel
            onConfirm={this.handleConfirm}
            onCancel={this.handleCancel}
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
        {this.context.token && (
          <div className="events-control">
            <p>Share your own events here!</p>
            <button className="btn" onClick={this.handleCreateClicked}>
              Create Event
            </button>
          </div>
        )}
        <ul className="events__list">
          {this.state.events.map((event) => (
            <li key={event._id} className="events__list-item">
              {event.description}
            </li>
          ))}
        </ul>
      </>
    );
  }
}

export default Events;
