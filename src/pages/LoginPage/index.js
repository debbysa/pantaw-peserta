import React, { Component } from "react";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import axios from "axios";
import socketIOClient from "socket.io-client";
import HelpModal from "../../components/HelpModal";
import imgLogin from "../../assets/login.jpeg";

export default class Login extends Component {
  state = {
    id_workshop: "",
    nama: "",
    modalIsOpen: false
  };

  socket = socketIOClient("localhost:3000");

  changeIdWorkshop(id_workshop) {
    this.setState({ id_workshop });
  }

  changeNama(nama) {
    this.setState({ nama });
  }

  submitForm() {
    const { id_workshop, nama } = this.state;
    axios
      .post("http://localhost:3000/autentikasi/peserta", { id_workshop, nama })
      .then(response => {
        const { data } = response;
        if (data.success) {
          localStorage.setItem("token", data.token);
          localStorage.setItem(
            "detail_workshop",
            JSON.stringify(data.detail_workshop)
          );
          this.socket.emit("detail", id_workshop);
          window.location.replace("/");
        }
      });
  }

  openModal = () => {
    this.setState({
      modalIsOpen: true
    });
  };

  closeModal = () => {
    this.setState({
      modalIsOpen: false
    });
  };

  render() {
    return (
      <div>
        <button
          style={{
            padding: "10px",
            border: "none"
          }}
          onClick={this.openModal}
        >
          help
        </button>
        <HelpModal
          modalIsOpen={this.state.modalIsOpen}
          closeModal={this.closeModal}
        >
          <img src={imgLogin} />
        </HelpModal>
        <div
          style={{
            textAlign: "center",
            display: "block",
            width: "50%",
            margin: "auto"
          }}
        >
          <h2>Login</h2>
          <TextInput
            label="Nama"
            value={this.state.nama}
            onChange={value => this.changeNama(value)}
          />

          <TextInput
            label="ID Workshop"
            value={this.state.id_workshop}
            onChange={value => this.changeIdWorkshop(value)}
          />

          <Button text="Login" onClick={() => this.submitForm()} />
        </div>
      </div>
    );
  }
}
