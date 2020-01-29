import React from 'react';
import { Text, View, StyleSheet, FlatList, ScrollView } from 'react-native';
import * as firebase from "firebase";
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import QuestionnaireItem from "./QuestionnaireItem";

/*
const questions = {
  "array": [
    {
      "Domanda": "DOMANDA N. 1: Chi è il personaggio più puccioso degli anime?",
      "A": "Filo",
      "B": "Nezuko",
      "C": "Phil",
      "D": "Charmy",
      "Esatta": "A"
    },
    {
      "Domanda": "DOMANDA N. 2",
      "A": "Risposta A",
      "B": "Risposta B",
      "C": "Risposta C",
      "D": "Risposta D",
      "Esatta": "C"
    },
    {
      "Domanda": "DOMANDA N. 3",
      "A": "Risposta A",
      "B": "Risposta B",
      "C": "Risposta C",
      "D": "Risposta D",
      "Esatta": "D"
    }
  ]
}
*/

export default class Index extends React.Component {

    state = { 
        nome: "",
        cognome: "",
        question: [],
        nameQuestionnaire: [],
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: "Questionari",
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
                      onPress={ () => navigation.goBack()}>
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

    componentDidMount() {
        const currentUID = firebase.auth().currentUser.uid;
        if(currentUID) {
            this.path = "/users/" + currentUID;
            firebase.database().ref(this.path).on("value", snap => {
                this.setState({nome: snap.val().Nome, cognome: snap.val().Cognome});
            })
        }
    }

    _loadQuestionnaire = () => {
        console.log("dentro loadQuestionnaire");
        firebase.database().ref(this.path).on("value", snap => {
            let questionnaires = snap.val().ListQuestoinnaires.QuestionsQuestionnaires;
         //   console.log("Dati contenuti nel db: ", Object.keys(questionnaires));  // Object.keys(questionnaires) serve ad estrapolare il nome delle proprietà dell'oggetto passato come parametro
            let name = Object.keys(questionnaires)[0];   // prelevamento temporaneo dei dati in questo modo. Successivamente considerare più questionari e sistemarlo
            //    console.log("nome: ", name);
            let array = [questionnaires[name]];   // per accedere al valore del nome della proprietà salvata in una variabile, utilizzare la sintassi accanto
            this.setState({question: array});
        })
    }

    _result = item => {
        let obj = {};
        let scoreList = this.state.question[0].array.map( (child, index) => {
            if(child.Esatta == item[index].response) {
                obj = {
                    Risposta: item[index].response,
                    punti: 1,
                }
            }
            else {
                obj = {
                    Risposta: item[index].response,
                    punti: 0,
                }
            }
            return obj;
        })
       let sommaPunti = 0;
       for(var i = 0; i < scoreList.length; i++) {
           sommaPunti += scoreList[i].punti;
       }
       let result = {
           array: scoreList,
           punteggio: sommaPunti,
       }
       console.log("Risultato finale: ", result);
    }

    _question = () => {
        this.props.navigation.navigate("Question", {
            list: this.state.question,
            onResult: obj => this._result(obj) 
        });
    }

    _renderElements = ({item}) => {
        return (
            <QuestionnaireItem data={item} name={this.state.nameQuestionnaire} onQuestion={this._question} /> 
        )
    }

    _keyExtractor = (item, index) => {
        return String(index);
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.userData}>
                        <View>
                            <Text style={{fontWeight: "bold", textAlign: "center", fontSize: 22}}> 
                                Dati Utente 
                            </Text>
                        </View>
                        <Text style={styles.textData}> Nome: {this.state.nome} </Text>
                        <Text style={styles.textData}> Cognome: {this.state.cognome} </Text>
                    </View>
                    <TouchableOpacity
                        onPress={this._loadQuestionnaire}>
                        <View style={styles.button}>
                        <Text style={[styles.textButton, {color: "white"}]}> Carica questionari </Text>
                        </View>
                    </TouchableOpacity>
                    <FlatList
                        data={this.state.question} 
                        renderItem={this._renderElements} 
                        keyExtractor={this._keyExtractor}
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }, 
    userData: {
        backgroundColor: "#F5F5F5", 
        borderWidth: 1,
        borderColor: "#AAAAAA",
        borderRadius: 8,
        marginVertical: 10,
        marginHorizontal: 5,
    },
    textData: {
        fontSize: 20,
    },
    button: {
        height: 40,
        backgroundColor: "#00E5EE",
        justifyContent: "center",
        alignItems: "center",   
        borderWidth: 0,
        borderRadius: 5,
        marginVertical: 10,
        marginHorizontal: 5,
    },
    textButton: {
        fontSize: 24,
        fontWeight: "bold",
    },
});