describe("Grading operations", () => {
  before(function() {
    cy.task("db:drop");

    cy.fixture("course.json").then((course) => {
      this.course = course;
    });

    cy.fixture("auth.json").then((auth) => {
      this.auth = auth;
    });

    cy.fixture("assingment.json").then((assingment) => {
      this.assingment = assingment;
    });

    cy.signUpAsInstructor();
    cy.signUpAsStudent();

    cy.loginAsInstructor();
    cy.createCourse();
    cy.addStudentToCourse();

    cy.createAssingment();
  });

  beforeEach(function() {
    cy.fixture("course.json").then((course) => {
      this.course = course;
    });

    cy.fixture("auth.json").then((auth) => {
      this.auth = auth;
    });

    cy.fixture("assingment.json").then((assingment) => {
      this.assingment = assingment;
    });
  });
});