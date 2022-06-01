describe("Grading operations", () => {
  before(function() {
    cy.task("db:drop");

    cy.fixture("course.json").then((course) => {
      this.course = course;
    });

    cy.fixture("auth.json").then((auth) => {
      this.auth = auth;
    });

    cy.fixture("assignment.json").then((assignment) => {
      this.assignment = assignment;
    });

    cy.signUpAsInstructor();
    cy.signUpAsStudent();

    cy.loginAsInstructor();
    cy.createCourse();
    cy.addStudentToCourse();
    cy.createAssignment();

    cy.loginAsStudent();
    cy.submitAssignment();
  });

  beforeEach(function() {
    cy.fixture("course.json").then((course) => {
      this.course = course;
    });

    cy.fixture("auth.json").then((auth) => {
      this.auth = auth;
    });

    cy.fixture("assignment.json").then((assignment) => {
      this.assignment = assignment;
    });
  });

  it("Should be able to grade a student.", function() {
    cy.loginAsInstructor();

    cy.url().should("include", "/dashboard");

    cy.findByText("Test Course").click();
    cy.url().should("include", "/course");

    cy.findByText("Assignments").click();
    cy.url().should("include", "/assignments");

    cy.findByText("Test Assignment").click();
    cy.url().should("include", "/assignment");

    cy.findByText("Grade").click();
    cy.url().should("include", "/grade");

    cy.get("[placeholder=\"Grade\"]").type(this.assignment.submission.points);

    cy.findByText("Submit Grades").click();
  });

  it("Should be able to see assignment grades in the gradebook.", function() {
    cy.loginAsStudent();

    cy.url().should("include", "/dashboard");

    cy.findByText("Test Course").click();
    cy.url().should("include", "/course");

    cy.findByText("Grades").click();
    cy.url().should("include", "/grades");

    cy.findByText("Test Assignment").should("exist");
    cy.findByText(`${this.assignment.submission.points} / ${this.assignment.maxPoints}`).should("exist");

    cy.get("details").click();

    cy.findByText(`Max: ${this.assignment.submission.points}`).should("exist");
    cy.findByText(`Min: ${this.assignment.submission.points}`).should("exist");
    cy.findByText(`Average: ${this.assignment.submission.points}`).should("exist");
  });
});