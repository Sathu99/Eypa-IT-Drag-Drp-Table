// src/components/filter.table.js
import React from "react";
import PropTypes from "prop-types";
import { useTable, useSortBy } from "react-table";
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
import TablePagination from "@material-ui/core/TablePagination";
import Checkbox from "@material-ui/core/Checkbox";
import TablePaginationActions from "./TablePagination";

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
  box: {
    position: "relative",
    padding: 100,
    margin: 100,
  },
  topleft: {
    position: "absolute",
    top: 8,
    left: 16,
  },
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
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
        hover
        onClick={(event) => handleClick(event, row.id)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
      >
        {row.cells.map((cell) => {
          //   console.log(cell);
          if (cell.column.id === "select") {
            return (
              <TableCell
                padding="checkbox"
                style={{ paddingLeft: `${row.depth * 2}rem` }}
                key={cell.column.id}
              >
                <Checkbox
                  checked={isItemSelected}
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </TableCell>
            );
          }
          if (cell.column.Header === "country") {
            return (
              <StyledTableCell
                component="th"
                id={labelId}
                scope="row"
                padding="none"
                key={cell.column.id}
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

function ClonedTable({ columns, data }) {
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable(
      {
        columns: columns,
        data: data,
      },
      useSortBy
    );
  const classes = useStyles();
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    // console.log(id);
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log(data, rows);
  return (
    <React.Fragment>
      <TableContainer component={Paper}>
        <Table className={classes.table} {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  //   console.log(column);
                  if (column.id === "select") {
                    return (
                      <TableCell key={column.id} padding="checkbox">
                        <Checkbox
                          indeterminate={
                            selected.length > 0 && selected.length < rows.length
                          }
                          checked={
                            rows.length > 0 && selected.length === rows.length
                          }
                          onChange={handleSelectAllClick}
                          inputProps={{
                            "aria-label": "select all organizations",
                          }}
                        />
                      </TableCell>
                    );
                  }
                  return (
                    <StyledTableCell
                      key={column.id}
                      style={{ width: 100 }}
                      align={column.numeric ? "center" : "left"}
                      padding={column.disablePadding ? "none" : "normal"}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
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
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row, index) => {
              prepareRow(row);
              const isItemSelected = isSelected(row.id);
              const labelId = `enhanced-table-checkbox-${index}`;
              console.log(row);
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
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={4}
                count={data.length}
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
    </React.Fragment>
  );
}

export default React.memo(ClonedTable);
