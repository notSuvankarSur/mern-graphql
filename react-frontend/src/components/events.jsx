import React, { Component } from "react";
import "./events.css";
import Modal from "./Modal/modal";
import Backdrop from "./Backdrop/backdrop";

class Events extends Component {
  state = {
    createClicked: false,
  };

  handleCreateClicked = () => {
    this.setState({ createClicked: true });
  };

  handleConfirm = () => {
    this.setState({ createClicked: false });
  };

  handleCancel = () => {
    this.setState({ createClicked: false });
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
            <p>Modal Content</p>
          </Modal>
        )}
        <div className="events-control">
          <p>Share your own events here!</p>
          <button className="btn" onClick={this.handleCreateClicked}>
            Create Event
          </button>
        </div>
      </>
    );
  }
}

export default Events;
