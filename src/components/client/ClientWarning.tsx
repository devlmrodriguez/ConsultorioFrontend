import { Avatar, Indicator, Tooltip } from "@mantine/core";
import { WarningType } from "../../models/common/warning-type";

export interface ClientWarningProps {
  warningType: WarningType | null | undefined;
  warning?: string | null;
}

export function ClientAvatarWithWarning(props: ClientWarningProps) {
  if (!props.warningType) {
    return <Avatar size={30} radius={30} />;
  }

  return (
    <Tooltip label={props.warning}>
      <Indicator
        color={
          props.warningType === "Baja"
            ? "cyan"
            : props.warningType === "Media"
              ? "yellow"
              : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                props.warningType === "Alta"
                ? "red"
                : "cyan"
        }
      >
        <Avatar size={30} radius={30} />
      </Indicator>
    </Tooltip>
  );
}
