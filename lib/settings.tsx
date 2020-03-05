import React, {useState} from "react"
import RN, {ActivityIndicator, StyleSheet} from "react-native"
import {Button, Container, Content, Form, Input, Item, Text} from "native-base"
import {NavigationStackScreenComponent} from "react-navigation-stack"

import useAsync from "./async/context"
import useAuth from "./auth/context"
import {showToast} from "./toast"

const Settings: NavigationStackScreenComponent = () => {
  const {auth, ...$auth} = useAuth()
  const [isLoading, setLoading] = useAsync()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const isAnonymous = !auth.initialized || !auth.authenticated || auth.fsUser.type === "anonymous"

  function handleInputChange(handler: React.Dispatch<React.SetStateAction<string>>) {
    return (evt: RN.NativeSyntheticEvent<RN.TextInputChangeEventData>) => {
      handler(evt.nativeEvent.text || "")
    }
  }

  async function signIn() {
    setLoading(true)

    try {
      await $auth.signIn(email, password)
    } catch (err) {
      showToast(err.message, "danger")
    }

    setLoading(false)
  }

  async function signOut() {
    setLoading(true)

    try {
      await $auth.signOut()
      $auth.setAuth({initialized: true, authenticated: false})
    } catch (err) {
      showToast(err.message, "danger")
    }

    setLoading(false)
  }

  function getEmail() {
    if (auth.initialized && auth.authenticated) {
      return auth.fbUser.email
    }

    return null
  }

  return (
    <Container>
      <Content padder keyboardShouldPersistTaps="handled">
        {isAnonymous ? (
          <>
            <Text style={styles.connectHelp}>
              Please connect to synchronize your expenses with all your devices:
            </Text>
            <Form>
              <Item>
                <Input
                  autoCompleteType="email"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  placeholder="Email"
                  placeholderTextColor="#b0b0b0"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  style={styles.input}
                />
              </Item>
              <Item>
                <Input
                  autoCompleteType="password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Password"
                  placeholderTextColor="#b0b0b0"
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  style={styles.input}
                />
              </Item>
              <Button full onPress={signIn} style={styles.signInEmailBtn}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#ffffff" />
                ) : (
                  <Text>Sign in</Text>
                )}
              </Button>
            </Form>
          </>
        ) : (
          <>
            <Text>You are identified with:</Text>
            <Text style={styles.email}>{getEmail()}</Text>
            <Button light full onPress={signOut} disabled={isLoading} style={styles.signInEmailBtn}>
              {isLoading ? <ActivityIndicator color="#000000" /> : <Text>Sign out</Text>}
            </Button>
          </>
        )}
      </Content>
    </Container>
  )
}

const styles = StyleSheet.create({
  connectHelp: {
    marginBottom: 15,
  },
  signInEmailBtn: {
    marginTop: 30,
  },
  signInGoogleBtn: {
    marginTop: 5,
  },
  input: {
    fontSize: 15,
    paddingLeft: 0,
  },
  email: {
    fontStyle: "italic",
    color: "rgba(0, 0, 0, .5)",
  },
})

Settings.navigationOptions = {
  title: "Settings",
}

export default Settings
