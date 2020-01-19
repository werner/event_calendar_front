describe('Event Calendar', function () {

  it('sets the calendar as the current day', function () {
    cy.visit('http://localhost:8080')
    cy.get('[data-cy=today-cy]').click()

    const now = new Date()
    const month = Intl.DateTimeFormat("en-US", { month: "long" }).format(now)
    const year = now.getFullYear()
    const day = now.getDay()
    title = `${month} ${year}`
    cy.get('[data-cy=title-cy]').should('have.text', title)
    cy
      .get('[data-cy=calendar-cy]')
      .find('.v-calendar-weekly__day-label')
      .find('.v-btn__content')
      .should('contain', day)
  })

  it('successfully loads events', function () {
    cy.server({
      method: 'GET',
      delay: 1000,
      status: 200,
      response: [{
        id: 1,
        description: 'Party',
        start_date: '2020-01-01',
        end_date: '2020-01-05'
      },
      {
        id: 2,
        description: 'Holyday',
        start_date: '2020-01-10',
        end_date: '2020-01-10'
      }]
    })

    cy.route('/events')
    cy.visit('http://localhost:8080')
    cy
      .get('[data-cy=calendar-cy]')
      .find('.v-event')
      .should('contain', 'Party')
      .and('contain', 'Holyday')
  })

  it('successfully creates an event', function () {
    cy.server()

    cy.route({
      url: '**/events',
      method: 'POST',
      delay: 500,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=utf-8'
      },
      response: {}
    }).as('postEvent')
    cy.visit('http://localhost:8080')
    cy.get('[data-cy=new-event-cy]').click()
    cy.get('[data-cy=name-calendar-cy]').type('Doctor Appointment')
    cy.get('[data-cy=start-calendar-cy]').type('2010-01-13')
    cy.get('[data-cy=end-calendar-cy]').type('2010-01-13')
    cy.get('[data-cy=submit-event-cy]').click()
    cy.wait('@postEvent').should('have.property', 'status', 200)
  })
})