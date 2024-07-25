import { Input } from "@arco-design/web-react";
import React from "react";
import { normalizeText } from "../../utils/common";
import { createFieldFactory } from "./factory";
import type { FieldDetailComponent, FieldEditComponent } from "./types";
import { useViewTypeContext } from "../../context/viewtype";

export const TextFieldDetail: FieldDetailComponent<string> = React.memo(
  (props) => {
    return <span>{normalizeText(props.value)}</span>;
  }
);
TextFieldDetail.displayName = "TextFieldDetail";

export const TextFieldEdit: FieldEditComponent<string> = React.memo((props) => {
  const viewType = useViewTypeContext();
  const disabled =
    (viewType === "create"
      ? props.options.create?.disabled
      : props.options.edit?.disabled) ?? false;

  return (
    <Input
      placeholder={props.options.edit?.placeholder ?? props.options.label}
      disabled={disabled}
      value={normalizeText(props.value)}
      onChange={(val) => props.onChange(val)}
    />
  );
});
TextFieldEdit.displayName = "TextFieldEdit";

export const createTextField = createFieldFactory({
  detail: TextFieldDetail,
  edit: TextFieldEdit,
});
