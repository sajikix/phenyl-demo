// @flow
import React, { Component } from "react";
import { createStackNavigator } from "react-navigation";
import { Provider, connect } from "react-redux";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";

import LoginScreen from "./src/pages/login";
import HomeScreen from "./src/pages/home";
import MemoViewScreen from "./src/pages/memoView";
import MemoEditScreen from "./src/pages/memoEdit";
import NewMemoScreen from "./src/pages/newMemo";

import { createStore } from "redux";
import memoApp from "./src/reducers/index";

const RootStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ navigation, navigationOptions }) => {
        return {
          headerTitle: "UserName",
          headerBackTitle: null,
          headerRight: (
            <Button
              onPress={() => {
                navigation.state.params.toNew();
                navigation.navigate("NewMemo");
              }}
              title="New"
            />
          ),
        };
      },
    },
    MemoView: {
      screen: MemoViewScreen,
      navigationOptions: ({ navigation, navigationOptions }) => {
        return {
          headerTitle: "とりあずtitle",
          headerBackTitle: null,
          headerRight: (
            <Button
              onPress={() => {
                navigation.state.params.toEditPage;
                navigation.navigate("MemoEdit");
              }}
              title="Edit"
            />
          ),
        };
      },
    },
    MemoEdit: {
      screen: MemoEditScreen,
      navigationOptions: ({ navigation, navigationOptions }) => {
        return {
          headerTitle: (
            <TextInput
              style={styles.editMemoTitle}
              value="編集できる"
              onChangeText={text => {
                navigation.state.params.updateTitle(text);
              }}
            />
          ),
          headerRight: (
            <Button
              onPress={() => navigation.navigate("MemoView")}
              title="Save"
            />
          ),
        };
      },
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: ({ navigation }) => {
        return {
          headerTitle: "Login",
          headerBackTitle: "Logout",
        };
      },
    },
    NewMemo: {
      screen: NewMemoScreen,
      navigationOptions: ({ navigation }) => {
        return {
          headerTitle: (
            <TextInput
              style={styles.editMemoTitle}
              value=""
              onChangeText={text => {
                navigation.state.params.saveTitle(text);
              }}
            />
          ),
          headerRight: (
            <Button
              onPress={() => {
                navigation.state.params.toSave;
                navigation.navigate("Home");
              }}
              title="Save"
            />
          ),
        };
      },
    },
  },
  {
    initialRouteName: "Login",
  }
);

const store = createStore(memoApp);

console.log(store.getState());
const unsubscribe = store.subscribe(() => {
  console.log(store.getState());
});

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <RootStack />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  editMemoTitle: {
    height: 25,
    width: 200,
    fontSize: 20,
    borderColor: "#424242",
    borderRadius: 5,
    borderWidth: 0.5,
  },
});
