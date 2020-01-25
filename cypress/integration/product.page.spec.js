context( 'Product Page', () => {
    beforeEach( () => {
        cy.visit( Cypress.config().baseUrl + '/themes/neve' )
    } )
    afterEach(() => { cy.wait(1500) })
    it( 'Free download modal - from page header', () => {
        cy.get( '.buynow-btn.download' ).click()
        cy.get( '.popup' ).should( 'be.visible' ).as( 'popup' )
        cy.get( '#download-email' )
            .type( 'fake@email.com' )
            .should( 'have.value', 'fake@email.com' )
        cy.get( '@popup' ).find( '#close-popup' ).click()
        cy.get( '@popup' ).should( 'not.be.visible' )
    } )

    it( 'Free download modal - from top nav', () => {
        cy.scrollTo( 0, 800 )
        cy.get( '.secondary-navigation-wrapper' )
            .should( 'be.visible' )
            .as( 'topNav' )
        cy.get( '@topNav' ).find( '.download' ).click()
        cy.get( '.popup' ).should( 'be.visible' ).as( 'popup' )
        cy.get( '#download-email' )
            .type( 'fake@email.com' )
            .should( 'have.value', 'fake@email.com' )
        cy.get( '@popup' ).find( '#close-popup' ).click()
        cy.get( '@popup' ).should( 'not.be.visible' )
    } )

    it( 'Scrolls to pricing - from page header', () => {
        cy.contains( 'SEE PLANS' ).should( 'be.visible' ).click()
        cy.hash().should( 'eq', '#pricing' )
    } )

    it( 'Opens pricing modal', () => {
        cy.get( '.plugin-princing-box' )
            .should( 'have.length', 3 )
            .as( 'pricingBoxes' )

        cy.get( '@pricingBoxes' )
            .first().as( 'pricingBox' );

        cy.get( '@pricingBox' )
            .find( '.buynow-btn.yearly' )
            .as( 'button' )

        cy.get( '@button' ).scrollIntoView( { duration: 1, offset: { top: -200, left: 0 } } )

        cy.server()
        cy.route( 'POST', 'https://themeisle.onfastspring.com/popup-themeisle/builder/finalize' ).as( 'fsFinalize' )
        cy.wait( 2200 )
        cy.get( '@button' ).click()

        cy.wait( '@fsFinalize' ).then( ( req ) => {
            expect( req.status ).to.equal( 200 )
            cy.get( '#fsc-popup-frame' ).as( 'fsModal' ).should( 'be.visible' )
        } );
    } )
} )
