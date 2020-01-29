import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as firebase from "firebase";

class Signup extends React.Component {
    state = {
        nome: '',
        cognome: '',
        email: '',
        password: '',
        isLoading: false,
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: "Registrazione",
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
            headerRight: (
                <View></View>
            ),
            headerLeft: (
                <View>
                    <TouchableOpacity 
                      onPress={() => navigation.goBack()}>
                      <MaterialIcons 
                        style={{paddingHorizontal: 5, marginBottom: 32}}
                        name={"arrow-back"}
                        size={35} 
                        color={"black"}
                      />
                    </TouchableOpacity>          
                </View>
            ),
        }
    }

    _warning = () => {
        Alert.alert(
          "Registrazione fallita",
          "Inserisci un indirizzo E-mail valido!\nLa password deve contenere almeno 6 caratteri!",
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: false},
        );
      }

    _signUp = () => {
        if(this.state.nome != "" && 
           this.state.cognome != "" &&
           this.state.email != "" &&
           this.state.password != "") 
        {
            this.setState({isLoading: true}); 
            firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(obj => {
                this.setState({ isLoading: false });
                firebase.database().ref("/users").child(obj.user.uid).child("Cognome").set(this.state.cognome);
                firebase.database().ref("/users").child(obj.user.uid).child("Nome").set(this.state.nome);
                firebase.database().ref("/users").child(obj.user.uid).child("ResultQuestionnaires").child("prova").set("1");
                this.props.navigation.navigate("Index");
            })
            .catch(() => {
                this.setState({isLoading: false});
                this._warning();
            });
        }
        else {
            Alert.alert(
                "Registrazione fallita",
                'Riempire tutti i campi prima di confermare!',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
            );
        }
    } 

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.inputBox}
                    value={this.state.nome}
                    onChangeText={nome => this.setState({ nome })}
                    placeholder='Nome'
                />
                <TextInput
                    style={styles.inputBox}
                    value={this.state.cognome}
                    onChangeText={cognome => this.setState({ cognome })}
                    placeholder='Cognome'
                />
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
                    onPress={this._signUp}
                >
                    {this.state.isLoading ? <ActivityIndicator size="small" color="#0000ff" /> : 
                        <Text style={styles.buttonText}>Conferma</Text>}
                </TouchableOpacity>
            </View>
        )
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
    buttonSignup: {
        fontSize: 12
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80
     }
})

export default Signup;