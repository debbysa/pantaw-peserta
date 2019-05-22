import React, { Component } from "react";

export default class Task extends Component {
  render() {
    return (
      <div align="center">
        <p align="center">{this.props.task.judul}</p>
        <p align="center">{this.props.task.timer}</p>
      </div>
    );
  }
}
