import dayjs from "dayjs";

export function joinValuesOrPlaceholder(
  values: (string | null | undefined)[],
  placeholder = "-",
) {
  const joinedString = values.join(" ").trim();
  if (joinedString === "" || joinedString === " ") {
    return placeholder;
  }
  return joinedString;
}

export function computeAge(dateOfBirth: Date) {
  return dayjs().diff(dayjs(dateOfBirth), "years");
}
