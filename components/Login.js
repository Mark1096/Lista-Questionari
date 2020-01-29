import React, {Component} from "react";
import { View, Text, StatusBar, StyleSheet } from "react-native";
import { Card, Button, Input } from "react-native-elements";
import * as firebase from "firebase";

/* 
  Primo account
    e-mail: nuovo@gmail.com
    password: pippo1234

  Secondo account
    e-mail: prova@gmail.com
    password: pluto1234
*/
/*
<Button
  loading={this.state.isLoading} // prop per visualizzare una spinner di caricamento (opzionale)
  raised   // Aggiungi stile pulsante in rilievo (opzionale). Non ha effetto se type="clear".
  backgroundColor={TINT_COLOR}
  title="Login"
  onPress={this._login}
/>
*/

StatusBar.setHidden(true);
const TINT_COLOR = "rgb(4, 159, 239)";


export default class LoginForm extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    isLoading: false,
    email: "nuovo@gmail.com",
    password: "pippo1234",
    error: ""
  };

  _login = () => {
    this.setState({ isLoading: true });
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        this.setState({ isLoading: false });
      //  console.log(user);
        this.props.navigation.navigate("Index");
      })
      .catch(error => {
        this.setState({ isLoading: false, error: error.message });
        //alert(error.message);
      });
  };

  _signUp = () => {
    this.setState({ isLoading: true }); // settandolo a true abilita la props loading
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        this.setState({ isLoading: false }); // una volta registrate le credenziali si disabilita la props loading settando lo state a false e successivamente si cambia screen con l'istruzione sottostante
      //  console.log(user);
        this.props.navigation.navigate("Index");
      })
      .catch(error => {
        this.setState({ isLoading: false, error: error.message });
        //alert(error.message);
      });
  };

  renderLoginOrSpinner() {
    return (
      <View style={{ justifyContent: "space-between", height: "40%", marginTop: 50 }}>
        <Button
          loading={this.state.isLoading}
          raised
          backgroundColor={TINT_COLOR}
          title="Login"
          onPress={this._login}
        />
        <Button
          raised
          loading={this.state.isLoading}
          backgroundColor={TINT_COLOR}
          title="Register"
          onPress={this._signUp}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Card>     
          <Input
            label="E-mail"
            placeholder="Inserisci una e-mail"
            onChangeText={text => this.setState({ email: text })}
            //value={this.state.email}
          />
          <Input
            secureTextEntry
            label="Password"
            placeholder="Inserisci una password"
            onChangeText={text => this.setState({ password: text })}
            //value={this.state.password}
          />

          {this.renderLoginOrSpinner()}
          <Text>{this.state.error}</Text>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  }
})
