import * as React from "react";
import { render } from "react-dom";

import { Game } from "./components/Game";

const rootElement = document.getElementById("root");
render(<Game />, rootElement);
