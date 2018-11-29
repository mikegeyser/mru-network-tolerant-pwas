import React from "react";
import "./Toast.css";

class Toast extends React.Component {
  render() {
    return (
      <div className="toast" show={this.props.show}>
        {this.props.message}
      </div>
    );
  }
}

export default Toast;
