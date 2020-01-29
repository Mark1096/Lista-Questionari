import React from 'react';
import { Text, View, StyleSheet, FlatList, ScrollView, Alert, ImageBackground, ActivityIndicator } from 'react-native';
import * as firebase from "firebase";
import { SimpleLineIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import QuestionnaireItem from "./QuestionnaireItem";


export default class Index extends React.Component {

    state = { 
        nome: "",
        cognome: "",
        question: [],
        nameQuestionnaire: [],
        resultQuestionnaire: [],   
        control: 0,
        isLoading: true,
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
                      <SimpleLineIcons 
                        name="logout"
                        size={30}
                        style={{marginBottom: 38, marginHorizontal: 15}}
                      />
                    </TouchableOpacity>          
                </View>
            ),
        }
    }

    componentWillMount() {
        setTimeout(() => {
            this.setState({isLoading: false});
        }, 1300)   
    }

    _loadState = (elementsUser, questions, nameQuestions, nameResponse) => {
        let response = elementsUser.ResultQuestionnaires;
        let nameList = [];
        let list = [];
        let resultList = [];
        for(var i = 0; i < nameResponse.length; i++) {
            let splitter = nameResponse[i].split("_");
            let code_test = splitter[splitter.length-1];
            for(var j = 0; j < nameQuestions.length; j++) {
                if(code_test === nameQuestions[j].split("_")[0]) {
                    nameList[i] = nameQuestions[j];
                    questions[nameQuestions[j]].result = true;
                    let data = Object.values(response[nameResponse[i]]);
                    questions[nameQuestions[j]].punteggio = data[0].punteggio;
                    questions[nameQuestions[j]].numQuestions = data[0].array.length;
                    list[i] = questions[nameQuestions[j]];
                    resultList[i] = data[0].array;
                    j = nameQuestions.length;
                }
            }
        }                  
        this.setState({nome: elementsUser.Nome, cognome: elementsUser.Cognome, question: list, nameQuestionnaire: nameList, resultQuestionnaire: resultList, control: this.state.control + 1});
    }

    componentDidMount() {
        const currentUID = firebase.auth().currentUser.uid;
        if(currentUID) {
            this.path = "/users/" + currentUID;
            var questions;
            firebase.database().ref("QuestionsQuestionnaires").on("value", snap => {
                questions = snap.val();
            });
            firebase.database().ref(this.path).on("value", snap => {
                if(this.state.control === 0) {
                    let nameQuestions = Object.keys(questions);
                    let elementsUser = snap.val();
                    let nameResponse = Object.keys(elementsUser.ResultQuestionnaires);              
                    this._loadState(elementsUser, questions, nameQuestions, nameResponse);
                }
            })
        }
    }

    _unsolvedQuestionnaire = (nameState, namesDB) => {
        let bool = false;
        let name;
        for(var i = 0; i < namesDB.length; i++) {
            for(var j = 0; j < nameState.length; j++) {
                if(nameState[j] === namesDB[i]) {
                    bool = true;
                    j = nameState.length;
                }
            }
            if(!bool) {
                name = namesDB[i];
                break;
            }
            bool = false;
        }    
        return name;
    }
    
    _loadQuestionnaire = () => {
        let path = "QuestionsQuestionnaires";
        firebase.database().ref(path).on("value", snap => { 
            let questionnaires = snap.val();
            let nameState = this.state.nameQuestionnaire;   
            let namesDB = Object.keys(questionnaires);     
            let name = this._unsolvedQuestionnaire(nameState, namesDB);
            if(name) {
                let listName = [...this.state.nameQuestionnaire, name];
                let array = [questionnaires[name]];   
                array[0].result = false;
                let finalList = [...this.state.question, ...array];
                this.setState({question: finalList, nameQuestionnaire: listName});
            }
            else {
                Alert.alert(
                    'Caricamento fallito',
                    'Attualmente non sono disponibili nuovi questionari!',
                    [
                      {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    {cancelable: false},
                );
            }
        })
    }

    _showResult = (item, length, index) => {
        let container = this.state.question.map( (lang, i) => {
            if(index == i) {
                let obj = {
                    array: lang.array,
                    result: true,
                    punteggio: item.punteggio,
                    numQuestions: length,
                }
                return obj;
            }
            return lang;
        })
        this.setState({question: container});
    }
            
    _uploadResponse = item => {
        let fileName = item.Cognome + "_" + item.Nome + "_" + item.Codice_test;
        let path = this.path + "/ResultQuestionnaires";
        firebase.database().ref(path).child(fileName).push(item);  
    }

    _score = (item, index) => {
        let obj = {};
        let scoreList = this.state.question[index].array.map( (child, index) => {
            if(child.Esatta == item[index].Risposta) {
                obj = {
                    Risposta: item[index].Risposta,
                    punti: 1,
                }
            }
            else {
                obj = {
                    Risposta: item[index].Risposta,
                    punti: 0,
                }
            }
            return obj;
        })
        return scoreList;
    }

    _totalPoints = scoreList => {
        let sommaPunti = 0;
        for(var i = 0; i < scoreList.length; i++) {
            sommaPunti += scoreList[i].punti;
        }
        return sommaPunti;
    }

    _findNameTest = splitter => {
        let name_test = "";
        for(let i = 1; i < splitter.length; i++) {
            if(i < splitter.length-1) name_test += splitter[i] + "_";
            else name_test += splitter[i];
        }
        return name_test;
    }

    _result = (item, index) => {
        let scoreList = this._score(item, index);
        let points = this._totalPoints(scoreList);
        let date = new Date();         
        let splitter = this.state.nameQuestionnaire[index].split("_");       
        let code_test = splitter[0];
        let name_test = this._findNameTest(splitter);
        let result = {
           Cognome: this.state.cognome,
           Nome: this.state.nome,
           Data: date.getDate() + '/' + (date.getMonth() +1) + '/' + date.getFullYear(),
           Ora: date.getHours() + ':' + date.getMinutes(),
           Codice_test: code_test,
           Nome_test: name_test,
           array: scoreList,
           punteggio: points,
        }
        this._uploadResponse(result);  
        this._showResult(result, this.state.question[index].array.length, index);
        let resultList = this.state.resultQuestionnaire;
        resultList[index] = item;
        this.setState({resultQuestionnaire: resultList});
    }

    _question = index => {
        console.log("Dentro _question! Questionario corrente: ", this.state.nameQuestionnaire[index]);
        if(this.state.resultQuestionnaire[index] != undefined) {
            this.props.navigation.navigate("Question", {
                list: this.state.question[index],
                resultList: this.state.resultQuestionnaire[index],   
                onResult: obj => this._result(obj, index) 
            });
        }
        else {
            this.props.navigation.navigate("Question", {
                list: this.state.question[index],
                onResult: obj => this._result(obj, index) 
            });
        }
    }

    _renderElements = ({item, index}) => {
        return (
            <QuestionnaireItem data={item} name={this.state.nameQuestionnaire[index]} score={this.state.question[index]} onQuestion={ () => this._question(index)} /> 
        )
    }

    _keyExtractor = (item, index) => {
        return String(index);
    }

    render() {
        return (
            <ImageBackground 
                source={{ uri: "https://www.cassaedilepg.it/images/slides/libri-scolastici.jpg" }}
                style={{width: '100%', height: '100%'}} 
            >
                <ScrollView contentContainerStyle={ !this.state.isLoading ? styles.container : {flex: 1, justifyContent: "center"}}>
                    {this.state.isLoading ? 
                        <ActivityIndicator size="large" color="#0000ff" />
                    :
                    <View style={{width: "100%", alignItems: "center"}}> 
                        <View style={styles.userData}>             
                            <Text style={{fontWeight: "bold", textAlign: "center", fontSize: 22}}> 
                                Dati Utente 
                            </Text>                          
                            <Text style={styles.textData}> Nome: {this.state.nome} </Text>
                            <Text style={styles.textData}> Cognome: {this.state.cognome} </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={this._loadQuestionnaire}>                
                            <Text style={styles.textButton}> Carica questionari </Text>
                        </TouchableOpacity>
                        <View style={{width: "95%"}}>
                            <FlatList
                                data={this.state.question} 
                                renderItem={this._renderElements} 
                                keyExtractor={this._keyExtractor}
                            />
                        </View>
                    </View>
                    }
                </ScrollView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }, 
    userData: {
        width: "95%",
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
        width: 240,
        backgroundColor: "#00E5EE",
        justifyContent: "center",
        alignItems: "center",   
        borderWidth: 0,
        borderRadius: 5,
        marginVertical: 10,
        paddingVertical: 5,
    },
    textButton: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
});