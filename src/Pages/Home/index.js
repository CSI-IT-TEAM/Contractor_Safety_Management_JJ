import { Container, Stack } from "@mui/system";
import "./index.scss";
import React from "react";
import { Chart } from "react-google-charts";
import { Box, Grid, Paper, Typography } from "@mui/material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import GppGoodIcon from "@mui/icons-material/GppGood";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import peopleImage from "../../assets/images/contractor_tablet.jpg";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
const columns = [
  { type: "string", label: "Task ID" },
  { type: "string", label: "Task Name" },
  { type: "date", label: "Start Date" },
  { type: "date", label: "End Date" },
  { type: "number", label: "Duration" },
  { type: "number", label: "Percent Complete" },
  { type: "string", label: "Dependencies" },
];

const rows = [
  [
    "2014Spring",
    "Contractor 1",
    new Date(2014, 2, 22),
    new Date(2014, 5, 20),
    null,
    100,
    null,
  ],
  [
    "2014Summer",
    "Contractor 2",
    new Date(2014, 5, 21),
    new Date(2014, 8, 20),
    null,
    100,
    null,
  ],
  [
    "2014Autumn",
    "Contractor 3",
    new Date(2014, 8, 21),
    new Date(2014, 11, 20),
    null,
    100,
    null,
  ],
  [
    "2014Winter",
    "Contractor 4",
    new Date(2014, 11, 21),
    new Date(2015, 2, 21),
    null,
    100,
    null,
  ],
  [
    "2015Spring",
    "Contractor 5",
    new Date(2015, 2, 22),
    new Date(2015, 5, 20),
    null,
    50,
    null,
  ],
  [
    "2015Summer",
    "Contractor 5",
    new Date(2015, 5, 21),
    new Date(2015, 8, 20),
    null,
    0,
    null,
  ],
  [
    "2015Autumn",
    "Contractor 6",
    new Date(2015, 8, 21),
    new Date(2015, 11, 20),
    null,
    0,
    null,
  ],
  [
    "2015Winter",
    "Contractor 7",
    new Date(2015, 11, 21),
    new Date(2016, 2, 21),
    null,
    0,
    null,
  ],
  [
    "Football",
    "Contractor 8",
    new Date(2014, 8, 4),
    new Date(2015, 1, 1),
    null,
    100,
    null,
  ],
  [
    "Baseball",
    "Contractor 9",
    new Date(2015, 2, 31),
    new Date(2015, 9, 20),
    null,
    14,
    null,
  ],
  [
    "Basketball",
    "Contractor 10",
    new Date(2014, 9, 28),
    new Date(2015, 5, 20),
    null,
    86,
    null,
  ],
  [
    "Hockey",
    "Contractor 11",
    new Date(2014, 9, 8),
    new Date(2015, 5, 21),
    null,
    89,
    null,
  ],
];

export const data = [columns, ...rows];

export const options = {
  height: 600,
  gantt: {
    trackHeight: 40,
  },
  tooltip: { isHtml: true }, // CSS styling affects only HTML tooltips.
};
export default function HomeDashboard() {
  return (
    <Container
      maxWidth={false}
      sx={{
        marginTop: "15px",
        width: "100%",
        display: "flex",
      }}
    >
      <Stack
        sx={{
          width: "100%",
        }}
        direction={"column"}
        className="s-dashboard"
      >
        <Box sx={{ position: "relative" }}>
          <Typography variant="h5" className="s-title">
            Contractors Working Dashboard (Under Construction)
          </Typography>
        </Box>

        <Grid
          container
          rowGap={3}
          sx={{
            marginTop: "10px",
          }}
        >
          <Grid item xs={12} md={12} lg={12}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={12} lg={12}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    color: "purple",
                  }}
                >
                  10 Contractor and 100 people total
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "1.0rem",
                    color: "navy",
                  }}
                >Incoming on today </Typography>
              </Grid>

              <Grid item xs={12} md={12} lg={6}>
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: "20px",
                    padding: 1,
                  }}
                >
                  <img
                    style={{
                      borderRadius: "20px",
                      width: "100%",
                      height: "100%",
                    }}
                    src={peopleImage}
                    alt="people"
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
                <Grid container spacing={1} rowGap={0.5}>
                  <Grid item xs={12} md={6} lg={6}>
                    <Paper
                      elevation={3}
                      sx={{
                        background: "#7da0fa",
                        borderRadius: "20px",
                      }}
                    >
                      <Box
                        sx={{
                          padding: 3,
                        }}
                      >
                        <Stack>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            spacing={0.5}
                          >
                            <HowToRegIcon
                              sx={{
                                fontSize: "3rem",
                                color: "white",
                              }}
                            />
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: "1.5rem",
                                color: "white",
                              }}
                            >
                              Employees Request
                            </Typography>
                          </Stack>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            justifyContent={"flex-end"}
                          >
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "2rem",
                                color: "white",
                              }}
                            >
                              100 People
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <Paper
                      elevation={3}
                      sx={{
                        background: "#4747a1",
                        borderRadius: "20px",
                      }}
                    >
                      <Box
                        sx={{
                          padding: 3,
                        }}
                      >
                        <Stack>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            spacing={0.5}
                          >
                            <GppGoodIcon
                              sx={{
                                fontSize: "3rem",
                                color: "white",
                              }}
                            />
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: "1.5rem",
                                color: "white",
                              }}
                            >
                              Security Passed
                            </Typography>
                          </Stack>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            justifyContent={"flex-end"}
                          >
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "2rem",
                                color: "white",
                              }}
                            >
                              100 People
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <Paper
                      elevation={3}
                      sx={{
                        background: "#7978e9",
                        borderRadius: "20px",
                      }}
                    >
                      <Box
                        sx={{
                          padding: 3,
                        }}
                      >
                        <Stack>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            spacing={0.5}
                          >
                            <GppMaybeIcon
                              sx={{
                                fontSize: "3rem",
                                color: "white",
                              }}
                            />
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: "1.5rem",
                                color: "white",
                              }}
                            >
                              Security Failed
                            </Typography>
                          </Stack>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            justifyContent={"flex-end"}
                          >
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "2rem",
                                color: "white",
                              }}
                            >
                              100 People
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <Paper
                      elevation={3}
                      sx={{
                        background: "#f3797e",
                        borderRadius: "20px",
                      }}
                    >
                      <Box
                        sx={{
                          padding: 3,
                        }}
                      >
                        <Stack>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            spacing={0.5}
                          >
                            <PersonRemoveIcon
                              sx={{
                                fontSize: "3rem",
                                color: "white",
                              }}
                            />
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: "1.5rem",
                                color: "white",
                              }}
                            >
                              Absent
                            </Typography>
                          </Stack>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            justifyContent={"flex-end"}
                          >
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "2rem",
                                color: "white",
                              }}
                            >
                              100 People
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12}>
                    
                      <Box
                        sx={{
                          padding: 3,
                        }}
                      >
                        <Stack>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            spacing={0.5}
                          >
                            <CheckCircleIcon
                              sx={{
                                fontSize: "3rem",
                                color:"green",
                              }}
                            />
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: "1.5rem",
                              }}
                            >
                              Workshop Inspection
                            </Typography>
                          </Stack>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            justifyContent={"center"}
                          >
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "2rem",
                              }}
                            >
                              5/10 (50%)
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "1.5rem",
                color: "navy",
              }}
            >
              Contractor Job Scheduling
            </Typography>
            <Chart
              chartType="Gantt"
              width="100%"
              height="50%"
              data={data}
              options={options}
            />
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
