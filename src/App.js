import React from 'react';
import io from 'socket.io-client';
import { StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';

import { default as Room } from './Room';
import { default as JoinRoom } from './JoinRoom';

const socket = io('https://simple-socket-server.herokuapp.com/');
//const socket = io('https://socket-server.apps.us2.bosch-iot-cloud.com');
//const socket = io('http://localhost:3000/');


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      room: '',
      joining: false,
      messages: [
        {
          text: 'test message',
          username: 'Nick'
        }
      ]
    }
  }

  componentWillMount() {
    socket.on('serverMsg', (data) => {
      console.log('RECEIVING SERVER MSG')
      this.handleServerMessage(data.msg)
    })
  }


  handleJoinRoom = (roomName) => {
    this.setState({ room: roomName });
    socket.emit('joinRoom', { room: roomName });
    console.log('JOINING ROOM:', roomName)
  } 

  handleCancel = () => {
    this.setState({ room: '', joining: false });
  }

  handleNewMessage = ({ text, username }) => {
    socket.emit('newMsg', { msg: { text, username}, room: this.state.room });
    console.log('SENDING NEW MESSAGE TO:', this.state.room); 
  }
  
  handleServerMessage = ({ text, username, room }) => {
    console.log('RECIEVING MESSAGE')
    const currentMessages = this.state.messages;
    currentMessages.push({ text, username, room });
    this.setState({ messages: currentMessages });
  }

  render() {
    return (
      this.state.room ? 
          <Room {...this.state} handleNewMessage={this.handleNewMessage}/>
         :
        this.state.joining ?
        <JoinRoom 
          handleJoinRoom={this.handleJoinRoom}
          handleCancel={this.handleCancel}
        /> :
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState({ joining: true })}
          >
          <Text  style={styles.buttonText}> Join Room </Text>
          </TouchableOpacity>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    fontSize: 36
  },
  container: {
    flex: 1,
    backgroundColor: '#ededed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#4286f4',
    padding: 10,
    width: 250,
    height: 60,
    borderRadius: 15
  },
  buttonText: {
    paddingTop: 5,
    fontSize: 24,
    color: 'white'
  }
});
