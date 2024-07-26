import { Select, Tag } from "@arco-design/web-react";
import React from "react";
import { createFieldFactory } from "./factory";
import type { FieldDetailComponent, FieldEditComponent } from "./types";
import { useViewTypeContext } from "../../context/viewtype";

export type SelectFieldOptionValueType = any; // string | number;

export interface SelectFieldOptionItem {
  value: SelectFieldOptionValueType;

  label?: string;

  disabled?: boolean;

  /**
   * Use in detail mode
   */
  color?: string;
  /**
   * Use in detail mode
   */
  icon?: string;
}

export interface SelectFieldOptions {
  items: SelectFieldOptionItem[];
}

export const SelectFieldDetail: FieldDetailComponent<
  SelectFieldOptionValueType,
  SelectFieldOptions
> = React.memo((props) => {
  const items = props.options.items ?? [];

  const selectedOption = items.find((item) => item.value === props.value);

  if (selectedOption) {
    return (
      <Tag color={selectedOption.color} icon={selectedOption.icon}>
        {selectedOption.label ?? selectedOption.value}
      </Tag>
    );
  } else {
    return <Tag>{props.value}</Tag>;
  }
});
SelectFieldDetail.displayName = "SelectFieldDetail";

export const SelectFieldEdit: FieldEditComponent<
  SelectFieldOptionValueType,
  SelectFieldOptions
> = React.memo((props) => {
  const items = props.options.items ?? [];
  const viewType = useViewTypeContext();
  const disabled =
    (viewType === "create"
      ? props.options.create?.disabled
      : props.options.edit?.disabled) ?? false;

  return (
    <Select
      placeholder={props.options.edit?.placeholder ?? props.options.label}
      value={props.value}
      disabled={disabled}
      onChange={(val) => props.onChange(val)}
    >
      {items.map((item) => (
        <Select.Option key={item.value} value={item.value} disabled={item?.disabled ?? false}>
          {item.label ?? item.value}
        </Select.Option>
      ))}
    </Select>
  );
});
SelectFieldEdit.displayName = "SelectFieldEdit";

/**
 * @example
 * createSelectField('Class', {
 *   items: [
 *     {
 *       value: 'A',
 *       label: 'Class A',
 *       color: 'red',
 *     },
 *     {
 *       value: 'B',
 *       label: 'Class B',
 *       color: 'green',
 *     },
 *   ],
 * }),
 */
export const createSelectField = createFieldFactory<SelectFieldOptions>({
  detail: SelectFieldDetail,
  edit: SelectFieldEdit,
});
