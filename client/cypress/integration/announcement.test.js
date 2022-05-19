describe("Announcement operations", () => {
  before(function() {
    cy.fixture("course.json").then((course) => {
      this.course = course;
    });

    cy.fixture("auth.json").then((auth) => {
      this.auth = auth;
    });

    cy.fixture("announcement.json").then((announcement) => {
      this.announcement = announcement;
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

    cy.fixture("announcement.json").then((announcement) => {
      this.announcement = announcement;
    });
  });

  it("Should create an announcement as an instructor.", function() {
    cy.loginAsInstructor();

    cy.url().should("include", "/dashboard");
  
    cy.createCourse();
    cy.addStudentToCourse();

    cy.get("[src=\"/./public/announcement.svg\"]").click();

    cy.url().should("include", "/announcements");

    cy.findByText("Add Announcement").click();

    cy.url().should("include", "/announcements/new");

    cy.get("[placeholder=\"Announcement Title\"]").type(this.announcement.title);
    cy.get("[placeholder=\"Announcement Content\"]").type(this.announcement.content);

    cy.findByText("Publish Announcement").click();

    cy.url().should("include", "/announcements");
  });

  it("Should not create an announcement as a student.", function() {
    cy.loginAsStudent();

    cy.url().should("include", "/dashboard");

    cy.get("[src=\"/./public/announcement.svg\"]").click();

    cy.url().should("include", "/announcements");

    cy.findByText("Add Announcement").should("not.exist");
  });

  it("Should be able to see an announcement as a student.", function() {
    cy.loginAsStudent();

    cy.url().should("include", "/dashboard");

    cy.get("[src=\"/./public/announcement.svg\"]").click();

    cy.url().should("include", "/announcement");

    cy.findByText(this.announcement.title).click();

    cy.url().should("include", "/announcement");

    cy.findByText(this.announcement.title).should("exist");
    cy.findByText(this.announcement.content).should("exist");
  });
});