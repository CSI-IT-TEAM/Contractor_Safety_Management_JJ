import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import ExtensionOffIcon from "@mui/icons-material/ExtensionOff";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import { AnimatePresence, motion } from "framer-motion";
import { useAnimate, usePresence, useInView } from "framer-motion";
export default function ItemInspecCheckTable({ data }) {
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();
  const [page, setPage] = useState(0);
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

  const item_ins_col = [
    {
      id: "DIV_NAME",
      label: t("title_division_name"),
      minWidth: 200,
      fontweight: 600,
      align: "left",
      type: "text",
      hBackgroundColor: "navy",
      hColor: "white",
    },
    {
      id: "ITEM_NAME",
      label: t("title_item_name"),
      minWidth: 80,
      fontweight: 400,
      align: "left",
      type: "text",
      hBackgroundColor: "navy",
      hColor: "white",
    },
    {
      id: "ITEM_RESULT",
      label: t("title_inspection_result"),
      minWidth: 50,
      fontweight: 400,
      align: "center",
      type: "text",
      hBackgroundColor: "navy",
      hColor: "white",
    },
    {
      id: "ITEM_COMMENT",
      label: t("title_item_comment"),
      minWidth: 80,
      fontweight: 400,
      align: "left",
      type: "text",
      hBackgroundColor: "navy",
      hColor: "white",
    },
  ];

  return (
    <>
      {data ? (
        <>
          <TableContainer
            sx={{ maxHeight: "830px", borderRadius: "10px" }}
            component={Paper}
            elevation={9}
          >
            <Table size="small" stickyHeader aria-label="sticky table">
              <TableHead sx={{ minHeight: "100px" }}>
                <TableRow>
                  {item_ins_col.map((column) => (
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
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <AnimatePresence>
                        <React.Fragment>
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.ITEM_CODE}
                            sx={{
                              "&:focus": {
                                color: "#424ecf !important",
                                backgroundColor: "#ffffb3 !important",
                              },
                              // "&$selected, &$selected:hover": {
                              //   backgroundColor: "purple",
                              // },
                            }}
                            //   onClick={() => HandleItemClick(row)}
                          >
                            {item_ins_col.map((column) => {
                              const value = row[column.id];
                              return column.id === "DIV_NAME" &&
                                row["DIV_NAME_HAS"] === "Y" ? (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  rowSpan={row["DIV_NAME_ROW_SPAN"]}
                                  sx={{
                                    fontSize: "1rem",
                                    fontWeight: column.fontweight,
                                    borderRight: "0.3px solid silver",
                                  }}
                                >
                                  {t(value)}
                                </TableCell>
                              ) : (
                                column.id !== "DIV_NAME" && (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                    sx={{
                                      fontSize: "1rem",
                                      fontWeight: column.fontweight,
                                      borderRight: "0.3px solid silver",
                                    }}
                                  >
                                    {column.id === "ITEM_RESULT" ? (
                                      value === "OK" ? (
                                        <motion.div
                                          initial={{ opacity: 0, y: -10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{
                                            duration: 1,
                                            type: "spring",
                                          }}
                                        >
                                          <CheckCircleIcon
                                            sx={{
                                              fontSize: "1.2rem",
                                              color: "green",
                                            }}
                                          />
                                        </motion.div>
                                      ) : value === "NOK" ? (
                                        <motion.div
                                          initial={{ opacity: 0, y: -10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{
                                            duration: 1,
                                            type: "spring",
                                          }}
                                        >
                                          <DoNotDisturbAltIcon
                                            sx={{
                                              fontSize: "1.2rem",
                                              color: "red",
                                            }}
                                          />
                                        </motion.div>
                                      ) : value === "NA" ? (
                                        <motion.div
                                          initial={{ opacity: 0, y: -10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{
                                            duration: 1,
                                            type: "spring",
                                          }}
                                        >
                                          <ExtensionOffIcon
                                            sx={{
                                              fontSize: "1.2rem",
                                              color: "silver",
                                            }}
                                          />
                                        </motion.div>
                                      ) : (
                                        <motion.div
                                          initial={{ opacity: 0, y: -10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{
                                            duration: 1,
                                            type: "spring",
                                          }}
                                        >
                                          <HourglassTopIcon
                                            sx={{
                                              fontSize: "1.2rem",
                                              color: "silver",
                                            }}
                                          />
                                        </motion.div>
                                      )
                                    ) : (
                                      t(value)
                                    )}
                                  </TableCell>
                                )
                              );
                            })}
                          </TableRow>
                        </React.Fragment>
                      </AnimatePresence>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </>
      ) : (
        <Typography>NO Data</Typography>
      )}
    </>
  );
}
