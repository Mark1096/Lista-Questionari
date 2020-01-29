import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MultipleItem from "./MultipleItem";

export default class Question extends React.Component {

    state = {
        questionList: [],
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: "Quesiti",
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
       let elements = this.props.navigation.getParam("list")[0].array;
       let newList = [];
       let obj = {};
        elements.map(child => {
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

    _toggle = item => {
        let obj = {};
        let list = this.state.questionList.map( child => {
            if(child.Domanda == item.question) {
                switch(item.ris.id) {
                    case 0: {
                        obj = {
                            ...child,
                            A: [{
                                response: item.ris.response,
                                select: item.ris.select,
                            }],
                            B: [{
                                response: child.B[0].response,
                                select: false,
                            }],
                            C: [{
                                response: child.C[0].response,
                                select: false,
                            }],
                            D: [{
                                response: child.D[0].response,
                                select: false,
                            }],
                        }
                        break;
                    }
                    case 1: {
                        obj = {
                            ...child,
                            A: [{
                                response: child.A[0].response,
                                select: false,
                            }],
                            B: [{
                                response: item.ris.response,
                                select: item.ris.select,
                            }],
                            C: [{
                                response: child.C[0].response,
                                select: false,
                            }],
                            D: [{
                                response: child.D[0].response,
                                select: false,
                            }],
                        }
                        break;
                    }
                    case 2: {
                        obj = {
                            ...child,
                            A: [{
                                response: child.A[0].response,
                                select: false,
                            }],
                            B: [{
                                response: child.B[0].response,
                                select: false,
                            }],
                            C: [{
                                response: item.ris.response,
                                select: item.ris.select,
                            }],
                            D: [{
                                response: child.D[0].response,
                                select: false,
                            }],
                        }
                        break;
                    }
                    case 3: {
                        obj = {
                            ...child,
                            A: [{
                                response: child.A[0].response,
                                select: false,
                            }],
                            B: [{
                                response: child.B[0].response,
                                select: false,
                            }],
                            C: [{
                                response: child.C[0].response,
                                select: false,
                            }],
                            D: [{
                                response: item.ris.response,
                                select: item.ris.select,
                            }],
                        }
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
                    response: "A",
                }
            }
            else if(stateList[i].B[0].select == true) {
                obj = {
                    question: stateList[i].Domanda,
                    response: "B",
                }
            }
            else if(stateList[i].C[0].select == true) {
                obj = {
                    question: stateList[i].Domanda,
                    response: "C",
                }
            }
            else if(stateList[i].D[0].select == true) {
                obj = {
                    question: stateList[i].Domanda,
                    response: "D",
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
                'Devi rispondere a tutte le domande prima di confermare',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
            );
        }
    }
    _renderElements = ({item}) => {
        return (
            <MultipleItem 
                data={item} 
                onToggle={this._toggle}
            /> 
        )
    }
    _keyExtractor = (item, index) => {
        return String(index);
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.list}>
                    <FlatList 
                        data={this.state.questionList} 
                        renderItem={this._renderElements} 
                        keyExtractor={this._keyExtractor}
                    />
                </View>
                <TouchableOpacity
                    onPress={this._save}>
                    <View style={{flex: 1, alignItems: "center"}}>
                        <View style={styles.button}>
                            <Text style={styles.textButton}> Conferma </Text>
                        </View>
                    </View>
                </TouchableOpacity>
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
        marginHorizontal: 5,
    },
    textButton: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
});