import SelectionTable from "./components/SelectionTable";
import makeData from "./components/makeData";
import React from "react";

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Country",
        accessor: "country",
        id: "country",
        numeric: false,
        disablePadding: false,
        disableFilters: true,
      },
      {
        Header: "Code",
        accessor: "code",
        id: "code",
        numeric: false,
        disablePadding: false,
        disableFilters: true,
      },
      {
        Header: "Currency",
        accessor: "currency",
        id: "currency",
        numeric: false,
        disablePadding: false,
        disableFilters: true,
      },
    ],
    []
  );
  const data = React.useMemo(() => makeData(6, 4, 3, 2, 1), []);
  return (
    <>
      <SelectionTable columns={columns} data={data} />
    </>
  );
}

export default App;
