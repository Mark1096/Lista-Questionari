import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MultipleItem from "./MultipleItem";

export default class Question extends React.Component {

    state = {
        questionList: [],
        resultList: [],
        isLoading: true,
    }

    static navigationOptions = ({navigation}) => {
        const { state } = navigation;
        return {
            title: state.params.title ? state.params.title : "",
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

    componentWillMount() {
        this.elements = this.props.navigation.getParam("list");
        this.result = this.elements.result;
        const title = this.result ? 'Risposte' : 'Quesiti';
        this.props.navigation.setParams({ title });
        setTimeout(() => {    
            this.setState({isLoading: false});
        }, 410)
    }

    componentDidMount() {
        let resultList = this.props.navigation.getParam("resultList");
        if(resultList != undefined) {
            this.setState({resultList});
        }
        let newList = [];
        let obj = {};
        this.elements.array.map(child => {
            obj = {
                A: [{response: child.A, select: false}],
                B: [{response: child.B, select: false}],
                C: [{response: child.C, select: false}],
                D: [{response: child.D, select: false}],
                Domanda: child.Domanda,
                Esatta: child.Esatta,
            }
            newList.push(obj);  
        })  
        this.setState({questionList: newList});
    }

    _result = (child, response, select) => {
        let obj = {
            ...child,
            A: [{
                response: response[0],
                select: select[0],
            }],
            B: [{
                response: response[1],
                select: select[1],
            }],
            C: [{
                response: response[2],
                select: select[2],
            }],
            D: [{
                response: response[3],
                select: select[3],
            }],
        }
        return obj;
    }

    _toggle = item => {
        let obj = {};
        let ris;
        let list = this.state.questionList.map( child => {
            if(child.Domanda == item.question) {
                switch(item.ris.id) {
                    case 0: {
                        let response = [item.ris.response, child.B[0].response, child.C[0].response, child.D[0].response];
                        let select = [item.ris.select, false, false, false];
                        ris = this._result(child, response, select);
                        obj = {...ris};
                        break;
                    }
                    case 1: {
                        let response = [child.A[0].response, item.ris.response, child.C[0].response, child.D[0].response];
                        let select = [false, item.ris.select, false, false];
                        ris = this._result(child, response, select);
                        obj = {...ris};
                        break;
                    }
                    case 2: {
                        let response = [child.A[0].response, child.B[0].response, item.ris.response, child.D[0].response];
                        let select = [false, false, item.ris.select, false];
                        ris = this._result(child, response, select);
                        obj = {...ris};
                        break;
                    }
                    case 3: {
                        let response = [child.A[0].response, child.B[0].response, child.C[0].response, item.ris.response];
                        let select = [false, false, false, item.ris.select];
                        ris = this._result(child, response, select);
                        obj = {...ris};
                        break;
                    }
                    default: {
                        obj = {
                            ...child,
                        }
                    }
                }
                return obj;
            }
            else {
                return child;
            }
        })
        this.setState({questionList: list});
    }

    _save = () => {
        let obj = {};
        let responseList = [];
        let stateList = this.state.questionList;
        let bool = false;
        for(var i = 0; i < this.state.questionList.length; i++) {
            if(stateList[i].A[0].select == true) {
                obj = {
                    question: stateList[i].Domanda,
                    Risposta: "A",
                }
            }
            else if(stateList[i].B[0].select == true) {
                obj = {
                    question: stateList[i].Domanda,
                    Risposta: "B",
                }
            }
            else if(stateList[i].C[0].select == true) {
                obj = {
                    question: stateList[i].Domanda,
                    Risposta: "C",
                }
            }
            else if(stateList[i].D[0].select == true) {
                obj = {
                    question: stateList[i].Domanda,
                    Risposta: "D",
                }
            }
            else {
                break;
            }
            responseList[i] = obj;
            if(i === this.state.questionList.length-1) {
                bool = true;
            }
        }
        if(bool) {    
            this.props.navigation.getParam("onResult")(responseList);
            this.props.navigation.goBack();
        }
        else {
            Alert.alert(
                'Conferma non disponibile',
                'Devi rispondere a tutte le domande prima di confermare!',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
            );
        }
    }
    _renderElements = ({item, index}) => {    
        return (
            <MultipleItem 
                data={item} 
                onToggle={this._toggle}
                result={this.result}
                resultList={this.result? this.state.resultList[index] : undefined}
            /> 
        )    
    }
    _keyExtractor = (item, index) => {
        return String(index);
    }

    render() {
        return (
            <ScrollView contentContainerStyle={ !this.state.isLoading ? {} : {flex: 1, justifyContent: "center"}}>
                {this.state.isLoading ? 
                    <ActivityIndicator size="large" color="#0000ff" />
                : 
                <View>
                    <View style={styles.list}>
                        <FlatList 
                            data={this.state.questionList} 
                            renderItem={this._renderElements} 
                            keyExtractor={this._keyExtractor}
                        />
                    </View>
                    {!this.result ? (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={this._save}>
                            <Text style={styles.textButton}> Conferma </Text>
                        </TouchableOpacity>
                    ): null}
                </View>}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
        marginHorizontal: 10,
    },
    button: {
        width: 180,
        height: 70,
        backgroundColor: "#00E5EE",
        justifyContent: "center",
        alignItems: "center",   
        borderWidth: 0,
        borderRadius: 5,
        marginVertical: 10,
        marginLeft: 115,
    },
    textButton: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
});