// @flow
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import { pageTo, createMemo } from "../actions";
import { actions } from "phenyl-redux";

const screenSize = Dimensions.get("window");

const viewMemoSelector = state => {
  //let viewMemos = state.phenyl.entities.user.hoge.origin.memos;
  let sortedMemos;
  if (state.phenyl.entities.user.hoge.origin.memos) {
    let memos = state.phenyl.entities.user.hoge.origin.memos;
    sortedMemos = memos.slice().sort((a, b) => {
      if (a.updatedAt > b.updatedAt) {
        return -1;
      } else {
        return 1;
      }
    });
  } else {
    sortedMemos = [];
  }
  //console.log(memos);
  return sortedMemos;
};
const pageSelector = state => {
  return state.phenyl.entities.user.hoge.origin.page;
};
const memoSelector = state => {
  return state.phenyl.entities.user.hoge.origin.memos;
};
const mapStateToProps = state => {
  return {
    memos: memoSelector(state),
    sortedMemos: viewMemoSelector(state),
    page: pageSelector(state),
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  const { navigation } = ownProps;
  return {
    navigation: navigation,
    handleNewMemo: id => {
      console.log(id);
      dispatch(
        createMemoOperation(
          {
            id: id,
            title: "new Title",
            content: "new Memo",
          },
          navigation
        )
      );
    },
    handleTitleButton: (pageData, memoData) => {
      dispatch(pageToOperation(pageData, memoData, navigation));
    },
    handleLogout: pageData => {
      dispatch(logoutOperation(pageData, navigation));
    },
  };
};

const logoutOperation = (pageData, navigation) => async (
  dispatch,
  getState
) => {
  try {
    let phenylId = getState().phenyl.session.id;
    let session = getState().phenyl.session;
    await dispatch(
      pageToOperation(
        pageData,
        { id: null, title: null, content: null },
        navigation
      )
    );
    await dispatch(
      actions.logout({
        sessionId: session.id,
        userId: session.userId,
        entityName: session.entityName,
      })
    );
  } catch (e) {
    console.log(e);
  } finally {
    //await dispatch(actions.reset());
  }
};

const createMemoOperation = (memoData, navigation) => async (
  dispatch,
  getState
) => {
  //let phenylId = getState().phenyl.session.id;
  //console.log(phenylId);
  try {
    //dispatch(startSubmit());
    memoData.createdAt = Date.now();
    memoData.updatedAt = Date.now();
    memoId = memoSelector(getState()).length;
    console.log(memoId);
    await dispatch(
      actions.commitAndPush({
        entityName: "user",
        //のちにユーザー名に
        id: "hoge",
        operation: {
          $push: {
            memos: memoData,
          },
        },
      })
    );
    console.log("memos:" + JSON.stringify(memoSelector(getState())));
    await dispatch(
      pageToOperation(
        {
          name: "NewMemo",
          id: memoId,
        },
        {
          title: "new Title",
          content: "new Memo",
          id: memoId,
        },
        navigation
      )
    );
  } catch (e) {
    console.log(e);
  }
};

const pageToOperation = (pageData, memoData, navigation) => async (
  dispatch,
  getState
) => {
  let phenylId = await getState().phenyl.session.id;
  try {
    //dispatch(startSubmit());
    await dispatch(
      actions.commitAndPush({
        entityName: "user",
        //のちにユーザー名に
        id: "hoge",
        operation: {
          $set: {
            page: pageData,
          },
        },
      })
    );
    await dispatch(
      actions.commitAndPush({
        entityName: "user",
        //のちにユーザー名に
        id: "hoge",
        operation: {
          $set: {
            operatingMemo: memoData,
          },
        },
      })
    );
    navigation.navigate(pageData.name);
  } catch (e) {
    console.log(e);
  }
};

class HomeScreen extends React.Component {
  componentDidMount() {
    this.props.navigation.setParams({
      toNew: () => {
        console.log(this.props.memos.length);
        this.props.handleNewMemo(this.props.memos.length);
      },
      toLogout: () => {
        this.props.handleLogout({
          name: "Login",
          id: null,
        });
      },
    });
  }
  render() {
    return (
      <ScrollView>
        <View style={{ flex: 1, flexDirection: "column" }}>
          {this.props.sortedMemos.map(memo => {
            return (
              <TouchableOpacity
                //onPress={() => props.handleTitleButton.navigate("MemoView")}
                onPress={() => {
                  console.log(memo.id);
                  this.props.handleTitleButton(
                    {
                      name: "MemoView",
                      id: memo.id,
                    },
                    { title: memo.title, content: memo.content, id: memo.id }
                  );
                }}
                style={styles.memoTitle}
              >
                <Text style={{ margin: 10, fontSize: 25 }}>{memo.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  memoTitle: {
    height: 65,
    backgroundColor: "#efefef",
    borderWidth: 0.5,
    borderColor: "#adadad",
  },
  f1acjc: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
