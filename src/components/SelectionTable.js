// src/components/filter.table.js
import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { useTable, useGlobalFilter, useSortBy, useExpanded } from "react-table";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { TableFooter } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import ArrowDropDownOutlinedIcon from "@material-ui/icons/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@material-ui/icons/ArrowDropUpOutlined";
import RemoveIcon from "@material-ui/icons/Remove";
import TablePagination from "@material-ui/core/TablePagination";
import Checkbox from "@material-ui/core/Checkbox";
import { Button } from "@material-ui/core";
import ViewListIcon from "@material-ui/icons/ViewList";
import GlobalFilter from "./GlobalFilter";
import ClonedTable from "./ClonedTable";
import DeleteIcon from "@material-ui/icons/Delete";
import TablePaginationActions from "./TablePagination";

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
  box: {
    position: "relative",
    padding: 80,
    margin: 10,
  },
  topleft: {
    position: "absolute",
    top: 8,
    left: 16,
  },
  body: {
    margin: 150,
    backgroundColor: "lightgrey",
  },
  topnav: {
    overflow: "hidden",
    backgroundColor: "Grey",
    paddingLeft: 20,
  },
  topright: {
    position: "absolute",
    top: 16,
    right: 100,
  },
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    // backgroundColor: "lightgrey",
    fontSize: 16,
    color: "darkblack",
    fontWeight: "800",
  },
  body: {
    fontSize: 14,
    fontWeight: "600",
    color: "lightdark",
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const Row = (props) => {
  const { row, isItemSelected, labelId, handleClick } = props;

  return (
    <React.Fragment>
      <StyledTableRow
        {...row.getRowProps()}
        // hover
        role="checkbox"
        aria-checked={isItemSelected}
        // tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
      >
        {row.cells.map((cell) => {
          // console.log(cell);
          if (cell.column.id === "expander") {
            return (
              <TableCell
                {...cell.getCellProps()}
                padding="none"
                style={{ paddingLeft: `${row.depth * 2}rem` }}
                key={cell.column.id}
                align="left"
              >
                <Checkbox
                  checked={isItemSelected}
                  inputProps={{ "aria-labelledby": labelId }}
                  onClick={() => handleClick(row.id)}
                />
                {cell.render("Cell")}
              </TableCell>
            );
          }
          if (cell.column.id === "country") {
            return (
              <StyledTableCell
                align="left"
                component="th"
                id={labelId}
                scope="row"
                padding="normal"
                key={cell.column.id}
                // style={{ paddingLeft: `${row.depth * 1}rem` }}
                {...cell.getCellProps()}
              >
                {cell.render("Cell")}
              </StyledTableCell>
            );
          } else {
            return (
              <StyledTableCell {...cell.getCellProps()}>
                {cell.render("Cell")}
              </StyledTableCell>
            );
          }
        })}
      </StyledTableRow>
    </React.Fragment>
  );
};

const SelectionTable = ({ columns, data }) => {
  const classes = useStyles();
  const [selected, setSelected] = React.useState([]);
  const [clonedRows, setClonedRows] = React.useState([]);
  const [clonedData, setClonedData] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const selectionColumns = useMemo(() => {
    return [
      {
        // Build our expander column
        id: "expander", // Make sure it has an ID
        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
          <IconButton
            aria-label="expand all"
            size="small"
            padding="none"
            {...getToggleAllRowsExpandedProps({
              style: {
                // We can even use the row.depth property
                // and paddingLeft to indicate the depth
                // of the row
                color: "black",
              },
            })}
          >
            {isAllRowsExpanded ? (
              <ArrowDropUpOutlinedIcon />
            ) : (
              <ArrowDropDownOutlinedIcon />
            )}
          </IconButton>
        ),
        Cell: ({ row }) =>
          // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
          // to build the toggle for expanding a row
          row.canExpand ? (
            <IconButton
              aria-label="expand row"
              size="small"
              padding="none"
              {...row.getToggleRowExpandedProps({
                style: {
                  // We can even use the row.depth property
                  // and paddingLeft to indicate the depth
                  // of the row
                  // paddingLeft: `${row.depth * 2}rem`,
                  color: "green",
                },
              })}
            >
              {row.isExpanded ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          ) : (
            <IconButton
              aria-label="last"
              size="medium"
              style={{ color: "darkgreen" }}
            >
              <RemoveIcon />
            </IconButton>
          ),
        disableGlobalFilter: true,
        disableFilters: true,
      },
    ].concat(columns);
  }, [columns]);

  const editedCol = useMemo(() => {
    const clonedColumn = [
      {
        id: "select",
        disableGlobalFilter: true,
        disableFilters: true,
      },
      {
        Header: "Delete",
        id: "delete",
        numeric: false,
        disablePadding: false,
        disableFilters: true,
        Cell: ({row}) => (
          <IconButton
            aria-label="delete row"
            size="medium"
            style={{ color: "darkgreen" }}
            onClick={() => {
              clonedData.splice(row.index, 1);
              setClonedData([...clonedData]);
            }}
          >
            <DeleteIcon />
          </IconButton>
        ),
      },
    ];
    const editCol = [];
    return editCol.concat(
      clonedColumn.slice(0, 1),
      columns,
      clonedColumn.slice(1)
    );
  }, [columns, clonedData]);

  // console.log(data);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    state,
    globalFilter,
    setGlobalFilter,
  } = useTable(
    {
      columns: selectionColumns,
      data,
      manualPagination: true,
      autoResetGlobalFilter: false,
      initialState: { data: data },
    },
    useGlobalFilter,
    useSortBy,
    useExpanded
  );

  const handleSelectAllClick = (event) => {
    // console.log(rows);
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      setClonedRows(rows);
      return;
    }
    setSelected([]);
    setClonedRows([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    let newClonedRows = [];
    if (selectedIndex === -1) {
      const clonedRowsId = [];
      newSelected = [...selected];
      newClonedRows = [...clonedRows];
      for (let index = 0; index < id.length; index += 2) {
        clonedRowsId.push(id.substr(0, id.length - index));
      }
      clonedRowsId.forEach((row_id) => {
        if (newSelected.indexOf(row_id) === -1) {
          newSelected = newSelected.concat(row_id);
          newClonedRows = newClonedRows.concat(
            rows.filter((row) => row.id === row_id)
          );
        }
      });
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newClonedRows = newClonedRows.concat(
        clonedRows.filter((row) => row.id !== id)
      );
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newClonedRows = newClonedRows.concat(
        clonedRows.filter((row) => row.id !== id)
      );
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
      newClonedRows = newClonedRows.concat(
        clonedRows.filter((row) => row.id !== id)
      );
    }
    setSelected(newSelected);
    setClonedRows(newClonedRows);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const sentToClone = useCallback(() => {
    setClonedData(
      clonedRows.map((row) => {
        return {
          country: row.original.country,
          code: row.original.code,
          currency: row.original.currency,
        };
      })
    );
  }, [clonedRows]);

  console.log(selected, clonedRows, clonedData, rows, state);
  return (
    <React.Fragment>
      <div className={classes.body}>
        <div className={classes.topnav}>
          <h1 style={{ float: "left" }}>Org Structure</h1>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ViewListIcon />}
            size="medium"
            style={{ float: "right", margin: 18 }}
            onClick={sentToClone}
          >
            Add to Clone
          </Button>
        </div>
        <div className={classes.box}>
          <div className={classes.topleft}>
            <GlobalFilter
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </div>
          <TableContainer component={Paper}>
            <Table className={classes.table} {...getTableProps()}>
              <TableHead>
                {headerGroups.map((headerGroup) => (
                  <TableRow {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => {
                      // console.log(column);
                      if (column.id === "expander") {
                        return (
                          <TableCell
                            key={column.id}
                            padding="none"
                            // style={{ width: "12rem" }}
                            align="left"
                          >
                            <Checkbox
                              indeterminate={
                                selected.length > 0 &&
                                selected.length < rows.length
                              }
                              checked={
                                rows.length > 0 &&
                                selected.length === rows.length
                              }
                              onChange={handleSelectAllClick}
                              inputProps={{
                                "aria-label": "select all organizations",
                              }}
                            />
                            {column.render("Header")}
                          </TableCell>
                        );
                      }
                      return (
                        <StyledTableCell
                          key={column.id}
                          // style={{ width: "100rem" }}
                          align={column.numeric ? "center" : "left"}
                          padding={column.disablePadding ? "none" : "normal"}
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>{" "}
                        </StyledTableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody {...getTableBodyProps()}>
                {(rowsPerPage > 0
                  ? rows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : rows
                ).map((row, index) => {
                  prepareRow(row);
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  // console.log(row);
                  return (
                    <Row
                      key={row.id}
                      row={row}
                      isItemSelected={isItemSelected}
                      labelId={labelId}
                      handleClick={handleClick}
                    />
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={5}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: { "aria-label": "rows per page" },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </div>
      </div>
      <div className={classes.body}>
        <div className={classes.topnav}>
          <h1 style={{ float: "left" }}>Added to Clone</h1>
        </div>
        <div className={classes.box}>
          <ClonedTable data={clonedData} columns={editedCol} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default React.memo(SelectionTable);
