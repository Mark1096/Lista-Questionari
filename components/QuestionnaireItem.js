import React from 'react';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";


export default class QuestionnaireItem extends React.Component { 
  render() {
    return ( 
        <View style={styles.container}>     
            <Text style={styles.text} > {this.props.name} </Text>
            <TouchableHighlight
                onPress={this.props.onQuestion} 
                underlayColor="gray"
            >
                <MaterialIcons name="chevron-right" size={38} />
            </TouchableHighlight> 
        </View> 
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "#AAAAAA",
        borderRadius: 5,
        marginHorizontal: 5,
        marginVertical: 10,
    },
    text: {
        fontSize: 25,
        color: "black",
    },
});