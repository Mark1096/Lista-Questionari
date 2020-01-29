import React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import ResponseItem from "./ResponseItem";

export default class MultipleItem extends React.Component {

    state = {
        responseList: [],
    }
     
    getIndex = item => {
        let index;
        switch(item) {
            case 'A': {
                index = 0;
                break;
            }
            case 'B': {
                index = 1;
                break;
            }
            case 'C': {
                index = 2;
                break;
            }
            case 'D': {
                index = 3;
                break;
            }
            default: break;
        }
        return index;
    }

    _setItem = (elements, indexEsatta, indexRis) => {
        let newList = [];
        elements.map( (child, i) => {
            if(indexEsatta === i) {
                newList.push({
                    response: child,
                    select: false,
                    esatta: true,
                })  
            }
            else if(indexEsatta !== i && indexRis === i) {
                newList.push({
                    response: child,
                    select: false,
                    errata: true,
                })  
            }
            else {
                newList.push({
                    response: child,
                    select: false,
                })  
            }
        })
        return newList;
    }

    componentDidMount() {
        var indexEsatta = -1;
        var indexRis = -1;
        if(this.props.result) {
            let ris = this.props.resultList.Risposta;
            indexRis = this.getIndex(ris);
            let risEsatta = this.props.data.Esatta;
            indexEsatta = this.getIndex(risEsatta)
        }
        let elements = [
            this.props.data.A[0].response,
            this.props.data.B[0].response,
            this.props.data.C[0].response,
            this.props.data.D[0].response,
        ];  
        let newList = this._setItem(elements, indexEsatta, indexRis);   
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
            <ResponseItem 
                data={item} 
                onToggle={() => this._toggle(item)} 
                result={this.props.result}
            /> 
        )
    }
    
    _keyExtractor = (item, index) => {
        item.id = index;
        return String(index);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{fontSize: 22}}>{this.props.data.Domanda}</Text>
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
})