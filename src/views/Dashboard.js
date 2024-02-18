import React from "react";
import { Line, Pie } from "react-chartjs-2";
import MyGraph from "./MyGrpah";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
import csvNoDup from '../data/csvNoDup.json'
import CoursePlanAheadGraph from './CoursePlanAheadGraph'
import InstructorPopularityGraph from './InstructorPopularityGraph'; 

function Dashboard() {
  return (
    <>
      <div className="content">
      <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Instructor Popularity</CardTitle>
              </CardHeader>
              <CardBody>
              <InstructorPopularityGraph data={csvNoDup} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Course/Professor PlanAhead Data</CardTitle>
              </CardHeader>
              <CardBody>
              <CoursePlanAheadGraph data={csvNoDup} />
              </CardBody>
            </Card>
          </Col>
        </Row>

         <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Course Enrollment Data</CardTitle>
              </CardHeader>
              <CardBody>
                <MyGraph />
              </CardBody>
            </Card>
          </Col>
        </Row>

      </div>
    </>
  );
}

export default Dashboard;
