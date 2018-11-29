import React from 'react';
import './ConnectionToast.css';

class ConnectionToast extends React.Component {
    state = {
        active: null
    };

    render() {
        const message = this.props.online
            ? 'Yay, the application is online!'
            : 'Oh no, the app seems to be offline... ';

        return (
            <div className="toast" show={this.props.show}>
                {message}
            </div>
        );
    }
}

export default ConnectionToast;