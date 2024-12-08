
"use client";

import { Dropdown } from "flowbite-react";

export function DropDown() {
  return (
    <Dropdown className="px-2 z-0" label="" dismissOnClick={false} renderTrigger={() => <span>...</span>}>
      <Dropdown.Item>Dashboard</Dropdown.Item>
      <Dropdown.Item>Settings</Dropdown.Item>
      <Dropdown.Item>Earnings</Dropdown.Item>
      <Dropdown.Item>Sign out</Dropdown.Item>
    </Dropdown>
  );
}
