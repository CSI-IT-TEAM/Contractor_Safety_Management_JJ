import {
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ItemInspecCheckTable from "./ItemInspecCheckTable";
import { fetchData } from "../functions";
import { ItemInsListSelectURL } from "../api";
import { UploadItemInsListSelectParams } from "../data/uploadParams";
import EmptyCard from "./Card/EmptyCard";
export default function ItemCheckTable({ data }) {
  const [ItemData, setItemData] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setisLoading] = useState(false);
  const [ClickRowZenID, setClickRowZenID] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  ////// Transldate
  const { t } = useTranslation();
  const people_col = [
    {
      id: "EMP_NAME",
      label: t("title_employee_name"),
      minWidth: 200,
      fontweight: 600,
      align: "left",
      type: "text",
      hBackgroundColor: "navy",
      hColor: "white",
    },
    {
      id: "EMP_CITIZEN_ID",
      label: t("title_employee_citizen_id"),
      minWidth: 80,
      fontweight: 400,
      align: "center",
      type: "text",
      hBackgroundColor: "navy",
      hColor: "white",
    },
    {
      id: "POS_NAME",
      label: t("title_employee_position"),
      minWidth: 80,
      fontweight: 400,
      align: "center",
      type: "text",
      hBackgroundColor: "navy",
      hColor: "white",
    },
    {
      id: "INS_1_DT",
      label: t("frm_status"),
      minWidth: 80,
      fontweight: 400,
      align: "center",
      type: "text",
      hBackgroundColor: "navy",
      hColor: "white",
    },
  ];

  const item_ins_col = [
    {
      id: "DIV_NAME",
      label: t("title_division_name"),
      minWidth: 200,
      fontweight: 600,
      align: "left",
      type: "text",
    },
    {
      id: "ITEM_NAME",
      label: t("title_item_name_id"),
      minWidth: 80,
      fontweight: 400,
      align: "center",
      type: "text",
    },
    {
      id: "ITEM_RESULT",
      label: t("title_inspection_result"),
      minWidth: 80,
      fontweight: 400,
      align: "center",
      type: "text",
    },
    {
      id: "ITEM_COMMENT",
      label: t("title_item_comment"),
      minWidth: 80,
      fontweight: 400,
      align: "center",
      type: "text",
    },
  ];

  const handleRowClick = (item) => {
    setisLoading(true);
    setClickRowZenID(item.EMP_CITIZEN_ID);
    var ParamData = {
      TYPE: "Q",
      WORK_DATE: item.WORK_DATE,
      REQ_NO: item.REQ_NO,
      EMP_CITIZEN_ID: item.EMP_CITIZEN_ID,
    };
    fetchData(ItemInsListSelectURL, UploadItemInsListSelectParams(ParamData))
      .then((result) => {
        setisLoading(false);
        setItemData(result);
      })
      .catch(() => setisLoading(false));
  };

  useEffect(() => {
    // setisLoading(true);
    if (data.length > 0) {
      setClickRowZenID(data[0].EMP_CITIZEN_ID);
      handleRowClick(data[0]);
      //setisLoading(false);
    }
  }, [data]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={4} lg={4}>
       
          <TableContainer
            sx={{ maxHeight: "70%", borderRadius: "10px" }}
            component={Paper}
            elevation={9}
          >
            <Table size="small" stickyHeader aria-label="sticky table">
              <TableHead sx={{ minHeight: "300px" }}>
                <TableRow>
                  {people_col.map((column) => (
                    <TableCell
                      key={column.id}
                      align={"center"}
                      style={{
                        minWidth: column.minWidth,
                        backgroundColor: column.hBackgroundColor
                          ? column.hBackgroundColor
                          : "#1976d2",
                        color: "#ffffff",
                        fontSize: "1rem",
                        fontWeight: 500,
                        borderRight: "1px solid",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <React.Fragment>
                        <TableRow
                          onClick={() => handleRowClick(row)}
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.CONT_CODE}
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              color: "#424ecf !important",
                              backgroundColor: "#ffffb3 !important",
                            },
                            // "&$selected, &$selected:hover": {
                            //   backgroundColor: "purple",
                            // },
                            backgroundColor:
                              row.EMP_CITIZEN_ID === ClickRowZenID
                                ? "#ffffb3"
                                : "white",
                          }}
                          //   onClick={() => HandleItemClick(row)}
                        >
                          {people_col.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                sx={{
                                  fontSize: "1rem",
                                  fontWeight: column.fontweight,
                                  borderRight: "0.3px solid silver",
                                }}
                              >
                                {column.id === "POS_NAME" ? t(value) : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
      </Grid>
      <Grid item xs={12} md={8} lg={8}>
        {/* {isLoading ? (
          <Placeholder.Grid columns={3} rows={21} />
        ) :  */}
        {ItemData.length > 0 ? (
          // <motion.div
          //   initial={{ opacity: 0, y: -20 }}
          //   animate={{ opacity: 1, y: 0 }}
          //   transition={{
          //     duration: 1,
          //     type: "spring",
          //   }}
          // >
            <ItemInspecCheckTable data={ItemData} />
          // </motion.div>
        ) : (
          <EmptyCard />
        )}
      </Grid>
    </Grid>
  );
}
