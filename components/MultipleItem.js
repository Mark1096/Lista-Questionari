import React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import ResponseItem from "./ResponseItem";

export default class MultipleItem extends React.Component {

    state = {
        responseList: [],
    }

    componentWillMount() {
        let elements = [
            this.props.data.A[0].response,
            this.props.data.B[0].response,
            this.props.data.C[0].response,
            this.props.data.D[0].response,
        ];  
        let newList = [];
        elements.map(child => {
            newList.push({
              response: child,
              select: false,
            })  
        })
        this.setState({responseList: newList}); 
    }

    _toggle = item => {
        let obj = {};
        let list = this.state.responseList.map(currentItem => {
            if(currentItem == item) { 
                if(currentItem.select == false) {
                    obj = {...currentItem,  select: !currentItem.select};
                }
                else {
                    obj = {...currentItem,  select: currentItem.select};
                }
                return obj;
            }
            else {
                return {...currentItem, select: false};
            }
        });
        let ris = {
            ris: obj,
            question: this.props.data.Domanda,
        }
        this.props.onToggle(ris);
        this.setState({responseList: list});
    }
    _renderElements = ({item}) => {
        return (
            <ResponseItem data={item} onToggle={() => this._toggle(item)} /> 
        )
    }
    _keyExtractor = (item, index) => {
        item.id = index;
        return String(index);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{fontSize: 23}}> {this.props.data.Domanda} </Text>
                <View style={{flex: 1}}>
                    <FlatList 
                        data={this.state.responseList} 
                        renderItem={this._renderElements} 
                        keyExtractor={this._keyExtractor}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5", 
        borderWidth: 1,
        borderColor: "#AAAAAA",
        borderRadius: 8,
        marginVertical: 10,
        marginHorizontal: 5,
    },
    /* Vecchia versione senza riquadri nelle domande. Capire se conviene metterli per abbellire o no.
    container: {
        flex: 1,
        marginVertical: 15,
        borderBottomWidth: 1,    
        borderColor: "#AAAAAA",
    },
    */
})