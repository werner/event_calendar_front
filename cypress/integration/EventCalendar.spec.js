describe('My First Test', function() {
  it('successfully loads', function() {
    cy.server({
        method: 'GET',
        delay: 1000,
        status: 200,
        response: [{
            id: 1,
            description: 'Party',
            start_date: '2020-01-01',
            end_date: '2020-01-05'
        }]
    })

    cy.route('/events')
    cy.visit('http://localhost:8080')
    cy.get('[data-cy=calendar-cy]').find('.v-btn__content').first().parent('button').click()
  })
})