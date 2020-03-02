import {StyleSheet} from "react-native"

const styles = StyleSheet.create({
  filters: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  filterIcon: {
    fontSize: 20,
    color: "rgba(0, 0, 0, 0.9)",
  },
  headerRow: {
    paddingTop: 7.5,
    paddingRight: 10,
    paddingBottom: 7.5,
    marginTop: -1,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
    paddingLeft: 10,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  row: {
    paddingTop: 7.5,
    paddingRight: 10,
    paddingBottom: 7.5,
    paddingLeft: 10,
    marginLeft: 0,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  date: {color: "rgba(0, 0, 0, 0.9)", fontSize: 15},
  totalContainer: {flex: 1},
  total: {color: "rgba(0, 0, 0, 0.9)", fontStyle: "italic", fontSize: 15},
  catView: {flex: 2},
  catBadge: {borderRadius: 5, justifyContent: "center", height: 20},
  cat: {fontSize: 12, paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0},
  desc: {color: "rgba(0, 0, 0, 0.9)", flex: 3, fontSize: 14, paddingLeft: 5},
  amount: {
    flex: 1,
    textAlign: "right",
    color: "rgba(0, 0, 0, 0.25)",
    fontStyle: "italic",
    paddingLeft: 5,
    fontSize: 14,
  },
})

export default styles
