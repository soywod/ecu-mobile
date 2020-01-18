import React from "react"
import {StyleSheet} from "react-native"
import {Button, Container, Content, Icon, Text, Footer, FooterTab} from "native-base"
import {NavigationStackScreenComponent} from "react-navigation-stack"

const Settings: NavigationStackScreenComponent = props => {
  const {navigate} = props.navigation

  return (
    <Container>
      <Content padder>
        <Text>Settings</Text>
      </Content>
      <Footer>
        <FooterTab>
          <Button light onPress={() => navigate("ExpenseEdit")}>
            <Icon type="MaterialIcons" name="add" />
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  )
}

const styles = StyleSheet.create({})

Settings.navigationOptions = {
  title: "Settings",
}

export default Settings
