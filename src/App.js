import React, { Component } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import { BrowserRouter, Route } from "react-router-dom";

import Navigation from "./components/Navigation";
import WorkshopInfo from "./components/WorkshopInfo";

import LoginPage from "./pages/LoginPage";
import TaskPage from "./pages/TaskPage";
import PercakapanPage from "./pages/PercakapanPage";

class App extends Component {
  state = {
    workshop: {
      id_workshop: "",
      judul: "",
      deskripsi: ""
    }
  };

  socket = socketIOClient("http://localhost:3000");

  componentDidMount() {
    const detail_workshop = JSON.parse(localStorage.getItem("detail_workshop"));
    if (detail_workshop) {
      axios
        .get(`http://localhost:3000/workshop/${detail_workshop.id_workshop}`)
        .then(response => this.setState({ workshop: response.data }));
    }
  }

  logout() {
    const detail_workshop = JSON.parse(localStorage.getItem("detail_workshop"));
    const { id_detail_workshop, id_workshop } = detail_workshop;
    console.log(id_detail_workshop);
    axios
      .delete("http://localhost:3000/autentikasi/peserta", {
        data: { id_detail_workshop }
      })
      .then(response => {
        this.socket.emit("detail", id_workshop);
        localStorage.removeItem("token");
        localStorage.removeItem("detail_workshop");
        window.location.replace("/login");
      });
  }

  render() {
    const token = localStorage.getItem("token");

    return (
      <BrowserRouter>
        {token ? (
          <div>
            <Navigation onLogoutButtonClick={() => this.logout()} />
            <WorkshopInfo workshop={this.state.workshop} />
          </div>
        ) : null}

        <Route path="/login" component={LoginPage} />
        <Route path="/" exact component={TaskPage} />
        <Route path="/percakapan" component={PercakapanPage} />
      </BrowserRouter>
    );
  }
}

export default App;
