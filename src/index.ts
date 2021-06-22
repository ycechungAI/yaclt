import moment from "moment";
import { BuildCli } from "./cli";

moment.suppressDeprecationWarnings = true;

BuildCli().parse();
