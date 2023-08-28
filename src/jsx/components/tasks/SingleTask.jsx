import React from "react";
import { Button, Col } from "react-bootstrap";

const SingleTask = ({ taskData }) => {
  return (
    <>
      <Col xs={12} md={6}>
        <div
          className="mb-4 p-4"
          style={{
            width: "100%",
            background: "#15073a",
            borderRadius: "1.25rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 15,
          }}
        >
          <div style={{ width: "25%" }}>
            <h6 className="heading text-center">{taskData.amount}</h6>
            <p className="text-white text-center text-uppercase">
              {taskData.currency}
            </p>
          </div>
          <div style={{ width: "75%" }}>
            <h6 className="heading text-capitalize">{taskData.heading}</h6>
            <div
              className="my-3"
              style={{
                width: "85%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <div>
                  <span
                    style={{
                      color: "white",
                      fontWeight: "semibold",
                      fontSize: "16px",
                    }}
                  >
                    {taskData.leftDays}
                  </span>
                </div>
                <div>Days</div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <div>
                  <span
                    style={{
                      color: "white",
                      fontWeight: "semibold",
                      fontSize: "16px",
                    }}
                  >
                    {taskData.leftHours}
                  </span>
                </div>
                <div>Hours</div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <div>
                  <span
                    style={{
                      color: "white",
                      fontWeight: "semibold",
                      fontSize: "16px",
                    }}
                  >
                    {taskData.leftMinutes}
                  </span>
                </div>
                <div>Min</div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 15,
              }}
            >
              <div>
                <Button className="px-5 text-capitalize">do task</Button>
              </div>
              {taskData.countOne !== "" ? (
                <div>
                  <span className="text-capitalize">
                    <>{taskData.countOne}</>/<>{taskData.countTwo}</>
                    &nbsp;USD
                  </span>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

export default SingleTask;
