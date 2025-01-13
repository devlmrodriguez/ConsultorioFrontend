import { Badge } from "@mantine/core";
import {
  leadStateContactedValue,
  leadStateInterestedValue,
  leadStateNewValue,
  leadStateNotInterestedValue,
} from "../../models/common/lead-state";

interface LeadStateBadgeProps {
  leadState: string;
}

export function LeadStateBadge(props: LeadStateBadgeProps) {
  return (
    <>
      {props.leadState === leadStateNewValue ? (
        <Badge color="blue">{props.leadState}</Badge>
      ) : props.leadState === leadStateContactedValue ? (
        <Badge color="cyan">{props.leadState}</Badge>
      ) : props.leadState === leadStateInterestedValue ? (
        <Badge color="green">{props.leadState}</Badge>
      ) : props.leadState === leadStateNotInterestedValue ? (
        <Badge color="red">{props.leadState}</Badge>
      ) : (
        <Badge color="gray">{props.leadState}</Badge>
      )}
    </>
  );
}
