describe("Assignment operations", () => {
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

  it("Should create an assignment as an instructor.", function() {
    cy.loginAsInstructor();

    cy.url().should("include", "/dashboard");

    cy.createCourse();
    cy.addStudentToCourse();

    cy.get("[src=\"/./public/assignment.svg\"]").click();

    cy.url().should("include", "/assignments");

    cy.findByText("Add Assignment").click();

    cy.url().should("include", "/assignments/new");

    cy.get("[placeholder=\"Assignment Name\"]").type(this.assignment.title);
    cy.get("[placeholder=\"Assignment Description\"]").type(this.assignment.description);
    cy.get("[placeholder=\"Assignment Due Date\"]").type(this.assignment.dueDate);
    cy.get("[placeholder=\"Max Points\"]").type(this.assignment.maxPoints);
    cy.get("input[type=\"file\"]").attachFile({
      filePath: "testfile.txt",
      mimeType: "text/plain",
    });

    cy.findByText("Create Assignment").click();

    cy.url().should("include", "/assignments");

    cy.findByText(this.assignment.title).should("exist");
  });

  it("Should see the assignment as a student", function() {
    cy.loginAsStudent();

    cy.url().should("include", "/dashboard");

    cy.findByText(this.course.name).click();

    cy.url().should("include", "/course");

    cy.findByText("Assignments").click();

    cy.url().should("include", "/assignments");

    cy.findByText(this.assignment.title).should("exist");

    cy.findByText(this.assignment.title).click();

    cy.url().should("include", "/assignment/");

    cy.findByText(this.assignment.description).should("exist");
  });

  it("Should submit an assignment as a student", function() {
    cy.loginAsStudent();

    cy.url().should("include", "/dashboard");

    cy.findByText(this.course.name).click();

    cy.url().should("include", "/course");

    cy.findByText("Assignments").click();

    cy.url().should("include", "/assignments");

    cy.findByText(this.assignment.title).should("exist");

    cy.findByText(this.assignment.title).click();

    cy.url().should("include", "/assignment/");

    cy.get("input[type=\"file\"]").attachFile({
      filePath: "testfile.txt",
      mimeType: "text/plain",
    });

    cy.findByText("Submit").click();

    cy.url().should("include", "/assignment/");
  });
});