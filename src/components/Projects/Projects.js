import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import leaf from "../../Assets/Projects/leaf.png";
import emotion from "../../Assets/Projects/emotion.png";
import editor from "../../Assets/Projects/codeEditor.png";
import fisho from "../../Assets/photo1714546066-modified.png";
import suicide from "../../Assets/Projects/suicide.png";
import bitsOfCode from "../../Assets/Projects/blog.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          Our Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects we've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={fisho}
              isBlog={false}
              title="Fisho"
              description="A powerful protocol for selling a meme coin called 'Fisho'. All the methods and functionalities are on chain and provies a 100% secured platform for users"
              ghLink="https://github.com/soumyajit4419/Chatify"
              demoLink="/Home"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
