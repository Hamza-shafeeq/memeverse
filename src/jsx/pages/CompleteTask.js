import React, { useContext, useEffect } from "react";
import { Container, Nav, Row } from "react-bootstrap";
import { ThemeContext } from "../../context/ThemeContext";

import SingleTask from "../components/tasks/SingleTask";
import SingleReward from "../components/tasks/SingleReward";

const CompleteTask = () => {
  const { changeBackground } = useContext(ThemeContext);
  useEffect(() => {
    changeBackground({ value: "dark", label: "Dark" });
  }, []);

  const tasksData = [
    {
      amount: 20,
      currency: "usd",
      heading: "verify your identity to get 20 USD token voucher",
      leftDays: 3,
      leftHours: 22,
      leftMinutes: 12,
      countOne: "",
      countTwo: "",
    },
    {
      amount: 10,
      currency: "eth",
      heading: "deposit 10 USD to get 10 USD 0% interest voucher",
      leftDays: 5,
      leftHours: 11,
      leftMinutes: 40,
      countOne: 0,
      countTwo: 10,
    },
    {
      amount: 20,
      currency: "usd",
      heading: "deposit 20 USD to get 20 USD 0% interest voucher",
      leftDays: 6,
      leftHours: 18,
      leftMinutes: 18,
      countOne: 0,
      countTwo: 20,
    },
    {
      amount: 30,
      currency: "eur",
      heading: "deposit 30 USD to get 30 USD 0% interest voucher",
      leftDays: 8,
      leftHours: 14,
      leftMinutes: 49,
      countOne: 0,
      countTwo: 30,
    },
  ];

  return (
    <>
      {/* ---| Show tasks here |--- */}
      <div
        className="mb-5 p-4"
        style={{ background: "#25164F", borderRadius: "1.25rem" }}
      >
        <div className="row">
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4 className="heading">Complete Tasks</h4>
            <Nav className="order nav nav-tabs">
              <Nav.Link as="button" eventKey="Order" type="button">
                More
              </Nav.Link>
            </Nav>
          </div>
        </div>

        {/* ---| if there is no available task then show this |--- */}
        <div className="row my-2">
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="dataTables_info">
              Unfortunately, No tasks are available
            </div>
          </div>
        </div>

        {/* ---| if there is no available task then show this |--- */}
        <div className="row my-2">
          <Container>
            <Row>
              {tasksData.map((item, index) => (
                <SingleTask taskData={item} />
              ))}
            </Row>
          </Container>
        </div>
      </div>

      {/* ---| Show rewards here |--- */}
      <div
        className="mb-5 p-4"
        style={{ background: "#25164F", borderRadius: "1.25rem" }}
      >
        <div className="row">
          <h4 className="heading text-capitalize">bigger rewards</h4>
        </div>
        {/* ---| if there is no available reward then show this |--- */}
        <div className="row my-2">
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="dataTables_info">
              Unfortunately, There are no available rewads now
            </div>
          </div>
        </div>
        {/* ---| if there are available rewards then show this |--- */}
        <SingleReward />
      </div>
    </>
  );
};
export default CompleteTask;
