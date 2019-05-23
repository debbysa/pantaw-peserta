import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import styled from "styled-components";

import Button from "../../components/Button";
import TextInput from "../../components/TextInput";

export default class PercakapanPage extends Component {
  state = {
    percakapan: [],
    message: ""
  };

  socket = socketIOClient("http://localhost:3000");
  detail_workshop = JSON.parse(localStorage.getItem("detail_workshop"));

  componentDidMount() {
    const { id_workshop } = this.detail_workshop;
    axios
      .get(`http://localhost:3000/workshop/${id_workshop}/percakapan`)
      .then(response => this.setState({ percakapan: response.data }));

    this.socket.on("percakapan", percakapan => {
      this.setState({ percakapan });
    });
  }

  changeMessage(value) {
    this.setState({ message: value });
  }

  sendMessage() {
    const { id_workshop, id_peserta } = this.detail_workshop;
    axios
      .post(`http://localhost:3000/workshop/${id_workshop}/percakapan`, {
        id_pengirim: id_peserta,
        pesan: this.state.message
      })
      .then(response => {
        this.socket.emit("percakapan", id_workshop);
        this.setState({ message: "" });
      });
  }

  render() {
    const token = localStorage.getItem("token");
    if (!token) window.location.replace("/login");

    const detail_workshop = JSON.parse(localStorage.getItem("detail_workshop"));
    const { peserta } = detail_workshop;

    return (
      <Body>
        <InputContainer>
          <TextInput
            label="Pesan"
            value={this.state.message}
            onChange={value => this.changeMessage(value)}
          />
          <Button onClick={() => this.sendMessage()} text="Kirim" />
        </InputContainer>

        <MessageContainer>
          {this.state.percakapan.map(item => (
            <Item
              style={{
                alignSelf: item.peserta
                  ? item.peserta.nama === peserta.nama
                    ? "flex-end"
                    : "flex-start"
                  : "flex-start",

                backgroundColor: item.peserta
                  ? item.peserta.nama === peserta.nama
                    ? "#2285e3"
                    : "#08c21c"
                  : "#08c21c"
              }}
            >
              {item.peserta
                ? item.peserta.nama
                : item.pemateri.nama + " (pemateri) "}
              <p>{item.pesan}</p>
            </Item>
          ))}
        </MessageContainer>
      </Body>
    );
  }
}

const Body = styled.div`
  flex-direction: column;
  display: flex;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MessageContainer = styled.div`
  display: flex;
  margin: auto;
  flex-direction: column;
  align-items: center;
  height: 200px;
  width: 500px;
  overflow-x: scroll;
`;

const Item = styled.ul`
  background-color: #2285e3;
  color: white;
  padding: 20px;
  border-radius: 5px;
`;
