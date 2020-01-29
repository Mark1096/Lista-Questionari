import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Index from "./components/Index";
import Question from "./components/Question";
import Login from "./components/Login";
import Signup from "./components/Signup";
import * as firebase from 'firebase'; 
import { YellowBox } from "react-native";

YellowBox.ignoreWarnings(['Setting a timer']);

var firebaseConfig = {
  apiKey: "AIzaSyDg1-DWbZn7vhWC3oGR_IWDVzqGvCwy9xc",
  authDomain: "progetto-lap2.firebaseapp.com",
  databaseURL: "https://progetto-lap2.firebaseio.com",
  projectId: "progetto-lap2",
  storageBucket: "progetto-lap2.appspot.com",
  messagingSenderId: "510567327612",
  appId: "1:510567327612:web:63b81bd4c48f3e24ee66f9",
  measurementId: "G-GKHL6RN9FY"
};
!firebase.apps.length? firebase.initializeApp(firebaseConfig) : null;     

const App = createStackNavigator({
    Index: Index, 
    Question: Question,
    Login: Login,
    Signup: Signup,
  },
  {
    initialRouteName: "Login",
    mode: "modal",
  }
);

export default createAppContainer(App);
