import React, {FC} from "react"
import {ScrollView, RefreshControl} from "react-native"
import noop from "lodash/fp/noop"

import useAsync from "./context"

type ScrollViewWithLoaderProps = {
  onRefresh?: () => void
}

const ScrollViewWithLoader: FC<ScrollViewWithLoaderProps> = props => {
  const refresh = props.onRefresh || noop
  const [isLoading, setLoading] = useAsync()
  const refreshControl = <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />

  function handleRefresh() {
    setLoading(true)
    refresh()
    setLoading(false)
  }

  return <ScrollView refreshControl={refreshControl}>{props.children}</ScrollView>
}

export default ScrollViewWithLoader
