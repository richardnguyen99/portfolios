import * as React from "react";
import clsx from "classnames";
import { LogoGithubIcon } from "@primer/octicons-react";

import ItemHolder from "./ItemHolder";
import Clock from "./Clock";
import Logo from "./Logo";
import ThemeToggler from "./ThemeToggler";

const MenuBar: React.FC = () => {
  return (
    <div
      id="menu-bar"
      className={clsx(
        "relative",
        "flex items-center justify-between",
        "bg-gray-950 text-gray-100",
        "font-bold",
        "h-10 px-4",
        "select-none",
      )}
    >
      <div className="flex items-center">
        <Logo />
        <ItemHolder onClick={() => {}}>
          <span>File</span>
        </ItemHolder>
        <ItemHolder onClick={() => {}}>
          <span>File</span>
        </ItemHolder>
      </div>
      <div className="flex items-center">
        <ItemHolder onClick={() => {}}>
          <a
            href="https://github.com/richardnguyen99/portfolios"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center my-1 justify-center"
          >
            <LogoGithubIcon aria-label="Octicon GitHub Logo" />
          </a>
        </ItemHolder>
        <ThemeToggler />
        <ItemHolder onClick={() => {}}>
          <Clock />
        </ItemHolder>
      </div>
    </div>
  );
};

export default MenuBar;
