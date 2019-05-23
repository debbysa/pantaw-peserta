import React, { Component } from "react";
import Task from "./components/Task";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";

import socketIOClient from "socket.io-client";
import axios from "axios";

export default class TaskPage extends Component {
  state = {
    task: {
      start: false,
      judul: "",
      durasi: 0,
      timer: 0
    },
    id_status: 3
  };

  socket = socketIOClient("http://localhost:3000");
  detail_workshop = JSON.parse(localStorage.getItem("detail_workshop"));

  componentDidMount() {
    this.setState({ id_status: this.detail_workshop.id_status });

    this.socket.on("task", task => {
      this.setState({ task });
    });

    this.socket.on("resetStatus", () => {
      this.setState({ id_status: 3 });
    });
  }

  updateStatus(id_status) {
    const { id_workshop, id_detail_workshop } = this.detail_workshop;
    axios
      .put(
        `http://localhost:3000/workshop/${id_workshop}/detail/${id_detail_workshop}`,
        { id_status }
      )
      .then(response => {
        this.setState({ id_status });
        this.socket.emit("detail", id_workshop);
      });
  }

  render() {
    const token = localStorage.getItem("token");
    if (!token) window.location.replace("/login");

    return (
      <div>
        {this.state.task.start ? <Task task={this.state.task} /> : null}

        <div align="center">
          <Button onClick={() => this.updateStatus(3)} text="Belum" />
          <Button
            disabled={this.state.id_status === 2}
            onClick={() => this.updateStatus(2)}
            text="Error"
          />
          <Button
            disabled={this.state.id_status === 1}
            onClick={() => this.updateStatus(1)}
            text="Selesai"
          />
        </div>
      </div>
    );
  }
}
