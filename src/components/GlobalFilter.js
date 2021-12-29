import { InputBase } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useAsyncDebounce } from "react-table";
import SearchIcon from "@material-ui/icons/Search";

const useStyles1 = makeStyles((theme) => ({
  search: {
    position: "relative",
    border: "1px solid black",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "",
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "black",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "15ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

function GlobalFilter({ globalFilter, setGlobalFilter }) {
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);
  const classes = useStyles1();

  return (
    <React.Fragment>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder={`Search...`}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ "aria-label": "search" }}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          value={value || ""}
        />
      </div>
    </React.Fragment>
  );
}

export default React.memo(GlobalFilter);
