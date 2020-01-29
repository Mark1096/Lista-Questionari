import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default class ResponseItem extends React.Component {

    _showResponse = (response, select) => {
        return (
            <View>
                {this.props.data.esatta ? (
                    <View style={styles.container}> 
                        <FontAwesome 
                            name={"check-circle"}
                            size={32} 
                            color={"green"}
                        />
                        <View>
                            <Text style={styles.text}> {response} </Text>
                        </View>
                    </View>
                ) : this.props.data.errata ? (
                    <View style={styles.container}> 
                        <FontAwesome 
                            name={"times-circle"}
                            size={32} 
                            color={"red"}
                        />
                        <View>
                            <Text style={styles.text}> {response} </Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.container}>
                        {select ? (
                            <FontAwesome 
                                name={"check-circle"}
                                size={32} 
                                color={"blue"}
                            />
                        ) : (
                            <FontAwesome 
                                name={"circle-o"}
                                size={32} 
                                color={"blue"}
                            />
                        )}
                        <View>
                            <Text style={styles.text}> {response} </Text>
                        </View>
                    </View>
                )}
            </View>
        )
    }

    render() {
        var {response} = this.props.data;
        var {select} = this.props.data;
        var result = this.props.result;  
        return(
            <View>
                {result ? (
                    <View>
                        {this._showResponse(response, select)}
                    </View>
                ) : (
                    <TouchableHighlight onPress={this.props.onToggle} underlayColor={'#EAEAEA'}>
                        {this._showResponse(response, select)}
                    </TouchableHighlight>
                )}
            </View>
        )
    }
} 

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        flexDirection: "row",
        paddingVertical: 5,
        marginHorizontal: 10,
    },
    text: {
        fontSize: 21,
        color: "black",
    }
})