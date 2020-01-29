import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";


export default class QuestionnaireItem extends React.Component { 
  render() {
    var {result} = this.props.score;
    var {punteggio} = this.props.score;
    var {numQuestions} = this.props.score;
 
    return ( 
        <TouchableOpacity
                onPress={this.props.onQuestion} 
                underlayColor="#EAEAEA"
        >
            <View style={styles.container}>     
                <Text style={styles.text} > {this.props.name} </Text>  
                {result ? (<Text style={styles.score}> ({punteggio}/{numQuestions}) </Text>):null}
                <MaterialIcons name="chevron-right" size={32}/>        
            </View> 
        </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        borderWidth: 0,
        borderRadius: 5,
        marginHorizontal: 5,
        marginVertical: 10,
        backgroundColor: 'rgba(255,255,255,0.6)',
    },
    text: {
        flex: 1,
        fontSize: 23,
    },
    score: {
        fontSize: 25,
        marginHorizontal: 10,
    },
});