import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CustomTextInput } from "./CustomTextInput";
import days from "dayjs";

export const CustomDateTimePicker = ({ onDateTimeChange }) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    onDateTimeChange(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateTimeWrapper}>
        <CustomTextInput
          label="Date"
          onTouch={showDatepicker}
          placeholder="Please select date"
          value={days(date).format("YYYY-MM-DD")}
          style={{ width: "48%" }}
        />
        <CustomTextInput
          label="Time"
          onTouch={showTimepicker}
          placeholder="Please select time"
          value={days(date).format("h:mm A")}
          style={{ width: "48%" }}
        />
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode as "date" | "time"}
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateTimeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
