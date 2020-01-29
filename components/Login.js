import React, {Component} from "react";
import { View, StatusBar, StyleSheet, Alert, TextInput, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import * as firebase from "firebase";

StatusBar.setHidden(true);

export default class LoginForm extends Component {

  static navigationOptions = ({navigation}) => {
    return {
      title: "Login",
      headerStyle: {
          backgroundColor: "#EAEAEA",
          borderBottomWidth: 2,
          borderBottomColor: "#AAAAAA", 
          height: 35,
      },
      headerTintColor: "black",
      headerTitleStyle: {  
          flex: 1,
          textAlign: "center",    
          marginBottom: 40,
          fontWeight: "bold",
          fontSize: 28 
      },
    }
  };
  
  state = {
    isLoading: false,
    email: "",
    password: "",
  };

  
  _warning = () => {
    Alert.alert(
      'Login fallita',
      'Inserire le credenziali corrette per accedere!',
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }

  _login = () => {
    this.setState({ isLoading: true });
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.setState({ isLoading: false });
        this.props.navigation.navigate("Index");
      })
      .catch(() => {
        this.setState({ isLoading: false});
        this._warning(); 
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputBox}
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
          placeholder='E-mail'
        />
        <TextInput
            style={styles.inputBox}
            value={this.state.password}    
            onChangeText={password => this.setState({ password })}
            placeholder='Password'
            secureTextEntry={true}
        />
        <TouchableOpacity 
          style={styles.button}
          onPress={this._login}
        >
          {this.state.isLoading ? <ActivityIndicator size="small" color="#0000ff" /> : 
            <Text style={styles.buttonText}>Accedi</Text>}
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => this.props.navigation.navigate('Signup')}
        >
          <Text style={styles.textSignup}> Non hai ancora un account? Registrati ora! </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center'
  },
  inputBox: {
      width: '85%',
      margin: 10,
      padding: 15,
      fontSize: 16,
      borderColor: '#d3d3d3',
      borderBottomWidth: 1,
      textAlign: 'center'
  },
  button: {
      marginTop: 30,
      marginBottom: 20,
      paddingVertical: 5,
      alignItems: 'center',
      backgroundColor: '#F6820D',
      borderColor: '#F6820D',
      borderWidth: 1,
      borderRadius: 5,
      width: 200
  },
  buttonText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff'
  },
  textSignup: {
      fontSize: 18,
      color: "blue",
  }
})
