import React, {FC} from "react"
import {Container, Header, Left, Body, Right, Button, Icon, Title} from "native-base"

const ExpenseEdit: FC = () => {
  return (
    <Container>
      <Header>
        <Left>
          <Button transparent>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Edit</Title>
        </Body>
        <Right>
          <Button transparent>
            <Icon name="menu" />
          </Button>
        </Right>
      </Header>
    </Container>
  )
}

export default ExpenseEdit
